import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { 
  Users, 
  Tv, 
  Radio, 
  Play, 
  Pause, 
  Settings, 
  BarChart3, 
  MessageSquare, 
  Heart, 
  Eye, 
  Upload,
  Download,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  Bell,
  Globe,
  Smartphone,
  Activity,
  TrendingUp,
  Calendar,
  Clock,
  FileText
} from 'lucide-react';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  activeViewers: number;
  activeListeners: number;
  totalUsers: number;
  totalReactions: number;
  totalComments: number;
  peakViewers: number;
  streamUptime: number;
  storageUsed: number;
}

interface StreamSettings {
  tvStreamUrl: string;
  radioStreamUrl: string;
  streamStatus: 'live' | 'offline';
  commentsEnabled: boolean;
  reactionsEnabled: boolean;
  radioAutoplay: boolean;
  maintenanceMode: boolean;
  siteName: string;
  primaryColor: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [streamSettings, setStreamSettings] = useState<StreamSettings>({
    tvStreamUrl: 'https://mediaserver.oromatv.com/LiveApp/streams/12345.m3u8',
    radioStreamUrl: 'https://hoth.alonhosting.com:3975/stream',
    streamStatus: 'live',
    commentsEnabled: true,
    reactionsEnabled: true,
    radioAutoplay: true,
    maintenanceMode: false,
    siteName: 'Oroma TV & QFM Radio',
    primaryColor: '#dc2626'
  });
  const { toast } = useToast();

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/stats'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch users
  const { data: users } = useQuery({
    queryKey: ['/api/admin/users']
  });

  // Fetch analytics data
  const { data: analytics } = useQuery({
    queryKey: ['/api/admin/analytics']
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<StreamSettings>) => {
      const res = await apiRequest('PUT', '/api/admin/settings', settings);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Settings updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
    },
    onError: () => {
      toast({ title: 'Failed to update settings', variant: 'destructive' });
    }
  });

  const handleSettingsUpdate = (key: keyof StreamSettings, value: any) => {
    const newSettings = { ...streamSettings, [key]: value };
    setStreamSettings(newSettings);
    updateSettingsMutation.mutate({ [key]: value });
  };

  // Mock data for demonstration (replace with real API data)
  const mockStats: DashboardStats = {
    activeViewers: 1247,
    activeListeners: 892,
    totalUsers: 15420,
    totalReactions: 8934,
    totalComments: 2156,
    peakViewers: 2890,
    streamUptime: 98.5,
    storageUsed: 67.3
  };

  const chartData = [
    { name: 'Mon', viewers: 400, listeners: 240 },
    { name: 'Tue', viewers: 300, listeners: 139 },
    { name: 'Wed', viewers: 200, listeners: 980 },
    { name: 'Thu', viewers: 278, listeners: 390 },
    { name: 'Fri', viewers: 189, listeners: 480 },
    { name: 'Sat', viewers: 239, listeners: 380 },
    { name: 'Sun', viewers: 349, listeners: 430 },
  ];

  const engagementData = [
    { name: 'Comments', value: 45, color: '#ef4444' },
    { name: 'Reactions', value: 35, color: '#f97316' },
    { name: 'Shares', value: 20, color: '#eab308' }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="fluid-container section-padding">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your TV & Radio streaming platform</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={streamSettings.streamStatus === 'live' ? 'default' : 'secondary'} className="bg-red-600">
              <Activity className="h-3 w-3 mr-1" />
              {streamSettings.streamStatus === 'live' ? 'LIVE' : 'OFFLINE'}
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
            <TabsTrigger value="overview" className="flex items-center space-x-1">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="streams" className="flex items-center space-x-1">
              <Tv className="h-4 w-4" />
              <span className="hidden sm:inline">Streams</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Viewers</p>
                      <p className="text-2xl font-bold text-red-600">{mockStats.activeViewers}</p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-full">
                      <Eye className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Radio Listeners</p>
                      <p className="text-2xl font-bold text-green-600">{mockStats.activeListeners}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <Radio className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-blue-600">{mockStats.totalUsers}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Engagement</p>
                      <p className="text-2xl font-bold text-purple-600">{mockStats.totalReactions}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Heart className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Audience Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="viewers" stroke="#dc2626" strokeWidth={2} />
                      <Line type="monotone" dataKey="listeners" stroke="#16a34a" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={engagementData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {engagementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Tv className="h-4 w-4 mr-2" />
                    Manage TV Stream
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Radio className="h-4 w-4 mr-2" />
                    Manage Radio Stream
                  </Button>
                  <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Moderate Comments
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stream Management Tab */}
          <TabsContent value="streams" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tv className="h-5 w-5 mr-2 text-red-600" />
                    TV Stream Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="tv-url">Stream URL</Label>
                    <Input
                      id="tv-url"
                      value={streamSettings.tvStreamUrl}
                      onChange={(e) => handleSettingsUpdate('tvStreamUrl', e.target.value)}
                      placeholder="Enter HLS/RTMP stream URL"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tv-status">Stream Status</Label>
                    <Switch
                      id="tv-status"
                      checked={streamSettings.streamStatus === 'live'}
                      onCheckedChange={(checked) => 
                        handleSettingsUpdate('streamStatus', checked ? 'live' : 'offline')
                      }
                    />
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Update TV Stream
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Radio className="h-5 w-5 mr-2 text-green-600" />
                    Radio Stream Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="radio-url">Stream URL</Label>
                    <Input
                      id="radio-url"
                      value={streamSettings.radioStreamUrl}
                      onChange={(e) => handleSettingsUpdate('radioStreamUrl', e.target.value)}
                      placeholder="Enter radio stream URL"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="radio-autoplay">Auto-play</Label>
                    <Switch
                      id="radio-autoplay"
                      checked={streamSettings.radioAutoplay}
                      onCheckedChange={(checked) => 
                        handleSettingsUpdate('radioAutoplay', checked)
                      }
                    />
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Update Radio Stream
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Stream Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Live Stream Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600 mb-2">{mockStats.activeViewers}</div>
                    <div className="text-sm text-gray-600">Current TV Viewers</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">{mockStats.activeListeners}</div>
                    <div className="text-sm text-gray-600">Current Radio Listeners</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{mockStats.streamUptime}%</div>
                    <div className="text-sm text-gray-600">Stream Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input
                      id="site-name"
                      value={streamSettings.siteName}
                      onChange={(e) => handleSettingsUpdate('siteName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <Input
                      id="primary-color"
                      type="color"
                      value={streamSettings.primaryColor}
                      onChange={(e) => handleSettingsUpdate('primaryColor', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Feature Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="comments">Live Comments</Label>
                    <Switch
                      id="comments"
                      checked={streamSettings.commentsEnabled}
                      onCheckedChange={(checked) => 
                        handleSettingsUpdate('commentsEnabled', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reactions">Live Reactions</Label>
                    <Switch
                      id="reactions"
                      checked={streamSettings.reactionsEnabled}
                      onCheckedChange={(checked) => 
                        handleSettingsUpdate('reactionsEnabled', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance">Maintenance Mode</Label>
                    <Switch
                      id="maintenance"
                      checked={streamSettings.maintenanceMode}
                      onCheckedChange={(checked) => 
                        handleSettingsUpdate('maintenanceMode', checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
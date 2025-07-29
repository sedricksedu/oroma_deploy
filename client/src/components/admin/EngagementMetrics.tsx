import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Heart, 
  MessageCircle, 
  Music, 
  TrendingUp, 
  Users, 
  Clock,
  Tv,
  Radio,
  Activity,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface EngagementMetrics {
  totalViewers: number;
  totalListeners: number;
  peakViewers: number;
  peakListeners: number;
  avgSessionTime: number;
  totalReactions: number;
  totalComments: number;
  totalSongRequests: number;
  topReactions: Array<{ emoji: string; count: number }>;
  hourlyViewers: Array<{ hour: string; tv: number; radio: number }>;
  engagementRate: number;
  activeUsers: number;
  bounceRate: number;
}

interface ContentMetrics {
  newsViews: number;
  programViews: number;
  eventRSVPs: number;
  popularContent: Array<{ title: string; views: number; type: string }>;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

export default function EngagementMetrics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch real-time engagement metrics
  const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useQuery<EngagementMetrics>({
    queryKey: ['/api/admin/engagement-metrics', refreshKey],
    queryFn: async () => {
      const response = await fetch('/api/admin/engagement-metrics');
      if (!response.ok) throw new Error('Failed to fetch engagement metrics');
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch content performance metrics
  const { data: contentMetrics, isLoading: contentLoading, refetch: refetchContent } = useQuery<ContentMetrics>({
    queryKey: ['/api/admin/content-metrics', refreshKey],
    queryFn: async () => {
      const response = await fetch('/api/admin/content-metrics');
      if (!response.ok) throw new Error('Failed to fetch content metrics');
      return response.json();
    },
    refetchInterval: 60000, // Refresh every minute
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetchMetrics();
    refetchContent();
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (metricsLoading || contentLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Engagement Metrics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Real-Time Engagement Metrics</h2>
          <p className="text-gray-600 mt-1">Monitor audience engagement and content performance</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Viewers</p>
                <p className="text-3xl font-bold text-red-600">{metrics?.activeUsers || 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Peak: {metrics?.peakViewers || 0}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Eye className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Interactions</p>
                <p className="text-3xl font-bold text-blue-600">
                  {((metrics?.totalReactions || 0) + (metrics?.totalComments || 0) + (metrics?.totalSongRequests || 0))}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Rate: {metrics?.engagementRate || 0}%
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Session Time</p>
                <p className="text-3xl font-bold text-green-600">
                  {formatTime(metrics?.avgSessionTime || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Bounce: {metrics?.bounceRate || 0}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Content Views</p>
                <p className="text-3xl font-bold text-purple-600">
                  {formatNumber((contentMetrics?.newsViews || 0) + (contentMetrics?.programViews || 0))}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Events: {contentMetrics?.eventRSVPs || 0} RSVPs
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hourly Viewers Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Hourly Audience Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={metrics?.hourlyViewers || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="tv"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                      name="TV Viewers"
                    />
                    <Area
                      type="monotone"
                      dataKey="radio"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      name="Radio Listeners"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Reactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Popular Reactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics?.topReactions?.map((reaction, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{reaction.emoji}</span>
                        <span className="font-medium">Reaction {index + 1}</span>
                      </div>
                      <Badge variant="secondary">{reaction.count}</Badge>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-8">No reactions yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* TV vs Radio Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>TV vs Radio Audience</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'TV Viewers', value: metrics?.totalViewers || 0, color: '#ef4444' },
                        { name: 'Radio Listeners', value: metrics?.totalListeners || 0, color: '#3b82f6' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'TV Viewers', value: metrics?.totalViewers || 0, color: '#ef4444' },
                        { name: 'Radio Listeners', value: metrics?.totalListeners || 0, color: '#3b82f6' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Audience Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Audience Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Tv className="h-5 w-5 text-red-600" />
                      <span className="font-medium">TV Oroma</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">{metrics?.totalViewers || 0}</p>
                      <p className="text-xs text-gray-600">Total Viewers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Radio className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">QFM Radio</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{metrics?.totalListeners || 0}</p>
                      <p className="text-xs text-gray-600">Total Listeners</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">Active Now</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-600">{metrics?.activeUsers || 0}</p>
                      <p className="text-xs text-gray-600">Live Users</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Engagement Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Live Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-600">{metrics?.totalComments || 0}</p>
                  <p className="text-gray-600 mt-2">Total Comments</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Reactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold text-red-600">{metrics?.totalReactions || 0}</p>
                  <p className="text-gray-600 mt-2">Total Reactions</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Song Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-600">{metrics?.totalSongRequests || 0}</p>
                  <p className="text-gray-600 mt-2">Total Requests</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { name: 'News', views: contentMetrics?.newsViews || 0 },
                      { name: 'Programs', views: contentMetrics?.programViews || 0 },
                      { name: 'Events', views: contentMetrics?.eventRSVPs || 0 }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Popular Content */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contentMetrics?.popularContent?.map((content, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{content.title}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {content.type}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">{content.views}</p>
                        <p className="text-xs text-gray-600">views</p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-8">No content data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
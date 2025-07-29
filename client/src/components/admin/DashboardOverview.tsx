import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Program, News, Event } from "@shared/schema";
import { 
  Video, 
  FileText, 
  Calendar, 
  Users, 
  TrendingUp, 
  Eye,
  MessageSquare,
  Clock,
  Activity
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

export function DashboardOverview() {
  const { data: programs = [] } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });

  const { data: news = [] } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  // Fetch real-time viewer counts
  const { data: tvViewers = 0 } = useQuery({
    queryKey: ['/api/active-users/count/tv'],
    queryFn: async () => {
      const response = await fetch('/api/active-users/count/tv');
      if (!response.ok) throw new Error('Failed to fetch TV viewer count');
      const data = await response.json();
      return typeof data.count === 'number' ? data.count : 0;
    },
    refetchInterval: 10000,
  });

  const { data: radioListeners = 0 } = useQuery({
    queryKey: ['/api/active-users/count/radio'],
    queryFn: async () => {
      const response = await fetch('/api/active-users/count/radio');
      if (!response.ok) throw new Error('Failed to fetch radio listener count');
      const data = await response.json();
      return typeof data.count === 'number' ? data.count : 0;
    },
    refetchInterval: 10000,
  });

  const totalLiveViewers = tvViewers + radioListeners;

  // Fetch real analytics data
  const { data: analyticsData } = useQuery({
    queryKey: ['/api/analytics/overview'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/overview');
      if (!response.ok) return { totalViews: 0, dailyViews: 0, monthlyGrowth: 0, totalComments: 0, engagement: 0 };
      return response.json();
    },
    refetchInterval: 30000,
  });

  const { data: topShows } = useQuery({
    queryKey: ['/api/analytics/top-shows'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/top-shows');
      if (!response.ok) return [];
      return response.json();
    },
    refetchInterval: 30000,
  });

  // Use real data or show empty state
  const stats = analyticsData || { totalViews: 0, dailyViews: 0, monthlyGrowth: 0, totalComments: 0, engagement: 0 };
  const topPerformingShows = topShows || [];

  // Create viewership analytics bar chart data
  const viewershipData = [
    { 
      name: 'TV Viewers', 
      current: tvViewers,
      color: '#ef4444'
    },
    { 
      name: 'Radio Listeners', 
      current: radioListeners,
      color: '#3b82f6' 
    }
  ];

  // Pie chart data for performing shows - only if we have data
  const performingShowsData = topPerformingShows.length > 0 ? topPerformingShows.map((show, index) => ({
    name: show.name,
    value: show.views,
    fill: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'][index % 5]
  })) : [];

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
            <Video className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{programs.length}</div>
            <p className="text-xs text-muted-foreground">Active shows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">News Articles</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{news.length}</div>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Viewers</CardTitle>
            <Activity className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalLiveViewers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Currently watching</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Live Viewership Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalLiveViewers > 0 ? (
              <div className="space-y-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={viewershipData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="current" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{tvViewers}</div>
                    <div className="text-sm text-gray-600">TV Viewers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{radioListeners}</div>
                    <div className="text-sm text-gray-600">Radio Listeners</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No active viewers</p>
                <p className="text-sm">Analytics will appear when users start watching</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Top Performing Shows
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topPerformingShows.length > 0 ? (
              <div>
                <div className="h-80 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={performingShowsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {performingShowsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [value.toLocaleString(), 'Views']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {topPerformingShows.map((show, index) => (
                    <div key={show.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div>
                          <p className="font-medium text-sm">{show.name}</p>
                          <p className="text-xs text-gray-500">{show.views.toLocaleString()} views</p>
                        </div>
                      </div>
                      <Badge 
                        variant={show.growth > 0 ? "secondary" : "destructive"}
                        className={show.growth > 0 ? "bg-green-100 text-green-700" : ""}
                      >
                        {show.growth > 0 ? '+' : ''}{show.growth}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No show analytics yet</p>
                <p className="text-sm">Performance data will appear when shows are watched</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Video className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">New episode uploaded</p>
                <p className="text-xs text-gray-500">Northern Pulse - Episode 45</p>
              </div>
              <span className="text-xs text-gray-500">2 min ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <FileText className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">News article published</p>
                <p className="text-xs text-gray-500">Local elections coverage</p>
              </div>
              <span className="text-xs text-gray-500">15 min ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <MessageSquare className="h-4 w-4 text-purple-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">New comment awaiting moderation</p>
                <p className="text-xs text-gray-500">Youth Spotlight discussion</p>
              </div>
              <span className="text-xs text-gray-500">1 hour ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
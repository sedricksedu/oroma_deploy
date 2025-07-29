import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageSquare, Calendar, Users, TrendingUp } from "lucide-react";
import type { News, Event, Program } from "@shared/schema";

export function AdminStats() {
  const { data: news = [] } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: programs = [] } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });

  // Calculate stats
  const totalViews = news.reduce((sum, article) => sum + (article.views || 0), 0);
  const publishedArticles = news.filter(article => article.published).length;
  const upcomingEvents = events.filter(event => 
    event.date && new Date(event.date) > new Date()
  ).length;
  const livePrograms = programs.filter(program => program.isLive).length;

  const stats = [
    {
      title: "Total Articles",
      value: news.length,
      subtitle: `${publishedArticles} published`,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      subtitle: "Across all articles",
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Upcoming Events",
      value: upcomingEvents,
      subtitle: `${events.length} total events`,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Live Programs",
      value: livePrograms,
      subtitle: `${programs.length} total programs`,
      icon: TrendingUp,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Monitor your content and engagement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {news.slice(0, 5).map((article, index) => (
              <div key={article.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-sm">{article.title}</p>
                  <p className="text-xs text-gray-500">{article.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={article.published ? "default" : "outline"}>
                    {article.published ? "Published" : "Draft"}
                  </Badge>
                  <div className="flex items-center text-xs text-gray-500">
                    <Eye className="h-3 w-3 mr-1" />
                    {article.views || 0}
                  </div>
                </div>
              </div>
            ))}
            {news.length === 0 && (
              <p className="text-center text-gray-500 py-8">No articles yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
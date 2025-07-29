import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { Bell, MessageSquare, Users, Radio, Video, Calendar } from "lucide-react";

interface Notification {
  id: string;
  type: 'comment' | 'user' | 'song-request' | 'event-rsvp' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch real-time data for notifications
  const { data: newComments = [] } = useQuery({
    queryKey: ['/api/live-comments/tv'],
    queryFn: async () => {
      const response = await fetch('/api/live-comments/tv');
      if (!response.ok) return [];
      return await response.json();
    },
    refetchInterval: 10000,
  });

  const { data: songRequests = [] } = useQuery({
    queryKey: ['/api/song-requests'],
    queryFn: async () => {
      const response = await fetch('/api/song-requests');
      if (!response.ok) return [];
      return await response.json();
    },
    refetchInterval: 15000,
  });

  const { data: events = [] } = useQuery({
    queryKey: ['/api/events'],
    queryFn: async () => {
      const response = await fetch('/api/events');
      if (!response.ok) return [];
      return await response.json();
    },
    refetchInterval: 30000,
  });

  // Generate real-time notifications based on actual data
  const generateNotifications = (): Notification[] => {
    const realNotifications: Notification[] = [];
    
    // Recent comments (last 5)
    const recentComments = newComments.slice(-5);
    recentComments.forEach((comment: any, index: number) => {
      if (comment.content) {
        realNotifications.push({
          id: `comment-${comment.id || index}`,
          type: 'comment',
          title: 'New Live Comment',
          message: comment.content.substring(0, 50) + (comment.content.length > 50 ? '...' : ''),
          timestamp: new Date(comment.timestamp || Date.now()),
          read: false
        });
      }
    });

    // Recent song requests (last 3)
    const recentSongRequests = songRequests.slice(-3);
    recentSongRequests.forEach((request: any, index: number) => {
      if (request.songName) {
        realNotifications.push({
          id: `song-${request.id || index}`,
          type: 'song-request',
          title: 'New Song Request',
          message: `"${request.songName}" by ${request.artistName || 'Unknown Artist'}`,
          timestamp: new Date(request.createdAt || Date.now()),
          read: false
        });
      }
    });

    // Upcoming events (next 2)
    const upcomingEvents = events.slice(0, 2);
    upcomingEvents.forEach((event: any, index: number) => {
      if (event.title) {
        realNotifications.push({
          id: `event-${event.id || index}`,
          type: 'event-rsvp',
          title: 'Upcoming Event',
          message: `${event.title} - ${new Date(event.date).toLocaleDateString()}`,
          timestamp: new Date(event.date || Date.now()),
          read: false
        });
      }
    });

    // If no real data, show system status
    if (realNotifications.length === 0) {
      realNotifications.push({
        id: 'system-status',
        type: 'system',
        title: 'System Status',
        message: 'All systems operational. No new notifications.',
        timestamp: new Date(),
        read: false
      });
    }

    return realNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const currentNotifications = generateNotifications();
  const unreadCount = currentNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'user': return <Users className="h-4 w-4 text-green-500" />;
      case 'song-request': return <Radio className="h-4 w-4 text-purple-500" />;
      case 'event-rsvp': return <Calendar className="h-4 w-4 text-orange-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <p className="text-sm text-gray-500">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All notifications read'}
          </p>
        </div>
        <ScrollArea className="h-80">
          <div className="p-2">
            {currentNotifications.length > 0 ? (
              currentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                    notification.read 
                      ? 'bg-gray-50 hover:bg-gray-100' 
                      : 'bg-blue-50 hover:bg-blue-100 border-l-2 border-blue-500'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-sm text-gray-600 truncate">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications</p>
              </div>
            )}
          </div>
        </ScrollArea>
        {currentNotifications.length > 0 && (
          <div className="p-3 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full"
              onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
            >
              Mark all as read
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
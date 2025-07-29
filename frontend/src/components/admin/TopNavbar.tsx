import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Search, 
  Moon, 
  Sun, 
  LogOut,
  Eye,
  Activity
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/use-theme";
import { NotificationPanel } from "./NotificationPanel";
import { AdminUserProfile } from "./AdminUserProfile";
import { useQuery } from "@tanstack/react-query";

interface TopNavbarProps {
  onLogout: () => void;
}

export function TopNavbar({ onLogout }: TopNavbarProps) {
  const { theme, setTheme } = useTheme();
  
  // Fetch real-time viewer counts
  const { data: tvViewers = 0 } = useQuery({
    queryKey: ['/api/active-users/count/tv'],
    queryFn: async () => {
      const response = await fetch('/api/active-users/count/tv');
      if (!response.ok) return 0;
      const data = await response.json();
      return typeof data.count === 'number' ? data.count : 0;
    },
    refetchInterval: 5000,
  });

  const { data: radioListeners = 0 } = useQuery({
    queryKey: ['/api/active-users/count/radio'],
    queryFn: async () => {
      const response = await fetch('/api/active-users/count/radio');
      if (!response.ok) return 0;
      const data = await response.json();
      return typeof data.count === 'number' ? data.count : 0;
    },
    refetchInterval: 5000,
  });

  const totalViewers = tvViewers + radioListeners;

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-red-500" />
          <span className="text-sm font-medium">Live Viewers:</span>
          <Badge 
            variant={totalViewers > 0 ? "destructive" : "secondary"} 
            className={totalViewers > 0 ? "animate-pulse" : ""}
          >
            {totalViewers.toLocaleString()}
          </Badge>
          {totalViewers > 0 && (
            <span className="text-xs text-gray-500">
              ({tvViewers} TV, {radioListeners} Radio)
            </span>
          )}
        </div>
        
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search content, users, or analytics..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Quick Actions */}
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={() => window.open('/', '_blank')}
        >
          <Eye className="h-4 w-4" />
          View Site
        </Button>

        {/* Notifications */}
        <NotificationPanel />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Logout */}
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
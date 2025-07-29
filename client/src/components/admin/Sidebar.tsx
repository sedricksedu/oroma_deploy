import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  Home, 
  Video, 
  FileText, 
  Radio, 
  Palette, 
  BarChart3, 
  Users, 
  MessageSquare, 
  DollarSign, 
  Settings, 
  Shield,
  Menu,
  ChevronLeft,
  ChevronRight,
  Edit,
  Calendar,
  Scale,
  Mic,
  Presentation
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Fetch real-time viewer counts
  const { data: tvViewers = 0 } = useQuery({
    queryKey: ['/api/active-users/count/tv'],
    queryFn: async () => {
      const response = await fetch('/api/active-users/count/tv');
      if (!response.ok) return 0;
      const data = await response.json();
      return typeof data.count === 'number' ? data.count : 0;
    },
    refetchInterval: 10000,
  });

  const { data: radioListeners = 0 } = useQuery({
    queryKey: ['/api/active-users/count/radio'],
    queryFn: async () => {
      const response = await fetch('/api/active-users/count/radio');
      if (!response.ok) return 0;
      const data = await response.json();
      return typeof data.count === 'number' ? data.count : 0;
    },
    refetchInterval: 10000,
  });

  // Create dynamic menu items with real viewer counts
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: Home, color: "text-blue-600" },
    { id: "programs", label: "Programs", icon: Video, color: "text-green-600" },
    { id: "blog", label: "News Articles", icon: Edit, color: "text-red-600" },
    { id: "events", label: "Events", icon: Calendar, color: "text-purple-600" },
    { 
      id: "livestream", 
      label: "TV Stream", 
      icon: Video, 
      color: "text-red-500", 
      badge: tvViewers > 0 ? `${tvViewers}` : "0",
      badgeColor: tvViewers > 0 ? "destructive" as const : "secondary" as const
    },
    { 
      id: "radiostream", 
      label: "Radio Stream", 
      icon: Radio, 
      color: "text-green-500", 
      badge: radioListeners > 0 ? `${radioListeners}` : "0",
      badgeColor: radioListeners > 0 ? "destructive" as const : "secondary" as const
    },
    { id: "interview-requests", label: "Interview Requests", icon: Mic, color: "text-blue-600" },
    { id: "program-proposals", label: "Program Proposals", icon: Presentation, color: "text-green-600" },
    { id: "legal", label: "Legal Pages", icon: Scale, color: "text-gray-700" },
    { id: "homepage", label: "Homepage", icon: Palette, color: "text-orange-600" },
    { id: "analytics", label: "Analytics", icon: BarChart3, color: "text-indigo-600" },
    { id: "advertising", label: "Advertising", icon: DollarSign, color: "text-yellow-600" },
    { id: "settings", label: "Settings", icon: Settings, color: "text-gray-600" }
  ];

  const SidebarContent = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-white border-r ${mobile ? '' : 'w-64'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className={`flex items-center gap-3 ${collapsed && !mobile ? 'justify-center' : ''}`}>
          <img 
            src="/oromatv-logo.png" 
            alt="Oroma TV Logo" 
            className="w-8 h-8 object-contain"
          />
          {(!collapsed || mobile) && (
            <div>
              <h2 className="font-bold text-lg">Oroma TV</h2>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          )}
        </div>
        {!mobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start gap-3 h-12 ${
                isActive 
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : "hover:bg-gray-100"
              } ${collapsed && !mobile ? 'px-3' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-white' : item.color}`} />
              {(!collapsed || mobile) && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant={item.badgeColor || "destructive"} 
                      className="text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className={`flex items-center gap-3 ${collapsed && !mobile ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-700 font-semibold text-sm">A</span>
          </div>
          {(!collapsed || mobile) && (
            <div className="flex-1">
              <p className="font-medium text-sm">Admin User</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent mobile={true} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
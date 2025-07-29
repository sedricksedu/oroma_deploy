import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/admin/Sidebar";
import { TopNavbar } from "@/components/admin/TopNavbar";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { LiveStreamManager } from "@/components/admin/LiveStreamManager";
import { RadioStreamManager } from "@/components/admin/RadioStreamManager";
import { NewsManager } from "@/components/admin/NewsManager";
import { ProgramManager } from "@/components/admin/ProgramManager";

import { HomePageSettings } from "@/components/admin/HomePageSettings";
import { SongRequestManager } from "@/components/admin/SongRequestManager";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { AdvertisingManager } from "@/components/admin/AdvertisingManager";
import { InterviewRequestManager } from "@/components/admin/InterviewRequestManager";
import { ProgramProposalManager } from "@/components/admin/ProgramProposalManager";
import { Settings } from "@/components/admin/Settings";
import EngagementMetrics from "@/components/admin/EngagementMetrics";
import AdminBlogPage from "@/pages/AdminBlogPage";
import AdminEventsPage from "@/pages/AdminEventsPage";
import AdminLegalPage from "@/pages/AdminLegalPage";

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  if (!user) {
    setLocation("/admin/login");
    return null;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
    setLocation("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />;
      case "programs":
        return <ProgramManager />;
      case "blog":
        return <NewsManager />;
      case "events":
        return <AdminEventsPage />;
      case "livestream":
        return <LiveStreamManager />;
      case "radiostream":
        return <RadioStreamManager />;
      case "homepage":
        return <HomePageSettings />;
      case "analytics":
        return <EngagementMetrics />;
      case "advertising":
        return <AdvertisingManager />;
      case "interview-requests":
        return <InterviewRequestManager />;
      case "program-proposals":
        return <ProgramProposalManager />;
      case "settings":
        return <Settings />;
      case "legal":
        return <AdminLegalPage />;
      case "security":
        return <div className="p-8 text-center text-gray-500">Security settings coming soon...</div>;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar onLogout={handleLogout} />
        <main className="flex-1 overflow-auto p-3 md:p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}


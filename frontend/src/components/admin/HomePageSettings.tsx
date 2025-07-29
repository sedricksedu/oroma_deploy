import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Home, 
  Palette, 
  Settings, 
  Eye, 
  Monitor,
  Save,
  RefreshCw
} from "lucide-react";

interface HomePageSettings {
  heroTitle: string;
  heroSubtitle: string;
  primaryColor: string;
  secondaryColor: string;
  featuredNews: boolean;
  featuredEvents: boolean;
  liveStreamDefault: string;
  showViewerCount: boolean;
  enableReactions: boolean;
  enableComments: boolean;
}

export function HomePageSettings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("content");

  // Fetch current settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/admin/home-settings"],
    queryFn: async () => {
      const response = await fetch("/api/admin/home-settings");
      if (!response.ok) throw new Error("Failed to fetch settings");
      return response.json();
    },
  });

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<HomePageSettings>) => {
      const response = await apiRequest("PUT", "/api/admin/home-settings", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/home-settings"] });
      toast({
        title: "Settings Updated",
        description: "Home page settings have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update home page settings.",
        variant: "destructive",
      });
    },
  });

  const [formData, setFormData] = useState<HomePageSettings>({
    heroTitle: settings?.heroTitle || "Welcome to Oroma TV",
    heroSubtitle: settings?.heroSubtitle || "Dwon tumalo me Uganda",
    primaryColor: settings?.primaryColor || "#dc2626",
    secondaryColor: settings?.secondaryColor || "#000000",
    featuredNews: settings?.featuredNews ?? true,
    featuredEvents: settings?.featuredEvents ?? true,
    liveStreamDefault: settings?.liveStreamDefault || "tv",
    showViewerCount: settings?.showViewerCount ?? true,
    enableReactions: settings?.enableReactions ?? true,
    enableComments: settings?.enableComments ?? true,
  });

  const handleSubmit = (section: keyof HomePageSettings | "all") => {
    if (section === "all") {
      updateMutation.mutate(formData);
    } else {
      updateMutation.mutate({ [section]: formData[section] });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Home className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Home Page Settings</h2>
            <p className="text-muted-foreground">Customize your website's home page appearance and functionality</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button 
            onClick={() => handleSubmit("all")}
            disabled={updateMutation.isPending}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save All Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content" className="gap-2">
            <Monitor className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="design" className="gap-2">
            <Palette className="h-4 w-4" />
            Design
          </TabsTrigger>
          <TabsTrigger value="features" className="gap-2">
            <Settings className="h-4 w-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="streaming" className="gap-2">
            <Monitor className="h-4 w-4" />
            Streaming
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="heroTitle">Main Title</Label>
                <Input
                  id="heroTitle"
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  placeholder="Welcome to Oroma TV"
                />
              </div>
              <div>
                <Label htmlFor="heroSubtitle">Subtitle</Label>
                <Input
                  id="heroSubtitle"
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  placeholder="Dwon tumalo me Uganda"
                />
              </div>
              <Button 
                onClick={() => handleSubmit("heroTitle")}
                disabled={updateMutation.isPending}
                size="sm"
              >
                Update Content
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      placeholder="#dc2626"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => handleSubmit("primaryColor")}
                disabled={updateMutation.isPending}
                size="sm"
              >
                Apply Colors
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Featured News</div>
                    <div className="text-sm text-muted-foreground">Show latest news on home page</div>
                  </div>
                  <Switch
                    checked={formData.featuredNews}
                    onCheckedChange={(checked) => setFormData({ ...formData, featuredNews: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Featured Events</div>
                    <div className="text-sm text-muted-foreground">Show upcoming events</div>
                  </div>
                  <Switch
                    checked={formData.featuredEvents}
                    onCheckedChange={(checked) => setFormData({ ...formData, featuredEvents: checked })}
                  />
                </div>
              </div>
              <Button 
                onClick={() => handleSubmit("featuredNews")}
                disabled={updateMutation.isPending}
                size="sm"
              >
                Update Features
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streaming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Streaming Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Default Stream</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={formData.liveStreamDefault === "tv" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, liveStreamDefault: "tv" })}
                    size="sm"
                  >
                    TV Stream
                  </Button>
                  <Button
                    variant={formData.liveStreamDefault === "radio" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, liveStreamDefault: "radio" })}
                    size="sm"
                  >
                    Radio Stream
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Show Viewer Count</div>
                    <div className="text-sm text-muted-foreground">Display live viewer numbers</div>
                  </div>
                  <Switch
                    checked={formData.showViewerCount}
                    onCheckedChange={(checked) => setFormData({ ...formData, showViewerCount: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Enable Reactions</div>
                    <div className="text-sm text-muted-foreground">Allow emoji reactions</div>
                  </div>
                  <Switch
                    checked={formData.enableReactions}
                    onCheckedChange={(checked) => setFormData({ ...formData, enableReactions: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Enable Comments</div>
                    <div className="text-sm text-muted-foreground">Allow live comments</div>
                  </div>
                  <Switch
                    checked={formData.enableComments}
                    onCheckedChange={(checked) => setFormData({ ...formData, enableComments: checked })}
                  />
                </div>
              </div>
              <Button 
                onClick={() => handleSubmit("showViewerCount")}
                disabled={updateMutation.isPending}
                size="sm"
              >
                Update Streaming Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
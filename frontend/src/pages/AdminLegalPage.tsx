import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, FileText, Save, Eye, Edit, Globe } from "lucide-react";

export default function AdminLegalPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("privacy");
  const [editingContent, setEditingContent] = useState<{ [key: string]: string }>({});

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const existingSetting = settings.find(s => s.key === key);
      
      if (existingSetting) {
        const response = await apiRequest("PUT", `/api/admin/settings/${existingSetting.id}`, { value });
        return response.json();
      } else {
        const response = await apiRequest("POST", "/api/admin/settings", { 
          key, 
          value, 
          category: "legal" 
        });
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({ title: "Legal content updated successfully" });
      setEditingContent({});
    },
  });

  const handleSave = (key: string) => {
    const content = editingContent[key];
    if (content) {
      updateMutation.mutate({ key, value: content });
    }
  };

  const getSettingValue = (key: string) => {
    return settings.find(s => s.key === key)?.value || getDefaultContent(key);
  };

  const getDefaultContent = (key: string) => {
    switch (key) {
      case "privacy_policy":
        return `# Privacy Policy

## Information We Collect
Oroma TV collects information you provide directly, such as when you subscribe to our newsletter, contact us, or participate in our interactive features.

## How We Use Your Information
- Provide and improve our streaming services
- Send newsletters and important updates
- Respond to your inquiries and support requests
- Analyze usage patterns to enhance user experience

## Information Sharing
We do not sell, trade, or rent your personal information to third parties.

## Data Security
We implement appropriate technical and organizational measures to protect your personal information.

## Contact Us
For questions about this Privacy Policy, contact us at privacy@oromatv.com`;

      case "terms_of_service":
        return `# Terms of Service

## Acceptance of Terms
By accessing and using Oroma TV's website and streaming services, you accept and agree to be bound by these terms.

## Use of Services
### Permitted Use
- Watch our live TV broadcasts and radio streams
- Participate in live comments and reactions
- Subscribe to our newsletter and updates

### Prohibited Activities
- Posting inappropriate, offensive, or illegal content
- Attempting to disrupt our streaming services
- Impersonating others or providing false information

## Intellectual Property
All content on Oroma TV is protected by copyright and other intellectual property laws.

## Contact Information
For questions about these Terms, contact us at legal@oromatv.com`;

      case "cookies_policy":
        return `# Cookies Policy

## What Are Cookies
Cookies are small text files stored on your device when you visit our website.

## How We Use Cookies
- Essential cookies for website functionality
- Analytics cookies to understand user behavior
- Preference cookies to remember your settings

## Managing Cookies
You can control cookies through your browser settings.

## Contact Us
For questions about our use of cookies, contact us at privacy@oromatv.com`;

      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Legal Pages Management</h1>
          <p className="text-sm md:text-base text-gray-600">Manage privacy policy, terms of service, and other legal content</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
              <Eye className="mr-2 h-4 w-4" />
              Preview Pages
            </a>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy Policy
          </TabsTrigger>
          <TabsTrigger value="terms" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Terms of Service
          </TabsTrigger>
          <TabsTrigger value="cookies" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Cookies Policy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    Privacy Policy Content
                  </CardTitle>
                  <CardDescription>
                    Manage your privacy policy content that explains how you collect and use user data
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  Last updated: {new Date().toLocaleDateString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="privacy-content">Privacy Policy Content</Label>
                <Textarea
                  id="privacy-content"
                  value={editingContent["privacy_policy"] || getSettingValue("privacy_policy")}
                  onChange={(e) => setEditingContent({
                    ...editingContent,
                    privacy_policy: e.target.value
                  })}
                  rows={15}
                  className="font-mono text-sm"
                  placeholder="Enter your privacy policy content in Markdown format..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use Markdown formatting. This content will be displayed on /privacy-policy
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSave("privacy_policy")}
                  disabled={updateMutation.isPending || !editingContent["privacy_policy"]}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {updateMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="mr-2 h-4 w-4" />
                  Save Privacy Policy
                </Button>
                <Button variant="outline" asChild>
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-red-600" />
                    Terms of Service Content
                  </CardTitle>
                  <CardDescription>
                    Manage your terms of service that govern how users can use your platform
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  Last updated: {new Date().toLocaleDateString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="terms-content">Terms of Service Content</Label>
                <Textarea
                  id="terms-content"
                  value={editingContent["terms_of_service"] || getSettingValue("terms_of_service")}
                  onChange={(e) => setEditingContent({
                    ...editingContent,
                    terms_of_service: e.target.value
                  })}
                  rows={15}
                  className="font-mono text-sm"
                  placeholder="Enter your terms of service content in Markdown format..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use Markdown formatting. This content will be displayed on /terms-of-service
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSave("terms_of_service")}
                  disabled={updateMutation.isPending || !editingContent["terms_of_service"]}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {updateMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="mr-2 h-4 w-4" />
                  Save Terms of Service
                </Button>
                <Button variant="outline" asChild>
                  <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cookies" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-red-600" />
                    Cookies Policy Content
                  </CardTitle>
                  <CardDescription>
                    Manage your cookies policy that explains how you use cookies and tracking
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  Last updated: {new Date().toLocaleDateString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cookies-content">Cookies Policy Content</Label>
                <Textarea
                  id="cookies-content"
                  value={editingContent["cookies_policy"] || getSettingValue("cookies_policy")}
                  onChange={(e) => setEditingContent({
                    ...editingContent,
                    cookies_policy: e.target.value
                  })}
                  rows={15}
                  className="font-mono text-sm"
                  placeholder="Enter your cookies policy content in Markdown format..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use Markdown formatting. This content will be displayed when needed
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSave("cookies_policy")}
                  disabled={updateMutation.isPending || !editingContent["cookies_policy"]}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {updateMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="mr-2 h-4 w-4" />
                  Save Cookies Policy
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for legal page management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start" asChild>
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                <Shield className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">View Privacy Policy</div>
                  <div className="text-sm text-gray-500">See how it appears to users</div>
                </div>
              </a>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start" asChild>
              <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">
                <FileText className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">View Terms of Service</div>
                  <div className="text-sm text-gray-500">Check the terms page</div>
                </div>
              </a>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start" asChild>
              <a href="/sitemap" target="_blank" rel="noopener noreferrer">
                <Globe className="h-5 w-5 mb-2" />
                <div className="text-left">
                  <div className="font-medium">View Sitemap</div>
                  <div className="text-sm text-gray-500">Navigate all pages</div>
                </div>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
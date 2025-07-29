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
  DollarSign, 
  ExternalLink, 
  Settings, 
  Eye, 
  Phone,
  MessageSquare,
  Save,
  RefreshCw,
  Check,
  X
} from "lucide-react";

interface AdIntegration {
  id: string;
  name: string;
  description: string;
  status: "connected" | "disconnected" | "pending";
  icon: React.ElementType;
  fields: Array<{
    key: string;
    label: string;
    type: "text" | "password" | "textarea";
    placeholder: string;
    required: boolean;
  }>;
}

export function AdvertisingManager() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("google-ads");

  const adIntegrations: AdIntegration[] = [
    {
      id: "google-ads",
      name: "Google Ads",
      description: "Integrate Google AdSense for display advertisements",
      status: "disconnected",
      icon: ExternalLink,
      fields: [
        { key: "googleAdsenseId", label: "AdSense Publisher ID", type: "text", placeholder: "ca-pub-1234567890123456", required: true },
        { key: "adUnit1", label: "Header Ad Unit ID", type: "text", placeholder: "1234567890", required: false },
        { key: "adUnit2", label: "Sidebar Ad Unit ID", type: "text", placeholder: "1234567890", required: false },
        { key: "adUnit3", label: "Footer Ad Unit ID", type: "text", placeholder: "1234567890", required: false },
      ]
    },
    {
      id: "twilio",
      name: "Twilio",
      description: "SMS notifications and marketing campaigns",
      status: "disconnected",
      icon: Phone,
      fields: [
        { key: "twilioAccountSid", label: "Account SID", type: "text", placeholder: "ACxxxxxxxxxxxxx", required: true },
        { key: "twilioAuthToken", label: "Auth Token", type: "password", placeholder: "your_auth_token", required: true },
        { key: "twilioPhoneNumber", label: "Phone Number", type: "text", placeholder: "+1234567890", required: true },
      ]
    },
    {
      id: "africas-talking",
      name: "Africa's Talking",
      description: "SMS and voice services for African markets",
      status: "disconnected",
      icon: MessageSquare,
      fields: [
        { key: "africasTalkingApiKey", label: "API Key", type: "password", placeholder: "your_api_key", required: true },
        { key: "africasTalkingUsername", label: "Username", type: "text", placeholder: "sandbox", required: true },
        { key: "africasTalkingSender", label: "Sender ID", type: "text", placeholder: "OROMA_TV", required: false },
      ]
    },
    {
      id: "sendchamp",
      name: "SendChamp",
      description: "Multi-channel messaging platform",
      status: "disconnected",
      icon: MessageSquare,
      fields: [
        { key: "sendChampApiKey", label: "API Key", type: "password", placeholder: "your_api_key", required: true },
        { key: "sendChampSender", label: "Sender Name", type: "text", placeholder: "Oroma TV", required: false },
      ]
    },
  ];

  // Fetch current settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/admin/advertising"],
    queryFn: async () => {
      const response = await fetch("/api/admin/advertising");
      if (!response.ok) throw new Error("Failed to fetch settings");
      return response.json();
    },
  });

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", "/api/admin/advertising", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/advertising"] });
      toast({
        title: "Settings Updated",
        description: "Advertising integration settings have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update advertising settings.",
        variant: "destructive",
      });
    },
  });

  // Test connection mutation
  const testConnectionMutation = useMutation({
    mutationFn: async (integrationId: string) => {
      const response = await apiRequest("POST", `/api/admin/advertising/test/${integrationId}`);
      return response.json();
    },
    onSuccess: (data, integrationId) => {
      toast({
        title: "Connection Test",
        description: data.success ? "Connection successful!" : "Connection failed. Please check your credentials.",
        variant: data.success ? "default" : "destructive",
      });
    },
  });

  const [formData, setFormData] = useState<Record<string, any>>(settings || {});

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (integrationId: string) => {
    const integration = adIntegrations.find(i => i.id === integrationId);
    if (!integration) return;

    const integrationData = integration.fields.reduce((acc, field) => {
      acc[field.key] = formData[field.key] || "";
      return acc;
    }, {} as Record<string, string>);

    updateMutation.mutate({ [integrationId]: integrationData });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" />Connected</Badge>;
      case "pending":
        return <Badge variant="secondary"><RefreshCw className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Disconnected</Badge>;
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
          <DollarSign className="h-6 w-6 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold">Advertising & Integrations</h2>
            <p className="text-muted-foreground">Manage advertising platforms and communication services</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          View Analytics
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {adIntegrations.map((integration) => (
            <TabsTrigger key={integration.id} value={integration.id} className="gap-2">
              <integration.icon className="h-4 w-4" />
              {integration.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {adIntegrations.map((integration) => (
          <TabsContent key={integration.id} value={integration.id} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <integration.icon className="h-6 w-6" />
                    <div>
                      <CardTitle>{integration.name} Integration</CardTitle>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(integration.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {integration.fields.map((field) => (
                    <div key={field.key}>
                      <Label htmlFor={field.key}>
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {field.type === "textarea" ? (
                        <Textarea
                          id={field.key}
                          value={formData[field.key] || ""}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          required={field.required}
                        />
                      ) : (
                        <Input
                          id={field.key}
                          type={field.type}
                          value={formData[field.key] || ""}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          required={field.required}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t">
                  <Button 
                    onClick={() => handleSave(integration.id)}
                    disabled={updateMutation.isPending}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Configuration
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => testConnectionMutation.mutate(integration.id)}
                    disabled={testConnectionMutation.isPending}
                    className="gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Test Connection
                  </Button>
                </div>

                {/* Integration-specific help */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Setup Instructions:</h4>
                  {integration.id === "google-ads" && (
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Create a Google AdSense account at adsense.google.com</li>
                      <li>• Get your Publisher ID from your AdSense dashboard</li>
                      <li>• Create ad units for different placements on your website</li>
                      <li>• Copy the ad unit IDs to the fields above</li>
                    </ul>
                  )}
                  {integration.id === "twilio" && (
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Sign up for a Twilio account at twilio.com</li>
                      <li>• Find your Account SID and Auth Token in the console</li>
                      <li>• Purchase a phone number for sending SMS</li>
                      <li>• Test the connection to verify setup</li>
                    </ul>
                  )}
                  {integration.id === "africas-talking" && (
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Create an account at africastalking.com</li>
                      <li>• Get your API key from the dashboard</li>
                      <li>• Set up your sender ID for branded SMS</li>
                      <li>• Add credits to your account for sending messages</li>
                    </ul>
                  )}
                  {integration.id === "sendchamp" && (
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Register at sendchamp.com</li>
                      <li>• Generate an API key in your dashboard</li>
                      <li>• Configure your sender name</li>
                      <li>• Fund your account for messaging services</li>
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Revenue Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Advertising Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$1,247</div>
              <div className="text-sm text-muted-foreground">This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">456,789</div>
              <div className="text-sm text-muted-foreground">Ad Impressions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">2.3%</div>
              <div className="text-sm text-muted-foreground">Click Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">$2.75</div>
              <div className="text-sm text-muted-foreground">CPM</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
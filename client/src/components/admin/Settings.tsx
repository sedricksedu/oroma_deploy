import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Settings as SettingsIcon, 
  Save, 
  Eye, 
  EyeOff, 
  Upload,
  Shield,
  Globe,
  Palette,
  Bell,
  Lock
} from "lucide-react";

export function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // User profile state
  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
    fullName: user?.fullName || "",
    profileImage: user?.profileImage || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Site settings state
  const [siteSettings, setSiteSettings] = useState({
    siteName: "Oroma TV",
    siteDescription: "Northern Uganda's premier media house",
    primaryColor: "#dc2626",
    secondaryColor: "#000000",
    enableRegistration: true,
    enableComments: true,
    maintenanceMode: false
  });

  const handleProfileUpdate = async () => {
    setIsSaving(true);
    try {
      // Validate passwords if changing
      if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
        toast({
          title: "Error",
          description: "New passwords do not match",
          variant: "destructive"
        });
        return;
      }

      const updateData = {
        username: profile.username,
        email: profile.email,
        fullName: profile.fullName,
        profileImage: profile.profileImage,
        ...(profile.newPassword && { 
          currentPassword: profile.currentPassword,
          newPassword: profile.newPassword 
        })
      };

      const response = await fetch(`/api/admin/profile/${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully"
        });
        // Clear password fields
        setProfile(prev => ({ 
          ...prev, 
          currentPassword: "", 
          newPassword: "", 
          confirmPassword: "" 
        }));
      } else {
        const error = await response.text();
        toast({
          title: "Error",
          description: error || "Failed to update profile",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSiteSettingsUpdate = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteSettings)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Site settings updated successfully"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update site settings",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update site settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="h-8 w-8 text-gray-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your admin account and site configuration</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="site" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Site
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Admin Profile
                <Badge variant="secondary" className="ml-2">Super Admin</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.profileImage} />
                  <AvatarFallback className="text-lg">
                    {profile.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </Button>
                  <p className="text-sm text-gray-500">JPG, PNG, or GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profile.username}
                    onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profile.fullName}
                  onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Change Password
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={profile.currentPassword}
                        onChange={(e) => setProfile(prev => ({ ...prev, currentPassword: e.target.value }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={profile.newPassword}
                        onChange={(e) => setProfile(prev => ({ ...prev, newPassword: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={profile.confirmPassword}
                        onChange={(e) => setProfile(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleProfileUpdate} disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Profile"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Site Settings */}
        <TabsContent value="site">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Site Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={siteSettings.siteDescription}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Site Features</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableRegistration">User Registration</Label>
                      <p className="text-sm text-gray-500">Allow new users to register accounts</p>
                    </div>
                    <Switch
                      id="enableRegistration"
                      checked={siteSettings.enableRegistration}
                      onCheckedChange={(checked) => setSiteSettings(prev => ({ ...prev, enableRegistration: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableComments">Comments</Label>
                      <p className="text-sm text-gray-500">Allow users to comment on news articles</p>
                    </div>
                    <Switch
                      id="enableComments"
                      checked={siteSettings.enableComments}
                      onCheckedChange={(checked) => setSiteSettings(prev => ({ ...prev, enableComments: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-sm text-gray-500">Temporarily disable site for maintenance</p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={siteSettings.maintenanceMode}
                      onCheckedChange={(checked) => setSiteSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSiteSettingsUpdate} disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance & Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={siteSettings.primaryColor}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={siteSettings.primaryColor}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={siteSettings.secondaryColor}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={siteSettings.secondaryColor}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-2">Color Preview</h4>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-lg border"
                    style={{ backgroundColor: siteSettings.primaryColor }}
                  ></div>
                  <div 
                    className="w-16 h-16 rounded-lg border"
                    style={{ backgroundColor: siteSettings.secondaryColor }}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Primary color is used for buttons, links, and accents.
                      Secondary color is used for text and borders.
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={handleSiteSettingsUpdate} disabled={isSaving} className="gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Appearance"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">Super Admin Access</h4>
                </div>
                <p className="text-sm text-green-700">
                  You have full administrative privileges including user management, 
                  content moderation, and system configuration.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Security Features</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Login History</h4>
                      <p className="text-sm text-gray-500">View recent login activity and devices</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View History
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">API Keys</h4>
                      <p className="text-sm text-gray-500">Manage API access tokens and keys</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage Keys
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
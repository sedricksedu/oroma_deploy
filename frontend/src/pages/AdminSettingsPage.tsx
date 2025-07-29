import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Palette, Database, Shield, Globe } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm md:text-base text-gray-600">Manage your platform configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-red-600" />
              Site Branding
            </CardTitle>
            <CardDescription>Customize your website appearance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Coming soon...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-red-600" />
              Data Management
            </CardTitle>
            <CardDescription>Backup and restore your content</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Coming soon...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Security Settings
            </CardTitle>
            <CardDescription>Configure security options</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Coming soon...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-red-600" />
              SEO & Analytics
            </CardTitle>
            <CardDescription>Search engine optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Coming soon...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-red-600" />
              General Settings
            </CardTitle>
            <CardDescription>Basic platform configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
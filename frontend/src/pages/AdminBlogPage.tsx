import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Plus, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminBlogPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-sm md:text-base text-gray-600">Create and manage your blog posts and articles</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-red-600" />
              Draft Posts
            </CardTitle>
            <CardDescription>Posts in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Coming soon...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-600" />
              Published Posts
            </CardTitle>
            <CardDescription>Live blog content</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Coming soon...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-red-600" />
              Analytics
            </CardTitle>
            <CardDescription>Post performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
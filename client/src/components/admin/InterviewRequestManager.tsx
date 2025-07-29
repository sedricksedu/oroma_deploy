import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic } from "lucide-react";

export function InterviewRequestManager() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Mic className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interview Requests</h1>
          <p className="text-gray-600">Manage interview scheduling and requests</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Recent Interview Requests
            <Badge variant="secondary">0 Pending</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Mic className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No interview requests yet</p>
            <p className="text-sm">Requests will appear here when users submit them</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
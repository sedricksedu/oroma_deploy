import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Presentation } from "lucide-react";

export function ProgramProposalManager() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Presentation className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Program Proposals</h1>
          <p className="text-gray-600">Review and manage program proposals</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Presentation className="h-5 w-5" />
            Recent Program Proposals
            <Badge variant="secondary">0 Pending</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Presentation className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No program proposals yet</p>
            <p className="text-sm">Proposals will appear here when users submit them</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
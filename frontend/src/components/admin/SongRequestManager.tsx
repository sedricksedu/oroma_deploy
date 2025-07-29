import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Music, 
  Play, 
  Pause, 
  Check, 
  X, 
  Clock, 
  Search,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SongRequest {
  id: string;
  artistName: string;
  songTitle: string;
  requesterName: string;
  message?: string;
  status: "pending" | "playing" | "played" | "rejected";
  priority: number;
  createdAt: string;
}

export function SongRequestManager() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch song requests
  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/song-requests"],
    queryFn: async () => {
      const response = await fetch("/api/admin/song-requests");
      if (!response.ok) throw new Error("Failed to fetch song requests");
      return response.json();
    },
    refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
  });

  // Update request status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PUT", `/api/admin/song-requests/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/song-requests"] });
      toast({
        title: "Status Updated",
        description: "Song request status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update song request status.",
        variant: "destructive",
      });
    },
  });

  // Update priority mutation
  const updatePriorityMutation = useMutation({
    mutationFn: async ({ id, priority }: { id: string; priority: number }) => {
      const response = await apiRequest("PUT", `/api/admin/song-requests/${id}`, { priority });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/song-requests"] });
    },
  });

  // Delete request mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/song-requests/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/song-requests"] });
      toast({
        title: "Request Deleted",
        description: "Song request has been deleted successfully.",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case "playing":
        return <Badge variant="default" className="gap-1 bg-green-600"><Play className="h-3 w-3" />Playing</Badge>;
      case "played":
        return <Badge variant="outline" className="gap-1"><Check className="h-3 w-3" />Played</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="gap-1"><X className="h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredRequests = requests.filter((request: SongRequest) => {
    const matchesSearch = 
      request.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.songTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requesterName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = requests.reduce((acc: any, request: SongRequest) => {
    acc[request.status] = (acc[request.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Music className="h-6 w-6 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold">Song Request Manager</h2>
            <p className="text-muted-foreground">Manage and track song requests from listeners</p>
          </div>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending || 0}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{statusCounts.playing || 0}</div>
            <div className="text-sm text-muted-foreground">Playing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.played || 0}</div>
            <div className="text-sm text-muted-foreground">Played</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{statusCounts.rejected || 0}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{requests.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by artist, song, or requester name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="playing">Playing</SelectItem>
            <SelectItem value="played">Played</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Song Requests</h3>
              <p className="text-muted-foreground">No song requests match your current filters.</p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request: SongRequest) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {request.songTitle}
                        </h3>
                        <p className="text-muted-foreground">by {request.artistName}</p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>Requested by: <strong>{request.requesterName}</strong></span>
                      <span>{formatDistanceToNow(new Date(request.createdAt))} ago</span>
                      {request.priority > 0 && (
                        <Badge variant="outline" className="text-xs">
                          Priority: {request.priority}
                        </Badge>
                      )}
                    </div>
                    
                    {request.message && (
                      <p className="text-sm bg-muted p-2 rounded italic">
                        "{request.message}"
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {request.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateStatusMutation.mutate({ id: request.id, status: "playing" })}
                          disabled={updateStatusMutation.isPending}
                          className="gap-1"
                        >
                          <Play className="h-3 w-3" />
                          Play
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateStatusMutation.mutate({ id: request.id, status: "rejected" })}
                          disabled={updateStatusMutation.isPending}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    
                    {request.status === "playing" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatusMutation.mutate({ id: request.id, status: "played" })}
                        disabled={updateStatusMutation.isPending}
                        className="gap-1"
                      >
                        <Check className="h-3 w-3" />
                        Mark Played
                      </Button>
                    )}
                    
                    <Select
                      value={(request.priority || 0).toString()}
                      onValueChange={(value) => updatePriorityMutation.mutate({ 
                        id: request.id, 
                        priority: parseInt(value) 
                      })}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(request.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
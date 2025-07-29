import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Plus, Edit, Trash2, Play, Square, Users, Tv, Radio } from "lucide-react";
import type { StreamSession, InsertStreamSession } from "@shared/schema";

export default function AdminStreamPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingStream, setEditingStream] = useState<StreamSession | null>(null);
  const [formData, setFormData] = useState<Partial<InsertStreamSession>>({
    streamType: "tv",
    title: "",
    description: "",
    streamUrl: "",
    status: "offline",
    quality: "HD",
  });

  const { data: streams = [], isLoading } = useQuery<StreamSession[]>({
    queryKey: ["/api/admin/streams"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertStreamSession) => {
      const response = await apiRequest("POST", "/api/admin/streams", {
        ...data,
        createdBy: user?.id,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/streams"] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({ title: "Stream session created successfully" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<StreamSession> }) => {
      const response = await apiRequest("PUT", `/api/admin/streams/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/streams"] });
      setEditingStream(null);
      resetForm();
      toast({ title: "Stream session updated successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/streams/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/streams"] });
      toast({ title: "Stream session deleted successfully" });
    },
  });

  const toggleStreamMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PUT", `/api/admin/streams/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/streams"] });
      toast({ title: "Stream status updated successfully" });
    },
  });

  const resetForm = () => {
    setFormData({
      streamType: "tv",
      title: "",
      description: "",
      streamUrl: "",
      status: "offline",
      quality: "HD",
    });
  };

  const handleEdit = (stream: StreamSession) => {
    setEditingStream(stream);
    setFormData({
      streamType: stream.streamType,
      title: stream.title,
      description: stream.description || "",
      streamUrl: stream.streamUrl,
      status: stream.status,
      quality: stream.quality,
      startTime: stream.startTime || "",
      endTime: stream.endTime || "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingStream) {
      updateMutation.mutate({ id: editingStream.id, data: formData });
    } else {
      createMutation.mutate(formData as InsertStreamSession);
    }
  };

  const toggleStreamStatus = (stream: StreamSession) => {
    const newStatus = stream.status === "live" ? "offline" : "live";
    toggleStreamMutation.mutate({ id: stream.id, status: newStatus });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-red-100 text-red-800";
      case "offline": return "bg-gray-100 text-gray-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStreamIcon = (type: string) => {
    return type === "tv" ? Tv : Radio;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stream Management</h1>
          <p className="text-gray-600">Manage live TV and radio streaming sessions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              New Stream
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingStream ? "Edit Stream Session" : "Create New Stream Session"}</DialogTitle>
              <DialogDescription>
                {editingStream ? "Update stream session details" : "Configure a new streaming session"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="streamType">Stream Type</Label>
                  <Select
                    value={formData.streamType || "tv"}
                    onValueChange={(value) => setFormData({ ...formData, streamType: value as "tv" | "radio" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tv">TV Stream</SelectItem>
                      <SelectItem value="radio">Radio Stream</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status || "offline"}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="title">Stream Title</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="streamUrl">Stream URL</Label>
                <Input
                  id="streamUrl"
                  value={formData.streamUrl || ""}
                  onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                  placeholder="https://mediaserver.oromatv.com/LiveApp/streams/12345.m3u8"
                  required
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="quality">Quality</Label>
                  <Select
                    value={formData.quality || "HD"}
                    onValueChange={(value) => setFormData({ ...formData, quality: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SD">SD (480p)</SelectItem>
                      <SelectItem value="HD">HD (720p)</SelectItem>
                      <SelectItem value="FHD">Full HD (1080p)</SelectItem>
                      <SelectItem value="4K">4K (2160p)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={formData.startTime || ""}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={formData.endTime || ""}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingStream ? "Update Stream" : "Create Stream"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setEditingStream(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {streams.map((stream) => {
          const StreamIcon = getStreamIcon(stream.streamType);
          return (
            <Card key={stream.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <StreamIcon className="h-5 w-5 text-red-600" />
                      <CardTitle className="text-xl">{stream.title}</CardTitle>
                      <Badge className={getStatusColor(stream.status)}>{stream.status}</Badge>
                      <Badge variant="outline">{stream.quality}</Badge>
                    </div>
                    <CardDescription>{stream.description}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {stream.viewerCount} viewers
                      </div>
                      {stream.startTime && (
                        <div>
                          Start: {new Date(stream.startTime).toLocaleString()}
                        </div>
                      )}
                      {stream.endTime && (
                        <div>
                          End: {new Date(stream.endTime).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-mono bg-gray-100 p-2 rounded">
                      {stream.streamUrl}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={stream.status === "live" ? "destructive" : "default"}
                      size="sm"
                      onClick={() => toggleStreamStatus(stream)}
                      disabled={toggleStreamMutation.isPending}
                      className={stream.status === "live" ? "" : "bg-green-600 hover:bg-green-700"}
                    >
                      {stream.status === "live" ? (
                        <>
                          <Square className="h-4 w-4 mr-1" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleEdit(stream);
                        setIsCreateDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(stream.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
        
        {streams.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No stream sessions found. Create your first stream!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
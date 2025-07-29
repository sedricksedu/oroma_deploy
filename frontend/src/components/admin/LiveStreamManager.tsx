import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Radio, 
  Play, 
  Pause, 
  Settings, 
  Eye, 
  Calendar,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export function LiveStreamManager() {
  const [isLive, setIsLive] = useState(true);
  const [streamData, setStreamData] = useState({
    title: "Northern Pulse Live",
    description: "Live coverage of community events in Northern Uganda",
    yoloStreamUrl: "https://yolo.tv/stream/oroma-tv-northern-pulse",
    embedCode: '<iframe src="https://yolo.tv/embed/oroma-tv" width="100%" height="400"></iframe>',
    isActive: true,
    scheduledStart: "",
    scheduledEnd: ""
  });

  const [streamQuality] = useState("HD 1080p");
  const [connectionStatus] = useState("Stable");

  // Fetch real-time viewer count
  const { data: viewerCount = 0 } = useQuery({
    queryKey: ['/api/active-users/count/tv'],
    queryFn: async () => {
      const response = await fetch('/api/active-users/count/tv');
      if (!response.ok) throw new Error('Failed to fetch viewer count');
      const data = await response.json();
      return typeof data.count === 'number' ? data.count : 0;
    },
    refetchInterval: 10000,
  });

  const handleStreamToggle = () => {
    setStreamData({ ...streamData, isActive: !streamData.isActive });
  };

  const handleSaveSettings = () => {
    // Save stream settings logic
    console.log("Saving stream settings:", streamData);
  };

  return (
    <div className="space-y-6">
      {/* Stream Status Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stream Status</CardTitle>
            <Radio className={`h-4 w-4 ${isLive ? 'text-red-500' : 'text-gray-400'}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={isLive ? "destructive" : "secondary"}>
                {isLive ? "LIVE" : "OFFLINE"}
              </Badge>
              {isLive && <span className="text-sm text-gray-600">Broadcasting</span>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Viewers</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{viewerCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Currently watching</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connection</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-green-600">{connectionStatus}</div>
            <p className="text-xs text-muted-foreground">{streamQuality}</p>
          </CardContent>
        </Card>
      </div>

      {/* Stream Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Stream Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="streamTitle">Stream Title</Label>
              <Input
                id="streamTitle"
                value={streamData.title}
                onChange={(e) => setStreamData({ ...streamData, title: e.target.value })}
                placeholder="Enter stream title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="streamDescription">Description</Label>
              <Textarea
                id="streamDescription"
                value={streamData.description}
                onChange={(e) => setStreamData({ ...streamData, description: e.target.value })}
                placeholder="Describe your live stream"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yoloUrl">Yolo Stream URL</Label>
              <Input
                id="yoloUrl"
                value={streamData.yoloStreamUrl}
                onChange={(e) => setStreamData({ ...streamData, yoloStreamUrl: e.target.value })}
                placeholder="https://yolo.tv/stream/your-channel"
              />
              <p className="text-xs text-gray-500">
                Enter your Yolo stream channel URL for integration
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="activeToggle">Stream Active</Label>
                <p className="text-xs text-gray-500">Enable/disable live streaming</p>
              </div>
              <Switch
                id="activeToggle"
                checked={streamData.isActive}
                onCheckedChange={handleStreamToggle}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveSettings} className="flex-1">
                Save Settings
              </Button>
              <Button 
                variant={isLive ? "destructive" : "default"}
                onClick={() => setIsLive(!isLive)}
                className="gap-2"
              >
                {isLive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isLive ? "Stop Stream" : "Start Stream"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Stream Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black rounded-lg aspect-video flex items-center justify-center mb-4">
              {isLive ? (
                <div className="text-center text-white">
                  <Radio className="h-12 w-12 mx-auto mb-2 animate-pulse text-red-500" />
                  <p className="text-sm">Live Stream Active</p>
                  <p className="text-xs text-gray-300">Preview not available in demo</p>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Stream Offline</p>
                  <p className="text-xs">Start streaming to see preview</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Embed Code</Label>
              <Textarea
                value={streamData.embedCode}
                onChange={(e) => setStreamData({ ...streamData, embedCode: e.target.value })}
                rows={3}
                className="text-xs font-mono"
              />
              <p className="text-xs text-gray-500">
                Use this code to embed the stream on your website
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stream Scheduling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Stream Scheduling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledStart">Scheduled Start Time</Label>
              <Input
                id="scheduledStart"
                type="datetime-local"
                value={streamData.scheduledStart}
                onChange={(e) => setStreamData({ ...streamData, scheduledStart: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledEnd">Scheduled End Time</Label>
              <Input
                id="scheduledEnd"
                type="datetime-local"
                value={streamData.scheduledEnd}
                onChange={(e) => setStreamData({ ...streamData, scheduledEnd: e.target.value })}
              />
            </div>
          </div>
          <Button variant="outline" className="mt-4">
            Schedule Stream
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Play className="h-6 w-6" />
              Test Stream
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Settings className="h-6 w-6" />
              Advanced Settings
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Eye className="h-6 w-6" />
              Analytics
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Radio className="h-6 w-6" />
              Stream History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
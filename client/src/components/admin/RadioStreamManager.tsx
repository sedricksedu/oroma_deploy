import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Radio, 
  Settings, 
  Play, 
  Pause, 
  Volume2, 
  Users, 
  Eye,
  Mic,
  Headphones,
  Music,
  Signal,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";

interface RadioStreamSettings {
  streamUrl: string;
  streamTitle: string;
  streamDescription: string;
  isLive: boolean;
  maxBitrate: string;
  audioQuality: string;
  enableChat: boolean;
  enableRequests: boolean;
  autoStart: boolean;
}

export function RadioStreamManager() {
  const { toast } = useToast();
  const [streamSettings, setStreamSettings] = useState<RadioStreamSettings>({
    streamUrl: "https://hoth.alonhosting.com:3975/stream",
    streamTitle: "QFM Radio 94.3 FM",
    streamDescription: "Northern Uganda's Voice - Broadcasting live from Lira City",
    isLive: true,
    maxBitrate: "128",
    audioQuality: "high",
    enableChat: true,
    enableRequests: true,
    autoStart: true
  });

  // Fetch real-time listener count
  const { data: listenerCount = 0 } = useQuery({
    queryKey: ['/api/active-users/count/radio'],
    queryFn: async () => {
      const response = await fetch('/api/active-users/count/radio');
      if (!response.ok) throw new Error('Failed to fetch listener count');
      const data = await response.json();
      return typeof data.count === 'number' ? data.count : 0;
    },
    refetchInterval: 10000,
  });

  const [streamStats, setStreamStats] = useState({
    peakListeners: 89,
    uptime: "2h 34m",
    currentSong: "Akello Grace - Dwon Me",
    bitrate: "128 kbps",
    status: "live"
  });

  const [isLoading, setIsLoading] = useState(false);

  // Update uptime
  useEffect(() => {
    const interval = setInterval(() => {
      setStreamStats(prev => ({
        ...prev,
        uptime: calculateUptime()
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const calculateUptime = () => {
    const start = new Date();
    start.setHours(start.getHours() - 2, start.getMinutes() - 34);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Settings Updated",
        description: "Radio stream settings have been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update radio stream settings.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreamToggle = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStreamSettings(prev => ({ ...prev, isLive: !prev.isLive }));
      setStreamStats(prev => ({ 
        ...prev, 
        status: streamSettings.isLive ? "offline" : "live" 
      }));
      
      toast({
        title: streamSettings.isLive ? "Stream Stopped" : "Stream Started",
        description: `Radio stream is now ${streamSettings.isLive ? "offline" : "live"}.`
      });
    } catch (error) {
      toast({
        title: "Stream Control Failed",
        description: "Failed to control radio stream.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Radio Stream Manager</h2>
          <p className="text-gray-600">Manage QFM Radio 94.3 FM live streaming</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge 
            variant={streamStats.status === "live" ? "default" : "secondary"}
            className={streamStats.status === "live" ? "bg-green-500" : "bg-gray-500"}
          >
            <Radio className="w-3 h-3 mr-1" />
            {streamStats.status === "live" ? "LIVE" : "OFFLINE"}
          </Badge>
          <Button
            onClick={handleStreamToggle}
            disabled={isLoading}
            variant={streamSettings.isLive ? "destructive" : "default"}
          >
            {streamSettings.isLive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {streamSettings.isLive ? "Stop Stream" : "Start Stream"}
          </Button>
        </div>
      </div>

      {/* Live Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Listeners</CardTitle>
            <Headphones className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listenerCount}</div>
            <p className="text-xs text-gray-500">Peak: {streamStats.peakListeners} today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stream Uptime</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streamStats.uptime}</div>
            <p className="text-xs text-gray-500">Continuous streaming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audio Quality</CardTitle>
            <Signal className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streamStats.bitrate}</div>
            <p className="text-xs text-gray-500">High quality audio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Now Playing</CardTitle>
            <Music className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{streamStats.currentSong}</div>
            <p className="text-xs text-gray-500">Local artist</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Settings */}
      <Tabs defaultValue="stream" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stream">Stream Settings</TabsTrigger>
          <TabsTrigger value="audio">Audio Quality</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="stream" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stream Configuration</CardTitle>
              <CardDescription>Configure your radio stream settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="streamUrl">Stream URL</Label>
                  <Input
                    id="streamUrl"
                    value={streamSettings.streamUrl}
                    onChange={(e) => setStreamSettings(prev => ({ ...prev, streamUrl: e.target.value }))}
                    placeholder="https://your-stream-url.com/stream"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="streamTitle">Stream Title</Label>
                  <Input
                    id="streamTitle"
                    value={streamSettings.streamTitle}
                    onChange={(e) => setStreamSettings(prev => ({ ...prev, streamTitle: e.target.value }))}
                    placeholder="Radio Station Name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="streamDescription">Stream Description</Label>
                <Textarea
                  id="streamDescription"
                  value={streamSettings.streamDescription}
                  onChange={(e) => setStreamSettings(prev => ({ ...prev, streamDescription: e.target.value }))}
                  placeholder="Describe your radio station..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audio Quality Settings</CardTitle>
              <CardDescription>Configure audio streaming quality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxBitrate">Maximum Bitrate</Label>
                  <select
                    id="maxBitrate"
                    value={streamSettings.maxBitrate}
                    onChange={(e) => setStreamSettings(prev => ({ ...prev, maxBitrate: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="64">64 kbps</option>
                    <option value="128">128 kbps</option>
                    <option value="192">192 kbps</option>
                    <option value="256">256 kbps</option>
                    <option value="320">320 kbps</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audioQuality">Audio Quality</Label>
                  <select
                    id="audioQuality"
                    value={streamSettings.audioQuality}
                    onChange={(e) => setStreamSettings(prev => ({ ...prev, audioQuality: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="low">Low Quality</option>
                    <option value="medium">Medium Quality</option>
                    <option value="high">High Quality</option>
                    <option value="ultra">Ultra Quality</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Settings</CardTitle>
              <CardDescription>Enable or disable radio features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Live Chat</Label>
                  <p className="text-sm text-gray-500">Allow listeners to chat during live streams</p>
                </div>
                <Switch
                  checked={streamSettings.enableChat}
                  onCheckedChange={(checked) => setStreamSettings(prev => ({ ...prev, enableChat: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Song Requests</Label>
                  <p className="text-sm text-gray-500">Allow listeners to request songs</p>
                </div>
                <Switch
                  checked={streamSettings.enableRequests}
                  onCheckedChange={(checked) => setStreamSettings(prev => ({ ...prev, enableRequests: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto Start Stream</Label>
                  <p className="text-sm text-gray-500">Automatically start stream on server restart</p>
                </div>
                <Switch
                  checked={streamSettings.autoStart}
                  onCheckedChange={(checked) => setStreamSettings(prev => ({ ...prev, autoStart: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stream Analytics</CardTitle>
              <CardDescription>Monitor your radio stream performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Total Stream Time</Label>
                  <div className="text-2xl font-bold">847h 32m</div>
                  <p className="text-xs text-gray-500">This month</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Average Listeners</Label>
                  <div className="text-2xl font-bold">43</div>
                  <p className="text-xs text-gray-500">Per hour</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Peak Hour</Label>
                  <div className="text-2xl font-bold">7-8 PM</div>
                  <p className="text-xs text-gray-500">89 listeners</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
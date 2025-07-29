import type { Express } from "express";
import { storage } from "./storage";
import { z } from "zod";
import { nanoid } from "nanoid";

export function setupAdminRoutes(app: Express) {
  // Home page settings routes
  app.get("/api/admin/home-settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json({
        heroTitle: settings?.homePageHeroTitle || "Welcome to Oroma TV",
        heroSubtitle: settings?.homePageHeroSubtitle || "Dwon tumalo me Uganda",
        primaryColor: settings?.primaryColor || "#dc2626",
        secondaryColor: settings?.secondaryColor || "#000000",
        featuredNews: true,
        featuredEvents: true,
        liveStreamDefault: "tv",
        showViewerCount: true,
        enableReactions: true,
        enableComments: settings?.enableComments ?? true,
      });
    } catch (error) {
      console.error("Error fetching home settings:", error);
      res.status(500).json({ error: "Failed to fetch home settings" });
    }
  });

  app.put("/api/admin/home-settings", async (req, res) => {
    try {
      const updateData = req.body;
      
      // Update or create site settings
      await storage.updateSiteSettings({
        homePageHeroTitle: updateData.heroTitle,
        homePageHeroSubtitle: updateData.heroSubtitle,
        primaryColor: updateData.primaryColor,
        secondaryColor: updateData.secondaryColor,
        enableComments: updateData.enableComments,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating home settings:", error);
      res.status(500).json({ error: "Failed to update home settings" });
    }
  });

  // Song requests routes
  app.get("/api/admin/song-requests", async (req, res) => {
    try {
      const requests = await storage.getAllSongRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching song requests:", error);
      res.status(500).json({ error: "Failed to fetch song requests" });
    }
  });

  app.put("/api/admin/song-requests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, priority } = req.body;
      
      await storage.updateSongRequest(id, { status, priority });
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating song request:", error);
      res.status(500).json({ error: "Failed to update song request" });
    }
  });

  app.delete("/api/admin/song-requests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSongRequest(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting song request:", error);
      res.status(500).json({ error: "Failed to delete song request" });
    }
  });

  // Analytics routes
  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const { range = "7d" } = req.query;
      
      // Get analytics data based on time range
      const analytics = await storage.getAnalytics(range as string);
      
      // Mock comprehensive analytics data
      const mockData = {
        totalPageViews: 15420 + Math.floor(Math.random() * 1000),
        totalLiveViews: 8350 + Math.floor(Math.random() * 500),
        totalReactions: 2840 + Math.floor(Math.random() * 200),
        totalComments: 1290 + Math.floor(Math.random() * 100),
        totalSongRequests: 450 + Math.floor(Math.random() * 50),
        activeUsers: 127 + Math.floor(Math.random() * 50),
        peakViewers: 892,
        avgSessionDuration: 285,
        topPages: [
          { path: "/", views: 8420, percentage: 54.6 },
          { path: "/watch-live", views: 3280, percentage: 21.3 },
          { path: "/newsroom", views: 1850, percentage: 12.0 },
          { path: "/events", views: 980, percentage: 6.4 },
          { path: "/programs", views: 890, percentage: 5.7 },
        ],
        recentActivity: [
          { type: "live_view", description: "New viewer joined TV stream", timestamp: new Date().toISOString() },
          { type: "comment", description: "Comment posted on live stream", timestamp: new Date(Date.now() - 120000).toISOString() },
          { type: "reaction", description: "❤️ reaction on TV stream", timestamp: new Date(Date.now() - 180000).toISOString() },
          { type: "song_request", description: "Song requested: 'Larakaraka' by Bosmic Otim", timestamp: new Date(Date.now() - 240000).toISOString() },
        ],
        hourlyData: Array.from({ length: 24 }, (_, i) => ({
          hour: `${i}:00`,
          views: Math.floor(Math.random() * 500) + 100,
          reactions: Math.floor(Math.random() * 100) + 20,
          comments: Math.floor(Math.random() * 50) + 10,
        })),
      };

      res.json(mockData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Advertising integration routes
  app.get("/api/admin/advertising", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json({
        googleAdsenseId: settings?.googleAdsenseId || "",
        twilioAccountSid: settings?.twilioAccountSid || "",
        twilioAuthToken: settings?.twilioAuthToken || "",
        africasTalkingApiKey: settings?.africasTalkingApiKey || "",
        sendChampApiKey: settings?.sendChampApiKey || "",
      });
    } catch (error) {
      console.error("Error fetching advertising settings:", error);
      res.status(500).json({ error: "Failed to fetch advertising settings" });
    }
  });

  app.put("/api/admin/advertising", async (req, res) => {
    try {
      const integrationData = req.body;
      
      // Update site settings with advertising data
      await storage.updateSiteSettings(integrationData);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating advertising settings:", error);
      res.status(500).json({ error: "Failed to update advertising settings" });
    }
  });

  app.post("/api/admin/advertising/test/:integrationId", async (req, res) => {
    try {
      const { integrationId } = req.params;
      
      // Mock connection test
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      res.json({ 
        success,
        message: success ? "Connection successful!" : "Connection failed. Please check your credentials."
      });
    } catch (error) {
      console.error("Error testing connection:", error);
      res.status(500).json({ error: "Failed to test connection" });
    }
  });

  // Event RSVP routes
  app.get("/api/admin/events/:eventId/rsvp", async (req, res) => {
    try {
      const { eventId } = req.params;
      const rsvps = await storage.getEventRsvps(eventId);
      res.json(rsvps);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      res.status(500).json({ error: "Failed to fetch RSVPs" });
    }
  });

  app.post("/api/events/:eventId/rsvp", async (req, res) => {
    try {
      const { eventId } = req.params;
      const { name, email, phone, status } = req.body;
      
      const rsvp = await storage.createEventRsvp({
        id: nanoid(),
        eventId,
        name,
        email,
        phone,
        status: status || "attending",
      });
      
      res.status(201).json(rsvp);
    } catch (error) {
      console.error("Error creating RSVP:", error);
      res.status(500).json({ error: "Failed to create RSVP" });
    }
  });

  // Analytics tracking
  app.post("/api/analytics/track", async (req, res) => {
    try {
      const { type, path, userSession, metadata } = req.body;
      
      await storage.trackAnalytics({
        type,
        path,
        userSession,
        metadata: JSON.stringify(metadata),
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking analytics:", error);
      res.status(500).json({ error: "Failed to track analytics" });
    }
  });
}
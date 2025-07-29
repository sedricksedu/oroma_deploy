import type { Express } from "express";
import { storage } from "./storage";
import { sql } from "drizzle-orm";

export function registerMetricsRoutes(app: Express): void {
  
  // Get engagement metrics for the dashboard
  app.get("/api/admin/engagement-metrics", async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const currentHour = new Date().getHours();
      
      // Get current active users
      const activeUsers = await storage.getActiveUserCount('tv') + await storage.getActiveUserCount('radio');
      
      // Get total viewers/listeners from sessions (last 24 hours)
      const tvUsers = await storage.getActiveUserCount('tv');
      const radioUsers = await storage.getActiveUserCount('radio');
      
      // Get interaction counts
      const totalReactions = await storage.getTotalReactions();
      const totalComments = await storage.getTotalComments();
      const totalSongRequests = await storage.getTotalSongRequests();
      
      // Calculate engagement rate
      const totalInteractions = totalReactions + totalComments + totalSongRequests;
      const totalUsers = Math.max(tvUsers + radioUsers, 1); // Avoid division by zero
      const engagementRate = (totalInteractions / totalUsers) * 100;
      
      // Get peak viewers (mock data for now, would need to track this over time)
      const peakViewers = Math.max(tvUsers * 1.5, 5);
      const peakListeners = Math.max(radioUsers * 1.5, 3);
      
      // Get hourly data (mock data for demonstration)
      const hourlyViewers = [];
      for (let i = 0; i < 24; i++) {
        hourlyViewers.push({
          hour: `${i}:00`,
          tv: Math.floor(Math.random() * 20) + (i === currentHour ? tvUsers : 0),
          radio: Math.floor(Math.random() * 15) + (i === currentHour ? radioUsers : 0)
        });
      }
      
      // Get top reactions
      const topReactions = await storage.getTopReactions();
      
      const metrics = {
        totalViewers: tvUsers,
        totalListeners: radioUsers,
        peakViewers: Math.floor(peakViewers),
        peakListeners: Math.floor(peakListeners),
        avgSessionTime: 12, // Average session time in minutes (would calculate from actual data)
        totalReactions,
        totalComments,
        totalSongRequests,
        topReactions,
        hourlyViewers,
        engagementRate: Math.round(engagementRate * 100) / 100,
        activeUsers,
        bounceRate: 25 // Would calculate from actual session data
      };
      
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching engagement metrics:", error);
      res.status(500).json({ error: "Failed to fetch engagement metrics" });
    }
  });
  
  // Get content performance metrics
  app.get("/api/admin/content-metrics", async (req, res) => {
    try {
      // Get news views
      const newsViews = await storage.getTotalNewsViews();
      
      // Get program views (mock data)
      const programViews = Math.floor(Math.random() * 500) + 200;
      
      // Get event RSVPs
      const eventRSVPs = await storage.getTotalEventRsvps();
      
      // Get popular content
      const popularContent = await storage.getPopularContent();
      
      const contentMetrics = {
        newsViews,
        programViews,
        eventRSVPs,
        popularContent
      };
      
      res.json(contentMetrics);
    } catch (error) {
      console.error("Error fetching content metrics:", error);
      res.status(500).json({ error: "Failed to fetch content metrics" });
    }
  });
  
  // Real-time analytics endpoint
  app.get("/api/admin/analytics/realtime", async (req, res) => {
    try {
      const activeUsers = await storage.getActiveUserCount('tv') + await storage.getActiveUserCount('radio');
      const recentComments = await storage.getRecentComments(10);
      const recentReactions = await storage.getRecentReactions(10);
      const recentSongRequests = await storage.getRecentSongRequests(5);
      
      res.json({
        activeUsers,
        recentComments,
        recentReactions,
        recentSongRequests,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error fetching real-time analytics:", error);
      res.status(500).json({ error: "Failed to fetch real-time analytics" });
    }
  });
}
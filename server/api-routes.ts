import type { Express } from "express";
import { storage } from "./storage";
import { 
  insertSongRequestSchema, 
  insertLiveReactionSchema, 
  insertActiveUserSchema, 
  insertLiveCommentSchema
} from "./shared/schema";
import { randomUUID } from "crypto";

export function setupApiRoutes(app: Express) {
  // Song Requests
  app.get("/api/song-requests", async (req, res) => {
    try {
      const { streamType } = req.query;
      const requests = await storage.getSongRequests(streamType as string);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching song requests:", error);
      res.status(500).json({ error: "Failed to fetch song requests" });
    }
  });

  app.post("/api/song-requests", async (req, res) => {
    try {
      const data = insertSongRequestSchema.parse(req.body);
      const request = await storage.createSongRequest(data);
      res.status(201).json(request);
    } catch (error) {
      console.error("Error creating song request:", error);
      res.status(400).json({ error: "Invalid song request data" });
    }
  });

  app.patch("/api/song-requests/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await storage.updateSongRequestStatus(id, status);
      res.json(updated);
    } catch (error) {
      console.error("Error updating song request status:", error);
      res.status(500).json({ error: "Failed to update song request" });
    }
  });

  // Live Reactions
  app.get("/api/live-reactions/:streamType", async (req, res) => {
    try {
      const { streamType } = req.params;
      const { limit } = req.query;
      const reactions = await storage.getLiveReactions(streamType, limit ? parseInt(limit as string) : undefined);
      res.json(reactions);
    } catch (error) {
      console.error("Error fetching live reactions:", error);
      res.status(500).json({ error: "Failed to fetch reactions" });
    }
  });

  app.post("/api/live-reactions", async (req, res) => {
    try {
      const data = insertLiveReactionSchema.parse(req.body);
      // Generate user session if not provided
      if (!data.userSession) {
        (data as any).userSession = req.sessionID || randomUUID();
      }
      const reaction = await storage.createLiveReaction(data);
      res.status(201).json(reaction);
    } catch (error) {
      console.error("Error creating live reaction:", error);
      res.status(400).json({ error: "Invalid reaction data" });
    }
  });

  // Active Users - Track real-time viewers
  app.post("/api/active-users/join", async (req, res) => {
    try {
      const { streamType } = req.body;
      const userSession = req.sessionID || randomUUID();
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');

      const userData = {
        userSession,
        streamType,
        ipAddress,
        userAgent,
        isWatching: true,
      };

      const user = await storage.joinStream(userData);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error joining stream:", error);
      res.status(400).json({ error: "Failed to join stream" });
    }
  });

  app.post("/api/active-users/leave", async (req, res) => {
    try {
      const { streamType } = req.body;
      const userSession = req.sessionID || randomUUID();
      
      await storage.leaveStream(userSession, streamType);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error leaving stream:", error);
      res.status(400).json({ error: "Failed to leave stream" });
    }
  });

  app.post("/api/active-users/heartbeat", async (req, res) => {
    try {
      const { streamType } = req.body;
      const userSession = req.sessionID || randomUUID();
      
      await storage.updateViewerHeartbeat(userSession, streamType);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error updating heartbeat:", error);
      res.status(400).json({ error: "Failed to update heartbeat" });
    }
  });

  app.get("/api/active-users/count/:streamType", async (req, res) => {
    try {
      const { streamType } = req.params;
      const count = await storage.getActiveUserCount(streamType);
      res.json({ count });
    } catch (error) {
      console.error("Error getting active user count:", error);
      res.status(500).json({ error: "Failed to get user count" });
    }
  });

  // Live Comments
  app.get("/api/live-comments/:streamType", async (req, res) => {
    try {
      const { streamType } = req.params;
      const { limit } = req.query;
      const comments = await storage.getLiveComments(streamType, limit ? parseInt(limit as string) : undefined);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching live comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  app.post("/api/live-comments", async (req, res) => {
    try {
      const data = insertLiveCommentSchema.parse(req.body);
      // Generate user session if not provided
      if (!data.userSession) {
        (data as any).userSession = req.sessionID || randomUUID();
      }
      const comment = await storage.createLiveComment(data);
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating live comment:", error);
      res.status(400).json({ error: "Invalid comment data" });
    }
  });

  // Admin Site Settings Management
  app.get("/api/admin/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching site settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/admin/settings", async (req, res) => {
    try {
      const data = insertSiteSettingSchema.parse(req.body);
      const setting = await storage.createSiteSetting(data);
      res.status(201).json(setting);
    } catch (error) {
      console.error("Error creating site setting:", error);
      res.status(400).json({ error: "Invalid setting data" });
    }
  });

  app.put("/api/admin/settings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const setting = await storage.updateSiteSetting(id, req.body);
      res.json(setting);
    } catch (error) {
      console.error("Error updating site setting:", error);
      res.status(400).json({ error: "Failed to update setting" });
    }
  });

  app.delete("/api/admin/settings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSiteSetting(id);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting site setting:", error);
      res.status(500).json({ error: "Failed to delete setting" });
    }
  });

  // Admin Blog Management
  app.get("/api/admin/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/admin/blog", async (req, res) => {
    try {
      const data = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(data);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(400).json({ error: "Invalid blog post data" });
    }
  });

  app.put("/api/admin/blog/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const post = await storage.updateBlogPost(id, req.body);
      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(400).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteBlogPost(id);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // Admin Stream Management
  app.get("/api/admin/streams", async (req, res) => {
    try {
      const streams = await storage.getStreamSessions();
      res.json(streams);
    } catch (error) {
      console.error("Error fetching stream sessions:", error);
      res.status(500).json({ error: "Failed to fetch stream sessions" });
    }
  });

  app.post("/api/admin/streams", async (req, res) => {
    try {
      const data = insertStreamSessionSchema.parse(req.body);
      const stream = await storage.createStreamSession(data);
      res.status(201).json(stream);
    } catch (error) {
      console.error("Error creating stream session:", error);
      res.status(400).json({ error: "Invalid stream session data" });
    }
  });

  app.put("/api/admin/streams/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const stream = await storage.updateStreamSession(id, req.body);
      res.json(stream);
    } catch (error) {
      console.error("Error updating stream session:", error);
      res.status(400).json({ error: "Failed to update stream session" });
    }
  });

  app.put("/api/admin/streams/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const stream = await storage.updateStreamSession(id, { status });
      res.json(stream);
    } catch (error) {
      console.error("Error updating stream status:", error);
      res.status(400).json({ error: "Failed to update stream status" });
    }
  });

  app.delete("/api/admin/streams/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteStreamSession(id);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting stream session:", error);
      res.status(500).json({ error: "Failed to delete stream session" });
    }
  });

  // Event Participants and Proposals
  app.get("/api/admin/event-participants", async (req, res) => {
    try {
      const participants = await storage.getEventParticipants();
      res.json(participants);
    } catch (error) {
      console.error("Error fetching event participants:", error);
      res.status(500).json({ error: "Failed to fetch event participants" });
    }
  });

  app.get("/api/admin/event-proposals", async (req, res) => {
    try {
      const proposals = await storage.getEventProposals();
      res.json(proposals);
    } catch (error) {
      console.error("Error fetching event proposals:", error);
      res.status(500).json({ error: "Failed to fetch event proposals" });
    }
  });

  app.post("/api/admin/event-proposals", async (req, res) => {
    try {
      const data = insertEventProposalSchema.parse(req.body);
      const proposal = await storage.createEventProposal(data);
      res.status(201).json(proposal);
    } catch (error) {
      console.error("Error creating event proposal:", error);
      res.status(400).json({ error: "Invalid event proposal data" });
    }
  });

  app.put("/api/admin/event-proposals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const proposal = await storage.updateEventProposal(id, req.body);
      res.json(proposal);
    } catch (error) {
      console.error("Error updating event proposal:", error);
      res.status(400).json({ error: "Failed to update event proposal" });
    }
  });

  // User Session Management for Comments/Reactions
  app.post("/api/user-sessions", async (req, res) => {
    try {
      const data = insertUserSessionSchema.parse(req.body);
      const session = await storage.createUserSession(data);
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating user session:", error);
      res.status(400).json({ error: "Invalid user session data" });
    }
  });

  app.get("/api/user-sessions/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const session = await storage.getUserSession(token);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error fetching user session:", error);
      res.status(500).json({ error: "Failed to fetch user session" });
    }
  });

  // Cleanup inactive users periodically
  setInterval(async () => {
    try {
      await storage.cleanupInactiveUsers();
    } catch (error) {
      console.error("Error cleaning up inactive users:", error);
    }
  }, 5 * 60 * 1000); // Clean up every 5 minutes
}
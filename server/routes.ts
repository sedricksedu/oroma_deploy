import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema, 
  insertSubscriberSchema, 
  insertNewsSchema,
  insertProgramSchema,
  insertEventSchema,
  insertCommentSchema,
  insertInterviewRequestSchema,
  insertProgramProposalSchema
} from "./shared/schema";
import { z } from "zod";
import { setupAuth, initializeAdminUser } from "./auth";
import { setupApiRoutes } from "./api-routes";
import { setupAdminRoutes } from "./admin-routes";
import { registerMetricsRoutes } from "./metrics-routes";

// Auth middleware
function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize authentication
  setupAuth(app);
  await initializeAdminUser();
  
  // Setup API routes for live features
  setupApiRoutes(app);
  
  // Setup comprehensive admin routes
  setupAdminRoutes(app);
  
  // Setup metrics routes for engagement dashboard
  registerMetricsRoutes(app);
  
  // Analytics endpoints for dashboard
  app.get("/api/analytics/overview", async (req, res) => {
    try {
      // Return empty analytics for now - will be populated with real data
      res.json({
        totalViews: 0,
        dailyViews: 0,
        monthlyGrowth: 0,
        totalComments: 0,
        engagement: 0
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics overview" });
    }
  });

  app.get("/api/analytics/top-shows", async (req, res) => {
    try {
      // Return empty for now - will be populated with real view data
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch top shows" });
    }
  });
  // Get all programs
  app.get("/api/programs", async (req, res) => {
    try {
      const programs = await storage.getPrograms();
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  // Get programs by category
  app.get("/api/programs/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const programs = await storage.getProgramsByCategory(category);
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch programs by category" });
    }
  });

  // Get all news
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  // Get news by category
  app.get("/api/news/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const news = await storage.getNewsByCategory(category);
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news by category" });
    }
  });

  // Get single news article by ID and increment view count
  app.get("/api/news/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.getNewsById(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      // Increment view count
      await storage.incrementNewsViews(id);
      
      // Return article with updated view count
      const updatedArticle = await storage.getNewsById(id);
      res.json(updatedArticle);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  // Get single news article and increment views
  app.get("/api/news/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const news = await storage.getNewsById(id);
      if (!news) {
        return res.status(404).json({ message: "News article not found" });
      }
      
      // Increment views
      await storage.incrementNewsViews(id);
      
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news article" });
    }
  });

  // Get all events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // Create contact submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json({ message: "Contact form submitted successfully", id: contact.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid form data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Individual news article with view tracking
  app.get("/api/news/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.getNewsById(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      // Increment view count
      await storage.incrementNewsViews(id);
      
      // Return article with updated view count
      res.json({ ...article, views: (article.views || 0) + 1 });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  // Create newsletter subscription
  app.post("/api/subscribe", async (req, res) => {
    try {
      const validatedData = insertSubscriberSchema.parse(req.body);
      const subscriber = await storage.createSubscriber(validatedData);
      res.status(201).json({ message: "Successfully subscribed to newsletter", id: subscriber.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid email address", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Interview request submission
  app.post("/api/interview-requests", async (req, res) => {
    try {
      const validatedData = insertInterviewRequestSchema.parse(req.body);
      const request = await storage.createInterviewRequest(validatedData);
      res.status(201).json({ message: "Interview request submitted successfully", id: request.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit interview request" });
    }
  });

  // Program proposal submission
  app.post("/api/program-proposals", async (req, res) => {
    try {
      const validatedData = insertProgramProposalSchema.parse(req.body);
      const proposal = await storage.createProgramProposal(validatedData);
      res.status(201).json({ message: "Program proposal submitted successfully", id: proposal.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid proposal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit program proposal" });
    }
  });

  // Comment routes
  app.get("/api/news/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;
      const comments = await storage.getCommentsByNewsId(id);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/news/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertCommentSchema.parse({
        ...req.body,
        newsId: id
      });
      const comment = await storage.createComment(validatedData);
      res.status(201).json({ message: "Comment submitted for approval", id: comment.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit comment" });
    }
  });

  // Admin routes (require authentication)
  app.post("/api/admin/news", requireAuth, async (req, res) => {
    try {
      const validatedData = insertNewsSchema.parse(req.body);
      const news = await storage.createNews(validatedData);
      res.status(201).json({ message: "News article created", news });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid news data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create news article" });
    }
  });

  app.put("/api/admin/news/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertNewsSchema.partial().parse(req.body);
      const news = await storage.updateNews(id, validatedData);
      res.json({ message: "News article updated", news });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid news data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update news article" });
    }
  });

  app.post("/api/admin/programs", requireAuth, async (req, res) => {
    try {
      const validatedData = insertProgramSchema.parse(req.body);
      const program = await storage.createProgram(validatedData);
      res.status(201).json({ message: "Program created", program });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid program data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create program" });
    }
  });

  app.put("/api/admin/programs/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertProgramSchema.partial().parse(req.body);
      const program = await storage.updateProgram(id, validatedData);
      res.json({ message: "Program updated", program });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid program data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update program" });
    }
  });

  app.post("/api/admin/events", requireAuth, async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json({ message: "Event created", event });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  app.put("/api/admin/events/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(id, validatedData);
      res.json({ message: "Event updated", event });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  app.put("/api/admin/comments/:id/approve", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.approveComment(id);
      res.json({ message: "Comment approved" });
    } catch (error) {
      res.status(500).json({ message: "Failed to approve comment" });
    }
  });

  // Interview Request Routes
  app.post("/api/interview-requests", async (req, res) => {
    try {
      const validatedData = insertInterviewRequestSchema.parse(req.body);
      const request = await storage.createInterviewRequest(validatedData);
      res.status(201).json({ message: "Interview request submitted successfully", request });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit interview request" });
    }
  });

  app.get("/api/admin/interview-requests", requireAuth, async (req, res) => {
    try {
      const requests = await storage.getInterviewRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interview requests" });
    }
  });

  app.put("/api/admin/interview-requests/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const request = await storage.updateInterviewRequest(id, updateData);
      res.json({ message: "Interview request updated", request });
    } catch (error) {
      res.status(500).json({ message: "Failed to update interview request" });
    }
  });

  // Program Proposal Routes
  app.post("/api/program-proposals", async (req, res) => {
    try {
      const validatedData = insertProgramProposalSchema.parse(req.body);
      const proposal = await storage.createProgramProposal(validatedData);
      res.status(201).json({ message: "Program proposal submitted successfully", proposal });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid proposal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit program proposal" });
    }
  });

  app.get("/api/admin/program-proposals", requireAuth, async (req, res) => {
    try {
      const proposals = await storage.getProgramProposals();
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch program proposals" });
    }
  });

  app.put("/api/admin/program-proposals/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const proposal = await storage.updateProgramProposal(id, updateData);
      res.json({ message: "Program proposal updated", proposal });
    } catch (error) {
      res.status(500).json({ message: "Failed to update program proposal" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

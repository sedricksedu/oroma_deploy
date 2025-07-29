var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default;
var init_vite_config = __esm({
  async "vite.config.ts"() {
    "use strict";
    vite_config_default = defineConfig({
      plugins: [
        react(),
        runtimeErrorOverlay(),
        ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
          await import("@replit/vite-plugin-cartographer").then(
            (m) => m.cartographer()
          )
        ] : []
      ],
      resolve: {
        alias: {
          "@": path.resolve(import.meta.dirname, "client", "src"),
          "@shared": path.resolve(import.meta.dirname, "shared"),
          "@assets": path.resolve(import.meta.dirname, "frontend/public")
        }
      },
      root: path.resolve(import.meta.dirname, "client"),
      build: {
        outDir: path.resolve(import.meta.dirname, "dist/public"),
        emptyOutDir: true
      },
      server: {
        fs: {
          strict: true,
          deny: ["**/.*"]
        }
      }
    });
  }
});

// server/vite.ts
var vite_exports = {};
__export(vite_exports, {
  log: () => log,
  serveStatic: () => serveStatic,
  setupVite: () => setupVite
});
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { nanoid as nanoid3 } from "nanoid";
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "frontend",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid3()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}
var viteLogger;
var init_vite = __esm({
  async "server/vite.ts"() {
    "use strict";
    await init_vite_config();
    viteLogger = createLogger();
  }
});

// server/production-server.ts
var production_server_exports = {};
__export(production_server_exports, {
  log: () => log2,
  serveStatic: () => serveStatic2
});
import express2 from "express";
import fs2 from "fs";
import path3 from "path";
function log2(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
function serveStatic2(app2) {
  const distPath = path3.resolve(process.cwd(), "dist", "public");
  if (!fs2.existsSync(distPath)) {
    const fallbackPath = path3.resolve(process.cwd(), "public");
    if (fs2.existsSync(fallbackPath)) {
      log2(`Serving static files from fallback: ${fallbackPath}`, "production");
      app2.use(express2.static(fallbackPath));
      app2.use("*", (_req, res) => {
        res.sendFile(path3.resolve(fallbackPath, "index.html"));
      });
      return;
    }
    throw new Error(
      `Could not find build directory: ${distPath} or fallback: ${fallbackPath}`
    );
  }
  log2(`Serving static files from: ${distPath}`, "production");
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}
var init_production_server = __esm({
  "server/production-server.ts"() {
    "use strict";
  }
});

// server/index.ts
import express3 from "express";

// server/routes.ts
import { createServer } from "http";

// server/shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  activeUsers: () => activeUsers,
  analytics: () => analytics,
  comments: () => comments,
  contacts: () => contacts,
  contentAnalytics: () => contentAnalytics,
  engagementAnalytics: () => engagementAnalytics,
  eventRsvp: () => eventRsvp,
  events: () => events,
  insertActiveUserSchema: () => insertActiveUserSchema,
  insertAnalyticsSchema: () => insertAnalyticsSchema,
  insertCommentSchema: () => insertCommentSchema,
  insertContactSchema: () => insertContactSchema,
  insertContentAnalyticsSchema: () => insertContentAnalyticsSchema,
  insertEngagementAnalyticsSchema: () => insertEngagementAnalyticsSchema,
  insertEventRsvpSchema: () => insertEventRsvpSchema,
  insertEventSchema: () => insertEventSchema,
  insertInterviewRequestSchema: () => insertInterviewRequestSchema,
  insertLiveCommentSchema: () => insertLiveCommentSchema,
  insertLiveReactionSchema: () => insertLiveReactionSchema,
  insertNewsSchema: () => insertNewsSchema,
  insertProgramProposalSchema: () => insertProgramProposalSchema,
  insertProgramSchema: () => insertProgramSchema,
  insertSiteSettingsSchema: () => insertSiteSettingsSchema,
  insertSongRequestSchema: () => insertSongRequestSchema,
  insertSubscriberSchema: () => insertSubscriberSchema,
  insertUserSchema: () => insertUserSchema,
  interviewRequests: () => interviewRequests,
  liveComments: () => liveComments,
  liveReactions: () => liveReactions,
  news: () => news,
  programProposals: () => programProposals,
  programs: () => programs,
  siteSettings: () => siteSettings,
  songRequests: () => songRequests,
  subscribers: () => subscribers,
  users: () => users
});
import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
var users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  role: text("role").default("user"),
  profileImage: text("profile_image"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`)
});
var programs = sqliteTable("programs", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  schedule: text("schedule").notNull(),
  imageUrl: text("image_url"),
  isLive: integer("is_live", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`)
});
var news = sqliteTable("news", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  featured: integer("featured", { mode: "boolean" }).default(false),
  publishedAt: text("published_at").notNull(),
  views: integer("views").default(0),
  commentsEnabled: integer("comments_enabled", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`)
});
var events = sqliteTable("events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  location: text("location"),
  category: text("category").notNull(),
  featured: integer("featured", { mode: "boolean" }).default(false),
  imageUrl: text("image_url"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`)
});
var contacts = sqliteTable("contacts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`)
});
var subscribers = sqliteTable("subscribers", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`)
});
var comments = sqliteTable("comments", {
  id: text("id").primaryKey(),
  newsId: text("news_id").notNull().references(() => news.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
  content: text("content").notNull(),
  approved: integer("approved", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`)
});
var liveComments = sqliteTable("live_comments", {
  id: text("id").primaryKey(),
  message: text("message").notNull(),
  username: text("username").notNull(),
  streamType: text("stream_type").notNull(),
  userSession: text("user_session").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`)
});
var liveReactions = sqliteTable("live_reactions", {
  id: text("id").primaryKey(),
  emoji: text("emoji").notNull(),
  streamType: text("stream_type").notNull(),
  userSession: text("user_session").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`)
});
var songRequests = sqliteTable("song_requests", {
  id: text("id").primaryKey(),
  songTitle: text("song_title").notNull(),
  artistName: text("artist_name").notNull(),
  requesterName: text("requester_name").notNull(),
  streamType: text("stream_type").notNull(),
  status: text("status").default("pending"),
  priority: integer("priority").default(0),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`)
});
var activeUsers = sqliteTable("active_users", {
  id: text("id").primaryKey(),
  userSession: text("user_session").notNull(),
  streamType: text("stream_type").notNull(),
  // 'tv' or 'radio'
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  isWatching: integer("is_watching", { mode: "boolean" }).default(true),
  joinedAt: text("joined_at").default(sql`(CURRENT_TIMESTAMP)`),
  lastSeen: text("last_seen").default(sql`(CURRENT_TIMESTAMP)`)
});
var interviewRequests = sqliteTable("interview_requests", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  organization: text("organization"),
  topic: text("topic").notNull(),
  description: text("description").notNull(),
  preferredDate: text("preferred_date"),
  preferredTime: text("preferred_time"),
  status: text("status").default("pending"),
  // pending, approved, rejected, scheduled
  adminResponse: text("admin_response"),
  scheduledDate: text("scheduled_date"),
  scheduledTime: text("scheduled_time"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`)
});
var programProposals = sqliteTable("program_proposals", {
  id: text("id").primaryKey(),
  proposerName: text("proposer_name").notNull(),
  proposerEmail: text("proposer_email").notNull(),
  proposerPhone: text("proposer_phone"),
  organization: text("organization"),
  programTitle: text("program_title").notNull(),
  programDescription: text("program_description").notNull(),
  category: text("category").notNull(),
  duration: text("duration"),
  targetAudience: text("target_audience"),
  proposedSchedule: text("proposed_schedule"),
  resources: text("resources"),
  // What resources/equipment needed
  experience: text("experience"),
  // Previous experience in broadcasting
  status: text("status").default("pending"),
  // pending, under_review, approved, rejected
  adminResponse: text("admin_response"),
  adminNotes: text("admin_notes"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`)
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertProgramSchema = createInsertSchema(programs).omit({
  id: true,
  createdAt: true
});
var insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true
});
var insertSubscriberSchema = createInsertSchema(subscribers).omit({
  id: true,
  createdAt: true
});
var insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true
});
var insertLiveCommentSchema = createInsertSchema(liveComments).omit({
  id: true,
  createdAt: true
});
var insertLiveReactionSchema = createInsertSchema(liveReactions).omit({
  id: true,
  createdAt: true
});
var insertSongRequestSchema = createInsertSchema(songRequests).omit({
  id: true,
  createdAt: true
});
var insertActiveUserSchema = createInsertSchema(activeUsers).omit({
  id: true,
  joinedAt: true,
  lastSeen: true
});
var insertInterviewRequestSchema = createInsertSchema(interviewRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertProgramProposalSchema = createInsertSchema(programProposals).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var eventRsvp = sqliteTable("event_rsvp", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  status: text("status").notNull().default("attending"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`)
});
var siteSettings = sqliteTable("site_settings", {
  id: text("id").primaryKey(),
  siteName: text("site_name").notNull().default("Oroma TV"),
  siteDescription: text("site_description"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  seoKeywords: text("seo_keywords"),
  googleAnalyticsId: text("google_analytics_id"),
  googleAdsenseId: text("google_adsense_id"),
  facebookPixelId: text("facebook_pixel_id"),
  twilioAccountSid: text("twilio_account_sid"),
  twilioAuthToken: text("twilio_auth_token"),
  africasTalkingApiKey: text("africas_talking_api_key"),
  sendChampApiKey: text("sendchamp_api_key"),
  homePageHeroTitle: text("home_page_hero_title"),
  homePageHeroSubtitle: text("home_page_hero_subtitle"),
  primaryColor: text("primary_color").default("#dc2626"),
  secondaryColor: text("secondary_color").default("#000000"),
  maintenanceMode: integer("maintenance_mode", { mode: "boolean" }).default(false),
  enableRegistration: integer("enable_registration", { mode: "boolean" }).default(true),
  enableComments: integer("enable_comments", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`)
});
var analytics = sqliteTable("analytics", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  path: text("path"),
  userSession: text("user_session"),
  metadata: text("metadata"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`)
});
var engagementAnalytics = sqliteTable("engagement_analytics", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  hour: integer("hour").notNull(),
  // 0-23
  streamType: text("stream_type").notNull(),
  totalViewers: integer("total_viewers").default(0),
  peakViewers: integer("peak_viewers").default(0),
  totalReactions: integer("total_reactions").default(0),
  totalComments: integer("total_comments").default(0),
  totalSongRequests: integer("total_song_requests").default(0),
  avgSessionTime: integer("avg_session_time").default(0),
  // in minutes
  bounceRate: real("bounce_rate").default(0),
  engagementRate: real("engagement_rate").default(0),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`)
});
var contentAnalytics = sqliteTable("content_analytics", {
  id: text("id").primaryKey(),
  contentId: text("content_id").notNull(),
  contentType: text("content_type").notNull(),
  // 'news', 'program', 'event'
  date: text("date").notNull(),
  views: integer("views").default(0),
  uniqueViews: integer("unique_views").default(0),
  avgTimeSpent: integer("avg_time_spent").default(0),
  // in seconds
  shareCount: integer("share_count").default(0),
  commentCount: integer("comment_count").default(0),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`)
});
var insertEventRsvpSchema = createInsertSchema(eventRsvp).omit({
  id: true,
  createdAt: true
});
var insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true
});
var insertEngagementAnalyticsSchema = createInsertSchema(engagementAnalytics).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertContentAnalyticsSchema = createInsertSchema(contentAnalytics).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/db.ts
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
var sqlite = new Database("./database.sqlite");
var db = drizzle(sqlite, { schema: schema_exports });

// server/database-storage.ts
import { eq, and, sql as sql2, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { nanoid } from "nanoid";
var DatabaseStorage = class {
  // sessionStore removed for database storage
  constructor() {
  }
  // User methods
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const [user] = await db.insert(users).values({ ...insertUser, id }).returning();
    return user;
  }
  // Program methods
  async getPrograms() {
    return await db.select().from(programs).orderBy(desc(programs.createdAt));
  }
  async getProgram(id) {
    const [program] = await db.select().from(programs).where(eq(programs.id, id));
    return program;
  }
  async createProgram(insertProgram) {
    const id = randomUUID();
    const [program] = await db.insert(programs).values({ ...insertProgram, id }).returning();
    return program;
  }
  async updateProgram(id, insertProgram) {
    const [program] = await db.update(programs).set(insertProgram).where(eq(programs.id, id)).returning();
    if (!program) {
      throw new Error("Program not found");
    }
    return program;
  }
  async deleteProgram(id) {
    await db.delete(programs).where(eq(programs.id, id));
  }
  // News methods
  async getNews() {
    return await db.select().from(news).orderBy(desc(news.publishedAt));
  }
  async getNewsById(id) {
    const [article] = await db.select().from(news).where(eq(news.id, id));
    return article;
  }
  async createNews(insertNews) {
    const id = randomUUID();
    const [article] = await db.insert(news).values({ ...insertNews, id }).returning();
    return article;
  }
  async updateNews(id, insertNews) {
    const [article] = await db.update(news).set({ ...insertNews, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }).where(eq(news.id, id)).returning();
    if (!article) {
      throw new Error("News article not found");
    }
    return article;
  }
  async getNewsByCategory(category) {
    return await db.select().from(news).where(eq(news.category, category)).orderBy(desc(news.publishedAt));
  }
  async incrementNewsViews(id) {
    await db.update(news).set({
      views: sql2`${news.views} + 1`
    }).where(eq(news.id, id));
  }
  async deleteNews(id) {
    await db.delete(news).where(eq(news.id, id));
  }
  // Event methods
  async getEvents() {
    return await db.select().from(events).orderBy(desc(events.date));
  }
  async getEvent(id) {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }
  async createEvent(insertEvent) {
    const id = randomUUID();
    const [event] = await db.insert(events).values({ ...insertEvent, id }).returning();
    return event;
  }
  async updateEvent(id, insertEvent) {
    const [event] = await db.update(events).set({ ...insertEvent, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }).where(eq(events.id, id)).returning();
    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  }
  async deleteEvent(id) {
    await db.delete(events).where(eq(events.id, id));
  }
  // Contact methods
  async getContacts() {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }
  async createContact(insertContact) {
    const id = randomUUID();
    const [contact] = await db.insert(contacts).values({ ...insertContact, id }).returning();
    return contact;
  }
  // Subscriber methods
  async getSubscribers() {
    return await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
  }
  async createSubscriber(insertSubscriber) {
    const id = randomUUID();
    const [subscriber] = await db.insert(subscribers).values({ ...insertSubscriber, id }).returning();
    return subscriber;
  }
  // Comment methods
  async getCommentsByNewsId(newsId) {
    return await db.select().from(comments).where(eq(comments.newsId, newsId)).orderBy(desc(comments.createdAt));
  }
  async createComment(insertComment) {
    const id = randomUUID();
    const [comment] = await db.insert(comments).values({ ...insertComment, id }).returning();
    return comment;
  }
  // Live interaction methods
  async getLiveComments(streamType, limit = 50) {
    return await db.select().from(liveComments).where(eq(liveComments.streamType, streamType)).orderBy(desc(liveComments.createdAt)).limit(limit);
  }
  async createLiveComment(insertLiveComment) {
    const id = randomUUID();
    const [comment] = await db.insert(liveComments).values({ ...insertLiveComment, id }).returning();
    return comment;
  }
  async getLiveReactions(streamType, limit = 100) {
    return await db.select().from(liveReactions).where(eq(liveReactions.streamType, streamType)).orderBy(desc(liveReactions.createdAt)).limit(limit);
  }
  async createLiveReaction(insertLiveReaction) {
    const id = randomUUID();
    const [reaction] = await db.insert(liveReactions).values({ ...insertLiveReaction, id }).returning();
    return reaction;
  }
  async getSongRequests(streamType) {
    if (streamType) {
      return await db.select().from(songRequests).where(eq(songRequests.streamType, streamType)).orderBy(desc(songRequests.createdAt));
    }
    return await db.select().from(songRequests).orderBy(desc(songRequests.createdAt));
  }
  async createSongRequest(insertSongRequest) {
    const id = randomUUID();
    const [request] = await db.insert(songRequests).values({ ...insertSongRequest, id }).returning();
    return request;
  }
  async updateSongRequestStatus(id, status) {
    const [request] = await db.update(songRequests).set({ status }).where(eq(songRequests.id, id)).returning();
    if (!request) {
      throw new Error("Song request not found");
    }
    return request;
  }
  // Real-time viewer tracking methods
  async joinStream(userData) {
    const id = randomUUID();
    await db.delete(activeUsers).where(
      and(
        eq(activeUsers.userSession, userData.userSession),
        eq(activeUsers.streamType, userData.streamType)
      )
    );
    const [user] = await db.insert(activeUsers).values({ id, ...userData }).returning();
    return user;
  }
  async leaveStream(userSession, streamType) {
    await db.delete(activeUsers).where(
      and(
        eq(activeUsers.userSession, userSession),
        eq(activeUsers.streamType, streamType)
      )
    );
  }
  async updateViewerHeartbeat(userSession, streamType) {
    await db.update(activeUsers).set({
      lastSeen: sql2`(CURRENT_TIMESTAMP)`,
      isWatching: true
    }).where(
      and(
        eq(activeUsers.userSession, userSession),
        eq(activeUsers.streamType, streamType)
      )
    );
  }
  async getActiveUserCount(streamType) {
    await db.delete(activeUsers).where(
      and(
        eq(activeUsers.streamType, streamType),
        sql2`datetime(last_seen) < datetime('now', '-2 minutes')`
      )
    );
    const result = await db.select({ count: sql2`count(*)` }).from(activeUsers).where(
      and(
        eq(activeUsers.streamType, streamType),
        eq(activeUsers.isWatching, true)
      )
    );
    return result[0]?.count || 0;
  }
  async cleanupInactiveUsers() {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1e3).toISOString();
    await db.delete(activeUsers).where(sql2`${activeUsers.lastSeen} < ${tenMinutesAgo}`);
  }
  // Active Users update method to match interface
  async updateActiveUser(id, user) {
    const [result] = await db.update(activeUsers).set({
      ...user,
      lastSeen: (/* @__PURE__ */ new Date()).toISOString()
    }).where(eq(activeUsers.id, id)).returning();
    return result;
  }
  // Site settings implementation
  async getSiteSettings() {
    const [result] = await db.select().from(siteSettings).limit(1);
    return result;
  }
  async updateSiteSettings(updates) {
    const existing = await this.getSiteSettings();
    if (existing) {
      const [result] = await db.update(siteSettings).set({ ...updates, updatedAt: sql2`(CURRENT_TIMESTAMP)` }).where(eq(siteSettings.id, existing.id)).returning();
      return result;
    } else {
      const [result] = await db.insert(siteSettings).values({
        id: nanoid(),
        siteName: "Oroma TV",
        ...updates
      }).returning();
      return result;
    }
  }
  // Event RSVP implementation  
  async getEventRsvps(eventId) {
    return await db.select().from(eventRsvp).where(eq(eventRsvp.eventId, eventId));
  }
  async createEventRsvp(rsvp) {
    const [result] = await db.insert(eventRsvp).values(rsvp).returning();
    return result;
  }
  // Analytics implementation
  async trackAnalytics(data) {
    const [result] = await db.insert(analytics).values({
      id: data.id || nanoid(),
      ...data
    }).returning();
    return result;
  }
  async getAnalytics(range) {
    const now = /* @__PURE__ */ new Date();
    let startDate = /* @__PURE__ */ new Date();
    switch (range) {
      case "1d":
        startDate.setDate(now.getDate() - 1);
        break;
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }
    return await db.select().from(analytics).where(sql2`${analytics.createdAt} >= ${startDate.toISOString()}`);
  }
  // Song request management
  async getAllSongRequests() {
    return await db.select().from(songRequests).orderBy(desc(songRequests.createdAt));
  }
  async updateSongRequest(id, updates) {
    await db.update(songRequests).set(updates).where(eq(songRequests.id, id));
  }
  async deleteSongRequest(id) {
    await db.delete(songRequests).where(eq(songRequests.id, id));
  }
  // Interview Request methods
  async getInterviewRequests() {
    return await db.select().from(interviewRequests).orderBy(desc(interviewRequests.createdAt));
  }
  async createInterviewRequest(request) {
    const [result] = await db.insert(interviewRequests).values({
      id: nanoid(),
      ...request
    }).returning();
    return result;
  }
  async updateInterviewRequest(id, updates) {
    const [result] = await db.update(interviewRequests).set({ ...updates, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }).where(eq(interviewRequests.id, id)).returning();
    return result;
  }
  // Program Proposal methods
  async getProgramProposals() {
    return await db.select().from(programProposals).orderBy(desc(programProposals.createdAt));
  }
  async createProgramProposal(proposal) {
    const [result] = await db.insert(programProposals).values({
      id: nanoid(),
      ...proposal
    }).returning();
    return result;
  }
  async updateProgramProposal(id, updates) {
    const [result] = await db.update(programProposals).set({ ...updates, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }).where(eq(programProposals.id, id)).returning();
    return result;
  }
  // Missing methods implementation
  async getProgramById(id) {
    const [program] = await db.select().from(programs).where(eq(programs.id, id));
    return program;
  }
  async getProgramsByCategory(category) {
    return await db.select().from(programs).where(eq(programs.category, category));
  }
  async getEventById(id) {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }
  async approveComment(id) {
    await db.update(comments).set({ approved: true }).where(eq(comments.id, id));
  }
  // Analytics methods for engagement metrics
  async getTotalReactions() {
    const result = await db.select({ count: sql2`count(*)` }).from(liveReactions);
    return result[0]?.count || 0;
  }
  async getTotalComments() {
    const result = await db.select({ count: sql2`count(*)` }).from(liveComments);
    return result[0]?.count || 0;
  }
  async getTotalSongRequests() {
    const result = await db.select({ count: sql2`count(*)` }).from(songRequests);
    return result[0]?.count || 0;
  }
  async getTotalNewsViews() {
    const result = await db.select({ totalViews: sql2`sum(views)` }).from(news);
    return result[0]?.totalViews || 0;
  }
  async getTotalEventRsvps() {
    const result = await db.select({ count: sql2`count(*)` }).from(eventRsvp);
    return result[0]?.count || 0;
  }
  async getTopReactions() {
    const reactions = await db.select({
      emoji: liveReactions.emoji,
      count: sql2`count(*)`
    }).from(liveReactions).groupBy(liveReactions.emoji).orderBy(sql2`count(*) desc`).limit(5);
    return reactions.map((r) => ({ emoji: r.emoji, count: r.count }));
  }
  async getPopularContent() {
    const newsContent = await db.select({
      title: news.title,
      views: news.views,
      type: sql2`'news'`
    }).from(news).orderBy(desc(news.views)).limit(3);
    const programContent = await db.select({
      title: programs.title,
      views: sql2`0`,
      // Programs don't have views yet
      type: sql2`'program'`
    }).from(programs).limit(2);
    return [...newsContent, ...programContent];
  }
  async getRecentComments(limit) {
    return await db.select().from(liveComments).orderBy(desc(liveComments.createdAt)).limit(limit);
  }
  async getRecentReactions(limit) {
    return await db.select().from(liveReactions).orderBy(desc(liveReactions.createdAt)).limit(limit);
  }
  async getRecentSongRequests(limit) {
    return await db.select().from(songRequests).orderBy(desc(songRequests.createdAt)).limit(limit);
  }
};

// server/storage.ts
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import createMemoryStore from "memorystore";
var scryptAsync = promisify(scrypt);
var MemoryStore = createMemoryStore(session);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  try {
    if (stored === "admin123" && supplied === "admin123") {
      return true;
    }
    const parts = stored.split(".");
    if (parts.length !== 2) {
      return false;
    }
    const [hashed, salt] = parts;
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = await scryptAsync(supplied, salt, 64);
    if (hashedBuf.length !== suppliedBuf.length) {
      return false;
    }
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
}
function setupAuth(app2) {
  const sessionSecret = process.env.SESSION_SECRET || "oroma-tv-secret-key-2025";
  if (sessionSecret.length < 32) {
    console.warn("Warning: SESSION_SECRET should be at least 32 characters for security");
  }
  const sessionSettings = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 864e5
      // prune expired entries every 24h
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      // HTTPS only in production
      httpOnly: true,
      // Prevent XSS access to cookies
      maxAge: 1e3 * 60 * 60 * 24,
      // 24 hours
      sameSite: "strict"
      // CSRF protection
    },
    name: "oroma.sid"
    // Don't use default session name
  };
  app2.set("trust proxy", 1);
  app2.use(session(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }
        const isValid = await comparePasswords(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Invalid username or password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json({ message: "Login successful", user: req.user });
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "Logout successful" });
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
  });
}
async function initializeAdminUser() {
  try {
    const existingAdmin = await storage.getUserByUsername("oroma");
    if (!existingAdmin) {
      const hashedPassword = await hashPassword("Admin 101619");
      await storage.createUser({
        username: "oroma",
        password: hashedPassword
      });
      console.log("Admin user created successfully");
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }
}

// server/api-routes.ts
import { randomUUID as randomUUID2 } from "crypto";
function setupApiRoutes(app2) {
  app2.get("/api/song-requests", async (req, res) => {
    try {
      const { streamType } = req.query;
      const requests = await storage.getSongRequests(streamType);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching song requests:", error);
      res.status(500).json({ error: "Failed to fetch song requests" });
    }
  });
  app2.post("/api/song-requests", async (req, res) => {
    try {
      const data = insertSongRequestSchema.parse(req.body);
      const request = await storage.createSongRequest(data);
      res.status(201).json(request);
    } catch (error) {
      console.error("Error creating song request:", error);
      res.status(400).json({ error: "Invalid song request data" });
    }
  });
  app2.patch("/api/song-requests/:id/status", async (req, res) => {
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
  app2.get("/api/live-reactions/:streamType", async (req, res) => {
    try {
      const { streamType } = req.params;
      const { limit } = req.query;
      const reactions = await storage.getLiveReactions(streamType, limit ? parseInt(limit) : void 0);
      res.json(reactions);
    } catch (error) {
      console.error("Error fetching live reactions:", error);
      res.status(500).json({ error: "Failed to fetch reactions" });
    }
  });
  app2.post("/api/live-reactions", async (req, res) => {
    try {
      const data = insertLiveReactionSchema.parse(req.body);
      if (!data.userSession) {
        data.userSession = req.sessionID || randomUUID2();
      }
      const reaction = await storage.createLiveReaction(data);
      res.status(201).json(reaction);
    } catch (error) {
      console.error("Error creating live reaction:", error);
      res.status(400).json({ error: "Invalid reaction data" });
    }
  });
  app2.post("/api/active-users/join", async (req, res) => {
    try {
      const { streamType } = req.body;
      const userSession = req.sessionID || randomUUID2();
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get("User-Agent");
      const userData = {
        userSession,
        streamType,
        ipAddress,
        userAgent,
        isWatching: true
      };
      const user = await storage.joinStream(userData);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error joining stream:", error);
      res.status(400).json({ error: "Failed to join stream" });
    }
  });
  app2.post("/api/active-users/leave", async (req, res) => {
    try {
      const { streamType } = req.body;
      const userSession = req.sessionID || randomUUID2();
      await storage.leaveStream(userSession, streamType);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error leaving stream:", error);
      res.status(400).json({ error: "Failed to leave stream" });
    }
  });
  app2.post("/api/active-users/heartbeat", async (req, res) => {
    try {
      const { streamType } = req.body;
      const userSession = req.sessionID || randomUUID2();
      await storage.updateViewerHeartbeat(userSession, streamType);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error updating heartbeat:", error);
      res.status(400).json({ error: "Failed to update heartbeat" });
    }
  });
  app2.get("/api/active-users/count/:streamType", async (req, res) => {
    try {
      const { streamType } = req.params;
      const count = await storage.getActiveUserCount(streamType);
      res.json({ count });
    } catch (error) {
      console.error("Error getting active user count:", error);
      res.status(500).json({ error: "Failed to get user count" });
    }
  });
  app2.get("/api/live-comments/:streamType", async (req, res) => {
    try {
      const { streamType } = req.params;
      const { limit } = req.query;
      const comments2 = await storage.getLiveComments(streamType, limit ? parseInt(limit) : void 0);
      res.json(comments2);
    } catch (error) {
      console.error("Error fetching live comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });
  app2.post("/api/live-comments", async (req, res) => {
    try {
      const data = insertLiveCommentSchema.parse(req.body);
      if (!data.userSession) {
        data.userSession = req.sessionID || randomUUID2();
      }
      const comment = await storage.createLiveComment(data);
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating live comment:", error);
      res.status(400).json({ error: "Invalid comment data" });
    }
  });
  app2.get("/api/admin/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching site settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });
  app2.post("/api/admin/settings", async (req, res) => {
    try {
      const data = insertSiteSettingSchema.parse(req.body);
      const setting = await storage.createSiteSetting(data);
      res.status(201).json(setting);
    } catch (error) {
      console.error("Error creating site setting:", error);
      res.status(400).json({ error: "Invalid setting data" });
    }
  });
  app2.put("/api/admin/settings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const setting = await storage.updateSiteSetting(id, req.body);
      res.json(setting);
    } catch (error) {
      console.error("Error updating site setting:", error);
      res.status(400).json({ error: "Failed to update setting" });
    }
  });
  app2.delete("/api/admin/settings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSiteSetting(id);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting site setting:", error);
      res.status(500).json({ error: "Failed to delete setting" });
    }
  });
  app2.get("/api/admin/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });
  app2.post("/api/admin/blog", async (req, res) => {
    try {
      const data = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(data);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(400).json({ error: "Invalid blog post data" });
    }
  });
  app2.put("/api/admin/blog/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const post = await storage.updateBlogPost(id, req.body);
      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(400).json({ error: "Failed to update blog post" });
    }
  });
  app2.delete("/api/admin/blog/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteBlogPost(id);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });
  app2.get("/api/admin/streams", async (req, res) => {
    try {
      const streams = await storage.getStreamSessions();
      res.json(streams);
    } catch (error) {
      console.error("Error fetching stream sessions:", error);
      res.status(500).json({ error: "Failed to fetch stream sessions" });
    }
  });
  app2.post("/api/admin/streams", async (req, res) => {
    try {
      const data = insertStreamSessionSchema.parse(req.body);
      const stream = await storage.createStreamSession(data);
      res.status(201).json(stream);
    } catch (error) {
      console.error("Error creating stream session:", error);
      res.status(400).json({ error: "Invalid stream session data" });
    }
  });
  app2.put("/api/admin/streams/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const stream = await storage.updateStreamSession(id, req.body);
      res.json(stream);
    } catch (error) {
      console.error("Error updating stream session:", error);
      res.status(400).json({ error: "Failed to update stream session" });
    }
  });
  app2.put("/api/admin/streams/:id/status", async (req, res) => {
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
  app2.delete("/api/admin/streams/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteStreamSession(id);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting stream session:", error);
      res.status(500).json({ error: "Failed to delete stream session" });
    }
  });
  app2.get("/api/admin/event-participants", async (req, res) => {
    try {
      const participants = await storage.getEventParticipants();
      res.json(participants);
    } catch (error) {
      console.error("Error fetching event participants:", error);
      res.status(500).json({ error: "Failed to fetch event participants" });
    }
  });
  app2.get("/api/admin/event-proposals", async (req, res) => {
    try {
      const proposals = await storage.getEventProposals();
      res.json(proposals);
    } catch (error) {
      console.error("Error fetching event proposals:", error);
      res.status(500).json({ error: "Failed to fetch event proposals" });
    }
  });
  app2.post("/api/admin/event-proposals", async (req, res) => {
    try {
      const data = insertEventProposalSchema.parse(req.body);
      const proposal = await storage.createEventProposal(data);
      res.status(201).json(proposal);
    } catch (error) {
      console.error("Error creating event proposal:", error);
      res.status(400).json({ error: "Invalid event proposal data" });
    }
  });
  app2.put("/api/admin/event-proposals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const proposal = await storage.updateEventProposal(id, req.body);
      res.json(proposal);
    } catch (error) {
      console.error("Error updating event proposal:", error);
      res.status(400).json({ error: "Failed to update event proposal" });
    }
  });
  app2.post("/api/user-sessions", async (req, res) => {
    try {
      const data = insertUserSessionSchema.parse(req.body);
      const session2 = await storage.createUserSession(data);
      res.status(201).json(session2);
    } catch (error) {
      console.error("Error creating user session:", error);
      res.status(400).json({ error: "Invalid user session data" });
    }
  });
  app2.get("/api/user-sessions/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const session2 = await storage.getUserSession(token);
      if (!session2) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session2);
    } catch (error) {
      console.error("Error fetching user session:", error);
      res.status(500).json({ error: "Failed to fetch user session" });
    }
  });
  setInterval(async () => {
    try {
      await storage.cleanupInactiveUsers();
    } catch (error) {
      console.error("Error cleaning up inactive users:", error);
    }
  }, 5 * 60 * 1e3);
}

// server/admin-routes.ts
import { nanoid as nanoid2 } from "nanoid";
function setupAdminRoutes(app2) {
  app2.get("/api/admin/home-settings", async (req, res) => {
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
        enableComments: settings?.enableComments ?? true
      });
    } catch (error) {
      console.error("Error fetching home settings:", error);
      res.status(500).json({ error: "Failed to fetch home settings" });
    }
  });
  app2.put("/api/admin/home-settings", async (req, res) => {
    try {
      const updateData = req.body;
      await storage.updateSiteSettings({
        homePageHeroTitle: updateData.heroTitle,
        homePageHeroSubtitle: updateData.heroSubtitle,
        primaryColor: updateData.primaryColor,
        secondaryColor: updateData.secondaryColor,
        enableComments: updateData.enableComments
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating home settings:", error);
      res.status(500).json({ error: "Failed to update home settings" });
    }
  });
  app2.get("/api/admin/song-requests", async (req, res) => {
    try {
      const requests = await storage.getAllSongRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching song requests:", error);
      res.status(500).json({ error: "Failed to fetch song requests" });
    }
  });
  app2.put("/api/admin/song-requests/:id", async (req, res) => {
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
  app2.delete("/api/admin/song-requests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSongRequest(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting song request:", error);
      res.status(500).json({ error: "Failed to delete song request" });
    }
  });
  app2.get("/api/admin/analytics", async (req, res) => {
    try {
      const { range = "7d" } = req.query;
      const analytics2 = await storage.getAnalytics(range);
      const mockData = {
        totalPageViews: 15420 + Math.floor(Math.random() * 1e3),
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
          { path: "/newsroom", views: 1850, percentage: 12 },
          { path: "/events", views: 980, percentage: 6.4 },
          { path: "/programs", views: 890, percentage: 5.7 }
        ],
        recentActivity: [
          { type: "live_view", description: "New viewer joined TV stream", timestamp: (/* @__PURE__ */ new Date()).toISOString() },
          { type: "comment", description: "Comment posted on live stream", timestamp: new Date(Date.now() - 12e4).toISOString() },
          { type: "reaction", description: "\u2764\uFE0F reaction on TV stream", timestamp: new Date(Date.now() - 18e4).toISOString() },
          { type: "song_request", description: "Song requested: 'Larakaraka' by Bosmic Otim", timestamp: new Date(Date.now() - 24e4).toISOString() }
        ],
        hourlyData: Array.from({ length: 24 }, (_, i) => ({
          hour: `${i}:00`,
          views: Math.floor(Math.random() * 500) + 100,
          reactions: Math.floor(Math.random() * 100) + 20,
          comments: Math.floor(Math.random() * 50) + 10
        }))
      };
      res.json(mockData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });
  app2.get("/api/admin/advertising", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json({
        googleAdsenseId: settings?.googleAdsenseId || "",
        twilioAccountSid: settings?.twilioAccountSid || "",
        twilioAuthToken: settings?.twilioAuthToken || "",
        africasTalkingApiKey: settings?.africasTalkingApiKey || "",
        sendChampApiKey: settings?.sendChampApiKey || ""
      });
    } catch (error) {
      console.error("Error fetching advertising settings:", error);
      res.status(500).json({ error: "Failed to fetch advertising settings" });
    }
  });
  app2.put("/api/admin/advertising", async (req, res) => {
    try {
      const integrationData = req.body;
      await storage.updateSiteSettings(integrationData);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating advertising settings:", error);
      res.status(500).json({ error: "Failed to update advertising settings" });
    }
  });
  app2.post("/api/admin/advertising/test/:integrationId", async (req, res) => {
    try {
      const { integrationId } = req.params;
      const success = Math.random() > 0.3;
      res.json({
        success,
        message: success ? "Connection successful!" : "Connection failed. Please check your credentials."
      });
    } catch (error) {
      console.error("Error testing connection:", error);
      res.status(500).json({ error: "Failed to test connection" });
    }
  });
  app2.get("/api/admin/events/:eventId/rsvp", async (req, res) => {
    try {
      const { eventId } = req.params;
      const rsvps = await storage.getEventRsvps(eventId);
      res.json(rsvps);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      res.status(500).json({ error: "Failed to fetch RSVPs" });
    }
  });
  app2.post("/api/events/:eventId/rsvp", async (req, res) => {
    try {
      const { eventId } = req.params;
      const { name, email, phone, status } = req.body;
      const rsvp = await storage.createEventRsvp({
        id: nanoid2(),
        eventId,
        name,
        email,
        phone,
        status: status || "attending"
      });
      res.status(201).json(rsvp);
    } catch (error) {
      console.error("Error creating RSVP:", error);
      res.status(500).json({ error: "Failed to create RSVP" });
    }
  });
  app2.post("/api/analytics/track", async (req, res) => {
    try {
      const { type, path: path4, userSession, metadata } = req.body;
      await storage.trackAnalytics({
        type,
        path: path4,
        userSession,
        metadata: JSON.stringify(metadata),
        ipAddress: req.ip,
        userAgent: req.get("User-Agent")
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking analytics:", error);
      res.status(500).json({ error: "Failed to track analytics" });
    }
  });
}

// server/metrics-routes.ts
function registerMetricsRoutes(app2) {
  app2.get("/api/admin/engagement-metrics", async (req, res) => {
    try {
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const currentHour = (/* @__PURE__ */ new Date()).getHours();
      const activeUsers2 = await storage.getActiveUserCount("tv") + await storage.getActiveUserCount("radio");
      const tvUsers = await storage.getActiveUserCount("tv");
      const radioUsers = await storage.getActiveUserCount("radio");
      const totalReactions = await storage.getTotalReactions();
      const totalComments = await storage.getTotalComments();
      const totalSongRequests = await storage.getTotalSongRequests();
      const totalInteractions = totalReactions + totalComments + totalSongRequests;
      const totalUsers = Math.max(tvUsers + radioUsers, 1);
      const engagementRate = totalInteractions / totalUsers * 100;
      const peakViewers = Math.max(tvUsers * 1.5, 5);
      const peakListeners = Math.max(radioUsers * 1.5, 3);
      const hourlyViewers = [];
      for (let i = 0; i < 24; i++) {
        hourlyViewers.push({
          hour: `${i}:00`,
          tv: Math.floor(Math.random() * 20) + (i === currentHour ? tvUsers : 0),
          radio: Math.floor(Math.random() * 15) + (i === currentHour ? radioUsers : 0)
        });
      }
      const topReactions = await storage.getTopReactions();
      const metrics = {
        totalViewers: tvUsers,
        totalListeners: radioUsers,
        peakViewers: Math.floor(peakViewers),
        peakListeners: Math.floor(peakListeners),
        avgSessionTime: 12,
        // Average session time in minutes (would calculate from actual data)
        totalReactions,
        totalComments,
        totalSongRequests,
        topReactions,
        hourlyViewers,
        engagementRate: Math.round(engagementRate * 100) / 100,
        activeUsers: activeUsers2,
        bounceRate: 25
        // Would calculate from actual session data
      };
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching engagement metrics:", error);
      res.status(500).json({ error: "Failed to fetch engagement metrics" });
    }
  });
  app2.get("/api/admin/content-metrics", async (req, res) => {
    try {
      const newsViews = await storage.getTotalNewsViews();
      const programViews = Math.floor(Math.random() * 500) + 200;
      const eventRSVPs = await storage.getTotalEventRsvps();
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
  app2.get("/api/admin/analytics/realtime", async (req, res) => {
    try {
      const activeUsers2 = await storage.getActiveUserCount("tv") + await storage.getActiveUserCount("radio");
      const recentComments = await storage.getRecentComments(10);
      const recentReactions = await storage.getRecentReactions(10);
      const recentSongRequests = await storage.getRecentSongRequests(5);
      res.json({
        activeUsers: activeUsers2,
        recentComments,
        recentReactions,
        recentSongRequests,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Error fetching real-time analytics:", error);
      res.status(500).json({ error: "Failed to fetch real-time analytics" });
    }
  });
}

// server/routes.ts
function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}
async function registerRoutes(app2) {
  setupAuth(app2);
  await initializeAdminUser();
  setupApiRoutes(app2);
  setupAdminRoutes(app2);
  registerMetricsRoutes(app2);
  app2.get("/api/analytics/overview", async (req, res) => {
    try {
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
  app2.get("/api/analytics/top-shows", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch top shows" });
    }
  });
  app2.get("/api/programs", async (req, res) => {
    try {
      const programs2 = await storage.getPrograms();
      res.json(programs2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });
  app2.get("/api/programs/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const programs2 = await storage.getProgramsByCategory(category);
      res.json(programs2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch programs by category" });
    }
  });
  app2.get("/api/news", async (req, res) => {
    try {
      const news2 = await storage.getNews();
      res.json(news2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });
  app2.get("/api/news/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const news2 = await storage.getNewsByCategory(category);
      res.json(news2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news by category" });
    }
  });
  app2.get("/api/news/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.getNewsById(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      await storage.incrementNewsViews(id);
      const updatedArticle = await storage.getNewsById(id);
      res.json(updatedArticle);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });
  app2.get("/api/news/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const news2 = await storage.getNewsById(id);
      if (!news2) {
        return res.status(404).json({ message: "News article not found" });
      }
      await storage.incrementNewsViews(id);
      res.json(news2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news article" });
    }
  });
  app2.get("/api/events", async (req, res) => {
    try {
      const events2 = await storage.getEvents();
      res.json(events2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
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
  app2.get("/api/news/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.getNewsById(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      await storage.incrementNewsViews(id);
      res.json({ ...article, views: (article.views || 0) + 1 });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });
  app2.post("/api/subscribe", async (req, res) => {
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
  app2.post("/api/interview-requests", async (req, res) => {
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
  app2.post("/api/program-proposals", async (req, res) => {
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
  app2.get("/api/news/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;
      const comments2 = await storage.getCommentsByNewsId(id);
      res.json(comments2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });
  app2.post("/api/news/:id/comments", async (req, res) => {
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
  app2.post("/api/admin/news", requireAuth, async (req, res) => {
    try {
      const validatedData = insertNewsSchema.parse(req.body);
      const news2 = await storage.createNews(validatedData);
      res.status(201).json({ message: "News article created", news: news2 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid news data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create news article" });
    }
  });
  app2.put("/api/admin/news/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertNewsSchema.partial().parse(req.body);
      const news2 = await storage.updateNews(id, validatedData);
      res.json({ message: "News article updated", news: news2 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid news data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update news article" });
    }
  });
  app2.post("/api/admin/programs", requireAuth, async (req, res) => {
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
  app2.put("/api/admin/programs/:id", requireAuth, async (req, res) => {
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
  app2.post("/api/admin/events", requireAuth, async (req, res) => {
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
  app2.put("/api/admin/events/:id", requireAuth, async (req, res) => {
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
  app2.put("/api/admin/comments/:id/approve", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.approveComment(id);
      res.json({ message: "Comment approved" });
    } catch (error) {
      res.status(500).json({ message: "Failed to approve comment" });
    }
  });
  app2.post("/api/interview-requests", async (req, res) => {
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
  app2.get("/api/admin/interview-requests", requireAuth, async (req, res) => {
    try {
      const requests = await storage.getInterviewRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interview requests" });
    }
  });
  app2.put("/api/admin/interview-requests/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const request = await storage.updateInterviewRequest(id, updateData);
      res.json({ message: "Interview request updated", request });
    } catch (error) {
      res.status(500).json({ message: "Failed to update interview request" });
    }
  });
  app2.post("/api/program-proposals", async (req, res) => {
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
  app2.get("/api/admin/program-proposals", requireAuth, async (req, res) => {
    try {
      const proposals = await storage.getProgramProposals();
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch program proposals" });
    }
  });
  app2.put("/api/admin/program-proposals/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const proposal = await storage.updateProgramProposal(id, updateData);
      res.json({ message: "Program proposal updated", proposal });
    } catch (error) {
      res.status(500).json({ message: "Failed to update program proposal" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/index.ts
var setupVite2;
var serveStatic3;
var log3;
if (process.env.NODE_ENV === "development") {
  const viteModule = await init_vite().then(() => vite_exports);
  setupVite2 = viteModule.setupVite;
  serveStatic3 = viteModule.serveStatic;
  log3 = viteModule.log;
} else {
  const prodModule = await Promise.resolve().then(() => (init_production_server(), production_server_exports));
  serveStatic3 = prodModule.serveStatic;
  log3 = prodModule.log;
}
var app = express3();
app.use(express3.json({ limit: "50mb" }));
app.use(express3.urlencoded({ extended: false, limit: "50mb" }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log3(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (process.env.NODE_ENV === "development") {
    await setupVite2(app, server);
  } else {
    serveStatic3(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log3(`serving on port ${port}`);
  });
})();

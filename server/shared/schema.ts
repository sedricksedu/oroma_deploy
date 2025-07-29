import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  role: text("role").default("user"),
  profileImage: text("profile_image"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const programs = sqliteTable("programs", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  schedule: text("schedule").notNull(),
  imageUrl: text("image_url"),
  isLive: integer("is_live", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const news = sqliteTable("news", {
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
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  location: text("location"),
  category: text("category").notNull(),
  featured: integer("featured", { mode: "boolean" }).default(false),
  imageUrl: text("image_url"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const contacts = sqliteTable("contacts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const subscribers = sqliteTable("subscribers", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const comments = sqliteTable("comments", {
  id: text("id").primaryKey(),
  newsId: text("news_id").notNull().references(() => news.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
  content: text("content").notNull(),
  approved: integer("approved", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

// Live interaction tables for streaming features
export const liveComments = sqliteTable("live_comments", {
  id: text("id").primaryKey(),
  message: text("message").notNull(),
  username: text("username").notNull(),
  streamType: text("stream_type").notNull(),
  userSession: text("user_session").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const liveReactions = sqliteTable("live_reactions", {
  id: text("id").primaryKey(),
  emoji: text("emoji").notNull(),
  streamType: text("stream_type").notNull(),
  userSession: text("user_session").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const songRequests = sqliteTable("song_requests", {
  id: text("id").primaryKey(),
  songTitle: text("song_title").notNull(),
  artistName: text("artist_name").notNull(),
  requesterName: text("requester_name").notNull(),
  streamType: text("stream_type").notNull(),
  status: text("status").default("pending"),
  priority: integer("priority").default(0),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const activeUsers = sqliteTable("active_users", {
  id: text("id").primaryKey(),
  userSession: text("user_session").notNull(),
  streamType: text("stream_type").notNull(), // 'tv' or 'radio'
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  isWatching: integer("is_watching", { mode: "boolean" }).default(true),
  joinedAt: text("joined_at").default(sql`(CURRENT_TIMESTAMP)`),
  lastSeen: text("last_seen").default(sql`(CURRENT_TIMESTAMP)`),
});

// Interview scheduling table
export const interviewRequests = sqliteTable("interview_requests", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  organization: text("organization"),
  topic: text("topic").notNull(),
  description: text("description").notNull(),
  preferredDate: text("preferred_date"),
  preferredTime: text("preferred_time"),
  status: text("status").default("pending"), // pending, approved, rejected, scheduled
  adminResponse: text("admin_response"),
  scheduledDate: text("scheduled_date"),
  scheduledTime: text("scheduled_time"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

// Program proposals table
export const programProposals = sqliteTable("program_proposals", {
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
  resources: text("resources"), // What resources/equipment needed
  experience: text("experience"), // Previous experience in broadcasting
  status: text("status").default("pending"), // pending, under_review, approved, rejected
  adminResponse: text("admin_response"),
  adminNotes: text("admin_notes"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProgramSchema = createInsertSchema(programs).omit({
  id: true,
  createdAt: true,
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriberSchema = createInsertSchema(subscribers).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertLiveCommentSchema = createInsertSchema(liveComments).omit({
  id: true,
  createdAt: true,
});

export const insertLiveReactionSchema = createInsertSchema(liveReactions).omit({
  id: true,
  createdAt: true,
});

export const insertSongRequestSchema = createInsertSchema(songRequests).omit({
  id: true,
  createdAt: true,
});

export const insertActiveUserSchema = createInsertSchema(activeUsers).omit({
  id: true,
  joinedAt: true,
  lastSeen: true,
});

export const insertInterviewRequestSchema = createInsertSchema(interviewRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProgramProposalSchema = createInsertSchema(programProposals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Program = typeof programs.$inferSelect;
export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type LiveComment = typeof liveComments.$inferSelect;
export type InsertLiveComment = z.infer<typeof insertLiveCommentSchema>;
export type LiveReaction = typeof liveReactions.$inferSelect;
export type InsertLiveReaction = z.infer<typeof insertLiveReactionSchema>;
export type SongRequest = typeof songRequests.$inferSelect;
export type InsertSongRequest = z.infer<typeof insertSongRequestSchema>;
export type ActiveUser = typeof activeUsers.$inferSelect;
export type InsertActiveUser = z.infer<typeof insertActiveUserSchema>;
export type InterviewRequest = typeof interviewRequests.$inferSelect;
export type InsertInterviewRequest = z.infer<typeof insertInterviewRequestSchema>;
export type ProgramProposal = typeof programProposals.$inferSelect;
export type InsertProgramProposal = z.infer<typeof insertProgramProposalSchema>;

// Additional tables for comprehensive admin functionality
export const eventRsvp = sqliteTable("event_rsvp", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  status: text("status").notNull().default("attending"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const siteSettings = sqliteTable("site_settings", {
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
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const analytics = sqliteTable("analytics", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  path: text("path"),
  userSession: text("user_session"),
  metadata: text("metadata"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

// Engagement analytics for the dashboard
export const engagementAnalytics = sqliteTable("engagement_analytics", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  hour: integer("hour").notNull(), // 0-23
  streamType: text("stream_type").notNull(),
  totalViewers: integer("total_viewers").default(0),
  peakViewers: integer("peak_viewers").default(0),
  totalReactions: integer("total_reactions").default(0),
  totalComments: integer("total_comments").default(0),
  totalSongRequests: integer("total_song_requests").default(0),
  avgSessionTime: integer("avg_session_time").default(0), // in minutes
  bounceRate: real("bounce_rate").default(0),
  engagementRate: real("engagement_rate").default(0),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const contentAnalytics = sqliteTable("content_analytics", {
  id: text("id").primaryKey(),
  contentId: text("content_id").notNull(),
  contentType: text("content_type").notNull(), // 'news', 'program', 'event'
  date: text("date").notNull(),
  views: integer("views").default(0),
  uniqueViews: integer("unique_views").default(0),
  avgTimeSpent: integer("avg_time_spent").default(0), // in seconds
  shareCount: integer("share_count").default(0),
  commentCount: integer("comment_count").default(0),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

// Insert schemas for new tables
export const insertEventRsvpSchema = createInsertSchema(eventRsvp).omit({
  id: true,
  createdAt: true,
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true,
});

export const insertEngagementAnalyticsSchema = createInsertSchema(engagementAnalytics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentAnalyticsSchema = createInsertSchema(contentAnalytics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for new tables
export type EventRsvp = typeof eventRsvp.$inferSelect;
export type InsertEventRsvp = z.infer<typeof insertEventRsvpSchema>;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type AnalyticsRecord = typeof analytics.$inferSelect;
export type InsertAnalyticsRecord = z.infer<typeof insertAnalyticsSchema>;
export type EngagementAnalytics = typeof engagementAnalytics.$inferSelect;
export type InsertEngagementAnalytics = z.infer<typeof insertEngagementAnalyticsSchema>;
export type ContentAnalytics = typeof contentAnalytics.$inferSelect;
export type InsertContentAnalytics = z.infer<typeof insertContentAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
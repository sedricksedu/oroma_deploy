import {
  type User,
  type InsertUser,
  type Program,
  type InsertProgram,
  type News,
  type InsertNews,
  type Event,
  type InsertEvent,
  type Contact,
  type InsertContact,
  type Subscriber,
  type InsertSubscriber,
  type Comment,
  type InsertComment,
  type SongRequest,
  type InsertSongRequest,
  type LiveReaction,
  type InsertLiveReaction,
  type ActiveUser,
  type InsertActiveUser,
  type LiveComment,
  type InsertLiveComment,
  type SiteSettings,
  type InsertSiteSettings,
  type EventRsvp,
  type InsertEventRsvp,
  type Analytics,
  type InsertAnalytics,
  type InterviewRequest,
  type InsertInterviewRequest,
  type ProgramProposal,
  type InsertProgramProposal,
  users,
  programs,
  news,
  events,
  contacts,
  subscribers,
  comments,
  songRequests,
  liveReactions,
  activeUsers,
  liveComments,
  siteSettings,
  eventRsvp,
  analytics,
  interviewRequests,
  programProposals,
} from "./shared/schema";
import { db } from "./db";
import { eq, and, sql, desc, lt } from "drizzle-orm";
import { randomUUID } from "crypto";
import { nanoid } from "nanoid";
import type { IStorage } from "./storage";
// Session store not needed for database storage

export class DatabaseStorage implements IStorage {
  // sessionStore removed for database storage

  constructor() {
    // No session store needed for database storage
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, id })
      .returning();
    return user;
  }

  // Program methods
  async getPrograms(): Promise<Program[]> {
    return await db.select().from(programs).orderBy(desc(programs.createdAt));
  }

  async getProgram(id: string): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.id, id));
    return program;
  }

  async createProgram(insertProgram: InsertProgram): Promise<Program> {
    const id = randomUUID();
    const [program] = await db
      .insert(programs)
      .values({ ...insertProgram, id })
      .returning();
    return program;
  }

  async updateProgram(id: string, insertProgram: Partial<InsertProgram>): Promise<Program> {
    const [program] = await db
      .update(programs)
      .set(insertProgram)
      .where(eq(programs.id, id))
      .returning();
    if (!program) {
      throw new Error("Program not found");
    }
    return program;
  }

  async deleteProgram(id: string): Promise<void> {
    await db.delete(programs).where(eq(programs.id, id));
  }

  // News methods
  async getNews(): Promise<News[]> {
    return await db.select().from(news).orderBy(desc(news.publishedAt));
  }

  async getNewsById(id: string): Promise<News | undefined> {
    const [article] = await db.select().from(news).where(eq(news.id, id));
    return article;
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const id = randomUUID();
    const [article] = await db
      .insert(news)
      .values({ ...insertNews, id })
      .returning();
    return article;
  }

  async updateNews(id: string, insertNews: Partial<InsertNews>): Promise<News> {
    const [article] = await db
      .update(news)
      .set({ ...insertNews, updatedAt: new Date().toISOString() })
      .where(eq(news.id, id))
      .returning();
    if (!article) {
      throw new Error("News article not found");
    }
    return article;
  }

  async getNewsByCategory(category: string): Promise<News[]> {
    return await db.select().from(news).where(eq(news.category, category)).orderBy(desc(news.publishedAt));
  }

  async incrementNewsViews(id: string): Promise<void> {
    await db.update(news).set({ 
      views: sql`${news.views} + 1` 
    }).where(eq(news.id, id));
  }

  async deleteNews(id: string): Promise<void> {
    await db.delete(news).where(eq(news.id, id));
  }

  // Event methods
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.date));
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const [event] = await db
      .insert(events)
      .values({ ...insertEvent, id })
      .returning();
    return event;
  }

  async updateEvent(id: string, insertEvent: Partial<InsertEvent>): Promise<Event> {
    const [event] = await db
      .update(events)
      .set({ ...insertEvent, updatedAt: new Date().toISOString() })
      .where(eq(events.id, id))
      .returning();
    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  }

  async deleteEvent(id: string): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  // Contact methods
  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const [contact] = await db
      .insert(contacts)
      .values({ ...insertContact, id })
      .returning();
    return contact;
  }

  // Subscriber methods
  async getSubscribers(): Promise<Subscriber[]> {
    return await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
  }

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const id = randomUUID();
    const [subscriber] = await db
      .insert(subscribers)
      .values({ ...insertSubscriber, id })
      .returning();
    return subscriber;
  }

  // Comment methods
  async getCommentsByNewsId(newsId: string): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.newsId, newsId))
      .orderBy(desc(comments.createdAt));
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const [comment] = await db
      .insert(comments)
      .values({ ...insertComment, id })
      .returning();
    return comment;
  }

  // Live interaction methods
  async getLiveComments(streamType: string, limit: number = 50): Promise<LiveComment[]> {
    return await db
      .select()
      .from(liveComments)
      .where(eq(liveComments.streamType, streamType))
      .orderBy(desc(liveComments.createdAt))
      .limit(limit);
  }

  async createLiveComment(insertLiveComment: InsertLiveComment): Promise<LiveComment> {
    const id = randomUUID();
    const [comment] = await db
      .insert(liveComments)
      .values({ ...insertLiveComment, id })
      .returning();
    return comment;
  }

  async getLiveReactions(streamType: string, limit: number = 100): Promise<LiveReaction[]> {
    return await db
      .select()
      .from(liveReactions)
      .where(eq(liveReactions.streamType, streamType))
      .orderBy(desc(liveReactions.createdAt))
      .limit(limit);
  }

  async createLiveReaction(insertLiveReaction: InsertLiveReaction): Promise<LiveReaction> {
    const id = randomUUID();
    const [reaction] = await db
      .insert(liveReactions)
      .values({ ...insertLiveReaction, id })
      .returning();
    return reaction;
  }

  async getSongRequests(streamType?: string): Promise<SongRequest[]> {
    if (streamType) {
      return await db
        .select()
        .from(songRequests)
        .where(eq(songRequests.streamType, streamType))
        .orderBy(desc(songRequests.createdAt));
    }
    return await db.select().from(songRequests).orderBy(desc(songRequests.createdAt));
  }

  async createSongRequest(insertSongRequest: InsertSongRequest): Promise<SongRequest> {
    const id = randomUUID();
    const [request] = await db
      .insert(songRequests)
      .values({ ...insertSongRequest, id })
      .returning();
    return request;
  }

  async updateSongRequestStatus(id: string, status: string): Promise<SongRequest> {
    const [request] = await db
      .update(songRequests)
      .set({ status })
      .where(eq(songRequests.id, id))
      .returning();
    if (!request) {
      throw new Error("Song request not found");
    }
    return request;
  }

  // Real-time viewer tracking methods
  async joinStream(userData: InsertActiveUser): Promise<ActiveUser> {
    const id = randomUUID();
    
    // Remove any existing entry for this user session and stream type
    await db
      .delete(activeUsers)
      .where(
        and(
          eq(activeUsers.userSession, userData.userSession),
          eq(activeUsers.streamType, userData.streamType)
        )
      );

    // Insert new active user
    const [user] = await db
      .insert(activeUsers)
      .values({ id, ...userData })
      .returning();
    return user;
  }

  async leaveStream(userSession: string, streamType: string): Promise<void> {
    await db
      .delete(activeUsers)
      .where(
        and(
          eq(activeUsers.userSession, userSession),
          eq(activeUsers.streamType, streamType)
        )
      );
  }

  async updateViewerHeartbeat(userSession: string, streamType: string): Promise<void> {
    await db
      .update(activeUsers)
      .set({ 
        lastSeen: sql`(CURRENT_TIMESTAMP)`,
        isWatching: true 
      })
      .where(
        and(
          eq(activeUsers.userSession, userSession),
          eq(activeUsers.streamType, streamType)
        )
      );
  }

  async getActiveUserCount(streamType: string): Promise<number> {
    // Clean up stale viewers (older than 2 minutes)
    await db
      .delete(activeUsers)
      .where(
        and(
          eq(activeUsers.streamType, streamType),
          sql`datetime(last_seen) < datetime('now', '-2 minutes')`
        )
      );

    // Count current active viewers
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(activeUsers)
      .where(
        and(
          eq(activeUsers.streamType, streamType),
          eq(activeUsers.isWatching, true)
        )
      );
    return result[0]?.count || 0;
  }

  async cleanupInactiveUsers(): Promise<void> {
    // Remove users inactive for more than 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    await db
      .delete(activeUsers)
      .where(sql`${activeUsers.lastSeen} < ${tenMinutesAgo}`);
  }

  // Active Users update method to match interface
  async updateActiveUser(id: string, user: Partial<InsertActiveUser>): Promise<ActiveUser> {
    const [result] = await db
      .update(activeUsers)
      .set({
        ...user,
        lastSeen: new Date().toISOString(),
      })
      .where(eq(activeUsers.id, id))
      .returning();
    return result;
  }

  // Site settings implementation
  async getSiteSettings(): Promise<SiteSettings | undefined> {
    const [result] = await db.select().from(siteSettings).limit(1);
    return result;
  }

  async updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    const existing = await this.getSiteSettings();
    
    if (existing) {
      const [result] = await db.update(siteSettings)
        .set({ ...updates, updatedAt: sql`(CURRENT_TIMESTAMP)` })
        .where(eq(siteSettings.id, existing.id))
        .returning();
      return result;
    } else {
      const [result] = await db.insert(siteSettings).values({
        id: nanoid(),
        siteName: "Oroma TV",
        ...updates,
      }).returning();
      return result;
    }
  }

  // Event RSVP implementation  
  async getEventRsvps(eventId: string): Promise<EventRsvp[]> {
    return await db.select().from(eventRsvp).where(eq(eventRsvp.eventId, eventId));
  }

  async createEventRsvp(rsvp: InsertEventRsvp & { id: string }): Promise<EventRsvp> {
    const [result] = await db.insert(eventRsvp).values(rsvp).returning();
    return result;
  }

  // Analytics implementation
  async trackAnalytics(data: InsertAnalytics & { id?: string }): Promise<Analytics> {
    const [result] = await db.insert(analytics).values({
      id: data.id || nanoid(),
      ...data,
    }).returning();
    return result;
  }

  async getAnalytics(range: string): Promise<Analytics[]> {
    const now = new Date();
    let startDate = new Date();

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

    return await db.select().from(analytics)
      .where(sql`${analytics.createdAt} >= ${startDate.toISOString()}`);
  }

  // Song request management
  async getAllSongRequests(): Promise<SongRequest[]> {
    return await db.select().from(songRequests).orderBy(desc(songRequests.createdAt));
  }

  async updateSongRequest(id: string, updates: Partial<SongRequest>): Promise<void> {
    await db.update(songRequests)
      .set(updates)
      .where(eq(songRequests.id, id));
  }

  async deleteSongRequest(id: string): Promise<void> {
    await db.delete(songRequests).where(eq(songRequests.id, id));
  }

  // Interview Request methods
  async getInterviewRequests(): Promise<InterviewRequest[]> {
    return await db.select().from(interviewRequests).orderBy(desc(interviewRequests.createdAt));
  }

  async createInterviewRequest(request: InsertInterviewRequest): Promise<InterviewRequest> {
    const [result] = await db.insert(interviewRequests).values({
      id: nanoid(),
      ...request,
    }).returning();
    return result;
  }

  async updateInterviewRequest(id: string, updates: Partial<InterviewRequest>): Promise<InterviewRequest> {
    const [result] = await db.update(interviewRequests)
      .set({ ...updates, updatedAt: new Date().toISOString() })
      .where(eq(interviewRequests.id, id))
      .returning();
    return result;
  }

  // Program Proposal methods
  async getProgramProposals(): Promise<ProgramProposal[]> {
    return await db.select().from(programProposals).orderBy(desc(programProposals.createdAt));
  }

  async createProgramProposal(proposal: InsertProgramProposal): Promise<ProgramProposal> {
    const [result] = await db.insert(programProposals).values({
      id: nanoid(),
      ...proposal,
    }).returning();
    return result;
  }

  async updateProgramProposal(id: string, updates: Partial<ProgramProposal>): Promise<ProgramProposal> {
    const [result] = await db.update(programProposals)
      .set({ ...updates, updatedAt: new Date().toISOString() })
      .where(eq(programProposals.id, id))
      .returning();
    return result;
  }

  // Missing methods implementation
  async getProgramById(id: string): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.id, id));
    return program;
  }

  async getProgramsByCategory(category: string): Promise<Program[]> {
    return await db.select().from(programs).where(eq(programs.category, category));
  }

  async getEventById(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async approveComment(id: string): Promise<void> {
    await db
      .update(comments)
      .set({ approved: true })
      .where(eq(comments.id, id));
  }

  // Analytics methods for engagement metrics
  async getTotalReactions(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(liveReactions);
    return result[0]?.count || 0;
  }

  async getTotalComments(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(liveComments);
    return result[0]?.count || 0;
  }

  async getTotalSongRequests(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(songRequests);
    return result[0]?.count || 0;
  }

  async getTotalNewsViews(): Promise<number> {
    const result = await db.select({ totalViews: sql<number>`sum(views)` }).from(news);
    return result[0]?.totalViews || 0;
  }

  async getTotalEventRsvps(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(eventRsvp);
    return result[0]?.count || 0;
  }

  async getTopReactions(): Promise<Array<{ emoji: string; count: number }>> {
    const reactions = await db
      .select({
        emoji: liveReactions.emoji,
        count: sql<number>`count(*)`
      })
      .from(liveReactions)
      .groupBy(liveReactions.emoji)
      .orderBy(sql`count(*) desc`)
      .limit(5);
    
    return reactions.map(r => ({ emoji: r.emoji, count: r.count }));
  }

  async getPopularContent(): Promise<Array<{ title: string; views: number; type: string }>> {
    const newsContent = await db
      .select({
        title: news.title,
        views: news.views,
        type: sql<string>`'news'`
      })
      .from(news)
      .orderBy(desc(news.views))
      .limit(3);

    const programContent = await db
      .select({
        title: programs.title,
        views: sql<number>`0`, // Programs don't have views yet
        type: sql<string>`'program'`
      })
      .from(programs)
      .limit(2);

    return [...newsContent, ...programContent];
  }

  async getRecentComments(limit: number): Promise<any[]> {
    return await db
      .select()
      .from(liveComments)
      .orderBy(desc(liveComments.createdAt))
      .limit(limit);
  }

  async getRecentReactions(limit: number): Promise<any[]> {
    return await db
      .select()
      .from(liveReactions)
      .orderBy(desc(liveReactions.createdAt))
      .limit(limit);
  }

  async getRecentSongRequests(limit: number): Promise<any[]> {
    return await db
      .select()
      .from(songRequests)
      .orderBy(desc(songRequests.createdAt))
      .limit(limit);
  }
}
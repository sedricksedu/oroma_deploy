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
  type InterviewRequest,
  type InsertInterviewRequest,
  type ProgramProposal,
  type InsertProgramProposal,
} from "./shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Programs
  getPrograms(): Promise<Program[]>;
  getProgramById(id: string): Promise<Program | undefined>;
  getProgramsByCategory(category: string): Promise<Program[]>;
  createProgram(program: InsertProgram): Promise<Program>;
  updateProgram(id: string, program: Partial<InsertProgram>): Promise<Program>;
  
  // News
  getNews(): Promise<News[]>;
  getNewsById(id: string): Promise<News | undefined>;
  getNewsByCategory(category: string): Promise<News[]>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: string, news: Partial<InsertNews>): Promise<News>;
  incrementNewsViews(id: string): Promise<void>;
  
  // Events
  getEvents(): Promise<Event[]>;
  getEventById(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event>;
  
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  
  // Subscribers
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  getSubscribers(): Promise<Subscriber[]>;
  
  // Comments
  getCommentsByNewsId(newsId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  approveComment(id: string): Promise<void>;
  
  // Song Requests
  getSongRequests(streamType?: string): Promise<SongRequest[]>;
  createSongRequest(request: InsertSongRequest): Promise<SongRequest>;
  updateSongRequestStatus(id: string, status: string): Promise<SongRequest>;
  
  // Live Reactions
  createLiveReaction(reaction: InsertLiveReaction): Promise<LiveReaction>;
  getLiveReactions(streamType: string, limit?: number): Promise<LiveReaction[]>;
  
  // Active Users
  updateActiveUser(id: string, user: Partial<InsertActiveUser>): Promise<ActiveUser>;
  getActiveUserCount(streamType: string): Promise<number>;
  cleanupInactiveUsers(): Promise<void>;
  
  // Live Comments
  getLiveComments(streamType: string, limit?: number): Promise<LiveComment[]>;
  createLiveComment(comment: InsertLiveComment): Promise<LiveComment>;
  
  // Interview Requests
  getInterviewRequests(): Promise<InterviewRequest[]>;
  createInterviewRequest(request: InsertInterviewRequest): Promise<InterviewRequest>;
  updateInterviewRequest(id: string, updates: Partial<InterviewRequest>): Promise<InterviewRequest>;
  
  // Program Proposals
  getProgramProposals(): Promise<ProgramProposal[]>;
  createProgramProposal(proposal: InsertProgramProposal): Promise<ProgramProposal>;
  updateProgramProposal(id: string, updates: Partial<ProgramProposal>): Promise<ProgramProposal>;
  
  // Missing methods
  getProgramById(id: string): Promise<Program | undefined>;
  getProgramsByCategory(category: string): Promise<Program[]>;
  getEventById(id: string): Promise<Event | undefined>;
  
  // Analytics methods for engagement metrics
  getTotalReactions(): Promise<number>;
  getTotalComments(): Promise<number>;
  getTotalSongRequests(): Promise<number>;
  getTotalNewsViews(): Promise<number>;
  getTotalEventRsvps(): Promise<number>;
  getTopReactions(): Promise<Array<{ emoji: string; count: number }>>;
  getPopularContent(): Promise<Array<{ title: string; views: number; type: string }>>;
  getRecentComments(limit: number): Promise<any[]>;
  getRecentReactions(limit: number): Promise<any[]>;
  getRecentSongRequests(limit: number): Promise<any[]>;
}

import { DatabaseStorage } from "./database-storage";

export const storage = new DatabaseStorage();
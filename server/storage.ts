import { type User, type InsertUser, type ChatMessage, type InsertChatMessage, type Conversation, type InsertConversation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(sessionId: string): Promise<ChatMessage[]>;
  // Conversation management
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(sessionId: string): Promise<Conversation | undefined>;
  updateConversation(sessionId: string, updates: Partial<Conversation>): Promise<Conversation | undefined>;
  getRecentConversations(limit?: number): Promise<Conversation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private chatMessages: Map<string, ChatMessage>;
  private conversations: Map<string, Conversation>;

  constructor() {
    this.users = new Map();
    this.chatMessages = new Map();
    this.conversations = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      timestamp: new Date(),
      metadata: insertMessage.metadata || null,
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.sessionId === sessionId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = {
      ...insertConversation,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActivity: new Date(),
      messageCount: insertConversation.messageCount || "0",
    };
    this.conversations.set(conversation.sessionId, conversation);
    return conversation;
  }

  async getConversation(sessionId: string): Promise<Conversation | undefined> {
    return this.conversations.get(sessionId);
  }

  async updateConversation(sessionId: string, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const existing = this.conversations.get(sessionId);
    if (!existing) return undefined;

    const updated: Conversation = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
      lastActivity: new Date(),
    };
    this.conversations.set(sessionId, updated);
    return updated;
  }

  async getRecentConversations(limit: number = 10): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();

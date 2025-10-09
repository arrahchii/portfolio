import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  message: text("message").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: jsonb("metadata"),
});

// Add conversations table for better session management
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull().unique(),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  messageCount: text("message_count").default("0"),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastActivity: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

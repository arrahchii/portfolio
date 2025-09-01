var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export var users = pgTable("users", {
    id: varchar("id").primaryKey().default(sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
});
export var chatMessages = pgTable("chat_messages", {
    id: varchar("id").primaryKey().default(sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    sessionId: text("session_id").notNull(),
    message: text("message").notNull(),
    role: text("role").notNull(), // 'user' or 'assistant'
    timestamp: timestamp("timestamp").defaultNow().notNull(),
    metadata: jsonb("metadata"),
});
export var insertUserSchema = createInsertSchema(users).pick({
    username: true,
    password: true,
});
export var insertChatMessageSchema = createInsertSchema(chatMessages).omit({
    id: true,
    timestamp: true,
});
var templateObject_1, templateObject_2;

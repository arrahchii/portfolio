import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { lanceDigitalTwin } from "./services/openai";
import { insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  sessionId: z.string().min(1),
  isQuickQuestion: z.boolean().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint for AI responses
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId, isQuickQuestion } = chatRequestSchema.parse(req.body);

      // Save user message
      await storage.saveChatMessage({
        sessionId,
        message,
        role: "user",
        metadata: { isQuickQuestion: isQuickQuestion || false },
      });

      let response: string;

      if (isQuickQuestion) {
        // Handle predefined quick questions
        response = lanceDigitalTwin.getQuickQuestionResponse(message);
      } else {
        // Get conversation history for context
        const history = await storage.getChatHistory(sessionId);
        
        // Generate AI response
        response = await lanceDigitalTwin.getResponse(message, history);
      }

      // Save assistant response
      const assistantMessage = await storage.saveChatMessage({
        sessionId,
        message: response,
        role: "assistant",
        metadata: {},
      });

      res.json({
        success: true,
        message: response,
        messageId: assistantMessage.id,
      });
    } catch (error) {
      console.error('Chat API Error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: "Invalid request format",
          details: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to process chat message",
      });
    }
  });

  // Get chat history
  app.get("/api/chat/history/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      if (!sessionId) {
        return res.status(400).json({
          success: false,
          error: "Session ID is required",
        });
      }

      const history = await storage.getChatHistory(sessionId);
      
      res.json({
        success: true,
        messages: history,
      });
    } catch (error) {
      console.error('Chat History API Error:', error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve chat history",
      });
    }
  });

  // Portfolio data endpoint
  app.get("/api/portfolio/profile", async (req, res) => {
    try {
      const profile = {
        name: "Lance Cabanit",
        title: "Full-Stack Developer & AI Enthusiast",
        availability: "Available for Opportunities",
        avatar: "/attached_assets/image_1756544677548.png",
        sections: {
          me: {
            bio: "Passionate full-stack developer with expertise in modern web technologies and AI integration. I love creating interactive applications that solve real-world problems.",
            experience: "3+ years of professional development experience",
            passion: "Building innovative solutions with cutting-edge technology"
          },
          skills: [
            { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
            { category: "Backend", items: ["Node.js", "Express", "Python", "Django"] },
            { category: "Database", items: ["PostgreSQL", "MongoDB", "Redis"] },
            { category: "Cloud", items: ["AWS", "Vercel", "Docker"] },
            { category: "AI/ML", items: ["OpenAI API", "TensorFlow", "scikit-learn"] }
          ],
          projects: [
            {
              name: "AI Portfolio Assistant",
              description: "Interactive digital twin chatbot with conversational AI",
              tech: ["React", "OpenAI API", "Node.js", "TypeScript"],
              status: "Live"
            },
            {
              name: "E-Commerce Platform",
              description: "Full-stack marketplace with real-time features",
              tech: ["Next.js", "PostgreSQL", "Stripe", "AWS"],
              status: "Production"
            },
            {
              name: "ML Market Predictor",
              description: "Predictive analytics for market trend analysis",
              tech: ["Python", "TensorFlow", "FastAPI"],
              status: "Beta"
            }
          ],
          contact: {
            email: "lance.cabanit@email.com",
            linkedin: "linkedin.com/in/lance-cabanit",
            github: "github.com/lancecanbanit",
            location: "Available for Remote Work"
          }
        }
      };

      res.json({
        success: true,
        profile,
      });
    } catch (error) {
      console.error('Profile API Error:', error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve profile data",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

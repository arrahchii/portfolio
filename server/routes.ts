import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getAIResponse } from "./services/aiservice";
import { isPersonalResponse } from "./services/groqService";
import { z } from "zod";
import nodemailer from "nodemailer";

const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  sessionId: z.string().min(1),
  isQuickQuestion: z.boolean().optional(),
});

const contactRequestSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(1).max(2000),
});

// ===== EMAIL SERVICE =====
class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendContactFormToMainEmail(contactData: { name: string; email: string; message: string }): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: process.env.RECEIVER_EMAIL,
        subject: `Portfolio Contact: Message from ${contactData.name}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>From:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
            ${contactData.message.replace(/\n/g, '<br>')}
          </div>
          <hr>
          <p><small>Sent via Lance Cabanit's Portfolio Contact Form</small></p>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log('📧 Contact form forwarded to main email successfully');
      return true;
    } catch (error) {
      console.error('📧 Error sending contact form email:', error);
      return false;
    }
  }

  async sendAutoReply(toEmail: string, name: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: toEmail,
        subject: 'Thank you for contacting Lance Cabanit',
        html: `
          <h3>Thank you for reaching out!</h3>
          <p>Hi ${name},</p>
          <p>Thank you for your message through my portfolio website. I've received your inquiry and will get back to you as soon as possible.</p>
          <p>In the meantime, feel free to check out my latest projects and connect with me on:</p>
          <ul>
            <li><a href="https://www.linkedin.com/in/lance-cabanit-61530b372/">LinkedIn</a></li>
            <li><a href="https://github.com/lance-cabanit">GitHub</a></li>
          </ul>
          <p>Best regards,<br>Lance Cabanit<br>Full-Stack Developer & AI Enthusiast</p>
          <hr>
          <p><small>This is an automated response from Lance Cabanit's portfolio system.</small></p>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log('📧 Auto-reply sent successfully');
      return true;
    } catch (error) {
      console.error('📧 Error sending auto-reply:', error);
      return false;
    }
  }
}

// Initialize email service
const emailService = new EmailService();

export async function registerRoutes(app: Express): Promise<Server> {
  // ===== CONTACT FORM ENDPOINT =====
  app.post("/api/contact", async (req, res) => {
    try {
      console.log('📧 ===== CONTACT FORM REQUEST RECEIVED =====');
      console.log('📧 Request body:', req.body);
      
      const { name, email, message } = contactRequestSchema.parse(req.body);
      
      console.log('📧 Contact form submission:', { name, email, messageLength: message.length });
      
      // Forward contact form to your main email
      const emailSent = await emailService.sendContactFormToMainEmail({
        name,
        email,
        message
      });
      
      console.log('📧 Main email forwarded:', emailSent);
      
      // Send auto-reply to the sender
      const autoReplySent = await emailService.sendAutoReply(email, name);
      
      console.log('📧 Auto-reply sent:', autoReplySent);
      
      if (emailSent) {
        res.json({
          success: true,
          message: `Thank you ${name}! Your message has been sent to Lance. You should receive a confirmation email shortly.`
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Sorry, there was an error sending your message. Please try again.'
        });
      }
      
    } catch (error) {
      console.error('📧 Contact form error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Please check your input and try again.',
          errors: error.errors
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Sorry, there was an error processing your message. Please try again.'
      });
    }
  });

  // Chat endpoint with personal query support
  app.post("/api/chat", async (req, res) => {
    try {
      console.log("\n🌐 CHAT API REQUEST:");
      const { message, sessionId, isQuickQuestion } = chatRequestSchema.parse(req.body);
      console.log("📝 Message:", message);
      console.log("🔑 Session:", sessionId);
      console.log("⚡ Quick question:", isQuickQuestion);

      // Ensure conversation exists
      let conversation = await storage.getConversation(sessionId);
      if (!conversation) {
        console.log("🆕 Creating new conversation for session:", sessionId);
        conversation = await storage.createConversation({
          sessionId,
          title: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
          messageCount: "0",
        });
      }

      // Save user message to database
      await storage.saveChatMessage({
        sessionId,
        message,
        role: "user",
        metadata: { isQuickQuestion: isQuickQuestion || false },
      });

      // Update conversation message count and activity
      const currentCount = parseInt(conversation.messageCount || "0");
      await storage.updateConversation(sessionId, {
        messageCount: (currentCount + 1).toString(),
      });

      // Get conversation history (including the message we just saved)
      const history = await storage.getChatHistory(sessionId);
      console.log("📚 Loaded", history.length, "messages from history");

      // Format history for AI service
      const formattedHistory = history
        .slice(0, -1) // Exclude the current user message
        .map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.message,
        }));

      // Get AI response
      console.log("🤖 Calling AI service...");
      const aiResponse = await getAIResponse(message, true, false, formattedHistory);

      let responseMessage: string;
      let responseMetadata: any = {};

      // Handle different response types
      if (isPersonalResponse(aiResponse)) {
        console.log("👤 PERSONAL QUERY RESPONSE DETECTED");
        console.log("🖼️ Image URL:", aiResponse.imageUrl);
        console.log("🔍 aiResponse.response type:", typeof aiResponse.response);
        console.log("🔍 aiResponse.response value:", aiResponse.response);
        
        responseMessage = aiResponse.response;
        responseMetadata = {
          specialFormatting: aiResponse.specialFormatting,
          imageUrl: aiResponse.imageUrl,
          isPersonalQuery: true
        };
      } else {
        console.log("💬 Regular AI response");
        console.log("🔍 aiResponse type:", typeof aiResponse);
        console.log("🔍 aiResponse value:", aiResponse);
        responseMessage = aiResponse as string;
      }

      console.log("🔍 FINAL responseMessage type:", typeof responseMessage);
      console.log("🔍 FINAL responseMessage value:", responseMessage);

      // Save assistant response to database
      const assistantMessage = await storage.saveChatMessage({
        sessionId,
        message: responseMessage,
        role: "assistant",
        metadata: responseMetadata,
      });

      console.log("✅ Response saved with ID:", assistantMessage.id);

      // Send response to client
      const clientResponse = {
        success: true,
        message: responseMessage,
        messageId: assistantMessage.id,
        ...(responseMetadata.isPersonalQuery && {
          specialFormatting: responseMetadata.specialFormatting,
          imageUrl: responseMetadata.imageUrl
        })
      };

      console.log("📤 Sending response to client:");
      console.log("   Message length:", responseMessage.length);
      if (responseMetadata.isPersonalQuery) {
        console.log("   Special formatting:", responseMetadata.specialFormatting);
        console.log("   Image URL:", responseMetadata.imageUrl);
      }

      res.json(clientResponse);

    } catch (error) {
      console.error("❌ Chat API Error:", error);

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

  // Chat history endpoint
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
      console.error("Chat History API Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve chat history",
      });
    }
  });

  // Portfolio endpoint
  app.get("/api/portfolio/profile", async (_req, res) => {
    try {
      const profile = {
        name: "Lance Cabanit",
        title: "AI Engineer & DevOps",
        availability: "Available for Opportunities",
        avatar: "/src/assets/ICONN.jpg",
        sections: {
          me: {
            bio: "I'm Lance Cabanit, a passionate AI Engineer and DevOps specialist with a unique blend of leadership experience and technical expertise. Currently in my 3rd year at Holy Trinity College, I've built a solid foundation in programming, software development, and system design while gaining real-world experience across multiple domains.\n\nMy professional journey began in the BPO industry, where I spent four years at C&C BPO, progressing from agent to supervisor. Leading teams of 10-15 agents taught me valuable skills in team leadership, training, and customer service excellence. This experience shaped my ability to communicate complex technical concepts clearly and manage projects effectively.\n\nTransitioning into the tech space, I've worked as a Frontend Developer and Full Stack Developer at SmartBuild Solutions, crafting responsive web applications with HTML, CSS, and JavaScript. My role as a Web Designer at Algoworks allowed me to blend technical skills with creative vision, developing user interfaces and digital marketing assets that meet client specifications and enhance user experiences.\n\nWhat sets me apart is my ambitious vision for the future. I'm actively working on cutting-edge projects that span AI/ML engineering, prompt engineering, and full-stack development. From building real-time video analytics pipelines with AWS to creating sophisticated AI-powered systems, I'm constantly pushing the boundaries of what's possible with modern technology.\n\nMy goal is to bridge the gap between innovative AI capabilities and practical web applications, creating solutions that are not only technically impressive but also genuinely useful for real-world problems. Whether I'm developing multimodal search engines, implementing federated learning systems, or building collaborative development platforms, I approach each project with both technical precision and strategic thinking.\n\nI believe that the future belongs to those who can seamlessly integrate AI intelligence with exceptional user experiences, and that's exactly where I'm positioning myself in this rapidly evolving tech landscape.",
            experience: "5+ years of professional development experience",
            passion: "Building innovative AI-integrated solutions with cutting-edge technology",
          },
          skills: [
            { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
            { category: "Backend", items: ["Node.js", "Express", "Python", "Django"] },
            { category: "Database", items: ["PostgreSQL", "MongoDB", "Redis"] },
            { category: "Cloud", items: ["AWS", "Vercel", "Docker"] },
            { category: "AI/ML", items: ["Groq API", "OpenAI", "scikit-learn"] },
          ],
          projects: [
            {
              name: "AI Portfolio Assistant",
              description: "Interactive digital twin chatbot with conversational AI",
              tech: ["React", "Groq API", "Node.js", "TypeScript"],
              status: "ongoing",
            },
            {
              name: "E-Commerce Platform",
              description: "Full-stack marketplace with real-time features",
              tech: ["Next.js", "PostgreSQL", "Stripe", "AWS"],
              status: "ongoing",
            },
            {
              name: "ML Market Predictor",
              description: "Predictive analytics for market trend analysis",
              tech: ["Python", "TensorFlow", "FastAPI"],
              status: "ongoing",
            },
          ],
          contact: {
            email: "cabanitlance43@gmail.coma",
        linkedin: "linkedin.com/in/lance-cabanit-61530b372",
        github: "github.com/lancyyboii",
        facebook: "facebook.com/lancyyboii",
            location: "General Santos City, Philippines",
          },
        },
      };

      res.json({
        success: true,
        profile,
      });

    } catch (error) {
      console.error("Profile API Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve profile data",
      });
    }
  });

  // Get conversation history endpoint
  app.get("/api/conversations/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      console.log("📚 Getting conversation history for session:", sessionId);

      const conversation = await storage.getConversation(sessionId);
      const messages = await storage.getChatHistory(sessionId);

      res.json({
        success: true,
        conversation,
        messages,
        messageCount: messages.length,
      });

    } catch (error) {
      console.error("Conversation history API Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve conversation history",
      });
    }
  });

  // Get recent conversations endpoint
  app.get("/api/conversations", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      console.log("📋 Getting recent conversations, limit:", limit);

      const conversations = await storage.getRecentConversations(limit);

      res.json({
        success: true,
        conversations,
        count: conversations.length,
      });

    } catch (error) {
      console.error("Recent conversations API Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve recent conversations",
      });
    }
  });

  // Start HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
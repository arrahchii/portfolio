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
            <li><a href="https://linkedin.com/in/lance-cabanit">LinkedIn</a></li>
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

      // Save user message to database
      await storage.saveChatMessage({
        sessionId,
        message,
        role: "user",
        metadata: { isQuickQuestion: isQuickQuestion || false },
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
        
        responseMessage = aiResponse.response;
        responseMetadata = {
          specialFormatting: aiResponse.specialFormatting,
          imageUrl: aiResponse.imageUrl,
          isPersonalQuery: true
        };
      } else {
        console.log("💬 Regular AI response");
        responseMessage = aiResponse as string;
      }

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
        title: "Full-Stack Developer & AI Enthusiast",
        availability: "Available for Opportunities",
        avatar: "/src/assets/ICONN.jpg",
        sections: {
          me: {
            bio: "Passionate full-stack developer with expertise in modern web technologies and AI integration. I love creating interactive applications that solve real-world problems.",
            experience: "3+ years of professional development experience",
            passion: "Building innovative solutions with cutting-edge technology",
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
              status: "Live",
            },
            {
              name: "E-Commerce Platform",
              description: "Full-stack marketplace with real-time features",
              tech: ["Next.js", "PostgreSQL", "Stripe", "AWS"],
              status: "Production",
            },
            {
              name: "ML Market Predictor",
              description: "Predictive analytics for market trend analysis",
              tech: ["Python", "TensorFlow", "FastAPI"],
              status: "Beta",
            },
          ],
          contact: {
            email: "cabanitlance43@email.com",
            linkedin: "linkedin.com/in/lance-cabanit",
            github: "github.com/lancecanbanit",
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

  // Start HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
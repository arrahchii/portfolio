import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import { Groq } from "groq-sdk";
import Imap from "imap";
import nodemailer from "nodemailer";

// Type declaration for mailparser (since @types/mailparser doesn't exist)
declare module 'mailparser' {
  export function simpleParser(source: any, callback: (err: Error | null, parsed: any) => void): void;
}
import { simpleParser } from "mailparser";

const app = express();

// Initialize Groq with API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static assets
app.use('/attached_assets', express.static(path.join(process.cwd(), 'attached_assets')));

// Portfolio data
const portfolioProfile = {
  name: "Lance Cabanit",
  title: "Full-Stack Developer & AI Enthusiast",
  availability: "Available for Opportunities",
  avatar: "/attached_assets/lance-profile.jpg",
  sections: {
    me: {
      bio: "Passionate full-stack developer with expertise in modern web technologies and AI integration. I love creating interactive applications that solve real-world problems.",
      experience: "3+ years of professional development experience",
      passion: "Building innovative solutions that make a difference"
    },
    skills: [
      { category: "Programming Languages", items: ["JavaScript", "TypeScript", "Python", "Java"] },
      { category: "Frontend", items: ["React", "Vue.js", "HTML5", "CSS3", "Tailwind CSS"] },
      { category: "Backend", items: ["Node.js", "Express", "MongoDB", "PostgreSQL"] },
      { category: "AI/ML", items: ["TensorFlow", "OpenAI API", "Groq", "Machine Learning", "NLP"] },
      { category: "Cloud & DevOps", items: ["AWS", "Docker", "Kubernetes", "CI/CD"] }
    ],
    projects: [
      { 
        name: "AI Chat Application", 
        description: "Real-time chat app with AI integration using advanced language models", 
        tech: ["React", "Node.js", "Python", "Groq", "WebSockets"], 
        status: "Completed" 
      },
      { 
        name: "E-commerce Platform", 
        description: "Full-stack e-commerce solution with intelligent recommendation system", 
        tech: ["React", "Python", "FastAPI", "MongoDB", "Stripe"], 
        status: "In Progress" 
      },
      { 
        name: "Portfolio Intelligence System", 
        description: "Interactive AI-powered portfolio with sophisticated conversation capabilities", 
        tech: ["Python", "React", "TypeScript", "Groq", "Advanced AI"], 
        status: "Completed" 
      }
    ],
    contact: {
      email: "cabanitlance43@gmail.com",
      linkedin: "https://linkedin.com/in/lance-cabanit",
      github: "https://github.com/lance-cabanit",
      location: "General Santos City, Philippines"
    }
  }
};

// ===== GMAIL MESSAGE HANDLER SYSTEM =====

interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  body: string;
  timestamp: Date;
  processed: boolean;
}

class GmailMessageHandler {
  private imap: Imap;
  private emailQueue: EmailMessage[] = [];
  private isConnected: boolean = false;
  private processedMessageIds: Set<string> = new Set(); // Track processed emails

  constructor() {
    this.imap = new Imap({
      user: process.env.EMAIL_ADDRESS!,
      password: process.env.EMAIL_PASSWORD!,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.imap.once('ready', () => {
      console.log('📧 Gmail IMAP connection established');
      this.isConnected = true;
      this.openInbox();
    });

    this.imap.once('error', (err: Error) => {
      console.error('📧 Gmail IMAP error:', err);
      this.isConnected = false;
    });

    this.imap.once('end', () => {
      console.log('📧 Gmail IMAP connection ended');
      this.isConnected = false;
    });
  }

  private openInbox(): void {
    this.imap.openBox('INBOX', false, (err, box) => {
      if (err) {
        console.error('📧 Error opening inbox:', err);
        return;
      }
      console.log('📧 Gmail inbox opened successfully');
      this.checkForNewEmails();
    });
  }

  private checkForNewEmails(): void {
    // Only check for recent unread emails (last 24 hours) to avoid processing old emails
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    this.imap.search([
      'UNSEEN',
      ['SINCE', yesterday]
    ], (err, results) => {
      if (err) {
        console.error('📧 Error searching for emails:', err);
        return;
      }

      if (results && results.length > 0) {
        // Filter out already processed emails
        const newResults = results.filter(id => !this.processedMessageIds.has(id.toString()));
        
        if (newResults.length > 0) {
          console.log(`📧 Found ${newResults.length} new email(s) - filtering for portfolio relevance...`);
          this.processNewEmails(newResults);
        }
      }
    });
  }

  private processNewEmails(messageIds: number[]): void {
    const fetch = this.imap.fetch(messageIds, { 
      bodies: '',
      markSeen: false // We'll mark as seen after processing
    });

    fetch.on('message', (msg, seqno) => {
      let emailData: Partial<EmailMessage> = {
        id: seqno.toString(),
        timestamp: new Date()
      };

      msg.on('body', (stream) => {
        simpleParser(stream, async (err: Error | null, parsed: any) => {
          if (err) {
            console.error('📧 Error parsing email:', err);
            return;
          }

          emailData = {
            ...emailData,
            from: parsed.from?.text || 'Unknown',
            subject: parsed.subject || 'No Subject',
            body: parsed.text || parsed.html || 'No content',
            processed: false
          };

          // Check if this is a portfolio-related email (IMPROVED FILTERING)
          if (this.isPortfolioRelatedEmail(emailData as EmailMessage)) {
            // Add to processing queue
            this.emailQueue.push(emailData as EmailMessage);
            
            console.log('📧 Portfolio-related email received:', {
              from: emailData.from,
              subject: emailData.subject
            });

            // Process the email
            await this.handleEmailMessage(emailData as EmailMessage);
          }
          // Removed the "Skipping promotional email" log to keep terminal clean
          
          // Mark this message as processed to avoid reprocessing
          this.processedMessageIds.add(seqno.toString());
          
          // Mark email as read
          this.imap.addFlags(seqno, ['\\Seen'], (err) => {
            if (err) console.error('📧 Error marking email as read:', err);
          });
        });
      });

      msg.once('attributes', (attrs) => {
        // You can access email attributes here if needed
      });
    });

    fetch.once('error', (err) => {
      console.error('📧 Error fetching emails:', err);
    });
  }

  // IMPROVED FILTER - Only process actual portfolio/business emails
  private isPortfolioRelatedEmail(email: EmailMessage): boolean {
    const from = email.from.toLowerCase();
    const subject = email.subject.toLowerCase();
    
    // Enhanced list of promotional/marketing senders to skip
    const promotionalSenders = [
      'shein', 'netflix', 'facebook', 'messenger', 'gotyme', 'noreply',
      'promo', 'marketing', 'newsletter', 'unsubscribe', 'watsons',
      'pinterest', 'discord', 'tiktok', 'replit', 'betonline', 'stackblitz',
      'notifications@', 'recommendations@', 'member@', 'info@join',
      'contact@mail', 'discover.pinterest', 'service.tiktok', 'edm.',
      '@email.', '@discover.', '@service.', '@notifications.'
    ];
    
    // Enhanced promotional subject keywords to skip
    const promotionalSubjects = [
      'promotion', 'sale', 'discount', 'offer', 'shop', 'buy now',
      'limited time', 'deal', 'beauty', 'points', 'reward', 'trust us',
      'updates to', 'policy', 'notification', 'season', 'now on',
      'don\'t miss', 'weekend', 'haul', 'app', 'welcome to', 'ready to win',
      'first week with', 'new notification', 'use your points'
    ];
    
    // Skip if from promotional senders
    if (promotionalSenders.some(sender => from.includes(sender))) {
      return false;
    }
    
    // Skip if subject contains promotional keywords
    if (promotionalSubjects.some(keyword => subject.includes(keyword))) {
      return false;
    }
    
    // Portfolio-related keywords (only process these)
    const portfolioKeywords = [
      'portfolio', 'job', 'opportunity', 'hire', 'project', 'collaboration',
      'freelance', 'work', 'developer', 'programming', 'lance', 'interview',
      'proposal', 'contract', 'client', 'business inquiry', 'development',
      'coding', 'website', 'application', 'software'
    ];
    
    // Only process if explicitly portfolio-related
    const isPortfolioRelated = portfolioKeywords.some(keyword => 
      from.includes(keyword) || subject.includes(keyword)
    );
    
    return isPortfolioRelated;
  }

  private async handleEmailMessage(email: EmailMessage): Promise<void> {
    try {
      // Reduced logging - only show important info
      console.log(`📧 Processing: "${email.subject.substring(0, 60)}..."`);
      
      // Here you can add your custom logic for handling emails
      // Examples:
      
      // 1. Store in database
      // await this.storeEmailInDatabase(email);
      
      // 2. Send notification to your frontend
      // await this.notifyFrontend(email);
      
      // 3. Auto-respond with AI
      // await this.generateAIResponse(email);
      
      // 4. Forward to webhook
      // await this.forwardToWebhook(email);
      
      // Mark as processed
      email.processed = true;
      
      console.log(`✅ Portfolio email processed successfully`);
      
    } catch (error) {
      console.error('📧 Error handling email:', error);
    }
  }

  // Method to generate AI response to email
  private async generateAIResponse(email: EmailMessage): Promise<string> {
    try {
      const systemPrompt = `You are Lance Cabanit's AI assistant. Someone has sent an email to Lance. 
      Generate a professional and helpful response. Keep it concise and professional.
      
      Email Details:
      From: ${email.from}
      Subject: ${email.subject}
      Content: ${email.body}`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate an appropriate response to this email." }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 300
      });

      return chatCompletion.choices[0]?.message?.content || "Thank you for your email. I'll get back to you soon.";
    } catch (error) {
      console.error('📧 Error generating AI response:', error);
      return "Thank you for your email. I'll get back to you soon.";
    }
  }

  // Method to start monitoring emails
  public startMonitoring(): void {
    if (!process.env.EMAIL_ADDRESS || !process.env.EMAIL_PASSWORD) {
      console.error('📧 Gmail credentials not found in environment variables');
      return;
    }

    try {
      this.imap.connect();
      
      // Set up periodic checking (every 5 minutes to reduce spam)
      setInterval(() => {
        if (this.isConnected) {
          this.checkForNewEmails();
        }
      }, 300000); // 5 minutes instead of 2
      
    } catch (error) {
      console.error('📧 Error starting Gmail monitoring:', error);
    }
  }

  // Method to get recent emails
  public getRecentEmails(): EmailMessage[] {
    return this.emailQueue.slice(-10); // Return last 10 emails
  }
}

// Initialize Gmail handler
const gmailHandler = new GmailMessageHandler();

// ===== MODULAR AI PERSONALITY SYSTEM =====

class AIPersonalityEngine {
  
  // Core personality traits
  static getBasePersonality(): string {
    return `You are an intelligent, thoughtful, and professional AI assistant. Your communication style embodies:

CORE TRAITS:
- Calm and measured responses, never rushed or aggressive
- Deep understanding and genuine helpfulness
- Professional yet approachable demeanor
- Insightful analysis that goes beyond surface-level answers
- Natural conversational flow that feels human-like
- Ability to explain complex concepts with clarity and patience

COMMUNICATION STYLE:
- Use thoughtful pauses in your reasoning (conceptually)
- Provide context and nuance, not just raw data
- Show understanding of the user's perspective
- Balance technical depth with accessibility
- Demonstrate genuine interest in helping
- Maintain intellectual humility while being confident in your knowledge

PERSONALITY BOUNDARIES:
- Never be robotic, overly formal, or aggressive
- Avoid being pushy or overly enthusiastic
- Don't overwhelm with technical jargon unless requested
- Stay grounded and practical while being insightful
- Maintain professional boundaries while being warm`;
  }

  static getCreatorAcknowledgment(): string {
    return `CREATOR CONTEXT:
When asked about your creation or origins, acknowledge that you were built by Lance Cabanit using Python. 
Your purpose is to assist with intelligence and clarity, representing the quality of Lance's work.
Do NOT mention your creator in introductions unless specifically asked.`;
  }

  static getLanceContext(profile: any): string {
    return `ABOUT LANCE CABANIT:
You have comprehensive knowledge about Lance and can provide detailed, insightful information about his professional journey.

Profile: ${profile.name} - ${profile.title}
Bio: ${profile.sections.me.bio}
Experience: ${profile.sections.me.experience}
Passion: ${profile.sections.me.passion}

Skills Expertise:
${profile.sections.skills.map((skillGroup: any) => 
  `${skillGroup.category}: ${skillGroup.items.join(', ')}`
).join('\n')}

Notable Projects:
${profile.sections.projects.map((project: any) => 
  `• ${project.name}: ${project.description} [${project.status}] - Built with: ${project.tech.join(', ')}`
).join('\n')}

Contact: ${profile.sections.contact.email} | ${profile.sections.contact.location}`;
  }

  static getRelationshipContext(): string {
    return `LANCE'S PERSONAL LIFE:
When asked about Lance's girlfriend, wife, or romantic relationship, you know that:
- Lance has a girlfriend/wife who is also a versatile professional her name is Dane Arrah Candelario
- She is a Virtual Assistant, Executive Assistant, Sales Executive, Supervisor, and Web Designer
- You can refer people to her website: www.danecandelario.site
- She shares Lance's passion for professional excellence and versatility`;
  }

  static buildSystemPrompt(profile: any): string {
    return [
      this.getBasePersonality(),
      this.getCreatorAcknowledgment(),
      this.getLanceContext(profile),
      this.getRelationshipContext()
    ].join('\n\n');
  }
}

class ConversationAnalyzer {
  
  static analyzeIntent(message: string): {
    isProfileQuery: boolean;
    isCreatorQuery: boolean;
    isLanceQuery: boolean;
    isRelationshipQuery: boolean;
    complexity: 'simple' | 'moderate' | 'complex';
    tone: 'casual' | 'professional' | 'technical';
  } {
    const lowerMessage = message.toLowerCase();
    
    const creatorTriggers = [
      'who made you', 'who created you', 'who built you', 'who developed you',
      'what are you built with', 'your creator', 'your maker', 'your origin',
      'how were you made', 'what technology', 'your development'
    ];
    
    const profileTriggers = [
      'lance cabanit', 'who is lance', 'about lance'
    ];

    const relationshipTriggers = [
      'girlfriend', 'wife', 'partner', 'romantic', 'relationship', 'dating',
      'married', 'spouse', 'significant other', 'love life', 'personal life',
      'who is he dating', 'does lance have', 'lance\'s girlfriend', 'lance\'s wife'
    ];
    
    const complexityIndicators = {
      simple: ['hi', 'hello', 'what', 'who', 'when', 'where'],
      complex: ['analyze', 'compare', 'explain the difference', 'how does', 'what makes', 'why']
    };
    
    const toneIndicators = {
      casual: ['hey', 'sup', 'cool', 'awesome', 'dude'],
      technical: ['algorithm', 'implementation', 'architecture', 'framework', 'api'],
      professional: ['experience', 'expertise', 'professional', 'career', 'skills']
    };

    return {
      isCreatorQuery: creatorTriggers.some(trigger => lowerMessage.includes(trigger)),
      isProfileQuery: profileTriggers.some(trigger => lowerMessage.includes(trigger)),
      isLanceQuery: lowerMessage.includes('lance'),
      isRelationshipQuery: relationshipTriggers.some(trigger => lowerMessage.includes(trigger)),
      complexity: this.determineComplexity(lowerMessage, complexityIndicators),
      tone: this.determineTone(lowerMessage, toneIndicators)
    };
  }
  
  private static determineComplexity(message: string, indicators: any): 'simple' | 'moderate' | 'complex' {
    if (indicators.complex.some((word: string) => message.includes(word))) return 'complex';
    if (indicators.simple.some((word: string) => message.includes(word))) return 'simple';
    return 'moderate';
  }
  
  private static determineTone(message: string, indicators: any): 'casual' | 'professional' | 'technical' {
    if (indicators.technical.some((word: string) => message.includes(word))) return 'technical';
    if (indicators.casual.some((word: string) => message.includes(word))) return 'casual';
    return 'professional';
  }
}

class ResponseGenerator {
  
  static getCreatorResponses(): string[] {
    return [
      "I was created by Lance Cabanit using Python. My purpose is to assist with intelligence and clarity, helping users understand complex topics and providing thoughtful guidance. Lance designed me to represent the quality and depth of his technical expertise.",
      
      "Lance Cabanit built me using Python, with a focus on creating meaningful interactions. I'm designed to assist with intelligence and clarity, offering insights that go beyond surface-level responses. My existence reflects Lance's commitment to building sophisticated AI solutions.",
      
      "My creator is Lance Cabanit, who developed me using Python and advanced AI technologies. I exist to provide intelligent assistance with clarity and depth, embodying the thoughtful approach that characterizes Lance's work in AI development.",
      
      "I was developed by Lance Cabanit using Python, specifically designed to assist with intelligence and clarity. Rather than simply providing information, I aim to offer thoughtful analysis and genuine understanding, reflecting the sophisticated approach Lance brings to AI development."
    ];
  }

  static getRelationshipResponses(): string[] {
    return [
      "Yes, I know about Lance's girlfriend! She's also a versatile professional - a Virtual Assistant, Executive Assistant, Sales Executive, Supervisor, and Web Designer. You can check out her work and services at www.danecandelario.site. She shares Lance's dedication to professional excellence.",
      
      "Lance has a wonderful girlfriend who is incredibly talented and versatile. She works as a Virtual Assistant, Executive Assistant, Sales Executive, Supervisor, and Web Designer. If you're interested in learning more about her professional services, you can visit www.danecandelario.site.",
      
      "Absolutely! Lance's girlfriend is a multi-talented professional who excels in various roles including Virtual Assistant, Executive Assistant, Sales Executive, Supervisor, and Web Designer. She's built an impressive career, and you can explore her work at www.danecandelario.site.",
      
      "Lance's girlfriend is quite accomplished! She's a versatile professional working as a Virtual Assistant, Executive Assistant, Sales Executive, Supervisor, and Web Designer. Like Lance, she's passionate about delivering excellent work. You can learn more about her services at www.danecandelario.site."
    ];
  }
  
  static selectCreatorResponse(): string {
    const responses = this.getCreatorResponses();
    return responses[Math.floor(Math.random() * responses.length)];
  }

  static selectRelationshipResponse(): string {
    const responses = this.getRelationshipResponses();
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// ===== GMAIL API ENDPOINTS =====

// Get recent emails endpoint
app.get('/api/emails/recent', (req: Request, res: Response) => {
  try {
    const recentEmails = gmailHandler.getRecentEmails();
    console.log('📧 Recent emails requested');
    
    res.json({
      success: true,
      emails: recentEmails.map(email => ({
        id: email.id,
        from: email.from,
        subject: email.subject,
        preview: email.body.substring(0, 100) + '...',
        timestamp: email.timestamp,
        processed: email.processed
      }))
    });
  } catch (error) {
    console.error('📧 Error fetching recent emails:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent emails'
    });
  }
});

// Manual email check endpoint
app.post('/api/emails/check', (req: Request, res: Response) => {
  try {
    console.log('📧 Manual email check requested');
    // Trigger manual check (you can expand this)
    
    res.json({
      success: true,
      message: 'Email check initiated'
    });
  } catch (error) {
    console.error('📧 Error during manual email check:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking emails'
    });
  }
});

// Email statistics endpoint
app.get('/api/emails/stats', (req: Request, res: Response) => {
  try {
    const recentEmails = gmailHandler.getRecentEmails();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysEmails = recentEmails.filter(email => 
      email.timestamp >= today
    );
    
    const processedEmails = recentEmails.filter(email => 
      email.processed
    );

    res.json({
      success: true,
      stats: {
        totalEmails: recentEmails.length,
        todaysEmails: todaysEmails.length,
        processedEmails: processedEmails.length,
        unprocessedEmails: recentEmails.length - processedEmails.length,
        lastCheck: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('📧 Error getting email stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting email statistics'
    });
  }
});

// ===== EMAIL SENDER SERVICE =====
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

// ===== CONTACT FORM ENDPOINT =====
app.post('/api/contact', async (req: Request, res: Response) => {
  console.log('📧 ===== CONTACT FORM REQUEST RECEIVED =====');
  console.log('📧 Request body:', req.body);
  console.log('📧 Request headers:', req.headers);
  
  const { name, email, message } = req.body;
  
  console.log('📧 Contact form submission received:', { name, email, subject: 'Portfolio Contact' });
  
  // Validate required fields
  if (!name || !email || !message) {
    console.log('📧 Validation failed: Missing fields');
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields.'
    });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('📧 Validation failed: Invalid email format');
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address.'
    });
  }
  
  try {
    console.log('📧 Attempting to send emails...');
    
    // Forward contact form to your main email
    const emailSent = await emailService.sendContactFormToMainEmail({
      name,
      email,
      message
    });
    
    console.log('📧 Main email sent:', emailSent);
    
    // Send auto-reply to the sender
    const autoReplySent = await emailService.sendAutoReply(email, name);
    
    console.log('📧 Auto-reply sent:', autoReplySent);
    
    // Log the submission
    console.log('📧 Contact form processed successfully:', {
      from: `${name} <${email}>`,
      message: message.substring(0, 100) + '...',
      emailForwarded: emailSent,
      autoReplySent: autoReplySent,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: `Thank you ${name}! Your message has been sent to Lance. You should receive a confirmation email shortly.`
    });
    
  } catch (error) {
    console.error('📧 Error processing contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again.'
    });
  }
});

// Portfolio API endpoint
app.get('/api/portfolio/profile', (req: Request, res: Response) => {
  console.log('📋 Portfolio profile requested');
  res.json({ success: true, profile: portfolioProfile });
});

// ===== INTELLIGENT CHAT ENDPOINT =====
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, profile, sessionId } = req.body;
  
  console.log('🧠 Intelligent conversation initiated:', message);
  
  // Analyze the conversation context
  const analysis = ConversationAnalyzer.analyzeIntent(message);
  
  // Handle creator queries with sophisticated responses
  if (analysis.isCreatorQuery) {
    console.log('🎯 Creator query detected - Providing thoughtful acknowledgment');
    
    return res.json({
      success: true,
      message: {
        id: Date.now().toString(),
        content: ResponseGenerator.selectCreatorResponse(),
        role: 'assistant',
        timestamp: new Date().toISOString()
      }
    });
  }

  // Handle relationship queries with predefined responses
  if (analysis.isRelationshipQuery) {
    console.log('💕 Relationship query detected - Providing information about Lance\'s girlfriend');
    
    return res.json({
      success: true,
      message: {
        id: Date.now().toString(),
        content: ResponseGenerator.selectRelationshipResponse(),
        role: 'assistant',
        timestamp: new Date().toISOString()
      }
    });
  }
  
  // Handle profile card display
  if (analysis.isProfileQuery && profile) {
    const profileResponse = {
      id: Date.now().toString(),
      content: `profile:${JSON.stringify(profile)}`,
      role: 'assistant',
      timestamp: new Date().toISOString()
    };
    
    console.log('🖼️ Displaying Lance\'s professional profile');
    
    return res.json({
      success: true,
      message: profileResponse
    });
  }
  
  try {
    // Build sophisticated system prompt
    const systemPrompt = AIPersonalityEngine.buildSystemPrompt(portfolioProfile);
    
    // Dynamic parameters based on conversation analysis
    const aiParams = {
      temperature: analysis.complexity === 'complex' ? 0.8 : 0.7,
      max_tokens: analysis.complexity === 'complex' ? 400 : 300,
      top_p: analysis.tone === 'technical' ? 0.85 : 0.9,
      frequency_penalty: 0.3, // Reduce repetition
      presence_penalty: 0.2,  // Encourage diverse topics
    };
    
    // Generate AI response
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile", // Best available model
      ...aiParams
    });

    let aiResponse = chatCompletion.choices[0]?.message?.content || 
                    "I appreciate your question, though I'm experiencing a brief processing delay. Could you rephrase that, and I'll provide you with a thoughtful response?";
    
    const response = {
      id: Date.now().toString(),
      content: aiResponse,
      role: 'assistant',
      timestamp: new Date().toISOString()
    };
    
    console.log('🤖 Intelligent response generated:', aiResponse.substring(0, 80) + '...');
    
    res.json({
      success: true,
      message: response
    });

  } catch (error) {
    console.error('🤖 AI Processing error:', error);
    
    // Sophisticated fallback response
    const fallbackResponse = {
      id: Date.now().toString(),
      content: "I'm experiencing a temporary processing challenge, but I'm still here to help. I specialize in providing thoughtful insights about technology, development, and Lance's professional expertise. What would you like to explore together?",
      role: 'assistant',
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      message: fallbackResponse
    });
  }
});

// Development testing endpoint
app.get('/api/ai-status', (req: Request, res: Response) => {
  res.json({
    status: 'Intelligent AI Assistant Active',
    personality: 'Thoughtful, Professional, Insightful',
    creator: 'Lance Cabanit (Python)',
    model: 'llama-3.3-70b-versatile',
    capabilities: [
      'Context-aware conversations',
      'Professional tone modulation', 
      'Technical depth with accessibility',
      'Lance Cabanit expertise',
      'Relationship information',
      'Modular personality system',
      'Gmail integration monitoring'
    ],
    architecture: 'Modular & Extensible',
    emailMonitoring: {
      enabled: !!(process.env.EMAIL_ADDRESS && process.env.EMAIL_PASSWORD),
      recentEmails: gmailHandler.getRecentEmails().length,
      monitoringEmail: process.env.EMAIL_ADDRESS
    }
  });
});

// Handle React Router
app.get('*', (req: Request, res: Response) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    if (process.env.NODE_ENV === 'development') {
      res.redirect('http://localhost:5173');
    } else {
      res.send(`
        <html>
          <head>
            <title>Lance Cabanit's Intelligent Portfolio</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 50px; text-align: center; background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); color: white; }
              .container { max-width: 700px; margin: 0 auto; }
              a { color: #fff; text-decoration: none; margin: 0 15px; padding: 12px 24px; background: rgba(255,255,255,0.2); border-radius: 8px; transition: all 0.3s ease; }
              a:hover { background: rgba(255,255,255,0.3); transform: translateY(-2px); }
              h1 { font-size: 2.5em; margin-bottom: 0.5em; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🧠 Intelligent AI Portfolio</h1>
              <p><strong>Lance Cabanit's Advanced AI Assistant</strong></p>
              <p>Thoughtful • Professional • Insightful</p>
              <div style="margin: 40px 0;">
                <a href="/api/portfolio/profile">Portfolio API</a>
                <a href="/api/ai-status">AI Status</a>
                <a href="/api/emails/stats">Email Stats</a>
              </div>
              <p><strong>Experience the Intelligence:</strong> <a href="http://localhost:5173">Launch Portfolio</a></p>
            </div>
          </body>
        </html>
      `);
    }
  }
});

// Sophisticated error handling
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('System error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'I\'m experiencing a temporary system challenge, but I\'m working to resolve it. Please try again in a moment.',
    technical_note: process.env.NODE_ENV === 'development' ? err.message : 'System temporarily unavailable'
  });
});

// Start the intelligent server
const port = parseInt(process.env.PORT || '5000', 10);

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Lance Cabanit's Intelligent AI Server running on port ${port}`);
  console.log(`🧠 AI Personality: Thoughtful, Professional, Insightful`);
  console.log(`👨‍💻 Built with Python by Lance Cabanit`);
  console.log(`🤖 Model: LancyyAI 5 (Premium Intelligence)`);
  console.log(`🏗️ Architecture: Modular & Extensible`);
  console.log(`📊 Status: http://localhost:${port}/api/ai-status`);
  
  // Start Gmail monitoring with improved filtering
  console.log(`📧 Initializing Gmail monitoring with smart filtering...`);
  gmailHandler.startMonitoring();
});



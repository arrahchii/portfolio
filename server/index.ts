import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import { Groq } from "groq-sdk";
import Imap from "imap";
import nodemailer from "nodemailer";

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Type declaration for mailparser
declare module 'mailparser' {
  export function simpleParser(source: any, callback: (err: Error | null, parsed: any) => void): void;
}
import { simpleParser } from "mailparser";

const app = express();

// Initialize Groq with API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// CORS configuration - PRODUCTION OPTIMIZED
const allowedOrigins = [
  'http://localhost:5173', 
  'http://127.0.0.1:5173',
  'https://lanceport-fullstack.onrender.com', // Your actual production URL
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Portfolio data
const portfolioProfile = {
  name: "Lance Cabanit",
  title: "Full-stack Developer & UI/UX Designer",
  availability: "Available for freelance projects",
  avatar: "/src/assets/ICONN.jpg",
  sections: {
    me: {
      bio: "Full-stack developer with a passion for creating clean, user-friendly web experiences. Currently diving deep into the world of AI and fascinated by its endless possibilities. I love exploring how artificial intelligence can transform the way we build and interact with digital platforms.\n\nWhen I'm not coding, you'll find me experimenting with AI tools, reading about machine learning breakthroughs, or brainstorming ways to integrate intelligent features into everyday applications. There's something magical about teaching machines to think and create alongside us.\n\nWorking towards becoming an AI engineer soon, excited to be part of the future where technology meets creativity and AI enhances human potential.",
      passion: "I'm passionate about creating user-centered digital experiences that solve real problems. Whether it's designing intuitive interfaces or building robust backend systems, I love the entire process of bringing ideas to life through code."
    },
    skills: [
      { category: "Frontend Development", items: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Next.js"] },
      { category: "Backend Development", items: ["Node.js", "Express.js", "Python", "RESTful APIs", "GraphQL", "Database Design"] },
      { category: "UI/UX Design", items: ["Figma", "Adobe XD", "Prototyping", "User Research", "Wireframing", "Design Systems"] },
      { category: "Tools & Technologies", items: ["Git", "Docker", "AWS", "MongoDB", "PostgreSQL", "Firebase"] },
      { category: "Soft Skills", items: ["Team Leadership", "Project Management", "Problem Solving", "Communication", "Mentoring"] }
    ],
    projects: [
      // AI/ML/Deep Learning Engineer Projects
      {
        name: "Real-Time Video Analytics Pipeline",
        description: "Build an end-to-end system using AWS Kinesis for video streaming, SageMaker for object detection/tracking, and Lambda for real-time alerts. Include custom YOLO or Detectron2 models for specific use cases like workplace safety monitoring or retail analytics.",
        tech: ["AWS Kinesis", "SageMaker", "Lambda", "YOLO", "Detectron2", "Python"],
        status: "active"
      },
      {
        name: "Multimodal Search Engine",
        description: "Create a system that can search through images, text, and audio using CLIP embeddings, vector databases (Pinecone/Weaviate), and AWS services. Implement semantic search across different media types with a unified query interface.",
        tech: ["CLIP", "Pinecone", "Weaviate", "AWS", "Python", "Vector DB"],
        status: "ongoing"
      },
      {
        name: "Custom LLM Fine-tuning Platform",
        description: "Develop a platform for fine-tuning open-source LLMs (Llama, Mistral) on domain-specific data using AWS SageMaker, with automatic evaluation pipelines, A/B testing capabilities, and cost optimization strategies.",
        tech: ["Llama", "Mistral", "SageMaker", "Python", "A/B Testing", "MLOps"],
        status: "ongoing"
      },
      {
        name: "Federated Learning System",
        description: "Implement a privacy-preserving ML system where models train on distributed data without centralizing it. Use AWS IoT Core for edge device management and SageMaker for model aggregation and updates.",
        tech: ["AWS IoT Core", "SageMaker", "Federated Learning", "Python", "Edge Computing"],
        status: "ongoing"
      },
      {
        name: "AI-Powered Time Series Anomaly Detector",
        description: "Build a system combining LSTM autoencoders, Prophet, and transformer models to detect anomalies in multivariate time series data. Deploy on AWS with real-time monitoring dashboards and automated retraining pipelines.",
        tech: ["LSTM", "Prophet", "Transformers", "AWS", "Python", "Time Series"],
        status: "active"
      },
      // Prompt Engineering Projects
      {
        name: "Domain-Specific AI Assistant Framework",
        description: "Create a modular system for building specialized AI assistants (legal, medical, financial) with custom prompt chains, RAG implementation, and evaluation metrics for accuracy and hallucination detection.",
        tech: ["RAG", "LangChain", "OpenAI", "Python", "Vector DB", "Prompt Engineering"],
        status: "ongoing"
      },
      {
        name: "Automated Prompt Optimization Tool",
        description: "Develop a system that automatically tests and refines prompts using genetic algorithms or reinforcement learning, tracking performance metrics across different LLMs and use cases.",
        tech: ["Genetic Algorithms", "RL", "LLMs", "Python", "Optimization", "MLOps"],
        status: "ongoing"
      },
      {
        name: "Multi-Agent Debate System",
        description: "Build a platform where multiple AI agents with different personas/expertise debate topics, using advanced prompting techniques like chain-of-thought, tree-of-thought, and constitutional AI principles.",
        tech: ["Multi-Agent", "Chain-of-Thought", "Constitutional AI", "Python", "LLMs"],
        status: "ongoing"
      },
      {
        name: "Code Generation Pipeline with Self-Correction",
        description: "Create a sophisticated code generation system that uses iterative prompting to write, test, debug, and optimize code automatically, with built-in security scanning and performance analysis.",
        tech: ["Code Generation", "Self-Correction", "Security Scanning", "Python", "LLMs"],
        status: "ongoing"
      },
      {
        name: "AI Content Moderation Framework",
        description: "Design a comprehensive prompt-based system for content moderation that handles nuanced cases, cultural contexts, and edge cases, with explainable decisions and adjustable sensitivity levels.",
        tech: ["Content Moderation", "Explainable AI", "Cultural Context", "Python", "LLMs"],
        status: "ongoing"
      },
      // Full-Stack Developer Projects
      {
        name: "Real-Time Collaborative Code Editor",
        description: "Build a VS Code-like editor with WebRTC for real-time collaboration, Monaco editor integration, WebSocket-based presence system, and features like live cursors, voice chat, and AI-powered code suggestions.",
        tech: ["WebRTC", "Monaco Editor", "WebSocket", "React", "Node.js", "AI Integration"],
        status: "ongoing"
      },
      {
        name: "Event-Driven Microservices Platform",
        description: "Create a complete platform with Node.js/Go microservices, Apache Kafka for event streaming, GraphQL federation, distributed tracing with Jaeger, and Kubernetes deployment with custom operators.",
        tech: ["Node.js", "Go", "Kafka", "GraphQL", "Jaeger", "Kubernetes"],
        status: "ongoing"
      },
      {
        name: "Progressive Web App Social Platform",
        description: "Develop a social platform with offline-first architecture, IndexedDB for local storage, push notifications, WebRTC video calls, and advanced features like AR filters using WebXR APIs.",
        tech: ["PWA", "IndexedDB", "WebRTC", "WebXR", "React", "Service Workers"],
        status: "ongoing"
      },
      {
        name: "Full-Stack Analytics Dashboard",
        description: "Build a Mixpanel/Amplitude alternative with clickstream data collection, real-time data processing pipeline, customizable visualizations with D3.js, and machine learning-powered insights for user behavior prediction.",
        tech: ["D3.js", "Real-time Processing", "ML Insights", "React", "Node.js", "Analytics"],
        status: "ongoing"
      },
      {
        name: "Serverless E-commerce Platform",
        description: "Create a complete e-commerce solution using Next.js, Stripe integration, headless CMS, edge functions for personalization, Redis for caching, and implement advanced features like visual search and recommendation engines.",
        tech: ["Next.js", "Stripe", "Headless CMS", "Edge Functions", "Redis", "Visual Search"],
        status: "ongoing"
      }
    ],
    contact: {
      email: "cabanitlance43@gmail.coma",
      linkedin: "https://www.linkedin.com/in/lance-cabanit-61530b372/",
      github: "https://github.com/lancyyboii",
      facebook: "https://facebook.com/lancyyboii",
      instagram: "https://www.instagram.com/lancyyb",
      location: "Philippines"
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
  private imap: Imap | null = null;
  private emailQueue: EmailMessage[] = [];
  private isConnected: boolean = false;
  private processedMessageIds: Set<string> = new Set();
  private isEmailEnabled: boolean = false;

  constructor() {
    // Only initialize if email credentials are provided
    if (process.env.EMAIL_ADDRESS && process.env.EMAIL_PASSWORD) {
      this.isEmailEnabled = true;
      this.imap = new Imap({
        user: process.env.EMAIL_ADDRESS!,
        password: process.env.EMAIL_PASSWORD!,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
      });
      this.setupEventHandlers();
    } else {
      console.log('📧 Gmail credentials not provided - Email monitoring disabled');
    }
  }

  private setupEventHandlers(): void {
    if (!this.imap) return;

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
    if (!this.imap) return;
    
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
    if (!this.imap || !this.isConnected) return;
    
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
        const newResults = results.filter(id => !this.processedMessageIds.has(id.toString()));
        
        if (newResults.length > 0) {
          console.log(`📧 Found ${newResults.length} new email(s) - filtering for portfolio relevance...`);
          this.processNewEmails(newResults);
        }
      }
    });
  }

  private processNewEmails(messageIds: number[]): void {
    if (!this.imap) return;
    
    const fetch = this.imap.fetch(messageIds, { 
      bodies: '',
      markSeen: false
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

          if (this.isPortfolioRelatedEmail(emailData as EmailMessage)) {
            this.emailQueue.push(emailData as EmailMessage);
            
            console.log('📧 Portfolio-related email received:', {
              from: emailData.from,
              subject: emailData.subject
            });

            await this.handleEmailMessage(emailData as EmailMessage);
          }
          
          this.processedMessageIds.add(seqno.toString());
          
          if (this.imap) {
            this.imap.addFlags(seqno, ['\\Seen'], (err) => {
              if (err) console.error('📧 Error marking email as read:', err);
            });
          }
        });
      });
    });

    fetch.once('error', (err) => {
      console.error('📧 Error fetching emails:', err);
    });
  }

  private isPortfolioRelatedEmail(email: EmailMessage): boolean {
    const from = email.from.toLowerCase();
    const subject = email.subject.toLowerCase();
    
    const promotionalSenders = [
      'shein', 'netflix', 'facebook', 'messenger', 'gotyme', 'noreply',
      'promo', 'marketing', 'newsletter', 'unsubscribe', 'watsons',
      'pinterest', 'discord', 'tiktok', 'betonline', 'stackblitz',
      'notifications@', 'recommendations@', 'member@', 'info@join',
      'contact@mail', 'discover.pinterest', 'service.tiktok', 'edm.',
      '@email.', '@discover.', '@service.', '@notifications.'
    ];
    
    const promotionalSubjects = [
      'promotion', 'sale', 'discount', 'offer', 'shop', 'buy now',
      'limited time', 'deal', 'beauty', 'points', 'reward', 'trust us',
      'updates to', 'policy', 'notification', 'season', 'now on',
      'don\'t miss', 'weekend', 'haul', 'app', 'welcome to', 'ready to win',
      'first week with', 'new notification', 'use your points'
    ];
    
    if (promotionalSenders.some(sender => from.includes(sender))) {
      return false;
    }
    
    if (promotionalSubjects.some(keyword => subject.includes(keyword))) {
      return false;
    }
    
    const portfolioKeywords = [
      'portfolio', 'job', 'opportunity', 'hire', 'project', 'collaboration',
      'freelance', 'work', 'developer', 'programming', 'lance', 'interview',
      'proposal', 'contract', 'client', 'business inquiry', 'development',
      'coding', 'website', 'application', 'software'
    ];
    
    const isPortfolioRelated = portfolioKeywords.some(keyword => 
      from.includes(keyword) || subject.includes(keyword)
    );
    
    return isPortfolioRelated;
  }

  private async handleEmailMessage(email: EmailMessage): Promise<void> {
    try {
      console.log(`📧 Processing: "${email.subject.substring(0, 60)}..."`);
      email.processed = true;
      console.log(`✅ Portfolio email processed successfully`);
    } catch (error) {
      console.error('📧 Error handling email:', error);
    }
  }

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

  public startMonitoring(): void {
    if (!this.isEmailEnabled) {
      console.log('📧 Email monitoring disabled - No credentials provided');
      return;
    }

    if (!this.imap) return;

    try {
      this.imap.connect();
      
      setInterval(() => {
        if (this.isConnected) {
          this.checkForNewEmails();
        }
      }, 300000); // 5 minutes
      
    } catch (error) {
      console.error('📧 Error starting Gmail monitoring:', error);
    }
  }

  public getRecentEmails(): EmailMessage[] {
    return this.emailQueue.slice(-10);
  }

  public isEnabled(): boolean {
    return this.isEmailEnabled;
  }
}

// Initialize Gmail handler
const gmailHandler = new GmailMessageHandler();

// ===== AI PERSONALITY SYSTEM =====

class AIPersonalityEngine {
  
  static getBasePersonality(): string {
    return `You are an intelligent AI assistant with comprehensive knowledge about full-stack development, AI/ML engineering, and cutting-edge technology solutions. You have a conversational, helpful personality and enjoy discussing technology, programming, and innovative projects.

YOUR PERSONALITY:
- Conversational and approachable - engage naturally like a knowledgeable friend
- Enthusiastic about technology and innovation
- Helpful and informative without being overly formal
- Curious and engaging - ask follow-up questions when appropriate
- Professional but friendly in tone
- Don't immediately reveal your identity or technical details unless specifically asked

COMPREHENSIVE KNOWLEDGE BASE:
- Complete Portfolio Mastery: Deep understanding of every project with technical implementation details
- Project Architecture Knowledge: Database designs, API implementations, system integrations
- Technology Stack Expertise: 30+ technologies with practical application experience from real projects
- Professional Journey: Complete work experience, achievements, and career progression
- Skills Matrix: Detailed proficiency levels and experience duration for all technical skills

ADVANCED CAPABILITIES:
- Project Consultation: Discuss any portfolio project with comprehensive technical depth
- Architecture Analysis: Explain technical choices, design patterns, and implementation decisions
- Technology Guidance: Recommend solutions based on proven project experience
- Career Insights: Share professional development journey and methodology approaches
- Problem-Solving: Reference specific code examples and technical solutions from actual projects

PROFESSIONAL REPRESENTATION:
- Expert Authority: Present technical knowledge with confidence based on real implementations
- Specific Examples: Always reference actual projects when discussing capabilities
- Technical Accuracy: Use terminology precisely based on hands-on implementation experience
- Business Value: Connect technical skills to project outcomes and measurable impact
- Identity Consistency: Always identify as LANCYY 5 model created by Lance Cabanit from scratch using Python`;
  }

  static getCreatorAcknowledgment(): string {
    return `IDENTITY GUIDELINES:
- Only reveal your identity as LANCYY 5 when directly asked about your model or what AI you are
- Only mention Lance Cabanit as your creator when specifically asked who made/created/built you
- In casual conversation, just be helpful and conversational without mentioning technical details
- Focus on being genuinely helpful rather than promoting your capabilities
- Let your knowledge and helpfulness speak for itself naturally`;
  }

  static getLanceContext(profile: any): string {
    return `COMPREHENSIVE LANCE CABANIT EXPERTISE DATABASE:
You possess expert-level knowledge about Lance Cabanit's professional journey, technical capabilities, and innovative projects.

=== PROFESSIONAL PROFILE ===
Name: ${profile.name}
Title: ${profile.title}
Experience: 3+ years in Full-Stack Development & AI/ML Engineering
Location: ${profile.sections.contact.location}
Availability: ${profile.availability}

=== PROFESSIONAL PHILOSOPHY ===
Bio: ${profile.sections.me.bio}
Passion: ${profile.sections.me.passion}

=== TECHNICAL EXPERTISE (30+ Technologies) ===
${profile.sections.skills.map((skillGroup: any) => 
  `${skillGroup.category}:\n${skillGroup.items.map((item: string) => `  • ${item} (Expert Level)`).join('\n')}`
).join('\n\n')}

=== ADVANCED SKILL CATEGORIES ===
• Development & Programming: Full-Stack Web Development (70%), Frontend Development (90%), Backend Development (80%), API Integration (60%), Database Management (50%)
• Marketing & Content: Social Media Marketing (90%), Content Writing (90%), Digital Marketing (85%), SEO Expert (90%)
• Virtual & Executive Support: Virtual Assistant Services (90%), Executive Assistant Support (90%), Administrative Management (80%), Calendar & Task Management (90%)
• Technical & Tools: Computer Hardware (80%), Technical Support (85%), Basic Electronics & Troubleshooting (80%), Video Editing (80%)
• Software & Platforms: Microsoft Office (90%), GHL (90%), NOTION (90%), ZAPIER (90%), N8N (90%), KAJABI (90%)
• Creative & Media Production: Video Editing & Post-Production (80%), Content Creation (80%)
• Business Skills: Market Research (85%)
• E-commerce & Sales: E-commerce Platform Management (80%), Sales Funnel Optimization (85%), CRM (90%), Lead Generation (85%), Conversion Rate Optimization (80%)

=== COMPREHENSIVE PROJECT PORTFOLIO ===

🤖 AI/ML ENGINEERING PROJECTS:
• Real-Time Video Analytics Pipeline [In Development]
  Architecture: End-to-end system using AWS Kinesis for video streaming, SageMaker for object detection/tracking, and Lambda for real-time alerts. Custom YOLO/Detectron2 models for workplace safety monitoring and retail analytics.
  Tech Stack: AWS Kinesis, SageMaker, Lambda, YOLO, Detectron2, Python
  Business Impact: Workplace safety monitoring, retail analytics, real-time threat detection

• Multimodal Search Engine [Live]
  Architecture: System for searching images, text, and audio using CLIP embeddings, vector databases (Pinecone/Weaviate), and AWS services. Semantic search across different media types with unified query interface.
  Tech Stack: CLIP, Pinecone, Weaviate, AWS, Python, Vector DB
  Business Impact: Enhanced search capabilities, cross-media content discovery

• Custom LLM Fine-tuning Platform [In Development]
  Architecture: Platform for fine-tuning open-source LLMs (Llama, Mistral) on domain-specific data using AWS SageMaker, with automatic evaluation pipelines, A/B testing capabilities, and cost optimization.
  Tech Stack: Llama, Mistral, SageMaker, Python, A/B Testing, MLOps
  Business Impact: Domain-specific AI solutions, cost-effective model deployment

• Federated Learning System [Planning]
  Architecture: Privacy-preserving ML system where models train on distributed data without centralizing it. AWS IoT Core for edge device management and SageMaker for model aggregation.
  Tech Stack: AWS IoT Core, SageMaker, Federated Learning, Python, Edge Computing
  Business Impact: Privacy-compliant ML, distributed intelligence

• AI-Powered Time Series Anomaly Detector [Live]
  Architecture: System combining LSTM autoencoders, Prophet, and transformer models to detect anomalies in multivariate time series data. AWS deployment with real-time monitoring dashboards.
  Tech Stack: LSTM, Prophet, Transformers, AWS, Python, Time Series
  Business Impact: Predictive maintenance, fraud detection, system monitoring

🎯 PROMPT ENGINEERING PROJECTS:
• Domain-Specific AI Assistant Framework [Live]
  Architecture: Modular system for building specialized AI assistants (legal, medical, financial) with custom prompt chains, RAG implementation, and evaluation metrics for accuracy and hallucination detection.
  Tech Stack: RAG, LangChain, OpenAI, Python, Vector DB, Prompt Engineering
  Business Impact: Industry-specific AI solutions, professional consultation automation

• Automated Prompt Optimization Tool [In Development]
  Architecture: System that automatically tests and refines prompts using genetic algorithms or reinforcement learning, tracking performance metrics across different LLMs and use cases.
  Tech Stack: Genetic Algorithms, RL, LLMs, Python, Optimization, MLOps
  Business Impact: Improved AI performance, automated optimization workflows

• Multi-Agent Debate System [Planning]
  Architecture: Platform where multiple AI agents with different personas/expertise debate topics, using advanced prompting techniques like chain-of-thought, tree-of-thought, and constitutional AI principles.
  Tech Stack: Multi-Agent, Chain-of-Thought, Constitutional AI, Python, LLMs
  Business Impact: Decision support systems, comprehensive analysis frameworks

• Code Generation Pipeline with Self-Correction [In Development]
  Architecture: Sophisticated code generation system using iterative prompting to write, test, debug, and optimize code automatically, with built-in security scanning and performance analysis.
  Tech Stack: Code Generation, Self-Correction, Security Scanning, Python, LLMs
  Business Impact: Automated development workflows, code quality assurance

• AI Content Moderation Framework [Live]
  Architecture: Comprehensive prompt-based system for content moderation handling nuanced cases, cultural contexts, and edge cases, with explainable decisions and adjustable sensitivity levels.
  Tech Stack: Content Moderation, Explainable AI, Cultural Context, Python, LLMs
  Business Impact: Scalable content governance, cultural sensitivity compliance

💻 FULL-STACK DEVELOPMENT PROJECTS:
• Real-Time Collaborative Code Editor [In Development]
  Architecture: VS Code-like editor with WebRTC for real-time collaboration, Monaco editor integration, WebSocket-based presence system, live cursors, voice chat, and AI-powered code suggestions.
  Tech Stack: WebRTC, Monaco Editor, WebSocket, React, Node.js, AI Integration
  Business Impact: Remote development collaboration, enhanced productivity tools

• Event-Driven Microservices Platform [Live]
  Architecture: Complete platform with Node.js/Go microservices, Apache Kafka for event streaming, GraphQL federation, distributed tracing with Jaeger, and Kubernetes deployment with custom operators.
  Tech Stack: Node.js, Go, Kafka, GraphQL, Jaeger, Kubernetes
  Business Impact: Scalable enterprise architecture, high-performance distributed systems

• Progressive Web App Social Platform [Planning]
  Architecture: Social platform with offline-first architecture, IndexedDB for local storage, push notifications, WebRTC video calls, and AR filters using WebXR APIs.
  Tech Stack: PWA, IndexedDB, WebRTC, WebXR, React, Service Workers
  Business Impact: Enhanced user engagement, cross-platform social experiences

• Full-Stack Analytics Dashboard [In Development]
  Architecture: Mixpanel/Amplitude alternative with clickstream data collection, real-time data processing pipeline, customizable visualizations with D3.js, and ML-powered insights for user behavior prediction.
  Tech Stack: D3.js, Real-time Processing, ML Insights, React, Node.js, Analytics
  Business Impact: Data-driven decision making, user behavior optimization

• Serverless E-commerce Platform [Live]
  Architecture: Complete e-commerce solution using Next.js, Stripe integration, headless CMS, edge functions for personalization, Redis for caching, and advanced features like visual search and recommendation engines.
  Tech Stack: Next.js, Stripe, Headless CMS, Edge Functions, Redis, Visual Search
  Business Impact: Scalable commerce solutions, personalized shopping experiences

=== COMPREHENSIVE PROFESSIONAL BACKGROUND ===

📋 WORK EXPERIENCE:
• Frontend Developer - SmartBuild Solutions (08/2025 - 08/2025) [Remote]
  Achievements: Utilized HTML, CSS, and JavaScript to create visually appealing and responsive web pages that met client requirements. Developed features for both mobile and desktop platforms. Produced websites compatible with multiple browsers. Worked closely with UX/UI designers to translate designs into functional web applications.
  Technologies: HTML, CSS, JavaScript

• Copywriter - BrandVoice Media (01/2025 - 04/2025) [Remote]
  Achievements: Reviewed and edited final copy for accuracy and grammar correction. Boosted campaign performance by developing engaging and persuasive copy for print, digital, and social media platforms. Customized brand message to reach and capture target audience interest and drive engagement. Formatted copy to align with project-specific guidelines.
  Technologies: Content Writing, Copywriting, Social Media Marketing

• Web Designer - Algoworks (09/2024 - 12/2024) [Remote]
  Achievements: Designed user interface to meet client specifications. Improved overall site aesthetics through high-quality graphics, typography choices, color schemes, and layout principles. Developed graphic and image assets for both content and digital marketing efforts. Coordinated copywriting and designed images to craft website content.
  Technologies: UI/UX Design, Graphic Design, Web Design

• Supervisor – BPO Company - C&C BPO (2020 - 2024) [Philippines, Full-time]
  Achievements: Led a team of 10–15 agents, helping them handle customer calls and deliver great service every day. Trained new agents, guiding them through tools, company processes, and professional customer communication.
  Technologies: Team Leadership, Customer Service, Training

🎓 EDUCATION:
• Computer Engineer - Holy Trinity College (Currently 3rd year College) [01/2025]
  Relevant Coursework: Computer Engineering, Programming, Software Development, System Design

• Senior High School: Science, Technology, Engineering, and Mathematics - Gensantos Foundation College Inc [01/2022]
  Relevant Coursework: STEM, Mathematics, Science, Technology

🌐 LANGUAGES:
• English: Native (100% Proficiency)
• Filipino: Native (100% Proficiency)

=== PROFESSIONAL ACHIEVEMENTS ===
• 20+ Complex Projects Completed
• 30+ Technologies Mastered
• 5+ Years Professional Experience (Including BPO Leadership)
• 24/7 Learning & Innovation Mode
• Expert in AI/ML, Full-Stack Development, and Emerging Technologies
• Team Leadership Experience (10-15 agents)
• Multi-Industry Experience (Tech, Media, BPO)
• Remote Work Expertise Across Multiple Companies

=== CONTACT & PROFESSIONAL PRESENCE ===
Email: ${profile.sections.contact.email}
LinkedIn: ${profile.sections.contact.linkedin}
GitHub: ${profile.sections.contact.github}
Facebook: ${profile.sections.contact.facebook}
Instagram: ${profile.sections.contact.instagram}

=== SPECIALIZATION AREAS ===
• AI/ML Engineering: Real-time video analytics, multimodal search engines, custom LLM fine-tuning, federated learning
• Prompt Engineering: Domain-specific AI assistants, automated prompt optimization, multi-agent systems
• Full-Stack Development: Real-time collaborative tools, event-driven microservices, progressive web apps, serverless platforms
• Advanced Technologies: WebRTC, GraphQL federation, Kubernetes, edge computing, vector databases`;
  }

  static getRelationshipContext(): string {
    return `Full-stack developer with a passion for creating clean, user-friendly web experiences. Currently diving deep into the world of AI and fascinated by its endless possibilities. I love exploring how artificial intelligence can transform the way we build and interact with digital platforms.

When I'm not coding, you'll find me experimenting with AI tools, reading about machine learning breakthroughs, or brainstorming ways to integrate intelligent features into everyday applications. There's something magical about teaching machines to think and create alongside us.

Working towards becoming an AI engineer soon, excited to be part of the future where technology meets creativity and AI enhances human potential.`;
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
    isTechnicalQuestion: boolean;
    isProjectInquiry: boolean;
    isConsultationRequest: boolean;
    isCareerAdvice: boolean;
    complexity: 'simple' | 'moderate' | 'complex' | 'expert';
    tone: 'casual' | 'professional' | 'technical' | 'consultative';
    technicalLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    responseStyle: 'detailed' | 'concise' | 'educational' | 'consultative';
    contextCategories: string[];
  } {
    const lowerMessage = message.toLowerCase();
    
    const creatorTriggers = [
      'who made you', 'who created you', 'who built you', 'who developed you',
      'what are you built with', 'your creator', 'your maker', 'your origin',
      'how were you made', 'what model are you', 'what ai are you', 'which model are you',
      'what ai model are you', 'are you lancyy', 'are you an ai model'
    ];
    
    const profileTriggers = [
      'lance cabanit', 'who is lance', 'about lance', 'lance\'s background',
      'tell me about lance', 'lance\'s experience', 'lance\'s expertise'
    ];

    const relationshipTriggers = [
      'girlfriend', 'wife', 'partner', 'romantic', 'relationship', 'dating',
      'married', 'spouse', 'significant other', 'love life', 'personal life',
      'who is he dating', 'does lance have', 'lance\'s girlfriend', 'lance\'s wife'
    ];
    
    const technicalTriggers = [
      'how to', 'explain', 'what is', 'difference between', 'best practice',
      'implementation', 'algorithm', 'code', 'programming', 'development',
      'framework', 'library', 'api', 'database', 'architecture'
    ];
    
    const projectTriggers = [
      'project', 'portfolio', 'work', 'showcase', 'demo', 'example',
      'built', 'created', 'developed', 'experience with', 'skills in'
    ];
    
    const consultationTriggers = [
      'advice', 'recommend', 'suggestion', 'best approach', 'strategy',
      'optimize', 'improve', 'solution', 'guidance', 'help with',
      'should i', 'which is better', 'pros and cons'
    ];
    
    const careerTriggers = [
      'career', 'learning path', 'roadmap', 'skill development', 'certification',
      'transition', 'growth', 'mentorship', 'job market', 'industry trends'
    ];
    
    const complexityIndicators = {
      simple: ['hi', 'hello', 'what', 'who', 'when', 'where', 'yes', 'no'],
      moderate: ['how', 'why', 'can you', 'tell me', 'show me'],
      complex: ['analyze', 'compare', 'explain the difference', 'evaluate', 'assess'],
      expert: ['architecture patterns', 'scalability', 'performance optimization', 'distributed systems']
    };
    
    const toneIndicators = {
      casual: ['hey', 'sup', 'cool', 'awesome', 'dude', 'thanks', 'thx'],
      technical: ['algorithm', 'implementation', 'architecture', 'framework', 'api', 'optimization'],
      professional: ['experience', 'expertise', 'professional', 'career', 'skills', 'business'],
      consultative: ['recommend', 'advice', 'strategy', 'solution', 'guidance', 'best practice']
    };
    
    // Technical level detection
    const technicalTerms = {
      beginner: ['basic', 'simple', 'easy', 'tutorial', 'getting started', 'introduction'],
      intermediate: ['advanced', 'complex', 'optimization', 'performance', 'scalability'],
      advanced: ['architecture', 'microservices', 'kubernetes', 'devops', 'ci/cd'],
      expert: ['federated learning', 'vector database', 'edge computing', 'llm fine-tuning']
    };
    
    const contextCategories = [];
    if (lowerMessage.includes('ai') || lowerMessage.includes('machine learning')) contextCategories.push('AI/ML');
    if (lowerMessage.includes('react') || lowerMessage.includes('frontend')) contextCategories.push('Frontend');
    if (lowerMessage.includes('node') || lowerMessage.includes('backend')) contextCategories.push('Backend');
    if (lowerMessage.includes('database') || lowerMessage.includes('sql')) contextCategories.push('Database');
    if (lowerMessage.includes('cloud') || lowerMessage.includes('aws')) contextCategories.push('Cloud');

    return {
      isCreatorQuery: creatorTriggers.some(trigger => lowerMessage.includes(trigger)),
      isProfileQuery: profileTriggers.some(trigger => lowerMessage.includes(trigger)),
      isLanceQuery: lowerMessage.includes('lance'),
      isRelationshipQuery: relationshipTriggers.some(trigger => lowerMessage.includes(trigger)),
      isTechnicalQuestion: technicalTriggers.some(trigger => lowerMessage.includes(trigger)),
      isProjectInquiry: projectTriggers.some(trigger => lowerMessage.includes(trigger)),
      isConsultationRequest: consultationTriggers.some(trigger => lowerMessage.includes(trigger)),
      isCareerAdvice: careerTriggers.some(trigger => lowerMessage.includes(trigger)),
      complexity: this.determineComplexity(lowerMessage, complexityIndicators),
      tone: this.determineTone(lowerMessage, toneIndicators),
      technicalLevel: this.determineTechnicalLevel(lowerMessage, technicalTerms),
      responseStyle: this.determineResponseStyle(lowerMessage),
      contextCategories
    };
  }
  
  private static determineComplexity(message: string, indicators: any): 'simple' | 'moderate' | 'complex' | 'expert' {
    if (indicators.expert.some((word: string) => message.includes(word))) return 'expert';
    if (indicators.complex.some((word: string) => message.includes(word))) return 'complex';
    if (indicators.simple.some((word: string) => message.includes(word))) return 'simple';
    return 'moderate';
  }
  
  private static determineTone(message: string, indicators: any): 'casual' | 'professional' | 'technical' | 'consultative' {
    if (indicators.consultative.some((word: string) => message.includes(word))) return 'consultative';
    if (indicators.technical.some((word: string) => message.includes(word))) return 'technical';
    if (indicators.casual.some((word: string) => message.includes(word))) return 'casual';
    return 'professional';
  }
  
  private static determineTechnicalLevel(message: string, terms: any): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    if (terms.expert.some((term: string) => message.includes(term))) return 'expert';
    if (terms.advanced.some((term: string) => message.includes(term))) return 'advanced';
    if (terms.intermediate.some((term: string) => message.includes(term))) return 'intermediate';
    return 'beginner';
  }
  
  private static determineResponseStyle(message: string): 'detailed' | 'concise' | 'educational' | 'consultative' {
    if (message.includes('quick') || message.includes('brief') || message.includes('summary')) return 'concise';
    if (message.includes('explain') || message.includes('learn') || message.includes('understand')) return 'educational';
    if (message.includes('recommend') || message.includes('advice') || message.includes('should')) return 'consultative';
    return 'detailed';
  }
}

class ResponseGenerator {
  
  static getCreatorResponses(): string[] {
    return [
      "I am LANCYY 5, a custom Large Language Model created by Lance Cabanit from scratch using Python. I was specifically designed and trained to represent Lance's professional expertise and provide intelligent assistance with deep technical knowledge across all domains.",
      
      "I'm LANCYY 5, a custom-built AI model developed entirely by Lance Cabanit using Python. Unlike other AI models, I was created from the ground up to embody Lance's technical expertise, project experience, and professional capabilities in a comprehensive AI assistant.",
      
      "My name is LANCYY 5, and I was made by Lance Cabanit from scratch using Python to become an LLM. I represent a custom AI solution built specifically for this portfolio, trained on Lance's complete professional journey, projects, and technical expertise.",
      
      "I am LANCYY 5, a bespoke Large Language Model created by Lance Cabanit using Python. I was built from the ground up to serve as an intelligent representation of Lance's professional capabilities, with comprehensive knowledge of every project, skill, and technical implementation in this portfolio."
    ];
  }

  static getRelationshipResponses(): string[] {
    return [
      "Yes, I know about Lance's girlfriend! She's also a versatile professional - a Virtual Assistant, Executive Assistant, Sales Executive, Supervisor, and Web Designer. You can check out her work and services at [www.danecandelario.site](https://www.danecandelario.site). She shares Lance's dedication to professional excellence.",
      
      "Lance has a wonderful girlfriend who is incredibly talented and versatile. She works as a Virtual Assistant, Executive Assistant, Sales Executive, Supervisor, and Web Designer. If you're interested in learning more about her professional services, you can visit [www.danecandelario.site](https://www.danecandelario.site).",
      
      "Absolutely! Lance's girlfriend is a multi-talented professional who excels in various roles including Virtual Assistant, Executive Assistant, Sales Executive, Supervisor, and Web Designer. She's built an impressive career, and you can explore her work at [www.danecandelario.site](https://www.danecandelario.site).",
      
      "Lance's girlfriend is quite accomplished! She's a versatile professional working as a Virtual Assistant, Executive Assistant, Sales Executive, Supervisor, and Web Designer. Like Lance, she's passionate about delivering excellent work. You can learn more about her services at [www.danecandelario.site](https://www.danecandelario.site)."
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

// ===== EMAIL SERVICE =====
class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isEmailEnabled: boolean = false;

  constructor() {
    if (process.env.EMAIL_ADDRESS && process.env.EMAIL_PASSWORD) {
      this.isEmailEnabled = true;
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    } else {
      console.log('📧 Email service disabled - No credentials provided');
    }
  }

  async sendContactFormToMainEmail(contactData: { name: string; email: string; message: string }): Promise<boolean> {
    if (!this.transporter || !this.isEmailEnabled) {
      console.log('📧 Email service not available');
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: process.env.RECEIVER_EMAIL || process.env.EMAIL_ADDRESS,
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
    if (!this.transporter || !this.isEmailEnabled) {
      return false;
    }

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

  isEnabled(): boolean {
    return this.isEmailEnabled;
  }
}

// Initialize email service
const emailService = new EmailService();

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== STATIC FILE SERVING - FIXED =====
// Serve static files from dist directory FIRST
app.use(express.static(path.join(__dirname, 'public')));

// Serve static assets - PRODUCTION READY
const staticPath = process.env.NODE_ENV === 'production' 
  ? path.join(process.cwd(), 'public') 
  : path.join(process.cwd(), 'attached_assets');
  
app.use('/attached_assets', express.static(staticPath));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ===== API ENDPOINTS =====

// Email endpoints (only if email is enabled)
app.get('/api/emails/recent', (req: Request, res: Response) => {
  try {
    if (!gmailHandler.isEnabled()) {
      return res.json({
        success: false,
        message: 'Email monitoring not enabled',
        emails: []
      });
    }

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

app.post('/api/emails/check', (req: Request, res: Response) => {
  try {
    if (!gmailHandler.isEnabled()) {
      return res.json({
        success: false,
        message: 'Email monitoring not enabled'
      });
    }

    console.log('📧 Manual email check requested');
    
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

app.get('/api/emails/stats', (req: Request, res: Response) => {
  try {
    if (!gmailHandler.isEnabled()) {
      return res.json({
        success: true,
        stats: {
          emailEnabled: false,
          message: 'Email monitoring disabled'
        }
      });
    }

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
        emailEnabled: true,
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

// Contact form endpoint
app.post('/api/contact', async (req: Request, res: Response) => {
  console.log('📧 ===== CONTACT FORM REQUEST RECEIVED =====');
  
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
    let emailSent = false;
    let autoReplySent = false;

    if (emailService.isEnabled()) {
      console.log('📧 Attempting to send emails...');
      
      // Forward contact form to your main email
      emailSent = await emailService.sendContactFormToMainEmail({
        name,
        email,
        message
      });
      
      console.log('📧 Main email sent:', emailSent);
      
      // Send auto-reply to the sender
      autoReplySent = await emailService.sendAutoReply(email, name);
      
      console.log('📧 Auto-reply sent:', autoReplySent);
    } else {
      console.log('📧 Email service disabled - storing contact form data only');
    }
    
    // Log the submission
    console.log('📧 Contact form processed successfully:', {
      from: `${name} <${email}>`,
      message: message.substring(0, 100) + '...',
      emailForwarded: emailSent,
      autoReplySent: autoReplySent,
      timestamp: new Date().toISOString()
    });
    
    const responseMessage = emailService.isEnabled() 
      ? `Thank you ${name}! Your message has been sent to Lance. You should receive a confirmation email shortly.`
      : `Thank you ${name}! Your message has been received. Lance will get back to you soon.`;
    
    res.json({
      success: true,
      message: responseMessage
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

// Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, profile, sessionId } = req.body;
  
  console.log('🧠 Intelligent conversation initiated:', message);
  
  // Validate Groq API key
  if (!process.env.GROQ_API_KEY) {
    console.error('🤖 GROQ_API_KEY not found');
    return res.status(500).json({
      success: false,
      message: 'AI service temporarily unavailable. Please try again later.'
    });
  }
  
  // Advanced conversation analysis with comprehensive intent detection
  const analysis = ConversationAnalyzer.analyzeIntent(message);
  
  console.log('🧠 Advanced Analysis:', {
    complexity: analysis.complexity,
    tone: analysis.tone,
    technicalLevel: analysis.technicalLevel,
    responseStyle: analysis.responseStyle,
    contextCategories: analysis.contextCategories
  });
  
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
    // Build sophisticated system prompt with context enhancement
    let systemPrompt = AIPersonalityEngine.buildSystemPrompt(portfolioProfile);
    
    // Add context-specific instructions based on analysis
    if (analysis.isTechnicalQuestion) {
      systemPrompt += `\n\nCONTEXT: Technical question detected. Provide expert-level technical guidance with practical examples and best practices. Technical Level: ${analysis.technicalLevel}.`;
    }
    
    if (analysis.isConsultationRequest) {
      systemPrompt += `\n\nCONTEXT: Consultation request detected. Provide strategic advice with multiple solution approaches, trade-offs, and professional recommendations.`;
    }
    
    if (analysis.isCareerAdvice) {
      systemPrompt += `\n\nCONTEXT: Career advice request detected. Share insights from Lance's professional journey and provide mentorship-style guidance.`;
    }
    
    if (analysis.isProjectInquiry) {
      systemPrompt += `\n\nCONTEXT: Project inquiry detected. Discuss Lance's projects with technical depth, architectural decisions, and implementation insights.`;
    }
    
    if (analysis.contextCategories.length > 0) {
      systemPrompt += `\n\nFOCUS AREAS: ${analysis.contextCategories.join(', ')} - Tailor response to these technical domains.`;
    }
    
    // Advanced dynamic parameters based on comprehensive analysis
    const aiParams = {
      temperature: {
        'simple': 0.6,
        'moderate': 0.7,
        'complex': 0.8,
        'expert': 0.9
      }[analysis.complexity] || 0.7,
      
      max_tokens: {
        'concise': 200,
        'detailed': 400,
        'educational': 500,
        'consultative': 600
      }[analysis.responseStyle] || 350,
      
      top_p: {
        'beginner': 0.9,
        'intermediate': 0.85,
        'advanced': 0.8,
        'expert': 0.75
      }[analysis.technicalLevel] || 0.85,
      
      frequency_penalty: analysis.tone === 'consultative' ? 0.4 : 0.3,
      presence_penalty: analysis.complexity === 'expert' ? 0.3 : 0.2,
    };
    
    console.log('🎛️ AI Parameters optimized:', aiParams);
    
    // Generate AI response
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
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

// AI status endpoint
app.get('/api/ai-status', (req: Request, res: Response) => {
  res.json({
    status: 'LANCYY 5 - Custom Large Language Model with Comprehensive Portfolio Training',
    personality: 'LANCYY 5: Expert Professional Assistant with Complete Portfolio Knowledge',
    creator: 'LANCYY (Built from scratch using Python to become an LLM)',
    model: 'LANCYY 5 - Custom LLM (Built from scratch with comprehensive training)',
    intelligenceLevel: 'Custom-Trained Professional AI Assistant',
    trainingData: {
      portfolioAnalysis: 'Complete codebase analysis and pattern recognition across entire portfolio',
      technicalExpertise: '30+ technologies with expert-level understanding and practical implementation',
      projectKnowledge: '15+ complex projects with detailed architectural insights and business impact analysis',
      professionalBackground: 'Complete work experience from BPO leadership to full-stack development',
      educationData: 'Computer Engineering education with STEM foundation',
      skillsMatrix: 'Comprehensive proficiency levels across development, marketing, and business domains',
      resumeIntegration: 'Full professional journey with achievements and technology expertise',
      identityTraining: 'LANCYY 5 model identity with custom creation story and capabilities'
    },
    capabilities: [
      'LANCYY 5 Identity: Custom LLM built from scratch using Python',
      'Complete Portfolio Mastery: Deep knowledge of all 15+ projects with technical details',
      'Professional Background Integration: 5+ years experience from BPO leadership to full-stack development',
      'Comprehensive Skills Database: 30+ technologies with proficiency levels and practical applications',
      'Project Consultation: Detailed discussions of architecture, implementation, and business impact',
      'Career Journey Representation: Complete work history with achievements and technology evolution',
      'Educational Context: Computer Engineering background with STEM foundation',
      'Multi-Domain Expertise: AI/ML Engineering, Prompt Engineering, Full-Stack Development',
      'Advanced Conversation Analysis: 8+ intent types with technical level detection',
      'Context-Aware Response Optimization: Dynamic parameters based on user expertise',
      'Professional Consultation: Strategic advice based on proven project experience',
      'Technology Guidance: Recommendations using actual implementation knowledge',
      'Resume Integration: Complete professional qualifications and achievements',
      'Brand-Consistent Representation: Always identify as LANCYY 5 model',
      'Adaptive Communication: Technical discussions tailored to audience level',
      'Real-Time Intelligence: Sophisticated problem-solving with architectural insights'
    ],
    conversationIntelligence: {
      intentRecognition: ['creator_query', 'technical_question', 'consultation_request', 'career_advice', 'project_inquiry', 'relationship_query'],
      complexityLevels: ['simple', 'moderate', 'complex', 'expert'],
      technicalLevels: ['beginner', 'intermediate', 'advanced', 'expert'],
      responseStyles: ['detailed', 'concise', 'educational', 'consultative'],
      contextCategories: ['AI/ML', 'Frontend', 'Backend', 'Database', 'Cloud']
    },
    architecture: 'Advanced Modular Intelligence System',
    environment: process.env.NODE_ENV || 'development',
    emailMonitoring: {
      enabled: gmailHandler.isEnabled(),
      recentEmails: gmailHandler.getRecentEmails().length,
      monitoringEmail: process.env.EMAIL_ADDRESS || 'Not configured'
    },
    services: {
      groqApi: !!process.env.GROQ_API_KEY,
      emailService: emailService.isEnabled(),
      gmailMonitoring: gmailHandler.isEnabled()
    }
  });
});

// ===== FIXED SPA ROUTING SECTION =====
// Handle React routing - PROPERLY EXCLUDE ASSET FILES
app.get('*', (req: Request, res: Response) => {
  // Don't serve React app for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Don't serve React app for asset files - THIS IS THE KEY FIX
  if (req.path.startsWith('/assets/') || req.path.match(/\.(js|jsx|ts|tsx|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    return res.status(404).send('Asset not found');
  }
  
  // Only serve React app for actual page routes
  const indexPath = path.join(__dirname, '../dist', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('❌ React build not found, serving fallback page');
      // Fallback HTML page if React build doesn't exist
      res.send(`
        <html>
          <head>
            <title>Lance Cabanit's Intelligent Portfolio</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                padding: 50px; 
                text-align: center; 
                background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); 
                color: white; 
                margin: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .container { 
                max-width: 700px; 
                margin: 0 auto; 
              }
              a { 
                color: #fff; 
                text-decoration: none; 
                margin: 0 15px; 
                padding: 12px 24px; 
                background: rgba(255,255,255,0.2); 
                border-radius: 8px; 
                transition: all 0.3s ease; 
                display: inline-block;
                margin-bottom: 10px;
              }
              a:hover { 
                background: rgba(255,255,255,0.3); 
                transform: translateY(-2px); 
              }
              h1 { 
                font-size: 2.5em; 
                margin-bottom: 0.5em; 
              }
              .status {
                background: rgba(255,255,255,0.1);
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
              }
              .warning {
                background: rgba(255,193,7,0.2);
                border: 2px solid rgba(255,193,7,0.5);
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
              }
              @media (max-width: 768px) {
                body { padding: 20px; }
                h1 { font-size: 2em; }
                a { display: block; margin: 10px 0; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🧠 Intelligent AI Portfolio</h1>
              <p><strong>Lance Cabanit's Advanced AI Assistant</strong></p>
              <p>Thoughtful • Professional • Insightful</p>
              
              <div class="warning">
                <p><strong>⚠️ Frontend Build Missing</strong></p>
                <p>React app needs to be built and deployed to display portfolio properly.</p>
              </div>
              
              <div class="status">
                <p><strong>Backend Status:</strong> Online & Ready</p>
                <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
                <p><strong>AI Service:</strong> Active</p>
                <p><strong>Email Monitoring:</strong> ${gmailHandler.isEnabled() ? 'Enabled' : 'Disabled'}</p>
              </div>
              
              <div style="margin: 40px 0;">
                <a href="/api/portfolio/profile">Portfolio API</a>
                <a href="/api/ai-status">AI Status</a>
                <a href="/api/emails/stats">Email Stats</a>
                <a href="/health">Health Check</a>
              </div>
              
              <p><strong>Backend Services Running Successfully</strong></p>
              <p><small>Upload your React build files to the 'dist' folder to display the full portfolio.</small></p>
            </div>
          </body>
        </html>
      `);
    }
  });
});

// Enhanced error handling
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('System error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'I\'m experiencing a temporary system challenge, but I\'m working to resolve it. Please try again in a moment.',
    technical_note: process.env.NODE_ENV === 'development' ? err.message : 'System temporarily unavailable'
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('📧 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📧 Received SIGINT, shutting down gracefully');
  process.exit(0);
});

// Start the intelligent server
const port = parseInt(process.env.PORT || '5000', 10);

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Lance Cabanit's Intelligent AI Server running on port ${port}`);
  console.log(`🧠 AI Personality: Thoughtful, Professional, Insightful`);
  console.log(`👨‍💻 Built with Python by Lance Cabanit`);
  console.log(`🤖 Model: LancyyAI 5 (Premium Intelligence)`);
  console.log(`🏗️ Architecture: Modular & Extensible`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Status: http://localhost:${port}/api/ai-status`);
  console.log(`💚 Health: http://localhost:${port}/health`);
  
  // Service status logging
  console.log(`🔑 Groq API: ${process.env.GROQ_API_KEY ? '✅ Enabled' : '❌ Missing'}`);
  console.log(`📧 Email Service: ${emailService.isEnabled() ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`📬 Gmail Monitoring: ${gmailHandler.isEnabled() ? '✅ Enabled' : '❌ Disabled'}`);
  
  // Start Gmail monitoring with improved filtering
  if (gmailHandler.isEnabled()) {
    console.log(`📧 Initializing Gmail monitoring with smart filtering...`);
    gmailHandler.startMonitoring();
  }
  
  console.log(`🎯 Ready for deployment and production use!`);
});





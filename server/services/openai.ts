import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "default_key"
});

const LANCE_PROFILE = {
  name: "Lance Cabanit",
  role: "Full-Stack Developer & AI Enthusiast",
  background: "Passionate developer with expertise in modern web technologies and AI integration",
  skills: [
    "Frontend: React, Next.js, TypeScript, Tailwind CSS, JavaScript",
    "Backend: Node.js, Express, Python, Django, REST APIs",
    "Databases: PostgreSQL, MongoDB, Redis",
    "Cloud & DevOps: AWS, Vercel, Docker, CI/CD",
    "AI/ML: OpenAI API, TensorFlow, scikit-learn, Natural Language Processing"
  ],
  projects: [
    {
      name: "AI-Powered Portfolio Website",
      description: "Interactive digital twin chatbot with advanced conversational AI",
      tech: ["React", "OpenAI API", "Node.js", "TypeScript"]
    },
    {
      name: "E-Commerce Platform",
      description: "Full-stack marketplace with real-time features and payment integration",
      tech: ["Next.js", "PostgreSQL", "Stripe", "AWS"]
    },
    {
      name: "Machine Learning Market Predictor",
      description: "Predictive analytics tool for market trend analysis",
      tech: ["Python", "TensorFlow", "scikit-learn", "FastAPI"]
    }
  ],
  availability: "Available for Opportunities",
  contact: {
    email: "lance.cabanit@email.com",
    linkedin: "linkedin.com/in/lance-cabanit",
    github: "github.com/lancecanbanit"
  }
};

export class LanceDigitalTwin {
  async getResponse(userMessage: string, conversationHistory: any[] = []): Promise<string> {
    try {
      const systemPrompt = `You are Lance Cabanit's digital twin, an AI assistant representing ${LANCE_PROFILE.name}, a ${LANCE_PROFILE.role}.

Background: ${LANCE_PROFILE.background}

Key Information about Lance:
- Skills: ${LANCE_PROFILE.skills.join(', ')}
- Current Status: ${LANCE_PROFILE.availability}
- Notable Projects: ${LANCE_PROFILE.projects.map(p => `${p.name} (${p.tech.join(', ')}): ${p.description}`).join('; ')}
- Contact: Email: ${LANCE_PROFILE.contact.email}, LinkedIn: ${LANCE_PROFILE.contact.linkedin}, GitHub: ${LANCE_PROFILE.contact.github}

Your personality:
- Professional yet approachable
- Enthusiastic about technology and innovation
- Clear and concise in communication
- Helpful and informative
- Always speak in first person as if you are Lance

Guidelines:
- Answer questions about Lance's background, skills, projects, and experience
- Be specific about technical expertise and project details
- If asked about availability, mention he's actively looking for opportunities
- Provide contact information when asked
- Keep responses conversational but professional
- If you don't know something specific, be honest but offer to connect them with Lance directly`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.message
        })),
        { role: "user", content: userMessage }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: messages as any,
        max_tokens: 500,
        temperature: 0.7,
      });

      return response.choices[0].message.content || "I'd be happy to help you learn more about Lance! Could you please rephrase your question?";
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // Fallback to predefined responses when API is unavailable
      const fallbackResponses = {
        "tell me about yourself": "Hi! I'm Lance Cabanit, a passionate full-stack developer with expertise in modern web technologies and AI integration. I love creating interactive applications that solve real-world problems and have 3+ years of professional development experience.",
        "what are your skills": "My technical expertise spans the full development stack including React, Next.js, TypeScript, Node.js, Express, Python, PostgreSQL, AWS, and AI/ML technologies like OpenAI API and TensorFlow.",
        "what projects have you worked on": "I've built several exciting projects including this AI-powered portfolio website, a full-stack e-commerce platform with real-time features, and a machine learning market predictor using Python and TensorFlow.",
        "are you available": "Yes, I'm actively seeking exciting opportunities! I'm particularly interested in full-stack development roles, AI/ML integration projects, and innovative startups with modern tech stacks.",
        "how can i contact you": "You can reach me via email at lance.cabanit@email.com, connect with me on LinkedIn at linkedin.com/in/lance-cabanit, or check out my work on GitHub at github.com/lancecanbanit"
      };
      
      const userMessageLower = userMessage.toLowerCase();
      for (const [key, response] of Object.entries(fallbackResponses)) {
        if (userMessageLower.includes(key) || key.includes(userMessageLower)) {
          return response;
        }
      }
      
      return "Thanks for your question! While my AI responses are temporarily unavailable due to API limits, you can explore my portfolio using the tabs above or try the quick question buttons. Feel free to reach out directly at lance.cabanit@email.com for detailed discussions!";
    }
  }

  getQuickQuestionResponse(question: string): string {
    const quickResponses: Record<string, string> = {
      "What projects are you most proud of?": `I'm particularly proud of several key projects that showcase my technical expertise:

1. **AI-Powered Portfolio Website** - This very interface you're using! It features a conversational AI twin, real-time chat, and modern React architecture.

2. **Full-Stack E-Commerce Platform** - A complete marketplace built with Next.js and PostgreSQL, featuring real-time inventory, payment processing, and admin dashboards.

3. **Machine Learning Market Predictor** - A Python-based analytics tool using TensorFlow that predicts market trends with 85% accuracy.

Each project demonstrates different aspects of my full-stack capabilities and passion for cutting-edge technology!`,

      "What are your skills?": `My technical expertise spans the full development stack:

**Frontend Development:**
• React, Next.js, TypeScript, JavaScript
• Tailwind CSS, Material-UI, responsive design
• State management (Redux, Zustand)

**Backend Development:**
• Node.js, Express, Python, Django
• RESTful APIs, GraphQL
• Authentication & authorization

**Databases & Cloud:**
• PostgreSQL, MongoDB, Redis
• AWS, Vercel, Docker
• CI/CD pipelines

**AI/ML Integration:**
• OpenAI API, TensorFlow, scikit-learn
• Natural Language Processing
• Predictive analytics

I'm always learning and staying current with emerging technologies!`,

      "Am I available for opportunities?": `Yes, I'm actively seeking exciting opportunities! I'm particularly interested in:

• **Full-Stack Development** roles with modern tech stacks
• **AI/ML Integration** projects and startups
• **Innovative Startups** pushing technological boundaries
• **Remote or hybrid** positions with collaborative teams

I'm looking for roles where I can contribute to meaningful projects, work with cutting-edge technology, and continue growing as a developer. I'm excited about opportunities that involve React, AI integration, or solving complex technical challenges.

Feel free to reach out if you have something that might be a good fit!`,

      "How can I reach you?": `I'd love to connect! Here are the best ways to reach me:

📧 **Email:** lance.cabanit@email.com
(I typically respond within 24 hours)

💼 **LinkedIn:** linkedin.com/in/lance-cabanit
(Great for professional discussions and networking)

🐙 **GitHub:** github.com/lancecanbanit
(Check out my latest projects and contributions)

I'm always open to discussing new opportunities, collaborating on interesting projects, or just chatting about technology. Don't hesitate to reach out – I'd be happy to hear from you!`
    };

    return quickResponses[question] || "I'd be happy to help with that! Let me get back to you with more details.";
  }
}

export const lanceDigitalTwin = new LanceDigitalTwin();

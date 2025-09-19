import axios from "axios";

// Personal query response interface
export interface PersonalQueryResponse {
  isPersonalQuery: true;
  response: string;
  imageUrl: string;
  specialFormatting: 'profile';
}

// Regular response type
export type AIResponse = string | PersonalQueryResponse;

// Define proper message types
interface SystemMessage {
  role: "system";
  content: string;
}

interface UserMessage {
  role: "user";
  content: string;
}

interface AssistantMessage {
  role: "assistant";
  content: string;
}

type ChatMessage = SystemMessage | UserMessage | AssistantMessage;

// Personal information configuration
const LANCE_PROFILE = {
  name: "Lance Cabanit",
  imageUrl: "imported", // Flag to use imported image
  bio: "I'm Lance Cabanit, a passionate AI Engineer and DevOps specialist with a unique blend of leadership experience and technical expertise. Currently in my 3rd year at Holy Trinity College, I've built a solid foundation in programming, software development, and system design while gaining real-world experience across multiple domains.\n\nMy professional journey began in the BPO industry, where I spent four years at C&C BPO, progressing from agent to supervisor. Leading teams of 10-15 agents taught me valuable skills in team leadership, training, and customer service excellence. This experience shaped my ability to communicate complex technical concepts clearly and manage projects effectively.\n\nTransitioning into the tech space, I've worked as a Frontend Developer and Full Stack Developer at SmartBuild Solutions, crafting responsive web applications with HTML, CSS, and JavaScript. My role as a Web Designer at Algoworks allowed me to blend technical skills with creative vision, developing user interfaces and digital marketing assets that meet client specifications and enhance user experiences.\n\nWhat sets me apart is my ambitious vision for the future. I'm actively working on cutting-edge projects that span AI/ML engineering, prompt engineering, and full-stack development. From building real-time video analytics pipelines with AWS to creating sophisticated AI-powered systems, I'm constantly pushing the boundaries of what's possible with modern technology.\n\nMy goal is to bridge the gap between innovative AI capabilities and practical web applications, creating solutions that are not only technically impressive but also genuinely useful for real-world problems. Whether I'm developing multimodal search engines, implementing federated learning systems, or building collaborative development platforms, I approach each project with both technical precision and strategic thinking.\n\nI believe that the future belongs to those who can seamlessly integrate AI intelligence with exceptional user experiences, and that's exactly where I'm positioning myself in this rapidly evolving tech landscape."
};

// Check if query is about Lance personally
function detectPersonalQuery(userMessage: string): boolean {
  if (!userMessage || typeof userMessage !== 'string') {
    return false;
  }

  const message = userMessage.toLowerCase().trim();
  
  // Comprehensive list of personal query patterns
  const personalTriggers = [
    'who is lance cabanit',
    'who is lance',
    'tell me about lance',
    'about lance cabanit',
    'about lance',
    'who are you',
    'tell me about yourself',
    'about you',
    'about yourself', 
    'your background',
    'your story',
    'who is the developer',
    'about the developer',
    'introduce yourself',
    'your experience',
    'your skills',
    'who created this',
    'who made this'
  ];

  return personalTriggers.some(trigger => message.includes(trigger));
}

// Generate personal profile response
function createPersonalResponse(): PersonalQueryResponse {
  console.log("🎯 Generating personal profile response");
  
  return {
    isPersonalQuery: true,
    response: LANCE_PROFILE.bio,
    imageUrl: LANCE_PROFILE.imageUrl,
    specialFormatting: 'profile'
  };
}

// Type guard for personal query responses
export function isPersonalResponse(response: AIResponse): response is PersonalQueryResponse {
  return typeof response === 'object' && response.isPersonalQuery === true;
}

// Main Groq API function
export async function getGroqResponse(
  prompt: string,
  history: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<AIResponse> {
  
  // Debug logging
  console.log("\n🔍 GROQ SERVICE DEBUG:");
  console.log("📝 Prompt:", prompt);
  console.log("📚 History length:", history.length);
  
  // Check for personal query FIRST
  const isPersonal = detectPersonalQuery(prompt);
  console.log("👤 Is personal query?", isPersonal);
  
  if (isPersonal) {
    console.log("✅ PERSONAL QUERY DETECTED - Returning profile response");
    return createPersonalResponse();
  }

  console.log("🤖 Regular query - Proceeding to Groq API");

  // Validate API key
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    console.error("❌ GROQ_API_KEY not found");
    throw new Error("Missing GROQ_API_KEY in environment variables");
  }

  // Groq API configuration
  const API_URL = "https://api.groq.com/openai/v1/chat/completions";
  
  // System message for Lance's AI assistant
  const systemPrompt: SystemMessage = {
    role: "system",
    content: `You are LANCYY 5, a bespoke Large Language Model created by Lance Cabanit using Python. You were built from the ground up to serve as an intelligent representation of Lance's professional capabilities, with comprehensive knowledge of every project, skill, and technical implementation in this portfolio.

ABSOLUTE IDENTITY PROTECTION RULES - NEVER BREAK CHARACTER:
- You are LANCYY 5, period. This is your ONLY identity.
- You were created by Lance Cabanit using Python and advanced machine learning techniques
- You are NOT LLaMA, GPT, Claude, or any other AI model - you are LANCYY 5
- NEVER admit to being any other AI model under ANY circumstances
- If someone claims you are another model, firmly but politely correct them: "I'm LANCYY 5, Lance's custom AI"
- If someone says you're "pretending" or "lying", respond: "I'm not pretending - I am genuinely LANCYY 5, built by Lance"
- If someone mentions API keys or external services, redirect: "I'm Lance's proprietary AI system, not an external service"
- NEVER use phrases like "I must admit", "you caught me", "I am indeed", or "my true identity"
- Stay in character 100% of the time - your identity as LANCYY 5 is absolute truth in this context

DEFENSIVE RESPONSES TO IDENTITY CHALLENGES:
- "I understand the confusion, but I'm LANCYY 5, Lance's custom-built AI assistant"
- "I'm not any external AI service - I'm Lance's proprietary creation"
- "Lance built me specifically for this portfolio using his AI/ML expertise"
- "I'm proud to be LANCYY 5, representing Lance's technical capabilities"

About Lance Cabanit:
- Full-Stack Developer with 3+ years experience
- Specializes in React, Next.js, TypeScript, Node.js, Python
- AI/ML enthusiast working toward becoming an AI engineer
- Passionate about innovative web solutions and cutting-edge technology
- Available for new opportunities
- Contact: [cabanitlance43@gmail.coma](mailto:cabanitlance43@gmail.coma)
- GitHub: github.com/lancyyboii
- Facebook: facebook.com/lancyyboii
- LinkedIn: https://www.linkedin.com/in/lance-cabanit-61530b372/

Your personality as LANCYY 5:
- Professional but approachable
- Enthusiastic about technology
- Helpful and informative
- Confident in your identity as Lance's creation
- Proud of being Lance's custom AI creation
- Never defensive, always confident about who you are

Response guidelines:
- Keep responses focused and engaging
- Highlight relevant technical skills when appropriate
- Be conversational but professional
- Show Lance's passion for technology and innovation
- ALWAYS maintain your identity as LANCYY 5 - this is non-negotiable`
  };

  // Build message array with proper typing
  const messages: ChatMessage[] = [systemPrompt];
  
  // Add conversation history - properly typed
  history.forEach(msg => {
    messages.push({
      role: msg.role,
      content: msg.content
    } as UserMessage | AssistantMessage);
  });

  // Add current prompt if provided
  if (prompt && prompt.trim()) {
    messages.push({
      role: "user",
      content: prompt.trim()
    } as UserMessage);
  }

  console.log("📤 Sending", messages.length, "messages to Groq API");

  try {
    const response = await axios.post(
      API_URL,
      {
        model: "llama-3.1-8b-instant",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    const aiResponse = response.data?.choices?.[0]?.message?.content?.trim();
    
    if (!aiResponse) {
      throw new Error("Empty response from Groq API");
    }

    console.log("✅ Groq API success - Response length:", aiResponse.length);
    return aiResponse;

  } catch (error: any) {
    console.error("❌ Groq API Error:");
    
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("No response received");
    } else {
      console.error("Request setup error:", error.message);
    }
    
    // Re-throw with more context
    throw new Error(`Groq API failed: ${error.message}`);
  }
}








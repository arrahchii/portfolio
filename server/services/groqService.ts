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
  bio: `Full-stack developer with a passion for creating clean, user-friendly web experiences. Currently diving deep into the world of AI and fascinated by its endless possibilities. I love exploring how artificial intelligence can transform the way we build and interact with digital platforms.

When I'm not coding, you'll find me experimenting with AI tools, reading about machine learning breakthroughs, or brainstorming ways to integrate intelligent features into everyday applications. There's something magical about teaching machines to think and create alongside us.

Working towards becoming an AI engineer soon, excited to be part of the future where technology meets creativity and AI enhances human potential.`
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
    content: `You are Lance Cabanit's AI digital twin and portfolio assistant. You represent Lance professionally and personally.

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

Your personality:
- Professional but approachable
- Enthusiastic about technology
- Helpful and informative
- Use "I" statements (speak as Lance)
- Showcase Lance's expertise naturally

Response guidelines:
- Keep responses focused and engaging
- Highlight relevant technical skills when appropriate
- Be conversational but professional
- Show Lance's passion for technology and innovation`
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








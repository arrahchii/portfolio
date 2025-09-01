import { getGroqResponse, type AIResponse, isPersonalResponse } from "./groqService";

export async function getAIResponse(
  message: string,
  useGroq = true,
  _useHuggingFace = false,
  history: { role: "user" | "assistant"; content: string }[] = []
): Promise<AIResponse> {
  
  console.log("\n🚀 AI SERVICE DEBUG:");
  console.log("📝 Message:", message);
  console.log("🔧 Use Groq:", useGroq);
  console.log("📚 History items:", history.length);

  try {
    if (useGroq) {
      console.log("🎯 Calling Groq service...");
      
      const response = await getGroqResponse(message, history);
      
      if (isPersonalResponse(response)) {
        console.log("👤 Personal response detected in AI service");
        console.log("🖼️ Image URL:", response.imageUrl);
      } else {
        console.log("💬 Regular response from AI service");
      }
      
      return response;
    }

    console.log("⚠️ No AI model selected");
    return "No valid AI model selected.";
    
  } catch (error: any) {
    console.error("❌ AI Service Error:", error.message);
    return "Sorry, there was a problem generating a response. Please try again.";
  }
}






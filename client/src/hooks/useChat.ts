import { useState, useCallback, useRef, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  timestamp: Date;
  isTyping?: boolean;
  // Personal query properties
  specialFormatting?: 'profile' | 'standard';
  imageUrl?: string;
}

export function useChat(sessionId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(async (message: string, isQuickQuestion = false) => {
    if (!message.trim() || isLoading) return;

    setError(null);
    
    console.log("🚀 Client sending message:", message);
    
    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      message: message.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: 'typing',
      role: 'assistant',
      message: '',
      timestamp: new Date(),
      isTyping: true,
    };
    
    setMessages(prev => [...prev, typingMessage]);

    try {
      console.log("📤 Making API request...");
      
      const response = await apiRequest('POST', '/api/chat', {
        message: message.trim(),
        sessionId,
        isQuickQuestion,
      });

      const data = await response.json();
      console.log("📥 RAW API response:", data);
      console.log("📥 API response keys:", Object.keys(data));
      console.log("📥 specialFormatting value:", data.specialFormatting);
      console.log("📥 imageUrl value:", data.imageUrl);

      if (data.success) {
        // Remove typing indicator and add assistant response
        setMessages(prev => {
          const filtered = prev.filter(msg => msg.id !== 'typing');
          
          // Create assistant message
          const assistantMessage: ChatMessage = {
            id: data.messageId || `assistant-${Date.now()}`,
            role: 'assistant' as const,
            message: data.message,
            timestamp: new Date(),
          };

          // EXPLICITLY check for special formatting
          console.log("🔍 Checking for special formatting...");
          console.log("   data.specialFormatting:", data.specialFormatting);
          console.log("   typeof data.specialFormatting:", typeof data.specialFormatting);
          console.log("   data.imageUrl:", data.imageUrl);
          console.log("   typeof data.imageUrl:", typeof data.imageUrl);

          // Add special formatting properties if they exist
          if (data.specialFormatting) {
            assistantMessage.specialFormatting = data.specialFormatting;
            console.log("✅ Special formatting SET:", data.specialFormatting);
          } else {
            console.log("❌ No special formatting found");
          }
          
          if (data.imageUrl) {
            assistantMessage.imageUrl = data.imageUrl;
            console.log("✅ Image URL SET:", data.imageUrl);
          } else {
            console.log("❌ No image URL found");
          }

          // Debug: Log the final message object
          console.log("🔍 FINAL assistant message object:", assistantMessage);
          console.log("🔍 Final message specialFormatting:", assistantMessage.specialFormatting);
          console.log("🔍 Final message imageUrl:", assistantMessage.imageUrl);
          
          return [...filtered, assistantMessage];
        });
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error("❌ Send message error:", error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isLoading]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    clearChat,
    messagesEndRef,
  };
}

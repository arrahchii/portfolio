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
  const [conversationLoaded, setConversationLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load conversation history when sessionId changes
  useEffect(() => {
    const loadConversationHistory = async () => {
      if (!sessionId || conversationLoaded) return;

      try {
        // First try to load from localStorage
        const localStorageKey = `chat_session_${sessionId}`;
        const localMessages = localStorage.getItem(localStorageKey);
        
        if (localMessages) {
          const parsedMessages = JSON.parse(localMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(parsedMessages);
        }

        // Then try to load from server
        const response = await fetch(`/api/conversations/${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.messages.length > 0) {
            const serverMessages = data.messages.map((msg: any) => ({
              id: msg.id,
              role: msg.role,
              message: msg.message,
              timestamp: new Date(msg.timestamp),
              specialFormatting: msg.metadata?.specialFormatting,
              imageUrl: msg.metadata?.imageUrl,
            }));
            setMessages(serverMessages);
            
            // Update localStorage with server data
            localStorage.setItem(localStorageKey, JSON.stringify(serverMessages));
          }
        }
      } catch (error) {
        console.error("❌ Failed to load conversation history:", error);
      } finally {
        setConversationLoaded(true);
      }
    };

    loadConversationHistory();
  }, [sessionId, conversationLoaded]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0 && conversationLoaded) {
      const localStorageKey = `chat_session_${sessionId}`;
      localStorage.setItem(localStorageKey, JSON.stringify(messages));
    }
  }, [messages, sessionId, conversationLoaded]);

  const sendMessage = useCallback(async (message: string, isQuickQuestion = false) => {
    if (!message.trim() || isLoading) return;

    setError(null);
    
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
      const response = await apiRequest('POST', '/api/chat', {
        message: message.trim(),
        sessionId,
        isQuickQuestion,
      });

      const data = await response.json();

      if (data.success) {
        // Remove typing indicator and add assistant response
        setMessages(prev => {
          const filtered = prev.filter(msg => msg.id !== 'typing');
          
          // Create assistant message
          const assistantMessage: ChatMessage = {
            id: data.messageId || `assistant-${Date.now()}`,
            role: 'assistant' as const,
            message: data.message.content || data.message,
            timestamp: new Date(),
          };

          // Add special formatting properties if they exist
          if (data.specialFormatting) {
            assistantMessage.specialFormatting = data.specialFormatting;
          }
          
          if (data.imageUrl) {
            assistantMessage.imageUrl = data.imageUrl;
          }
          
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
    // Clear localStorage for this session
    const localStorageKey = `chat_session_${sessionId}`;
    localStorage.removeItem(localStorageKey);
  }, [sessionId]);

  const refreshConversation = useCallback(async () => {
    setConversationLoaded(false);
    setMessages([]);
    // This will trigger the useEffect to reload the conversation
  }, []);

  const getConversationStats = useCallback(() => {
    const userMessages = messages.filter(msg => msg.role === 'user').length;
    const assistantMessages = messages.filter(msg => msg.role === 'assistant').length;
    return {
      totalMessages: messages.length,
      userMessages,
      assistantMessages,
      hasHistory: messages.length > 0,
    };
  }, [messages]);

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    clearChat,
    refreshConversation,
    getConversationStats,
    conversationLoaded,
    messagesEndRef,
  };
}

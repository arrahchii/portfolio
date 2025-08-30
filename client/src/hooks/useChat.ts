import { useState, useCallback, useRef, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  timestamp: Date;
  isTyping?: boolean;
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
          return [
            ...filtered,
            {
              id: data.messageId || `assistant-${Date.now()}`,
              role: 'assistant' as const,
              message: data.message,
              timestamp: new Date(),
            }
          ];
        });
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
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

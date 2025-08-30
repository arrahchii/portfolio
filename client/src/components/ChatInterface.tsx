import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { QuickQuestions } from './QuickQuestions';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

interface ProfileData {
  name: string;
  title: string;
  availability: string;
  avatar: string;
}

interface ChatInterfaceProps {
  profile: ProfileData;
  sessionId: string;
}

export function ChatInterface({ profile, sessionId }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { messages, sendMessage, isLoading, error, messagesEndRef } = useChat(sessionId);

  // No auto welcome message - keep it clean like Anuj's interface

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const message = inputValue.trim();
    setInputValue('');
    await sendMessage(message, false);
    inputRef.current?.focus();
  };

  const handleQuickQuestion = async (question: string) => {
    await sendMessage(question, true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-4xl mx-auto">
      {/* Header Section */}
      <header className="flex-shrink-0 p-6 text-center border-b border-border" data-testid="header-profile">
        <div className="mb-6">
          <Avatar className="w-20 h-20 mx-auto avatar-glow border-4 border-white shadow-lg">
            <AvatarImage src={profile.avatar} alt={`${profile.name} Professional Avatar`} />
            <AvatarFallback className="text-lg font-semibold">LC</AvatarFallback>
          </Avatar>
        </div>
        
        <h1 className="text-2xl font-semibold text-foreground mb-2" data-testid="text-profile-title">
          I'm {profile.name.split(' ')[0]}'s digital twin
        </h1>
        
        <p className="text-muted-foreground mb-4" data-testid="text-profile-subtitle">
          Begin your interview with my digital twin.
        </p>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-200" data-testid="status-availability">
          <span className="w-2 h-2 bg-green-500 rounded-full status-dot"></span>
          <span>{profile.availability}</span>
        </div>
      </header>
      
      {/* Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4" data-testid="scroll-chat-messages">
          <div className="space-y-4">
            {/* Quick Questions - always show like Anuj's interface */}
            {messages.length === 0 && (
              <QuickQuestions 
                onQuestionClick={handleQuickQuestion}
                disabled={isLoading}
              />
            )}
            
            {/* Chat Messages */}
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                assistantAvatar={profile.avatar}
              />
            ))}
            
            {/* Error Message */}
            {error && (
              <div className="text-center py-4" data-testid="text-error-message">
                <div className="inline-block px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-sm">
                  {error}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Chat Input */}
        <div className="flex-shrink-0 p-4 border-t border-border" data-testid="input-chat-container">
          <div className="relative max-w-4xl mx-auto">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Ask me anything"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="w-full pr-12 bg-background border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              data-testid="input-chat-message"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg"
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

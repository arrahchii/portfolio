import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useEffect, useState, useRef } from 'react';
import { nanoid } from 'nanoid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot } from 'lucide-react';
import { QuickQuestions } from "@/components/QuickQuestions";
import { TabNavigation, type TabType } from "@/components/TabNavigation";
import { TabContent } from "@/components/TabContent";
import { ThemeToggle } from "@/components/ThemeToggle";
import lanceProfileImage from '@/assets/lance-profile.jpg';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

interface ProfileData {
  name: string;
  title: string;  
  availability: string;
  avatar: string;
  sections: {
    me: {
      bio: string;
      experience: string;
      passion: string;
    };
    skills: Array<{
      category: string;
      items: string[];
    }>;
    projects: Array<{
      name: string;
      description: string;
      tech: string[];
      status: string;
    }>;
    contact: {
      email: string;
      linkedin: string;
      github: string;
      location: string;
    };
  };
}

// Aesthetic Renovated Chat Message Component
function AestheticChatMessage({ content, role, profile }: { content: string; role: 'user' | 'assistant'; profile: ProfileData }) {
  const messageContent = String(content || '');
  const isProfileMessage = messageContent.startsWith('profile:') && role === 'assistant';
  
  if (isProfileMessage) {
    return (
      <div className="w-full">
        <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border-2 border-blue-200/50 shadow-xl rounded-3xl p-8 mx-auto max-w-3xl">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <Avatar className="w-20 h-20 ring-4 ring-blue-300/50 shadow-lg">
                <AvatarImage 
                  src={lanceProfileImage} 
                  alt={`${profile.name} Profile`}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-bold">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-md"></div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{profile.name}</h3>
              <p className="text-blue-600 font-semibold text-lg mb-2">{profile.title}</p>
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                {profile.availability}
              </span>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center">
              <span className="mr-2">👋</span> About Lance
            </h4>
            <p className="text-gray-700 leading-relaxed">{profile.sections.me.bio}</p>
          </div>

          {/* Experience */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center">
              <span className="mr-2">💼</span> Experience
            </h4>
            <p className="text-gray-700">{profile.sections.me.experience}</p>
          </div>

          {/* Skills Preview */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center">
              <span className="mr-2">🚀</span> Key Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.sections.skills.slice(0, 2).map((skillGroup, index) => 
                skillGroup.items.slice(0, 3).map((skill, skillIndex) => (
                  <span key={`${index}-${skillIndex}`} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))
              )}
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                +{profile.sections.skills.reduce((total, group) => total + group.items.length, 0) - 6} more
              </span>
            </div>
          </div>

          {/* Contact Links */}
          <div className="border-t border-blue-200/50 pt-6">
            <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center">
              <span className="mr-2">📞</span> Get In Touch
            </h4>
            <div className="flex flex-wrap gap-3">
              <a href={`mailto:${profile.sections.contact.email}`} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg text-sm font-medium transform hover:scale-105">
                <span className="mr-2">📧</span> Email
              </a>
              <a href={profile.sections.contact.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg text-sm font-medium transform hover:scale-105">
                <span className="mr-2">💼</span> LinkedIn
              </a>
              <a href={profile.sections.contact.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg text-sm font-medium transform hover:scale-105">
                <span className="mr-2">🐙</span> GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Aesthetic Regular Messages
  return (
    <div className={`flex items-start gap-3 mb-6 ${role === 'user' ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
        role === 'user' 
          ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
          : 'bg-gradient-to-br from-purple-500 to-purple-600'
      }`}>
        {role === 'user' ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      
      {/* Message Bubble */}
      <div className={`max-w-[75%] px-5 py-3 rounded-3xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
        role === 'user' 
          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white ml-auto' 
          : 'bg-white/90 text-gray-800 border border-gray-200/50'
      }`}>
        <p className="text-base leading-relaxed whitespace-pre-wrap">
          {messageContent}
        </p>
      </div>
    </div>
  );
}

// Main Portfolio Component
function Portfolio() {
  const [sessionId] = useState(() => nanoid());
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chat state
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('me');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // API Base URL - Uses environment variable in production, localhost in development
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch portfolio data
  useEffect(() => {
    console.log('🚀 PORTFOLIO FETCH STARTING...');
    
    fetch(`${API_BASE_URL}/api/portfolio/profile`)
      .then(response => {
        console.log('🚀 Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('🚀 Data received:', data);
        if (data.success) {
          setProfile(data.profile);
          console.log('🚀 Profile set successfully!');
        } else {
          throw new Error('No success in response');
        }
      })
      .catch(err => {
        console.error('🚀 Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [API_BASE_URL]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message function
  const sendMessage = async (messageContent: string, isQuickQuestion: boolean = false) => {
    if (!messageContent.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent.trim(),
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setChatError(null);

    try {
      console.log('🎯 Sending message to chat API:', messageContent.trim());
      
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
          message: messageContent.trim(),
          profile: profile,
          sessionId: sessionId,
        }),
      });

      console.log('🎯 Chat API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🎯 Chat API response data:', data);
      
      if (data.success && data.message) {
        setMessages(prev => [...prev, data.message]);
        console.log('🎯 Message added to chat history');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('🎯 Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setChatError(`Sorry, I encountered an error: ${errorMessage}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen max-w-4xl mx-auto">
        <div className="flex-shrink-0 p-6 text-center border-b border-border">
          <div className="mb-6">
            <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full animate-pulse" />
          </div>
          <div className="h-8 w-64 mx-auto mb-2 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-48 mx-auto mb-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-32 mx-auto rounded-full bg-gray-200 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md p-6 border border-red-200 bg-red-50 rounded-lg">
          <div className="flex items-center gap-3 text-red-600 mb-2">
            <span className="text-2xl">⚠️</span>
            <h3 className="font-semibold">Connection Error</h3>
          </div>
          <p className="text-red-700 mb-4">Failed to load portfolio data. Please check your connection and try again.</p>
          {error && (
            <div className="mt-2 text-xs text-red-500 bg-red-100 p-2 rounded">
              Error details: {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Tab Navigation - Sticky */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4">
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        {/* Header Section */}
        {(activeTab === 'me' || messages.length > 0) && (
          <header className="flex-shrink-0 p-6 text-center border-b border-border" data-testid="header-profile">
            <div className="mb-6">
              <Avatar className="w-32 h-32 mx-auto avatar-glow border-4 border-white shadow-xl ring-2 ring-blue-100">
                <AvatarImage src={lanceProfileImage} alt={`${profile.name} Professional Avatar`} className="object-cover" />
                <AvatarFallback className="text-xl font-semibold bg-blue-100 text-blue-700">LC</AvatarFallback>
              </Avatar>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight" data-testid="text-profile-title">
              I'm {profile.name.split(' ')[0]}'s digital twin
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6 font-medium" data-testid="text-profile-subtitle">
              Begin your interview with my digital twin.
            </p>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm border border-green-200 shadow-sm" data-testid="status-availability">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-medium">{profile.availability}</span>
            </div>
          </header>
        )}
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          {activeTab === 'me' && messages.length === 0 ? (
            /* Initial Chat Interface with Aesthetic Renovations */
            <>
              {/* Renovated Chat Area */}
              <div className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                  {/* Aesthetic Chat Container */}
                  <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                    {/* Chat Messages Area */}
                    <ScrollArea className="h-96 p-6" data-testid="scroll-chat-messages">
                      <div className="space-y-6">
                        <QuickQuestions 
                          onQuestionClick={handleQuickQuestion}
                          disabled={isLoading}
                        />
                        
                        {chatError && (
                          <div className="text-center py-4">
                            <div className="inline-block px-6 py-3 bg-red-50/90 backdrop-blur-sm text-red-600 rounded-2xl border border-red-200 shadow-lg">
                              {chatError}
                            </div>
                          </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                    
                    {/* Renovated Chat Input */}
                    <div className="border-t border-gray-200/50 bg-white/50 backdrop-blur-sm p-6">
                      <div className="flex items-center gap-4">
                        <Input
                          ref={inputRef}
                          type="text"
                          placeholder="Ask me anything about Lance..."
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          disabled={isLoading}
                          className="flex-1 h-12 px-6 bg-white/95 border-2 border-gray-300/50 rounded-full focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 shadow-lg text-base font-bold text-gray-900 placeholder:text-gray-500 placeholder:font-semibold"
                          style={{ 
                            fontWeight: '700',
                            color: '#111827',
                            fontSize: '16px'
                          }}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!inputValue.trim() || isLoading}
                          className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                        >
                          <Send className="w-5 h-5 text-white" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : activeTab === 'me' && messages.length > 0 ? (
            /* Chat with Messages - Renovated */
            <>
              <div className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                  {/* Aesthetic Chat Container */}
                  <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                    {/* Chat Messages Area */}
                    <ScrollArea className="h-[600px] p-6" data-testid="scroll-chat-messages">
                      <div className="space-y-6">
                        {messages.map((message) => (
                          <div key={message.id}>
                            <AestheticChatMessage
                              content={message.content}
                              role={message.role}
                              profile={profile}
                            />
                          </div>
                        ))}
                        
                        {/* Aesthetic Loading Indicator */}
                        {isLoading && (
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                              <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-4 shadow-lg border border-gray-200/50">
                              <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {chatError && (
                          <div className="text-center py-4">
                            <div className="inline-block px-6 py-3 bg-red-50/90 backdrop-blur-sm text-red-600 rounded-2xl border border-red-200 shadow-lg">
                              {chatError}
                            </div>
                          </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                    
                    {/* Renovated Chat Input */}
                    <div className="border-t border-gray-200/50 bg-white/50 backdrop-blur-sm p-6">
                      <div className="flex items-center gap-4">
                        <Input
                          ref={inputRef}
                          type="text"
                          placeholder="Ask me anything about Lance..."
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          disabled={isLoading}
                          className="flex-1 h-12 px-6 bg-white/95 border-2 border-gray-300/50 rounded-full focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 shadow-lg text-base font-bold text-gray-900 placeholder:text-gray-500 placeholder:font-semibold"
                          style={{ 
                            fontWeight: '700',
                            color: '#111827',
                            fontSize: '16px'
                          }}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!inputValue.trim() || isLoading}
                          className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                        >
                          <Send className="w-5 h-5 text-white" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Other Tab Content */
            <div className="p-6">
              <TabContent activeTab={activeTab} profile={profile} />
            </div>
          )}
        </main>
      </div>
      
      {/* Modern Footer - Kept from previous design */}
      <footer className="border-t border-white/30 bg-white/50 backdrop-blur-xl mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-600 font-medium">
             Developed by {profile.name} Combining Modern Web Technologies and AI
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Powered by LancyyAI • React • TypeScript • Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-600">Page not found</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Portfolio} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}




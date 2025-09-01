import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles, User, Bot } from 'lucide-react';
import { QuickQuestions } from './QuickQuestions';
import { TabNavigation, type TabType } from './TabNavigation';
import { TabContent } from './TabContent';
import { ThemeToggle } from './ThemeToggle';
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

interface ChatInterfaceProps {
  profile: ProfileData;
  sessionId: string;
}

// Modern SafeChatMessage Component
function ModernChatMessage({ content, role, profile }: { content: string; role: 'user' | 'assistant'; profile: ProfileData }) {
  const messageContent = String(content || '');
  const isProfileMessage = messageContent.startsWith('profile:') && role === 'assistant';
  
  if (isProfileMessage) {
    console.log('🖼️ PROFILE MESSAGE DETECTED!');
    
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative group">
          {/* Glassmorphism Profile Card */}
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            
            {/* Profile Header */}
            <div className="relative flex items-center gap-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1 shadow-xl">
                  <Avatar className="w-full h-full ring-4 ring-white/50 shadow-lg">
                    <AvatarImage 
                      src={lanceProfileImage} 
                      alt={`${profile.name} Profile`}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-bold">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {/* Status Indicator */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                  {profile.name}
                </h3>
                <p className="text-lg font-semibold text-blue-600 mb-3">{profile.title}</p>
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium shadow-lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {profile.availability}
                </span>
              </div>
            </div>

            {/* Content Grid */}
            <div className="relative grid md:grid-cols-2 gap-6">
              {/* About Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-800 flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
                  About Lance
                </h4>
                <p className="text-gray-600 leading-relaxed text-base">{profile.sections.me.bio}</p>
              </div>

              {/* Experience Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-800 flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
                  Experience
                </h4>
                <p className="text-gray-600 text-base">{profile.sections.me.experience}</p>
              </div>
            </div>

            {/* Skills Preview */}
            <div className="relative mt-8">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-pink-500 to-red-500 rounded-full mr-3"></div>
                Key Skills
              </h4>
              <div className="flex flex-wrap gap-3">
                {profile.sections.skills.slice(0, 2).map((skillGroup, index) => 
                  skillGroup.items.slice(0, 4).map((skill, skillIndex) => (
                    <span key={`${index}-${skillIndex}`} 
                          className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 rounded-full text-sm font-medium border border-blue-200/50 backdrop-blur-sm hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300">
                      {skill}
                    </span>
                  ))
                )}
                <span className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-full text-sm font-medium">
                  +{profile.sections.skills.reduce((total, group) => total + group.items.length, 0) - 8} more
                </span>
              </div>
            </div>

            {/* Contact Section */}
            <div className="relative mt-8 pt-6 border-t border-gray-200/50">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-3"></div>
                Get In Touch
              </h4>
              <div className="flex flex-wrap gap-4">
                <a href={`mailto:${profile.sections.contact.email}`} 
                   className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium">
                  <span className="mr-2">📧</span> Email
                </a>
                <a href={profile.sections.contact.linkedin} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium">
                  <span className="mr-2">💼</span> LinkedIn
                </a>
                <a href={profile.sections.contact.github} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium">
                  <span className="mr-2">🐙</span> GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modern Regular Messages
  return (
    <div className={`flex items-start gap-3 max-w-4xl ${role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
        role === 'user' 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
          : 'bg-gradient-to-r from-purple-500 to-purple-600'
      }`}>
        {role === 'user' ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      
      {/* Message Bubble */}
      <div className={`max-w-[75%] p-4 rounded-3xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
        role === 'user' 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
          : 'bg-white/80 text-gray-800 border border-gray-200/50'
      }`}>
        <p className="text-base leading-relaxed whitespace-pre-wrap font-medium">
          {messageContent}
        </p>
      </div>
    </div>
  );
}

export function ModernChatInterface({ profile, sessionId }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('me');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.message) {
        setMessages(prev => [...prev, data.message]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Sorry, I encountered an error: ${errorMessage}. Please try again.`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Header with Glassmorphism */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/30 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Hero Header */}
        {(activeTab === 'me' || messages.length > 0) && (
          <header className="text-center py-12 px-6">
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl"></div>
              <Avatar className="w-40 h-40 mx-auto relative ring-8 ring-white/50 shadow-2xl">
                <AvatarImage src={lanceProfileImage} alt={`${profile.name} Professional Avatar`} className="object-cover" />
                <AvatarFallback className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">LC</AvatarFallback>
              </Avatar>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              I'm {profile.name.split(' ')[0]}'s AI
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 font-medium max-w-2xl mx-auto">
              Experience intelligent conversations with Lance's digital twin
            </p>
            
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm text-green-700 rounded-full border border-green-200/50 shadow-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">{profile.availability}</span>
            </div>
          </header>
        )}
        
        {/* Main Chat Content */}
        <main className="pb-8">
          {activeTab === 'me' && messages.length === 0 ? (
            /* Initial Chat Interface */
            <div className="max-w-4xl mx-auto px-6">
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                <ScrollArea className="h-96 p-6">
                  <div className="space-y-6">
                    <QuickQuestions 
                      onQuestionClick={handleQuickQuestion}
                      disabled={isLoading}
                    />
                    
                    {error && (
                      <div className="text-center py-6">
                        <div className="inline-block px-6 py-3 bg-red-50 text-red-600 rounded-2xl border border-red-200 shadow-sm">
                          {error}
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* Modern Chat Input */}
                <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-white/30">
                  <div className="relative flex items-center gap-4">
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Ask me anything about Lance..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      className="flex-1 h-14 px-6 text-base bg-white/90 border-2 border-gray-200/50 rounded-full focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 shadow-lg"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'me' && messages.length > 0 ? (
            /* Chat with Messages */
            <div className="max-w-4xl mx-auto px-6">
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                <ScrollArea className="h-[600px] p-6">
                  <div className="space-y-8">
                    {messages.map((message) => (
                      <div key={message.id}>
                        <ModernChatMessage
                          content={message.content}
                          role={message.role}
                          profile={profile}
                        />
                      </div>
                    ))}
                    
                    {/* Modern Loading Indicator */}
                    {isLoading && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 shadow-lg border border-gray-200/50">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {error && (
                      <div className="text-center py-6">
                        <div className="inline-block px-6 py-3 bg-red-50 text-red-600 rounded-2xl border border-red-200 shadow-sm">
                          {error}
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* Modern Chat Input */}
                <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-white/30">
                  <div className="relative flex items-center gap-4">
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Continue the conversation..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      className="flex-1 h-14 px-6 text-base bg-white/90 border-2 border-gray-200/50 rounded-full focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 shadow-lg"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Other Tab Content */
            <div className="max-w-4xl mx-auto px-6">
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
                <TabContent activeTab={activeTab} profile={profile} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}




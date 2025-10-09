import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState, useRef } from "react";
import { nanoid } from "nanoid";
import { useChat } from "./hooks/useChat";
import { SessionManager } from "./lib/sessionManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot } from "lucide-react";

import { QuickQuestions, type TabType } from "@/components/QuickQuestions";
import TabContent from "@/components/TabContent";
import { TypewriterText } from "@/components/TypewriterText";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Resume from "@/components/Resume";
import Contact from "@/components/Contact";
import LoadingIntro from "@/components/LoadingIntro";
import VantaBackground from "@/components/VantaBackground";
import lanceProfileImage from "@/assets/ICONN.jpg";

// API Base URL - Uses environment variable in production, localhost in development
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? "https://lanceport-fullstack.onrender.com"
  : "http://localhost:5000";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
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
      facebook: string;
      instagram: string;
      location: string;
    };
  };
}
// Aesthetic Renovated Chat Message Component
function AestheticChatMessage({
  content,
  role,
  profile,
}: {
  content: string;
  role: "user" | "assistant";
  profile: ProfileData;
}) {
  const messageContent = String(content || "");
  const isProfileMessage =
    messageContent.startsWith("profile:") && role === "assistant";
  if (isProfileMessage) {
    return (
      <div className="w-full">
        <div className="backdrop-blur-sm border-2 border-blue-200/50 shadow-xl rounded-3xl p-8 mx-auto max-w-3xl">
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
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-md"></div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {profile.name}
            </h3>
            <p className="text-indigo-700 font-semibold text-lg mb-2">
              {profile.title}
            </p>
            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-emerald-800 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                {profile.availability}
              </span>
            </div>
          </div>
          {/* Bio Section */}
          <div className="mb-6">
            <h4 className="font-bold text-slate-900 mb-3 text-lg flex items-center">
              <span className="mr-2">👋</span> About Lance
            </h4>
            <p className="text-slate-700 leading-relaxed">
              {profile.sections.me.bio}
            </p>
          </div>

          {/* Skills Preview */}
          <div className="mb-6">
            <h4 className="font-bold text-slate-900 mb-3 text-lg flex items-center">
              <span className="mr-2">🚀</span> Key Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.sections.skills.slice(0, 2).map((skillGroup, index) =>
                skillGroup.items.slice(0, 3).map((skill, skillIndex) => (
                  <span
                    key={`${index}-${skillIndex}`}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))
              )}
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                +
                {profile.sections.skills.reduce(
                  (total, group) => total + group.items.length,
                  0
                ) - 6}{" "}
                more
              </span>
            </div>
          </div>
          {/* Contact Links */}
          <div className="border-t border-blue-200/50 pt-6">
            <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center">
              <span className="mr-2">📞</span> Get In Touch
            </h4>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${profile.sections.contact.email}`}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg text-sm font-medium transform hover:scale-105"
              >
                <span className="mr-2">📧</span> Email
              </a>
              <a
                href={profile.sections.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg text-sm font-medium transform hover:scale-105"
              >
                <span className="mr-2">💼</span> LinkedIn
              </a>
              <a
                href={profile.sections.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg text-sm font-medium transform hover:scale-105"
              >
                <span className="mr-2">🐙</span> GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Professional Regular Messages
  return (
    <div
      className={`flex items-start gap-4 mb-8 ${
        role === "user" ? "flex-row-reverse" : ""
      }`}
    >
      {/* Refined Avatar */}
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border-2 ${
          role === "user"
            ? "bg-white/20 backdrop-blur-sm border-gray-200/50 text-slate-700"
              : "bg-white/20 backdrop-blur-sm border-gray-200/50 text-slate-700"
        }`}
      >
        {role === "user" ? (
          <User className="w-5 h-5" />
        ) : (
          <Avatar className="w-5 h-5">
            <AvatarImage src={lanceProfileImage} alt="Lance" className="object-cover" />
            <AvatarFallback>LC</AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Professional Message Bubble */}
      <div
        className={`max-w-[70%] transition-all duration-200 ${
          role === "user"
            ? "ml-auto"
            : ""
        }`}
      >
        <div
          className={`px-6 py-4 shadow-sm border transition-all duration-200 hover:shadow-md backdrop-blur-sm ${
            role === "user"
              ? "bg-white/20 border-gray-200/50 text-slate-900 rounded-2xl rounded-tr-md"
        : "bg-white/20 border-gray-200/50 text-slate-900 rounded-2xl rounded-tl-md"
      }`}
    >
      <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-normal text-slate-800 tracking-wide">
            {messageContent}
          </p>
        </div>
      </div>
    </div>
  );
}
// Main Portfolio Component
function Portfolio({ activeTab: initialActiveTab = "me" }: { activeTab?: TabType }) {
  const [sessionId] = useState(() => SessionManager.getSessionId());
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Chat state using the new useChat hook
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    error: chatError, 
    clearChat, 
    refreshConversation,
    getConversationStats,
    conversationLoaded,
    messagesEndRef 
  } = useChat(sessionId);

  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>(initialActiveTab);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync activeTab with route changes
  useEffect(() => {
    setActiveTab(initialActiveTab);
  }, [initialActiveTab]);
  // Fetch portfolio data
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/portfolio/profile`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setProfile(data.profile);
        } else {
          throw new Error("No success in response");
        }
      })
      .catch((err) => {
        console.error("🚀 Error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [API_BASE_URL]);

  // Clear chat messages when landing on the main page to show clean LANCE AI intro
  useEffect(() => {
    if (activeTab === "me" && conversationLoaded) {
      clearChat();
    }
  }, [activeTab, conversationLoaded, clearChat]);

  // Auto-scroll to bottom smoothly when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  // Enhanced message handling with the new useChat hook
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) {
      return;
    }

    const message = inputValue.trim();
    setInputValue("");

    await sendMessage(message);
    inputRef.current?.focus();
  };

  const handleQuickQuestion = async (question: string) => {
    await sendMessage(question);
  };

  const handleNewConversation = () => {
    const newSessionId = SessionManager.startNewConversation();
    // Refresh the page to start with the new session
    window.location.reload();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
        <div className="w-full max-w-md p-6 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3 text-red-700 mb-2">
            <span className="text-2xl">⚠️</span>
            <h3 className="font-semibold">Connection Error</h3>
          </div>
          <p className="text-red-800 mb-4">
            Failed to load portfolio data. Please check your connection and
            try again.
          </p>
          {error && (
            <div className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded">
              Error details: {error}
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Tab Navigation - Top Left */}
      <div className="sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <QuickQuestions 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              onQuestionClick={handleQuickQuestion}
              disabled={isLoading}
              showTabs={true}
            />
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Header Section - Only show avatar and greeting for initial state */}
        {activeTab === "me" && messages.length === 0 && (
          <header
            className="flex-shrink-0 p-4 md:p-6 text-center relative overflow-hidden"
            data-testid="header-profile"
          >
            {/* Background removed to show Vanta effect */}
            
            {/* Mobile-First Professional Layout */}
            <div className="mb-4 md:mb-6 relative z-10">
              {/* Professional Avatar with Mobile Enhancements */}
              <div className="relative inline-block">
                <Avatar className="w-28 h-28 sm:w-40 sm:h-40 md:w-52 md:h-52 mx-auto relative ring-3 sm:ring-8 ring-white shadow-2xl">
                  <AvatarImage
                    src={lanceProfileImage}
                    alt={`${profile.name} Professional Avatar`}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                    LC
                  </AvatarFallback>
                </Avatar>
                {/* Mobile-Optimized Status Ring */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-3 border-white shadow-xl animate-pulse md:hidden"></div>
                {/* Desktop Status Ring */}
                <div className="hidden md:block absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-4 border-white shadow-xl animate-pulse"></div>
              </div>
            </div>
            
            {/* Mobile-Enhanced Typography */}
            <div className="space-y-3 sm:space-y-4 relative z-10">
              <h1 className="text-2xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent drop-shadow-lg">
                <span className="block md:inline">I'm {profile.name.split(' ')[0]}'s</span>
                <span className="block md:inline text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-black font-extrabold drop-shadow-lg"> AI</span>
              </h1>
              
              <p className="text-sm leading-relaxed sm:text-lg md:text-xl text-gray-700 font-medium max-w-2xl mx-auto px-2">
                <span className="md:hidden">
                  <TypewriterText 
                    text="Intelligent conversation with Lance AI Personal Assistant"
                    speed={80}
                    delay={500}
                  />
                </span>
                <span className="hidden md:inline">
                  <TypewriterText 
                    text="Intelligent conversation with Lance AI Personal Assistant"
                    speed={80}
                    delay={500}
                  />
                </span>
              </p>
            </div>
            
            {/* Enhanced Mobile Status Badge */}
            <div className="mt-6 sm:mt-8 relative z-10">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-5 py-3 sm:px-6 sm:py-3 rounded-2xl">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse shadow-sm"></div>
                <span className="font-semibold text-sm sm:text-base tracking-wide text-gray-800">{profile.availability}</span>
                <div className="md:hidden w-1 h-1 bg-green-400 rounded-full opacity-60"></div>
              </div>
            </div>
          </header>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {/* Background removed to show Vanta effect */}

          {activeTab === "me" && messages.length === 0 ? (
            /* Initial Clean Interface matching reference */
            <>
              <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 w-full">
                  {/* Main Chat Section */}
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <h1 className="text-xl md:text-2xl font-medium text-gray-700 mb-8 md:mb-12 text-center px-4">
                      <TypewriterText 
                        text="Hey there! How are you doing today?"
                        speed={100}
                        delay={1000}
                      />
                    </h1>

                    {/* Chat Error */}
                    {chatError && (
                      <div className="text-center py-4">
                        <div className="inline-block px-6 py-3 bg-red-50 text-red-600 rounded-2xl border border-red-200 shadow-lg">
                          {chatError}
                        </div>
                      </div>
                    )}
                  </div>


                </div>
              </div>

              {/* Enhanced Mobile Chat Input */}
              <div className="p-3 sm:p-6 relative z-20">
                {/* Mobile-First Input Container */}
                <div className="max-w-2xl mx-auto">
                  {/* Mobile Input Wrapper with Professional Styling */}
                  <div className="relative flex gap-2 sm:gap-3 p-2 sm:p-0 rounded-2xl sm:rounded-none">
                    {/* Enhanced Input Field */}
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Ask me anything about Lance..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        className="w-full text-sm sm:text-base py-3 sm:py-3 px-4 sm:px-4 rounded-xl sm:rounded-full border-2 border-gray-200/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 bg-white/20 backdrop-blur-sm placeholder:text-gray-500 shadow-sm sm:shadow-lg h-12 md:h-14 !font-bold text-gray-900"
                      />
                      {/* Mobile Input Enhancement Indicator */}
                      <div className="md:hidden absolute right-3 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full opacity-30"></div>
                    </div>
                    
                    {/* Professional Send Button */}
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className="px-4 sm:px-6 py-3 sm:py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white rounded-xl sm:rounded-full transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 w-12 h-12 flex-shrink-0"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Mobile-Only Professional Footer */}
                  <div className="md:hidden mt-3 text-center">
                    <p className="text-xs text-gray-500 font-medium tracking-wide">
                      Powered by AI • Secure & Private
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : activeTab === "me" && messages.length > 0 ? (
            /* Chat with Messages - Clean Interface */
            <div className="flex-1 flex flex-col relative z-20">


              {/* Chat Messages Area - Centered */}
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-4xl">
                  <ScrollArea className="h-[500px] p-6" data-testid="scroll-chat-messages">
                      <div className="space-y-6">
                        {messages.map((message) => (
                          <div key={message.id}>
                            <AestheticChatMessage
                              content={message.message}
                              role={message.role}
                              profile={profile}
                            />
                          </div>
                        ))}

                        {/* Professional Loading Indicator */}
                        {isLoading && (
                          <div className="flex items-start gap-4 mb-8">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border-2 bg-white/20 backdrop-blur-sm border-gray-200/50 text-gray-600">
                              <Avatar className="w-5 h-5">
                                <AvatarImage src={lanceProfileImage} alt="Lance" className="object-cover" />
                                <AvatarFallback>LC</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="max-w-[70%]">
                              <div className="px-6 py-4 shadow-sm border bg-white/20 backdrop-blur-sm border-gray-200/50 text-gray-800 rounded-2xl rounded-tl-md">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                  <div
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.1s" }}
                                  ></div>
                                  <div
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div ref={messagesEndRef} />

                        {chatError && (
                          <div className="text-center py-6">
                            <div className="inline-block px-6 py-4 bg-red-50 text-red-700 rounded-xl border border-red-200 shadow-sm font-medium">
                              {chatError}
                            </div>
                          </div>
                        )}


                      </div>
                    </ScrollArea>
                  </div>
                </div>
              
              {/* Fixed Chat Input at Bottom */}
              <div className="p-6 backdrop-blur-sm border-t border-gray-200/50">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center gap-4">
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Type your message..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      className="flex-1 h-14 px-6 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:border-gray-300 focus:ring-0 transition-all duration-200 text-[15px] !font-bold text-gray-900 placeholder:text-gray-400 shadow-sm hover:shadow-md"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className="h-14 w-14 rounded-xl backdrop-blur-sm border border-gray-200/50 hover:bg-white/10 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 text-gray-600 hover:text-gray-700"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Other Tab Content - Asymmetric Transparent Design */
            <div className="p-6 relative z-0">
              <div className="max-w-4xl mx-auto relative z-0">
                {/* Asymmetric Background Container */}
                <div className="relative">
                  {/* Right Side Background Only */}
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-white/20 backdrop-blur-sm rounded-r-2xl border-r border-t border-b border-gray-200/30 shadow-xl"></div>
                  
                  {/* Content Container with Transparent Left */}
                  <div className="relative z-1 p-8">
                    <TabContent activeTab={activeTab} profile={profile} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Enhanced Professional Footer */}
      <footer className="border-t border-gray-200/30 mt-20 shadow-lg backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-12">
          
          {/* Main Content */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <strong className="text-white font-bold text-lg">LC</strong>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                {profile.name}
              </h3>
            </div>
            
            <p className="text-slate-800 font-semibold text-lg mb-2">
              Full-Stack Developer & AI Engineer
            </p>
            <p className="text-slate-700 font-medium mb-6 max-w-2xl mx-auto">
              Combining Modern Web Technologies and AI to create innovative digital solutions
            </p>

            {/* Modern Social Links */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <a 
                href="https://github.com/lancyybooii" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-900 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <svg 
                  viewBox="0 0 16 16" 
                  className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors duration-300" 
                  fill="currentColor" 
                  xmlns="http://www.w3.org/2000/svg"
                > 
                  <path 
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" 
                  />
                </svg>
              </a>
              
              <a 
                href="https://linkedin.com/in/lance-cabanit-61530b372" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-12 h-12 bg-blue-50 hover:bg-blue-600 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <svg 
                  viewBox="0 0 16 16" 
                  className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" 
                  fill="currentColor" 
                  xmlns="http://www.w3.org/2000/svg"
                > 
                  <path 
                    d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"
                  />
                </svg>
              </a>
              
              <a 
                href="mailto:cabanitlance43@gmail.com" 
                className="group flex items-center justify-center w-12 h-12 bg-red-50 hover:bg-red-500 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <svg 
                  viewBox="0 0 16 16" 
                  className="w-6 h-6 text-red-500 group-hover:text-white transition-colors duration-300" 
                  fill="currentColor" 
                  xmlns="http://www.w3.org/2000/svg"
                > 
                  <path 
                    d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200/50 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              
              {/* Copyright */}
              <div className="text-slate-600 text-sm">
                <p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
              </div>

              {/* Tech Stack */}
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <em className="text-slate-900 font-bold">
                  Powered by LancyyAI
                </em>
                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <code className="px-2 py-1 text-blue-800 rounded-md text-xs font-medium border border-blue-200">React</code>
                  <code className="px-2 py-1 text-purple-800 rounded-md text-xs font-medium border border-purple-200">TypeScript</code>
                  <code className="px-2 py-1 text-green-800 rounded-md text-xs font-medium border border-green-200">Python</code>
                </div>
              </div>
            </div>


          </div>
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
      <Route path="/" component={() => <Portfolio activeTab="me" />} />
        <Route path="/me" component={() => <Portfolio activeTab="me" />} />
        <Route path="/projects" component={() => <Projects />} />
        <Route path="/skills" component={() => <Skills />} />
        <Route path="/resume" component={() => <Resume />} />
        <Route path="/certificates" component={() => <Portfolio activeTab="certificates" />} />
        <Route path="/contact" component={() => <Contact />} />
      <Route component={NotFound} />
    </Switch>
  );
}
export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Vanta.js NET Background */}
        <VantaBackground />
        <Toaster />
        <div className="relative z-10 min-h-screen">
          {showIntro ? (
            <LoadingIntro onComplete={handleIntroComplete} />
          ) : (
            <Router />
          )}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}




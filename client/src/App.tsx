import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useEffect, useState, useRef } from "react";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot } from "lucide-react";
import { QuickQuestions, type TabType } from "@/components/QuickQuestions";
import TabContent from "@/components/TabContent";
import { ThemeToggle } from "@/components/ThemeToggle";
import lanceProfileImage from "@/assets/ICONN.jpg";

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
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-md"></div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {profile.name}
              </h3>
              <p className="text-blue-600 font-semibold text-lg mb-2">
                {profile.title}
              </p>
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
            <p className="text-gray-700 leading-relaxed">
              {profile.sections.me.bio}
            </p>
          </div>

          {/* Skills Preview */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center">
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
            ? "bg-white border-gray-200 text-gray-600"
            : "bg-white border-gray-200 text-gray-600"
        }`}
      >
        {role === "user" ? (
          <User className="w-5 h-5" />
        ) : (
          <Bot className="w-5 h-5" />
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
          className={`px-6 py-4 shadow-sm border transition-all duration-200 hover:shadow-md ${
            role === "user"
              ? "bg-white border-gray-200 text-gray-800 rounded-2xl rounded-tr-md"
              : "bg-white border-gray-200 text-gray-800 rounded-2xl rounded-tl-md"
          }`}
        >
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-normal text-gray-700 tracking-wide">
            {messageContent}
          </p>
        </div>
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
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("me");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // API Base URL - Uses environment variable in production, localhost in development
  const API_BASE_URL = window.location.hostname.endsWith("onrender.com")
    ? "https://lanceport-fullstack.onrender.com"
    : "http://localhost:5000";
  // Fetch portfolio data
  useEffect(() => {
    console.log("🚀 PORTFOLIO FETCH STARTING...");

    fetch(`${API_BASE_URL}/api/portfolio/profile`)
      .then((response) => {
        console.log("🚀 Response status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("🚀 Data received:", data);
        if (data.success) {
          setProfile(data.profile);
          console.log("🚀 Profile set successfully!");
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
  // Auto-scroll to bottom smoothly when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);
  // Send message function
  const sendMessage = async (messageContent: string, isQuickQuestion = false) => {
    if (!messageContent.trim() || isLoading) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent.trim(),
      role: "user",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setChatError(null);
    try {
      console.log("🎯 Sending message to chat API:", messageContent.trim());

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
        body: JSON.stringify({
          message: messageContent.trim(),
          profile: profile,
          sessionId: sessionId,
        }),
      });
      console.log("🎯 Chat API response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("🎯 Chat API response data:", data);

      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
        console.log("🎯 Message added to chat history");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("🎯 Chat error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setChatError(`Sorry, I encountered an error: ${errorMessage}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue("");

    await sendMessage(message, false);
    inputRef.current?.focus();
  };
  const handleQuickQuestion = async (question: string) => {
    await sendMessage(question, true);
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
        <div className="w-full max-w-md p-6 border border-red-200 bg-red-50 rounded-lg">
          <div className="flex items-center gap-3 text-red-600 mb-2">
            <span className="text-2xl">⚠️</span>
            <h3 className="font-semibold">Connection Error</h3>
          </div>
          <p className="text-red-700 mb-4">
            Failed to load portfolio data. Please check your connection and
            try again.
          </p>
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-gray-900 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-bl from-gray-800 to-transparent rounded-full blur-3xl transform translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-tr from-gray-700 to-transparent rounded-full blur-3xl transform translate-y-1/2"></div>
      </div>
      
      {/* Geometric accent elements */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-gray-400 rounded-full"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-gray-500 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-gray-500 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-gray-400 rounded-full"></div>
      </div>
      {/* Tab Navigation - Top Left */}
      <div className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
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
          <ThemeToggle />
        </div>
      </div>
      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Header Section - Only show avatar and greeting for initial state */}
        {activeTab === "me" && messages.length === 0 && (
          <header
            className="flex-shrink-0 p-6 text-center"
            data-testid="header-profile"
          >
            <div className="mb-6">
              <Avatar className="w-52 h-52 mx-auto border-2 border-border">
                <AvatarImage
                  src={lanceProfileImage}
                  alt={`${profile.name} Professional Avatar`}
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl font-semibold">
                  LC
                </AvatarFallback>
              </Avatar>
            </div>
          </header>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          {activeTab === "me" && messages.length === 0 ? (
            /* Initial Clean Interface matching reference */
            <>
              <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto">

                <h1 className="text-2xl font-medium text-gray-700 mb-12 text-center">Hey there! How are you doing today?</h1>
                
                <div className="w-full max-w-2xl">
                  <QuickQuestions
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onQuestionClick={handleQuickQuestion}
                    disabled={isLoading}
                    showTabs={false}
                  />
                </div>

                {/* Chat Error */}
                {chatError && (
                  <div className="text-center py-4">
                    <div className="inline-block px-6 py-3 bg-red-50/90 backdrop-blur-sm text-red-600 rounded-2xl border border-red-200 shadow-lg">
                      {chatError}
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input at Bottom */}
              <div className="p-4 relative z-20">
                <div className="flex gap-3">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask me anything"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="flex-1 bg-gray-100 border-gray-200 rounded-full px-4 py-3 text-base text-gray-700 placeholder-gray-500 focus:bg-white focus:border-blue-500 h-12"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="rounded-full bg-blue-500 hover:bg-blue-600 text-white w-12 h-12"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
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
                              content={message.content}
                              role={message.role}
                              profile={profile}
                            />
                          </div>
                        ))}

                        {/* Professional Loading Indicator */}
                        {isLoading && (
                          <div className="flex items-start gap-4 mb-8">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border-2 bg-white border-gray-200 text-gray-600">
                              <Bot className="w-5 h-5" />
                            </div>
                            <div className="max-w-[70%]">
                              <div className="px-6 py-4 shadow-sm border bg-white border-gray-200 text-gray-800 rounded-2xl rounded-tl-md">
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
              <div className="p-6 bg-white/95 backdrop-blur-sm border-t border-gray-200/50">
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
                      className="flex-1 h-14 px-6 bg-white border border-gray-200 rounded-xl focus:border-gray-300 focus:ring-0 transition-all duration-200 text-[15px] font-normal text-gray-700 placeholder:text-gray-400 shadow-sm hover:shadow-md"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className="h-14 w-14 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 text-gray-600 hover:text-gray-700"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Other Tab Content - Original Design with Background */
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
                  <TabContent activeTab={activeTab} profile={profile} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Enhanced Footer with Quality Watermark */}
      <footer className="border-t border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-xl mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-700 font-semibold text-lg mb-2">
            Developed by {profile.name}
          </p>
          <p className="text-gray-600 font-medium mb-3">
            Combining Modern Web Technologies and AI
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
              Powered by LancyyAI
            </span>
            <span>•</span>
            <span>React</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Tailwind CSS</span>
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




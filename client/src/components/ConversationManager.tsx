import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SessionManager } from '@/lib/sessionManager';
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  Trash2, 
  RefreshCw,
  User,
  Bot
} from 'lucide-react';

interface Conversation {
  id: string;
  sessionId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastActivity: string;
}

interface ConversationManagerProps {
  currentSessionId: string;
  onNewConversation: () => void;
  onRefreshConversation: () => void;
  conversationStats: {
    totalMessages: number;
    userMessages: number;
    assistantMessages: number;
    hasHistory: boolean;
  };
}

export function ConversationManager({ 
  currentSessionId, 
  onNewConversation, 
  onRefreshConversation,
  conversationStats 
}: ConversationManagerProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(SessionManager.getSessionInfo());

  // Load recent conversations
  const loadConversations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/conversations?limit=10');
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update session info periodically
  useEffect(() => {
    const updateSessionInfo = () => {
      setSessionInfo(SessionManager.getSessionInfo());
    };

    updateSessionInfo();
    const interval = setInterval(updateSessionInfo, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const handleNewConversation = () => {
    SessionManager.startNewConversation();
    setSessionInfo(SessionManager.getSessionInfo());
    onNewConversation();
    loadConversations(); // Refresh the list
  };

  const handleClearSession = () => {
    SessionManager.clearSession();
    setSessionInfo(SessionManager.getSessionInfo());
    onRefreshConversation();
  };

  const formatTimeRemaining = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="w-5 h-5" />
          Conversation Manager
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Session Info */}
        <div className="p-3 bg-slate-50 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Current Session</span>
            <Badge variant={sessionInfo.isExpired ? "destructive" : "default"} className="text-xs">
              {sessionInfo.isExpired ? "Expired" : "Active"}
            </Badge>
          </div>
          
          <div className="text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              {sessionInfo.isExpired ? (
                "Session expired"
              ) : (
                `Expires in ${formatTimeRemaining(sessionInfo.timeRemaining)}`
              )}
            </div>
            
            {conversationStats.hasHistory && (
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{conversationStats.userMessages}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bot className="w-3 h-3" />
                  <span>{conversationStats.assistantMessages}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleNewConversation}
            className="flex-1 text-sm"
            variant="default"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
          
          <Button 
            onClick={onRefreshConversation}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          
          <Button 
            onClick={handleClearSession}
            variant="outline"
            size="sm"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Recent Conversations */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Recent Conversations</span>
            <Button 
              onClick={loadConversations}
              variant="ghost"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-4">
                No recent conversations
              </div>
            ) : (
              conversations.map((conv) => (
                <div 
                  key={conv.id}
                  className={`p-2 rounded border text-xs ${
                    conv.sessionId === currentSessionId 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-700 truncate">
                      {conv.title || 'Untitled Conversation'}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {conv.messageCount}
                    </Badge>
                  </div>
                  <div className="text-slate-500">
                    {formatDate(conv.lastActivity)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
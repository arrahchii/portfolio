import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '@/hooks/useChat';

interface ChatMessageProps {
  message: ChatMessageType;
  userAvatar?: string;
  assistantAvatar?: string;
}

export function ChatMessage({ message, assistantAvatar }: ChatMessageProps) {
  if (message.isTyping) {
    return (
      <div className="chat-bubble">
        <div className="flex gap-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={assistantAvatar} alt="Lance Avatar" />
            <AvatarFallback className="text-xs">LC</AvatarFallback>
          </Avatar>
          <div className="chat-message-assistant rounded-lg px-4 py-3">
            <div className="typing-indicator flex gap-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (message.role === 'user') {
    return (
      <div className="chat-bubble">
        <div className="flex gap-3 mb-4 justify-end">
          <div className="chat-message-user rounded-lg px-4 py-3 max-w-xs sm:max-w-md">
            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
          </div>
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              U
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-bubble">
      <div className="flex gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={assistantAvatar} alt="Lance Avatar" />
          <AvatarFallback className="text-xs">LC</AvatarFallback>
        </Avatar>
        <div className="chat-message-assistant rounded-lg px-4 py-3 max-w-xs sm:max-w-md">
          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
        </div>
      </div>
    </div>
  );
}

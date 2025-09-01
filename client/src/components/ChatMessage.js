import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import lanceProfileImage from '@/assets/lance-profile.jpg';
export function ChatMessage(_a) {
    var message = _a.message, assistantAvatar = _a.assistantAvatar;
    if (message.isTyping) {
        return (_jsx("div", { className: "chat-bubble", children: _jsxs("div", { className: "flex gap-3", children: [_jsxs(Avatar, { className: "w-8 h-8 flex-shrink-0", children: [_jsx(AvatarImage, { src: lanceProfileImage, alt: "Lance Avatar", className: "object-cover" }), _jsx(AvatarFallback, { className: "text-xs", children: "LC" })] }), _jsx("div", { className: "chat-message-assistant rounded-lg px-4 py-3", children: _jsxs("div", { className: "typing-indicator flex gap-1", children: [_jsx("div", { className: "w-2 h-2 bg-muted-foreground rounded-full animate-pulse" }), _jsx("div", { className: "w-2 h-2 bg-muted-foreground rounded-full animate-pulse", style: { animationDelay: '0.2s' } }), _jsx("div", { className: "w-2 h-2 bg-muted-foreground rounded-full animate-pulse", style: { animationDelay: '0.4s' } })] }) })] }) }));
    }
    if (message.role === 'user') {
        return (_jsx("div", { className: "chat-bubble", children: _jsxs("div", { className: "flex gap-3 mb-4 justify-end", children: [_jsx("div", { className: "chat-message-user rounded-lg px-4 py-3 max-w-xs sm:max-w-md", children: _jsx("p", { className: "text-sm whitespace-pre-wrap", children: message.message }) }), _jsx(Avatar, { className: "w-8 h-8 flex-shrink-0", children: _jsx(AvatarFallback, { className: "bg-primary text-primary-foreground text-xs font-semibold", children: "U" }) })] }) }));
    }
    return (_jsx("div", { className: "chat-bubble", children: _jsxs("div", { className: "flex gap-3", children: [_jsxs(Avatar, { className: "w-8 h-8 flex-shrink-0", children: [_jsx(AvatarImage, { src: lanceProfileImage, alt: "Lance Avatar", className: "object-cover" }), _jsx(AvatarFallback, { className: "text-xs", children: "LC" })] }), _jsx("div", { className: "chat-message-assistant rounded-lg px-4 py-3 max-w-xs sm:max-w-md", children: _jsx("p", { className: "text-sm whitespace-pre-wrap", children: message.message }) })] }) }));
}

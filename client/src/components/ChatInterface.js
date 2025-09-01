var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { QuickQuestions } from './QuickQuestions';
import { TabNavigation } from './TabNavigation';
import { TabContent } from './TabContent';
import { ThemeToggle } from './ThemeToggle';
import { useChat } from '@/hooks/useChat';
import lanceProfileImage from '@/assets/lance-profile.jpg';
export function ChatInterface(_a) {
    var _this = this;
    var profile = _a.profile, sessionId = _a.sessionId;
    var _b = useState(''), inputValue = _b[0], setInputValue = _b[1];
    var _c = useState('me'), activeTab = _c[0], setActiveTab = _c[1];
    var inputRef = useRef(null);
    var _d = useChat(sessionId), messages = _d.messages, sendMessage = _d.sendMessage, isLoading = _d.isLoading, error = _d.error, messagesEndRef = _d.messagesEndRef;
    // No auto welcome message - keep it clean like Anuj's interface
    var handleSendMessage = function () { return __awaiter(_this, void 0, void 0, function () {
        var message;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!inputValue.trim() || isLoading)
                        return [2 /*return*/];
                    message = inputValue.trim();
                    setInputValue('');
                    return [4 /*yield*/, sendMessage(message, false)];
                case 1:
                    _b.sent();
                    (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleQuickQuestion = function (question) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sendMessage(question, true)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleKeyDown = function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    return (_jsxs("div", { className: "flex flex-col min-h-screen", children: [_jsx("div", { className: "sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border", children: _jsxs("div", { className: "flex items-center justify-between px-4", children: [_jsx(TabNavigation, { activeTab: activeTab, onTabChange: setActiveTab }), _jsx(ThemeToggle, {})] }) }), _jsxs("div", { className: "max-w-4xl mx-auto w-full", children: [(activeTab === 'me' || messages.length > 0) && (_jsxs("header", { className: "flex-shrink-0 p-6 text-center border-b border-border", "data-testid": "header-profile", children: [_jsx("div", { className: "mb-6", children: _jsxs(Avatar, { className: "w-32 h-32 mx-auto avatar-glow border-4 border-white shadow-lg", children: [_jsx(AvatarImage, { src: lanceProfileImage, alt: "".concat(profile.name, " Professional Avatar"), className: "object-cover" }), _jsx(AvatarFallback, { className: "text-xl font-semibold", children: "LC" })] }) }), _jsxs("h1", { className: "text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight", "data-testid": "text-profile-title", children: ["I'm ", profile.name.split(' ')[0], "'s digital twin"] }), _jsx("p", { className: "text-lg text-muted-foreground mb-6 font-medium", "data-testid": "text-profile-subtitle", children: "Begin your interview with my digital twin." }), _jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-200", "data-testid": "status-availability", children: [_jsx("span", { className: "w-2 h-2 bg-green-500 rounded-full status-dot" }), _jsx("span", { children: profile.availability })] })] })), _jsx("main", { className: "flex-1 flex flex-col", children: activeTab === 'me' && messages.length === 0 ? (
                        /* Chat Interface for 'me' tab */
                        _jsxs(_Fragment, { children: [_jsx(ScrollArea, { className: "flex-1 p-4", "data-testid": "scroll-chat-messages", children: _jsxs("div", { className: "space-y-4", children: [_jsx(QuickQuestions, { onQuestionClick: handleQuickQuestion, disabled: isLoading }), messages.map(function (message) { return (_jsx(ChatMessage, { message: message, assistantAvatar: profile.avatar }, message.id)); }), error && (_jsx("div", { className: "text-center py-4", "data-testid": "text-error-message", children: _jsx("div", { className: "inline-block px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-sm", children: error }) })), _jsx("div", { ref: messagesEndRef })] }) }), _jsx("div", { className: "flex-shrink-0 p-4 border-t border-border", "data-testid": "input-chat-container", children: _jsxs("div", { className: "relative max-w-4xl mx-auto", children: [_jsx(Input, { ref: inputRef, type: "text", placeholder: "Ask me anything", value: inputValue, onChange: function (e) { return setInputValue(e.target.value); }, onKeyDown: handleKeyDown, disabled: isLoading, className: "w-full pr-12 bg-background border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent", "data-testid": "input-chat-message" }), _jsx(Button, { onClick: handleSendMessage, disabled: !inputValue.trim() || isLoading, size: "sm", className: "absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg", "data-testid": "button-send-message", children: _jsx(Send, { className: "w-4 h-4" }) })] }) })] })) : activeTab === 'me' && messages.length > 0 ? (
                        /* Continue chat interface when there are messages */
                        _jsxs(_Fragment, { children: [_jsx(ScrollArea, { className: "flex-1 p-4", "data-testid": "scroll-chat-messages", children: _jsxs("div", { className: "space-y-4", children: [messages.map(function (message) { return (_jsx(ChatMessage, { message: message, assistantAvatar: profile.avatar }, message.id)); }), error && (_jsx("div", { className: "text-center py-4", "data-testid": "text-error-message", children: _jsx("div", { className: "inline-block px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-sm", children: error }) })), _jsx("div", { ref: messagesEndRef })] }) }), _jsx("div", { className: "flex-shrink-0 p-4 border-t border-border", "data-testid": "input-chat-container", children: _jsxs("div", { className: "relative max-w-4xl mx-auto", children: [_jsx(Input, { ref: inputRef, type: "text", placeholder: "Ask me anything", value: inputValue, onChange: function (e) { return setInputValue(e.target.value); }, onKeyDown: handleKeyDown, disabled: isLoading, className: "w-full pr-12 bg-background border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent", "data-testid": "input-chat-message" }), _jsx(Button, { onClick: handleSendMessage, disabled: !inputValue.trim() || isLoading, size: "sm", className: "absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg", "data-testid": "button-send-message", children: _jsx(Send, { className: "w-4 h-4" }) })] }) })] })) : (
                        /* Tab Content for other tabs */
                        _jsx("div", { className: "p-6", children: _jsx(TabContent, { activeTab: activeTab, profile: profile }) })) })] })] }));
}

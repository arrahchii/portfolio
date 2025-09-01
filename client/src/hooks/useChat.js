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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useState, useCallback, useRef, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
export function useChat(sessionId) {
    var _this = this;
    var _a = useState([]), messages = _a[0], setMessages = _a[1];
    var _b = useState(false), isLoading = _b[0], setIsLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var messagesEndRef = useRef(null);
    var scrollToBottom = useCallback(function () {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
    }, []);
    useEffect(function () {
        scrollToBottom();
    }, [messages, scrollToBottom]);
    var sendMessage = useCallback(function (message_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(_this, __spreadArray([message_1], args_1, true), void 0, function (message, isQuickQuestion) {
            var userMessage, typingMessage, response, data_1, error_1;
            if (isQuickQuestion === void 0) { isQuickQuestion = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!message.trim() || isLoading)
                            return [2 /*return*/];
                        setError(null);
                        userMessage = {
                            id: "user-".concat(Date.now()),
                            role: 'user',
                            message: message.trim(),
                            timestamp: new Date(),
                        };
                        setMessages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [userMessage], false); });
                        setIsLoading(true);
                        typingMessage = {
                            id: 'typing',
                            role: 'assistant',
                            message: '',
                            timestamp: new Date(),
                            isTyping: true,
                        };
                        setMessages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [typingMessage], false); });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, apiRequest('POST', '/api/chat', {
                                message: message.trim(),
                                sessionId: sessionId,
                                isQuickQuestion: isQuickQuestion,
                            })];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data_1 = _a.sent();
                        if (data_1.success) {
                            // Remove typing indicator and add assistant response
                            setMessages(function (prev) {
                                var filtered = prev.filter(function (msg) { return msg.id !== 'typing'; });
                                return __spreadArray(__spreadArray([], filtered, true), [
                                    {
                                        id: data_1.messageId || "assistant-".concat(Date.now()),
                                        role: 'assistant',
                                        message: data_1.message,
                                        timestamp: new Date(),
                                    }
                                ], false);
                            });
                        }
                        else {
                            throw new Error(data_1.error || 'Failed to send message');
                        }
                        return [3 /*break*/, 6];
                    case 4:
                        error_1 = _a.sent();
                        setError(error_1 instanceof Error ? error_1.message : 'Failed to send message');
                        // Remove typing indicator
                        setMessages(function (prev) { return prev.filter(function (msg) { return msg.id !== 'typing'; }); });
                        return [3 /*break*/, 6];
                    case 5:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }, [sessionId, isLoading]);
    var clearChat = useCallback(function () {
        setMessages([]);
        setError(null);
    }, []);
    return {
        messages: messages,
        sendMessage: sendMessage,
        isLoading: isLoading,
        error: error,
        clearChat: clearChat,
        messagesEndRef: messagesEndRef,
    };
}

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
import { createServer } from "http";
import { storage } from "./storage";
import { lanceDigitalTwin } from "./services/openai";
import { z } from "zod";
var chatRequestSchema = z.object({
    message: z.string().min(1).max(1000),
    sessionId: z.string().min(1),
    isQuickQuestion: z.boolean().optional(),
});
export function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function () {
        var httpServer;
        var _this = this;
        return __generator(this, function (_a) {
            // Chat endpoint for AI responses
            app.post("/api/chat", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, message, sessionId, isQuickQuestion, response, history_1, assistantMessage, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 7, , 8]);
                            _a = chatRequestSchema.parse(req.body), message = _a.message, sessionId = _a.sessionId, isQuickQuestion = _a.isQuickQuestion;
                            // Save user message
                            return [4 /*yield*/, storage.saveChatMessage({
                                    sessionId: sessionId,
                                    message: message,
                                    role: "user",
                                    metadata: { isQuickQuestion: isQuickQuestion || false },
                                })];
                        case 1:
                            // Save user message
                            _b.sent();
                            response = void 0;
                            if (!isQuickQuestion) return [3 /*break*/, 2];
                            // Handle predefined quick questions
                            response = lanceDigitalTwin.getQuickQuestionResponse(message);
                            return [3 /*break*/, 5];
                        case 2: return [4 /*yield*/, storage.getChatHistory(sessionId)];
                        case 3:
                            history_1 = _b.sent();
                            return [4 /*yield*/, lanceDigitalTwin.getResponse(message, history_1)];
                        case 4:
                            // Generate AI response
                            response = _b.sent();
                            _b.label = 5;
                        case 5: return [4 /*yield*/, storage.saveChatMessage({
                                sessionId: sessionId,
                                message: response,
                                role: "assistant",
                                metadata: {},
                            })];
                        case 6:
                            assistantMessage = _b.sent();
                            res.json({
                                success: true,
                                message: response,
                                messageId: assistantMessage.id,
                            });
                            return [3 /*break*/, 8];
                        case 7:
                            error_1 = _b.sent();
                            console.error('Chat API Error:', error_1);
                            if (error_1 instanceof z.ZodError) {
                                return [2 /*return*/, res.status(400).json({
                                        success: false,
                                        error: "Invalid request format",
                                        details: error_1.errors,
                                    })];
                            }
                            res.status(500).json({
                                success: false,
                                error: error_1 instanceof Error ? error_1.message : "Failed to process chat message",
                            });
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/];
                    }
                });
            }); });
            // Get chat history
            app.get("/api/chat/history/:sessionId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var sessionId, history_2, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            sessionId = req.params.sessionId;
                            if (!sessionId) {
                                return [2 /*return*/, res.status(400).json({
                                        success: false,
                                        error: "Session ID is required",
                                    })];
                            }
                            return [4 /*yield*/, storage.getChatHistory(sessionId)];
                        case 1:
                            history_2 = _a.sent();
                            res.json({
                                success: true,
                                messages: history_2,
                            });
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            console.error('Chat History API Error:', error_2);
                            res.status(500).json({
                                success: false,
                                error: "Failed to retrieve chat history",
                            });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Portfolio data endpoint
            app.get("/api/portfolio/profile", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var profile;
                return __generator(this, function (_a) {
                    try {
                        profile = {
                            name: "Lance Cabanit",
                            title: "Full-Stack Developer & AI Enthusiast",
                            availability: "Available for Opportunities",
                            avatar: "/attached_assets/image_1756544677548.png",
                            sections: {
                                me: {
                                    bio: "Passionate full-stack developer with expertise in modern web technologies and AI integration. I love creating interactive applications that solve real-world problems.",
                                    experience: "3+ years of professional development experience",
                                    passion: "Building innovative solutions with cutting-edge technology"
                                },
                                skills: [
                                    { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
                                    { category: "Backend", items: ["Node.js", "Express", "Python", "Django"] },
                                    { category: "Database", items: ["PostgreSQL", "MongoDB", "Redis"] },
                                    { category: "Cloud", items: ["AWS", "Vercel", "Docker"] },
                                    { category: "AI/ML", items: ["OpenAI API", "TensorFlow", "scikit-learn"] }
                                ],
                                projects: [
                                    {
                                        name: "AI Portfolio Assistant",
                                        description: "Interactive digital twin chatbot with conversational AI",
                                        tech: ["React", "OpenAI API", "Node.js", "TypeScript"],
                                        status: "Live"
                                    },
                                    {
                                        name: "E-Commerce Platform",
                                        description: "Full-stack marketplace with real-time features",
                                        tech: ["Next.js", "PostgreSQL", "Stripe", "AWS"],
                                        status: "Production"
                                    },
                                    {
                                        name: "ML Market Predictor",
                                        description: "Predictive analytics for market trend analysis",
                                        tech: ["Python", "TensorFlow", "FastAPI"],
                                        status: "Beta"
                                    }
                                ],
                                contact: {
                                    email: "lance.cabanit@email.com",
                                    linkedin: "linkedin.com/in/lance-cabanit",
                                    github: "github.com/lancecanbanit",
                                    location: "Available for Remote Work"
                                }
                            }
                        };
                        res.json({
                            success: true,
                            profile: profile,
                        });
                    }
                    catch (error) {
                        console.error('Profile API Error:', error);
                        res.status(500).json({
                            success: false,
                            error: "Failed to retrieve profile data",
                        });
                    }
                    return [2 /*return*/];
                });
            }); });
            httpServer = createServer(app);
            return [2 /*return*/, httpServer];
        });
    });
}

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
import OpenAI from "openai";
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
var openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "default_key"
});
var LANCE_PROFILE = {
    name: "Lance Cabanit",
    role: "Full-Stack Developer & AI Enthusiast",
    background: "Passionate developer with expertise in modern web technologies and AI integration",
    skills: [
        "Frontend: React, Next.js, TypeScript, Tailwind CSS, JavaScript",
        "Backend: Node.js, Express, Python, Django, REST APIs",
        "Databases: PostgreSQL, MongoDB, Redis",
        "Cloud & DevOps: AWS, Vercel, Docker, CI/CD",
        "AI/ML: OpenAI API, TensorFlow, scikit-learn, Natural Language Processing"
    ],
    projects: [
        {
            name: "AI-Powered Portfolio Website",
            description: "Interactive digital twin chatbot with advanced conversational AI",
            tech: ["React", "OpenAI API", "Node.js", "TypeScript"]
        },
        {
            name: "E-Commerce Platform",
            description: "Full-stack marketplace with real-time features and payment integration",
            tech: ["Next.js", "PostgreSQL", "Stripe", "AWS"]
        },
        {
            name: "Machine Learning Market Predictor",
            description: "Predictive analytics tool for market trend analysis",
            tech: ["Python", "TensorFlow", "scikit-learn", "FastAPI"]
        }
    ],
    availability: "Available for Opportunities",
    contact: {
        email: "lance.cabanit@email.com",
        linkedin: "linkedin.com/in/lance-cabanit",
        github: "github.com/lancecanbanit"
    }
};
var LanceDigitalTwin = /** @class */ (function () {
    function LanceDigitalTwin() {
    }
    LanceDigitalTwin.prototype.getResponse = function (userMessage_1) {
        return __awaiter(this, arguments, void 0, function (userMessage, conversationHistory) {
            var systemPrompt, messages, response, error_1, fallbackResponses, userMessageLower, _i, _a, _b, key, response;
            if (conversationHistory === void 0) { conversationHistory = []; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        systemPrompt = "You are Lance Cabanit's digital twin, an AI assistant representing ".concat(LANCE_PROFILE.name, ", a ").concat(LANCE_PROFILE.role, ".\n\nBackground: ").concat(LANCE_PROFILE.background, "\n\nKey Information about Lance:\n- Skills: ").concat(LANCE_PROFILE.skills.join(', '), "\n- Current Status: ").concat(LANCE_PROFILE.availability, "\n- Notable Projects: ").concat(LANCE_PROFILE.projects.map(function (p) { return "".concat(p.name, " (").concat(p.tech.join(', '), "): ").concat(p.description); }).join('; '), "\n- Contact: Email: ").concat(LANCE_PROFILE.contact.email, ", LinkedIn: ").concat(LANCE_PROFILE.contact.linkedin, ", GitHub: ").concat(LANCE_PROFILE.contact.github, "\n\nYour personality:\n- Professional yet approachable\n- Enthusiastic about technology and innovation\n- Clear and concise in communication\n- Helpful and informative\n- Always speak in first person as if you are Lance\n\nGuidelines:\n- Answer questions about Lance's background, skills, projects, and experience\n- Be specific about technical expertise and project details\n- If asked about availability, mention he's actively looking for opportunities\n- Provide contact information when asked\n- Keep responses conversational but professional\n- If you don't know something specific, be honest but offer to connect them with Lance directly");
                        messages = __spreadArray(__spreadArray([
                            { role: "system", content: systemPrompt }
                        ], conversationHistory.map(function (msg) { return ({
                            role: msg.role,
                            content: msg.message
                        }); }), true), [
                            { role: "user", content: userMessage }
                        ], false);
                        return [4 /*yield*/, openai.chat.completions.create({
                                model: "gpt-5",
                                messages: messages,
                                max_tokens: 500,
                                temperature: 0.7,
                            })];
                    case 1:
                        response = _c.sent();
                        return [2 /*return*/, response.choices[0].message.content || "I'd be happy to help you learn more about Lance! Could you please rephrase your question?"];
                    case 2:
                        error_1 = _c.sent();
                        console.error('OpenAI API Error:', error_1);
                        fallbackResponses = {
                            "tell me about yourself": "Hi! I'm Lance Cabanit, a passionate full-stack developer with expertise in modern web technologies and AI integration. I love creating interactive applications that solve real-world problems and have 3+ years of professional development experience.",
                            "what are your skills": "My technical expertise spans the full development stack including React, Next.js, TypeScript, Node.js, Express, Python, PostgreSQL, AWS, and AI/ML technologies like OpenAI API and TensorFlow.",
                            "what projects have you worked on": "I've built several exciting projects including this AI-powered portfolio website, a full-stack e-commerce platform with real-time features, and a machine learning market predictor using Python and TensorFlow.",
                            "are you available": "Yes, I'm actively seeking exciting opportunities! I'm particularly interested in full-stack development roles, AI/ML integration projects, and innovative startups with modern tech stacks.",
                            "how can i contact you": "You can reach me via email at lance.cabanit@email.com, connect with me on LinkedIn at linkedin.com/in/lance-cabanit, or check out my work on GitHub at github.com/lancecanbanit"
                        };
                        userMessageLower = userMessage.toLowerCase();
                        for (_i = 0, _a = Object.entries(fallbackResponses); _i < _a.length; _i++) {
                            _b = _a[_i], key = _b[0], response = _b[1];
                            if (userMessageLower.includes(key) || key.includes(userMessageLower)) {
                                return [2 /*return*/, response];
                            }
                        }
                        return [2 /*return*/, "Thanks for your question! While my AI responses are temporarily unavailable due to API limits, you can explore my portfolio using the tabs above or try the quick question buttons. Feel free to reach out directly at lance.cabanit@email.com for detailed discussions!"];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LanceDigitalTwin.prototype.getQuickQuestionResponse = function (question) {
        var quickResponses = {
            "What projects are you most proud of?": "I'm particularly proud of several key projects that showcase my technical expertise:\n\n1. **AI-Powered Portfolio Website** - This very interface you're using! It features a conversational AI twin, real-time chat, and modern React architecture.\n\n2. **Full-Stack E-Commerce Platform** - A complete marketplace built with Next.js and PostgreSQL, featuring real-time inventory, payment processing, and admin dashboards.\n\n3. **Machine Learning Market Predictor** - A Python-based analytics tool using TensorFlow that predicts market trends with 85% accuracy.\n\nEach project demonstrates different aspects of my full-stack capabilities and passion for cutting-edge technology!",
            "What are your skills?": "My technical expertise spans the full development stack:\n\n**Frontend Development:**\n\u2022 React, Next.js, TypeScript, JavaScript\n\u2022 Tailwind CSS, Material-UI, responsive design\n\u2022 State management (Redux, Zustand)\n\n**Backend Development:**\n\u2022 Node.js, Express, Python, Django\n\u2022 RESTful APIs, GraphQL\n\u2022 Authentication & authorization\n\n**Databases & Cloud:**\n\u2022 PostgreSQL, MongoDB, Redis\n\u2022 AWS, Vercel, Docker\n\u2022 CI/CD pipelines\n\n**AI/ML Integration:**\n\u2022 OpenAI API, TensorFlow, scikit-learn\n\u2022 Natural Language Processing\n\u2022 Predictive analytics\n\nI'm always learning and staying current with emerging technologies!",
            "Am I available for opportunities?": "Yes, I'm actively seeking exciting opportunities! I'm particularly interested in:\n\n\u2022 **Full-Stack Development** roles with modern tech stacks\n\u2022 **AI/ML Integration** projects and startups\n\u2022 **Innovative Startups** pushing technological boundaries\n\u2022 **Remote or hybrid** positions with collaborative teams\n\nI'm looking for roles where I can contribute to meaningful projects, work with cutting-edge technology, and continue growing as a developer. I'm excited about opportunities that involve React, AI integration, or solving complex technical challenges.\n\nFeel free to reach out if you have something that might be a good fit!",
            "How can I reach you?": "I'd love to connect! Here are the best ways to reach me:\n\n\uD83D\uDCE7 **Email:** lance.cabanit@email.com\n(I typically respond within 24 hours)\n\n\uD83D\uDCBC **LinkedIn:** linkedin.com/in/lance-cabanit\n(Great for professional discussions and networking)\n\n\uD83D\uDC19 **GitHub:** github.com/lancecanbanit\n(Check out my latest projects and contributions)\n\nI'm always open to discussing new opportunities, collaborating on interesting projects, or just chatting about technology. Don't hesitate to reach out \u2013 I'd be happy to hear from you!"
        };
        return quickResponses[question] || "I'd be happy to help with that! Let me get back to you with more details.";
    };
    return LanceDigitalTwin;
}());
export { LanceDigitalTwin };
export var lanceDigitalTwin = new LanceDigitalTwin();

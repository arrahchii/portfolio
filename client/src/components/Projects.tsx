import React, { useState, useEffect } from 'react';
import { QuickQuestions } from './QuickQuestions';
import { Code, Database, Globe, Filter, ExternalLink, Github, Star, Clock } from 'lucide-react';

interface Project {
  name: string;
  description: string;
  tech: string[];
  status: string;
  image?: string;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
  github?: string;
  demo?: string;
}

interface ProjectsProps {
  projects?: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects = [] }) => {
  const [profileProjects, setProfileProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  // API Base URL - Uses environment variable in production, localhost in development
  const API_BASE_URL = window.location.hostname.endsWith("onrender.com")
    ? "https://lanceport.onrender.com"
    : "http://localhost:5000";

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
        if (data.success && data.profile?.sections?.projects) {
          setProfileProjects(data.profile.sections.projects);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching portfolio data:", error);
        setLoading(false);
      });
  }, [API_BASE_URL]);

  // Function to get image path based on project name
  const getProjectImage = (projectName: string): string => {
    const imageMap: { [key: string]: string } = {
      "Real-Time Video Analytics Pipeline": "VideoAnalyticsPipeline.png",
      "Multimodal Search Engine": "Multimodal Search Engine.png",
      "Custom LLM Fine-tuning Platform": "Custom LLM Fine-tuning Platform.png",
      "Federated Learning System": "Federated Learning System.png",
      "AI-Powered Time Series Anomaly Detector": "AI-Powered Time Series Anomaly Detector.png",
      "Domain-Specific AI Assistant Framework": "Domain-Specific AI Assistant Framework.png",
      "Automated Prompt Optimization Tool": "Automated Prompt Optimization Tool.png",
      "Multi-Agent Debate System": "Multi-Agent Debate System.png",
      "Code Generation Pipeline with Self-Correction": "Code Generation Pipeline with Self-Correction .png",
      "AI Content Moderation Framework": "AI Content Moderation Framework.png",
      "Real-Time Collaborative Code Editor": "Real-Time Collaborative Code Editor.png",
      "Event-Driven Microservices Platform": "Event-Driven Microservices Platform.png",
      "Progressive Web App Social Platform": "Progressive Web App Social Platform.png",
      "Full-Stack Analytics Dashboard": "Full-Stack Analytics Dashboard.png",
      "Serverless E-commerce Platform": "Serverless E-commerce Platform.png"
    };
    const filename = imageMap[projectName];
    return filename ? `/${encodeURIComponent(filename)}` : 'https://via.placeholder.com/400x225/e5e7eb/6b7280?text=Project+Image';
  };

  // Function to get GitHub URL based on project name
  const getProjectGitHubUrl = (projectName: string): string | null => {
    const githubMap: { [key: string]: string } = {
      "Real-Time Video Analytics Pipeline": "https://github.com/lancyyboii/Real-Time-Video-Analytics-Pipeline-YOLO",
      "AI-Powered Time Series Anomaly Detector": "https://github.com/lancyyboii/AI-Powered-Time-Series-Anomaly-Detector"
    };
    return githubMap[projectName] || null;
  };

  // AI/ML/Deep Learning Engineer Projects
  const aiMlProjects: Project[] = [
    {
      name: "Real-Time Video Analytics Pipeline",
      description: "Build an end-to-end system using AWS Kinesis for video streaming, SageMaker for object detection/tracking, and Lambda for real-time alerts. Include custom YOLO or Detectron2 models for specific use cases like workplace safety monitoring or retail analytics.",
      tech: ["AWS Kinesis", "SageMaker", "Lambda", "YOLO", "Detectron2", "Python"],
      status: "active",
      category: "AI/ML",
      priority: "high",
      github: "https://github.com/lancyyboii/Real-Time-Video-Analytics-Pipeline-YOLO",
      image: getProjectImage("Real-Time Video Analytics Pipeline")
    },
    {
      name: "Multimodal Search Engine",
      description: "Create a system that can search through images, text, and audio using CLIP embeddings, vector databases (Pinecone/Weaviate), and AWS services. Implement semantic search across different media types with a unified query interface.",
      tech: ["CLIP", "Pinecone", "Weaviate", "AWS", "Python", "Vector DB"],
      status: "ongoing",
      category: "AI/ML",
      priority: "high",
      image: getProjectImage("Multimodal Search Engine")
    },
    {
      name: "Custom LLM Fine-tuning Platform",
      description: "Develop a platform for fine-tuning open-source LLMs (Llama, Mistral) on domain-specific data using AWS SageMaker, with automatic evaluation pipelines, A/B testing capabilities, and cost optimization strategies.",
      tech: ["Llama", "Mistral", "SageMaker", "Python", "A/B Testing", "MLOps"],
      status: "ongoing",
      category: "AI/ML",
      priority: "medium",
      image: getProjectImage("Custom LLM Fine-tuning Platform")
    },
    {
      name: "Federated Learning System",
      description: "Implement a privacy-preserving ML system where models train on distributed data without centralizing it. Use AWS IoT Core for edge device management and SageMaker for model aggregation and updates.",
      tech: ["AWS IoT Core", "SageMaker", "Federated Learning", "Python", "Edge Computing"],
      status: "ongoing",
      category: "AI/ML",
      priority: "medium",
      image: getProjectImage("Federated Learning System")
    },
    {
      name: "AI-Powered Time Series Anomaly Detector",
      description: "Build a system combining LSTM autoencoders, Prophet, and transformer models to detect anomalies in multivariate time series data. Deploy on AWS with real-time monitoring dashboards and automated retraining pipelines.",
      tech: ["LSTM", "Prophet", "Transformers", "AWS", "Python", "Time Series"],
      status: "active",
      category: "AI/ML",
      priority: "high",
      github: "https://github.com/lancyyboii/AI-Powered-Time-Series-Anomaly-Detector",
      image: getProjectImage("AI-Powered Time Series Anomaly Detector")
    }
  ];

  // Prompt Engineering Projects
  const promptEngineeringProjects: Project[] = [
    {
      name: "Domain-Specific AI Assistant Framework",
      description: "Create a modular system for building specialized AI assistants (legal, medical, financial) with custom prompt chains, RAG implementation, and evaluation metrics for accuracy and hallucination detection.",
      tech: ["RAG", "LangChain", "OpenAI", "Python", "Vector DB", "Prompt Engineering"],
      status: "ongoing",
      category: "Prompt Engineering",
      priority: "high",
      image: getProjectImage("Domain-Specific AI Assistant Framework")
    },
    {
      name: "Automated Prompt Optimization Tool",
      description: "Develop a system that automatically tests and refines prompts using genetic algorithms or reinforcement learning, tracking performance metrics across different LLMs and use cases.",
      tech: ["Genetic Algorithms", "RL", "LLMs", "Python", "Optimization", "MLOps"],
      status: "ongoing",
      category: "Prompt Engineering",
      priority: "medium",
      image: getProjectImage("Automated Prompt Optimization Tool")
    },
    {
      name: "Multi-Agent Debate System",
      description: "Build a platform where multiple AI agents with different personas/expertise debate topics, using advanced prompting techniques like chain-of-thought, tree-of-thought, and constitutional AI principles.",
      tech: ["Multi-Agent", "Chain-of-Thought", "Constitutional AI", "Python", "LLMs"],
      status: "ongoing",
      category: "Prompt Engineering",
      priority: "medium",
      image: getProjectImage("Multi-Agent Debate System")
    },
    {
      name: "Code Generation Pipeline with Self-Correction",
      description: "Create a sophisticated code generation system that uses iterative prompting to write, test, debug, and optimize code automatically, with built-in security scanning and performance analysis.",
      tech: ["Code Generation", "Self-Correction", "Security Scanning", "Python", "LLMs"],
      status: "ongoing",
      category: "Prompt Engineering",
      priority: "high",
      image: getProjectImage("Code Generation Pipeline with Self-Correction")
    },
    {
      name: "AI Content Moderation Framework",
      description: "Design a comprehensive prompt-based system for content moderation that handles nuanced cases, cultural contexts, and edge cases, with explainable decisions and adjustable sensitivity levels.",
      tech: ["Content Moderation", "Explainable AI", "Cultural Context", "Python", "LLMs"],
      status: "ongoing",
      category: "Prompt Engineering",
      priority: "low",
      image: getProjectImage("AI Content Moderation Framework")
    }
  ];

  // Full-Stack Developer Projects
  const fullStackProjects: Project[] = [
    {
      name: "Real-Time Collaborative Code Editor",
      description: "Build a VS Code-like editor with WebRTC for real-time collaboration, Monaco editor integration, WebSocket-based presence system, and features like live cursors, voice chat, and AI-powered code suggestions.",
      tech: ["WebRTC", "Monaco Editor", "WebSocket", "React", "Node.js", "AI Integration"],
      status: "ongoing",
      category: "Full-Stack",
      priority: "high",
      image: getProjectImage("Real-Time Collaborative Code Editor")
    },
    {
      name: "Event-Driven Microservices Platform",
      description: "Create a complete platform with Node.js/Go microservices, Apache Kafka for event streaming, GraphQL federation, distributed tracing with Jaeger, and Kubernetes deployment with custom operators.",
      tech: ["Node.js", "Go", "Kafka", "GraphQL", "Jaeger", "Kubernetes"],
      status: "ongoing",
      category: "Full-Stack",
      priority: "medium",
      image: getProjectImage("Event-Driven Microservices Platform")
    },
    {
      name: "Progressive Web App Social Platform",
      description: "Develop a social platform with offline-first architecture, IndexedDB for local storage, push notifications, WebRTC video calls, and advanced features like AR filters using WebXR APIs.",
      tech: ["PWA", "IndexedDB", "WebRTC", "WebXR", "React", "Service Workers"],
      status: "ongoing",
      category: "Full-Stack",
      priority: "medium",
      image: getProjectImage("Progressive Web App Social Platform")
    },
    {
      name: "Full-Stack Analytics Dashboard",
      description: "Build a Mixpanel/Amplitude alternative with clickstream data collection, real-time data processing pipeline, customizable visualizations with D3.js, and machine learning-powered insights for user behavior prediction.",
      tech: ["D3.js", "Real-time Processing", "ML Insights", "React", "Node.js", "Analytics"],
      status: "ongoing",
      category: "Full-Stack",
      priority: "high",
      image: getProjectImage("Full-Stack Analytics Dashboard")
    },
    {
      name: "Serverless E-commerce Platform",
      description: "Create a complete e-commerce solution using Next.js, Stripe integration, headless CMS, edge functions for personalization, Redis for caching, and implement advanced features like visual search and recommendation engines.",
      tech: ["Next.js", "Stripe", "Headless CMS", "Edge Functions", "Redis", "Visual Search"],
      status: "ongoing",
      category: "Full-Stack",
      priority: "medium",
      image: getProjectImage("Serverless E-commerce Platform")
    }
  ];

  // AI Automation Engineer Projects
  const aiAutomationProjects: Project[] = [
    {
      name: "Agentic AI Workforce Orchestrator",
      description: "Build a production-ready multi-agent system using the latest agentic frameworks: Deploy autonomous AI agents with memory, planning, and tool-use capabilities. Implement agent-to-agent collaboration with shared context and goal alignment. Use mixture-of-agents (MoA) for complex reasoning tasks. Add real-time agent supervision with human-in-the-loop intervention. Track agent decision-making with interpretability dashboards.",
      tech: ["LangGraph", "AutoGen Studio", "GPT-4o", "Claude 3.5 Sonnet", "Anthropic Computer Use API", "Mem0", "PostgreSQL", "pgvector", "FastAPI", "React", "Vercel AI SDK"],
      status: "ongoing",
      category: "AI Automation Engineer",
      priority: "high",
      image: getProjectImage("Agentic AI Workforce Orchestrator")
    },
    {
      name: "Voice-First AI Automation Studio",
      description: "Create a conversational interface for automation workflows: Real-time voice interaction using GPT-4o Realtime API or ElevenLabs. Natural language to workflow conversion with visual preview. Voice commands trigger complex multi-step automations. Proactive AI assistant that suggests optimizations and monitors execution. Multimodal inputs (voice + screen sharing + documents).",
      tech: ["OpenAI Realtime API", "Whisper v3", "WebRTC", "React", "TailwindCSS", "Deepgram", "LangGraph", "WebSocket streaming"],
      status: "ongoing",
      category: "AI Automation Engineer",
      priority: "high",
      image: getProjectImage("Voice-First AI Automation Studio")
    },
    {
      name: "Autonomous Browser Agent Platform",
      description: "Build AI agents that interact with any website like humans: Computer use agents that navigate, click, fill forms autonomously. Multi-step web workflows without traditional APIs. Visual understanding with GPT-4V/Claude 3.5 Sonnet vision. Self-healing automation that adapts to UI changes. CAPTCHA solving and anti-detection measures.",
      tech: ["Anthropic Computer Use API", "Playwright", "GPT-4V", "Browser-Use Python library", "Redis", "Temporal"],
      status: "ongoing",
      category: "AI Automation Engineer",
      priority: "high",
      image: getProjectImage("Autonomous Browser Agent Platform")
    },
    {
      name: "AI-Native Data Pipeline Automator",
      description: "Create intelligent ETL with autonomous decision-making: AI agents that discover, understand, and map data sources automatically. Self-optimizing pipelines that adapt to schema changes. Natural language queries to generate complex data transformations. Anomaly detection with automatic root cause analysis. Cost optimization across cloud providers using RL agents.",
      tech: ["Apache Iceberg", "DuckDB", "dbt", "AI agents", "Dagster", "Modal.com", "LangChain SQL agents", "Ray"],
      status: "ongoing",
      category: "AI Automation Engineer",
      priority: "medium",
      image: getProjectImage("AI-Native Data Pipeline Automator")
    },
    {
      name: "Multimodal Content Intelligence Engine",
      description: "Build a system that understands and processes all content types: Unified embedding space for text, images, audio, video, and code. Cross-modal search and generation (text→video, audio→image). Automatic content moderation with cultural/contextual understanding. Real-time content generation pipeline with brand consistency. Deepfake detection and watermarking system.",
      tech: ["CLIP", "ImageBind", "Gemini 1.5 Pro", "Sora API", "Jina AI embeddings", "Qdrant vector DB", "FFmpeg", "PyTorch"],
      status: "ongoing",
      category: "AI Automation Engineer",
      priority: "high",
      image: getProjectImage("Multimodal Content Intelligence Engine")
    },
    {
      name: "Self-Improving AI Ops Platform",
      description: "Create an AIOps system that manages itself: Autonomous incident detection, diagnosis, and remediation. AI agents that write and deploy infrastructure code. Self-healing systems with predictive maintenance. Natural language infrastructure management ('Add load balancer to prod'). Cost anomaly detection with automatic optimization.",
      tech: ["Kubernetes Operators", "Terraform", "AI code generation", "Prometheus", "Grafana", "PagerDuty", "LangChain agents", "OpenTelemetry", "AWS Bedrock"],
      status: "ongoing",
      category: "AI Automation Engineer",
      priority: "medium",
      image: getProjectImage("Self-Improving AI Ops Platform")
    },
    {
      name: "Neuro-Symbolic Reasoning Automation",
      description: "Build a hybrid AI system combining neural and symbolic AI: Knowledge graph construction from unstructured data. Logical reasoning with LLM-enhanced rule engines. Explainable AI decisions with proof trees. Complex business rule automation with natural language updates. Multi-hop reasoning for compliance and legal workflows.",
      tech: ["Neo4j", "Prolog", "Answer Set Programming", "LangChain", "DSPy", "GraphRAG", "Anthropic Claude"],
      status: "ongoing",
      category: "AI Automation Engineer",
      priority: "medium",
      image: getProjectImage("Neuro-Symbolic Reasoning Automation")
    },
    {
      name: "Personalized AI Learning & Upskilling Platform",
      description: "Create an adaptive learning automation system: AI tutors that adapt to individual learning styles in real-time. Automatic curriculum generation based on skill gaps. Code review bots that teach while reviewing. Spaced repetition system with AI-generated practice problems. Career path optimization with market trend analysis.",
      tech: ["GPT-4 fine-tuning", "Anthropic Claude", "React", "Next.js 14", "Supabase", "LangSmith", "Anki algorithm"],
      status: "ongoing",
      category: "AI Automation Engineer",
      priority: "low",
      image: getProjectImage("Personalized AI Learning & Upskilling Platform")
    },
    {
      name: "Blockchain-Integrated AI Agent Marketplace",
      description: "Build a decentralized platform for AI automation: Smart contracts for AI agent deployment and payment. Verifiable AI execution with zero-knowledge proofs. Token-gated access to premium AI models. Reputation system for AI agents based on performance. Cross-chain automation triggers (DeFi events → real-world actions).",
      tech: ["Solidity", "Hardhat", "The Graph", "IPFS", "Chainlink Functions", "OpenAI", "on-chain verification", "React", "wagmi"],
      status: "ongoing",
      category: "AI Automation Engineer",
      priority: "low",
      image: getProjectImage("Blockchain-Integrated AI Agent Marketplace")
    },
    {
      name: "Quantum-Ready ML Pipeline Optimizer",
      description: "Create a hybrid classical-quantum automation system: Quantum-inspired optimization for hyperparameter tuning. Quantum circuit generation for specific ML tasks. Classical-quantum hybrid workflows with automatic routing. Optimization problems solved using quantum annealing. Future-proof architecture for quantum advantage scenarios.",
      tech: ["PennyLane", "Qiskit", "Amazon Braket", "IBM Quantum", "TensorFlow Quantum", "Ray Tune", "FastAPI", "Kubernetes"],
      status: "ongoing",
      category: "AI Automation Engineer",
      priority: "low",
      image: getProjectImage("Quantum-Ready ML Pipeline Optimizer")
    }
  ];

  // Combine all projects
  const defaultProjects: Project[] = [
    ...aiMlProjects,
    ...promptEngineeringProjects,
    ...fullStackProjects,
    ...aiAutomationProjects
  ];

  // Use projects from props, then default projects (prioritize local projects over API)
  const allProjects = projects.length > 0 ? projects : defaultProjects;
  
  // Filter projects based on active filter
  const projectsToDisplay = activeFilter === 'all' 
    ? allProjects 
    : allProjects.filter(project => project.category === activeFilter);

  // Get unique categories for filter buttons
  const categories = ['all', ...Array.from(new Set(allProjects.map(p => p.category).filter((cat): cat is string => Boolean(cat))))];

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI/ML': return Globe;
      case 'Prompt Engineering': return Globe;
      case 'Full-Stack': return Globe;
      case 'AI Automation Engineer': return Globe;
      default: return Globe;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100/50 overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                  <p className="text-gray-900 tracking-light text-[32px] font-bold leading-tight">Loading Projects...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100/30 overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Tab Navigation - Top */}
        <div className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/90 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <QuickQuestions 
                activeTab="projects" 
                onTabChange={() => {}}
                onQuestionClick={() => {}}
                disabled={false}
                showTabs={true}
              />
            </div>
          </div>
        </div>
        
        <div className="px-4 md:px-8 lg:px-12 flex flex-1 justify-center py-8">
          <div className="layout-content-container flex flex-col max-w-[1400px] flex-1">
            {/* Enhanced Header Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl mb-6 shadow-lg">
                <svg 
                  className="w-8 h-8 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2.5} 
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-black bg-clip-text text-transparent mb-4">
                Featured Projects
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                A comprehensive portfolio showcasing expertise in AI/ML Engineering, Prompt Engineering, and Full-Stack Development with cutting-edge technologies and innovative solutions.
              </p>
              
              {/* Project Stats */}
              <div className="flex justify-center gap-8 mt-8 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{allProjects.length}</div>
                  <div className="text-sm text-gray-500">Total Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{allProjects.filter(p => p.status === 'active').length}</div>
                  <div className="text-sm text-gray-500">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700">{categories.length - 1}</div>
                  <div className="text-sm text-gray-500">Categories</div>
                </div>
              </div>
            </div>

            {/* Enhanced Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => {
                const IconComponent = getCategoryIcon(category);
                const isActive = activeFilter === category;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      isActive
                        ? 'bg-gradient-to-r from-gray-800 to-black text-white shadow-lg shadow-gray-500/25'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400 hover:shadow-md'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {category === 'all' ? 'All Projects' : category}
                    <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                      isActive ? 'bg-white/20' : 'bg-gray-100'
                    }`}>
                      {category === 'all' ? allProjects.length : allProjects.filter(p => p.category === category).length}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {/* Enhanced Projects Grid */}
            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-2">
              {projectsToDisplay.map((project, index) => (
                <div 
                  key={index} 
                  className="group relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setHoveredProject(index)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gray-500/10 hover:-translate-y-2 hover:border-gray-400/50">
                    {/* Enhanced Image Section */}
                    <div className="relative h-48 overflow-hidden">
                      <div
                        className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 bg-center bg-cover transition-transform duration-700 group-hover:scale-110"
                        style={{
                          backgroundImage: `url("${project.image || 'https://via.placeholder.com/600x300/e5e7eb/6b7280?text=Project+Image'}")`
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Enhanced Status & Priority Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${
                          project.status === 'active' 
                            ? 'bg-gray-800/90 text-white border-gray-700' 
                            : 'bg-gray-600/90 text-white border-gray-500'
                        }`}>
                          <div className="flex items-center gap-1">
                            {project.status === 'active' ? <Star className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {project.status}
                          </div>
                        </span>
                        {project.priority && (
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${getPriorityColor(project.priority)}`}>
                            {project.priority}
                          </span>
                        )}
                      </div>

                      {/* Category Icon */}
                      <div className="absolute top-4 right-4">
                        <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                          {React.createElement(getCategoryIcon(project.category || ''), { className: "w-5 h-5 text-gray-700" })}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Content Section */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                          {project.name}
                        </h3>
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      
                      {/* Enhanced Tech Stack */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.slice(0, 6).map((tech, techIndex) => (
                          <span 
                            key={techIndex} 
                            className="px-3 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-xs rounded-lg border border-gray-200 hover:border-gray-400 transition-colors duration-200"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech.length > 6 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg border border-gray-300">
                            +{project.tech.length - 6} more
                          </span>
                        )}
                      </div>
                      
                      {/* Enhanced Action Buttons */}
                      <div className="flex gap-3">
                        {(project.github || getProjectGitHubUrl(project.name)) && (
                          <a 
                            href={project.github || getProjectGitHubUrl(project.name)!} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            <Github className="w-4 h-4" />
                            View Code
                          </a>
                        )}
                        <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                          <ExternalLink className="w-4 h-4" />
                          Live Demo
                        </button>
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-gray-500/5 to-gray-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Empty State */}
            {projectsToDisplay.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filter to see more projects.</p>
                <button 
                  onClick={() => setActiveFilter('all')}
                  className="px-6 py-3 bg-gray-800 hover:bg-black text-white rounded-xl transition-colors duration-300"
                >
                  Show All Projects
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
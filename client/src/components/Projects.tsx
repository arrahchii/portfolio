import React, { useState, useEffect } from 'react';
import { QuickQuestions } from './QuickQuestions';

interface Project {
  name: string;
  description: string;
  tech: string[];
  status: string;
  image?: string;
}

interface ProjectsProps {
  projects?: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects = [] }) => {
  const [profileProjects, setProfileProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // API Base URL - Uses environment variable in production, localhost in development
  const API_BASE_URL = window.location.hostname.endsWith("onrender.com")
    ? "https://lanceport-fullstack.onrender.com"
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
      image: getProjectImage("Real-Time Video Analytics Pipeline")
    },
    {
      name: "Multimodal Search Engine",
      description: "Create a system that can search through images, text, and audio using CLIP embeddings, vector databases (Pinecone/Weaviate), and AWS services. Implement semantic search across different media types with a unified query interface.",
      tech: ["CLIP", "Pinecone", "Weaviate", "AWS", "Python", "Vector DB"],
      status: "ongoing",
      image: getProjectImage("Multimodal Search Engine")
    },
    {
      name: "Custom LLM Fine-tuning Platform",
      description: "Develop a platform for fine-tuning open-source LLMs (Llama, Mistral) on domain-specific data using AWS SageMaker, with automatic evaluation pipelines, A/B testing capabilities, and cost optimization strategies.",
      tech: ["Llama", "Mistral", "SageMaker", "Python", "A/B Testing", "MLOps"],
      status: "ongoing",
      image: getProjectImage("Custom LLM Fine-tuning Platform")
    },
    {
      name: "Federated Learning System",
      description: "Implement a privacy-preserving ML system where models train on distributed data without centralizing it. Use AWS IoT Core for edge device management and SageMaker for model aggregation and updates.",
      tech: ["AWS IoT Core", "SageMaker", "Federated Learning", "Python", "Edge Computing"],
      status: "ongoing",
      image: getProjectImage("Federated Learning System")
    },
    {
      name: "AI-Powered Time Series Anomaly Detector",
      description: "Build a system combining LSTM autoencoders, Prophet, and transformer models to detect anomalies in multivariate time series data. Deploy on AWS with real-time monitoring dashboards and automated retraining pipelines.",
      tech: ["LSTM", "Prophet", "Transformers", "AWS", "Python", "Time Series"],
      status: "active",
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
      image: getProjectImage("Domain-Specific AI Assistant Framework")
    },
    {
      name: "Automated Prompt Optimization Tool",
      description: "Develop a system that automatically tests and refines prompts using genetic algorithms or reinforcement learning, tracking performance metrics across different LLMs and use cases.",
      tech: ["Genetic Algorithms", "RL", "LLMs", "Python", "Optimization", "MLOps"],
      status: "ongoing",
      image: getProjectImage("Automated Prompt Optimization Tool")
    },
    {
      name: "Multi-Agent Debate System",
      description: "Build a platform where multiple AI agents with different personas/expertise debate topics, using advanced prompting techniques like chain-of-thought, tree-of-thought, and constitutional AI principles.",
      tech: ["Multi-Agent", "Chain-of-Thought", "Constitutional AI", "Python", "LLMs"],
      status: "ongoing",
      image: getProjectImage("Multi-Agent Debate System")
    },
    {
      name: "Code Generation Pipeline with Self-Correction",
      description: "Create a sophisticated code generation system that uses iterative prompting to write, test, debug, and optimize code automatically, with built-in security scanning and performance analysis.",
      tech: ["Code Generation", "Self-Correction", "Security Scanning", "Python", "LLMs"],
      status: "ongoing",
      image: getProjectImage("Code Generation Pipeline with Self-Correction")
    },
    {
      name: "AI Content Moderation Framework",
      description: "Design a comprehensive prompt-based system for content moderation that handles nuanced cases, cultural contexts, and edge cases, with explainable decisions and adjustable sensitivity levels.",
      tech: ["Content Moderation", "Explainable AI", "Cultural Context", "Python", "LLMs"],
      status: "ongoing",
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
      image: getProjectImage("Real-Time Collaborative Code Editor")
    },
    {
      name: "Event-Driven Microservices Platform",
      description: "Create a complete platform with Node.js/Go microservices, Apache Kafka for event streaming, GraphQL federation, distributed tracing with Jaeger, and Kubernetes deployment with custom operators.",
      tech: ["Node.js", "Go", "Kafka", "GraphQL", "Jaeger", "Kubernetes"],
      status: "ongoing",
      image: getProjectImage("Event-Driven Microservices Platform")
    },
    {
      name: "Progressive Web App Social Platform",
      description: "Develop a social platform with offline-first architecture, IndexedDB for local storage, push notifications, WebRTC video calls, and advanced features like AR filters using WebXR APIs.",
      tech: ["PWA", "IndexedDB", "WebRTC", "WebXR", "React", "Service Workers"],
      status: "ongoing",
      image: getProjectImage("Progressive Web App Social Platform")
    },
    {
      name: "Full-Stack Analytics Dashboard",
      description: "Build a Mixpanel/Amplitude alternative with clickstream data collection, real-time data processing pipeline, customizable visualizations with D3.js, and machine learning-powered insights for user behavior prediction.",
      tech: ["D3.js", "Real-time Processing", "ML Insights", "React", "Node.js", "Analytics"],
      status: "ongoing",
      image: getProjectImage("Full-Stack Analytics Dashboard")
    },
    {
      name: "Serverless E-commerce Platform",
      description: "Create a complete e-commerce solution using Next.js, Stripe integration, headless CMS, edge functions for personalization, Redis for caching, and implement advanced features like visual search and recommendation engines.",
      tech: ["Next.js", "Stripe", "Headless CMS", "Edge Functions", "Redis", "Visual Search"],
      status: "ongoing",
      image: getProjectImage("Serverless E-commerce Platform")
    }
  ];

  // Combine all projects
  const defaultProjects: Project[] = [
    ...aiMlProjects,
    ...promptEngineeringProjects,
    ...fullStackProjects
  ];

  // Use projects from props, then default projects (prioritize local projects over API)
  const projectsToDisplay = projects.length > 0 ? projects : defaultProjects;

  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
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
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Tab Navigation - Top */}
        <div className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
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
        
        <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Header Section */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-gray-900 tracking-light text-[32px] font-bold leading-tight">Featured Projects</p>
                <p className="text-gray-600 text-sm font-normal leading-normal">
                  A comprehensive portfolio showcasing expertise in AI/ML Engineering, Prompt Engineering, and Full-Stack Development with cutting-edge technologies and innovative solutions.
                </p>
              </div>
            </div>
            
            {/* Projects List */}
            {projectsToDisplay.map((project, index) => (
              <div key={index} className="p-4">
                <div className="relative flex flex-col md:flex-row gap-6 p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors duration-300 shadow-sm hover:shadow-md">
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                      project.status === 'active' 
                        ? 'bg-blue-100 text-blue-800 border-blue-200' 
                        : 'bg-green-100 text-green-800 border-green-200'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                    <p className="text-gray-900 text-base font-bold leading-tight">{project.name}</p>
                    <p className="text-gray-600 text-sm font-normal leading-normal">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <span key={techIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                          {tech}
                        </span>
                      ))}
                    </div>
                    {getProjectGitHubUrl(project.name) ? (
                      <a 
                        href={getProjectGitHubUrl(project.name)!} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-300 self-start inline-block text-center"
                      >
                        View Project
                      </a>
                    ) : (
                      <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-300 self-start">
                        View Project
                      </button>
                    )}
                  </div>
                  <div
                    className="w-full md:w-64 h-40 bg-gray-100 rounded-lg flex-shrink-0 bg-center bg-no-repeat bg-cover"
                    style={{
                      backgroundImage: `url("${project.image || 'https://via.placeholder.com/400x225/e5e7eb/6b7280?text=Project+Image'}")`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
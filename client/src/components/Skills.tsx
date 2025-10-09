import React, { useState, useEffect } from 'react';
import { QuickQuestions } from './QuickQuestions';
import { Code, TrendingUp, Users, Headphones, Settings, Video, Brain, BarChart3, MessageSquare, Users2, ShoppingCart } from 'lucide-react';

interface Skill {
  name: string;
  level: number;
  years: string;
}

interface SkillCategory {
  category: string;
  icon: React.ReactNode;
  color: string;
  skills: Skill[];
}

interface SkillsProps {
  skills?: SkillCategory[];
}

const Skills: React.FC<SkillsProps> = ({ skills = [] }) => {
  const [profileSkills, setProfileSkills] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // API Base URL - Uses environment variable in production, localhost in development
  const API_BASE_URL = window.location.hostname.endsWith("onrender.com")
    ? "https://lanceport-fullstack.onrender.com"
    : "http://localhost:5001";

  // Temporarily disable API call to fix black screen issue
  useEffect(() => {
    setLoading(false);
  }, []);

  // Professional skill data with minimal color scheme
  const defaultSkills: SkillCategory[] = [
    {
      category: "Development & Programming",
      icon: <Code className="w-5 h-5" />,
      color: "slate",
      skills: [
        { name: "Full-Stack Web Development", level: 70, years: "Professional" },
        { name: "Frontend Development (React, HTML, CSS, JavaScript)", level: 70, years: "Intermediate" },
        { name: "Backend Development (Node.js)", level: 80, years: "Advanced" },
        { name: "API Integration & Development", level: 80, years: "Advanced" },
        { name: "Database Management", level: 70, years: "Intermediate" }
      ]
    },
    {
      category: "Marketing & Content",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "slate",
      skills: [
        { name: "Social Media Marketing", level: 90, years: "Expert" },
        { name: "Content Writing & Copywriting", level: 90, years: "Expert" },
        { name: "Digital Marketing", level: 85, years: "Advanced" },
        { name: "SEO Expert", level: 90, years: "Expert" }
      ]
    },
    {
      category: "Virtual & Executive Support",
      icon: <Users className="w-5 h-5" />,
      color: "slate",
      skills: [
        { name: "Virtual Assistant Services", level: 90, years: "Expert" },
        { name: "Executive Assistant Support", level: 90, years: "Expert" },
        { name: "Administrative Management", level: 80, years: "Advanced" },
        { name: "Calendar & Task Management", level: 90, years: "Expert" }
      ]
    },
    {
      category: "Technical & Tools",
      icon: <Headphones className="w-5 h-5" />,
      color: "slate",
      skills: [
        { name: "Computer Hardware", level: 80, years: "Advanced" },
        { name: "Technical Support", level: 85, years: "Advanced" },
        { name: "Basic Electronics & Troubleshooting", level: 80, years: "Advanced" },
        { name: "Video Editing", level: 80, years: "Advanced" }
      ]
    },
    {
      category: "Software & Platforms",
      icon: <Settings className="w-5 h-5" />,
      color: "slate",
      skills: [
        { name: "Microsoft Office", level: 90, years: "Expert" },
        { name: "GHL", level: 90, years: "Expert" },
        { name: "NOTION", level: 90, years: "Expert" },
        { name: "ZAPIER", level: 90, years: "Expert" },
        { name: "N8N", level: 90, years: "Expert" },
        { name: "KAJABI", level: 90, years: "Expert" }
      ]
    },
    {
      category: "Creative & Media Production",
      icon: <Video className="w-5 h-5" />,
      color: "slate",
      skills: [
        { name: "Video Editing & Post-Production", level: 80, years: "Advanced" },
        { name: "Content Creation", level: 80, years: "Advanced" }
      ]
    },
    {
      category: "Business Skills",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "slate",
      skills: [
        { name: "Market Research", level: 85, years: "Advanced" }
      ]
    },
    {
      category: "E-commerce & Sales",
      icon: <ShoppingCart className="w-5 h-5" />,
      color: "slate",
      skills: [
        { name: "E-commerce Platform Management", level: 80, years: "3+ years" },
        { name: "Sales Funnel Optimization", level: 85, years: "4+ years" },
        { name: "Customer Relationship Management (CRM)", level: 90, years: "5+ years" },
        { name: "Lead Generation & Nurturing", level: 85, years: "4+ years" },
        { name: "Conversion Rate Optimization", level: 80, years: "3+ years" }
      ]
    }
  ];

  // Use skills from props, then default skills (prioritize our updated skills)
  const skillsToDisplay = skills.length > 0 ? skills : defaultSkills;

  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-gray-50 overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                  <p className="text-slate-900 tracking-light text-[32px] font-bold leading-tight">Loading Skills...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-gray-50 overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Tab Navigation - Top */}
        <div className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <QuickQuestions 
                activeTab="skills" 
                onTabChange={() => {}}
                onQuestionClick={() => {}}
                disabled={false}
                showTabs={true}
              />
            </div>
          </div>
        </div>
        
        <div className="flex">
          {/* Left Content Area */}
          <div className="flex-1 px-4 md:px-8 lg:px-12 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Header Section */}
              <div className="mb-12">
                <h1 className="text-3xl md:text-4xl font-light text-slate-900 mb-4">Skills & Expertise</h1>
                <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
                  Professional competencies developed through hands-on experience and continuous learning.
                </p>
              </div>
              
              {/* Skills Categories */}
              <div className="space-y-8">
                {skillsToDisplay.map((skillGroup, index) => (
                  <div key={index} className="group">
                    {/* Category Header */}
                    <div className="flex items-center mb-6">
                      <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg mr-4">
                        <div className="text-slate-600">
                          {skillGroup.icon}
                        </div>
                      </div>
                      <div>
                        <h2 className="text-xl font-medium text-slate-900">{skillGroup.category}</h2>
                        <div className="w-12 h-0.5 bg-slate-300 mt-1"></div>
                      </div>
                    </div>

                    {/* Skills Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {skillGroup.skills.map((skill, skillIndex) => {
                        const getSkillLevel = (level: number) => {
                          if (level >= 90) return { label: 'Expert', color: 'text-slate-700' };
                          if (level >= 80) return { label: 'Advanced', color: 'text-slate-600' };
                          if (level >= 70) return { label: 'Intermediate', color: 'text-slate-500' };
                          return { label: 'Beginner', color: 'text-slate-400' };
                        };
                        
                        const skillLevel = getSkillLevel(skill.level);
                        
                        return (
                          <div key={skillIndex} className="group/skill">
                            <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg p-5 hover:bg-white/80 hover:border-gray-300/50 transition-all duration-300">
                              <div className="flex justify-between items-start mb-3">
                                <h3 className="font-medium text-slate-900 text-sm leading-tight pr-2">{skill.name}</h3>
                                <span className={`text-xs font-medium ${skillLevel.color} whitespace-nowrap`}>
                                  {skillLevel.label}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">{skill.years}</span>
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        i < Math.floor(skill.level / 20) 
                                          ? 'bg-slate-400' 
                                          : 'bg-slate-200'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Transparent Sidebar */}
          <div className="hidden lg:block w-80 relative">
            <div className="fixed top-0 right-0 w-80 h-full bg-white/30 backdrop-blur-md border-l border-gray-200/30">
              <div className="p-8 pt-24">
                {/* Professional Summary */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-slate-100/80 rounded-lg flex items-center justify-center mr-3">
                      <Brain className="w-4 h-4 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">Overview</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Comprehensive skill set spanning development, marketing, and business operations with a focus on delivering professional results.
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="space-y-6">
                  <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-gray-200/30">
                    <div className="text-center">
                      <div className="text-2xl font-light text-slate-900 mb-1">30+</div>
                      <div className="text-xs text-slate-600 uppercase tracking-wide">Technologies</div>
                    </div>
                  </div>
                  
                  <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-gray-200/30">
                    <div className="text-center">
                      <div className="text-2xl font-light text-slate-900 mb-1">3+</div>
                      <div className="text-xs text-slate-600 uppercase tracking-wide">Years Experience</div>
                    </div>
                  </div>
                  
                  <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-gray-200/30">
                    <div className="text-center">
                      <div className="text-2xl font-light text-slate-900 mb-1">20+</div>
                      <div className="text-xs text-slate-600 uppercase tracking-wide">Projects</div>
                    </div>
                  </div>
                  
                  <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-gray-200/30">
                    <div className="text-center">
                      <div className="text-2xl font-light text-slate-900 mb-1">∞</div>
                      <div className="text-xs text-slate-600 uppercase tracking-wide">Learning</div>
                    </div>
                  </div>
                </div>

                {/* Professional Note */}
                <div className="mt-8 p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-gray-200/20">
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "Committed to continuous improvement and staying current with industry best practices and emerging technologies."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
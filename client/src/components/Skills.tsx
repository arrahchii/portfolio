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
    : "http://localhost:5000";

  // Temporarily disable API call to fix black screen issue
  useEffect(() => {
    setLoading(false);
  }, []);

  // Enhanced skill data with comprehensive proficiency levels and icons (fallback)
  const defaultSkills: SkillCategory[] = [
    {
      category: "Development & Programming",
      icon: <Code className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      skills: [
        { name: "Full-Stack Web Development", level: 70, years: "Professional" },
        { name: "Frontend Development (React, HTML, CSS, JavaScript)", level: 90, years: "Expert" },
        { name: "Backend Development (Node.js)", level: 80, years: "Advanced" },
        { name: "API Integration & Development", level: 60, years: "Intermediate" },
        { name: "Database Management", level: 50, years: "Beginner" }
      ]
    },
    {
      category: "Marketing & Content",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      skills: [
        { name: "Social Media Marketing", level: 90, years: "Expert" },
        { name: "Content Writing & Copywriting", level: 90, years: "Expert" },
        { name: "Digital Marketing", level: 85, years: "Advanced" },
        { name: "SEO Expert", level: 90, years: "Expert" }
      ]
    },
    {
      category: "Virtual & Executive Support",
      icon: <Users className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      skills: [
        { name: "Virtual Assistant Services", level: 90, years: "Expert" },
        { name: "Executive Assistant Support", level: 90, years: "Expert" },
        { name: "Administrative Management", level: 80, years: "Advanced" },
        { name: "Calendar & Task Management", level: 90, years: "Expert" }
      ]
    },
    {
      category: "Technical & Tools",
      icon: <Headphones className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      skills: [
        { name: "Computer Hardware", level: 80, years: "Advanced" },
        { name: "Technical Support", level: 85, years: "Advanced" },
        { name: "Basic Electronics & Troubleshooting", level: 80, years: "Advanced" },
        { name: "Video Editing", level: 80, years: "Advanced" }
      ]
    },
    {
      category: "Software & Platforms",
      icon: <Settings className="w-6 h-6" />,
      color: "from-indigo-500 to-purple-500",
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
      icon: <Video className="w-6 h-6" />,
      color: "from-pink-500 to-rose-500",
      skills: [
        { name: "Video Editing & Post-Production", level: 80, years: "Advanced" },
        { name: "Content Creation", level: 80, years: "Advanced" }
      ]
    },
    {
      category: "Business Skills",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "from-teal-500 to-cyan-500",
      skills: [
        { name: "Market Research", level: 85, years: "Advanced" }
      ]
    },



     {
       category: "E-commerce & Sales",
       icon: <ShoppingCart className="w-6 h-6" />,
       color: "from-amber-500 to-orange-600",
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
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                  <p className="text-gray-900 tracking-light text-[32px] font-bold leading-tight">Loading Skills...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Tab Navigation - Top */}
        <div className="sticky top-0 z-50 border-b border-gray-200 bg-white">
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
        
        <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Header Section */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-gray-900 tracking-light text-[32px] font-bold leading-tight">Skills & Expertise</p>
                <p className="text-gray-600 text-sm font-normal leading-normal">
                  A comprehensive overview of technical proficiencies, accumulated through years of hands-on experience and continuous learning in cutting-edge technologies.
                </p>
              </div>
            </div>
            
            {/* Skills Categories */}
            {skillsToDisplay.map((skillGroup, index) => (
              <div key={index} className="p-4">
                <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors duration-300 shadow-sm hover:shadow-md">
                  {/* Category Header */}
                  <div className="flex items-center p-6 border-b border-gray-100">
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${skillGroup.color} rounded-xl shadow-lg mr-4 text-white`}>
                      {skillGroup.icon}
                    </div>
                    <div>
                      <h3 className="text-gray-900 text-xl font-bold leading-tight">{skillGroup.category}</h3>
                      <div className={`w-16 h-1 bg-gradient-to-r ${skillGroup.color} rounded-full mt-1`}></div>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="p-6">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {skillGroup.skills.map((skill, skillIndex) => {
                        const getSkillLevel = (level: number) => {
                          if (level >= 90) return { label: 'Expert', color: 'bg-green-100 text-green-800 border-green-200' };
                          if (level >= 80) return { label: 'Advanced', color: 'bg-blue-100 text-blue-800 border-blue-200' };
                          if (level >= 70) return { label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
                          return { label: 'Beginner', color: 'bg-gray-100 text-gray-800 border-gray-200' };
                        };
                        
                        const skillLevel = getSkillLevel(skill.level);
                        
                        return (
                          <div key={skillIndex} className="group/skill relative">
                            {/* Enhanced Skill Card */}
                            <div className="relative bg-white border-2 border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                              {/* Background Gradient */}
                              <div className={`absolute inset-0 bg-gradient-to-br ${skillGroup.color} opacity-0 group-hover/skill:opacity-5 transition-opacity duration-300 rounded-xl`}></div>
                              
                              {/* Skill Header */}
                              <div className="relative z-10 mb-4">
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className="font-bold text-gray-900 text-sm leading-tight pr-2">{skill.name}</h4>
                                  <div className="flex flex-col items-end">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${skillLevel.color} mb-1`}>
                                      {skillLevel.label}
                                    </span>
                                    <time className="text-xs font-medium text-gray-500">{skill.years}</time>
                                  </div>
                                </div>
                                
                                {/* Enhanced Proficiency Display */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <label className="text-xs font-medium text-gray-600">Proficiency</label>
                                    <data className="text-sm font-bold text-gray-900" value={skill.level}>{skill.level}%</data>
                                  </div>
                                  
                                  {/* Enhanced Progress Bar */}
                                  <div className="relative">
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                                      <div 
                                        className={`h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out transform origin-left shadow-sm`}
                                        style={{ width: `${skill.level}%` }}
                                      ></div>
                                    </div>
                                    {/* Progress indicator */}
                                    <div 
                                      className={`absolute top-0 h-3 w-1 bg-white rounded-full shadow-md transition-all duration-1000 ease-out`}
                                      style={{ left: `calc(${skill.level}% - 2px)` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                              
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Skills Summary */}
            <div className="p-4">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl shadow-lg mb-4">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-gray-900 text-xl font-bold leading-tight mb-4">
                    Continuous Learning & Growth
                  </h3>
                  <p className="text-gray-600 text-sm font-normal leading-normal mb-6 max-w-3xl mx-auto">
                    With over 3 years of experience in software development, I'm committed to staying at the forefront of technology. 
                    I regularly update my skills through hands-on projects, online courses, and contributing to open-source initiatives.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">30</div>
                      <div className="text-xs text-gray-600">Technologies</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">3</div>
                      <div className="text-xs text-gray-600">Years Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">20+</div>
                      <div className="text-xs text-gray-600">Projects Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">24/7</div>
                      <div className="text-xs text-gray-600">Learning Mode</div>
                    </div>
                  </div>
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
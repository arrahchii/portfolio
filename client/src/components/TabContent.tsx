import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { 
  Download, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Mail, 
  Code,
  Database,
  Cloud,
  Brain,
  Palette,
  Send,
  CheckCircle,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Monitor,
  Server,
  Users,
  Headphones,
  Settings,
  Video,
  TrendingUp,
  Facebook,
  Instagram,
  MessageSquare,
  Users2,
  BarChart3,
  ShoppingCart
} from 'lucide-react';
import type { TabType } from './TabNavigation';
import Certificates from './Certificates';

interface ProfileData {
  name: string;
  title: string;
  availability: string;
  avatar: string;
  sections: {
    me: {
      bio: string;
      experience: string;
      passion: string;
    };
    skills: Array<{
      category: string;
      items: string[];
    }>;
    projects: Array<{
      name: string;
      description: string;
      tech: string[];
      status: string;
    }>;
    contact: {
      email: string;
      linkedin: string;
      github: string;
      facebook: string;
      instagram: string;
      location: string;
    };
  };
}

interface TabContentProps {
  activeTab: TabType;
  profile: ProfileData;
}

export default function TabContent({ activeTab, profile }: TabContentProps) {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // Refined professional design system
  const designSystem = {
    // Typography
    heading: {
      h1: "text-4xl font-bold text-gray-900 tracking-tight",
      h2: "text-3xl font-bold text-gray-900 tracking-tight",
      h3: "text-2xl font-semibold text-gray-900 tracking-tight",
      h4: "text-xl font-semibold text-gray-900",
      subtitle: "text-lg text-gray-600 leading-relaxed font-medium",
      body: "text-gray-700 leading-relaxed",
      caption: "text-sm text-gray-500 font-medium"
    },
    // Cards and containers
    card: {
      base: "bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-200",
      hover: "hover:shadow-md hover:border-gray-300",
      interactive: "group cursor-pointer",
      padding: "p-8"
    },
    // Buttons and interactive elements
    button: {
      primary: "inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md",
      secondary: "inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200",
      icon: "w-12 h-12 bg-gray-100 rounded-lg shadow-sm text-gray-700 group-hover:bg-gray-200 transition-all duration-200"
    },
    // Spacing and layout
    spacing: {
      section: "space-y-12",
      subsection: "space-y-8",
      content: "space-y-6",
      items: "space-y-4",
      small: "space-y-3"
    },
    // Colors and backgrounds
    colors: {
      backgrounds: {
        light: "bg-gray-50",
        card: "bg-white",
        accent: "bg-gray-50"
      }
    },
    // Grid layouts
    grid: {
      responsive2: "grid md:grid-cols-2 gap-8",
      responsive3: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
      responsive4: "grid md:grid-cols-2 lg:grid-cols-4 gap-6"
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Start submitting
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Thank you! Your message has been sent successfully.'
        });
        
        // Reset form on success
        setContactForm({ name: '', email: '', message: '' });
      } else {
        throw new Error(result.message || 'Failed to send message');
      }

    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (activeTab === 'me') {
    return (
      <div className="space-y-6" data-testid="content-me">
        <Card className="bg-transparent border-transparent shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Avatar className="w-16 h-16">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>LC</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                <p className="text-lg text-gray-200">{profile.title}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">About Me</h3>
              <div className="text-gray-200 space-y-4">
                {profile.sections.me.bio.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Experience</h3>
              <p className="text-gray-200">{profile.sections.me.experience}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">What Drives Me</h3>
              <p className="text-gray-200">{profile.sections.me.passion}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'projects') {
    return (
      <div className="space-y-8" data-testid="content-projects">
        {/* Mobile-Enhanced Header Section */}
        <div className="text-center space-y-4 px-4">
          {/* Professional Mobile Icon Container */}
          <div className="relative inline-flex items-center justify-center">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 via-blue-600 to-purple-600 rounded-3xl shadow-xl mb-4 relative flex items-center justify-center">
              {/* Updated natural icon design - force refresh */}
              <svg 
                className="w-7 h-7 md:w-8 md:h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2.5} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              {/* Mobile-Specific Accent Ring */}
              <div className="md:hidden absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl opacity-30 animate-pulse"></div>
            </div>
          </div>
          
          {/* Mobile-Optimized Typography */}
          <div className="space-y-3">
            <h2 className="text-2xl leading-tight md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <p className="text-sm leading-relaxed md:text-lg text-gray-700 max-w-2xl mx-auto px-2">
              <span className="md:hidden">Innovative solutions showcasing technical excellence</span>
              <span className="hidden md:inline">A showcase of innovative solutions and technical excellence, demonstrating expertise across full-stack development and modern technologies.</span>
            </p>
          </div>
          
          {/* Mobile-Only Professional Divider */}
          <div className="md:hidden flex items-center justify-center pt-2">
            <div className="w-16 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>

        {/* Mobile-Enhanced Project Grid */}
        <div className="grid gap-5 md:gap-8 lg:grid-cols-2 px-3 md:px-4">
          {profile.sections.projects.map((project, index) => (
            <div key={index} className="group relative">
              {/* Professional Mobile-First Project Card */}
              <div className="relative bg-white border border-gray-200 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 md:hover:-translate-y-2 overflow-hidden">
                
                {/* Mobile-Optimized Status Badge */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
                  <div className={`inline-flex items-center px-2 py-1 md:px-2 md:py-1 rounded-xl md:rounded-full text-xs font-medium shadow-lg ${
                    project.status === 'Live' 
                      ? 'bg-green-500 text-white border border-green-300' 
                      : 'bg-orange-500 text-white border border-orange-300'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      project.status === 'Live' ? 'bg-green-200 animate-pulse' : 'bg-orange-200 animate-pulse'
                    }`}></div>
                    {project.status}
                  </div>
                </div>
                
                {/* Mobile-Specific Corner Accent */}
                <div className="md:hidden absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-br-3xl"></div>

                {/* Enhanced Mobile Card Content */}
                <div className="relative p-5 md:p-8">
                  {/* Mobile-Optimized Project Header */}
                  <div className="mb-5 md:mb-6">
                    <h3 className="text-xl leading-tight md:text-2xl font-bold text-gray-900 mb-3 md:mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {project.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                      {project.description}
                    </p>
                  </div>

                  {/* Enhanced Mobile Technology Stack */}
                  <div className="mb-6 md:mb-8">
                    <div className="flex items-center gap-2 mb-3 md:mb-3">
                      <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full md:hidden"></div>
                      <h4 className="text-sm md:text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Tech Stack
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="inline-flex items-center px-3 md:px-3 py-2 md:py-1.5 bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/80 text-blue-700 text-xs md:text-sm font-semibold rounded-xl md:rounded-lg border border-blue-200/60 hover:from-blue-100/80 hover:to-indigo-100/80 hover:border-blue-300/60 transition-all duration-300 cursor-default shadow-sm backdrop-blur-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Mobile Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-3">
                    <button className="flex-1 inline-flex items-center justify-center px-5 md:px-6 py-3.5 md:py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white font-bold rounded-2xl md:rounded-xl hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-2xl group/btn border border-blue-500/20">
                      <ExternalLink className="w-4 h-4 md:w-4 md:h-4 mr-2 md:mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                      <span className="text-sm md:text-base tracking-wide">Live Demo</span>
                      {/* Mobile-Specific Button Accent */}
                      <div className="md:hidden absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-300 rounded-full opacity-60"></div>
                    </button>
                    <button className="flex-1 inline-flex items-center justify-center px-5 md:px-6 py-3.5 md:py-3 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white font-bold rounded-2xl md:rounded-xl hover:from-gray-900 hover:via-black hover:to-gray-900 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-2xl group/btn border border-gray-700/30">
                      <Github className="w-4 h-4 md:w-4 md:h-4 mr-2 md:mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                      <span className="text-sm md:text-base tracking-wide">Source Code</span>
                      {/* Mobile-Specific Button Accent */}
                      <div className="md:hidden absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full opacity-60"></div>
                    </button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border border-blue-200/50">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Interested in Collaboration?
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Let's discuss how we can bring your next project to life with cutting-edge technology and innovative solutions.
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <Mail className="w-5 h-5 mr-2" />
            Start a Conversation
          </button>
        </div>
      </div>
    );
  }

  if (activeTab === 'skills') {
    // Enhanced skill data with proficiency levels and icons
    const enhancedSkills = [
      {
        category: "Development & Programming",
        icon: <Code className="w-6 h-6" />,
        color: "from-blue-500 to-cyan-500",
        skills: [
          { name: "Full-Stack Web Development", level: 70, years: "3+ years" },
          { name: "Frontend Development (React, HTML, CSS, JavaScript)", level: 70, years: "3+ years" },
          { name: "Backend Development (Node.js)", level: 80, years: "3+ years" },
          { name: "API Integration & Development", level: 80, years: "3+ years" },
          { name: "Database Management", level: 70, years: "3+ years" }
        ]
      },
      {
        category: "Marketing & Content",
        icon: <TrendingUp className="w-6 h-6" />,
        color: "from-green-500 to-emerald-500",
        skills: [
          { name: "Social Media Marketing", level: 90, years: "5+ years" },
          { name: "Content Writing & Copywriting", level: 90, years: "5+ years" },
          { name: "Digital Marketing", level: 85, years: "4+ years" },
          { name: "SEO Expert", level: 90, years: "5+ years" }
        ]
      },
      {
        category: "Virtual & Executive Support",
        icon: <Users className="w-6 h-6" />,
        color: "from-purple-500 to-pink-500",
        skills: [
          { name: "Virtual Assistant Services", level: 90, years: "5+ years" },
          { name: "Executive Assistant Support", level: 90, years: "4+ years" },
          { name: "Administrative Management", level: 80, years: "5+ years" },
          { name: "Calendar & Task Management", level: 90, years: "5+ years" }
        ]
      },
      {
        category: "Technical & Tools",
        icon: <Headphones className="w-6 h-6" />,
        color: "from-orange-500 to-red-500",
        skills: [
          { name: "Computer Hardware", level: 80, years: "4+ years" },
          { name: "Technical Support", level: 85, years: "4+ years" },
          { name: "Basic Electronics & Troubleshooting", level: 80, years: "3+ years" },
          { name: "Video Editing", level: 80, years: "3+ years" }
        ]
      },
      {
        category: "Software & Platforms",
        icon: <Settings className="w-6 h-6" />,
        color: "from-indigo-500 to-purple-500",
        skills: [
          { name: "Microsoft Office", level: 90, years: "8+ years" },
          { name: "GHL", level: 90, years: "2+ years" },
          { name: "NOTION", level: 90, years: "3+ years" },
          { name: "ZAPIER", level: 90, years: "2+ years" },
          { name: "N8N", level: 90, years: "1+ years" },
          { name: "KAJABI", level: 90, years: "2+ years" }
        ]
      },
      {
        category: "Creative & Media Production",
        icon: <Video className="w-6 h-6" />,
        color: "from-pink-500 to-rose-500",
        skills: [
          { name: "Video Editing & Post-Production", level: 80, years: "3+ years" },
          { name: "Content Creation", level: 80, years: "4+ years" }
        ]
      },
      {
        category: "Business Skills",
        icon: <TrendingUp className="w-6 h-6" />,
        color: "from-teal-500 to-cyan-500",
        skills: [
          { name: "Market Research", level: 85, years: "4+ years" }
        ]
      },
      {
        category: "Communication & Languages",
        icon: <MessageSquare className="w-6 h-6" />,
        color: "from-cyan-500 to-teal-600",
        skills: [
          { name: "English (Native/Fluent)", level: 95, years: "Lifetime" },
          { name: "Client Communication & Relations", level: 90, years: "5+ years" },
          { name: "Technical Documentation", level: 85, years: "4+ years" },
          { name: "Presentation & Public Speaking", level: 80, years: "3+ years" },
          { name: "Cross-Cultural Communication", level: 75, years: "4+ years" }
        ]
      },
      {
        category: "Project Management & Leadership",
        icon: <Users2 className="w-6 h-6" />,
        color: "from-violet-500 to-purple-600",
        skills: [
          { name: "Agile Project Management", level: 80, years: "3+ years" },
          { name: "Team Leadership & Coordination", level: 85, years: "4+ years" },
          { name: "Resource Planning & Allocation", level: 75, years: "3+ years" },
          { name: "Risk Assessment & Mitigation", level: 70, years: "2+ years" },
          { name: "Stakeholder Management", level: 80, years: "4+ years" }
        ]
      },
      {
        category: "Data & Analytics",
        icon: <BarChart3 className="w-6 h-6" />,
        color: "from-emerald-500 to-green-600",
        skills: [
          { name: "Google Analytics & Tag Manager", level: 85, years: "3+ years" },
          { name: "Performance Metrics & KPI Tracking", level: 80, years: "4+ years" },
          { name: "A/B Testing & Conversion Optimization", level: 75, years: "2+ years" },
          { name: "Data Visualization & Reporting", level: 70, years: "2+ years" },
          { name: "Customer Journey Analysis", level: 75, years: "3+ years" }
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

    return (
      <div className="space-y-8" data-testid="content-skills">
        {/* Enhanced Header Section */}
        <div className="text-center space-y-4 px-4">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl shadow-lg mb-4">
            <Brain className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-blue-800 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            A comprehensive overview of technical proficiencies, accumulated through years of hands-on experience and continuous learning in cutting-edge technologies.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid gap-6 md:gap-8 px-4">
          {enhancedSkills.map((skillGroup, index) => (
            <div key={index} className="group">
              {/* Category Header */}
              <div className="flex items-center mb-4 md:mb-6">
                <div className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${skillGroup.color} rounded-xl shadow-lg mr-3 md:mr-4 text-white`}>
                  {skillGroup.icon}
                </div>
                <div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-900">{skillGroup.category}</h3>
                  <div className={`w-12 md:w-16 h-1 bg-gradient-to-r ${skillGroup.color} rounded-full mt-1`}></div>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {skillGroup.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="group/skill relative">
                    {/* Skill Card */}
                    <div className="relative bg-white border border-gray-200/60 rounded-2xl p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${skillGroup.color} opacity-0 group-hover/skill:opacity-5 transition-opacity duration-300`}></div>
                      
                      {/* Skill Header */}
                      <div className="relative z-10 mb-3 md:mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm md:text-lg leading-tight">{skill.name}</h4>
                          <span className="text-xs md:text-sm font-medium text-gray-500 ml-2 flex-shrink-0">{skill.years}</span>
                        </div>
                        
                        {/* Proficiency Level */}
                        <div className="flex items-center justify-between mb-2 md:mb-3">
                          <label className="text-xs md:text-sm text-gray-600">Proficiency</label>
                          <data className="text-xs md:text-sm font-bold text-gray-900" value={skill.level}>{skill.level}%</data>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="relative">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${skillGroup.color} rounded-full transition-all duration-1000 ease-out transform origin-left`}
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                          
                          {/* Animated Glow Effect */}
                          <div 
                            className={`absolute top-0 h-full bg-gradient-to-r ${skillGroup.color} rounded-full opacity-0 group-hover/skill:opacity-30 transition-opacity duration-300 blur-sm`}
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Skill Level Badge */}
                      <div className="relative z-10">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          skill.level >= 90 ? 'bg-green-100 text-green-800' :
                          skill.level >= 80 ? 'bg-blue-100 text-blue-800' :
                          skill.level >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {skill.level >= 90 ? 'Expert' :
                           skill.level >= 80 ? 'Advanced' :
                           skill.level >= 70 ? 'Intermediate' :
                           'Beginner'}
                        </span>
                      </div>
                      
                      {/* Decorative Corner */}
                      <div className={`absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br ${skillGroup.color} opacity-10 rounded-full blur-xl group-hover/skill:scale-150 transition-transform duration-500`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Skills Summary */}
        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Continuous Learning & Growth
            </h3>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
              With over 3 years of experience in software development, I'm committed to staying at the forefront of technology. 
              I regularly update my skills through hands-on projects, online courses, and contributing to open-source initiatives.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">30</div>
                <div className="text-sm text-gray-600">Technologies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">3</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">20+</div>
                <div className="text-sm text-gray-600">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Learning Mode</div>
              </div>
            </div>

             {/* Location & Meeting Options */}
             <div className="bg-white border border-gray-200/60 rounded-3xl p-8 shadow-lg">
               <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                 <MapPin className="w-5 h-5 mr-3 text-purple-600" />
                 Meeting Options
               </h3>
               <div className="space-y-4">
                 <div className="flex items-start space-x-3">
                   <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                     <Calendar className="w-4 h-4 text-blue-600" />
                   </div>
                   <div>
                     <p className="font-semibold text-gray-900">Video Calls</p>
                     <p className="text-gray-600 text-sm">Zoom, Google Meet, or Microsoft Teams</p>
                   </div>
                 </div>
                 <div className="flex items-start space-x-3">
                   <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                     <Calendar className="w-4 h-4 text-green-600" />
                   </div>
                   <div>
                     <p className="font-semibold text-gray-900">Phone Calls</p>
                     <p className="text-gray-600 text-sm">Available for urgent discussions</p>
                   </div>
                 </div>
                 <div className="flex items-start space-x-3">
                   <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                     <MapPin className="w-4 h-4 text-purple-600" />
                   </div>
                   <div>
                     <p className="font-semibold text-gray-900">In-Person (SF Bay Area)</p>
                     <p className="text-gray-600 text-sm">For local clients and major projects</p>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     );
   }

  if (activeTab === 'resume') {
    const experiences = [
      {
        title: "Frontend Developer",
        company: "SmartBuild Solutions",
        period: "08/2025 - 08/2025",
        location: "Remote",
        type: "Remote",
        achievements: [
          "Utilized HTML, CSS, and JavaScript to create visually appealing and responsive web pages that met client requirements",
          "Coded using HTML, CSS, and JavaScript to develop features for both mobile and desktop platforms",
          "Produced websites compatible with multiple browsers",
          "Worked closely with UX/UI designers to translate their designs into functional web applications"
        ],
        technologies: ["HTML", "CSS", "JavaScript"]
      },
      {
        title: "Copywriter",
        company: "BrandVoice Media",
        period: "01/2025 - 04/2025",
        location: "Remote",
        type: "Remote",
        achievements: [
          "Reviewed and edited final copy for accuracy and to correct grammar errors",
          "Boosted campaign performance by developing engaging and persuasive copy for print, digital, and social media platforms",
          "Customized brand message to reach and capture target audience interest and drive engagement",
          "Formatted copy to align with project-specific guidelines"
        ],
        technologies: ["Content Writing", "Copywriting", "Social Media Marketing"]
      },
      {
        title: "Backend Engineer",
        company: "Algoworks",
        period: "09/2024 - 12/2024",
        location: "Remote",
        type: "Remote",
        achievements: [
          "Developed and maintained RESTful APIs using Node.js and Express.js to support frontend applications",
          "Designed and optimized database schemas and queries for improved performance and scalability",
          "Implemented authentication and authorization systems with JWT tokens and role-based access control",
          "Built microservices architecture and integrated third-party APIs for enhanced functionality"
        ],
        technologies: ["Node.js", "Express.js", "MongoDB", "PostgreSQL", "REST APIs", "JWT Authentication"]
      },
      {
        title: "Tech Head & Team Supervisor",
        company: "C&C Company",
        period: "2020 - 2024",
        location: "Philippines",
        type: "Full-time",
        achievements: [
          "Led 10-15 agents in cold calling campaigns for tech solutions and web development services",
          "Built scalable internal systems to support multiple campaign operations and client management",
          "Optimized workflows with tech solutions to improve campaign efficiency and lead conversion rates",
          "Supervised technical aspects of campaigns while ensuring team performance and service quality"
        ],
        technologies: ["Team Leadership", "Cold Calling Campaigns", "Tech Solutions", "Web Development", "Campaign Management", "Lead Generation"]
      } // Updated resume entry
    ];

    const education = [
      {
        degree: "Computer Engineer",
        school: "Holy Trinity College - Currently 3rd year College",
        period: "01/2025",
        gpa: "",
        honors: "",
        relevant: ["Computer Engineering", "Programming", "Software Development", "System Design"]
      },
      {
        degree: "Senior High School: Science, Technology, Engineering, and Mathematics",
        school: "Gensantos Foundation College Inc",
        period: "01/2022",
        gpa: "",
        honors: "",
        relevant: ["STEM", "Mathematics", "Science", "Technology"]
      }
    ];

    const languages = [
      { name: "English", proficiency: "Native", level: 100 },
      { name: "Filipino", proficiency: "Native", level: 100 }
    ];

    return (
      <div className="space-y-8" data-testid="content-resume">
        {/* Enhanced Header with Download */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
             <GraduationCap className="w-8 h-8 text-white" />
           </div>
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-4">
              Professional Resume
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed mb-6">
              A comprehensive overview of my professional journey, technical expertise, and achievements in full-stack development and UI/UX design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/CABANITLANCERESUME.pdf"
                download="CABANITLANCERESUME.pdf"
                className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF Resume
              </a>
              <button className="inline-flex items-center px-8 py-4 bg-white border-2 border-indigo-200 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300">
                <Mail className="w-5 h-5 mr-2" />
                Request References
              </button>
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg mr-3 flex items-center justify-center">
               <Briefcase className="w-4 h-4 text-white" />
             </div>
            Professional Summary
          </h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            {profile.sections.me.bio} With {profile.sections.me.experience}, I specialize in creating 
            innovative solutions that bridge the gap between cutting-edge technology and real-world applications. 
            Passionate about mentoring teams, implementing best practices, and driving technical innovation in fast-paced environments.
          </p>
        </div>

        {/* Work Experience Timeline */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-lg mr-3 flex items-center justify-center">
               <Briefcase className="w-4 h-4 text-white" />
             </div>
            Work Experience
          </h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500"></div>
            
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div key={index} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full border-4 border-white shadow-lg"></div>
                  
                  {/* Experience Card */}
                  <div className="ml-20 group">
                    <div className="bg-white border border-gray-200/60 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      {/* Header */}
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
                        <div className="mb-4 lg:mb-0">
                          <h4 className="text-2xl font-bold text-gray-900 mb-2">{exp.title}</h4>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-600">
                            <strong className="font-semibold text-lg">{exp.company}</strong>
                            <span className="hidden sm:block">•</span>
                            <address className="not-italic">{exp.location}</address>
                            <span className="hidden sm:block">•</span>
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">{exp.type}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-start lg:items-end">
                          <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 font-semibold rounded-xl text-sm">
                             <Calendar className="w-4 h-4 mr-2" />
                             {exp.period}
                           </span>
                        </div>
                      </div>
                      
                      {/* Achievements */}
                      <div className="mb-6">
                        <h5 className="font-semibold text-gray-900 mb-3">Key Achievements:</h5>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className="flex items-start">
                              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Technologies */}
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Technologies Used:</h5>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:from-blue-100 hover:to-indigo-100 hover:text-blue-800 transition-all duration-300">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Education & Certifications Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Education */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mr-3 flex items-center justify-center">
                 <GraduationCap className="w-4 h-4 text-white" />
               </div>
              Education
            </h3>
            
            {education.map((edu, index) => (
              <div key={index} className="bg-white border border-gray-200/60 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{edu.degree}</h4>
                  <p className="text-lg font-semibold text-gray-700">{edu.school}</p>
                  <div className="flex items-center gap-4 mt-2 text-gray-600">
                    <span className="flex items-center">
                       <Calendar className="w-4 h-4 mr-1" />
                       {edu.period}
                     </span>
                    <span className="text-green-600 font-semibold">GPA: {edu.gpa}</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">{edu.honors}</span>
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Relevant Coursework:</h5>
                  <div className="flex flex-wrap gap-2">
                    {edu.relevant.map((course, courseIndex) => (
                      <span key={courseIndex} className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-medium">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Languages */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-3 flex items-center justify-center">
                 <Globe className="w-4 h-4 text-white" />
               </div>
              Languages
            </h3>
            
            <div className="space-y-4">
              {languages.map((language, index) => (
                <div key={index} className="bg-white border border-gray-200/60 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{language.name}</h4>
                      <p className="text-gray-600 font-medium">{language.proficiency}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${language.level}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{language.level}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Expertise */}
        <Card className="bg-transparent border-transparent shadow-none">
          <CardHeader>
            <CardTitle className="text-white">Technical Expertise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {profile.sections.skills.map((skillCategory, index) => (
                <div key={index}>
                  <h4 className="font-semibold mb-2 text-white">{skillCategory.category}</h4>
                  <ul className="text-sm text-gray-200 space-y-1">
                    {skillCategory.items.map((skill, skillIndex) => (
                      <li key={skillIndex}>• {skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Featured Projects */}
        <Card className="bg-transparent border-transparent shadow-none">
          <CardHeader>
            <CardTitle className="text-white">Featured Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.sections.projects.map((project, index) => (
                <div key={index} className="border-l-2 border-blue-400 pl-4">
                  <h4 className="font-semibold text-white">{project.name}</h4>
                  <p className="text-sm text-gray-200">{project.description}</p>
                  <p className="text-xs text-gray-300 mt-1">
                    Technologies: {project.tech.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-gray-900 to-indigo-900 rounded-3xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Collaborate?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            I'm always interested in discussing new opportunities and challenging projects. 
            Let's connect and explore how we can work together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300">
              <Mail className="w-5 h-5 mr-2" />
              Send Message
            </button>
            <button className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Call
            </button>
          </div>
        </div>
      </div>
    );
  }



  if (activeTab === 'contact') {
    const contactMethods = [
      {
        icon: <Mail className="w-6 h-6" />,
        label: "Email",
        value: profile.sections.contact.email,
        href: `mailto:${profile.sections.contact.email}`,
        color: "from-blue-500 to-cyan-500",
        description: "Send me an email for detailed discussions"
      },
      {
        icon: <Linkedin className="w-6 h-6" />,
        label: "LinkedIn",
        value: "Connect on LinkedIn",
        href: `https://${profile.sections.contact.linkedin}`,
        color: "from-blue-600 to-blue-700",
        description: "Let's connect professionally"
      },
      {
        icon: <Github className="w-6 h-6" />,
        label: "GitHub",
        value: "View my repositories",
        href: `https://${profile.sections.contact.github}`,
        color: "from-gray-700 to-gray-900",
        description: "Check out my latest projects"
      },
      {
        icon: <Facebook className="w-6 h-6" />,
        label: "Facebook",
        value: "Connect on Facebook",
        href: profile.sections.contact.facebook,
        color: "from-blue-600 to-blue-800",
        description: "Follow me on Facebook"
      },
      {
        icon: <Instagram className="w-6 h-6" />,
        label: "Instagram",
        value: "Follow on Instagram",
        href: profile.sections.contact.instagram,
        color: "from-pink-500 to-purple-600",
        description: "Check out my Instagram"
      },
      {
        icon: <MapPin className="w-6 h-6" />,
        label: "Location",
        value: profile.sections.contact.location,
        href: "#",
        color: "from-green-500 to-emerald-500",
        description: "Based in this location"
      }
    ];

    return (
      <div className="space-y-8" data-testid="content-contact">
        {/* Enhanced Header Section */}
        <div className="text-center space-y-4 px-4">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg mb-4">
            <Mail className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent">
            Let's Connect
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Ready to bring your ideas to life? I'm always excited to discuss new projects, 
            innovative solutions, and potential collaborations. Let's start a conversation!
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12 px-4">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.href}
              target={method.href.startsWith('http') ? '_blank' : undefined}
              rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group block"
            >
              <div className="relative bg-white border border-gray-200/60 rounded-2xl p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${method.color} rounded-xl shadow-lg mb-3 md:mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {method.icon}
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="font-bold text-gray-900 text-base md:text-lg mb-1 md:mb-2 group-hover:text-purple-600 transition-colors">
                    {method.label}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3">{method.description}</p>
                  <p className="text-gray-800 font-medium text-xs md:text-sm truncate">{method.value}</p>
                </div>
                
                {/* Decorative Corner */}
                <div className={`absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br ${method.color} opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500`}></div>
              </div>
            </a>
          ))}
        </div>

        {/* Main Contact Section */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-white border border-gray-200/60 rounded-3xl p-8 shadow-lg">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3 flex items-center justify-center">
                    <Send className="w-4 h-4 text-white" />
                  </div>
                  Send a Message
                </h3>
                <p className="text-gray-600">
                  Have a project in mind? Fill out the form below and I'll get back to you within 24 hours.
                </p>
              </div>
              
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                    <div className="relative">
                      <Input
                        placeholder="John Doe"
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                        disabled={isSubmitting}
                        data-testid="input-contact-name"
                        className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Address *</label>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                        disabled={isSubmitting}
                        data-testid="input-contact-email"
                        className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Message *</label>
                  <Textarea
                    placeholder="Tell me about your project, timeline, and any specific requirements..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    required
                    rows={6}
                    disabled={isSubmitting}
                    data-testid="textarea-contact-message"
                    className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors resize-none"
                  />
                </div>
                
                {/* Status Messages */}
                {submitStatus.type && (
                  <div className={`p-3 rounded-md ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {submitStatus.type === 'success' && <CheckCircle className="w-4 h-4" />}
                      <span className="text-sm">{submitStatus.message}</span>
                    </div>
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
                  disabled={isSubmitting}
                  data-testid="button-contact-submit"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information & Additional Details */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* Quick Response Promise */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                Quick Response Guarantee
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-900">24-Hour Response</p>
                    <p className="text-gray-600 text-sm">I'll get back to you within 24 hours, usually much sooner</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Free Consultation</p>
                    <p className="text-gray-600 text-sm">Initial project discussion and quote are completely free</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Flexible Communication</p>
                    <p className="text-gray-600 text-sm">Choose your preferred communication method and schedule</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Status */}
            <div className="bg-white border border-gray-200/60 rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                Current Availability
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {profile.availability}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Response Time:</span>
                  <span className="text-gray-900 font-semibold">&lt; 24 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time Zone:</span>
                  <span className="text-gray-900 font-semibold">PST (UTC-8)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Preferred Contact:</span>
                  <span className="text-gray-900 font-semibold">Email</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'certificates') {
    return (
      <div className="w-full">
        <Certificates />
      </div>
    );
  }

  return null;
}


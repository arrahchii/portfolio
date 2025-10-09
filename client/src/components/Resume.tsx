import React, { useState, useEffect } from 'react';
import { QuickQuestions } from './QuickQuestions';
import { GraduationCap, Briefcase, Download, MapPin, Calendar, Languages, Brain, Award, Clock, TrendingUp } from 'lucide-react';

interface Experience {
  title: string;
  company: string;
  period: string;
  location: string;
  type: string;
  achievements: string[];
  technologies: string[];
}

interface Education {
  degree: string;
  school: string;
  period: string;
  gpa: string;
  honors: string;
  relevant: string[];
}

interface Language {
  name: string;
  proficiency: string;
  level: number;
}

interface ResumeProps {
  experiences?: Experience[];
  education?: Education[];
  languages?: Language[];
}

const Resume: React.FC<ResumeProps> = ({ experiences = [], education = [], languages = [] }) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // API Base URL - Uses environment variable in production, localhost in development
  const API_BASE_URL = window.location.hostname.endsWith("onrender.com")
    ? "https://lanceport-fullstack.onrender.com"
    : "http://localhost:5001";

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
        if (data.success && data.profile) {
          setProfileData(data.profile);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching portfolio data:", error);
        setLoading(false);
      });
  }, [API_BASE_URL]);

  // Default data (fallback)
  const defaultExperiences: Experience[] = [
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
    }
  ];

  const defaultEducation: Education[] = [
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

  const defaultLanguages: Language[] = [
    { name: "English", proficiency: "Native", level: 100 },
    { name: "Filipino", proficiency: "Native", level: 100 }
  ];

  // Use data from props, then profile data, then defaults
  const experiencesToDisplay = experiences.length > 0 ? experiences : defaultExperiences;
  const educationToDisplay = education.length > 0 ? education : defaultEducation;
  const languagesToDisplay = languages.length > 0 ? languages : defaultLanguages;

  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-white overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                  <p className="text-gray-900 tracking-light text-[32px] font-bold leading-tight">Loading Resume...</p>
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
                activeTab="resume" 
                onTabChange={() => {}}
                onQuestionClick={() => {}}
                disabled={false}
                showTabs={true}
              />
            </div>
          </div>
        </div>
        
        {/* Main Content Area - Full Width */}
        <div className="px-4 md:px-8 lg:px-12 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-12">
              <h1 className="text-3xl md:text-4xl font-light text-slate-900 mb-4">Professional Resume</h1>
              <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mb-8">
                A comprehensive overview of my professional journey, technical expertise, and achievements in full-stack development and UI/UX design.
              </p>
              
              {/* Download Resume Section */}
              <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:bg-white/80 hover:border-gray-300/50 transition-all duration-300">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-700 to-black rounded-xl shadow-lg mb-4">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-slate-900 text-xl font-medium leading-tight mb-4">
                    Download Complete Resume
                  </h3>
                  <p className="text-slate-600 text-sm mb-6">
                    Get the full PDF version with detailed information about my experience and qualifications.
                  </p>
                  <a
                    href="/CABANITLANCERESUME.pdf"
                    download="CABANITLANCERESUME.pdf"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-700 to-black text-white font-medium rounded-lg hover:from-gray-800 hover:to-gray-900 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF Resume
                  </a>
                </div>
              </div>
            </div>
            
            {/* Work Experience */}
            <div className="mb-12">
              <div className="flex items-center mb-8">
                <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg mr-4">
                  <Briefcase className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-slate-900">Work Experience</h2>
                  <div className="w-12 h-0.5 bg-slate-300 mt-1"></div>
                </div>
              </div>

              <div className="space-y-6">
                {experiencesToDisplay.map((exp, index) => (
                  <div key={index} className="group">
                    <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:bg-white/80 hover:border-gray-300/50 transition-all duration-300 hover:shadow-lg">
                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                          <h4 className="text-slate-900 text-lg font-medium leading-tight">{exp.title}</h4>
                          <p className="text-gray-800 font-medium">{exp.company}</p>
                        </div>
                        <div className="text-right mt-2 md:mt-0">
                          <p className="text-slate-600 text-sm font-medium">{exp.period}</p>
                          <div className="flex items-center justify-end mt-1">
                            <MapPin className="w-3 h-3 text-slate-400 mr-1" />
                            <span className="text-slate-500 text-xs">{exp.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Achievements */}
                      <div className="mb-4">
                        <h5 className="text-slate-800 font-medium text-sm mb-3">Key Achievements:</h5>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className="text-slate-600 text-sm leading-relaxed flex items-start">
                              <span className="text-gray-600 mr-2 mt-1.5 flex-shrink-0">•</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Technologies */}
                      <div>
                        <h5 className="text-slate-800 font-medium text-sm mb-3">Technologies:</h5>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="px-3 py-1 bg-gray-100/80 text-gray-800 text-xs rounded-lg font-medium backdrop-blur-sm">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="mb-12">
              <div className="flex items-center mb-8">
                <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg mr-4">
                  <GraduationCap className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-slate-900">Education</h2>
                  <div className="w-12 h-0.5 bg-slate-300 mt-1"></div>
                </div>
              </div>

              <div className="space-y-6">
                {educationToDisplay.map((edu, index) => (
                  <div key={index} className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:bg-white/80 hover:border-gray-300/50 transition-all duration-300 hover:shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h4 className="text-slate-900 text-lg font-medium leading-tight">{edu.degree}</h4>
                        <p className="text-gray-800 font-medium">{edu.school}</p>
                      </div>
                      <div className="text-right mt-2 md:mt-0">
                        <div className="flex items-center justify-end">
                          <Calendar className="w-3 h-3 text-slate-400 mr-1" />
                          <span className="text-slate-600 text-sm font-medium">{edu.period}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Relevant Coursework */}
                    <div>
                      <h5 className="text-slate-800 font-medium text-sm mb-3">Relevant Coursework:</h5>
                      <div className="flex flex-wrap gap-2">
                        {edu.relevant.map((course, courseIndex) => (
                          <span key={courseIndex} className="px-3 py-1 bg-gray-100/80 text-gray-800 text-xs rounded-lg font-medium backdrop-blur-sm">
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="mb-12">
              <div className="flex items-center mb-8">
                <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg mr-4">
                  <Languages className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-slate-900">Languages</h2>
                  <div className="w-12 h-0.5 bg-slate-300 mt-1"></div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {languagesToDisplay.map((language, index) => (
                  <div key={index} className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-5 hover:bg-white/80 hover:border-gray-300/50 transition-all duration-300 hover:shadow-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-slate-900 font-medium">{language.name}</h4>
                      <p className="text-slate-600 font-medium text-sm">{language.proficiency}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-gray-600 to-black h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${language.level}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-700">{language.level}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
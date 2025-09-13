import React, { useState, useEffect } from 'react';
import { QuickQuestions } from './QuickQuestions';
import { GraduationCap, Briefcase, Download, MapPin, Calendar, Languages } from 'lucide-react';

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
      title: "Web Designer",
      company: "Algoworks",
      period: "09/2024 - 12/2024",
      location: "Remote",
      type: "Remote",
      achievements: [
        "Designed user interface to meet client specifications",
        "Improved overall site aesthetics through the use of high-quality graphics, typography choices, color schemes, and layout principles",
        "Developed graphic and image assets for both content and digital marketing efforts",
        "Coordinated copywriting and designed images to craft website content"
      ],
      technologies: ["UI/UX Design", "Graphic Design", "Web Design"]
    },
    {
      title: "Supervisor – BPO Company",
      company: "C&C BPO",
      period: "2020 - 2024",
      location: "Philippines",
      type: "Full-time",
      achievements: [
        "Led a team of 10–15 agents, helping them handle customer calls and deliver great service every day",
        "Trained new agents, guiding them through tools, company processes, and how to talk to customers in a professional but friendly way"
      ],
      technologies: ["Team Leadership", "Customer Service", "Training"]
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
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
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
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
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
        
        <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Header Section */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-gray-900 tracking-light text-[32px] font-bold leading-tight">Professional Resume</p>
                <p className="text-gray-600 text-sm font-normal leading-normal">
                  A comprehensive overview of my professional journey, technical expertise, and achievements in full-stack development and UI/UX design.
                </p>
              </div>
            </div>

            {/* Download Resume Section */}
            <div className="p-4">
              <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors duration-300 shadow-sm hover:shadow-md p-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg mb-4">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-gray-900 text-xl font-bold leading-tight mb-4">
                    Download Resume
                  </h3>
                  <p className="text-gray-600 text-sm font-normal leading-normal mb-6">
                    Get the complete PDF version of my professional resume with detailed experience and qualifications.
                  </p>
                  <a
                    href="/CABANITLANCERESUME.pdf"
                    download="CABANITLANCERESUME.pdf"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
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
            <div className="p-4">
              <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors duration-300 shadow-sm hover:shadow-md">
                {/* Section Header */}
                <div className="flex items-center p-6 border-b border-gray-100">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg mr-4 text-white">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 text-xl font-bold leading-tight">Work Experience</h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-1"></div>
                  </div>
                </div>

                {/* Experience Timeline */}
                <div className="p-6">
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500"></div>
                    
                    <div className="space-y-8">
                      {experiencesToDisplay.map((exp, index) => (
                        <div key={index} className="relative">
                          {/* Timeline Dot */}
                          <div className="absolute left-4 w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full border-4 border-white shadow-lg"></div>
                          
                          {/* Experience Card */}
                          <div className="ml-16 group">
                            <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 hover:bg-white hover:border-gray-200 transition-all duration-300 hover:shadow-sm">
                              {/* Header */}
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div>
                                  <h4 className="text-gray-900 text-lg font-bold leading-tight">{exp.title}</h4>
                                  <p className="text-blue-600 font-semibold">{exp.company}</p>
                                </div>
                                <div className="text-right mt-2 md:mt-0">
                                  <p className="text-gray-600 text-sm font-medium">{exp.period}</p>
                                  <div className="flex items-center justify-end mt-1">
                                    <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                                    <span className="text-gray-500 text-xs">{exp.location}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Achievements */}
                              <div className="mb-4">
                                <h5 className="text-gray-800 font-semibold text-sm mb-2">Key Achievements:</h5>
                                <ul className="space-y-1">
                                  {exp.achievements.map((achievement, achIndex) => (
                                    <li key={achIndex} className="text-gray-600 text-sm leading-relaxed flex items-start">
                                      <span className="text-blue-500 mr-2 mt-1.5 flex-shrink-0">•</span>
                                      {achievement}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              {/* Technologies */}
                              <div>
                                <h5 className="text-gray-800 font-semibold text-sm mb-2">Technologies:</h5>
                                <div className="flex flex-wrap gap-2">
                                  {exp.technologies.map((tech, techIndex) => (
                                    <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md font-medium">
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
              </div>
            </div>

            {/* Education */}
            <div className="p-4">
              <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors duration-300 shadow-sm hover:shadow-md">
                {/* Section Header */}
                <div className="flex items-center p-6 border-b border-gray-100">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg mr-4 text-white">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 text-xl font-bold leading-tight">Education</h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-1"></div>
                  </div>
                </div>

                {/* Education List */}
                <div className="p-6">
                  <div className="space-y-6">
                    {educationToDisplay.map((edu, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-100 rounded-lg p-6 hover:bg-white hover:border-gray-200 transition-all duration-300 hover:shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <h4 className="text-gray-900 text-lg font-bold leading-tight">{edu.degree}</h4>
                            <p className="text-green-600 font-semibold">{edu.school}</p>
                          </div>
                          <div className="text-right mt-2 md:mt-0">
                            <div className="flex items-center justify-end">
                              <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                              <span className="text-gray-600 text-sm font-medium">{edu.period}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Relevant Coursework */}
                        <div>
                          <h5 className="text-gray-800 font-semibold text-sm mb-2">Relevant Coursework:</h5>
                          <div className="flex flex-wrap gap-2">
                            {edu.relevant.map((course, courseIndex) => (
                              <span key={courseIndex} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md font-medium">
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="p-4">
              <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors duration-300 shadow-sm hover:shadow-md">
                {/* Section Header */}
                <div className="flex items-center p-6 border-b border-gray-100">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg mr-4 text-white">
                    <Languages className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 text-xl font-bold leading-tight">Languages</h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-1"></div>
                  </div>
                </div>

                {/* Languages List */}
                <div className="p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {languagesToDisplay.map((language, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-100 rounded-lg p-4 hover:bg-white hover:border-gray-200 transition-all duration-300 hover:shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-gray-900 font-bold">{language.name}</h4>
                          <p className="text-gray-600 font-medium text-sm">{language.proficiency}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${language.level}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{language.level}%</span>
                        </div>
                      </div>
                    ))}
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

export default Resume;
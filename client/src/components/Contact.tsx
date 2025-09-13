import React, { useState, useEffect } from 'react';
import { QuickQuestions } from './QuickQuestions';
import { Mail, Phone, MapPin, Github, Linkedin, Send, User, MessageSquare, Clock, CheckCircle } from 'lucide-react';

interface ContactMethod {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  color: string;
}

interface ContactProps {
  email?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  facebook?: string;
}

const Contact: React.FC<ContactProps> = ({ 
  email = 'cabanitlance43@gmail.com',
  location = 'General Santos City, Philippines',
  github = 'https://github.com/lancyyboii',
  linkedin = 'https://www.linkedin.com/in/lance-cabanit-61530b372/',
  facebook = 'facebook.com/lancyyboii'
}) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

  const contactMethods: ContactMethod[] = [
    {
      icon: <Mail className="w-6 h-6" />,
      label: 'Email',
      value: email,
      href: `mailto:${email}`,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: 'Location',
      value: location,
      href: `https://maps.google.com/?q=${encodeURIComponent(location)}`,
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: <Github className="w-6 h-6" />,
      label: 'GitHub',
      value: 'lancyyboii',
      href: github,
      color: 'from-gray-700 to-gray-900'
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      label: 'LinkedIn',
      value: 'lance-cabanit',
      href: linkedin,
      color: 'from-blue-600 to-blue-800'
    }
  ];

  // Add Facebook contact method if provided
  if (facebook) {
    contactMethods.splice(2, 0, {
      icon: <div className="w-6 h-6 flex items-center justify-center text-white font-bold">f</div>,
      label: 'Facebook',
      value: 'lancyyboii',
      href: `https://${facebook}`,
      color: 'from-blue-600 to-blue-800'
    });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                  <p className="text-gray-900 tracking-light text-[32px] font-bold leading-tight">Loading Contact...</p>
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
                activeTab="contact" 
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
                <p className="text-gray-900 tracking-light text-[32px] font-bold leading-tight">Get In Touch</p>
                <p className="text-gray-600 text-sm font-normal leading-normal">
                  Ready to collaborate? Let's discuss your next project and bring your ideas to life with innovative solutions.
                </p>
              </div>
            </div>

            {/* Contact Methods Grid */}
            <div className="p-4">
              <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors duration-300 shadow-sm hover:shadow-md">
                {/* Section Header */}
                <div className="flex items-center p-6 border-b border-gray-100">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg mr-4 text-white">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 text-xl font-bold leading-tight">Contact Information</h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-1"></div>
                  </div>
                </div>

                {/* Contact Methods */}
                <div className="p-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {contactMethods.map((method, index) => (
                      <a
                        key={index}
                        href={method.href}
                        target={method.label === 'GitHub' || method.label === 'LinkedIn' ? '_blank' : '_self'}
                        rel={method.label === 'GitHub' || method.label === 'LinkedIn' ? 'noopener noreferrer' : undefined}
                        className="group block"
                      >
                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 hover:bg-white hover:border-gray-200 transition-all duration-300 hover:shadow-md transform hover:scale-105">
                          <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl shadow-lg mb-4 text-white group-hover:shadow-xl transition-shadow duration-300`}>
                            {method.icon}
                          </div>
                          <h4 className="text-gray-900 font-bold text-lg mb-2">{method.label}</h4>
                          <p className="text-gray-600 text-sm font-medium break-all">{method.value}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-4">
              <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors duration-300 shadow-sm hover:shadow-md">
                {/* Section Header */}
                <div className="flex items-center p-6 border-b border-gray-100">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg mr-4 text-white">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 text-xl font-bold leading-tight">Send Message</h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-1"></div>
                  </div>
                </div>

                {/* Form */}
                <div className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name and Email Row */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-gray-700 font-semibold text-sm mb-2">
                          <User className="w-4 h-4 inline mr-2" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-gray-700 font-semibold text-sm mb-2">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-gray-700 font-semibold text-sm mb-2">
                        <MessageSquare className="w-4 h-4 inline mr-2" />
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                        placeholder="What's this about?"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-gray-700 font-semibold text-sm mb-2">
                        <MessageSquare className="w-4 h-4 inline mr-2" />
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white resize-none"
                        placeholder="Tell me about your project or inquiry..."
                      />
                    </div>

                    {/* Submit Status */}
                    {submitStatus === 'success' && (
                      <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                        <p className="text-green-800 font-medium">Message sent successfully! I'll get back to you soon.</p>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-red-600 mr-3" />
                        <p className="text-red-800 font-medium">Failed to send message. Please try again or contact me directly.</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="text-center">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isSubmitting ? (
                          <>
                            <Clock className="w-5 h-5 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Response Time Notice */}
            <div className="p-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h4 className="text-blue-900 font-bold text-lg mb-2">Quick Response Time</h4>
                <p className="text-blue-700 text-sm">
                  I typically respond to messages within 24 hours. For urgent inquiries, feel free to reach out via phone or email directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
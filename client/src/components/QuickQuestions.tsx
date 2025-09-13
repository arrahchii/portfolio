import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, EyeOff, MessageCircle, Code, Cog, Briefcase, Mail, User, FileText, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabType = 'me' | 'projects' | 'skills' | 'resume' | 'contact';

interface QuickQuestionsProps {
  onQuestionClick: (question: string) => void;
  disabled?: boolean;
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
  showTabs?: boolean;
}

const QUICK_QUESTIONS = [
  {
    icon: Code,
    text: "What projects are you most proud of?",
    color: "text-chart-1"
  },
  {
    icon: Cog,
    text: "What are your skills?",
    color: "text-chart-2"
  },
  {
    icon: Briefcase,
    text: "Am I available for opportunities?",
    color: "text-chart-3"
  },
  {
    icon: Mail,
    text: "Who is Lance?",
    color: "text-chart-4"
  }
];

const TABS = [
  { id: 'me' as TabType, label: 'Me', icon: User },
  { id: 'projects' as TabType, label: 'Projects', icon: Folder },
  { id: 'skills' as TabType, label: 'Skills', icon: Code },
  { id: 'resume' as TabType, label: 'Resume', icon: FileText },
  { id: 'contact' as TabType, label: 'Contact', icon: Mail },
];

export function QuickQuestions({ onQuestionClick, disabled = false, activeTab = 'me', onTabChange, showTabs = false }: QuickQuestionsProps) {
  const [, setLocation] = useLocation();

  const handleTabClick = (tabId: TabType) => {
    const path = tabId === 'me' ? '/' : `/${tabId}`;
    setLocation(path);
    onTabChange?.(tabId);
  };

  // If showTabs is true, render only the navigation tabs
  if (showTabs) {
    return (
      <div className="flex items-center justify-center gap-4 md:gap-10 py-4 relative z-20 overflow-x-auto px-4">
        {TABS.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "flex items-center gap-1 md:gap-2 pb-3 transition-all duration-200 text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap flex-shrink-0",
                isActive 
                  ? "text-gray-900 border-b-2 border-gray-900" 
                  : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
              )}
            >
              <IconComponent className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Enhanced Quick Question Section */}
      <div className="space-y-3 sm:space-y-4">
        {/* Professional Section Header */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full md:hidden"></div>
          <h3 className="text-lg sm:text-lg font-bold text-gray-800 tracking-wide">
            <span className="md:hidden">Quick Questions</span>
            <span className="hidden md:inline">Quick Questions</span>
          </h3>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent md:hidden"></div>
        </div>
        
        {/* Mobile-Enhanced Question Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3">
          {QUICK_QUESTIONS.map((question, index) => {
            const IconComponent = question.icon;
            return (
              <button
                key={index}
                onClick={() => onQuestionClick(question.text)}
                disabled={disabled}
                data-testid={`button-quick-question-${index}`}
                className="group relative p-4 sm:p-4 text-left bg-gradient-to-br from-white via-white to-gray-50/50 hover:from-blue-50/80 hover:via-white hover:to-purple-50/80 border border-gray-200/60 hover:border-blue-300/60 rounded-2xl sm:rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {/* Mobile-Specific Visual Enhancement */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:hidden"></div>
                
                <div className="flex items-start gap-3 sm:gap-3">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-6 sm:h-6 text-blue-600 group-hover:text-blue-700 mt-0.5 transition-colors duration-300">
                    <IconComponent className="w-full h-full" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 group-hover:text-gray-900 font-medium leading-relaxed tracking-wide">
                    {question.text}
                  </span>
                </div>
                
                {/* Subtle Mobile Interaction Indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl md:hidden"></div>
              </button>
            );
          })}
        </div>
      </div>
      {/* Enhanced Navigation Tabs */}
      <div className="border-t border-gray-200/60 pt-5 sm:pt-6">
        {/* Mobile-First Tab Container */}
        <div className="relative">
          {/* Mobile Tab Scroll Indicator */}
          <div className="md:hidden absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none"></div>
          <div className="md:hidden absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none"></div>
          
          {/* Professional Tab Navigation */}
          <div className="flex overflow-x-auto scrollbar-hide gap-2 sm:gap-2 px-3 sm:px-2 pb-1">
            {TABS.map((tab, index) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={`group relative flex-shrink-0 flex items-center gap-2.5 px-4 py-3 sm:px-4 sm:py-3 rounded-2xl sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 whitespace-nowrap transform hover:scale-105 active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white shadow-xl shadow-blue-200/50'
                      : 'bg-gradient-to-r from-gray-100/80 to-gray-50/80 text-gray-600 hover:from-blue-50/80 hover:to-purple-50/80 hover:text-gray-800 border border-gray-200/50 hover:border-blue-200/60'
                  }`}
                >
                  {/* Mobile-Specific Active Indicator */}
                  {isActive && (
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse md:hidden"></div>
                  )}
                  
                  <IconComponent className={`w-5 h-5 sm:w-5 sm:h-5 flex-shrink-0 transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'
                  }`} />
                  
                  <span className={`font-bold tracking-wide transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {tab.label}
                  </span>
                  
                  {/* Subtle Mobile Interaction Feedback */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-purple-400/0 rounded-2xl sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:hidden"></div>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Mobile-Only Professional Tab Indicator */}
          <div className="md:hidden mt-3 flex justify-center">
            <div className="flex gap-1.5">
              {TABS.map((tab, index) => (
                <div
                  key={tab.id}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-6'
                      : 'bg-gray-300'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

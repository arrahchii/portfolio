import { useState } from 'react';
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

  // If showTabs is true, render only the navigation tabs
  if (showTabs) {
    return (
      <div className="flex items-center justify-center gap-10 py-4 relative z-20">
        {TABS.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={cn(
                "flex items-center gap-2 pb-3 transition-all duration-200 text-sm font-semibold tracking-wide",
                isActive 
                  ? "text-gray-900 border-b-2 border-gray-900" 
                  : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
              )}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full relative z-20" data-testid="card-quick-questions">

      
      {/* Quick question buttons */}
      <div className="grid grid-cols-2 gap-5 max-w-3xl mx-auto">
        {QUICK_QUESTIONS.map((question, index) => {
          const IconComponent = question.icon;
          return (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-6 text-left justify-start bg-white hover:bg-gray-50 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl flex items-start font-medium"
              onClick={() => onQuestionClick(question.text)}
              disabled={disabled}
              data-testid={`button-quick-question-${index}`}
            >
              <IconComponent className="w-5 h-5 mr-4 mt-0.5 flex-shrink-0 text-gray-600" />
              <span className="text-sm text-gray-800 font-semibold leading-relaxed break-words tracking-wide">{question.text}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

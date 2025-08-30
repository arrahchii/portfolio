import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, EyeOff, MessageCircle, Code, Cog, Briefcase, Mail } from 'lucide-react';

interface QuickQuestionsProps {
  onQuestionClick: (question: string) => void;
  disabled?: boolean;
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
    text: "How can I reach you?",
    color: "text-chart-4"
  }
];

export function QuickQuestions({ onQuestionClick, disabled = false }: QuickQuestionsProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="text-muted-foreground hover:text-foreground"
        data-testid="button-show-quick-questions"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Show quick questions
      </Button>
    );
  }

  return (
    <Card className="shadow-sm" data-testid="card-quick-questions">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Who are you?</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="ml-auto text-muted-foreground hover:text-foreground p-1"
            data-testid="button-hide-quick-questions"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {QUICK_QUESTIONS.map((question) => {
            const IconComponent = question.icon;
            return (
              <Button
                key={question.text}
                variant="outline"
                onClick={() => onQuestionClick(question.text)}
                disabled={disabled}
                className="quick-question text-left p-3 h-auto justify-start bg-background hover:bg-accent border-border transition-all"
                data-testid={`button-quick-question-${question.text.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              >
                <IconComponent className={`w-4 h-4 mr-2 flex-shrink-0 ${question.color}`} />
                <span className="text-sm">{question.text}</span>
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1"
          data-testid="button-hide-quick-questions-bottom"
        >
          <EyeOff className="w-4 h-4" />
          Hide quick questions
        </Button>
      </CardContent>
    </Card>
  );
}

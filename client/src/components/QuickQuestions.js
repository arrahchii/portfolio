import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, EyeOff, MessageCircle, Code, Cog, Briefcase, Mail } from 'lucide-react';
var QUICK_QUESTIONS = [
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
export function QuickQuestions(_a) {
    var onQuestionClick = _a.onQuestionClick, _b = _a.disabled, disabled = _b === void 0 ? false : _b;
    var _c = useState(true), isVisible = _c[0], setIsVisible = _c[1];
    if (!isVisible) {
        return (_jsxs(Button, { variant: "ghost", size: "sm", onClick: function () { return setIsVisible(true); }, className: "text-muted-foreground hover:text-foreground", "data-testid": "button-show-quick-questions", children: [_jsx(MessageCircle, { className: "w-4 h-4 mr-2" }), "Show quick questions"] }));
    }
    return (_jsx(Card, { className: "shadow-sm", "data-testid": "card-quick-questions", children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(MessageCircle, { className: "w-4 h-4 text-primary" }), _jsx("span", { className: "text-sm font-medium text-foreground", children: "Who are you?" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: function () { return setIsVisible(false); }, className: "ml-auto text-muted-foreground hover:text-foreground p-1", "data-testid": "button-hide-quick-questions", children: _jsx(ChevronDown, { className: "w-4 h-4" }) })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4", children: QUICK_QUESTIONS.map(function (question) {
                        var IconComponent = question.icon;
                        return (_jsxs(Button, { variant: "outline", onClick: function () { return onQuestionClick(question.text); }, disabled: disabled, className: "quick-question text-left p-3 h-auto justify-start bg-background hover:bg-accent border-border transition-all", "data-testid": "button-quick-question-".concat(question.text.toLowerCase().replace(/[^a-z0-9]/g, '-')), children: [_jsx(IconComponent, { className: "w-4 h-4 mr-2 flex-shrink-0 ".concat(question.color) }), _jsx("span", { className: "text-sm", children: question.text })] }, question.text));
                    }) }), _jsxs(Button, { variant: "ghost", size: "sm", onClick: function () { return setIsVisible(false); }, className: "text-muted-foreground hover:text-foreground flex items-center gap-1", "data-testid": "button-hide-quick-questions-bottom", children: [_jsx(EyeOff, { className: "w-4 h-4" }), "Hide quick questions"] })] }) }));
}

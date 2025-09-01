import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
import { User, Folder, Code, FileText, Mail } from 'lucide-react';
var TABS = [
    { id: 'me', label: 'Me', icon: User, color: 'text-chart-1' },
    { id: 'projects', label: 'Projects', icon: Folder, color: 'text-chart-2' },
    { id: 'skills', label: 'Skills', icon: Code, color: 'text-chart-3' },
    { id: 'resume', label: 'Resume', icon: FileText, color: 'text-chart-4' },
    { id: 'contact', label: 'Contact', icon: Mail, color: 'text-chart-5' },
];
export function TabNavigation(_a) {
    var activeTab = _a.activeTab, onTabChange = _a.onTabChange;
    return (_jsx("nav", { className: "flex-shrink-0 bg-card border-t border-border", "data-testid": "nav-tab-navigation", children: _jsx("div", { className: "flex justify-center", children: _jsx("div", { className: "flex space-x-1 p-2", children: TABS.map(function (tab) {
                    var IconComponent = tab.icon;
                    var isActive = activeTab === tab.id;
                    return (_jsxs("button", { onClick: function () { return onTabChange(tab.id); }, className: cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all", isActive
                            ? "tab-active bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"), "data-testid": "button-tab-".concat(tab.id), children: [_jsx(IconComponent, { className: cn("w-4 h-4", isActive ? "" : tab.color) }), _jsx("span", { className: "hidden sm:inline", children: tab.label })] }, tab.id));
                }) }) }) }));
}

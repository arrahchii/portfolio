import { cn } from '@/lib/utils';
import { User, Folder, Code, FileText, Mail } from 'lucide-react';

export type TabType = 'me' | 'projects' | 'skills' | 'resume' | 'contact';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TABS = [
  { id: 'me' as TabType, label: 'Me', icon: User, color: 'text-chart-1' },
  { id: 'projects' as TabType, label: 'Projects', icon: Folder, color: 'text-chart-2' },
  { id: 'skills' as TabType, label: 'Skills', icon: Code, color: 'text-chart-3' },
  { id: 'resume' as TabType, label: 'Resume', icon: FileText, color: 'text-chart-4' },
  { id: 'contact' as TabType, label: 'Contact', icon: Mail, color: 'text-chart-5' },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className="flex-shrink-0 bg-card border-t border-border" data-testid="nav-tab-navigation">
      <div className="flex justify-center">
        <div className="flex space-x-1 p-2">
          {TABS.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive 
                    ? "tab-active bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                data-testid={`button-tab-${tab.id}`}
              >
                <IconComponent className={cn("w-4 h-4", isActive ? "" : tab.color)} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

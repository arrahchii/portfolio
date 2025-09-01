import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';
export function ThemeToggle() {
    var _a = useTheme(), theme = _a.theme, setTheme = _a.setTheme;
    return (_jsxs(Button, { variant: "ghost", size: "sm", onClick: function () { return setTheme(theme === 'light' ? 'dark' : 'light'); }, className: "w-9 h-9 rounded-full", "data-testid": "button-theme-toggle", children: [_jsx(Sun, { className: "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }), _jsx(Moon, { className: "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }), _jsx("span", { className: "sr-only", children: "Toggle theme" })] }));
}

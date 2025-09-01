import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChatInterface } from '@/components/ChatInterface';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { nanoid } from 'nanoid';
export default function Portfolio() {
    var sessionId = useState(function () { return nanoid(); })[0];
    var _a = useQuery({
        queryKey: ['/api/portfolio/profile'],
    }), profileData = _a.data, isLoading = _a.isLoading, error = _a.error;
    if (isLoading) {
        return (_jsxs("div", { className: "flex flex-col min-h-screen max-w-4xl mx-auto", children: [_jsxs("div", { className: "flex-shrink-0 p-6 text-center border-b border-border", children: [_jsx("div", { className: "mb-6", children: _jsx(Skeleton, { className: "w-20 h-20 rounded-full mx-auto" }) }), _jsx(Skeleton, { className: "h-8 w-64 mx-auto mb-2" }), _jsx(Skeleton, { className: "h-4 w-48 mx-auto mb-4" }), _jsx(Skeleton, { className: "h-6 w-32 mx-auto rounded-full" })] }), _jsx("div", { className: "flex-1 p-4", children: _jsxs("div", { className: "space-y-4", children: [_jsx(Skeleton, { className: "h-32 w-full rounded-xl" }), _jsx(Skeleton, { className: "h-16 w-3/4" }), _jsx(Skeleton, { className: "h-16 w-1/2" })] }) })] }));
    }
    if (error || !(profileData === null || profileData === void 0 ? void 0 : profileData.success)) {
        return (_jsx("div", { className: "min-h-screen w-full flex items-center justify-center bg-background p-4", children: _jsxs(Alert, { className: "w-full max-w-md", children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsx(AlertDescription, { children: "Failed to load portfolio data. Please check your connection and try again." })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsx(ChatInterface, { profile: profileData.profile, sessionId: sessionId }) }));
}

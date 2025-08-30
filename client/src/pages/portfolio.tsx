import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChatInterface } from '@/components/ChatInterface';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { nanoid } from 'nanoid';

interface ProfileData {
  name: string;
  title: string;
  availability: string;
  avatar: string;
  sections: {
    me: {
      bio: string;
      experience: string;
      passion: string;
    };
    skills: Array<{
      category: string;
      items: string[];
    }>;
    projects: Array<{
      name: string;
      description: string;
      tech: string[];
      status: string;
    }>;
    contact: {
      email: string;
      linkedin: string;
      github: string;
      location: string;
    };
  };
}

export default function Portfolio() {
  const [sessionId] = useState(() => nanoid());

  const { data: profileData, isLoading, error } = useQuery<{success: boolean; profile: ProfileData}>({
    queryKey: ['/api/portfolio/profile'],
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen max-w-4xl mx-auto">
        <div className="flex-shrink-0 p-6 text-center border-b border-border">
          <div className="mb-6">
            <Skeleton className="w-20 h-20 rounded-full mx-auto" />
          </div>
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-32 mx-auto rounded-full" />
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-16 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData?.success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
        <Alert className="w-full max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load portfolio data. Please check your connection and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ChatInterface 
        profile={profileData.profile}
        sessionId={sessionId}
      />
    </div>
  );
}

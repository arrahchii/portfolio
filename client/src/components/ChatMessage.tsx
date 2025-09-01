import React from 'react';

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

interface ChatMessageProps {
  content: string;
  role: 'user' | 'assistant';
  profile: ProfileData;
}

export function ChatMessage({ content, role, profile }: ChatMessageProps) {
  console.log('🚨 CHATMESSAGE COMPONENT IS RUNNING');
  console.log('🚨 Content type:', typeof content);
  console.log('🚨 Content value:', content);
  console.log('🚨 Role:', role);

  // Safety check - ensure content is always a string
  const messageContent = typeof content === 'string' ? content : JSON.stringify(content);

  // Check if this is a profile message
  const isProfileMessage = messageContent.startsWith('profile:') && role === 'assistant';
  
  if (isProfileMessage) {
    console.log('🖼️ PROFILE MESSAGE DETECTED BY CONTENT!');
    
    return (
      <div className="w-full p-4 border-4 border-blue-500 bg-blue-50 rounded-lg shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
            <span className="text-2xl">👨‍💼</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{profile.name}</h3>
            <p className="text-blue-600 font-medium">{profile.title}</p>
            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
              {profile.availability}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-2">About</h4>
          <p className="text-gray-600 leading-relaxed">{profile.sections.me.bio}</p>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-2">Experience</h4>
          <p className="text-gray-600">{profile.sections.me.experience}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
            📧 {profile.sections.contact.email}
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
            💼 LinkedIn
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
            🐙 GitHub
          </span>
        </div>
      </div>
    );
  }

  // Regular message - ABSOLUTELY NO OBJECT RENDERING
  return (
    <div className={`max-w-3xl ${role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
      <div className={`rounded-lg p-3 ${
        role === 'user' 
          ? 'bg-blue-600 text-white ml-12' 
          : 'bg-gray-100 text-gray-800 mr-12'
      }`}>
        <p className="whitespace-pre-wrap">{messageContent}</p>
      </div>
    </div>
  );
}





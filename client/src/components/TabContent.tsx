import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { 
  Download, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Mail, 
  Phone,
  Code,
  Database,
  Cloud,
  Brain,
  Palette,
  Send,
  CheckCircle
} from 'lucide-react';
import type { TabType } from './TabNavigation';

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

interface TabContentProps {
  activeTab: TabType;
  profile: ProfileData;
}

export function TabContent({ activeTab, profile }: TabContentProps) {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Start submitting
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });
    
    console.log('📧 Submitting contact form:', contactForm);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      const result = await response.json();
      console.log('📧 Contact form response:', result);

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Thank you! Your message has been sent successfully.'
        });
        
        // Reset form on success
        setContactForm({ name: '', email: '', message: '' });
      } else {
        throw new Error(result.message || 'Failed to send message');
      }

    } catch (error) {
      console.error('📧 Contact form error:', error);
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (activeTab === 'me') {
    return (
      <div className="space-y-6" data-testid="content-me">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Avatar className="w-16 h-16">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>LC</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-lg text-muted-foreground">{profile.title}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">About Me</h3>
              <p className="text-muted-foreground">{profile.sections.me.bio}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Experience</h3>
              <p className="text-muted-foreground">{profile.sections.me.experience}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">What Drives Me</h3>
              <p className="text-muted-foreground">{profile.sections.me.passion}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'projects') {
    return (
      <div className="space-y-6" data-testid="content-projects">
        <h2 className="text-2xl font-bold mb-4">My Projects</h2>
        <div className="grid gap-6">
          {profile.sections.projects.map((project, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <Badge variant={project.status === 'Live' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Demo
                  </Button>
                  <Button size="sm" variant="outline">
                    <Github className="w-4 h-4 mr-2" />
                    Source Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'skills') {
    const skillIcons = {
      Frontend: Code,
      Backend: Database,
      Database: Database,
      Cloud: Cloud,
      'AI/ML': Brain
    };

    return (
      <div className="space-y-6" data-testid="content-skills">
        <h2 className="text-2xl font-bold mb-4">Technical Skills</h2>
        <div className="grid gap-6">
          {profile.sections.skills.map((skillCategory, index) => {
            const IconComponent = skillIcons[skillCategory.category as keyof typeof skillIcons] || Palette;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-primary" />
                    {skillCategory.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.items.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  if (activeTab === 'resume') {
    return (
      <div className="space-y-6" data-testid="content-resume">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Resume</h2>
          {/* Fixed: Direct HTML download link */}
          <a
            href="/CABANITLANCERESUME.pdf"
            download="CABANITLANCERESUME.pdf"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </a>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Professional Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {profile.sections.me.bio} With {profile.sections.me.experience}, I specialize in creating 
              innovative solutions that bridge the gap between cutting-edge technology and real-world applications.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technical Expertise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {profile.sections.skills.map((skillCategory, index) => (
                <div key={index}>
                  <h4 className="font-semibold mb-2">{skillCategory.category}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {skillCategory.items.map((skill, skillIndex) => (
                      <li key={skillIndex}>• {skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Featured Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.sections.projects.map((project, index) => (
                <div key={index} className="border-l-2 border-primary pl-4">
                  <h4 className="font-semibold">{project.name}</h4>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Technologies: {project.tech.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'contact') {
    return (
      <div className="space-y-6" data-testid="content-contact">
        <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href={`mailto:${profile.sections.contact.email}`} className="text-sm text-muted-foreground hover:text-primary">
                    {profile.sections.contact.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Linkedin className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">LinkedIn</p>
                  <a href={`https://${profile.sections.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">
                    {profile.sections.contact.linkedin}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">GitHub</p>
                  <a href={`https://${profile.sections.contact.github}`} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">
                    {profile.sections.contact.github}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{profile.sections.contact.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                    disabled={isSubmitting}
                    data-testid="input-contact-name"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    disabled={isSubmitting}
                    data-testid="input-contact-email"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    required
                    rows={4}
                    disabled={isSubmitting}
                    data-testid="textarea-contact-message"
                  />
                </div>

                {/* Status Messages */}
                {submitStatus.type && (
                  <div className={`p-3 rounded-md ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {submitStatus.type === 'success' && <CheckCircle className="w-4 h-4" />}
                      <span className="text-sm">{submitStatus.message}</span>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                  data-testid="button-contact-submit"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}


export interface Project {
  id: string;
  title: string;
  description: string;
  features: string[];
  link?: string;
  techStack?: string[];
  type: 'AI' | 'Web' | 'Hybrid';
  color: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  responsibilities: string[];
  color: string;
  link?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface AudioWork {
  title: string;
  description: string;
  tags: string[];
}
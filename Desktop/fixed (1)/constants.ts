import { Project, Experience, AudioWork, SocialLink } from './types';
import { Github, Linkedin, Instagram, Music, Zap, Code, Cpu } from 'lucide-react';

export const ABOUT_TEXT = {
  intro: "Hi, I’m Denny Mathew — a web developer, AI enthusiast, and creative music & SFX producer from Ernakulam, Kerala.",
  details: "Currently a 2nd-year CSE student at Karunya University. I build dynamic websites, work with AI-powered systems (Gemini, Agentic AI), and create audio experiences. Technology + Creativity is my fuel.",
  passions: [
    "Building AI-driven web experiences",
    "Creating impactful digital products",
    "Combining technology & sound design",
    "Collaborating on innovative tech projects"
  ]
};

// 📸 REPLACE THESE LINKS WITH YOUR OWN PHOTOS
export const PROFILE_IMAGES = {
  // Photo of you playing keyboard/piano
  keyboard: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=600&auto=format&fit=crop",
  
  // Photo of your band / stage performance
  stage: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=600&auto=format&fit=crop"
};

export const PROJECTS: Project[] = [
  {
    id: 'xnetic',
    title: 'AI Xnetic Bot',
    description: 'Full-stack AI legal assistant simplifying complex contracts using Google Gemini 2.0 Flash.',
    features: [
      'Summarize legal documents instantly',
      'Extract key clauses & flag risks',
      'Suggest negotiation points',
      'Real-time Q&A on contracts'
    ],
    link: 'https://github.com/Jerielphilly/Xnetic-Ai',
    type: 'AI',
    color: 'graffiti-cyan'
  },
  {
    id: 'aura',
    title: 'AURA (Ongoing)',
    description: 'Autonomous Unified Repair Agent. An agentic AI for automotive predictive maintenance.',
    features: [
      'Predicts mechanical failures early',
      'Auto-contacts owners via Voice AI',
      'Books service appointments autonomously',
      'Self-monitors with UEBA security'
    ],
    type: 'AI',
    color: 'graffiti-pink'
  },
  {
    id: 'delicious',
    title: 'Delicious Cake',
    description: 'Professional e-commerce site for an international cake brand in Kuwait.',
    features: [
      'Modern UI/UX & Responsive Design',
      'Clear product displays',
      'Enhanced customer engagement'
    ],
    link: 'https://delicious-cake-shop.vercel.app/#/',
    type: 'Web',
    color: 'graffiti-yellow'
  }
];

export const EXPERIENCE: Experience[] = [
  {
    id: 'walmart',
    role: 'Adv. Software Engineering Fellow',
    company: 'Walmart USA (Job Simulation)',
    duration: 'Nov 2024 – Sep 2025',
    responsibilities: [
      'Advanced Data Structures & Heap Optimization',
      'Software Architecture & System Design',
      'Relational Database Design & Data Munging'
    ],
    color: 'graffiti-purple',
    link: 'https://www.theforage.com/completion-certificates/prBZoAihniNijyD6d/oX6f9BbCL9kJDJzfg_prBZoAihniNijyD6d_vvDcNMZB8kJQneKPa_1756796500208_completion_certificate.pdf'
  },
  {
    id: 'ecell',
    role: 'Head of Corporate Relations',
    company: 'E-Cell, Karunya University',
    duration: 'Oct 2024 – Aug 2025',
    responsibilities: [
      'Promoted from Jr. Business Developer',
      'Connected with partner brands',
      'Led outreach & collaboration efforts'
    ],
    color: 'graffiti-lime'
  },
  {
    id: 'hacks',
    role: 'Web Developer',
    company: 'Karunya Hacks',
    duration: 'Oct 2024 – Feb 2025',
    responsibilities: [
      'Built intuitive, responsive web solutions',
      'Collaborated on hackathon sites',
      'Focused on performance and accessibility'
    ],
    color: 'graffiti-cyan'
  }
];

export const CREATIVE: AudioWork[] = [
  {
    title: "Band Competition Winner",
    description: "Lead production and performance for winning university band entry.",
    tags: ["Live", "Performance"]
  },
  {
    title: "SFX & Production",
    description: "Creating immersive soundscapes and audio engineering for digital media.",
    tags: ["SFX", "Production"]
  }
];

export const SOCIALS = [
  { platform: 'Instagram', url: 'https://www.instagram.com/denny._.mathew', icon: 'Instagram' },
  { platform: 'GitHub', url: 'https://github.com/dennyhacks', icon: 'Github' },
  { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/denny-mathew-093377307', icon: 'Linkedin' }
];
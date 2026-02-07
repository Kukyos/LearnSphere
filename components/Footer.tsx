import React from 'react';
import { BookOpen, Twitter, Linkedin, Facebook, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-900 pt-24 pb-12 text-brand-300 border-t border-brand-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6 flex items-center gap-2 text-white">
              <BookOpen size={24} className="text-brand-600" />
              <span className="text-xl font-bold">LearnSphere</span>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-brand-400">
              Empowering the next generation of creators and leaders through accessible, high-quality education.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-brand-400 hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-brand-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="text-brand-400 hover:text-white transition-colors"><Github size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="mb-6 font-bold text-white">Platform</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Browse Courses</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mentorship</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">For Business</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-white">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-white">Legal</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-brand-800 pt-8 text-center text-xs text-brand-500">
          © {new Date().getFullYear()} LearnSphere Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
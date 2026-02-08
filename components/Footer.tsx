import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

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
          </div>
          
          <div>
            <h4 className="mb-6 font-bold text-white">Platform</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/explore" className="hover:text-white transition-colors">Browse Courses</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/settings" className="hover:text-white transition-colors">Settings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-white">Resources</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/explore" className="hover:text-white transition-colors">Course Catalog</Link></li>
              <li><Link to="/my-courses" className="hover:text-white transition-colors">My Courses</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-white">Legal</h4>
            <ul className="space-y-4 text-sm">
              <li><span className="text-brand-500 cursor-default">Terms of Use</span></li>
              <li><span className="text-brand-500 cursor-default">Privacy Policy</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-brand-800 pt-8 text-center text-xs text-brand-500">
          &copy; {new Date().getFullYear()} LearnSphere. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

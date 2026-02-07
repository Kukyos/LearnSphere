import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';
import { AuthForm } from '../components/auth/AuthForm';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        
        {/* Left Panel - Branding */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="w-8 h-8 text-brand-50" />
              <span className="text-2xl font-bold">LearnSphere</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Your Learning Journey Starts Here
            </h1>
            <p className="text-brand-100 text-lg leading-relaxed">
              Join thousands of learners and instructors building knowledge together.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Expert-Led Courses</h3>
                <p className="text-brand-200 text-sm">Learn from industry professionals</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Interactive Learning</h3>
                <p className="text-brand-200 text-sm">Engage with quizzes and projects</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Track Your Progress</h3>
                <p className="text-brand-200 text-sm">Monitor your journey with analytics</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel - D's Auth Form */}
        <div className="p-8 md:p-12 flex flex-col">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-800 transition-colors mb-8 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </Link>
          
          <div className="flex-1 flex flex-col justify-center">
            <AuthForm />
          </div>
          
          <div className="mt-8 pt-6 border-t border-brand-200 text-center text-sm text-brand-500">
            <p>© 2026 LearnSphere. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

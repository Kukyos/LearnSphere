import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Redirect to home after successful login
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    loginAsGuest();
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-nature-light dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-nature-card dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        
        {/* Left Panel - Branding */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-brand-600 to-brand-700 text-white">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="w-8 h-8 text-brand-100" />
              <span className="text-2xl font-bold">LearnSphere</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Grow naturally at your own pace
            </h1>
            <p className="text-brand-100 text-lg leading-relaxed">
              Discover a calming environment to master new skills.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Expert-Led Courses</h3>
                <p className="text-brand-100 text-sm">Learn from industry professionals</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Interactive Learning</h3>
                <p className="text-brand-100 text-sm">Engage with quizzes and projects</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Track Your Progress</h3>
                <p className="text-brand-100 text-sm">Monitor your journey with analytics</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Simple Login Form */}
        <div className="p-8 md:p-12 flex flex-col dark:bg-gray-800">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition-colors mb-8 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </Link>
          
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to continue your learning journey
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Selection */}
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-brand-600 focus:outline-none transition-colors"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (min 3 chars)"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-brand-600 focus:outline-none transition-colors"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 dark:text-red-400 text-sm ml-2">{error}</p>
                </div>
              )}

              {/* Test Credentials Note */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  <span className="font-semibold">Test login:</span> Any email with @ and password of 3+ chars
                </p>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full py-3 px-4 bg-brand-700 hover:bg-brand-600 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400">Or</span>
                </div>
              </div>

              {/* Guest Login */}
              <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
              >
                Continue as Guest
              </button>
            </form>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2026 LearnSphere. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, GraduationCap, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AuthMode, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import DomeGallery from '../components/visuals/DomeGallery';
import { apiForgotPassword, isBackendAvailable } from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, loginAsGuest } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<UserRole>('learner');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) { setMessage({ type: 'error', text: 'Please enter your email.' }); return; }
    setForgotLoading(true);
    setMessage(null);
    try {
      const online = await isBackendAvailable();
      if (!online) {
        setMessage({ type: 'error', text: 'Password reset requires a running server. Please try again later.' });
        setForgotLoading(false);
        return;
      }
      await apiForgotPassword(forgotEmail);
      setMessage({ type: 'success', text: 'If that email exists, a temporary password has been sent. Check your inbox.' });
      setTimeout(() => { setForgotMode(false); setMessage(null); }, 4000);
    } catch {
      setMessage({ type: 'success', text: 'If that email exists, a temporary password has been sent.' });
      setTimeout(() => { setForgotMode(false); setMessage(null); }, 4000);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (mode === 'signup') {
        const fullName = `${firstName} ${lastName}`.trim();
        if (!fullName) {
          setMessage({ type: 'error', text: 'Please enter your name' });
          setIsLoading(false);
          return;
        }
        // Password strength validation
        if (password.length < 8) {
          setMessage({ type: 'error', text: 'Password must be at least 8 characters.' });
          setIsLoading(false);
          return;
        }
        if (!/[a-z]/.test(password)) {
          setMessage({ type: 'error', text: 'Password must contain a lowercase letter.' });
          setIsLoading(false);
          return;
        }
        if (!/[A-Z]/.test(password)) {
          setMessage({ type: 'error', text: 'Password must contain an uppercase letter.' });
          setIsLoading(false);
          return;
        }
        if (!/[0-9]/.test(password)) {
          setMessage({ type: 'error', text: 'Password must contain a digit.' });
          setIsLoading(false);
          return;
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
          setMessage({ type: 'error', text: 'Password must contain a special character.' });
          setIsLoading(false);
          return;
        }
        await register(fullName, email, password, role);
        setMessage({ type: 'success', text: `Welcome, ${fullName}! Account created.` });
        setTimeout(() => navigate('/'), 800);
      } else {
        await login(email, password);
        navigate('/');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate('/home');
  };

  const getRoleIcon = (r: UserRole) => {
    switch (r) {
      case 'instructor': return <GraduationCap size={16} />;
      case 'learner': return <Sparkles size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  const getWelcomeMessage = () => {
    if (mode === 'signup') return "Begin your path.";
    switch (role) {
      case 'instructor': return "Welcome back, Mentor.";
      case 'learner': return "Continue your journey.";
      default: return "Welcome Back";
    }
  };

  const getSubMessage = () => {
    if (mode === 'signup') return "Create your account to start learning.";
    switch (role) {
      case 'instructor': return "Your students await guidance.";
      case 'learner': return "Ready to grow today?";
      default: return "Enter your credentials to access your account.";
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans bg-nature-light selection:bg-brand-300/40 text-brand-900">
      
      {/* Background gradient */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-nature-card via-nature-light to-brand-100"></div>

      {/* Main Content Container - Split Screen */}
      <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row">
        
        {/* LEFT SIDE: Auth Form */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 lg:py-0 relative z-20">

          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md mx-auto lg:ml-0 lg:mr-auto mt-16 lg:mt-0"
          >
            {/* Card */}
            <div className="bg-nature-card/90 backdrop-blur-xl border border-brand-200/60 rounded-[2rem] p-8 sm:p-10 shadow-2xl shadow-brand-900/8 relative overflow-hidden">
              {/* Subtle ambient glow */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-300/30 rounded-full blur-[80px]"></div>

              {/* App Logo */}
              <div className="flex items-center justify-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-xl bg-brand-700 flex items-center justify-center shadow-md shadow-brand-900/15">
                  <div className="w-3.5 h-3.5 bg-brand-50 rounded-full"></div>
                </div>
                <span className="text-lg font-bold text-brand-900 tracking-wide">LearnSphere</span>
              </div>
              
              {/* Role Selector Pills */}
              <div className="flex p-1 bg-brand-100 rounded-2xl mb-8 border border-brand-200 relative">
                {(['learner', 'instructor'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`
                      relative flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-300
                      ${role === r ? 'text-brand-50' : 'text-brand-600 hover:text-brand-800'}
                    `}
                  >
                    {role === r && (
                      <motion.div
                        layoutId="activeRole"
                        className="absolute inset-0 bg-brand-700 shadow-md rounded-xl"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2 capitalize">
                      {getRoleIcon(r)}
                      {r}
                    </span>
                  </button>
                ))}
              </div>

              {/* Welcome Header */}
              <div className="mb-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={role + mode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-3xl font-bold text-brand-900 mb-2 tracking-tight">
                      {getWelcomeMessage()}
                    </h2>
                    <p className="text-brand-500 text-base leading-relaxed">
                      {getSubMessage()}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name fields for signup */}
                <AnimatePresence mode='popLayout'>
                  {mode === 'signup' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 mb-5">
                        <div className="flex-1">
                          <Input
                            id="firstName"
                            label="First name"
                            placeholder="Jane"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            id="lastName"
                            label="Last name"
                            placeholder="Doe"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Input
                  id="email"
                  label="Email address"
                  type="email"
                  placeholder="name@nature.com"
                  icon={<Mail size={18} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <div className="space-y-1">
                  <Input
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {mode === 'signup' && (
                    <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1.5 px-1">
                      {[
                        { test: password.length >= 8, label: '8+ chars' },
                        { test: /[a-z]/.test(password), label: 'lowercase' },
                        { test: /[A-Z]/.test(password), label: 'uppercase' },
                        { test: /[0-9]/.test(password), label: 'digit' },
                        { test: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password), label: 'special' },
                      ].map(r => (
                        <span key={r.label} className={`text-[11px] font-medium transition-colors duration-200 ${r.test ? 'text-green-600' : 'text-brand-400'}`}>
                          {r.test ? '✓' : '○'} {r.label}
                        </span>
                      ))}
                    </div>
                  )}
                  {mode === 'login' && !forgotMode && (
                    <div className="flex justify-end pt-1">
                      <button type="button" onClick={() => { setForgotMode(true); setForgotEmail(email); setMessage(null); }} className="text-sm text-brand-500 hover:text-brand-700 transition-colors font-medium">
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>

                {/* Forgot Password Inline Form */}
                <AnimatePresence>
                  {forgotMode && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 space-y-3">
                        <p className="text-sm text-brand-700 font-medium">Enter your email to receive a password reset link.</p>
                        <Input
                          id="forgotEmail"
                          type="email"
                          placeholder="name@nature.com"
                          icon={<Mail size={18} />}
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            className="rounded-2xl flex-1 py-2 text-sm font-bold"
                            isLoading={forgotLoading}
                            onClick={handleForgotPassword}
                          >
                            Send Reset Link
                          </Button>
                          <button
                            type="button"
                            onClick={() => { setForgotMode(false); setMessage(null); }}
                            className="px-4 py-2 text-sm text-brand-500 hover:text-brand-700 font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button 
                  type="submit" 
                  fullWidth
                  className="rounded-2xl mt-4 py-4 font-bold"
                  isLoading={isLoading}
                >
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </Button>

                {/* Guest Login - only in login mode */}
                {mode === 'login' && (
                  <>
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-brand-200"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-nature-card text-brand-400 uppercase tracking-wider font-semibold">or</span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      fullWidth
                      className="rounded-2xl py-3"
                      onClick={handleGuestLogin}
                    >
                      Continue as Guest
                    </Button>
                  </>
                )}

                {/* Status Message */}
                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex items-center gap-2 p-4 rounded-xl mt-4 ${
                        message.type === 'success' 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                      <span className="text-sm font-medium">{message.text}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Toggle Login/Signup */}
                <div className="mt-8 text-center">
                  <p className="text-brand-500">
                    {mode === 'login' ? "New here?" : 'Already a member?'}
                    <button
                      type="button"
                      onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(null); }}
                      className="ml-2 font-bold text-brand-700 hover:text-brand-900 transition-colors underline decoration-2 decoration-brand-300 hover:decoration-brand-500 underline-offset-4"
                    >
                      {mode === 'login' ? 'Sign up' : 'Log in'}
                    </button>
                  </p>
                </div>
              </form>
            </div>
            
            <div className="mt-8 text-center lg:text-left text-xs text-brand-500 font-medium">
              &copy; 2026 LearnSphere Inc. &bull; <span className="cursor-default">Privacy</span> &bull; <span className="cursor-default">Terms</span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE: Course Dome Gallery */}
        <div className="hidden lg:flex w-full lg:w-[55%] h-screen relative items-center justify-center overflow-hidden bg-gradient-to-r from-nature-light/50 via-brand-100 to-brand-200">
          {/* Fade in animation for the dome */}
          <motion.div
            className="w-full h-full absolute inset-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          >
            <DomeGallery
              overlayBlurColor="#e3e8dc"
              grayscale={true}
              fit={0.32}
              imageBorderRadius="12px"
              dragDampening={2}
              segments={25}
            />
          </motion.div>

          {/* Soft light vignette overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_#e3e8dc_100%)] pointer-events-none z-[5]"></div>

          {/* Seamless transition gradient from left */}
          <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-nature-light/95 via-nature-light/40 via-30% to-transparent to-50% z-10 pointer-events-none"></div>

          {/* Bottom label */}
          <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none z-[6] opacity-40">
            <p className="text-[10px] uppercase tracking-[0.25em] text-brand-600 font-medium">Explore Courses</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Shield, GraduationCap, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AuthMode, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { WorldGlobe } from '../components/visuals/WorldGlobe';

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
        await register(fullName, email, password, role);
        setMessage({ type: 'success', text: `Welcome, ${fullName}! Account created.` });
        setTimeout(() => navigate('/home'), 800);
      } else {
        await login(email, password);
        navigate('/home');
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
      case 'admin': return <Shield size={16} />;
      case 'instructor': return <GraduationCap size={16} />;
      case 'learner': return <Sparkles size={16} />;
    }
  };

  const getWelcomeMessage = () => {
    if (mode === 'signup') return 'Begin your path.';
    switch (role) {
      case 'admin': return 'System Control';
      case 'instructor': return 'Welcome back, Mentor.';
      case 'learner': return 'Continue your journey.';
      default: return 'Welcome Back';
    }
  };

  const getSubMessage = () => {
    if (mode === 'signup') return 'Create your account to start learning.';
    switch (role) {
      case 'admin': return 'Manage users and platform settings.';
      case 'instructor': return 'Your students await guidance.';
      case 'learner': return 'Ready to grow today?';
      default: return 'Enter your credentials to access your account.';
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans bg-nature-light selection:bg-brand-300/40 text-brand-900">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-nature-card via-nature-light to-brand-100"></div>

      <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row">
        <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 lg:py-0 relative z-20">
          <div className="absolute top-8 left-8 lg:left-12 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center shadow-lg shadow-brand-900/15">
              <div className="w-4 h-4 bg-brand-50 rounded-full"></div>
            </div>
            <span className="text-xl font-bold text-brand-900 tracking-wide">LearnSphere</span>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-md mx-auto lg:ml-0 lg:mr-auto mt-16 lg:mt-0"
          >
            <div className="bg-nature-card/90 backdrop-blur-xl border border-brand-200/60 rounded-[2rem] p-8 sm:p-10 shadow-2xl shadow-brand-900/8 relative overflow-hidden">
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-300/30 rounded-full blur-[80px]"></div>

              <div className="flex p-1 bg-brand-100 rounded-2xl mb-8 border border-brand-200 relative">
                {(['learner', 'instructor', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={
                      `relative flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                        role === r ? 'text-brand-50' : 'text-brand-600 hover:text-brand-800'
                      }`
                    }
                  >
                    {role === r && (
                      <motion.div
                        layoutId="activeRole"
                        className="absolute inset-0 bg-brand-700 shadow-md rounded-xl"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2 capitalize">
                      {getRoleIcon(r)}
                      {r}
                    </span>
                  </button>
                ))}
              </div>

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
                <AnimatePresence mode="popLayout">
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
                  {mode === 'login' && (
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        className="text-sm text-brand-500 hover:text-brand-700 transition-colors font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  fullWidth
                  className="rounded-2xl mt-4 py-4 font-bold"
                  isLoading={isLoading}
                >
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </Button>

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

                <div className="mt-8 text-center">
                  <p className="text-brand-500">
                    {mode === 'login' ? 'New here?' : 'Already a member?'}
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
              &copy; 2026 LearnSphere Inc. &bull; <a href="#" className="hover:text-brand-700 transition-colors">Privacy</a> &bull; <a href="#" className="hover:text-brand-700 transition-colors">Terms</a>
            </div>
          </motion.div>
        </div>

        <div className="hidden lg:flex w-full lg:w-[55%] h-screen relative items-center justify-center overflow-hidden">
          <motion.div
            className="w-full h-full absolute inset-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
          >
            <WorldGlobe />
          </motion.div>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_var(--tw-gradient-to))] to-nature-light pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 left-0 w-64 bg-gradient-to-r from-nature-light via-nature-light/70 to-transparent z-10 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Shield, GraduationCap, Sparkles, CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AuthMode, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { WorldGlobe } from '../components/visuals/WorldGlobe';
import { authAPI } from '../services/api';

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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const validatePasswordStrength = (pwd: string): string | null => {
    if (pwd.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(pwd)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(pwd)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pwd)) return 'Password must contain at least one special character';
    return null;
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
        const passwordError = validatePasswordStrength(password);
        if (passwordError) {
          setMessage({ type: 'error', text: passwordError });
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResetMessage(null);

    try {
      const response = await authAPI.forgotPassword(resetEmail);
      if (response.success) {
        // In development, show the token for testing
        if (response.data?.debug?.resetToken) {
          console.log('🔑 Password Reset Token:', response.data.debug.resetToken);
          console.log('⏰ Expires:', response.data.debug.expiresAt);
          setResetMessage({ 
            type: 'success', 
            text: `Reset token: ${response.data.debug.resetToken.slice(0, 20)}... (Check console for full token)` 
          });
        } else {
          setResetMessage({ type: 'success', text: 'Password reset link sent to your email!' });
        }
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetEmail('');
          setResetMessage(null);
        }, 5000);
      } else {
        setResetMessage({ type: 'error', text: response.message || 'Failed to send reset link' });
      }
    } catch (error: any) {
      setResetMessage({ type: 'error', text: error.message || 'Something went wrong' });
    } finally {
      setIsLoading(false);
    }
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
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-md mx-auto lg:ml-0 lg:mr-auto mt-16 lg:mt-0"
          >
            <div className="bg-nature-card/90 backdrop-blur-xl border border-brand-200/60 rounded-[2rem] p-8 sm:p-10 shadow-2xl shadow-brand-900/8 relative overflow-hidden">
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-300/30 rounded-full blur-[80px]"></div>

              <div className="flex justify-center gap-2 mb-6">
                {(['learner', 'instructor', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 flex items-center gap-1 ${
                      role === r
                        ? 'bg-brand-700 text-brand-50 shadow-md'
                        : 'bg-brand-100 text-brand-600 hover:bg-brand-200'
                    }`}
                  >
                    {getRoleIcon(r)}
                    <span className="capitalize">{r}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-brand-700 flex items-center justify-center shadow-lg shadow-brand-900/15">
                  <div className="w-5 h-5 bg-brand-50 rounded-full"></div>
                </div>
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
                  {mode === 'signup' && (
                    <div className="text-xs text-brand-500 pt-2 space-y-1">
                      <p className="font-medium">Password must contain:</p>
                      <ul className="list-disc list-inside space-y-0.5 ml-2">
                        <li className={password.length >= 8 ? 'text-green-600' : ''}>At least 8 characters</li>
                        <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>One uppercase letter</li>
                        <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>One lowercase letter</li>
                        <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>One number</li>
                        <li className={/[!@#$%^&*(),.?\":{}|<>]/.test(password) ? 'text-green-600' : ''}>One special character</li>
                      </ul>
                    </div>
                  )}
                  {mode === 'login' && (
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
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

        {/* Forgot Password Modal */}
        <AnimatePresence>
          {showForgotPassword && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setShowForgotPassword(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-nature-card rounded-3xl p-8 max-w-md w-full shadow-2xl border border-brand-200 relative"
              >
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="absolute top-4 right-4 text-brand-400 hover:text-brand-700 transition-colors"
                >
                  <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-brand-900 mb-2">Reset Password</h2>
                <p className="text-brand-500 mb-6">Enter your email and we'll send you a reset link.</p>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <Input
                    id="resetEmail"
                    label="Email address"
                    type="email"
                    placeholder="name@nature.com"
                    icon={<Mail size={18} />}
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />

                  <AnimatePresence>
                    {resetMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex items-center gap-2 p-4 rounded-xl ${
                          resetMessage.type === 'success'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {resetMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <span className="text-sm font-medium">{resetMessage.text}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    fullWidth
                    className="rounded-2xl py-4 font-bold"
                    isLoading={isLoading}
                  >
                    Send Reset Link
                  </Button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;

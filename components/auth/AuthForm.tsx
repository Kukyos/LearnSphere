import React, { useState } from 'react';
import { Mail, Shield, GraduationCap, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { AuthMode, AuthFormData, FormErrors, UserRole } from '../../types';
import { authAPI } from '../../services/api';

export const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<UserRole>('learner');
  const [formData, setFormData] = useState<AuthFormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (mode === 'signup') {
        // Combine first and last name
        const firstName = (formData as any).firstName || '';
        const lastName = (formData as any).lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();

        if (!fullName) {
          setMessage({ type: 'error', text: 'Please enter your name' });
          setIsLoading(false);
          return;
        }

        const response = await authAPI.register(
          fullName,
          formData.email || '',
          formData.password || '',
          role
        );

        if (response.success && response.data) {
          authAPI.saveToken(response.data.token);
          setMessage({ type: 'success', text: `Welcome, ${response.data.user.name}! Account created successfully.` });
        } else {
          setMessage({ type: 'error', text: response.message || 'Registration failed' });
        }
      } else {
        // Login
        const response = await authAPI.login(
          formData.email || '',
          formData.password || ''
        );

        if (response.success && response.data) {
          // Check if user's role matches the selected role
          if (response.data.user.role !== role) {
            setMessage({ 
              type: 'error', 
              text: `This account is registered as ${response.data.user.role}. Please select the correct role above.` 
            });
            setIsLoading(false);
            return;
          }
          
          authAPI.saveToken(response.data.token);
          setMessage({ type: 'success', text: `Welcome back, ${response.data.user.name}!` });
        } else {
          setMessage({ type: 'error', text: response.message || 'Login failed' });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
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
    if (mode === 'signup') return "Begin your path.";
    switch (role) {
      case 'admin': return "System Control";
      case 'instructor': return "Welcome back, Mentor.";
      case 'learner': return "Continue your journey.";
      default: return "Welcome Back";
    }
  };

  const getSubMessage = () => {
    if (mode === 'signup') return "Start your 30-day wellness trial today.";
    switch (role) {
      case 'admin': return "Manage users and wellness settings.";
      case 'instructor': return "Your students await guidance.";
      case 'learner': return "Ready to grow today?";
      default: return "Enter your credentials to access account.";
    }
  };

  return (
    <div className="w-full relative">
      
      {/* Role Selector Pills */}
      <div className="flex p-1 bg-brand-100 rounded-2xl mb-8 border border-brand-200 relative">
        {(['learner', 'instructor', 'admin'] as UserRole[]).map((r) => (
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

      <div className="mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={role + mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-3xl font-display font-bold text-brand-900 mb-2 tracking-tight">
              {getWelcomeMessage()}
            </h2>
            <p className="text-brand-500 text-base leading-relaxed">
              {getSubMessage()}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
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
                      value={(formData as any).firstName || ''}
                      onChange={handleInputChange}
                    />
                </div>
                <div className="flex-1">
                    <Input
                      id="lastName"
                      label="Last name"
                      placeholder="Doe"
                      value={(formData as any).lastName || ''}
                      onChange={handleInputChange}
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
          value={formData.email || ''}
          onChange={handleInputChange}
        />

        <div className="space-y-1">
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="ΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇó"
            value={formData.password || ''}
            onChange={handleInputChange}
          />
          {mode === 'login' && (
            <div className="flex justify-end pt-1">
              <button type="button" className="text-sm text-brand-500 hover:text-brand-700 transition-colors font-medium">
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

        <div className="mt-8 text-center">
          <p className="text-brand-500">
            {mode === 'login' ? "New here?" : 'Already a member?'}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="ml-2 font-bold text-brand-700 hover:text-brand-900 transition-colors underline decoration-2 decoration-brand-300 hover:decoration-brand-500 underline-offset-4"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

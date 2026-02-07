import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { authAPI } from '../services/api';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const validatePasswordStrength = (pwd: string): string | null => {
    if (pwd.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(pwd)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(pwd)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pwd)) return 'Password must contain at least one special character';
    return null;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!token) {
      setMessage({ type: 'error', text: 'Invalid or missing reset token' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    const passwordError = validatePasswordStrength(newPassword);
    if (passwordError) {
      setMessage({ type: 'error', text: passwordError });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.resetPassword(token, newPassword);
      if (response.success) {
        setMessage({ type: 'success', text: 'Password reset successful! Redirecting to login...' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to reset password' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Something went wrong' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden font-sans bg-nature-light text-brand-900">
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-nature-card via-nature-light to-brand-100"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="bg-nature-card rounded-3xl p-8 max-w-md w-full shadow-2xl border border-brand-200">
            <div className="flex items-center gap-2 mb-4 text-red-600">
              <AlertCircle size={24} />
              <h2 className="text-xl font-bold">Invalid Link</h2>
            </div>
            <p className="text-brand-600 mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Button
              fullWidth
              onClick={() => navigate('/login')}
              className="rounded-2xl py-3"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans bg-nature-light selection:bg-brand-300/40 text-brand-900">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-nature-card via-nature-light to-brand-100"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-nature-card/90 backdrop-blur-xl border border-brand-200/60 rounded-[2rem] p-8 sm:p-10 shadow-2xl w-full max-w-md"
        >
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-brand-700 flex items-center justify-center shadow-lg">
              <Mail size={24} className="text-brand-50" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">Reset Password</h1>
          <p className="text-brand-500 text-center mb-8">
            Enter your new password below
          </p>

          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <Input
                id="newPassword"
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              {newPassword && (
                <div className="text-xs text-brand-500 pt-2 space-y-1">
                  <ul className="list-disc list-inside space-y-0.5 ml-2">
                    <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                      At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                      One uppercase letter
                    </li>
                    <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : ''}>
                      One lowercase letter
                    </li>
                    <li className={/[0-9]/.test(newPassword) ? 'text-green-600' : ''}>
                      One number
                    </li>
                    <li className={/[!@#$%^&*(),.?\":{}|<>]/.test(newPassword) ? 'text-green-600' : ''}>
                      One special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex items-center gap-2 p-4 rounded-xl ${
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

            <Button
              type="submit"
              fullWidth
              className="rounded-2xl mt-6 py-4 font-bold"
              isLoading={isLoading}
            >
              Reset Password
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-brand-500 hover:text-brand-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;

export type AuthMode = 'login' | 'signup';

export type UserRole = 'learner' | 'instructor' | 'admin';

export interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface AuthFormData {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: UserRole;
}
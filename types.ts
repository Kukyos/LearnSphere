export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  difficulty: Difficulty;
  lessons: number;
  duration: string; // e.g., "4h 30m"
  rating: number;
  reviewCount: number;
  price: number; // 0 for free
  isPopular?: boolean;
  isNew?: boolean;
  enrollmentCount: number;
  accessType: 'Open' | 'Invite-only' | 'Paid';
  updatedAt: string;
}

export type ContentType = 'video' | 'article' | 'quiz';

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index of correct option
}

export interface Lesson {
  id: string;
  title: string;
  type: ContentType;
  duration: string;
  isCompleted: boolean;
  videoUrl?: string; // For video
  content?: string; // For article
  questions?: QuizQuestion[]; // For quiz
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface FilterState {
  searchQuery: string;
  categories: string[];
  difficulties: Difficulty[];
  priceRange: 'all' | 'free' | 'paid';
  minRating: number | null;
  duration: 'all' | 'short' | 'medium' | 'long';
}

export type SortOption = 'popularity' | 'rating' | 'newest' | 'price-low' | 'price-high';
// Authentication Types
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

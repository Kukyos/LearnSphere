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

export interface FilterState {
  searchQuery: string;
  categories: string[];
  difficulties: Difficulty[];
  priceRange: 'all' | 'free' | 'paid';
  minRating: number | null;
  duration: 'all' | 'short' | 'medium' | 'long';
}

export type SortOption = 'popularity' | 'rating' | 'newest' | 'price-low' | 'price-high';

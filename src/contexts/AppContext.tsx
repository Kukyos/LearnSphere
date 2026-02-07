import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';

// Types
export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  points: number;
  badge: string;
  enrolledCourses: string[];
  completedCourses: string[];
}

export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  tags: string[];
  rating: number;
  visibility: 'Everyone' | 'Signed In';
  access: 'Free' | 'Paid';
  price?: number;
  published: boolean;
  instructorId: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'image' | 'quiz';
  content: string;
  downloadAllowed?: boolean;
  attachments?: string[];
  quiz?: Quiz;
}

export interface Quiz {
  questions: QuizQuestion[];
  rewardRules: { attempt: number; points: number }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  quizAttempts?: number;
}

export interface CourseProgress {
  courseId: string;
  enrolledDate: string;
  completedDate?: string;
  lessonsProgress: LessonProgress[];
}

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  text: string;
  date: string;
}

interface AppContextType {
  user: AppUser | null;
  courses: Course[];
  userProgress: CourseProgress[];
  reviews: Review[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  enrollInCourse: (courseId: string) => void;
  completeLesson: (courseId: string, lessonId: string) => void;
  submitQuiz: (courseId: string, lessonId: string, attempt: number) => number;
  completeCourse: (courseId: string) => void;
  addReview: (courseId: string, rating: number, text: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Badge calculation
const getBadge = (points: number): string => {
  if (points >= 120) return 'Master';
  if (points >= 100) return 'Expert';
  if (points >= 80) return 'Specialist';
  if (points >= 60) return 'Achiever';
  if (points >= 40) return 'Explorer';
  if (points >= 20) return 'Newbie';
  return 'Beginner';
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: authUser, isLoggedIn } = useAuth();

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (document.documentElement.classList.contains('dark')) return 'dark';
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  const [userPoints, setUserPoints] = useState(35);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [completedCoursesState, setCompletedCoursesState] = useState<string[]>([]);
  const [userProgress, setUserProgress] = useState<CourseProgress[]>([]);
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      courseId: '1',
      userId: 'user2',
      userName: 'Sarah Johnson',
      rating: 5,
      text: 'Excellent course! Very comprehensive and well-structured.',
      date: '2026-01-15'
    },
    {
      id: '2',
      courseId: '1',
      userId: 'user3',
      userName: 'Mike Chen',
      rating: 4,
      text: 'Great content, learned a lot about React fundamentals.',
      date: '2026-01-20'
    }
  ]);

  // Sync theme with DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Derive user from AuthContext
  const user: AppUser | null = authUser ? {
    id: authUser.id,
    name: authUser.name,
    email: authUser.email,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.name)}&background=5c7f4c&color=fff`,
    points: userPoints,
    badge: getBadge(userPoints),
    enrolledCourses,
    completedCourses: completedCoursesState,
  } : null;

  // Mock courses data
  const [courses] = useState<Course[]>([
    {
      id: '1',
      title: 'Complete React Development',
      shortDescription: 'Master React from basics to advanced concepts',
      description: 'A comprehensive course covering React fundamentals, hooks, state management, and modern development practices.',
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
      tags: ['React', 'JavaScript', 'Frontend'],
      rating: 4.5,
      visibility: 'Everyone',
      access: 'Free',
      published: true,
      instructorId: 'inst1',
      lessons: [
        {
          id: 'l1',
          title: 'Introduction to React',
          description: 'Learn the basics of React and its component-based architecture',
          type: 'video',
          content: 'https://www.youtube.com/embed/Tn6-PIqc4UM',
        },
        {
          id: 'l2',
          title: 'React Components Guide',
          description: 'Understanding functional and class components',
          type: 'document',
          content: '# React Components\n\nReact components are the building blocks of any React application. They let you split the UI into independent, reusable pieces.\n\n## Functional Components\nFunctional components are JavaScript functions that accept props and return React elements.\n\n## Class Components\nClass components are ES6 classes that extend React.Component. They have a render method and can maintain their own state.\n\n## Key Concepts\n- Props are read-only inputs\n- State is managed within the component\n- Lifecycle methods control component behavior\n- Hooks provide state and lifecycle features to functional components',
          downloadAllowed: true,
        },
        {
          id: 'l3',
          title: 'React Hooks Deep Dive',
          description: 'Master useState, useEffect, and custom hooks',
          type: 'video',
          content: 'https://www.youtube.com/embed/TNhaISOUy6Q',
        },
        {
          id: 'l4',
          title: 'React Quiz',
          description: 'Test your React knowledge',
          type: 'quiz',
          content: '',
          quiz: {
            questions: [
              {
                id: 'q1',
                question: 'What is React?',
                options: ['A JavaScript library', 'A database', 'A CSS framework', 'A backend language'],
                correctAnswer: 0
              },
              {
                id: 'q2',
                question: 'Which hook is used for side effects?',
                options: ['useState', 'useEffect', 'useContext', 'useReducer'],
                correctAnswer: 1
              },
              {
                id: 'q3',
                question: 'What does JSX stand for?',
                options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'],
                correctAnswer: 0
              }
            ],
            rewardRules: [
              { attempt: 1, points: 15 },
              { attempt: 2, points: 10 },
              { attempt: 3, points: 5 }
            ]
          }
        }
      ]
    },
    {
      id: '2',
      title: 'Advanced TypeScript Patterns',
      shortDescription: 'Learn advanced TypeScript techniques and patterns',
      description: 'Deep dive into TypeScript generics, utility types, and advanced patterns for building type-safe applications.',
      coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop',
      tags: ['TypeScript', 'JavaScript', 'Programming'],
      rating: 4.8,
      visibility: 'Signed In',
      access: 'Free',
      published: true,
      instructorId: 'inst1',
      lessons: [
        {
          id: 'l5',
          title: 'TypeScript Generics',
          description: 'Understanding and using generics effectively',
          type: 'video',
          content: 'https://www.youtube.com/embed/EcCTIExsqmI',
        },
        {
          id: 'l6',
          title: 'Utility Types in TypeScript',
          description: 'Exploring built-in utility types',
          type: 'document',
          content: '# TypeScript Utility Types\n\nTypeScript provides several utility types to facilitate common type transformations.\n\n## Partial<T>\nMakes all properties optional.\n\n## Required<T>\nMakes all properties required.\n\n## Pick<T, K>\nPicks specific properties from a type.\n\n## Omit<T, K>\nRemoves specific properties from a type.\n\n## Record<K, V>\nCreates an object type with keys K and values V.',
          downloadAllowed: false,
        }
      ]
    },
    {
      id: '3',
      title: 'UI/UX Design Fundamentals',
      shortDescription: 'Create beautiful and intuitive user interfaces',
      description: 'Learn the principles of great UI/UX design, from color theory to user research.',
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop',
      tags: ['Design', 'UI/UX', 'Creative'],
      rating: 4.6,
      visibility: 'Everyone',
      access: 'Paid',
      price: 49.99,
      published: true,
      instructorId: 'inst2',
      lessons: [
        {
          id: 'l7',
          title: 'Design Principles',
          description: 'Core principles of effective design',
          type: 'video',
          content: 'https://www.youtube.com/embed/a5KYlHNKQB8',
        }
      ]
    },
    {
      id: '4',
      title: 'Node.js Backend Development',
      shortDescription: 'Build scalable backend applications',
      description: 'Learn to build robust APIs and backend services using Node.js and Express.',
      coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop',
      tags: ['Node.js', 'Backend', 'JavaScript'],
      rating: 4.4,
      visibility: 'Signed In',
      access: 'Free',
      published: true,
      instructorId: 'inst2',
      lessons: [
        {
          id: 'l8',
          title: 'Getting Started with Node.js',
          description: 'Introduction to Node.js and npm',
          type: 'video',
          content: 'https://www.youtube.com/embed/TlB_eWDSMt4',
        }
      ]
    }
  ]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const enrollInCourse = (courseId: string) => {
    if (!authUser) return;
    setEnrolledCourses(prev => [...prev, courseId]);
    setUserProgress(prev => [
      ...prev,
      {
        courseId,
        enrolledDate: new Date().toISOString(),
        lessonsProgress: []
      }
    ]);
  };

  const completeLesson = (courseId: string, lessonId: string) => {
    setUserProgress(prevProgress => {
      const courseProgress = prevProgress.find(p => p.courseId === courseId);
      if (!courseProgress) return prevProgress;

      const existingLesson = courseProgress.lessonsProgress.find(l => l.lessonId === lessonId);
      if (existingLesson) {
        return prevProgress.map(p =>
          p.courseId === courseId
            ? {
                ...p,
                lessonsProgress: p.lessonsProgress.map(l =>
                  l.lessonId === lessonId ? { ...l, completed: true } : l
                )
              }
            : p
        );
      } else {
        return prevProgress.map(p =>
          p.courseId === courseId
            ? {
                ...p,
                lessonsProgress: [...p.lessonsProgress, { lessonId, completed: true }]
              }
            : p
        );
      }
    });
  };

  const submitQuiz = (courseId: string, lessonId: string, attempt: number): number => {
    const course = courses.find(c => c.id === courseId);
    const lesson = course?.lessons.find(l => l.id === lessonId);
    const quiz = lesson?.quiz;

    if (!quiz || !authUser) return 0;

    const reward = quiz.rewardRules.find(r => r.attempt === attempt);
    const points = reward?.points || 0;

    setUserPoints(prev => prev + points);

    setUserProgress(prevProgress => {
      return prevProgress.map(p =>
        p.courseId === courseId
          ? {
              ...p,
              lessonsProgress: p.lessonsProgress.map(l =>
                l.lessonId === lessonId
                  ? { ...l, quizAttempts: attempt }
                  : l
              )
            }
          : p
      );
    });

    return points;
  };

  const completeCourse = (courseId: string) => {
    if (!authUser) return;
    setCompletedCoursesState(prev => [...prev, courseId]);
    setUserProgress(prevProgress =>
      prevProgress.map(p =>
        p.courseId === courseId
          ? { ...p, completedDate: new Date().toISOString() }
          : p
      )
    );
  };

  const addReview = (courseId: string, rating: number, text: string) => {
    if (!authUser) return;
    const newReview: Review = {
      id: Date.now().toString(),
      courseId,
      userId: authUser.id,
      userName: authUser.name,
      userAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.name)}&background=5c7f4c&color=fff`,
      rating,
      text,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [...prev, newReview]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        courses,
        userProgress,
        reviews,
        theme,
        toggleTheme,
        enrollInCourse,
        completeLesson,
        submitQuiz,
        completeCourse,
        addReview
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

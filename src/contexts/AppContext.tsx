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
  access: 'Open' | 'On Invitation' | 'On Payment';
  price?: number;
  published: boolean;
  instructorId: string;
  instructorName?: string;
  lessons: Lesson[];
  viewsCount?: number;
  totalDuration?: string;
  createdAt?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'image' | 'quiz';
  content: string;
  duration?: string;
  downloadAllowed?: boolean;
  attachments?: Attachment[];
  quiz?: Quiz;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'file' | 'link';
  url: string;
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
  timeSpent?: number;
}

export interface CourseProgress {
  courseId: string;
  enrolledDate: string;
  startDate?: string;
  completedDate?: string;
  lessonsProgress: LessonProgress[];
  userId: string;
  userName: string;
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

export interface ReportRow {
  srNo: number;
  courseName: string;
  participantName: string;
  enrolledDate: string;
  startDate: string;
  timeSpent: string;
  completion: number;
  completedDate: string;
  status: 'Yet to Start' | 'In Progress' | 'Completed';
}

interface AppContextType {
  user: AppUser | null;
  courses: Course[];
  userProgress: CourseProgress[];
  reviews: Review[];
  enrollInCourse: (courseId: string) => void;
  completeLesson: (courseId: string, lessonId: string) => void;
  submitQuiz: (courseId: string, lessonId: string, attempt: number) => number;
  completeCourse: (courseId: string) => void;
  addReview: (courseId: string, rating: number, text: string) => void;
  // Instructor CRUD
  createCourse: (title: string) => Course;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  // Reporting
  getReportData: () => { totalParticipants: number; yetToStart: number; inProgress: number; completed: number; rows: ReportRow[] };
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
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Complete React Development',
      shortDescription: 'Master React from basics to advanced concepts',
      description: 'A comprehensive course covering React fundamentals, hooks, state management, and modern development practices.',
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
      tags: ['React', 'JavaScript', 'Frontend'],
      rating: 4.5,
      visibility: 'Everyone',
      access: 'Open',
      published: true,
      instructorId: 'inst1',
      instructorName: 'Sarah Drasner',
      viewsCount: 1240,
      totalDuration: '4h 30m',
      createdAt: '2026-01-01',
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
      access: 'Open',
      published: true,
      instructorId: 'inst1',
      instructorName: 'Sarah Drasner',
      viewsCount: 860,
      totalDuration: '3h 15m',
      createdAt: '2026-01-05',
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
      access: 'On Payment',
      price: 49.99,
      published: true,
      instructorId: 'inst2',
      instructorName: 'Gary Simon',
      viewsCount: 2100,
      totalDuration: '6h 45m',
      createdAt: '2025-12-20',
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
      access: 'On Invitation',
      published: true,
      instructorId: 'inst2',
      instructorName: 'Gary Simon',
      viewsCount: 540,
      totalDuration: '5h 10m',
      createdAt: '2026-01-10',
      lessons: [
        {
          id: 'l8',
          title: 'Getting Started with Node.js',
          description: 'Introduction to Node.js and npm',
          type: 'video',
          content: 'https://www.youtube.com/embed/TlB_eWDSMt4',
        }
      ]
    },
    {
      id: '5',
      title: 'Python for Data Science',
      shortDescription: 'Analyze data and build ML models with Python',
      description: 'Learn Python fundamentals, pandas, numpy, and scikit-learn for data science and machine learning.',
      coverImage: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=450&fit=crop',
      tags: ['Python', 'Data Science', 'ML'],
      rating: 4.7,
      visibility: 'Everyone',
      access: 'Open',
      published: true,
      instructorId: 'inst1',
      instructorName: 'Sarah Drasner',
      viewsCount: 3200,
      totalDuration: '8h 20m',
      createdAt: '2025-12-15',
      lessons: [
        { id: 'l9', title: 'Python Basics', description: 'Variables, loops, and functions', type: 'video', content: 'https://www.youtube.com/embed/rfscVS0vtbw' },
        { id: 'l10', title: 'Pandas DataFrames', description: 'Working with tabular data', type: 'document', content: '# Pandas DataFrames\n\nDataFrames are 2D labeled data structures. Use `pd.read_csv()` to load data.', downloadAllowed: true },
        { id: 'l11', title: 'Python Quiz', description: 'Test your Python knowledge', type: 'quiz', content: '', quiz: { questions: [{ id: 'pq1', question: 'What is a DataFrame?', options: ['A 2D labeled data structure', 'A function', 'A loop', 'A class'], correctAnswer: 0 }, { id: 'pq2', question: 'Which library is used for numerical computing?', options: ['pandas', 'numpy', 'flask', 'django'], correctAnswer: 1 }], rewardRules: [{ attempt: 1, points: 10 }, { attempt: 2, points: 7 }, { attempt: 3, points: 3 }] } }
      ]
    },
    {
      id: '6',
      title: 'Digital Marketing Essentials',
      shortDescription: 'Master SEO, social media, and content marketing',
      description: 'A complete guide to digital marketing strategies including SEO, PPC, email marketing, and analytics.',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
      tags: ['Marketing', 'SEO', 'Business'],
      rating: 4.3,
      visibility: 'Everyone',
      access: 'On Payment',
      price: 29.99,
      published: true,
      instructorId: 'inst2',
      instructorName: 'Gary Simon',
      viewsCount: 1800,
      totalDuration: '5h 15m',
      createdAt: '2026-01-12',
      lessons: [
        { id: 'l12', title: 'SEO Fundamentals', description: 'Understanding search engine optimization', type: 'video', content: 'https://www.youtube.com/embed/DvwS7cV9GmQ' },
        { id: 'l13', title: 'Content Strategy Guide', description: 'Building an effective content strategy', type: 'document', content: '# Content Strategy\n\nA good content strategy aligns your content with business goals and audience needs.\n\n## Key Steps\n1. Define your audience\n2. Audit existing content\n3. Plan your content calendar\n4. Measure and iterate', downloadAllowed: true }
      ]
    }
  ]);

  // Mock enrollments for reporting (other users)
  const [allProgress, setAllProgress] = useState<CourseProgress[]>([
    { courseId: '1', enrolledDate: '2026-01-15', startDate: '2026-01-16', userId: 'user2', userName: 'Sarah Johnson', lessonsProgress: [{ lessonId: 'l1', completed: true }, { lessonId: 'l2', completed: true }, { lessonId: 'l3', completed: false }] },
    { courseId: '1', enrolledDate: '2026-01-18', startDate: '2026-01-20', completedDate: '2026-02-01', userId: 'user3', userName: 'Mike Chen', lessonsProgress: [{ lessonId: 'l1', completed: true }, { lessonId: 'l2', completed: true }, { lessonId: 'l3', completed: true }, { lessonId: 'l4', completed: true }] },
    { courseId: '2', enrolledDate: '2026-01-20', userId: 'user4', userName: 'Emily Davis', lessonsProgress: [] },
    { courseId: '1', enrolledDate: '2026-01-22', startDate: '2026-01-23', userId: 'user5', userName: 'Alex Rivera', lessonsProgress: [{ lessonId: 'l1', completed: true }] },
    { courseId: '3', enrolledDate: '2026-01-25', startDate: '2026-01-25', userId: 'user2', userName: 'Sarah Johnson', lessonsProgress: [{ lessonId: 'l7', completed: false }] },
    { courseId: '5', enrolledDate: '2026-01-28', startDate: '2026-01-29', completedDate: '2026-02-05', userId: 'user3', userName: 'Mike Chen', lessonsProgress: [{ lessonId: 'l9', completed: true }, { lessonId: 'l10', completed: true }, { lessonId: 'l11', completed: true }] },
  ]);

  // When an instructor/admin logs in, assign all mock courses to them
  // so they appear in the profile stats and dashboard
  useEffect(() => {
    if (authUser && (authUser.role === 'instructor' || authUser.role === 'admin')) {
      setCourses(prev => prev.map(c => {
        // Only reassign mock instructor IDs (inst1, inst2), not user-created courses
        if (c.instructorId === 'inst1' || c.instructorId === 'inst2') {
          return { ...c, instructorId: authUser.id, instructorName: authUser.name };
        }
        return c;
      }));
    }
  }, [authUser?.id, authUser?.role]);

  const enrollInCourse = (courseId: string) => {
    if (!authUser) return;
    setEnrolledCourses(prev => [...prev, courseId]);
    setUserProgress(prev => [
      ...prev,
      {
        courseId,
        enrolledDate: new Date().toISOString(),
        lessonsProgress: [],
        userId: authUser.id,
        userName: authUser.name,
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

  // Instructor CRUD
  const createCourse = (title: string): Course => {
    const newCourse: Course = {
      id: `c-${Date.now()}`,
      title,
      shortDescription: '',
      description: '',
      coverImage: '',
      tags: [],
      rating: 0,
      visibility: 'Everyone',
      access: 'Open',
      published: false,
      instructorId: authUser?.id || '',
      instructorName: authUser?.name || '',
      lessons: [],
      viewsCount: 0,
      totalDuration: '0h 0m',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCourses(prev => [...prev, newCourse]);
    return newCourse;
  };

  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, ...updates } : c));
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  // Reporting
  const getReportData = () => {
    const combined = [...allProgress, ...userProgress];
    const rows: ReportRow[] = combined.map((p, i) => {
      const course = courses.find(c => c.id === p.courseId);
      const totalLessons = course?.lessons.length || 1;
      const completedLessons = p.lessonsProgress.filter(l => l.completed).length;
      const completion = Math.round((completedLessons / totalLessons) * 100);
      const status: ReportRow['status'] = p.completedDate ? 'Completed' : p.startDate || p.lessonsProgress.length > 0 ? 'In Progress' : 'Yet to Start';
      return {
        srNo: i + 1,
        courseName: course?.title || 'Unknown',
        participantName: p.userName,
        enrolledDate: p.enrolledDate?.split('T')[0] || '',
        startDate: p.startDate?.split('T')[0] || '-',
        timeSpent: p.lessonsProgress.length > 0 ? `${p.lessonsProgress.length * 15}m` : '-',
        completion,
        completedDate: p.completedDate?.split('T')[0] || '-',
        status,
      };
    });
    return {
      totalParticipants: rows.length,
      yetToStart: rows.filter(r => r.status === 'Yet to Start').length,
      inProgress: rows.filter(r => r.status === 'In Progress').length,
      completed: rows.filter(r => r.status === 'Completed').length,
      rows,
    };
  };

  return (
    <AppContext.Provider
      value={{
        user,
        courses,
        userProgress,
        reviews,
        enrollInCourse,
        completeLesson,
        submitQuiz,
        completeCourse,
        addReview,
        createCourse,
        updateCourse,
        deleteCourse,
        getReportData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

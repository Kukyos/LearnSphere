import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_COURSES as LANDING_COURSES } from '../../constants';
import { Course as LandingCourse, Difficulty } from '../../types';

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
  // Display-only fields for landing/browse pages
  category?: string;
  difficulty?: string;
  enrollmentCount?: number;
  reviewCount?: number;
  isPopular?: boolean;
  isNew?: boolean;
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
  theme: 'light' | 'dark';
  toggleTheme: () => void;
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

/** Convert an AppContext Course back to the shape the Landing page CourseCard expects */
export function toDisplayCourse(c: Course): LandingCourse {
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    instructor: c.instructorName || '',
    thumbnailUrl: c.coverImage,
    category: c.category || 'Development',
    tags: c.tags,
    difficulty: (c.difficulty || 'Beginner') as Difficulty,
    lessons: c.lessons.length,
    duration: c.totalDuration || '0h',
    rating: c.rating,
    reviewCount: c.reviewCount || 0,
    price: c.price || 0,
    isPopular: c.isPopular,
    isNew: c.isNew,
    enrollmentCount: c.enrollmentCount || 0,
    accessType: c.access === 'On Payment' ? 'Paid' : c.access === 'On Invitation' ? 'Invite-only' : 'Open',
    updatedAt: c.createdAt || '',
  };
}

// Detailed lesson data for the first 6 courses (with quizzes, videos, docs)
const DETAILED_LESSONS: Record<string, Lesson[]> = {
  '1': [
    { id: 'l1', title: 'Introduction to React', description: 'Learn the basics of React', type: 'video', content: 'https://www.youtube.com/embed/Tn6-PIqc4UM' },
    { id: 'l2', title: 'React Components Guide', description: 'Understanding functional and class components', type: 'document', content: '# React Components\n\nReact components are the building blocks of any React application.\n\n## Functional Components\nFunctional components are JavaScript functions that accept props and return React elements.\n\n## Class Components\nClass components are ES6 classes that extend React.Component.', downloadAllowed: true },
    { id: 'l3', title: 'React Hooks Deep Dive', description: 'Master useState, useEffect, and custom hooks', type: 'video', content: 'https://www.youtube.com/embed/TNhaISOUy6Q' },
    { id: 'l4', title: 'React Quiz', description: 'Test your React knowledge', type: 'quiz', content: '', quiz: { questions: [{ id: 'q1', question: 'What is React?', options: ['A JavaScript library', 'A database', 'A CSS framework', 'A backend language'], correctAnswer: 0 }, { id: 'q2', question: 'Which hook is used for side effects?', options: ['useState', 'useEffect', 'useContext', 'useReducer'], correctAnswer: 1 }, { id: 'q3', question: 'What does JSX stand for?', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'], correctAnswer: 0 }], rewardRules: [{ attempt: 1, points: 15 }, { attempt: 2, points: 10 }, { attempt: 3, points: 5 }] } }
  ],
  '2': [
    { id: 'l5', title: 'Design Thinking Process', description: 'Learn the 5 stages of design thinking', type: 'video', content: 'https://www.youtube.com/embed/a5KYlHNKQB8' },
    { id: 'l6', title: 'UI Design Principles', description: 'Color theory, typography, and layout', type: 'document', content: '# UI Design Principles\n\n## Color Theory\nUnderstanding how colors interact and affect user perception.\n\n## Typography\nChoosing the right fonts for readability and hierarchy.\n\n## Layout\nGrid systems and spacing for clean, organized interfaces.', downloadAllowed: true }
  ],
  '3': [
    { id: 'l7', title: 'Python Basics for Data Science', description: 'Variables, loops, and functions', type: 'video', content: 'https://www.youtube.com/embed/rfscVS0vtbw' },
    { id: 'l8', title: 'Pandas DataFrames', description: 'Working with tabular data', type: 'document', content: '# Pandas DataFrames\n\nDataFrames are 2D labeled data structures.\n\n## Reading Data\nUse `pd.read_csv()` to load data.\n\n## Filtering\nUse boolean indexing to filter rows.', downloadAllowed: true },
    { id: 'l9', title: 'Data Science Quiz', description: 'Test your Python knowledge', type: 'quiz', content: '', quiz: { questions: [{ id: 'pq1', question: 'What is a DataFrame?', options: ['A 2D labeled data structure', 'A function', 'A loop', 'A class'], correctAnswer: 0 }, { id: 'pq2', question: 'Which library is used for numerical computing?', options: ['pandas', 'numpy', 'flask', 'django'], correctAnswer: 1 }], rewardRules: [{ attempt: 1, points: 10 }, { attempt: 2, points: 7 }, { attempt: 3, points: 3 }] } }
  ],
  '5': [
    { id: 'l10', title: 'Product Strategy Foundations', description: 'Building effective product strategies', type: 'video', content: 'https://www.youtube.com/embed/TlB_eWDSMt4' },
    { id: 'l11', title: 'Agile Methodology Guide', description: 'Scrum, Kanban, and agile practices', type: 'document', content: '# Agile Methodology\n\n## Scrum\nIterative framework with sprints.\n\n## Kanban\nVisual workflow management.\n\n## Key Principles\n- Continuous delivery\n- Embrace change\n- Customer collaboration', downloadAllowed: true }
  ],
  '6': [
    { id: 'l12', title: 'Microservices Architecture', description: 'Design patterns for distributed systems', type: 'video', content: 'https://www.youtube.com/embed/EcCTIExsqmI' },
    { id: 'l13', title: 'Docker & Kubernetes Guide', description: 'Container orchestration fundamentals', type: 'document', content: '# Docker & Kubernetes\n\n## Docker\nContainerize your applications.\n\n## Kubernetes\nOrchestrate containers at scale.', downloadAllowed: false }
  ],
  '8': [
    { id: 'l14', title: 'Neural Networks Introduction', description: 'Understanding neural network architecture', type: 'video', content: 'https://www.youtube.com/embed/aircAruvnKk' },
    { id: 'l15', title: 'ML Quiz', description: 'Test your ML knowledge', type: 'quiz', content: '', quiz: { questions: [{ id: 'mq1', question: 'What is a neural network?', options: ['A computing system inspired by biological neural networks', 'A database', 'A web framework', 'A design tool'], correctAnswer: 0 }], rewardRules: [{ attempt: 1, points: 12 }, { attempt: 2, points: 8 }, { attempt: 3, points: 4 }] } }
  ],
};

/** Convert constants.ts courses into AppContext Course format */
function buildInitialCourses(): Course[] {
  return LANDING_COURSES.map(lc => ({
    id: lc.id,
    title: lc.title,
    shortDescription: lc.description.slice(0, 120),
    description: lc.description,
    coverImage: lc.thumbnailUrl,
    tags: lc.tags,
    rating: lc.rating,
    visibility: 'Everyone' as const,
    access: (lc.accessType === 'Paid' ? 'On Payment' : lc.accessType === 'Invite-only' ? 'On Invitation' : 'Open') as Course['access'],
    price: lc.price > 0 ? lc.price : undefined,
    published: true,
    instructorId: 'inst-' + lc.id,
    instructorName: lc.instructor,
    lessons: DETAILED_LESSONS[lc.id] || [
      { id: `${lc.id}-intro`, title: 'Course Introduction', description: `Welcome to ${lc.title}`, type: 'video' as const, content: '' },
    ],
    viewsCount: lc.enrollmentCount,
    totalDuration: lc.duration,
    createdAt: lc.updatedAt,
    category: lc.category,
    difficulty: lc.difficulty,
    enrollmentCount: lc.enrollmentCount,
    reviewCount: lc.reviewCount,
    isPopular: lc.isPopular,
    isNew: lc.isNew,
  }));
}

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

  // Mock courses data — seeded from constants.ts with detailed lessons for select courses
  const [courses, setCourses] = useState<Course[]>(buildInitialCourses);

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
        theme,
        toggleTheme,
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

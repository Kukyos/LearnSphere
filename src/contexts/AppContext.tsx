import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  isBackendAvailable,
  apiListCourses,
  apiCreateCourse,
  apiUpdateCourse as apiUpdateCourseReq,
  apiDeleteCourse as apiDeleteCourseReq,
  apiEnroll,
  apiCompleteLesson as apiCompleteLessonReq,
  apiAddReview as apiAddReviewReq,
  apiGetReporting,
  apiAwardPoints,
  apiGetReviews,
  apiGetMyEnrollments,
  type ApiCourse,
} from '../../services/api';

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
  enrollInCourse: (courseId: string) => void;
  completeLesson: (courseId: string, lessonId: string) => void;
  submitQuiz: (courseId: string, lessonId: string, attempt: number) => number;
  completeCourse: (courseId: string) => void;
  addReview: (courseId: string, rating: number, text: string) => void;
  createCourse: (title: string) => Course;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
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

/** Convert a backend API course to our local Course shape */
function apiCourseToLocal(ac: ApiCourse): Course {
  return {
    id: String(ac.id),
    title: ac.title,
    shortDescription: ac.short_description || '',
    description: ac.description || '',
    coverImage: ac.cover_image || '',
    tags: ac.tags || [],
    rating: Number(ac.rating) || 0,
    visibility: (ac.visibility as Course['visibility']) || 'Everyone',
    access: (ac.access as Course['access']) || 'Open',
    price: Number(ac.price) || 0,
    published: ac.published,
    instructorId: String(ac.instructor_id),
    instructorName: ac.instructor_name || '',
    lessons: (ac.lessons || []).map(l => ({
      id: String(l.id),
      title: l.title,
      description: l.description || '',
      type: l.type as Lesson['type'],
      content: l.content || '',
      duration: l.duration || '',
      downloadAllowed: l.download_allowed,
      quiz: l.quiz ? {
        questions: l.quiz.questions.map(q => ({
          id: String(q.id),
          question: q.text,
          options: q.options,
          correctAnswer: q.correct_answer,
        })),
        rewardRules: [{ attempt: 1, points: 10 }, { attempt: 2, points: 5 }, { attempt: 3, points: 2 }],
      } : undefined,
    })),
    viewsCount: ac.views_count || 0,
    totalDuration: ac.total_duration || '',
    createdAt: ac.created_at,
    category: ac.category || '',
    difficulty: ac.difficulty || 'Beginner',
    enrollmentCount: Number(ac.enrollment_count) || 0,
    reviewCount: Number(ac.review_count) || 0,
  };
}

/** Convert an AppContext Course back to the shape the Landing page CourseCard expects */
export function toDisplayCourse(c: Course): any {
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    instructor: c.instructorName || '',
    thumbnailUrl: c.coverImage,
    category: c.category || 'Development',
    tags: c.tags,
    difficulty: c.difficulty || 'Beginner',
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

  const [userPoints, setUserPoints] = useState(0);

  // Sync points from backend when authenticated user changes
  useEffect(() => {
    if (authUser?.points && authUser.points > 0) {
      setUserPoints(authUser.points);
    }
  }, [authUser?.id]);

  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [completedCoursesState, setCompletedCoursesState] = useState<string[]>([]);
  const [userProgress, setUserProgress] = useState<CourseProgress[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Derive user from AuthContext
  const user: AppUser | null = authUser ? {
    id: authUser.id,
    name: authUser.name,
    email: authUser.email,
    avatar: authUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.name)}&background=5c7f4c&color=fff`,
    points: userPoints,
    badge: getBadge(userPoints),
    enrolledCourses,
    completedCourses: completedCoursesState,
  } : null;

  // Courses � starts empty, populated from backend
  const [courses, setCourses] = useState<Course[]>([]);

  //  Fetch courses from backend 
  useEffect(() => {
    const fetchFromBackend = async () => {
      const online = await isBackendAvailable();
      if (!online) return;
      const res = await apiListCourses();
      if (res.success && res.data?.courses?.length) {
        const mapped: Course[] = res.data.courses.map(apiCourseToLocal);
        setCourses(prev => {
          const backendIds = new Set(mapped.map(c => c.id));
          const remaining = prev.filter(c => !backendIds.has(c.id));
          return [...mapped, ...remaining];
        });
      }
    };
    fetchFromBackend();
  }, [authUser?.id]);

  // Hydrate enrollments, progress, and reviews from backend on login/refresh
  useEffect(() => {
    if (!authUser || !isLoggedIn) return;
    const hydrate = async () => {
      const online = await isBackendAvailable();
      if (!online) return;

      // Fetch enrollments + per-enrollment lesson progress
      const enrollRes = await apiGetMyEnrollments();
      if (enrollRes.success && enrollRes.data?.enrollments) {
        const enrollments = enrollRes.data.enrollments;
        const enrolledIds = enrollments.map((e: any) => String(e.course_id));
        const completedIds = enrollments
          .filter((e: any) => e.completed_date)
          .map((e: any) => String(e.course_id));

        setEnrolledCourses(enrolledIds);
        setCompletedCoursesState(completedIds);

        // Build progress from each enrollment's lessons_progress
        const progressList: CourseProgress[] = enrollments.map((e: any) => ({
          courseId: String(e.course_id),
          enrolledDate: e.enrolled_date || '',
          completedDate: e.completed_date || undefined,
          lessonsProgress: (e.lessons_progress || []).map((lp: any) => ({
            lessonId: String(lp.lesson_id),
            completed: lp.completed,
          })),
          userId: String(authUser.id),
          userName: authUser.name,
        }));
        setUserProgress(progressList);
      }

      // Fetch reviews for all courses the user can see
      // We load reviews per-course as they're viewed; here load for enrolled courses
      // Actually, let's fetch all reviews for enrolled courses
      if (enrollRes.success && enrollRes.data?.enrollments) {
        const allReviews: Review[] = [];
        for (const e of enrollRes.data.enrollments) {
          const revRes = await apiGetReviews(e.course_id);
          if (revRes.success && revRes.data?.reviews) {
            for (const r of revRes.data.reviews) {
              allReviews.push({
                id: String(r.id),
                courseId: String(r.course_id),
                userId: String(r.user_id),
                userName: r.user_name || '',
                userAvatar: r.user_avatar || '',
                rating: r.rating,
                text: r.comment || '',
                date: r.created_at?.split('T')[0] || '',
              });
            }
          }
        }
        if (allReviews.length > 0) setReviews(allReviews);
      }
    };
    hydrate();
  }, [authUser?.id, isLoggedIn]);

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
    isBackendAvailable().then(ok => { if (ok) apiEnroll(courseId); });
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
    isBackendAvailable().then(ok => { if (ok) apiCompleteLessonReq(courseId, lessonId); });
  };

  const submitQuiz = (courseId: string, lessonId: string, attempt: number): number => {
    const course = courses.find(c => c.id === courseId);
    const lesson = course?.lessons.find(l => l.id === lessonId);
    const quiz = lesson?.quiz;

    if (!quiz || !authUser) return 0;

    const reward = quiz.rewardRules.find(r => r.attempt === attempt);
    const points = reward?.points || 0;

    setUserPoints(prev => prev + points);
    if (points > 0) {
      isBackendAvailable().then(ok => { if (ok) apiAwardPoints(points); });
    }

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
    isBackendAvailable().then(ok => { if (ok) apiAddReviewReq(courseId, rating, text); });
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
    isBackendAvailable().then(async (ok) => {
      if (!ok) return;
      const res = await apiCreateCourse({
        title,
        short_description: '',
        description: '',
        cover_image: '',
        tags: [],
        published: false,
      } as any);
      if (res.success && res.data?.course) {
        const backendId = String(res.data.course.id);
        setCourses(prev => prev.map(c => c.id === newCourse.id ? { ...c, id: backendId } : c));
      }
    });
    return newCourse;
  };

  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, ...updates } : c));
    isBackendAvailable().then(ok => {
      if (ok) apiUpdateCourseReq(courseId, {
        title: updates.title,
        short_description: updates.shortDescription,
        description: updates.description,
        cover_image: updates.coverImage,
        tags: updates.tags,
        visibility: updates.visibility,
        access: updates.access,
        price: updates.price,
        published: updates.published,
        category: updates.category,
        difficulty: updates.difficulty,
        total_duration: updates.totalDuration,
      } as any);
    });
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    isBackendAvailable().then(ok => { if (ok) apiDeleteCourseReq(courseId); });
  };

  // Reporting � uses real session data only (no mock data)
  const getReportData = () => {
    const rows: ReportRow[] = userProgress.map((p, i) => {
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

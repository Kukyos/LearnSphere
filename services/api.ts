// ============================================================
// LearnSphere API Service
// Talks to the Express backend. Falls back to mock when backend
// is unavailable so the app still works for demo/hackathon.
// ============================================================

const API_BASE = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || '/api';

// ── Helpers ──────────────────────────────────────────────────

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

let _backendAvailable: boolean | null = null;

/**
 * One-time check whether the backend is reachable.
 * Cached so we don't spam /health.
 */
export async function isBackendAvailable(): Promise<boolean> {
  if (_backendAvailable !== null) return _backendAvailable;
  try {
    const r = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
    _backendAvailable = r.ok;
  } catch {
    _backendAvailable = false;
  }
  return _backendAvailable;
}

/** Re-check (e.g. after user changes settings). */
export function resetBackendCheck() {
  _backendAvailable = null;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  const token = localStorage.getItem('ls_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    return await res.json();
  } catch (err) {
    console.warn('[api] request failed:', endpoint, err);
    return { success: false, message: 'Network error – backend may be offline.' };
  }
}

// ── Token management ─────────────────────────────────────────

export function saveToken(token: string) {
  localStorage.setItem('ls_token', token);
}
export function getToken(): string | null {
  return localStorage.getItem('ls_token');
}
export function removeToken() {
  localStorage.removeItem('ls_token');
}

// ── Auth ─────────────────────────────────────────────────────

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  points?: number;
  badge?: string;
  createdAt?: string;
}

interface AuthPayload {
  user: ApiUser;
  token: string;
}

export async function apiRegister(
  name: string,
  email: string,
  password: string,
  role = 'learner',
): Promise<ApiResponse<AuthPayload>> {
  return request<AuthPayload>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  });
}

export async function apiLogin(
  email: string,
  password: string,
): Promise<ApiResponse<AuthPayload>> {
  return request<AuthPayload>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function apiForgotPassword(
  email: string,
): Promise<ApiResponse<{ resetToken?: string }>> {
  return request('/auth/forgot', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function apiResetPassword(
  token: string,
  newPassword: string,
): Promise<ApiResponse<void>> {
  return request('/auth/reset', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}

export async function apiGetProfile(): Promise<ApiResponse<{ user: ApiUser }>> {
  return request('/auth/me');
}

// ── Courses ──────────────────────────────────────────────────

export interface ApiCourse {
  id: number;
  title: string;
  short_description: string;
  description: string;
  cover_image: string;
  tags: string[];
  rating: number;
  visibility: string;
  access: string;
  price: number;
  published: boolean;
  instructor_id: number;
  instructor_name: string;
  category: string;
  difficulty: string;
  views_count: number;
  total_duration: string;
  enrollment_count: number;
  review_count: number;
  lessons: ApiLesson[];
  reviews?: ApiReview[];
  created_at: string;
  updated_at: string;
}

export interface ApiLesson {
  id: number;
  course_id: number;
  title: string;
  description: string;
  type: string;
  content: string;
  duration: string;
  download_allowed: boolean;
  sort_order: number;
  quiz?: { questions: ApiQuizQuestion[] };
}

export interface ApiQuizQuestion {
  id: number;
  lesson_id: number;
  text: string;
  options: string[];
  correct_answer: number;
}

export interface ApiReview {
  id: number;
  user_id: number;
  course_id: number;
  rating: number;
  comment: string;
  user_name: string;
  user_avatar: string;
  created_at: string;
}

export async function apiListCourses(): Promise<ApiResponse<{ courses: ApiCourse[] }>> {
  return request('/courses');
}

export async function apiGetCourse(id: string | number): Promise<ApiResponse<{ course: ApiCourse }>> {
  return request(`/courses/${id}`);
}

export async function apiCreateCourse(data: Partial<ApiCourse>): Promise<ApiResponse<{ course: ApiCourse }>> {
  return request('/courses', {
    method: 'POST',
    body: JSON.stringify({
      title: data.title,
      shortDescription: data.short_description,
      description: data.description,
      coverImage: data.cover_image,
      tags: data.tags,
      visibility: data.visibility,
      access: data.access,
      price: data.price,
      published: data.published,
      category: data.category,
      difficulty: data.difficulty,
      totalDuration: data.total_duration,
    }),
  });
}

export async function apiUpdateCourse(
  id: string | number,
  data: Partial<ApiCourse>,
): Promise<ApiResponse<{ course: ApiCourse }>> {
  return request(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      title: data.title,
      shortDescription: data.short_description,
      description: data.description,
      coverImage: data.cover_image,
      tags: data.tags,
      visibility: data.visibility,
      access: data.access,
      price: data.price,
      published: data.published,
      category: data.category,
      difficulty: data.difficulty,
      totalDuration: data.total_duration,
    }),
  });
}

export async function apiDeleteCourse(id: string | number): Promise<ApiResponse<void>> {
  return request(`/courses/${id}`, { method: 'DELETE' });
}

// ── Lessons ──────────────────────────────────────────────────

export async function apiAddLesson(
  courseId: string | number,
  data: Partial<ApiLesson>,
): Promise<ApiResponse<{ lesson: ApiLesson }>> {
  return request(`/courses/${courseId}/lessons`, {
    method: 'POST',
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      type: data.type,
      content: data.content,
      duration: data.duration,
      downloadAllowed: data.download_allowed,
    }),
  });
}

export async function apiUpdateLesson(
  courseId: string | number,
  lessonId: string | number,
  data: Partial<ApiLesson>,
): Promise<ApiResponse<{ lesson: ApiLesson }>> {
  return request(`/courses/${courseId}/lessons/${lessonId}`, {
    method: 'PUT',
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      type: data.type,
      content: data.content,
      duration: data.duration,
      downloadAllowed: data.download_allowed,
      sortOrder: data.sort_order,
    }),
  });
}

export async function apiDeleteLesson(
  courseId: string | number,
  lessonId: string | number,
): Promise<ApiResponse<void>> {
  return request(`/courses/${courseId}/lessons/${lessonId}`, { method: 'DELETE' });
}

// ── Enrollment ───────────────────────────────────────────────

export async function apiEnroll(courseId: string | number): Promise<ApiResponse<void>> {
  return request(`/api/enroll/${courseId}`, { method: 'POST' });
}

export async function apiGetMyEnrollments(): Promise<ApiResponse<{ enrollments: any[] }>> {
  return request('/api/enroll/my');
}

// ── Progress ─────────────────────────────────────────────────

export async function apiCompleteLesson(
  courseId: string | number,
  lessonId: string | number,
): Promise<ApiResponse<void>> {
  return request('/api/progress/lesson', {
    method: 'POST',
    body: JSON.stringify({ courseId, lessonId }),
  });
}

export async function apiGetCourseProgress(
  courseId: string | number,
): Promise<ApiResponse<{ enrolled: boolean; enrollment: any; lessonsProgress: any[] }>> {
  return request(`/api/progress/${courseId}`);
}

// ── Reviews ──────────────────────────────────────────────────

export async function apiAddReview(
  courseId: string | number,
  rating: number,
  comment: string,
): Promise<ApiResponse<{ review: ApiReview }>> {
  return request('/api/reviews', {
    method: 'POST',
    body: JSON.stringify({ courseId, rating, comment }),
  });
}

export async function apiGetReviews(
  courseId: string | number,
): Promise<ApiResponse<{ reviews: ApiReview[] }>> {
  return request(`/api/reviews/${courseId}`);
}

// ── Reporting ────────────────────────────────────────────────

export interface ReportingData {
  totalCourses: number;
  publishedCourses: number;
  totalParticipants: number;
  completed: number;
  averageRating: number;
}

export async function apiGetReporting(): Promise<ApiResponse<ReportingData>> {
  return request('/api/reporting');
}

// ── Points ───────────────────────────────────────────────────

export async function apiAwardPoints(
  points: number,
): Promise<ApiResponse<{ points: number; badge: string }>> {
  return request('/api/points/award', {
    method: 'POST',
    body: JSON.stringify({ points }),
  });
}

// ── Profile management ───────────────────────────────────────

export async function apiUpdateProfile(
  data: { name?: string; avatar?: string },
): Promise<ApiResponse<{ user: ApiUser }>> {
  return request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function apiChangePassword(
  currentPassword: string,
  newPassword: string,
): Promise<ApiResponse<void>> {
  return request('/auth/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

// ── Admin: user management ───────────────────────────────────

export async function apiListUsers(): Promise<ApiResponse<{ users: ApiUser[] }>> {
  return request('/auth/users');
}

export async function apiUpdateUserRole(
  userId: number | string,
  role: string,
): Promise<ApiResponse<{ user: ApiUser }>> {
  return request(`/auth/users/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  });
}

export async function apiDeleteUser(
  userId: number | string,
): Promise<ApiResponse<void>> {
  return request(`/auth/users/${userId}`, { method: 'DELETE' });
}

// ── Email / Invitations ──────────────────────────────────────

export async function apiInviteToCourse(
  courseId: string | number,
  emails: string[],
): Promise<ApiResponse<{ sent: string[]; failed: string[] }>> {
  return request(`/courses/${courseId}/invite`, {
    method: 'POST',
    body: JSON.stringify({ emails }),
  });
}

export async function apiContactAttendees(
  courseId: string | number,
  subject: string,
  message: string,
): Promise<ApiResponse<{ sent: string[]; failed: string[] }>> {
  return request(`/courses/${courseId}/contact`, {
    method: 'POST',
    body: JSON.stringify({ subject, message }),
  });
}

// ── Quiz questions ───────────────────────────────────────────

export async function apiSetQuizQuestions(
  courseId: string | number,
  lessonId: string | number,
  questions: { text: string; options: string[]; correctAnswer: number }[],
): Promise<ApiResponse<{ questions: ApiQuizQuestion[] }>> {
  return request(`/courses/${courseId}/lessons/${lessonId}/quiz`, {
    method: 'POST',
    body: JSON.stringify({ questions }),
  });
}

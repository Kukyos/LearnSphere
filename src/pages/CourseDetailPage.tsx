import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Star, BookOpen, Clock, Users, ChevronRight, CheckCircle, Lock, Play, FileText, HelpCircle, ArrowLeft } from 'lucide-react';

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, courses, userProgress, reviews, enrollInCourse, addReview } = useApp();
  const { user: authUser, isLoggedIn } = useAuth();
  const isGuest = authUser?.role === 'guest' || !isLoggedIn;
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'reviews'>('overview');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center bg-nature-light">
        <div className="text-center">
          <BookOpen className="mx-auto mb-4 text-brand-400" size={64} />
          <h2 className="text-2xl font-bold mb-2 text-brand-900">Course Not Found</h2>
          <p className="mb-4 text-brand-500">This course is coming soon!</p>
          <button onClick={() => navigate('/explore')} className="px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors">
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const isEnrolled = user?.enrolledCourses.includes(course.id) || false;
  const isCompleted = user?.completedCourses.includes(course.id) || false;
  const courseProgress = userProgress.find(p => p.courseId === course.id);
  const completedLessons = courseProgress?.lessonsProgress.filter(l => l.completed).length || 0;
  const progressPct = course.lessons.length > 0 ? Math.round((completedLessons / course.lessons.length) * 100) : 0;
  const courseReviews = reviews.filter(r => r.courseId === course.id);
  const avgRating = courseReviews.length > 0 ? (courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length).toFixed(1) : course.rating.toFixed(1);

  const isLessonCompleted = (lessonId: string) =>
    courseProgress?.lessonsProgress.some(l => l.lessonId === lessonId && l.completed) || false;

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play size={18} />;
      case 'document': return <FileText size={18} />;
      case 'quiz': return <HelpCircle size={18} />;
      default: return <BookOpen size={18} />;
    }
  };

  const handleEnroll = () => {
    if (!user || isGuest) {
      navigate('/login');
      return;
    }
    enrollInCourse(course.id);
  };

  const handleSubmitReview = () => {
    if (!reviewText.trim()) return;
    addReview(course.id, reviewRating, reviewText);
    setReviewText('');
    setReviewRating(5);
  };

  return (
    <div className="min-h-screen bg-nature-light">
      {/* Hero Banner */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 max-w-4xl mx-auto">
          <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-white/80 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex flex-wrap gap-2 mb-3">
            {course.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-600/80 text-white">{tag}</span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{course.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1"><Star className="text-yellow-400" size={16} fill="currentColor" /> {avgRating}</span>
            <span className="flex items-center gap-1"><BookOpen size={16} /> {course.lessons.length} lessons</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${course.access === 'Free' ? 'bg-green-500/80' : 'bg-yellow-500/80'} text-white`}>
              {course.access === 'Free' ? 'Free' : `$${course.price}`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        {/* Progress Bar (if enrolled) */}
        {isEnrolled && (
          <div className="rounded-2xl p-6 mb-8 bg-white shadow-lg border border-brand-200">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-brand-900">
                {isCompleted ? '🎉 Course Completed!' : 'Your Progress'}
              </span>
              <span className="text-sm font-semibold text-brand-600">
                {completedLessons}/{course.lessons.length} lessons • {progressPct}%
              </span>
            </div>
            <div className="w-full bg-brand-200 rounded-full h-3">
              <div className={`h-3 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-brand-500'}`} style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}

        {/* Enroll Button */}
        {!isEnrolled && (
          <div className="mb-8">
            <button
              onClick={handleEnroll}
              className="w-full sm:w-auto px-8 py-4 bg-brand-600 text-white rounded-xl text-lg font-bold hover:bg-brand-700 transition-all hover:shadow-lg active:scale-95"
            >
              {isGuest ? 'Sign In to Enroll' : 'Enroll Now — Start Learning'}
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-8 bg-brand-50 border border-brand-200">
          {(['overview', 'lessons', 'reviews'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all capitalize ${
                activeTab === tab
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-brand-500 hover:text-brand-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-brand-900">About This Course</h2>
            <p className="text-lg leading-relaxed mb-8 text-brand-600">{course.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl text-center bg-white shadow border border-brand-100">
                <BookOpen className="mx-auto mb-2 text-brand-500" size={24} />
                <p className="font-bold text-brand-900">{course.lessons.length}</p>
                <p className="text-xs text-brand-500">Lessons</p>
              </div>
              <div className="p-4 rounded-xl text-center bg-white shadow border border-brand-100">
                <Star className="mx-auto mb-2 text-yellow-500" size={24} fill="currentColor" />
                <p className="font-bold text-brand-900">{avgRating}</p>
                <p className="text-xs text-brand-500">Rating</p>
              </div>
              <div className="p-4 rounded-xl text-center bg-white shadow border border-brand-100">
                <Users className="mx-auto mb-2 text-brand-500" size={24} />
                <p className="font-bold text-brand-900">{courseReviews.length}</p>
                <p className="text-xs text-brand-500">Reviews</p>
              </div>
              <div className="p-4 rounded-xl text-center bg-white shadow border border-brand-100">
                <Clock className="mx-auto mb-2 text-brand-500" size={24} />
                <p className="font-bold text-brand-900">{course.access}</p>
                <p className="text-xs text-brand-500">Access</p>
              </div>
            </div>
          </div>
        )}

        {/* Lessons Tab */}
        {activeTab === 'lessons' && (
          <div className="space-y-3">
            {course.lessons.map((lesson, index) => {
              const completed = isLessonCompleted(lesson.id);
              const canAccess = isEnrolled;
              return (
                <div
                  key={lesson.id}
                  onClick={() => canAccess && navigate(`/lesson/${course.id}/${lesson.id}`)}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${canAccess ? 'cursor-pointer' : 'opacity-60'}
                    ${completed
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-white hover:bg-brand-50 border border-brand-100'
                    } shadow`}
                >
                  <div className={`flex-none w-10 h-10 rounded-full flex items-center justify-center ${
                    completed
                      ? 'bg-green-500 text-white'
                      : 'bg-brand-100 text-brand-600'
                  }`}>
                    {completed ? <CheckCircle size={20} /> : canAccess ? getLessonIcon(lesson.type) : <Lock size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-brand-900">
                      {index + 1}. {lesson.title}
                    </p>
                    <p className="text-sm truncate text-brand-500">{lesson.description}</p>
                  </div>
                  <div className="flex-none flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      lesson.type === 'video' ? 'bg-blue-50 text-blue-600' :
                      lesson.type === 'document' ? 'bg-purple-50 text-purple-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>{lesson.type}</span>
                    {canAccess && <ChevronRight className="text-brand-500" size={20} />}
                  </div>
                </div>
              );
            })}
            {!isEnrolled && (
              <div className="text-center py-8 text-brand-400">
                <Lock className="mx-auto mb-2" size={32} />
                <p>Enroll in this course to access lessons</p>
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            {/* Submit Review */}
            {isEnrolled && user && (
              <div className="p-6 rounded-2xl mb-6 bg-white shadow border border-brand-200">
                <h3 className="font-bold mb-3 text-brand-900">Write a Review</h3>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setReviewRating(star)}>
                      <Star
                        size={24}
                        className={star <= reviewRating ? 'text-yellow-500' : 'text-brand-200'}
                        fill={star <= reviewRating ? 'currentColor' : 'none'}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl border resize-none bg-brand-50 border-brand-200 text-brand-900 placeholder-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Share your experience..."
                />
                <button
                  onClick={handleSubmitReview}
                  disabled={!reviewText.trim()}
                  className="mt-3 px-6 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50 transition-colors"
                >
                  Submit Review
                </button>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {courseReviews.map(review => (
                <div key={review.id} className="p-5 rounded-2xl bg-white shadow border border-brand-100">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={review.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&background=5c7f4c&color=fff`}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-brand-900">{review.userName}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? 'text-yellow-500' : 'text-brand-300'} fill={i < review.rating ? 'currentColor' : 'none'} />
                        ))}
                        <span className="text-xs ml-1 text-brand-400">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-brand-600">{review.text}</p>
                </div>
              ))}
              {courseReviews.length === 0 && (
                <p className="text-center py-8 text-brand-400">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;

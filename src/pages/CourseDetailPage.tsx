import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { CheckCircle, Circle, Star, Search, Award } from 'lucide-react';

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, user, userProgress, reviews, theme, enrollInCourse, completeCourse, addReview } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const navigate = useNavigate();

  const course = courses.find(c => c.id === courseId);
  const progress = userProgress.find(p => p.courseId === courseId);
  const courseReviews = reviews.filter(r => r.courseId === courseId);

  if (!course) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-brand-950' : 'bg-nature-light'}`}>
        <p className={`text-xl ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>
          Course not found
        </p>
      </div>
    );
  }

  const isEnrolled = user?.enrolledCourses.includes(course.id) || false;
  const isCompleted = user?.completedCourses.includes(course.id) || false;
  const completedLessons = progress?.lessonsProgress.filter(l => l.completed).length || 0;
  const totalLessons = course.lessons.length;
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const canComplete = isEnrolled && !isCompleted && completedLessons === totalLessons;

  const averageRating = courseReviews.length > 0
    ? courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length
    : course.rating;

  const filteredLessons = course.lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEnroll = () => {
    if (!user) {
      alert('Please sign in to enroll in this course');
      return;
    }
    if (course.access === 'Paid') {
      alert(`Payment required: $${course.price}`);
    }
    enrollInCourse(course.id);
  };

  const handleCompleteCourse = () => {
    if (canComplete) {
      completeCourse(course.id);
      alert('🎉 Congratulations! You have completed this course!');
    }
  };

  const handleSubmitReview = () => {
    if (!user) {
      alert('Please sign in to submit a review');
      return;
    }
    if (newReviewText.trim()) {
      addReview(course.id, newRating, newReviewText);
      setNewReviewText('');
      setNewRating(5);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress?.lessonsProgress.find(l => l.lessonId === lessonId)?.completed || false;
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-brand-950' : 'bg-nature-light'}`}>
      {/* Course Header */}
      <div
        className={`${theme === 'dark' ? 'bg-brand-900' : 'bg-white'} border-b ${
          theme === 'dark' ? 'border-brand-800' : 'border-brand-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img
                src={course.coverImage}
                alt={course.title}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h1 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
                {course.title}
              </h1>
              <p className={`text-lg mb-4 ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>
                {course.description}
              </p>
              <div className="flex items-center gap-2 mb-4">
                <Star className="text-yellow-500 fill-current" size={20} />
                <span className={`font-semibold ${theme === 'dark' ? 'text-brand-200' : 'text-brand-700'}`}>
                  {averageRating.toFixed(1)} / 5.0
                </span>
                <span className={`text-sm ${theme === 'dark' ? 'text-brand-400' : 'text-brand-500'}`}>
                  ({courseReviews.length} reviews)
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {course.tags.map(tag => (
                  <span
                    key={tag}
                    className={`px-3 py-1 rounded-full text-sm ${
                      theme === 'dark'
                        ? 'bg-brand-800 text-brand-200'
                        : 'bg-brand-100 text-brand-700'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {!isEnrolled ? (
                <button
                  onClick={handleEnroll}
                  className={`w-full sm:w-auto px-8 py-3 rounded-lg font-semibold transition-colors ${
                    course.access === 'Paid'
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-brand-900'
                      : 'bg-brand-500 hover:bg-brand-600 text-white'
                  }`}
                >
                  {course.access === 'Paid' ? `Buy Course - $${course.price}` : 'Enroll Now'}
                </button>
              ) : (
                <div className="space-y-4">
                  {isCompleted && (
                    <div className="flex items-center gap-2 text-green-500">
                      <Award size={24} />
                      <span className="font-semibold">Course Completed!</span>
                    </div>
                  )}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-brand-200' : 'text-brand-700'}`}>
                        Your Progress
                      </span>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-brand-200' : 'text-brand-700'}`}>
                        {completedLessons}/{totalLessons} Lessons • {Math.round(progressPercent)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-brand-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                  {canComplete && (
                    <button
                      onClick={handleCompleteCourse}
                      className="w-full sm:w-auto px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
                    >
                      Complete This Course
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex gap-4 mb-6 border-b border-brand-300 dark:border-brand-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-brand-500 text-brand-500'
                : theme === 'dark'
                ? 'border-transparent text-brand-400 hover:text-brand-200'
                : 'border-transparent text-brand-600 hover:text-brand-900'
            }`}
          >
            Course Overview
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'reviews'
                ? 'border-brand-500 text-brand-500'
                : theme === 'dark'
                ? 'border-transparent text-brand-400 hover:text-brand-200'
                : 'border-transparent text-brand-600 hover:text-brand-900'
            }`}
          >
            Ratings & Reviews
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="pb-12">
            <div className="mb-6">
              <div className="relative max-w-xl">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-brand-400' : 'text-brand-600'}`} size={20} />
                <input
                  type="text"
                  placeholder="Search lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-brand-900 border-brand-700 text-brand-50'
                      : 'bg-white border-brand-200 text-brand-900'
                  } focus:outline-none focus:ring-2 focus:ring-brand-500`}
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredLessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  onClick={() => isEnrolled && navigate(`/lesson/${course.id}/${lesson.id}`)}
                  className={`p-4 rounded-lg transition-all ${
                    isEnrolled
                      ? 'cursor-pointer hover:shadow-lg'
                      : 'opacity-60 cursor-not-allowed'
                  } ${theme === 'dark' ? 'bg-brand-900' : 'bg-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {isLessonCompleted(lesson.id) ? (
                        <CheckCircle className="text-blue-500" size={24} />
                      ) : (
                        <Circle className={theme === 'dark' ? 'text-brand-600' : 'text-brand-400'} size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-brand-400' : 'text-brand-500'}`}>
                          Lesson {index + 1}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          theme === 'dark' ? 'bg-brand-800 text-brand-300' : 'bg-brand-100 text-brand-600'
                        }`}>
                          {lesson.type}
                        </span>
                      </div>
                      <h4 className={`font-semibold mt-1 ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
                        {lesson.title}
                      </h4>
                      <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>
                        {lesson.description}
                      </p>
                      {lesson.attachments && lesson.attachments.length > 0 && (
                        <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-brand-400' : 'text-brand-500'}`}>
                          📎 {lesson.attachments.length} attachment(s)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="pb-12">
            {/* Add Review */}
            {user && isEnrolled && (
              <div className={`p-6 rounded-lg mb-8 ${theme === 'dark' ? 'bg-brand-900' : 'bg-white'}`}>
                <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
                  Add Your Review
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-brand-200' : 'text-brand-700'}`}>
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          size={32}
                          className={`cursor-pointer transition-colors ${
                            star <= newRating
                              ? 'text-yellow-500 fill-current'
                              : theme === 'dark'
                              ? 'text-brand-600'
                              : 'text-gray-300'
                          }`}
                          onClick={() => setNewRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-brand-200' : 'text-brand-700'}`}>
                      Your Review
                    </label>
                    <textarea
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-brand-800 border-brand-700 text-brand-50'
                          : 'bg-white border-brand-300 text-brand-900'
                      } focus:outline-none focus:ring-2 focus:ring-brand-500`}
                      placeholder="Share your thoughts about this course..."
                    />
                  </div>
                  <button
                    onClick={handleSubmitReview}
                    className="px-6 py-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {courseReviews.map(review => (
                <div key={review.id} className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-brand-900' : 'bg-white'}`}>
                  <div className="flex items-start gap-4">
                    <img
                      src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}`}
                      alt={review.userName}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-semibold ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
                          {review.userName}
                        </h4>
                        <span className={`text-sm ${theme === 'dark' ? 'text-brand-400' : 'text-brand-500'}`}>
                          {review.date}
                        </span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            size={16}
                            className={`${
                              star <= review.rating
                                ? 'text-yellow-500 fill-current'
                                : theme === 'dark'
                                ? 'text-brand-600'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>
                        {review.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;

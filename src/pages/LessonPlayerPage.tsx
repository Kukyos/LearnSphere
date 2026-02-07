import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ChevronLeft, ChevronRight, Menu, X, CheckCircle, Circle, Download, Award, ArrowLeft } from 'lucide-react';

const LessonPlayerPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { courses, user, userProgress, theme, completeLesson, submitQuiz } = useApp();
  const [showSidebar, setShowSidebar] = useState(true);
  const [quizState, setQuizState] = useState<'intro' | 'inProgress' | 'completed'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizAttempts, setQuizAttempts] = useState(1);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [showPointsPopup, setShowPointsPopup] = useState(false);
  const navigate = useNavigate();

  const course = courses.find(c => c.id === courseId);
  const lesson = course?.lessons.find(l => l.id === lessonId);
  const progress = userProgress.find(p => p.courseId === courseId);

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!course || !lesson) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-brand-950' : 'bg-nature-light'}`}>
        <p className={`text-xl ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>
          Lesson not found
        </p>
      </div>
    );
  }

  const currentLessonIndex = course.lessons.findIndex(l => l.id === lessonId);
  const isLessonCompleted = progress?.lessonsProgress.find(l => l.lessonId === lessonId)?.completed || false;
  const hasNextLesson = currentLessonIndex < course.lessons.length - 1;
  const hasPrevLesson = currentLessonIndex > 0;

  const completedLessons = progress?.lessonsProgress.filter(l => l.completed).length || 0;
  const totalLessons = course.lessons.length;
  const courseProgress = (completedLessons / totalLessons) * 100;

  const handlePrevious = () => {
    if (hasPrevLesson) {
      const prevLesson = course.lessons[currentLessonIndex - 1];
      navigate(`/lesson/${courseId}/${prevLesson.id}`);
    }
  };

  const handleNext = () => {
    if (hasNextLesson) {
      const nextLesson = course.lessons[currentLessonIndex + 1];
      navigate(`/lesson/${courseId}/${nextLesson.id}`);
    }
  };

  const handleCompleteLesson = () => {
    if (!isLessonCompleted) {
      completeLesson(courseId!, lessonId!);
    }
  };

  const handleQuizSubmit = () => {
    if (!lesson.quiz) return;

    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === lesson.quiz!.questions[index].correctAnswer
    ).length;

    const passed = correctAnswers === lesson.quiz.questions.length;

    if (passed) {
      const points = submitQuiz(courseId!, lessonId!, quizAttempts);
      setEarnedPoints(points);
      setShowPointsPopup(true);
      completeLesson(courseId!, lessonId!);
      setQuizState('completed');

      setTimeout(() => setShowPointsPopup(false), 5000);
    } else {
      alert(`You got ${correctAnswers}/${lesson.quiz.questions.length} correct. Please try again!`);
      setQuizAttempts(prev => prev + 1);
      setSelectedAnswers([]);
      setCurrentQuestionIndex(0);
      setQuizState('intro');
    }
  };

  const renderLessonContent = () => {
    switch (lesson.type) {
      case 'video':
        return (
          <div className="aspect-video w-full">
            <iframe
              src={lesson.content}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onEnded={handleCompleteLesson}
            />
          </div>
        );

      case 'document':
        return (
          <div className={`p-8 rounded-lg ${theme === 'dark' ? 'bg-brand-900' : 'bg-white'}`}>
            <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
              <p className={theme === 'dark' ? 'text-brand-200' : 'text-brand-800'}>
                {lesson.content}
              </p>
            </div>
            <div className="mt-8 flex gap-4">
              {lesson.downloadAllowed && (
                <button
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
                >
                  <Download size={20} />
                  Download
                </button>
              )}
              {!isLessonCompleted && (
                <button
                  onClick={handleCompleteLesson}
                  className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
                >
                  Mark as Complete
                </button>
              )}
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <img
              src={lesson.content}
              alt={lesson.title}
              className="w-full max-h-[70vh] object-contain rounded-lg"
            />
            {!isLessonCompleted && (
              <button
                onClick={handleCompleteLesson}
                className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
              >
                Mark as Complete
              </button>
            )}
          </div>
        );

      case 'quiz':
        return renderQuiz();

      default:
        return null;
    }
  };

  const renderQuiz = () => {
    if (!lesson.quiz) return null;

    if (quizState === 'intro') {
      return (
        <div className={`p-8 rounded-lg text-center ${theme === 'dark' ? 'bg-brand-900' : 'bg-white'}`}>
          <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
            Ready to Test Your Knowledge?
          </h2>
          <div className="mb-8">
            <p className={`text-lg mb-4 ${theme === 'dark' ? 'text-brand-200' : 'text-brand-700'}`}>
              This quiz has {lesson.quiz.questions.length} questions
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-brand-400' : 'text-brand-500'}`}>
              ⚠️ You can attempt this quiz multiple times. Your points will decrease with each attempt.
            </p>
            <div className={`mt-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-brand-800' : 'bg-brand-50'}`}>
              <p className={`font-semibold ${theme === 'dark' ? 'text-brand-200' : 'text-brand-700'}`}>
                Reward Points:
              </p>
              {lesson.quiz.rewardRules.map(rule => (
                <p key={rule.attempt} className={`text-sm ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>
                  Attempt {rule.attempt}: {rule.points} points
                </p>
              ))}
            </div>
          </div>
          <button
            onClick={() => setQuizState('inProgress')}
            className="px-8 py-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold text-lg transition-colors"
          >
            Start Quiz
          </button>
        </div>
      );
    }

    if (quizState === 'inProgress') {
      const question = lesson.quiz.questions[currentQuestionIndex];
      const isLastQuestion = currentQuestionIndex === lesson.quiz.questions.length - 1;

      return (
        <div className={`p-8 rounded-lg ${theme === 'dark' ? 'bg-brand-900' : 'bg-white'}`}>
          <div className="mb-6">
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-brand-400' : 'text-brand-500'}`}>
              Question {currentQuestionIndex + 1} of {lesson.quiz.questions.length}
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-brand-500 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestionIndex + 1) / lesson.quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          <h3 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
            {question.question}
          </h3>

          <div className="space-y-3 mb-8">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  const newAnswers = [...selectedAnswers];
                  newAnswers[currentQuestionIndex] = index;
                  setSelectedAnswers(newAnswers);
                }}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'bg-brand-500 text-white'
                    : theme === 'dark'
                    ? 'bg-brand-800 hover:bg-brand-700 text-brand-200'
                    : 'bg-brand-50 hover:bg-brand-100 text-brand-900'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (isLastQuestion) {
                handleQuizSubmit();
              } else {
                setCurrentQuestionIndex(prev => prev + 1);
              }
            }}
            disabled={selectedAnswers[currentQuestionIndex] === undefined}
            className="w-full py-3 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold transition-colors"
          >
            {isLastQuestion ? 'Proceed and Complete Quiz' : 'Proceed'}
          </button>
        </div>
      );
    }

    if (quizState === 'completed') {
      return (
        <div className={`p-8 rounded-lg text-center ${theme === 'dark' ? 'bg-brand-900' : 'bg-white'}`}>
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
              Quiz Completed!
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-brand-200' : 'text-brand-700'}`}>
              You earned {earnedPoints} points!
            </p>
          </div>
          {hasNextLesson && (
            <button
              onClick={handleNext}
              className="px-8 py-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
            >
              Continue to Next Lesson
            </button>
          )}
        </div>
      );
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-brand-950' : 'bg-nature-light'} flex`}>      {/* Back Button - Fixed Position */}
      <button
        onClick={() => navigate(`/course/${courseId}`)}
        className={`fixed top-20 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          theme === 'dark'
            ? 'bg-brand-800/90 text-brand-300 hover:bg-brand-700 hover:text-white'
            : 'bg-white/90 text-brand-600 hover:bg-brand-100 hover:text-brand-900'
        } backdrop-blur-sm shadow-lg`}
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Course</span>
      </button>
      {/* Sidebar */}
      {showSidebar && (
        <div className={`w-80 ${theme === 'dark' ? 'bg-brand-900 border-brand-800' : 'bg-white border-brand-200'} border-r overflow-y-auto`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`font-bold ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
                {course.title}
              </h2>
              <button
                onClick={() => setShowSidebar(false)}
                className={`md:hidden p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-brand-800' : 'hover:bg-brand-100'}`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>
                  Course Progress
                </span>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>
                  {Math.round(courseProgress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-brand-500 h-2 rounded-full transition-all"
                  style={{ width: `${courseProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              {course.lessons.map((l, index) => {
                const completed = progress?.lessonsProgress.find(lp => lp.lessonId === l.id)?.completed || false;
                const isCurrent = l.id === lessonId;

                return (
                  <div
                    key={l.id}
                    onClick={() => navigate(`/lesson/${courseId}/${l.id}`)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      isCurrent
                        ? theme === 'dark'
                          ? 'bg-brand-800'
                          : 'bg-brand-100'
                        : theme === 'dark'
                        ? 'hover:bg-brand-800'
                        : 'hover:bg-brand-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {completed ? (
                        <CheckCircle className="text-blue-500 flex-shrink-0" size={20} />
                      ) : (
                        <Circle className={`flex-shrink-0 ${theme === 'dark' ? 'text-brand-600' : 'text-brand-400'}`} size={20} />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-brand-200' : 'text-brand-800'}`}>
                          {index + 1}. {l.title}
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-brand-500' : 'text-brand-500'}`}>
                          {l.type}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className={`${theme === 'dark' ? 'bg-brand-900 border-brand-800' : 'bg-white border-brand-200'} border-b p-4`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-brand-800' : 'hover:bg-brand-100'}`}
            >
              <Menu size={24} />
            </button>
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-brand-800 hover:bg-brand-700 text-brand-200' : 'bg-brand-100 hover:bg-brand-200 text-brand-700'} font-semibold transition-colors`}
            >
              Back to Course
            </button>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
                {lesson.title}
              </h1>
              <p className={`text-lg ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>
                {lesson.description}
              </p>
              {isLessonCompleted && (
                <div className="flex items-center gap-2 mt-4 text-green-500">
                  <CheckCircle size={20} />
                  <span className="font-semibold">Completed</span>
                </div>
              )}
            </div>

            {renderLessonContent()}

            {/* Attachments */}
            {lesson.attachments && lesson.attachments.length > 0 && (
              <div className={`mt-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-brand-900' : 'bg-white'}`}>
                <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-brand-200' : 'text-brand-800'}`}>
                  Attachments
                </h4>
                <div className="space-y-2">
                  {lesson.attachments.map((attachment, index) => (
                    <div key={index} className={`flex items-center gap-2 ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>
                      <Download size={16} />
                      <span className="text-sm">{attachment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className={`${theme === 'dark' ? 'bg-brand-900 border-brand-800' : 'bg-white border-brand-200'} border-t p-4`}>
          <div className="max-w-5xl mx-auto flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={!hasPrevLesson}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                hasPrevLesson
                  ? theme === 'dark'
                    ? 'bg-brand-800 hover:bg-brand-700 text-brand-200'
                    : 'bg-brand-100 hover:bg-brand-200 text-brand-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!hasNextLesson || !isLessonCompleted}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                hasNextLesson && isLessonCompleted
                  ? 'bg-brand-500 hover:bg-brand-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Points Popup */}
      {showPointsPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className={`${theme === 'dark' ? 'bg-brand-900' : 'bg-white'} p-8 rounded-lg shadow-2xl pointer-events-auto transform animate-bounce`}>
            <div className="text-center">
              <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
                You earned {earnedPoints} points!
              </h3>
              <p className={`${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>
                {user && `${user.points} total points • ${user.badge} badge`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPlayerPage;

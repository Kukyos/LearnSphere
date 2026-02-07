import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Play, FileText,
  HelpCircle, BookOpen, Download, Award, X
} from 'lucide-react';

const LessonPlayerPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { user, courses, userProgress, theme, completeLesson, submitQuiz, completeCourse } = useApp();
  const { user: authUser } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [pointsEarned, setPointsEarned] = useState<number | null>(null);

  const isLearner = authUser?.role === 'learner' || authUser?.role === 'guest';

  const course = courses.find(c => c.id === courseId);
  const lesson = course?.lessons.find(l => l.id === lessonId);
  const lessonIndex = course?.lessons.findIndex(l => l.id === lessonId) ?? -1;
  const courseProgress = userProgress.find(p => p.courseId === courseId);

  const prevLesson = course?.lessons[lessonIndex - 1];
  const nextLesson = course?.lessons[lessonIndex + 1];

  const isLessonCompleted = (lid: string) =>
    courseProgress?.lessonsProgress.some(l => l.lessonId === lid && l.completed) || false;

  // Reset quiz state when lesson changes
  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setPointsEarned(null);
  }, [lessonId]);

  // Auto-dismiss points popup
  useEffect(() => {
    if (pointsEarned !== null) {
      const timer = setTimeout(() => setPointsEarned(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [pointsEarned]);

  if (!course || !lesson) {
    return (
      <div className={`min-h-screen pt-28 flex items-center justify-center ${theme === 'dark' ? 'bg-brand-950' : 'bg-nature-light'}`}>
        <div className="text-center">
          <BookOpen className="mx-auto mb-4 text-brand-400" size={64} />
          <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-brand-900'}`}>Lesson Not Found</h2>
          <button onClick={() => navigate('/explore')} className="px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors">
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const handleMarkComplete = () => {
    if (courseId && lessonId) {
      completeLesson(courseId, lessonId);

      // Check if all lessons are completed to complete course
      const allLessons = course.lessons.map(l => l.id);
      const completedLessons = courseProgress?.lessonsProgress.filter(lp => lp.completed).map(lp => lp.lessonId) || [];
      const willBeCompleted = [...new Set([...completedLessons, lessonId])];
      if (willBeCompleted.length === allLessons.length) {
        completeCourse(courseId);
      }
    }
  };

  const handleQuizSubmit = () => {
    if (!lesson.quiz || !courseId || !lessonId) return;

    let correct = 0;
    lesson.quiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) correct++;
    });

    const score = Math.round((correct / lesson.quiz.questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);

    // Only award points to learners, not instructors or admins
    if (isLearner) {
      // Calculate attempt number
      const lessonProg = courseProgress?.lessonsProgress.find(l => l.lessonId === lessonId);
      const attempt = (lessonProg?.quizAttempts || 0) + 1;

      const points = submitQuiz(courseId, lessonId, attempt);
      if (points > 0) {
        setPointsEarned(points);
      }
    }

    // Mark lesson complete if passing score
    if (score >= 60) {
      handleMarkComplete();
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play size={16} />;
      case 'document': return <FileText size={16} />;
      case 'quiz': return <HelpCircle size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  // Render lesson content based on type
  const renderContent = () => {
    switch (lesson.type) {
      case 'video':
        return (
          <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src={lesson.content}
              title={lesson.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );

      case 'document':
        return (
          <div className={`rounded-xl p-8 ${theme === 'dark' ? 'bg-brand-900' : 'bg-white'} shadow-lg max-h-[70vh] overflow-y-auto`}>
            <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
              {lesson.content.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i} className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-brand-900'}`}>{line.slice(2)}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className={`text-xl font-bold mt-6 mb-3 ${theme === 'dark' ? 'text-brand-100' : 'text-brand-800'}`}>{line.slice(3)}</h2>;
                if (line.startsWith('- ')) return <li key={i} className={`ml-4 mb-1 ${theme === 'dark' ? 'text-brand-200' : 'text-brand-700'}`}>{line.slice(2)}</li>;
                if (line.trim() === '') return <br key={i} />;
                return <p key={i} className={`mb-2 leading-relaxed ${theme === 'dark' ? 'text-brand-200' : 'text-brand-700'}`}>{line}</p>;
              })}
            </div>
            {lesson.downloadAllowed && (
              <button className="mt-6 flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors">
                <Download size={16} /> Download Document
              </button>
            )}
          </div>
        );

      case 'quiz':
        if (!lesson.quiz) return <p>No quiz data available</p>;
        return (
          <div className={`rounded-xl p-8 ${theme === 'dark' ? 'bg-brand-900' : 'bg-white'} shadow-lg`}>
            <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-brand-900'}`}>📝 {lesson.title}</h2>

            {quizSubmitted ? (
              <div className="text-center py-8">
                <div className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center ${
                  quizScore >= 60 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <span className={`text-4xl font-bold ${quizScore >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                    {quizScore}%
                  </span>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-brand-900'}`}>
                  {quizScore >= 60 ? '🎉 Great job!' : '😔 Keep trying!'}
                </h3>
                <p className={`mb-6 ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>
                  You scored {quizScore}% ({Math.round(quizScore * lesson.quiz.questions.length / 100)}/{lesson.quiz.questions.length} correct)
                </p>

                {/* Show answers */}
                <div className="text-left space-y-4 mt-8">
                  {lesson.quiz.questions.map((q, qi) => {
                    const userAnswer = quizAnswers[q.id];
                    const isCorrect = userAnswer === q.correctAnswer;
                    return (
                      <div key={q.id} className={`p-4 rounded-xl border ${
                        isCorrect
                          ? 'border-green-300 bg-green-50'
                          : 'border-red-300 bg-red-50'
                      }`}>
                        <p className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-brand-900'}`}>
                          {qi + 1}. {q.question}
                        </p>
                        <p className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          Your answer: {q.options[userAnswer]} {isCorrect ? '✓' : '✗'}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-600 mt-1">Correct: {q.options[q.correctAnswer]}</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); setQuizScore(0); }}
                  className="mt-6 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
                >
                  Retake Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {lesson.quiz.questions.map((q, qi) => (
                  <div key={q.id} className={`p-5 rounded-xl ${theme === 'dark' ? 'bg-brand-800' : 'bg-nature-light'}`}>
                    <p className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-brand-900'}`}>
                      {qi + 1}. {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((option, oi) => (
                        <button
                          key={oi}
                          onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: oi }))}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            quizAnswers[q.id] === oi
                              ? 'border-brand-500 bg-brand-100'
                              : theme === 'dark'
                                ? 'border-brand-700 hover:border-brand-500'
                                : 'border-brand-200 hover:border-brand-400'
                          }`}
                        >
                          <span className={`text-sm ${
                            quizAnswers[q.id] === oi
                              ? 'font-semibold text-brand-700'
                              : theme === 'dark' ? 'text-brand-200' : 'text-brand-700'
                          }`}>
                            {String.fromCharCode(65 + oi)}. {option}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length < lesson.quiz.questions.length}
                  className="w-full py-4 bg-brand-600 text-white rounded-xl text-lg font-bold hover:bg-brand-700 disabled:opacity-50 transition-all active:scale-95"
                >
                  Submit Quiz ({Object.keys(quizAnswers).length}/{lesson.quiz.questions.length} answered)
                </button>
              </div>
            )}
          </div>
        );

      default:
        return <p className={theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}>Unsupported lesson type</p>;
    }
  };

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-brand-950' : 'bg-nature-light'}`}>
      {/* Points Earned Popup - Only for learners */}
      {isLearner && pointsEarned !== null && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] animate-bounce">
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-yellow-500 text-white shadow-2xl">
            <Award size={28} />
            <div>
              <p className="font-bold text-lg">+{pointsEarned} Points!</p>
              <p className="text-sm text-yellow-100">Quiz reward earned</p>
            </div>
            <button onClick={() => setPointsEarned(null)} className="ml-2">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} flex-none transition-all duration-300 overflow-hidden ${
        theme === 'dark' ? 'bg-brand-900 border-brand-800' : 'bg-white border-brand-200'
      } border-r`}>
        <div className="w-80 h-screen overflow-y-auto pt-20 pb-6">
          {/* Course Title */}
          <div className="px-4 pb-4 border-b border-brand-200">
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className={`flex items-center gap-1 text-sm mb-3 ${theme === 'dark' ? 'text-brand-400 hover:text-white' : 'text-brand-500 hover:text-brand-900'} transition-colors`}
            >
              <ArrowLeft size={14} /> Back to Course
            </button>
            <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-brand-900'}`}>{course.title}</h3>
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-brand-400' : 'text-brand-500'}`}>
              {courseProgress?.lessonsProgress.filter(l => l.completed).length || 0}/{course.lessons.length} completed
            </p>
          </div>

          {/* Lesson List */}
          <div className="py-2">
            {course.lessons.map((l, i) => {
              const completed = isLessonCompleted(l.id);
              const isCurrent = l.id === lessonId;
              return (
                <button
                  key={l.id}
                  onClick={() => navigate(`/lesson/${courseId}/${l.id}`)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all ${
                    isCurrent
                      ? theme === 'dark' ? 'bg-brand-800 border-l-4 border-brand-500' : 'bg-brand-50 border-l-4 border-brand-600'
                      : 'border-l-4 border-transparent hover:bg-brand-50'
                  }`}
                >
                  <div className={`flex-none w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    completed
                      ? 'bg-green-500 text-white'
                      : isCurrent
                        ? 'bg-brand-600 text-white'
                        : theme === 'dark' ? 'bg-brand-800 text-brand-400' : 'bg-brand-100 text-brand-600'
                  }`}>
                    {completed ? <CheckCircle size={16} /> : getLessonIcon(l.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      isCurrent
                        ? theme === 'dark' ? 'text-white' : 'text-brand-900'
                        : theme === 'dark' ? 'text-brand-300' : 'text-brand-700'
                    }`}>
                      {i + 1}. {l.title}
                    </p>
                    <p className={`text-xs capitalize ${theme === 'dark' ? 'text-brand-500' : 'text-brand-400'}`}>{l.type}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <div className={`sticky top-0 z-30 flex items-center justify-between px-6 py-3 ${
          theme === 'dark' ? 'bg-brand-950/90 border-brand-800' : 'bg-nature-light/90 border-brand-200'
        } border-b backdrop-blur-lg pt-20`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-brand-800 text-brand-300' : 'hover:bg-brand-100 text-brand-600'}`}
            >
              {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
            <div>
              <h2 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-brand-900'}`}>{lesson.title}</h2>
              <p className={`text-xs capitalize ${theme === 'dark' ? 'text-brand-400' : 'text-brand-500'}`}>
                Lesson {lessonIndex + 1} of {course.lessons.length} • {lesson.type}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isLessonCompleted(lesson.id) && lesson.type !== 'quiz' && (
              <button
                onClick={handleMarkComplete}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-1.5"
              >
                <CheckCircle size={16} /> Mark Complete
              </button>
            )}
            {isLessonCompleted(lesson.id) && (
              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-semibold flex items-center gap-1">
                <CheckCircle size={14} /> Completed
              </span>
            )}
          </div>
        </div>

        {/* Lesson Content */}
        <div className="p-6 sm:p-8 max-w-4xl mx-auto">
          {renderContent()}

          {/* Description */}
          <div className={`mt-6 p-4 rounded-xl ${theme === 'dark' ? 'bg-brand-900' : 'bg-white'} shadow`}>
            <p className={theme === 'dark' ? 'text-brand-200' : 'text-brand-700'}>{lesson.description}</p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => prevLesson && navigate(`/lesson/${courseId}/${prevLesson.id}`)}
              disabled={!prevLesson}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                prevLesson
                  ? 'bg-brand-600 text-white hover:bg-brand-700 active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={18} /> Previous
            </button>

            <button
              onClick={() => nextLesson && navigate(`/lesson/${courseId}/${nextLesson.id}`)}
              disabled={!nextLesson}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                nextLesson
                  ? 'bg-brand-600 text-white hover:bg-brand-700 active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayerPage;

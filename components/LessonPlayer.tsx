import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Play, CheckCircle, Circle, FileText, HelpCircle, Layout, Volume2, Maximize, Check } from 'lucide-react';
import { Course, Lesson } from '../types';
import { MOCK_CURRICULUM } from '../constants';

interface LessonPlayerProps {
  course: Course;
  onExit: () => void;
}

export default function LessonPlayer({ course, onExit }: LessonPlayerProps) {
  const [currentLessonId, setCurrentLessonId] = useState<string>('l1');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Find current lesson
  const currentLesson = MOCK_CURRICULUM
    .flatMap(module => module.lessons)
    .find(lesson => lesson.id === currentLessonId);

  // Get all lessons for navigation
  const allLessons = MOCK_CURRICULUM.flatMap(module => module.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Calculate progress
  const completedLessons = allLessons.filter(l => l.isCompleted).length;
  const progressPercent = Math.round((completedLessons / allLessons.length) * 100);

  const handleLessonChange = (lessonId: string) => {
    setCurrentLessonId(lessonId);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleQuizSubmit = () => {
    if (!currentLesson?.questions) return;
    
    let score = 0;
    currentLesson.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const renderContent = () => {
    if (!currentLesson) return <div className="p-8 text-center text-gray-500">Lesson not found</div>;

    switch (currentLesson.type) {
      case 'video':
        return (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="w-full max-w-5xl">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                <video 
                  controls 
                  className="w-full h-full"
                  poster={course.thumbnailUrl}
                  src={currentLesson.videoUrl}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        );

      case 'article':
        return (
          <div className="w-full h-full overflow-y-auto bg-nature-light dark:bg-gray-900 px-8 py-12">
            <div className="max-w-3xl mx-auto bg-nature-card dark:bg-gray-800 rounded-2xl shadow-lg p-12">
              <h2 className="text-3xl font-bold text-brand-900 dark:text-brand-100 mb-6">
                {currentLesson.title}
              </h2>
              <div className="prose prose-brand dark:prose-invert prose-lg max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {currentLesson.content || 'Article content coming soon...'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="w-full h-full overflow-y-auto bg-nature-light dark:bg-gray-900 px-8 py-12">
            <div className="max-w-3xl mx-auto">
              <div className="bg-nature-card dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <HelpCircle className="text-brand-600 dark:text-brand-400" size={32} />
                  <h2 className="text-3xl font-bold text-brand-900 dark:text-brand-100">
                    {currentLesson.title}
                  </h2>
                </div>

                {!quizSubmitted ? (
                  <div className="space-y-8">
                    {currentLesson.questions?.map((question, qIndex) => (
                      <div key={question.id} className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                          {qIndex + 1}. {question.text}
                        </h3>
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <button
                              key={optIndex}
                              onClick={() => setQuizAnswers({ ...quizAnswers, [question.id]: optIndex })}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                quizAnswers[question.id] === optIndex
                                  ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20 dark:border-brand-500'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  quizAnswers[question.id] === optIndex
                                    ? 'border-brand-600 dark:border-brand-500 bg-brand-600 dark:bg-brand-500'
                                    : 'border-gray-300 dark:border-gray-600'
                                }`}>
                                  {quizAnswers[question.id] === optIndex && (
                                    <Check size={14} className="text-white" />
                                  )}
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">{option}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length !== currentLesson.questions?.length}
                      className="w-full py-3 px-6 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                      Submit Quiz
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-brand-50 dark:bg-brand-900/20 border-2 border-brand-200 dark:border-brand-800 rounded-lg p-6 text-center">
                      <CheckCircle className="mx-auto text-brand-600 dark:text-brand-400 mb-3" size={48} />
                      <h3 className="text-2xl font-bold text-brand-900 dark:text-brand-100 mb-2">
                        Quiz Completed!
                      </h3>
                      <p className="text-lg text-gray-700 dark:text-gray-300">
                        You scored <span className="font-bold text-brand-600 dark:text-brand-400">{quizScore}</span> out of{' '}
                        <span className="font-bold">{currentLesson.questions?.length}</span>
                      </p>
                    </div>

                    <div className="space-y-4">
                      {currentLesson.questions?.map((question, qIndex) => {
                        const userAnswer = quizAnswers[question.id];
                        const isCorrect = userAnswer === question.correctAnswer;
                        
                        return (
                          <div key={question.id} className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-start gap-3 mb-3">
                              {isCorrect ? (
                                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                              ) : (
                                <HelpCircle className="text-red-500 mt-1 flex-shrink-0" size={20} />
                              )}
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                                  {qIndex + 1}. {question.text}
                                </h4>
                              </div>
                            </div>
                            
                            <div className="ml-8 space-y-2">
                              <div className={`p-3 rounded ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Your answer:</p>
                                <p className={`font-medium ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                  {question.options[userAnswer]}
                                </p>
                              </div>
                              
                              {!isCorrect && (
                                <div className="p-3 rounded bg-green-50 dark:bg-green-900/20">
                                  <p className="text-sm text-gray-600 dark:text-gray-400">Correct answer:</p>
                                  <p className="font-medium text-green-700 dark:text-green-400">
                                    {question.options[question.correctAnswer]}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {nextLesson && (
                      <button
                        onClick={() => handleLessonChange(nextLesson.id)}
                        className="w-full py-3 px-6 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        Next Lesson
                        <ChevronRight size={20} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white dark:bg-gray-900 flex flex-col">
      {/* Top Bar */}
      <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 flex-shrink-0">
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Exit</span>
        </button>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Progress: {progressPercent}%
          </span>
          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-600 dark:bg-brand-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Layout size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-hidden">
            {renderContent()}
          </div>

          {/* Bottom Navigation */}
          {currentLesson?.type !== 'quiz' && (
            <div className="h-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between px-8">
              <button
                onClick={() => prevLesson && handleLessonChange(prevLesson.id)}
                disabled={!prevLesson}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              <button
                onClick={() => nextLesson && handleLessonChange(nextLesson.id)}
                disabled={!nextLesson}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-nature-card dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex-shrink-0`}>
          <div className="h-full overflow-y-auto p-6">
            <h3 className="text-lg font-bold text-brand-900 dark:text-brand-100 mb-4">
              Curriculum
            </h3>
            <div className="space-y-6">
              {MOCK_CURRICULUM.map((module) => (
                <div key={module.id}>
                  <h4 className="text-sm font-semibold text-brand-800 dark:text-brand-200 mb-3 uppercase tracking-wide">
                    {module.title}
                  </h4>
                  <div className="space-y-2">
                    {module.lessons.map((lesson) => {
                      const isActive = lesson.id === currentLessonId;
                      const Icon = lesson.type === 'video' ? Play : lesson.type === 'quiz' ? HelpCircle : FileText;
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonChange(lesson.id)}
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            isActive
                              ? 'bg-brand-100 dark:bg-brand-900/30 border-2 border-brand-600 dark:border-brand-500'
                              : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:border-brand-300 dark:hover:border-brand-700'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Icon 
                              size={18} 
                              className={`mt-0.5 flex-shrink-0 ${
                                isActive 
                                  ? 'text-brand-600 dark:text-brand-400' 
                                  : 'text-gray-400 dark:text-gray-500'
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${
                                isActive 
                                  ? 'text-brand-900 dark:text-brand-100' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {lesson.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {lesson.duration}
                              </p>
                            </div>
                            {lesson.isCompleted && (
                              <CheckCircle size={18} className="text-green-500 dark:text-green-400 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

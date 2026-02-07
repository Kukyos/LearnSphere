import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Play, CheckCircle, Circle, FileText, HelpCircle, Layout, Volume2, Maximize, Check } from 'lucide-react';
import { MOCK_CURRICULUM } from '../constants';
import { Course, Lesson, QuizQuestion } from '../types';

interface LessonPlayerProps {
  course: Course;
  onExit: () => void;
}

const LessonPlayer: React.FC<LessonPlayerProps> = ({ course, onExit }) => {
  // Flatten lessons for easier navigation
  const allLessons = MOCK_CURRICULUM.flatMap(m => m.lessons);
  const [currentLessonId, setCurrentLessonId] = useState(allLessons[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const currentLesson = allLessons.find(l => l.id === currentLessonId) || allLessons[0];
  const currentLessonIndex = allLessons.findIndex(l => l.id === currentLessonId);
  const nextLesson = allLessons[currentLessonIndex + 1];
  const prevLesson = allLessons[currentLessonIndex - 1];

  const handleLessonChange = (id: string) => {
    setCurrentLessonId(id);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleQuizSubmit = () => {
    if (!currentLesson.questions) return;
    let score = 0;
    currentLesson.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const renderContent = () => {
    if (currentLesson.type === 'video') {
      return (
        <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl">
           <video 
             key={currentLesson.videoUrl}
             src={currentLesson.videoUrl}
             className="w-full h-full object-cover"
             controls
             poster={course.thumbnailUrl}
           />
        </div>
      );
    }

    if (currentLesson.type === 'article') {
      return (
        <div className="prose prose-brand dark:prose-invert max-w-3xl mx-auto py-8">
           <h1 className="text-3xl font-bold text-brand-900 dark:text-white mb-6">{currentLesson.title}</h1>
           <div className="bg-nature-card dark:bg-brand-800 p-8 rounded-2xl border border-brand-200 dark:border-brand-700">
             <p className="text-lg leading-relaxed text-brand-800 dark:text-brand-100">
               {currentLesson.content || "Content coming soon..."}
             </p>
           </div>
        </div>
      );
    }

    if (currentLesson.type === 'quiz') {
      return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="mb-8 text-center">
                <span className="inline-block p-3 rounded-full bg-brand-100 text-brand-600 mb-4">
                    <HelpCircle size={32} />
                </span>
                <h1 className="text-3xl font-bold text-brand-900 dark:text-white mb-2">{currentLesson.title}</h1>
                <p className="text-brand-600 dark:text-brand-300">Test your knowledge</p>
            </div>

            <div className="space-y-6">
                {currentLesson.questions?.map((q, idx) => {
                    const isCorrect = quizAnswers[q.id] === q.correctAnswer;
                    const isSelected = quizAnswers[q.id] !== undefined;

                    return (
                        <div key={q.id} className="bg-white dark:bg-brand-800 rounded-xl p-6 shadow-sm border border-brand-200 dark:border-brand-700">
                            <h3 className="text-lg font-semibold text-brand-900 dark:text-white mb-4">
                                <span className="text-brand-400 mr-2">{idx + 1}.</span> {q.text}
                            </h3>
                            <div className="space-y-2">
                                {q.options.map((opt, optIdx) => (
                                    <button
                                        key={optIdx}
                                        disabled={quizSubmitted}
                                        onClick={() => setQuizAnswers(prev => ({...prev, [q.id]: optIdx}))}
                                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between
                                            ${quizSubmitted 
                                                ? optIdx === q.correctAnswer
                                                    ? 'bg-green-50 border-green-500 text-green-900 dark:bg-green-900/20 dark:text-green-100'
                                                    : quizAnswers[q.id] === optIdx
                                                        ? 'bg-red-50 border-red-500 text-red-900 dark:bg-red-900/20 dark:text-red-100'
                                                        : 'border-brand-100 dark:border-brand-700 opacity-50'
                                                : quizAnswers[q.id] === optIdx
                                                    ? 'bg-brand-50 border-brand-500 ring-1 ring-brand-500 text-brand-900 dark:bg-brand-700 dark:text-white'
                                                    : 'border-brand-200 hover:bg-brand-50 hover:border-brand-300 text-brand-700 dark:border-brand-700 dark:text-brand-200 dark:hover:bg-brand-700'
                                            }
                                        `}
                                    >
                                        <span>{opt}</span>
                                        {quizSubmitted && optIdx === q.correctAnswer && <Check size={18} className="text-green-600" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="mt-8 flex items-center justify-between">
                {quizSubmitted ? (
                     <div className="bg-brand-900 text-white px-6 py-4 rounded-xl flex items-center gap-4 w-full">
                         <div className={`p-2 rounded-full ${quizScore === currentLesson.questions?.length ? 'bg-green-500' : 'bg-yellow-500'}`}>
                             {quizScore === currentLesson.questions?.length ? <CheckCircle size={24} /> : <HelpCircle size={24} />}
                         </div>
                         <div>
                             <p className="font-bold text-lg">You scored {quizScore} / {currentLesson.questions?.length}</p>
                             <p className="text-sm text-brand-300">{quizScore === currentLesson.questions?.length ? 'Perfect score!' : 'Keep learning!'}</p>
                         </div>
                         <button onClick={() => {
                             if(nextLesson) handleLessonChange(nextLesson.id);
                         }} className="ml-auto bg-white text-brand-900 px-4 py-2 rounded-lg font-bold hover:bg-brand-100">
                             Next Lesson
                         </button>
                     </div>
                ) : (
                    <button 
                        disabled={Object.keys(quizAnswers).length !== (currentLesson.questions?.length || 0)}
                        onClick={handleQuizSubmit}
                        className="w-full py-4 rounded-xl bg-brand-600 text-white font-bold text-lg shadow-lg shadow-brand-600/20 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Submit Quiz
                    </button>
                )}
            </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-nature-light dark:bg-brand-950 text-brand-900 dark:text-brand-50 overflow-hidden">
      {/* Top Bar */}
      <header className="flex-none h-16 bg-white dark:bg-brand-900 border-b border-brand-200 dark:border-brand-800 flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-4">
            <button onClick={onExit} className="p-2 hover:bg-brand-100 dark:hover:bg-brand-800 rounded-full transition-colors">
                <ArrowLeft size={20} />
            </button>
            <h2 className="font-bold text-sm sm:text-base line-clamp-1">{course.title}</h2>
        </div>
        <div className="flex items-center gap-2">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-brand-100 dark:bg-brand-800 rounded-full text-xs font-medium text-brand-700 dark:text-brand-200">
                 <div className="w-20 bg-brand-200 dark:bg-brand-700 h-1.5 rounded-full overflow-hidden">
                     <div className="bg-brand-500 h-full w-[35%]"></div>
                 </div>
                 35% Complete
             </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
             <div className="flex-1 overflow-y-auto scroll-smooth p-4 sm:p-8">
                 <div className="max-w-5xl mx-auto w-full">
                     {renderContent()}
                     
                     {/* Lesson Navigation Footer */}
                     <div className="mt-12 flex justify-between items-center border-t border-brand-200 dark:border-brand-800 pt-8">
                         <button 
                            disabled={!prevLesson}
                            onClick={() => prevLesson && handleLessonChange(prevLesson.id)}
                            className="flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-900 disabled:opacity-30 disabled:hover:text-brand-600 font-medium"
                         >
                            <ChevronLeft size={20} /> Previous
                         </button>
                         <button 
                             disabled={!nextLesson}
                             onClick={() => nextLesson && handleLessonChange(nextLesson.id)}
                             className="flex items-center gap-2 bg-brand-900 text-white px-6 py-3 rounded-full hover:bg-brand-800 disabled:opacity-50 transition-all shadow-lg shadow-brand-900/10"
                         >
                            Next Lesson <ChevronRight size={20} />
                         </button>
                     </div>
                 </div>
             </div>
        </div>

        {/* Sidebar */}
        <div 
            className={`w-80 flex-none bg-nature-card dark:bg-brand-900 border-l border-brand-200 dark:border-brand-800 flex flex-col transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full hidden sm:flex sm:w-0 sm:border-none'}`}
        >
             <div className="p-4 border-b border-brand-200 dark:border-brand-800 font-bold text-lg flex justify-between items-center">
                 <span>Course Content</span>
                 <button onClick={() => setSidebarOpen(false)} className="sm:hidden"><ArrowLeft size={18} /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-6">
                 {MOCK_CURRICULUM.map((module) => (
                     <div key={module.id}>
                         <h4 className="text-xs font-bold uppercase tracking-wider text-brand-500 mb-3 ml-2">{module.title}</h4>
                         <div className="space-y-1">
                             {module.lessons.map(lesson => (
                                 <button
                                    key={lesson.id}
                                    onClick={() => handleLessonChange(lesson.id)}
                                    className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all
                                        ${currentLessonId === lesson.id 
                                            ? 'bg-white dark:bg-brand-800 shadow-sm ring-1 ring-brand-200 dark:ring-brand-700' 
                                            : 'hover:bg-brand-100/50 dark:hover:bg-brand-800/50 text-brand-600 dark:text-brand-400'
                                        }
                                    `}
                                 >
                                     <div className={`mt-0.5 ${currentLessonId === lesson.id ? 'text-brand-600' : 'text-brand-400'}`}>
                                         {lesson.type === 'video' ? <Play size={16} /> : lesson.type === 'quiz' ? <HelpCircle size={16} /> : <FileText size={16} />}
                                     </div>
                                     <div className="flex-1">
                                         <p className={`text-sm font-medium ${currentLessonId === lesson.id ? 'text-brand-900 dark:text-white' : ''}`}>
                                            {lesson.title}
                                         </p>
                                         <span className="text-xs text-brand-400">{lesson.duration}</span>
                                     </div>
                                     {lesson.isCompleted && <CheckCircle size={14} className="text-green-500 mt-1" />}
                                 </button>
                             ))}
                         </div>
                     </div>
                 ))}
             </div>
        </div>
      </div>
      
      {/* Sidebar Toggle for Mobile */}
      {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-brand-900 text-white p-3 rounded-full shadow-xl hover:bg-brand-800 sm:hidden"
          >
              <Layout size={24} />
          </button>
      )}
    </div>
  );
};

export default LessonPlayer;
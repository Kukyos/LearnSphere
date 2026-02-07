import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Plus, Trash2, Trophy, CheckCircle, HelpCircle, GripVertical
} from 'lucide-react';
import { useApp, QuizQuestion } from '../contexts/AppContext';

interface RewardRule {
  attempt: number;
  points: number;
}

export default function QuizBuilder() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const navigate = useNavigate();
  const { courses, updateCourse } = useApp();

  const course = courses.find(c => c.id === courseId);
  const quizLesson = course?.lessons.find(l => l.id === lessonId && l.type === 'quiz');

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showRewards, setShowRewards] = useState(false);
  const [rewardRules, setRewardRules] = useState<RewardRule[]>([
    { attempt: 1, points: 15 },
    { attempt: 2, points: 10 },
    { attempt: 3, points: 5 },
    { attempt: 4, points: 2 },
  ]);

  useEffect(() => {
    if (quizLesson?.quiz) {
      setQuestions(quizLesson.quiz.questions);
      if (quizLesson.quiz.rewardRules.length > 0) {
        setRewardRules(quizLesson.quiz.rewardRules);
      }
    }
  }, [courseId, lessonId]);

  const selectedQuestion = questions[selectedIndex];

  const addQuestion = () => {
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    };
    setQuestions(prev => [...prev, newQ]);
    setSelectedIndex(questions.length);
  };

  const updateQuestion = (field: string, value: any) => {
    setQuestions(prev => prev.map((q, i) =>
      i === selectedIndex ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (optIndex: number, value: string) => {
    if (!selectedQuestion) return;
    const newOpts = [...selectedQuestion.options];
    newOpts[optIndex] = value;
    updateQuestion('options', newOpts);
  };

  const addOption = () => {
    if (!selectedQuestion) return;
    updateQuestion('options', [...selectedQuestion.options, '']);
  };

  const removeOption = (optIndex: number) => {
    if (!selectedQuestion || selectedQuestion.options.length <= 2) return;
    const newOpts = selectedQuestion.options.filter((_, i) => i !== optIndex);
    const newCorrect = selectedQuestion.correctAnswer >= optIndex && selectedQuestion.correctAnswer > 0
      ? selectedQuestion.correctAnswer - 1
      : selectedQuestion.correctAnswer;
    setQuestions(prev => prev.map((q, i) =>
      i === selectedIndex ? { ...q, options: newOpts, correctAnswer: Math.min(newCorrect, newOpts.length - 1) } : q
    ));
  };

  const deleteQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
    if (selectedIndex >= questions.length - 1) {
      setSelectedIndex(Math.max(0, questions.length - 2));
    }
  };

  const handleSave = () => {
    if (!course || !lessonId) return;
    const updatedLessons = course.lessons.map(l =>
      l.id === lessonId
        ? { ...l, quiz: { questions, rewardRules } }
        : l
    );
    updateCourse(course.id, { lessons: updatedLessons });
    navigate(`/course-form/${courseId}`);
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-brand-500 dark:text-brand-300">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nature-light dark:bg-brand-950 pt-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-brand-900 border-b border-brand-200 dark:border-brand-700 shadow-sm" style={{ paddingTop: '80px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(`/course-form/${courseId}`)} className="p-2 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-800 text-brand-500">
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-brand-900 dark:text-white">Quiz Builder</h1>
                <p className="text-xs text-brand-500 dark:text-brand-300">{course.title} — {quizLesson?.title || 'New Quiz'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRewards(!showRewards)}
                className={`flex items-center gap-1.5 px-4 py-2 border rounded-lg text-sm font-semibold transition-colors ${
                  showRewards
                    ? 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-600'
                    : 'border-brand-300 dark:border-brand-600 text-brand-700 dark:text-brand-200 hover:bg-brand-100 dark:hover:bg-brand-800'
                }`}
              >
                <Trophy size={16} /> Rewards
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-5 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 transition-colors"
              >
                <Save size={16} /> Save Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Rewards Panel */}
        {showRewards && (
          <div className="mb-6 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
            <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300 mb-4 flex items-center gap-2">
              <Trophy size={20} /> Reward Rules
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 mb-4">Set points awarded based on quiz attempt number:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {rewardRules.map((rule, i) => (
                <div key={i} className="bg-white dark:bg-brand-900 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                  <label className="text-xs font-semibold text-brand-500 dark:text-brand-300 block mb-1">
                    {rule.attempt === 4 ? '4th try & more' : `${['1st', '2nd', '3rd'][rule.attempt - 1]} try`}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={rule.points}
                      onChange={e => {
                        const updated = [...rewardRules];
                        updated[i] = { ...rule, points: parseInt(e.target.value) || 0 };
                        setRewardRules(updated);
                      }}
                      className="w-full px-3 py-2 border border-brand-300 dark:border-brand-600 rounded-lg bg-white dark:bg-brand-800 text-brand-900 dark:text-white font-bold text-center"
                      min="0"
                    />
                    <span className="text-sm text-brand-500">pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel — Question List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-brand-900 rounded-xl border border-brand-200 dark:border-brand-700 shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-brand-700 dark:text-brand-200">Questions</h3>
                <button
                  onClick={addQuestion}
                  className="p-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
                  title="Add Question"
                >
                  <Plus size={16} />
                </button>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-8">
                  <HelpCircle className="mx-auto mb-2 text-brand-400" size={32} />
                  <p className="text-sm text-brand-500 dark:text-brand-300">No questions yet</p>
                  <button
                    onClick={addQuestion}
                    className="mt-2 text-sm text-brand-600 font-semibold hover:underline"
                  >
                    Add first question
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {questions.map((q, i) => (
                    <button
                      key={q.id}
                      onClick={() => setSelectedIndex(i)}
                      className={`w-full text-left p-3 rounded-lg flex items-center gap-2 transition-all group ${
                        selectedIndex === i
                          ? 'bg-brand-50 dark:bg-brand-900/30 border border-brand-300 dark:border-brand-600'
                          : 'hover:bg-brand-50 dark:hover:bg-brand-800/50 border border-transparent'
                      }`}
                    >
                      <GripVertical size={14} className="text-brand-400 flex-none" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-brand-500 dark:text-brand-300">Q{i + 1}</p>
                        <p className="text-sm text-brand-900 dark:text-white truncate">
                          {q.question || 'Untitled'}
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteQuestion(i); }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-brand-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel — Question Editor */}
          <div className="lg:col-span-3">
            {selectedQuestion ? (
              <div className="bg-white dark:bg-brand-900 rounded-xl border border-brand-200 dark:border-brand-700 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-brand-900 dark:text-white">
                    Question {selectedIndex + 1}
                  </h3>
                </div>

                {/* Question Text */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-brand-700 dark:text-brand-200 block mb-2">Question Text</label>
                  <textarea
                    value={selectedQuestion.question}
                    onChange={e => updateQuestion('question', e.target.value)}
                    className="w-full px-4 py-3 border border-brand-300 dark:border-brand-600 rounded-xl bg-white dark:bg-brand-800 text-brand-900 dark:text-white resize-none"
                    rows={3}
                    placeholder="Enter your question here..."
                  />
                </div>

                {/* Options */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-brand-700 dark:text-brand-200 block mb-3">
                    Answer Options <span className="text-xs font-normal text-brand-500">(click circle to mark correct)</span>
                  </label>
                  <div className="space-y-3">
                    {selectedQuestion.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuestion('correctAnswer', oi)}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-none transition-all ${
                            selectedQuestion.correctAnswer === oi
                              ? 'border-green-500 bg-green-500 text-white'
                            : 'border-brand-300 dark:border-brand-600 hover:border-green-400'
                          }`}
                        >
                          {selectedQuestion.correctAnswer === oi && <CheckCircle size={16} />}
                        </button>
                        <div className="flex-1 relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-brand-400">
                            {String.fromCharCode(65 + oi)}.
                          </span>
                          <input
                            value={opt}
                            onChange={e => updateOption(oi, e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 border border-brand-300 dark:border-brand-600 rounded-lg bg-white dark:bg-brand-800 text-brand-900 dark:text-white"
                            placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                          />
                        </div>
                        {selectedQuestion.options.length > 2 && (
                          <button
                            onClick={() => removeOption(oi)}
                            className="p-2 text-brand-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addOption}
                    className="mt-3 flex items-center gap-1.5 text-sm text-brand-600 font-semibold hover:underline"
                  >
                    <Plus size={14} /> Add Option
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-brand-900 rounded-xl border border-brand-200 dark:border-brand-700 shadow-sm p-12 text-center">
                <HelpCircle className="mx-auto mb-3 text-brand-400" size={48} />
                <h3 className="text-lg font-bold text-brand-900 dark:text-white mb-2">No question selected</h3>
                <p className="text-brand-500 dark:text-brand-300 mb-4">Add a question from the left panel to get started.</p>
                <button
                  onClick={addQuestion}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700"
                >
                  <Plus size={16} /> Add First Question
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

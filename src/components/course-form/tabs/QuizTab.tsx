import React, { useState } from 'react';
import { Plus, Edit3, Trash2, HelpCircle, Check } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizTabProps {
  questions: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
}

export default function QuizTab({ questions, onChange }: QuizTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editOptions, setEditOptions] = useState<string[]>(['', '', '', '']);
  const [editCorrect, setEditCorrect] = useState(0);

  const addQuestion = () => {
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    };
    onChange([...questions, newQ]);
    startEdit(newQ);
  };

  const startEdit = (q: QuizQuestion) => {
    setEditingId(q.id);
    setEditQuestion(q.question);
    setEditOptions([...q.options]);
    setEditCorrect(q.correctAnswer);
  };

  const saveEdit = () => {
    if (!editingId || !editQuestion.trim()) return;
    onChange(questions.map(q =>
      q.id === editingId
        ? { ...q, question: editQuestion, options: editOptions, correctAnswer: editCorrect }
        : q
    ));
    setEditingId(null);
  };

  const deleteQuestion = (id: string) => {
    onChange(questions.filter(q => q.id !== id));
    if (editingId === id) setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quiz Questions</h3>
        <button
          onClick={addQuestion}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          <Plus size={16} /> Add Question
        </button>
      </div>

      {questions.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
          <HelpCircle className="mx-auto mb-3 text-gray-400" size={40} />
          <p className="text-gray-500 dark:text-gray-400">No quiz questions yet. Add questions to create a quiz for this course.</p>
        </div>
      )}

      <div className="space-y-4">
        {questions.map((q, qi) => (
          <div key={q.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
            {editingId === q.id ? (
              <div className="p-4 space-y-3">
                <input
                  value={editQuestion}
                  onChange={e => setEditQuestion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your question..."
                />
                <div className="space-y-2">
                  {editOptions.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <button
                        onClick={() => setEditCorrect(oi)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          editCorrect === oi
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                        }`}
                      >
                        {editCorrect === oi && <Check size={14} />}
                      </button>
                      <input
                        value={opt}
                        onChange={e => {
                          const newOpts = [...editOptions];
                          newOpts[oi] = e.target.value;
                          setEditOptions(newOpts);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Click the circle to mark the correct answer</p>
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700">Save</button>
                  <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-sm font-bold text-brand-700 dark:text-brand-300 flex-none">
                    {qi + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">{q.question || 'Untitled Question'}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className={`text-sm px-3 py-1.5 rounded-lg ${
                          oi === q.correctAnswer
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {String.fromCharCode(65 + oi)}. {opt || '—'}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-none">
                    <button onClick={() => startEdit(q)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-brand-600">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => deleteQuestion(q.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

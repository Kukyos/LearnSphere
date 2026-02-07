import React, { useState } from 'react';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  questionCount: number;
}

interface QuizTabProps {
  quizzes: Quiz[];
  setQuizzes: (quizzes: Quiz[]) => void;
  onchange?: () => void;
}

export default function QuizTab({ quizzes, setQuizzes, onchange }: QuizTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this quiz?')) {
      setQuizzes(quizzes.filter((q) => q.id !== id));
      onchange?.();
    }
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingId(quiz.id);
    setEditTitle(quiz.title);
  };

  const handleSaveEdit = (id: string) => {
    setQuizzes(
      quizzes.map((q) =>
        q.id === id ? { ...q, title: editTitle } : q
      )
    );
    setEditingId(null);
    onchange?.();
  };

  const handleAddQuiz = () => {
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: 'New Quiz',
      questionCount: 0,
    };
    setQuizzes([...quizzes, newQuiz]);
    onchange?.();
  };

  return (
    <div className="space-y-4">
      {quizzes.length > 0 ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900">Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900">Questions</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    {editingId === quiz.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="px-3 py-1 border border-indigo-500 rounded focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                        onBlur={() => handleSaveEdit(quiz.id)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveEdit(quiz.id);
                          }
                        }}
                      />
                    ) : (
                      <p className="font-medium text-gray-900">{quiz.title}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                      {quiz.questionCount} questions
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(quiz)}
                        className="p-2 text-gray-600 hover:bg-indigo-50 rounded transition"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(quiz.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No quizzes yet</p>
          <p className="text-sm text-gray-500">Create your first quiz to assess student knowledge</p>
        </div>
      )}

      {/* Add Quiz Button */}
      <button
        onClick={handleAddQuiz}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition flex items-center justify-center gap-2 font-medium"
      >
        <Plus className="h-5 w-5" />
        Add Quiz
      </button>
    </div>
  );
}
export default QuizTab;
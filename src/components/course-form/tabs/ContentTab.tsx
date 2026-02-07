import React, { useState } from 'react';
import { GripVertical, Plus, Edit3, Trash2, Video, FileText, HelpCircle, Image } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'document' | 'image' | 'quiz';
  content: string;
  description: string;
}

interface ContentTabProps {
  lessons: Lesson[];
  onChange: (lessons: Lesson[]) => void;
}

export default function ContentTab({ lessons, onChange }: ContentTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState<Lesson['type']>('video');
  const [editContent, setEditContent] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const typeIcons: Record<string, React.ReactNode> = {
    video: <Video size={16} className="text-blue-500" />,
    document: <FileText size={16} className="text-purple-500" />,
    image: <Image size={16} className="text-green-500" />,
    quiz: <HelpCircle size={16} className="text-orange-500" />,
  };

  const addLesson = () => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: `Lesson ${lessons.length + 1}`,
      type: 'video',
      content: '',
      description: '',
    };
    onChange([...lessons, newLesson]);
    setEditingId(newLesson.id);
    setEditTitle(newLesson.title);
    setEditType(newLesson.type);
    setEditContent('');
    setEditDescription('');
  };

  const startEdit = (lesson: Lesson) => {
    setEditingId(lesson.id);
    setEditTitle(lesson.title);
    setEditType(lesson.type);
    setEditContent(lesson.content);
    setEditDescription(lesson.description);
  };

  const saveEdit = () => {
    if (!editingId) return;
    onChange(lessons.map(l =>
      l.id === editingId ? { ...l, title: editTitle, type: editType, content: editContent, description: editDescription } : l
    ));
    setEditingId(null);
  };

  const deleteLesson = (id: string) => {
    onChange(lessons.filter(l => l.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const moveLesson = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= lessons.length) return;
    const newLessons = [...lessons];
    [newLessons[index], newLessons[newIndex]] = [newLessons[newIndex], newLessons[index]];
    onChange(newLessons);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Course Content</h3>
        <button
          onClick={addLesson}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          <Plus size={16} /> Add Lesson
        </button>
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
          <FileText className="mx-auto mb-3 text-gray-400" size={40} />
          <p className="text-gray-500 dark:text-gray-400">No lessons yet. Add your first lesson to get started.</p>
        </div>
      )}

      <div className="space-y-3">
        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
            {editingId === lesson.id ? (
              <div className="p-4 space-y-3">
                <input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Lesson title"
                />
                <div className="flex gap-2">
                  {(['video', 'document', 'image', 'quiz'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setEditType(type)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors capitalize ${
                        editType === type
                          ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {typeIcons[type]} {type}
                    </button>
                  ))}
                </div>
                <textarea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Lesson description"
                  rows={2}
                />
                <input
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={editType === 'video' ? 'YouTube embed URL' : editType === 'document' ? 'Document content (Markdown)' : 'Content URL'}
                />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700">Save</button>
                  <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4">
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveLesson(index, -1)} disabled={index === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">
                    <GripVertical size={14} />
                  </button>
                </div>
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-500">
                  {index + 1}
                </div>
                {typeIcons[lesson.type]}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{lesson.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{lesson.type}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(lesson)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-brand-600">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => deleteLesson(lesson.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

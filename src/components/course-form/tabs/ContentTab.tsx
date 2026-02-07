import React, { useState } from 'react';
import { Plus, Edit, Trash2, GripVertical, Video, FileText, HelpCircle } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'doc' | 'quiz';
  order: number;
}

interface ContentTabProps {
  lessons: Lesson[];
  setLessons: (lessons: Lesson[]) => void;
  onchange?: () => void;
}

const TYPE_ICONS = {
  video: <Video className="h-4 w-4" />,
  doc: <FileText className="h-4 w-4" />,
  quiz: <HelpCircle className="h-4 w-4" />,
};

const TYPE_LABELS = {
  video: 'Video',
  doc: 'Document',
  quiz: 'Quiz',
};

export default function ContentTab({ lessons, setLessons, onchange }: ContentTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this lesson?')) {
      setLessons(lessons.filter((l) => l.id !== id));
      onchange?.();
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingId(lesson.id);
    setEditTitle(lesson.title);
  };

  const handleSaveEdit = (id: string) => {
    setLessons(
      lessons.map((l) =>
        l.id === id ? { ...l, title: editTitle } : l
      )
    );
    setEditingId(null);
    onchange?.();
  };

  const handleAddLesson = () => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: 'New Lesson',
      type: 'video',
      order: lessons.length + 1,
    };
    setLessons([...lessons, newLesson]);
    onchange?.();
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toIndex: number) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (fromIndex === toIndex) return;

    const newLessons = [...lessons];
    const [movedLesson] = newLessons.splice(fromIndex, 1);
    newLessons.splice(toIndex, 0, movedLesson);
    
    // Update order numbers
    const updatedLessons = newLessons.map((lesson, idx) => ({
      ...lesson,
      order: idx + 1,
    }));
    
    setLessons(updatedLessons);
    onchange?.();
  };

  return (
    <div className="space-y-4">
      {/* Lessons List */}
      <div className="space-y-2">
        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 group transition cursor-move"
          >
            {/* Drag Handle */}
            <div className="flex-shrink-0 text-gray-400 group-hover:text-gray-600">
              <GripVertical className="h-5 w-5" />
            </div>

            {/* Order Number */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-sm font-semibold text-indigo-700">{index + 1}</span>
            </div>

            {/* Type Icon & Title */}
            <div className="flex-1 min-w-0">
              {editingId === lesson.id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-1 border border-indigo-500 rounded focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                  onBlur={() => handleSaveEdit(lesson.id)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveEdit(lesson.id);
                    }
                  }}
                />
              ) : (
                <div className="flex items-center gap-3">
                  <div className="text-gray-500">{TYPE_ICONS[lesson.type]}</div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{lesson.title}</p>
                    <p className="text-xs text-gray-500">{TYPE_LABELS[lesson.type]}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => handleEdit(lesson)}
                className="p-2 text-gray-600 hover:bg-indigo-50 rounded transition"
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(lesson.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Lesson Button */}
      <button
        onClick={handleAddLesson}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition flex items-center justify-center gap-2 font-medium"
      >
        <Plus className="h-5 w-5" />
        Add Lesson
      </button>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Drag lessons</strong> to reorder them. Click on the lesson title to edit it.
        </p>
      </div>
    </div>
  );
}
export default ContentTab;
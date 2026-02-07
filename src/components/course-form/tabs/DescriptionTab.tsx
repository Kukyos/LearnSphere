import React, { useState } from 'react';
import { Type, Bold, Italic, List, Heading2 } from 'lucide-react';

interface DescriptionTabProps {
  description: string;
  onDescriptionChange: (description: string) => void;
}

export default function DescriptionTab({
  description,
  onDescriptionChange,
}: DescriptionTabProps) {
  const [wordCount, setWordCount] = useState(0);

  const handleChange = (text: string) => {
    onDescriptionChange(text);
    // Count words
    const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
    setWordCount(words.length);
  };

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = description.substring(start, end);
    const newText =
      description.substring(0, start) +
      before +
      selectedText +
      after +
      description.substring(end);

    handleChange(newText);
  };

  return (
    <div className="space-y-4">
      {/* Rich Text Editor Toolbar */}
      <div className="flex gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200 flex-wrap">
        <button
          onClick={() => insertMarkdown('**', '**')}
          className="p-2 text-gray-600 hover:bg-white rounded border border-gray-300 transition"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          onClick={() => insertMarkdown('*', '*')}
          className="p-2 text-gray-600 hover:bg-white rounded border border-gray-300 transition"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          onClick={() => insertMarkdown('## ')}
          className="p-2 text-gray-600 hover:bg-white rounded border border-gray-300 transition"
          title="Heading"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <div className="w-px bg-gray-300" />
        <button
          onClick={() => insertMarkdown('- ')}
          className="p-2 text-gray-600 hover:bg-white rounded border border-gray-300 transition"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={description}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter course description... (Supports markdown formatting)"
          className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
        />
        <div className="absolute bottom-4 right-4 text-xs text-gray-500">
          {wordCount} words
        </div>
      </div>

      {/* Preview */}
      {description && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Preview</h4>
          <div className="text-gray-700 whitespace-pre-wrap break-words">
            {description}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          💡 For production, integrate React-Quill or TipTap for rich HTML editing.
        </p>
      </div>
    </div>
  );
}
export default DescriptionTab;
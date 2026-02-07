import React from 'react';
import { Bold, Italic, List, Link, Code, Heading1, Heading2 } from 'lucide-react';

interface DescriptionTabProps {
  description: string;
  onChange: (description: string) => void;
}

export default function DescriptionTab({ description, onChange }: DescriptionTabProps) {
  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('description-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = description.substring(start, end);
    const newText = description.substring(0, start) + prefix + selected + suffix + description.substring(end);
    onChange(newText);
  };

  const toolbarButtons = [
    { icon: <Heading1 size={16} />, action: () => insertMarkdown('# '), title: 'Heading 1' },
    { icon: <Heading2 size={16} />, action: () => insertMarkdown('## '), title: 'Heading 2' },
    { icon: <Bold size={16} />, action: () => insertMarkdown('**', '**'), title: 'Bold' },
    { icon: <Italic size={16} />, action: () => insertMarkdown('*', '*'), title: 'Italic' },
    { icon: <List size={16} />, action: () => insertMarkdown('- '), title: 'List' },
    { icon: <Link size={16} />, action: () => insertMarkdown('[', '](url)'), title: 'Link' },
    { icon: <Code size={16} />, action: () => insertMarkdown('`', '`'), title: 'Code' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Course Description</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">Write a detailed description of your course using Markdown formatting.</p>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-t-xl border border-b-0 border-gray-200 dark:border-gray-700">
        {toolbarButtons.map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            title={btn.title}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          >
            {btn.icon}
          </button>
        ))}
      </div>

      {/* Editor */}
      <textarea
        id="description-editor"
        value={description}
        onChange={e => onChange(e.target.value)}
        rows={16}
        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-b-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 -mt-4"
        placeholder="# Course Overview&#10;&#10;Write your course description here using Markdown...&#10;&#10;## What you'll learn&#10;- Point 1&#10;- Point 2&#10;&#10;## Prerequisites&#10;- Basic knowledge of..."
      />

      {/* Preview */}
      {description && (
        <div>
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Preview</h4>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
            <div className="prose dark:prose-invert max-w-none text-sm">
              {description.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold mt-4 mb-2">{line.slice(2)}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold mt-3 mb-2">{line.slice(3)}</h2>;
                if (line.startsWith('- ')) return <li key={i} className="ml-4">{line.slice(2)}</li>;
                if (line.trim() === '') return <br key={i} />;
                return <p key={i} className="mb-1">{line}</p>;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Eye, Image, Tag, ToggleLeft, ToggleRight,
  BookOpen, FileText, Settings, HelpCircle, Users, Mail, X, Circle
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../../context/AuthContext';
import ContentTab from '../../components/course-form/tabs/ContentTab';
import DescriptionTab from '../../components/course-form/tabs/DescriptionTab';
import OptionsTab from '../../components/course-form/tabs/OptionsTab';
import QuizTab from '../../components/course-form/tabs/QuizTab';
import AddAttendeeModal from '../../components/course-form/modals/AddAttendeeModal';
import ContactAttendeeModal from '../../components/course-form/modals/ContactAttendeeModal';
import PreviewModal from '../../components/course-form/modals/PreviewModal';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'document' | 'image' | 'quiz';
  content: string;
  description: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'fill_blank';
  options: string[];
  correctAnswer: number;
  correctText?: string;
}

export default function CourseForm() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses, updateCourse } = useApp();
  const { user: authUser } = useAuth();
  const isAdmin = authUser?.role === 'admin';
  const isEditing = !!courseId;
  const existingCourse = isEditing ? courses.find(c => c.id === courseId) : null;

  // Form state
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [published, setPublished] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'description' | 'options' | 'quiz'>('content');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState({
    visibility: 'Everyone' as 'Everyone' | 'Signed In',
    access: 'Open' as 'Open' | 'On Invitation' | 'On Payment',
    price: '',
    courseAdmin: '',
  });
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  // Load existing course data
  useEffect(() => {
    if (existingCourse) {
      setTitle(existingCourse.title);
      setCoverImage(existingCourse.coverImage || '');
      setTags(existingCourse.tags || []);
      setPublished(existingCourse.published);
      setDescription(existingCourse.description || '');
      setLessons(existingCourse.lessons.map(l => ({
        id: l.id,
        title: l.title,
        type: l.type,
        content: l.content,
        description: l.description,
      })));
      setOptions({
        visibility: existingCourse.visibility,
        access: existingCourse.access,
        price: existingCourse.price?.toString() || '',
        courseAdmin: existingCourse.instructorName || '',
      });
      // Load quiz questions from lessons
      const quizLesson = existingCourse.lessons.find(l => l.type === 'quiz' && l.quiz);
      if (quizLesson?.quiz) {
        setQuizQuestions(quizLesson.quiz.questions);
      }
    }
  }, [courseId]);

  // Modal state
  const [showAddAttendee, setShowAddAttendee] = useState(false);
  const [showContactAttendee, setShowContactAttendee] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSave = () => {
    if (!title.trim()) {
      setValidationError('Please enter a course title');
      setTimeout(() => setValidationError(null), 3000);
      return;
    }
    setValidationError(null);
    const courseData = {
      title,
      coverImage,
      tags,
      published,
      description,
      shortDescription: description.slice(0, 120),
      visibility: options.visibility as 'Everyone' | 'Signed In',
      access: options.access as 'Open' | 'On Invitation' | 'On Payment',
      price: options.price ? parseFloat(options.price) : undefined,
      lessons: lessons.map(l => ({
        id: l.id,
        title: l.title,
        type: l.type,
        content: l.content,
        description: l.description,
        quiz: l.type === 'quiz' && quizQuestions.length > 0 ? {
          questions: quizQuestions,
          rewardRules: [{ attempt: 1, points: 15 }, { attempt: 2, points: 10 }, { attempt: 3, points: 5 }],
        } : undefined,
      })),
    };
    if (courseId) {
      updateCourse(courseId, courseData);
    }
    navigate('/courses');
  };

  const tabs = [
    { id: 'content' as const, label: 'Content', icon: <BookOpen size={16} /> },
    { id: 'description' as const, label: 'Description', icon: <FileText size={16} /> },
    { id: 'options' as const, label: 'Options', icon: <Settings size={16} /> },
    { id: 'quiz' as const, label: 'Quiz', icon: <HelpCircle size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-nature-light/60 dark:bg-brand-950/60 pt-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-brand-900 border-b border-brand-200 dark:border-brand-700 shadow-sm" style={{ top: '0', paddingTop: '80px' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/courses')}
                className="p-2 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-700 text-brand-500 dark:text-brand-400"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-brand-900 dark:text-white">
                  {isEditing ? 'Edit Course' : 'Create Course'}
                </h1>
                <p className="text-xs text-brand-500 dark:text-brand-400">
                  <span className="flex items-center gap-1">{published ? <><Circle size={10} fill="#22c55e" className="text-green-500" /> Published</> : <><Circle size={10} fill="#ef4444" className="text-red-500" /> Draft</>}</span>
                </p>
                {isAdmin && isEditing && existingCourse?.instructorName && (
                  <p className="text-xs text-brand-500 dark:text-brand-400 mt-0.5">
                    Instructor: <span className="font-semibold text-brand-700 dark:text-brand-300">{existingCourse.instructorName}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-1.5 px-4 py-2 border border-brand-300 dark:border-brand-600 rounded-lg text-sm font-semibold text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-700"
              >
                <Eye size={16} /> Preview
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-5 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 transition-colors"
              >
                <Save size={16} /> Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {/* Validation error banner */}
        {validationError && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
            {validationError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Course Title */}
            <div className="bg-white dark:bg-brand-900 rounded-xl p-5 shadow-sm border border-brand-200 dark:border-brand-700">
              <label className="text-sm font-semibold text-brand-700 dark:text-brand-300 block mb-2">Course Title</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 border border-brand-300 dark:border-brand-600 rounded-lg bg-white dark:bg-brand-800 text-brand-900 dark:text-white font-semibold"
                placeholder="Enter course title..."
              />
            </div>

            {/* Cover Image */}
            <div className="bg-white dark:bg-brand-900 rounded-xl p-5 shadow-sm border border-brand-200 dark:border-brand-700">
              <label className="text-sm font-semibold text-brand-700 dark:text-brand-300 block mb-2 flex items-center gap-1.5">
                <Image size={16} /> Cover Image
              </label>
              <input
                value={coverImage}
                onChange={e => setCoverImage(e.target.value)}
                className="w-full px-3 py-2 border border-brand-300 dark:border-brand-600 rounded-lg bg-white dark:bg-brand-800 text-brand-900 dark:text-white text-sm"
                placeholder="Image URL..."
              />
              {coverImage && (
                <img src={coverImage} alt="Cover" className="mt-3 w-full h-32 object-cover rounded-lg" />
              )}
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-brand-900 rounded-xl p-5 shadow-sm border border-brand-200 dark:border-brand-700">
              <label className="text-sm font-semibold text-brand-700 dark:text-brand-300 block mb-2 flex items-center gap-1.5">
                <Tag size={16} /> Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-brand-300 dark:border-brand-600 rounded-lg bg-white dark:bg-brand-800 text-brand-900 dark:text-white text-sm"
                  placeholder="Add a tag..."
                />
                <button onClick={addTag} className="px-3 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700">Add</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={12} /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Publish Toggle */}
            <div className="bg-white dark:bg-brand-900 rounded-xl p-5 shadow-sm border border-brand-200 dark:border-brand-700">
              <button
                onClick={() => setPublished(!published)}
                className="flex items-center justify-between w-full"
              >
                <span className="text-sm font-semibold text-brand-700 dark:text-brand-300">Published</span>
                {published ? (
                  <ToggleRight size={32} className="text-brand-600" />
                ) : (
                  <ToggleLeft size={32} className="text-brand-400" />
                )}
              </button>
            </div>

            {/* Attendee Actions */}
            <div className="bg-white dark:bg-brand-900 rounded-xl p-5 shadow-sm border border-brand-200 dark:border-brand-700 space-y-3">
              <h4 className="text-sm font-semibold text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
                <Users size={16} /> Attendees
              </h4>
              <button
                onClick={() => setShowAddAttendee(true)}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 border border-brand-300 dark:border-brand-600 rounded-lg text-sm font-semibold text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-700"
              >
                <Users size={14} /> Add Attendees
              </button>
              <button
                onClick={() => setShowContactAttendee(true)}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 border border-brand-300 dark:border-brand-600 rounded-lg text-sm font-semibold text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-700"
              >
                <Mail size={14} /> Contact Attendees
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tab Buttons */}
            <div className="flex gap-1 p-1 bg-brand-100 dark:bg-brand-900 rounded-xl mb-6 border border-brand-200 dark:border-brand-700">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-brand-800 text-brand-700 dark:text-brand-300 shadow-sm'
                      : 'text-brand-500 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-brand-900 rounded-xl p-6 shadow-sm border border-brand-200 dark:border-brand-700 min-h-[500px]">
              {activeTab === 'content' && <ContentTab lessons={lessons} onChange={setLessons} />}
              {activeTab === 'description' && <DescriptionTab description={description} onChange={setDescription} />}
              {activeTab === 'options' && <OptionsTab options={options} onChange={setOptions} />}
              {activeTab === 'quiz' && <QuizTab questions={quizQuestions} onChange={setQuizQuestions} />}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddAttendeeModal isOpen={showAddAttendee} onClose={() => setShowAddAttendee(false)} courseId={courseId} />
      <ContactAttendeeModal isOpen={showContactAttendee} onClose={() => setShowContactAttendee(false)} courseId={courseId} />
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        course={{ title, description, coverImage, tags, lessons, access: options.access, price: options.price }}
      />
    </div>
  );
}

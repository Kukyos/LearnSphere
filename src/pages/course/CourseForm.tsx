import React, { useState } from 'react';
import {
  Save,
  X,
  Upload,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Mail,
  ChevronDown,
  AlertCircle,
  Check,
} from 'lucide-react';
import AddAttendeeModal from './modals/AddAttendeeModal';
import ContactAttendeeModal from './modals/ContactAttendeeModal';
import PreviewModal from './modals/PreviewModal';
import ContentTab from './tabs/ContentTab';
import DescriptionTab from './tabs/DescriptionTab';
import OptionsTab from './tabs/OptionsTab';
import QuizTab from './tabs/QuizTab';

// Types
interface Course {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
  coverImage?: string;
  visibility: 'everyone' | 'signed_in';
  accessRule: 'open' | 'invitation' | 'payment';
  price?: number;
  adminId?: string;
  attendeesCount?: number;
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'doc' | 'quiz';
  order: number;
}

interface Quiz {
  id: string;
  title: string;
  questionCount: number;
}

type TabType = 'content' | 'description' | 'options' | 'quiz';

// Mock Data
const MOCK_COURSE: Course = {
  id: '1',
  title: 'Advanced React Patterns',
  description: 'Learn advanced React patterns and best practices for building scalable applications.',
  isPublished: true,
  coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=600&h=400&fit=crop',
  visibility: 'everyone',
  accessRule: 'open',
  adminId: 'user-1',
  attendeesCount: 1250,
};

const MOCK_LESSONS: Lesson[] = [
  { id: '1', title: 'Introduction to React Hooks', type: 'video', order: 1 },
  { id: '2', title: 'useState & useEffect Deep Dive', type: 'video', order: 2 },
  { id: '3', title: 'Custom Hooks Pattern', type: 'doc', order: 3 },
  { id: '4', title: 'React Hooks Quiz', type: 'quiz', order: 4 },
];

const MOCK_QUIZZES: Quiz[] = [
  { id: 'q1', title: 'React Fundamentals', questionCount: 10 },
  { id: 'q2', title: 'Hooks Mastery', questionCount: 15 },
];

const ADMIN_USERS = [
  { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
  { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: 'user-3', name: 'Bob Wilson', email: 'bob@example.com' },
];

export default function CourseForm() {
  // State Management
  const [course, setCourse] = useState<Course>(MOCK_COURSE);
  const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
  const [quizzes, setQuizzes] = useState<Quiz[]>(MOCK_QUIZZES);
  const [activeTab, setActiveTab] = useState<TabType>('content');

  // Modal States
  const [showAddAttendee, setShowAddAttendee] = useState(false);
  const [showContactAttendee, setShowContactAttendee] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Form State
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Handle title change
  const handleTitleChange = (newTitle: string) => {
    setCourse({ ...course, title: newTitle });
    setHasChanges(true);
  };

  // Handle publish toggle
  const handlePublishToggle = () => {
    setCourse({ ...course, isPublished: !course.isPublished });
    setHasChanges(true);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setCourse({
          ...course,
          coverImage: event.target?.result as string,
        });
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCourse({
          ...course,
          coverImage: event.target?.result as string,
        });
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save
  const handleSave = async () => {
    setSaveStatus('saving');
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaveStatus('saved');
    setHasChanges(false);

    setTimeout(() => {
      setSaveStatus('idle');
    }, 3000);
  };

  // Handle discard
  const handleDiscard = () => {
    if (hasChanges && !window.confirm('Discard unsaved changes?')) {
      return;
    }
    setCourse(MOCK_COURSE);
    setHasChanges(false);
  };

  // Tab Configuration
  const tabs: Array<{ id: TabType; label: string; icon?: React.ReactNode }> = [
    { id: 'content', label: 'Content' },
    { id: 'description', label: 'Description' },
    { id: 'options', label: 'Options' },
    { id: 'quiz', label: 'Quiz' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Action Bar */}
          <div className="py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Title Input */}
            <div className="flex-1 mr-4">
              <input
                type="text"
                value={course.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-2xl font-bold text-gray-900 bg-transparent border-0 focus:ring-0 p-0 w-full outline-none placeholder-gray-400"
                placeholder="Course title..."
              />
              {hasChanges && (
                <p className="text-xs text-amber-600 mt-1">Unsaved changes</p>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="flex gap-3 items-center flex-wrap sm:flex-nowrap">
              {/* Publish Toggle */}
              <button
                onClick={handlePublishToggle}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 whitespace-nowrap ${
                  course.isPublished
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    course.isPublished ? 'bg-green-600' : 'bg-gray-500'
                  }`}
                />
                {course.isPublished ? 'Published' : 'Draft'}
              </button>

              {/* Save/Discard Buttons */}
              <button
                onClick={handleDiscard}
                disabled={!hasChanges}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Discard
              </button>

              <button
                onClick={handleSave}
                disabled={!hasChanges || saveStatus === 'saving'}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 whitespace-nowrap"
              >
                {saveStatus === 'saving' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : saveStatus === 'saved' ? (
                  <>
                    <Check className="h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Second Row: Action Buttons */}
          <div className="py-4 border-t border-gray-200 flex gap-2 flex-wrap">
            <button
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <button
              onClick={() => setShowAddAttendee(true)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm"
            >
              <Users className="h-4 w-4" />
              Add Attendees
            </button>
            <button
              onClick={() => setShowContactAttendee(true)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm"
            >
              <Mail className="h-4 w-4" />
              Contact Attendees
            </button>
            {course.attendeesCount && (
              <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm font-medium">
                {course.attendeesCount} Attendees
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Offset for Fixed Header */}
      <main className="pt-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Image Upload Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Cover Image</h3>
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Image Preview */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                {course.coverImage ? (
                  <img
                    src={course.coverImage}
                    alt="Course cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Upload className="h-8 w-8" />
                  </div>
                )}
              </div>
            </div>

            {/* Upload Area */}
            <div className="flex-1">
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 hover:bg-indigo-50 transition cursor-pointer group"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer block">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2 group-hover:text-indigo-400 transition" />
                  <p className="text-sm font-medium text-gray-700">
                    Drop an image here or click to upload
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {/* Tab Navigation - Odoo Style */}
          <div className="border-b border-gray-200 px-6 flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'content' && (
              <ContentTab 
                lessons={lessons} 
                setLessons={setLessons}
                onchange={() => setHasChanges(true)}
              />
            )}
            {activeTab === 'description' && (
              <DescriptionTab
                description={course.description}
                onDescriptionChange={(desc) => {
                  setCourse({ ...course, description: desc });
                  setHasChanges(true);
                }}
              />
            )}
            {activeTab === 'options' && (
              <OptionsTab
                course={course}
                onCourseChange={(updatedCourse) => {
                  setCourse(updatedCourse);
                  setHasChanges(true);
                }}
                adminUsers={ADMIN_USERS}
              />
            )}
            {activeTab === 'quiz' && (
              <QuizTab 
                quizzes={quizzes} 
                setQuizzes={setQuizzes}
                onchange={() => setHasChanges(true)}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddAttendeeModal
        isOpen={showAddAttendee}
        onClose={() => setShowAddAttendee(false)}
        onInvite={(email) => {
          console.log('Inviting:', email);
          setShowAddAttendee(false);
        }}
      />

      <ContactAttendeeModal
        isOpen={showContactAttendee}
        onClose={() => setShowContactAttendee(false)}
        onSend={(subject, message) => {
          console.log('Sending:', subject, message);
          setShowContactAttendee(false);
        }}
      />

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        course={course}
      />
    </div>
  );
}
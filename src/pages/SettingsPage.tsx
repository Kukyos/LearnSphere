import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Bell, Shield, Palette, Globe, Mail,
  Camera, Save, ChevronRight, ToggleLeft, ToggleRight,
  BookOpen, Users, BarChart3, Key
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../contexts/AppContext';

type SettingsTab = 'profile' | 'notifications' | 'privacy' | 'appearance' | 'admin';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { theme, toggleTheme } = useApp();
  const isDark = theme === 'dark';

  const isAdmin = authUser?.role === 'admin';
  const isInstructor = authUser?.role === 'instructor' || isAdmin;

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Profile form state
  const [name, setName] = useState(authUser?.name || '');
  const [email, setEmail] = useState(authUser?.email || '');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('en');

  // Notification prefs
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [courseUpdates, setCourseUpdates] = useState(true);
  const [promotionalEmails, setPromotionalEmails] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  // Privacy prefs
  const [profileVisible, setProfileVisible] = useState(true);
  const [showProgress, setShowProgress] = useState(true);
  const [showBadges, setShowBadges] = useState(true);

  // Admin prefs
  const [siteName, setSiteName] = useState('LearnSphere');
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [requireApproval, setRequireApproval] = useState(false);

  const handleSave = () => {
    alert('Settings saved! (Backend integration pending)');
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: <User size={18} /> },
    { id: 'notifications' as const, label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'privacy' as const, label: 'Privacy', icon: <Shield size={18} /> },
    { id: 'appearance' as const, label: 'Appearance', icon: <Palette size={18} /> },
    ...(isAdmin ? [{ id: 'admin' as const, label: 'Admin', icon: <Key size={18} /> }] : []),
  ];

  const ToggleSwitch = ({ enabled, onToggle, label, description }: {
    enabled: boolean; onToggle: () => void; label: string; description?: string;
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 mr-4">
        <p className={`text-sm font-semibold ${isDark ? 'text-brand-100' : 'text-brand-900'}`}>{label}</p>
        {description && <p className={`text-xs mt-0.5 ${isDark ? 'text-brand-400' : 'text-brand-500'}`}>{description}</p>}
      </div>
      <button onClick={onToggle} className="flex-none">
        {enabled ? (
          <ToggleRight size={28} className="text-brand-600" />
        ) : (
          <ToggleLeft size={28} className={isDark ? 'text-brand-600' : 'text-brand-300'} />
        )}
      </button>
    </div>
  );

  const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className={`rounded-xl p-6 shadow-sm border ${isDark ? 'bg-white/5 border-brand-700' : 'bg-white border-brand-200'}`}>
      <h3 className={`text-lg font-bold mb-5 ${isDark ? 'text-white' : 'text-brand-900'}`}>{title}</h3>
      {children}
    </div>
  );

  const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }: {
    label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
  }) => (
    <div className="mb-4">
      <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-brand-300' : 'text-brand-700'}`}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
          isDark
            ? 'bg-brand-900 border-brand-600 text-white placeholder-brand-500'
            : 'bg-white border-brand-300 text-brand-900 placeholder-brand-400'
        } focus:outline-none focus:ring-2 focus:ring-brand-500`}
      />
    </div>
  );

  return (
    <div className={`min-h-screen pt-24 pb-16 px-4 sm:px-8 ${isDark ? 'bg-brand-950' : 'bg-nature-light'}`}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-brand-800 text-brand-400' : 'hover:bg-brand-100 text-brand-500'}`}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-brand-900'}`}>Settings</h1>
            <p className={`text-sm ${isDark ? 'text-brand-400' : 'text-brand-500'}`}>Manage your account preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <nav className={`rounded-xl overflow-hidden border ${isDark ? 'border-brand-700 bg-white/5' : 'border-brand-200 bg-white'}`}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold transition-colors border-l-4 ${
                    activeTab === tab.id
                      ? `${isDark ? 'bg-brand-800/50 text-white border-brand-500' : 'bg-brand-50 text-brand-900 border-brand-600'}`
                      : `border-transparent ${isDark ? 'text-brand-300 hover:bg-brand-800/30 hover:text-white' : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'}`
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  <ChevronRight size={14} className="ml-auto opacity-50" />
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <>
                <SectionCard title="Personal Information">
                  {/* Avatar */}
                  <div className="flex items-center gap-5 mb-6">
                    <div className="relative">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${isDark ? 'bg-brand-700 text-brand-200' : 'bg-brand-200 text-brand-700'}`}>
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          name.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <button className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-brand-600 text-white hover:bg-brand-700 transition-colors">
                        <Camera size={12} />
                      </button>
                    </div>
                    <div>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-brand-900'}`}>{name || 'Your Name'}</p>
                      <p className={`text-sm ${isDark ? 'text-brand-400' : 'text-brand-500'}`}>
                        {authUser?.role === 'admin' ? '🛡️ Administrator' : authUser?.role === 'instructor' ? '👨‍🏫 Instructor' : '👨‍🎓 Learner'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    <InputField label="Full Name" value={name} onChange={setName} placeholder="Enter your name" />
                    <InputField label="Email" value={email} onChange={setEmail} type="email" placeholder="your@email.com" />
                    <InputField label="Phone" value={phone} onChange={setPhone} placeholder="+1 (555) 000-0000" />
                    <div className="mb-4">
                      <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-brand-300' : 'text-brand-700'}`}>Language</label>
                      <select
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                          isDark ? 'bg-brand-900 border-brand-600 text-white' : 'bg-white border-brand-300 text-brand-900'
                        } focus:outline-none focus:ring-2 focus:ring-brand-500`}
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-brand-300' : 'text-brand-700'}`}>Bio</label>
                    <textarea
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      rows={3}
                      placeholder="Tell us about yourself..."
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm resize-none ${
                        isDark ? 'bg-brand-900 border-brand-600 text-white placeholder-brand-500' : 'bg-white border-brand-300 text-brand-900 placeholder-brand-400'
                      } focus:outline-none focus:ring-2 focus:ring-brand-500`}
                    />
                  </div>

                  <InputField label="Avatar URL" value={avatarUrl} onChange={setAvatarUrl} placeholder="https://..." />
                </SectionCard>

                {/* Instructor-specific */}
                {isInstructor && (
                  <SectionCard title="Instructor Settings">
                    <div className="space-y-4">
                      <div className={`flex items-center gap-4 p-4 rounded-lg ${isDark ? 'bg-brand-800/50' : 'bg-brand-50'}`}>
                        <BookOpen className="text-brand-500 flex-none" size={24} />
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-brand-900'}`}>Course Creation</p>
                          <p className={`text-xs ${isDark ? 'text-brand-400' : 'text-brand-500'}`}>Manage your course creation preferences</p>
                        </div>
                        <button onClick={() => navigate('/courses')} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                          Go to Dashboard →
                        </button>
                      </div>
                      <div className={`flex items-center gap-4 p-4 rounded-lg ${isDark ? 'bg-brand-800/50' : 'bg-brand-50'}`}>
                        <BarChart3 className="text-brand-500 flex-none" size={24} />
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-brand-900'}`}>Analytics</p>
                          <p className={`text-xs ${isDark ? 'text-brand-400' : 'text-brand-500'}`}>View your teaching analytics and reporting</p>
                        </div>
                        <button onClick={() => navigate('/reporting')} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                          View Reports →
                        </button>
                      </div>
                    </div>
                  </SectionCard>
                )}

                <div className="flex justify-end">
                  <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition-colors">
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <SectionCard title="Notification Preferences">
                <div className={`divide-y ${isDark ? 'divide-brand-700' : 'divide-brand-100'}`}>
                  <ToggleSwitch enabled={emailNotifs} onToggle={() => setEmailNotifs(!emailNotifs)} label="Email Notifications" description="Receive important updates via email" />
                  <ToggleSwitch enabled={courseUpdates} onToggle={() => setCourseUpdates(!courseUpdates)} label="Course Updates" description="Get notified when enrolled courses are updated" />
                  <ToggleSwitch enabled={promotionalEmails} onToggle={() => setPromotionalEmails(!promotionalEmails)} label="Promotional Emails" description="Receive offers and promotional content" />
                  <ToggleSwitch enabled={weeklyDigest} onToggle={() => setWeeklyDigest(!weeklyDigest)} label="Weekly Digest" description="Summary of your learning progress each week" />
                </div>
                <div className="flex justify-end mt-6">
                  <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition-colors">
                    <Save size={16} /> Save
                  </button>
                </div>
              </SectionCard>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <>
                <SectionCard title="Privacy Settings">
                  <div className={`divide-y ${isDark ? 'divide-brand-700' : 'divide-brand-100'}`}>
                    <ToggleSwitch enabled={profileVisible} onToggle={() => setProfileVisible(!profileVisible)} label="Public Profile" description="Allow other learners to see your profile" />
                    <ToggleSwitch enabled={showProgress} onToggle={() => setShowProgress(!showProgress)} label="Show Progress" description="Display your course progress on your profile" />
                    <ToggleSwitch enabled={showBadges} onToggle={() => setShowBadges(!showBadges)} label="Show Badges" description="Display earned badges on your profile" />
                  </div>
                  <div className="flex justify-end mt-6">
                    <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition-colors">
                      <Save size={16} /> Save
                    </button>
                  </div>
                </SectionCard>

                <SectionCard title="Account">
                  <div className="space-y-3">
                    <button className={`w-full text-left p-4 rounded-lg border transition-colors ${isDark ? 'border-brand-700 hover:bg-brand-800/50 text-brand-300' : 'border-brand-200 hover:bg-brand-50 text-brand-600'}`}>
                      <p className="text-sm font-semibold">Change Password</p>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-brand-500' : 'text-brand-400'}`}>Update your account password</p>
                    </button>
                    <button className="w-full text-left p-4 rounded-lg border border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20 transition-colors">
                      <p className="text-sm font-semibold text-red-600 dark:text-red-400">Delete Account</p>
                      <p className="text-xs mt-0.5 text-red-400 dark:text-red-500">Permanently delete your account and all data</p>
                    </button>
                  </div>
                </SectionCard>
              </>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <SectionCard title="Appearance">
                <div className="space-y-6">
                  <div>
                    <p className={`text-sm font-semibold mb-3 ${isDark ? 'text-brand-100' : 'text-brand-900'}`}>Theme</p>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => theme === 'dark' && toggleTheme()}
                        className={`p-5 rounded-xl border-2 text-center transition-all ${
                          !isDark ? 'border-brand-500 bg-white shadow-lg' : 'border-brand-700 bg-brand-800/50 hover:border-brand-500'
                        }`}
                      >
                        <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-nature-light border border-brand-200 flex items-center justify-center">
                          <span className="text-xl">☀️</span>
                        </div>
                        <p className={`text-sm font-bold ${isDark ? 'text-brand-200' : 'text-brand-900'}`}>Light</p>
                      </button>
                      <button
                        onClick={() => theme !== 'dark' && toggleTheme()}
                        className={`p-5 rounded-xl border-2 text-center transition-all ${
                          isDark ? 'border-brand-500 bg-brand-800 shadow-lg' : 'border-brand-200 bg-white hover:border-brand-500'
                        }`}
                      >
                        <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-brand-900 border border-brand-700 flex items-center justify-center">
                          <span className="text-xl">🌙</span>
                        </div>
                        <p className={`text-sm font-bold ${isDark ? 'text-brand-200' : 'text-brand-900'}`}>Dark</p>
                      </button>
                    </div>
                  </div>
                </div>
              </SectionCard>
            )}

            {/* Admin Tab */}
            {activeTab === 'admin' && isAdmin && (
              <>
                <SectionCard title="Platform Settings">
                  <InputField label="Site Name" value={siteName} onChange={setSiteName} placeholder="LearnSphere" />
                  <div className={`divide-y ${isDark ? 'divide-brand-700' : 'divide-brand-100'}`}>
                    <ToggleSwitch enabled={registrationOpen} onToggle={() => setRegistrationOpen(!registrationOpen)} label="Open Registration" description="Allow new users to register accounts" />
                    <ToggleSwitch enabled={requireApproval} onToggle={() => setRequireApproval(!requireApproval)} label="Require Admin Approval" description="New accounts need admin approval before access" />
                  </div>
                  <div className="flex justify-end mt-6">
                    <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition-colors">
                      <Save size={16} /> Save
                    </button>
                  </div>
                </SectionCard>

                <SectionCard title="User Management">
                  <div className="space-y-3">
                    <div className={`flex items-center gap-4 p-4 rounded-lg ${isDark ? 'bg-brand-800/50' : 'bg-brand-50'}`}>
                      <Users className="text-brand-500 flex-none" size={24} />
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-brand-900'}`}>Manage Users</p>
                        <p className={`text-xs ${isDark ? 'text-brand-400' : 'text-brand-500'}`}>View, edit, or remove user accounts</p>
                      </div>
                      <button className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                        Manage →
                      </button>
                    </div>
                    <div className={`flex items-center gap-4 p-4 rounded-lg ${isDark ? 'bg-brand-800/50' : 'bg-brand-50'}`}>
                      <Mail className="text-brand-500 flex-none" size={24} />
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-brand-900'}`}>Bulk Email</p>
                        <p className={`text-xs ${isDark ? 'text-brand-400' : 'text-brand-500'}`}>Send emails to all users or specific groups</p>
                      </div>
                      <button className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                        Send →
                      </button>
                    </div>
                    <div className={`flex items-center gap-4 p-4 rounded-lg ${isDark ? 'bg-brand-800/50' : 'bg-brand-50'}`}>
                      <Globe className="text-brand-500 flex-none" size={24} />
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-brand-900'}`}>Site Content</p>
                        <p className={`text-xs ${isDark ? 'text-brand-400' : 'text-brand-500'}`}>Manage landing page content and categories</p>
                      </div>
                      <button className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                        Edit →
                      </button>
                    </div>
                  </div>
                </SectionCard>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

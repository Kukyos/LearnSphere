import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { X, Award, TrendingUp, CheckCircle, Clock, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProfileDrawer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, courses, userProgress, theme } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const badgeLevels = [
    { name: 'Beginner', points: 0, color: '#9ca3af' },
    { name: 'Newbie', points: 20, color: '#a3b896' },
    { name: 'Explorer', points: 40, color: '#7e9a6e' },
    { name: 'Achiever', points: 60, color: '#5c7f4c' },
    { name: 'Specialist', points: 80, color: '#46623a' },
    { name: 'Expert', points: 100, color: '#384e2f' },
    { name: 'Master', points: 120, color: '#263323' }
  ];

  const currentBadgeIndex = badgeLevels.findIndex(b => b.name === user.badge);
  const nextBadge = badgeLevels[currentBadgeIndex + 1];
  const currentBadge = badgeLevels[currentBadgeIndex];

  const progressPercent = nextBadge
    ? ((user.points - currentBadge.points) / (nextBadge.points - currentBadge.points)) * 100
    : 100;

  const completedCourses = courses.filter(c => user.completedCourses.includes(c.id));
  const inProgressCourses = courses.filter(c =>
    user.enrolledCourses.includes(c.id) && !user.completedCourses.includes(c.id)
  );

  const getCourseCompletionDate = (courseId: string) => {
    const p = userProgress.find(prog => prog.courseId === courseId);
    return p?.completedDate ? new Date(p.completedDate).toLocaleDateString() : '';
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity" onClick={onClose} />
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 z-50 ${
          theme === 'dark' ? 'bg-brand-950' : 'bg-nature-light'
        } shadow-2xl overflow-y-auto transform transition-transform duration-300`}
        style={{ animation: 'slideIn 0.3s ease-out' }}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 ${theme === 'dark' ? 'bg-brand-900' : 'bg-white'} p-6 border-b ${theme === 'dark' ? 'border-brand-800' : 'border-brand-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>Profile</h2>
            <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-brand-800 text-brand-300' : 'hover:bg-brand-100 text-brand-600'}`}>
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="text-center">
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mx-auto border-4 border-brand-500 mb-4" />
            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>{user.name}</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>{user.email}</p>
          </div>

          {/* Progress Chart */}
          <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-brand-900' : 'bg-white'} shadow-lg`}>
            <div className="relative w-40 h-40 mx-auto mb-4">
              <svg className="transform -rotate-90 w-40 h-40">
                <circle cx="80" cy="80" r="70" stroke={theme === 'dark' ? '#384e2f' : '#c8d4be'} strokeWidth="12" fill="none" />
                <circle cx="80" cy="80" r="70" stroke="#5c7f4c" strokeWidth="12" fill="none"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - progressPercent / 100)}`}
                  strokeLinecap="round" className="transition-all duration-500" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <TrendingUp className="text-brand-500 mb-1" size={24} />
                <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>{user.points}</span>
                <span className={`text-xs ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>Points</span>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="text-yellow-500" size={20} />
                <span className={`text-lg font-bold ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>{user.badge}</span>
              </div>
              {nextBadge && (
                <p className={`text-sm ${theme === 'dark' ? 'text-brand-300' : 'text-brand-600'}`}>
                  {nextBadge.points - user.points} points to {nextBadge.name}
                </p>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h4 className={`text-lg font-bold mb-3 ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>Achievements</h4>
            <div className="grid grid-cols-3 gap-3">
              {badgeLevels.map((badge, index) => (
                <div key={badge.name} className={`text-center p-3 rounded-lg ${
                  index <= currentBadgeIndex
                    ? theme === 'dark' ? 'bg-brand-900' : 'bg-white'
                    : theme === 'dark' ? 'bg-brand-900 opacity-40' : 'bg-gray-100 opacity-60'
                }`}>
                  <Award size={32} className="mx-auto mb-2" style={{ color: index <= currentBadgeIndex ? badge.color : '#9ca3af' }} />
                  <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-brand-200' : 'text-brand-700'}`}>{badge.name}</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-brand-400' : 'text-brand-500'}`}>{badge.points}pts</p>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Courses */}
          {completedCourses.length > 0 && (
            <div>
              <h4 className={`text-lg font-bold mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
                <CheckCircle className="text-green-500" size={20} /> Courses Completed ({completedCourses.length})
              </h4>
              <div className="space-y-3">
                {completedCourses.map(course => (
                  <div key={course.id} onClick={() => { navigate(`/course/${course.id}`); onClose(); }}
                    className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-all ${theme === 'dark' ? 'bg-brand-900 hover:bg-brand-800' : 'bg-white hover:bg-brand-50'}`}>
                    <img src={course.coverImage} alt={course.title} className="w-16 h-16 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>{course.title}</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-brand-400' : 'text-brand-500'}`}>Completed: {getCourseCompletionDate(course.id)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* In Progress */}
          {inProgressCourses.length > 0 && (
            <div>
              <h4 className={`text-lg font-bold mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>
                <Clock className="text-blue-500" size={20} /> In Progress ({inProgressCourses.length})
              </h4>
              <div className="space-y-3">
                {inProgressCourses.map(course => {
                  const prog = userProgress.find(p => p.courseId === course.id);
                  const completedL = prog?.lessonsProgress.filter(l => l.completed).length || 0;
                  const totalL = course.lessons.length;
                  const pct = (completedL / totalL) * 100;
                  return (
                    <div key={course.id} onClick={() => { navigate(`/course/${course.id}`); onClose(); }}
                      className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-all ${theme === 'dark' ? 'bg-brand-900 hover:bg-brand-800' : 'bg-white hover:bg-brand-50'}`}>
                      <img src={course.coverImage} alt={course.title} className="w-16 h-16 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold truncate ${theme === 'dark' ? 'text-brand-50' : 'text-brand-900'}`}>{course.title}</p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div className="bg-brand-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-brand-400' : 'text-brand-500'}`}>{completedL}/{totalL} lessons • {Math.round(pct)}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Logout */}
          <button onClick={handleLogout}
            className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              theme === 'dark' ? 'bg-red-900 hover:bg-red-800 text-red-200' : 'bg-red-100 hover:bg-red-200 text-red-700'
            }`}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

export default ProfileDrawer;

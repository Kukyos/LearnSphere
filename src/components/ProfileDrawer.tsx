import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { X, Award, TrendingUp, CheckCircle, Clock, LogOut, BookOpen, Users, Shield, Settings, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProfileDrawer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, courses, userProgress, getReportData } = useApp();
  const { logout, user: authUser } = useAuth();
  const navigate = useNavigate();

  if (!user || !authUser) return null;

  const role = authUser.role;
  const isLearner = role === 'learner';
  const isGuest = role === 'guest';
  const isInstructor = role === 'instructor';
  const isAdmin = role === 'admin';

  // Learner-specific data
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

  // Instructor-specific data
  const createdCourses = courses.filter(c => c.instructorId === authUser.id);
  const publishedCourses = createdCourses.filter(c => c.published);
  const draftCourses = createdCourses.filter(c => !c.published);
  const totalEnrollments = userProgress.filter(p =>
    createdCourses.some(c => c.id === p.courseId)
  ).length;

  // Admin-specific data
  const reportData = isAdmin ? getReportData() : null;
  const totalCourses = courses.length;
  const totalPublished = courses.filter(c => c.published).length;

  const getCourseCompletionDate = (courseId: string) => {
    const p = userProgress.find(prog => prog.courseId === courseId);
    return p?.completedDate ? new Date(p.completedDate).toLocaleDateString() : '';
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'admin': return '🛡️ Administrator';
      case 'instructor': return '👨‍🏫 Instructor';
      default: return '👨‍🎓 Learner';
    }
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
        className="fixed right-0 top-0 h-full w-full sm:w-96 z-50 bg-nature-light shadow-2xl overflow-y-auto transform transition-transform duration-300"
        style={{ animation: 'slideIn 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white p-6 border-b border-brand-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-brand-900">Profile</h2>
            <button onClick={onClose} className="p-2 rounded-lg transition-colors hover:bg-brand-100 text-brand-400">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="text-center">
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mx-auto border-4 border-brand-500 mb-4" />
            <h3 className="text-xl font-bold text-brand-900">{user.name}</h3>
            <p className="text-sm text-brand-500">{user.email}</p>
            <p className="text-xs mt-1 text-brand-500">
              {getRoleLabel()}
            </p>
          </div>

          {/* ========== ADMIN VIEW ========== */}
          {isAdmin && (
            <div className="rounded-lg p-6 bg-white border border-brand-200 shadow-lg">
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-brand-900">
                <Shield className="text-brand-500" size={20} /> Platform Overview
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-2 bg-brand-100">
                    <BookOpen className="text-brand-500" size={28} />
                  </div>
                  <p className="text-2xl font-bold text-brand-900">{totalCourses}</p>
                  <p className="text-xs text-brand-500">Total Courses</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-2 bg-brand-100">
                    <CheckCircle className="text-green-500" size={28} />
                  </div>
                  <p className="text-2xl font-bold text-brand-900">{totalPublished}</p>
                  <p className="text-xs text-brand-500">Published</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-2 bg-brand-100">
                    <Users className="text-brand-500" size={28} />
                  </div>
                  <p className="text-2xl font-bold text-brand-900">{reportData?.totalParticipants || 0}</p>
                  <p className="text-xs text-brand-500">Participants</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-2 bg-brand-100">
                    <BarChart3 className="text-blue-500" size={28} />
                  </div>
                  <p className="text-2xl font-bold text-brand-900">{reportData?.completed || 0}</p>
                  <p className="text-xs text-brand-500">Completions</p>
                </div>
              </div>
            </div>
          )}

          {/* Admin Quick Access */}
          {isAdmin && (
            <div>
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-brand-900">
                <Settings className="text-brand-500" size={20} /> Quick Access
              </h4>
              <div className="space-y-2">
                <button onClick={() => { navigate('/courses'); onClose(); }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left bg-white hover:bg-brand-50 border border-brand-100">
                  <BookOpen size={18} className="text-brand-500" />
                  <div>
                    <p className="font-semibold text-sm text-brand-900">Manage Courses</p>
                    <p className="text-xs text-brand-500">Create, edit, and manage all courses</p>
                  </div>
                </button>
                <button onClick={() => { navigate('/reporting'); onClose(); }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left bg-white hover:bg-brand-50 border border-brand-100">
                  <BarChart3 size={18} className="text-blue-500" />
                  <div>
                    <p className="font-semibold text-sm text-brand-900">Reporting Dashboard</p>
                    <p className="text-xs text-brand-500">View analytics and participant data</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ========== INSTRUCTOR VIEW ========== */}
          {isInstructor && (
            <div className="rounded-lg p-6 bg-white border border-brand-200 shadow-lg">
              <h4 className="text-lg font-bold mb-4 text-brand-900">Teaching Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-2 bg-brand-100">
                    <BookOpen className="text-brand-500" size={28} />
                  </div>
                  <p className="text-2xl font-bold text-brand-900">{createdCourses.length}</p>
                  <p className="text-xs text-brand-500">Total Courses</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-2 bg-brand-100">
                    <Users className="text-brand-500" size={28} />
                  </div>
                  <p className="text-2xl font-bold text-brand-900">{totalEnrollments}</p>
                  <p className="text-xs text-brand-500">Total Enrollments</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-2 bg-brand-100">
                    <CheckCircle className="text-green-500" size={28} />
                  </div>
                  <p className="text-2xl font-bold text-brand-900">{publishedCourses.length}</p>
                  <p className="text-xs text-brand-500">Published</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-2 bg-brand-100">
                    <Clock className="text-yellow-500" size={28} />
                  </div>
                  <p className="text-2xl font-bold text-brand-900">{draftCourses.length}</p>
                  <p className="text-xs text-brand-500">Drafts</p>
                </div>
              </div>
            </div>
          )}

          {/* ========== GUEST VIEW ========== */}
          {isGuest && (
            <div className="rounded-lg p-8 bg-white border border-brand-200 shadow-lg text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
                <Award className="text-brand-400" size={32} />
              </div>
              <h4 className="text-lg font-bold text-brand-900 mb-2">Sign in to unlock</h4>
              <p className="text-sm text-brand-500 mb-6">Create an account to track your progress, earn badges, and unlock achievements.</p>
              <button
                onClick={() => { onClose(); navigate('/login'); }}
                className="w-full rounded-xl bg-brand-600 py-3 font-bold text-white transition-transform active:scale-95 hover:bg-brand-500"
              >
                Sign in / Sign up
              </button>
            </div>
          )}

          {/* ========== LEARNER VIEW ========== */}
          {/* Learner Progress Chart */}
          {isLearner && (
            <div className="rounded-lg p-6 bg-white border border-brand-200 shadow-lg">
              <div className="relative w-40 h-40 mx-auto mb-4">
                <svg className="transform -rotate-90 w-40 h-40">
                  <circle cx="80" cy="80" r="70" stroke="#384e2f" strokeWidth="12" fill="none" />
                  <circle cx="80" cy="80" r="70" stroke="#5c7f4c" strokeWidth="12" fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - progressPercent / 100)}`}
                    strokeLinecap="round" className="transition-all duration-500" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <TrendingUp className="text-brand-500 mb-1" size={24} />
                  <span className="text-3xl font-bold text-brand-900">{user.points}</span>
                  <span className="text-xs text-brand-500">Points</span>
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="text-yellow-500" size={20} />
                  <span className="text-lg font-bold text-brand-900">{user.badge}</span>
                </div>
                {nextBadge && (
                  <p className="text-sm text-brand-500">
                    {nextBadge.points - user.points} points to {nextBadge.name}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Learner Achievements */}
          {isLearner && (
            <div>
              <h4 className="text-lg font-bold mb-3 text-brand-900">Achievements</h4>
              <div className="grid grid-cols-3 gap-3">
                {badgeLevels.map((badge, index) => (
                  <div key={badge.name} className={`text-center p-3 rounded-lg ${
                    index <= currentBadgeIndex
                      ? 'bg-brand-50'
                      : 'bg-brand-50 opacity-40'
                  }`}>
                    <Award size={32} className="mx-auto mb-2" style={{ color: index <= currentBadgeIndex ? badge.color : '#9ca3af' }} />
                    <p className="text-xs font-semibold text-brand-700">{badge.name}</p>
                    <p className="text-xs text-brand-500">{badge.points}pts</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructor Created Courses */}
          {isInstructor && createdCourses.length > 0 && (
            <div>
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-brand-900">
                <BookOpen className="text-brand-500" size={20} /> My Courses ({createdCourses.length})
              </h4>
              <div className="space-y-3">
                {createdCourses.map(course => {
                  const enrollments = userProgress.filter(p => p.courseId === course.id).length;
                  return (
                    <div key={course.id} onClick={() => { navigate(`/course/${course.id}`); onClose(); }}
                      className="flex gap-3 p-3 rounded-lg cursor-pointer transition-all bg-white hover:bg-brand-50 border border-brand-100">
                      <img src={course.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop'} alt={course.title} className="w-16 h-16 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate text-brand-900">{course.title}</p>
                        <p className="text-xs text-brand-500">
                          {course.published ? '✓ Published' : '✎ Draft'} • {enrollments} enrollments
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Learner Completed Courses */}
          {isLearner && completedCourses.length > 0 && (
            <div>
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-brand-900">
                <CheckCircle className="text-green-500" size={20} /> Courses Completed ({completedCourses.length})
              </h4>
              <div className="space-y-3">
                {completedCourses.map(course => (
                  <div key={course.id} onClick={() => { navigate(`/course/${course.id}`); onClose(); }}
                    className="flex gap-3 p-3 rounded-lg cursor-pointer transition-all bg-white hover:bg-brand-50 border border-brand-100">
                    <img src={course.coverImage} alt={course.title} className="w-16 h-16 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-brand-900">{course.title}</p>
                      <p className="text-xs text-brand-500">Completed: {getCourseCompletionDate(course.id)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learner In Progress */}
          {isLearner && inProgressCourses.length > 0 && (
            <div>
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-brand-900">
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
                      className="flex gap-3 p-3 rounded-lg cursor-pointer transition-all bg-white hover:bg-brand-50 border border-brand-100">
                      <img src={course.coverImage} alt={course.title} className="w-16 h-16 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate text-brand-900">{course.title}</p>
                        <div className="w-full bg-brand-200 rounded-full h-2 mt-1">
                          <div className="bg-brand-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-xs mt-1 text-brand-500">{completedL}/{totalL} lessons • {Math.round(pct)}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Logout */}
          <button onClick={handleLogout}
            className="w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200">
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

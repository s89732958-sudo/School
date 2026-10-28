import React, { useState, useEffect } from 'react';
import { 
  AuthUser,
  StudentUser, 
  Course, 
  LearningMaterial, 
  PageRoute,
  SiteSettings 
} from '../../types';
import { 
  PRESET_AUTH_USERS 
} from '../../data/authUsersData';
import { 
  DEMO_STUDENTS, 
  INITIAL_STUDENT_TOPIC_PROGRESS, 
  LEARNING_MATERIALS, 
  UPCOMING_TESTS, 
  WEEKLY_LIVE_SCHEDULE 
} from '../../data/studentData';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Download, 
  FileText, 
  Video, 
  Award, 
  Sparkles, 
  Calendar, 
  User, 
  LogOut, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  PlayCircle, 
  ShieldCheck, 
  Printer, 
  X, 
  Layers, 
  BarChart2, 
  ArrowRight, 
  UserCheck, 
  RefreshCw,
  QrCode,
  Shield
} from 'lucide-react';

interface StudentDashboardProps {
  currentUser: AuthUser | null;
  courses: Course[];
  siteSettings?: SiteSettings;
  onUnifiedLogin: (user: AuthUser) => void;
  onLogout: () => void;
  onNavigate: (page: PageRoute) => void;
  onShowToast: (message: string) => void;
  onOpenAuth: (mode: 'login' | 'register', role?: 'admin' | 'student') => void;
}

const PROGRESS_STORAGE_KEY = 'FRA_STUDENT_TOPIC_PROGRESS_V1';

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  courses,
  siteSettings,
  onUnifiedLogin,
  onLogout,
  onNavigate,
  onShowToast,
  onOpenAuth,
}) => {
  // Navigation inside the Student Dashboard
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'materials' | 'tests' | 'schedule'>('overview');

  // Topic Completion Progress (Persisted in localStorage)
  const [topicProgress, setTopicProgress] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading topic progress:', e);
    }
    return INITIAL_STUDENT_TOPIC_PROGRESS;
  });

  // Material Filters
  const [materialSearchQuery, setMaterialSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Modals inside dashboard
  const [activePreviewMaterial, setActivePreviewMaterial] = useState<LearningMaterial | null>(null);
  const [activeVideoLecture, setActiveVideoLecture] = useState<LearningMaterial | null>(null);
  const [idCardModalOpen, setIdCardModalOpen] = useState(false);
  const [switchProfileModalOpen, setSwitchProfileModalOpen] = useState(false);

  // Expanded courses in Syllabus Tab
  const [expandedCourseIds, setExpandedCourseIds] = useState<Record<string, boolean>>({
    'up-class-10-board-accelerator': true,
    'up-class-9-math-science': true,
    'ai-prompt-engineering-foundations': true
  });

  // Save topic progress to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(topicProgress));
    } catch (e) {
      console.error('Failed to save topic progress:', e);
    }
  }, [topicProgress]);

  // Calculate live UP Board Exam Countdown
  const [daysUntilBoard, setDaysUntilBoard] = useState<number>(115);
  useEffect(() => {
    const targetDate = new Date('2026-02-18T09:00:00');
    const now = new Date();
    const diff = Math.max(0, Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    setDaysUntilBoard(diff);
  }, []);

  // Determine current student metadata
  // If user is Admin viewing student portal, give them the Class 10 student perspective with admin override
  const activeStudentProfile: StudentUser = {
    id: currentUser?.id || 'std-guest',
    fullName: currentUser?.fullName || 'Guest Student',
    rollNumber: currentUser?.rollNumber || (currentUser?.role === 'admin' ? 'FRA-ADMIN-VIEW' : 'FRA-GUEST-01'),
    email: currentUser?.email || 'student@futureready.edu',
    grade: currentUser?.grade || 'Class 10',
    board: 'UP Board (UPMSP)',
    medium: currentUser?.medium || 'Hindi & English (Bilingual)',
    district: currentUser?.district || 'Prayagraj (Allahabad), UP',
    enrolledCourseIds: currentUser?.enrolledCourseIds || ['up-class-10-board-accelerator', 'ai-prompt-engineering-foundations'],
    avatarUrl: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=80',
    joinedDate: currentUser?.joinedDate || 'July 15, 2025',
    attendancePct: currentUser?.attendancePct || 94.5,
    batchName: currentUser?.batchName || 'Arjun-10 Super 30 (UPMSP High Scorer)'
  };

  // Filter student enrolled courses
  const enrolledCourses = courses.filter(c => 
    activeStudentProfile.enrolledCourseIds.includes(c.id)
  );

  // Calculate course completion percentage dynamically from syllabus topics
  const getCourseProgressPercentage = (course: Course): number => {
    let totalTopics = 0;
    let completedTopics = 0;

    course.modules.forEach((mod, modIdx) => {
      mod.topics.forEach((_, topIdx) => {
        totalTopics += 1;
        const key = `${course.id}_${modIdx}_${topIdx}`;
        if (topicProgress[key]) {
          completedTopics += 1;
        }
      });
    });

    if (totalTopics === 0) return 0;
    return Math.round((completedTopics / totalTopics) * 100);
  };

  // Overall student progress across all enrolled courses
  const getOverallStudentProgress = (): number => {
    if (enrolledCourses.length === 0) return 0;
    const totalPct = enrolledCourses.reduce((acc, c) => acc + getCourseProgressPercentage(c), 0);
    return Math.round(totalPct / enrolledCourses.length);
  };

  const handleToggleTopic = (courseId: string, modIdx: number, topIdx: number, topicTitle: string) => {
    const key = `${courseId}_${modIdx}_${topIdx}`;
    const newState = !topicProgress[key];
    setTopicProgress(prev => ({
      ...prev,
      [key]: newState
    }));

    if (newState) {
      onShowToast(`Completed topic: "${topicTitle.slice(0, 36)}..." (+Progress Saved)`);
    } else {
      onShowToast(`Marked topic as pending for revision.`);
    }
  };

  const toggleCourseExpanded = (courseId: string) => {
    setExpandedCourseIds(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const handleDownloadMaterial = (mat: LearningMaterial) => {
    onShowToast(`Preparing download: "${mat.title.slice(0, 40)}..." (PDF file verified)`);
  };

  // =========================================================================
  // GUEST / NOT LOGGED IN VIEW
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-700/60 text-emerald-400 text-xs font-semibold mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            SECURE STUDENT & PARENT ACADEMIC PORTAL
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Student Learning Dashboard
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Log in once with your Future Ready Academy credentials to access enrolled UP Board courses, syllabus progress, NCERT formula sheets, and live classrooms.
          </p>
        </div>

        {/* 1-Click Fast Student Login Switcher */}
        <div className="mb-10 bg-gradient-to-r from-[#07130e] via-[#091b13] to-[#07130e] border border-emerald-600/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(16,185,129,0.12)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-emerald-900/60 mb-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#d4af37] font-bold">
                Unified Authentication • Quick Demo Access
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Sign in as Student, Admin or Ambassador
              </h3>
            </div>
            <button
              onClick={() => onOpenAuth('login')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <span>Custom Login with Passcode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRESET_AUTH_USERS.filter(u => u.role === 'student').map((student) => (
              <div 
                key={student.id}
                onClick={() => {
                  onUnifiedLogin(student);
                  onShowToast(`Logged in as ${student.fullName} (${student.grade} - UP Board)`);
                }}
                className="group p-4 rounded-xl bg-[#050b08] border border-emerald-900/80 hover:border-emerald-500 hover:bg-[#071710] cursor-pointer transition-all duration-200 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-900 to-[#040806] border border-emerald-600/50 flex items-center justify-center font-bold text-emerald-300 text-sm overflow-hidden">
                    {student.avatarUrl ? (
                      <img src={student.avatarUrl} alt={student.fullName} className="w-full h-full object-cover" />
                    ) : (
                      student.fullName.slice(0, 2)
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {student.fullName}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#141208] text-[#d4af37] border border-[#d4af37]/40">
                        {student.grade}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Roll: <span className="text-gray-300 font-mono">{student.rollNumber}</span> • {student.district}
                    </div>
                    <div className="text-[11px] text-emerald-400/90 mt-1 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{student.enrolledCourseIds?.length} Enrolled Courses</span>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-400">
            <span>Are you an Academy Administrator or Teacher?</span>
            <button
              onClick={() => {
                onUnifiedLogin(PRESET_AUTH_USERS[0]);
                onNavigate('admin');
                onShowToast('Signed in as Super Admin. Entering Admin Hub.');
              }}
              className="text-[#d4af37] hover:text-white font-semibold flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Login as Super Admin</span>
            </button>
          </div>
        </div>

        {/* Central Sign In Action Card */}
        <div className="max-w-md mx-auto text-center">
          <button
            onClick={() => onOpenAuth('login')}
            className="w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#f4d775] hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Open Unified Sign In Dialog</span>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // LOGGED IN VIEW
  // =========================================================================
  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Admin Privilege Banner (if user is Admin viewing Student Portal) */}
      {currentUser.role === 'admin' && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#171308] via-[#211a09] to-[#171308] border border-[#d4af37]/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2e230b] border border-[#d4af37] flex items-center justify-center text-[#d4af37] shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">
                Administrator Live Preview Mode Active
              </span>
              <span className="text-gray-300">
                You are currently previewing the Student Dashboard with Central Director privileges.
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('admin')}
            className="px-3.5 py-1.5 rounded-lg font-bold text-black bg-[#d4af37] hover:brightness-110 shrink-0 text-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Return to Admin Control Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Student Identity & Verification Ribbon */}
      <div className="bg-gradient-to-r from-[#06120c] via-[#091f14] to-[#06120c] border border-emerald-700/50 rounded-2xl p-5 sm:p-7 shadow-[0_0_35px_rgba(16,185,129,0.14)] mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Avatar & Core Metadata */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-900 to-[#040806] border-2 border-emerald-500/60 overflow-hidden shadow-lg flex items-center justify-center">
                {activeStudentProfile.avatarUrl ? (
                  <img src={activeStudentProfile.avatarUrl} alt={activeStudentProfile.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-black text-emerald-400">{activeStudentProfile.fullName.slice(0, 2)}</span>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#06120c] flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-black" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {activeStudentProfile.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#141208] text-[#d4af37] border border-[#d4af37]/50 shadow-sm">
                  {activeStudentProfile.grade}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                  {activeStudentProfile.board}
                </span>
              </div>

              <div className="text-xs sm:text-sm text-gray-400 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>Roll No: <strong className="text-gray-200 font-mono">{activeStudentProfile.rollNumber}</strong></span>
                <span>•</span>
                <span>Batch: <strong className="text-emerald-400">{activeStudentProfile.batchName}</strong></span>
                <span>•</span>
                <span>District: <strong className="text-gray-200">{activeStudentProfile.district}</strong></span>
              </div>

              <div className="mt-2.5 flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Medium: {activeStudentProfile.medium}</span>
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">
                  Joined: {activeStudentProfile.joinedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Actions & Switcher */}
          <div className="flex flex-wrap items-center gap-2.5 pt-4 lg:pt-0 border-t lg:border-t-0 border-emerald-950">
            <button
              onClick={() => setIdCardModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#09150f] border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/40 hover:border-emerald-400 transition-all shadow-sm"
            >
              <QrCode className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Student ID Card</span>
            </button>

            <button
              onClick={() => setSwitchProfileModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#131109] border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#1a170c] hover:border-[#d4af37] transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Switch Account / Role</span>
            </button>

            <button
              onClick={() => {
                onLogout();
                onShowToast('Logged out of academy session.');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-red-950/20 border border-red-900/40 text-red-300 hover:bg-red-950/40 hover:border-red-700 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 border-b border-emerald-950 mb-8 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/70 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'text-gray-400 hover:text-white hover:bg-emerald-950/30'
          }`}
        >
          <BarChart2 className="w-4 h-4 text-[#d4af37]" />
          <span>Overview & Progress</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all whitespace-nowrap ${
            activeTab === 'courses'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/70 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'text-gray-400 hover:text-white hover:bg-emerald-950/30'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>My Enrolled Courses ({enrolledCourses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all whitespace-nowrap ${
            activeTab === 'materials'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/70 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'text-gray-400 hover:text-white hover:bg-emerald-950/30'
          }`}
        >
          <FileText className="w-4 h-4 text-[#d4af37]" />
          <span>Learning Materials & Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all whitespace-nowrap ${
            activeTab === 'tests'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/70 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'text-gray-400 hover:text-white hover:bg-emerald-950/30'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Mock Tests & Scores</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all whitespace-nowrap ${
            activeTab === 'schedule'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/70 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'text-gray-400 hover:text-white hover:bg-emerald-950/30'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#d4af37]" />
          <span>Live Class Timetable</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: OVERVIEW & PROGRESS
         ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Key Metric Highlights & UPMSP Countdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* UP Board Exam Countdown */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c1810] to-[#050b07] border border-emerald-700/40 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span className="font-semibold text-[#d4af37]">UPMSP 2026 Countdown</span>
                <Clock className="w-4 h-4 text-[#d4af37]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{daysUntilBoard}</span>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Days to Board Exams</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                Targeted board revision schedules active. Keep solving weekly sample papers.
              </p>
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#d4af37]/10 rounded-full blur-xl pointer-events-none" />
            </div>

            {/* Overall Syllabus Progress */}
            <div className="p-5 rounded-2xl bg-[#060c08] border border-emerald-800/40 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span className="font-semibold text-emerald-400">Curriculum Mastery</span>
                <BarChart2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{getOverallStudentProgress()}%</span>
                <span className="text-xs font-semibold text-emerald-400">Topics Completed</span>
              </div>
              <div className="w-full bg-[#030604] h-2 rounded-full mt-3 overflow-hidden border border-emerald-950">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-[#d4af37] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${getOverallStudentProgress()}%` }}
                />
              </div>
            </div>

            {/* Live Class Attendance */}
            <div className="p-5 rounded-2xl bg-[#060c08] border border-emerald-800/40 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span className="font-semibold text-emerald-400">Class Attendance</span>
                <UserCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{activeStudentProfile.attendancePct}%</span>
                <span className="text-xs font-semibold text-emerald-400">Excellent Standing</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                36 of 38 live doubt clearing & lecture sessions attended this term.
              </p>
            </div>

            {/* Enrolled Courses */}
            <div className="p-5 rounded-2xl bg-[#060c08] border border-emerald-800/40 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span className="font-semibold text-[#d4af37]">Active Enrollments</span>
                <Layers className="w-4 h-4 text-[#d4af37]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{enrolledCourses.length}</span>
                <span className="text-xs font-semibold text-gray-300">Dual Track (Academic + Tech)</span>
              </div>
              <button
                onClick={() => setActiveTab('courses')}
                className="mt-3 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 group"
              >
                <span>View Syllabus Checklists</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

          </div>

          {/* Quick Study Tracker & Next Live Class */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Enrolled Courses Quick Status */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>My Enrolled Courses</span>
                </h3>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <span>Open Full Syllabus</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {enrolledCourses.map((course) => {
                  const pct = getCourseProgressPercentage(course);
                  return (
                    <div 
                      key={course.id}
                      className="p-5 rounded-2xl bg-[#060e0a] border border-emerald-900/60 hover:border-emerald-700/60 transition-all shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#141208] text-[#d4af37] border border-[#d4af37]/30">
                              {course.category.replace(/_/g, ' ').toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-400">{course.durationWeeks} Weeks Cohort</span>
                          </div>
                          <h4 className="text-base font-bold text-white mt-1">
                            {course.title}
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-black text-white">{pct}%</span>
                          <span className="block text-[10px] text-gray-400">Completed</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-[#030604] h-2 rounded-full overflow-hidden border border-emerald-950 mb-3">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-[#d4af37] h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-emerald-950/80">
                        <span className="text-gray-400">
                          {course.modules.length} Modules • {course.classesPerWeek} Classes/Week
                        </span>
                        <button
                          onClick={() => {
                            setActiveTab('courses');
                            setExpandedCourseIds({ ...expandedCourseIds, [course.id]: true });
                          }}
                          className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                        >
                          <span>Review Modules</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Browse Catalog CTA banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#07130e] to-[#0c2217] border border-emerald-700/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-900/60 border border-emerald-600/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Sparkles className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Add Future Skills or Board Booster</h5>
                    <p className="text-[11px] text-gray-400">Explore Web Development, AI Prompting, or Class 9/10 Foundation courses.</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('courses')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-black bg-[#d4af37] hover:brightness-110 shrink-0 shadow-sm"
                >
                  Explore Catalog
                </button>
              </div>
            </div>

            {/* Right 1 Col: Up Next Live Session & Quick Downloads */}
            <div className="space-y-6">
              
              {/* Live Session Notice */}
              <div className="p-5 rounded-2xl bg-[#08150f] border border-emerald-600/50 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-800/60 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    NEXT LIVE CLASS
                  </span>
                  <span className="text-[#d4af37] font-semibold text-xs">Today, 5:30 PM</span>
                </div>

                <h4 className="text-sm font-bold text-white">
                  UP Board Class 10: Science (Ray Optics & Numericals)
                </h4>
                <p className="text-xs text-gray-300 mt-1">
                  Mentor: <strong>Er. Vikram Singh</strong>
                </p>
                <div className="text-[11px] text-gray-400 mt-2 bg-[#040805] p-2.5 rounded-lg border border-emerald-950">
                  Topic: <em>Concave Mirror Ray Diagrams & Sign Convention Numericals</em>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => onShowToast('Connecting to Virtual Classroom Alpha (Secure WebRTC)...')}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-emerald-500 hover:brightness-110 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Join Classroom</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className="p-2 rounded-xl border border-emerald-800 text-gray-300 hover:text-white hover:bg-emerald-900/30"
                    title="View Full Timetable"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Recommended High-Weightage Study Material */}
              <div className="p-5 rounded-2xl bg-[#060c08] border border-emerald-900/60">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Must-Read Study Notes</span>
                  </h4>
                  <button
                    onClick={() => setActiveTab('materials')}
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {LEARNING_MATERIALS.slice(0, 2).map((mat) => (
                    <div 
                      key={mat.id}
                      onClick={() => setActivePreviewMaterial(mat)}
                      className="p-3 rounded-xl bg-[#030705] border border-emerald-950 hover:border-emerald-700 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div className="truncate">
                          <h5 className="text-xs font-semibold text-gray-200 group-hover:text-emerald-300 truncate">
                            {mat.title}
                          </h5>
                          <span className="text-[10px] text-gray-500">{mat.category} • {mat.fileSize}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-emerald-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: MY ENROLLED COURSES & SYLLABUS PROGRESS CHECKLIST
         ========================================================================= */}
      {activeTab === 'courses' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-950">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span>Enrolled Syllabus & Topic Progress Tracker</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Click the checkbox next to any completed topic to dynamically update your curriculum completion score.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const allExpanded = Object.values(expandedCourseIds).every(Boolean);
                  const updated: Record<string, boolean> = {};
                  enrolledCourses.forEach(c => { updated[c.id] = !allExpanded; });
                  setExpandedCourseIds(updated);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 border border-emerald-900 bg-[#07130e] hover:text-white"
              >
                Toggle All Modules
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {enrolledCourses.map((course) => {
              const isExpanded = !!expandedCourseIds[course.id];
              const pct = getCourseProgressPercentage(course);

              return (
                <div 
                  key={course.id}
                  className="rounded-2xl bg-[#060c08] border border-emerald-800/60 overflow-hidden shadow-lg"
                >
                  {/* Course Header */}
                  <div 
                    onClick={() => toggleCourseExpanded(course.id)}
                    className="p-5 sm:p-6 bg-[#08150f] border-b border-emerald-950 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#0b1c14] transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold font-mono bg-[#141208] text-[#d4af37] border border-[#d4af37]/40">
                          {course.category.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-400">
                          {course.languageMedium}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        {course.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 max-w-2xl line-clamp-2">
                        {course.shortDescription}
                      </p>
                    </div>

                    <div className="flex items-center gap-5 shrink-0">
                      <div className="text-right">
                        <div className="flex items-baseline gap-1.5 justify-end">
                          <span className="text-2xl font-black text-white">{pct}%</span>
                          <span className="text-xs font-semibold text-emerald-400">Mastered</span>
                        </div>
                        <div className="w-32 bg-[#030604] h-2 rounded-full overflow-hidden border border-emerald-950 mt-1.5">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-[#d4af37] h-full rounded-full transition-all duration-300" 
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Syllabus Modules Tree */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 space-y-6 bg-[#050a07]">
                      {course.modules.map((mod, modIdx) => (
                        <div key={modIdx} className="space-y-3">
                          <div className="flex items-center justify-between border-b border-emerald-950/80 pb-2">
                            <h4 className="text-xs sm:text-sm font-bold text-[#d4af37] flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#181507] border border-[#d4af37]/40 text-[#d4af37] text-[10px] flex items-center justify-center font-mono font-bold">
                                {modIdx + 1}
                              </span>
                              <span>{mod.title}</span>
                            </h4>
                            <span className="text-[11px] text-gray-500">
                              {mod.topics.filter((_, tIdx) => topicProgress[`${course.id}_${modIdx}_${tIdx}`]).length} / {mod.topics.length} Done
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {mod.topics.map((topic, topIdx) => {
                              const key = `${course.id}_${modIdx}_${topIdx}`;
                              const isCompleted = !!topicProgress[key];

                              return (
                                <div
                                  key={topIdx}
                                  onClick={() => handleToggleTopic(course.id, modIdx, topIdx, topic)}
                                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                    isCompleted
                                      ? 'bg-emerald-950/30 border-emerald-700/60 text-white'
                                      : 'bg-[#030604] border-emerald-950 hover:border-emerald-800 text-gray-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="shrink-0">
                                      {isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                      ) : (
                                        <Circle className="w-4 h-4 text-gray-600 hover:text-emerald-400" />
                                      )}
                                    </div>
                                    <span className={`text-xs ${isCompleted ? 'font-medium text-gray-200' : 'text-gray-400'}`}>
                                      {topic}
                                    </span>
                                  </div>

                                  {isCompleted && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/50 text-emerald-300 font-mono shrink-0">
                                      Done
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: LEARNING MATERIALS & REVISION NOTES
         ========================================================================= */}
      {activeTab === 'materials' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-950">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#d4af37]" />
                <span>UP Board Academic & Future Skills Resource Hub</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Verified NCERT study notes, high-yield formula sheets, official UPMSP model papers, and lecture masterclasses.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notes, formulas, topics..."
                value={materialSearchQuery}
                onChange={(e) => setMaterialSearchQuery(e.target.value)}
                className="w-full bg-[#060c08] border border-emerald-900/70 focus:border-emerald-400 rounded-xl pl-9 pr-3.5 py-2 text-xs text-gray-100 placeholder-gray-500 outline-none transition-all"
              />
              {materialSearchQuery && (
                <button
                  onClick={() => setMaterialSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Subject & Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-gray-500 text-[11px] font-semibold mr-1">Subject:</span>
              {['All', 'Vigyan (Science)', 'Ganit (Mathematics)', 'Python & AI', 'Web Development'].map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubjectFilter(subj)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedSubjectFilter === subj
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/80 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : 'text-gray-400 hover:text-white hover:bg-[#07130e] border border-transparent'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-gray-500 text-[11px] font-semibold mr-1">Type:</span>
              {['All', 'PDF Study Notes', 'Formula Sheet', 'UPMSP Model Paper', 'Video Lecture', 'Practice Worksheet'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedCategoryFilter === cat
                      ? 'bg-[#181507] text-[#d4af37] border border-[#d4af37]/60'
                      : 'text-gray-400 hover:text-white hover:bg-[#07130e] border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LEARNING_MATERIALS
              .filter(m => {
                const matchesSearch = 
                  m.title.toLowerCase().includes(materialSearchQuery.toLowerCase()) ||
                  m.description.toLowerCase().includes(materialSearchQuery.toLowerCase()) ||
                  m.subject.toLowerCase().includes(materialSearchQuery.toLowerCase());
                const matchesSubject = selectedSubjectFilter === 'All' || m.subject.includes(selectedSubjectFilter);
                const matchesCategory = selectedCategoryFilter === 'All' || m.category === selectedCategoryFilter;
                return matchesSearch && matchesSubject && matchesCategory;
              })
              .map((mat) => {
                return (
                  <div 
                    key={mat.id}
                    className="p-5 rounded-2xl bg-[#060c08] border border-emerald-900/60 hover:border-emerald-600/60 transition-all flex flex-col justify-between shadow-sm relative group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                            {mat.subject}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-[#141208] text-[#d4af37] border border-[#d4af37]/30">
                            {mat.category}
                          </span>
                        </div>
                        {mat.isHighWeightage && (
                          <span className="text-[10px] font-bold text-[#d4af37] flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>High Weightage</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {mat.title}
                      </h3>

                      <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                        {mat.description}
                      </p>

                      <ul className="mt-3 space-y-1">
                        {mat.highlights.slice(0, 2).map((h, i) => (
                          <li key={i} className="text-[11px] text-gray-300 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 pt-3 border-t border-emerald-950 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-gray-500">
                        {mat.pagesOrDuration} • {mat.fileSize}
                      </span>

                      <div className="flex items-center gap-2">
                        {mat.category === 'Video Lecture' ? (
                          <button
                            onClick={() => setActiveVideoLecture(mat)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-emerald-500 hover:brightness-110 shadow-sm"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Play Video</span>
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => setActivePreviewMaterial(mat)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 hover:bg-emerald-900/60"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Read Online</span>
                            </button>
                            <button
                              onClick={() => handleDownloadMaterial(mat)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-emerald-950/60"
                              title="Download PDF"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 4: MOCK TESTS & BOARD EVALUATION SCORES
         ========================================================================= */}
      {activeTab === 'tests' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-950">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span>UPMSP Pattern Mock Tests & Performance Record</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Evaluation results, answer sheet step marking, and model answer keys for Class 9 & 10 students.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/70 px-3 py-1.5 rounded-xl border border-emerald-800">
                Batch Rank: <strong>Rank 2 Overall</strong>
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {UPCOMING_TESTS.map((test) => {
              const isEvaluated = test.status === 'Evaluated';
              const pct = test.scoredMarks ? Math.round((test.scoredMarks / test.totalMarks) * 100) : 0;

              return (
                <div 
                  key={test.id}
                  className="p-5 rounded-2xl bg-[#060c08] border border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#141208] text-[#d4af37] border border-[#d4af37]/30">
                        {test.subject}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{test.date}</span>
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {test.title}
                    </h3>
                    {test.rank && (
                      <span className="text-xs font-semibold text-emerald-400 mt-1 inline-block">
                        ★ {test.rank}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {isEvaluated ? (
                      <div className="text-right">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-white">{test.scoredMarks}</span>
                          <span className="text-xs text-gray-400">/{test.totalMarks}</span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-400">
                          {pct}% Score
                        </span>
                      </div>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950/50 text-[#d4af37] border border-[#d4af37]/40">
                        Upcoming Test
                      </span>
                    )}

                    {test.solutionKeyAvailable && (
                      <button
                        onClick={() => onShowToast(`Opening official step-marking solution key for ${test.title}`)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950 border border-emerald-700/60 hover:bg-emerald-900/60 flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Answer Key</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: LIVE CLASS SCHEDULE & TIMETABLE
         ========================================================================= */}
      {activeTab === 'schedule' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-950">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#d4af37]" />
                <span>Weekly Interactive Live Schedule</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Live classes, interactive problem solving, doubt clearing clinics, and future tech practicals.
              </p>
            </div>
            <div className="text-xs text-gray-400">
              Current Batch: <strong className="text-emerald-400">{activeStudentProfile.batchName}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WEEKLY_LIVE_SCHEDULE.map((item, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-[#060c08] border border-emerald-900/60 hover:border-emerald-700/60 transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="font-bold text-[#d4af37] bg-[#141208] px-2 py-0.5 rounded border border-[#d4af37]/30">
                      {item.day}
                    </span>
                    <span className="font-mono text-gray-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>{item.time}</span>
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                    {item.courseTitle}
                  </h3>
                  <div className="text-xs text-gray-400 mt-1">
                    Faculty: <strong className="text-gray-200">{item.faculty}</strong> • Room: <span className="text-emerald-400">{item.room}</span>
                  </div>

                  <div className="mt-3 p-2.5 rounded-xl bg-[#040805] border border-emerald-950 text-xs text-gray-300">
                    <strong className="text-emerald-400">Topic:</strong> {item.topic}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-950 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-gray-500">Live Recording Available Afterward</span>
                  <button
                    onClick={() => onShowToast(`Entering ${item.room} with ${item.faculty}...`)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-black bg-emerald-400 hover:brightness-110"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Enter Room</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS: DOCUMENT PREVIEW, VIDEO LECTURE, ID CARD, PROFILE SWITCHER
         ========================================================================= */}
      {activePreviewMaterial && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div 
            className="relative bg-[#060c08] border border-emerald-600/70 rounded-2xl max-w-3xl w-full p-6 sm:p-8 overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.2)] max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-emerald-900/60">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#141208] text-[#d4af37] border border-[#d4af37]/30">
                    {activePreviewMaterial.subject}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {activePreviewMaterial.category}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {activePreviewMaterial.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePreviewMaterial(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-emerald-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 overflow-y-auto space-y-5 text-xs text-gray-300 pr-1">
              <div className="p-4 rounded-xl bg-[#040805] border border-emerald-950">
                <h4 className="font-bold text-emerald-400 text-sm mb-1.5">
                  Overview & Board Alignment
                </h4>
                <p className="leading-relaxed">
                  {activePreviewMaterial.description}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#d4af37] text-xs uppercase tracking-wider mb-2.5">
                  Core Chapters & High-Scorer Points
                </h4>
                <div className="space-y-2">
                  {activePreviewMaterial.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-[#07130e] border border-emerald-900/50">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-gray-200">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0c1811] border border-emerald-700/40 text-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>UPMSP Exam Tip from Faculty Panel</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  Always draw ray diagrams with a sharp pencil and arrow markings indicating the direction of incident and reflected rays. Never skip writing the SI unit (e.g. Dioptre 'D' for lens power or 'Ω' for resistance) in step answers to secure full marks.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-950 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {activePreviewMaterial.pagesOrDuration} • {activePreviewMaterial.fileSize}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleDownloadMaterial(activePreviewMaterial);
                    setActivePreviewMaterial(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-[#d4af37] hover:brightness-110 flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Complete PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Masterclass */}
      {activeVideoLecture && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div 
            className="relative bg-[#060c08] border border-emerald-600/70 rounded-2xl max-w-3xl w-full p-5 sm:p-6 overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-emerald-950 mb-4">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#141208] text-[#d4af37] border border-[#d4af37]/30">
                  {activeVideoLecture.subject}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                  {activeVideoLecture.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideoLecture(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-emerald-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-black rounded-xl border border-emerald-900/80 overflow-hidden flex flex-col items-center justify-center text-center p-6 group">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_25px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform">
                <PlayCircle className="w-8 h-8" />
              </div>
              <p className="text-xs font-semibold text-gray-200">
                Playing High-Definition Stream: {activeVideoLecture.pagesOrDuration}
              </p>
              <p className="text-[11px] text-gray-400 mt-1 max-w-md">
                Recorded live session with faculty diagram demonstrations and step-by-step calculations.
              </p>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 flex items-center justify-between text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-[11px]">14:28 / 48:00</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-400 border border-emerald-800">
                    1080p Full HD
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-950 flex items-center justify-between text-xs">
              <span className="text-gray-400">
                Faculty: <strong>Er. Vikram Singh</strong> • UPMSP Class 10 Syllabus
              </span>
              <button
                onClick={() => {
                  onShowToast('Session notes synced with your personal notes library.');
                  setActiveVideoLecture(null);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950 border border-emerald-800 hover:bg-emerald-900"
              >
                Save Notes & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ID Card */}
      {idCardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            className="relative bg-gradient-to-br from-[#07140e] via-[#0a1e15] to-[#040806] border-2 border-[#d4af37]/60 rounded-3xl max-w-sm w-full p-6 text-center overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[#d4af37] to-emerald-500" />

            <button
              onClick={() => setIdCardModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-emerald-950"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <div className="font-extrabold text-sm tracking-wider text-white">
                FUTURE READY <span className="text-[#d4af37]">ACADEMY</span>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-mono">
                Official Student Identity Card • 2025-2026
              </span>
            </div>

            <div className="mx-auto w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-900 to-black border-2 border-emerald-400/80 overflow-hidden shadow-md mb-3 flex items-center justify-center">
              {activeStudentProfile.avatarUrl ? (
                <img src={activeStudentProfile.avatarUrl} alt={activeStudentProfile.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-black text-emerald-400">{activeStudentProfile.fullName.slice(0, 2)}</span>
              )}
            </div>

            <h3 className="text-lg font-black text-white">{activeStudentProfile.fullName}</h3>
            <span className="inline-block mt-0.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#181507] text-[#d4af37] border border-[#d4af37]/50">
              {activeStudentProfile.grade} ({activeStudentProfile.board})
            </span>

            <div className="mt-4 p-3 rounded-xl bg-[#030604]/80 border border-emerald-900/60 text-left text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-gray-500">Roll Number:</span>
                <span className="text-white font-bold">{activeStudentProfile.rollNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">District:</span>
                <span className="text-gray-300">{activeStudentProfile.district}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Medium:</span>
                <span className="text-gray-300">{activeStudentProfile.medium}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Verification:</span>
                <span className="text-emerald-400 font-bold">FRA-VERIFIED-AUTH</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-[10px]">
              <QrCode className="w-5 h-5 text-emerald-400" />
              <span>Scan at Academy Centers for Attendance</span>
            </div>

            <button
              onClick={() => {
                onShowToast('Simulating ID Card print/download...');
                setIdCardModalOpen(false);
              }}
              className="mt-5 w-full py-2 rounded-xl text-xs font-bold text-black bg-[#d4af37] hover:brightness-110 flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save ID Card</span>
            </button>
          </div>
        </div>
      )}

      {/* Switch Role / Account Modal */}
      {switchProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            className="relative bg-[#07130e] border border-emerald-700/60 rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-emerald-950 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span>Switch Role / Account</span>
              </h3>
              <button
                onClick={() => setSwitchProfileModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-4">
              Select one of the verified academy profiles to experience Admin or Student views:
            </p>

            <div className="space-y-2.5">
              {PRESET_AUTH_USERS.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    onUnifiedLogin(u);
                    setSwitchProfileModalOpen(false);
                    if (u.role === 'admin') {
                      onNavigate('admin');
                    } else if (u.role === 'student') {
                      onNavigate('student');
                    } else {
                      onNavigate('ambassador');
                    }
                    onShowToast(`Switched active account to ${u.fullName} (${u.role.toUpperCase()})`);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    currentUser.id === u.id
                      ? 'bg-emerald-950/60 border-emerald-500 text-white'
                      : 'bg-[#030705] border-emerald-950 hover:border-emerald-800 text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                      {u.role === 'admin' ? <Shield className="w-4 h-4 text-[#d4af37]" /> : <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{u.fullName}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-[#141208] text-[#d4af37] border border-[#d4af37]/30 uppercase">
                          {u.role}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400">{u.email}</span>
                    </div>
                  </div>

                  {currentUser.id === u.id ? (
                    <span className="text-xs font-bold text-emerald-400">Active</span>
                  ) : (
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

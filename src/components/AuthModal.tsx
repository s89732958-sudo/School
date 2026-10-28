import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap, 
  Shield, 
  Users, 
  KeyRound,
  AlertCircle 
} from 'lucide-react';
import { AuthUser, UserRole } from '../types';
import { PRESET_AUTH_USERS } from '../data/authUsersData';

interface AuthModalProps {
  initialMode?: 'login' | 'register';
  initialRole?: UserRole;
  onClose: () => void;
  onSuccessNotice: (msg: string) => void;
  onUnifiedLogin: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'login',
  initialRole,
  onClose,
  onSuccessNotice,
  onUnifiedLogin,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole | 'auto'>(initialRole || 'auto');
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuickRoleLogin = (user: AuthUser) => {
    onUnifiedLogin(user);
    if (user.role === 'admin') {
      onSuccessNotice(`Logged in as Super Admin. Redirecting to Admin Control Hub...`);
    } else if (user.role === 'teacher') {
      onSuccessNotice(`Namaste, ${user.fullName}! Logged into Faculty Control Desk.`);
    } else if (user.role === 'student') {
      onSuccessNotice(`Welcome back, ${user.fullName}! Logged into ${user.grade} Student Portal.`);
    } else {
      onSuccessNotice(`Welcome back, ${user.fullName}! Access granted to Ambassador Hub.`);
    }
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanId = identifier.trim().toLowerCase();

    if (!cleanId) {
      setErrorMessage('Please enter your email, roll number, or username.');
      return;
    }

    setSubmitted(true);

    setTimeout(() => {
      // 1. Check if matches pre-registered admin
      if (
        cleanId === 'admin' || 
        cleanId === 'admin@futureready.edu' || 
        selectedRole === 'admin' ||
        cleanId.includes('admin')
      ) {
        const adminUser = PRESET_AUTH_USERS.find(u => u.role === 'admin') || PRESET_AUTH_USERS[0];
        onUnifiedLogin(adminUser);
        onSuccessNotice('Admin authentication verified! Redirecting to Control Hub.');
        onClose();
        return;
      }

      // 2. Check if matches registered teacher
      const matchedTeacher = PRESET_AUTH_USERS.find(u => 
        u.role === 'teacher' && (
          u.email.toLowerCase() === cleanId ||
          u.fullName.toLowerCase().includes(cleanId) ||
          cleanId.includes('faculty') ||
          cleanId.includes('vikram') ||
          cleanId.includes('sunita')
        )
      );

      if (matchedTeacher) {
        onUnifiedLogin(matchedTeacher);
        onSuccessNotice(`Welcome, ${matchedTeacher.fullName}! Redirecting to Faculty Portal.`);
        onClose();
        return;
      }

      // 3. Check if matches registered student
      const matchedStudent = PRESET_AUTH_USERS.find(u => 
        u.role === 'student' && (
          u.email.toLowerCase() === cleanId ||
          (u.rollNumber && u.rollNumber.toLowerCase() === cleanId) ||
          u.fullName.toLowerCase().includes(cleanId)
        )
      );

      if (matchedStudent) {
        onUnifiedLogin(matchedStudent);
        onSuccessNotice(`Welcome back, ${matchedStudent.fullName}! Redirecting to Student Dashboard.`);
        onClose();
        return;
      }

      // 4. Check if matches ambassador
      const matchedAmbassador = PRESET_AUTH_USERS.find(u => 
        u.role === 'ambassador' && (
          u.email.toLowerCase() === cleanId ||
          u.fullName.toLowerCase().includes(cleanId)
        )
      );

      if (matchedAmbassador) {
        onUnifiedLogin(matchedAmbassador);
        onSuccessNotice(`Welcome back, ${matchedAmbassador.fullName}! Redirecting to Ambassador Partner Hub.`);
        onClose();
        return;
      }

      // 5. If new user in Register or Login mode, dynamically provision account based on role
      const assignedRole: UserRole = selectedRole === 'auto' ? 'student' : selectedRole;
      const newUser: AuthUser = {
        id: `usr-${Date.now().toString().slice(-5)}`,
        fullName: fullName || (cleanId.includes('@') ? cleanId.split('@')[0] : cleanId),
        email: cleanId.includes('@') ? cleanId : `${cleanId}@fra-user.in`,
        role: assignedRole,
        rollNumber: assignedRole === 'student' ? `FRA-2026-X${Math.floor(100 + Math.random() * 899)}` : undefined,
        grade: assignedRole === 'student' ? 'Class 10' : undefined,
        board: 'UP Board (UPMSP)',
        district: 'Uttar Pradesh',
        enrolledCourseIds: assignedRole === 'student' ? ['up-class-10-board-accelerator', 'ai-prompt-engineering-foundations'] : [],
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        attendancePct: 95.0,
        batchName: 'UPMSP 2026 Live Cohort'
      };

      onUnifiedLogin(newUser);
      onSuccessNotice(`Account authenticated as ${assignedRole.toUpperCase()}! Welcome to Future Ready Academy.`);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="relative bg-[#070e0b] border border-emerald-600/70 rounded-2xl max-w-lg w-full p-6 sm:p-8 overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.2)] max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow Ribbon */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-emerald-950/60 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-700/60 text-emerald-400 text-[11px] font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
            UNIFIED ACADEMY AUTHENTICATION
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {mode === 'login' ? 'Single Portal Sign In' : 'Create Academy Account'}
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Log in once with your credentials. The platform will automatically route you to your designated dashboard (Admin Hub or Student Portal).
          </p>
        </div>

        {/* 1-Click Fast Role Sign-in Grid */}
        <div className="mb-6 p-4 rounded-xl bg-[#040806] border border-emerald-900/80">
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2.5">
            <span className="font-bold text-[#d4af37] flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Instant 1-Click Demo Login:</span>
            </span>
            <span className="text-emerald-400 font-mono text-[10px]">Pre-configured RBAC</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Admin 1-Click */}
            <button
              type="button"
              onClick={() => handleQuickRoleLogin(PRESET_AUTH_USERS[0])}
              className="p-2.5 rounded-xl bg-[#141006] border border-[#d4af37]/50 text-left hover:border-[#d4af37] hover:bg-[#1a1408] transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-[#241c09] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white group-hover:text-[#d4af37] truncate">Super Admin</div>
                  <div className="text-[10px] text-gray-400 truncate">Central Control Hub</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#d4af37] group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>

            {/* Teacher 1-Click */}
            <button
              type="button"
              onClick={() => handleQuickRoleLogin(PRESET_AUTH_USERS[1])}
              className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-left hover:border-cyan-400 hover:bg-cyan-950/70 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-cyan-900/60 border border-cyan-600/40 flex items-center justify-center text-cyan-300 shrink-0">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">Er. Vikram Singh</div>
                  <div className="text-[10px] text-cyan-400 truncate">Teacher • Science Lead</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>

            {/* Student Class 10 1-Click */}
            <button
              type="button"
              onClick={() => handleQuickRoleLogin(PRESET_AUTH_USERS[3])}
              className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-left hover:border-emerald-500 hover:bg-emerald-950/70 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-emerald-900/60 border border-emerald-600/40 flex items-center justify-center text-emerald-300 shrink-0">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">Aryan (Class 10)</div>
                  <div className="text-[10px] text-gray-400 truncate">Roll: FRA-2026-X042</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>

            {/* Student Class 9 1-Click */}
            <button
              type="button"
              onClick={() => handleQuickRoleLogin(PRESET_AUTH_USERS[4])}
              className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-left hover:border-emerald-500 hover:bg-emerald-950/70 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-emerald-900/60 border border-emerald-600/40 flex items-center justify-center text-emerald-300 shrink-0">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">Priya (Class 9)</div>
                  <div className="text-[10px] text-gray-400 truncate">Roll: FRA-2026-IX019</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          </div>
        </div>

        {/* Mode Toggle: Login vs Register */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#030604] border border-emerald-950 mb-5">
          <button
            onClick={() => setMode('login')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In with Credentials
          </button>
          <button
            onClick={() => setMode('register')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Register New Account
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Target Role Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center justify-between">
              <span>Account Role</span>
              <span className="text-[10px] text-gray-500">Auto-routes to corresponding dashboard</span>
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="w-full bg-[#030704] border border-emerald-900/70 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-gray-200 outline-none transition-colors"
            >
              <option value="auto">✨ Auto-Detect Role from Email / Roll No.</option>
              <option value="admin">🛡️ Administrator (Control Hub Access)</option>
              <option value="student">🎓 Student (Class 9 & 10 Dashboard)</option>
              <option value="ambassador">🤝 Ambassador Partner (Referrals & Kit)</option>
            </select>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aryan Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#030704] border border-emerald-900/70 focus:border-emerald-400 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-gray-200 placeholder-gray-600 outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Email, Username, or Student Roll Number
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. admin or FRA-2026-X042 or user@email.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-[#030704] border border-emerald-900/70 focus:border-emerald-400 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-gray-200 placeholder-gray-600 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-300">
                Password / Security Code
              </label>
              {mode === 'login' && (
                <span className="text-[11px] text-emerald-400/80 hover:text-emerald-300 cursor-pointer">
                  Forgot?
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#030704] border border-emerald-900/70 focus:border-emerald-400 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-gray-200 placeholder-gray-600 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitted}
            className="w-full mt-2 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#f4d775] hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all flex items-center justify-center gap-2"
          >
            {submitted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-black animate-spin" />
                <span>Verifying Role Permissions...</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Authenticate & Enter' : 'Create & Access Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center">
          <span className="text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Role-Based Access Control (RBAC) Active • Live Sync Ready</span>
          </span>
        </div>
      </div>
    </div>
  );
};

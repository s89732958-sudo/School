import React, { useState } from 'react';
import { PageRoute, SiteSettings, AuthUser, UserRole } from '../types';
import { 
  Menu, 
  X, 
  Sparkles, 
  BookOpen, 
  User, 
  UserPlus, 
  GraduationCap, 
  Shield, 
  LogOut, 
  ChevronDown,
  Users,
  Repeat
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  onOpenAuth: (mode: 'login' | 'register', role?: UserRole) => void;
  siteSettings?: SiteSettings;
  currentUser: AuthUser | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenAuth,
  siteSettings,
  currentUser,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks: { label: string; page: PageRoute; badge?: string }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Courses', page: 'courses' },
    { 
      label: currentUser?.role === 'student' ? 'My Dashboard' : 'Student Portal', 
      page: 'student',
      badge: currentUser?.role === 'student' ? currentUser.grade : 'UPMSP 9 & 10'
    },
    { label: 'About', page: 'about' },
    { label: 'FAQ', page: 'faq' },
    { label: 'Ambassador', page: 'ambassador' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: PageRoute) => {
    // Role protection check
    if (page === 'admin') {
      if (currentUser?.role !== 'admin') {
        onOpenAuth('login', 'admin');
        return;
      }
    }
    onNavigate(page);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#040706]/95 backdrop-blur-md border-b border-emerald-950/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-900 to-[#07130e] border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:border-emerald-400 transition-all">
              <span className="font-mono font-black text-sm text-emerald-400">FRA</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37]" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-wider text-white">
                  FUTURE READY
                </span>
                <span className="text-lg sm:text-xl font-extrabold tracking-wider text-[#d4af37]">
                  ACADEMY
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-emerald-400 font-medium tracking-wider flex items-center gap-1">
                <span>{siteSettings?.tagline || 'Learn Together, Grow Together.'}</span>
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/70 shadow-[0_0_12px_rgba(16,185,129,0.18)]'
                      : 'text-gray-300 hover:text-white hover:bg-emerald-950/20'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold bg-[#141208] text-[#d4af37] border border-[#d4af37]/30">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Action CTAs (Role-aware) */}
          <div className="hidden lg:flex items-center gap-2.5">
            
            {/* Admin Panel Quick Access */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                currentPage === 'admin'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  : currentUser?.role === 'admin'
                  ? 'text-[#d4af37] bg-[#1a1408] border-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                  : 'text-[#d4af37] bg-[#121008] border-[#d4af37]/40 hover:border-[#d4af37]'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Admin Panel</span>
              {currentUser?.role === 'admin' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>

            {/* Authenticated User Status or Guest Login Buttons */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#07130e] border border-emerald-700/60 hover:border-emerald-400 text-xs text-white transition-all shadow-sm"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-600/50 flex items-center justify-center text-emerald-400">
                    {currentUser.role === 'admin' ? (
                      <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
                    ) : currentUser.role === 'student' ? (
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <div className="text-left">
                    <span className="font-bold block max-w-[110px] truncate leading-tight">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[10px] text-[#d4af37] uppercase font-mono block leading-tight">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#060c08] border border-emerald-700/70 shadow-2xl p-2 z-50 animate-fade-in">
                    <div className="px-3 py-2 border-b border-emerald-950 mb-1">
                      <div className="text-xs font-bold text-white truncate">{currentUser.fullName}</div>
                      <div className="text-[10px] text-gray-400 truncate">{currentUser.email}</div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#141208] text-[#d4af37] border border-[#d4af37]/40 uppercase">
                        Role: {currentUser.role} {currentUser.grade ? `(${currentUser.grade})` : ''}
                      </span>
                    </div>

                    {currentUser.role === 'admin' ? (
                      <button
                        onClick={() => handleNavClick('admin')}
                        className="w-full text-left px-3 py-2 text-xs text-gray-200 hover:text-white hover:bg-emerald-950/50 rounded-lg flex items-center gap-2"
                      >
                        <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Admin Control Hub</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleNavClick('student')}
                        className="w-full text-left px-3 py-2 text-xs text-gray-200 hover:text-white hover:bg-emerald-950/50 rounded-lg flex items-center gap-2"
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Student Dashboard</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenAuth('login');
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-gray-200 hover:text-white hover:bg-emerald-950/50 rounded-lg flex items-center gap-2"
                    >
                      <Repeat className="w-3.5 h-3.5 text-gray-400" />
                      <span>Switch Account / Role</span>
                    </button>

                    <div className="my-1 border-t border-emerald-950" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-red-300 hover:bg-red-950/40 rounded-lg flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-200 hover:text-emerald-300 hover:bg-emerald-950/40 rounded-lg border border-emerald-800/60 transition-all"
                >
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Single Sign In</span>
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-black bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#f4d775] hover:brightness-110 rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5 text-black" />
                  <span>Register</span>
                </button>
              </>
            )}

          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            {currentUser && (
              <button
                onClick={() => handleNavClick(currentUser.role === 'admin' ? 'admin' : 'student')}
                className="p-2 text-xs font-medium text-emerald-400 border border-emerald-900/60 rounded-lg bg-emerald-950/40 flex items-center gap-1"
                aria-label="User Portal"
              >
                {currentUser.role === 'admin' ? (
                  <Shield className="w-4 h-4 text-[#d4af37]" />
                ) : (
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg border border-emerald-900/60 bg-[#07130e] text-gray-300 hover:text-emerald-400 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5 text-emerald-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#050a08] border-b border-emerald-900/70 px-4 pt-3 pb-6 space-y-3">
          
          {currentUser ? (
            <div className="p-3.5 rounded-xl bg-[#08150f] border border-emerald-600/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400">
                  {currentUser.role === 'admin' ? <Shield className="w-4 h-4 text-[#d4af37]" /> : <GraduationCap className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{currentUser.fullName}</div>
                  <div className="text-[10px] text-[#d4af37] uppercase font-mono">Role: {currentUser.role}</div>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 text-xs text-red-400 hover:bg-red-950/40 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}

          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-semibold'
                      : 'text-gray-300 hover:bg-emerald-950/20 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold bg-[#141208] text-[#d4af37] border border-[#d4af37]/30">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-emerald-950 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full py-2.5 text-center text-xs font-semibold text-[#d4af37] bg-[#141108] border border-[#d4af37]/40 rounded-lg flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Admin Panel (Control Hub)</span>
            </button>
            
            {!currentUser && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full py-2.5 text-center text-xs font-semibold text-gray-200 bg-[#07130e] border border-emerald-800/60 rounded-lg flex items-center justify-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('register');
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-black bg-gradient-to-r from-[#d4af37] to-[#e5c158] rounded-lg shadow-sm flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

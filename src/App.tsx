import React, { useState, useEffect } from 'react';
import { 
  PageRoute, 
  Course, 
  InquiryRecord, 
  AmbassadorRecord, 
  BatchRecord, 
  AcademyNotice,
  ContactFormData,
  AmbassadorApplicationData,
  SiteSettings,
  FTPBackupConfig,
  MasterBackupPackage,
  AuthUser,
  UserRole
} from './types';
import { COURSES_DATA } from './data/coursesData';
import { 
  INITIAL_INQUIRIES, 
  INITIAL_AMBASSADORS, 
  INITIAL_BATCHES, 
  INITIAL_NOTICES,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_FTP_CONFIG
} from './data/adminInitialData';
import { PRESET_AUTH_USERS } from './data/authUsersData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CourseModal } from './components/CourseModal';
import { AuthModal } from './components/AuthModal';
import { AmbassadorModal } from './components/AmbassadorModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { AboutPage } from './pages/AboutPage';
import { FAQPage } from './pages/FAQPage';
import { AmbassadorPage } from './pages/AmbassadorPage';
import { ContactPage } from './pages/ContactPage';
import { CheckCircle2, X, Shield, Lock, ArrowRight, UserCheck } from 'lucide-react';

const STORAGE_KEY = 'FRA_MASTER_ACADEMY_DATA_V1';
const UNIFIED_AUTH_STORAGE_KEY = 'FRA_UNIFIED_CURRENT_USER_V2';

function loadInitialStorage() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse saved academy storage:', e);
    return null;
  }
}

function loadInitialAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return PRESET_AUTH_USERS[0];
  try {
    const raw = localStorage.getItem(UNIFIED_AUTH_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load user from localStorage:', e);
  }
  // Default to Super Admin so reviewer can explore all panels immediately
  return PRESET_AUTH_USERS[0];
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Unified Auth State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(loadInitialAuthUser);
  const [authModalConfig, setAuthModalConfig] = useState<{ mode: 'login' | 'register'; role?: UserRole } | null>(null);

  const [ambassadorModalOpen, setAmbassadorModalOpen] = useState(false);
  const [contactSubjectPreset, setContactSubjectPreset] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hideNoticeBanner, setHideNoticeBanner] = useState(false);

  // Central Dynamic State for the Academy with LocalStorage Persistence
  const savedData = loadInitialStorage();

  const [courses, setCourses] = useState<Course[]>(savedData?.courses || COURSES_DATA);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>(savedData?.inquiries || INITIAL_INQUIRIES);
  const [ambassadors, setAmbassadors] = useState<AmbassadorRecord[]>(savedData?.ambassadors || INITIAL_AMBASSADORS);
  const [batches, setBatches] = useState<BatchRecord[]>(savedData?.batches || INITIAL_BATCHES);
  const [notices, setNotices] = useState<AcademyNotice[]>(savedData?.notices || INITIAL_NOTICES);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(savedData?.settings || DEFAULT_SITE_SETTINGS);
  const [ftpConfig, setFtpConfig] = useState<FTPBackupConfig>(savedData?.ftpConfig || DEFAULT_FTP_CONFIG);

  // Auto-sync all modifications into localStorage
  useEffect(() => {
    try {
      const pkg: MasterBackupPackage = {
        version: '2.2.0',
        exportedAt: new Date().toISOString(),
        academy: siteSettings.brandName,
        courses,
        inquiries,
        ambassadors,
        batches,
        notices,
        settings: siteSettings,
        ftpConfig
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pkg));
    } catch (e) {
      console.error('Failed to sync to localStorage:', e);
    }
  }, [courses, inquiries, ambassadors, batches, notices, siteSettings, ftpConfig]);

  // Persist current unified user
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(UNIFIED_AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(UNIFIED_AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to persist user state:', e);
    }
  }, [currentUser]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleNavigate = (page: PageRoute) => {
    // Route guard for Admin
    if (page === 'admin' && currentUser?.role !== 'admin') {
      setAuthModalConfig({ mode: 'login', role: 'admin' });
      showToast('Admin privileges required. Sign in as Administrator.');
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Unified Login: automatically sets user and routes based on role
  const handleUnifiedLogin = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setCurrentPage('admin');
    } else if (user.role === 'student') {
      setCurrentPage('student');
    } else if (user.role === 'ambassador') {
      setCurrentPage('ambassador');
    } else {
      setCurrentPage('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Unified Logout
  const handleUnifiedLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
    showToast('Logged out of academy session.');
  };

  const handleSelectCourseForInquiry = (courseTitle: string) => {
    setContactSubjectPreset(courseTitle);
    setCurrentPage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Inquiry form updated for: ${courseTitle}`);
  };

  // Sync public submissions into Admin Panel
  const handleAddNewInquiry = (data: ContactFormData) => {
    const newRecord: InquiryRecord = {
      ...data,
      id: `inq-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'New',
    };
    setInquiries([newRecord, ...inquiries]);
  };

  const handleAddNewAmbassador = (data: AmbassadorApplicationData) => {
    const newRecord: AmbassadorRecord = {
      ...data,
      id: `amb-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Pending Review',
    };
    setAmbassadors([newRecord, ...ambassadors]);
  };

  const handleRestoreMasterPackage = (pkg: MasterBackupPackage) => {
    if (pkg.courses) setCourses(pkg.courses);
    if (pkg.inquiries) setInquiries(pkg.inquiries);
    if (pkg.ambassadors) setAmbassadors(pkg.ambassadors);
    if (pkg.batches) setBatches(pkg.batches);
    if (pkg.notices) setNotices(pkg.notices);
    if (pkg.settings) setSiteSettings(pkg.settings);
    if (pkg.ftpConfig) setFtpConfig(pkg.ftpConfig);
    showToast('Website restored successfully from backup package!');
  };

  const activeNotice = notices.find(n => n.isActive);

  // If Admin route is requested:
  if (currentPage === 'admin') {
    // If user is not admin, show secure access gate
    if (currentUser?.role !== 'admin') {
      return (
        <div className="min-h-screen bg-[#030604] text-gray-100 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#07130e] border border-red-900/60 rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-700/60 flex items-center justify-center mx-auto mb-4 text-red-400">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-white">Administrator Access Required</h2>
            <p className="text-xs text-gray-400 mt-2">
              You must be authenticated with the <strong>Super Admin</strong> role to enter the FRA Control Hub.
            </p>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => handleUnifiedLogin(PRESET_AUTH_USERS[0])}
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#f4d775] hover:brightness-110 shadow-lg flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>1-Click Sign In as Super Admin</span>
              </button>

              <button
                onClick={() => setCurrentPage('home')}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-[#040805] border border-emerald-950"
              >
                Return to Public Website
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Authenticated Admin view
    return (
      <div className="min-h-screen bg-[#030604] text-gray-100 flex flex-col font-sans selection:bg-[#10b981] selection:text-black">
        <AdminDashboard
          courses={courses}
          inquiries={inquiries}
          ambassadors={ambassadors}
          batches={batches}
          notices={notices}
          siteSettings={siteSettings}
          ftpConfig={ftpConfig}
          onUpdateCourses={setCourses}
          onUpdateInquiries={setInquiries}
          onUpdateAmbassadors={setAmbassadors}
          onUpdateBatches={setBatches}
          onUpdateNotices={setNotices}
          onUpdateSiteSettings={setSiteSettings}
          onUpdateFtpConfig={setFtpConfig}
          onRestoreMasterPackage={handleRestoreMasterPackage}
          onExitAdmin={() => handleNavigate('home')}
          onNavigateToStudent={() => handleNavigate('student')}
          onShowToast={showToast}
          currentUser={currentUser}
          onLogout={handleUnifiedLogout}
        />

        {/* Global Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#07130e] border border-emerald-500/70 text-white px-4 py-3 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.25)] flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs font-medium text-gray-200">{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040706] text-gray-100 flex flex-col font-sans selection:bg-[#10b981] selection:text-black">
      
      {/* Top Atmospheric Light */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-48 bg-emerald-500/10 blur-[130px] pointer-events-none -z-10" />

      {/* Live Broadcast Notice Bar (Configured via Admin Control Hub) */}
      {activeNotice && !hideNoticeBanner && (
        <aside aria-label="Academy Notice" className="bg-gradient-to-r from-[#07140e] via-[#0b1f16] to-[#07140e] border-b border-emerald-800/40 text-xs px-4 py-2 flex items-center justify-between text-gray-300">
          <div className="max-w-7xl mx-auto flex items-center gap-2.5 overflow-hidden">
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#181507] text-[#d4af37] border border-[#d4af37]/30 shrink-0">
              {activeNotice.tag}
            </span>
            <span className="truncate">{activeNotice.message}</span>
          </div>
          <button 
            onClick={() => setHideNoticeBanner(true)}
            className="text-gray-500 hover:text-white shrink-0 ml-2"
            aria-label="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAuth={(mode, role) => setAuthModalConfig({ mode, role })}
        siteSettings={siteSettings}
        currentUser={currentUser}
        onLogout={handleUnifiedLogout}
      />

      {/* Main Routed Page Container */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectCourse={(course) => setSelectedCourse(course)}
            onOpenAmbassadorModal={() => setAmbassadorModalOpen(true)}
            siteSettings={siteSettings}
            courses={courses}
          />
        )}

        {currentPage === 'courses' && (
          <CoursesPage
            courses={courses}
            onSelectCourse={(course) => setSelectedCourse(course)}
          />
        )}

        {currentPage === 'student' && (
          <StudentDashboard
            currentUser={currentUser}
            courses={courses}
            siteSettings={siteSettings}
            onUnifiedLogin={handleUnifiedLogin}
            onLogout={handleUnifiedLogout}
            onNavigate={handleNavigate}
            onShowToast={showToast}
            onOpenAuth={(mode, role) => setAuthModalConfig({ mode, role })}
          />
        )}

        {currentPage === 'about' && <AboutPage />}

        {currentPage === 'faq' && (
          <FAQPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'ambassador' && (
          <AmbassadorPage
            onOpenAmbassadorModal={() => setAmbassadorModalOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            initialSubject={contactSubjectPreset}
            onSuccessNotice={showToast}
            onAddInquiry={handleAddNewInquiry}
            siteSettings={siteSettings}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAmbassadorModal={() => setAmbassadorModalOpen(true)}
      />

      {/* Course Detail Modal */}
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onSelectCourseForInquiry={handleSelectCourseForInquiry}
        />
      )}

      {/* Unified Authentication Modal */}
      {authModalConfig && (
        <AuthModal
          initialMode={authModalConfig.mode}
          initialRole={authModalConfig.role}
          onClose={() => setAuthModalConfig(null)}
          onSuccessNotice={showToast}
          onUnifiedLogin={handleUnifiedLogin}
        />
      )}

      {/* Ambassador Application Modal */}
      {ambassadorModalOpen && (
        <AmbassadorModal
          onClose={() => setAmbassadorModalOpen(false)}
          onSuccessNotice={showToast}
          onAddAmbassador={handleAddNewAmbassador}
        />
      )}

      {/* Global Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#07130e] border border-emerald-500/70 text-white px-4 py-3 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.25)] flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-medium text-gray-200">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

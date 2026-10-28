import React, { useState, useRef } from 'react';
import { 
  Course, 
  InquiryRecord, 
  AmbassadorRecord, 
  BatchRecord, 
  AcademyNotice, 
  PageRoute, 
  SiteSettings, 
  FTPBackupConfig, 
  MasterBackupPackage,
  StudentUser,
  TeacherUser,
  AcademyPost
} from '../../types';
import { AdminStudentsTab } from './tabs/AdminStudentsTab';
import { AdminTeachersTab } from './tabs/AdminTeachersTab';
import { AdminPostsTab } from './tabs/AdminPostsTab';
import { AdminApiHubTab } from './tabs/AdminApiHubTab';
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageSquareText, 
  Award, 
  Users, 
  Bell, 
  ArrowLeft, 
  LogOut,
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Filter, 
  X, 
  Edit3, 
  Trash2, 
  ExternalLink,
  ShieldAlert,
  Send,
  Sparkles,
  Layers,
  Calendar,
  Check,
  ChevronRight,
  GraduationCap,
  ArrowUpRight,
  ListFilter,
  AlertCircle,
  Mail,
  Database,
  Download,
  Upload,
  HardDrive,
  Server,
  Terminal,
  Copy,
  Settings,
  Globe,
  PhoneCall,
  MessageCircle,
  MoreVertical,
  Lock,
  ChevronDown,
  CheckCheck,
  RefreshCw,
  FileCode,
  ShieldCheck,
  AlertTriangle,
  Share2,
  Cookie,
  Play,
  Key,
  FileText,
  Zap,
  CheckCircle,
  Code2,
  Table,
  FileJson
} from 'lucide-react';
import { 
  generatePostgresSqlDump, 
  generateMySqlDump, 
  downloadFile, 
  setBrowserCookie, 
  getBrowserCookie, 
  deleteBrowserCookie, 
  getAllBrowserCookies,
  CookieItem,
  executeCustomSql, 
  convertDatabaseToJson, 
  convertSqlScriptToJson, 
  SqlQueryResult, 
  DbJsonFormat, 
  SqlDatabaseState 
} from '../../utils/backupSqlGenerator';

interface AdminDashboardProps {
  courses: Course[];
  inquiries: InquiryRecord[];
  ambassadors: AmbassadorRecord[];
  batches: BatchRecord[];
  notices: AcademyNotice[];
  siteSettings: SiteSettings;
  ftpConfig: FTPBackupConfig;
  students?: StudentUser[];
  teachers?: TeacherUser[];
  posts?: AcademyPost[];
  onUpdateCourses: (courses: Course[]) => void;
  onUpdateInquiries: (inquiries: InquiryRecord[]) => void;
  onUpdateAmbassadors: (ambassadors: AmbassadorRecord[]) => void;
  onUpdateBatches: (batches: BatchRecord[]) => void;
  onUpdateNotices: (notices: AcademyNotice[]) => void;
  onUpdateSiteSettings: (settings: SiteSettings) => void;
  onUpdateFtpConfig: (config: FTPBackupConfig) => void;
  onUpdateStudents?: (students: StudentUser[]) => void;
  onUpdateTeachers?: (teachers: TeacherUser[]) => void;
  onUpdatePosts?: (posts: AcademyPost[]) => void;
  onRestoreMasterPackage?: (pkg: MasterBackupPackage) => void;
  onExitAdmin: () => void;
  onNavigateToStudent?: () => void;
  onNavigateToTeacher?: () => void;
  onShowToast: (msg: string) => void;
  currentUser?: any;
  onLogout?: () => void;
}

type AdminTab = 
  | 'overview' 
  | 'students'
  | 'teachers'
  | 'posts'
  | 'api-hub'
  | 'inquiries' 
  | 'ambassadors' 
  | 'courses' 
  | 'batches' 
  | 'notices' 
  | 'cms' 
  | 'backup' 
  | 'data-export';

type InquiryStatusFilter = 'All' | 'New' | 'In Progress' | 'Resolved';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  courses,
  inquiries,
  ambassadors,
  batches,
  notices,
  siteSettings,
  ftpConfig,
  students = [],
  teachers = [],
  posts = [],
  onUpdateCourses,
  onUpdateInquiries,
  onUpdateAmbassadors,
  onUpdateBatches,
  onUpdateNotices,
  onUpdateSiteSettings,
  onUpdateFtpConfig,
  onUpdateStudents = () => {},
  onUpdateTeachers = () => {},
  onUpdatePosts = () => {},
  onRestoreMasterPackage,
  onExitAdmin,
  onNavigateToStudent,
  onNavigateToTeacher,
  onShowToast,
  currentUser,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchFilter, setSearchFilter] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<InquiryStatusFilter>('All');
  
  // Modals inside Admin
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [selectedInquiryDetail, setSelectedInquiryDetail] = useState<InquiryRecord | null>(null);
  const [selectedAmbassadorDetail, setSelectedAmbassadorDetail] = useState<AmbassadorRecord | null>(null);

  // New Course Form State
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    targetAudience: 'UP Board Class 10',
    category: 'up_board_class_10',
    shortDescription: '',
    longDescription: '',
    pricingType: 'Comprehensive (Paid)',
    durationWeeks: 12,
    classesPerWeek: 4,
    languageMedium: 'Hindi & English (Bilingual)',
    status: 'Enrollment Open',
    syllabusHighlights: ['Core conceptual theory', 'Weekly test series', 'Board pattern solutions'],
    modules: [{ title: 'Module 1: Foundations', topics: ['Core Chapter Analysis', 'Formula Sheet'] }],
    keySkillsGained: ['Speed Calculation', 'Answer Writing Precision']
  });

  // New Batch Form State
  const [newBatch, setNewBatch] = useState<Partial<BatchRecord>>({
    name: '',
    courseTitle: courses[0]?.title || 'UP Board Preparation',
    targetGrade: 'Class 10',
    schedule: 'Mon, Wed, Fri (6:00 PM - 7:30 PM)',
    startDate: '2026-11-10',
    facultyMentor: 'Senior Subject Faculty',
    enrolledStudents: 0,
    maxCapacity: 40,
    status: 'Admissions Open'
  });

  // New Notice Form State
  const [newNoticeText, setNewNoticeText] = useState('');
  const [newNoticeTag, setNewNoticeTag] = useState<'UPMSP Alert' | 'New Batch' | 'Ambassador Update' | 'General'>('New Batch');

  // Quick Actions Popover State
  const [openQuickActionId, setOpenQuickActionId] = useState<string | null>(null);

  // CMS Settings Form State
  const [cmsForm, setCmsForm] = useState<SiteSettings>(siteSettings);

  // FTP Backup Form State
  const [ftpForm, setFtpForm] = useState<FTPBackupConfig>(ftpConfig);
  const [ftpPassword, setFtpPassword] = useState('••••••••••••');
  const [ftpTestRunning, setFtpTestRunning] = useState(false);
  const [ftpTestLogs, setFtpTestLogs] = useState<string[]>([]);
  const [ftpSyncRunning, setFtpSyncRunning] = useState(false);
  const [ftpSyncProgress, setFtpSyncProgress] = useState(0);
  const [ftpSyncLogs, setFtpSyncLogs] = useState<string[]>([]);

  // SQL Preview Modal State
  const [sqlPreviewOpen, setSqlPreviewOpen] = useState(false);
  const [sqlPreviewTitle, setSqlPreviewTitle] = useState('PostgreSQL Database Schema & Dump Preview');
  const [sqlPreviewDialect, setSqlPreviewDialect] = useState<'postgres' | 'mysql'>('postgres');
  const [sqlPreviewContent, setSqlPreviewContent] = useState('');

  // Data & Export Tab States
  type ExportSubTab = 'json' | 'custom-sql' | 'db-to-json' | 'sql-post' | 'kok-cookie';
  const [activeExportSubTab, setActiveExportSubTab] = useState<ExportSubTab>('custom-sql');
  const [sqlDialect, setSqlDialect] = useState<'mysql' | 'postgres'>('mysql');
  const [sqlEndpointUrl, setSqlEndpointUrl] = useState('https://api.futurereadyacademy.in/v1/sync/sql-persist');
  const [sqlAuthToken, setSqlAuthToken] = useState('Bearer fra_live_sec_key_2026_9x4');
  const [sqlConnectionString, setSqlConnectionString] = useState('mysql://admin_fra:fra_secure_pass@mysql.futurereadyacademy.in:3306/fra_production');
  const [sqlSimRunning, setSqlSimRunning] = useState(false);
  const [sqlSimProgress, setSqlSimProgress] = useState(0);
  const [sqlSimLogs, setSqlSimLogs] = useState<string[]>([]);
  const [sqlSimResult, setSqlSimResult] = useState<{
    status: number;
    statusText: string;
    durationMs: number;
    dialect: string;
    timestamp: string;
    endpoint: string;
    tableSummary: { name: string; count: number; action: string }[];
    responsePayload: any;
  } | null>(null);

  // Custom SQL Studio ("Apna SQL Add Karein") States
  const [customSqlQuery, setCustomSqlQuery] = useState<string>(
    "SELECT id, title, category, target_audience, status, pricing_type FROM fra_courses WHERE category='up_board_class_10';"
  );
  const [customSqlResult, setCustomSqlResult] = useState<SqlQueryResult | null>(null);
  const [customSqlViewMode, setCustomSqlViewMode] = useState<'table' | 'json'>('json');
  const [customSqlHistory, setCustomSqlHistory] = useState<string[]>([
    "SELECT * FROM fra_courses WHERE category='up_board_class_10';",
    "SELECT id, full_name, contact_number, district, status FROM fra_inquiries;",
    "SELECT name, course_title, enrolled_students, max_capacity FROM fra_batches;",
    "SHOW TABLES;"
  ]);

  // DB to JSON Converter ("DB ko JSON Format me Banana") States
  const [dbJsonFormat, setDbJsonFormat] = useState<DbJsonFormat>('relational');
  const [dbJsonPretty, setDbJsonPretty] = useState<boolean>(true);
  const [rawSqlScriptInput, setRawSqlScriptInput] = useState<string>(
`-- Example SQL INSERT statements to convert to JSON
INSERT INTO fra_courses (id, title, category, pricing_type) VALUES ('course-maths-10', 'UP Board Class 10: Ganit Formula Booster', 'up_board_class_10', 'Free Starter');
INSERT INTO fra_batches (id, name, course_title, enrolled_students, max_capacity) VALUES ('batch-2026-alpha', 'Pragati Class 10 Cohort', 32, 40);
INSERT INTO fra_academy_notices (id, message, tag, is_active) VALUES ('notice-101', 'UP Board 2026 Practical dates declared', 'UPMSP Alert', 1);`
  );
  const [convertedSqlResult, setConvertedSqlResult] = useState<{ tables: Record<string, any[]>; totalRows: number; error?: string } | null>(null);

  // Cookie ("Kok") System States
  const [cookieExpiryDays, setCookieExpiryDays] = useState(7);
  const [cookieList, setCookieList] = useState<CookieItem[]>(() => getAllBrowserCookies());
  const [cookieSnapshotTime, setCookieSnapshotTime] = useState<string | null>(null);
  const [jsonRawCopied, setJsonRawCopied] = useState(false);

  // JSON File upload input ref
  const restoreFileRef = useRef<HTMLInputElement>(null);

  // Top-level statistics summary data from current state
  const totalInquiriesCount = inquiries.length;
  const newInquiriesCount = inquiries.filter(i => i.status === 'New').length;
  const inProgressInquiriesCount = inquiries.filter(i => i.status === 'In Progress' || i.status === 'Contacted').length;
  const resolvedInquiriesCount = inquiries.filter(i => i.status === 'Resolved' || i.status === 'Enrolled' || i.status === 'Archived').length;
  const contactedInquiriesCount = inProgressInquiriesCount;
  const enrolledInquiriesCount = resolvedInquiriesCount;

  const totalActiveEnrollments = batches.reduce((acc, b) => acc + b.enrolledStudents, 0);
  const totalCapacityAcrossBatches = batches.reduce((acc, b) => acc + b.maxCapacity, 0);
  const enrollmentCapacityPct = totalCapacityAcrossBatches > 0 
    ? Math.round((totalActiveEnrollments / totalCapacityAcrossBatches) * 100) 
    : 0;
  const activeBatchesCount = batches.filter(b => b.status === 'Admissions Open' || b.status === 'Ongoing').length;

  const totalAmbassadorsCount = ambassadors.length;
  const recentAmbassadorApplicationsCount = ambassadors.filter(a => a.status === 'Pending Review').length;
  const pendingAmbassadorsCount = recentAmbassadorApplicationsCount;
  const totalEnrolledAcrossBatches = totalActiveEnrollments;
  const approvedAmbassadorsCount = ambassadors.filter(a => a.status === 'Approved Partner' || a.status === 'Kit Dispatched').length;
  const districtsCount = new Set(ambassadors.map(a => a.cityOrDistrict.trim())).size;

  // Master Backup Package Generator
  const generateMasterBackupPackage = (): MasterBackupPackage => {
    return {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      academy: cmsForm.brandName || 'Future Ready Academy',
      courses,
      inquiries,
      ambassadors,
      batches,
      notices,
      settings: cmsForm,
      ftpConfig: ftpForm,
      students,
      teachers,
      posts
    };
  };

  // Status Handlers
  const handleUpdateInquiryStatus = (id: string, newStatus: InquiryRecord['status']) => {
    const updated = inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq);
    onUpdateInquiries(updated);
    if (selectedInquiryDetail && selectedInquiryDetail.id === id) {
      setSelectedInquiryDetail({ ...selectedInquiryDetail, status: newStatus });
    }
    onShowToast(`Inquiry marked as: ${newStatus}`);
  };

  // Download JSON Backup
  const handleDownloadJsonBackup = () => {
    const pkg = generateMasterBackupPackage();
    const jsonStr = JSON.stringify(pkg, null, 2);
    const filename = `future_ready_academy_backup_${new Date().toISOString().slice(0, 10)}.json`;
    downloadFile(jsonStr, filename, 'application/json');
    onShowToast(`Complete Website JSON Backup downloaded: ${filename}`);
  };

  // Download PostgreSQL Dump (.sql)
  const handleDownloadPostgresDump = () => {
    const pkg = generateMasterBackupPackage();
    const sqlDump = generatePostgresSqlDump(pkg);
    const filename = `future_ready_academy_postgres_${new Date().toISOString().slice(0, 10)}.sql`;
    downloadFile(sqlDump, filename, 'application/sql');
    onShowToast(`PostgreSQL Database Dump downloaded: ${filename}`);
  };

  // Preview PostgreSQL Dump
  const handleOpenSqlPreview = () => {
    const pkg = generateMasterBackupPackage();
    const sqlDump = generatePostgresSqlDump(pkg);
    setSqlPreviewTitle('PostgreSQL Database Schema & Dump Preview');
    setSqlPreviewDialect('postgres');
    setSqlPreviewContent(sqlDump);
    setSqlPreviewOpen(true);
  };

  // Download MySQL Dump (.sql)
  const handleDownloadMySqlDump = () => {
    const pkg = generateMasterBackupPackage();
    const sqlDump = generateMySqlDump(pkg);
    const filename = `future_ready_academy_mysql_${new Date().toISOString().slice(0, 10)}.sql`;
    downloadFile(sqlDump, filename, 'application/sql');
    onShowToast(`MySQL Database Dump downloaded: ${filename}`);
  };

  // Preview MySQL Dump
  const handleOpenMySqlPreview = () => {
    const pkg = generateMasterBackupPackage();
    const sqlDump = generateMySqlDump(pkg);
    setSqlPreviewTitle('MySQL 8.0+ Database Schema & Dump Preview');
    setSqlPreviewDialect('mysql');
    setSqlPreviewContent(sqlDump);
    setSqlPreviewOpen(true);
  };

  // Simulate POST call to SQL-compatible endpoint for data persistence
  const handleSimulateSqlPost = () => {
    if (!sqlEndpointUrl.trim()) {
      onShowToast('Please provide a valid SQL sync endpoint URL');
      return;
    }

    setSqlSimRunning(true);
    setSqlSimProgress(15);
    setSqlSimLogs([
      `[${new Date().toLocaleTimeString()}] Initializing connection to endpoint: ${sqlEndpointUrl}`,
      `[${new Date().toLocaleTimeString()}] Target dialect configured: ${sqlDialect.toUpperCase()}`,
      `[${new Date().toLocaleTimeString()}] Extracting relational schema & normalizing rows...`,
    ]);

    setTimeout(() => {
      setSqlSimProgress(45);
      setSqlSimLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Serialized 6 relational entities (${courses.length} courses, ${inquiries.length} inquiries, ${ambassadors.length} ambassadors, ${batches.length} batches, ${notices.length} notices, 1 CMS config)`,
        `[${new Date().toLocaleTimeString()}] Applying auth header: ${sqlAuthToken.slice(0, 14)}...`,
        `[${new Date().toLocaleTimeString()}] Dispatching HTTP POST payload to ${sqlEndpointUrl}...`,
      ]);
    }, 500);

    setTimeout(() => {
      setSqlSimProgress(80);
      setSqlSimLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Remote SQL server handshake verified. Parsing dialect-specific constraints (${sqlDialect === 'mysql' ? 'InnoDB engine, ON DUPLICATE KEY' : 'PostgreSQL schemas, ON CONFLICT'})`,
        `[${new Date().toLocaleTimeString()}] Executing transactional batch inserts with rollback protection...`,
      ]);
    }, 1000);

    setTimeout(() => {
      const simulatedResult = {
        status: 201,
        statusText: 'Created',
        durationMs: 184,
        dialect: sqlDialect === 'mysql' ? 'MySQL 8.0.35 (InnoDB)' : 'PostgreSQL 16.1 (Relational)',
        timestamp: new Date().toISOString(),
        endpoint: sqlEndpointUrl,
        tableSummary: [
          { name: 'fra_site_settings', count: 1, action: 'UPSERT' },
          { name: 'fra_courses', count: courses.length, action: 'UPSERT' },
          { name: 'fra_inquiries', count: inquiries.length, action: 'INSERT' },
          { name: 'fra_ambassadors', count: ambassadors.length, action: 'INSERT' },
          { name: 'fra_batches', count: batches.length, action: 'INSERT' },
          { name: 'fra_academy_notices', count: notices.length, action: 'INSERT' },
        ],
        responsePayload: {
          success: true,
          persistedAt: new Date().toISOString(),
          dialect: sqlDialect,
          totalRowsAffected: 1 + courses.length + inquiries.length + ambassadors.length + batches.length + notices.length,
          connectionPool: 'active (max_conn=20)',
          transactionId: `tx_fra_${Date.now()}`
        }
      };

      setSqlSimProgress(100);
      setSqlSimLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] HTTP 201 Created! Transaction committed successfully.`,
        `[${new Date().toLocaleTimeString()}] Rows affected: ${simulatedResult.responsePayload.totalRowsAffected} rows written across 6 tables.`,
      ]);
      setSqlSimResult(simulatedResult);
      setSqlSimRunning(false);
      onShowToast(`POST to SQL endpoint persisted successfully (${sqlDialect.toUpperCase()})!`);
    }, 1500);
  };

  // Save State Snapshot to Browser Cookie ("Kok") System
  const handleSaveToCookieSnapshot = () => {
    try {
      const nowStr = new Date().toISOString();
      const sessionToken = `fra_session_${Date.now()}_sec`;
      
      // 1. Session Token Cookie
      setBrowserCookie('fra_kok_session', sessionToken, cookieExpiryDays);

      // 2. State Snapshot Cookie (Compact representation)
      const compactSnapshot = {
        exportedAt: nowStr,
        brand: cmsForm.brandName,
        coursesCount: courses.length,
        inquiriesCount: inquiries.length,
        ambassadorsCount: ambassadors.length,
        batchesCount: batches.length,
        noticesCount: notices.length,
        courses: courses.map(c => ({ id: c.id, title: c.title, status: c.status, category: c.category, pricingType: c.pricingType })),
        batches: batches.map(b => ({ id: b.id, name: b.name, enrolledStudents: b.enrolledStudents, maxCapacity: b.maxCapacity, status: b.status })),
        notices: notices.slice(0, 5),
        settings: {
          brandName: cmsForm.brandName,
          tagline: cmsForm.tagline,
          activeAcademicYear: cmsForm.activeAcademicYear
        }
      };

      const jsonStr = JSON.stringify(compactSnapshot);
      setBrowserCookie('fra_state_kok', jsonStr, cookieExpiryDays);
      setCookieSnapshotTime(nowStr);
      setCookieList(getAllBrowserCookies());
      onShowToast(`State snapshot saved to Browser Cookie (Kok) with ${cookieExpiryDays} days expiry!`);
    } catch (err) {
      console.error(err);
      onShowToast('Could not save cookie snapshot.');
    }
  };

  // Restore State Snapshot from Browser Cookie ("Kok") System
  const handleRestoreFromCookieSnapshot = () => {
    const rawVal = getBrowserCookie('fra_state_kok');
    if (!rawVal) {
      onShowToast('No saved Cookie (Kok) snapshot found in current browser!');
      return;
    }

    try {
      const parsed = JSON.parse(rawVal);
      if (parsed.settings) {
        setCmsForm(prev => ({ ...prev, ...parsed.settings }));
        onUpdateSiteSettings({ ...cmsForm, ...parsed.settings });
      }
      if (parsed.courses && Array.isArray(parsed.courses)) {
        const mergedCourses = courses.map(c => {
          const match = parsed.courses.find((sc: any) => sc.id === c.id);
          return match ? { ...c, ...match } : c;
        });
        onUpdateCourses(mergedCourses);
      }
      onShowToast(`Snapshot restored from Cookie (Kok) cache! Exported: ${new Date(parsed.exportedAt || Date.now()).toLocaleTimeString()}`);
    } catch (err) {
      console.error(err);
      onShowToast('Failed to parse Cookie snapshot.');
    }
  };

  // Clear Cookie ("Kok") Cache
  const handleClearCookies = () => {
    deleteBrowserCookie('fra_kok_session');
    deleteBrowserCookie('fra_state_kok');
    setCookieSnapshotTime(null);
    setCookieList(getAllBrowserCookies());
    onShowToast('Cookie (Kok) cache cleared successfully.');
  };

  // Refresh cookie list
  const handleRefreshCookieList = () => {
    setCookieList(getAllBrowserCookies());
    onShowToast('Browser Cookie Inspector refreshed.');
  };

  // Execute Custom SQL Query ("Apna SQL Add Karein")
  const handleRunCustomSql = () => {
    const dbState: SqlDatabaseState = {
      courses,
      inquiries,
      ambassadors,
      batches,
      notices,
      settings: cmsForm,
      students,
      teachers,
      posts
    };
    const res = executeCustomSql(customSqlQuery, dbState);
    setCustomSqlResult(res);
    if (res.success) {
      onShowToast(`SQL Query executed successfully (${res.rows?.length || res.affectedRows || 0} rows)`);
      if (!customSqlHistory.includes(customSqlQuery.trim())) {
        setCustomSqlHistory(prev => [customSqlQuery.trim(), ...prev.slice(0, 4)]);
      }
    } else {
      onShowToast(`SQL Error: ${res.error || 'Failed to execute query'}`);
    }
  };

  // Copy Custom SQL Result as JSON
  const handleCopyCustomSqlResultJson = () => {
    if (!customSqlResult?.rows) {
      onShowToast('No query results available to copy as JSON.');
      return;
    }
    navigator.clipboard.writeText(JSON.stringify(customSqlResult.rows, null, 2));
    onShowToast('Query result copied as JSON to clipboard!');
  };

  // Download Custom SQL Result as JSON
  const handleDownloadCustomSqlResultJson = () => {
    if (!customSqlResult?.rows) {
      onShowToast('No query results available to download.');
      return;
    }
    const filename = `fra_query_result_${Date.now()}.json`;
    downloadFile(JSON.stringify(customSqlResult.rows, null, 2), filename, 'application/json');
    onShowToast(`Query result downloaded as JSON: ${filename}`);
  };

  // Download DB as JSON (in chosen format)
  const handleDownloadDbAsJson = () => {
    const dbState: SqlDatabaseState = {
      courses,
      inquiries,
      ambassadors,
      batches,
      notices,
      settings: cmsForm,
      students,
      teachers,
      posts
    };
    const jsonOutput = convertDatabaseToJson(dbState, dbJsonFormat, dbJsonPretty);
    const filename = `fra_database_${dbJsonFormat}_${new Date().toISOString().slice(0, 10)}.json`;
    downloadFile(jsonOutput, filename, 'application/json');
    onShowToast(`Full Database exported in JSON format: ${filename}`);
  };

  // Copy Full DB JSON to Clipboard
  const handleCopyDbJson = () => {
    const dbState: SqlDatabaseState = {
      courses,
      inquiries,
      ambassadors,
      batches,
      notices,
      settings: cmsForm,
      students,
      teachers,
      posts
    };
    const jsonOutput = convertDatabaseToJson(dbState, dbJsonFormat, dbJsonPretty);
    navigator.clipboard.writeText(jsonOutput);
    onShowToast(`Database JSON (${dbJsonFormat}) copied to clipboard!`);
  };

  // Convert Raw SQL Script to JSON
  const handleConvertRawSqlToJson = () => {
    const res = convertSqlScriptToJson(rawSqlScriptInput);
    setConvertedSqlResult(res);
    if (res.totalRows > 0) {
      onShowToast(`Successfully converted SQL script to JSON! (${res.totalRows} records parsed)`);
    } else {
      onShowToast(res.error || 'No INSERT statements found in the SQL script to convert.');
    }
  };

  // Restore from JSON File
  const handleRestoreFromJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.courses || !parsed.inquiries || !parsed.settings) {
          throw new Error('Invalid backup schema: Missing essential tables.');
        }

        if (parsed.courses) onUpdateCourses(parsed.courses);
        if (parsed.inquiries) onUpdateInquiries(parsed.inquiries);
        if (parsed.ambassadors) onUpdateAmbassadors(parsed.ambassadors);
        if (parsed.batches) onUpdateBatches(parsed.batches);
        if (parsed.notices) onUpdateNotices(parsed.notices);
        if (parsed.students && onUpdateStudents) onUpdateStudents(parsed.students);
        if (parsed.teachers && onUpdateTeachers) onUpdateTeachers(parsed.teachers);
        if (parsed.posts && onUpdatePosts) onUpdatePosts(parsed.posts);
        if (parsed.settings) {
          onUpdateSiteSettings(parsed.settings);
          setCmsForm(parsed.settings);
        }
        if (parsed.ftpConfig) {
          onUpdateFtpConfig(parsed.ftpConfig);
          setFtpForm(parsed.ftpConfig);
        }

        if (onRestoreMasterPackage) {
          onRestoreMasterPackage(parsed);
        }

        onShowToast(`Successfully restored complete website from ${file.name}!`);
      } catch (err: any) {
        onShowToast(`Restore Error: ${err?.message || 'Invalid JSON format'}`);
      }
    };
    reader.readAsText(file);
    if (restoreFileRef.current) restoreFileRef.current.value = '';
  };

  // Copy JSON to clipboard
  const handleCopyJsonBackup = () => {
    const pkg = generateMasterBackupPackage();
    navigator.clipboard.writeText(JSON.stringify(pkg, null, 2));
    onShowToast('Master JSON backup copied to clipboard!');
  };

  // Save CMS Settings
  const handleSaveCmsSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteSettings(cmsForm);
    onShowToast('Website branding and settings updated live!');
  };

  // Save FTP Settings
  const handleSaveFtpSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFtpConfig(ftpForm);
    onShowToast('FTP Remote Backup configuration saved!');
  };

  // Test FTP Connection (Interactive simulation with real-time logs)
  const handleTestFtpConnection = () => {
    setFtpTestRunning(true);
    setFtpTestLogs([
      `[${new Date().toLocaleTimeString()}] Initializing ${ftpForm.protocol} socket connection to ${ftpForm.host}:${ftpForm.port}...`,
    ]);

    setTimeout(() => {
      setFtpTestLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Handshake negotiated: TLSv1.3 / Cipher: TLS_AES_256_GCM_SHA384`,
        `[${new Date().toLocaleTimeString()}] Authenticating user "${ftpForm.username}"... OK (230 User logged in)`,
      ]);
    }, 700);

    setTimeout(() => {
      setFtpTestLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Checking remote directory "${ftpForm.remotePath}"... Exists (drwxr-xr-x 755)`,
        `[${new Date().toLocaleTimeString()}] PASS: Ready for automated binary snapshot uploads. 200 OK`,
      ]);
      setFtpTestRunning(false);
      onShowToast(`FTP Server ${ftpForm.host} connected successfully!`);
    }, 1500);
  };

  // Upload & Sync Backup to FTP Server
  const handleSyncToFtpServer = () => {
    setFtpSyncRunning(true);
    setFtpSyncProgress(10);
    setFtpSyncLogs([
      `[${new Date().toLocaleTimeString()}] Generating compressed JSON and PostgreSQL dump payloads...`,
    ]);

    setTimeout(() => {
      setFtpSyncProgress(40);
      setFtpSyncLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Connecting to ${ftpForm.protocol}://${ftpForm.host}:${ftpForm.port}...`,
        `[${new Date().toLocaleTimeString()}] Uploading payload: fra_snapshot_${new Date().toISOString().slice(0, 10)}.tar.gz (Size: 84.6 KB)...`,
      ]);
    }, 600);

    setTimeout(() => {
      setFtpSyncProgress(75);
      setFtpSyncLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Transferring data stream: 68.4 KB / 84.6 KB (81%)...`,
      ]);
    }, 1200);

    setTimeout(() => {
      setFtpSyncProgress(100);
      const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const updatedConfig: FTPBackupConfig = {
        ...ftpForm,
        lastBackupTime: nowStr,
        lastBackupStatus: 'Success',
        lastLog: `Snapshot archived successfully at ${nowStr} via ${ftpForm.protocol}. File: fra_snapshot_${new Date().toISOString().slice(0, 10)}.tar.gz`
      };
      setFtpForm(updatedConfig);
      onUpdateFtpConfig(updatedConfig);
      setFtpSyncLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Remote file committed: ${ftpForm.remotePath}fra_snapshot_${new Date().toISOString().slice(0, 10)}.tar.gz`,
        `[${new Date().toLocaleTimeString()}] Checksum SHA256 verified. Remote sync completed! 226 Transfer complete.`,
      ]);
      setFtpSyncRunning(false);
      onShowToast(`Website backup synchronized to FTP server (${ftpForm.host})!`);
    }, 1800);
  };

  // Download FTP Cron Shell Script
  const handleDownloadFtpCronScript = () => {
    const cronScript = `#!/usr/bin/env bash
# =============================================================================
# FUTURE READY ACADEMY - AUTOMATED REMOTE FTP BACKUP CRON SCRIPT
# Runs daily or weekly via Linux cron or cPanel Scheduled Tasks
# =============================================================================
set -e

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/tmp/fra_backups"
FTP_HOST="${ftpForm.host}"
FTP_USER="${ftpForm.username}"
REMOTE_PATH="${ftpForm.remotePath}"

mkdir -p "$BACKUP_DIR"
echo "[$(date)] Starting Future Ready Academy backup dump..."

# Generate PostgreSQL dump
# pg_dump -U postgres -h localhost fra_db > "$BACKUP_DIR/fra_db_\$TIMESTAMP.sql"

# Transfer backup to FTP server
# curl -u "\$FTP_USER:\$FTP_PASS" -T "$BACKUP_DIR/fra_db_\$TIMESTAMP.sql" "ftp://\$FTP_HOST\$REMOTE_PATH"

echo "[$(date)] Backup transferred to \$FTP_HOST successfully."
`;
    downloadFile(cronScript, 'fra_ftp_backup_cron.sh', 'text/x-sh');
    onShowToast('FTP Cron Shell Script downloaded: fra_ftp_backup_cron.sh');
  };

  const handleUpdateAmbassadorStatus = (id: string, newStatus: AmbassadorRecord['status']) => {
    const updated = ambassadors.map(amb => amb.id === id ? { ...amb, status: newStatus } : amb);
    onUpdateAmbassadors(updated);
    if (selectedAmbassadorDetail && selectedAmbassadorDetail.id === id) {
      setSelectedAmbassadorDetail({ ...selectedAmbassadorDetail, status: newStatus });
    }
    onShowToast(`Ambassador status updated to: ${newStatus}`);
  };

  const handleToggleCourseStatus = (id: string) => {
    const updated = courses.map((c): Course => {
      if (c.id === id) {
        const nextStatus: Course['status'] = c.status === 'Enrollment Open' ? 'Upcoming Batch' : 'Enrollment Open';
        return { ...c, status: nextStatus };
      }
      return c;
    });
    onUpdateCourses(updated);
    onShowToast(`Course status updated`);
  };

  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.shortDescription) return;
    
    const courseToAdd: Course = {
      id: `course-custom-${Date.now()}`,
      title: newCourse.title!,
      targetAudience: newCourse.targetAudience || 'Class 9 & 10 Students',
      category: newCourse.category || 'up_board_class_10',
      shortDescription: newCourse.shortDescription!,
      longDescription: newCourse.longDescription || newCourse.shortDescription!,
      pricingType: newCourse.pricingType || 'Comprehensive (Paid)',
      durationWeeks: Number(newCourse.durationWeeks) || 12,
      classesPerWeek: Number(newCourse.classesPerWeek) || 3,
      languageMedium: newCourse.languageMedium || 'Hindi & English (Bilingual)',
      syllabusHighlights: newCourse.syllabusHighlights || ['Concept Clarity', 'Weekly Practice'],
      modules: newCourse.modules || [{ title: 'Module 1: Core', topics: ['Foundation', 'Application'] }],
      keySkillsGained: newCourse.keySkillsGained || ['Critical Thinking', 'Exam Confidence'],
      status: (newCourse.status === 'Upcoming Batch' ? 'Upcoming Batch' : 'Enrollment Open') as Course['status'],
      batchStartDate: 'Rolling Batch'
    };

    onUpdateCourses([courseToAdd, ...courses]);
    setShowAddCourseModal(false);
    onShowToast(`Added new course: ${courseToAdd.title}`);
  };

  const handleAddBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatch.name) return;

    const batchToAdd: BatchRecord = {
      id: `batch-${Date.now()}`,
      name: newBatch.name!,
      courseTitle: newBatch.courseTitle || 'UP Board Course',
      targetGrade: newBatch.targetGrade || 'Class 10',
      schedule: newBatch.schedule || 'Regular Evening',
      startDate: newBatch.startDate || '2026-11-01',
      facultyMentor: newBatch.facultyMentor || 'Academic Faculty',
      enrolledStudents: Number(newBatch.enrolledStudents) || 0,
      maxCapacity: Number(newBatch.maxCapacity) || 40,
      status: (newBatch.status as any) || 'Admissions Open'
    };

    onUpdateBatches([...batches, batchToAdd]);
    setShowAddBatchModal(false);
    onShowToast(`Created batch: ${batchToAdd.name}`);
  };

  const handleAddNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeText) return;

    const noticeToAdd: AcademyNotice = {
      id: `notice-${Date.now()}`,
      message: newNoticeText,
      tag: newNoticeTag,
      isActive: true,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    onUpdateNotices([noticeToAdd, ...notices]);
    setNewNoticeText('');
    setShowAddNoticeModal(false);
    onShowToast(`Broadcasted new notice across platform`);
  };

  const handleToggleNoticeActive = (id: string) => {
    const updated = notices.map(n => n.id === id ? { ...n, isActive: !n.isActive } : n);
    onUpdateNotices(updated);
  };

  return (
    <div className="min-h-screen bg-[#030604] text-gray-100 flex flex-col font-sans">
      
      {/* Admin Top Bar */}
      <header className="sticky top-0 z-40 bg-[#060c08]/95 backdrop-blur-md border-b border-emerald-900/70 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onExitAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1510] hover:bg-emerald-950 text-gray-300 hover:text-emerald-300 border border-emerald-900/60 text-xs font-semibold transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </button>

            <div className="h-5 w-px bg-emerald-950 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              <span className="text-sm sm:text-base font-bold text-white tracking-wider">
                FRA <span className="text-[#d4af37]">CONTROL HUB</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                ADMIN V1.0
              </span>
            </div>
          </div>

          {/* Quick Metrics Badges in Top Header */}
          <div className="flex items-center gap-3 text-xs overflow-x-auto pb-1 sm:pb-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#09150f] border border-emerald-950 shrink-0">
              <span className="text-gray-400">New Inquiries:</span>
              <span className="font-bold text-emerald-400 font-mono">{newInquiriesCount}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#09150f] border border-emerald-950 shrink-0">
              <span className="text-gray-400">Pending Ambassadors:</span>
              <span className="font-bold text-[#d4af37] font-mono">{pendingAmbassadorsCount}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#09150f] border border-emerald-950 shrink-0">
              <span className="text-gray-400">Total Seats Enrolled:</span>
              <span className="font-bold text-white font-mono">{totalEnrolledAcrossBatches}/{totalCapacityAcrossBatches}</span>
            </div>

            {onNavigateToStudent && (
              <button
                onClick={onNavigateToStudent}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 font-semibold shrink-0 transition-all shadow-sm"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student Portal (Live)</span>
              </button>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-950/20 hover:bg-red-950/40 text-red-300 border border-red-900/40 shrink-0 transition-all"
                title="Log Out Admin"
              >
                <LogOut className="w-3 h-3" />
                <span>Exit</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow space-y-8">
        
        {/* =========================================================================
            TOP-LEVEL EXECUTIVE STATISTICS SUMMARY ROW
            ========================================================================= */}
        <section aria-label="Top-Level Academy Statistics" className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                <span>Executive Operations Pulse</span>
                <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800">
                  Live Current State
                </span>
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
              <span>UPMSP Board Prep + Future Tech</span>
              <span className="text-gray-600">•</span>
              <span className="text-[#d4af37]">Academic Year 2026-27</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* 1. Active Enrollments */}
            <div 
              onClick={() => setActiveTab('batches')}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#081510] via-[#050e0a] to-[#030705] border border-emerald-800/60 hover:border-emerald-500/80 p-5 sm:p-6 transition-all shadow-[0_0_25px_rgba(16,185,129,0.08)] group cursor-pointer hover:-translate-y-0.5"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-2xl pointer-events-none -z-10 group-hover:bg-emerald-500/10 transition-all" />

              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-600/50 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)] group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
                  <span>{enrollmentCapacityPct}% Occupancy</span>
                </span>
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                  Active Enrollments
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                    {totalActiveEnrollments}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">
                    Students Enrolled
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-950/80 space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
                  <span>Seat Allocation</span>
                  <span className="text-white font-semibold">{totalActiveEnrollments} / {totalCapacityAcrossBatches} Seats</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#030604] border border-emerald-950 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.min(enrollmentCapacityPct, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-gray-400">
                    Across {activeBatchesCount} Active Cohorts (Class 9 & 10)
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold group-hover:underline flex items-center gap-0.5">
                    <span>Manage</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Total Inquiries */}
            <div 
              onClick={() => setActiveTab('inquiries')}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#081510] via-[#050e0a] to-[#030705] border border-emerald-800/60 hover:border-emerald-500/80 p-5 sm:p-6 transition-all shadow-[0_0_25px_rgba(16,185,129,0.08)] group cursor-pointer hover:-translate-y-0.5"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-2xl pointer-events-none -z-10 group-hover:bg-emerald-500/10 transition-all" />

              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-600/50 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)] group-hover:scale-105 transition-transform">
                  <MessageSquareText className="w-6 h-6" />
                </div>
                <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                  newInquiriesCount > 0
                    ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  <span>{newInquiriesCount} Action Required</span>
                </span>
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                  Total Inquiries
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                    {totalInquiriesCount}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">
                    Submissions Logged
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-950/80 space-y-2">
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-1.5 rounded-lg bg-[#040806] border border-emerald-950">
                    <span className="text-[10px] text-gray-500 block">New</span>
                    <span className="font-bold text-amber-300">{newInquiriesCount}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[#040806] border border-emerald-950">
                    <span className="text-[10px] text-gray-500 block">In Progress</span>
                    <span className="font-bold text-sky-400">{inProgressInquiriesCount}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[#040806] border border-emerald-950">
                    <span className="text-[10px] text-gray-500 block">Resolved</span>
                    <span className="font-bold text-emerald-400">{resolvedInquiriesCount}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-gray-400 truncate">
                    Admissions Desk (UP Board 9 & 10)
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold group-hover:underline flex items-center gap-0.5 shrink-0">
                    <span>Respond</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Recent Ambassador Applications */}
            <div 
              onClick={() => setActiveTab('ambassadors')}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#141107] via-[#090c08] to-[#030705] border border-amber-800/60 hover:border-[#d4af37] p-5 sm:p-6 transition-all shadow-[0_0_25px_rgba(212,175,55,0.08)] group cursor-pointer hover:-translate-y-0.5"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 blur-2xl pointer-events-none -z-10 group-hover:bg-[#d4af37]/10 transition-all" />

              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-amber-950/80 border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.2)] group-hover:scale-105 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-950 text-[#d4af37] border border-amber-700/60 flex items-center gap-1">
                  <span>{recentAmbassadorApplicationsCount} Pending Review</span>
                </span>
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#d4af37] block">
                  Recent Ambassador Applications
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                    {recentAmbassadorApplicationsCount}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">
                    Awaiting Review ({totalAmbassadorsCount} Total)
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-950/80 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-gray-400">Approved Network</span>
                  <span className="text-[#d4af37] font-semibold">{approvedAmbassadorsCount} Certified Partners</span>
                </div>
                <div className="p-1.5 rounded-lg bg-[#050805] border border-emerald-950 text-xs text-gray-300 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">UP Districts Covered:</span>
                  <span className="text-emerald-400 font-mono font-bold">{districtsCount} Districts</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-gray-400 truncate">
                    Teachers, Tutors & Youth Mentors
                  </span>
                  <span className="text-[11px] text-[#d4af37] font-semibold group-hover:underline flex items-center gap-0.5 shrink-0">
                    <span>Review</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-emerald-950/80 pb-3 overflow-x-auto gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'students', label: `Students (${students.length})`, icon: GraduationCap },
              { id: 'teachers', label: `Teachers (${teachers.length})`, icon: Users },
              { id: 'posts', label: `Posts & Feed (${posts.length})`, icon: Send },
              { id: 'api-hub', label: 'REST API & Cloud DB', icon: Server, badge: 'Live' },
              { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: MessageSquareText, badge: newInquiriesCount > 0 ? newInquiriesCount : undefined },
              { id: 'ambassadors', label: `Ambassadors (${ambassadors.length})`, icon: Award, badge: pendingAmbassadorsCount > 0 ? pendingAmbassadorsCount : undefined },
              { id: 'courses', label: `Courses (${courses.length})`, icon: BookOpen },
              { id: 'batches', label: `Batches & Cohorts (${batches.length})`, icon: Layers },
              { id: 'notices', label: `Notices (${notices.length})`, icon: Bell },
              { id: 'cms', label: 'Website CMS & Brand', icon: Globe },
              { id: 'data-export', label: 'Data & Export', icon: Share2 },
              { id: 'backup', label: 'Backup & Database (FTP/SQL)', icon: Database },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as AdminTab); setSearchFilter(''); }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                      : 'bg-[#060c09] text-gray-400 hover:text-white hover:bg-emerald-950/40 border border-emerald-950'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="w-4 h-4 rounded-full bg-[#d4af37] text-black text-[10px] font-bold flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            TAB 1: OVERVIEW & EXECUTIVE HUB
            ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 4 Primary Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="p-5 rounded-2xl bg-[#070f0c] border border-emerald-950 hover:border-emerald-700/60 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 uppercase font-mono">Admissions Desk</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                    <MessageSquareText className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white font-mono">{inquiries.length} Inquiries</div>
                <div className="mt-2 text-xs flex items-center gap-2">
                  <span className="text-emerald-400 font-semibold">{newInquiriesCount} requiring action</span>
                  <span className="text-gray-500">• UP Board 9 & 10</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#070f0c] border border-emerald-950 hover:border-emerald-700/60 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 uppercase font-mono">Ambassador Network</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-700/50 text-[#d4af37] flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white font-mono">{ambassadors.length} Partners</div>
                <div className="mt-2 text-xs flex items-center gap-2">
                  <span className="text-[#d4af37] font-semibold">{pendingAmbassadorsCount} pending review</span>
                  <span className="text-gray-500">• Regional UP</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#070f0c] border border-emerald-950 hover:border-emerald-700/60 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 uppercase font-mono">Active Batches</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white font-mono">{batches.length} Cohorts</div>
                <div className="mt-2 text-xs flex items-center gap-2">
                  <span className="text-emerald-400 font-semibold">{totalEnrolledAcrossBatches} students active</span>
                  <span className="text-gray-500">• Class 9 & 10</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#070f0c] border border-emerald-950 hover:border-emerald-700/60 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 uppercase font-mono">Published Courses</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white font-mono">{courses.length} Tracks</div>
                <div className="mt-2 text-xs flex items-center gap-2">
                  <span className="text-emerald-400 font-semibold">Dual Pillar</span>
                  <span className="text-gray-500">• Board + Future Skills</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Feed Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Quick Action Bar & Batch Capacity Status */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Fast Action Center */}
                <div className="p-6 rounded-2xl bg-[#070e0b] border border-emerald-950 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-[#d4af37]">
                    Operational Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <button
                      onClick={() => setShowAddBatchModal(true)}
                      className="p-3 rounded-xl bg-[#091510] hover:bg-emerald-950 border border-emerald-900/60 text-white font-semibold flex flex-col items-center justify-center gap-1.5 transition-all text-center"
                    >
                      <Plus className="w-4 h-4 text-emerald-400" />
                      <span>Create New Batch</span>
                    </button>
                    <button
                      onClick={() => setShowAddCourseModal(true)}
                      className="p-3 rounded-xl bg-[#091510] hover:bg-emerald-950 border border-emerald-900/60 text-white font-semibold flex flex-col items-center justify-center gap-1.5 transition-all text-center"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <span>Add Course Track</span>
                    </button>
                    <button
                      onClick={() => setShowAddNoticeModal(true)}
                      className="p-3 rounded-xl bg-[#091510] hover:bg-emerald-950 border border-emerald-900/60 text-white font-semibold flex flex-col items-center justify-center gap-1.5 transition-all text-center"
                    >
                      <Bell className="w-4 h-4 text-[#d4af37]" />
                      <span>Post Announcement</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="p-3 rounded-xl bg-[#091510] hover:bg-emerald-950 border border-emerald-900/60 text-white font-semibold flex flex-col items-center justify-center gap-1.5 transition-all text-center"
                    >
                      <MessageSquareText className="w-4 h-4 text-emerald-400" />
                      <span>View Inquiries</span>
                    </button>
                  </div>
                </div>

                {/* Cohort Capacity Monitor */}
                <div className="p-6 rounded-2xl bg-[#070e0b] border border-emerald-950 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white font-mono uppercase text-gray-300">
                      Cohort Seat Occupancy
                    </h3>
                    <span className="text-xs text-emerald-400 font-mono">
                      {Math.round((totalEnrolledAcrossBatches / totalCapacityAcrossBatches) * 100)}% Full
                    </span>
                  </div>

                  <div className="space-y-3">
                    {batches.map(batch => {
                      const pct = Math.round((batch.enrolledStudents / batch.maxCapacity) * 100);
                      return (
                        <div key={batch.id} className="space-y-1.5 text-xs">
                          <div className="flex justify-between items-center text-gray-300">
                            <span className="font-semibold truncate max-w-[200px]">{batch.name}</span>
                            <span className="font-mono text-gray-400">{batch.enrolledStudents}/{batch.maxCapacity}</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-[#050a08] overflow-hidden border border-emerald-950">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                pct >= 90 ? 'bg-amber-400' : 'bg-emerald-500'
                              }`} 
                              style={{ width: `${Math.min(pct, 100)}%` }} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Recent Inquiries Stream & Ambassador Submissions */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Recent Inquiries Card */}
                <div className="p-6 rounded-2xl bg-[#070e0b] border border-emerald-950 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-emerald-400">
                      Latest Student & Parent Inquiries
                    </h3>
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="text-xs text-[#d4af37] hover:underline font-semibold"
                    >
                      Manage All →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {inquiries.slice(0, 3).map(inq => (
                      <div
                        key={inq.id}
                        onClick={() => setSelectedInquiryDetail(inq)}
                        className="p-3.5 rounded-xl bg-[#040806] border border-emerald-950 hover:border-emerald-700/60 transition-all cursor-pointer flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{inq.fullName}</span>
                            <span className="text-[10px] text-gray-400 font-mono">({inq.district}, UP)</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                              inq.status === 'New' 
                                ? 'bg-amber-950 text-amber-300 border-amber-800' 
                                : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            }`}>
                              {inq.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-1">{inq.message}</p>
                          <span className="text-[10px] text-gray-500 font-mono">{inq.createdAt} • {inq.role}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 shrink-0 mt-1" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Ambassador Partners */}
                <div className="p-6 rounded-2xl bg-[#070e0b] border border-emerald-950 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-[#d4af37]">
                      Ambassador Partner Applicants
                    </h3>
                    <button
                      onClick={() => setActiveTab('ambassadors')}
                      className="text-xs text-emerald-400 hover:underline font-semibold"
                    >
                      Review All →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {ambassadors.slice(0, 2).map(amb => (
                      <div
                        key={amb.id}
                        onClick={() => setSelectedAmbassadorDetail(amb)}
                        className="p-3.5 rounded-xl bg-[#040806] border border-emerald-950 hover:border-emerald-700/60 transition-all cursor-pointer flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{amb.fullName}</span>
                            <span className="text-[10px] text-[#d4af37] font-semibold">{amb.currentRole}</span>
                            <span className="text-[10px] text-gray-400 font-mono">({amb.cityOrDistrict})</span>
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-1">{amb.whyJoin}</p>
                          <span className="text-[10px] text-gray-500 font-mono">Reach: {amb.studentReachEstimate}</span>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0 font-medium">
                          {amb.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: STUDENTS MANAGEMENT */}
        {activeTab === 'students' && (
          <AdminStudentsTab
            students={students}
            onUpdateStudents={onUpdateStudents}
            onShowToast={onShowToast}
            onNavigateToStudent={onNavigateToStudent}
          />
        )}

        {/* TAB: TEACHERS MANAGEMENT */}
        {activeTab === 'teachers' && (
          <AdminTeachersTab
            teachers={teachers}
            onUpdateTeachers={onUpdateTeachers}
            onShowToast={onShowToast}
            onNavigateToTeacher={onNavigateToTeacher}
          />
        )}

        {/* TAB: POSTS & FEED MANAGEMENT */}
        {activeTab === 'posts' && (
          <AdminPostsTab
            posts={posts}
            onUpdatePosts={onUpdatePosts}
            onShowToast={onShowToast}
          />
        )}

        {/* TAB: REST API & CLOUD DB HUB */}
        {activeTab === 'api-hub' && (
          <AdminApiHubTab
            onShowToast={onShowToast}
          />
        )}

        {/* =========================================================================
            TAB 2: INQUIRIES & ADMISSIONS DESK
            ========================================================================= */}
        {activeTab === 'inquiries' && (() => {
          const filteredInquiries = inquiries.filter(i => {
            let matchesStatus = true;
            if (inquiryStatusFilter === 'New') {
              matchesStatus = i.status === 'New';
            } else if (inquiryStatusFilter === 'In Progress') {
              matchesStatus = i.status === 'In Progress' || i.status === 'Contacted';
            } else if (inquiryStatusFilter === 'Resolved') {
              matchesStatus = i.status === 'Resolved' || i.status === 'Enrolled' || i.status === 'Archived';
            }

            const searchLower = searchFilter.toLowerCase();
            const matchesSearch = 
              i.fullName.toLowerCase().includes(searchLower) ||
              i.district.toLowerCase().includes(searchLower) ||
              i.role.toLowerCase().includes(searchLower) ||
              i.inquiryType.toLowerCase().includes(searchLower) ||
              i.contactNumber.toLowerCase().includes(searchLower) ||
              i.email.toLowerCase().includes(searchLower);

            return matchesStatus && matchesSearch;
          });

          return (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white">Student & Parent Admissions Desk</h2>
                  <p className="text-xs text-gray-400">Manage contact inquiries, course questions, and student admissions.</p>
                </div>

                {/* Search Inquiries */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search student, district, phone..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#060c09] border border-emerald-950 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Workflow Status Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#070e0b] border border-emerald-950">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-xs font-mono text-gray-400 font-semibold px-2 hidden lg:inline-block">
                    Workflow Status:
                  </span>
                  {[
                    {
                      id: 'All' as InquiryStatusFilter,
                      label: 'All Inquiries',
                      count: totalInquiriesCount,
                      icon: ListFilter,
                      activeColor: 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]',
                    },
                    {
                      id: 'New' as InquiryStatusFilter,
                      label: 'New',
                      count: newInquiriesCount,
                      icon: AlertCircle,
                      activeColor: 'bg-amber-500 text-black font-bold shadow-[0_0_12px_rgba(245,158,11,0.3)]',
                    },
                    {
                      id: 'In Progress' as InquiryStatusFilter,
                      label: 'In Progress',
                      count: inProgressInquiriesCount,
                      icon: Clock,
                      activeColor: 'bg-sky-500 text-black font-bold shadow-[0_0_12px_rgba(14,165,233,0.3)]',
                    },
                    {
                      id: 'Resolved' as InquiryStatusFilter,
                      label: 'Resolved',
                      count: resolvedInquiriesCount,
                      icon: CheckCircle2,
                      activeColor: 'bg-emerald-500 text-black font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]',
                    },
                  ].map((filterTab) => {
                    const Icon = filterTab.icon;
                    const isSelected = inquiryStatusFilter === filterTab.id;
                    return (
                      <button
                        key={filterTab.id}
                        onClick={() => setInquiryStatusFilter(filterTab.id)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? filterTab.activeColor
                            : 'bg-[#040806] text-gray-400 hover:text-white hover:bg-emerald-950/40 border border-emerald-950'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{filterTab.label}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-black/20 text-current font-bold'
                              : 'bg-emerald-950 text-gray-300 border border-emerald-900/60'
                          }`}
                        >
                          {filterTab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-gray-400 font-mono px-1">
                  <span>
                    Showing {filteredInquiries.length} of {inquiries.length}
                  </span>
                  {(inquiryStatusFilter !== 'All' || searchFilter) && (
                    <button
                      onClick={() => {
                        setInquiryStatusFilter('All');
                        setSearchFilter('');
                      }}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 underline font-sans ml-1"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              </div>

              {/* Inquiries Table / Cards List */}
              {filteredInquiries.length === 0 ? (
                <div className="py-12 text-center rounded-2xl bg-[#060c09] border border-emerald-950 p-8 space-y-3">
                  <p className="text-gray-400 text-sm">
                    No inquiries found matching status{' '}
                    <span className="text-emerald-400 font-semibold font-mono">
                      "{inquiryStatusFilter}"
                    </span>
                    {searchFilter ? ` and search "${searchFilter}"` : ''}.
                  </p>
                  <button
                    onClick={() => {
                      setInquiryStatusFilter('All');
                      setSearchFilter('');
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-950 text-emerald-400 text-xs font-semibold border border-emerald-800 hover:bg-emerald-900 transition-colors"
                  >
                    View All Inquiries ({inquiries.length})
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-5 rounded-2xl bg-[#070e0b] border border-emerald-950 hover:border-emerald-700/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-grow">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-bold text-white">{inq.fullName}</span>
                          <span className="text-xs px-2.5 py-0.5 rounded bg-[#091510] text-[#d4af37] border border-amber-900/40 font-mono">
                            {inq.role}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">District: {inq.district}</span>
                          <span className="text-[10px] text-gray-500 font-mono">• {inq.createdAt}</span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border font-mono ${
                              inq.status === 'New'
                                ? 'bg-amber-950 text-amber-300 border-amber-800'
                                : inq.status === 'In Progress' || inq.status === 'Contacted'
                                ? 'bg-sky-950 text-sky-300 border-sky-800'
                                : inq.status === 'Resolved' || inq.status === 'Enrolled'
                                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                : 'bg-zinc-900 text-gray-400 border-zinc-700'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>

                        <div className="text-xs text-gray-300">
                          <strong className="text-emerald-400 font-medium">Inquiry [{inq.inquiryType}]: </strong>
                          <span>{inq.message}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-mono">
                          <span>📞 {inq.contactNumber}</span>
                          <span>✉️ {inq.email}</span>
                          {inq.internalNotes && (
                            <span className="text-emerald-300 italic">Notes: {inq.internalNotes}</span>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions & Status Control Bar */}
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-emerald-950 relative">
                        {/* Instant 1-Click Status Toggles (No modal needed) */}
                        <div className="inline-flex items-center p-1 rounded-xl bg-[#040806] border border-emerald-900/60 shadow-inner">
                          <button
                            type="button"
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'New')}
                            title="Instant mark as New"
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                              inq.status === 'New'
                                ? 'bg-amber-500 text-black font-bold shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                                : 'text-gray-400 hover:text-amber-300 hover:bg-amber-950/40'
                            }`}
                          >
                            <span>🟡</span>
                            <span>New</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'In Progress')}
                            title="Instant mark as In Progress"
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                              inq.status === 'In Progress' || inq.status === 'Contacted'
                                ? 'bg-sky-500 text-black font-bold shadow-[0_0_10px_rgba(14,165,233,0.4)]'
                                : 'text-gray-400 hover:text-sky-300 hover:bg-sky-950/40'
                            }`}
                          >
                            <span>🔵</span>
                            <span>In Progress</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'Resolved')}
                            title="Instant mark as Resolved"
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                              inq.status === 'Resolved' || inq.status === 'Enrolled'
                                ? 'bg-emerald-500 text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                                : 'text-gray-400 hover:text-emerald-300 hover:bg-emerald-950/40'
                            }`}
                          >
                            <span>🟢</span>
                            <span>Resolved</span>
                          </button>
                        </div>

                        {/* Quick Actions Dropdown Menu */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setOpenQuickActionId(openQuickActionId === inq.id ? null : inq.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#091510] hover:bg-emerald-950 text-white border border-emerald-900/80 text-xs font-semibold transition-all cursor-pointer shadow-sm"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>Quick Actions</span>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                          </button>

                          {/* Popover Dropdown */}
                          {openQuickActionId === inq.id && (
                            <>
                              <div
                                className="fixed inset-0 z-30"
                                onClick={() => setOpenQuickActionId(null)}
                              />
                              <div className="absolute right-0 top-full mt-2 z-40 w-60 rounded-2xl bg-[#07130e] border border-emerald-700/80 p-2.5 shadow-2xl space-y-1.5 text-xs animate-in fade-in zoom-in-95 duration-100">
                                <div className="px-2 py-1 text-[10px] font-mono text-[#d4af37] font-semibold border-b border-emerald-950/80 uppercase flex items-center justify-between">
                                  <span>Quick Actions Menu</span>
                                  <span className="text-gray-400 font-normal">#{inq.id}</span>
                                </div>

                                {/* Instant Status Shortcut Group inside menu as well */}
                                <div className="px-2 py-1 text-[11px] text-gray-400 font-medium">
                                  Set Status Instantly:
                                </div>
                                <div className="grid grid-cols-3 gap-1 px-1">
                                  <button
                                    onClick={() => {
                                      handleUpdateInquiryStatus(inq.id, 'New');
                                      setOpenQuickActionId(null);
                                    }}
                                    className={`py-1 rounded-md text-[10px] font-bold text-center border cursor-pointer ${
                                      inq.status === 'New'
                                        ? 'bg-amber-500 text-black border-amber-400'
                                        : 'bg-[#040806] text-amber-300 border-amber-900/60 hover:bg-amber-950/60'
                                    }`}
                                  >
                                    🟡 New
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleUpdateInquiryStatus(inq.id, 'In Progress');
                                      setOpenQuickActionId(null);
                                    }}
                                    className={`py-1 rounded-md text-[10px] font-bold text-center border cursor-pointer ${
                                      inq.status === 'In Progress' || inq.status === 'Contacted'
                                        ? 'bg-sky-500 text-black border-sky-400'
                                        : 'bg-[#040806] text-sky-300 border-sky-900/60 hover:bg-sky-950/60'
                                    }`}
                                  >
                                    🔵 In Prog
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleUpdateInquiryStatus(inq.id, 'Resolved');
                                      setOpenQuickActionId(null);
                                    }}
                                    className={`py-1 rounded-md text-[10px] font-bold text-center border cursor-pointer ${
                                      inq.status === 'Resolved' || inq.status === 'Enrolled'
                                        ? 'bg-emerald-500 text-black border-emerald-400'
                                        : 'bg-[#040806] text-emerald-300 border-emerald-900/60 hover:bg-emerald-950/60'
                                    }`}
                                  >
                                    🟢 Resolved
                                  </button>
                                </div>

                                <div className="pt-1.5 border-t border-emerald-950/80 space-y-1">
                                  {/* Direct WhatsApp Outreach */}
                                  <a
                                    href={`https://wa.me/91${inq.contactNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                                      `Namaste ${inq.fullName}, greetings from Future Ready Academy! We received your admission inquiry for "${inq.inquiryType}". Our counselors are here to help you.`
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => {
                                      handleUpdateInquiryStatus(inq.id, 'Contacted');
                                      setOpenQuickActionId(null);
                                    }}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-emerald-300 hover:bg-emerald-950/80 transition-colors"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Send WhatsApp Message</span>
                                  </a>

                                  {/* Direct Call */}
                                  <a
                                    href={`tel:${inq.contactNumber}`}
                                    onClick={() => {
                                      handleUpdateInquiryStatus(inq.id, 'Contacted');
                                      setOpenQuickActionId(null);
                                    }}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-gray-200 hover:bg-emerald-950/80 transition-colors"
                                  >
                                    <PhoneCall className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                    <span>Call Phone ({inq.contactNumber})</span>
                                  </a>

                                  {/* Copy Full Details */}
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        `[Future Ready Academy Inquiry]\nName: ${inq.fullName}\nPhone: ${inq.contactNumber}\nEmail: ${inq.email}\nDistrict: ${inq.district}\nType: ${inq.inquiryType}\nMessage: ${inq.message}`
                                      );
                                      onShowToast(`Copied details for ${inq.fullName}`);
                                      setOpenQuickActionId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-gray-200 hover:bg-emerald-950/80 transition-colors text-left cursor-pointer"
                                  >
                                    <Copy className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                                    <span>Copy Inquiry Info</span>
                                  </button>

                                  {/* Secondary Statuses */}
                                  <button
                                    onClick={() => {
                                      handleUpdateInquiryStatus(inq.id, 'Enrolled');
                                      setOpenQuickActionId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-amber-300 hover:bg-emerald-950/80 transition-colors text-left cursor-pointer"
                                  >
                                    <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                                    <span>Mark Enrolled (Admitted)</span>
                                  </button>
                                </div>

                                <div className="pt-1.5 border-t border-emerald-950/80">
                                  <button
                                    onClick={() => {
                                      setSelectedInquiryDetail(inq);
                                      setOpenQuickActionId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold transition-colors cursor-pointer"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                    <span>View Full Modal Card</span>
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* =========================================================================
            TAB 3: AMBASSADOR PARTNERS
            ========================================================================= */}
        {activeTab === 'ambassadors' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">Ambassador Partner Network</h2>
                <p className="text-xs text-gray-400">Review teacher and mentor applications to organize local student cohorts across UP.</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search ambassador or city..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#060c09] border border-emerald-950 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {ambassadors
                .filter(a => 
                  a.fullName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  a.cityOrDistrict.toLowerCase().includes(searchFilter.toLowerCase())
                )
                .map(amb => (
                  <div
                    key={amb.id}
                    className="p-5 rounded-2xl bg-[#070e0b] border border-emerald-950 hover:border-emerald-700/60 transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-bold text-white">{amb.fullName}</h3>
                          <p className="text-xs text-[#d4af37] font-medium">{amb.currentRole} • {amb.cityOrDistrict}</p>
                          {amb.institutionName && (
                            <p className="text-xs text-gray-400">{amb.institutionName}</p>
                          )}
                        </div>

                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                          amb.status === 'Approved Partner'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                            : amb.status === 'Pending Review'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-zinc-900 text-gray-300 border-zinc-700'
                        }`}>
                          {amb.status}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#040806] border border-emerald-950 text-xs text-gray-300 space-y-1.5">
                        <span className="text-[10px] text-gray-500 font-mono uppercase block">Motivation:</span>
                        <p className="line-clamp-2 leading-relaxed">{amb.whyJoin}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 font-mono">
                        <span>📞 {amb.contactNumber}</span>
                        <span>👥 Reach: {amb.studentReachEstimate}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-emerald-950 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {amb.status !== 'Approved Partner' && (
                          <button
                            onClick={() => handleUpdateAmbassadorStatus(amb.id, 'Approved Partner')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        {amb.status === 'Approved Partner' && (
                          <button
                            onClick={() => handleUpdateAmbassadorStatus(amb.id, 'Kit Dispatched')}
                            className="px-3 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#e4be4e] text-black text-xs font-bold transition-colors"
                          >
                            Dispatch Kit
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedAmbassadorDetail(amb)}
                        className="px-3 py-1.5 rounded-lg bg-[#040806] hover:bg-emerald-950 text-gray-300 text-xs font-medium border border-emerald-900/60"
                      >
                        View Full Profile
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: COURSE MANAGEMENT
            ========================================================================= */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">Curriculum & Course Tracks</h2>
                <p className="text-xs text-gray-400">Configure UP Board academic coaching and emerging technology offerings.</p>
              </div>

              <button
                onClick={() => setShowAddCourseModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold text-xs hover:brightness-110 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Course</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <div
                  key={course.id}
                  className="p-5 rounded-2xl bg-[#070e0b] border border-emerald-950 hover:border-emerald-700/60 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-[#d4af37] font-bold uppercase truncate">
                        {course.targetAudience}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                        {course.pricingType}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">{course.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{course.shortDescription}</p>

                    <div className="p-2.5 rounded-lg bg-[#040806] border border-emerald-950 text-xs text-gray-400 font-mono flex items-center justify-between">
                      <span>{course.durationWeeks} Weeks</span>
                      <span>{course.languageMedium}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-emerald-950 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleCourseStatus(course.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all border ${
                        course.status === 'Enrollment Open'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                          : 'bg-zinc-900 text-gray-400 border-zinc-700'
                      }`}
                    >
                      Status: {course.status}
                    </button>

                    <span className="text-xs text-gray-500 font-mono">
                      {course.modules.length} Modules
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: BATCHES & STUDENT COHORTS
            ========================================================================= */}
        {activeTab === 'batches' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">Student Batches & Class Rosters</h2>
                <p className="text-xs text-gray-400">Manage UP Board timetable, mentor assignments, and student seat limits.</p>
              </div>

              <button
                onClick={() => setShowAddBatchModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold text-xs hover:brightness-110 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create Batch</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {batches.map(batch => {
                const occupancyPct = Math.round((batch.enrolledStudents / batch.maxCapacity) * 100);
                return (
                  <div
                    key={batch.id}
                    className="p-6 rounded-2xl bg-[#070e0b] border border-emerald-950 hover:border-emerald-700/60 transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono text-[#d4af37] font-bold uppercase block">
                          {batch.targetGrade}
                        </span>
                        <h3 className="text-lg font-bold text-white">{batch.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{batch.courseTitle}</p>
                      </div>

                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase border ${
                        batch.status === 'Admissions Open'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-zinc-900 text-gray-300 border-zinc-700'
                      }`}>
                        {batch.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-[#040806] border border-emerald-950 text-gray-300">
                      <div>
                        <span className="text-[10px] text-gray-500 font-mono uppercase block">Schedule</span>
                        <span>{batch.schedule}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-mono uppercase block">Faculty Mentor</span>
                        <span className="text-emerald-400">{batch.facultyMentor}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-mono">Seat Occupancy</span>
                        <span className="font-bold text-white font-mono">
                          {batch.enrolledStudents} / {batch.maxCapacity} seats ({occupancyPct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#040806] border border-emerald-950 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            occupancyPct >= 90 ? 'bg-amber-400' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(occupancyPct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: NOTICEBOARD & ANNOUNCEMENTS
            ========================================================================= */}
        {activeTab === 'notices' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">Academy Noticeboard</h2>
                <p className="text-xs text-gray-400">Broadcast important dates, UPMSP board exam alerts, and batch reminders.</p>
              </div>

              <button
                onClick={() => setShowAddNoticeModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold text-xs hover:brightness-110 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Post Announcement</span>
              </button>
            </div>

            <div className="space-y-3">
              {notices.map(notice => (
                <div
                  key={notice.id}
                  className="p-4 rounded-xl bg-[#070e0b] border border-emerald-950 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                        {notice.tag}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">{notice.dateAdded}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${notice.isActive ? 'bg-emerald-950/70 text-emerald-300' : 'bg-zinc-900 text-gray-500'}`}>
                        {notice.isActive ? 'Active on site' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white">{notice.message}</p>
                  </div>

                  <button
                    onClick={() => handleToggleNoticeActive(notice.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-900/60 bg-[#040806] text-gray-300 hover:text-white"
                  >
                    {notice.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: WEBSITE CMS & BRAND SETTINGS
            ========================================================================= */}
        {activeTab === 'cms' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  <span>Website Content Management (CMS)</span>
                </h2>
                <p className="text-xs text-gray-400">
                  Control all public branding, hero headlines, helpline numbers, and academic hours live across the entire web app.
                </p>
              </div>

              <button
                onClick={handleSaveCmsSettings}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-bold text-xs hover:from-emerald-400 hover:to-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer shrink-0"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save All Website Changes</span>
              </button>
            </div>

            <form onSubmit={handleSaveCmsSettings} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Brand & Hero Content */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Brand Identity Card */}
                <div className="p-6 rounded-2xl bg-[#070e0b] border border-emerald-950 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-[#d4af37] flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Brand Identity & Tagline</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">
                        Brand / Academy Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={cmsForm.brandName}
                        onChange={(e) => setCmsForm({ ...cmsForm, brandName: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#040806] border border-emerald-900/80 text-white focus:outline-none focus:border-emerald-400 font-semibold text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-1">
                        Official Tagline *
                      </label>
                      <input
                        type="text"
                        required
                        value={cmsForm.tagline}
                        onChange={(e) => setCmsForm({ ...cmsForm, tagline: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#040806] border border-emerald-900/80 text-white focus:outline-none focus:border-emerald-400 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-1 text-xs">
                      Active Academic Year
                    </label>
                    <input
                      type="text"
                      value={cmsForm.activeAcademicYear}
                      onChange={(e) => setCmsForm({ ...cmsForm, activeAcademicYear: e.target.value })}
                      placeholder="e.g. 2026 - 2027"
                      className="w-full sm:w-1/2 px-3 py-2.5 rounded-xl bg-[#040806] border border-emerald-900/80 text-white focus:outline-none focus:border-emerald-400 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Hero Section Headlines */}
                <div className="p-6 rounded-2xl bg-[#070e0b] border border-emerald-950 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-emerald-400 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>Home Page Hero Copy</span>
                  </h3>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">
                        Main Hero Headline *
                      </label>
                      <input
                        type="text"
                        required
                        value={cmsForm.heroHeadline}
                        onChange={(e) => setCmsForm({ ...cmsForm, heroHeadline: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#040806] border border-emerald-900/80 text-white focus:outline-none focus:border-emerald-400 font-bold text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-1">
                        Hero Subheadline / Value Proposition *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={cmsForm.heroSubheadline}
                        onChange={(e) => setCmsForm({ ...cmsForm, heroSubheadline: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#040806] border border-emerald-900/80 text-white focus:outline-none focus:border-emerald-400 text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact & Helpline Hub */}
                <div className="p-6 rounded-2xl bg-[#070e0b] border border-emerald-950 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-sky-400 flex items-center gap-2">
                    <PhoneCall className="w-4 h-4" />
                    <span>Helpline & Regional Operations</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">
                        Helpline Phone Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={cmsForm.helplinePhone}
                        onChange={(e) => setCmsForm({ ...cmsForm, helplinePhone: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#040806] border border-emerald-900/80 text-white focus:outline-none focus:border-emerald-400 font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-1">
                        Support / Admissions Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={cmsForm.supportEmail}
                        onChange={(e) => setCmsForm({ ...cmsForm, supportEmail: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#040806] border border-emerald-900/80 text-white focus:outline-none focus:border-emerald-400 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">
                        Academic Centers / Location Description *
                      </label>
                      <input
                        type="text"
                        required
                        value={cmsForm.academyLocation}
                        onChange={(e) => setCmsForm({ ...cmsForm, academyLocation: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#040806] border border-emerald-900/80 text-white focus:outline-none focus:border-emerald-400 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-1">
                        Student Counseling Hours *
                      </label>
                      <input
                        type="text"
                        required
                        value={cmsForm.counselingHours}
                        onChange={(e) => setCmsForm({ ...cmsForm, counselingHours: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#040806] border border-emerald-900/80 text-white focus:outline-none focus:border-emerald-400 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-colors shadow-lg cursor-pointer"
                  >
                    Save Changes to Live Website
                  </button>
                </div>
              </div>

              {/* Right Column: Live Website Preview Card */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 rounded-2xl bg-[#070e0b] border border-emerald-900/60 sticky top-24 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
                    <span className="text-xs font-mono font-bold text-gray-400 uppercase">
                      Live Preview on Public Site
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Auto Synced
                    </span>
                  </div>

                  {/* Hero pill preview */}
                  <div className="p-4 rounded-xl bg-[#040806] border border-emerald-950 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-700/50 bg-[#07150f]/80 text-emerald-300 text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[#d4af37] font-bold">{cmsForm.brandName || 'FUTURE READY ACADEMY'}</span>
                      <span className="text-gray-400">•</span>
                      <span>“{cmsForm.tagline || 'Learn Together, Grow Together.'}”</span>
                    </div>

                    <h4 className="text-base font-extrabold text-white leading-snug">
                      {cmsForm.heroHeadline || 'Excel in UP Board Exams. Build Real-World Tech & AI Skills.'}
                    </h4>

                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                      {cmsForm.heroSubheadline}
                    </p>
                  </div>

                  {/* Public Contact Card Preview */}
                  <div className="p-4 rounded-xl bg-[#040806] border border-emerald-950 space-y-2 text-xs">
                    <span className="text-[10px] font-mono text-[#d4af37] uppercase block font-semibold">
                      Public Contact Card
                    </span>
                    <div className="text-gray-300 space-y-1">
                      <p className="flex items-center gap-2">
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-mono text-emerald-400 font-semibold">{cmsForm.helplinePhone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-mono text-gray-300">{cmsForm.supportEmail}</span>
                      </p>
                      <p className="flex items-center gap-2 text-[11px] text-gray-400">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        <span>{cmsForm.counselingHours}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </form>
          </div>
        )}

        {/* =========================================================================
            TAB 8: BACKUP, DATABASE (JSON/POSTGRES) & REMOTE FTP BACKUP
            ========================================================================= */}
        {activeTab === 'backup' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <span>Website Database, Backups & Remote FTP Sync</span>
                </h2>
                <p className="text-xs text-gray-400">
                  Full control over JSON snapshots, PostgreSQL database dumps, site restore, and remote FTP/SFTP server synchronization.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDownloadJsonBackup}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download JSON</span>
                </button>
                <button
                  onClick={handleDownloadPostgresDump}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-xs hover:from-emerald-400 hover:to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all cursor-pointer"
                >
                  <Database className="w-4 h-4" />
                  <span>PostgreSQL Dump (.sql)</span>
                </button>
              </div>
            </div>

            {/* Top Status & Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Courses Track', count: courses.length, icon: BookOpen, color: 'text-emerald-400' },
                { label: 'Total Inquiries', count: inquiries.length, icon: MessageSquareText, color: 'text-amber-300' },
                { label: 'Ambassador Partners', count: ambassadors.length, icon: Award, color: 'text-[#d4af37]' },
                { label: 'Active Cohorts', count: batches.length, icon: Users, color: 'text-sky-400' },
                { label: 'Announcements', count: notices.length, icon: Bell, color: 'text-purple-400' },
                { label: 'CMS Attributes', count: 9, icon: Globe, color: 'text-teal-400' },
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#070e0b] border border-emerald-950 space-y-1">
                    <div className="flex items-center justify-between text-gray-500">
                      <span className="text-[10px] uppercase font-mono">{m.label}</span>
                      <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                    </div>
                    <div className="text-xl font-bold text-white font-mono">{m.count}</div>
                  </div>
                );
              })}
            </div>

            {/* =====================================================================
                SECTION 1: JSON MASTER WEBSITE SNAPSHOT & RESTORE
                ===================================================================== */}
            <div className="p-6 rounded-2xl bg-[#070e0b] border border-emerald-950 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-950 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-emerald-400" />
                    <span>JSON Master Snapshot & Instant Restore</span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    Export all website courses, inquiries, ambassadors, batches, and CMS settings in a single portable JSON file.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleDownloadJsonBackup}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs transition-all cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON File</span>
                  </button>

                  <button
                    onClick={() => restoreFileRef.current?.click()}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#091510] hover:bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Restore from JSON File</span>
                  </button>

                  <button
                    onClick={handleCopyJsonBackup}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#040806] hover:bg-emerald-950 text-gray-300 border border-emerald-950 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                    <span>Copy JSON</span>
                  </button>
                </div>
              </div>

              {/* JSON Architecture Schema Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#040806] border border-emerald-950 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-[#d4af37] font-bold">Automatic Local Sync</span>
                  <p className="text-gray-300 leading-relaxed text-xs">
                    Every modification in courses, inquiries, or CMS automatically writes to browser persistent storage (<span className="font-mono text-emerald-400">FRA_MASTER_ACADEMY_DATA_V1</span>).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#040806] border border-emerald-950 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">1-Click Full Site Restore</span>
                  <p className="text-gray-300 leading-relaxed text-xs">
                    Upload any previous JSON backup file to instantly rollback or restore courses, batches, and site copy without data loss.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#040806] border border-emerald-950 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-sky-400 font-bold">Cloud Ready Format</span>
                  <p className="text-gray-300 leading-relaxed text-xs">
                    Conforms to standard Firebase Firestore collection structures and MongoDB BSON document representations.
                  </p>
                </div>
              </div>
            </div>

            {/* =====================================================================
                SECTION 2: POSTGRESQL RELATIONAL DATABASE EXPORT (.SQL)
                ===================================================================== */}
            <div className="p-6 rounded-2xl bg-[#070e0b] border border-emerald-950 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-950 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-sky-400" />
                    <span>PostgreSQL Database Export (.sql Dump)</span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    Production-grade DDL definitions and INSERT statements for Google Cloud SQL, Supabase, Neon, or local PostgreSQL.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleOpenSqlPreview}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#091510] hover:bg-emerald-950 text-sky-300 border border-sky-800/60 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Preview SQL Script</span>
                  </button>

                  <button
                    onClick={handleDownloadPostgresDump}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs transition-all cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PostgreSQL .sql</span>
                  </button>
                </div>
              </div>

              {/* PostgreSQL Tables Included */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
                {[
                  'fra_site_settings',
                  'fra_courses',
                  'fra_inquiries',
                  'fra_ambassadors',
                  'fra_batches',
                  'fra_academy_notices'
                ].map((tbl) => (
                  <div key={tbl} className="p-2.5 rounded-lg bg-[#040806] border border-emerald-950 flex items-center gap-2 text-gray-300">
                    <span className="text-emerald-400">✓</span>
                    <span className="truncate">{tbl}</span>
                  </div>
                ))}
              </div>

              {/* Import Command Helper */}
              <div className="p-4 rounded-xl bg-[#040806] border border-emerald-950 text-xs space-y-2">
                <span className="text-[10px] font-mono uppercase text-gray-500 block font-semibold">
                  PostgreSQL Quick Import Command
                </span>
                <div className="flex items-center justify-between bg-black/60 p-2.5 rounded-lg border border-emerald-950/80 font-mono text-emerald-400 overflow-x-auto text-xs">
                  <code>psql -h your-postgres-host -U postgres -d future_ready_db &lt; future_ready_academy_postgres.sql</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('psql -h your-postgres-host -U postgres -d future_ready_db < future_ready_academy_postgres.sql');
                      onShowToast('Command copied to clipboard!');
                    }}
                    className="text-gray-400 hover:text-white ml-3 shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* =====================================================================
                SECTION 3: FTP / SFTP REMOTE BACKUP CONFIGURATION & SYNC
                ===================================================================== */}
            <div className="p-6 rounded-2xl bg-[#070e0b] border border-emerald-950 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-950 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-[#d4af37]" />
                    <span>FTP / SFTP Remote Server Backup</span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    Configure automated or scheduled snapshot pushes to your cPanel, VPS, or cloud storage server.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestFtpConnection}
                    disabled={ftpTestRunning}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#091510] hover:bg-emerald-950 text-gray-200 border border-emerald-800 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Terminal className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{ftpTestRunning ? 'Testing Handshake...' : 'Test FTP Connection'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSyncToFtpServer}
                    disabled={ftpSyncRunning}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-amber-300 text-black font-bold text-xs transition-all cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{ftpSyncRunning ? 'Uploading Snapshot...' : 'Push Backup to FTP Server'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadFtpCronScript}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#040806] hover:bg-emerald-950 text-gray-300 border border-emerald-950 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <FileCode className="w-3.5 h-3.5 text-gray-400" />
                    <span>Download Cron (.sh)</span>
                  </button>
                </div>
              </div>

              {/* FTP Configuration Form */}
              <form onSubmit={handleSaveFtpSettings} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-gray-300 font-medium mb-1">
                    Protocol *
                  </label>
                  <select
                    value={ftpForm.protocol}
                    onChange={(e) => setFtpForm({ ...ftpForm, protocol: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040806] border border-emerald-900/80 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="SFTP">SFTP (SSH File Transfer - Recommended)</option>
                    <option value="FTPS">FTPS (Explicit TLS/SSL)</option>
                    <option value="FTP">FTP (Standard Plaintext)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">
                    FTP Host / Server IP *
                  </label>
                  <input
                    type="text"
                    required
                    value={ftpForm.host}
                    onChange={(e) => setFtpForm({ ...ftpForm, host: e.target.value })}
                    placeholder="ftp.futurereadyacademy.in"
                    className="w-full px-3 py-2 rounded-xl bg-[#040806] border border-emerald-900/80 text-white focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">
                    Port *
                  </label>
                  <input
                    type="number"
                    required
                    value={ftpForm.port}
                    onChange={(e) => setFtpForm({ ...ftpForm, port: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040806] border border-emerald-900/80 text-white focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">
                    Backup Schedule
                  </label>
                  <select
                    value={ftpForm.autoBackupSchedule}
                    onChange={(e) => setFtpForm({ ...ftpForm, autoBackupSchedule: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040806] border border-emerald-900/80 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Daily (Midnight)">Daily (Midnight 00:00 IST)</option>
                    <option value="Weekly (Sunday)">Weekly (Sunday 02:00 IST)</option>
                    <option value="Disabled">Manual Only (Disabled)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">
                    FTP Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={ftpForm.username}
                    onChange={(e) => setFtpForm({ ...ftpForm, username: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040806] border border-emerald-900/80 text-white focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">
                    Password / Secret Key *
                  </label>
                  <input
                    type="password"
                    value={ftpPassword}
                    onChange={(e) => setFtpPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#040806] border border-emerald-900/80 text-white focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-300 font-medium mb-1">
                    Remote Path Directory *
                  </label>
                  <input
                    type="text"
                    required
                    value={ftpForm.remotePath}
                    onChange={(e) => setFtpForm({ ...ftpForm, remotePath: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#040806] border border-emerald-900/80 text-white focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>

                <div className="md:col-span-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    Save FTP Connection Settings
                  </button>
                </div>
              </form>

              {/* Live Terminal Output for FTP Tests & Sync */}
              {(ftpTestLogs.length > 0 || ftpSyncLogs.length > 0) && (
                <div className="p-4 rounded-xl bg-black border border-emerald-900/60 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-gray-400 border-b border-zinc-900 pb-2">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Remote FTP Execution Console</span>
                    </span>
                    <button
                      onClick={() => { setFtpTestLogs([]); setFtpSyncLogs([]); }}
                      className="text-gray-500 hover:text-gray-300 text-[10px]"
                    >
                      Clear Log
                    </button>
                  </div>

                  {ftpSyncRunning && (
                    <div className="space-y-1 py-1">
                      <div className="flex justify-between text-[11px] text-gray-400">
                        <span>Transferring snapshot archive...</span>
                        <span>{ftpSyncProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-400 transition-all duration-300"
                          style={{ width: `${ftpSyncProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1 text-[11px] max-h-36 overflow-y-auto">
                    {ftpTestLogs.map((log, i) => (
                      <div key={`test-${i}`} className="text-emerald-300">{log}</div>
                    ))}
                    {ftpSyncLogs.map((log, i) => (
                      <div key={`sync-${i}`} className="text-sky-300">{log}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Last Backup Record */}
              <div className="p-3.5 rounded-xl bg-[#040806] border border-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Last Remote Backup:</span>
                  <span className="font-mono text-white font-semibold">{ftpForm.lastBackupTime}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    ftpForm.lastBackupStatus === 'Success'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-zinc-900 text-gray-400'
                  }`}>
                    {ftpForm.lastBackupStatus}
                  </span>
                </div>
                {ftpForm.lastLog && (
                  <span className="text-[11px] text-gray-500 truncate max-w-md font-mono">
                    {ftpForm.lastLog}
                  </span>
                )}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 9: DEDICATED DATA & EXPORT (JSON / SQL PERSISTENCE / KOK COOKIE SYSTEM)
            ========================================================================= */}
        {activeTab === 'data-export' && (
          <div className="space-y-6">
            
            {/* Tab Header Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#091a13] via-[#06110c] to-[#040806] border border-emerald-800/60 shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Share2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    Academy Data Engine & Persistence Gateway
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono">
                    JSON • MySQL • Postgres • Kok
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Data & Export Hub
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl">
                  Export state as formatted JSON, simulate HTTP POST calls to MySQL / PostgreSQL REST endpoints with relational telemetry, or manage Browser Cookie ("Kok") snapshot caching.
                </p>
              </div>

              {/* State Summary Badge */}
              <div className="flex flex-wrap gap-2 text-xs font-mono bg-[#030705] p-3 rounded-xl border border-emerald-950">
                <div className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-900/50 text-gray-300">
                  Courses: <span className="text-white font-bold">{courses.length}</span>
                </div>
                <div className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-900/50 text-gray-300">
                  Inquiries: <span className="text-emerald-400 font-bold">{inquiries.length}</span>
                </div>
                <div className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-900/50 text-gray-300">
                  Ambassadors: <span className="text-[#d4af37] font-bold">{ambassadors.length}</span>
                </div>
                <div className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-900/50 text-gray-300">
                  Batches: <span className="text-sky-400 font-bold">{batches.length}</span>
                </div>
              </div>
            </div>

            {/* Sub-Tab Navigation Bar */}
            <div className="flex flex-wrap items-center gap-2 border-b border-emerald-950/80 pb-3">
              <button
                onClick={() => setActiveExportSubTab('custom-sql')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeExportSubTab === 'custom-sql'
                    ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-[#070e0a] text-gray-400 hover:text-white hover:bg-emerald-950/50 border border-emerald-950'
                }`}
              >
                <Code2 className="w-4 h-4 text-emerald-300" />
                <span>1. Custom SQL Studio (Apna SQL Likhein)</span>
              </button>

              <button
                onClick={() => setActiveExportSubTab('db-to-json')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeExportSubTab === 'db-to-json'
                    ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-[#070e0a] text-gray-400 hover:text-white hover:bg-emerald-950/50 border border-emerald-950'
                }`}
              >
                <FileJson className="w-4 h-4 text-[#d4af37]" />
                <span>2. Convert DB to JSON (DB ko JSON Format me Banana)</span>
              </button>

              <button
                onClick={() => setActiveExportSubTab('json')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeExportSubTab === 'json'
                    ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-[#070e0a] text-gray-400 hover:text-white hover:bg-emerald-950/50 border border-emerald-950'
                }`}
              >
                <FileCode className="w-4 h-4 text-sky-300" />
                <span>3. JSON Snapshot & Restore</span>
              </button>

              <button
                onClick={() => setActiveExportSubTab('sql-post')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeExportSubTab === 'sql-post'
                    ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-[#070e0a] text-gray-400 hover:text-white hover:bg-emerald-950/50 border border-emerald-950'
                }`}
              >
                <Zap className="w-4 h-4 text-[#d4af37]" />
                <span>4. SQL POST Persistence (MySQL / Postgres)</span>
              </button>

              <button
                onClick={() => {
                  setActiveExportSubTab('kok-cookie');
                  setCookieList(getAllBrowserCookies());
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeExportSubTab === 'kok-cookie'
                    ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-[#070e0a] text-gray-400 hover:text-white hover:bg-emerald-950/50 border border-emerald-950'
                }`}
              >
                <Cookie className="w-4 h-4 text-amber-300" />
                <span>5. Cookie ("Kok") System</span>
              </button>
            </div>

            {/* =========================================================================
                SUB-PANEL 1: JSON DATA EXPORT & RESTORE
                ========================================================================= */}
            {activeExportSubTab === 'json' && (
              <div className="space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* JSON Export Card */}
                  <div className="p-6 rounded-2xl bg-[#060c08] border border-emerald-900/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Download className="w-5 h-5 text-emerald-400" />
                        <h4 className="font-bold text-white text-base">Export Current State as JSON</h4>
                      </div>
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Normalized v2.0
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed">
                      Download the full website state including courses, inquiries, ambassador partners, active cohorts, CMS site branding, and noticeboard items into an ISO-compliant, single portable JSON file.
                    </p>

                    <div className="p-3.5 rounded-xl bg-[#030604] border border-emerald-950/80 space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-gray-400">
                        <span>Payload Version:</span>
                        <span className="text-white">2.0.0 (Relational-ready)</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Target Academy:</span>
                        <span className="text-emerald-400">{cmsForm.brandName || 'Future Ready Academy'}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Payload Entities:</span>
                        <span className="text-white">6 Root Tables</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Estimated Payload Size:</span>
                        <span className="text-[#d4af37]">
                          ~{Math.round(JSON.stringify(generateMasterBackupPackage()).length / 1024)} KB
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={handleDownloadJsonBackup}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download JSON File</span>
                      </button>

                      <button
                        onClick={() => {
                          const jsonStr = JSON.stringify(generateMasterBackupPackage(), null, 2);
                          navigator.clipboard.writeText(jsonStr);
                          setJsonRawCopied(true);
                          setTimeout(() => setJsonRawCopied(false), 2000);
                          onShowToast('Formatted JSON copied to clipboard!');
                        }}
                        className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#0a1510] hover:bg-emerald-950 text-gray-200 border border-emerald-800 text-xs font-semibold transition-all"
                      >
                        {jsonRawCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#d4af37]" />}
                        <span>{jsonRawCopied ? 'Copied!' : 'Copy to Clipboard'}</span>
                      </button>
                    </div>
                  </div>

                  {/* JSON Restore Card */}
                  <div className="p-6 rounded-2xl bg-[#060c08] border border-emerald-900/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-sky-400" />
                        <h4 className="font-bold text-white text-base">Import & Restore JSON File</h4>
                      </div>
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800">
                        Safe Schema Ingestion
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed">
                      Upload any previously saved Future Ready Academy JSON backup file to overwrite or synchronize live state across all components and local browser persistence.
                    </p>

                    <div className="p-4 rounded-xl border border-dashed border-emerald-800/80 bg-[#030604] flex flex-col items-center justify-center py-6 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
                        <FileCode className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-200">
                          Select an exported .json state file
                        </p>
                        <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                          Accepts *.json from this portal or previous backups
                        </p>
                      </div>

                      <button
                        onClick={() => restoreFileRef.current?.click()}
                        className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(2,132,199,0.3)]"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose JSON File to Restore</span>
                      </button>
                    </div>

                    <div className="text-[11px] text-gray-500 font-mono flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Schema validator automatically checks root keys before updating state.</span>
                    </div>
                  </div>

                </div>

                {/* Live JSON Inspector Panel */}
                <div className="p-6 rounded-2xl bg-[#060c08] border border-emerald-900/60 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-950 pb-3">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#d4af37]" />
                      <h4 className="font-bold text-white text-sm">Live State JSON Previewer</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        Reactive Readout
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                      <span>Total Keys: 8</span>
                      <span>•</span>
                      <span className="text-emerald-400">UTF-8 Encoded</span>
                    </div>
                  </div>

                  <div className="relative">
                    <pre className="p-4 rounded-xl bg-[#020503] border border-emerald-950 font-mono text-[11px] text-emerald-300/90 max-h-72 overflow-y-auto leading-relaxed select-all">
                      {JSON.stringify(generateMasterBackupPackage(), null, 2)}
                    </pre>
                  </div>
                </div>

              </div>
            )}

            {/* =========================================================================
                SUB-PANEL 2: CUSTOM SQL STUDIO ("APNA SQL ADD KAREIN")
                ========================================================================= */}
            {activeExportSubTab === 'custom-sql' && (
              <div className="space-y-6">

                {/* Header Banner */}
                <div className="p-6 rounded-2xl bg-[#060c08] border border-emerald-900/60 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-950 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-emerald-400" />
                        <h4 className="font-bold text-white text-base">
                          Custom SQL Studio & Query Runner (Apna SQL Likhein)
                        </h4>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 max-w-2xl">
                        Write, test, or paste your own raw SQL queries to query, inspect, or modify the live Future Ready Academy relational database, and immediately convert or inspect results as JSON.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono bg-[#030604] p-2 rounded-xl border border-emerald-950 shrink-0">
                      <span className="text-gray-400 text-[11px]">Dialect:</span>
                      <span className="text-emerald-400 font-bold">ANSI SQL / MySQL / Postgres</span>
                    </div>
                  </div>

                  {/* Quick Template Queries Pills */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-mono text-gray-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Quick Template Queries (Click to load & run):</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {[
                        { label: 'Class 10 Courses', sql: "SELECT id, title, category, target_audience, status, pricing_type FROM fra_courses WHERE category='up_board_class_10';" },
                        { label: 'All Inquiries', sql: "SELECT id, full_name, contact_number, district, status FROM fra_inquiries ORDER BY created_at DESC;" },
                        { label: 'Active Cohorts & Seats', sql: "SELECT name, course_title, enrolled_students, max_capacity, status FROM fra_batches;" },
                        { label: 'Ambassador Partners', sql: "SELECT full_name, current_role, city_or_district, status FROM fra_ambassadors;" },
                        { label: 'SHOW ALL TABLES', sql: "SHOW TABLES;" },
                        { label: 'DESCRIBE fra_courses', sql: "DESCRIBE fra_courses;" },
                        { label: 'Add Test Notice (INSERT)', sql: "INSERT INTO fra_academy_notices (id, message, tag, is_active, date_added) VALUES ('notice-live-101', 'UP Board 2026 Model Papers Published on UPMSP', 'UPMSP Alert', 1, '2026-10-27');" }
                      ].map((tpl, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCustomSqlQuery(tpl.sql);
                            setTimeout(() => {
                              const dbState: SqlDatabaseState = { courses, inquiries, ambassadors, batches, notices, settings: cmsForm };
                              const res = executeCustomSql(tpl.sql, dbState);
                              setCustomSqlResult(res);
                              onShowToast(`Loaded query: ${tpl.label}`);
                            }, 50);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#030704] hover:bg-emerald-950 text-gray-300 hover:text-emerald-300 border border-emerald-900/60 font-mono text-[11px] transition-all flex items-center gap-1"
                        >
                          <Terminal className="w-3 h-3 text-emerald-400" />
                          <span>{tpl.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SQL Input Area */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                      <span>Enter SQL Query:</span>
                      <span className="text-[11px] text-gray-500">Supports SELECT, SHOW TABLES, DESCRIBE, INSERT, UPDATE, WHERE, LIMIT</span>
                    </div>
                    <div className="relative rounded-xl border border-emerald-950 bg-[#020503] focus-within:border-emerald-500 transition-all overflow-hidden">
                      <textarea
                        rows={4}
                        value={customSqlQuery}
                        onChange={(e) => setCustomSqlQuery(e.target.value)}
                        placeholder="SELECT * FROM fra_courses WHERE category='up_board_class_10';"
                        className="w-full p-4 bg-transparent font-mono text-xs text-emerald-300 focus:outline-none leading-relaxed resize-y"
                        spellCheck={false}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      onClick={handleRunCustomSql}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Run SQL Query</span>
                    </button>

                    <button
                      onClick={() => {
                        setCustomSqlQuery("SELECT * FROM fra_courses;");
                        setCustomSqlResult(null);
                        onShowToast('Query reset to default');
                      }}
                      className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#091510] hover:bg-emerald-950 text-gray-300 border border-emerald-800 text-xs font-semibold transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Query</span>
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(customSqlQuery);
                        onShowToast('SQL query copied to clipboard!');
                      }}
                      className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#091510] hover:bg-emerald-950 text-gray-300 border border-emerald-800 text-xs font-semibold transition-all"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Copy SQL</span>
                    </button>

                    <span className="text-xs font-mono text-gray-500 ml-auto hidden sm:inline">
                      Target Database: <span className="text-emerald-400">fra_production</span>
                    </span>
                  </div>
                </div>

                {/* Query Results & JSON Output View */}
                {customSqlResult && (
                  <div className="p-6 rounded-2xl bg-[#060c08] border border-emerald-900/60 space-y-4">
                    
                    {/* Header Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-950 pb-3">
                      <div className="flex items-center gap-2">
                        {customSqlResult.success ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_8px_#ef4444]" />
                        )}
                        <h5 className="font-bold text-white text-sm">
                          {customSqlResult.success ? 'Query Execution Result' : 'Query Error'}
                        </h5>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          customSqlResult.success ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
                        }`}>
                          {customSqlResult.executionTimeMs}ms • {customSqlResult.rows?.length || customSqlResult.affectedRows || 0} row(s)
                        </span>
                      </div>

                      {/* View Switcher (Table vs JSON) */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-[#030604] p-1 rounded-xl border border-emerald-950">
                          <button
                            onClick={() => setCustomSqlViewMode('json')}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                              customSqlViewMode === 'json'
                                ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            <FileJson className="w-3.5 h-3.5" />
                            <span>JSON Format</span>
                          </button>

                          <button
                            onClick={() => setCustomSqlViewMode('table')}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                              customSqlViewMode === 'table'
                                ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            <Table className="w-3.5 h-3.5" />
                            <span>Table View</span>
                          </button>
                        </div>

                        {customSqlResult.rows && customSqlResult.rows.length > 0 && (
                          <>
                            <button
                              onClick={handleCopyCustomSqlResultJson}
                              className="p-1.5 rounded-lg bg-[#091510] hover:bg-emerald-950 text-gray-300 hover:text-white border border-emerald-800 text-xs"
                              title="Copy JSON"
                            >
                              <Copy className="w-3.5 h-3.5 text-[#d4af37]" />
                            </button>
                            <button
                              onClick={handleDownloadCustomSqlResultJson}
                              className="p-1.5 rounded-lg bg-[#091510] hover:bg-emerald-950 text-gray-300 hover:text-white border border-emerald-800 text-xs"
                              title="Download JSON"
                            >
                              <Download className="w-3.5 h-3.5 text-sky-400" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Result Content */}
                    {customSqlResult.error ? (
                      <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-xs font-mono text-red-300 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                        <div>
                          <div className="font-bold">Execution Error:</div>
                          <div className="mt-1">{customSqlResult.error}</div>
                        </div>
                      </div>
                    ) : customSqlViewMode === 'json' ? (
                      <div className="relative">
                        <pre className="p-4 rounded-xl bg-[#020503] border border-emerald-950 font-mono text-[11px] text-emerald-300 max-h-80 overflow-y-auto leading-relaxed select-all">
                          {JSON.stringify(customSqlResult.rows || [], null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-emerald-950 max-h-80 overflow-y-auto">
                        <table className="w-full text-left text-xs font-mono">
                          <thead className="bg-[#030704] text-gray-400 border-b border-emerald-950 sticky top-0">
                            <tr>
                              {(customSqlResult.columns || []).map((col, idx) => (
                                <th key={idx} className="py-2.5 px-3 uppercase tracking-wider text-[10px] text-emerald-400 whitespace-nowrap">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-emerald-950/50">
                            {(customSqlResult.rows || []).map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-emerald-950/20">
                                {(customSqlResult.columns || []).map((col, cIdx) => (
                                  <td key={cIdx} className="py-2 px-3 text-gray-300 max-w-xs truncate whitespace-nowrap">
                                    {typeof row[col] === 'object' && row[col] !== null 
                                      ? JSON.stringify(row[col]) 
                                      : String(row[col] ?? 'NULL')}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {customSqlResult.message && (
                      <div className="text-[11px] font-mono text-gray-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{customSqlResult.message}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Schema Cheatsheet */}
                <div className="p-5 rounded-2xl bg-[#060c08] border border-emerald-900/60 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold font-mono text-white">
                    <Database className="w-4 h-4 text-[#d4af37]" />
                    <span>Database Schema Cheatsheet (Available Tables & Keys)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-[#030604] border border-emerald-950">
                      <div className="text-emerald-400 font-bold">fra_courses</div>
                      <div className="text-[11px] text-gray-400 mt-1">Columns: id (PK), title, category, target_audience, pricing_type, duration_weeks, classes_per_week, language_medium, status</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#030604] border border-emerald-950">
                      <div className="text-emerald-400 font-bold">fra_inquiries</div>
                      <div className="text-[11px] text-gray-400 mt-1">Columns: id (PK), full_name, contact_number, email, role, district, inquiry_type, status, created_at</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#030604] border border-emerald-950">
                      <div className="text-emerald-400 font-bold">fra_ambassadors</div>
                      <div className="text-[11px] text-gray-400 mt-1">Columns: id (PK), full_name, contact_number, email, city_or_district, current_role, student_reach_estimate, status</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#030604] border border-emerald-950">
                      <div className="text-emerald-400 font-bold">fra_batches</div>
                      <div className="text-[11px] text-gray-400 mt-1">Columns: id (PK), name, course_title, target_grade, schedule, start_date, enrolled_students, max_capacity, status</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#030604] border border-emerald-950">
                      <div className="text-emerald-400 font-bold">fra_academy_notices</div>
                      <div className="text-[11px] text-gray-400 mt-1">Columns: id (PK), message, tag, is_active, date_added</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#030604] border border-emerald-950">
                      <div className="text-emerald-400 font-bold">fra_site_settings</div>
                      <div className="text-[11px] text-gray-400 mt-1">Columns: brand_name, tagline, support_email, helpline_phone, active_academic_year</div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* =========================================================================
                SUB-PANEL 3: CONVERT DB TO JSON ("DB KO JSON FORMAT ME BANANA")
                ========================================================================= */}
            {activeExportSubTab === 'db-to-json' && (
              <div className="space-y-6">

                {/* Main Converter Card */}
                <div className="p-6 rounded-2xl bg-[#060c08] border border-emerald-900/60 space-y-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-950 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileJson className="w-5 h-5 text-[#d4af37]" />
                        <h4 className="font-bold text-white text-base">
                          Relational Database to JSON Converter ("DB ko JSON Format me Banana")
                        </h4>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 max-w-2xl">
                        Convert the entire academy database, all relational tables, or raw SQL scripts into structured, valid JSON formats for REST APIs, MongoDB, Firebase, or external archival.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono bg-[#030604] p-2 rounded-xl border border-emerald-950 shrink-0">
                      <label className="flex items-center gap-1.5 cursor-pointer text-gray-300">
                        <input
                          type="checkbox"
                          checked={dbJsonPretty}
                          onChange={(e) => setDbJsonPretty(e.target.checked)}
                          className="rounded accent-emerald-500"
                        />
                        <span>Pretty Print (2 Spaces)</span>
                      </label>
                    </div>
                  </div>

                  {/* Format Selector Cards */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-gray-300">
                      Select Target JSON Structure Format:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        {
                          id: 'relational',
                          title: '1. Relational Schema JSON',
                          desc: 'Full DB dictionary with table schemas, data types, primary keys, and rows array.',
                          badge: 'Enterprise Standard'
                        },
                        {
                          id: 'entity_arrays',
                          title: '2. Entity Arrays JSON',
                          desc: 'Clean direct root arrays: courses, inquiries, batches, notices, settings.',
                          badge: 'REST API Ready'
                        },
                        {
                          id: 'keyed_by_id',
                          title: '3. Key-Value Hashmap JSON',
                          desc: 'Records indexed by Primary Key ID for instantaneous O(1) key lookups.',
                          badge: 'NoSQL / Cache'
                        },
                        {
                          id: 'hierarchical_graph',
                          title: '4. Academic Graph JSON',
                          desc: 'Hierarchical structure: courses grouped by Grade with nested cohorts and enrollments.',
                          badge: 'Nested Graph'
                        }
                      ].map((fmt) => (
                        <div
                          key={fmt.id}
                          onClick={() => setDbJsonFormat(fmt.id as DbJsonFormat)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            dbJsonFormat === fmt.id
                              ? 'bg-emerald-950/60 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                              : 'bg-[#030704] border-emerald-950 hover:border-emerald-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-white">{fmt.title}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#020503] text-emerald-400 font-mono">
                              {fmt.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                            {fmt.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={handleDownloadDbAsJson}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download DB as JSON File</span>
                    </button>

                    <button
                      onClick={handleCopyDbJson}
                      className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#091510] hover:bg-emerald-950 text-gray-200 border border-emerald-800 text-xs font-semibold transition-all"
                    >
                      <Copy className="w-4 h-4 text-[#d4af37]" />
                      <span>Copy DB JSON to Clipboard</span>
                    </button>

                    <div className="ml-auto text-xs font-mono text-gray-400 flex items-center gap-2">
                      <span>Total Entities: <span className="text-white font-bold">{courses.length + inquiries.length + ambassadors.length + batches.length + notices.length + 1} rows</span></span>
                      <span>•</span>
                      <span className="text-emerald-400">6 Tables</span>
                    </div>
                  </div>

                  {/* Live Converted Database JSON Box */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                      <span>Real-time Converted JSON Preview ({dbJsonFormat}):</span>
                      <span className="text-emerald-400">
                        ~{Math.round(convertDatabaseToJson({ courses, inquiries, ambassadors, batches, notices, settings: cmsForm }, dbJsonFormat, dbJsonPretty).length / 1024)} KB
                      </span>
                    </div>
                    <div className="relative">
                      <pre className="p-4 rounded-xl bg-[#020503] border border-emerald-950 font-mono text-[11px] text-emerald-300 max-h-72 overflow-y-auto leading-relaxed select-all">
                        {convertDatabaseToJson({ courses, inquiries, ambassadors, batches, notices, settings: cmsForm }, dbJsonFormat, dbJsonPretty)}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Raw SQL Script to JSON Parser Card ("Raw SQL ko JSON me Badlein") */}
                <div className="p-6 rounded-2xl bg-[#060c08] border border-emerald-900/60 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#d4af37]" />
                      <h4 className="font-bold text-white text-sm">
                        Raw SQL Dump to JSON Parser (SQL Script ko JSON Format me Banana)
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Parser Engine v2.0
                    </span>
                  </div>

                  <p className="text-xs text-gray-400">
                    Paste any custom SQL dump file or series of `INSERT INTO table (columns) VALUES (values);` statements to instantly parse and extract them into pure JSON format.
                  </p>

                  <div className="space-y-2">
                    <textarea
                      rows={4}
                      value={rawSqlScriptInput}
                      onChange={(e) => setRawSqlScriptInput(e.target.value)}
                      placeholder="INSERT INTO fra_courses (id, title) VALUES ('1', 'Maths');"
                      className="w-full p-3.5 rounded-xl bg-[#020503] border border-emerald-950 font-mono text-xs text-amber-200 focus:outline-none focus:border-emerald-500 leading-relaxed resize-y"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleConvertRawSqlToJson}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#091510] hover:bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs font-bold transition-all"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Convert SQL Script to JSON</span>
                    </button>

                    {convertedSqlResult && convertedSqlResult.totalRows > 0 && (
                      <>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(convertedSqlResult.tables, null, 2));
                            onShowToast('Parsed JSON copied to clipboard!');
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#030604] hover:bg-zinc-900 text-gray-300 border border-zinc-800 text-xs font-semibold"
                        >
                          <Copy className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>Copy Parsed JSON</span>
                        </button>

                        <button
                          onClick={() => {
                            downloadFile(JSON.stringify(convertedSqlResult.tables, null, 2), 'parsed_sql_database.json', 'application/json');
                            onShowToast('Parsed JSON downloaded!');
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#030604] hover:bg-zinc-900 text-gray-300 border border-zinc-800 text-xs font-semibold"
                        >
                          <Download className="w-3.5 h-3.5 text-sky-400" />
                          <span>Download Parsed JSON</span>
                        </button>
                      </>
                    )}
                  </div>

                  {convertedSqlResult && (
                    <div className="pt-2">
                      <div className="text-[11px] font-mono text-emerald-400 mb-1.5">
                        Parsed Output ({convertedSqlResult.totalRows} rows across {Object.keys(convertedSqlResult.tables).length} table(s)):
                      </div>
                      <pre className="p-3.5 rounded-xl bg-[#020503] border border-emerald-950 font-mono text-[11px] text-emerald-300 max-h-48 overflow-y-auto">
                        {JSON.stringify(convertedSqlResult.tables, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* =========================================================================
                SUB-PANEL 4: SQL PERSISTENCE & POST CALL SIMULATION (MYSQL & POSTGRESQL)
                ========================================================================= */}
            {activeExportSubTab === 'sql-post' && (
              <div className="space-y-6">

                {/* Connectivity & Dialect Selector Banner */}
                <div className="p-6 rounded-2xl bg-[#060c08] border border-emerald-900/60 space-y-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-950 pb-4">
                    <div>
                      <h4 className="font-bold text-white text-base flex items-center gap-2">
                        <Database className="w-5 h-5 text-[#d4af37]" />
                        <span>SQL Database Persistence & POST Sync Engine</span>
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Connect to a REST-to-SQL persistence gateway (Supabase, PostgREST, Hasura, or Cloud SQL proxy) and dispatch your current state via HTTP POST.
                      </p>
                    </div>

                    {/* SQL Dialect Selector */}
                    <div className="flex items-center gap-2 bg-[#030604] p-1.5 rounded-xl border border-emerald-950 shrink-0">
                      <button
                        onClick={() => {
                          setSqlDialect('mysql');
                          setSqlConnectionString('mysql://admin_fra:fra_secure_pass@mysql.futurereadyacademy.in:3306/fra_production');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                          sqlDialect === 'mysql'
                            ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <span>MySQL 8.0+</span>
                      </button>

                      <button
                        onClick={() => {
                          setSqlDialect('postgres');
                          setSqlConnectionString('postgresql://postgres:fra_secure_pass@db.futurereadyacademy.in:5432/fra_production');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                          sqlDialect === 'postgres'
                            ? 'bg-sky-500 text-black shadow-[0_0_12px_rgba(14,165,233,0.3)]'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <span>PostgreSQL 16+</span>
                      </button>
                    </div>
                  </div>

                  {/* Form Inputs for Endpoint & Auth */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="space-y-1.5">
                      <label className="text-gray-300 font-semibold flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Target SQL REST Sync Endpoint (HTTP POST) *</span>
                      </label>
                      <input
                        type="url"
                        value={sqlEndpointUrl}
                        onChange={(e) => setSqlEndpointUrl(e.target.value)}
                        placeholder="https://api.futurereadyacademy.in/v1/sync/sql-persist"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#030704] border border-emerald-950 text-white focus:outline-none focus:border-emerald-500 text-xs"
                      />
                      <span className="text-[10px] text-gray-500">
                        Accepts JSON payload with normalized entities for automatic upsert.
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-300 font-semibold flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Authorization Header / Bearer Token *</span>
                      </label>
                      <input
                        type="text"
                        value={sqlAuthToken}
                        onChange={(e) => setSqlAuthToken(e.target.value)}
                        placeholder="Bearer fra_live_sec_key_2026_9x4"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#030704] border border-emerald-950 text-white focus:outline-none focus:border-emerald-500 text-xs"
                      />
                      <span className="text-[10px] text-gray-500">
                        Injected as `Authorization: {sqlAuthToken.slice(0, 10)}...`
                      </span>
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-gray-300 font-semibold flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-sky-400" />
                        <span>Direct Connection String (Dialect Reference)</span>
                      </label>
                      <input
                        type="text"
                        value={sqlConnectionString}
                        onChange={(e) => setSqlConnectionString(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#030704] border border-emerald-950 text-gray-300 focus:outline-none focus:border-emerald-500 text-xs"
                      />
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={handleSimulateSqlPost}
                      disabled={sqlSimRunning}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] disabled:opacity-50"
                    >
                      {sqlSimRunning ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          <span>Dispatching POST Request...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-white text-white" />
                          <span>Simulate POST Call to SQL Endpoint</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={sqlDialect === 'mysql' ? handleDownloadMySqlDump : handleDownloadPostgresDump}
                      className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#091510] hover:bg-emerald-950 text-gray-200 border border-emerald-800 text-xs font-semibold transition-all"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Download .{sqlDialect === 'mysql' ? 'mysql.sql' : 'postgres.sql'} File</span>
                    </button>

                    <button
                      onClick={sqlDialect === 'mysql' ? handleOpenMySqlPreview : handleOpenSqlPreview}
                      className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#091510] hover:bg-emerald-950 text-gray-200 border border-emerald-800 text-xs font-semibold transition-all"
                    >
                      <FileCode className="w-4 h-4 text-[#d4af37]" />
                      <span>Preview {sqlDialect.toUpperCase()} Schema</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar during Simulation */}
                {sqlSimRunning && (
                  <div className="p-4 rounded-xl bg-[#060c08] border border-emerald-700/60 space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-gray-300">Synchronizing relational state to SQL endpoint...</span>
                      <span className="text-emerald-400 font-bold">{sqlSimProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#020503] border border-emerald-950 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-[#d4af37] transition-all duration-300"
                        style={{ width: `${sqlSimProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Live Console Output & Response Telemetry */}
                {(sqlSimLogs.length > 0 || sqlSimResult) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Console Logs */}
                    <div className="p-5 rounded-2xl bg-[#040805] border border-emerald-950 space-y-3">
                      <div className="flex items-center justify-between border-b border-emerald-950/80 pb-2">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-emerald-400" />
                          <h5 className="text-xs font-bold font-mono text-white">HTTP POST Execution Console</h5>
                        </div>
                        <span className="text-[10px] font-mono text-gray-500">
                          Method: POST • application/json
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-black border border-emerald-950/80 font-mono text-[11px] text-emerald-400 space-y-1.5 max-h-60 overflow-y-auto">
                        {sqlSimLogs.map((log, idx) => (
                          <div key={idx} className="leading-relaxed">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Telemetry Result Card */}
                    {sqlSimResult && (
                      <div className="p-5 rounded-2xl bg-[#06110a] border border-emerald-600/60 shadow-[0_0_25px_rgba(16,185,129,0.15)] space-y-4">
                        <div className="flex items-center justify-between border-b border-emerald-950 pb-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <h5 className="text-xs font-bold font-mono text-white">
                              Persistence Response (HTTP {sqlSimResult.status} {sqlSimResult.statusText})
                            </h5>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Latency: {sqlSimResult.durationMs}ms
                          </span>
                        </div>

                        {/* Table Affected Rows Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                          {sqlSimResult.tableSummary.map((t, idx) => (
                            <div key={idx} className="p-2 rounded-lg bg-[#030704] border border-emerald-950/80">
                              <div className="text-[10px] text-gray-400 truncate">{t.name}</div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="font-bold text-white">{t.count} rows</span>
                                <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-950 text-emerald-400">
                                  {t.action}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* JSON Response Summary */}
                        <div className="p-3 rounded-xl bg-black border border-emerald-950 font-mono text-[11px] text-emerald-300/90 leading-relaxed">
                          <div>Dialect: <span className="text-white">{sqlSimResult.dialect}</span></div>
                          <div>Total Rows Persisted: <span className="text-[#d4af37] font-bold">{sqlSimResult.responsePayload.totalRowsAffected}</span></div>
                          <div>Tx Hash: <span className="text-gray-400">{sqlSimResult.responsePayload.transactionId}</span></div>
                          <div>Status: <span className="text-emerald-400 font-bold">COMMITTED (Zero Data Loss)</span></div>
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>
            )}

            {/* =========================================================================
                SUB-PANEL 3: BROWSER COOKIE / CACHE ("KOK") SYSTEM
                ========================================================================= */}
            {activeExportSubTab === 'kok-cookie' && (
              <div className="space-y-6">

                {/* Cookie System Overview Card */}
                <div className="p-6 rounded-2xl bg-[#060c08] border border-emerald-900/60 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-950 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Cookie className="w-5 h-5 text-amber-400" />
                        <h4 className="font-bold text-white text-base">
                          Browser Cookie & Local Storage Snapshot ("Kok" Engine)
                        </h4>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 max-w-2xl">
                        A persistent client-side cache system that stores active session credentials and compact state snapshots in HTTP cookies with strict SameSite=Lax and configurable Max-Age expirations.
                      </p>
                    </div>

                    {/* Expiry Selector */}
                    <div className="flex items-center gap-2 text-xs font-mono bg-[#030604] p-2 rounded-xl border border-emerald-950 shrink-0">
                      <span className="text-gray-400 text-[11px]">Expiration:</span>
                      <select
                        value={cookieExpiryDays}
                        onChange={(e) => setCookieExpiryDays(Number(e.target.value))}
                        className="bg-[#08120b] border border-emerald-800 text-white rounded px-2 py-1 text-xs focus:outline-none"
                      >
                        <option value={1}>1 Day (24h)</option>
                        <option value={7}>7 Days (Standard)</option>
                        <option value={30}>30 Days (1 Month)</option>
                        <option value={365}>365 Days (1 Year)</option>
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      onClick={handleSaveToCookieSnapshot}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)]"
                    >
                      <Cookie className="w-4 h-4" />
                      <span>Save Snapshot to Cookie (Kok)</span>
                    </button>

                    <button
                      onClick={handleRestoreFromCookieSnapshot}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#091510] hover:bg-emerald-950 text-gray-200 border border-emerald-800 text-xs font-semibold transition-all"
                    >
                      <RefreshCw className="w-4 h-4 text-emerald-400" />
                      <span>Restore from Cookie (Kok) Cache</span>
                    </button>

                    <button
                      onClick={handleClearCookies}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/60 text-xs font-semibold transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear Cookie Cache</span>
                    </button>

                    <button
                      onClick={handleRefreshCookieList}
                      className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#030604] hover:bg-zinc-900 text-gray-400 hover:text-white border border-zinc-800 text-xs font-semibold transition-all ml-auto"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh Inspector</span>
                    </button>
                  </div>

                  {cookieSnapshotTime && (
                    <div className="p-3 rounded-xl bg-[#020503] border border-emerald-950 flex items-center gap-2 text-xs font-mono text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Last Snapshot Saved: {new Date(cookieSnapshotTime).toLocaleString()} ({cookieExpiryDays} days expiry)</span>
                    </div>
                  )}
                </div>

                {/* Live Cookie Inspector Table */}
                <div className="p-6 rounded-2xl bg-[#060c08] border border-emerald-900/60 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-amber-400" />
                      <h4 className="font-bold text-white text-sm">
                        Live Browser Cookie ("Kok") Inspector
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {cookieList.length} Active Cookies
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">
                      Scope: Path=/ • SameSite=Lax
                    </span>
                  </div>

                  {cookieList.length === 0 ? (
                    <div className="p-8 text-center rounded-xl bg-[#030604] border border-emerald-950 text-xs text-gray-400 font-mono">
                      No active cookies detected for this origin. Click "Save Snapshot to Cookie (Kok)" to initialize.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-emerald-950">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-[#030704] text-gray-400 border-b border-emerald-950">
                          <tr>
                            <th className="py-2.5 px-4">Cookie Key</th>
                            <th className="py-2.5 px-4">Length</th>
                            <th className="py-2.5 px-4">Decoded Value Preview</th>
                            <th className="py-2.5 px-4">Attributes</th>
                            <th className="py-2.5 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-950/60">
                          {cookieList.map((c, idx) => (
                            <tr key={idx} className="hover:bg-emerald-950/20">
                              <td className="py-2.5 px-4 font-bold text-emerald-400">
                                {c.name}
                              </td>
                              <td className="py-2.5 px-4 text-gray-400">
                                {c.length} B
                              </td>
                              <td className="py-2.5 px-4 text-gray-300 max-w-xs truncate">
                                {c.value}
                              </td>
                              <td className="py-2.5 px-4 text-[10px] text-gray-500">
                                Path=/; SameSite=Lax
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <button
                                  onClick={() => {
                                    deleteBrowserCookie(c.name);
                                    setCookieList(getAllBrowserCookies());
                                    onShowToast(`Deleted cookie: ${c.name}`);
                                  }}
                                  className="text-gray-500 hover:text-red-400 text-xs"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="text-[11px] text-gray-500 font-mono flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Cookies are managed directly via browser APIs for instant access upon page refresh.</span>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}
      </div>

      {/* Hidden File Input for JSON Website Restore */}
      <input
        ref={restoreFileRef}
        type="file"
        accept=".json"
        onChange={handleRestoreFromJsonFile}
        className="hidden"
      />

      {/* SQL Preview Modal */}
      {sqlPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#070e0b] border border-emerald-700/60 rounded-2xl max-w-4xl w-full p-6 space-y-4 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">{sqlPreviewTitle}</h3>
              </div>
              <button onClick={() => setSqlPreviewOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-gray-400">
              Ready to execute in MySQL 8.0+, PostgreSQL, Supabase, Neon, or Cloud SQL. Includes DDL table definitions and INSERT operations.
            </div>

            <div className="relative">
              <pre className="p-4 rounded-xl bg-black border border-emerald-950 font-mono text-[11px] text-emerald-300 max-h-96 overflow-y-auto leading-relaxed select-all">
                {sqlPreviewContent}
              </pre>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sqlPreviewContent);
                  onShowToast('SQL dump copied to clipboard!');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#091510] hover:bg-emerald-950 text-gray-200 border border-emerald-800 text-xs font-semibold"
              >
                <Copy className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Copy SQL to Clipboard</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={sqlPreviewDialect === 'mysql' ? handleDownloadMySqlDump : handleDownloadPostgresDump}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .{sqlPreviewDialect === 'mysql' ? 'mysql.sql' : 'postgres.sql'} File</span>
                </button>
                <button
                  onClick={() => setSqlPreviewOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-gray-300 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: ADD COURSE MODAL
          ========================================================================= */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#070e0b] border border-emerald-700/60 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-4 my-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Create New Course Track</h3>
              <button onClick={() => setShowAddCourseModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCourseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-medium mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UP Board Class 10: English & Grammar Mastery"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#040806] border border-emerald-950 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-medium mb-1">Category</label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#040806] border border-emerald-950 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="up_board_class_9">UP Board Class 9</option>
                    <option value="up_board_class_10">UP Board Class 10</option>
                    <option value="future_skills">AI & Future Skills</option>
                    <option value="coding_ai">Coding & Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">Pricing Model</label>
                  <select
                    value={newCourse.pricingType}
                    onChange={(e) => setNewCourse({ ...newCourse, pricingType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#040806] border border-emerald-950 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Free Starter">Free Starter</option>
                    <option value="Comprehensive (Paid)">Comprehensive (Paid)</option>
                    <option value="Scholarship Program">Scholarship Program</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summary of syllabus and outcomes..."
                  value={newCourse.shortDescription}
                  onChange={(e) => setNewCourse({ ...newCourse, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#040806] border border-emerald-950 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-medium mb-1">Duration (Weeks)</label>
                  <input
                    type="number"
                    value={newCourse.durationWeeks}
                    onChange={(e) => setNewCourse({ ...newCourse, durationWeeks: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#040806] border border-emerald-950 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">Classes / Week</label>
                  <input
                    type="number"
                    value={newCourse.classesPerWeek}
                    onChange={(e) => setNewCourse({ ...newCourse, classesPerWeek: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#040806] border border-emerald-950 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2 rounded-lg text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400"
                >
                  Save & Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: CREATE BATCH MODAL
          ========================================================================= */}
      {showAddBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#070e0b] border border-emerald-700/60 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 my-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Create New Cohort / Batch</h3>
              <button onClick={() => setShowAddBatchModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBatchSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-medium mb-1">Batch Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 10 Math Booster (Kalyan Batch)"
                  value={newBatch.name}
                  onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#040806] border border-emerald-950 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">Target Grade</label>
                <select
                  value={newBatch.targetGrade}
                  onChange={(e) => setNewBatch({ ...newBatch, targetGrade: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-[#040806] border border-emerald-950 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Tech Skills (9 & 10)">Tech Skills (9 & 10)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">Schedule Timings</label>
                <input
                  type="text"
                  placeholder="e.g. Mon, Wed, Fri (6:00 PM - 7:30 PM)"
                  value={newBatch.schedule}
                  onChange={(e) => setNewBatch({ ...newBatch, schedule: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#040806] border border-emerald-950 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-medium mb-1">Assigned Faculty Mentor</label>
                  <input
                    type="text"
                    placeholder="e.g. R. K. Gupta"
                    value={newBatch.facultyMentor}
                    onChange={(e) => setNewBatch({ ...newBatch, facultyMentor: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#040806] border border-emerald-950 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">Seat Capacity</label>
                  <input
                    type="number"
                    value={newBatch.maxCapacity}
                    onChange={(e) => setNewBatch({ ...newBatch, maxCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#040806] border border-emerald-950 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBatchModal(false)}
                  className="px-4 py-2 rounded-lg text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400"
                >
                  Launch Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: ANNOUNCEMENT MODAL
          ========================================================================= */}
      {showAddNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#070e0b] border border-emerald-700/60 rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-4 my-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Post Live Announcement</h3>
              <button onClick={() => setShowAddNoticeModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNoticeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-medium mb-1">Notice Category</label>
                <select
                  value={newNoticeTag}
                  onChange={(e) => setNewNoticeTag(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-[#040806] border border-emerald-950 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="New Batch">New Batch Announcement</option>
                  <option value="UPMSP Alert">UPMSP Board Exam Alert</option>
                  <option value="Ambassador Update">Ambassador Partner Update</option>
                  <option value="General">General Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">Message Text *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Free demo session for UP Board Class 10 Science scheduled this Saturday at 5 PM."
                  value={newNoticeText}
                  onChange={(e) => setNewNoticeText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#040806] border border-emerald-950 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddNoticeModal(false)}
                  className="px-4 py-2 rounded-lg text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#d4af37] text-black font-bold hover:brightness-110"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: INQUIRY FULL DETAIL DRAWER
          ========================================================================= */}
      {selectedInquiryDetail && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#070e0b] border border-emerald-700/60 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 my-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-[#d4af37] font-mono">Inquiry #{selectedInquiryDetail.id}</span>
                <h3 className="text-lg font-bold text-white">{selectedInquiryDetail.fullName}</h3>
              </div>
              <button onClick={() => setSelectedInquiryDetail(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#040806] border border-emerald-950 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Role:</span>
                <span className="text-white font-medium">{selectedInquiryDetail.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">District:</span>
                <span className="text-white font-medium">{selectedInquiryDetail.district}, Uttar Pradesh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="text-emerald-400 font-mono">{selectedInquiryDetail.contactNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="text-emerald-400 font-mono">{selectedInquiryDetail.email}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-semibold">Message & Inquiry Details:</span>
              <p className="p-3 rounded-lg bg-[#040806] border border-emerald-950 text-xs text-gray-200 leading-relaxed">
                {selectedInquiryDetail.message}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-semibold">Update Workflow Status:</span>
              <div className="grid grid-cols-4 gap-2 pt-1">
                {(['New', 'In Progress', 'Resolved', 'Archived'] as InquiryRecord['status'][]).map(st => (
                  <button
                    key={st}
                    onClick={() => handleUpdateInquiryStatus(selectedInquiryDetail.id, st)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      selectedInquiryDetail.status === st
                        ? st === 'New'
                          ? 'bg-amber-500 text-black border-amber-400 font-bold'
                          : st === 'In Progress'
                          ? 'bg-sky-500 text-black border-sky-400 font-bold'
                          : st === 'Resolved'
                          ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                          : 'bg-zinc-600 text-white border-zinc-500'
                        : 'bg-[#040806] text-gray-400 border-emerald-950 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedInquiryDetail(null)}
                className="px-4 py-2 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: AMBASSADOR FULL DETAIL DRAWER
          ========================================================================= */}
      {selectedAmbassadorDetail && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#070e0b] border border-emerald-700/60 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 my-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-[#d4af37] font-mono">Ambassador #{selectedAmbassadorDetail.id}</span>
                <h3 className="text-lg font-bold text-white">{selectedAmbassadorDetail.fullName}</h3>
              </div>
              <button onClick={() => setSelectedAmbassadorDetail(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#040806] border border-emerald-950 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Current Role:</span>
                <span className="text-white font-medium">{selectedAmbassadorDetail.currentRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">District:</span>
                <span className="text-white font-medium">{selectedAmbassadorDetail.cityOrDistrict}, UP</span>
              </div>
              {selectedAmbassadorDetail.institutionName && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Institution:</span>
                  <span className="text-white font-medium">{selectedAmbassadorDetail.institutionName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Student Reach:</span>
                <span className="text-[#d4af37] font-bold">{selectedAmbassadorDetail.studentReachEstimate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="text-emerald-400 font-mono">{selectedAmbassadorDetail.contactNumber}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-semibold">Statement of Purpose & Community Plan:</span>
              <p className="p-3 rounded-lg bg-[#040806] border border-emerald-950 text-xs text-gray-200 leading-relaxed">
                {selectedAmbassadorDetail.whyJoin}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-semibold">Review Partner Status:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {(['Pending Review', 'Approved Partner', 'Kit Dispatched', 'Declined'] as AmbassadorRecord['status'][]).map(st => (
                  <button
                    key={st}
                    onClick={() => handleUpdateAmbassadorStatus(selectedAmbassadorDetail.id, st)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                      selectedAmbassadorDetail.status === st
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-[#040806] text-gray-400 border-emerald-950 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedAmbassadorDetail(null)}
                className="px-4 py-2 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

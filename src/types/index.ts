export type PageRoute = 'home' | 'courses' | 'about' | 'faq' | 'ambassador' | 'contact' | 'admin' | 'student' | 'teacher';

export type UserRole = 'admin' | 'student' | 'teacher' | 'ambassador' | 'guest';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  rollNumber?: string;
  grade?: 'Class 9' | 'Class 10';
  board?: 'UP Board (UPMSP)';
  medium?: 'Hindi & English (Bilingual)' | 'Hindi Medium' | 'English Medium';
  district?: string;
  enrolledCourseIds?: string[];
  avatarUrl?: string;
  joinedDate: string;
  attendancePct?: number;
  batchName?: string;
  permissions?: string[];
  // Teacher specific fields
  subject?: string;
  designation?: string;
  assignedBatches?: string[];
}

export type CourseCategory = 'up_board_class_9' | 'up_board_class_10' | 'future_skills' | 'coding_ai';

export interface StudentUser {
  id: string;
  fullName: string;
  rollNumber: string;
  email: string;
  grade: 'Class 9' | 'Class 10';
  board: 'UP Board (UPMSP)';
  medium: 'Hindi & English (Bilingual)' | 'Hindi Medium' | 'English Medium';
  district: string;
  enrolledCourseIds: string[];
  avatarUrl?: string;
  joinedDate: string;
  attendancePct: number;
  batchName: string;
  parentContact?: string;
  status?: 'Active' | 'On Leave' | 'Graduated';
}

export interface TeacherUser {
  id: string;
  fullName: string;
  email: string;
  role: 'teacher';
  subject: string;
  designation: string;
  qualification: string;
  experienceYears: number;
  phone: string;
  district: string;
  assignedBatches: string[];
  avatarUrl?: string;
  joinedDate: string;
  totalStudents: number;
  rating: number;
  status: 'Active' | 'On Leave' | 'Visiting';
  bio?: string;
}

export interface AcademyPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: 'Admin' | 'Teacher';
  authorDesignation?: string;
  authorAvatar?: string;
  category: 'Announcement' | 'Study Material' | 'Exam Alert' | 'Live Class Update' | 'Motivation & Tips';
  targetAudience: 'All Students' | 'Class 10' | 'Class 9' | 'Coding & Tech';
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  pinned: boolean;
  likesCount: number;
  commentsCount: number;
  attachments?: {
    name: string;
    url?: string;
    size?: string;
    type: 'pdf' | 'link' | 'image';
  }[];
}

export interface StudentTopicProgress {
  topicKey: string;
  courseId: string;
  topicTitle: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  courseId: string;
  subject: 'Ganit (Mathematics)' | 'Vigyan (Science)' | 'English' | 'Social Science' | 'Python & AI' | 'Web Development';
  category: 'PDF Study Notes' | 'Formula Sheet' | 'UPMSP Model Paper' | 'Video Lecture' | 'Practice Worksheet';
  targetGrade: 'Class 9' | 'Class 10' | 'Both 9 & 10';
  fileSize: string;
  pagesOrDuration: string;
  updatedDate: string;
  description: string;
  highlights: string[];
  isHighWeightage?: boolean;
}

export interface StudentTestRecord {
  id: string;
  title: string;
  subject: string;
  totalMarks: number;
  scoredMarks?: number;
  date: string;
  status: 'Upcoming' | 'Evaluated' | 'Missed';
  rank?: string;
  solutionKeyAvailable: boolean;
}

export interface Course {
  id: string;
  title: string;
  targetAudience: string;
  category: CourseCategory;
  shortDescription: string;
  longDescription: string;
  pricingType: 'Free Starter' | 'Comprehensive (Paid)' | 'Scholarship Program';
  durationWeeks: number;
  classesPerWeek: number;
  languageMedium: 'Hindi & English (Bilingual)' | 'English & Hindi';
  syllabusHighlights: string[];
  modules: {
    title: string;
    topics: string[];
  }[];
  keySkillsGained: string[];
  status: 'Enrollment Open' | 'Upcoming Batch';
  batchStartDate?: string;
}

export interface FAQItem {
  id: string;
  category: 'Academics & Board Prep' | 'Future Skills & AI' | 'Ambassador Program' | 'Platform & Classes';
  question: string;
  answer: string;
}

export interface ContactFormData {
  fullName: string;
  contactNumber: string;
  email: string;
  role: 'Student (Class 9)' | 'Student (Class 10)' | 'Parent / Guardian' | 'School Teacher / Educator' | 'Prospective Ambassador Partner';
  district: string;
  inquiryType: 'Course Admissions' | 'Ambassador Partnership' | 'Curriculum Guidance' | 'Technical Support' | 'General Inquiry';
  message: string;
}

export interface InquiryRecord extends ContactFormData {
  id: string;
  createdAt: string;
  status: 'New' | 'In Progress' | 'Resolved' | 'Contacted' | 'Enrolled' | 'Archived';
  internalNotes?: string;
}

export interface AmbassadorApplicationData {
  fullName: string;
  contactNumber: string;
  email: string;
  cityOrDistrict: string;
  currentRole: 'School Teacher' | 'Coaching Tutor' | 'College Student / Mentor' | 'Community Organizer' | 'Parent Advocate';
  institutionName?: string;
  studentReachEstimate: string;
  whyJoin: string;
}

export interface AmbassadorRecord extends AmbassadorApplicationData {
  id: string;
  createdAt: string;
  status: 'Pending Review' | 'Approved Partner' | 'Kit Dispatched' | 'Declined';
  internalNotes?: string;
}

export interface BatchRecord {
  id: string;
  name: string;
  courseTitle: string;
  targetGrade: 'Class 9' | 'Class 10' | 'Tech Skills (9 & 10)';
  schedule: string;
  startDate: string;
  facultyMentor: string;
  enrolledStudents: number;
  maxCapacity: number;
  status: 'Admissions Open' | 'Ongoing' | 'Upcoming';
}

export interface AcademyNotice {
  id: string;
  message: string;
  tag: 'UPMSP Alert' | 'New Batch' | 'Ambassador Update' | 'General';
  isActive: boolean;
  dateAdded: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  supportEmail: string;
  helplinePhone: string;
  academyLocation: string;
  counselingHours: string;
  activeAcademicYear: string;
}

export interface FTPBackupConfig {
  host: string;
  port: number;
  protocol: 'FTP' | 'FTPS' | 'SFTP';
  username: string;
  remotePath: string;
  autoBackupSchedule: 'Disabled' | 'Daily (Midnight)' | 'Weekly (Sunday)';
  lastBackupTime: string;
  lastBackupStatus: 'Success' | 'Failed' | 'Never Run';
  lastLog?: string;
}

export interface MasterBackupPackage {
  version: string;
  exportedAt: string;
  academy: string;
  courses: Course[];
  inquiries: InquiryRecord[];
  ambassadors: AmbassadorRecord[];
  batches: BatchRecord[];
  notices: AcademyNotice[];
  settings: SiteSettings;
  ftpConfig: FTPBackupConfig;
  students?: StudentUser[];
  teachers?: TeacherUser[];
  posts?: AcademyPost[];
}

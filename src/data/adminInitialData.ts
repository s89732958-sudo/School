import { InquiryRecord, AmbassadorRecord, BatchRecord, AcademyNotice } from '../types';

export const INITIAL_INQUIRIES: InquiryRecord[] = [
  {
    id: 'inq-101',
    fullName: 'Pooja Verma',
    contactNumber: '+91 94520 18239',
    email: 'pooja.verma2026@gmail.com',
    role: 'Student (Class 10)',
    district: 'Lucknow',
    inquiryType: 'Course Admissions',
    message: 'Seeking admission for UP Board Class 10 Science & Math prep. Need help with Physics numericals and Chemistry balancing equations.',
    createdAt: '2026-10-25 14:30',
    status: 'New',
    internalNotes: 'Prefers evening bilingual batch.'
  },
  {
    id: 'inq-102',
    fullName: 'Rajesh Mishra',
    contactNumber: '+91 98391 44521',
    email: 'mishra.rajesh.up@gmail.com',
    role: 'Parent / Guardian',
    district: 'Varanasi',
    inquiryType: 'Curriculum Guidance',
    message: 'My son is in Class 9 UP Board. Can he study AI Prompt Engineering simultaneously without affecting his school exams?',
    createdAt: '2026-10-24 18:10',
    status: 'In Progress',
    internalNotes: 'Counselor explained weekend 2-hour schedule. Follow-up scheduled.'
  },
  {
    id: 'inq-103',
    fullName: 'Mohd. Tariq',
    contactNumber: '+91 87659 12304',
    email: 'tariq.m9@gmail.com',
    role: 'Student (Class 9)',
    district: 'Kanpur',
    inquiryType: 'Course Admissions',
    message: 'Interested in the HTML & JavaScript Web Development track. Do I need a laptop or will an Android phone work?',
    createdAt: '2026-10-23 11:45',
    status: 'Resolved',
    internalNotes: 'Resolved - Student enrolled in Junior Web Track Batch Alpha.'
  },
  {
    id: 'inq-104',
    fullName: 'Sunita Devi',
    contactNumber: '+91 91204 88392',
    email: 'sunita.devi.edu@gmail.com',
    role: 'School Teacher / Educator',
    district: 'Prayagraj',
    inquiryType: 'Ambassador Partnership',
    message: 'Secondary school science teacher wanting to organize an AI awareness demo for 80 students in our school hall.',
    createdAt: '2026-10-22 09:20',
    status: 'In Progress',
    internalNotes: 'Principal meeting tentatively scheduled for next week.'
  }
];

export const INITIAL_AMBASSADORS: AmbassadorRecord[] = [
  {
    id: 'amb-201',
    fullName: 'Anil Kumar Sharma',
    contactNumber: '+91 94150 99823',
    email: 'anil.sharma.tutor@gmail.com',
    cityOrDistrict: 'Varanasi',
    currentRole: 'Coaching Tutor',
    institutionName: 'Sharma Mathematics Circle',
    studentReachEstimate: '50-150 Students',
    whyJoin: 'I have been preparing UP Board students for 7 years. Many students want to learn computer coding and AI but coaching is unavailable in our town.',
    createdAt: '2026-10-24 16:40',
    status: 'Pending Review',
    internalNotes: 'Strong localized credibility in Rohaniya block.'
  },
  {
    id: 'amb-202',
    fullName: 'Dr. Vivek Pandey',
    contactNumber: '+91 97920 33419',
    email: 'dr.v.pandey@gmail.com',
    cityOrDistrict: 'Gorakhpur',
    currentRole: 'School Teacher',
    institutionName: 'Saraswati Vidya Mandir Inter College',
    studentReachEstimate: '150+ Students (Institute / School)',
    whyJoin: 'We want to modernize our secondary school wing with future-ready digital tracks alongside standard UPMSP curricula.',
    createdAt: '2026-10-22 13:15',
    status: 'Approved Partner',
    internalNotes: 'Partner credentials and initial briefing call completed.'
  },
  {
    id: 'amb-203',
    fullName: 'Neha Srivastava',
    contactNumber: '+91 80045 67123',
    email: 'neha.srivastava.tech@gmail.com',
    cityOrDistrict: 'Lucknow',
    currentRole: 'College Student / Mentor',
    institutionName: 'Lucknow University (Computer Science Dept)',
    studentReachEstimate: '25-50 Students',
    whyJoin: 'Passionate about mentoring young UP students in Python, web design, and digital literacy.',
    createdAt: '2026-10-20 19:30',
    status: 'Kit Dispatched',
    internalNotes: 'Ambassador starter toolkit dispatched via courier.'
  }
];

export const INITIAL_BATCHES: BatchRecord[] = [
  {
    id: 'batch-c10-alpha',
    name: 'Class 10 Board Accelerator (Pragati Batch)',
    courseTitle: 'UP Board Class 10: High-Scorer Board Accelerator',
    targetGrade: 'Class 10',
    schedule: 'Mon, Wed, Fri (5:30 PM - 7:00 PM)',
    startDate: '2026-11-02',
    facultyMentor: 'Er. R. K. Gupta (Ex-Board Evaluator)',
    enrolledStudents: 38,
    maxCapacity: 45,
    status: 'Admissions Open'
  },
  {
    id: 'batch-c9-shikhar',
    name: 'Class 9 Foundation Track (Shikhar Batch)',
    courseTitle: 'UP Board Class 9: Science & Mathematics Foundation',
    targetGrade: 'Class 9',
    schedule: 'Tue, Thu, Sat (5:00 PM - 6:30 PM)',
    startDate: '2026-11-04',
    facultyMentor: 'S. N. Tripathi (M.Sc. Mathematics)',
    enrolledStudents: 29,
    maxCapacity: 40,
    status: 'Admissions Open'
  },
  {
    id: 'batch-ai-weekend-01',
    name: 'Weekend AI & Prompting Club (Batch 01)',
    courseTitle: 'Practical AI & Prompt Engineering for Young Minds',
    targetGrade: 'Tech Skills (9 & 10)',
    schedule: 'Saturday & Sunday (11:00 AM - 12:30 PM)',
    startDate: '2026-11-07',
    facultyMentor: 'Aman Srivastava (AI Engineer & Mentor)',
    enrolledStudents: 40,
    maxCapacity: 40,
    status: 'Ongoing'
  },
  {
    id: 'batch-web-dev-02',
    name: 'Junior Web Developers (Batch 02)',
    courseTitle: 'Modern Web Development: HTML, CSS & JavaScript',
    targetGrade: 'Tech Skills (9 & 10)',
    schedule: 'Tue, Fri, Sun (6:00 PM - 7:30 PM)',
    startDate: '2026-11-15',
    facultyMentor: 'Priyanka Yadav (Full Stack Architect)',
    enrolledStudents: 14,
    maxCapacity: 35,
    status: 'Upcoming'
  }
];

export const INITIAL_NOTICES: AcademyNotice[] = [
  {
    id: 'notice-1',
    message: 'UPMSP Class 10 Model Papers 2026 uploaded to student resource drive.',
    tag: 'UPMSP Alert',
    isActive: true,
    dateAdded: '2026-10-24'
  },
  {
    id: 'notice-2',
    message: 'Registration for Weekend AI Prompting Cohort closing this Sunday.',
    tag: 'New Batch',
    isActive: true,
    dateAdded: '2026-10-25'
  },
  {
    id: 'notice-3',
    message: 'Ambassador Partner kits dispatched to Prayagraj and Varanasi coordinators.',
    tag: 'Ambassador Update',
    isActive: true,
    dateAdded: '2026-10-23'
  }
];

export const DEFAULT_SITE_SETTINGS = {
  brandName: 'FUTURE READY ACADEMY',
  tagline: 'Learn Together, Grow Together.',
  heroHeadline: 'UP Board Excellence + Future Tech Mastery for Class 9 & 10',
  heroSubheadline: 'Empowering Uttar Pradesh students with top-tier academic coaching and future-ready skills in AI, coding, web & app development, and digital technology.',
  supportEmail: 'support@futurereadyacademy.in',
  helplinePhone: '+91 98765 43210',
  academyLocation: 'Lucknow & Prayagraj Academic Centers, Uttar Pradesh, India',
  counselingHours: 'Mon - Sat: 9:00 AM - 8:00 PM IST',
  activeAcademicYear: '2026 - 2027'
};

export const DEFAULT_FTP_CONFIG = {
  host: 'ftp.futurereadyacademy.in',
  port: 21,
  protocol: 'SFTP' as const,
  username: 'fra_backup_admin',
  remotePath: '/var/backups/futurereadyacademy/snapshots/',
  autoBackupSchedule: 'Daily (Midnight)' as const,
  lastBackupTime: 'Never Run',
  lastBackupStatus: 'Never Run' as const,
  lastLog: 'FTP connection profile initialized. Ready for scheduled synchronization.'
};

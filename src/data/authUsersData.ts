import { AuthUser } from '../types';

export const PRESET_AUTH_USERS: AuthUser[] = [
  {
    id: 'usr-admin-01',
    fullName: 'FRA Central Administration',
    email: 'admin@futureready.edu',
    role: 'admin',
    joinedDate: 'Jan 01, 2025',
    permissions: ['SYSTEM_SUPERADMIN', 'MANAGE_ACADEMY', 'MANAGE_STUDENTS', 'MANAGE_TEACHERS', 'MANAGE_POSTS', 'MANAGE_COURSES', 'MANAGE_DATA_EXPORT', 'BROADCAST_NOTICES']
  },
  {
    id: 'tch-001',
    fullName: 'Er. Vikram Singh',
    email: 'vikram.singh@fra-faculty.edu',
    role: 'teacher',
    subject: 'Physics & Science (UPMSP)',
    designation: 'Senior Faculty & Academic Dean',
    district: 'Prayagraj (Allahabad), UP',
    assignedBatches: ['Arjun-10 Super 30', 'Pratham-9 Alpha'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    joinedDate: 'Jan 15, 2024',
    permissions: ['PUBLISH_POSTS', 'UPLOAD_MATERIALS', 'VIEW_STUDENT_ROSTER', 'SCHEDULE_CLASSES']
  },
  {
    id: 'tch-002',
    fullName: 'Prof. Sunita Devi',
    email: 'sunita.devi@fra-faculty.edu',
    role: 'teacher',
    subject: 'Ganit (Mathematics)',
    designation: 'Head of Mathematics Department',
    district: 'Varanasi, UP',
    assignedBatches: ['Arjun-10 Super 30', 'Pratham-9 Alpha'],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
    joinedDate: 'Mar 01, 2024',
    permissions: ['PUBLISH_POSTS', 'UPLOAD_MATERIALS', 'VIEW_STUDENT_ROSTER', 'SCHEDULE_CLASSES']
  },
  {
    id: 'usr-std-10-042',
    fullName: 'Aryan Sharma',
    email: 'aryan.sharma26@fra-student.in',
    rollNumber: 'FRA-2026-X042',
    role: 'student',
    grade: 'Class 10',
    board: 'UP Board (UPMSP)',
    medium: 'Hindi & English (Bilingual)',
    district: 'Prayagraj (Allahabad), UP',
    enrolledCourseIds: [
      'up-class-10-board-accelerator',
      'ai-prompt-engineering-foundations'
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=80',
    joinedDate: 'July 15, 2025',
    attendancePct: 94.5,
    batchName: 'Arjun-10 Super 30 (UPMSP High Scorer)'
  },
  {
    id: 'usr-std-09-019',
    fullName: 'Priya Verma',
    email: 'priya.verma26@fra-student.in',
    rollNumber: 'FRA-2026-IX019',
    role: 'student',
    grade: 'Class 9',
    board: 'UP Board (UPMSP)',
    medium: 'Hindi & English (Bilingual)',
    district: 'Lucknow, UP',
    enrolledCourseIds: [
      'up-class-9-math-science',
      'web-development-bootcamp'
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
    joinedDate: 'August 02, 2025',
    attendancePct: 98.0,
    batchName: 'Pratham-9 Alpha Foundation'
  },
  {
    id: 'usr-amb-007',
    fullName: 'Dr. Rajesh Kumar (Senior Educator)',
    email: 'rajesh.kumar@educator.in',
    role: 'ambassador',
    district: 'Varanasi, UP',
    joinedDate: 'May 10, 2025',
    permissions: ['VIEW_AMBASSADOR_KIT', 'SUBMIT_REFERRALS']
  }
];

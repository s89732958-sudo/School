import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'academy-database.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initial Seed Data
const DEFAULT_STUDENTS = [
  {
    id: 'std-10-042',
    fullName: 'Aryan Sharma',
    rollNumber: 'FRA-2026-X042',
    email: 'aryan.sharma26@fra-student.in',
    grade: 'Class 10',
    board: 'UP Board (UPMSP)',
    medium: 'Hindi & English (Bilingual)',
    district: 'Prayagraj (Allahabad), UP',
    enrolledCourseIds: ['up-class-10-board-accelerator', 'ai-prompt-engineering-foundations'],
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=80',
    joinedDate: 'July 15, 2025',
    attendancePct: 94.5,
    batchName: 'Arjun-10 Super 30 (UPMSP High Scorer)',
    status: 'Active'
  },
  {
    id: 'std-09-019',
    fullName: 'Priya Verma',
    rollNumber: 'FRA-2026-IX019',
    email: 'priya.verma26@fra-student.in',
    grade: 'Class 9',
    board: 'UP Board (UPMSP)',
    medium: 'Hindi & English (Bilingual)',
    district: 'Lucknow, UP',
    enrolledCourseIds: ['up-class-9-math-science', 'web-development-bootcamp'],
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
    joinedDate: 'August 02, 2025',
    attendancePct: 98.0,
    batchName: 'Pratham-9 Alpha Foundation',
    status: 'Active'
  }
];

const DEFAULT_TEACHERS = [
  {
    id: 'tch-001',
    fullName: 'Er. Vikram Singh',
    email: 'vikram.singh@fra-faculty.edu',
    role: 'teacher',
    subject: 'Physics & Science (UPMSP)',
    designation: 'Senior Faculty & Academic Dean',
    qualification: 'M.Tech (IIT Kanpur), B.Tech Mechanical',
    experienceYears: 12,
    phone: '+91 94150 82910',
    district: 'Prayagraj (Allahabad), UP',
    assignedBatches: ['Arjun-10 Super 30', 'Pratham-9 Alpha'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    joinedDate: 'Jan 15, 2024',
    totalStudents: 148,
    rating: 4.9,
    status: 'Active',
    bio: 'Specialist in UPMSP Class 10 Science numericals, ray optics, and circuit theories.'
  },
  {
    id: 'tch-002',
    fullName: 'Prof. Sunita Devi',
    email: 'sunita.devi@fra-faculty.edu',
    role: 'teacher',
    subject: 'Ganit (Mathematics)',
    designation: 'Head of Mathematics Department',
    qualification: 'M.Sc. Mathematics (Gold Medalist, AU), B.Ed',
    experienceYears: 15,
    phone: '+91 98391 44521',
    district: 'Varanasi, UP',
    assignedBatches: ['Arjun-10 Super 30', 'Pratham-9 Alpha'],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    joinedDate: 'Mar 01, 2024',
    totalStudents: 162,
    rating: 4.95,
    status: 'Active',
    bio: 'Former UPMSP Board examination paper evaluator. Special expertise in Trigonometry and Geometry theorems.'
  },
  {
    id: 'tch-003',
    fullName: 'Dr. Alok Verma',
    email: 'alok.verma@fra-faculty.edu',
    role: 'teacher',
    subject: 'Artificial Intelligence & Python Coding',
    designation: 'Director of Future Technologies Lab',
    qualification: 'Ph.D. Computer Science, M.S. Data Science',
    experienceYears: 8,
    phone: '+91 91200 55678',
    district: 'Lucknow, UP',
    assignedBatches: ['Tech Pioneers AI Lab (Weekend)'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    joinedDate: 'Jul 10, 2024',
    totalStudents: 95,
    rating: 4.88,
    status: 'Active',
    bio: 'Pioneering AI literacy and hands-on Python logic for secondary school students across Uttar Pradesh.'
  },
  {
    id: 'tch-004',
    fullName: 'Anjali Tiwari',
    email: 'anjali.tiwari@fra-faculty.edu',
    role: 'teacher',
    subject: 'English & Communication Skills',
    designation: 'Faculty for English Language & Literature',
    qualification: 'M.A. English Literature (BHU), CELTA Certified',
    experienceYears: 9,
    phone: '+91 97920 11234',
    district: 'Gorakhpur, UP',
    assignedBatches: ['Arjun-10 Super 30', 'Pratham-9 Alpha'],
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    joinedDate: 'Aug 20, 2024',
    totalStudents: 130,
    rating: 4.85,
    status: 'Active',
    bio: 'Dedicated to empowering UP Board Hindi-medium students to master fluent English grammar and board translation.'
  }
];

const DEFAULT_POSTS = [
  {
    id: 'post-001',
    title: '📢 UPMSP 2026 Official Blueprint & OMR Pattern Alert (Class 9 & 10)',
    content: 'All students and faculty members are advised to note the official UPMSP 2026 examination guidelines: 20 marks will be strictly evaluated on OMR sheets (Section A - MCQs), and 50 marks will be evaluated through descriptive answers. Do not use gel pens on the OMR sheet; only blue/black ballpoint pens are authorized.',
    authorId: 'usr-admin-01',
    authorName: 'FRA Central Administration',
    authorRole: 'Admin',
    authorDesignation: 'Director of Academic Affairs',
    category: 'Exam Alert',
    targetAudience: 'All Students',
    tags: ['UPMSP 2026', 'OMR Sheet Rules', 'Board Guidelines', 'Class 9 & 10'],
    createdAt: '2026-10-24 10:30',
    pinned: true,
    likesCount: 84,
    commentsCount: 16
  },
  {
    id: 'post-002',
    title: '⚡ Class 10 Science: Ray Optics & Lens Sign Convention Trick',
    content: 'Namaste students! Many of you experienced difficulty with positive and negative focal lengths in the recent mock test. Remember the "New Cartesian Sign Convention" rule: all distances in front of mirror/lens in the direction opposite to incident light are NEGATIVE (-u). Convex mirror focal length is ALWAYS POSITIVE (+f). Review Chapter 10 summary notes before tomorrow 5:30 PM live numerical session.',
    authorId: 'tch-001',
    authorName: 'Er. Vikram Singh',
    authorRole: 'Teacher',
    authorDesignation: 'Senior Faculty - Science',
    category: 'Study Material',
    targetAudience: 'Class 10',
    tags: ['Physics', 'Ray Optics', 'Mirror Formula', 'Board Exam Tips'],
    createdAt: '2026-10-25 14:15',
    pinned: true,
    likesCount: 62,
    commentsCount: 9
  },
  {
    id: 'post-003',
    title: '📐 Special Trigonometry Doubt Clearance Class this Sunday at 10:00 AM',
    content: 'Dear Arjun-10 batch students, we will be solving the top 15 previous 5-year UP Board proof-based questions on Trigonometric Identities (sin²θ + cos²θ = 1, 1 + tan²θ = sec²θ). Please bring your unsolved doubts from NCERT Exercise 8.4.',
    authorId: 'tch-002',
    authorName: 'Prof. Sunita Devi',
    authorRole: 'Teacher',
    authorDesignation: 'Head of Mathematics',
    category: 'Live Class Update',
    targetAudience: 'Class 10',
    tags: ['Ganit', 'Trigonometry', 'Doubt Session', 'Class 10'],
    createdAt: '2026-10-26 09:00',
    pinned: false,
    likesCount: 47,
    commentsCount: 12
  },
  {
    id: 'post-004',
    title: '🤖 Tech Pioneer Lab: Submit Your Python Study Assistant Prompts',
    content: 'Attention all Young AI Coders! For our upcoming weekend lab, test the "Socratic Math Tutor" prompt with at least 3 distinct algebra word problems. Document whenever the AI hallucinated or tried giving the answer without explanation.',
    authorId: 'tch-003',
    authorName: 'Dr. Alok Verma',
    authorRole: 'Teacher',
    authorDesignation: 'Director of Future Technologies Lab',
    category: 'Motivation & Tips',
    targetAudience: 'Coding & Tech',
    tags: ['Python Lab', 'AI Prompting', 'Homework Task'],
    createdAt: '2026-10-26 16:40',
    pinned: false,
    likesCount: 39,
    commentsCount: 7
  }
];

// In-Memory Database store
interface DbStore {
  students: typeof DEFAULT_STUDENTS;
  teachers: typeof DEFAULT_TEACHERS;
  posts: typeof DEFAULT_POSTS;
  notices: Array<{ id: string; message: string; tag: string; isActive: boolean; dateAdded: string }>;
  inquiries: Array<any>;
}

let db: DbStore = {
  students: DEFAULT_STUDENTS,
  teachers: DEFAULT_TEACHERS,
  posts: DEFAULT_POSTS,
  notices: [
    {
      id: 'not-01',
      message: 'UPMSP 2026 Class 10 & 9 Board Blueprint & OMR Sample Papers Released. Check Student Library!',
      tag: 'UPMSP Alert',
      isActive: true,
      dateAdded: '2025-10-24'
    },
    {
      id: 'not-02',
      message: 'New Weekend Batch: Python AI Prompting & Web Skills starting this Saturday.',
      tag: 'New Batch',
      isActive: true,
      dateAdded: '2025-10-20'
    }
  ],
  inquiries: []
};

// Try loading persisted data from disk if exists
try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    db = { ...db, ...parsed };
    console.log('[API Server] Loaded persisted database from disk.');
  }
} catch (e) {
  console.warn('[API Server] Could not read existing database file, using defaults:', e);
}

// Helper to save DB
function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (e) {
    console.error('[API Server] Failed to save DB to disk:', e);
  }
}

// ----------------- API ROUTES ----------------- //

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '2.5.0-fullstack'
  });
});

// Overview Statistics
app.get('/api/stats', (req: Request, res: Response) => {
  res.json({
    totalStudents: db.students.length,
    totalTeachers: db.teachers.length,
    totalPosts: db.posts.length,
    totalCourses: 4,
    totalInquiries: db.inquiries.length,
    activeBatches: 3,
    serverStatus: 'online',
    uptime: Math.floor(process.uptime())
  });
});

// STUDENTS
app.get('/api/students', (req: Request, res: Response) => {
  res.json(db.students);
});

app.post('/api/students', (req: Request, res: Response) => {
  const newStudent = {
    ...req.body,
    id: req.body.id || `std-${Date.now().toString().slice(-4)}`,
    joinedDate: req.body.joinedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  };
  db.students.unshift(newStudent);
  saveDb();
  res.status(201).json(newStudent);
});

app.put('/api/students/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = db.students.findIndex(s => s.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }
  db.students[idx] = { ...db.students[idx], ...req.body };
  saveDb();
  res.json(db.students[idx]);
});

app.delete('/api/students/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.students = db.students.filter(s => s.id !== id);
  saveDb();
  res.json({ success: true, id });
});

// TEACHERS
app.get('/api/teachers', (req: Request, res: Response) => {
  res.json(db.teachers);
});

app.post('/api/teachers', (req: Request, res: Response) => {
  const newTeacher = {
    ...req.body,
    id: req.body.id || `tch-${Date.now().toString().slice(-4)}`,
    role: 'teacher',
    rating: req.body.rating || 4.9,
    totalStudents: req.body.totalStudents || 0,
    joinedDate: req.body.joinedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  };
  db.teachers.unshift(newTeacher);
  saveDb();
  res.status(201).json(newTeacher);
});

app.put('/api/teachers/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = db.teachers.findIndex(t => t.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Teacher not found' });
  }
  db.teachers[idx] = { ...db.teachers[idx], ...req.body };
  saveDb();
  res.json(db.teachers[idx]);
});

app.delete('/api/teachers/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.teachers = db.teachers.filter(t => t.id !== id);
  saveDb();
  res.json({ success: true, id });
});

// POSTS & ANNOUNCEMENTS
app.get('/api/posts', (req: Request, res: Response) => {
  res.json(db.posts);
});

app.post('/api/posts', (req: Request, res: Response) => {
  const newPost = {
    ...req.body,
    id: req.body.id || `post-${Date.now().toString().slice(-4)}`,
    createdAt: req.body.createdAt || new Date().toISOString().replace('T', ' ').slice(0, 16),
    likesCount: req.body.likesCount || 0,
    commentsCount: req.body.commentsCount || 0,
    pinned: !!req.body.pinned
  };
  db.posts.unshift(newPost);
  saveDb();
  res.status(201).json(newPost);
});

app.put('/api/posts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = db.posts.findIndex(p => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }
  db.posts[idx] = { ...db.posts[idx], ...req.body, updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) };
  saveDb();
  res.json(db.posts[idx]);
});

app.post('/api/posts/:id/like', (req: Request, res: Response) => {
  const { id } = req.params;
  const post = db.posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  post.likesCount = (post.likesCount || 0) + 1;
  saveDb();
  res.json({ success: true, likesCount: post.likesCount });
});

app.delete('/api/posts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.posts = db.posts.filter(p => p.id !== id);
  saveDb();
  res.json({ success: true, id });
});

// NOTICES
app.get('/api/notices', (req: Request, res: Response) => {
  res.json(db.notices);
});

app.post('/api/notices', (req: Request, res: Response) => {
  const newNotice = {
    ...req.body,
    id: req.body.id || `not-${Date.now().toString().slice(-4)}`,
    dateAdded: new Date().toISOString().split('T')[0]
  };
  db.notices.unshift(newNotice);
  saveDb();
  res.status(201).json(newNotice);
});

// MASTER DATABASE EXPORT & BACKUP
app.get('/api/backup', (req: Request, res: Response) => {
  res.json({
    version: '2.5.0-json-db',
    exportedAt: new Date().toISOString(),
    data: db
  });
});

app.post('/api/backup/restore', (req: Request, res: Response) => {
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ error: 'Invalid payload: data object required' });
  }
  db = { ...db, ...data };
  saveDb();
  res.json({ success: true, message: 'Database successfully restored' });
});

// SQL SIMULATOR ENDPOINT (For Admin SQL runner)
app.post('/api/sql/execute', (req: Request, res: Response) => {
  const { sql } = req.body;
  const clean = (sql || '').trim().toLowerCase();

  if (clean.includes('select * from students') || clean.includes('select * from fra_students')) {
    return res.json({
      status: 'success',
      query: sql,
      rowCount: db.students.length,
      columns: ['id', 'full_name', 'roll_number', 'grade', 'board', 'attendance_pct', 'district'],
      rows: db.students.map(s => [s.id, s.fullName, s.rollNumber, s.grade, s.board, s.attendancePct, s.district])
    });
  }

  if (clean.includes('select * from teachers') || clean.includes('select * from fra_teachers')) {
    return res.json({
      status: 'success',
      query: sql,
      rowCount: db.teachers.length,
      columns: ['id', 'full_name', 'subject', 'designation', 'experience_years', 'rating', 'status'],
      rows: db.teachers.map(t => [t.id, t.fullName, t.subject, t.designation, t.experienceYears, t.rating, t.status])
    });
  }

  if (clean.includes('select * from posts') || clean.includes('select * from fra_posts')) {
    return res.json({
      status: 'success',
      query: sql,
      rowCount: db.posts.length,
      columns: ['id', 'title', 'author_name', 'author_role', 'category', 'likes_count', 'pinned'],
      rows: db.posts.map(p => [p.id, p.title, p.authorName, p.authorRole, p.category, p.likesCount, p.pinned])
    });
  }

  // Default simulated execution
  res.json({
    status: 'success',
    query: sql,
    message: 'Query executed successfully against SQLite/PostgreSQL virtual bridge.',
    affectedRows: 1,
    executionTimeMs: 14
  });
});

// ----------------- VITE MIDDLEWARE / STATIC FILES ----------------- //
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FRA Fullstack] Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[FRA Fullstack] Failed to start server:', err);
  process.exit(1);
});

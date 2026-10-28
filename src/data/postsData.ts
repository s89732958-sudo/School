import { AcademyPost } from '../types';

export const INITIAL_POSTS: AcademyPost[] = [
  {
    id: 'post-001',
    title: '📢 UPMSP 2026 Official Blueprint & OMR Pattern Alert (Class 9 & 10)',
    content: 'All students and faculty members are advised to note the official UPMSP 2026 examination guidelines: 20 marks will be strictly evaluated on OMR sheets (Section A - MCQs), and 50 marks will be evaluated through descriptive answers. Do not use gel pens on the OMR sheet; only blue/black ballpoint pens are authorized. Download the model format from your Student Library.',
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
    commentsCount: 16,
    attachments: [
      {
        name: 'UPMSP_2026_OMR_Specimen_Sample.pdf',
        type: 'pdf',
        size: '1.2 MB'
      }
    ]
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
    commentsCount: 9,
    attachments: [
      {
        name: 'Ray_Optics_Sign_Convention_Cheatsheet.pdf',
        type: 'pdf',
        size: '2.4 MB'
      }
    ]
  },
  {
    id: 'post-003',
    title: '📐 Special Trigonometry Doubt Clearance Class this Sunday at 10:00 AM',
    content: 'Dear Arjun-10 batch students, we will be solving the top 15 previous 5-year UP Board proof-based questions on Trigonometric Identities (sin²θ + cos²θ = 1, 1 + tan²θ = sec²θ). Please bring your unsolved doubts from NCERT Exercise 8.4. Solutions will be demonstrated step-by-step with mark allocation criteria.',
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
    content: 'Attention all Young AI Coders! For our upcoming weekend lab, test the "Socratic Math Tutor" prompt with at least 3 distinct algebra word problems. Document whenever the AI hallucinated or tried giving the answer without explanation. Upload your reflections by Friday evening in the student portal.',
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

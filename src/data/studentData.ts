import { StudentUser, LearningMaterial, StudentTestRecord } from '../types';

export const DEMO_STUDENTS: StudentUser[] = [
  {
    id: 'std-10-042',
    fullName: 'Aryan Sharma',
    rollNumber: 'FRA-2026-X042',
    email: 'aryan.sharma26@fra-student.in',
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
    id: 'std-09-019',
    fullName: 'Priya Verma',
    rollNumber: 'FRA-2026-IX019',
    email: 'priya.verma26@fra-student.in',
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
  }
];

export const INITIAL_STUDENT_TOPIC_PROGRESS: Record<string, boolean> = {
  // Aryan's completed topics in Class 10 Board Accelerator
  'up-class-10-board-accelerator_0_0': true, // Quadratic equations by factorisation
  'up-class-10-board-accelerator_0_1': true, // Arithmetic progressions
  'up-class-10-board-accelerator_0_2': true, // Trigonometric identities
  'up-class-10-board-accelerator_1_0': true, // Ohm's law, series/parallel
  'up-class-10-board-accelerator_1_1': true, // Heating effect & electric power
  'up-class-10-board-accelerator_2_0': true, // Types of chemical reactions
  'up-class-10-board-accelerator_2_1': true, // Acids, bases, salts & pH
  // Aryan's completed in AI Prompting
  'ai-prompt-engineering-foundations_0_0': true, // What is AI vs automation?
  'ai-prompt-engineering-foundations_0_1': true, // How neural networks recognize patterns
  'ai-prompt-engineering-foundations_1_0': true, // Zero-shot vs Few-shot

  // Priya's completed in Class 9 Math & Science
  'up-class-9-math-science_0_0': true, // Rational & Irrational numbers
  'up-class-9-math-science_0_1': true, // Real numbers decimal expansions
  'up-class-9-math-science_1_0': true, // Describing motion, speed vs velocity
  'up-class-9-math-science_2_0': true, // Particulate nature of matter
  // Priya's completed in Web Development
  'web-development-bootcamp_0_0': true, // How browsers render code
  'web-development-bootcamp_0_1': true, // Semantic tags
};

export const LEARNING_MATERIALS: LearningMaterial[] = [
  {
    id: 'mat-10-sci-01',
    title: 'NCERT Ch 10: प्रकाश - परावर्तन तथा अपवर्तन (Light: Reflection & Refraction) Complete Formula & Theory Guide',
    courseId: 'up-class-10-board-accelerator',
    subject: 'Vigyan (Science)',
    category: 'PDF Study Notes',
    targetGrade: 'Class 10',
    fileSize: '4.2 MB',
    pagesOrDuration: '28 Pages',
    updatedDate: 'Updated Oct 2025 (UPMSP 2026 Pattern)',
    isHighWeightage: true,
    description: 'Bilingual UPMSP study notes covering ray diagrams for concave/convex mirrors, lens formula, magnification derivation, refractive index, and 25 solved numericals.',
    highlights: [
      '100% NCERT & UPMSP Syllabus Alignment in Hindi & English',
      'Step-by-step Ray Diagram conventions for board exams',
      'Sign convention (+/-) shortcut rule with zero-error memory trick',
      'Top 10 Previous Year UP Board questions solved step-by-step'
    ]
  },
  {
    id: 'mat-10-math-01',
    title: 'UP Board Class 10 गणित सूत्र संग्रह: Trigonometry & Heights/Distances Quick Reference Sheet',
    courseId: 'up-class-10-board-accelerator',
    subject: 'Ganit (Mathematics)',
    category: 'Formula Sheet',
    targetGrade: 'Class 10',
    fileSize: '1.8 MB',
    pagesOrDuration: '6 Pages',
    updatedDate: 'Updated Sep 2025',
    isHighWeightage: true,
    description: 'High-density formula revision sheet featuring all trigonometric ratios, reciprocal identities, complementary angles, and angle of elevation/depression shortcut angles (30°, 45°, 60°).',
    highlights: [
      'All 15 Board Examination Trigonometric identities in one sheet',
      'Visual diagram templates for 6-mark Heights and Distances questions',
      'Pythagorean triple cheatsheet for rapid mental math verification'
    ]
  },
  {
    id: 'mat-10-model-2026',
    title: 'UPMSP 2026 Class 10 Vigyan (Science) Official Blueprint Model Question Paper & Solution Key',
    courseId: 'up-class-10-board-accelerator',
    subject: 'Vigyan (Science)',
    category: 'UPMSP Model Paper',
    targetGrade: 'Class 10',
    fileSize: '5.6 MB',
    pagesOrDuration: '14 Pages',
    updatedDate: 'Released Oct 2025',
    isHighWeightage: true,
    description: 'Standard 70-marks written question paper structured according to the latest UPMSP 20-marks OMR MCQs + 50-marks descriptive format with complete step-wise model answers.',
    highlights: [
      'Exact 20 OMR MCQs section with answer bubble sheet',
      'Section A (Physics), Section B (Chemistry), Section C (Biology)',
      'Marking scheme highlighting where students commonly lose 1-2 marks'
    ]
  },
  {
    id: 'mat-10-video-01',
    title: 'Masterclass: How to Solve Circuit Numericals (Ohm’s Law, Series & Parallel Resistors)',
    courseId: 'up-class-10-board-accelerator',
    subject: 'Vigyan (Science)',
    category: 'Video Lecture',
    targetGrade: 'Class 10',
    fileSize: 'Online Stream',
    pagesOrDuration: '48 Mins Video',
    updatedDate: 'Recorded Live Session',
    isHighWeightage: true,
    description: 'Comprehensive video breakdown by Er. Vikram Singh illustrating equivalent resistance, power dissipation, and mixed bridge circuits frequently asked in UP Board examinations.',
    highlights: [
      'Visual step-by-step circuit simplification technique',
      'Hindi explanation with English terminology for technical clarity',
      'Interactive timestamps with in-class student doubt solutions'
    ]
  },
  {
    id: 'mat-09-math-01',
    title: 'Class 9 Ganit: Number Systems & Polynomials Complete Theory & Theorem Derivations',
    courseId: 'up-class-9-math-science',
    subject: 'Ganit (Mathematics)',
    category: 'PDF Study Notes',
    targetGrade: 'Class 9',
    fileSize: '3.4 MB',
    pagesOrDuration: '22 Pages',
    updatedDate: 'Updated Aug 2025',
    isHighWeightage: false,
    description: 'Foundational concepts for Class 9 UP Board students. Explains rational numbers, irrational proofs (√2, √5 on number line), remainder theorem, and algebraic identities.',
    highlights: [
      'Number line plotting step-by-step visual illustrations',
      'Factor Theorem and Remainder Theorem solved exercise sets',
      'Identity expansion checklist: (a+b)³, a³+b³+c³-3abc'
    ]
  },
  {
    id: 'mat-09-sci-01',
    title: 'Class 9 Vigyan: गति तथा बल के नियम (Motion & Laws of Motion) Comprehensive Notes',
    courseId: 'up-class-9-math-science',
    subject: 'Vigyan (Science)',
    category: 'PDF Study Notes',
    targetGrade: 'Class 9',
    fileSize: '3.9 MB',
    pagesOrDuration: '26 Pages',
    updatedDate: 'Updated Sep 2025',
    isHighWeightage: true,
    description: 'Detailed study notes covering scalar vs vector quantities, graphical derivation of the three equations of motion (v = u + at, s = ut + ½at², v² = u² + 2as), and Newton’s laws.',
    highlights: [
      'Graphical derivation of all three kinematic equations',
      'Momentum conservation real-world examples (recoil of gun)',
      '15 Solved NCERT exemplary numericals'
    ]
  },
  {
    id: 'mat-tech-ai-01',
    title: 'Young Minds AI Prompting Handbook: 60+ Tested Prompts for Homework Research & Critical Thinking',
    courseId: 'ai-prompt-engineering-foundations',
    subject: 'Python & AI',
    category: 'Practice Worksheet',
    targetGrade: 'Both 9 & 10',
    fileSize: '2.1 MB',
    pagesOrDuration: '18 Pages',
    updatedDate: 'Updated Oct 2025',
    isHighWeightage: false,
    description: 'A student-safe guide to generative AI prompting. Contains role prompts, step-by-step problem deconstruction, and hallucination verification exercises for secondary students.',
    highlights: [
      'Math tutor prompt templates that explain logic without giving direct answers',
      'Fact-checking checklist against NCERT textbooks',
      'Digital safety guidelines and AI ethics rules'
    ]
  },
  {
    id: 'mat-tech-web-01',
    title: 'Modern Web Development Starter Cheatsheet: HTML5 Tags & CSS Flexbox Grid System',
    courseId: 'web-development-bootcamp',
    subject: 'Web Development',
    category: 'Formula Sheet',
    targetGrade: 'Both 9 & 10',
    fileSize: '1.5 MB',
    pagesOrDuration: '8 Pages',
    updatedDate: 'Updated Oct 2025',
    isHighWeightage: false,
    description: 'Quick-reference guide for young developers learning HTML semantic structures and modern CSS Flexbox layout properties (justify-content, align-items, flex-direction).',
    highlights: [
      'Visual diagram of the CSS Box Model (margin, border, padding, content)',
      'Flexbox visual alignment cheat-sheet',
      'Starter code for a student personal portfolio website'
    ]
  }
];

export const UPCOMING_TESTS: StudentTestRecord[] = [
  {
    id: 'test-10-sci-04',
    title: 'UP Board Class 10 Science Pre-Mock 04: Electricity & Chemical Equations',
    subject: 'Vigyan (Science)',
    totalMarks: 70,
    scoredMarks: 64,
    date: 'Oct 20, 2025',
    status: 'Evaluated',
    rank: 'Rank 3 in Batch',
    solutionKeyAvailable: true
  },
  {
    id: 'test-10-math-05',
    title: 'Class 10 Board Test 05: Trigonometric Identities & Heights/Distances',
    subject: 'Ganit (Mathematics)',
    totalMarks: 50,
    scoredMarks: 47,
    date: 'Oct 14, 2025',
    status: 'Evaluated',
    rank: 'Rank 1 in Batch',
    solutionKeyAvailable: true
  },
  {
    id: 'test-10-ai-02',
    title: 'AI Lab Practical: Prompt Crafting & Truth-Verification Evaluation',
    subject: 'Python & AI',
    totalMarks: 30,
    scoredMarks: 29,
    date: 'Oct 08, 2025',
    status: 'Evaluated',
    rank: 'Distinction',
    solutionKeyAvailable: true
  },
  {
    id: 'test-10-sci-05',
    title: 'Upcoming UPMSP Full Syllabus Pre-Board Science Mega Test',
    subject: 'Vigyan (Science)',
    totalMarks: 70,
    date: 'Nov 05, 2025',
    status: 'Upcoming',
    solutionKeyAvailable: false
  }
];

export const WEEKLY_LIVE_SCHEDULE = [
  {
    day: 'Monday & Wednesday',
    time: '5:30 PM - 7:00 PM',
    courseTitle: 'UP Board Class 10: Science (Physics & Chemistry)',
    faculty: 'Er. Vikram Singh',
    room: 'Virtual Classroom Alpha',
    topic: 'Light: Ray Optics & Numerical Problem Solving'
  },
  {
    day: 'Tuesday & Thursday',
    time: '5:30 PM - 7:00 PM',
    courseTitle: 'UP Board Class 10: Mathematics',
    faculty: 'Prof. Ramesh Chandra',
    room: 'Virtual Classroom Beta',
    topic: 'Trigonometric Identities & Board Paper Shortcuts'
  },
  {
    day: 'Saturday',
    time: '4:00 PM - 6:00 PM',
    courseTitle: 'Future Skills: AI & Prompt Engineering Lab',
    faculty: 'Dr. Alok Verma',
    room: 'Tech Hub Live 1',
    topic: 'Hands-on: Building Your Custom Study Assistant'
  },
  {
    day: 'Sunday',
    time: '10:00 AM - 12:00 PM',
    courseTitle: 'Weekly Doubt Clearing & Board Answer Sheet Review',
    faculty: 'Academy Mentor Panel',
    room: 'Open Doubt Room',
    topic: 'Step-by-step marking analysis & student copy feedback'
  }
];

import { Course } from '../types';

export const COURSES_DATA: Course[] = [
  {
    id: 'up-class-9-math-science',
    title: 'UP Board Class 9: Science & Mathematics Foundation',
    targetAudience: 'UP Board Class 9 Students (Hindi & Bilingual Medium)',
    category: 'up_board_class_9',
    shortDescription: 'In-depth mastery of NCERT & UP Board Class 9 syllabus in Mathematics and Science with foundational problem-solving and conceptual physics, chemistry, and biology.',
    longDescription: 'Built specifically for Class 9 students preparing under the Uttar Pradesh Madhyamik Shiksha Parishad (UPMSP) curriculum. We break down abstract theorems, algebraic formulas, chemical formulas, and biological mechanisms using visual examples and step-by-step problem sets.',
    pricingType: 'Comprehensive (Paid)',
    durationWeeks: 36,
    classesPerWeek: 4,
    languageMedium: 'Hindi & English (Bilingual)',
    syllabusHighlights: [
      'Complete UPMSP & NCERT Mathematics theorem derivations and exercise sets',
      'Physics: Motion, Force, Laws of Motion, Gravitation, Work & Energy',
      'Chemistry: Matter in our Surroundings, Atoms & Molecules, Structure of the Atom',
      'Biology: Cell - Fundamental Unit of Life, Tissues, Health and Diseases',
      'Monthly progressive mock exams aligned to UP Board pattern'
    ],
    modules: [
      {
        title: 'Module 1: Number Systems, Polynomials & Coordinate Geometry',
        topics: ['Rational & Irrational numbers', 'Real numbers and their decimal expansions', 'Polynomial operations & factor theorem', 'Cartesian plane and graph plotting']
      },
      {
        title: 'Module 2: Classical Mechanics & Force Fundamentals',
        topics: ['Describing motion, speed vs velocity', 'Newton’s three laws of motion', 'Mathematical formulation of momentum', 'Universal law of gravitation']
      },
      {
        title: 'Module 3: Atomic Structure & Chemical Foundations',
        topics: ['Particulate nature of matter', 'Laws of chemical combinations', 'Dalton’s atomic theory and valency', 'Isotopes and isobars']
      },
      {
        title: 'Module 4: Cellular Biology & Plant/Animal Tissues',
        topics: ['Prokaryotic vs Eukaryotic cells', 'Cell organelles and plasma membrane', 'Meristematic and permanent tissues in plants', 'Epithelial, connective and muscular tissues']
      }
    ],
    keySkillsGained: [
      'Mathematical problem solving without memorization',
      'Scientific method & experiment interpretation',
      'High-speed calculation & board paper structuring'
    ],
    status: 'Enrollment Open',
    batchStartDate: 'New Batch Starts First Monday of the Month'
  },
  {
    id: 'up-class-10-board-accelerator',
    title: 'UP Board Class 10: High-Scorer Board Exam Accelerator',
    targetAudience: 'UP Board Class 10 Board Aspirants',
    category: 'up_board_class_10',
    shortDescription: 'Targeted preparation for Class 10 Board Examinations in Mathematics and Science with model question papers, previous 10-year question analysis, and answer presentation techniques.',
    longDescription: 'Class 10 is the milestone board examination year for UPMSP students. This accelerator equips students with pinpoint conceptual clarity, speed in numerical problems, structured diagram drawing for biology, and mastery of high-weightage topics.',
    pricingType: 'Comprehensive (Paid)',
    durationWeeks: 38,
    classesPerWeek: 5,
    languageMedium: 'Hindi & English (Bilingual)',
    syllabusHighlights: [
      'High-weightage topic masterclasses: Trigonometry, Quadratic Equations, Electricity & Light',
      'Step-by-step solutions to UP Board question papers from the past 10 years',
      'Accurate board paper presentation: heading formats, step marking, diagram conventions',
      'Structured revision cycles with time-bound weekly test series',
      'Doubt resolution clinics tailored to Hindi and English medium students'
    ],
    modules: [
      {
        title: 'Module 1: Advanced Algebra & Trigonometry Mastery',
        topics: ['Quadratic equations by factorisation and formula', 'Arithmetic progressions', 'Trigonometric identities and angle formulas', 'Applications of trigonometry (Heights and Distances)']
      },
      {
        title: 'Module 2: Electromagnetism, Circuits & Ray Optics',
        topics: ['Ohm’s law, series and parallel resistance circuits', 'Heating effect of electric current & electric power', 'Reflection and refraction in spherical mirrors and lenses', 'Human eye and colourful world defects']
      },
      {
        title: 'Module 3: Chemical Reactions, Metals, Carbon Chemistry',
        topics: ['Types of chemical reactions & redox processes', 'Acids, bases, salts and pH scale calculations', 'Metals and non-metals metallurgy', 'Carbon and its compounds: covalent bonding & homologous series']
      },
      {
        title: 'Module 4: Life Processes, Control & Coordination, Heredity',
        topics: ['Nutrition, respiration, transportation in humans & plants', 'Nervous system and reflex arc', 'Mendel’s laws of inheritance', 'Our environment and ecosystem cycles']
      }
    ],
    keySkillsGained: [
      'Board exam answer-sheet time management',
      'Zero-mistake step calculation method',
      'Scientific diagramming precision'
    ],
    status: 'Enrollment Open',
    batchStartDate: 'Rolling Cohorts Available'
  },
  {
    id: 'ai-prompt-engineering-foundations',
    title: 'Practical AI & Prompt Engineering for Young Minds',
    targetAudience: 'Class 9 & 10 Students with No Prior Coding Experience',
    category: 'future_skills',
    shortDescription: 'Demystify Artificial Intelligence. Learn how Large Language Models work, master prompt engineering techniques, and build custom AI-powered study assistants safely and ethically.',
    longDescription: 'AI is reshaping every profession. Rather than passively using AI as a shortcut, students at Future Ready Academy learn the underlying mechanics of neural networks, tokenization, generative AI, and how to craft rigorous, multi-step prompts to research and solve problems.',
    pricingType: 'Free Starter',
    durationWeeks: 8,
    classesPerWeek: 2,
    languageMedium: 'Hindi & English (Bilingual)',
    syllabusHighlights: [
      'Understanding Artificial Intelligence: From rule-based programs to Machine Learning',
      'How Generative AI and LLMs actually process human language',
      'The anatomy of a powerful prompt: Context, Role, Constraints, and Step-by-step thinking',
      'Building your personal AI tutor for Mathematics and Science revision',
      'Digital ethics: Copyright, hallucination verification, privacy and cyber safety'
    ],
    modules: [
      {
        title: 'Module 1: Demystifying AI & How Machines Learn',
        topics: ['What is AI vs automation?', 'How neural networks recognise patterns', 'Data, inputs, and outputs explained simply']
      },
      {
        title: 'Module 2: The Science of Prompt Engineering',
        topics: ['Zero-shot vs Few-shot prompting', 'Role prompting and Persona definition', 'Chain-of-thought prompting for math problems']
      },
      {
        title: 'Module 3: Practical Student Applications',
        topics: ['Creating customized quiz generators', 'Using AI to summarize complex NCERT historical chapters', 'Grammar and translation checking']
      },
      {
        title: 'Module 4: Ethics, Safety & Truth Verification',
        topics: ['Spotting hallucinations and inaccuracies', 'Data privacy and sharing safeguards', 'The future of jobs and hybrid intelligence']
      }
    ],
    keySkillsGained: [
      'Prompt structuring & critical evaluation',
      'Fact-checking AI outputs against textbooks',
      'AI-assisted homework & project research'
    ],
    status: 'Enrollment Open',
    batchStartDate: 'Immediate Weekend Batches'
  },
  {
    id: 'web-development-bootcamp',
    title: 'Modern Web Development: HTML, CSS & JavaScript',
    targetAudience: 'Beginner Students Passionate About Building Software',
    category: 'coding_ai',
    shortDescription: 'Go from zero to building and publishing responsive websites. Master the fundamental building blocks of the internet: HTML5, Tailwind/CSS, and JavaScript logic.',
    longDescription: 'A practical, hands-on programming course designed specifically for secondary school students. Students write real code from class one, creating their own online portfolio, science calculators, and school club landing pages.',
    pricingType: 'Comprehensive (Paid)',
    durationWeeks: 14,
    classesPerWeek: 3,
    languageMedium: 'Hindi & English (Bilingual)',
    syllabusHighlights: [
      'HTML5 semantic structure: headers, layouts, forms, media embeds',
      'CSS styling: Flexbox, Grid, mobile-responsive layout design',
      'JavaScript fundamentals: variables, conditions, loops, functions',
      'DOM manipulation: creating interactive calculators and quizzes',
      'Deploying a live website to the public internet'
    ],
    modules: [
      {
        title: 'Module 1: The Skeleton of the Web (HTML5)',
        topics: ['How browsers render code', 'Semantic tags: header, nav, main, section', 'Forms, tables, and media embeds']
      },
      {
        title: 'Module 2: Visual Styling & Responsive Layouts (CSS)',
        topics: ['Box model: margins, borders, padding', 'Flexbox fundamentals for card grids', 'Mobile media queries & responsive typography']
      },
      {
        title: 'Module 3: Interactive Logic (JavaScript)',
        topics: ['Variables (let/const), data types', 'Event listeners (clicks, inputs, submissions)', 'Building an interactive Class 10 Science formula calculator']
      },
      {
        title: 'Module 4: Final Capstone Project & Deployment',
        topics: ['Building a personal portfolio website', 'Introduction to Git & GitHub basics', 'Deploying on free cloud hosting']
      }
    ],
    keySkillsGained: [
      'Computational thinking and problem decomposition',
      'Writing clean, indented code in code editors',
      'Debugging errors independently'
    ],
    status: 'Enrollment Open',
    batchStartDate: 'First Week of Next Month'
  },
  {
    id: 'app-development-architecture',
    title: 'Mobile App Architecture & Logic for Young Developers',
    targetAudience: 'Students with Basic Logic or Coding Exposure',
    category: 'coding_ai',
    shortDescription: 'Understand how modern smartphone apps are conceived, designed, and structured. Learn UI wireframing, state logic, and mobile app architecture.',
    longDescription: 'Smartphones are in every pocket, but few students understand how apps work under the hood. In this track, students explore mobile user interfaces, component trees, API data fetching, and app state management without overwhelming complexity.',
    pricingType: 'Scholarship Program',
    durationWeeks: 12,
    classesPerWeek: 2,
    languageMedium: 'Hindi & English (Bilingual)',
    syllabusHighlights: [
      'Mobile operating system basics: Android and iOS architectures',
      'Designing mobile UI screens: navigation bars, cards, modal sheets',
      'State management: how apps remember user data between screens',
      'Offline-first concepts: caching data for low-connectivity regions',
      'Building an interactive mobile study timer and flashcard app'
    ],
    modules: [
      {
        title: 'Module 1: Mobile UI & User Experience Principles',
        topics: ['Touch targets and mobile thumb zones', 'Design systems and dark mode contrast', 'Wireframing screens with free digital tools']
      },
      {
        title: 'Module 2: App Data & User State',
        topics: ['Local storage and preferences', 'Passing data between screen views', 'Handling button taps and swipe gestures']
      },
      {
        title: 'Module 3: Cloud Data & Connectivity',
        topics: ['How apps connect to databases over the internet', 'Handling network errors and slow connections', 'Push notification architecture basics']
      },
      {
        title: 'Module 4: Showcase Project: Study Buddy App',
        topics: ['Planning the student app architecture', 'Connecting modules into a unified mobile interface', 'Testing on mobile devices']
      }
    ],
    keySkillsGained: [
      'User interface architecture intuition',
      'Structured systems thinking',
      'Product design and user empathy'
    ],
    status: 'Upcoming Batch',
    batchStartDate: 'Registrations Open for Winter Cohort'
  },
  {
    id: 'digital-marketing-media-literacy',
    title: 'Digital Marketing, Content Strategy & Safe Online Presence',
    targetAudience: 'Aspiring Creators, Communicators & Future Entrepreneurs',
    category: 'future_skills',
    shortDescription: 'Learn digital communication, safe brand identity building, presentation storytelling, search engine principles, and modern media creation.',
    longDescription: 'In a digital economy, knowing how to communicate ideas clearly online is an invaluable superpower. Students learn the fundamentals of content creation, visual graphics, search discoverability, and digital hygiene to protect their privacy.',
    pricingType: 'Comprehensive (Paid)',
    durationWeeks: 8,
    classesPerWeek: 2,
    languageMedium: 'Hindi & English (Bilingual)',
    syllabusHighlights: [
      'Visual storytelling: composition, typography, and infographic design',
      'Writing compelling scripts, headlines, and educational posts',
      'Search Engines (SEO): How Google indexes and ranks information',
      'Audience psychology and value-driven communication',
      'Digital safety: cyber-bullying protection, secure passwords, data privacy'
    ],
    modules: [
      {
        title: 'Module 1: Visual Design & Infographic Creation',
        topics: ['Color theory and typography hierarchy', 'Creating study infographics for Class 9 & 10 topics', 'Graphic editing tools']
      },
      {
        title: 'Module 2: Content Strategy & Scriptwriting',
        topics: ['The Hook-Story-Offer formula', 'Writing educational video scripts', 'Distilling complicated concepts into 60-second explainers']
      },
      {
        title: 'Module 3: Search Engine Basics & Online Discovery',
        topics: ['How search algorithms work', 'Keywords, meta descriptions, and page indexing', 'Analytics: Understanding views and engagements']
      },
      {
        title: 'Module 4: Responsible Digital Citizenship',
        topics: ['Safeguarding personal identity online', 'Managing screen time and digital well-being', 'Building an ethical digital portfolio']
      }
    ],
    keySkillsGained: [
      'Public communication and storytelling',
      'Graphic design and visual structuring',
      'Search engine and web literacy'
    ],
    status: 'Enrollment Open',
    batchStartDate: 'Rolling Admissions'
  }
];

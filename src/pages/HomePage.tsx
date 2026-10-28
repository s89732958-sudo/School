import React from 'react';
import { PageRoute, Course, SiteSettings } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Cpu, 
  Code, 
  Smartphone, 
  Share2, 
  CheckCircle2, 
  GraduationCap, 
  Flame, 
  Compass, 
  ShieldCheck, 
  Users, 
  Layers,
  ChevronRight
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectCourse: (course: Course) => void;
  onOpenAmbassadorModal: () => void;
  siteSettings?: SiteSettings;
  courses?: Course[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectCourse,
  onOpenAmbassadorModal,
  siteSettings,
  courses = COURSES_DATA,
}) => {
  const featuredCourses = courses.slice(0, 3);
  const brandName = siteSettings?.brandName || 'Future Ready Academy';
  const tagline = siteSettings?.tagline || 'Learn Together, Grow Together.';
  const heroSubheadline = siteSettings?.heroSubheadline || 'Future Ready Academy is not only an academic coaching platform. We empower UP Board Class 9 & 10 students with top-tier board syllabus clarity while unlocking future-proof technical superpowers in AI, coding, web dev, and digital skills.';

  return (
    <div className="relative overflow-hidden">
      {/* Background Subtle Tech Grid & Ambient Glows */}
      <div className="absolute inset-0 grid-bg-pattern pointer-events-none opacity-40 -z-10" />
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-3/4 max-w-5xl h-96 bg-emerald-500/10 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#d4af37]/5 blur-[120px] pointer-events-none -z-10" />

      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-20 md:pt-20 md:pb-28 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Tagline Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-700/50 bg-[#07150f]/80 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#d4af37] font-bold">{brandName}</span>
            <span className="text-gray-400">•</span>
            <span>“{tagline}”</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight">
            Excel in UP Board Exams. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-200 to-[#d4af37]">
              Build Real-World Tech & AI Skills.
            </span>
          </h1>

          {/* Core Idea Value Proposition */}
          <p className="text-sm sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-normal">
            {heroSubheadline}
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('courses')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold text-sm shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-emerald-700/60 bg-[#091510] text-gray-200 hover:border-emerald-400 hover:text-white hover:bg-emerald-950/40 text-sm font-semibold transition-all"
            >
              <span>Join Future Ready Academy</span>
              <ChevronRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

          {/* Key Quick Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-gray-400 border-t border-emerald-950/80 max-w-3xl mx-auto">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Strictly Aligned with UPMSP Syllabus</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>Dual Academic & Future Skills Track</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Mobile-First, Low Data Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          DUAL-PILLAR SECTION: ACADEMIC + FUTURE SKILLS
          ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-[#050b08] border-y border-emerald-950/80">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
              The Dual-Pillar Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              One Unified Platform. Two Crucial Outcomes.
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              UP Board students should not have to sacrifice their board examination marks to learn 21st-century technology, nor should they wait until college to write their first line of code.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* PILLAR 1: ACADEMIC LEARNING */}
            <div className="relative p-7 sm:p-9 rounded-2xl bg-[#08130f] border border-emerald-800/50 hover:border-emerald-600 transition-all shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-600/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider uppercase">
                        PILLAR 01
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">
                        Academic Excellence
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium">
                    UP Board 9 & 10
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                  Comprehensive coverage of Class 9 and 10 Science, Mathematics, and critical academic topics structured specifically for Hindi and bilingual medium students under Uttar Pradesh Board guidelines.
                </p>

                <div className="space-y-3 text-xs sm:text-sm text-gray-300 mb-8">
                  <div className="p-3 rounded-lg bg-[#050e0a] border border-emerald-950 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold">NCERT & UPMSP Foundation:</strong>
                      <span className="text-gray-400 text-xs">
                        Concept-first breakdown of Physics laws, Chemistry formulas, Biology systems, and Math derivations.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#050e0a] border border-emerald-950 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold">Past 10 Years Board Papers:</strong>
                      <span className="text-gray-400 text-xs">
                        Practice with genuine previous year questions, answer sheet presentation, and step-marking guidelines.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#050e0a] border border-emerald-950 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold">Bilingual Concept Explanations:</strong>
                      <span className="text-gray-400 text-xs">
                        No English-barrier confusion. We teach with clear Hindi explanations and standard technical terminology.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('courses')}
                className="w-full py-3 rounded-xl bg-emerald-950 hover:bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>View Academic Syllabus & Batches</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* PILLAR 2: FUTURE SKILLS */}
            <div className="relative p-7 sm:p-9 rounded-2xl bg-[#09110d] border border-amber-800/40 hover:border-amber-600/70 transition-all shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#d4af37] tracking-wider uppercase">
                        PILLAR 02
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">
                        Future-Ready Tech Skills
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800 font-medium">
                    AI, Coding & Digital
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                  Practical, beginner-friendly technology training that turns passive smartphone users into active builders, thinkers, and digital creators before they step into higher secondary or college.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  <div className="p-3 rounded-lg bg-[#050c09] border border-emerald-950">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>AI & Prompting</span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Understand how Generative AI works and build custom AI study assistants.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#050c09] border border-emerald-950">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
                      <Code className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Web Development</span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      HTML, CSS, JavaScript logic to construct responsive websites from zero.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#050c09] border border-emerald-950">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>App Architecture</span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Explore mobile UI, event listeners, component hierarchy and state logic.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#050c09] border border-emerald-950">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
                      <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Digital Literacy</span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Safe online presence, visual presentation design, and search engine literacy.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('courses')}
                className="w-full py-3 rounded-xl bg-[#141206] hover:bg-[#1a1708] border border-[#d4af37]/50 text-[#d4af37] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>Explore Future Skills Tracks</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          WHY FUTURE READY ACADEMY
          ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Engineered For UP Students
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Why Future Ready Academy Stands Apart
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            We understand the exact aspirations, challenges, and board exam expectations of students and parents across Uttar Pradesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-[#070e0b] border border-emerald-950 hover:border-emerald-800/80 transition-all">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-sm mb-4 border border-emerald-800">
              01
            </div>
            <h3 className="text-base font-bold text-white mb-2">No Rote Cramming</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              We teach why formulas work and how scientific laws behave in the real world, turning passive memorizers into deep thinkers.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#070e0b] border border-emerald-950 hover:border-emerald-800/80 transition-all">
            <div className="w-10 h-10 rounded-lg bg-amber-950/60 text-[#d4af37] flex items-center justify-center font-bold text-sm mb-4 border border-amber-800/40">
              02
            </div>
            <h3 className="text-base font-bold text-white mb-2">4-Year Career Head-Start</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              While conventional students wait until college to write their first software code, our students have already created websites and applied AI tools.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#070e0b] border border-emerald-950 hover:border-emerald-800/80 transition-all">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-sm mb-4 border border-emerald-800">
              03
            </div>
            <h3 className="text-base font-bold text-white mb-2">Hindi & Bilingual Comfort</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              No student is left behind because of language. Complex concepts are translated with clarity, honoring both Hindi and English board answers.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#070e0b] border border-emerald-950 hover:border-emerald-800/80 transition-all">
            <div className="w-10 h-10 rounded-lg bg-amber-950/60 text-[#d4af37] flex items-center justify-center font-bold text-sm mb-4 border border-amber-800/40">
              04
            </div>
            <h3 className="text-base font-bold text-white mb-2">Mobile-First, Low Data</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Engineered to work on budget smartphones and regular mobile data plans without needing costly high-end laptops.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          HOW THE PLATFORM WORKS
          ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-[#050a08] border-y border-emerald-950/80">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
              Step-by-Step Pathway
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              How Future Ready Academy Operates
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              A transparent, structured educational journey designed to build discipline, confidence, and verifiable competence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#08120e] border border-emerald-950 space-y-3 text-center sm:text-left">
              <span className="inline-block px-3 py-1 rounded bg-emerald-950 text-emerald-400 font-mono text-xs font-bold border border-emerald-800">
                STEP 01
              </span>
              <h3 className="text-base font-bold text-white">Enroll in Your Track</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Choose UP Board Class 9 or 10 academic coaching, or pick an emerging technology track like Web Development or AI foundations.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#08120e] border border-emerald-950 space-y-3 text-center sm:text-left">
              <span className="inline-block px-3 py-1 rounded bg-emerald-950 text-emerald-400 font-mono text-xs font-bold border border-emerald-800">
                STEP 02
              </span>
              <h3 className="text-base font-bold text-white">Interactive Modules</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Study with bite-sized lessons, clear diagrams, bilingual explanations, and structured formula sheets.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#08120e] border border-emerald-950 space-y-3 text-center sm:text-left">
              <span className="inline-block px-3 py-1 rounded bg-emerald-950 text-emerald-400 font-mono text-xs font-bold border border-emerald-800">
                STEP 03
              </span>
              <h3 className="text-base font-bold text-white">Build & Solve</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Write board exam answers with verified step scoring while writing code to launch live websites and test AI prompts.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-[#08120e] border border-emerald-950 space-y-3 text-center sm:text-left">
              <span className="inline-block px-3 py-1 rounded bg-amber-950/60 text-[#d4af37] font-mono text-xs font-bold border border-amber-800/40">
                STEP 04
              </span>
              <h3 className="text-base font-bold text-white">Learn & Grow Together</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Engage in peer study groups, resolve tricky doubts with mentors, and earn verified milestone recognitions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED COURSES PREVIEW
          ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
              Popular Programs
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Featured Academy Offerings
            </h2>
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
          >
            <span>View All Courses ({COURSES_DATA.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-[#08110d] border border-emerald-950 hover:border-emerald-700/60 transition-all hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-[#d4af37] uppercase tracking-wider font-mono">
                    {course.targetAudience}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    course.pricingType.includes('Free')
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : 'bg-[#0f1713] text-gray-300 border-emerald-900/60'
                  }`}>
                    {course.pricingType}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {course.title}
                </h3>

                <p className="text-xs text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                  {course.shortDescription}
                </p>

                <div className="space-y-1.5 border-t border-emerald-950/70 pt-3 mb-4">
                  {course.syllabusHighlights.slice(0, 2).map((item, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-gray-300">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span className="line-clamp-1">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-950 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-mono">
                  {course.durationWeeks} Wks • {course.classesPerWeek} Classes/Wk
                </span>
                <button
                  onClick={() => onSelectCourse(course)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 text-xs font-semibold transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          FINAL CALL TO ACTION
          ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-5xl mx-auto">
        <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0a1811] via-[#07120d] to-[#040806] border border-emerald-700/50 text-center space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-900 to-[#07150f] border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-md">
            <Sparkles className="w-7 h-7 text-[#d4af37]" />
          </div>

          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Start Your Dual-Track Journey Today
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Join students across Uttar Pradesh preparing for outstanding board examination results while building real skills in coding and AI.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('courses')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#f4d775] text-black font-bold text-xs sm:text-sm hover:brightness-110 transition-all shadow-md"
            >
              Explore Course Catalog
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-emerald-700/70 bg-[#06110c] text-white hover:bg-emerald-950/60 font-semibold text-xs sm:text-sm transition-all"
            >
              Contact Student Admissions
            </button>
          </div>

          <div className="pt-4 text-xs text-gray-400 font-medium">
            “Learn Together, Grow Together.”
          </div>
        </div>
      </section>
    </div>
  );
};

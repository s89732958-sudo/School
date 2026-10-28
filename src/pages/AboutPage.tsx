import React from 'react';
import { Target, Compass, Award, Shield, CheckCircle2, Sparkles, BookOpen, User } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16 max-w-6xl mx-auto space-y-20">
      
      {/* Vision & Mission Intro Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>About Future Ready Academy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Empowering UP Board Students for Board Success & Digital Leadership
        </h1>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
          We believe that talent in Uttar Pradesh is boundless. By uniting high-standard academic board coaching with foundational future technologies like AI, coding, and web development, we give students the tools to lead.
        </p>
      </section>

      {/* Mission & Vision Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl bg-[#070e0b] border border-emerald-800/40 space-y-4 shadow-sm hover:border-emerald-600/60 transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Our Mission</h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            To provide accessible, high-standard academic coaching for UP Board Class 9 and 10 students while simultaneously equipping them with practical digital capabilities in Artificial Intelligence, coding, web development, and digital marketing.
          </p>
          <div className="pt-2 border-t border-emerald-950 space-y-2 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Democratize advanced technology learning in secondary school</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Provide bilingual instruction that respects students' mother tongue</span>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-[#09110d] border border-amber-800/40 space-y-4 shadow-sm hover:border-amber-600/60 transition-all">
          <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-600/40 flex items-center justify-center text-[#d4af37]">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Our Vision</h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            A future where every student graduating from Class 10 in Uttar Pradesh possesses both a top-tier academic score and the computational confidence to build websites, command AI tools, and think like a creator in the global digital economy.
          </p>
          <div className="pt-2 border-t border-emerald-950 space-y-2 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>Closing the digital divide between metropolitan and regional students</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>Cultivating problem-solvers who build software solutions for real challenges</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Academic + Future Skills Approach Breakdown */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#050a08] border border-emerald-950 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            Pedagogical Philosophy
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            The Academic + Future Skills Approach
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            How we solve the traditional conflict between school curriculum and modern vocational technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[#070f0c] border border-emerald-950 space-y-3">
            <span className="text-xs font-mono font-bold text-emerald-400">APPROACH 01</span>
            <h3 className="text-base font-bold text-white">Direct Curriculum Complement</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Coding exercises are not taught in isolation; they are mapped to school science and math. Students write code to plot quadratic equations and calculate physics velocity, reinforcing both domains simultaneously.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#070f0c] border border-emerald-950 space-y-3">
            <span className="text-xs font-mono font-bold text-[#d4af37]">APPROACH 02</span>
            <h3 className="text-base font-bold text-white">Zero Extra Burden</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Future skill sessions are structured at 2 to 3 high-intensity, practical hours on weekends. Weekdays remain dedicated to board examination syllabus completion, revision, and numerical mastery.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#070f0c] border border-emerald-950 space-y-3">
            <span className="text-xs font-mono font-bold text-emerald-400">APPROACH 03</span>
            <h3 className="text-base font-bold text-white">Community-Driven Growth</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              True to our motto “Learn Together, Grow Together”, students learn in structured cohorts with peer review checkpoints and mentorship from qualified educators who care about individual progress.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section With Placeholder Image & Message */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#08120e] border border-emerald-800/60 shadow-lg">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          
          {/* Founder Placeholder Image */}
          <div className="w-56 h-64 sm:w-64 sm:h-72 rounded-2xl bg-[#040806] border-2 border-emerald-600/50 p-4 flex flex-col items-center justify-center text-center shrink-0 shadow-[0_0_25px_rgba(16,185,129,0.15)] relative overflow-hidden group">
            <div className="w-24 h-24 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-3">
              <User className="w-12 h-12 text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Academy Founder
            </span>
            <span className="text-[11px] text-[#d4af37] font-medium mt-0.5">
              Leadership & Academic Director
            </span>
            <span className="mt-2 text-[10px] text-emerald-500 font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
              [Founder Photo Placeholder]
            </span>
          </div>

          {/* Founder Message */}
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-amber-950/40 text-[#d4af37] text-xs font-semibold border border-amber-600/30">
              Founder's Message
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
              “Education must prepare students for their future, not just their next test.”
            </h2>
            
            <div className="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <p>
                Every year, hundreds of thousands of bright students in Uttar Pradesh sit for their Class 9 and 10 board examinations. They memorize formulas, solve theorems, and score commendable marks. Yet, when they enter the modern job market or higher technical education, they realize they have never built a project, written software logic, or utilized AI tools.
              </p>
              <p>
                We established <strong>Future Ready Academy</strong> to fundamentally alter this narrative. Our conviction is simple: academic rigor and modern technology are not opposites. When taught together with empathy and relevance, they amplify each other.
              </p>
              <p>
                To our students and parents: when you join us, you are not simply preparing for board exams. You are preparing to step into the world with confidence, skills, and the capacity to shape tomorrow.
              </p>
            </div>

            <div className="pt-2 border-t border-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="block text-sm font-bold text-white">Founder & Academic Director</span>
                <span className="text-xs text-emerald-400">Future Ready Academy</span>
              </div>
              <span className="text-xs font-mono text-[#d4af37]">
                “Learn Together, Grow Together.”
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

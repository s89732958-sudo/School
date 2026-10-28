import React from 'react';
import { Award, Users, Share2, CheckCircle2, ArrowRight, BookOpen, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { PageRoute } from '../types';

interface AmbassadorPageProps {
  onOpenAmbassadorModal: () => void;
  onNavigate: (page: PageRoute) => void;
}

export const AmbassadorPage: React.FC<AmbassadorPageProps> = ({
  onOpenAmbassadorModal,
  onNavigate,
}) => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16 max-w-6xl mx-auto space-y-20">
      
      {/* Intro Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-600/30 text-[#d4af37] text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Future Ready Ambassador Partner Program</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Transform Your Local Community as an Education Partner
        </h1>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
          Are you a school teacher, local coaching tutor, college mentor, or passionate youth leader in Uttar Pradesh? Partner with Future Ready Academy to bring verified board exam preparation and 21st-century tech skills to students in your town or district.
        </p>
        <div className="pt-2">
          <button
            onClick={onOpenAmbassadorModal}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#f4d775] text-black font-bold text-xs sm:text-sm hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] inline-flex items-center gap-2"
          >
            <span>Apply as Ambassador Partner</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </section>

      {/* Ambassador Partner Benefits */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Why Partner With Us
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Tangible Benefits for Ambassadors
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            We collaborate closely with every recognized ambassador, providing the instructional materials, orientation, and community backing you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-2xl bg-[#070e0b] border border-emerald-950 space-y-4 hover:border-emerald-700/60 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Direct Local Impact</h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Introduce students in tier-2, tier-3 cities and rural districts to artificial intelligence, website building, and high-standard board coaching that is otherwise only accessible in major metros.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-[#070e0b] border border-emerald-950 space-y-4 hover:border-emerald-700/60 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Official Partner Credentials</h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Receive official certificate of partnership, verified digital badges, and an ambassador portfolio that establishes your credibility as a forward-looking educator and regional mentor.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-[#070e0b] border border-emerald-950 space-y-4 hover:border-emerald-700/60 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Teaching & Orientation Toolkits</h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Get access to verified syllabus sheets, board exam revision summaries, digital skill brochures, and demo modules to easily guide parents and school principals.
            </p>
          </div>
        </div>
      </section>

      {/* How the Referral & Partnership Works */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#060c09] border border-emerald-950 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            Transparent Framework
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            How the Ambassador Program Operates
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            A step-by-step collaborative journey designed for educators and regional organizers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="p-6 rounded-2xl bg-[#08120e] border border-emerald-900/40 space-y-3">
            <span className="inline-block px-3 py-1 rounded bg-emerald-950 text-emerald-400 font-mono text-xs font-bold border border-emerald-800">
              STAGE 01
            </span>
            <h3 className="text-base font-bold text-white">Submit Partner Profile</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Fill out the ambassador application detailing your background, city/district in Uttar Pradesh, and your current student touchpoints.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#08120e] border border-emerald-900/40 space-y-3">
            <span className="inline-block px-3 py-1 rounded bg-emerald-950 text-emerald-400 font-mono text-xs font-bold border border-emerald-800">
              STAGE 02
            </span>
            <h3 className="text-base font-bold text-white">Briefing & Toolkit Access</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Our central academic team conducts a quick briefing call, shares official brochures, sample curriculum roadmaps, and guidelines.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#08120e] border border-emerald-900/40 space-y-3">
            <span className="inline-block px-3 py-1 rounded bg-amber-950/60 text-[#d4af37] font-mono text-xs font-bold border border-amber-800/40">
              STAGE 03
            </span>
            <h3 className="text-base font-bold text-white">Student Orientation & Cohorts</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Introduce local students to our dual academic & future skill tracks, track their participation, and coordinate regional study meetups.
            </p>
          </div>
        </div>
      </section>

      {/* Ambassador Code of Ethics */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[#070e0b] border border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Ethical Commitment</span>
          </div>
          <h3 className="text-base font-bold text-white">Built on Genuine Educational Value</h3>
          <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
            We hold our ambassadors to the highest standards of integrity. No misleading claims, no fake guarantees—only verifiable learning for UP Board students.
          </p>
        </div>

        <button
          onClick={onOpenAmbassadorModal}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e5c158] text-black font-bold text-xs shrink-0 hover:brightness-110 transition-all shadow-md"
        >
          Join Ambassador Network
        </button>
      </section>
    </div>
  );
};

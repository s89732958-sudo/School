import React, { useState } from 'react';
import { Course } from '../types';
import { X, CheckCircle2, Clock, Calendar, Globe, BookOpen, Layers, Sparkles, Send } from 'lucide-react';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onSelectCourseForInquiry: (courseTitle: string) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  onClose,
  onSelectCourseForInquiry,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'syllabus'>('overview');

  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="relative bg-[#070e0b] border border-emerald-700/60 rounded-2xl max-w-2xl w-full my-8 overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.18)] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-emerald-950 bg-gradient-to-r from-[#07130e] to-[#040806] flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-bold text-[#d4af37] tracking-wider uppercase bg-[#181507] border border-[#d4af37]/30 px-2.5 py-0.5 rounded-full">
                {course.targetAudience}
              </span>
              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                course.pricingType.includes('Free')
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : 'bg-zinc-900 text-gray-200 border-zinc-700'
              }`}>
                {course.pricingType}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              {course.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-emerald-950/60 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-emerald-950 bg-[#050a08] px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Course Overview
          </button>
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'syllabus'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            Syllabus & Modules ({course.modules.length})
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-gray-300">
          {activeTab === 'overview' ? (
            <>
              {/* Key Meta Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#091510] border border-emerald-900/40">
                  <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono uppercase">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    Duration
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-white mt-1">
                    {course.durationWeeks} Weeks
                  </p>
                  <p className="text-[11px] text-gray-400">{course.classesPerWeek} classes / week</p>
                </div>

                <div className="p-3 rounded-xl bg-[#091510] border border-emerald-900/40">
                  <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono uppercase">
                    <Globe className="w-3 h-3 text-emerald-400" />
                    Medium
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-white mt-1">
                    {course.languageMedium}
                  </p>
                  <p className="text-[11px] text-gray-400">UPMSP Friendly</p>
                </div>

                <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-[#091510] border border-emerald-900/40">
                  <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono uppercase">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    Batch Status
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-400 mt-1">
                    {course.status}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">{course.batchStartDate}</p>
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-2">
                  About This Course
                </h4>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  {course.longDescription}
                </p>
              </div>

              {/* What You Will Gain */}
              <div className="p-4 rounded-xl bg-[#0a1410] border border-emerald-900/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Key Student Outcomes & Skills
                </h4>
                <ul className="grid grid-cols-1 gap-2">
                  {course.keySkillsGained.map((skill, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Highlights List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Curriculum Highlights
                </h4>
                <div className="space-y-1.5">
                  {course.syllabusHighlights.map((hl, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Syllabus Modules View */
            <div className="space-y-4">
              <p className="text-xs text-gray-400">
                Structured progressive learning roadmap designed to balance board examination excellence with practical execution.
              </p>

              {course.modules.map((mod, index) => (
                <div key={index} className="p-4 rounded-xl bg-[#08120e] border border-emerald-900/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold flex items-center justify-center border border-emerald-800">
                      {index + 1}
                    </span>
                    <h5 className="text-xs sm:text-sm font-bold text-white">
                      {mod.title}
                    </h5>
                  </div>
                  <ul className="pl-7 space-y-1">
                    {mod.topics.map((t, tIdx) => (
                      <li key={tIdx} className="text-xs text-gray-400 list-disc list-outside">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="p-4 sm:p-5 border-t border-emerald-950 bg-[#050907] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-400 text-center sm:text-left">
            <span>Need advice on subject selection?</span>{' '}
            <span className="text-emerald-400 font-medium">Talk to an Academic Advisor</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-medium text-gray-300 hover:text-white rounded-lg border border-emerald-950 hover:bg-emerald-950/40 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onSelectCourseForInquiry(course.title);
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-bold text-black bg-gradient-to-r from-[#d4af37] to-[#e5c158] hover:brightness-110 rounded-lg shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5 text-black" />
              <span>Inquire for Batch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { PageRoute } from '../types';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
  onOpenAmbassadorModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenAmbassadorModal,
}) => {
  const handleNav = (page: PageRoute) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#030605] border-t border-emerald-950/80 text-gray-400 text-sm">
      {/* Top Banner Accent */}
      <div className="h-1 bg-gradient-to-r from-emerald-600 via-[#d4af37] to-emerald-800" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand & Core Philosophy (2 cols on large) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('home')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-900 to-[#07130e] border border-emerald-500/40 flex items-center justify-center font-mono font-black text-xs text-emerald-400">
                FRA
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-wider text-white">
                  FUTURE READY <span className="text-[#d4af37]">ACADEMY</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold tracking-wider">
                  Learn Together, Grow Together.
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Future Ready Academy is a dedicated education initiative for UP Board Class 9 and 10 students. We bridge official state curriculum requirements with essential future-ready skills in Artificial Intelligence, software coding, and digital creation.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400/90 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Aligned with UPMSP & NCERT guidelines</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              Explore Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-emerald-400 transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('courses')} className="hover:text-emerald-400 transition-colors">
                  All Courses & Syllabus
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-emerald-400 transition-colors">
                  Our Mission & Approach
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faq')} className="hover:text-emerald-400 transition-colors">
                  Student & Parent FAQ
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('ambassador')} className="hover:text-emerald-400 transition-colors">
                  Ambassador Partner Program
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-emerald-400 transition-colors">
                  Contact & Admissions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Academic & Skill Tracks */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              Learning Tracks
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('courses')} className="hover:text-emerald-400 transition-colors text-left">
                  UP Board Class 9 Science & Math
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('courses')} className="hover:text-emerald-400 transition-colors text-left">
                  UP Board Class 10 Board Accelerator
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('courses')} className="hover:text-emerald-400 transition-colors text-left">
                  AI & Prompt Engineering Basics
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('courses')} className="hover:text-emerald-400 transition-colors text-left">
                  HTML, CSS & JavaScript Web Track
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('courses')} className="hover:text-emerald-400 transition-colors text-left">
                  Mobile App Architecture & Logic
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('courses')} className="hover:text-emerald-400 transition-colors text-left">
                  Digital Media & Creator Literacy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Community & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              Community & Connect
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2 text-gray-400">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Uttar Pradesh, India (Digital Operations Hub)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>admissions@futurereadyacademy.in</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>+91 98765 43210 [Support Placeholder]</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAmbassadorModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 hover:text-white hover:bg-emerald-900 transition-all text-xs font-semibold"
              >
                <span>Join as Ambassador</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-emerald-950/70 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>
            © {new Date().getFullYear()} Future Ready Academy. All rights reserved. “Learn Together, Grow Together.”
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNav('admin')}
              className="text-[#d4af37] hover:underline flex items-center gap-1 font-mono text-[11px]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Admin Portal</span>
            </button>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">Step 1 Architecture (Full-Stack Ready)</span>
            <span className="text-emerald-500 font-mono">v1.0.0-PROD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

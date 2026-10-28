import React, { useState } from 'react';
import { FAQS_DATA } from '../data/faqsData';
import { HelpCircle, ChevronDown, ChevronUp, Search, Plus, Minus, MessageSquare } from 'lucide-react';
import { PageRoute } from '../types';

interface FAQPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  const [openId, setOpenId] = useState<string | null>('faq-up-board-alignment');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Academics & Board Prep',
    'Future Skills & AI',
    'Platform & Classes',
    'Ambassador Program'
  ];

  const filteredFaqs = FAQS_DATA.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16 max-w-4xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Clear Answers for Students & Parents</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          Everything you need to know about our UP Board Class 9 and 10 curriculum, bilingual classes, AI technology tracks, and Ambassador partnerships.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search questions (e.g. board papers, language medium, devices)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#060c09] border border-emerald-950 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[#060c09] text-gray-400 hover:text-white border border-emerald-950'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion FAQ Cards */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-[#060c09] border border-emerald-950 text-gray-400 text-sm">
            No matching questions found. Feel free to contact our academic help desk.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-[#070e0b] border border-emerald-950/90 overflow-hidden transition-all hover:border-emerald-800/60"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#d4af37] uppercase tracking-wider block">
                      {faq.category}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-gray-100 hover:text-white transition-colors block">
                      {faq.question}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-0 border-t border-emerald-950/60 bg-[#050a08]/50">
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still Have Questions CTA */}
      <div className="p-8 rounded-2xl bg-[#060d0a] border border-emerald-900/40 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">Have a specific question about your child's syllabus?</h3>
        <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
          Our team is available to assist UP Board students and parents in selecting the right batch or answering technical questions.
        </p>
        <button
          onClick={() => onNavigate('contact')}
          className="px-6 py-2.5 rounded-lg bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-colors shadow-sm inline-flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Contact Student Support</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Course, CourseCategory } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { Search, Filter, BookOpen, Clock, Globe, ArrowRight, Sparkles } from 'lucide-react';

interface CoursesPageProps {
  courses?: Course[];
  onSelectCourse: (course: Course) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ courses = COURSES_DATA, onSelectCourse }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | CourseCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs: { id: 'all' | CourseCategory; label: string }[] = [
    { id: 'all', label: 'All Courses' },
    { id: 'up_board_class_9', label: 'UP Board Class 9' },
    { id: 'up_board_class_10', label: 'UP Board Class 10' },
    { id: 'future_skills', label: 'AI & Future Skills' },
    { id: 'coding_ai', label: 'Coding & Development' },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesQuery = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.targetAudience.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto space-y-10">
      
      {/* Page Title & Mission Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Complete Curriculum Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Academic Board Prep + Future Tech Tracks
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl mx-auto">
          Every program is structured with clear milestones, bilingual concept delivery, and hands-on problem solving to help UP Board Class 9 and 10 students stand out.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#070f0c] border border-emerald-950">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {filterTabs.map((tab) => {
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                    : 'bg-[#050a08] text-gray-400 hover:text-white hover:bg-emerald-950/40 border border-emerald-950'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by topic, class, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#040806] border border-emerald-950 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#060c09] border border-emerald-950 p-8 space-y-3">
          <p className="text-gray-400 text-sm">No courses found matching your search query.</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-lg bg-emerald-950 text-emerald-400 text-xs font-semibold border border-emerald-800"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col justify-between rounded-2xl bg-[#070f0c] border border-emerald-950 hover:border-emerald-700/60 transition-all p-6 shadow-sm group hover:-translate-y-1"
            >
              <div>
                {/* Category & Pricing Tag */}
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span className="text-[10px] font-bold text-[#d4af37] tracking-wider uppercase font-mono truncate">
                    {course.targetAudience}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                    course.pricingType.includes('Free')
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : 'bg-zinc-900 text-gray-300 border-zinc-700'
                  }`}>
                    {course.pricingType}
                  </span>
                </div>

                {/* Course Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug mb-2">
                  {course.title}
                </h3>

                {/* Short Description */}
                <p className="text-xs text-gray-400 leading-relaxed mb-5 line-clamp-3">
                  {course.shortDescription}
                </p>

                {/* Meta Attributes */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#050a08] border border-emerald-950 mb-5 text-[11px] text-gray-400">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{course.durationWeeks} Weeks</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono truncate">
                    <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Bilingual UPMSP</span>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="space-y-1.5 mb-6">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">
                    Curriculum Highlights:
                  </span>
                  {course.syllabusHighlights.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-start gap-1.5 text-xs text-gray-300">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span className="line-clamp-1">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-emerald-950/80 flex items-center justify-between">
                <span className="text-xs text-emerald-500 font-medium">
                  {course.status}
                </span>
                <button
                  onClick={() => onSelectCourse(course)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 text-xs font-bold transition-all shadow-sm"
                >
                  <span>View Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

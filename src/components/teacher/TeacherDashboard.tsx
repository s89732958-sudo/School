import React, { useState } from 'react';
import { 
  AuthUser, 
  TeacherUser, 
  AcademyPost, 
  StudentUser, 
  LearningMaterial,
  PageRoute 
} from '../../types';
import { 
  GraduationCap, 
  BookOpen, 
  PlusCircle, 
  Send, 
  Pin, 
  Trash2, 
  Sparkles, 
  FileText, 
  Calendar, 
  Users, 
  CheckCircle2, 
  ExternalLink, 
  Heart, 
  MessageSquare, 
  Clock, 
  Award, 
  HelpCircle,
  Eye,
  LogOut,
  Filter,
  CheckSquare
} from 'lucide-react';
import { DEMO_STUDENTS } from '../../data/studentData';
import { LEARNING_MATERIALS } from '../../data/studentData';

interface TeacherDashboardProps {
  currentUser: AuthUser;
  posts: AcademyPost[];
  onAddPost: (post: Omit<AcademyPost, 'id' | 'createdAt' | 'likesCount' | 'commentsCount'>) => void;
  onDeletePost: (id: string) => void;
  onTogglePinPost: (id: string) => void;
  onNavigate: (page: PageRoute) => void;
  onLogout: () => void;
  students?: StudentUser[];
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentUser,
  posts,
  onAddPost,
  onDeletePost,
  onTogglePinPost,
  onNavigate,
  onLogout,
  students = DEMO_STUDENTS,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'create_post' | 'roster' | 'upload_notes' | 'schedule'>('feed');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Form states for creating a new post
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<AcademyPost['category']>('Announcement');
  const [newTarget, setNewTarget] = useState<AcademyPost['targetAudience']>('All Students');
  const [newTags, setNewTags] = useState('UPMSP 2026, Important');
  const [newPinned, setNewPinned] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  // Form states for uploading study material
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialSubject, setMaterialSubject] = useState<'Ganit (Mathematics)' | 'Vigyan (Science)' | 'Python & AI'>('Vigyan (Science)');
  const [materialCategory, setMaterialCategory] = useState<'PDF Study Notes' | 'Formula Sheet' | 'UPMSP Model Paper'>('PDF Study Notes');
  const [materialGrade, setMaterialGrade] = useState<'Class 9' | 'Class 10' | 'Both 9 & 10'>('Class 10');
  const [materialDescription, setMaterialDescription] = useState('');
  const [materialUploaded, setMaterialUploaded] = useState(false);

  const teacherName = currentUser.fullName || 'Er. Vikram Singh';
  const teacherSubject = currentUser.subject || 'Physics & Science (UPMSP)';
  const teacherDesignation = currentUser.designation || 'Senior Faculty & Academic Mentor';

  const myPosts = posts.filter(p => p.authorName.toLowerCase().includes(teacherName.toLowerCase()) || p.authorRole === 'Teacher');

  const filteredPosts = categoryFilter === 'All' 
    ? posts 
    : posts.filter(p => p.category === categoryFilter);

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onAddPost({
      title: newTitle.trim(),
      content: newContent.trim(),
      authorId: currentUser.id,
      authorName: teacherName,
      authorRole: 'Teacher',
      authorDesignation: teacherDesignation,
      category: newCategory,
      targetAudience: newTarget,
      tags: tagsArray.length > 0 ? tagsArray : ['Faculty Update'],
      pinned: newPinned,
      attachments: [
        {
          name: `${newCategory.replace(/\s+/g, '_')}_Reference.pdf`,
          type: 'pdf',
          size: '1.4 MB'
        }
      ]
    });

    setNewTitle('');
    setNewContent('');
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setActiveTab('feed');
    }, 1500);
  };

  const handleUploadMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialTitle.trim()) return;

    // Simulate creating a learning note and publishing notice
    onAddPost({
      title: `📄 New Study Material: ${materialTitle.trim()}`,
      content: materialDescription || `New ${materialCategory} for ${materialGrade} uploaded by ${teacherName}. Available for instant download in the Student Dashboard.`,
      authorId: currentUser.id,
      authorName: teacherName,
      authorRole: 'Teacher',
      authorDesignation: teacherDesignation,
      category: 'Study Material',
      targetAudience: materialGrade === 'Both 9 & 10' ? 'All Students' : materialGrade,
      tags: [materialSubject, materialCategory, 'Official Material'],
      pinned: false
    });

    setMaterialUploaded(true);
    setTimeout(() => {
      setMaterialUploaded(false);
      setMaterialTitle('');
      setMaterialDescription('');
      setActiveTab('feed');
    }, 1600);
  };

  return (
    <div className="min-h-screen bg-[#030604] text-gray-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Navigation Bar */}
      <div className="bg-[#07130e]/95 border-b border-cyan-950/70 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-cyan-900/30 font-bold border border-cyan-400/30">
              <GraduationCap className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-wide">FRA Faculty Portal</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                  Teacher Verified
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {teacherName} • <span className="text-cyan-400">{teacherSubject}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-gray-300 transition-all flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Public Website</span>
            </button>
            <button
              onClick={() => onNavigate('student')}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-600/40 hover:bg-emerald-900/50 text-xs font-semibold text-emerald-300 transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Student View</span>
            </button>
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-800/40 hover:bg-red-900/50 text-xs font-medium text-red-300 transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-b from-[#07130e] via-[#050c09] to-[#030604] border-b border-white/5 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-700/50 text-cyan-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Faculty Control Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Namaste, {teacherName}!
            </h1>
            <p className="text-sm text-gray-400 mt-1 max-w-2xl">
              Post real-time study notes, announce exam alerts, organize doubt classes, and track your enrolled UPMSP Class 9 & 10 batches.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('create_post')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-cyan-900/40 flex items-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Write Post / Announcement</span>
            </button>
            <button
              onClick={() => setActiveTab('upload_notes')}
              className="px-4 py-2.5 rounded-xl bg-[#0b1d16] border border-cyan-700/40 hover:border-cyan-400 text-cyan-300 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Upload Notes</span>
            </button>
          </div>
        </div>

        {/* Faculty KPI Metrics */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          <div className="bg-[#071610] border border-cyan-900/40 rounded-2xl p-4">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-xs font-medium">Assigned Batches</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white">2 Batches</div>
            <div className="text-[11px] text-cyan-400/80 mt-1">Arjun-10 & Pratham-9</div>
          </div>

          <div className="bg-[#071610] border border-cyan-900/40 rounded-2xl p-4">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-xs font-medium">Total Mentored Students</span>
              <GraduationCap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">{students.length + 146}</div>
            <div className="text-[11px] text-emerald-400/80 mt-1">Active UPMSP Aspirants</div>
          </div>

          <div className="bg-[#071610] border border-cyan-900/40 rounded-2xl p-4">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-xs font-medium">Published Posts</span>
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">{myPosts.length} Guides</div>
            <div className="text-[11px] text-amber-400/80 mt-1">Live in Student Feed</div>
          </div>

          <div className="bg-[#071610] border border-cyan-900/40 rounded-2xl p-4">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-xs font-medium">Student Rating</span>
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white">4.92 / 5.0</div>
            <div className="text-[11px] text-purple-400/80 mt-1">Verified Board Feedback</div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 w-full">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'feed'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Community Feed ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('create_post')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'create_post'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish New Post</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'roster'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Enrolled Students Roster</span>
          </button>

          <button
            onClick={() => setActiveTab('upload_notes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'upload_notes'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Upload Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Live Class Schedule</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        
        {/* TAB 1: COMMUNITY FEED & POSTS */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#071610] p-4 rounded-2xl border border-cyan-900/30">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-gray-300">Filter Category:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Announcement', 'Study Material', 'Exam Alert', 'Live Class Update', 'Motivation & Tips'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-black/30 text-gray-400 hover:text-white border border-transparent'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <span className="text-xs text-gray-400">
                Showing <strong className="text-white">{filteredPosts.length}</strong> posts
              </span>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 gap-4">
              {filteredPosts.map((post) => {
                const isMyPost = post.authorName.toLowerCase().includes(teacherName.toLowerCase());
                return (
                  <div
                    key={post.id}
                    className={`bg-[#071610] border rounded-2xl p-5 sm:p-6 transition-all hover:border-cyan-700/50 ${
                      post.pinned ? 'border-amber-500/40 bg-gradient-to-r from-[#0d1f16] to-[#071610]' : 'border-gray-800/80'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-300 text-sm">
                          {post.authorName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-sm sm:text-base">{post.authorName}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              post.authorRole === 'Admin'
                                ? 'bg-red-950/80 text-red-300 border border-red-700/40'
                                : 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/40'
                            }`}>
                              {post.authorRole}
                            </span>
                            {isMyPost && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600/40">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                            <span>{post.authorDesignation || 'Academic Faculty'}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-500" />
                              {post.createdAt}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {post.pinned && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/40">
                            <Pin className="w-3 h-3 fill-amber-400 text-amber-400" />
                            Pinned
                          </span>
                        )}
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-950/50 text-blue-300 border border-blue-800/40">
                          {post.category}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white/5 text-gray-300">
                          {post.targetAudience}
                        </span>

                        {/* Quick actions for teacher */}
                        <div className="flex items-center gap-1 ml-2 border-l border-gray-700 pl-2">
                          <button
                            onClick={() => onTogglePinPost(post.id)}
                            title={post.pinned ? 'Unpin Post' : 'Pin to Top'}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-white/5 transition-all cursor-pointer"
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeletePost(post.id)}
                            title="Delete Post"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mt-4">
                      <h4 className="text-base sm:text-lg font-bold text-white mb-2">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>
                    </div>

                    {/* Attachments if any */}
                    {post.attachments && post.attachments.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-800/80 flex flex-wrap gap-2">
                        {post.attachments.map((att, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-300 hover:bg-cyan-900/30 transition-all cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="font-semibold">{att.name}</span>
                            {att.size && <span className="text-gray-400 text-[10px]">({att.size})</span>}
                            <ExternalLink className="w-3 h-3 text-cyan-400" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tags and stats footer */}
                    <div className="mt-4 pt-3 border-t border-gray-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {post.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-black/40 text-gray-300 text-[10px] font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-gray-300">
                          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500/20" />
                          <span>{post.likesCount} student likes</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-300">
                          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{post.commentsCount} student questions</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CREATE POST FORM */}
        {activeTab === 'create_post' && (
          <div className="max-w-3xl mx-auto bg-[#071610] border border-cyan-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-cyan-400" />
                  <span>Publish New Post or Exam Alert</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  This post will instantly appear on the Student Portal, Homepage announcements, and REST API.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
                Author: {teacherName}
              </span>
            </div>

            {postSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-600/60 text-emerald-300 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                <span className="text-sm font-bold">Post published successfully! Broadcasted to students.</span>
              </div>
            )}

            <form onSubmit={handleCreatePostSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Post Headline / Topic Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 10 Physics: Top 5 Numerical Questions for UPMSP 2026 Board"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#030604] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-all placeholder:text-gray-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#030604] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="Announcement">Announcement (General Notice)</option>
                    <option value="Study Material">Study Material (Notes / Formulas)</option>
                    <option value="Exam Alert">Exam Alert (UPMSP Dates & OMR)</option>
                    <option value="Live Class Update">Live Class Update (Doubt Session)</option>
                    <option value="Motivation & Tips">Motivation & Tips (Revision Strategy)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Target Audience *
                  </label>
                  <select
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value as any)}
                    className="w-full bg-[#030604] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="All Students">All Students (Class 9 & 10)</option>
                    <option value="Class 10">Class 10 (UP Board High Scorer)</option>
                    <option value="Class 9">Class 9 (Foundations)</option>
                    <option value="Coding & Tech">Coding & Future Skills (AI/Python)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Detailed Explanation / Notice Body *
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Write clear instructions, solved examples, formula shortcuts, or live class links..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-[#030604] border border-gray-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-cyan-400 transition-all placeholder:text-gray-600 leading-relaxed font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Topic Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Ray Optics, Numericals, UPMSP 2026"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full bg-[#030604] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-all placeholder:text-gray-600"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newPinned}
                      onChange={(e) => setNewPinned(e.target.checked)}
                      className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 bg-black/40 border-gray-700"
                    />
                    <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                      <Pin className="w-3.5 h-3.5 text-amber-400" />
                      Pin to Top of Student Feed
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('feed')}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-cyan-900/40 flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish to Students & Web</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: ENROLLED STUDENTS ROSTER */}
        {activeTab === 'roster' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#071610] p-4 rounded-2xl border border-cyan-900/40">
              <div>
                <h3 className="font-bold text-white text-base">Mentored Students in Assigned Batches</h3>
                <p className="text-xs text-gray-400">Class 10 Arjun-10 Super 30 & Class 9 Pratham-9 Alpha</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700">
                Active Enrolled: {students.length}
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-[#071610]">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/40 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
                  <tr>
                    <th className="py-3 px-4">Student Name & Roll No</th>
                    <th className="py-3 px-4">Class & Medium</th>
                    <th className="py-3 px-4">District (UP)</th>
                    <th className="py-3 px-4">Batch Name</th>
                    <th className="py-3 px-4">Attendance</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-300">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-white/5 transition-all">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80'}
                            alt={student.fullName}
                            className="w-8 h-8 rounded-full object-cover border border-cyan-500/30"
                          />
                          <div>
                            <div className="font-bold text-white">{student.fullName}</div>
                            <div className="text-[10px] font-mono text-cyan-400">{student.rollNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-emerald-300">{student.grade}</span>
                        <div className="text-[10px] text-gray-400">{student.medium}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{student.district}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-white/5 text-[11px] text-gray-200">
                          {student.batchName}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-emerald-400">{student.attendancePct}%</span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setNewTitle(`Notice for ${student.fullName} (${student.rollNumber})`);
                            setNewTarget(student.grade);
                            setActiveTab('create_post');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-700/50 hover:bg-cyan-900/60 text-cyan-300 text-[11px] font-semibold transition-all cursor-pointer"
                        >
                          Send Notice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: UPLOAD NOTES */}
        {activeTab === 'upload_notes' && (
          <div className="max-w-2xl mx-auto bg-[#071610] border border-cyan-900/40 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-black text-white flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>Upload Notes to Student Library</span>
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Add study sheets, formula cards, or model papers directly to the Class 9 & 10 student portal.
            </p>

            {materialUploaded && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-600/60 text-emerald-300 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                <span className="text-sm font-bold">Study material saved and notification broadcasted to students!</span>
              </div>
            )}

            <form onSubmit={handleUploadMaterialSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Material Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 12: Vidyut (Electricity) Formula & Numericals Sheet"
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  className="w-full bg-[#030604] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">Subject</label>
                  <select
                    value={materialSubject}
                    onChange={(e) => setMaterialSubject(e.target.value as any)}
                    className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Vigyan (Science)">Vigyan (Science)</option>
                    <option value="Ganit (Mathematics)">Ganit (Mathematics)</option>
                    <option value="Python & AI">Python & AI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={materialCategory}
                    onChange={(e) => setMaterialCategory(e.target.value as any)}
                    className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="PDF Study Notes">PDF Study Notes</option>
                    <option value="Formula Sheet">Formula Sheet</option>
                    <option value="UPMSP Model Paper">UPMSP Model Paper</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">Target Class</label>
                  <select
                    value={materialGrade}
                    onChange={(e) => setMaterialGrade(e.target.value as any)}
                    className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Class 10">Class 10</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Both 9 & 10">Both 9 & 10</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Brief Overview / Chapter Highlights
                </label>
                <textarea
                  rows={3}
                  placeholder="Key topics covered, number of solved problems, NCERT references..."
                  value={materialDescription}
                  onChange={(e) => setMaterialDescription(e.target.value)}
                  className="w-full bg-[#030604] border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('feed')}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Upload & Notify Students</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: LIVE CLASS SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div className="bg-[#071610] p-4 rounded-2xl border border-cyan-900/40">
              <h3 className="font-bold text-white text-base">Weekly Live Interactive Sessions</h3>
              <p className="text-xs text-gray-400">Classes hosted in Virtual Classroom with bilingual UPMSP pedagogy</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#071610] border border-cyan-800/40 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700">
                    Monday & Wednesday
                  </span>
                  <span className="text-xs font-mono text-emerald-400">5:30 PM - 7:00 PM</span>
                </div>
                <h4 className="font-bold text-white text-base">UP Board Class 10: Science (Physics & Chemistry)</h4>
                <p className="text-xs text-gray-300 mt-2">
                  Topic: <strong>Light: Ray Optics & Numerical Problem Solving</strong> (NCERT Chapter 10)
                </p>
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-800 text-xs text-gray-400">
                  <span>Room: Virtual Classroom Alpha</span>
                  <button
                    onClick={() => {
                      setNewTitle('Reminder: Live Science Class today at 5:30 PM');
                      setNewTarget('Class 10');
                      setNewCategory('Live Class Update');
                      setActiveTab('create_post');
                    }}
                    className="text-cyan-400 hover:underline font-semibold"
                  >
                    Post Class Reminder
                  </button>
                </div>
              </div>

              <div className="bg-[#071610] border border-cyan-800/40 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-700">
                    Sunday Special
                  </span>
                  <span className="text-xs font-mono text-emerald-400">10:00 AM - 12:00 PM</span>
                </div>
                <h4 className="font-bold text-white text-base">Board Answer Copy Review & Doubt Clearance</h4>
                <p className="text-xs text-gray-300 mt-2">
                  Topic: <strong>Step-by-step marking analysis & common student mistakes</strong>
                </p>
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-800 text-xs text-gray-400">
                  <span>Room: Open Doubt Room</span>
                  <button
                    onClick={() => {
                      setNewTitle('Doubt Submission Window Open for Sunday Review');
                      setNewCategory('Live Class Update');
                      setActiveTab('create_post');
                    }}
                    className="text-cyan-400 hover:underline font-semibold"
                  >
                    Send Doubt Form
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

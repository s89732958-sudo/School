import React, { useState } from 'react';
import { AcademyPost } from '../../../types';
import { 
  Send, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Pin, 
  Heart, 
  MessageSquare, 
  Clock, 
  Filter, 
  X, 
  CheckCircle2, 
  Eye, 
  Sparkles,
  FileText
} from 'lucide-react';

interface AdminPostsTabProps {
  posts: AcademyPost[];
  onUpdatePosts: (posts: AcademyPost[]) => void;
  onShowToast: (msg: string) => void;
}

export const AdminPostsTab: React.FC<AdminPostsTabProps> = ({
  posts,
  onUpdatePosts,
  onShowToast,
}) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Admin' | 'Teacher'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPost, setEditingPost] = useState<AcademyPost | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<AcademyPost['category']>('Announcement');
  const [targetAudience, setTargetAudience] = useState<AcademyPost['targetAudience']>('All Students');
  const [tags, setTags] = useState('UPMSP 2026, Important');
  const [pinned, setPinned] = useState(false);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('Announcement');
    setTargetAudience('All Students');
    setTags('UPMSP 2026, Important');
    setPinned(false);
    setEditingPost(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (post: AcademyPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setTargetAudience(post.targetAudience);
    setTags(post.tags.join(', '));
    setPinned(post.pinned);
    setShowAddModal(true);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingPost) {
      const updated = posts.map(p => p.id === editingPost.id ? {
        ...p,
        title: title.trim(),
        content: content.trim(),
        category,
        targetAudience,
        tags: tagsArray.length > 0 ? tagsArray : ['Announcement'],
        pinned,
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      } : p);
      onUpdatePosts(updated);
      onShowToast(`Post "${title}" updated successfully!`);
    } else {
      const newPost: AcademyPost = {
        id: `post-${Date.now().toString().slice(-4)}`,
        title: title.trim(),
        content: content.trim(),
        authorId: 'usr-admin-01',
        authorName: 'FRA Central Administration',
        authorRole: 'Admin',
        authorDesignation: 'Director of Academic Affairs',
        category,
        targetAudience,
        tags: tagsArray.length > 0 ? tagsArray : ['Official Announcement'],
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        pinned,
        likesCount: 0,
        commentsCount: 0
      };
      onUpdatePosts([newPost, ...posts]);
      onShowToast(`Official notice "${title}" published across platform!`);
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleTogglePin = (id: string) => {
    const updated = posts.map(p => p.id === id ? { ...p, pinned: !p.pinned } : p);
    onUpdatePosts(updated);
    onShowToast('Post pin status updated.');
  };

  const handleDeletePost = (id: string, postTitle: string) => {
    if (confirm(`Are you sure you want to delete post "${postTitle}"?`)) {
      onUpdatePosts(posts.filter(p => p.id !== id));
      onShowToast(`Post deleted from feed.`);
    }
  };

  const filteredPosts = posts.filter(p => {
    const matchesRole = roleFilter === 'All' || p.authorRole === roleFilter;
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      p.title.toLowerCase().includes(searchLower) ||
      p.content.toLowerCase().includes(searchLower) ||
      p.authorName.toLowerCase().includes(searchLower);
    return matchesRole && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#071610] p-5 rounded-2xl border border-emerald-900/50">
        <div>
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-black text-white">Posts & Announcements Feed Control</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono">
              {posts.length} Live Posts
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Broadcast official notices, pin urgent exam alerts, and manage posts created by teachers and administrators.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Admin Announcement</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#060c08] p-3.5 rounded-xl border border-emerald-950">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-[#030604] px-3 py-1.5 rounded-lg border border-gray-800">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by headline, keyword, or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder:text-gray-600 focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-gray-500 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Author:</span>
          {(['All', 'Admin', 'Teacher'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setRoleFilter(tab)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                roleFilter === tab
                  ? 'bg-emerald-600 text-white'
                  : 'bg-black/30 text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            className={`bg-[#071610] border rounded-2xl p-5 hover:border-emerald-700/60 transition-all ${
              post.pinned ? 'border-amber-500/50 bg-gradient-to-r from-[#0d1f16] to-[#071610]' : 'border-emerald-950'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                  post.authorRole === 'Admin'
                    ? 'bg-red-950/80 text-red-300 border border-red-700/50'
                    : 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/50'
                }`}>
                  {post.authorRole === 'Admin' ? 'ADM' : 'TCH'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{post.authorName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      post.authorRole === 'Admin'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                    }`}>
                      {post.authorRole}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                    <span>{post.category}</span>
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
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-600/40 flex items-center gap-1">
                    <Pin className="w-3 h-3 fill-amber-400" />
                    Pinned
                  </span>
                )}
                <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-gray-300">
                  Target: {post.targetAudience}
                </span>

                <div className="flex items-center gap-1 border-l border-gray-800 pl-2">
                  <button
                    onClick={() => handleTogglePin(post.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-white/5 transition-all cursor-pointer"
                    title={post.pinned ? 'Unpin Post' : 'Pin to Top'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openEditModal(post)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                    title="Edit Post"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id, post.title)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer"
                    title="Delete Post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <h4 className="font-bold text-white text-base mb-1">{post.title}</h4>
              <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line line-clamp-3">
                {post.content}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
              <div className="flex flex-wrap gap-1">
                {post.tags.map((t, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-black/40 text-gray-300 font-mono">
                    #{t}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-gray-300">
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-500/20" />
                  {post.likesCount} likes
                </span>
                <span className="flex items-center gap-1 text-gray-300">
                  <MessageSquare className="w-3 h-3 text-cyan-400" />
                  {post.commentsCount} doubts
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Post Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#071610] border border-emerald-800/60 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-400" />
                <span>{editingPost ? 'Edit Post' : 'Publish Official Announcement'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                  Announcement Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UPMSP 2026 Model Papers Released by Board"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Announcement">Announcement (General Notice)</option>
                    <option value="Study Material">Study Material</option>
                    <option value="Exam Alert">Exam Alert (UPMSP)</option>
                    <option value="Live Class Update">Live Class Update</option>
                    <option value="Motivation & Tips">Motivation & Tips</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="All Students">All Students</option>
                    <option value="Class 10">Class 10 Only</option>
                    <option value="Class 9">Class 9 Only</option>
                    <option value="Coding & Tech">Coding & AI Students</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                  Notice Content *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Enter notice text, official instructions, links..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[#030604] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-400 leading-relaxed font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={pinned}
                      onChange={(e) => setPinned(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-black/40 border-gray-700"
                    />
                    <span className="text-xs font-bold text-gray-300 flex items-center gap-1">
                      <Pin className="w-3.5 h-3.5 text-amber-400" />
                      Pin to Top of Feed
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingPost ? 'Save Post' : 'Publish Notice'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

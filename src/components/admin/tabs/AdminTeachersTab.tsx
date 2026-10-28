import React, { useState } from 'react';
import { TeacherUser } from '../../../types';
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  GraduationCap, 
  Star, 
  Award, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  X,
  BookOpen
} from 'lucide-react';

interface AdminTeachersTabProps {
  teachers: TeacherUser[];
  onUpdateTeachers: (teachers: TeacherUser[]) => void;
  onShowToast: (msg: string) => void;
  onNavigateToTeacher?: () => void;
}

export const AdminTeachersTab: React.FC<AdminTeachersTabProps> = ({
  teachers,
  onUpdateTeachers,
  onShowToast,
  onNavigateToTeacher,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'On Leave'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherUser | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Physics & Science (UPMSP)');
  const [designation, setDesignation] = useState('Senior Faculty & Academic Mentor');
  const [qualification, setQualification] = useState('M.Sc. Physics (Gold Medalist), B.Ed');
  const [experienceYears, setExperienceYears] = useState(10);
  const [district, setDistrict] = useState('Prayagraj (Allahabad), UP');
  const [phone, setPhone] = useState('+91 94150 12345');
  const [assignedBatches, setAssignedBatches] = useState('Arjun-10 Super 30, Pratham-9 Alpha');

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setSubject('Physics & Science (UPMSP)');
    setDesignation('Senior Faculty & Academic Mentor');
    setQualification('M.Sc. Physics (Gold Medalist), B.Ed');
    setExperienceYears(10);
    setDistrict('Prayagraj (Allahabad), UP');
    setPhone('+91 94150 12345');
    setAssignedBatches('Arjun-10 Super 30, Pratham-9 Alpha');
    setEditingTeacher(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (teacher: TeacherUser) => {
    setEditingTeacher(teacher);
    setFullName(teacher.fullName);
    setEmail(teacher.email);
    setSubject(teacher.subject);
    setDesignation(teacher.designation);
    setQualification(teacher.qualification);
    setExperienceYears(teacher.experienceYears);
    setDistrict(teacher.district);
    setPhone(teacher.phone);
    setAssignedBatches(teacher.assignedBatches.join(', '));
    setShowAddModal(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    const batchesArray = assignedBatches.split(',').map(b => b.trim()).filter(Boolean);

    if (editingTeacher) {
      const updated = teachers.map(t => t.id === editingTeacher.id ? {
        ...t,
        fullName: fullName.trim(),
        email: email.trim(),
        subject: subject.trim(),
        designation: designation.trim(),
        qualification: qualification.trim(),
        experienceYears: Number(experienceYears) || 5,
        district: district.trim(),
        phone: phone.trim(),
        assignedBatches: batchesArray.length > 0 ? batchesArray : ['Arjun-10 Super 30']
      } : t);
      onUpdateTeachers(updated);
      onShowToast(`Faculty profile for ${fullName} updated successfully!`);
    } else {
      const newTeacher: TeacherUser = {
        id: `tch-${Date.now().toString().slice(-4)}`,
        fullName: fullName.trim(),
        email: email.trim(),
        role: 'teacher',
        subject: subject.trim(),
        designation: designation.trim(),
        qualification: qualification.trim(),
        experienceYears: Number(experienceYears) || 5,
        district: district.trim(),
        phone: phone.trim(),
        assignedBatches: batchesArray.length > 0 ? batchesArray : ['Arjun-10 Super 30'],
        avatarUrl: `https://images.unsplash.com/photo-${1534000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&w=200&q=80`,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        totalStudents: 120,
        rating: 4.9,
        status: 'Active',
        bio: `Specialist educator for ${subject.trim()}.`
      };
      onUpdateTeachers([newTeacher, ...teachers]);
      onShowToast(`Appointed faculty ${fullName} to academy team!`);
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteTeacher = (id: string, name: string) => {
    if (confirm(`Remove faculty member "${name}" from academy directory?`)) {
      onUpdateTeachers(teachers.filter(t => t.id !== id));
      onShowToast(`Faculty ${name} removed.`);
    }
  };

  const filteredTeachers = teachers.filter(t => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      t.fullName.toLowerCase().includes(searchLower) ||
      t.subject.toLowerCase().includes(searchLower) ||
      t.designation.toLowerCase().includes(searchLower) ||
      t.email.toLowerCase().includes(searchLower) ||
      t.district.toLowerCase().includes(searchLower);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#071610] p-5 rounded-2xl border border-cyan-900/50">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-black text-white">Faculty & Teachers Administration</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-mono">
              {teachers.length} Active Faculty
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Manage expert UPMSP educators, subject leads, AI instructors, and class assignments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onNavigateToTeacher && (
            <button
              onClick={onNavigateToTeacher}
              className="px-3.5 py-2 rounded-xl bg-cyan-950/60 border border-cyan-700/50 hover:bg-cyan-900/60 text-xs font-semibold text-cyan-300 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Teacher Portal Live</span>
            </button>
          )}

          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-900/40 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Appoint New Teacher</span>
          </button>
        </div>
      </div>

      {/* Teachers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTeachers.map(teacher => (
          <div
            key={teacher.id}
            className="bg-[#071610] border border-cyan-950 rounded-2xl p-5 hover:border-cyan-700/60 transition-all space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={teacher.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={teacher.fullName}
                  className="w-12 h-12 rounded-xl object-cover border border-cyan-500/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">{teacher.fullName}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {teacher.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-cyan-400 mt-0.5">{teacher.subject}</p>
                  <p className="text-[11px] text-gray-400">{teacher.designation}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(teacher)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-all cursor-pointer"
                  title="Edit Teacher Profile"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteTeacher(teacher.id, teacher.fullName)}
                  className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-300 transition-all cursor-pointer"
                  title="Remove Teacher"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-300 bg-black/40 p-3 rounded-xl border border-gray-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Qualification:</span>
                <span className="font-medium text-white truncate max-w-[240px]">{teacher.qualification}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Experience:</span>
                <span className="font-mono text-emerald-400 font-bold">{teacher.experienceYears} Years Exp</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Mentored Students:</span>
                <span className="font-mono text-cyan-300 font-bold">{teacher.totalStudents}+ UPMSP Aspirants</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Student Rating:</span>
                <span className="font-mono text-amber-300 font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {teacher.rating} / 5.0
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-800 text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" />
                {teacher.district}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-400" />
                {teacher.phone}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#071610] border border-cyan-800/60 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>{editingTeacher ? 'Edit Faculty Member' : 'Appoint New Teacher'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                  Faculty Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Er. Vikram Singh"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    Subject Specialty *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Physics & Science (UPMSP)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. faculty@fra-faculty.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Faculty - Science"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                  Academic Qualifications
                </label>
                <input
                  type="text"
                  placeholder="e.g. M.Tech (IIT Kanpur), B.Ed"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    District (UP)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Prayagraj, UP"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 94150 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
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
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingTeacher ? 'Save Changes' : 'Confirm Appointment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

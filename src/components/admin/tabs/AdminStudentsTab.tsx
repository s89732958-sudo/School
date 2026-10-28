import React, { useState } from 'react';
import { StudentUser } from '../../../types';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  UserCheck, 
  Sparkles, 
  Eye, 
  Filter, 
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers
} from 'lucide-react';

interface AdminStudentsTabProps {
  students: StudentUser[];
  onUpdateStudents: (students: StudentUser[]) => void;
  onShowToast: (msg: string) => void;
  onNavigateToStudent?: () => void;
}

export const AdminStudentsTab: React.FC<AdminStudentsTabProps> = ({
  students,
  onUpdateStudents,
  onShowToast,
  onNavigateToStudent,
}) => {
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'All' | 'Class 10' | 'Class 9'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentUser | null>(null);

  // Form state for adding/editing student
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState<'Class 9' | 'Class 10'>('Class 10');
  const [district, setDistrict] = useState('Prayagraj (Allahabad), UP');
  const [batchName, setBatchName] = useState('Arjun-10 Super 30 (UPMSP High Scorer)');
  const [attendancePct, setAttendancePct] = useState(95);

  const resetForm = () => {
    setFullName('');
    setRollNumber('');
    setEmail('');
    setGrade('Class 10');
    setDistrict('Prayagraj (Allahabad), UP');
    setBatchName('Arjun-10 Super 30 (UPMSP High Scorer)');
    setAttendancePct(95);
    setEditingStudent(null);
  };

  const openAddModal = () => {
    resetForm();
    const autoRoll = `FRA-2026-X0${Math.floor(50 + Math.random() * 49)}`;
    setRollNumber(autoRoll);
    setShowAddModal(true);
  };

  const openEditModal = (student: StudentUser) => {
    setEditingStudent(student);
    setFullName(student.fullName);
    setRollNumber(student.rollNumber);
    setEmail(student.email);
    setGrade(student.grade);
    setDistrict(student.district);
    setBatchName(student.batchName);
    setAttendancePct(student.attendancePct);
    setShowAddModal(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !rollNumber.trim()) return;

    if (editingStudent) {
      // Update existing student
      const updated = students.map(s => s.id === editingStudent.id ? {
        ...s,
        fullName: fullName.trim(),
        rollNumber: rollNumber.trim(),
        email: email.trim() || `${rollNumber.toLowerCase()}@fra-student.in`,
        grade,
        district: district.trim(),
        batchName: batchName.trim(),
        attendancePct: Number(attendancePct) || 90
      } : s);
      onUpdateStudents(updated);
      onShowToast(`Student ${fullName} profile updated successfully!`);
    } else {
      // Add new student
      const newStudent: StudentUser = {
        id: `std-${Date.now().toString().slice(-4)}`,
        fullName: fullName.trim(),
        rollNumber: rollNumber.trim(),
        email: email.trim() || `${rollNumber.toLowerCase()}@fra-student.in`,
        grade,
        board: 'UP Board (UPMSP)',
        medium: 'Hindi & English (Bilingual)',
        district: district.trim(),
        enrolledCourseIds: grade === 'Class 10' 
          ? ['up-class-10-board-accelerator', 'ai-prompt-engineering-foundations']
          : ['up-class-9-math-science', 'web-development-bootcamp'],
        avatarUrl: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&w=160&q=80`,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        attendancePct: Number(attendancePct) || 95,
        batchName: batchName.trim()
      };
      onUpdateStudents([newStudent, ...students]);
      onShowToast(`Enrolled student ${fullName} (${rollNumber}) in academy!`);
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove student "${name}" from the academy records?`)) {
      onUpdateStudents(students.filter(s => s.id !== id));
      onShowToast(`Student record for ${name} deleted.`);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesGrade = gradeFilter === 'All' || s.grade === gradeFilter;
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      s.fullName.toLowerCase().includes(searchLower) ||
      s.rollNumber.toLowerCase().includes(searchLower) ||
      s.district.toLowerCase().includes(searchLower) ||
      s.email.toLowerCase().includes(searchLower) ||
      s.batchName.toLowerCase().includes(searchLower);
    return matchesGrade && matchesSearch;
  });

  const avgAttendance = students.length > 0
    ? (students.reduce((acc, s) => acc + s.attendancePct, 0) / students.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      
      {/* Top Header Row with Actions & KPIs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#071610] p-5 rounded-2xl border border-emerald-900/50">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-black text-white">Students Administration & Roster</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono">
              {students.length} Total Enrolled
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Complete control over enrolled Class 9 & 10 UPMSP students, roll numbers, attendance records, and batch assignments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onNavigateToStudent && (
            <button
              onClick={onNavigateToStudent}
              className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-gray-300 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Preview Portal</span>
            </button>
          )}

          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll New Student</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#070e0a] border border-emerald-950">
          <span className="text-[11px] text-gray-400 block">Class 10 Aspirants</span>
          <span className="text-2xl font-black text-white font-mono">
            {students.filter(s => s.grade === 'Class 10').length}
          </span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">UPMSP High Scorers</span>
        </div>

        <div className="p-4 rounded-xl bg-[#070e0a] border border-emerald-950">
          <span className="text-[11px] text-gray-400 block">Class 9 Foundation</span>
          <span className="text-2xl font-black text-white font-mono">
            {students.filter(s => s.grade === 'Class 9').length}
          </span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Early Starters</span>
        </div>

        <div className="p-4 rounded-xl bg-[#070e0a] border border-emerald-950">
          <span className="text-[11px] text-gray-400 block">Avg Attendance Rate</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">
            {avgAttendance}%
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">Active Class Tracking</span>
        </div>

        <div className="p-4 rounded-xl bg-[#070e0a] border border-emerald-950">
          <span className="text-[11px] text-gray-400 block">UP Districts Covered</span>
          <span className="text-2xl font-black text-[#d4af37] font-mono">
            {new Set(students.map(s => s.district.split(',')[0].trim())).size}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">Statewide Reach</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#060c08] p-3.5 rounded-xl border border-emerald-950">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-[#030604] px-3 py-1.5 rounded-lg border border-gray-800">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name, roll number, district, or email..."
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

        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs text-gray-400 mr-1">Grade:</span>
          {(['All', 'Class 10', 'Class 9'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setGradeFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                gradeFilter === tab
                  ? 'bg-emerald-600 text-white'
                  : 'bg-black/30 text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Students Data Table */}
      <div className="overflow-x-auto rounded-2xl border border-emerald-950 bg-[#070e0a]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#050a07] text-gray-400 font-bold uppercase tracking-wider border-b border-emerald-950">
            <tr>
              <th className="py-3 px-4">Student Name & Roll No</th>
              <th className="py-3 px-4">Class & Medium</th>
              <th className="py-3 px-4">District (UP)</th>
              <th className="py-3 px-4">Assigned Cohort / Batch</th>
              <th className="py-3 px-4">Attendance</th>
              <th className="py-3 px-4">Joined Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-950/60 text-gray-300">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  No students found matching current filters.
                </td>
              </tr>
            ) : (
              filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-white/5 transition-all">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80'}
                        alt={student.fullName}
                        className="w-9 h-9 rounded-full object-cover border border-emerald-500/30"
                      />
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{student.fullName}</span>
                        </div>
                        <div className="text-[10px] font-mono text-emerald-400">
                          {student.rollNumber}
                        </div>
                        <div className="text-[10px] text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-emerald-300">{student.grade}</span>
                    <div className="text-[10px] text-gray-400">{student.board}</div>
                    <div className="text-[10px] text-gray-500">{student.medium}</div>
                  </td>

                  <td className="py-3 px-4 text-gray-300">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      {student.district}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-200 text-[11px] block truncate max-w-[220px]">
                      {student.batchName}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-black/50 overflow-hidden border border-emerald-950">
                        <div 
                          className="h-full bg-emerald-400 rounded-full" 
                          style={{ width: `${student.attendancePct}%` }} 
                        />
                      </div>
                      <span className="font-mono font-bold text-emerald-400">{student.attendancePct}%</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">
                    {student.joinedDate}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(student)}
                        className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 hover:bg-emerald-900/60 text-emerald-300 transition-all cursor-pointer"
                        title="Edit Student Info"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id, student.fullName)}
                        className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/40 hover:bg-red-900/60 text-red-300 transition-all cursor-pointer"
                        title="Remove Student"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#071610] border border-emerald-800/60 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <span>{editingStudent ? 'Edit Student Profile' : 'Enroll New UP Board Student'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aryan Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FRA-2026-X042"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    Grade / Class *
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => {
                      const g = e.target.value as 'Class 9' | 'Class 10';
                      setGrade(g);
                      if (g === 'Class 10') setBatchName('Arjun-10 Super 30 (UPMSP High Scorer)');
                      else setBatchName('Pratham-9 Alpha Foundation');
                    }}
                    className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Class 10">Class 10 (UPMSP Board)</option>
                    <option value="Class 9">Class 9 (Foundation)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                  Student Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. aryan.sharma26@fra-student.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    District (Uttar Pradesh) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prayagraj, UP"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                    Attendance Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={attendancePct}
                    onChange={(e) => setAttendancePct(Number(e.target.value))}
                    className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-bold uppercase tracking-wider mb-1">
                  Assigned Batch / Cohort *
                </label>
                <input
                  type="text"
                  required
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  className="w-full bg-[#030604] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                />
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
                  <span>{editingStudent ? 'Save Changes' : 'Confirm Enrollment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import { StudentUser, TeacherUser, AcademyPost, Course, AcademyNotice, InquiryRecord } from '../types';
import { DEMO_STUDENTS } from '../data/studentData';
import { DEMO_TEACHERS } from '../data/teacherData';
import { INITIAL_POSTS } from '../data/postsData';

const BASE_URL = '/api';

export interface ApiStatsResponse {
  totalStudents: number;
  totalTeachers: number;
  totalPosts: number;
  totalCourses: number;
  totalInquiries: number;
  activeBatches: number;
  serverStatus: string;
  uptime: number;
}

export const apiService = {
  // --- HEALTH & STATS ---
  async getHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (res.ok) return await res.json();
    } catch {
      // offline fallback
    }
    return { status: 'ok', timestamp: new Date().toISOString() };
  },

  async getStats(): Promise<ApiStatsResponse> {
    try {
      const res = await fetch(`${BASE_URL}/stats`);
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    return {
      totalStudents: 2,
      totalTeachers: 4,
      totalPosts: 4,
      totalCourses: 4,
      totalInquiries: 3,
      activeBatches: 3,
      serverStatus: 'active-local',
      uptime: Date.now()
    };
  },

  // --- STUDENTS ---
  async getStudents(): Promise<StudentUser[]> {
    try {
      const res = await fetch(`${BASE_URL}/students`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem('FRA_SYNC_STUDENTS', JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {
      console.warn('API getStudents failed, using local fallback:', e);
    }
    const cached = localStorage.getItem('FRA_SYNC_STUDENTS');
    return cached ? JSON.parse(cached) : DEMO_STUDENTS;
  },

  async createStudent(student: Omit<StudentUser, 'id'>): Promise<StudentUser> {
    const newStudent: StudentUser = {
      ...student,
      id: `std-${Date.now().toString().slice(-4)}`
    };
    try {
      const res = await fetch(`${BASE_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API createStudent failed, using local storage:', e);
    }
    const current = await this.getStudents();
    const updated = [newStudent, ...current];
    localStorage.setItem('FRA_SYNC_STUDENTS', JSON.stringify(updated));
    return newStudent;
  },

  async updateStudent(id: string, updates: Partial<StudentUser>): Promise<StudentUser | null> {
    try {
      const res = await fetch(`${BASE_URL}/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API updateStudent failed, updating local:', e);
    }
    const current = await this.getStudents();
    const updated = current.map(s => s.id === id ? { ...s, ...updates } : s);
    localStorage.setItem('FRA_SYNC_STUDENTS', JSON.stringify(updated));
    return updated.find(s => s.id === id) || null;
  },

  async deleteStudent(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/students/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch (e) {
      console.warn('API deleteStudent failed, updating local:', e);
    }
    const current = await this.getStudents();
    const updated = current.filter(s => s.id !== id);
    localStorage.setItem('FRA_SYNC_STUDENTS', JSON.stringify(updated));
    return true;
  },

  // --- TEACHERS ---
  async getTeachers(): Promise<TeacherUser[]> {
    try {
      const res = await fetch(`${BASE_URL}/teachers`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem('FRA_SYNC_TEACHERS', JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {
      console.warn('API getTeachers failed, using local fallback:', e);
    }
    const cached = localStorage.getItem('FRA_SYNC_TEACHERS');
    return cached ? JSON.parse(cached) : DEMO_TEACHERS;
  },

  async createTeacher(teacher: Omit<TeacherUser, 'id'>): Promise<TeacherUser> {
    const newTeacher: TeacherUser = {
      ...teacher,
      id: `tch-${Date.now().toString().slice(-4)}`
    };
    try {
      const res = await fetch(`${BASE_URL}/teachers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeacher)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API createTeacher failed, using local:', e);
    }
    const current = await this.getTeachers();
    const updated = [newTeacher, ...current];
    localStorage.setItem('FRA_SYNC_TEACHERS', JSON.stringify(updated));
    return newTeacher;
  },

  async updateTeacher(id: string, updates: Partial<TeacherUser>): Promise<TeacherUser | null> {
    try {
      const res = await fetch(`${BASE_URL}/teachers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API updateTeacher failed, using local:', e);
    }
    const current = await this.getTeachers();
    const updated = current.map(t => t.id === id ? { ...t, ...updates } : t);
    localStorage.setItem('FRA_SYNC_TEACHERS', JSON.stringify(updated));
    return updated.find(t => t.id === id) || null;
  },

  async deleteTeacher(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/teachers/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch (e) {
      console.warn('API deleteTeacher failed, using local:', e);
    }
    const current = await this.getTeachers();
    const updated = current.filter(t => t.id !== id);
    localStorage.setItem('FRA_SYNC_TEACHERS', JSON.stringify(updated));
    return true;
  },

  // --- POSTS & NOTICES ---
  async getPosts(): Promise<AcademyPost[]> {
    try {
      const res = await fetch(`${BASE_URL}/posts`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem('FRA_SYNC_POSTS', JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {
      console.warn('API getPosts failed, using local fallback:', e);
    }
    const cached = localStorage.getItem('FRA_SYNC_POSTS');
    return cached ? JSON.parse(cached) : INITIAL_POSTS;
  },

  async createPost(post: Omit<AcademyPost, 'id' | 'createdAt' | 'likesCount' | 'commentsCount'>): Promise<AcademyPost> {
    const newPost: AcademyPost = {
      ...post,
      id: `post-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      likesCount: 0,
      commentsCount: 0
    };
    try {
      const res = await fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API createPost failed, using local:', e);
    }
    const current = await this.getPosts();
    const updated = [newPost, ...current];
    localStorage.setItem('FRA_SYNC_POSTS', JSON.stringify(updated));
    return newPost;
  },

  async updatePost(id: string, updates: Partial<AcademyPost>): Promise<AcademyPost | null> {
    try {
      const res = await fetch(`${BASE_URL}/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API updatePost failed, using local:', e);
    }
    const current = await this.getPosts();
    const updated = current.map(p => p.id === id ? { ...p, ...updates } : p);
    localStorage.setItem('FRA_SYNC_POSTS', JSON.stringify(updated));
    return updated.find(p => p.id === id) || null;
  },

  async deletePost(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/posts/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch (e) {
      console.warn('API deletePost failed, using local:', e);
    }
    const current = await this.getPosts();
    const updated = current.filter(p => p.id !== id);
    localStorage.setItem('FRA_SYNC_POSTS', JSON.stringify(updated));
    return true;
  },

  async likePost(id: string): Promise<number> {
    try {
      const res = await fetch(`${BASE_URL}/posts/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        return data.likesCount;
      }
    } catch {
      // local
    }
    const current = await this.getPosts();
    let newLikes = 0;
    const updated = current.map(p => {
      if (p.id === id) {
        newLikes = p.likesCount + 1;
        return { ...p, likesCount: newLikes };
      }
      return p;
    });
    localStorage.setItem('FRA_SYNC_POSTS', JSON.stringify(updated));
    return newLikes;
  }
};

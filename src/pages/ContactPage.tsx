import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageCircle, Youtube, Send as TelegramIcon } from 'lucide-react';
import { ContactFormData, SiteSettings } from '../types';

interface ContactPageProps {
  initialSubject?: string;
  onSuccessNotice: (msg: string) => void;
  onAddInquiry?: (data: ContactFormData) => void;
  siteSettings?: SiteSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  initialSubject = '',
  onSuccessNotice,
  onAddInquiry,
  siteSettings,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    contactNumber: '',
    email: '',
    role: 'Student (Class 10)',
    district: '',
    inquiryType: 'Course Admissions',
    message: initialSubject ? `Inquiring regarding course: ${initialSubject}` : '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onAddInquiry) {
      onAddInquiry(formData);
    }
    setTimeout(() => {
      onSuccessNotice(`Thank you, ${formData.fullName}! Your message has been received.`);
    }, 500);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      contactNumber: '',
      email: '',
      role: 'Student (Class 10)',
      district: '',
      inquiryType: 'Course Admissions',
      message: '',
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16 max-w-6xl mx-auto space-y-14">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
          <Mail className="w-3.5 h-3.5" />
          <span>Get in Touch With Future Ready Academy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          We Are Here to Guide You
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          Whether you are a student exploring UP Board Class 9 or 10 preparation, a parent inquiring about syllabus progress, or an educator looking to collaborate, reach out to us.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info & Placeholders (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Info Card */}
          <div className="p-7 rounded-2xl bg-[#070e0b] border border-emerald-950 space-y-5">
            <h2 className="text-base font-bold text-white tracking-wide uppercase text-xs font-mono text-[#d4af37]">
              Official Communication Desk
            </h2>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3 text-gray-300">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase block">Regional Academy Hub</span>
                  <p className="text-gray-200 font-medium">
                    {siteSettings?.academyLocation || 'Lucknow & Prayagraj Academic Centers, Uttar Pradesh, India'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-300">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase block">Admissions & Inquiries</span>
                  <p className="text-emerald-400 font-mono">
                    {siteSettings?.supportEmail || 'support@futurereadyacademy.in'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-300">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase block">Student Helpline</span>
                  <p className="text-gray-200 font-mono">
                    {siteSettings?.helplinePhone || '+91 98765 43210'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-300">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase block">Counseling Hours</span>
                  <p className="text-gray-200">
                    {siteSettings?.counselingHours || 'Monday to Saturday: 9:00 AM – 8:00 PM IST'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Channels Placeholders */}
          <div className="p-6 rounded-2xl bg-[#070e0b] border border-emerald-950 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Official Student Communities
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Connect with fellow UP Board learners in moderated study circles.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#040806] border border-emerald-950 text-gray-300">
                <div className="flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-400" />
                  <span>YouTube Masterclasses</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">[Placeholder]</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#040806] border border-emerald-950 text-gray-300">
                <div className="flex items-center gap-2">
                  <TelegramIcon className="w-4 h-4 text-sky-400" />
                  <span>Telegram Doubt Solver Group</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">[Placeholder]</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#040806] border border-emerald-950 text-gray-300">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Community Noticeboard</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">[Placeholder]</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 columns) */}
        <div className="lg:col-span-7">
          <div className="p-7 sm:p-9 rounded-2xl bg-[#070e0b] border border-emerald-800/60 shadow-lg">
            
            {submitted ? (
              <div className="py-14 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/60 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Message Successfully Sent</h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to Future Ready Academy. An academic counselor will review your inquiry and connect with you on your provided contact details.
                </p>
                <div className="pt-4">
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-semibold transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Send an Inquiry</h3>
                  <p className="text-xs text-gray-400">
                    Fill out the form below. We typically respond within 24 hours.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ankit Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#040806] border border-emerald-950 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Contact Number (WhatsApp/Mobile) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#040806] border border-emerald-950 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ankit@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#040806] border border-emerald-950 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      District / City in UP *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lucknow, Kanpur, Agra, Prayagraj"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#040806] border border-emerald-950 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      I am a:
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#040806] border border-emerald-950 text-white focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                    >
                      <option>Student (Class 9)</option>
                      <option>Student (Class 10)</option>
                      <option>Parent / Guardian</option>
                      <option>School Teacher / Educator</option>
                      <option>Prospective Ambassador Partner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#040806] border border-emerald-950 text-white focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                    >
                      <option>Course Admissions</option>
                      <option>Ambassador Partnership</option>
                      <option>Curriculum Guidance</option>
                      <option>Technical Support</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Your Question or Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you would like to ask or achieve..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#040806] border border-emerald-950 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold text-xs sm:text-sm hover:brightness-110 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry to Admissions Desk</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

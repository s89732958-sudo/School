import React, { useState } from 'react';
import { X, CheckCircle2, Award, Send, Users, MapPin, Phone, Mail } from 'lucide-react';
import { AmbassadorApplicationData } from '../types';

interface AmbassadorModalProps {
  onClose: () => void;
  onSuccessNotice: (msg: string) => void;
  onAddAmbassador?: (data: AmbassadorApplicationData) => void;
}

export const AmbassadorModal: React.FC<AmbassadorModalProps> = ({
  onClose,
  onSuccessNotice,
  onAddAmbassador,
}) => {
  const [formData, setFormData] = useState<AmbassadorApplicationData>({
    fullName: '',
    contactNumber: '',
    email: '',
    cityOrDistrict: '',
    currentRole: 'Coaching Tutor',
    institutionName: '',
    studentReachEstimate: '25-50 Students',
    whyJoin: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onAddAmbassador) {
      onAddAmbassador(formData);
    }
    setTimeout(() => {
      onSuccessNotice(
        `Thank you ${formData.fullName}! Your Ambassador application for ${formData.cityOrDistrict || 'Uttar Pradesh'} has been submitted.`
      );
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="relative bg-[#070e0b] border border-emerald-700/60 rounded-2xl max-w-xl w-full p-6 sm:p-8 overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-emerald-950/60 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-600/30 text-[#d4af37] text-[11px] font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            Partner Network
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Apply as Future Ready Ambassador
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Partner with us to empower UP Board Class 9 & 10 students in your local district with high-standard academic coaching and practical AI/tech skills.
          </p>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/60 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-white">Application Successfully Recorded</h4>
            <p className="text-xs text-gray-300 max-w-md mx-auto">
              Our academic partnership coordinator will contact you directly on WhatsApp / Phone within 24 to 48 hours with orientation materials and partner guidelines.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#040806] border border-emerald-950 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  WhatsApp / Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#040806] border border-emerald-950 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
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
                  placeholder="ramesh@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#040806] border border-emerald-950 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  City / District in UP *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lucknow, Varanasi, Prayagraj, Kanpur"
                  value={formData.cityOrDistrict}
                  onChange={(e) => setFormData({ ...formData, cityOrDistrict: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#040806] border border-emerald-950 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Your Current Role
                </label>
                <select
                  value={formData.currentRole}
                  onChange={(e) => setFormData({ ...formData, currentRole: e.target.value as any })}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#040806] border border-emerald-950 text-white focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                >
                  <option>Coaching Tutor</option>
                  <option>School Teacher</option>
                  <option>College Student / Mentor</option>
                  <option>Community Organizer</option>
                  <option>Parent Advocate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Estimated Student Reach
                </label>
                <select
                  value={formData.studentReachEstimate}
                  onChange={(e) => setFormData({ ...formData, studentReachEstimate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#040806] border border-emerald-950 text-white focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                >
                  <option>10-25 Students</option>
                  <option>25-50 Students</option>
                  <option>50-150 Students</option>
                  <option>150+ Students (Institute / School)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Tell us briefly why you wish to partner with Future Ready Academy
              </label>
              <textarea
                rows={3}
                required
                placeholder="Mention how you plan to guide Class 9 & 10 UP Board students in your locality..."
                value={formData.whyJoin}
                onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-[#040806] border border-emerald-950 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#f4d775] text-black font-bold text-xs sm:text-sm hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Ambassador Application</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Mail, Phone, MapPin, User, Calendar, Edit2, CheckCircle2, ShieldCheck, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import { useProfile } from '../../context/ProfileContext.jsx';
import { Loader2 } from 'lucide-react';

export default function PersonalInfoCard() {
  const { user } = useAuth();
  const { profile, loading, profileCompletion, updateProfileSection } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  
  // Local form data
  const [formData, setFormData] = useState({
    phone: '',
    location: '',
    gender: 'Prefer not to say',
    dob: '',
    title: 'Professional'
  });

  // Sync profile data to form when loaded or updated
  React.useEffect(() => {
    if (profile?.personalInfo) {
      setFormData({
        phone: profile.personalInfo.phone || '',
        location: profile.personalInfo.location || '',
        gender: profile.personalInfo.gender || 'Prefer not to say',
        dob: profile.personalInfo.dob || '',
        title: profile.personalInfo.title || 'Professional'
      });
    }
  }, [profile]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfileSection({ personalInfo: formData });
      setIsEditing(false);
      toast.success('Personal Information updated successfully!');
    } catch (err) {
      // Error handled by context
    }
  };

  const handleCancel = () => {
    if (profile?.personalInfo) {
      setFormData({
        phone: profile.personalInfo.phone || '',
        location: profile.personalInfo.location || '',
        gender: profile.personalInfo.gender || 'Prefer not to say',
        dob: profile.personalInfo.dob || '',
        title: profile.personalInfo.title || 'Professional'
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return <div className="h-48 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      
      {/* Header section with cover color */}
      <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
        <button 
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-all"
          title={isEditing ? 'Cancel Edit' : 'Edit Profile'}
        >
          {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
        </button>
      </div>

      <div className="px-6 pb-6 relative">
        
        {/* Profile Avatar & Completion Circle */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-12 sm:-mt-16 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative">
              {/* Circular Progress border trick using Tailwind */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-slate-800 bg-slate-100 flex items-center justify-center overflow-hidden shadow-md">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=f8fafc&color=2563eb&bold=true&size=128`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Verified Badge */}
              <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-blue-600 rounded-full p-1 border-2 border-white dark:border-slate-800" title="Verified Account">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="text-center sm:text-left mt-2 sm:mt-16">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                {user?.name}
              </h2>
              <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                {formData.title}
              </p>
            </div>
          </div>

          {/* Profile Completion Widget */}
          <div className="mt-6 sm:mt-0 bg-blue-50 dark:bg-slate-700/50 rounded-xl p-3 flex items-center gap-4 border border-blue-100 dark:border-slate-700 w-full sm:w-auto">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Profile Completion</span>
              <span className="text-lg font-bold text-blue-700 dark:text-blue-400">{profileCompletion}%</span>
            </div>
            {/* Simple CSS radial progress simulation */}
            <div className="w-12 h-12 rounded-full bg-blue-200 dark:bg-slate-600 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-blue-600" style={{ clipPath: `polygon(0 0, 100% 0, 100% ${profileCompletion}%, 0 ${profileCompletion}%)` }}></div>
               <div className="w-10 h-10 bg-blue-50 dark:bg-slate-800 rounded-full z-10 flex items-center justify-center">
                 <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
               </div>
            </div>
          </div>
        </div>

        {/* Form OR Display Area */}
        {isEditing ? (
          // --- EDIT MODE ---
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Professional Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange}
                  placeholder="e.g. Frontend Developer"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg outline-none text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</label>
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gender</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date of Birth</label>
                <input 
                  type="date" 
                  name="dob" 
                  value={formData.dob} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button 
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        ) : (
          // --- VIEW MODE ---
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Email Address</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  {user?.email} <ShieldCheck className="w-4 h-4 text-green-500" title="Verified"/>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Phone Number</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  {profile?.personalInfo?.phone || 'Not set'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Location</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile?.personalInfo?.location || 'Not set'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Gender</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile?.personalInfo?.gender || 'Prefer not to say'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Date of Birth</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {profile?.personalInfo?.dob ? new Date(profile.personalInfo.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set'}
                </p>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

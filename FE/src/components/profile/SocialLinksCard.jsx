import React, { useState } from 'react';
import { Link2, Edit2, Save, X, FolderGit2, Briefcase, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProfile } from '../../context/ProfileContext.jsx';

export default function SocialLinksCard() {
  const { profile, updateProfileSection } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    linkedin: '',
    github: '',
    portfolio: ''
  });

  React.useEffect(() => {
    if (profile?.socialLinks) {
      setFormData({
        linkedin: profile.socialLinks.linkedin || '',
        github: profile.socialLinks.github || '',
        portfolio: profile.socialLinks.portfolio || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfileSection({ socialLinks: formData });
      setIsEditing(false);
      toast.success('Social links updated!');
    } catch (err) {
      // Handled by context
    }
  };

  const handleCancel = () => {
    setFormData({
      linkedin: profile?.socialLinks?.linkedin || '',
      github: profile?.socialLinks?.github || '',
      portfolio: profile?.socialLinks?.portfolio || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Link2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Social Links
        </h3>
        <button 
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-full transition-all"
        >
          {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
        </button>
      </div>

      {isEditing ? (
        // --- EDIT MODE ---
        <div className="space-y-4 animate-in fade-in duration-300">
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Briefcase className="w-3 h-3"/> LinkedIn URL</label>
            <input 
              type="text" 
              name="linkedin" 
              value={formData.linkedin} 
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1"><FolderGit2 className="w-3 h-3"/> GitHub URL</label>
            <input 
              type="text" 
              name="github" 
              value={formData.github} 
              onChange={handleChange}
              placeholder="https://github.com/username"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Globe className="w-3 h-3"/> Portfolio URL</label>
            <input 
              type="text" 
              name="portfolio" 
              value={formData.portfolio} 
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
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
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </div>
      ) : (
        // --- VIEW MODE ---
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-in fade-in duration-300">
          
          <a href={profile?.socialLinks?.linkedin || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium truncate max-w-[150px]">{profile?.socialLinks?.linkedin ? profile.socialLinks.linkedin.replace('https://', '') : 'Add LinkedIn'}</span>
          </a>

          <a href={profile?.socialLinks?.github || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium truncate max-w-[150px]">{profile?.socialLinks?.github ? profile.socialLinks.github.replace('https://', '') : 'Add GitHub'}</span>
          </a>

          <a href={profile?.socialLinks?.portfolio || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium truncate max-w-[150px]">{profile?.socialLinks?.portfolio ? profile.socialLinks.portfolio.replace('https://', '') : 'Add Portfolio'}</span>
          </a>

        </div>
      )}

    </div>
  );
}

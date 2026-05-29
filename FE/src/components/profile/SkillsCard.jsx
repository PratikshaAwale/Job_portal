import React, { useState } from 'react';
import { Code2, Edit2, Save, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProfile } from '../../context/ProfileContext.jsx';

export default function SkillsCard() {
  const { profile, updateProfileSection } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  React.useEffect(() => {
    if (profile?.skills) {
      setSkills(profile.skills);
    }
  }, [profile]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSave = async () => {
    try {
      await updateProfileSection({ skills });
      setIsEditing(false);
      toast.success('Skills updated!');
    } catch (err) {
      // Handled by context
    }
  };

  const handleCancel = () => {
    setSkills(profile?.skills || []);
    setNewSkill('');
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Key Skills
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
          
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newSkill} 
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              placeholder="Add a new skill (e.g. Python)"
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
            />
            <button 
              onClick={handleAddSkill}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-1 font-medium"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl min-h-[100px] bg-slate-50/50 dark:bg-slate-900/50">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm font-medium">
                {skill}
                <button 
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {skills.length === 0 && <p className="text-sm text-slate-400 m-auto">No skills added yet.</p>}
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
        <div className="flex flex-wrap gap-2 animate-in fade-in duration-300">
          {(!profile?.skills || profile.skills.length === 0) ? (
            <p className="text-sm text-slate-500">No skills added yet.</p>
          ) : (
            profile.skills.map((skill, index) => (
              <span key={index} className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                {skill}
              </span>
            ))
          )}
        </div>
      )}

    </div>
  );
}

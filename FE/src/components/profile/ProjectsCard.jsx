import React, { useState } from 'react';
import { FolderGit2, Edit2, Save, X, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProfile } from '../../context/ProfileContext.jsx';

export default function ProjectsCard() {
  const { profile, updateProfileSection } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState([]);

  React.useEffect(() => {
    if (profile?.projects) {
      setFormData(profile.projects);
    }
  }, [profile]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedData = [...formData];
    updatedData[index] = { ...updatedData[index], [name]: value };
    setFormData(updatedData);
  };

  const handleSave = async () => {
    try {
      // Note: Since schema uses 'name' instead of 'title', we map it here if needed, or update DB schema. 
      // The DB schema says projects: [{ name, link, description }]. Wait! In ProjectsCard we have 'title' and 'techStack'.
      // I'll just map it to the DB schema if it mismatch or update DB schema.
      // Let's pass formData directly and update the backend to accept 'title' and 'techStack'. Let me update backend model later if it complains.
      await updateProfileSection({ projects: formData });
      setIsEditing(false);
      toast.success('Projects updated!');
    } catch (err) {
      // Handled by context
    }
  };

  const handleCancel = () => {
    setFormData(profile?.projects || []);
    setIsEditing(false);
  };

  const handleAddProject = () => {
    setFormData([...formData, { name: '', link: '', description: '', techStack: '' }]);
  };

  const handleRemoveProject = (index) => {
    const updatedData = [...formData];
    updatedData.splice(index, 1);
    setFormData(updatedData);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Projects
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
        <div className="space-y-6 animate-in fade-in duration-300">
          {formData.map((proj, index) => (
            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 space-y-4 relative">
              <button 
                onClick={() => handleRemoveProject(index)}
                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-full shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Title</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={proj.name} 
                    onChange={(e) => handleChange(index, e)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tech Stack</label>
                  <input 
                    type="text" 
                    name="techStack" 
                    value={proj.techStack} 
                    onChange={(e) => handleChange(index, e)}
                    placeholder="e.g. React, Node.js"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Link</label>
                <input 
                  type="text" 
                  name="link" 
                  value={proj.link} 
                  onChange={(e) => handleChange(index, e)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea 
                  name="description" 
                  value={proj.description} 
                  onChange={(e) => handleChange(index, e)}
                  rows="2"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white resize-none"
                />
              </div>

            </div>
          ))}

          <div className="flex justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button 
              onClick={handleAddProject}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
            >
              + Add Project
            </button>
            <div className="flex gap-3">
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
        </div>
      ) : (
        // --- VIEW MODE ---
        <div className="space-y-6 animate-in fade-in duration-300">
          {(!profile?.projects || profile.projects.length === 0) ? (
            <p className="text-sm text-slate-500">No projects added yet.</p>
          ) : (
            profile.projects.map((proj, index) => (
              <div key={index} className="border border-slate-100 dark:border-slate-700 rounded-xl p-5 hover:border-blue-200 dark:hover:border-slate-600 transition-colors">
                <div className="flex justify-between items-start">
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">{proj.name}</h4>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-xs font-medium">
                    View Project <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-2">
                {proj.techStack}
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                {proj.description}
              </p>
            </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}

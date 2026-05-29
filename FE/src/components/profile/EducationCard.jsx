import React, { useState } from 'react';
import { GraduationCap, Edit2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProfile } from '../../context/ProfileContext.jsx';

export default function EducationCard() {
  const { profile, updateProfileSection } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  
  // Local form state
  const [formData, setFormData] = useState([]);

  React.useEffect(() => {
    if (profile?.education) {
      setFormData(profile.education);
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
      await updateProfileSection({ education: formData });
      setIsEditing(false);
      toast.success('Education details updated!');
    } catch (err) {
      // Error handled by context
    }
  };

  const handleCancel = () => {
    setFormData(profile?.education || []);
    setIsEditing(false);
  };

  const handleAddEducation = () => {
    setFormData([...formData, { degree: '', college: '', year: '', score: '' }]);
  };

  const handleRemoveEducation = (index) => {
    const updatedData = [...formData];
    updatedData.splice(index, 1);
    setFormData(updatedData);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Education
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
          {formData.map((edu, index) => (
            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 space-y-4 relative">
              <button 
                onClick={() => handleRemoveEducation(index)}
                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 rounded-full shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Degree / Course</label>
                <input 
                  type="text" 
                  name="degree" 
                  value={edu.degree} 
                  onChange={(e) => handleChange(index, e)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">College / University</label>
                <input 
                  type="text" 
                  name="college" 
                  value={edu.college} 
                  onChange={(e) => handleChange(index, e)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration / Year</label>
                  <input 
                    type="text" 
                    name="year" 
                    value={edu.year} 
                    onChange={(e) => handleChange(index, e)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Score / CGPA</label>
                  <input 
                    type="text" 
                    name="score" 
                    value={edu.score} 
                    onChange={(e) => handleChange(index, e)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-white"
                  />
                </div>
              </div>

            </div>
          ))}

          <div className="flex justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button 
              onClick={handleAddEducation}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
            >
              + Add Education
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
          {(!profile?.education || profile.education.length === 0) ? (
            <p className="text-sm text-slate-500">No education details added yet.</p>
          ) : (
            profile.education.map((edu, index) => (
              <div key={index} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-700">
              {/* Timeline Dot */}
              <div className="absolute left-[-4px] top-2 w-[10px] h-[10px] rounded-full bg-blue-600 border-[2px] border-white dark:border-slate-800"></div>
              
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">{edu.degree}</h4>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">{edu.college}</p>
              
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">{edu.year}</span>
                <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md font-semibold text-slate-700 dark:text-slate-300">{edu.score}</span>
              </div>
            </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}

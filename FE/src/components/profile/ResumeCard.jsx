import React, { useState } from 'react';
import { FileText, UploadCloud, Trash2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProfile } from '../../context/ProfileContext.jsx';

export default function ResumeCard() {
  const { profile, updateProfileSection } = useProfile();
  const [resumeName, setResumeName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  React.useEffect(() => {
    if (profile?.resume) {
      setResumeName(profile.resume);
    } else {
      setResumeName('');
    }
  }, [profile]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate file upload delay
      setIsUploading(true);
      setTimeout(async () => {
        try {
          await updateProfileSection({ resume: file.name });
          setResumeName(file.name);
          toast.success('Resume uploaded successfully!');
        } catch (err) {
          // Context handles error toast
        } finally {
          setIsUploading(false);
        }
      }, 1500);
    }
  };

  const handleDelete = async () => {
    try {
      await updateProfileSection({ resume: '' });
      setResumeName('');
      toast.success('Resume deleted!');
    } catch (err) {
      // handled
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Resume
        </h3>
      </div>

      {resumeName ? (
        // --- HAS RESUME VIEW ---
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{resumeName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" /> Uploaded successfully
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors">
              Download
            </button>
            <button 
              onClick={handleDelete}
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors flex items-center justify-center"
              title="Delete Resume"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        // --- UPLOAD VIEW ---
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors relative">
          {isUploading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Uploading your resume...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Upload your resume</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
              
              <label className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors inline-block">
                Browse Files
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
              </label>
            </>
          )}
        </div>
      )}

    </div>
  );
}

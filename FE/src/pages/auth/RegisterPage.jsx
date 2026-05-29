import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, Loader2, Mail, Lock, User, Eye, EyeOff, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Job Seeker');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await register(name, email, password, role);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 font-sans text-slate-900 p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-3xl opacity-50"></div>

      <div className="w-full max-w-2xl bg-white rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 min-h-[500px] border border-slate-200">
        <Link to="/" className="absolute top-6 right-6 z-30 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-300 group">
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </Link>

        {/* Branding Section */}
        <div className="md:w-5/12 bg-indigo-600 text-white p-6 md:p-10 flex flex-col justify-start items-start text-left relative overflow-hidden pt-10 md:pt-16">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 flex flex-col items-start w-full max-w-md">
            <h1 className="text-3xl font-extrabold mb-3 tracking-tight">Job Portal</h1>
            <div className="w-full h-1 bg-white/30 rounded-full mb-6"></div>
            <p className="text-lg text-indigo-100 leading-snug font-medium">
              Join thousands of professionals and top companies today.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 p-6 md:p-10 md:pt-16 flex items-start justify-center bg-white overflow-y-auto">
          <div className="w-full max-w-md">
            <div className="mb-8">
               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h2>
               <p className="text-xs text-slate-500 mt-1 font-medium">Get started with your free account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Role Selection — styled card radio buttons */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Register As</label>
                <div className="flex gap-3">

                  {/* Job Seeker Card */}
                  <label htmlFor="reg-role-jobseeker" className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      id="reg-role-jobseeker"
                      name="registerRole"
                      value="Job Seeker"
                      checked={role === 'Job Seeker'}
                      onChange={() => setRole('Job Seeker')}
                      className="sr-only"
                    />
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.75rem',
                        border: role === 'Job Seeker' ? '2px solid #4f46e5' : '2px solid #e2e8f0',
                        backgroundColor: role === 'Job Seeker' ? '#eef2ff' : '#f8fafc',
                        transition: 'all 0.2s ease',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: role === 'Job Seeker' ? '#4f46e5' : '#64748b',
                      }}
                    >
                      <User style={{ width: '1.1rem', height: '1.1rem' }} />
                      Job Seeker
                    </div>
                  </label>

                  {/* Recruiter Card */}
                  <label htmlFor="reg-role-recruiter" className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      id="reg-role-recruiter"
                      name="registerRole"
                      value="Recruiter"
                      checked={role === 'Recruiter'}
                      onChange={() => setRole('Recruiter')}
                      className="sr-only"
                    />
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.75rem',
                        border: role === 'Recruiter' ? '2px solid #4f46e5' : '2px solid #e2e8f0',
                        backgroundColor: role === 'Recruiter' ? '#eef2ff' : '#f8fafc',
                        transition: 'all 0.2s ease',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: role === 'Recruiter' ? '#4f46e5' : '#64748b',
                      }}
                    >
                      <Briefcase style={{ width: '1.1rem', height: '1.1rem' }} />
                      Recruiter
                    </div>
                  </label>

                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    required 
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    required 
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    minLength={6}
                    placeholder="Create a password"
                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl mt-6 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : `Create ${role} Account`}
              </button>

              <div className="text-center mt-6">
                <span className="text-sm text-slate-500 font-medium">Already have an account? </span>
                <Link to="/login" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

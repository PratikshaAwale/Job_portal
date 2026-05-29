import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { motion } from 'framer-motion';
import { 
  Building, MapPin, DollarSign, Calendar, Clock, 
  Briefcase, ChevronLeft, Send, CheckCircle, FileText, Star 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { formatDistanceToNow } from 'date-fns';

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [applyLoading, setApplyLoading] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error('Fetch job error', err);
        setError('Could not load job details. The job might have been removed or you may need to log in.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      toast.error('Please log in to apply for this job');
      navigate('/login');
      return;
    }
    
    if (user.role === 'employer') {
      toast.error('Recruiters cannot apply for jobs');
      return;
    }

    setApplyLoading(true);
    try {
      await api.post(`/jobs/${id}/apply`);
      toast.success('Successfully applied!');
      setJob(prev => ({ ...prev, hasApplied: true, applicationStatus: 'Pending' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--db-bg)' }}>
        <div className="metric-card-icon icon-blue" style={{ animation: 'spin 1s linear infinite' }}>
          <Briefcase className="w-6 h-6" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div style={{ minHeight: '100vh', padding: '4rem 2rem', backgroundColor: 'var(--db-bg)' }}>
        <div className="glass-panel" style={{ maxWidth: '40rem', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--db-text)' }}>Oops!</h2>
          <p style={{ color: 'var(--db-text-muted)', marginBottom: '2rem' }}>{error || 'Job not found'}</p>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ChevronLeft className="w-4 h-4" /> Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--db-bg)', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1.5rem' }}>
        
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--db-text-muted)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.875rem', fontWeight: 500 }}>
          <ChevronLeft className="w-4 h-4" /> Back to Browse
        </Link>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel" 
          style={{ padding: '2.5rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}
        >
          {/* Decorative background element */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(0,0,0,0) 70%)', transform: 'translate(30%, -30%)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', md: { flexDirection: 'row' }, gap: '2rem', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: '4rem', height: '4rem', borderRadius: '1rem', backgroundColor: '#eff6ff', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#2563eb', fontSize: '1.5rem', fontWeight: 800 }}>
                  {job.companyName.substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--db-text)', lineHeight: 1.2 }}>{job.title}</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--db-text-muted)', fontSize: '1rem' }}>
                    <Building className="w-4.5 h-4.5" />
                    <span style={{ fontWeight: 600 }}>{job.companyName}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'var(--db-card-bg)', borderRadius: '0.5rem', border: '1px solid var(--db-card-border)', fontSize: '0.875rem', color: 'var(--db-text)' }}>
                  <MapPin className="w-4 h-4 text-slate-400" /> {job.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'var(--db-card-bg)', borderRadius: '0.5rem', border: '1px solid var(--db-card-border)', fontSize: '0.875rem', color: 'var(--db-text)' }}>
                  <DollarSign className="w-4 h-4 text-emerald-500" /> {job.salary}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'var(--db-card-bg)', borderRadius: '0.5rem', border: '1px solid var(--db-card-border)', fontSize: '0.875rem', color: 'var(--db-text)' }}>
                  <Briefcase className="w-4 h-4 text-blue-500" /> {job.employmentType || job.type}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'var(--db-card-bg)', borderRadius: '0.5rem', border: '1px solid var(--db-card-border)', fontSize: '0.875rem', color: 'var(--db-text)' }}>
                  <Clock className="w-4 h-4 text-amber-500" /> {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>

            <div style={{ width: '100%', maxWidth: '280px' }}>
              {job.hasApplied ? (
                <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #10b981', borderRadius: '1rem', padding: '1.25rem', textAlign: 'center' }}>
                  <CheckCircle className="w-8 h-8 text-emerald-500" style={{ margin: '0 auto 0.5rem auto' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#065f46', margin: '0 0 0.25rem 0' }}>Already Applied</h3>
                  <p style={{ fontSize: '0.875rem', color: '#047857', margin: 0 }}>Status: <span style={{ fontWeight: 700 }}>{job.applicationStatus}</span></p>
                  <Link to="/dashboard" style={{ display: 'block', marginTop: '1rem', fontSize: '0.875rem', color: '#059669', fontWeight: 600, textDecoration: 'none' }}>Go to Dashboard →</Link>
                </div>
              ) : (
                <button 
                  onClick={handleApply} 
                  disabled={applyLoading || (user && user.role === 'employer')}
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '1rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', opacity: (user && user.role === 'employer') ? 0.5 : 1 }}
                >
                  {applyLoading ? 'Applying...' : 'Apply Now'} <Send className="w-4.5 h-4.5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', lg: { gridTemplateColumns: '2fr 1fr' }, gap: '2rem' }}>
          
          {/* Main Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--db-text)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText className="w-5 h-5 text-blue-500" /> Job Description
              </h3>
              <div style={{ color: 'var(--db-text-muted)', lineHeight: 1.7, fontSize: '0.9375rem', whiteSpace: 'pre-wrap' }}>
                {job.description}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--db-text)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star className="w-5 h-5 text-amber-500" /> Required Skills & Qualifications
              </h3>
              
              {job.skills ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {job.skills.split(',').map((skill, i) => (
                    <span key={i} style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '2rem', fontSize: '0.875rem', fontWeight: 600 }}>
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--db-text-muted)', fontStyle: 'italic', margin: 0 }}>Not specified</p>
              )}
            </div>

          </motion.div>

          {/* Sidebar Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--db-text)', marginBottom: '1.5rem' }}>
                Job Summary
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div className="metric-card-icon icon-slate" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.125rem 0', fontSize: '0.75rem', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Experience Required</p>
                    <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--db-text)', fontWeight: 600 }}>{job.experience || 'Fresher'}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div className="metric-card-icon icon-slate" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.125rem 0', fontSize: '0.75rem', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Job Category</p>
                    <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--db-text)', fontWeight: 600 }}>{job.category}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div className="metric-card-icon icon-slate" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.125rem 0', fontSize: '0.75rem', color: 'var(--db-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Company Name</p>
                    <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--db-text)', fontWeight: 600 }}>{job.companyName}</p>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </div>
  );
}

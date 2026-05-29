import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, IndianRupee, Briefcase, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import api from '../../api/axios.js';
import { formatDistanceToNow } from 'date-fns';
import './FeaturedJobs.css'; 

function JobCard({ job, index }) {
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  const typeColors = {
    'Full-time': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Remote': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Hybrid': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'Part-time': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'Contract': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };

  // Convert comma separated string to array or fallback
  const skillsArray = job.skills ? job.skills.split(',').map(s => s.trim()).slice(0, 3) : ['React', 'Node.js'];

  // Handle click to go to Job details page
  const handleClick = () => {
    navigate(`/jobs/${job._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="job-card cursor-pointer"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <button onClick={(e) => { e.stopPropagation(); setSaved(!saved); }} className="save-btn">
        {saved ? <BookmarkCheck className="w-5 h-5 text-blue-500" /> : <Bookmark className="w-5 h-5 text-slate-400" />}
      </button>

      <div className="job-header">
        <div className="company-logo-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: '#3b82f6', backgroundColor: '#eff6ff' }}>
          {job.companyName ? job.companyName.substring(0, 1).toUpperCase() : 'C'}
        </div>
        <div>
          <h3 className="job-title">{job.title}</h3>
          <p className="company-name">{job.companyName}</p>
        </div>
      </div>

      <div className="job-details-row">
        <span className="job-meta-item"><IndianRupee className="job-meta-icon text-emerald-500" />{job.salary}</span>
        <span className="job-meta-item"><Briefcase className="job-meta-icon text-blue-500" />{job.experience || 'Fresher'}</span>
        <span className="job-meta-item"><MapPin className="job-meta-icon text-rose-500" />{job.location}</span>
      </div>

      <div className="job-type-wrapper">
        <span className={`type-badge ${typeColors[job.employmentType || job.type] || typeColors['Full-time']}`}>
          {job.employmentType || job.type}
        </span>
      </div>
      <div className="job-skills-wrapper">
        {skillsArray.map((skill, i) => <span key={i} className="skill-tag">{skill}</span>)}
      </div>

      <div className="job-footer">
        <span className="job-posted-date">
          <Clock className="w-3.5 h-3.5" />
          {job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) : 'Just now'}
        </span>
        <button onClick={(e) => { e.stopPropagation(); handleClick(); }} className="apply-btn">
          View Details <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicJobs = async () => {
      try {
        const res = await api.get('/jobs/public');
        setJobs(res.data.slice(0, 6)); // Show latest 6 jobs
      } catch (err) {
        console.error('Failed to fetch public jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicJobs();
  }, []);

  return (
    <section id="jobs" className="featured-jobs-section">
      <div className="featured-jobs-container">
        
        <div className="featured-jobs-header">
          <span className="section-badge">Latest Openings</span>
          <h2 className="section-title">Featured <span className="gradient-text">Jobs</span></h2>
          <p className="section-subtitle">Hand-picked opportunities from top employers around the world</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <div className="metric-card-icon icon-blue" style={{ animation: 'spin 1s linear infinite' }}>
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--db-text-muted)' }}>
            No jobs posted yet. Check back soon!
          </div>
        ) : (
          <div className="featured-jobs-grid">
            {jobs.map((job, index) => (
              <JobCard key={job._id} job={job} index={index} />
            ))}
          </div>
        )}

        <div className="featured-jobs-footer">
          <button className="btn-view-all" onClick={() => window.scrollTo(0,0)}>
            View All Jobs →
          </button>
        </div>
      </div>
    </section>
  );
}

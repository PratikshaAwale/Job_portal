import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios.js';
import {
  Briefcase, Bell, User, Settings, LogOut, LayoutDashboard,
  FileText, Send, Bookmark, Star, ArrowUpRight, Search, Plus,
  Check, X, FileUp, Building, MapPin, DollarSign, Calendar, ChevronRight, Menu,
  Sun, Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import './Dashboard.css';

// Profile Card Components (embedded inside Dashboard layout)
import PersonalInfoCard from '../components/profile/PersonalInfoCard.jsx';
import EducationCard from '../components/profile/EducationCard.jsx';
import SkillsCard from '../components/profile/SkillsCard.jsx';
import ExperienceCard from '../components/profile/ExperienceCard.jsx';
import ProjectsCard from '../components/profile/ProjectsCard.jsx';
import ResumeCard from '../components/profile/ResumeCard.jsx';
import SocialLinksCard from '../components/profile/SocialLinksCard.jsx';
import NotificationsPage from './NotificationsPage.jsx';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // MERN Integration States
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const [allApplications, setAllApplications] = useState([]);

  // Interview System States
  const [recruiterInterviews, setRecruiterInterviews] = useState([]);
  const [seekerInterviews, setSeekerInterviews] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleTarget, setScheduleTarget] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    interviewDate: '',
    interviewTime: '',
    meetLink: '',
    message: ''
  });

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Seeker Profile Edit States (Interactive Local state initialized empty - NO DUMMY DATA)
  const [seekerProfile, setSeekerProfile] = useState({
    skills: '',
    resumeUrl: '',
    experience: '',
    education: '',
    location: '',
    bio: ''
  });

  // Recruiter Company Profile (Initialized empty - NO DUMMY DATA)
  const [companyProfile, setCompanyProfile] = useState({
    name: '',
    website: '',
    location: '',
    size: '',
    bio: ''
  });

  // Forms
  const [newJob, setNewJob] = useState({
    title: '',
    category: 'IT & Software',
    salary: '',
    type: 'Full-time',
    location: '',
    description: '',
    skills: '',
    experience: 'Fresher',
    employmentType: 'Full-time'
  });

  const [applyForm, setApplyForm] = useState({
    jobId: '',
    jobTitle: '',
    skills: '',
    resume: ''
  });

  const isRecruiter = user?.role === 'Recruiter' || user?.role === 'employer';

  // Fetch active MERN data based on role
  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    setErrorMsg('');
    try {
      if (!isRecruiter) {
        // Seeker: Fetch applied jobs
        const appliedRes = await api.get('/jobs/applied');
        setAppliedJobs(appliedRes.data);

        // Seeker: Fetch all portal jobs to browse & apply
        const allJobsRes = await api.get('/jobs');
        // Filter out jobs already applied to
        const appliedIds = appliedRes.data.map(j => j._id);
        const filtered = allJobsRes.data.filter(j => !appliedIds.includes(j._id));
        setAvailableJobs(filtered);
        
        // Fetch Job Seeker Interviews
        const seekerIntRes = await api.get('/interviews/seeker');
        setSeekerInterviews(seekerIntRes.data);
      } else {
        // Recruiter: Fetch posted jobs
        const postedRes = await api.get('/jobs/posted');
        setPostedJobs(postedRes.data);

        // Flatten candidates across all posted jobs
        const extractedApps = [];
        postedRes.data.forEach(job => {
          if (job.applicants) {
            job.applicants.forEach(app => {
              extractedApps.push({
                applicationId: app._id,
                jobId: job._id,
                jobTitle: job.title,
                userId: app.user?._id || app.user,
                name: app.user?.name || 'Job Seeker',
                email: app.email,
                skills: app.skills,
                resume: app.resume,
                phone: app.phone || 'Not provided',
                education: app.education || 'Not provided',
                status: app.status,
                appliedAt: app.createdAt
              });
            });
          }
        });
        setAllApplications(extractedApps);

        // Fetch Recruiter Scheduled Interviews
        const recruiterIntRes = await api.get('/interviews/recruiter');
        setRecruiterInterviews(recruiterIntRes.data);
      }
    } catch (err) {
      console.error('Fetch dashboard error:', err);
      setErrorMsg(err.response?.data?.message || 'Error connecting to MERN backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, activeTab]);

  // Redirection guard: If not logged in, show access denied
  if (!user) {
    return (
      <div className="db-layout" style={{ justifyContent: 'center', alignItems: 'center', padding: '1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel"
          style={{ maxWidth: '28rem', width: '100%', textAlign: 'center', padding: '2.5rem' }}
        >
          <div className="metric-card-icon icon-blue" style={{ margin: '0 auto 1.5rem auto' }}>
            <Briefcase className="w-8 h-8" />
          </div>
          <h2 className="glass-panel-title" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
            Access Denied
          </h2>
          <p className="db-header-subtitle" style={{ fontSize: '0.875rem', marginBottom: '2rem', lineHeight: '1.5' }}>
            Please log in or register an account to access the JobVerse portal dashboard.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.75rem' }}>
              Log In
            </Link>
            <Link to="/register" className="btn btn-secondary" style={{ padding: '0.75rem' }}>
              Sign Up
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Handle standard logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Seeker: Submit job application
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyForm.skills) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.post(
        `/jobs/${applyForm.jobId}/apply`,
        {
          skills: applyForm.skills,
          resume: seekerProfile.resumeUrl || 'resume.pdf'
        }
      );
      setSuccessMsg(`Successfully applied for the ${applyForm.jobTitle} role!`);
      setApplyForm({ jobId: '', jobTitle: '', skills: '', resume: '' });
      fetchDashboardData();
      setTimeout(() => setActiveTab('Applied Jobs'), 2000);
    } catch (err) {
      console.error('Apply submit error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit application.');
    }
  };

  // Recruiter: Publish new job listing
  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.salary || !newJob.location) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.post(
        '/jobs',
        newJob
      );
      setSuccessMsg('Job listing successfully posted on JobVerse!');
      setNewJob({ title: '', category: 'IT & Software', salary: '', type: 'Full-time', location: '', description: '', skills: '', experience: 'Fresher', employmentType: 'Full-time' });
      fetchDashboardData();
      setTimeout(() => setActiveTab('Dashboard'), 2000);
    } catch (err) {
      console.error('Post job error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to post job listing.');
    }
  };

  // Recruiter: Update applicant status
  const handleApplicantStatus = async (jobId, applicantUserId, newStatus) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.put(
        `/jobs/applications/${jobId}/${applicantUserId}/status`,
        { status: newStatus }
      );
      setSuccessMsg(`Application status updated to ${newStatus}`);
      fetchDashboardData();
    } catch (err) {
      console.error('Update status error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to update applicant status.');
    }
  };

  // Recruiter: Handle scheduling interview
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleForm.interviewDate || !scheduleForm.interviewTime || !scheduleForm.meetLink) {
      setErrorMsg('Date, time, and meet link are required.');
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    try {
      await api.post(
        '/interviews',
        {
          applicationId: scheduleTarget.applicationId,
          jobSeekerId: scheduleTarget.userId,
          jobId: scheduleTarget.jobId,
          jobTitle: scheduleTarget.jobTitle,
          companyName: user.name, // For employer, their name acts as companyName
          seekerName: scheduleTarget.name,
          seekerEmail: scheduleTarget.email,
          interviewDate: scheduleForm.interviewDate,
          interviewTime: scheduleForm.interviewTime,
          meetLink: scheduleForm.meetLink,
          message: scheduleForm.message
        }
      );
      setSuccessMsg(`Interview scheduled successfully with ${scheduleTarget.name}! Email sent.`);
      setShowScheduleModal(false);
      setScheduleTarget(null);
      setScheduleForm({ interviewDate: '', interviewTime: '', meetLink: '', message: '' });
      fetchDashboardData();
    } catch (err) {
      console.error('Schedule interview error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to schedule interview.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`db-layout ${darkMode ? 'dark' : ''}`}>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 1. SIDEBAR (DESKTOP) */}
      {/* ──────────────────────────────────────────────────────── */}
      <aside className="db-sidebar">
        {/* Brand Logo */}
        <div className="db-sidebar-logo">
          <div className="db-logo-icon">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="db-brand-name">
            <span className="db-brand-blue">Job</span>Verse
          </span>
        </div>

        {/* Sidebar Navigation */}
        <nav className="db-sidebar-nav">
          {!isRecruiter ? (
            <>
              <button
                onClick={() => setActiveTab('Dashboard')}
                className={`db-sidebar-item ${activeTab === 'Dashboard' || activeTab === 'Browse Jobs' ? 'db-sidebar-item-active' : ''}`}
              >
                <LayoutDashboard className="db-sidebar-item-icon" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('Profile')}
                className={`db-sidebar-item ${activeTab === 'Profile' ? 'db-sidebar-item-active' : ''}`}
              >
                <User className="db-sidebar-item-icon" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('Settings')}
                className={`db-sidebar-item ${activeTab === 'Settings' ? 'db-sidebar-item-active' : ''}`}
              >
                <Settings className="db-sidebar-item-icon" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => setActiveTab('Applied Jobs')}
                className={`db-sidebar-item ${activeTab === 'Applied Jobs' ? 'db-sidebar-item-active' : ''}`}
              >
                <FileText className="db-sidebar-item-icon" />
                <span>Applied Jobs</span>
              </button>
              <button
                onClick={() => setActiveTab('My Interviews')}
                className={`db-sidebar-item ${activeTab === 'My Interviews' ? 'db-sidebar-item-active' : ''}`}
              >
                <Calendar className="db-sidebar-item-icon" />
                <span>My Interviews</span>
              </button>
              <button
                onClick={() => setActiveTab('Recruiter Actions')}
                className={`db-sidebar-item ${activeTab === 'Recruiter Actions' ? 'db-sidebar-item-active' : ''}`}
              >
                <Send className="db-sidebar-item-icon" />
                <span>Recruiter Actions</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('Dashboard')}
                className={`db-sidebar-item ${activeTab === 'Dashboard' ? 'db-sidebar-item-active' : ''}`}
              >
                <LayoutDashboard className="db-sidebar-item-icon" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('Profile')}
                className={`db-sidebar-item ${activeTab === 'Profile' ? 'db-sidebar-item-active' : ''}`}
              >
                <User className="db-sidebar-item-icon" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('Settings')}
                className={`db-sidebar-item ${activeTab === 'Settings' ? 'db-sidebar-item-active' : ''}`}
              >
                <Settings className="db-sidebar-item-icon" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => setActiveTab('Add Job')}
                className={`db-sidebar-item ${activeTab === 'Add Job' ? 'db-sidebar-item-active' : ''}`}
              >
                <Plus className="db-sidebar-item-icon" />
                <span>Add Job</span>
              </button>
              <button
                onClick={() => setActiveTab('Job Seeker Applications')}
                className={`db-sidebar-item ${activeTab === 'Job Seeker Applications' ? 'db-sidebar-item-active' : ''}`}
              >
                <FileText className="db-sidebar-item-icon" />
                <span>Applications</span>
              </button>
              <button
                onClick={() => setActiveTab('Scheduled Interviews')}
                className={`db-sidebar-item ${activeTab === 'Scheduled Interviews' ? 'db-sidebar-item-active' : ''}`}
              >
                <Calendar className="db-sidebar-item-icon" />
                <span>Interviews</span>
              </button>
            </>
          )}
        </nav>

        {/* Bottom User Card */}
        <div className="db-user-card">
          <div className="db-user-info">
            <div className="db-avatar-circle">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="db-user-text">
              <h4 className="db-user-name">{user.name}</h4>
              <p className="db-user-role">{user.role === 'employer' ? 'Recruiter' : 'Job Seeker'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="db-signout-btn">
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 2. MOBILE SIDEBAR DRAWER */}
      {/* ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-white dark:bg-slate-900 p-6 z-50 flex flex-col lg:hidden border-r border-slate-200 dark:border-slate-800 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="db-logo-icon">
                    <Briefcase className="w-4.5 h-4.5 text-white" />
                  </div>
                  <span className="db-brand-name">
                    <span className="db-brand-blue">Job</span>Verse
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="db-hamburger"
                  style={{ display: 'block' }}
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Sidebar Menu Items */}
              <nav className="db-sidebar-nav">
                {!isRecruiter ? (
                  <>
                    <button onClick={() => { setActiveTab('Dashboard'); setSidebarOpen(false); }} className={`db-sidebar-item ${activeTab === 'Dashboard' ? 'db-sidebar-item-active' : ''}`}>
                      <LayoutDashboard className="db-sidebar-item-icon" />
                      <span>Dashboard</span>
                    </button>
                    <button onClick={() => { setActiveTab('Profile'); setSidebarOpen(false); }} className={`db-sidebar-item ${activeTab === 'Profile' ? 'db-sidebar-item-active' : ''}`}>
                      <User className="db-sidebar-item-icon" />
                      <span>Profile</span>
                    </button>
                    <button onClick={() => { setActiveTab('Notifications'); setSidebarOpen(false); }} className={`db-sidebar-item ${activeTab === 'Notifications' ? 'db-sidebar-item-active' : ''}`}>
                      <Bell className="db-sidebar-item-icon" />
                      <span>Notifications</span>
                    </button>
                    <button onClick={() => { setActiveTab('Settings'); setSidebarOpen(false); }} className={`db-sidebar-item ${activeTab === 'Settings' ? 'db-sidebar-item-active' : ''}`}>
                      <Settings className="db-sidebar-item-icon" />
                      <span>Settings</span>
                    </button>
                    <button onClick={() => { setActiveTab('Applied Jobs'); setSidebarOpen(false); }} className={`db-sidebar-item ${activeTab === 'Applied Jobs' ? 'db-sidebar-item-active' : ''}`}>
                      <FileText className="db-sidebar-item-icon" />
                      <span>Applied Jobs</span>
                    </button>
                    <button onClick={() => { setActiveTab('My Interviews'); setSidebarOpen(false); }} className={`db-sidebar-item ${activeTab === 'My Interviews' ? 'db-sidebar-item-active' : ''}`}>
                      <Calendar className="db-sidebar-item-icon" />
                      <span>My Interviews</span>
                    </button>
                    <button onClick={() => { setActiveTab('Recruiter Actions'); setSidebarOpen(false); }} className={`db-sidebar-item ${activeTab === 'Recruiter Actions' ? 'db-sidebar-item-active' : ''}`}>
                      <Send className="db-sidebar-item-icon" />
                      <span>Recruiter Actions</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setActiveTab('Dashboard'); setSidebarOpen(false); }} className={`db-sidebar-item ${activeTab === 'Dashboard' ? 'db-sidebar-item-active' : ''}`}>
                      <LayoutDashboard className="db-sidebar-item-icon" />
                      <span>Dashboard</span>
                    </button>
                    <button onClick={() => { setActiveTab('Profile'); setSidebarOpen(false); }} className={`db-sidebar-item ${activeTab === 'Profile' ? 'db-sidebar-item-active' : ''}`}>
                      <User className="db-sidebar-item-icon" />
                      <span>Profile</span>
                    </button>
                    <button onClick={() => { setActiveTab('Settings'); setSidebarOpen(false); }} className={`db-sidebar-item ${activeTab === 'Settings' ? 'db-sidebar-item-active' : ''}`}>
                      <Settings className="db-sidebar-item-icon" />
                      <span>Settings</span>
                    </button>
                    <button onClick={() => { setActiveTab('Add Job'); setSidebarOpen(false); }} className={`db-sidebar-item ${activeTab === 'Add Job' ? 'db-sidebar-item-active' : ''}`}>
                      <Plus className="db-sidebar-item-icon" />
                      <span>Add Job</span>
                    </button>
                    <button onClick={() => { setActiveTab('Job Seeker Applications'); setSidebarOpen(false); }} className={`db-sidebar-item ${activeTab === 'Job Seeker Applications' ? 'db-sidebar-item-active' : ''}`}>
                      <FileText className="db-sidebar-item-icon" />
                      <span>Applications</span>
                    </button>
                    <button onClick={() => { setActiveTab('Scheduled Interviews'); setSidebarOpen(false); }} className={`db-sidebar-item ${activeTab === 'Scheduled Interviews' ? 'db-sidebar-item-active' : ''}`}>
                      <Calendar className="db-sidebar-item-icon" />
                      <span>Interviews</span>
                    </button>
                  </>
                )}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 3. MAIN WORKSPACE CONTAINER */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="db-container-main">

        {/* TOP HEADER */}
        <header className="db-header">
          <div className="db-header-left">
            <button onClick={() => setSidebarOpen(true)} className="db-hamburger">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="db-header-title">Welcome, {user.name.split(' ')[0]}</h2>
              <p className="db-header-subtitle">What do you want to explore today?</p>
            </div>
          </div>

          <div className="db-header-right">
            {/* Theme switcher */}
            <button onClick={toggleTheme} className="db-icon-btn">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification drop */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setBellOpen(!bellOpen)} className="db-icon-btn">
                <Bell className="w-5.5 h-5.5" />
              </button>
              <AnimatePresence>
                {bellOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="db-dropdown bell-dropdown"
                  >
                    <div className="db-dropdown-header">
                      <span className="glass-panel-title" style={{ fontSize: '0.75rem' }}>Notifications</span>
                    </div>
                    <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                      <div className="metric-card-icon icon-blue" style={{ margin: '0 auto 0.75rem auto' }}>
                        <Bell className="w-5 h-5" />
                      </div>
                      <span className="metric-card-title" style={{ fontSize: '0.75rem', display: 'block' }}>All Caught Up!</span>
                      <p className="db-header-subtitle" style={{ fontSize: '0.625rem', marginTop: '0.25rem' }}>No new notifications right now.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="db-user-menu-btn"
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff&bold=true`}
                  alt="Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </button>
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="db-dropdown profile-dropdown"
                  >
                    <button onClick={() => { setActiveTab('Profile'); setProfileDropdownOpen(false); }} className="db-dropdown-item">
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </button>
                    <button onClick={() => { setActiveTab('Dashboard'); setProfileDropdownOpen(false); }} className="db-dropdown-item">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </button>
                    <div style={{ height: '1px', backgroundColor: 'var(--db-sidebar-border)', margin: '0.25rem 0' }} />
                    <button onClick={() => { handleLogout(); setProfileDropdownOpen(false); }} className="db-dropdown-item db-dropdown-item-danger">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="db-workspace">

          {/* Notification Alerts */}
          {errorMsg && <div className="db-alert alert-danger"><X className="w-4 h-4" />{errorMsg}</div>}
          {successMsg && <div className="db-alert alert-success"><Check className="w-4 h-4" />{successMsg}</div>}

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '12rem' }}>
              <div className="metric-card-icon icon-blue" style={{ animation: 'spin 1s linear infinite' }}>
                <LayoutDashboard className="w-6 h-6" />
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >

                {/* ──────────────────────────────────────────────────────── */}
                {/* A. JOB SEEKER DASHBOARD VIEWS */}
                {/* ──────────────────────────────────────────────────────── */}
                {!isRecruiter && (
                  <>
                    {/* Seeker Dashboard Tab */}
                    {activeTab === 'Dashboard' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="metric-grid">
                          <div className="metric-card" onClick={() => setActiveTab('Applied Jobs')}>
                            <div className="metric-card-top">
                              <div className="metric-card-icon icon-blue">
                                <FileText className="w-6 h-6" />
                              </div>
                              <ChevronRight className="w-5 h-5 text-slate-400" />
                            </div>
                            <h3 className="metric-card-value">{appliedJobs.length}</h3>
                            <p className="metric-card-title">Applied Jobs</p>
                            <p className="metric-card-desc">Track active job application updates</p>
                          </div>

                          <div className="metric-card" onClick={() => setActiveTab('Browse Jobs')}>
                            <div className="metric-card-top">
                              <div className="metric-card-icon icon-violet">
                                <Briefcase className="w-6 h-6" />
                              </div>
                              <ChevronRight className="w-5 h-5 text-slate-400" />
                            </div>
                            <h3 className="metric-card-value">{availableJobs.length}</h3>
                            <p className="metric-card-title">Available Positions</p>
                            <p className="metric-card-desc">Search and apply to MERN openings</p>
                          </div>

                          <div className="metric-card" onClick={() => setActiveTab('Profile')}>
                            <div className="metric-card-top">
                              <div className="metric-card-icon icon-emerald">
                                <User className="w-6 h-6" />
                              </div>
                              <ChevronRight className="w-5 h-5 text-slate-400" />
                            </div>
                            <h3 className="metric-card-value">MERN</h3>
                            <p className="metric-card-title">Professional Profile</p>
                            <p className="metric-card-desc">Update your developer details</p>
                          </div>

                          <div className="metric-card" onClick={() => setActiveTab('Recruiter Actions')}>
                            <div className="metric-card-top">
                              <div className="metric-card-icon icon-amber">
                                <Send className="w-6 h-6" />
                              </div>
                              <ChevronRight className="w-5 h-5 text-slate-400" />
                            </div>
                            <h3 className="metric-card-value">Inbox</h3>
                            <p className="metric-card-title">Recruiter Actions</p>
                            <p className="metric-card-desc">Review accepted panel interviews</p>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                          {/* Browse & Apply to Jobs Panel */}
                          <div className="glass-panel">
                            <div className="glass-panel-title-container">
                              <h3 className="glass-panel-title">Explore Active Jobs ({availableJobs.length})</h3>
                              <button onClick={() => setActiveTab('Browse Jobs')} className="panel-link">View All</button>
                            </div>

                            {availableJobs.length === 0 ? (
                              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--db-text-muted)' }}>
                                No active job listings found to apply for right now. Check back soon!
                              </div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {availableJobs.slice(0, 3).map((job) => (
                                  <div key={job._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--db-bg)', borderRadius: '1rem', border: '1px solid var(--db-card-border)' }}>
                                    <div>
                                      <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 800 }}>{job.title}</h4>
                                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--db-text-muted)' }}>
                                        {job.company?.name || 'Partner Company'} • {job.location} • {job.salary}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        setApplyForm({ jobId: job._id, jobTitle: job.title, skills: '', resume: '' });
                                        setActiveTab('Browse Jobs');
                                      }}
                                      className="btn btn-primary"
                                    >
                                      Apply Now
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Seeker Browse Jobs Tab */}
                    {activeTab === 'Browse Jobs' && (
                      <div className="glass-panel">
                        <div className="glass-panel-title-container">
                          <div>
                            <h3 className="glass-panel-title">Browse Available Openings</h3>
                            <p className="db-header-subtitle">Search, select and apply for jobs instantly via our secure gateway</p>
                          </div>
                        </div>

                        {/* Apply Form Overlay when selected */}
                        {applyForm.jobId && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="db-alert alert-success"
                            style={{ flexDirection: 'column', alignItems: 'stretch', gap: '1rem', padding: '1.5rem', backgroundColor: 'var(--db-bg)', border: '1px solid #34d399' }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 800 }}>Applying for: <span style={{ color: '#2563eb' }}>{applyForm.jobTitle}</span></h4>
                              <button onClick={() => setApplyForm({ jobId: '', jobTitle: '', skills: '', resume: '' })} className="btn btn-secondary btn-icon-only"><X className="w-4 h-4" /></button>
                            </div>
                            <form onSubmit={handleApplySubmit} className="db-form">
                              <div>
                                <label className="db-form-label">Key Developer Skills (comma separated)</label>
                                <input
                                  type="text"
                                  required
                                  value={applyForm.skills}
                                  onChange={(e) => setApplyForm({ ...applyForm, skills: e.target.value })}
                                  placeholder="e.g. React.js, Express, MongoDB, Node"
                                  className="db-input"
                                />
                              </div>
                              <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Application</button>
                                <button type="button" onClick={() => setApplyForm({ jobId: '', jobTitle: '', skills: '', resume: '' })} className="btn btn-secondary">Cancel</button>
                              </div>
                            </form>
                          </motion.div>
                        )}

                        <div className="db-table-wrapper" style={{ marginTop: '1.5rem' }}>
                          <table className="db-table">
                            <thead>
                              <tr>
                                <th>Job Title</th>
                                <th>Category</th>
                                <th>Location</th>
                                <th>Salary</th>
                                <th>Type</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {availableJobs.map((job) => (
                                <tr key={job._id} className="db-table-row">
                                  <td className="db-table-title">
                                    <div>{job.title}</div>
                                    <span style={{ fontSize: '0.6875rem', color: 'var(--db-text-muted)' }}>{job.company?.name || 'Company'}</span>
                                  </td>
                                  <td>{job.category}</td>
                                  <td>{job.location}</td>
                                  <td>{job.salary}</td>
                                  <td>
                                    <span className="badge badge-neutral">{job.type}</span>
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    <button
                                      onClick={() => setApplyForm({ jobId: job._id, jobTitle: job.title, skills: '', resume: '' })}
                                      className="btn btn-primary"
                                    >
                                      Apply
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              {availableJobs.length === 0 && (
                                <tr>
                                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--db-text-muted)' }}>
                                    No available job openings at this time.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Seeker Applied Jobs Tab */}
                    {activeTab === 'Applied Jobs' && (
                      <div className="glass-panel">
                        <h3 className="glass-panel-title" style={{ marginBottom: '1.5rem' }}>Your Active Applications</h3>
                        <div className="db-table-wrapper">
                          <table className="db-table">
                            <thead>
                              <tr>
                                <th>Job Title</th>
                                <th>Company</th>
                                <th>Location</th>
                                <th>Salary</th>
                                <th>Type</th>
                                <th>Applied Date</th>
                                <th style={{ textAlign: 'right' }}>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {appliedJobs.map((job) => (
                                <tr key={job._id} className="db-table-row">
                                  <td className="db-table-title">{job.title}</td>
                                  <td>{job.companyName}</td>
                                  <td>{job.location}</td>
                                  <td>{job.salary}</td>
                                  <td><span className="badge badge-neutral">{job.type}</span></td>
                                  <td>{job.appliedAt ? new Date(job.appliedAt).toLocaleDateString('en-GB') : 'N/A'}</td>
                                  <td style={{ textAlign: 'right' }}>
                                    <span className={`badge ${job.status === 'Accepted' ? 'badge-emerald' :
                                        job.status === 'Rejected' ? 'badge-danger' :
                                          job.status === 'Reviewed' ? 'badge-blue' : 'badge-warning'
                                      }`}>
                                      {job.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                              {appliedJobs.length === 0 && (
                                <tr>
                                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--db-text-muted)' }}>
                                    You have not applied for any jobs yet. Visit the Dashboard to browse listings!
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Seeker My Interviews Tab */}
                    {activeTab === 'My Interviews' && (
                      <div className="glass-panel">
                        <h3 className="glass-panel-title" style={{ marginBottom: '1.5rem' }}>My Scheduled Interviews</h3>
                        <div className="db-table-wrapper">
                          <table className="db-table">
                            <thead>
                              <tr>
                                <th>Company</th>
                                <th>Role</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th style={{ textAlign: 'right' }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {seekerInterviews.map((interview) => (
                                <tr key={interview._id} className="db-table-row">
                                  <td className="db-table-title">{interview.companyName}</td>
                                  <td>{interview.jobTitle}</td>
                                  <td>{interview.interviewDate}</td>
                                  <td>{interview.interviewTime}</td>
                                  <td style={{ textAlign: 'right' }}>
                                    {interview.status === 'Scheduled' ? (
                                      <a
                                        href={interview.meetLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-primary"
                                        style={{ textDecoration: 'none' }}
                                      >
                                        Join Interview
                                      </a>
                                    ) : (
                                      <span className={`badge ${interview.status === 'Completed' ? 'badge-emerald' : 'badge-danger'}`}>
                                        {interview.status}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                              {seekerInterviews.length === 0 && (
                                <tr>
                                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--db-text-muted)' }}>
                                    No interviews scheduled yet. Keep applying!
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Seeker Profile Tab — uses the new Profile Card Components */}
                    {activeTab === 'Profile' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '52rem', margin: '0 auto' }}>
                        {/* Profile page heading */}
                        <div style={{ marginBottom: '0.5rem' }}>
                          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--db-text)' }}>My Profile</h2>
                          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--db-text-muted)' }}>Fill in your details to help recruiters find you faster</p>
                        </div>
                        <PersonalInfoCard />
                        <EducationCard />
                        <SkillsCard />
                        <ExperienceCard />
                        <ProjectsCard />
                        <ResumeCard />
                        <SocialLinksCard />
                      </div>
                    )}

                    {/* Seeker Notifications Tab */}
                    {activeTab === 'Notifications' && (
                      <NotificationsPage />
                    )}

                    {/* Seeker Settings Tab */}
                    {activeTab === 'Settings' && (
                      <div className="glass-panel" style={{ maxWidth: '32rem', margin: '0 auto' }}>
                        <h3 className="glass-panel-title" style={{ marginBottom: '1.5rem' }}>Account Settings</h3>
                        <form onSubmit={(e) => { e.preventDefault(); setSuccessMsg('Password updated successfully!'); setTimeout(() => setSuccessMsg(''), 3000); }} className="db-form">
                          <div>
                            <label className="db-form-label">Old Password</label>
                            <input type="password" required className="db-input" />
                          </div>
                          <div>
                            <label className="db-form-label">New Password</label>
                            <input type="password" required className="db-input" />
                          </div>
                          <button type="submit" className="btn btn-primary" style={{ padding: '0.875rem' }}>Update Password</button>
                        </form>
                      </div>
                    )}

                    {/* Seeker Recruiter Actions Tab */}
                    {activeTab === 'Recruiter Actions' && (
                      <div style={{ maxWidth: '38rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 className="glass-panel-title">Recruiter Panel Invitations</h3>

                        {appliedJobs.filter(j => j.status === 'Accepted' || j.status === 'Reviewed').length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--db-text-muted)', backgroundColor: 'var(--db-card-bg)', borderRadius: '1.75rem', border: '1px solid var(--db-card-border)' }}>
                            No active recruiter actions or panel interviews pending right now.
                          </div>
                        ) : (
                          appliedJobs.filter(j => j.status === 'Accepted' || j.status === 'Reviewed').map((job) => (
                            <div key={job._id} className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(6,182,212,0.03))', border: '1px solid rgba(16,185,129,0.2)', position: 'relative' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div className="metric-card-icon icon-emerald">
                                  <Calendar className="w-5.5 h-5.5" />
                                </div>
                                <div>
                                  <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 800 }}>Technical Panel Interview Invitation</h4>
                                  <p style={{ margin: '0.125rem 0 0 0', fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>{job.companyName}</p>
                                </div>
                              </div>
                              <p style={{ fontSize: '0.75rem', color: 'var(--db-text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                Congratulations, {user.name}! The recruitment committee at {job.companyName} has reviewed your application for the {job.title} role and would like to invite you for a virtual Technical Panel interview.
                              </p>
                              <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn btn-success" onClick={() => alert('Panel interview accepted! The recruiter will email you details.')}>Accept Interview Panel</button>
                                <button className="btn btn-secondary" onClick={() => alert('Interview offer declined.')}>Decline</button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* ──────────────────────────────────────────────────────── */}
                {/* B. RECRUITER (EMPLOYER) DASHBOARD VIEWS */}
                {/* ──────────────────────────────────────────────────────── */}
                {isRecruiter && (
                  <>
                    {/* Recruiter Dashboard Tab */}
                    {activeTab === 'Dashboard' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Metrics */}
                        <div className="metric-grid">
                          <div className="metric-card" onClick={() => setActiveTab('Add Job')}>
                            <div className="metric-card-top">
                              <div className="metric-card-icon icon-blue">
                                <Plus className="w-6 h-6" />
                              </div>
                              <ChevronRight className="w-5 h-5 text-slate-400" />
                            </div>
                            <h3 className="metric-card-value">Post</h3>
                            <p className="metric-card-title">Add New Job</p>
                            <p className="metric-card-desc">Publish listings to MERN developers</p>
                          </div>

                          <div className="metric-card" onClick={() => setActiveTab('Dashboard')}>
                            <div className="metric-card-top">
                              <div className="metric-card-icon icon-violet">
                                <Briefcase className="w-6 h-6" />
                              </div>
                              <ChevronRight className="w-5 h-5 text-slate-400" />
                            </div>
                            <h3 className="metric-card-value">{postedJobs.length}</h3>
                            <p className="metric-card-title">Active Posted Jobs</p>
                            <p className="metric-card-desc">Manage job listing documents</p>
                          </div>

                          <div className="metric-card" onClick={() => setActiveTab('Job Seeker Applications')}>
                            <div className="metric-card-top">
                              <div className="metric-card-icon icon-emerald">
                                <FileText className="w-6 h-6" />
                              </div>
                              <ChevronRight className="w-5 h-5 text-slate-400" />
                            </div>
                            <h3 className="metric-card-value">{allApplications.length}</h3>
                            <p className="metric-card-title">Received Applications</p>
                            <p className="metric-card-desc">Review active candidate resumes</p>
                          </div>

                          <div className="metric-card" onClick={() => setActiveTab('Profile')}>
                            <div className="metric-card-top">
                              <div className="metric-card-icon icon-amber">
                                <Building className="w-6 h-6" />
                              </div>
                              <ChevronRight className="w-5 h-5 text-slate-400" />
                            </div>
                            <h3 className="metric-card-value">Corp</h3>
                            <p className="metric-card-title">Company Profile</p>
                            <p className="metric-card-desc">Manage corporate identity card</p>
                          </div>
                        </div>

                        {/* Split layouts */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>

                          {/* Recruiter Promo Banner */}
                          <div className="recruiter-promo-hero">
                            <div className="recruiter-promo-hero-bg" />
                            <div>
                              <div className="promo-hero-icon-wrapper">
                                <Plus className="w-6 h-6 text-white" />
                              </div>
                              <h3 className="promo-hero-title">Need to hire engineering talent?</h3>
                              <p className="promo-hero-desc">
                                Create highly visible job listings with JobVerse MERN gateways. Tap into thousands of qualified developers ready to apply!
                              </p>
                            </div>
                            <button onClick={() => setActiveTab('Add Job')} className="btn btn-white" style={{ alignSelf: 'start' }}>
                              Post a Job Now
                            </button>
                          </div>

                          {/* List of Recruiter's Posted Jobs */}
                          <div className="glass-panel">
                            <h3 className="glass-panel-title" style={{ marginBottom: '1.5rem' }}>Your Posted Job Listings</h3>
                            <div className="db-table-wrapper">
                              <table className="db-table">
                                <thead>
                                  <tr>
                                    <th>Job Title</th>
                                    <th>Category</th>
                                    <th>Salary Range</th>
                                    <th>Location</th>
                                    <th>Type</th>
                                    <th style={{ textAlign: 'right' }}>Candidates</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {postedJobs.map((job) => (
                                    <tr key={job._id} className="db-table-row">
                                      <td className="db-table-title">{job.title}</td>
                                      <td>{job.category}</td>
                                      <td>{job.salary}</td>
                                      <td>{job.location}</td>
                                      <td><span className="badge badge-blue">{job.type}</span></td>
                                      <td style={{ textAlign: 'right' }}>
                                        <span onClick={() => setActiveTab('Job Seeker Applications')} className="badge badge-emerald" style={{ cursor: 'pointer' }}>
                                          {(job.applicants || []).length} Applied
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                  {postedJobs.length === 0 && (
                                    <tr>
                                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--db-text-muted)' }}>
                                        You have not posted any jobs yet. Visit the Add Job tab to get started!
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}

                    {/* Recruiter Add Job Tab */}
                    {activeTab === 'Add Job' && (
                      <div className="glass-panel" style={{ maxWidth: '44rem', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                          <div className="metric-card-icon icon-blue">
                            <Plus className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="glass-panel-title">Post New Job Listing</h3>
                            <p className="db-header-subtitle">Publish a secure role description to recruit MERN software developers</p>
                          </div>
                        </div>

                        <form onSubmit={handlePostJob} className="db-form">
                          <div className="form-row-2">
                            <div>
                              <label className="db-form-label">Job Title</label>
                              <input
                                type="text"
                                required
                                value={newJob.title}
                                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                placeholder="e.g. Lead React Developer"
                                className="db-input"
                              />
                            </div>
                            <div>
                              <label className="db-form-label">Category</label>
                              <select
                                value={newJob.category}
                                onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                                className="db-select"
                              >
                                <option>IT & Software</option>
                                <option>Marketing</option>
                                <option>Sales & Dev</option>
                                <option>Operations</option>
                              </select>
                            </div>
                          </div>

                          <div className="form-row-2">
                            <div>
                              <label className="db-form-label">Salary Range</label>
                              <input
                                type="text"
                                required
                                value={newJob.salary}
                                onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                                placeholder="e.g. $120k - $150k"
                                className="db-input"
                              />
                            </div>
                            <div>
                              <label className="db-form-label">Location</label>
                              <input
                                type="text"
                                required
                                value={newJob.location}
                                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                                placeholder="e.g. San Francisco, CA / Remote"
                                className="db-input"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="db-form-label">Job Type</label>
                            <select
                              value={newJob.type}
                              onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                              className="db-select"
                            >
                              <option>Full-time</option>
                              <option>Part-time</option>
                              <option>Remote</option>
                              <option>Contract</option>
                            </select>
                          </div>

                          <div className="form-row-2">
                            <div>
                              <label className="db-form-label">Skills Required</label>
                              <input
                                type="text"
                                value={newJob.skills}
                                onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                                placeholder="e.g. React, Node.js, MongoDB"
                                className="db-input"
                              />
                            </div>
                            <div>
                              <label className="db-form-label">Experience Required</label>
                              <input
                                type="text"
                                value={newJob.experience}
                                onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                                placeholder="e.g. 2-3 Years"
                                className="db-input"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="db-form-label">Employment Type</label>
                            <select
                              value={newJob.employmentType}
                              onChange={(e) => setNewJob({ ...newJob, employmentType: e.target.value })}
                              className="db-select"
                            >
                              <option>Full-time</option>
                              <option>Part-time</option>
                              <option>Remote</option>
                              <option>Contract</option>
                              <option>Internship</option>
                            </select>
                          </div>

                          <div>
                            <label className="db-form-label">Job Description & Requirements</label>
                            <textarea
                              required
                              value={newJob.description}
                              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                              placeholder="Describe core MERN roles, daily responsibilities, and expected developer capabilities..."
                              className="db-textarea"
                            />
                          </div>

                          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }}>
                            Publish Active Job
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Recruiter Applications Tab */}
                    {activeTab === 'Job Seeker Applications' && (
                      <div className="glass-panel">
                        <div style={{ marginBottom: '2rem' }}>
                          <h3 className="glass-panel-title">Developer Candidate Applications</h3>
                          <p className="db-header-subtitle">Evaluate, review and change applicant status in real-time</p>
                        </div>

                        {allApplications.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--db-text-muted)' }}>
                            No candidates have applied to your job postings yet.
                          </div>
                        ) : (
                          <div className="db-app-grid">
                            {allApplications.map((app) => (
                              <div key={app.applicationId} className="db-app-card">
                                <div className="db-app-card-top">
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div className="db-app-avatar">
                                      {app.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                    <div>
                                      <h4 className="db-app-user-name">{app.name}</h4>
                                      <p className="db-app-user-email">{app.email}</p>
                                    </div>
                                  </div>
                                  <span className={`badge ${app.status === 'Accepted' ? 'badge-emerald' :
                                      app.status === 'Rejected' ? 'badge-danger' :
                                        app.status === 'Reviewed' ? 'badge-blue' : 'badge-warning'
                                    }`}>
                                    {app.status}
                                  </span>
                                </div>

                                <div className="db-app-details">
                                  <div>
                                    <span className="db-app-detail-label">Applying For Role:</span>
                                    <span className="db-app-detail-value" style={{ fontWeight: 700, color: '#2563eb' }}>{app.jobTitle}</span>
                                  </div>
                                  <div>
                                    <span className="db-app-detail-label">Candidate Phone:</span>
                                    <span className="db-app-detail-value">{app.phone}</span>
                                  </div>
                                  <div>
                                    <span className="db-app-detail-label">Key Skills:</span>
                                    <span className="db-app-detail-value">{app.skills}</span>
                                  </div>
                                  <div>
                                    <span className="db-app-detail-label">Education Profile:</span>
                                    <span className="db-app-detail-value truncate block max-w-[250px]" title={app.education}>{app.education}</span>
                                  </div>
                                  <div>
                                    <span className="db-app-detail-label">Applied Date:</span>
                                    <span className="db-app-detail-value">{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-GB') : 'N/A'}</span>
                                  </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderBottom: '1px solid var(--db-card-border)', paddingBottom: '1rem' }}>
                                  <button
                                    onClick={() => setSelectedApp(app)}
                                    className="btn btn-secondary"
                                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem' }}
                                  >
                                    View Details
                                  </button>
                                  <a
                                    href={`https://ui-avatars.com/api/?name=${encodeURIComponent(app.resume)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-primary text-center"
                                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                                  >
                                    Download Resume
                                  </a>
                                </div>

                                <div className="db-app-actions" style={{ marginTop: '1rem' }}>
                                  <button onClick={() => handleApplicantStatus(app.jobId, app.userId, 'Accepted')} className="btn btn-success" style={{ flex: 1 }}>
                                    Accept
                                  </button>
                                  <button onClick={() => handleApplicantStatus(app.jobId, app.userId, 'Rejected')} className="btn btn-danger" style={{ flex: 1 }}>
                                    Reject
                                  </button>
                                  <button onClick={() => handleApplicantStatus(app.jobId, app.userId, 'Reviewed')} className="btn btn-secondary">
                                    Reviewing
                                  </button>
                                </div>

                                <div style={{ marginTop: '0.75rem' }}>
                                  <button
                                    onClick={() => {
                                      setScheduleTarget(app);
                                      setShowScheduleModal(true);
                                    }}
                                    className="btn btn-primary"
                                    style={{ width: '100%', backgroundColor: '#0f172a', borderColor: '#0f172a' }}
                                  >
                                    Schedule Interview
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Beginner-friendly Candidate Application Details Modal */}
                        {selectedApp && (
                          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
                            <div className="glass-panel" style={{ maxWidth: '36rem', width: '100%', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', border: '1px solid var(--db-card-border)' }}>
                              <button onClick={() => setSelectedApp(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--db-text-muted)', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold' }}>✕</button>

                              <h3 className="glass-panel-title" style={{ fontSize: '1.25rem', margin: 0 }}>Candidate Profile Details</h3>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--db-card-border)', paddingBottom: '1rem' }}>
                                <div className="db-app-avatar" style={{ width: '3.5rem', height: '3.5rem', fontSize: '1.5rem', margin: 0 }}>
                                  {selectedApp.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div>
                                  <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: 'var(--db-text)' }}>{selectedApp.name}</h4>
                                  <p style={{ margin: '0.125rem 0 0', fontSize: '0.875rem', color: 'var(--db-text-muted)' }}>{selectedApp.email}</p>
                                </div>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                  <div>
                                    <span style={{ fontWeight: 700, display: 'block', color: 'var(--db-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>Phone Number</span>
                                    <span style={{ color: 'var(--db-text)', fontWeight: 600 }}>{selectedApp.phone || 'Not provided'}</span>
                                  </div>
                                  <div>
                                    <span style={{ fontWeight: 700, display: 'block', color: 'var(--db-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>Applied For Role</span>
                                    <span style={{ color: '#2563eb', fontWeight: 800 }}>{selectedApp.jobTitle}</span>
                                  </div>
                                </div>
                                <div>
                                  <span style={{ fontWeight: 700, display: 'block', color: 'var(--db-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>Key Skills</span>
                                  <span style={{ color: 'var(--db-text)', fontWeight: 600 }}>{selectedApp.skills}</span>
                                </div>
                                <div>
                                  <span style={{ fontWeight: 700, display: 'block', color: 'var(--db-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>Education Profile</span>
                                  <span style={{ color: 'var(--db-text)', lineHeight: 1.5, fontWeight: 500 }}>{selectedApp.education}</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                  <div>
                                    <span style={{ fontWeight: 700, display: 'block', color: 'var(--db-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>Resume File</span>
                                    <span style={{ color: 'var(--db-text)', fontStyle: 'italic', fontWeight: 600 }}>{selectedApp.resume}</span>
                                  </div>
                                  <div>
                                    <span style={{ fontWeight: 700, display: 'block', color: 'var(--db-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>Applied Date</span>
                                    <span style={{ color: 'var(--db-text)', fontWeight: 600 }}>{selectedApp.appliedAt ? new Date(selectedApp.appliedAt).toLocaleString('en-GB') : 'N/A'}</span>
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <a
                                  href={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedApp.resume)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-primary text-center"
                                  style={{ flex: 1, padding: '0.75rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}
                                >
                                  Download Resume
                                </a>
                                <button onClick={() => setSelectedApp(null)} className="btn btn-secondary" style={{ flex: 1, padding: '0.75rem', fontSize: '0.875rem' }}>
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Interview Scheduling Modal */}
                        {showScheduleModal && scheduleTarget && (
                          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
                            <div className="glass-panel" style={{ maxWidth: '32rem', width: '100%', padding: '2.5rem', position: 'relative', border: '1px solid var(--db-card-border)' }}>
                              <button onClick={() => setShowScheduleModal(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--db-text-muted)', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold' }}>✕</button>

                              <h3 className="glass-panel-title" style={{ fontSize: '1.25rem', margin: 0, marginBottom: '0.5rem' }}>Schedule Interview</h3>
                              <p style={{ fontSize: '0.875rem', color: 'var(--db-text-muted)', marginBottom: '1.5rem' }}>
                                Scheduling interview for <span style={{ fontWeight: 600, color: 'var(--db-text)' }}>{scheduleTarget.name}</span> for the role of <span style={{ fontWeight: 600, color: 'var(--db-text)' }}>{scheduleTarget.jobTitle}</span>.
                              </p>

                              <form onSubmit={handleScheduleSubmit} className="db-form">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                  <div>
                                    <label className="db-form-label">Date</label>
                                    <input
                                      type="date"
                                      required
                                      value={scheduleForm.interviewDate}
                                      onChange={(e) => setScheduleForm({ ...scheduleForm, interviewDate: e.target.value })}
                                      className="db-input"
                                    />
                                  </div>
                                  <div>
                                    <label className="db-form-label">Time</label>
                                    <input
                                      type="time"
                                      required
                                      value={scheduleForm.interviewTime}
                                      onChange={(e) => setScheduleForm({ ...scheduleForm, interviewTime: e.target.value })}
                                      className="db-input"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="db-form-label">Google Meet Link</label>
                                  <input
                                    type="url"
                                    required
                                    placeholder="https://meet.google.com/..."
                                    value={scheduleForm.meetLink}
                                    onChange={(e) => setScheduleForm({ ...scheduleForm, meetLink: e.target.value })}
                                    className="db-input"
                                  />
                                </div>
                                <div>
                                  <label className="db-form-label">Optional Message</label>
                                  <textarea
                                    placeholder="Any special instructions for the candidate..."
                                    value={scheduleForm.message}
                                    onChange={(e) => setScheduleForm({ ...scheduleForm, message: e.target.value })}
                                    className="db-textarea"
                                    style={{ minHeight: '80px' }}
                                  />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                  <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', fontSize: '0.875rem' }} disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Interview Invite'}
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Recruiter Scheduled Interviews Tab */}
                    {activeTab === 'Scheduled Interviews' && (
                      <div className="glass-panel">
                        <h3 className="glass-panel-title" style={{ marginBottom: '1.5rem' }}>Scheduled Interviews</h3>
                        <div className="db-table-wrapper">
                          <table className="db-table">
                            <thead>
                              <tr>
                                <th>Candidate</th>
                                <th>Role</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Meet Link</th>
                                <th style={{ textAlign: 'right' }}>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {recruiterInterviews.map((interview) => (
                                <tr key={interview._id} className="db-table-row">
                                  <td className="db-table-title">{interview.seekerName}</td>
                                  <td>{interview.jobTitle}</td>
                                  <td>{interview.interviewDate}</td>
                                  <td>{interview.interviewTime}</td>
                                  <td>
                                    <a href={interview.meetLink} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'underline', fontSize: '0.875rem' }}>
                                      Meeting Link
                                    </a>
                                  </td>
                                  <td style={{ textAlign: 'right' }}>
                                    <span className={`badge ${interview.status === 'Completed' ? 'badge-emerald' : interview.status === 'Scheduled' ? 'badge-blue' : 'badge-danger'}`}>
                                      {interview.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                              {recruiterInterviews.length === 0 && (
                                <tr>
                                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--db-text-muted)' }}>
                                    You have not scheduled any interviews yet.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Recruiter Profile Tab — uses the same Profile Card Components */}
                    {activeTab === 'Profile' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '52rem', margin: '0 auto' }}>
                        {/* Profile page heading */}
                        <div style={{ marginBottom: '0.5rem' }}>
                          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--db-text)' }}>My Profile</h2>
                          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--db-text-muted)' }}>Keep your recruiter profile complete to attract the best candidates</p>
                        </div>
                        <PersonalInfoCard />
                        <EducationCard />
                        <SkillsCard />
                        <ExperienceCard />
                        <ProjectsCard />
                        <ResumeCard />
                        <SocialLinksCard />
                      </div>
                    )}

                    {/* Recruiter Settings Tab */}
                    {activeTab === 'Settings' && (
                      <div className="glass-panel" style={{ maxWidth: '32rem', margin: '0 auto' }}>
                        <h3 className="glass-panel-title" style={{ marginBottom: '1.5rem' }}>Recruiter Account Settings</h3>
                        <form onSubmit={(e) => { e.preventDefault(); setSuccessMsg('Recruiter password updated!'); setTimeout(() => setSuccessMsg(''), 3000); }} className="db-form">
                          <div>
                            <label className="db-form-label">Old Password</label>
                            <input type="password" required className="db-input" />
                          </div>
                          <div>
                            <label className="db-form-label">New Password</label>
                            <input type="password" required className="db-input" />
                          </div>
                          <button type="submit" className="btn btn-primary" style={{ padding: '0.875rem' }}>Update Password</button>
                        </form>
                      </div>
                    )}
                  </>
                )}

              </motion.div>
            </AnimatePresence>
          )}

        </main>
      </div>

    </div>
  );
}

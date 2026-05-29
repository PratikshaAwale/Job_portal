import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import JobSeekerProfile from '../models/JobSeekerProfile.js';
import Application from '../models/Application.js';
import sendEmail from '../utils/sendEmail.js';


export const createJob = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Access denied: Recruiters only.' });
    }

    const { title, category, salary, type, location, description, skills, experience, employmentType } = req.body;

    const job = await Job.create({
      company: req.user._id,
      companyName: req.user.name,
      title,
      category,
      salary,
      type,
      location,
      description,
      skills,
      experience,
      employmentType,
      applicants: [],
    });

    // Auto-create notifications for all job seekers
    const jobSeekers = await User.find({ role: 'jobseeker' });

    if (jobSeekers.length > 0) {
      const notifications = jobSeekers.map((seeker) => ({
        recipient: seeker._id,
        jobId: job._id,
        message: `New ${job.title} job posted by ${job.companyName}`,
      }));

      await Notification.insertMany(notifications);
    }

    res.status(201).json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all posted jobs for a recruiter
// @route   GET /api/jobs/posted
// @access  Private (Recruiter only)
export const getPostedJobs = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Access denied: Recruiters only.' });
    }

    const jobs = await Job.find({ company: req.user._id })
      .populate('applicants.user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Get posted jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all public jobs for homepage (No auth needed)
// @route   GET /api/jobs/public
// @access  Public
export const getPublicJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 }).select('-applicants');
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Get public jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single job details
// @route   GET /api/jobs/:id
// @access  Private
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Determine if the current user has already applied (if seeker)
    let hasApplied = false;
    let applicationStatus = null;

    if (req.user && req.user.role === 'jobseeker') {
      const applicantDetail = job.applicants.find(
        (app) => app.user.toString() === req.user._id.toString()
      );
      if (applicantDetail) {
        hasApplied = true;
        applicationStatus = applicantDetail.status;
      }
    }

    // Return the job, but omit full applicants list if the user is not the recruiter who posted it
    const isOwner = req.user && req.user._id.toString() === job.company.toString();
    const jobData = job.toObject();

    if (!isOwner) {
      delete jobData.applicants;
    }

    res.status(200).json({ ...jobData, hasApplied, applicationStatus });
  } catch (error) {
    console.error('Get job by id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all available jobs for seekers
// @route   GET /api/jobs
// @access  Private (Seeker only)
export const getAllJobs = async (req, res) => {
  try {
    if (req.user.role !== 'jobseeker') {
      return res.status(403).json({ message: 'Access denied: Seekers only.' });
    }

    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get seeker's applied jobs
// @route   GET /api/jobs/applied
// @access  Private (Seeker only)
export const getAppliedJobs = async (req, res) => {
  try {
    if (req.user.role !== 'jobseeker') {
      return res.status(403).json({ message: 'Access denied: Seekers only.' });
    }

    // Find all jobs where seeker has applied
    const jobs = await Job.find({ 'applicants.user': req.user._id });

    // Map to a simplified response structure matching frontend expectations
    const formatted = jobs.map((job) => {
      const applicantDetail = job.applicants.find(
        (app) => app.user.toString() === req.user._id.toString()
      );
      return {
        _id: job._id,
        title: job.title,
        companyName: job.companyName,
        location: job.location,
        salary: job.salary,
        type: job.type,
        status: applicantDetail ? applicantDetail.status : 'Pending',
        appliedAt: applicantDetail ? applicantDetail.createdAt : null,
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Get applied jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Apply to a job opening
// @route   POST /api/jobs/:id/apply
// @access  Private (Seeker only)
export const applyToJob = async (req, res) => {
  try {
    if (req.user.role !== 'jobseeker') {
      return res.status(403).json({ message: 'Access denied: Seekers only.' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job opening not found' });
    }

    // Check if already applied
    const alreadyApplied = job.applicants.some(
      (app) => app.user.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job listing.' });
    }

    // 1. Fetch real seeker profile if available to capture full details
    let phoneVal = '';
    let skillsVal = 'React, MERN Development';
    let educationVal = 'Not set';
    let resumeVal = 'resume.pdf';

    const profile = await JobSeekerProfile.findOne({ user: req.user._id });
    if (profile) {
      if (profile.personalInfo && profile.personalInfo.phone) {
        phoneVal = profile.personalInfo.phone;
      }
      if (profile.skills && profile.skills.length > 0) {
        skillsVal = profile.skills.join(', ');
      }
      if (profile.education && profile.education.length > 0) {
        educationVal = profile.education.map(edu =>
          `${edu.degree} from ${edu.college} (${edu.year}) - Grade: ${edu.score || 'N/A'}`
        ).join('; ');
      }
      if (profile.resume) {
        resumeVal = profile.resume;
      }
    }

    // 2. Create Application document in dedicated database collection
    const application = await Application.create({
      jobId: job._id,
      recruiterId: job.company,
      jobSeekerId: req.user._id,
      applicantName: req.user.name,
      applicantEmail: req.user.email,
      phone: phoneVal,
      skills: skillsVal,
      education: educationVal,
      resume: resumeVal,
      status: 'Pending',
    });

    // 3. Keep job applicants array updated for backward compatibility (flattened queries in dashboard)
    job.applicants.push({
      user: req.user._id,
      email: req.user.email,
      skills: skillsVal,
      resume: resumeVal,
      phone: phoneVal,
      education: educationVal,
      status: 'Pending',
    });

    await job.save();

    // 4. Send simple email notification to Recruiter using Nodemailer
    try {
      const recruiter = await User.findById(job.company);
      if (recruiter && recruiter.email) {
        const emailOptions = {
          email: recruiter.email,
          subject: `New Candidate Applied: ${job.title}`,
          message: `Hello ${recruiter.name},

A new candidate has applied for the "${job.title}" position on JobVerse.

Candidate Application Details:
----------------------------------------
- Name: ${req.user.name}
- Email: ${req.user.email}
- Phone: ${phoneVal || 'Not provided'}
- Skills: ${skillsVal}
- Education: ${educationVal}
- Resume Link: ${resumeVal}

Please log in to your Recruiter Dashboard to review the application and manage the candidate.

Best regards,
JobVerse Portal Team`,
        };

        await sendEmail(emailOptions);
      }
    } catch (emailErr) {
      console.error('SMTP Recruiter notification error:', emailErr.message);
    }

    res.status(201).json({ message: 'Application submitted successfully!', application });
  } catch (error) {
    console.error('Apply to job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update candidate application status
// @route   PUT /api/jobs/applications/:jobId/:applicantUserId/status
// @access  Private (Recruiter only)
export const updateApplicationStatus = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Access denied: Recruiters only.' });
    }

    const { jobId, applicantUserId } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Reviewed', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid application status value.' });
    }

    const job = await Job.findOne({ _id: jobId, company: req.user._id });
    if (!job) {
      return res.status(404).json({ message: 'Job listing not found or unauthorized.' });
    }

    const applicant = job.applicants.find(
      (app) => app.user.toString() === applicantUserId.toString()
    );

    if (!applicant) {
      return res.status(404).json({ message: 'Applicant candidate not found on this listing.' });
    }

    applicant.status = status;
    await job.save();

    // 5. Keep the dedicated Application collection in sync
    await Application.findOneAndUpdate(
      { jobId: jobId, jobSeekerId: applicantUserId },
      { status: status }
    );

    res.status(200).json({ message: `Applicant status successfully set to ${status}` });
  } catch (error) {
    console.error('Update applicant status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

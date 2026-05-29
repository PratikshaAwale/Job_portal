import Interview from '../models/Interview.js';
import sendEmail from '../utils/sendEmail.js';

// ─────────────────────────────────────────────────────────────
// @desc    Schedule a new interview for a job seeker
// @route   POST /api/interviews
// @access  Private (Recruiter only)
// ─────────────────────────────────────────────────────────────
export const scheduleInterview = async (req, res) => {
  try {
    // Only recruiters (employers) can schedule interviews
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Access denied: Recruiters only.' });
    }

    // Get all required fields from the request body
    const {
      applicationId,
      jobSeekerId,
      jobId,
      jobTitle,
      companyName,
      seekerName,
      seekerEmail,
      interviewDate,
      interviewTime,
      meetLink,
      message,
    } = req.body;

    // Simple validation - make sure required fields are provided
    if (!interviewDate || !interviewTime || !meetLink) {
      return res.status(400).json({ message: 'Interview date, time, and meet link are required.' });
    }

    // Save the interview details to MongoDB
    const interview = await Interview.create({
      applicationId,
      recruiterId: req.user._id,
      jobSeekerId,
      jobId,
      jobTitle,
      companyName,
      seekerName,
      seekerEmail,
      interviewDate,
      interviewTime,
      meetLink,
      message: message || '',
      status: 'Scheduled',
    });

    // Send congratulations email to the job seeker automatically
    // We use try-catch here so if email fails, the interview is still saved
    try {
      const emailOptions = {
        email: seekerEmail,
        subject: `Interview Scheduled - ${jobTitle} at ${companyName}`,
        message: `Dear ${seekerName},

Congratulations! Your resume has been shortlisted.

Your interview has been scheduled for the ${jobTitle} position at ${companyName}.

Interview Details:
─────────────────────────
Interview Date : ${interviewDate}
Interview Time : ${interviewTime}
Google Meet    : ${meetLink}
${message ? `\nMessage from Recruiter: ${message}` : ''}

Please join the meeting on time using the Google Meet link above.

We wish you the very best!

Best regards,
JobVerse Portal Team`,
      };

      await sendEmail(emailOptions);
      console.log('Interview email sent to job seeker:', seekerEmail);
    } catch (emailErr) {
      // Email failed but interview is already saved - log and continue
      console.error('Interview email sending failed:', emailErr.message);
    }

    res.status(201).json({ message: 'Interview scheduled successfully!', interview });
  } catch (error) {
    console.error('Schedule interview error:', error);
    res.status(500).json({ message: 'Server error while scheduling interview.' });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Get all interviews scheduled by a recruiter
// @route   GET /api/interviews/recruiter
// @access  Private (Recruiter only)
// ─────────────────────────────────────────────────────────────
export const getRecruiterInterviews = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Access denied: Recruiters only.' });
    }

    // Find all interviews where this recruiter is the one who scheduled
    const interviews = await Interview.find({ recruiterId: req.user._id })
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(interviews);
  } catch (error) {
    console.error('Get recruiter interviews error:', error);
    res.status(500).json({ message: 'Server error while fetching interviews.' });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Get all interviews for a job seeker (received interviews)
// @route   GET /api/interviews/seeker
// @access  Private (Job Seeker only)
// ─────────────────────────────────────────────────────────────
export const getSeekerInterviews = async (req, res) => {
  try {
    if (req.user.role !== 'jobseeker') {
      return res.status(403).json({ message: 'Access denied: Job seekers only.' });
    }

    // Find all interviews where this job seeker is the candidate
    const interviews = await Interview.find({ jobSeekerId: req.user._id })
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(interviews);
  } catch (error) {
    console.error('Get seeker interviews error:', error);
    res.status(500).json({ message: 'Server error while fetching interviews.' });
  }
};

// ─────────────────────────────────────────────────────────────
// @desc    Update the status of an interview (Scheduled/Completed/Cancelled)
// @route   PUT /api/interviews/:id/status
// @access  Private (Recruiter only)
// ─────────────────────────────────────────────────────────────
export const updateInterviewStatus = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Access denied: Recruiters only.' });
    }

    const { status } = req.body;

    // Validate that the status value is one of the allowed options
    if (!['Scheduled', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use: Scheduled, Completed, or Cancelled.' });
    }

    // Find the interview and make sure it belongs to this recruiter
    const interview = await Interview.findOne({
      _id: req.params.id,
      recruiterId: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found or unauthorized.' });
    }

    // Update the status
    interview.status = status;
    await interview.save();

    res.status(200).json({ message: `Interview status updated to ${status}`, interview });
  } catch (error) {
    console.error('Update interview status error:', error);
    res.status(500).json({ message: 'Server error while updating interview status.' });
  }
};

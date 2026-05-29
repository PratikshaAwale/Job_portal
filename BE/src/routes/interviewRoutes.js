import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  scheduleInterview,
  getRecruiterInterviews,
  getSeekerInterviews,
  updateInterviewStatus,
} from '../controllers/interviewController.js';

const router = express.Router();

// All routes are protected and require a logged-in user

// Create a new interview (Recruiter only)
router.post('/', protect, scheduleInterview);

// Get interviews scheduled by this recruiter (Recruiter only)
router.get('/recruiter', protect, getRecruiterInterviews);

// Get interviews for this job seeker (Job Seeker only)
router.get('/seeker', protect, getSeekerInterviews);

// Update interview status (Recruiter only)
router.put('/:id/status', protect, updateInterviewStatus);

export default router;

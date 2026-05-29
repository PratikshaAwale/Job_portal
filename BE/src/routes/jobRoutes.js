import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createJob,
  getPostedJobs,
  getAllJobs,
  getAppliedJobs,
  applyToJob,
  updateApplicationStatus,
  getPublicJobs,
  getJobById,
} from '../controllers/jobController.js';

const router = express.Router();

// Public routes
router.get('/public', getPublicJobs);

// Recruiter routes
router.post('/', protect, createJob);
router.get('/posted', protect, getPostedJobs);
router.put('/applications/:jobId/:applicantUserId/status', protect, updateApplicationStatus);

// Seeker routes
router.get('/', protect, getAllJobs);
router.get('/applied', protect, getAppliedJobs);
router.post('/:id/apply', protect, applyToJob);

// Shared protected routes
router.get('/:id', protect, getJobById);

export default router;

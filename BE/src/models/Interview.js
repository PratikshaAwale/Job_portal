import mongoose from 'mongoose';

// Interview Schema - stores all interview details in MongoDB
// This is similar to Application.js but for scheduled interviews
const interviewSchema = new mongoose.Schema(
  {
    // Which application this interview is linked to
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },

    // The recruiter who scheduled this interview
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // The job seeker who is being interviewed
    jobSeekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // The job this interview is for
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },

    // Job and company info (stored directly so we don't need extra DB lookups)
    jobTitle: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },

    // Job seeker contact info (stored for easy email sending)
    seekerName: {
      type: String,
      required: true,
    },
    seekerEmail: {
      type: String,
      required: true,
    },

    // Interview schedule details
    interviewDate: {
      type: String, // Store as string e.g. "2026-05-25" for simplicity
      required: true,
    },
    interviewTime: {
      type: String, // Store as string e.g. "11:00 AM" for simplicity
      required: true,
    },

    // Google Meet or any video call link
    meetLink: {
      type: String,
      required: true,
    },

    // Optional message from recruiter to job seeker
    message: {
      type: String,
      default: '',
    },

    // Simple status tracking
    // Scheduled = upcoming, Completed = done, Cancelled = cancelled
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;

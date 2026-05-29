import mongoose from 'mongoose';

// Simple Application schema for storing job applications in MongoDB
const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobSeekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicantName: {
      type: String,
      required: true,
    },
    applicantEmail: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: '',
    },
    skills: {
      type: String,
      default: '',
    },
    education: {
      type: String,
      default: '',
    },
    resume: {
      type: String,
      default: 'resume.pdf',
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true } // Automatically creates createdAt (applied date) and updatedAt fields
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;

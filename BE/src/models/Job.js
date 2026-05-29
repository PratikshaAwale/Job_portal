import mongoose from 'mongoose';

// Schema for each applicant who applies to a job
const applicantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
        email: { type: String, required: true },
    skills: { type: String, required: true },
    resume: { type: String, default: 'resume.pdf' },
    phone: { type: String, default: '' },
    education: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

// Main Job schema
const jobSchema = new mongoose.Schema(
  {
    // Who posted this job (Recruiter user reference)
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: { type: String, required: true },

    // Basic job info
    title:       { type: String, required: true },
    category:    { type: String, required: true, default: 'IT & Software' },
    salary:      { type: String, required: true },
    type:        { type: String, required: true, default: 'Full-time' },
    location:    { type: String, required: true },
    description: { type: String, required: true },

    // New fields added for detailed job posts
    skills:         { type: String, default: '' },       // e.g. "React, Node.js, MongoDB"
    experience:     { type: String, default: 'Fresher' }, // e.g. "2-3 Years"
    employmentType: { type: String, default: 'Full-time' }, // Full-time / Part-time / Remote / Contract

    // List of applicants for this job
    applicants: [applicantSchema],
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

const Job = mongoose.model('Job', jobSchema);

export default Job;

import mongoose from 'mongoose';

const jobSeekerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  personalInfo: {
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    gender: { type: String, default: 'Prefer not to say' },
    dob: { type: String, default: '' },
    title: { type: String, default: 'Professional' }
  },
  skills: [{ type: String }],
  education: [
    {
      degree: { type: String, required: true },
      college: { type: String, required: true },
      year: { type: String, required: true },
      score: { type: String, default: '' }
    }
  ],
  experience: [
    {
      title: { type: String, required: true },
      company: { type: String, required: true },
      duration: { type: String, required: true },
      description: { type: String, default: '' }
    }
  ],
  projects: [
    {
      name: { type: String, required: true },
      link: { type: String, default: '' },
      description: { type: String, default: '' },
      techStack: { type: String, default: '' }
    }
  ],
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' }
  },
  resume: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const JobSeekerProfile = mongoose.model('JobSeekerProfile', jobSeekerProfileSchema);

export default JobSeekerProfile;

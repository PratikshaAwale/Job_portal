import JobSeekerProfile from '../models/JobSeekerProfile.js';


export const getProfile = async (req, res) => {
  try {
    let profile = await JobSeekerProfile.findOne({ user: req.user._id });

    // If no profile exists, return a default empty profile structure
    if (!profile) {
      return res.status(200).json({
        personalInfo: { phone: '', location: '', gender: 'Prefer not to say', dob: '', title: 'Professional' },
        skills: [],
        education: [],
        experience: [],
        projects: [],
        socialLinks: { github: '', linkedin: '', portfolio: '' },
        resume: ''
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    let profile = await JobSeekerProfile.findOne({ user: userId });

    if (profile) {

      if (req.body.personalInfo) profile.personalInfo = { ...profile.personalInfo, ...req.body.personalInfo };
      if (req.body.skills) profile.skills = req.body.skills;
      if (req.body.education) profile.education = req.body.education;
      if (req.body.experience) profile.experience = req.body.experience;
      if (req.body.projects) profile.projects = req.body.projects;
      if (req.body.socialLinks) profile.socialLinks = { ...profile.socialLinks, ...req.body.socialLinks };
      if (req.body.resume !== undefined) profile.resume = req.body.resume;

      const updatedProfile = await profile.save();
      return res.status(200).json(updatedProfile);
    } else {
      // Create new profile
      const newProfile = new JobSeekerProfile({
        user: userId,
        personalInfo: req.body.personalInfo || {},
        skills: req.body.skills || [],
        education: req.body.education || [],
        experience: req.body.experience || [],
        projects: req.body.projects || [],
        socialLinks: req.body.socialLinks || {},
        resume: req.body.resume || ''
      });

      const createdProfile = await newProfile.save();
      return res.status(201).json(createdProfile);
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

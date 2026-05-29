import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios.js';
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Fetch profile when user context changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const res = await api.get('/profile');
          setProfile(res.data);
          calculateCompletion(res.data);
        } catch (err) {
          console.error('Failed to fetch profile', err);
          toast.error('Failed to load profile data');
        } finally {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  // Calculate completion percentage dynamically
  const calculateCompletion = (data) => {
    if (!data) return setProfileCompletion(0);

    let score = 0;
    
    // Personal Info (20%) - Needs phone and location minimally
    if (data.personalInfo?.phone && data.personalInfo?.location) {
      score += 20;
    } else if (data.personalInfo?.phone || data.personalInfo?.location) {
      score += 10;
    }

    // Education (20%)
    if (data.education && data.education.length > 0) score += 20;

    // Experience (20%)
    if (data.experience && data.experience.length > 0) score += 20;

    // Skills (15%)
    if (data.skills && data.skills.length > 0) score += 15;

    // Projects (15%)
    if (data.projects && data.projects.length > 0) score += 15;

    // Resume or Social Links (10%)
    if (data.resume || (data.socialLinks && (data.socialLinks.github || data.socialLinks.linkedin))) {
      score += 10;
    }

    setProfileCompletion(score);
  };

  const updateProfileSection = async (sectionData) => {
    try {
      // sectionData could be { personalInfo: {...} } or { education: [...] }
      const res = await api.put('/profile', sectionData);
      setProfile(res.data);
      calculateCompletion(res.data);
      return res.data;
    } catch (err) {
      console.error('Failed to update profile section', err);
      toast.error('Failed to save changes');
      throw err;
    }
  };

  const value = {
    profile,
    loading,
    profileCompletion,
    updateProfileSection
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

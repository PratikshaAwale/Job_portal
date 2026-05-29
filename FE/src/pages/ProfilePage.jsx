import React from 'react';
import PersonalInfoCard from '../components/profile/PersonalInfoCard.jsx';
import EducationCard from '../components/profile/EducationCard.jsx';
import SkillsCard from '../components/profile/SkillsCard.jsx';
import ExperienceCard from '../components/profile/ExperienceCard.jsx';
import ProjectsCard from '../components/profile/ProjectsCard.jsx';
import ResumeCard from '../components/profile/ResumeCard.jsx';
import SocialLinksCard from '../components/profile/SocialLinksCard.jsx';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Manage your personal information, resume, and professional details.
        </p>
      </div>

      {/* Profile Cards Container */}
      <div className="flex flex-col gap-6">
        <PersonalInfoCard />
        <ResumeCard />
        <SkillsCard />
        <ExperienceCard />
        <EducationCard />
        <ProjectsCard />
        <SocialLinksCard />
      </div>
      
      </div>
    </div>
  );
}

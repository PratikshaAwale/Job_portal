import { motion } from 'framer-motion';

const trendingJobs = [
  "Senior Frontend Engineer", "Product Designer", "Data Scientist", "Full Stack Developer", 
  "DevOps Specialist", "Marketing Manager", "UX Researcher", "Cyber Security Analyst",
  "AI Engineer", "Backend Developer", "Mobile Developer", "Cloud Architect"
];

export default function TrendingJobsSlider() {
  return (
    <div className="py-10 bg-white dark:bg-surface-950 border-y border-surface-100 dark:border-surface-800 overflow-hidden">
      <div className="flex items-center whitespace-nowrap">
        <motion.div 
          animate={{ x: [0, -1920] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex gap-8 items-center"
        >
          {[...trendingJobs, ...trendingJobs].map((job, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 hover:border-primary-400 transition-colors cursor-pointer group"
            >
              <div className="w-2 h-2 rounded-full bg-primary-500 group-hover:scale-150 transition-transform" />
              <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">
                {job}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

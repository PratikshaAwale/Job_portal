import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ArrowRight, TrendingUp } from 'lucide-react';
import { stats } from '../../data/mockData.js';
import './HeroSection.css'; // Importing separate UI styles

/**
 * AnimatedCounter Hook
 * Handles the logic for counting up numbers when they enter the viewport.
 */
function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStarted(true);
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}

/**
 * StatCard Component
 * Displays a single statistic with an animated counter.
 */
function StatCard({ stat, index }) {
  const { count, ref } = useCounter(stat.value);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="stat-card"
    >
      <div className="stat-value">
        {count.toLocaleString()}
        <span className="text-blue-400">{stat.suffix}</span>
      </div>
      <div className="stat-label">{stat.label}</div>
    </motion.div>
  );
}

/**
 * HeroSection Component
 * The main landing area with search functionality and background animations.
 */
export default function HeroSection() {
  const [jobQuery, setJobQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const trending = ['React Developer', 'UI/UX Designer', 'Data Scientist', 'Product Manager'];

  return (
    <section id="home" className="hero-section">
      
      {/* Background elements (Orbs and Gradients) */}
      <div className="hero-bg-image" />
      <div className="hero-gradient-bg" />
      <div className="hero-overlay" />
      <div className="hero-pattern" />

      <div className="hero-container">
        <div className="hero-content-wrapper">
          
          {/* Top Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-badge"
          >
            <TrendingUp className="w-4 h-4" /> #1 Job Platform in 2026
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-heading"
          >
            Find Your <span className="gradient-text">Dream Job</span> Today
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hero-description"
          >
            Connect with <span className="text-white font-bold">10,000+</span> opportunities from top companies.
          </motion.p>

          {/* Search Bar UI */}
          <div className="search-bar-container">
            <div className="search-input-group">
              <div className="search-input-wrapper">
                <Search className="search-input-icon" />
                <input 
                  type="text" 
                  value={jobQuery}
                  onChange={(e) => setJobQuery(e.target.value)}
                  placeholder="Job title or company" 
                  className="search-input"
                />
              </div>
              <div className="search-input-wrapper">
                <MapPin className="search-input-icon" />
                <input 
                  type="text" 
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="City or Remote" 
                  className="search-input"
                />
              </div>
              <button className="search-submit-btn">
                Search Jobs <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Trending Searches */}
          <div className="trending-wrapper">
            <span className="trending-label">Trending:</span>
            {trending.map(item => (
              <button key={item} onClick={() => setJobQuery(item)} className="trending-tag">
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="hero-stats-grid">
          {stats.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>
      </div>

      {/* Bottom transition to next section */}
      <div className="hero-bottom-fade" />
    </section>
  );
}

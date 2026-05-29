import { motion } from 'framer-motion';
import { features } from '../../data/mockData.js';
import './WhyChooseUs.css'; // Importing separate UI styles

/**
 * FeatureCard Component
 * Displays a single feature/benefit with an icon and description.
 */
function FeatureCard({ feature, index }) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="feature-card group"
    >
      {/* Background glow on hover */}
      <div
        className="feature-hover-glow"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${feature.color}08, transparent 70%)`,
        }}
      />

      <div className="feature-card-content">
        {/* Icon wrapper */}
        <div 
          className="feature-icon-box"
          style={{ backgroundColor: `${feature.color}12` }}
        >
          <Icon className="w-8 h-8" style={{ color: feature.color }} />
        </div>

        {/* Feature Text */}
        <h3 className="feature-title">{feature.title}</h3>
        <p className="feature-desc">{feature.description}</p>
      </div>
    </motion.div>
  );
}

/**
 * WhyChooseUs Component
 * Explains the advantages of using JobVerse.
 */
export default function WhyChooseUs() {
  return (
    <section className="why-choose-section">
      <div className="why-choose-container">
        
        {/* Section Heading */}
        <div className="why-choose-header">
          <span className="why-choose-badge">Why JobVerse</span>
          <h2 className="why-choose-title">
            Why <span className="gradient-text">Choose Us</span>
          </h2>
          <p className="why-choose-desc">
            Everything you need for a smarter, faster, and more secure job search.
          </p>
        </div>

        {/* Features Grid */}
        <div className="why-choose-grid">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

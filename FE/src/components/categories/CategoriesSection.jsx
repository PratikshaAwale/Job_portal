import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { categories } from '../../data/mockData.js';
import './CategoriesSection.css'; // Importing separate UI styles

/**
 * CategoryCard Component
 * Displays a job category with an icon, title, and current openings.
 */
function CategoryCard({ category, index }) {
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="category-card group"
    >
      {/* 1. Category Icon */}
      <div 
        className="category-icon-wrapper"
        style={{ backgroundColor: `${category.color}15`, color: category.color }}
      >
        <Icon className="w-7 h-7" />
      </div>

      {/* 2. Category Info */}
      <h3 className="category-title">{category.title}</h3>
      <p className="category-openings">{category.openings.toLocaleString()} Open Positions</p>

      {/* 3. Hover Interaction */}
      <div className="explore-link">
        Explore Jobs <ArrowRight className="w-4 h-4" />
      </div>
    </motion.div>
  );
}

/**
 * CategoriesSection Component
 * Displays a grid of job categories for quick filtering.
 */
export default function CategoriesSection() {
  return (
    <section id="about" className="categories-section">
      <div className="categories-container">
        
        {/* Section Heading */}
        <div className="categories-header">
          <span className="section-badge section-badge-blue">
            Explore Categories
          </span>
          <h2 className="section-title">Browse By <span className="gradient-text">Category</span></h2>
          <p className="section-subtitle">
            Find roles in the most in‑demand industries across the globe
          </p>
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          {categories.map((cat, index) => (
            <CategoryCard key={cat.id} category={cat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

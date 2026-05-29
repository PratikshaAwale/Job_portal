import { motion } from 'framer-motion';
import { Building2, ArrowRight, Star, Users } from 'lucide-react';
import { topCompanies } from '../../data/mockData.js';
import './TopCompanies.css'; // Importing separate UI styles

/**
 * CompanyCard Component
 * Displays a single company with its logo, industry, rating, and opening count.
 */
function CompanyCard({ company, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="company-card group"
    >
      {/* 1. Logo Section */}
      <div className="company-logo-wrapper">
        {company.logo ? (
          <img src={company.logo} alt={company.name} className="company-logo-img" />
        ) : (
          <Building2 className="company-logo-icon" />
        )}
      </div>

      {/* 2. Company Info */}
      <h3 className="company-name">{company.name}</h3>
      <p className="company-industry-text">{company.industry}</p>

      {/* 3. Rating & Openings Meta */}
      <div className="company-meta-row">
        <div className="company-rating-wrapper">
          <Star className="w-4 h-4 fill-current" />
          <span className="font-bold">{company.rating}</span>
        </div>
        <div className="company-openings-wrapper">
          <Users className="w-4 h-4" />
          <span className="font-medium">{company.openPositions} openings</span>
        </div>
      </div>

      {/* 4. Action Button */}
      <button className="company-action-btn">
        View Positions <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

/**
 * TopCompanies Component
 * Displays a curated list of top hiring companies.
 */
export default function TopCompanies() {
  return (
    <section id="companies" className="companies-section">
      <div className="companies-container">
        
        {/* Section Heading */}
        <div className="companies-header">
          <span className="section-badge section-badge-emerald">
            Trusted Employers
          </span>
          <h2 className="section-title">Top <span className="gradient-text">Companies</span> Hiring</h2>
          <p className="section-subtitle">
            Join teams at companies that are building the future
          </p>
        </div>

        {/* Companies Grid */}
        <div className="companies-grid">
          {topCompanies.map((company, index) => (
            <CompanyCard key={company.id} company={company} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

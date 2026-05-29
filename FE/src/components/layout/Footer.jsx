import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  MessageCircle,
  Share2,
  Globe,
  Rss,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';
import './Footer.css'; // Importing separate UI styles

/**
 * Footer Links Data
 */
const footerLinks = {
  Product: [
    { label: 'Find Jobs', href: '/jobs' },
    { label: 'Companies', href: '/companies' },
    { label: 'Salary Insights', href: '/salary' },
    { label: 'Resume Builder', href: '/resume' },
    { label: 'Skill Assessments', href: '/skills' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Press Kit', href: '/press' },
    { label: 'Contact', href: '/contact' },
  ],
  Resources: [
    { label: 'Help Center', href: '/help' },
    { label: 'API Docs', href: '/docs' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Settings', href: '/cookies' },
  ],
};

/**
 * Social Media Links Data
 */
const socialLinks = [
  { icon: MessageCircle, href: '#', label: 'Twitter' },
  { icon: Share2, href: '#', label: 'LinkedIn' },
  { icon: Globe, href: '#', label: 'GitHub' },
  { icon: Rss, href: '#', label: 'Instagram' },
];

/**
 * Footer Component
 * Displays site navigation, contact info, and social links.
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* 1. Main Content Grid */}
        <div className="footer-grid">

          {/* Brand Info Column */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-logo-container">
              <div className="footer-logo-icon">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="footer-logo-text">
                Job<span className="text-blue-400">Verse</span>
              </span>
            </Link>
            <p className="footer-description">
              The smarter way to find your next career opportunity. AI-powered matching,
              verified employers, and a community of 20,000+ professionals.
            </p>
            <div className="footer-contact-list">
              <a href="mailto:hello@jobverse.com" className="footer-contact-item">
                <Mail className="w-4 h-4" /> hello@jobverse.com
              </a>
              <a href="tel:+18005551234" className="footer-contact-item">
                <Phone className="w-4 h-4" /> +91 8605784224
              </a>
              <span className="footer-contact-item">
                <MapPin className="w-4 h-4" /> Pune, Maharashtra, India
              </span>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="footer-heading">{title}</h4>
              <ul className="footer-links-list">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="footer-link group">
                      {link.label}
                      <ArrowUpRight className="footer-link-icon" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 2. Bottom Copyright Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} JobVerse. All rights reserved.
          </p>

          {/* Social Media Buttons */}
          <div className="social-links-container">
            {socialLinks.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="social-link"
                aria-label={s.label}
              >
                <s.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

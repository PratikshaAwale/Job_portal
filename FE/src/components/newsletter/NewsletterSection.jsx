import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, CheckCircle } from 'lucide-react';
import './NewsletterSection.css'; // Importing separate UI styles


export default function NewsletterSection() {
  const [email, setEmail] = useState(''); // User's email input
  const [submitted, setSubmitted] = useState(false); // Controls success state

  // Handles the subscription form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    // Reset form after a short delay
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section id="contact" className="newsletter-section">
      <div className="newsletter-container">
        <div className="newsletter-card">
          
          {/* Background Visual Overlay */}
          <div className="newsletter-glow" />

          {/* Heading Content */}
          <h2 className="newsletter-title">Stay <span className="text-blue-400">Ahead</span> of the Curve</h2>
          <p className="newsletter-desc">
            Subscribe to get the latest job trends, career tips, and exclusive opportunities
            delivered straight to your inbox.
          </p>

          {/* Subscription Form */}
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address" 
              className="newsletter-input" 
              required
            />
            <button type="submit" disabled={submitted} className="newsletter-submit">
              {submitted ? (
                <span className="btn-content"><CheckCircle className="w-4 h-4" /> Subscribed!</span>
              ) : (
                <span className="btn-content">Subscribe <Send className="w-4 h-4" /></span>
              )}
            </button>
          </form>

          {/* Trust Elements */}
          <div className="newsletter-trust">
            <span>✓ No spam ever</span>
            <span>✓ Unsubscribe anytime</span>
            <span>✓ Private & Secure</span>
          </div>
        </div>
      </div>
    </section>
  );
}

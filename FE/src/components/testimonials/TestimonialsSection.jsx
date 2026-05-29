import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '../../data/mockData.js';
import './TestimonialsSection.css'; // Importing separate UI styles


export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  // Move to the next testimonial
  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  // Move to the previous testimonial
  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Automatic slide rotation every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  // Animation configuration for the slide transitions
  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  const t = testimonials[current]; // Data for the active testimonial

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">

        {/* Section Header */}
        <div className="testimonials-header">
          <span className="section-badge section-badge-amber">
            Success Stories
          </span>
          <h2 className="section-title">What Our <span className="gradient-text">Users Say</span></h2>
          <p className="section-subtitle">
            Hear from candidates who landed their dream roles through JobVerse
          </p>
        </div>

        {/* Carousel UI */}
        <div className="carousel-wrapper">

          {/* Navigation Controls */}
          <button onClick={prev} className="carousel-btn carousel-btn-left">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} className="carousel-btn carousel-btn-right">
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Active Testimonial Card */}
          <div className="carousel-inner">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={t.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="testimonial-card"
              >
                <Quote className="quote-icon" />
                <p className="testimonial-text">&ldquo;{t.content}&rdquo;</p>

                {/* Author Profile */}
                <div className="testimonial-author-row">
                  <div className="user-profile">
                    <img src={t.avatar} alt={t.name} className="user-avatar" />
                    <div>
                      <p className="user-name">{t.name}</p>
                      <p className="user-role">{t.role}</p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="rating-wrapper">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`star-icon ${i < t.rating ? 'star-active' : 'star-inactive'}`} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicator Dots */}
          <div className="indicator-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className={`dot ${i === current ? 'dot-active' : 'dot-inactive'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

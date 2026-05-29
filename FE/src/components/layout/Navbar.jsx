import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Briefcase, Bell, User, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { navLinks } from '../../data/mockData.js';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [scrolled, setScrolled] = useState(false); // Sticky header state
  const [activeLink, setActiveLink] = useState('#home'); // Active link state
  const { darkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);
  const [mobileBellOpen, setMobileBellOpen] = useState(false);
  const mobileBellRef = useRef(null);

  // Change navbar style when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setBellOpen(false);
      }
      if (mobileBellRef.current && !mobileBellRef.current.contains(event.target)) {
        setMobileBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * handleNavClick - Simple function to scroll to sections
   * @param {string} href - The #id of the section
   */
  const handleNavClick = (href) => {
    setActiveLink(href); // Update active link highlighting
    setIsOpen(false); // Close mobile menu if open

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      // Smooth scroll to the section with a small offset for the fixed navbar
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`navbar ${scrolled ? 'navbar-scrolled' : 'navbar-top'}`}
    >
      <div className="navbar-inner">
        <div className="flex items-center justify-between">

          {/* 1. Logo */}
          <Link to="/" onClick={() => handleNavClick('#home')} className="logo-container group">
            <div className="logo-icon">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="logo-text">
              <span className="gradient-text">Job</span>
              <span className={scrolled ? "text-slate-900 dark:text-white" : "text-white"}>Verse</span>
            </span>
          </Link>

          {/* 2. Desktop Menu */}
          <div className="desktop-menu">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className={`nav-link ${scrolled ? 'nav-link-scrolled' : 'nav-link-top'} ${activeLink === link.href ? 'nav-link-active' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* 3. Right Side Actions */}
          <div className="desktop-actions">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Notification Bell with professional dropdown */}
                <div className="relative" ref={bellRef}>
                  <button 
                    onClick={() => setBellOpen(!bellOpen)} 
                    className={`p-2.5 rounded-full transition-all duration-300 group cursor-pointer focus:outline-none ${
                      scrolled 
                        ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400' 
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Bell className="w-5.5 h-5.5 transition-transform group-hover:scale-105" />
                  </button>

                  <AnimatePresence>
                    {bellOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-150 dark:border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden"
                      >
                        {/* Header */}
                        <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                          <h4 className="text-sm font-bold text-slate-955 dark:text-white">
                            Notifications
                          </h4>
                          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">
                            Mark all as read
                          </span>
                        </div>

                        {/* Empty State / Professional "No Notifications" Screen */}
                        <div className="p-8 flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 animate-pulse">
                            <Bell className="w-8 h-8" />
                          </div>
                          <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                            All caught up!
                          </h5>
                          <p className="text-xs text-slate-450 dark:text-slate-400 mt-2 leading-relaxed max-w-[240px] mx-auto">
                            You don't have any new notifications right now. We'll let you know when jobs, updates or messages arrive.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Integrated Profile Pill Container (Hamburger + Profile Avatar) */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)} 
                    className={`flex items-center gap-3 pl-3.5 pr-2 py-1.5 rounded-full border transition-all duration-300 shadow-sm cursor-pointer focus:outline-none ${
                      scrolled
                        ? 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-50/80 dark:hover:bg-slate-850/80 text-slate-700 dark:text-slate-300'
                        : 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white'
                    }`}
                  >
                    {/* Horizontal menu lines (Hamburger) */}
                    <Menu className={`w-4 h-4 transition-colors ${
                      scrolled ? 'text-slate-500 dark:text-slate-455' : 'text-white/80'
                    }`} />
                    
                    {/* User Profile Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 dark:border-slate-850">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff&bold=true`} 
                        alt="User Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden"
                      >
                        {/* Profile header */}
                        <div className="p-6 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-250/20 shadow-md">
                            <img 
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff&bold=true`} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate leading-snug">
                              {user.name}
                            </h4>
                            <p className="text-xs text-slate-450 dark:text-slate-400 truncate leading-snug mt-0.5">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {/* Actions list */}
                        <div className="py-2">
                          <Link 
                            to="/profile" 
                            onClick={() => setDropdownOpen(false)} 
                            className="flex items-center gap-3.5 px-6 py-3 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <User className="w-4.5 h-4.5 text-slate-450" />
                            <span className="text-sm font-medium">My Profile</span>
                          </Link>

                          <Link 
                            to="/dashboard" 
                            onClick={() => setDropdownOpen(false)} 
                            className="flex items-center gap-3.5 px-6 py-3 text-slate-700 dark:text-slate-355 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <LayoutDashboard className="w-4.5 h-4.5 text-slate-450" />
                            <span className="text-sm font-medium">Dashboard</span>
                          </Link>

                          <Link 
                            to="/settings" 
                            onClick={() => setDropdownOpen(false)} 
                            className="flex items-center gap-3.5 px-6 py-3 text-slate-700 dark:text-slate-355 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <Settings className="w-4.5 h-4.5 text-slate-450" />
                            <span className="text-sm font-medium">Settings</span>
                          </Link>

                          {/* Dark Mode toggle switch */}
                          <div className="flex items-center justify-between px-6 py-3 text-slate-700 dark:text-slate-355">
                            <div className="flex items-center gap-3.5">
                              <Moon className="w-4.5 h-4.5 text-slate-455" />
                              <span className="text-sm font-medium">Dark Mode</span>
                            </div>
                            <button
                              onClick={toggleTheme}
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${darkMode ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`}
                            >
                              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                          </div>
                        </div>

                        {/* Logout footer */}
                        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 py-1.5">
                          <button 
                            onClick={() => { logout(); setDropdownOpen(false); }} 
                            className="flex items-center gap-3.5 w-full text-left px-6 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer font-semibold"
                          >
                            <LogOut className="w-4.5 h-4.5" />
                            <span className="text-sm">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <>
                <button onClick={toggleTheme} className="theme-toggle-btn mr-1">
                  {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
                </button>
                <Link to="/login" className={`btn-login ${scrolled ? 'btn-login-scrolled' : 'btn-login-top'}`}>
                  Log in
                </Link>
                <Link to="/register" className="btn-register">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* 4. Mobile Menu Button */}
          <div className="mobile-controls">
            {user && (
              <div className="relative" ref={mobileBellRef}>
                <button 
                  onClick={() => setMobileBellOpen(!mobileBellOpen)}
                  className="relative p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300 cursor-pointer focus:outline-none"
                >
                  <Bell className="w-4.5 h-4.5" />
                </button>

                <AnimatePresence>
                  {mobileBellOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-72 sm:w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-150 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                        <h4 className="text-xs font-bold text-slate-955 dark:text-white">
                          Notifications
                        </h4>
                      </div>

                      {/* Empty State */}
                      <div className="p-6 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 animate-pulse">
                          <Bell className="w-6 h-6" />
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                          All caught up!
                        </h5>
                        <p className="text-[10px] text-slate-450 dark:text-slate-455 mt-1.5 leading-relaxed max-w-[200px]">
                          You don't have any new notifications right now.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <button onClick={toggleTheme} className="mobile-action-btn">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="mobile-action-btn">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-menu"
          >
            <div className="mobile-menu-inner">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className={`mobile-nav-link ${activeLink === link.href ? 'mobile-nav-link-active' : ''}`}
                >
                  {link.label}
                </a>
              ))}
              
              {user ? (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="px-4 py-2 flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-blue-500">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff&bold=true`} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {user.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850"
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-855"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/settings" 
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-355 hover:bg-slate-50 dark:hover:bg-slate-860"
                  >
                    Settings
                  </Link>
                  <button 
                    onClick={() => { logout(); setIsOpen(false); }} 
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 cursor-pointer font-bold border-t border-slate-100 dark:border-slate-800/80"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="px-4 py-2 text-center text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    Log in
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="px-4 py-2 text-center text-sm font-medium text-white bg-blue-600 rounded-lg">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

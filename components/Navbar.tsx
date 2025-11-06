'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, FileText, ChevronDown, Zap, Home, Calendar, Users, Target, MapPin, BookOpen, DollarSign, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [committeeDropdownOpen, setCommitteeDropdownOpen] = useState(false);
  const [mobileCommitteeOpen, setMobileCommitteeOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinksBeforeCommittee = [
    { name: 'Home', path: '/', icon: Home }
  ];
  
  const navLinksAfterCommittee = [
    { name: 'Agenda', path: '/agenda', icon: Calendar },
    { name: 'Speakers', path: '/speakers', icon: Users },
    { name: 'Tracks', path: '/tracks', icon: Target },
    { name: 'Venue', path: '/venue', icon: MapPin },
    { name: 'Journal', path: '/journal', icon: BookOpen },
    { name: 'Fees', path: '/fees', icon: DollarSign },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className={`transition-all duration-500 ${
          scrolled || !isHomePage
            ? 'bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]' 
            : 'bg-transparent'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group mr-8">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  transition={{ duration: 0.4 }}
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden ${
                    scrolled || !isHomePage
                      ? 'bg-gradient-to-br from-primary-600 via-purple-600 to-accent-600' 
                      : 'bg-white/20 backdrop-blur-sm border-2 border-white/30'
                  } shadow-lg`}
                >
                  <Zap className="text-white" size={24} strokeWidth={2.5} />
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <div className="flex flex-col">
                  <span className={`text-xl font-black tracking-tight leading-none ${
                    scrolled || !isHomePage
                      ? 'bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 bg-clip-text text-transparent' 
                      : 'text-white drop-shadow-lg'
                  }`}>
                    FUSION-SDG
                  </span>
                  <span className={`text-xs font-bold tracking-wider ${
                    scrolled || !isHomePage ? 'text-gray-600' : 'text-white/80'
                  }`}>
                    2026
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                {/* Home Link */}
                {navLinksBeforeCommittee.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.path;
                  return (
                    <motion.div 
                      key={link.path}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <Link
                        href={link.path}
                        className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 group ${
                          isActive
                            ? (scrolled || !isHomePage)
                              ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                              : 'bg-white/25 backdrop-blur-sm text-white border-2 border-white/40'
                            : (scrolled || !isHomePage)
                            ? 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                            : 'text-white/90 hover:bg-white/15 backdrop-blur-sm'
                        }`}
                      >
                        <Icon size={16} strokeWidth={2.5} />
                        <span>{link.name}</span>
                        {isActive && (
                          <motion.div
                            layoutId="navPill"
                            className="absolute inset-0 rounded-xl -z-10"
                            style={{ 
                              boxShadow: (scrolled || !isHomePage)
                                ? '0 4px 20px rgba(139, 92, 246, 0.3)' 
                                : '0 4px 20px rgba(255, 255, 255, 0.2)'
                            }}
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
                
                {/* Committee Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => setCommitteeDropdownOpen(true)}
                  onMouseLeave={() => setCommitteeDropdownOpen(false)}
                >
                  <motion.button
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.96 }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      scrolled || !isHomePage
                        ? 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                        : 'text-white/90 hover:bg-white/15 backdrop-blur-sm'
                    }`}
                  >
                    <Users size={16} strokeWidth={2.5} />
                    <span>Committee</span>
                    <ChevronDown size={14} strokeWidth={2.5} className={`transition-transform duration-300 ${committeeDropdownOpen ? 'rotate-180' : ''}`} />
                  </motion.button>
                  
                  <AnimatePresence>
                    {committeeDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden"
                      >
                        <div className="p-2">
                          <Link
                            href="/committee"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:text-primary-600 transition-all duration-200 group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Users size={16} className="text-primary-600" strokeWidth={2.5} />
                            </div>
                            <span className="font-semibold text-sm">Conference Committee</span>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Other Links */}
                {navLinksAfterCommittee.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.path;
                  return (
                    <motion.div 
                      key={link.path}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <Link
                        href={link.path}
                        className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 group ${
                          isActive
                            ? (scrolled || !isHomePage)
                              ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                              : 'bg-white/25 backdrop-blur-sm text-white border-2 border-white/40'
                            : (scrolled || !isHomePage)
                            ? 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                            : 'text-white/90 hover:bg-white/15 backdrop-blur-sm'
                        }`}
                      >
                        <Icon size={16} strokeWidth={2.5} />
                        <span>{link.name}</span>
                        {isActive && (
                          <motion.div
                            layoutId="navPill"
                            className="absolute inset-0 rounded-xl -z-10"
                            style={{ 
                              boxShadow: (scrolled || !isHomePage)
                                ? '0 4px 20px rgba(139, 92, 246, 0.3)' 
                                : '0 4px 20px rgba(255, 255, 255, 0.2)'
                            }}
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
                
                {/* Submit Paper CTA */}
                <motion.div 
                  whileHover={{ scale: 1.05, y: -2 }} 
                  whileTap={{ scale: 0.95 }}
                  className="ml-2"
                >
                  <Link
                    href="/submit-paper"
                    className="relative flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 text-white rounded-xl font-bold text-sm shadow-[0_4px_20px_rgba(139,92,246,0.4)] hover:shadow-[0_6px_30px_rgba(139,92,246,0.5)] transition-all duration-300 overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                    <FileText size={16} strokeWidth={2.5} />
                    <span>Submit Paper</span>
                  </Link>
                </motion.div>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`lg:hidden p-3 rounded-xl transition-all duration-300 ${
                  scrolled || !isHomePage
                    ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                    : 'bg-white/20 backdrop-blur-sm text-white border-2 border-white/40'
                }`}
              >
                {isOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-200 bg-white shadow-lg"
            >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {/* Home Link */}
              {navLinksBeforeCommittee.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile Committee Dropdown */}
              <div>
                <button
                  onClick={() => setMobileCommitteeOpen(!mobileCommitteeOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                >
                  <span>Committee</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${mobileCommitteeOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {mobileCommitteeOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-4 overflow-hidden"
                    >
                      <Link
                        href="/committee"
                        onClick={() => {
                          setIsOpen(false);
                          setMobileCommitteeOpen(false);
                        }}
                        className="block px-4 py-3 text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors text-sm"
                      >
                        Conference Committee
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Other Links */}
              {navLinksAfterCommittee.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
                <Link
                  href="/submit-paper"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 mx-4 mb-2 px-4 py-3 bg-gradient-to-r from-primary-600 via-purple-600 to-accent-600 text-white rounded-xl text-center font-bold shadow-lg"
                >
                  <FileText size={18} strokeWidth={2.5} />
                  <span>Submit Paper</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;

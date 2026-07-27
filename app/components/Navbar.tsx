'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { profile } from '@/lib/portfolio-data';
import CommandPalette from './CommandPalette';

const navigation = [
  { name: 'Home', href: '#home', icon: 'mdi:home-outline' },
  { name: 'About', href: '#about', icon: 'mdi:account-outline' },
  { name: 'Experience', href: '#experience', icon: 'mdi:briefcase-outline' },
  { name: 'Projects', href: '#projects', icon: 'mdi:rocket-launch-outline' },
  { name: 'Skills', href: '#skills', icon: 'mdi:hexagon-multiple-outline' },
  { name: 'Terminal', href: '#terminal', icon: 'mdi:console' },
  { name: 'Contact', href: '#contact', icon: 'mdi:email-outline' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('#home');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Highlight the section currently filling the viewport.
  useEffect(() => {
    const sections = navigation
      .map((n) => document.querySelector(n.href))
      .filter((el): el is Element => Boolean(el));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
        scrolled ? 'bg-black/60 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3.5 gap-4">
          {/* Logo */}
          <motion.a href="#home" whileHover={{ scale: 1.04 }} className="flex items-center gap-2.5 shrink-0">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 grid place-items-center shadow-[0_0_20px_-4px_rgba(34,211,238,0.9)]">
              <span className="text-white font-semibold text-xs">{profile.initials}</span>
            </div>
            <span className="hidden sm:block">
              <span className="block text-white text-sm font-medium leading-tight">{profile.name}</span>
              <span className="block text-cyan-300/70 text-[10px] leading-tight">{profile.headline}</span>
            </span>
          </motion.a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
            {navigation.map((item) => {
              const isActive = active === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-white/55 hover:text-white/90'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500/25 to-cyan-500/25 border border-cyan-400/30"
                    />
                  )}
                  <span className="relative">{item.name}</span>
                </a>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <CommandPalette />
            <motion.a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/12 bg-white/[0.04] text-white/75 text-xs font-medium hover:border-cyan-400/40 hover:text-white transition-colors"
            >
              <Icon icon="mdi:file-download-outline" className="w-4 h-4" />
              Résumé
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-lg font-medium text-xs shadow-[0_0_22px_-6px_rgba(34,211,238,0.9)]"
            >
              <Icon icon="mdi:handshake-outline" className="w-4 h-4" />
              Hire Me
            </motion.a>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
              aria-label="Toggle navigation menu"
            >
              <Icon icon={mobileMenuOpen ? 'mdi:close' : 'mdi:menu'} className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navigation.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active === item.href
                      ? 'bg-cyan-400/10 text-cyan-200 border border-cyan-400/25'
                      : 'text-white/65 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon icon={item.icon} className="w-4 h-4" />
                  {item.name}
                </motion.a>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-3">
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/12 bg-white/[0.04] text-white/80 text-xs font-medium"
                >
                  <Icon icon="mdi:file-download-outline" className="w-4 h-4" />
                  Résumé
                </a>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl font-medium text-xs"
                >
                  <Icon icon="mdi:handshake-outline" className="w-4 h-4" />
                  Hire Me
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

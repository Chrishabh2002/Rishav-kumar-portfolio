"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { experiences, profile, skillCategories } from "@/lib/portfolio-data";
import CompanyLogo from "./CompanyLogo";

function useBeep() {
  return useMemo(() => {
    let ctx: AudioContext | null = null;
    return () => {
      try {
        ctx =
          ctx ||
          new (window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = 880;
        g.gain.value = 0.03;
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        setTimeout(() => {
          o.stop();
          o.disconnect();
          g.disconnect();
        }, 120);
      } catch {
        /* no-op */
      }
    };
  }, []);
}

const SITEMAP = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Terminal", href: "#terminal" },
  { label: "Achievements", href: "#achievements" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const beep = useBeep();
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);

  const socials = [
    { href: profile.linkedin, icon: "mdi:linkedin", label: "LinkedIn", bg: "from-sky-600 to-cyan-600" },
    { href: profile.github, icon: "mdi:github", label: "GitHub", bg: "from-slate-700 to-slate-900" },
    { href: `mailto:${profile.email}`, icon: "mdi:email", label: "Email", bg: "from-cyan-600 to-sky-700" },
    { href: `tel:${profile.phoneHref}`, icon: "mdi:phone", label: "Phone", bg: "from-emerald-600 to-teal-700" },
  ];

  const skillCount = skillCategories.reduce((n, c) => n + c.skills.length, 0);

  return (
    <footer className="relative mt-16 border-t border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-10">
          {/* identity */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 grid place-items-center shadow-[0_0_20px_-4px_rgba(34,211,238,0.9)]">
                <span className="text-white text-xs font-semibold">{profile.initials}</span>
              </div>
              <div>
                <p className="text-sm text-white/90 font-medium">{profile.name}</p>
                <p className="text-xs text-cyan-300/70">
                  {profile.headline} • {profile.altHeadline}
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-white/45 leading-relaxed max-w-sm">
              Building command-execution agents, production APIs and security-oriented automation.
            </p>
            <a
              href={experiences[0].website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-xs text-white/45 hover:text-cyan-300 transition-colors"
            >
              <CompanyLogo
                src={experiences[0].logoImage}
                alt={experiences[0].company}
                fallbackIcon={experiences[0].logo}
                className="w-4 h-4 shrink-0"
              />
              Currently {experiences[0].title} at {experiences[0].company}, {experiences[0].location}
            </a>
            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  onMouseEnter={beep}
                  whileHover={{ y: -3, scale: 1.06 }}
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.bg} grid place-items-center shadow-[0_0_20px_-6px_rgba(56,189,248,0.8)]`}
                  aria-label={s.label}
                >
                  <Icon icon={s.icon} className="w-5 h-5 text-white" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* sitemap */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/40 mb-4">Navigate</p>
            <div className="grid grid-cols-2 gap-y-2">
              {SITEMAP.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="text-xs text-white/55 hover:text-cyan-300 transition-colors w-fit"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* at a glance */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/40 mb-4">At a glance</p>
            <ul className="space-y-2.5 text-xs text-white/55">
              <li className="inline-flex items-center gap-2">
                <Icon icon="mdi:map-marker-outline" className="w-4 h-4 text-cyan-400/70" />
                {profile.location}
              </li>
              <li className="inline-flex items-center gap-2">
                <Icon icon="mdi:hexagon-multiple-outline" className="w-4 h-4 text-cyan-400/70" />
                {skillCount} technologies
              </li>
              <li className="inline-flex items-center gap-2">
                <Icon icon="mdi:briefcase-outline" className="w-4 h-4 text-cyan-400/70" />
                {experiences.length} roles · UK · US · India
              </li>
              <li className="inline-flex items-center gap-2 text-emerald-300/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {profile.availability}
              </li>
            </ul>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-cyan-400/25 bg-cyan-400/5 text-[11px] text-cyan-200 hover:bg-cyan-400/15 transition-colors"
            >
              <Icon icon="mdi:file-download-outline" className="w-3.5 h-3.5" />
              Download résumé
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/35">
          <p>© {year} {profile.name}. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">
            Built with
            <Icon icon="simple-icons:nextdotjs" className="w-3.5 h-3.5" />
            Next.js
            <span className="text-white/20">·</span>
            <Icon icon="simple-icons:tailwindcss" className="w-3.5 h-3.5 text-cyan-400" />
            Tailwind
            <span className="text-white/20">·</span>
            <Icon icon="simple-icons:threedotjs" className="w-3.5 h-3.5" />
            Three.js
            <span className="text-white/20">·</span>
            <Icon icon="mdi:robot-outline" className="w-3.5 h-3.5 text-cyan-400" />
            AI
          </p>
          <p className="inline-flex items-center gap-1.5">
            Press
            <kbd className="px-1.5 py-0.5 rounded border border-white/15 bg-white/5 text-[10px]">Ctrl</kbd>
            <kbd className="px-1.5 py-0.5 rounded border border-white/15 bg-white/5 text-[10px]">K</kbd>
            to navigate
          </p>
        </div>
      </div>
    </footer>
  );
}

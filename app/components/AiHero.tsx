"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { experiences, profile, skillCategories } from "@/lib/portfolio-data";
import CompanyLogo from "./CompanyLogo";

function useGreeting(name: string) {
  const [greeting, setGreeting] = useState(`Hello, I'm ${name} 👋`);
  // Resolved after mount so server and client markup always match.
  useEffect(() => {
    const h = new Date().getHours();
    const part = h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening";
    setGreeting(`${part}, I'm ${name} 👋`);
  }, [name]);
  return greeting;
}

function useTypewriter(words: string[], speed = 70, pause = 1000) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<"forward" | "back">("forward");

  useEffect(() => {
    let t: number;
    const run = () => {
      const word = words[index % words.length];
      if (dir === "forward") {
        setText((prev) => {
          const next = word.slice(0, prev.length + 1);
          if (next === word) {
            window.setTimeout(() => setDir("back"), pause);
          }
          return next;
        });
      } else {
        setText((prev) => {
          const next = prev.slice(0, -1);
          if (next.length === 0) {
            setDir("forward");
            setIndex((i) => (i + 1) % words.length);
          }
          return next;
        });
      }
      t = window.setTimeout(run, speed) as unknown as number;
    };
    t = window.setTimeout(run, 300) as unknown as number;
    return () => window.clearTimeout(t);
  }, [words, index, dir, speed, pause]);

  return text;
}

/**
 * Orbit radius as a % of the container's width, so the ring scales with the
 * breakpoint. Kept clear of the card's half-diagonal (~36%) so chips never
 * collide with its corners, and inside 50% so nothing clips the container.
 */
const ORBIT_R = 42;

/** Signature marks that orbit the avatar card. */
const ORBIT = [
  { icon: "logos:python", color: "#3776AB" },
  { icon: "logos:docker-icon", color: "#2496ED" },
  { icon: "simple-icons:fastapi", color: "#009688" },
  { icon: "logos:linux-tux", color: "#FCC624" },
  { icon: "logos:pytorch-icon", color: "#EE4C2C" },
  { icon: "logos:hugging-face-icon", color: "#FFD21E" },
];

export default function AiHero() {
  const greeting = useGreeting(profile.name);
  const roles = useMemo(() => [...profile.roles], []);
  const typed = useTypewriter(roles, 55, 1100);
  const current = experiences[0];
  const skillCount = skillCategories.reduce((n, c) => n + c.skills.length, 0);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = (y / rect.height - 0.5) * -10;
      const ry = (x / rect.width - 0.5) * 10;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    };
    const onLeave = () => {
      el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-[96svh] grid place-items-center px-4 pt-28 pb-16 overflow-hidden">
      {/* aurora wash */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
        <div className="rk-aurora w-[46rem] h-[46rem] -top-40 -left-32 bg-sky-500/15" />
        <div className="rk-aurora w-[38rem] h-[38rem] top-20 -right-24 bg-fuchsia-500/10" style={{ animationDelay: "-6s" }} />
        <div className="rk-aurora w-[30rem] h-[30rem] bottom-0 left-1/3 bg-cyan-400/10" style={{ animationDelay: "-12s" }} />
      </div>

      <div className="relative z-10 max-w-6xl w-full mx-auto grid md:grid-cols-[1.25fr_1fr] items-center gap-12">
        <div>
          {/* availability pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/5 text-[11px] text-emerald-300"
          >
            <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 text-emerald-400 rk-pulse-ring" />
            {profile.availability}
            <span className="text-white/25">•</span>
            <span className="text-white/50 inline-flex items-center gap-1">
              <Icon icon="mdi:map-marker-outline" className="w-3 h-3" />
              {profile.location}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-cyan-300/90 text-sm tracking-wide"
          >
            {greeting}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-3 text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight"
          >
            Building intelligent systems
            <span className="block rk-gradient-text">that actually run in production</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-5 font-mono text-sm"
          >
            <span className="text-white/40">$ </span>
            <span className="text-white/90">{typed}</span>
            <span className="text-cyan-400 rk-blink">▍</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28 }}
            className="mt-5 text-white/60 text-sm max-w-xl leading-relaxed"
          >
            {profile.summary}
          </motion.p>

          {/* current role strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.34 }}
            className="mt-6 inline-flex flex-wrap items-center gap-2 text-xs text-white/60 rk-glass rounded-xl px-4 py-2.5"
          >
            <CompanyLogo
              src={current.logoImage}
              alt={current.company}
              fallbackIcon={current.logo}
              className="w-5 h-5 shrink-0"
            />
            <span className="text-white/85">{current.title}</span>
            <span className="text-white/25">@</span>
            <span className="text-cyan-300">{current.company}</span>
            <span className="text-white/25">•</span>
            <span>{current.location}</span>
            <span className="text-white/25">•</span>
            <span>{current.period}</span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-sm font-medium shadow-[0_0_35px_-8px_rgba(56,189,248,0.9)]"
            >
              <Icon icon="mdi:rocket-launch-outline" className="w-4 h-4" />
              Explore Projects
            </motion.a>
            <motion.a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 bg-white/5 backdrop-blur-md text-sm font-medium hover:border-cyan-400/40 transition-colors"
            >
              <Icon icon="mdi:file-download-outline" className="w-4 h-4 text-cyan-300" />
              Download Résumé
            </motion.a>
            <motion.a
              href="#about"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 bg-white/5 backdrop-blur-md text-sm font-medium hover:border-cyan-400/40 transition-colors"
            >
              <Icon icon="mdi:robot-outline" className="w-4 h-4 text-cyan-300" />
              Ask my AI
            </motion.a>
          </motion.div>

          {/* quick links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-7 flex flex-wrap items-center gap-4 text-xs text-white/45"
          >
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
              <Icon icon="mdi:github" className="w-4 h-4" /> GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
              <Icon icon="mdi:linkedin" className="w-4 h-4" /> LinkedIn
            </a>
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
              <Icon icon="mdi:email-outline" className="w-4 h-4" /> {profile.email}
            </a>
            <span className="inline-flex items-center gap-1.5">
              <Icon icon="mdi:hexagon-multiple-outline" className="w-4 h-4" /> {skillCount} technologies
            </span>
          </motion.div>
        </div>

        {/* avatar + orbit */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="justify-self-center relative"
        >
          <div className="rk-orbit-group relative w-72 h-72 sm:w-[26.25rem] sm:h-[26.25rem] grid place-items-center">
            {/* soft glow behind the whole composition */}
            <div
              className="absolute inset-8 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"
              aria-hidden
            />

            {/* the track the chips ride on — drawn at the exact orbit radius */}
            <div
              className="absolute rounded-full border border-dashed border-cyan-400/15"
              style={{ width: `${ORBIT_R * 2}%`, height: `${ORBIT_R * 2}%` }}
              aria-hidden
            />

            <div className="absolute inset-0 rk-orbit-ring">
              {ORBIT.map((o, i) => {
                const angle = (i / ORBIT.length) * Math.PI * 2 - Math.PI / 2;
                return (
                  <div
                    key={o.icon}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${(50 + Math.cos(angle) * ORBIT_R).toFixed(3)}%`,
                      top: `${(50 + Math.sin(angle) * ORBIT_R).toFixed(3)}%`,
                    }}
                  >
                    {/* counter-spin keeps each mark upright as the ring turns */}
                    <div className="rk-orbit-chip w-9 h-9 sm:w-11 sm:h-11 rounded-xl rk-glass grid place-items-center shadow-[0_6px_20px_-8px_rgba(0,0,0,0.85)]">
                      <Icon icon={o.icon} className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" style={{ color: o.color }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              ref={cardRef}
              className="relative w-36 h-36 sm:w-52 sm:h-52 rounded-3xl p-[2px] bg-gradient-to-br from-cyan-400/70 via-sky-500/30 to-transparent transition-transform duration-300 ease-out"
            >
              <div className="absolute -inset-1 rounded-3xl blur-xl bg-cyan-500/20" />
              <div className="relative w-full h-full overflow-hidden rounded-3xl bg-white/5 backdrop-blur-md border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.avatar} alt={`${profile.name} portrait`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="px-3 py-2 rounded-xl bg-black/60 border border-cyan-400/25 backdrop-blur-sm">
                    <p className="text-[11px] text-white/90 font-medium">{profile.name}</p>
                    <p className="text-[10px] text-cyan-300/80">{profile.headline}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1 }, y: { duration: 2.2, repeat: Infinity } }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-[11px] inline-flex flex-col items-center gap-1 hover:text-cyan-300 transition-colors"
      >
        Scroll
        <Icon icon="mdi:chevron-double-down" className="w-4 h-4" />
      </motion.a>
    </section>
  );
}

"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Icon } from "@iconify/react";
import { skillCategories, techMarquee } from "@/lib/portfolio-data";
import SectionHeading from "./SectionHeading";

/** Radial proficiency dial that fills once scrolled into view. */
function SkillOrb({
  name,
  icon,
  color,
  level,
  index,
}: {
  name: string;
  icon: string;
  color: string;
  level: number;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const radius = 30;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.5), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative rk-glass rk-glow-hover rk-conic-border rounded-2xl p-4 flex flex-col items-center gap-3 text-center"
    >
      {/* colored halo on hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(120px 90px at 50% 0%, ${color}22, transparent 70%)` }}
      />

      <div className="relative w-[76px] h-[76px] grid place-items-center">
        <svg width="76" height="76" viewBox="0 0 76 76" className="absolute inset-0 -rotate-90">
          <circle cx="38" cy="38" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="4" fill="none" />
          <motion.circle
            cx="38"
            cy="38"
            r={radius}
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            initial={{ strokeDashoffset: circumference }}
            animate={inView ? { strokeDashoffset: circumference - (level / 100) * circumference } : {}}
            transition={{ duration: 1.3, delay: 0.25 + Math.min(index * 0.04, 0.4), ease: "easeOut" }}
            style={{ strokeDasharray: circumference, filter: `drop-shadow(0 0 6px ${color}88)` }}
          />
        </svg>
        <Icon
          icon={icon}
          className="w-8 h-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
          style={{ color }}
        />
      </div>

      <div>
        <p className="text-[13px] font-medium text-white/90 leading-tight">{name}</p>
        <p className="text-[11px] text-white/45 tabular-nums">{level}%</p>
      </div>
    </motion.div>
  );
}

/** Infinite, hover-pausable ribbon of brand marks. */
function TechRibbon({ reverse = false }: { reverse?: boolean }) {
  const marks = useMemo(() => {
    const half = Math.ceil(techMarquee.length / 2);
    const slice = reverse ? techMarquee.slice(half) : techMarquee.slice(0, half);
    return [...slice, ...slice];
  }, [reverse]);

  return (
    <div className="rk-marquee-mask overflow-hidden py-3">
      <div className={`rk-marquee-track gap-4 ${reverse ? "rk-marquee-reverse" : ""}`}>
        {marks.map((s, i) => (
          <div
            key={`${s.name}-${i}`}
            className="flex items-center gap-2 shrink-0 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-cyan-400/40 hover:bg-cyan-400/5 transition-colors duration-300"
          >
            <Icon icon={s.icon} className="w-5 h-5" style={{ color: s.color }} />
            <span className="text-xs text-white/70 whitespace-nowrap">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const [active, setActive] = useState<string>(skillCategories[0].id);
  const category = skillCategories.find((c) => c.id === active) ?? skillCategories[0];
  const total = skillCategories.reduce((n, c) => n + c.skills.length, 0);

  return (
    <section id="skills" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 rk-grid-bg pointer-events-none" aria-hidden />

      <div className="relative max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Toolbox"
          title="Skills & Technologies"
          icon="mdi:hexagon-multiple-outline"
          subtitle={`${total} technologies across languages, generative AI, backend, data, cloud and core computer science.`}
        />

        {/* Category switcher */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {skillCategories.map((c) => {
            const isActive = c.id === active;
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors duration-300 ${
                  isActive ? "text-white" : "text-white/55 hover:text-white/85"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="skill-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${c.accent} opacity-90 shadow-[0_0_24px_-6px_rgba(34,211,238,0.8)]`}
                  />
                )}
                {!isActive && <span className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.03]" />}
                <Icon icon={c.icon} className="relative w-4 h-4" />
                <span className="relative">{c.label}</span>
                <span className="relative text-[10px] opacity-70 tabular-nums">{c.skills.length}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-center text-xs text-white/50 mb-8">{category.blurb}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {category.skills.map((s, i) => (
                <SkillOrb key={s.name} {...s} index={i} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Full stack ribbon */}
        <div className="mt-16">
          <p className="text-center text-[11px] uppercase tracking-[0.2em] text-white/40 mb-4">
            The complete stack
          </p>
          <TechRibbon />
          <TechRibbon reverse />
        </div>
      </div>
    </section>
  );
}

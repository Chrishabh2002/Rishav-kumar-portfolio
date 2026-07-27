"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import { Icon } from "@iconify/react";
import { experiences, type Experience as Role } from "@/lib/portfolio-data";
import SectionHeading from "./SectionHeading";
import CompanyLogo from "./CompanyLogo";

function RoleCard({ role, index, isLast }: { role: Role; index: number; isLast: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-90px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-start gap-5 sm:gap-7 pb-12"
    >
      {/* node — the company's real logo */}
      <div className="flex flex-col items-center shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.15 }}
          whileHover={{ scale: 1.08, rotate: -3 }}
          className="relative z-10 w-14 h-14 rounded-2xl rk-glass grid place-items-center shadow-[0_0_28px_-10px_rgba(34,211,238,0.8)]"
        >
          {/* brand-tinted halo behind the mark */}
          <span
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${role.accent} opacity-15`}
            aria-hidden
          />
          <CompanyLogo
            src={role.logoImage}
            alt={role.company}
            fallbackIcon={role.logo}
            className="relative w-9 h-9"
          />
          {role.current && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 text-emerald-400 rk-pulse-ring" />
          )}
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="w-px flex-1 mt-3 origin-top bg-gradient-to-b from-cyan-400/60 via-sky-500/20 to-transparent"
            style={{ minHeight: 120 }}
          />
        )}
      </div>

      {/* card */}
      <div className="flex-1 min-w-0 rk-glass rk-glow-hover rk-conic-border rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="text-xl font-semibold text-white leading-tight">
              {role.title}
              {role.altTitle && (
                <span className="ml-2 align-middle text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/15 text-white/50">
                  aka {role.altTitle}
                </span>
              )}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              {role.website ? (
                <a
                  href={role.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 font-medium inline-flex items-center gap-1 hover:text-cyan-200 transition-colors"
                >
                  {role.company}
                  <Icon icon="mdi:open-in-new" className="w-3 h-3 opacity-60" />
                </a>
              ) : (
                <span className="text-cyan-300 font-medium">{role.company}</span>
              )}
              <span className="text-white/30">•</span>
              <span className="text-white/55 inline-flex items-center gap-1">
                <Icon icon="mdi:map-marker-outline" className="w-3.5 h-3.5" />
                {role.location}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-white/60">
                {role.mode}
              </span>
            </div>
          </div>
          <span
            className={`shrink-0 text-xs font-medium px-3 py-1 rounded-full border ${
              role.current
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                : "border-white/10 bg-white/5 text-white/60"
            }`}
          >
            {role.period}
          </span>
        </div>

        <ul className="text-white/75 text-sm space-y-2 mb-5">
          {role.description.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
              className="flex items-start gap-2.5"
            >
              <Icon icon="mdi:chevron-right-circle-outline" className="w-4 h-4 text-cyan-400/80 mt-0.5 shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </motion.li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          {role.techStack.split(", ").map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-400/20 text-sky-200/90 text-[11px] font-medium hover:bg-sky-500/20 transition-colors duration-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ExperienceSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 65%", "end 60%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });

  return (
    <section id="experience" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          eyebrow="Career"
          title="Experience"
          icon="mdi:briefcase-outline"
          subtitle="Backend platforms, automation tooling and AI systems shipped across startup teams in the UK, US and India."
        />

        <div ref={trackRef} className="relative">
          {/* scroll-linked rail behind the nodes */}
          <motion.div
            style={{ scaleY: progress }}
            className="absolute left-6 top-2 bottom-16 w-px origin-top bg-gradient-to-b from-cyan-400 via-sky-500 to-fuchsia-500/40 hidden sm:block"
            aria-hidden
          />
          {experiences.map((role, i) => (
            <RoleCard key={role.id} role={role} index={i} isLast={i === experiences.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

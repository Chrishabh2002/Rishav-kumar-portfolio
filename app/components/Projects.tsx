"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Icon } from "@iconify/react";
import { projects, type Project } from "@/lib/portfolio-data";
import SectionHeading from "./SectionHeading";
import CompanyLogo from "./CompanyLogo";

const FILTERS = [
  { id: "all", label: "All Work", icon: "mdi:apps" },
  { id: "Commercial", label: "Commercial", icon: "mdi:office-building-outline" },
  { id: "Personal", label: "Personal", icon: "mdi:account-outline" },
  { id: "Academic", label: "Academic", icon: "mdi:school-outline" },
] as const;

function ProjectCard({
  project,
  index,
  onAsk,
}: {
  project: Project;
  index: number;
  onAsk: (p: Project) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [spot, setSpot] = useState({ x: 50, y: 0, on: false });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setSpot({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, on: true });
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.07, 0.4), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      onMouseMove={onMove}
      onMouseLeave={() => setSpot((s) => ({ ...s, on: false }))}
      className="group relative rk-glass rk-glow-hover rk-conic-border rounded-2xl p-6 overflow-hidden flex flex-col"
    >
      {/* cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spot.on ? 1 : 0,
          background: `radial-gradient(420px circle at ${spot.x}% ${spot.y}%, rgba(34,211,238,0.10), transparent 60%)`,
        }}
      />

      <div className="relative flex items-start gap-3 mb-4">
        <div
          className={`w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br ${project.accent} grid place-items-center shadow-lg`}
        >
          <Icon icon={project.icon} className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-white leading-snug">{project.title}</h3>
            {project.featured && (
              <span className="shrink-0 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300">
                Featured
              </span>
            )}
          </div>
          <p className="text-[11px] text-cyan-300/80 mt-0.5">{project.tagline}</p>
        </div>
      </div>

      <div className="relative flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/50 mb-4">
        <span className="inline-flex items-center gap-1.5">
          {project.orgLogo ? (
            <CompanyLogo
              src={project.orgLogo}
              alt={project.org.split(" · ")[0]}
              className="w-4 h-4 shrink-0"
            />
          ) : (
            <Icon icon="mdi:domain" className="w-3.5 h-3.5" />
          )}
          {project.org}
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon icon="mdi:calendar-range" className="w-3.5 h-3.5" />
          {project.period}
        </span>
        <span className="px-2 py-0.5 rounded-md border border-white/10 bg-white/5">{project.kind}</span>
      </div>

      <p className="relative text-white/75 text-sm leading-relaxed mb-4">{project.description}</p>

      <ul className="relative space-y-2 mb-5 flex-1">
        {project.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Icon icon="mdi:check-decagram-outline" className="w-4 h-4 text-cyan-400/80 mt-0.5 shrink-0" />
            <span className="text-white/65 text-[13px] leading-relaxed">{f}</span>
          </li>
        ))}
      </ul>

      <div className="relative flex flex-wrap gap-2 mb-5">
        {project.techStack.split(", ").map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-400/20 text-cyan-200/90 text-[11px] font-medium"
          >
            {tech}
          </span>
        ))}
      </div>

      <button
        onClick={() => onAsk(project)}
        className="relative inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-cyan-400/25 bg-cyan-400/5 text-sm text-cyan-200 hover:bg-cyan-400/15 hover:border-cyan-400/50 transition-all duration-300"
      >
        <Icon icon="mdi:robot-outline" className="w-4 h-4" />
        Ask AI about this project
        <Icon
          icon="mdi:arrow-right"
          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
        />
      </button>
    </motion.div>
  );
}

export default function ProjectsSection({ onAsk }: { onAsk: (p: Project) => void }) {
  const [filter, setFilter] = useState<string>("all");
  const visible = filter === "all" ? projects : projects.filter((p) => p.kind === filter);

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Selected Work"
          title="Projects"
          icon="mdi:rocket-launch-outline"
          subtitle="Commercial AI agents, civic-tech vision platforms and personal automation tooling — each shipped with real users in mind."
        />

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTERS.map((f) => {
            const isActive = f.id === filter;
            const count = f.id === "all" ? projects.length : projects.filter((p) => p.kind === f.id).length;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors duration-300 ${
                  isActive ? "text-black" : "text-white/55 hover:text-white/85"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="project-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300 to-sky-300"
                  />
                )}
                {!isActive && <span className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.03]" />}
                <Icon icon={f.icon} className="relative w-4 h-4" />
                <span className="relative">{f.label}</span>
                <span className="relative text-[10px] opacity-70 tabular-nums">{count}</span>
              </button>
            );
          })}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} onAsk={onAsk} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

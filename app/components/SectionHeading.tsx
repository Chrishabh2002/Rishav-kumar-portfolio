"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  icon,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  icon: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="text-center mb-14"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/25 bg-cyan-400/5 text-[11px] uppercase tracking-[0.18em] text-cyan-300/90">
        <Icon icon={icon} className="w-3.5 h-3.5" />
        {eyebrow}
      </div>
      <h2 className="mt-4 text-4xl sm:text-5xl font-light tracking-tight">
        <span className="rk-gradient-text">{title}</span>
      </h2>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="w-24 h-px mx-auto mt-5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent origin-center"
      />
      {subtitle && (
        <p className="mt-5 text-white/60 text-sm max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
      )}
    </motion.div>
  );
}

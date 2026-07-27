"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { organisations } from "@/lib/portfolio-data";
import CompanyLogo from "./CompanyLogo";

const RELATION_STYLE: Record<string, string> = {
  Current: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Past: "border-white/12 bg-white/5 text-white/55",
  Education: "border-sky-400/25 bg-sky-400/10 text-sky-300",
};

export default function Organisations() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-[11px] uppercase tracking-[0.24em] text-white/35 mb-8"
        >
          Where I&apos;ve worked &amp; studied
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {organisations.map((org, i) => (
            <motion.a
              key={org.name}
              href={org.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group relative rk-glass rk-glow-hover rk-conic-border rounded-2xl p-5 flex flex-col items-center text-center"
            >
              <span
                className={`absolute top-3 right-3 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  RELATION_STYLE[org.relation] ?? RELATION_STYLE.Past
                }`}
              >
                {org.relation}
              </span>

              {/* Real logo — grayscale at rest, full colour on hover */}
              <CompanyLogo
                src={org.logo}
                alt={org.name}
                className={`h-14 mt-3 mb-4 ${org.wide ? "w-full max-w-[168px]" : "w-14"}`}
                imgClassName="opacity-70 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105"
              />

              <p className="text-[13px] font-medium text-white/90 leading-tight">{org.name}</p>
              <p className="mt-1 text-[11px] text-cyan-300/70 leading-tight">{org.role}</p>
              <p className="mt-1.5 text-[10px] text-white/35 tabular-nums">{org.period}</p>

              <Icon
                icon="mdi:arrow-top-right"
                className="absolute bottom-3 right-3 w-3.5 h-3.5 text-white/20 group-hover:text-cyan-300 transition-colors"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useMemo } from "react";

function useBeep() {
  return useMemo(() => {
    let ctx: AudioContext | null = null;
    return () => {
      try {
        ctx = ctx || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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

export default function Footer() {
  const beep = useBeep();
  const socials = [
    { href: "https://linkedin.com/in/rishav-kumar-983a5b273", icon: "mdi:linkedin", label: "LinkedIn", bg: "from-sky-600 to-cyan-600" },
    { href: "https://github.com/Chrishabh2002", icon: "mdi:github", label: "GitHub", bg: "from-slate-700 to-slate-900" },
    { href: "mailto:chrishabh2002@gmail.com", icon: "mdi:email", label: "Email", bg: "from-cyan-600 to-sky-700" },
    { href: "https://x.com", icon: "mdi:twitter", label: "X", bg: "from-slate-700 to-slate-900" },
  ];

  return (
    <footer className="mt-24 border-t border-white/10 bg-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 grid place-items-center">
              <span className="text-white text-xs">RK</span>
            </div>
            <div>
              <p className="text-sm text-white/80">Rishav Kumar</p>
              <p className="text-xs text-white/50">AI Developer • ML Engineer • Full‑Stack</p>
            </div>
          </div>
          <div className="flex gap-3">
            {socials.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                onMouseEnter={beep}
                whileHover={{ y: -3, scale: 1.05 }}
                className={`w-11 h-11 rounded-lg bg-gradient-to-r ${s.bg} grid place-items-center shadow-[0_0_20px_rgba(56,189,248,0.25)]`}
                aria-label={s.label}
              >
                <Icon icon={s.icon} className="w-5 h-5 text-white" />
              </motion.a>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-white/40">© {new Date().getFullYear()} Rishav Kumar. All rights reserved.</div>
      </div>
    </footer>
  );
}

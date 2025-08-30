"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

function useGreeting(name: string) {
  return useMemo(() => {
    const h = new Date().getHours();
    const part = h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening";
    return `${part}, I'm ${name} 👋`;
  }, [name]);
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

export default function AiHero() {
  const greeting = useGreeting("Rishav Kumar");
  const roles = ["AI Developer", "ML Engineer", "Full‑Stack Developer"];
  const typed = useTypewriter(roles, 60, 900);
  const imgUrl = "https://storage.googleapis.com/cosmic-project-image-assets/images/620d6fa5-1ebf-4853-9fd3-ab1ae0148eb9/Rishabh.jpg";

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -8;
      const ry = ((x / rect.width) - 0.5) * 8;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    const onLeave = () => {
      el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-[92svh] grid place-items-center px-4 pt-20">
      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-[1.2fr_1fr] items-center gap-10">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-cyan-300/90 text-sm tracking-wide"
          >
            {greeting}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-3 text-5xl sm:text-6xl font-light leading-tight"
          >
            Building intelligent products with
            <span className="block bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500 bg-clip-text text-transparent">
              AI, data, and design
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-white/70 text-sm max-w-xl"
          >
            <span className="text-white/90">{typed}</span>
            <span className="text-cyan-400">▍</span>
          </motion.p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 text-sm font-medium shadow-[0_0_25px_rgba(56,189,248,0.35)]"
            >
              Explore Projects
            </motion.a>
            <motion.a
              href="#about"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-lg border border-white/15 text-sm font-medium backdrop-blur-md bg-white/5"
            >
              Ask my AI
            </motion.a>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="justify-self-center"
        >
          <div
            ref={cardRef}
            className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl p-[2px] bg-gradient-to-br from-cyan-400/60 via-sky-500/30 to-transparent"
          >
            <div className="absolute -inset-[2px] rounded-2xl blur-md bg-cyan-500/20" />
            <div className="relative w-full h-full overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <img src={imgUrl} alt="Rishav AI Avatar" className="w-full h-full object-cover" />
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
              />
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                className="absolute bottom-3 left-3 right-3 text-xs text-white/90"
              >
                <div className="px-3 py-2 rounded-lg bg-black/50 border border-cyan-400/30">
                  Hi! Hover or tap — I&apos;ll follow your cursor.
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs">Scroll</div>
    </section>
  );
}
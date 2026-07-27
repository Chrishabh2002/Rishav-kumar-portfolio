"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Icon } from "@iconify/react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.div
        style={{ scaleX: width }}
        className="fixed top-0 left-0 right-0 z-[70] h-0.5 origin-left bg-gradient-to-r from-sky-400 via-cyan-300 to-fuchsia-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
        aria-hidden
      />
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 12 }}
            whileHover={{ y: -3 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="fixed z-[55] bottom-6 left-6 w-11 h-11 rounded-full rk-glass grid place-items-center text-cyan-300 hover:text-white hover:border-cyan-400/40 transition-colors"
          >
            <Icon icon="mdi:arrow-up" className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { profile } from "@/lib/portfolio-data";

type Command = {
  id: string;
  label: string;
  hint: string;
  icon: string;
  run: () => void;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const go = useCallback((hash: string) => {
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const commands = useMemo<Command[]>(
    () => [
      { id: "home", label: "Go to Home", hint: "hero", icon: "mdi:home-outline", run: () => go("#home") },
      { id: "about", label: "Go to About", hint: "summary", icon: "mdi:account-outline", run: () => go("#about") },
      { id: "experience", label: "Go to Experience", hint: "career", icon: "mdi:briefcase-outline", run: () => go("#experience") },
      { id: "projects", label: "Go to Projects", hint: "work", icon: "mdi:rocket-launch-outline", run: () => go("#projects") },
      { id: "skills", label: "Go to Skills", hint: "stack", icon: "mdi:hexagon-multiple-outline", run: () => go("#skills") },
      { id: "terminal", label: "Open Résumé Terminal", hint: "shell", icon: "mdi:console", run: () => go("#terminal") },
      { id: "education", label: "Go to Education", hint: "degree", icon: "mdi:school-outline", run: () => go("#education") },
      { id: "contact", label: "Go to Contact", hint: "reach out", icon: "mdi:email-outline", run: () => go("#contact") },
      {
        id: "resume",
        label: "Download Résumé (PDF)",
        hint: "file",
        icon: "mdi:file-download-outline",
        run: () => window.open(profile.resume, "_blank", "noopener,noreferrer"),
      },
      {
        id: "email",
        label: `Email ${profile.email}`,
        hint: "mailto",
        icon: "mdi:at",
        run: () => {
          window.location.href = `mailto:${profile.email}`;
        },
      },
      {
        id: "github",
        label: "Open GitHub",
        hint: "external",
        icon: "mdi:github",
        run: () => window.open(profile.github, "_blank", "noopener,noreferrer"),
      },
      {
        id: "linkedin",
        label: "Open LinkedIn",
        hint: "external",
        icon: "mdi:linkedin",
        run: () => window.open(profile.linkedin, "_blank", "noopener,noreferrer"),
      },
      {
        id: "copy-email",
        label: "Copy email to clipboard",
        hint: "clipboard",
        icon: "mdi:content-copy",
        run: () => navigator.clipboard?.writeText(profile.email),
      },
    ],
    [go],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.hint} ${c.id}`.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setCursor(0);
    }
  }, [open]);

  useEffect(() => setCursor(0), [query]);

  const exec = (c: Command) => {
    setOpen(false);
    c.run();
  };

  return (
    <>
      {/* trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-[11px] text-white/45 hover:text-white/80 hover:border-cyan-400/30 transition-colors"
      >
        <Icon icon="mdi:magnify" className="w-3.5 h-3.5" />
        Quick nav
        <kbd className="px-1.5 py-0.5 rounded border border-white/15 bg-white/5 text-[10px]">Ctrl K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm px-4 pt-[12vh]"
          >
            <motion.div
              initial={{ opacity: 0, y: -18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="mx-auto w-full max-w-xl rounded-2xl overflow-hidden border border-white/12 bg-[#080b12]/95 shadow-[0_40px_100px_-30px_rgba(34,211,238,0.45)]"
            >
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
                <Icon icon="mdi:magnify" className="w-4 h-4 text-cyan-300" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setCursor((c) => (c + 1) % Math.max(results.length, 1));
                    }
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setCursor((c) => (c - 1 + results.length) % Math.max(results.length, 1));
                    }
                    if (e.key === "Enter" && results[cursor]) exec(results[cursor]);
                  }}
                  placeholder="Jump to a section, download résumé, copy email…"
                  className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/35"
                />
                <kbd className="px-1.5 py-0.5 rounded border border-white/15 bg-white/5 text-[10px] text-white/40">
                  Esc
                </kbd>
              </div>

              <div className="rk-scroll max-h-80 overflow-y-auto p-2">
                {results.length === 0 && (
                  <p className="px-3 py-6 text-center text-xs text-white/40">No matching commands.</p>
                )}
                {results.map((c, i) => (
                  <button
                    key={c.id}
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => exec(c)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                      i === cursor ? "bg-cyan-400/10 text-white" : "text-white/65 hover:bg-white/5"
                    }`}
                  >
                    <Icon icon={c.icon} className={`w-4 h-4 ${i === cursor ? "text-cyan-300" : "text-white/40"}`} />
                    <span className="text-sm flex-1">{c.label}</span>
                    <span className="text-[10px] uppercase tracking-wider text-white/30">{c.hint}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

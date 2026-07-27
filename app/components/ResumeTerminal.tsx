"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { education, experiences, profile, projects, skillCategories } from "@/lib/portfolio-data";
import SectionHeading from "./SectionHeading";

type Line = { kind: "cmd" | "out" | "err" | "ok"; text: string };

const BANNER: Line[] = [
  { kind: "ok", text: `rishav-os v2.0 · ${profile.headline.toLowerCase().replace(/ /g, "-")}` },
  { kind: "out", text: "Type `help` to list commands, or click a chip below." },
];

const COMMANDS: Record<string, () => Line[]> = {
  help: () => [
    { kind: "out", text: "Available commands:" },
    { kind: "out", text: "  whoami       →  identity + current role" },
    { kind: "out", text: "  summary      →  professional summary" },
    { kind: "out", text: "  experience   →  work history" },
    { kind: "out", text: "  projects     →  shipped work" },
    { kind: "out", text: "  skills       →  technology stack by domain" },
    { kind: "out", text: "  education    →  degree and focus areas" },
    { kind: "out", text: "  contact      →  how to reach me" },
    { kind: "out", text: "  resume       →  download the PDF" },
    { kind: "out", text: "  clear        →  reset the session" },
  ],
  whoami: () => [
    { kind: "ok", text: `${profile.name} — ${profile.headline} / ${profile.altHeadline}` },
    { kind: "out", text: `location : ${profile.location}` },
    { kind: "out", text: `current  : ${experiences[0].title} @ ${experiences[0].company} (${experiences[0].period})` },
    { kind: "out", text: `status   : ${profile.availability}` },
  ],
  summary: () => [{ kind: "out", text: profile.summary }],
  experience: () =>
    experiences.flatMap<Line>((e) => [
      { kind: "ok", text: `${e.title} · ${e.company} (${e.mode}) · ${e.period} · ${e.location}` },
      ...e.description.map<Line>((d) => ({ kind: "out", text: `   • ${d}` })),
      { kind: "out", text: `   stack: ${e.techStack}` },
    ]),
  projects: () =>
    projects.flatMap<Line>((p) => [
      { kind: "ok", text: `${p.title} · ${p.kind} · ${p.period}` },
      { kind: "out", text: `   ${p.description}` },
      { kind: "out", text: `   stack: ${p.techStack}` },
    ]),
  skills: () =>
    skillCategories.map<Line>((c) => ({
      kind: "out",
      text: `${c.label.padEnd(24, " ")} ${c.skills.map((s) => s.name).join(", ")}`,
    })),
  education: () => [
    { kind: "ok", text: `${education.degree} — ${education.field}` },
    { kind: "out", text: `${education.school}, ${education.location} · ${education.period}` },
    { kind: "out", text: `focus: ${education.focus.join(", ")}` },
    { kind: "out", text: education.note },
  ],
  contact: () => [
    { kind: "out", text: `email    : ${profile.email}` },
    { kind: "out", text: `phone    : ${profile.phone}` },
    { kind: "out", text: `linkedin : ${profile.linkedin}` },
    { kind: "out", text: `github   : ${profile.github}` },
  ],
  resume: () => [{ kind: "ok", text: `opening ${profile.resume} …` }],
  clear: () => [],
};

const CHIPS = ["whoami", "experience", "projects", "skills", "education", "contact"];

export default function ResumeTerminal() {
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    setHistory((h) => [cmd, ...h]);
    setHistIdx(-1);

    if (cmd === "clear") {
      setLines(BANNER);
      setInput("");
      return;
    }

    const handler = COMMANDS[cmd];
    const output: Line[] = handler
      ? handler()
      : [{ kind: "err", text: `command not found: ${cmd} — try \`help\`` }];

    setLines((l) => [...l, { kind: "cmd", text: cmd }, ...output]);
    setInput("");

    if (cmd === "resume") window.open(profile.resume, "_blank", "noopener,noreferrer");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") return run(input);
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      if (next >= 0) {
        setHistIdx(next);
        setInput(history[next]);
      }
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = histIdx - 1;
      setHistIdx(next);
      setInput(next >= 0 ? history[next] : "");
    }
  };

  const color = (k: Line["kind"]) =>
    k === "cmd" ? "text-white" : k === "ok" ? "text-cyan-300" : k === "err" ? "text-rose-400" : "text-white/65";

  return (
    <section id="terminal" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          eyebrow="Interactive"
          title="Résumé, as a shell"
          icon="mdi:console"
          subtitle="I build controlled command-execution agents for a living — so here's my résumé behind a terminal. Try `help`."
        />

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl overflow-hidden border border-white/10 bg-[#05070c]/90 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(34,211,238,0.35)]"
          onClick={() => inputRef.current?.focus()}
        >
          {/* title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <p className="ml-3 text-[11px] text-white/45 font-mono">
              rishav@portfolio: ~/resume — zsh
            </p>
            <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] text-emerald-300/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              connected
            </span>
          </div>

          {/* body */}
          <div
            ref={bodyRef}
            className="rk-scroll relative h-[340px] overflow-y-auto p-5 font-mono text-[12.5px] leading-relaxed"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-cyan-400/[0.06] to-transparent rk-scanline" />
            {lines.map((l, i) => (
              <div key={i} className={`whitespace-pre-wrap break-words ${color(l.kind)}`}>
                {l.kind === "cmd" ? (
                  <span>
                    <span className="text-emerald-400">➜</span>{" "}
                    <span className="text-sky-400">~/resume</span> <span className="text-white">{l.text}</span>
                  </span>
                ) : (
                  l.text
                )}
              </div>
            ))}

            {/* prompt */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-emerald-400">➜</span>
              <span className="text-sky-400">~/resume</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal command input"
                className="flex-1 bg-transparent outline-none text-white caret-cyan-400"
              />
              <span className="w-2 h-4 bg-cyan-400 rk-blink" />
            </div>
          </div>

          {/* chips */}
          <div className="flex flex-wrap gap-2 px-5 py-4 border-t border-white/10 bg-white/[0.02]">
            {CHIPS.map((c) => (
              <button
                key={c}
                onClick={() => run(c)}
                className="px-3 py-1.5 rounded-lg font-mono text-[11px] border border-white/10 bg-white/[0.04] text-white/60 hover:text-cyan-200 hover:border-cyan-400/40 transition-colors duration-300"
              >
                {c}
              </button>
            ))}
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-medium"
            >
              <Icon icon="mdi:download" className="w-3.5 h-3.5" />
              Download résumé
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

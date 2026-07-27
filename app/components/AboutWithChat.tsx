"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { education, experiences, profile } from "@/lib/portfolio-data";
import SectionHeading from "./SectionHeading";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const FACTS = [
  { icon: "mdi:robot-industrial-outline", label: "AI agents & command execution", color: "#22d3ee" },
  { icon: "mdi:api", label: "Production APIs — FastAPI · Flask", color: "#34d399" },
  { icon: "mdi:shield-lock-outline", label: "Security-oriented workflows", color: "#f472b6" },
  { icon: "mdi:penguin", label: "Linux, debugging & automation", color: "#fbbf24" },
  { icon: "mdi:eye-outline", label: "Computer vision — OpenCV", color: "#a78bfa" },
  { icon: "mdi:cloud-sync-outline", label: "Docker · AWS · GCP · CI/CD", color: "#60a5fa" },
];

export default function AboutWithChat() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm Rishav's on-site AI. Ask me about his experience at Cyberrant or MomntumAI, the agents he's built, or his stack.",
    },
  ]);
  const paneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    paneRef.current?.scrollTo({ top: paneRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const ask = async (q?: string) => {
    const prompt = (q ?? input).trim();
    if (!prompt || loading) return;
    setLoading(true);
    setMessages((m) => [...m, { role: "user", content: prompt }]);
    setInput("");
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: "about", question: prompt }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.answer || "I'm here!" }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "I couldn't reach AI right now. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Where does Rishav work now?",
    "What has he built with AI agents?",
    "Which backend stack does he prefer?",
    "Tell me about EAiSER-AI",
    "What did he do at MomntumAI?",
  ];

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Profile"
          title="About Me"
          icon="mdi:account-outline"
          subtitle="Backend platforms, automation tooling and AI systems — built for real operational use, not demos."
        />

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: narrative */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="p-7 rounded-2xl rk-glass rk-glow-hover"
            >
              <p className="text-white/75 text-sm leading-7">{profile.summary}</p>
              <p className="mt-4 text-white/60 text-sm leading-7">
                I&apos;m currently an{" "}
                <span className="text-cyan-300">{experiences[0].title}</span> at{" "}
                <span className="text-cyan-300">{experiences[0].company}</span> ({experiences[0].location}), working on
                AI products for cybersecurity operations and developer workflows. Before that I built production backend
                services at <span className="text-sky-300">MomntumAI LLC</span> and shipped ML pipelines as an intern at{" "}
                <span className="text-sky-300">My Job Grow</span>. Alongside work I&apos;m finishing my{" "}
                {education.degree} in {education.field} at {education.school} ({education.period}).
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {profile.openTo.map((o) => (
                  <span
                    key={o}
                    className="px-3 py-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/5 text-[11px] text-emerald-300/90"
                  >
                    {o}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="grid sm:grid-cols-2 gap-3"
            >
              {FACTS.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.05 * i }}
                  whileHover={{ y: -4 }}
                  className="group flex items-center gap-3 p-3.5 rounded-xl rk-glass rk-glow-hover"
                >
                  <span
                    className="w-9 h-9 rounded-lg grid place-items-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${f.color}1a`, border: `1px solid ${f.color}33` }}
                  >
                    <Icon icon={f.icon} className="w-4.5 h-4.5" style={{ color: f.color }} />
                  </span>
                  <span className="text-[12.5px] text-white/70 leading-snug">{f.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: AI chat */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/[0.07] to-sky-500/[0.03] backdrop-blur-xl overflow-hidden flex flex-col"
          >
            <div className="px-6 py-4 flex items-center gap-3 border-b border-white/10">
              <span className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 grid place-items-center">
                <Icon icon="mdi:robot-outline" className="w-5 h-5 text-white" />
              </span>
              <div className="flex-1">
                <p className="text-sm text-white/85 font-medium">Ask About Me</p>
                <p className="text-[11px] text-white/45">Trained on my résumé — answers in seconds</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-300/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                online
              </span>
            </div>

            <div ref={paneRef} className="rk-scroll flex-1 h-72 overflow-y-auto space-y-3 p-5">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <span className="w-6 h-6 shrink-0 rounded-lg bg-cyan-500/15 border border-cyan-400/25 grid place-items-center mt-0.5">
                      <Icon icon="mdi:robot-outline" className="w-3.5 h-3.5 text-cyan-300" />
                    </span>
                  )}
                  <div
                    className={`max-w-[82%] text-[12.5px] leading-relaxed px-3.5 py-2.5 rounded-2xl border ${
                      m.role === "user"
                        ? "bg-cyan-500/20 border-cyan-300/25 rounded-br-sm"
                        : "bg-white/[0.04] border-white/10 rounded-bl-sm text-white/80"
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-white/50">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-400/25 grid place-items-center">
                    <Icon icon="mdi:robot-outline" className="w-3.5 h-3.5 text-cyan-300" />
                  </span>
                  <span className="flex gap-1 px-3 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay: d * 0.18 }}
                        className="w-1.5 h-1.5 rounded-full bg-cyan-300"
                      />
                    ))}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") ask();
                  }}
                  placeholder="Ask a question about Rishav's work…"
                  className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm placeholder-white/35 outline-none focus:border-cyan-400/40 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => ask()}
                  disabled={loading}
                  className="px-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-sm grid place-items-center disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Icon icon="mdi:send" className="w-4 h-4" />
                </motion.button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="text-[11px] px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white/55 hover:text-cyan-200 hover:border-cyan-400/35 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

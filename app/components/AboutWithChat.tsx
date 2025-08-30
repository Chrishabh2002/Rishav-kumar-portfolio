"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Icon } from "@iconify/react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AboutWithChat() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Ask me anything about my experience, skills, or projects — I\'ll answer right here.",
    },
  ]);

  const ask = async (q?: string) => {
    const prompt = (q ?? input).trim();
    if (!prompt) return;
    setLoading(true);
    setMessages((m) => [...m, { role: "user", content: prompt }]);
    setInput("");
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: "about",
          question: prompt,
        }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.answer || "I\'m here!" }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "I couldn\'t reach AI right now. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "What internships has Rishav completed?",
    "Which AI/ML projects stand out?",
    "What tech stack does Rishav prefer?",
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-light">About Me</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-cyan-500 mx-auto mt-4" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <p className="text-white/80 text-sm leading-7">
              I&apos;m a Computer Science student (B.Tech, 2023–2027) at Galgotias University, passionate about building
              intelligent systems. I focus on AI/ML, full‑stack engineering, and crafting smooth, modern experiences.
              I&apos;ve interned across AI and software, shipped production features, and contributed to hackathon‑winning
              prototypes. My goals: push AI in real‑world applications and mentor upcoming builders.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-white/70">
              <div className="p-3 rounded-lg bg-black/30 border border-white/10">AI/ML • NLP • CV</div>
              <div className="p-3 rounded-lg bg-black/30 border border-white/10">React • Node • Flask</div>
              <div className="p-3 rounded-lg bg-black/30 border border-white/10">Docker • Cloud</div>
              <div className="p-3 rounded-lg bg-black/30 border border-white/10">DSA • Systems</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="p-0 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-sky-500/5 overflow-hidden"
          >
            <div className="px-6 pt-5 pb-3 flex items-center gap-2 border-b border-white/10">
              <Icon icon="mdi:robot-outline" className="w-5 h-5 text-cyan-300" />
              <p className="text-sm text-white/80">Ask About Me</p>
            </div>
            <div className="h-64 overflow-y-auto space-y-3 p-6">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${m.role === "user" ? "justify-end" : "justify-start"} flex`}
                >
                  <div
                    className={`max-w-[85%] text-xs leading-relaxed px-3 py-2 rounded-lg border ${
                      m.role === "user"
                        ? "bg-cyan-500/20 border-cyan-300/30"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="text-xs text-white/60">Thinking…</div>
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
                  placeholder="Ask a question about Rishav&apos;s work…"
                  className="flex-1 bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm placeholder-white/40 outline-none"
                />
                <button
                  onClick={() => ask()}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 text-sm"
                  disabled={loading}
                >
                  Send
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="text-[11px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/70 hover:text-white/90"
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
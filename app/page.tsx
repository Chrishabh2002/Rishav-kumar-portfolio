'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Icon } from '@iconify/react';
import AiHero from '@/app/components/AiHero';
import AboutWithChat from '@/app/components/AboutWithChat';
import ExperienceSection from '@/app/components/Experience';
import ProjectsSection from '@/app/components/Projects';
import Skills from '@/app/components/Skills';
import ResumeTerminal from '@/app/components/ResumeTerminal';
import SectionHeading from '@/app/components/SectionHeading';
import Organisations from '@/app/components/Organisations';
import CompanyLogo from '@/app/components/CompanyLogo';
import { achievements, education, profile, stats, type Project } from '@/lib/portfolio-data';

/** Chat modal used for project deep-dives and the floating assistant. */
function Modal({
  open,
  onClose,
  title,
  context,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  context: string;
}) {
  const [q, setQ] = useState('');
  const [msgs, setMsgs] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: `Ask anything about ${title}.` },
  ]);
  const [loading, setLoading] = useState(false);
  const paneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setQ('');
      setMsgs([{ role: 'assistant', content: `Ask anything about ${title}.` }]);
    }
  }, [open, title]);

  useEffect(() => {
    paneRef.current?.scrollTo({ top: paneRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, loading]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const ask = async (preset?: string) => {
    const question = (preset ?? q).trim();
    if (!question || loading) return;
    setLoading(true);
    setMsgs((m) => [...m, { role: 'user', content: question }]);
    setQ('');
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'project', question: `${context}. Question: ${question}` }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: 'assistant', content: data.answer || "Here's my take." }]);
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', content: 'Could not reach AI right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[75] grid place-items-center bg-black/75 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl rounded-2xl bg-[#080b12]/95 border border-white/12 shadow-[0_40px_100px_-30px_rgba(34,211,238,0.5)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500 grid place-items-center">
                <Icon icon="mdi:robot-outline" className="w-4 h-4 text-white" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/85 truncate">{title}</p>
                <p className="text-[11px] text-white/40">AI assistant</p>
              </div>
              <button onClick={onClose} className="text-white/50 hover:text-white transition-colors" aria-label="Close">
                <Icon icon="mdi:close" className="w-5 h-5" />
              </button>
            </div>

            <div ref={paneRef} className="rk-scroll h-72 overflow-y-auto p-4 space-y-3">
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] text-[12.5px] leading-relaxed px-3.5 py-2.5 rounded-2xl border ${
                      m.role === 'user'
                        ? 'bg-cyan-500/20 border-cyan-300/25 rounded-br-sm'
                        : 'bg-white/[0.04] border-white/10 rounded-bl-sm text-white/80'
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <span className="inline-flex gap-1 px-3 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: d * 0.18 }}
                      className="w-1.5 h-1.5 rounded-full bg-cyan-300"
                    />
                  ))}
                </span>
              )}
            </div>

            <div className="p-4 border-t border-white/10 flex gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') ask();
                }}
                placeholder="Ask about this…"
                className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm placeholder-white/35 outline-none focus:border-cyan-400/40 transition-colors"
              />
              <button
                onClick={() => ask()}
                disabled={loading}
                className="px-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-sm disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AnimatedCounter({ end, duration = 1800, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    let frame: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const t = Math.min((currentTime - startTime) / duration, 1);
      // ease-out cubic for a natural settle
      setCount(Math.floor((1 - Math.pow(1 - t, 3)) * end));
      if (t < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export default function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [modal, setModal] = useState<{ open: boolean; title: string; ctx: string }>({
    open: false,
    title: '',
    ctx: '',
  });
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:${profile.email}?subject=Portfolio Contact from ${encodeURIComponent(
      formData.name,
    )}&body=${encodeURIComponent(`${formData.message}\n\nFrom: ${formData.email}`)}`;
    window.location.href = mailtoLink;
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const askAboutProject = (p: Project) =>
    setModal({ open: true, title: p.title, ctx: p.aiContext });

  const [suggestion, setSuggestion] = useState<string>('');
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: 'about',
            question:
              'In one sentence, recommend the next area Rishav should explore given his AI agent, backend and security automation work.',
          }),
        });
        const data = await res.json();
        setSuggestion(data.answer);
      } catch {
        setSuggestion(
          'Next frontier: MLOps for agent fleets — evaluation harnesses, sandboxed execution and observability for LLM systems in production.',
        );
      }
    })();
  }, []);

  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      <AiHero />

      {/* Quick stats */}
      <section className="px-4 sm:px-6 lg:px-8 relative z-10 -mt-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="rk-glass rk-glow-hover rk-conic-border rounded-2xl p-5"
            >
              <Icon icon={s.icon} className={`w-5 h-5 mb-3 ${s.color}`} />
              <div className={`text-3xl font-semibold mb-1 ${s.color}`}>
                <AnimatedCounter end={s.value} suffix={s.suffix} />
              </div>
              <div className="text-white/50 text-xs leading-snug">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <AboutWithChat />
      <Organisations />
      <ExperienceSection />
      <ProjectsSection onAsk={askAboutProject} />
      <Skills />

      {/* AI suggestion strip */}
      <section className="px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto rk-glass rounded-2xl p-5 flex items-start gap-3"
        >
          <Icon icon="mdi:lightning-bolt" className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/40 mb-1">AI take on what&apos;s next</p>
            <p className="text-sm text-white/70 leading-relaxed">
              {suggestion || 'Analyzing the stack…'}
            </p>
          </div>
        </motion.div>
      </section>

      <ResumeTerminal />

      {/* Achievements */}
      <section id="achievements" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            eyebrow="Recognition"
            title="Hackathon Achievements"
            icon="mdi:trophy-outline"
            subtitle="Prototypes built under time pressure — from smart agriculture to defense-grade computer vision."
          />
          <div className="space-y-5">
            {achievements.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ x: 6 }}
                className="rk-glass rk-glow-hover rk-conic-border rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${a.accent} grid place-items-center shadow-lg`}
                  >
                    <Icon icon={a.icon} className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1.5">{a.title}</h3>
                    <p className="text-white/70 text-sm mb-3 leading-relaxed">{a.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {a.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/70 text-[11px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <SectionHeading eyebrow="Academics" title="Education" icon="mdi:school-outline" />
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rk-glass rk-conic-border rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl" aria-hidden />
            <div className="relative flex flex-col sm:flex-row sm:items-start gap-6">
              <motion.a
                href={education.website}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                className="shrink-0 rk-glass rounded-2xl px-4 py-3 grid place-items-center shadow-[0_0_30px_-12px_rgba(34,211,238,0.9)]"
                aria-label={education.school}
              >
                <CompanyLogo
                  src={education.logoImage}
                  alt={education.school}
                  fallbackIcon="mdi:school"
                  className="h-11 w-[172px]"
                />
              </motion.a>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-2xl font-semibold text-white">{education.degree}</h3>
                  <span className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/60 w-fit">
                    {education.period}
                  </span>
                </div>
                <p className="text-cyan-300 mt-1">{education.field}</p>
                <a
                  href={education.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 text-sm mt-1 inline-flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
                >
                  <Icon icon="mdi:office-building-outline" className="w-4 h-4" />
                  {education.school}, {education.location}
                  <Icon icon="mdi:open-in-new" className="w-3 h-3 opacity-60" />
                </a>
                <div className="mt-5 flex flex-wrap gap-2">
                  {education.focus.map((f) => (
                    <span
                      key={f}
                      className="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-200/90 text-[11px]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-white/50 text-sm">{education.note}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            eyebrow="Contact"
            title="Get In Touch"
            icon="mdi:email-outline"
            subtitle="Let's collaborate on AI systems, backend platforms or automation tooling — or just say hello."
          />

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6">
            <motion.div
              initial={{ opacity: 0, x: -26 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rk-glass rounded-2xl p-6"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {[
                    'I&#39;d like to collaborate on AI agents',
                    'Can you build an MVP?',
                    'Available for a full-time role?',
                    'Let&#39;s discuss automation consulting',
                  ].map((s) => {
                    const text = s.replace(/&#39;/g, "'");
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData((f) => ({ ...f, message: text }))}
                        className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white/55 hover:text-cyan-200 hover:border-cyan-400/35 transition-colors text-left"
                      >
                        {text}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl focus:border-cyan-400/50 focus:outline-none transition-colors text-white placeholder-white/35 text-sm"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl focus:border-cyan-400/50 focus:outline-none transition-colors text-white placeholder-white/35 text-sm"
                />
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl focus:border-cyan-400/50 focus:outline-none transition-colors text-white placeholder-white/35 resize-none text-sm"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl font-medium flex items-center justify-center gap-2 shadow-[0_0_35px_-10px_rgba(56,189,248,0.9)]"
                >
                  <Icon icon="ic:baseline-send" className="w-4 h-4" />
                  Send Message
                </motion.button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 26 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-4"
            >
              <div className="rk-glass rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">Contact Information</h3>

                <button onClick={copyEmail} className="w-full flex items-center gap-4 text-left group">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 grid place-items-center shrink-0">
                    <Icon icon="ic:baseline-email" className="w-5 h-5 text-white" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-white/45 text-[11px]">Email</span>
                    <span className="block text-white text-sm truncate">{profile.email}</span>
                  </span>
                  <Icon
                    icon={copied ? 'mdi:check' : 'mdi:content-copy'}
                    className={`w-4 h-4 shrink-0 transition-colors ${copied ? 'text-emerald-400' : 'text-white/30 group-hover:text-cyan-300'}`}
                  />
                </button>

                <a href={`tel:${profile.phoneHref}`} className="flex items-center gap-4 group">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 grid place-items-center shrink-0">
                    <Icon icon="ic:baseline-phone" className="w-5 h-5 text-white" />
                  </span>
                  <span>
                    <span className="block text-white/45 text-[11px]">Phone</span>
                    <span className="block text-white text-sm group-hover:text-cyan-300 transition-colors">
                      {profile.phone}
                    </span>
                  </span>
                </a>

                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center shrink-0">
                    <Icon icon="mdi:map-marker" className="w-5 h-5 text-white" />
                  </span>
                  <span>
                    <span className="block text-white/45 text-[11px]">Location</span>
                    <span className="block text-white text-sm">{profile.location}</span>
                  </span>
                </div>
              </div>

              <div className="rk-glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Find Me Online</h3>
                <div className="flex gap-3">
                  {[
                    { href: profile.linkedin, icon: 'mdi:linkedin', bg: 'from-sky-600 to-cyan-600', label: 'LinkedIn' },
                    { href: profile.github, icon: 'mdi:github', bg: 'from-slate-700 to-slate-900', label: 'GitHub' },
                    { href: `mailto:${profile.email}`, icon: 'mdi:email', bg: 'from-cyan-600 to-sky-700', label: 'Email' },
                  ].map((s) => (
                    <motion.a
                      key={s.label}
                      href={s.href}
                      target={s.href.startsWith('http') ? '_blank' : undefined}
                      rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      whileHover={{ scale: 1.08, y: -3 }}
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.bg} grid place-items-center shadow-lg`}
                      aria-label={s.label}
                    >
                      <Icon icon={s.icon} className="w-6 h-6 text-white" />
                    </motion.a>
                  ))}
                </div>
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-cyan-400/25 bg-cyan-400/5 text-sm text-cyan-200 hover:bg-cyan-400/15 transition-colors"
                >
                  <Icon icon="mdi:file-download-outline" className="w-4 h-4" />
                  Download Résumé (PDF)
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating assistant */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 300, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setAssistantOpen(true)}
        className="fixed z-[55] bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 grid place-items-center shadow-[0_0_35px_rgba(34,211,238,0.55)]"
        aria-label="Open AI Assistant"
      >
        <Icon icon="mdi:robot" className="w-6 h-6 text-white" />
        <span className="absolute inset-0 rounded-full text-cyan-400 rk-pulse-ring" aria-hidden />
      </motion.button>

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, title: '', ctx: '' })}
        title={modal.title}
        context={modal.ctx}
      />
      <Modal
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        title="Portfolio Assistant"
        context="General questions about Rishav Kumar's background, experience, projects, skills and contact details."
      />
    </div>
  );
}

'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Icon } from '@iconify/react';
import AiHero from '@/app/components/AiHero';
import AboutWithChat from '@/app/components/AboutWithChat';

// Simple Modal for AI project explainer and assistant
function Modal({ open, onClose, title, context }: { open: boolean; onClose: () => void; title: string; context: string }) {
  const [q, setQ] = useState('');
  const [msgs, setMsgs] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: `Ask anything about ${title}.` },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setQ('');
      setMsgs([{ role: 'assistant', content: `Ask anything about ${title}.` }]);
    }
  }, [open, title]);

  const ask = async () => {
    if (!q.trim()) return;
    setLoading(true);
    setMsgs((m) => [...m, { role: 'user', content: q }]);
    setQ('');
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'project', question: `${context}. Question: ${q}` }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: 'assistant', content: data.answer || 'Here\'s my take.' }]);
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', content: 'Could not reach AI right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <div className="w-full max-w-xl rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <p className="text-sm text-white/80">AI Assistant — {title}</p>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <Icon icon="mdi:close" className="w-5 h-5" />
          </button>
        </div>
        <div className="h-64 overflow-y-auto p-4 space-y-2">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] text-xs px-3 py-2 rounded-lg border ${m.role === 'user' ? 'bg-cyan-500/20 border-cyan-300/30' : 'bg-white/5 border-white/10'}`}>{m.content}</div>
            </div>
          ))}
          {loading && <div className="text-xs text-white/60">Thinking…</div>}
        </div>
        <div className="p-4 border-t border-white/10 flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') ask(); }}
            placeholder="Ask about this project…"
            className="flex-1 bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm placeholder-white/40 outline-none"
          />
          <button onClick={ask} className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 text-sm">Send</button>
        </div>
      </div>
    </div>
  );
}

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Timeline Item Component
function TimelineItem({ 
  title, 
  company, 
  period, 
  location, 
  description, 
  techStack, 
  isLast = false 
}: {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string[];
  techStack: string;
  isLast?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="relative flex items-start space-x-6 pb-12"
    >
      {/* Timeline line and dot */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-4 h-4 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full z-10"
        />
        {!isLast && (
          <motion.div
            initial={{ height: 0 }}
            animate={isInView ? { height: '100%' } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-px bg-gradient-to-b from-sky-500/50 to-transparent mt-2"
            style={{ minHeight: '100px' }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <span className="text-cyan-300 text-sm font-medium">{period}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center mb-4 space-y-1 sm:space-y-0 sm:space-x-4">
            <p className="text-sky-300 font-medium">{company}</p>
            <p className="text-white/60 text-sm">{location}</p>
          </div>
          <ul className="text-white/80 text-sm space-y-2 mb-4">
            {description.map((item, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Icon icon="material-symbols:check-circle" className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            {techStack.split(', ').map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-sky-500/20 text-sky-300 rounded-md text-xs font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Project Card Component
function ProjectCard({ 
  title, 
  description, 
  techStack, 
  features,
  onTryAI,
}: {
  title: string;
  description: string;
  techStack: string;
  features: string[];
  onTryAI: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 [transform-style:preserve-3d]"
      style={{ perspective: '1000px' }}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <Icon icon="material-symbols:code" className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      
      <p className="text-white/80 text-sm mb-4 leading-relaxed">{description}</p>
      
      <div className="space-y-3 mb-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-2">
            <Icon icon="material-symbols:arrow-right" className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
            <span className="text-white/70 text-sm">{feature}</span>
          </div>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {techStack.split(', ').map((tech, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-md text-xs font-medium"
          >
            {tech}
          </span>
        ))}
      </div>
      <button onClick={onTryAI} className="mt-2 inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200">
        <Icon icon="mdi:robot-outline" className="w-4 h-4" /> Try Demo with AI
      </button>
    </motion.div>
  );
}

// Radial Chart Component
function Radial({ label, value }: { label: string; value: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
      <svg width="72" height="72" viewBox="0 0 80 80" className="-rotate-90">
        <circle cx="40" cy="40" r={radius} stroke="rgba(255,255,255,0.12)" strokeWidth="6" fill="none" />
        <motion.circle
          cx="40" cy="40" r={radius}
          stroke="#22d3ee"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div>
        <div className="text-sm text-white/80">{label}</div>
        <div className="text-xs text-white/60">{value}%</div>
      </div>
    </div>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [modal, setModal] = useState<{ open: boolean; title: string; ctx: string }>({ open: false, title: '', ctx: '' });
  const [assistantOpen, setAssistantOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:chrishabh2002@gmail.com?subject=Portfolio Contact from ${formData.name}&body=${formData.message}%0A%0AFrom: ${formData.email}`;
    window.location.href = mailtoLink;
  };

  // AI suggestion helper
  const [suggestion, setSuggestion] = useState<string>("");
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: 'about', question: 'Based on these skills: AI, ML, React, Node, TensorFlow — recommend an area to explore next.' })
        });
        const data = await res.json();
        setSuggestion(data.answer);
      } catch {
        setSuggestion('Based on these skills, Rishav could also explore MLOps and real-time AI systems.');
      }
    })();
  }, []);

  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      {/* Hero Section */}
      <AiHero />

      {/* Quick Stats */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <motion.div
          style={{ y }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="text-3xl font-semibold text-cyan-400 mb-1">
              <AnimatedCounter end={10} suffix="+" />
            </div>
            <div className="text-white/60 text-sm">Projects</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="text-3xl font-semibold text-sky-400 mb-1">
              <AnimatedCounter end={3} suffix="+" />
            </div>
            <div className="text-white/60 text-sm">Hackathon Wins</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="text-3xl font-semibold text-cyan-400 mb-1">
              <AnimatedCounter end={2} suffix="+" />
            </div>
            <div className="text-white/60 text-sm">Internships</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="text-3xl font-semibold text-green-400 mb-1">
              <AnimatedCounter end={95} suffix="%" />
            </div>
            <div className="text-white/60 text-sm">Uptime on shipped features</div>
          </div>
        </motion.div>
      </section>

      {/* About with AI Chat */}
      <AboutWithChat />

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light mb-6">Experience</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-cyan-500 mx-auto mb-8"></div>
          </motion.div>

          <div className="space-y-0">
            <TimelineItem
              title="Software Development Intern"
              company="Momntum AI"
              period="2025–Present"
              location="Fairview, TN"
              description={[
                "Built and enhanced UI for mission-critical enterprise software, increasing usability by 30%",
                "Integrated multiple third-party APIs, reducing data retrieval latency by 40%",
                "Debugged and tested secure communication protocols, ensuring compliance with industry security standards",
                "Conducted peer code reviews, reducing production errors by 15%",
                "Supported deployment across 10+ systems with zero downtime"
              ]}
              techStack="React, Flask, Node.js, APIs, GitHub, AWS"
            />
            <TimelineItem
              title="Machine Learning Intern"
              company="My Job Grow"
              period="Jul–Sep 2024"
              location="Bengaluru, India"
              description={[
                "Conducted data preprocessing, feature engineering, and model evaluation on large-scale datasets",
                "Applied supervised ML techniques (Regression, Classification, Decision Trees, Random Forests, SVM)",
                "Improved model accuracy through hyperparameter tuning and pipeline optimization",
                "Collaborated in a remote team environment, strengthening communication & problem-solving skills"
              ]}
              techStack="Python, Scikit-learn, Pandas, Matplotlib, TensorFlow"
              isLast={true}
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light mb-6">Featured Projects</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-cyan-500 mx-auto mb-8"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProjectCard
              title="⚙ Snapfix-AI"
              description="AI-powered defect detection and maintenance automation with Computer Vision and Flask backend."
              techStack="Python, Flask, OpenCV, Azure Cognitive Services, Docker"
              features={[
                "Integrated CV models reducing inspection time by 40%",
                "Designed REST APIs for automation & database management",
                "Prepared integration with Azure Cognitive Services",
                "Optimized system performance in Agile workflows"
              ]}
              onTryAI={() => setModal({ open: true, title: 'Snapfix-AI', ctx: 'Explain the Snapfix-AI project: CV-based defect detection, Flask backend, Azure potential.' })}
            />
            <ProjectCard
              title="📈 Stock Price Prediction Model"
              description="Time series forecasting using LSTM networks for market trend prediction."
              techStack="TensorFlow, Keras, NumPy, Pandas, Matplotlib"
              features={[
                "Implemented LSTM for time series",
                "Analyzed stock datasets for trends",
                "Optimized hyperparameters",
                "Visualization dashboard"
              ]}
              onTryAI={() => setModal({ open: true, title: 'Stock Prediction', ctx: 'Explain the LSTM stock prediction project and typical pipeline.' })}
            />
            <ProjectCard
              title="🧑‍💻 AI-based Attendance System"
              description="Face recognition attendance tracker with real-time detection."
              techStack="Python, OpenCV, Flask, SQLite"
              features={["Real-time face detection", "Secure attendance logging", "Web dashboard", "Accuracy optimizations"]}
              onTryAI={() => setModal({ open: true, title: 'Attendance System', ctx: 'Explain the face-recognition attendance system and trade-offs.' })}
            />
            <ProjectCard
              title="💬 AI Chatbot (NLP + LLMs)"
              description="Contextual chatbot using transformers and LLMs."
              techStack="Python, Hugging Face, Flask, React"
              features={["Transformers for dialogue", "LLM integration", "React UI", "Conversation memory"]}
              onTryAI={() => setModal({ open: true, title: 'AI Chatbot', ctx: 'Explain the LLM chatbot and how context is handled.' })}
            />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light mb-6">Skills & Technologies</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-cyan-500 mx-auto mb-8"></div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Radial label="Python" value={90} />
            <Radial label="React" value={85} />
            <Radial label="TensorFlow" value={80} />
            <Radial label="Node.js" value={78} />
          </div>

          <div className="text-center text-sm text-white/80 max-w-3xl mx-auto">
            <Icon icon="mdi:lightning-bolt" className="inline w-4 h-4 text-cyan-300 mr-1"/>
            {suggestion}
          </div>
        </div>
      </section>

      {/* Hackathon Achievements Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light mb-6">🏆 Hackathon Achievements</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-cyan-500 mx-auto mb-8"></div>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon icon="material-symbols:trophy" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">AI-driven Smart Agriculture Solution</h3>
                  <p className="text-white/80 text-sm mb-3">
                    Automated plant disease detection and pesticide control using ML + IoT.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-md text-xs">🥇 Winner</span>
                    <span className="px-2 py-1 bg-sky-500/20 text-sky-300 rounded-md text-xs">Agriculture</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon icon="material-symbols:security" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Defense Tech Hackathon</h3>
                  <p className="text-white/80 text-sm mb-3">
                    AI-powered surveillance prototype for real-time threat detection using computer vision.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-md text-xs">🥇 Winner</span>
                    <span className="px-2 py-1 bg-rose-500/20 text-rose-300 rounded-md text-xs">Defense Tech</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon icon="material-symbols:code" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Multiple Coding Competitions</h3>
                  <p className="text-white/80 text-sm mb-3">
                    ML-driven prototypes under time constraints, showcasing rapid development.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-md text-xs">🥇 Multiple Wins</span>
                    <span className="px-2 py-1 bg-sky-500/20 text-sky-300 rounded-md text-xs">ML/AI</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light mb-6">🎓 Education</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-cyan-500 mx-auto mb-8"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-cyan-400/20"
          >
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-2">Bachelor of Technology (B.Tech)</h3>
              <p className="text-cyan-300 text-lg mb-2">Computer Science Engineering</p>
              <p className="text-white/80 mb-4">Galgotias University, Greater Noida, UP</p>
              <p className="text-sky-300 font-medium mb-6">(2023 – 2027)</p>
              <div className="max-w-2xl mx-auto">
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  Focus Areas: AI, Machine Learning, System Design, Full‑Stack Development
                </p>
                <p className="text-white/60 text-sm">
                  Active in hackathons, coding challenges, and AI research projects.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light mb-6">Get In Touch</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-cyan-500 mx-auto mb-8"></div>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Let&apos;s collaborate on your next project or discuss opportunities in AI and software development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['I’d like to collaborate on AI projects','Can you build an MVP?','Available for internship?','Let’s discuss ML consulting'].map((s)=> (
                    <button key={s} type="button" onClick={()=> setFormData((f)=> ({...f, message: s}))} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white/90">
                      {s}
                    </button>
                  ))}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-sky-500 focus:outline-none transition-colors duration-300 text-white placeholder-white/50"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-sky-500 focus:outline-none transition-colors duration-300 text-white placeholder-white/50"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Your Message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-sky-500 focus:outline-none transition-colors duration-300 text-white placeholder-white/50 resize-none"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-lg font-medium flex items-center justify-center space-x-2 hover:shadow-xl transition-shadow duration-300"
                >
                  <Icon icon="ic:baseline-send" className="w-5 h-5" />
                  <span>Send Message</span>
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Icon icon="ic:baseline-email" className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Email</p>
                      <p className="text-white">chrishabh2002@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Icon icon="ic:baseline-phone" className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Phone</p>
                      <p className="text-white">+91 6398904235</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-6">Follow Me</h3>
                <div className="flex space-x-4">
                  <motion.a
                    href="https://linkedin.com/in/rishav-kumar-983a5b273"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-12 h-12 bg-gradient-to-r from-sky-600 to-cyan-600 rounded-lg flex items-center justify-center hover:shadow-lg transition-shadow duration-300"
                  >
                    <Icon icon="mdi:linkedin" className="w-6 h-6 text-white" />
                  </motion.a>
                  <motion.a
                    href="https://github.com/Chrishabh2002"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg flex items-center justify-center hover:shadow-lg transition-shadow duration-300"
                  >
                    <Icon icon="mdi:github" className="w-6 h-6 text-white" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating Assistant */}
      <button
        onClick={() => setAssistantOpen(true)}
        className="fixed z-[55] bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 grid place-items-center shadow-[0_0_25px_rgba(34,211,238,0.45)]"
        aria-label="Open AI Assistant"
      >
        <Icon icon="mdi:robot" className="w-6 h-6 text-white" />
      </button>

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
        context="General questions about Rishav\'s background, projects, and contact."
      />
    </div>
  );
}
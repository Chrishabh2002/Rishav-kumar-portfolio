import { NextRequest } from "next/server";
import { resumeContext } from "@/lib/portfolio-data";

export const runtime = "edge";

const SYSTEM = `You are the AI assistant embedded in Rishav Kumar's portfolio website.
Answer questions about his experience, projects, skills, education and achievements using ONLY the résumé below.
Be concise (2-4 sentences), professional and warm. If something isn't in the résumé, say so and point to his email.

--- RÉSUMÉ ---
${resumeContext}
--- END RÉSUMÉ ---`;

/**
 * Offline answer engine. Runs whenever no model API key is configured, so the
 * assistant still gives real résumé answers instead of a placeholder.
 */
function fallback(question: string): string {
  const q = question.toLowerCase();
  const has = (...terms: string[]) => terms.some((t) => q.includes(t));

  if (has("where", "current", "now", "cyberrant", "working"))
    return "Rishav is currently an AI Software Engineer (also titled AI Security Engineer) at Cyberrant Limited, London, UK (remote) since Oct 2025 — building AI products for cybersecurity operations, controlled task-execution systems that run terminal operations in Linux, and modules for command routing, execution tracking and result summarization.";

  if (has("momntum", "eaiser", "civic"))
    return "At MomntumAI LLC (Nashville, US · remote, Jan–Oct 2025) he was a Software Engineer building Python backend services, redesigning API flows and data access patterns, and deploying across 10+ production systems with zero-downtime CI/CD. His main project there was EAiSER-AI — a civic-tech platform using OpenCV vision models for fault detection, cutting manual inspection time by 40%.";

  if (has("agent", "rant", "aievolve", "automation"))
    return "Agent work: Ask Rant AI / Rant AI Agent (commercial, Cyberrant) — cybersecurity guidance plus controlled local command execution with structured reporting; and AIEvolve AI Agent (personal, since Mar 2026) — a DevOps execution agent handling command workflows, system checks, deployment assistance and reporting.";

  if (has("intern"))
    return "He was a Machine Learning Intern at My Job Grow Private Limited, Bengaluru (Jul–Sep 2024) — building end-to-end ML pipelines covering data prep, training and evaluation with Python, Pandas, Scikit-learn and TensorFlow, and improving model quality through structured, metric-based experiments.";

  if (has("stack", "tech", "skill", "language", "tool"))
    return "Core stack: Python (plus Java, C, Shell), FastAPI/Flask/Node.js for backend, LLM applications, AI agents, RAG, LangChain, Hugging Face, PyTorch, Scikit-learn and OpenCV for AI/ML, MongoDB/Supabase/SQLite/SQL/FAISS for data, and Linux, Docker, AWS, GCP, Render, Git and CI/CD for shipping.";

  if (has("project", "built", "work on"))
    return "Highlighted projects: Ask Rant AI / Rant AI Agent (Cyberrant), EAiSER-AI defect detection platform (MomntumAI), AIEvolve DevOps agent, Snapfix-AI, an LSTM stock prediction model, an OpenCV attendance system, and an LLM chatbot.";

  if (has("education", "college", "degree", "university", "study"))
    return "He's completing a B.Tech in Computer Science Engineering at Galgotias University, Greater Noida (Sep 2023 – May 2027), focused on AI/ML, system design, full-stack development and computer networks.";

  if (has("hackathon", "award", "achievement", "win"))
    return "Hackathon wins include an AI-driven smart agriculture solution (ML + IoT plant disease detection) and a defense-tech surveillance prototype using computer vision, plus multiple coding-competition wins.";

  if (has("contact", "email", "hire", "reach", "phone", "resume", "cv"))
    return "Reach him at chrishabh2002@gmail.com or +91 6398904235 (Noida, India). LinkedIn: linkedin.com/in/rishav-kumar-983a5b273 · GitHub: github.com/Chrishabh2002. The résumé PDF is downloadable from the nav bar.";

  if (has("next", "explore", "recommend", "future"))
    return "Next frontier: MLOps for agent fleets — evaluation harnesses, sandboxed execution and observability for LLM systems running in production, which builds directly on his command-execution agent and security-automation work.";

  return "I'm Rishav's on-site assistant. He's an AI Software Engineer at Cyberrant Limited building command-execution agents and security automation, previously a backend engineer at MomntumAI LLC. Ask about his experience, projects, skills, education or how to reach him.";
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    status,
  });

export async function POST(req: NextRequest) {
  try {
    const { question } = (await req.json()) as { question: string; topic?: string };
    if (!question?.trim()) return json({ answer: fallback("") });

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    // Preferred: Claude (Messages API).
    if (ANTHROPIC_API_KEY) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-opus-5",
          max_tokens: 1024,
          system: SYSTEM,
          messages: [{ role: "user", content: question }],
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as {
          stop_reason?: string;
          content: Array<{ type: string; text?: string }>;
        };
        // Safety classifiers can decline; content is empty or partial on refusal.
        if (data.stop_reason !== "refusal") {
          const answer = data.content
            ?.filter((b) => b.type === "text")
            .map((b) => b.text)
            .join("")
            .trim();
          if (answer) return json({ answer });
        }
      }
      // fall through to OpenAI / offline answer
    }

    // Secondary: OpenAI, if that key is the one configured.
    if (OPENAI_API_KEY) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.4,
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: question },
          ],
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as {
          choices: Array<{ message: { content: string } }>;
        };
        const answer = data.choices?.[0]?.message?.content?.trim();
        if (answer) return json({ answer });
      }
    }

    return json({ answer: fallback(question) });
  } catch {
    return json({
      answer: "I hit an issue answering right now. Please try again, or email chrishabh2002@gmail.com.",
    });
  }
}

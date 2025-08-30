import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { question, topic } = (await req.json()) as { question: string; topic?: string };
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    const fallback = () => {
      const q = question.toLowerCase();
      if (q.includes("intern")) {
        return "Rishav has interned as a Software Development Intern at Momntum AI (2025–present) and as a Machine Learning Intern at My Job Grow (Jul–Sep 2024).";
      }
      if (q.includes("project") || q.includes("work")) {
        return "Highlighted projects: Snapfix‑AI (CV‑powered defect detection), LSTM Stock Prediction, AI‑based Attendance (OpenCV), and an LLM chatbot.";
      }
      if (q.includes("stack") || q.includes("tech")) {
        return "Preferred stack: React/Node/TypeScript on the web, Python for AI/ML with TensorFlow/Scikit‑learn, and tooling like Docker & AWS.";
      }
      return "I\'m Rishav\'s on‑site assistant. Ask about internships, projects, or skills! (Live AI not configured yet.)";
    };

    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ answer: fallback() }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    const system =
      topic === "about"
        ? "You are the AI assistant embedded in Rishav Kumar\'s portfolio. Answer concisely about his internships, projects, skills, education, and achievements. Keep tone professional and warm."
        : "You are a helpful portfolio assistant. Be concise.";

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
          { role: "system", content: system },
          {
            role: "user",
            content: question,
          },
        ],
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      return new Response(JSON.stringify({ answer: fallback(), error: msg }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    const data = (await res.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    const answer = data.choices?.[0]?.message?.content?.trim() || fallback();

    return new Response(JSON.stringify({ answer }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch {
    return new Response(JSON.stringify({ answer: "I hit an issue answering right now. Please try again." }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }
}

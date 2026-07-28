// Never use @iconify/react inside this file.
import { ImageResponse } from "next/og";
import { experiences, profile } from "@/lib/portfolio-data";

export const alt = `${profile.name} — ${profile.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social preview card. This is what shows up on LinkedIn, X, WhatsApp and in
 * Google's rich results, so it carries the name, role and proof points rather
 * than just a logo.
 */
export default function OpengraphImage() {
  // Five chips is the most that fits beside the domain on one line at 1200px.
  const chips = ["Python", "LLM Agents", "FastAPI", "RAG", "Docker"];

  // satori requires any element with more than one child to declare a display
  // mode, so every text block below receives exactly one pre-joined string.
  const eyebrow = `${profile.availability.toUpperCase()} · ${profile.location.toUpperCase()}`;
  const roleLine = `${profile.headline} · ${profile.altHeadline}`;
  const blurb =
    "Command-execution agents, production APIs and security-oriented automation. " +
    `Currently at ${experiences[0].company}, ${experiences[0].location}.`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #04070d 0%, #0a1420 55%, #06121c 100%)",
          padding: "64px 72px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* accent glow */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -140,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(34,211,238,0.28) 0%, rgba(34,211,238,0) 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 9999,
                background: "#34d399",
                display: "flex",
              }}
            />
            <div style={{ fontSize: 24, color: "#7dd3fc", letterSpacing: 2 }}>{eyebrow}</div>
          </div>

          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              color: "#ffffff",
              marginTop: 26,
              lineHeight: 1.05,
            }}
          >
            {profile.name}
          </div>

          <div
            style={{
              fontSize: 42,
              color: "#22d3ee",
              marginTop: 12,
              fontWeight: 600,
            }}
          >
            {roleLine}
          </div>

          <div
            style={{
              fontSize: 27,
              color: "rgba(255,255,255,0.62)",
              marginTop: 22,
              maxWidth: 940,
              lineHeight: 1.45,
            }}
          >
            {blurb}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28 }}>
          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            {chips.map((c) => (
              <div
                key={c}
                style={{
                  display: "flex",
                  fontSize: 23,
                  color: "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(34,211,238,0.32)",
                  background: "rgba(34,211,238,0.08)",
                  borderRadius: 12,
                  padding: "9px 18px",
                }}
              >
                {c}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 23,
              color: "rgba(255,255,255,0.45)",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            rishav-kumar-portfolio.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

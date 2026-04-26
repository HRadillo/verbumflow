// src/app/components/splash-screen.tsx
"use client";

import React, { useEffect, useState } from "react";
import { EntryScreen } from "./entry-screen";

type SplashScreenProps = {
  onComplete: () => void;
};

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showEntry, setShowEntry] = useState(false);

  useEffect(() => {
    // Switch to entry screen when splash fade-out ends (3.6s delay + 0.8s duration)
    const timer = setTimeout(() => {
      setShowEntry(true);
    }, 4400);
    return () => clearTimeout(timer);
  }, []);

  if (showEntry) {
    return <EntryScreen onComplete={onComplete} />;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
      style={{
        background:
          "radial-gradient(ellipse at 0% 0%, rgba(31,75,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(255,106,77,0.15) 0%, transparent 50%), #0B1020",
        animation: "splashFadeOut 0.8s ease-in-out 3.6s both",
        willChange: "opacity",
      }}
    >
      {/* Logomark with V trace + tilde trace animations */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="40 30 220 180"
        style={{ height: "96px", width: "auto" }}
        aria-hidden="true"
      >
        <g transform="translate(40 40)">
          <defs>
            <linearGradient
              id="vf-splash-tilde"
              x1="25"
              x2="185"
              y1="0"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="50%" stopColor="#FF6A4D" />
              <stop offset="50%" stopColor="#1F4BFF" />
            </linearGradient>
          </defs>

          {/* V path — traces from 0s to 1.2s */}
          <path
            d="M40 50 L105 160 L170 50"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 300,
              strokeDashoffset: 300,
              animation: "traceStroke 1.2s ease-in-out 0s both",
              willChange: "stroke-dashoffset",
            }}
          />

          {/* Tilde path — traces from 1.0s to 2.0s */}
          <path
            d="M25 100 Q70 70 105 100 T185 100"
            fill="none"
            stroke="url(#vf-splash-tilde)"
            strokeWidth="14"
            strokeLinecap="round"
            style={{
              strokeDasharray: 300,
              strokeDashoffset: 300,
              animation: "traceStroke 1.0s ease-in-out 1.0s both",
              willChange: "stroke-dashoffset",
            }}
          />
        </g>
      </svg>

      {/* Wordmark — fades + slides up from 1.8s to 2.6s */}
      <div
        style={{
          animation: "wordmarkReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.8s both",
          willChange: "opacity, transform",
        }}
      >
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(36px, 10vw, 56px)",
            letterSpacing: "-2px",
            lineHeight: 1,
          }}
        >
          <span style={{ fontWeight: 700, color: "#FFFFFF" }}>verbum</span>
          <span style={{ fontWeight: 800, color: "#FF6A4D" }}>flow</span>
        </span>
      </div>

      {/* Tagline — fades in from 2.6s to 3.4s */}
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          letterSpacing: "4px",
          textTransform: "uppercase",
          color: "#FFFFFF",
          animation: "taglineReveal 0.8s ease-out 2.6s both",
          willChange: "opacity",
        }}
      >
        LEARN AND COMPETE
      </p>
    </div>
  );
}

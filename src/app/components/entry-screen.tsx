// src/app/components/entry-screen.tsx
"use client";

import React from "react";
import { LogIn, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

const HOW_TO_PLAY = [
  {
    icon: "🎮",
    title: "Classic Mode",
    desc: "Master one verb at a time. Answer all its pronouns to keep your streak alive.",
  },
  {
    icon: "🎲",
    title: "Random Mode",
    desc: "Every question is a wildcard. Harder, faster, more competitive.",
  },
  {
    icon: "🔥",
    title: "Streak",
    desc: "Answer correctly, keep going. One wrong answer (or time's up) resets to zero.",
  },
  {
    icon: "⏱",
    title: "10 seconds",
    desc: "You have 10 seconds per question. The bar turns red when time is short.",
  },
  {
    icon: "📅",
    title: "Daily Streak",
    desc: "Come back every day to build your daily streak. Consistency wins.",
  },
];

type EntryScreenProps = {
  onComplete: () => void;
};

export function EntryScreen({ onComplete }: EntryScreenProps) {
  const { signInWithGoogle } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Auth state change in page.tsx will unmount this screen automatically
    } catch {
      // Ignore errors (user may cancel popup)
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{
        background:
          "radial-gradient(ellipse at 0% 0%, rgba(31,75,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(255,106,77,0.15) 0%, transparent 50%), #0B1020",
        animation: "entryFadeIn 0.4s ease-out forwards",
        willChange: "opacity",
      }}
    >
      <div className="w-full max-w-sm mx-auto px-4 py-8 flex flex-col items-center gap-6">
        {/* LogoMark + wordmark */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="40 30 220 180"
            style={{ height: "44px", width: "auto" }}
            aria-hidden="true"
          >
            <g transform="translate(40 40)">
              <defs>
                <linearGradient
                  id="vf-entry-tilde"
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
              <path
                d="M40 50 L105 160 L170 50"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="22"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M25 100 Q70 70 105 100 T185 100"
                fill="none"
                stroke="url(#vf-entry-tilde)"
                strokeWidth="14"
                strokeLinecap="round"
              />
            </g>
          </svg>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "32px",
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            <span style={{ fontWeight: 700, color: "#FFFFFF" }}>verbum</span>
            <span style={{ fontWeight: 800, color: "#FF6A4D" }}>flow</span>
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#FFFFFF",
            opacity: 0.5,
          }}
        >
          LEARN AND COMPETE
        </p>

        <div className="w-full h-px bg-white/10" />

        {/* Sign in section */}
        <div className="w-full space-y-3">
          <Button
            onClick={handleSignIn}
            className="w-full rounded-full gap-2 font-semibold text-white"
            style={{
              backgroundColor: "#1F4BFF",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            <LogIn className="h-4 w-4" />
            Sign in with Google
          </Button>
          <p
            className="text-center text-xs"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Save your streaks, climb the leaderboard, duel friends.
          </p>
        </div>

        <div className="w-full h-px bg-white/10" />

        {/* Guest section */}
        <div className="w-full space-y-3">
          <Button
            onClick={onComplete}
            variant="outline"
            className="w-full rounded-full gap-2 bg-transparent hover:bg-white/5"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              borderColor: "rgba(255,255,255,0.5)",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Continue as Guest
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p
            className="text-center text-xs"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            Guests can&apos;t duel, add friends, or save progress.
          </p>
        </div>

        <div className="w-full h-px bg-white/10" />

        {/* How to Play card */}
        <div
          className="w-full rounded-2xl p-6 space-y-4"
          style={{
            backgroundColor: "#FAFAF7",
            border: "1px solid rgba(31,75,255,0.12)",
          }}
        >
          <h3
            className="text-base font-bold text-center"
            style={{
              color: "#0B1020",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            How to Play
          </h3>
          <div className="space-y-3">
            {HOW_TO_PLAY.map((item) => (
              <div key={item.title} className="flex gap-3 items-start">
                <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{
                      color: "#0B1020",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-xs text-gray-500 mt-0.5"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// src/app/components/onboarding.tsx
"use client";

import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { LogIn, ArrowRight } from "lucide-react";

type OnboardingProps = {
  onClose: () => void;
};

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
  {
    icon: "📱",
    title: "Add to Home Screen",
    desc: "Play like a native app — install VerbumFlow from your browser menu.",
  },
];

export function Onboarding({ onClose }: OnboardingProps) {
  const { signInWithGoogle } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      // page.tsx watches auth state and closes onboarding on successful sign-in
    } catch {
      // ignore errors (user may cancel popup)
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto py-8 px-4"
      style={{
        background:
          "radial-gradient(ellipse at 0% 0%, rgba(31,75,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(255,106,77,0.15) 0%, transparent 50%), #0B1020",
      }}
    >
      {/* Brand mark + wordmark */}
      <div className="flex items-center justify-center gap-3 mb-8 mt-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 280"
          className="h-10 w-auto flex-shrink-0"
          aria-hidden="true"
        >
          <g transform="translate(40 40)">
            <defs>
              <linearGradient
                id="vf-mark-onboarding"
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
              stroke="url(#vf-mark-onboarding)"
              strokeWidth="14"
              strokeLinecap="round"
            />
          </g>
        </svg>
        <span
          className="text-4xl"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: "-2px",
            lineHeight: 1,
          }}
        >
          <span className="font-bold text-white">verbum</span>
          <span style={{ fontWeight: 800, color: "#FF6A4D" }}>flow</span>
        </span>
      </div>

      <div className="w-full max-w-sm space-y-4">
        {/* Sign-in prompt card */}
        <div
          className="rounded-2xl p-6 text-center space-y-4"
          style={{
            backgroundColor: "#FAFAF7",
            border: "1px solid rgba(31,75,255,0.12)",
          }}
        >
          <div className="text-3xl">🏆</div>
          <h2
            className="text-xl font-extrabold"
            style={{
              color: "#0B1020",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Compete for the top spot
          </h2>
          <p className="text-sm text-gray-600">
            Sign in with Google to save your streak, appear on the leaderboard,
            and defend your record.
          </p>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSignIn}
              className="w-full gap-2 text-white font-semibold"
              style={{ backgroundColor: "#1F4BFF" }}
            >
              <LogIn className="h-4 w-4" />
              Sign in with Google
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full gap-2 text-gray-600 hover:text-gray-900"
            >
              Play as Guest
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <p
            className="text-xs text-gray-400"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Guest streaks are not saved and won&apos;t appear on the
            leaderboard.
          </p>
        </div>

        {/* How to play */}
        <div
          className="rounded-2xl p-6 space-y-4"
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
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

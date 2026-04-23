// src/app/page.tsx
"use client";

import { ConjugationPractice } from "@/app/components/conjugation-practice";
import { UserMenu } from "@/app/components/user-menu";
import { Leaderboard } from "@/app/components/leaderboard";
import { Onboarding } from "@/app/components/onboarding";
import { Felicitations } from "@/app/components/felicitations";
import { useAuth } from "@/contexts/auth-context";
import { useState, useEffect, useCallback } from "react";
import { initializeUserStats, type UserStats } from "@/lib/firestore";
import { Heart } from "lucide-react";

export default function Home() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [felicitationsType, setFelicitationsType] = useState<
    "personal" | "global" | null
  >(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const { user, loading } = useAuth();

  // Manage onboarding visibility and user stats based on auth state
  useEffect(() => {
    if (loading) return;
    if (user) {
      // Signed in: set persistent flag, close onboarding, load stats
      if (typeof window !== "undefined") {
        localStorage.setItem("vf_onboarded", "1");
      }
      setShowOnboarding(false);
      initializeUserStats(
        user.uid,
        user.displayName ?? "Anonymous",
        user.photoURL
      ).then(setUserStats);
    } else {
      // Guest: show onboarding every session (no localStorage flag)
      setUserStats(null);
      const onboarded =
        typeof window !== "undefined"
          ? localStorage.getItem("vf_onboarded")
          : null;
      if (!onboarded) {
        setShowOnboarding(true);
      }
    }
  }, [user, loading]);

  const handleStreakRecord = useCallback(
    (type: "personal" | "global") => {
      // Global record takes priority over personal
      setFelicitationsType((prev) =>
        prev === "global" ? "global" : type
      );
    },
    []
  );

  const handleDismissFelicitations = useCallback(() => {
    setFelicitationsType(null);
  }, []);

  return (
    <main
      className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{
        background:
          "radial-gradient(ellipse at 0% 0%, rgba(31,75,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(255,106,77,0.15) 0%, transparent 50%), #0B1020",
      }}
    >
      {/* Top bar */}
      <div className="absolute top-4 right-4 z-10">
        <UserMenu
          onShowLeaderboard={() => setShowLeaderboard(true)}
          onShowOnboarding={() => setShowOnboarding(true)}
          onBackToMenu={() => setShowOnboarding(true)}
        />
      </div>

      {/* User stats badges (signed-in only) */}
      {userStats && (
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          {/* Daily streak */}
          <div
            title="Daily Streak — consecutive days you've practiced"
            className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 cursor-default"
          >
            <span className="text-sm">📅</span>
            <span
              className="text-white text-xs font-semibold tabular-nums"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {userStats.dailyStreak}d
            </span>
          </div>
          {/* Total correct */}
          <div
            title="Total Correct — all-time correct answers"
            className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 cursor-default"
          >
            <span className="text-sm">🎯</span>
            <span
              className="text-white text-xs font-semibold tabular-nums"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {userStats.totalCorrect}
            </span>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        <header className="text-center mb-6">
          {/* Brand mark + wordmark */}
          <div className="flex items-end justify-center gap-3 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="40 30 220 180"
              className="h-10 sm:h-12 w-auto flex-shrink-0"
              style={{ marginBottom: "2px" }}
              aria-hidden="true"
            >
              <g transform="translate(40 40)">
                <defs>
                  <linearGradient
                    id="vf-mark-header"
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
                  stroke="url(#vf-mark-header)"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
              </g>
            </svg>
            {/* Wordmark */}
            <span
              className="text-4xl sm:text-5xl"
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
          {/* Tagline */}
          <p
            className="text-xs text-white uppercase"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "4px",
              opacity: 0.6,
            }}
          >
            LEARN AND COMPETE
          </p>
        </header>

        <ConjugationPractice
          onNextQuestion={() => {}}
          onStatsUpdate={setUserStats}
          onStreakRecord={handleStreakRecord}
        />
      </div>

      <footer className="absolute bottom-4 text-center text-xs text-white/80 drop-shadow-sm">
        <p>&copy; {new Date().getFullYear()} Created by Horacio Radillo</p>
        <p>For educational purposes only.</p>
        <a
          href="https://www.paypal.com/paypalme/aurumstudio"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-2 bg-white/80 text-gray-800 rounded-full px-4 py-1.5 text-xs shadow-md hover:scale-105 hover:bg-white transition-all"
        >
          <Heart className="h-3 w-3 text-rose-500" />
          Donate
        </a>
      </footer>

      {/* Leaderboard modal */}
      <Leaderboard open={showLeaderboard} onOpenChange={setShowLeaderboard} />

      {/* Onboarding overlay */}
      {showOnboarding && (
        <Onboarding onClose={() => setShowOnboarding(false)} />
      )}

      {/* Félicitations overlay */}
      {felicitationsType && (
        <Felicitations
          type={felicitationsType}
          onDismiss={handleDismissFelicitations}
        />
      )}
    </main>
  );
}

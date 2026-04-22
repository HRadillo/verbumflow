// src/app/page.tsx
"use client";

import { ConjugationPractice } from "@/app/components/conjugation-practice";
import { UserMenu } from "@/app/components/user-menu";
import { Leaderboard } from "@/app/components/leaderboard";
import { useAuth } from "@/contexts/auth-context";
import { useState, useEffect } from "react";
import { initializeUserStats, type UserStats } from "@/lib/firestore";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target, Heart } from "lucide-react";

export default function Home() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      initializeUserStats(
        user.uid,
        user.displayName ?? "Anonymous",
        user.photoURL
      ).then(setUserStats);
    } else {
      setUserStats(null);
    }
  }, [user]);

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
        <UserMenu onShowLeaderboard={() => setShowLeaderboard(true)} />
      </div>

      {/* User stats badges (signed-in only) */}
      {userStats && (
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <Badge
            variant="secondary"
            className="bg-white/20 text-white border-white/30 gap-1"
          >
            <Calendar className="h-3 w-3" />
            {userStats.dailyStreak}d
          </Badge>
          <Badge
            variant="secondary"
            className="bg-white/20 text-white border-white/30 gap-1"
          >
            <Target className="h-3 w-3" />
            {userStats.totalCorrect}
          </Badge>
        </div>
      )}

      <div className="w-full max-w-md">
        <header className="text-center mb-6">
          {/* Brand mark — centered, standalone */}
          <div className="flex justify-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 220 200"
              className="h-16 sm:h-20 w-auto"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="vf-mark-header"
                  x1="25" x2="185" y1="0" y2="0"
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
            </svg>
          </div>

          {/* Wordmark — centered below the mark */}
          <div className="flex justify-center mb-1">
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: "-2px",
                lineHeight: 1,
              }}
              className="text-4xl sm:text-5xl"
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
              opacity: 0.5,
            }}
          >
            LEARN AND COMPETE
          </p>
        </header>

        <ConjugationPractice
          onNextQuestion={() => {}}
          onStatsUpdate={setUserStats}
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
    </main>
  );
}

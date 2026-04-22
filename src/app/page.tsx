// src/app/page.tsx
"use client";

import { ConjugationPractice } from "@/app/components/conjugation-practice";
import { UserMenu } from "@/app/components/user-menu";
import { Leaderboard } from "@/app/components/leaderboard";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { initializeUserStats, type UserStats } from "@/lib/firestore";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target } from "lucide-react";

const gradients = [
  "from-pink-300 via-purple-300 to-indigo-400",
  "from-green-200 via-green-300 to-blue-500",
  "from-yellow-200 via-red-200 to-pink-200",
  "from-indigo-300 to-purple-400",
  "from-green-200 to-green-500",
  "from-red-200 to-yellow-200",
  "from-blue-100 via-blue-300 to-blue-500",
  "from-purple-200 via-purple-400 to-purple-800",
];

export default function Home() {
  const [backgroundClass, setBackgroundClass] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const { user } = useAuth();

  const changeBackground = React.useCallback(() => {
    const randomGradient =
      gradients[Math.floor(Math.random() * gradients.length)];
    setBackgroundClass(randomGradient);
  }, []);

  useEffect(() => {
    changeBackground();
  }, [changeBackground]);

  // Initialize user stats on sign-in
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
      className={cn(
        "flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8 transition-all duration-1000 ease-in-out bg-gradient-to-br",
        backgroundClass
      )}
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
        <header className="text-center mb-4">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white drop-shadow-md">
            Verbarium
          </h1>
          <p className="mt-2 text-base text-white/90 drop-shadow-sm">
            Master French verb conjugations with interactive flashcards.
          </p>
        </header>
        <ConjugationPractice
          onNextQuestion={changeBackground}
          onStatsUpdate={setUserStats}
        />
      </div>

      <footer className="absolute bottom-4 text-center text-xs text-white/80 drop-shadow-sm">
        <p>&copy; {new Date().getFullYear()} Created by Horacio Radillo</p>
        <p>For educational purposes only.</p>
      </footer>

      {/* Leaderboard modal */}
      <Leaderboard
        open={showLeaderboard}
        onOpenChange={setShowLeaderboard}
      />
    </main>
  );
}

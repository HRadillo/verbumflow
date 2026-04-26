// src/app/page.tsx
"use client";

import { ConjugationPractice } from "@/app/components/conjugation-practice";
import { UserMenu } from "@/app/components/user-menu";
import { Leaderboard } from "@/app/components/leaderboard";
import { Onboarding } from "@/app/components/onboarding";
import { Felicitations } from "@/app/components/felicitations";
import { StudyMode } from "@/app/components/study-mode";
import { UsernameSetup } from "@/app/components/username-setup";
import { FriendsPanel } from "@/app/components/friends-panel";
import { SplashScreen } from "@/app/components/splash-screen";
import { useAuth } from "@/contexts/auth-context";
import { useState, useEffect, useCallback } from "react";
import { getHandle, initializeUserStats, type UserStats } from "@/lib/firestore";
import { Heart } from "lucide-react";

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showStudyMode, setShowStudyMode] = useState(false);
  const [showFriendsPanel, setShowFriendsPanel] = useState(false);
  const [needsUsername, setNeedsUsername] = useState(false);
  const [currentHandle, setCurrentHandle] = useState<string | null>(null);
  const [felicitationsType, setFelicitationsType] = useState<
    "personal" | "global" | null
  >(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [showHomeInterrupt, setShowHomeInterrupt] = useState(false);
  const [currentGameState, setCurrentGameState] = useState<"idle" | "playing" | "lost">("idle");
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
      ).then((stats) => {
        setUserStats(stats);
        getHandle(user.uid)
          .then((handle) => {
            setCurrentHandle(handle);
            setNeedsUsername(handle === null);
          })
          .catch(() => {
            setCurrentHandle(null);
            setNeedsUsername(true);
          });
      });
    } else {
      // Guest: splash → entry screen handles the initial prompt
      setUserStats(null);
      setNeedsUsername(false);
      setCurrentHandle(null);
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

  const handleOpenStudy = useCallback(() => {
    setShowStudyMode(true);
  }, []);

  const handleOpenFriends = useCallback(() => {
    setShowFriendsPanel(true);
  }, []);

  // Auto-dismiss interrupt if game is no longer playing
  useEffect(() => {
    if (currentGameState !== "playing") {
      setShowHomeInterrupt(false);
    }
  }, [currentGameState]);

  const handleHomeClick = useCallback(() => {
    if (user && currentGameState === "playing") {
      setShowHomeInterrupt(true);
    }
    // Guest or idle: no-op (player is already at the idle screen)
  }, [user, currentGameState]);

  const activeScreen = showLeaderboard
    ? ("leaderboard" as const)
    : showStudyMode
    ? ("study" as const)
    : showOnboarding
    ? ("help" as const)
    : ("home" as const);

  if (loading) {
    return (
      <main
        className="flex min-h-screen w-full items-center justify-center"
        style={{
          background:
            "radial-gradient(ellipse at 0% 0%, rgba(31,75,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(255,106,77,0.15) 0%, transparent 50%), #0B1020",
        }}
      >
        <div className="h-10 w-10 border-4 border-dashed rounded-full animate-spin border-[#1F4BFF]" />
      </main>
    );
  }

  // Guest users (not signed in) always go through splash → entry screen on each cold load
  if (!splashDone && !user) {
    return <SplashScreen onComplete={() => setSplashDone(true)} />;
  }

  return (
    <main
      className="flex min-h-screen w-full flex-col items-center p-4 sm:p-6 lg:p-8 pb-6"
      style={{
        background:
          "radial-gradient(ellipse at 0% 0%, rgba(31,75,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(255,106,77,0.15) 0%, transparent 50%), #0B1020",
      }}
    >
      {/* Two-row header: Row 1 = logo/wordmark/tagline, Row 2 = nav icons */}
      <div className="w-full max-w-md">
        {/* Row 1: Brand mark + wordmark + tagline */}
        <header className="text-center mb-3 pt-14">
          <div className="flex items-center justify-center gap-3 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="40 30 220 180"
              className="h-10 sm:h-12 w-auto flex-shrink-0"
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

        {/* Row 2: Centered nav icons (avatar is fixed top-right) */}
        <div className="mb-2">
          <UserMenu
            onShowLeaderboard={() => setShowLeaderboard(true)}
            onShowOnboarding={() => setShowOnboarding(true)}
            onBackToMenu={handleHomeClick}
            onOpenStudy={handleOpenStudy}
            onOpenFriends={handleOpenFriends}
            activeScreen={activeScreen}
            handle={currentHandle}
          />
        </div>
      </div>

      {/* Center content — grows to fill space */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className="w-full max-w-md">
          <ConjugationPractice
            onNextQuestion={() => {}}
            onStatsUpdate={setUserStats}
            onStreakRecord={handleStreakRecord}
            userStats={userStats}
            showHomeInterrupt={showHomeInterrupt}
            onHomeInterruptDismiss={() => setShowHomeInterrupt(false)}
            onGoHome={() => setShowHomeInterrupt(false)}
            onGameStateChange={setCurrentGameState}
          />
        </div>
      </div>

      {/* Footer — always at bottom, never overlapping */}
      <footer className="w-full text-center text-xs text-white/80 drop-shadow-sm pt-4">
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

      {/* Username setup modal — shown after first sign-in */}
      {needsUsername && user && (
        <UsernameSetup
          onComplete={(handle) => {
            setNeedsUsername(false);
            setCurrentHandle(handle);
            setUserStats((prev) => (prev ? { ...prev, username: handle, handle } : prev));
          }}
        />
      )}

      {/* Friends panel */}
      <FriendsPanel open={showFriendsPanel} onOpenChange={setShowFriendsPanel} />

      {/* Leaderboard modal */}
      <Leaderboard open={showLeaderboard} onOpenChange={setShowLeaderboard} />

      {/* Onboarding overlay */}
      {showOnboarding && (
        <Onboarding
          onClose={() => setShowOnboarding(false)}
          onOpenStudy={handleOpenStudy}
        />
      )}

      {/* Study Mode modal */}
      <StudyMode open={showStudyMode} onOpenChange={setShowStudyMode} />

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

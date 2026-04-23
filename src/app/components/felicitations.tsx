// src/app/components/felicitations.tsx
"use client";

import React, { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";

type FelicitationsProps = {
  type: "personal" | "global";
  onDismiss: () => void;
};

// Confetti piece definition
type ConfettiPiece = {
  left: string;
  delay: string;
  duration: string;
  color: string;
  size: string;
};

const COLORS = ["#1F4BFF", "#FF6A4D", "#FAFAF7", "#0B1020", "#FFD700"];

// Pre-defined confetti data (stable, no Math.random at module level)
function generateConfetti(): ConfettiPiece[] {
  const pieces: ConfettiPiece[] = [];
  const lefts = [5, 10, 18, 25, 32, 40, 48, 55, 62, 70, 77, 84, 90, 95, 15, 35, 58, 72, 88, 42];
  const delays = [0, 0.2, 0.4, 0.1, 0.6, 0.3, 0.8, 0.5, 0.7, 0.9, 0.15, 0.45, 0.65, 0.35, 0.55, 0.25, 0.75, 0.05, 0.85, 0.95];
  const durations = [1.5, 1.8, 2.1, 1.6, 2.0, 1.7, 1.9, 2.2, 1.4, 2.3, 1.5, 1.8, 2.0, 1.6, 2.1, 1.9, 1.7, 2.2, 1.4, 2.0];
  const sizes = [8, 10, 6, 12, 8, 10, 6, 8, 12, 6, 10, 8, 6, 12, 10, 8, 6, 10, 8, 12];

  for (let i = 0; i < 20; i++) {
    pieces.push({
      left: `${lefts[i]}%`,
      delay: `${delays[i]}s`,
      duration: `${durations[i]}s`,
      color: COLORS[i % COLORS.length],
      size: `${sizes[i]}px`,
    });
  }
  return pieces;
}

export function Felicitations({ type, onDismiss }: FelicitationsProps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const confetti = useMemo(() => generateConfetti(), []);

  // Auto-dismiss after 6 seconds
  useEffect(() => {
    const id = setTimeout(onDismiss, 6000);
    return () => clearTimeout(id);
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(11,16,32,0.7)" }}
        onClick={onDismiss}
      />

      {/* Confetti */}
      <style>{`
        @keyframes vf-confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {confetti.map((piece, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            top: "-20px",
            left: piece.left,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: i % 3 === 0 ? "50%" : "2px",
            animation: `vf-confetti-fall ${piece.duration} ${piece.delay} ease-in forwards`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Message card */}
      <div
        className="relative z-10 rounded-2xl shadow-2xl p-8 text-center max-w-xs mx-4 animate-in zoom-in-95 fade-in-0"
        style={{
          backgroundColor: "#FAFAF7",
          border: "2px solid #1F4BFF",
        }}
      >
        <div className="text-5xl mb-4">{type === "global" ? "👑" : "🎉"}</div>
        <h2
          className="text-2xl font-extrabold mb-2"
          style={{
            color: "#0B1020",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {type === "global" ? "Félicitations!" : "Nouveau Record!"}
        </h2>
        <p
          className="text-sm mb-6"
          style={{ color: "#0B1020", opacity: 0.7 }}
        >
          {type === "global"
            ? "You're the new #1 on the leaderboard!"
            : "You just set a new personal best streak!"}
        </p>
        <Button
          onClick={onDismiss}
          className="w-full font-semibold text-white"
          style={{ backgroundColor: "#1F4BFF" }}
        >
          Keep Going 🔥
        </Button>
      </div>
    </div>
  );
}

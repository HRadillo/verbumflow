// src/app/components/username-setup.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { setUsername as saveUsername, isUsernameTaken } from "@/lib/firestore";

type Props = {
  onComplete: (username: string) => void;
};

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

export function UsernameSetup({ onComplete }: Props) {
  const { user } = useAuth();
  const [value, setValue] = useState("");
  const [checking, setChecking] = useState(false);
  const [taken, setTaken] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isValid = USERNAME_REGEX.test(value);
  const canSubmit = isValid && !taken && !checking && !submitting;

  // Debounced uniqueness check
  useEffect(() => {
    if (!isValid) {
      setTaken(false);
      setChecking(false);
      return;
    }
    setChecking(true);
    const timer = setTimeout(async () => {
      try {
        const result = await isUsernameTaken(value);
        setTaken(result);
      } catch {
        setTaken(false);
      } finally {
        setChecking(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [value, isValid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !canSubmit) return;
    setSubmitting(true);
    try {
      await saveUsername(user.uid, value);
      onComplete(value);
    } catch {
      setSubmitting(false);
    }
  };

  const statusMessage = () => {
    if (!value) return null;
    if (!isValid) return { text: "3–20 chars, letters, numbers, underscores only", color: "#FF6A4D" };
    if (checking) return { text: "Checking…", color: "rgba(11,16,32,0.4)" };
    if (taken) return { text: "Already taken — try another", color: "#FF6A4D" };
    return { text: "Available!", color: "#22C55E" };
  };

  const status = statusMessage();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(11,16,32,0.85)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl shadow-2xl p-8 space-y-5 animate-in fade-in-0 zoom-in-95"
        style={{ backgroundColor: "#FAFAF7", border: "1px solid rgba(31,75,255,0.12)" }}
      >
        <div className="text-center space-y-1">
          <p style={{ fontSize: "2rem", lineHeight: 1 }}>🎮</p>
          <h2
            className="text-2xl font-extrabold"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0B1020" }}
          >
            Choose your handle
          </h2>
          <p
            className="text-sm"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "rgba(11,16,32,0.5)" }}
          >
            This is how rivals will find you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value.trim())}
              placeholder="e.g. horacioR"
              maxLength={20}
              autoFocus
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              className="w-full h-12 px-4 rounded-xl border-2 text-center text-base outline-none transition-colors"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                borderColor: taken ? "#FF6A4D" : isValid && !checking ? "#22C55E" : "rgba(31,75,255,0.2)",
                backgroundColor: "#fff",
                color: "#0B1020",
              }}
            />
            {status && (
              <p
                className="text-xs mt-1.5 text-center"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: status.color }}
              >
                {status.text}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full h-12 rounded-xl text-white font-bold text-base transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#1F4BFF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {submitting ? "Saving…" : "Claim Handle →"}
          </button>
        </form>

        <p
          className="text-xs text-center"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "rgba(11,16,32,0.35)" }}
        >
          Your handle is permanent once set.
        </p>
      </div>
    </div>
  );
}

// src/app/components/conjugation-practice.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  verbData,
  verbs as allVerbs,
  allConjugations,
  getRule,
} from "@/lib/verbs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import {
  recordAnswer,
  getLeaderboard,
  type UserStats,
  type GameMode,
} from "@/lib/firestore";

type Feedback = "correct" | "incorrect" | null;
type PracticeMode = "multiple-choice" | "fill-in-the-blank";
type GameState = "idle" | "playing" | "lost";

type Question = {
  verb: string;
  tense: string;
  pronoun: string;
};

type CurrentQuestion = Question & {
  correctAnswer: string;
  options?: string[];
  rule: string | null;
  tip: string | null;
};

type ConjugationPracticeProps = {
  onNextQuestion: () => void;
  onStatsUpdate?: React.Dispatch<React.SetStateAction<UserStats | null>>;
  onStreakRecord?: (type: "personal" | "global") => void;
  practiceOnly?: boolean;
};

const TIMER_DURATION = 15;

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const allPossibleQuestions: Question[] = [];
for (const verb of allVerbs) {
  for (const tense in verbData[verb]) {
    for (const pronoun in verbData[verb][tense]) {
      const pronounsToPractice = [
        "je",
        "j'",
        "tu",
        "il/elle",
        "nous",
        "vous",
        "ils/elles",
        "que je",
        "que j'",
        "que tu",
        "qu'il/elle",
        "que nous",
        "que vous",
        "qu'ils/elles",
      ];
      if (
        pronounsToPractice.includes(pronoun) ||
        tense === "Impératif Présent"
      ) {
        allPossibleQuestions.push({ verb, tense, pronoun });
      }
    }
  }
}

export function ConjugationPractice({
  onNextQuestion,
  onStatsUpdate,
  onStreakRecord,
  practiceOnly = false,
}: ConjugationPracticeProps) {
  const [gameState, setGameState] = useState<GameState>(
    practiceOnly ? "playing" : "idle"
  );
  const [lastStreakValue, setLastStreakValue] = useState(0);
  const [gameMode, setGameMode] = useState<GameMode>("classic");
  const [competitiveMode, setCompetitiveMode] = useState(true);
  const [practiceQueue, setPracticeQueue] = useState<Question[]>([]);
  const [fillInTheBlankQueue, setFillInTheBlankQueue] = useState<Question[]>([]);
  const [recentRandomPairs, setRecentRandomPairs] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [key, setKey] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mode, setMode] = useState<PracticeMode>("multiple-choice");
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [lastClassicVerb, setLastClassicVerb] = useState<string | null>(null);
  const [pendingModeSwitch, setPendingModeSwitch] = useState<GameMode | null>(null);
  // Level-up state
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [hasShownLevelUp, setHasShownLevelUp] = useState(false);
  // practiceOnly score
  const [practiceScore, setPracticeScore] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prepareNextStageRef = useRef<() => void>(() => {});
  const { user } = useAuth();

  const timerEnabled = !practiceOnly && competitiveMode;

  const getQuestionDetails = useCallback(
    (question: Question, currentMode: PracticeMode): CurrentQuestion | null => {
      const { verb, tense, pronoun } = question;
      const correctAnswer = verbData[verb]?.[tense]?.[pronoun];

      if (!correctAnswer) return null;

      const { rule, tip } = getRule(verb, tense);

      if (currentMode === "multiple-choice") {
        const wrongOptions: string[] = [];
        const allConjugationsForVerb = new Set(
          Object.values(verbData[verb]).flatMap((p) => Object.values(p))
        );

        const potentialWrongOptions = Array.from(allConjugationsForVerb).filter(
          (c) => c !== correctAnswer && c
        );
        const shuffledWrongOptions = shuffleArray(potentialWrongOptions);
        for (const option of shuffledWrongOptions) {
          if (wrongOptions.length >= 3) break;
          if (!wrongOptions.includes(option)) {
            wrongOptions.push(option);
          }
        }

        const remainingSlots = 3 - wrongOptions.length;
        if (remainingSlots > 0) {
          const globalWrongOptions = shuffleArray(
            allConjugations.filter(
              (c) => c !== correctAnswer && !wrongOptions.includes(c)
            )
          ).slice(0, remainingSlots);
          wrongOptions.push(...globalWrongOptions);
        }
        const options = shuffleArray([correctAnswer, ...wrongOptions]);
        return { verb, tense, pronoun, correctAnswer, options, rule, tip };
      } else {
        return { verb, tense, pronoun, correctAnswer, rule, tip };
      }
    },
    []
  );

  const pickRandomQuestion = useCallback((recentPairs: string[]): Question => {
    const available = allPossibleQuestions.filter(
      (q) => !recentPairs.includes(`${q.verb}|${q.pronoun}`)
    );
    const pool = available.length > 0 ? available : allPossibleQuestions;
    return pool[Math.floor(Math.random() * pool.length)];
  }, []);

  const pickClassicQuestion = useCallback(
    (
      queue: Question[],
      avoidVerb: string | null
    ): { question: Question; remainingQueue: Question[] } => {
      const sourceQueue =
        queue.length > 0 ? queue : shuffleArray(allPossibleQuestions);
      const idx =
        avoidVerb !== null
          ? sourceQueue.findIndex((q) => q.verb !== avoidVerb)
          : 0;
      const safeIdx = idx >= 0 ? idx : 0;
      const question = sourceQueue[safeIdx];
      const remainingQueue = [
        ...sourceQueue.slice(0, safeIdx),
        ...sourceQueue.slice(safeIdx + 1),
      ];
      return { question, remainingQueue };
    },
    []
  );

  const prepareNextStage = useCallback(() => {
    setUserAnswer("");
    setFeedback(null);
    setIsAnswered(false);
    setIsTimedOut(false);
    setKey((prev) => prev + 1);
    onNextQuestion();

    // practiceOnly: always multiple-choice, no fill-in drills
    if (practiceOnly) {
      setMode("multiple-choice");
      setFillInTheBlankQueue([]);
      if (gameMode === "random") {
        const trimmed = recentRandomPairs.slice(-4);
        const nextQ = pickRandomQuestion(trimmed);
        const pair = `${nextQ.verb}|${nextQ.pronoun}`;
        setCurrentQuestion(getQuestionDetails(nextQ, "multiple-choice"));
        setRecentRandomPairs([...trimmed, pair]);
      } else {
        const avoidVerb = currentQuestion?.verb ?? lastClassicVerb;
        const { question: nextQ, remainingQueue } = pickClassicQuestion(
          practiceQueue,
          avoidVerb ?? null
        );
        setLastClassicVerb(nextQ.verb);
        setPracticeQueue(remainingQueue);
        setCurrentQuestion(getQuestionDetails(nextQ, "multiple-choice"));
      }
      return;
    }

    // Force fill-in-the-blank after level-up (unless practiceOnly)
    const forceFillIn = hasShownLevelUp && !practiceOnly;

    if (gameMode === "random") {
      if (!forceFillIn && mode === "multiple-choice" && feedback === "correct" && currentQuestion) {
        setMode("fill-in-the-blank");
        const detail = getQuestionDetails(
          {
            verb: currentQuestion.verb,
            tense: currentQuestion.tense,
            pronoun: currentQuestion.pronoun,
          },
          "fill-in-the-blank"
        );
        setCurrentQuestion(detail);
      } else {
        const trimmed = recentRandomPairs.slice(-4);
        const nextQ = pickRandomQuestion(trimmed);
        const pair = `${nextQ.verb}|${nextQ.pronoun}`;
        const nextMode = forceFillIn ? "fill-in-the-blank" : "multiple-choice";
        setMode(nextMode);
        setCurrentQuestion(getQuestionDetails(nextQ, nextMode));
        setRecentRandomPairs([...trimmed, pair]);
      }
      return;
    }

    // ── Classic mode ──
    if (!forceFillIn && mode === "fill-in-the-blank" && fillInTheBlankQueue.length > 0) {
      const nextFillIn = fillInTheBlankQueue[0];
      setCurrentQuestion(getQuestionDetails(nextFillIn, "fill-in-the-blank"));
      setFillInTheBlankQueue((q) => q.slice(1));
      return;
    }

    if (
      !forceFillIn &&
      mode === "multiple-choice" &&
      feedback === "correct" &&
      currentQuestion
    ) {
      const { verb, tense } = currentQuestion;
      const otherPronouns = Object.keys(verbData[verb][tense]).filter(
        (p) => p !== currentQuestion.pronoun
      );

      if (otherPronouns.length > 0) {
        const newFillInQueue = shuffleArray(otherPronouns).map((p) => ({
          verb,
          tense,
          pronoun: p,
        }));
        setMode("fill-in-the-blank");
        setFillInTheBlankQueue(newFillInQueue.slice(1));
        setCurrentQuestion(
          getQuestionDetails(newFillInQueue[0], "fill-in-the-blank")
        );
        return;
      }
    }

    const nextMode = forceFillIn ? "fill-in-the-blank" : "multiple-choice";
    setMode(nextMode);
    setFillInTheBlankQueue([]);
    const avoidVerb = currentQuestion?.verb ?? lastClassicVerb;
    const { question: nextQ, remainingQueue } = pickClassicQuestion(
      practiceQueue,
      avoidVerb ?? null
    );
    setLastClassicVerb(nextQ.verb);
    setPracticeQueue(remainingQueue);
    setCurrentQuestion(getQuestionDetails(nextQ, nextMode));
  }, [
    feedback,
    onNextQuestion,
    getQuestionDetails,
    mode,
    currentQuestion,
    fillInTheBlankQueue,
    gameMode,
    recentRandomPairs,
    pickRandomQuestion,
    pickClassicQuestion,
    lastClassicVerb,
    practiceQueue,
    hasShownLevelUp,
    practiceOnly,
  ]);

  useEffect(() => {
    prepareNextStageRef.current = prepareNextStage;
  }, [prepareNextStage]);

  // Initialize first question — only when actively playing
  useEffect(() => {
    if (currentQuestion !== null || gameState !== "playing") return;
    if (gameMode === "classic") {
      const initialQueue = shuffleArray(allPossibleQuestions);
      const firstQ = initialQueue[0];
      setPracticeQueue(initialQueue.slice(1));
      setLastClassicVerb(firstQ.verb);
      setCurrentQuestion(getQuestionDetails(firstQ, "multiple-choice"));
    } else {
      const firstQ = pickRandomQuestion([]);
      setRecentRandomPairs([`${firstQ.verb}|${firstQ.pronoun}`]);
      setCurrentQuestion(getQuestionDetails(firstQ, "multiple-choice"));
    }
  }, [currentQuestion, gameMode, gameState, getQuestionDetails, pickRandomQuestion]);

  // Timer: reset and run on each new question, pause when answered or not playing
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (!timerEnabled || isAnswered || !currentQuestion || gameState !== "playing" || showLevelUp) return;

    setTimeLeft(TIMER_DURATION);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [key, isAnswered, currentQuestion, gameState, timerEnabled, showLevelUp]);

  // Handle time's up: show feedback + Next button, do NOT set gameState=lost yet
  useEffect(() => {
    if (timeLeft !== 0 || isAnswered || !currentQuestion || !timerEnabled) return;

    setIsAnswered(true);
    setFeedback("incorrect");
    setIsTimedOut(true);
    setLastStreakValue(streak);
    setStreak(0);
    setFillInTheBlankQueue([]);

    if (competitiveMode && user) {
      recordAnswer(user.uid, false, 0, gameMode)
        .then(({ isNewPersonalRecord: _ignored, ...updates }) => {
          if (onStatsUpdate) {
            onStatsUpdate((prev) => {
              if (!prev) return prev;
              return { ...prev, ...updates } as UserStats;
            });
          }
        })
        .catch((err) => console.error("Failed to record timeout:", err));
    }

    if (gameMode === "classic" && currentQuestion) {
      setPracticeQueue((q) => {
        const failed = {
          verb: currentQuestion.verb,
          tense: currentQuestion.tense,
          pronoun: currentQuestion.pronoun,
        };
        const insertIdx = Math.min(
          q.length,
          Math.floor(Math.random() * 5) + 3
        );
        const newQ = [...q];
        newQ.splice(insertIdx, 0, failed);
        return newQ;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // Focus fill-in-blank input
  useEffect(() => {
    if (mode === "fill-in-the-blank" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentQuestion, mode]);

  // Auto-clear mode switch warning after 3s
  useEffect(() => {
    if (!pendingModeSwitch) return;
    const id = setTimeout(() => setPendingModeSwitch(null), 3000);
    return () => clearTimeout(id);
  }, [pendingModeSwitch]);

  const handleStartStreak = () => {
    setCurrentQuestion(null);
    setFeedback(null);
    setIsAnswered(false);
    setIsTimedOut(false);
    setKey((k) => k + 1);
    setCorrectAnswerCount(0);
    setShowLevelUp(false);
    setHasShownLevelUp(false);
    setGameState("playing");
  };

  const handleTryAgain = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setGameState("idle");
    setStreak(0);
    setCurrentQuestion(null);
    setFeedback(null);
    setIsAnswered(false);
    setIsTimedOut(false);
    setFillInTheBlankQueue([]);
    setMode("multiple-choice");
    setCorrectAnswerCount(0);
    setShowLevelUp(false);
    setHasShownLevelUp(false);
  };

  const handleSwitchGameMode = (newMode: GameMode) => {
    if (newMode === gameMode) {
      setPendingModeSwitch(null);
      return;
    }
    // Anti-cheat: require confirmation when switching mid-streak
    if (!practiceOnly && streak > 0 && pendingModeSwitch !== newMode) {
      setPendingModeSwitch(newMode);
      return;
    }
    // Confirmed switch
    setPendingModeSwitch(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setGameMode(newMode);
    setGameState(practiceOnly ? "playing" : "idle");
    setStreak(0);
    setFillInTheBlankQueue([]);
    setPracticeQueue([]);
    setRecentRandomPairs([]);
    setMode("multiple-choice");
    setFeedback(null);
    setIsAnswered(false);
    setIsTimedOut(false);
    setTimeLeft(TIMER_DURATION);
    setCurrentQuestion(null);
    setKey((k) => k + 1);
    setCorrectAnswerCount(0);
    setShowLevelUp(false);
    setHasShownLevelUp(false);
  };

  const handleSwitchCompetitiveMode = (newCompetitive: boolean) => {
    if (newCompetitive === competitiveMode) return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCompetitiveMode(newCompetitive);
    setGameState("idle");
    setStreak(0);
    setFillInTheBlankQueue([]);
    setPracticeQueue([]);
    setRecentRandomPairs([]);
    setMode("multiple-choice");
    setFeedback(null);
    setIsAnswered(false);
    setIsTimedOut(false);
    setTimeLeft(TIMER_DURATION);
    setCurrentQuestion(null);
    setKey((k) => k + 1);
    setCorrectAnswerCount(0);
    setShowLevelUp(false);
    setHasShownLevelUp(false);
  };

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;

    const isCorrect =
      answer.trim().toLowerCase() ===
      currentQuestion?.correctAnswer.toLowerCase();
    setUserAnswer(answer);
    setFeedback(isCorrect ? "correct" : "incorrect");
    setIsAnswered(true);

    const newStreak = isCorrect ? streak + 1 : 0;

    if (practiceOnly) {
      if (isCorrect) setPracticeScore((s) => s + 1);
      // In practiceOnly, no gameState changes on wrong answer — advance via Next
      return;
    }

    if (!isCorrect) {
      setLastStreakValue(streak);
      setStreak(0);
      setGameState("lost");
    } else {
      setStreak(newStreak);
      const newCount = correctAnswerCount + 1;
      setCorrectAnswerCount(newCount);
      if (newCount === 3 && !hasShownLevelUp) {
        // Pause timer and show level-up overlay
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setShowLevelUp(true);
        setHasShownLevelUp(true);
      }
    }

    if (competitiveMode && user) {
      recordAnswer(user.uid, isCorrect, newStreak, gameMode)
        .then((result) => {
          const { isNewPersonalRecord, ...updates } = result;
          if (onStatsUpdate) {
            onStatsUpdate((prev) => {
              if (!prev) return prev;
              return { ...prev, ...updates } as UserStats;
            });
          }
          if (isNewPersonalRecord && onStreakRecord) {
            onStreakRecord("personal");
            const sortField =
              gameMode === "classic"
                ? "classicLongestStreak"
                : "randomLongestStreak";
            getLeaderboard(sortField, 1)
              .then((top1) => {
                const topStreak =
                  gameMode === "classic"
                    ? top1[0]?.classicLongestStreak
                    : top1[0]?.randomLongestStreak;
                if (topStreak !== undefined && newStreak > topStreak) {
                  onStreakRecord?.("global");
                }
              })
              .catch(() => {});
          }
        })
        .catch((err) => console.error("Failed to record answer:", err));
    }

    if (!isCorrect) {
      if (mode === "fill-in-the-blank") {
        setFillInTheBlankQueue([]);
      }
      if (gameMode === "classic" && currentQuestion) {
        setPracticeQueue((currentQueue) => {
          const failedQuestion = {
            verb: currentQuestion.verb,
            tense: currentQuestion.tense,
            pronoun: currentQuestion.pronoun,
          };
          const remainingQueue = currentQueue;
          const insertIndex = Math.min(
            remainingQueue.length,
            Math.floor(Math.random() * 5) + 3
          );
          const newQueue = [...remainingQueue];
          newQueue.splice(insertIndex, 0, failedQuestion);
          return newQueue;
        });
      }
    }
  };

  // Handler for Next button when timed out
  const handleNextAfterTimeout = () => {
    setIsAnswered(false);
    setIsTimedOut(false);
    setFeedback(null);
    setGameState("lost");
  };

  // Handler for Next in practiceOnly wrong answer
  const handlePracticeOnlyNext = () => {
    setFillInTheBlankQueue([]);
    prepareNextStageRef.current();
  };

  // Handler for level-up "I'm ready" button
  const handleLevelUpReady = () => {
    setShowLevelUp(false);
    prepareNextStageRef.current();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer) handleAnswer(userAnswer);
  };

  const getButtonBrandClass = (option: string): string => {
    if (!isAnswered) {
      return "bg-white text-[#0B1020] border border-gray-200 hover:border-[#1F4BFF] hover:text-[#1F4BFF] hover:bg-blue-50";
    }
    const isCorrectAnswer = option === currentQuestion?.correctAnswer;
    const isUserChoice = option === userAnswer;

    if (isCorrectAnswer) {
      return "bg-[#1F4BFF] text-white border-[#1F4BFF] hover:bg-[#1637CC] disabled:opacity-100";
    }
    if (isUserChoice && !isCorrectAnswer) {
      return "bg-[#FF6A4D] text-white border-[#FF6A4D] hover:bg-[#D95A3F] disabled:opacity-100";
    }
    return "bg-white text-[#0B1020] border border-gray-200 opacity-50";
  };

  const getInputClass = () => {
    if (!isAnswered)
      return "bg-[#FAFAF7] border-gray-200 focus-visible:ring-[#1F4BFF] focus-visible:border-[#0B1020]";
    if (feedback === "correct")
      return "bg-green-100 border-green-500 focus-visible:ring-green-500";
    if (feedback === "incorrect")
      return "bg-red-100 border-red-500 focus-visible:ring-red-500";
    return "bg-[#FAFAF7]";
  };

  const displayPronoun =
    currentQuestion?.tense === "Impératif Présent"
      ? `(${currentQuestion.pronoun})`
      : currentQuestion?.pronoun;

  // Determine which input mode to show (force multiple-choice in practiceOnly)
  const displayMode: PracticeMode = practiceOnly ? "multiple-choice" : mode;

  return (
    <div className="space-y-3">
      {/* Streak display — hidden in practiceOnly */}
      {!practiceOnly && (
        <div className="flex justify-center items-center gap-2 text-white font-bold text-xl drop-shadow-md">
          <Flame
            className={cn(
              "transition-colors",
              streak > 0 ? "text-[#FF6A4D]" : "text-white/50"
            )}
          />
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{streak}</span>
        </div>
      )}

      {/* practiceOnly score counter */}
      {practiceOnly && (
        <div
          className="text-center text-sm text-white/60"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {practiceScore} correct this session
        </div>
      )}

      {/* Game mode selector */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => handleSwitchGameMode("classic")}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all",
            gameMode === "classic"
              ? "bg-[#1F4BFF] border-[#1F4BFF] text-white"
              : "bg-transparent border-[#1F4BFF] text-[#1F4BFF] hover:bg-[#1F4BFF]/10"
          )}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          🎮 Classic
        </button>
        <button
          onClick={() => handleSwitchGameMode("random")}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all",
            gameMode === "random"
              ? "bg-[#1F4BFF] border-[#1F4BFF] text-white"
              : "bg-transparent border-[#1F4BFF] text-[#1F4BFF] hover:bg-[#1F4BFF]/10"
          )}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          🎲 Random
        </button>
      </div>

      {/* Competitive / Casual toggle — hidden in practiceOnly */}
      {!practiceOnly && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => handleSwitchCompetitiveMode(true)}
            className={cn(
              "text-xs transition-colors",
              competitiveMode ? "text-white font-semibold" : "text-white/40 hover:text-white/70"
            )}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            ⚡ Competitive
          </button>
          <button
            onClick={() => handleSwitchCompetitiveMode(!competitiveMode)}
            className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
            style={{ backgroundColor: competitiveMode ? "#1F4BFF" : "rgba(255,255,255,0.2)" }}
            aria-label="Toggle competitive mode"
          >
            <span
              className={cn(
                "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
                competitiveMode ? "translate-x-4" : "translate-x-1"
              )}
            />
          </button>
          <button
            onClick={() => handleSwitchCompetitiveMode(false)}
            className={cn(
              "text-xs transition-colors",
              !competitiveMode ? "text-white font-semibold" : "text-white/40 hover:text-white/70"
            )}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Casual
          </button>
        </div>
      )}

      {/* Anti-cheat mode-switch warning */}
      {pendingModeSwitch && (
        <p
          className="text-center text-xs font-medium"
          style={{ color: "#FF6A4D", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          ⚠️ Switching resets your streak. Click again to confirm.
        </p>
      )}

      {/* START OVERLAY — hidden in practiceOnly */}
      {!practiceOnly && gameState === "idle" && (
        <div
          className="rounded-2xl shadow-xl p-8 text-center space-y-4 animate-in fade-in-0 zoom-in-95"
          style={{
            backgroundColor: "#FAFAF7",
            border: "1px solid rgba(31,75,255,0.12)",
          }}
        >
          <div style={{ fontSize: "48px", lineHeight: 1 }}>
            <Flame
              className="inline-block"
              style={{ color: "#FF6A4D", width: 48, height: 48 }}
            />
          </div>
          <h2
            className="text-2xl"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              color: "#0B1020",
            }}
          >
            Ready to streak?
          </h2>
          <p
            className="text-sm"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: "rgba(11,16,32,0.5)",
            }}
          >
            {competitiveMode
              ? "Answer fast. Answer right. Don’t stop."
              : "Relax and practice. No timer, no pressure."}
          </p>
          <button
            onClick={handleStartStreak}
            className="w-full h-14 rounded-xl text-white font-bold text-base transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              backgroundColor: "#1F4BFF",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
            }}
          >
            Start Streak →
          </button>
        </div>
      )}

      {/* LOSS OVERLAY — hidden in practiceOnly */}
      {!practiceOnly && gameState === "lost" && (
        <div
          className="rounded-2xl shadow-xl p-8 text-center space-y-4 animate-in fade-in-0 zoom-in-95"
          style={{
            backgroundColor: "#FAFAF7",
            border: "1px solid rgba(31,75,255,0.12)",
          }}
        >
          <div style={{ fontSize: "48px", lineHeight: 1 }}>💥</div>
          <h2
            className="text-2xl"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              color: "#0B1020",
            }}
          >
            Streak broken.
          </h2>
          <p
            className="text-sm"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: "rgba(11,16,32,0.5)",
            }}
          >
            {lastStreakValue > 0
              ? `${lastStreakValue} in a row — not bad.`
              : "You'll get it next time."}
          </p>
          <button
            onClick={handleTryAgain}
            className="w-full h-14 rounded-xl text-white font-bold text-base transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              backgroundColor: "#FF6A4D",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
            }}
          >
            Try Again →
          </button>
        </div>
      )}

      {/* GAME CARD */}
      {(practiceOnly || gameState === "playing") && (
        currentQuestion ? (
          <Card
            key={key}
            className={cn(
              "relative overflow-hidden transition-all duration-300 animate-in fade-in-0 zoom-in-95 shadow-xl",
              feedback === "incorrect" && !isTimedOut && "animate-shake"
            )}
            style={{
              backgroundColor: "#FAFAF7",
              border: "1px solid rgba(31,75,255,0.12)",
            }}
          >
            {/* Level-up overlay — scoped within card */}
            {showLevelUp && (
              <div
                className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-2xl p-8 text-center gap-4"
                style={{ backgroundColor: "#FAFAF7" }}
              >
                <div style={{ color: "#FF6A4D", fontSize: "2.5rem", lineHeight: 1 }}>⬆️</div>
                <h3
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800,
                    color: "#0B1020",
                    fontSize: "1.5rem",
                  }}
                >
                  Level Up
                </h3>
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 400,
                    color: "rgba(11,16,32,0.5)",
                    fontSize: "0.875rem",
                  }}
                >
                  From now on — write it out.
                </p>
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 400,
                    color: "rgba(11,16,32,0.4)",
                    fontSize: "0.75rem",
                    fontStyle: "italic",
                  }}
                >
                  No more options. Just memory.
                </p>
                <button
                  onClick={handleLevelUpReady}
                  className="w-full h-12 rounded-xl text-white font-bold text-base transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{
                    backgroundColor: "#1F4BFF",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  I&apos;m ready →
                </button>
              </div>
            )}

            <CardHeader>
              <CardTitle
                className="text-3xl sm:text-4xl text-center font-extrabold"
                style={{
                  color: "#0B1020",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {currentQuestion.verb}
              </CardTitle>
              <CardDescription className="text-center">
                <Badge
                  variant="secondary"
                  className="text-xs font-semibold"
                  style={{
                    backgroundColor: "rgba(31,75,255,0.08)",
                    color: "#1F4BFF",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {currentQuestion.tense}
                </Badge>
                <Badge
                  variant="secondary"
                  className="ml-2 text-xs font-semibold"
                  style={{
                    backgroundColor: "rgba(31,75,255,0.08)",
                    color: "#1F4BFF",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {displayPronoun}
                </Badge>
              </CardDescription>

              {/* Timer bar — only in competitive mode */}
              {timerEnabled && (
                <div className="mt-2 h-1 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    style={{
                      width: `${(timeLeft / TIMER_DURATION) * 100}%`,
                      backgroundColor: timeLeft <= 4 ? "#FF6A4D" : "#1F4BFF",
                      height: "100%",
                      transition: "width 1s linear, background-color 0.5s ease",
                    }}
                  />
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              {/* Time's up message */}
              {isTimedOut && (
                <div
                  className="text-center font-bold text-sm py-1"
                  style={{
                    color: "#FF6A4D",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  ⏱ Time&apos;s up!
                </div>
              )}

              {displayMode === "multiple-choice" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQuestion.options?.map((option) => (
                    <div key={option}>
                      <Button
                        type="button"
                        onClick={() => handleAnswer(option)}
                        disabled={isAnswered}
                        className={cn(
                          "h-auto py-4 text-base sm:text-lg justify-center w-full text-center whitespace-normal shadow-sm",
                          getButtonBrandClass(option)
                        )}
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {option}
                      </Button>
                      {isAnswered && !isTimedOut &&
                        option === currentQuestion.correctAnswer &&
                        currentQuestion.rule && (
                          <div
                            className="text-xs text-muted-foreground mt-2 px-1 text-center sm:text-left"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          >
                            <p className="font-semibold">Rule:</p>
                            <p>{currentQuestion.rule}</p>
                          </div>
                        )}
                      {feedback === "incorrect" && !isTimedOut &&
                        option === userAnswer &&
                        currentQuestion.tip && (
                          <div
                            className="text-xs text-red-600 mt-2 px-1 text-center sm:text-left"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          >
                            <p className="font-semibold">Tip:</p>
                            <p>{currentQuestion.tip}</p>
                          </div>
                        )}
                    </div>
                  ))}
                  {/* Rule and tip on timeout (shown below options) */}
                  {isTimedOut && currentQuestion.rule && (
                    <div
                      className="col-span-full text-xs text-muted-foreground mt-1 px-1 text-center"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      <p className="font-semibold">Rule:</p>
                      <p>{currentQuestion.rule}</p>
                    </div>
                  )}
                  {isTimedOut && currentQuestion.tip && (
                    <div
                      className="col-span-full text-xs text-red-600 mt-1 px-1 text-center"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      <p className="font-semibold">Tip:</p>
                      <p>{currentQuestion.tip}</p>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={isAnswered}
                    placeholder="Type the conjugation..."
                    className={cn("text-center text-lg h-14", getInputClass())}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                  {isAnswered && (
                    <div
                      className="text-xs text-muted-foreground mt-2 px-1 text-center"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      <p className="font-semibold">Rule:</p>
                      <p>{currentQuestion.rule}</p>
                    </div>
                  )}
                  {feedback === "incorrect" && (
                    <div
                      className="text-xs text-red-600 mt-2 px-1 text-center"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      <p className="font-semibold">Tip:</p>
                      <p>{currentQuestion.tip}</p>
                    </div>
                  )}
                  {!isAnswered && (
                    <Button
                      type="submit"
                      className="w-full bg-[#1F4BFF] hover:bg-[#1637CC] text-white"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Check
                    </Button>
                  )}
                </form>
              )}

              {isAnswered && feedback === "incorrect" && !isTimedOut && (
                <div
                  className="text-sm text-muted-foreground pt-2 text-center"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Correct answer:{" "}
                  <span className="font-bold text-green-600">
                    {currentQuestion.correctAnswer}
                  </span>
                </div>
              )}
              {isTimedOut && (
                <div
                  className="text-sm text-muted-foreground pt-2 text-center"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Correct answer:{" "}
                  <span className="font-bold text-green-600">
                    {currentQuestion.correctAnswer}
                  </span>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
              {/* Next after timeout */}
              {isTimedOut && (
                <Button
                  onClick={handleNextAfterTimeout}
                  className="gap-2 animate-in fade-in-50 bg-[#FF6A4D] hover:bg-[#D95A3F] text-white"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              {/* Next after correct answer */}
              {isAnswered && !isTimedOut && feedback === "correct" && !showLevelUp && (
                <Button
                  onClick={prepareNextStage}
                  className="gap-2 animate-in fade-in-50 bg-[#1F4BFF] hover:bg-[#1637CC] text-white"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              {/* Next in practiceOnly wrong answer */}
              {practiceOnly && isAnswered && feedback === "incorrect" && (
                <Button
                  onClick={handlePracticeOnlyNext}
                  className="gap-2 animate-in fade-in-50 bg-[#FF6A4D] hover:bg-[#D95A3F] text-white"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <Card
            className="flex flex-col items-center justify-center p-12 text-center shadow-xl"
            style={{
              backgroundColor: "#FAFAF7",
              border: "1px solid rgba(31,75,255,0.12)",
            }}
          >
            <div className="h-16 w-16 border-4 border-dashed rounded-full animate-spin border-[#1F4BFF]"></div>
            <CardTitle
              className="mt-4"
              style={{ color: "#0B1020", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Loading Verbs...
            </CardTitle>
          </Card>
        )
      )}
    </div>
  );
}

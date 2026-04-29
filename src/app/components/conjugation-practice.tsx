// src/app/components/conjugation-practice.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
import { ArrowRight, Flame, Star, Zap } from "lucide-react";
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

type SessionStats = {
  streakJustAchieved: number;
  personalBest: number;
  totalAnsweredThisSession: number;
  avgAnswerTimeSeconds: number | null;
};

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

type DuelMode = {
  duelId: string;
  verbSeed: number;
  onComplete: (score: number) => void;
};

type ConjugationPracticeProps = {
  onNextQuestion: () => void;
  onStatsUpdate?: React.Dispatch<React.SetStateAction<UserStats | null>>;
  onStreakRecord?: (type: "personal" | "global") => void;
  practiceOnly?: boolean;
  userStats?: UserStats | null;
  showHomeInterrupt?: boolean;
  onHomeInterruptDismiss?: () => void;
  onGoHome?: () => void;
  onGameStateChange?: (state: GameState) => void;
  duelMode?: DuelMode;
};

const TIMER_DURATION = 15;
const ALL_TENSES_OPTION = "Any";

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

// Candidate keys per Classic cycle position (primary first, elision fallback for position 0)
const CLASSIC_PRONOUN_CANDIDATE_KEYS: string[][] = [
  ["je", "j'"],
  ["tu"],
  ["il/elle"],
  ["nous"],
  ["vous"],
  ["ils/elles"],
];

const CLASSIC_DISPLAY_LABELS = [
  "je",
  "tu",
  "il/elle/on",
  "nous",
  "vous",
  "ils/elles",
] as const;

function getClassicPronounKey(
  verb: string,
  tense: string,
  cycleIndex: number
): string | null {
  const candidates = CLASSIC_PRONOUN_CANDIDATE_KEYS[cycleIndex];
  if (!candidates) return null;
  for (const key of candidates) {
    if (verbData[verb]?.[tense]?.[key] !== undefined) return key;
  }
  return null;
}

// Pre-filtered verb+tense pairs that have all 6 standard pronouns
const classicVerbTensePairs: { verb: string; tense: string }[] = [];
for (const verb of Object.keys(verbData)) {
  for (const tense in verbData[verb]) {
    const pKeys = Object.keys(verbData[verb][tense]);
    if (
      (pKeys.includes("je") || pKeys.includes("j'")) &&
      pKeys.includes("tu") &&
      pKeys.includes("il/elle") &&
      pKeys.includes("nous") &&
      pKeys.includes("vous") &&
      pKeys.includes("ils/elles")
    ) {
      classicVerbTensePairs.push({ verb, tense });
    }
  }
}

// Streak 0–9:   80% chance from first 50 verbs, 20% from rest
// Streak 10–19: 60% chance from first 50, 40% from rest
// Streak 20+:   fully random across all verbs
function pickWeightedVerb(currentStreak: number, avoidVerb: string | null): string {
  const commonPool = allVerbs.slice(0, 50);
  const useCommon =
    currentStreak >= 20
      ? false
      : Math.random() < (currentStreak >= 10 ? 0.6 : 0.8);

  let pool = useCommon ? commonPool : allVerbs;

  if (avoidVerb !== null) {
    const filtered = pool.filter((v) => v !== avoidVerb);
    if (filtered.length > 0) pool = filtered;
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

export function ConjugationPractice({
  onNextQuestion,
  onStatsUpdate,
  onStreakRecord,
  practiceOnly = false,
  userStats = null,
  showHomeInterrupt = false,
  onHomeInterruptDismiss,
  onGoHome,
  onGameStateChange,
  duelMode,
}: ConjugationPracticeProps) {
  const [gameState, setGameState] = useState<GameState>(
    practiceOnly || duelMode ? "playing" : "idle"
  );
  const [lastStreakValue, setLastStreakValue] = useState(0);
  const [gameMode, setGameMode] = useState<GameMode>("classic");
  const [competitiveMode, setCompetitiveMode] = useState(true);
  const [selectedTenses, setSelectedTenses] = useState<string[]>([ALL_TENSES_OPTION]);
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
  const [currentQuestionIsTyping, setCurrentQuestionIsTyping] = useState(false);
  // practiceOnly score
  const [practiceScore, setPracticeScore] = useState(0);
  // last correct answer — shown in loss overlay
  const [lastCorrectAnswer, setLastCorrectAnswer] = useState<string | null>(null);
  const [lossRuleHint, setLossRuleHint] = useState<string | null>(null);
  const [lossVerb, setLossVerb] = useState<string | null>(null);
  const [lossTense, setLossTense] = useState<string | null>(null);
  const [lossSessionStats, setLossSessionStats] = useState<SessionStats | null>(null);
  const [classicCycleIndex, setClassicCycleIndex] = useState(0);
  const [classicVerbTenseQueue, setClassicVerbTenseQueue] = useState<
    { verb: string; tense: string }[]
  >([]);

  // Duel mode state
  const [duelScore, setDuelScore] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prepareNextStageRef = useRef<() => void>(() => {});
  const hasShownRecordOverlayClassic = useRef(false);
  const hasShownRecordOverlayRandom = useRef(false);
  const totalAnsweredThisSessionRef = useRef(0);
  const questionStartTimeRef = useRef<number | null>(null);
  const answerTimeSumRef = useRef(0);
  const answerTimeCountRef = useRef(0);
  const classicLocalBestRef = useRef(0);
  const randomLocalBestRef = useRef(0);
  const { user } = useAuth();

  const timerEnabled = !practiceOnly && !duelMode && competitiveMode;
  const availableTenses = useMemo(
    () => Array.from(new Set(allPossibleQuestions.map((q) => q.tense))),
    []
  );
  const activeTenses = useMemo(() => {
    if (selectedTenses.includes(ALL_TENSES_OPTION)) return availableTenses;
    return selectedTenses.length > 0 ? selectedTenses : availableTenses;
  }, [availableTenses, selectedTenses]);
  const filteredQuestions = useMemo(
    () => allPossibleQuestions.filter((q) => activeTenses.includes(q.tense)),
    [activeTenses]
  );
  const filteredClassicVerbTensePairs = useMemo(
    () => classicVerbTensePairs.filter((p) => activeTenses.includes(p.tense)),
    [activeTenses]
  );

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

  const pickRandomQuestion = useCallback(
    (recentPairs: string[], currentStreak: number): Question => {
      for (let attempt = 0; attempt < 10; attempt++) {
        const verb = pickWeightedVerb(currentStreak, null);
        const verbQuestions = filteredQuestions.filter(
          (q) => q.verb === verb && !recentPairs.includes(`${q.verb}|${q.pronoun}`)
        );
        if (verbQuestions.length > 0) {
          return verbQuestions[Math.floor(Math.random() * verbQuestions.length)];
        }
      }
      // Fallback: ignore weighting, just avoid recent pairs
      const available = filteredQuestions.filter(
        (q) => !recentPairs.includes(`${q.verb}|${q.pronoun}`)
      );
      const pool = available.length > 0 ? available : filteredQuestions;
      return pool[Math.floor(Math.random() * pool.length)];
    },
    [filteredQuestions]
  );

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

  const pickClassicVerbTensePair = useCallback(
    (
      queue: { verb: string; tense: string }[],
      avoidVerb: string | null,
      currentStreak: number
    ): {
      pair: { verb: string; tense: string };
      remainingQueue: { verb: string; tense: string }[];
    } => {
      for (let attempt = 0; attempt < 10; attempt++) {
        const verb = pickWeightedVerb(currentStreak, avoidVerb);
        const verbPairs = filteredClassicVerbTensePairs.filter((p) => p.verb === verb);
        if (verbPairs.length > 0) {
          const pair = verbPairs[Math.floor(Math.random() * verbPairs.length)];
          return { pair, remainingQueue: queue };
        }
      }
      // Fallback: queue-based selection
      const sourceQueue =
        queue.length > 0 ? queue : shuffleArray(filteredClassicVerbTensePairs);
      const idx =
        avoidVerb !== null
          ? sourceQueue.findIndex((p) => p.verb !== avoidVerb)
          : 0;
      const safeIdx = idx >= 0 ? idx : 0;
      const pair = sourceQueue[safeIdx];
      const remainingQueue = [
        ...sourceQueue.slice(0, safeIdx),
        ...sourceQueue.slice(safeIdx + 1),
      ];
      return { pair, remainingQueue };
    },
    [filteredClassicVerbTensePairs]
  );

  const prepareNextStage = useCallback(() => {
    // Reset answer state BEFORE generating the next question so the
    // new question always renders with cleared highlights in the same batch.
    setUserAnswer("");
    setFeedback(null);
    setIsAnswered(false);
    setIsTimedOut(false);
    onNextQuestion();

    // Duel mode: continue deterministic stream until first mistake
    if (duelMode) {
      const nextQ = pickRandomQuestion([], streak);
      setCurrentQuestion(getQuestionDetails(nextQ, "multiple-choice"));
      setKey((prev) => prev + 1);
      return;
    }

    // practiceOnly: always multiple-choice, no fill-in drills
    if (practiceOnly) {
      setMode("multiple-choice");
      setFillInTheBlankQueue([]);
      if (gameMode === "random") {
        const trimmed = recentRandomPairs.slice(-4);
        const nextQ = pickRandomQuestion(trimmed, streak);
        const pair = `${nextQ.verb}|${nextQ.pronoun}`;
        setCurrentQuestion(getQuestionDetails(nextQ, "multiple-choice"));
        setRecentRandomPairs([...trimmed, pair]);
        setKey((prev) => prev + 1);
      } else {
        // Classic cycle
        const nextIdx = classicCycleIndex + 1;
        if (nextIdx < 6 && currentQuestion) {
          const pronounKey = getClassicPronounKey(
            currentQuestion.verb,
            currentQuestion.tense,
            nextIdx
          );
          if (pronounKey) {
            setClassicCycleIndex(nextIdx);
            setCurrentQuestion(
              getQuestionDetails(
                {
                  verb: currentQuestion.verb,
                  tense: currentQuestion.tense,
                  pronoun: pronounKey,
                },
                "multiple-choice"
              )
            );
            setKey((prev) => prev + 1);
            return;
          }
        }
        // Cycle complete — pick new verb+tense
        setClassicCycleIndex(0);
        const avoidVerb = currentQuestion?.verb ?? lastClassicVerb;
        const { pair: nextPair, remainingQueue } = pickClassicVerbTensePair(
          classicVerbTenseQueue,
          avoidVerb ?? null,
          streak
        );
        setLastClassicVerb(nextPair.verb);
        setClassicVerbTenseQueue(remainingQueue);
        const firstKey = getClassicPronounKey(nextPair.verb, nextPair.tense, 0);
        if (firstKey) {
          setCurrentQuestion(
            getQuestionDetails(
              { verb: nextPair.verb, tense: nextPair.tense, pronoun: firstKey },
              "multiple-choice"
            )
          );
          setKey((prev) => prev + 1);
        }
      }
      return;
    }

    // After level-up: competitive → random MC/fill-in per question; casual → permanently fill-in
    const isPostLevelUp = hasShownLevelUp && !practiceOnly;
    const useRandomMode = isPostLevelUp && competitiveMode;
    const forceFillIn = isPostLevelUp && !competitiveMode;

    let nextTyping = false;
    if (useRandomMode) {
      nextTyping = Math.random() < 0.5;
      setCurrentQuestionIsTyping(nextTyping);
    }

    if (gameMode === "random") {
      if (!forceFillIn && !useRandomMode && mode === "multiple-choice" && feedback === "correct" && currentQuestion) {
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
        setKey((prev) => prev + 1);
      } else {
        const trimmed = recentRandomPairs.slice(-4);
        const nextQ = pickRandomQuestion(trimmed, streak);
        const pair = `${nextQ.verb}|${nextQ.pronoun}`;
        const nextMode: PracticeMode = forceFillIn || nextTyping ? "fill-in-the-blank" : "multiple-choice";
        setMode(nextMode);
        setCurrentQuestion(getQuestionDetails(nextQ, nextMode));
        setRecentRandomPairs([...trimmed, pair]);
        setKey((prev) => prev + 1);
      }
      return;
    }

    // ── Classic mode ──
    const nextMode: PracticeMode = forceFillIn || nextTyping ? "fill-in-the-blank" : "multiple-choice";
    setFillInTheBlankQueue([]);

    const nextIdx = classicCycleIndex + 1;
    if (nextIdx < 6 && currentQuestion) {
      const pronounKey = getClassicPronounKey(
        currentQuestion.verb,
        currentQuestion.tense,
        nextIdx
      );
      if (pronounKey) {
        setClassicCycleIndex(nextIdx);
        setMode(nextMode);
        setCurrentQuestion(
          getQuestionDetails(
            {
              verb: currentQuestion.verb,
              tense: currentQuestion.tense,
              pronoun: pronounKey,
            },
            nextMode
          )
        );
        setKey((prev) => prev + 1);
        return;
      }
    }

    // Cycle complete — pick new verb+tense
    setClassicCycleIndex(0);
    setMode(nextMode);
    const avoidVerb = currentQuestion?.verb ?? lastClassicVerb;
    const { pair: nextPair, remainingQueue } = pickClassicVerbTensePair(
      classicVerbTenseQueue,
      avoidVerb ?? null,
      streak
    );
    setLastClassicVerb(nextPair.verb);
    setClassicVerbTenseQueue(remainingQueue);
    const firstKey = getClassicPronounKey(nextPair.verb, nextPair.tense, 0);
    if (firstKey) {
      setCurrentQuestion(
        getQuestionDetails(
          { verb: nextPair.verb, tense: nextPair.tense, pronoun: firstKey },
          nextMode
        )
      );
      setKey((prev) => prev + 1);
    }
  }, [
    feedback,
    onNextQuestion,
    getQuestionDetails,
    mode,
    currentQuestion,
    gameMode,
    recentRandomPairs,
    pickRandomQuestion,
    lastClassicVerb,
    hasShownLevelUp,
    practiceOnly,
    classicCycleIndex,
    classicVerbTenseQueue,
    pickClassicVerbTensePair,
    competitiveMode,
    streak,
    duelMode,
    duelScore,
  ]);

  useEffect(() => {
    prepareNextStageRef.current = prepareNextStage;
  }, [prepareNextStage]);

  // Initialize first question — only when actively playing
  useEffect(() => {
    if (currentQuestion !== null || gameState !== "playing") return;

    // Duel mode: start deterministic question stream
    if (duelMode) {
      const firstQ = pickRandomQuestion([], 0);
      setCurrentQuestion(getQuestionDetails(firstQ, "multiple-choice"));
      return;
    }

    if (gameMode === "classic") {
      if (filteredClassicVerbTensePairs.length === 0) {
        const firstQ = pickRandomQuestion([], 0);
        setGameMode("random");
        setRecentRandomPairs([`${firstQ.verb}|${firstQ.pronoun}`]);
        setCurrentQuestion(getQuestionDetails(firstQ, "multiple-choice"));
        return;
      }
      const verb = pickWeightedVerb(0, null);
      const verbPairs = filteredClassicVerbTensePairs.filter((p) => p.verb === verb);
      const firstPair =
        verbPairs.length > 0
          ? verbPairs[Math.floor(Math.random() * verbPairs.length)]
          : filteredClassicVerbTensePairs[0];
      const firstPronounKey = getClassicPronounKey(firstPair.verb, firstPair.tense, 0);
      setClassicVerbTenseQueue([]);
      setLastClassicVerb(firstPair.verb);
      setClassicCycleIndex(0);
      if (firstPronounKey) {
        setCurrentQuestion(
          getQuestionDetails(
            { verb: firstPair.verb, tense: firstPair.tense, pronoun: firstPronounKey },
            "multiple-choice"
          )
        );
      }
    } else {
      const firstQ = pickRandomQuestion([], 0);
      setRecentRandomPairs([`${firstQ.verb}|${firstQ.pronoun}`]);
      setCurrentQuestion(getQuestionDetails(firstQ, "multiple-choice"));
    }
  }, [currentQuestion, gameMode, gameState, getQuestionDetails, pickRandomQuestion, duelMode, filteredClassicVerbTensePairs]);

  useEffect(() => {
    if (filteredQuestions.length === 0) return;
    if (gameState === "playing") {
      setCurrentQuestion(null);
      setRecentRandomPairs([]);
      setClassicVerbTenseQueue([]);
      setClassicCycleIndex(0);
      setFeedback(null);
      setIsAnswered(false);
      setUserAnswer("");
      setKey((k) => k + 1);
    }
  }, [filteredQuestions.length, gameState]);

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

    // Count the timeout as an answered question
    totalAnsweredThisSessionRef.current += 1;
    questionStartTimeRef.current = null;

    setIsAnswered(true);
    setFeedback("incorrect");
    setIsTimedOut(true);
    setUserAnswer("");
    setLastCorrectAnswer(currentQuestion.correctAnswer);
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // Track question start time for avg answer time (competitive mode only)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!competitiveMode || gameState !== "playing" || !currentQuestion) return;
    questionStartTimeRef.current = Date.now();
  }, [key]); // intentional: only reset on new question (key change)

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

  const buildLossSessionStats = (streakJustAchieved: number): SessionStats => {
    let personalBest: number;
    if (user) {
      const currentBest =
        gameMode === "classic"
          ? (userStats?.classicLongestStreak ?? 0)
          : (userStats?.randomLongestStreak ?? 0);
      personalBest = Math.max(currentBest, streakJustAchieved);
    } else {
      const localBestRef =
        gameMode === "classic" ? classicLocalBestRef : randomLocalBestRef;
      if (streakJustAchieved > localBestRef.current) {
        localBestRef.current = streakJustAchieved;
      }
      personalBest = localBestRef.current;
    }
    const avg =
      competitiveMode && answerTimeCountRef.current > 0
        ? Math.round(
            (answerTimeSumRef.current / answerTimeCountRef.current) * 10
          ) / 10
        : null;
    return {
      streakJustAchieved,
      personalBest,
      totalAnsweredThisSession: totalAnsweredThisSessionRef.current,
      avgAnswerTimeSeconds: avg,
    };
  };

  const handleStartStreak = () => {
    setCurrentQuestion(null);
    setFeedback(null);
    setIsAnswered(false);
    setIsTimedOut(false);
    setKey((k) => k + 1);
    setCorrectAnswerCount(0);
    setShowLevelUp(false);
    setHasShownLevelUp(false);
    setCurrentQuestionIsTyping(false);
    setClassicCycleIndex(0);
    setClassicVerbTenseQueue([]);
    setGameState("playing");
  };

  const handleTryAgain = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    hasShownRecordOverlayClassic.current = false;
    hasShownRecordOverlayRandom.current = false;
    totalAnsweredThisSessionRef.current = 0;
    questionStartTimeRef.current = null;
    answerTimeSumRef.current = 0;
    answerTimeCountRef.current = 0;
    setGameState("idle");
    setStreak(0);
    setCurrentQuestion(null);
    setFeedback(null);
    setIsAnswered(false);
    setIsTimedOut(false);
    setUserAnswer("");
    setFillInTheBlankQueue([]);
    setMode("multiple-choice");
    setCorrectAnswerCount(0);
    setShowLevelUp(false);
    setHasShownLevelUp(false);
    setCurrentQuestionIsTyping(false);
    setLastCorrectAnswer(null);
    setLossRuleHint(null);
    setLossVerb(null);
    setLossTense(null);
    setLossSessionStats(null);
    setClassicCycleIndex(0);
    setClassicVerbTenseQueue([]);
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
    hasShownRecordOverlayClassic.current = false;
    hasShownRecordOverlayRandom.current = false;
    totalAnsweredThisSessionRef.current = 0;
    questionStartTimeRef.current = null;
    answerTimeSumRef.current = 0;
    answerTimeCountRef.current = 0;
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
    setUserAnswer("");
    setTimeLeft(TIMER_DURATION);
    setCurrentQuestion(null);
    setKey((k) => k + 1);
    setCorrectAnswerCount(0);
    setShowLevelUp(false);
    setHasShownLevelUp(false);
    setCurrentQuestionIsTyping(false);
    setLossSessionStats(null);
    setClassicCycleIndex(0);
    setClassicVerbTenseQueue([]);
  };

  const handleSwitchCompetitiveMode = (newCompetitive: boolean) => {
    if (newCompetitive === competitiveMode) return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    hasShownRecordOverlayClassic.current = false;
    hasShownRecordOverlayRandom.current = false;
    totalAnsweredThisSessionRef.current = 0;
    questionStartTimeRef.current = null;
    answerTimeSumRef.current = 0;
    answerTimeCountRef.current = 0;
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
    setUserAnswer("");
    setTimeLeft(TIMER_DURATION);
    setCurrentQuestion(null);
    setKey((k) => k + 1);
    setCorrectAnswerCount(0);
    setShowLevelUp(false);
    setHasShownLevelUp(false);
    setCurrentQuestionIsTyping(false);
    setLossSessionStats(null);
    setClassicCycleIndex(0);
    setClassicVerbTenseQueue([]);
  };

  const toggleTense = (tense: string) => {
    setSelectedTenses((prev) => {
      if (tense === ALL_TENSES_OPTION) return [ALL_TENSES_OPTION];
      const withoutAny = prev.filter((t) => t !== ALL_TENSES_OPTION);
      if (withoutAny.includes(tense)) {
        const next = withoutAny.filter((t) => t !== tense);
        return next.length > 0 ? next : [ALL_TENSES_OPTION];
      }
      return [...withoutAny, tense];
    });
  };

  // Report game state changes to parent
  useEffect(() => {
    onGameStateChange?.(gameState);
  }, [gameState, onGameStateChange]);

  const handleGoHome = () => {
    handleTryAgain();
    onGoHome?.();
  };

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;

    // Track answer time (competitive mode only)
    if (competitiveMode && questionStartTimeRef.current !== null) {
      const elapsed = (Date.now() - questionStartTimeRef.current) / 1000;
      answerTimeSumRef.current += elapsed;
      answerTimeCountRef.current += 1;
      questionStartTimeRef.current = null;
    }
    // Count every answered question
    totalAnsweredThisSessionRef.current += 1;

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

    if (duelMode) {
      if (isCorrect) setDuelScore((s) => s + 1);
      if (!isCorrect) {
        duelMode.onComplete(duelScore);
      }
      return;
    }

    if (!isCorrect) {
      setLastStreakValue(streak);
      setStreak(0);
      setLastCorrectAnswer(currentQuestion?.correctAnswer ?? null);
      const { rule, tip } = getRule(currentQuestion?.verb ?? "", currentQuestion?.tense ?? "");
      setLossRuleHint(rule || tip || null);
      setLossVerb(currentQuestion?.verb ?? null);
      setLossTense(currentQuestion?.tense ?? null);
      setLossSessionStats(buildLossSessionStats(streak));
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

    // Per-mode record overlay — fires synchronously, independently per game mode
    if (!practiceOnly && isCorrect && onStreakRecord) {
      const relevantRef = gameMode === "classic" ? hasShownRecordOverlayClassic : hasShownRecordOverlayRandom;
      const previousBest = gameMode === "classic"
        ? (user ? (userStats?.classicLongestStreak ?? 0) : classicLocalBestRef.current)
        : (user ? (userStats?.randomLongestStreak ?? 0) : randomLocalBestRef.current);
      if (!relevantRef.current && newStreak > previousBest) {
        relevantRef.current = true;
        onStreakRecord("personal");
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
    }
  };

  // Handler for Next button when timed out
  const handleNextAfterTimeout = () => {
    if (currentQuestion) {
      const { rule, tip } = getRule(currentQuestion.verb, currentQuestion.tense);
      setLossRuleHint(rule || tip || null);
      setLossVerb(currentQuestion.verb);
      setLossTense(currentQuestion.tense);
    }
    setLossSessionStats(buildLossSessionStats(lastStreakValue));
    setIsAnswered(false);
    setIsTimedOut(false);
    setFeedback(null);
    setGameState("lost");
  };

  // Handler for Next in practiceOnly wrong answer
  const handlePracticeOnlyNext = () => {
    setUserAnswer("");
    setFeedback(null);
    setIsAnswered(false);
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
      return "bg-[#22C55E] text-white border-[#22C55E] hover:bg-[#16A34A] disabled:opacity-100";
    }
    if (isUserChoice && !isCorrectAnswer) {
      return "bg-[#FF6A4D] text-white border-[#FF6A4D] disabled:opacity-100";
    }
    return "bg-white text-[#0B1020] border border-gray-200 opacity-40";
  };

  const getInputClass = () => {
    if (!isAnswered)
      return "bg-[#FAFAF7] border-gray-200 focus-visible:ring-[#1F4BFF] focus-visible:border-[#0B1020]";
    if (feedback === "correct")
      return "bg-[#DCFCE7] border-[#22C55E] text-[#15803D] focus-visible:ring-[#22C55E]";
    if (feedback === "incorrect")
      return "bg-[#FEE2E2] border-[#FF6A4D] text-[#DC2626] focus-visible:ring-[#FF6A4D]";
    return "bg-[#FAFAF7]";
  };

  const displayPronoun = (() => {
    if (currentQuestion?.tense === "Impératif Présent") {
      return `(${currentQuestion.pronoun})`;
    }
    if (gameMode === "classic") {
      return CLASSIC_DISPLAY_LABELS[classicCycleIndex] ?? currentQuestion?.pronoun;
    }
    return currentQuestion?.pronoun;
  })();

  // Determine which input mode to show (force multiple-choice in practiceOnly and duelMode)
  const displayMode: PracticeMode = practiceOnly || duelMode ? "multiple-choice" : mode;

  return (
    <div className="space-y-3">
      {/* Duel mode: status */}
      {duelMode && (
        <div
          className="text-center text-white font-bold text-lg drop-shadow-md"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Duel mode · First mistake ends the match
        </div>
      )}

      {/* Streak display — hidden in practiceOnly and duelMode */}
      {!practiceOnly && !duelMode && (
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

      {/* Game mode selector — hidden in duelMode */}
      {!duelMode && <div className="flex items-center justify-center gap-2">
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
      </div>}

      {/* Competitive / Casual toggle — hidden in practiceOnly and duelMode */}
      {!practiceOnly && !duelMode && (
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
      {!practiceOnly && !duelMode && !competitiveMode && gameState !== "playing" && (
        <div className="rounded-xl bg-white/10 border border-white/20 p-3 space-y-3">
          <p className="text-center text-white text-sm font-semibold">Customize your practice</p>
          <p className="text-center text-white/70 text-xs">Countdown is optional in casual mode.</p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleSwitchCompetitiveMode(false)}
              className="text-xs px-3 py-1 rounded-full bg-white/20 text-white"
            >
              Countdown Off
            </button>
            <button
              onClick={() => handleSwitchCompetitiveMode(true)}
              className="text-xs px-3 py-1 rounded-full border border-white/40 text-white/90 hover:bg-white/10"
            >
              Countdown On
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => toggleTense(ALL_TENSES_OPTION)}
              className={cn(
                "text-xs px-3 py-1 rounded-full border",
                selectedTenses.includes(ALL_TENSES_OPTION)
                  ? "bg-[#1F4BFF] border-[#1F4BFF] text-white"
                  : "border-white/40 text-white/80"
              )}
            >
              Any tense
            </button>
            {availableTenses.map((tense) => (
              <button
                key={tense}
                onClick={() => toggleTense(tense)}
                className={cn(
                  "text-xs px-3 py-1 rounded-full border",
                  selectedTenses.includes(tense)
                    ? "bg-[#1F4BFF] border-[#1F4BFF] text-white"
                    : "border-white/40 text-white/80"
                )}
              >
                {tense}
              </button>
            ))}
          </div>
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

      {/* START OVERLAY — hidden in practiceOnly and duelMode */}
      {!practiceOnly && !duelMode && gameState === "idle" && (
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
          {userStats && (
            <div className="flex justify-center gap-3 mt-3">
              <div
                className="flex items-center gap-1 text-xs text-gray-500"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <span>📅</span>
                <span>{userStats.dailyStreak}d streak</span>
              </div>
              <div
                className="flex items-center gap-1 text-xs text-gray-500"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <span>🎯</span>
                <span>{userStats.totalCorrect} correct</span>
              </div>
              <div
                className="flex items-center gap-1 text-xs text-gray-500"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <span>🔥</span>
                <span>Best: {gameMode === "classic" ? userStats.classicLongestStreak : userStats.randomLongestStreak}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LOSS OVERLAY — hidden in practiceOnly and duelMode */}
      {!practiceOnly && !duelMode && gameState === "lost" && (
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
          {lossVerb && lossTense && (
            <p
              className="text-sm font-semibold"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: "rgba(11,16,32,0.7)",
              }}
            >
              {lossVerb}
              {' · '}
              {lossTense}
            </p>
          )}
          {lastCorrectAnswer && (
            <div className="mt-3 text-center">
              <p
                className="text-xs text-gray-400 mb-1"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                The answer was
              </p>
              <p
                className="text-lg font-bold"
                style={{ color: "#22C55E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {lastCorrectAnswer}
              </p>
            </div>
          )}
          {lossRuleHint && (
            <p
              className="text-sm text-center px-4"
              style={{
                fontFamily: 'var(--font-jetbrains)',
                letterSpacing: '0.5px',
                opacity: 0.7,
              }}
            >
              {lossRuleHint}
            </p>
          )}
          {lossSessionStats && (
            <div className="bg-white/5 rounded-xl px-4 py-3 my-4" style={{ border: "1px solid rgba(31,75,255,0.1)" }}>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Flame size={16} style={{ color: "#1F4BFF" }} />
                  <span
                    className="font-bold text-lg"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0B1020" }}
                  >
                    {lossSessionStats.streakJustAchieved}
                  </span>
                  <span
                    className="text-xs uppercase"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(11,16,32,0.5)" }}
                  >
                    This round
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Star size={16} style={{ color: "#1F4BFF" }} />
                  <span
                    className="font-bold text-lg"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0B1020" }}
                  >
                    {lossSessionStats.personalBest}
                  </span>
                  <span
                    className="text-xs uppercase"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(11,16,32,0.5)" }}
                  >
                    Personal best
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Zap size={16} style={{ color: "#1F4BFF" }} />
                  <span
                    className="font-bold text-lg"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0B1020" }}
                  >
                    {lossSessionStats.avgAnswerTimeSeconds !== null
                      ? `${lossSessionStats.avgAnswerTimeSeconds}s`
                      : "—"}
                  </span>
                  <span
                    className="text-xs uppercase"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(11,16,32,0.5)" }}
                  >
                    {lossSessionStats.avgAnswerTimeSeconds !== null ? "Avg time" : "No timer"}
                  </span>
                </div>
              </div>
            </div>
          )}
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

      {/* HOME INTERRUPT OVERLAY — signed-in users only, during play */}
      {!practiceOnly && showHomeInterrupt && gameState === "playing" && (
        <div
          className="rounded-2xl shadow-xl p-8 text-center space-y-4 animate-in fade-in-0 zoom-in-95"
          style={{
            backgroundColor: "#FAFAF7",
            border: "1px solid rgba(31,75,255,0.12)",
          }}
        >
          <h2
            className="text-2xl"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              color: "#0B1020",
            }}
          >
            Taking a break?
          </h2>
          <p
            className="text-sm"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: "rgba(11,16,32,0.6)",
            }}
          >
            Your streak is waiting.
          </p>
          <button
            onClick={onHomeInterruptDismiss}
            className="w-full h-14 rounded-xl text-white font-bold text-base transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              backgroundColor: "#1F4BFF",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
            }}
          >
            Jump Back In →
          </button>
          <button
            onClick={handleGoHome}
            className="w-full h-12 rounded-xl font-semibold text-base border-2 transition-all hover:bg-[#1F4BFF]/5 active:scale-[0.98]"
            style={{
              borderColor: "#1F4BFF",
              color: "#1F4BFF",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Go Home
          </button>
        </div>
      )}

      {/* GAME CARD */}
      {(practiceOnly || duelMode || gameState === "playing") && !showHomeInterrupt && (
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
                  {competitiveMode ? "C'est parti — for real." : "Level Up"}
                </h3>
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 400,
                    color: "rgba(11,16,32,0.5)",
                    fontSize: "0.875rem",
                  }}
                >
                  {competitiveMode
                    ? "You've got the basics down. From here, the game will mix it up — sometimes you choose, sometimes you type. Stay sharp."
                    : "From now on — write it out."}
                </p>
                {!competitiveMode && (
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
                )}
                <button
                  onClick={handleLevelUpReady}
                  className="w-full h-12 rounded-xl text-white font-bold text-base transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{
                    backgroundColor: "#1F4BFF",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  {competitiveMode ? "Let's go →" : "I’m ready →"}
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
              {/* Next in practiceOnly or duelMode wrong answer */}
              {(practiceOnly || duelMode) && isAnswered && feedback === "incorrect" && (
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

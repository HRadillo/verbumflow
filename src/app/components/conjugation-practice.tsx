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
};

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
}: ConjugationPracticeProps) {
  const [gameMode, setGameMode] = useState<GameMode>("classic");
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
  const [timeLeft, setTimeLeft] = useState(10);
  const [lastClassicVerb, setLastClassicVerb] = useState<string | null>(null);
  const [pendingModeSwitch, setPendingModeSwitch] = useState<GameMode | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prepareNextStageRef = useRef<() => void>(() => {});
  const { user } = useAuth();

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

  // Pick a random question for Random mode, avoiding recentPairs
  const pickRandomQuestion = useCallback((recentPairs: string[]): Question => {
    const available = allPossibleQuestions.filter(
      (q) => !recentPairs.includes(`${q.verb}|${q.pronoun}`)
    );
    const pool = available.length > 0 ? available : allPossibleQuestions;
    return pool[Math.floor(Math.random() * pool.length)];
  }, []);

  // Pick next classic MC question, avoiding lastVerb
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

    if (gameMode === "random") {
      if (mode === "multiple-choice" && feedback === "correct" && currentQuestion) {
        // Drill same verb/tense/pronoun as fill-in-blank
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
        // Next random question
        const trimmed = recentRandomPairs.slice(-4);
        const nextQ = pickRandomQuestion(trimmed);
        const pair = `${nextQ.verb}|${nextQ.pronoun}`;
        setMode("multiple-choice");
        setCurrentQuestion(getQuestionDetails(nextQ, "multiple-choice"));
        setRecentRandomPairs([...trimmed, pair]);
      }
      return;
    }

    // ── Classic mode ──
    if (mode === "fill-in-the-blank" && fillInTheBlankQueue.length > 0) {
      const nextFillIn = fillInTheBlankQueue[0];
      setCurrentQuestion(getQuestionDetails(nextFillIn, "fill-in-the-blank"));
      setFillInTheBlankQueue((q) => q.slice(1));
      return;
    }

    if (
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

    // Default classic: pick next MC from queue
    setMode("multiple-choice");
    setFillInTheBlankQueue([]);
    const avoidVerb = currentQuestion?.verb ?? lastClassicVerb;
    const { question: nextQ, remainingQueue } = pickClassicQuestion(
      practiceQueue,
      avoidVerb ?? null
    );
    setLastClassicVerb(nextQ.verb);
    setPracticeQueue(remainingQueue);
    setCurrentQuestion(getQuestionDetails(nextQ, "multiple-choice"));
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
  ]);

  // Keep ref updated so auto-advance timeout always gets the latest version
  useEffect(() => {
    prepareNextStageRef.current = prepareNextStage;
  }, [prepareNextStage]);

  // Initialize first question on mount
  useEffect(() => {
    if (currentQuestion !== null) return;
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
  }, [currentQuestion, gameMode, getQuestionDetails, pickRandomQuestion]);

  // Timer: reset and run on each new question, pause when answered
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (isAnswered || !currentQuestion) return;

    setTimeLeft(10);
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
  }, [key, isAnswered, currentQuestion]);

  // Handle time's up: runs when timeLeft hits 0
  useEffect(() => {
    if (timeLeft !== 0 || isAnswered || !currentQuestion) return;

    setIsAnswered(true);
    setFeedback("incorrect");
    setIsTimedOut(true);
    setStreak(0);
    setFillInTheBlankQueue([]);

    if (user) {
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

  // Auto-advance after time's up (1.5s)
  useEffect(() => {
    if (!isTimedOut) return;
    const id = setTimeout(() => {
      prepareNextStageRef.current();
    }, 1500);
    return () => clearTimeout(id);
  }, [isTimedOut]);

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

  const handleSwitchMode = (newMode: GameMode) => {
    if (newMode === gameMode) {
      setPendingModeSwitch(null);
      return;
    }
    // Anti-cheat: require confirmation when switching mid-streak
    if (streak > 0 && pendingModeSwitch !== newMode) {
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
    setStreak(0);
    setFillInTheBlankQueue([]);
    setPracticeQueue([]);
    setRecentRandomPairs([]);
    setMode("multiple-choice");
    setFeedback(null);
    setIsAnswered(false);
    setIsTimedOut(false);
    setTimeLeft(10);
    setCurrentQuestion(null); // triggers re-initialization effect
    setKey((k) => k + 1);
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
    setStreak(newStreak);

    if (user) {
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

  return (
    <div className="space-y-3">
      {/* Streak display */}
      <div className="flex justify-center items-center gap-2 text-white font-bold text-xl drop-shadow-md">
        <Flame
          className={cn(
            "transition-colors",
            streak > 0 ? "text-[#FF6A4D]" : "text-white/50"
          )}
        />
        <span>{streak}</span>
      </div>

      {/* Game mode selector */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => handleSwitchMode("classic")}
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
          onClick={() => handleSwitchMode("random")}
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

      {/* Anti-cheat mode-switch warning */}
      {pendingModeSwitch && (
        <p
          className="text-center text-xs font-medium"
          style={{ color: "#FF6A4D", fontFamily: "'JetBrains Mono', monospace" }}
        >
          ⚠️ Switching resets your streak. Click again to confirm.
        </p>
      )}

      {currentQuestion ? (
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
                  fontFamily: "'JetBrains Mono', monospace",
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
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {displayPronoun}
              </Badge>
            </CardDescription>

            {/* Timer bar */}
            <div className="mt-2 h-1 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                style={{
                  width: `${(timeLeft / 10) * 100}%`,
                  backgroundColor: timeLeft <= 3 ? "#FF6A4D" : "#1F4BFF",
                  height: "100%",
                  transition: "width 1s linear, background-color 0.5s ease",
                }}
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            {/* Time's up message */}
            {isTimedOut && (
              <div
                className="text-center font-bold text-sm py-1"
                style={{
                  color: "#FF6A4D",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                ⏱ Time&apos;s up!
              </div>
            )}

            {mode === "multiple-choice" ? (
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
                    >
                      {option}
                    </Button>
                    {isAnswered &&
                      option === currentQuestion.correctAnswer &&
                      currentQuestion.rule && (
                        <div className="text-xs text-muted-foreground mt-2 px-1 text-center sm:text-left">
                          <p className="font-semibold">Rule:</p>
                          <p>{currentQuestion.rule}</p>
                        </div>
                      )}
                    {feedback === "incorrect" &&
                      option === userAnswer &&
                      currentQuestion.tip && (
                        <div className="text-xs text-red-600 mt-2 px-1 text-center sm:text-left">
                          <p className="font-semibold">Tip:</p>
                          <p>{currentQuestion.tip}</p>
                        </div>
                      )}
                  </div>
                ))}
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
                />
                {isAnswered && (
                  <div className="text-xs text-muted-foreground mt-2 px-1 text-center">
                    <p className="font-semibold">Rule:</p>
                    <p>{currentQuestion.rule}</p>
                  </div>
                )}
                {feedback === "incorrect" && (
                  <div className="text-xs text-red-600 mt-2 px-1 text-center">
                    <p className="font-semibold">Tip:</p>
                    <p>{currentQuestion.tip}</p>
                  </div>
                )}
                {!isAnswered && (
                  <Button
                    type="submit"
                    className="w-full bg-[#1F4BFF] hover:bg-[#1637CC] text-white"
                  >
                    Check
                  </Button>
                )}
              </form>
            )}

            {isAnswered && feedback === "incorrect" && !isTimedOut && (
              <div className="text-sm text-muted-foreground pt-2 text-center">
                Correct answer:{" "}
                <span className="font-bold text-green-600">
                  {currentQuestion.correctAnswer}
                </span>
              </div>
            )}
            {isTimedOut && (
              <div className="text-sm text-muted-foreground pt-2 text-center">
                Correct answer:{" "}
                <span className="font-bold text-green-600">
                  {currentQuestion.correctAnswer}
                </span>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            {isAnswered && !isTimedOut && (
              <Button
                onClick={prepareNextStage}
                className="gap-2 animate-in fade-in-50 bg-[#1F4BFF] hover:bg-[#1637CC] text-white"
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
          <CardTitle className="mt-4" style={{ color: "#0B1020" }}>
            Loading Verbs...
          </CardTitle>
        </Card>
      )}
    </div>
  );
}

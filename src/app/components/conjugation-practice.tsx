
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { verbData, verbs as allVerbs, allConjugations, getRule } from "@/lib/verbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type Feedback = "correct" | "incorrect" | null;
type PracticeMode = "multiple-choice" | "fill-in-the-blank";

type Question = {
  verb: string;
  tense: string;
  pronoun: string;
};

type CurrentQuestion = Question & {
  correctAnswer: string;
  options?: string[]; // Optional for fill-in-the-blank
  rule: string | null;
  tip: string | null;
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
       const pronounsToPractice = ["je", "j'", "tu", "il/elle", "nous", "vous", "ils/elles", "que je", "que j'", "que tu", "qu'il/elle", "que nous", "que vous", "qu'ils/elles"];
       if (pronounsToPractice.includes(pronoun) || tense === "Impératif Présent") {
         allPossibleQuestions.push({ verb, tense, pronoun });
       }
    }
  }
}

type ConjugationPracticeProps = {
  onNextQuestion: () => void;
};

export function ConjugationPractice({ onNextQuestion }: ConjugationPracticeProps) {
  const [practiceQueue, setPracticeQueue] = useState<Question[]>([]);
  const [fillInTheBlankQueue, setFillInTheBlankQueue] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [key, setKey] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mode, setMode] = useState<PracticeMode>("multiple-choice");
  const inputRef = useRef<HTMLInputElement>(null);

  const getQuestionDetails = useCallback((question: Question, currentMode: PracticeMode): CurrentQuestion | null => {
      const { verb, tense, pronoun } = question;
      const correctAnswer = verbData[verb]?.[tense]?.[pronoun];

      if (!correctAnswer) {
          return null;
      }

      const { rule, tip } = getRule(verb, tense);

      if (currentMode === "multiple-choice") {
          const wrongOptions: string[] = [];
          const allConjugationsForVerb = new Set(Object.values(verbData[verb]).flatMap(p => Object.values(p)));
          
          const potentialWrongOptions = Array.from(allConjugationsForVerb).filter(
              c => c !== correctAnswer && c
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
              const globalWrongOptions = shuffleArray(allConjugations.filter(c => c !== correctAnswer && !wrongOptions.includes(c))).slice(0, remainingSlots);
              wrongOptions.push(...globalWrongOptions);
          }
          const options = shuffleArray([correctAnswer, ...wrongOptions]);
          return { verb, tense, pronoun, correctAnswer, options, rule, tip };
      } else { // fill-in-the-blank
          return { verb, tense, pronoun, correctAnswer, rule, tip };
      }
  }, []);


  const prepareNextStage = useCallback(() => {
    setUserAnswer("");
    setFeedback(null);
    setIsAnswered(false);
    setKey(prev => prev + 1);
    onNextQuestion();

    if (mode === 'fill-in-the-blank' && fillInTheBlankQueue.length > 0) {
        const nextFillInQuestion = fillInTheBlankQueue[0];
        setCurrentQuestion(getQuestionDetails(nextFillInQuestion, 'fill-in-the-blank'));
        setFillInTheBlankQueue(q => q.slice(1));
        return;
    }

    if (mode === 'multiple-choice' && feedback === 'correct' && currentQuestion) {
        const { verb, tense } = currentQuestion;
        const otherPronouns = Object.keys(verbData[verb][tense]).filter(p => p !== currentQuestion.pronoun);
        
        if (otherPronouns.length > 0) {
            const newFillInQueue = shuffleArray(otherPronouns).map(p => ({ verb, tense, pronoun: p }));
            const nextFillInQuestion = newFillInQueue[0];

            setMode('fill-in-the-blank');
            setFillInTheBlankQueue(newFillInQueue.slice(1));
            setCurrentQuestion(getQuestionDetails(nextFillInQuestion, 'fill-in-the-blank'));
            return;
        }
    }
    
    // Default: switch to multiple choice and get next from main queue
    setMode('multiple-choice');
    setFillInTheBlankQueue([]);
    setPracticeQueue(currentQueue => {
        const updatedQueue = currentQueue.length > 1 ? currentQueue.slice(1) : shuffleArray(allPossibleQuestions);
        const nextQuestion = updatedQueue[0];
        setCurrentQuestion(getQuestionDetails(nextQuestion, 'multiple-choice'));
        return updatedQueue;
    });

  }, [feedback, onNextQuestion, getQuestionDetails, mode, currentQuestion, fillInTheBlankQueue]);


  useEffect(() => {
    if (practiceQueue.length === 0) {
      const initialQueue = shuffleArray(allPossibleQuestions);
      setPracticeQueue(initialQueue);
      setCurrentQuestion(getQuestionDetails(initialQueue[0], 'multiple-choice'));
    }
  }, [practiceQueue, getQuestionDetails]);

  useEffect(() => {
    if (mode === 'fill-in-the-blank' && inputRef.current) {
        inputRef.current.focus();
    }
  }, [currentQuestion, mode]);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;

    const isCorrect = answer.trim().toLowerCase() === currentQuestion?.correctAnswer.toLowerCase();
    setUserAnswer(answer);
    setFeedback(isCorrect ? "correct" : "incorrect");
    setIsAnswered(true);

    if (isCorrect) {
      setStreak(s => s + 1);
    } else {
      setStreak(0);
      // If incorrect in fill-in-the-blank, we need to stop this verb's practice
      if (mode === 'fill-in-the-blank') {
          setFillInTheBlankQueue([]); 
      }
      // Re-queue the failed question
      setPracticeQueue(currentQueue => {
        if (!currentQuestion) return currentQueue;
        const failedQuestion = { verb: currentQuestion.verb, tense: currentQuestion.tense, pronoun: currentQuestion.pronoun };
        const remainingQueue = currentQueue.slice(1);
        const insertIndex = Math.min(remainingQueue.length, Math.floor(Math.random() * 5) + 3);
        const newQueue = [...remainingQueue];
        newQueue.splice(insertIndex, 0, failedQuestion);
        return newQueue;
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(userAnswer) handleAnswer(userAnswer);
  }

  const getButtonClass = (option: string) => {
    if (!isAnswered) return 'secondary';
    const isCorrectAnswer = option === currentQuestion?.correctAnswer;
    const isUserChoice = option === userAnswer;
    
    if (isCorrectAnswer) return 'success';
    if (isUserChoice && !isCorrectAnswer) return 'destructive';
    
    return 'secondary';
  }
  
  const getInputClass = () => {
    if (!isAnswered) return "bg-white/80";
    if (feedback === 'correct') return "bg-green-200 border-green-500 focus-visible:ring-green-500";
    if (feedback === 'incorrect') return "bg-red-200 border-red-500 focus-visible:ring-red-500";
    return "bg-white/80";
  }


  const displayPronoun = currentQuestion?.tense === "Impératif Présent" ? `(${currentQuestion.pronoun})` : currentQuestion?.pronoun;

  return (
    <div className="space-y-4">
       <div className="flex justify-center items-center gap-2 text-white font-bold text-xl drop-shadow-md">
            <Flame className={cn("transition-colors", streak > 0 ? "text-orange-400" : "text-white/50")} />
            <span>{streak}</span>
        </div>
      {currentQuestion ? (
        <Card 
          key={key} 
          className={cn(
            "relative overflow-hidden transition-all duration-300 animate-in fade-in-0 zoom-in-95 bg-white/80 backdrop-blur-sm shadow-xl",
            feedback === 'incorrect' && 'animate-shake'
          )}
        >
          <CardHeader>
            <CardTitle className="text-3xl sm:text-4xl text-center font-bold text-gray-800">
              {currentQuestion.verb}
            </CardTitle>
            <CardDescription className="text-center">
              <Badge variant="secondary" className="bg-gray-200 text-gray-700">{currentQuestion.tense}</Badge>
              <Badge variant="secondary" className="ml-2 bg-gray-200 text-gray-700">{displayPronoun}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {mode === 'multiple-choice' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options?.map(option => (
                  <div key={option}>
                      <Button 
                        type="button"
                        variant={getButtonClass(option)}
                        onClick={() => handleAnswer(option)}
                        disabled={isAnswered}
                        className={cn("h-auto py-4 text-base sm:text-lg justify-center w-full text-center whitespace-normal shadow-md", {
                          'hover:bg-green-600': getButtonClass(option) === 'success',
                          'hover:bg-red-700': getButtonClass(option) === 'destructive',
                          'bg-white text-gray-800 hover:bg-gray-100': getButtonClass(option) === 'secondary'
                        })}
                      >
                        {option}
                      </Button>
                      {(isAnswered && option === currentQuestion.correctAnswer && currentQuestion.rule) && (
                          <div className="text-xs text-muted-foreground mt-2 px-1 text-center sm:text-left">
                              <p className="font-semibold">Rule:</p>
                              <p>{currentQuestion.rule}</p>
                          </div>
                      )}
                      {(feedback === 'incorrect' && option === userAnswer && currentQuestion.tip) && (
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
                    {feedback === 'incorrect' && (
                         <div className="text-xs text-red-600 mt-2 px-1 text-center">
                            <p className="font-semibold">Tip:</p>
                            <p>{currentQuestion.tip}</p>
                        </div>
                    )}
                    {!isAnswered && <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">Check</Button>}
                </form>
            )}

           {(isAnswered && feedback === 'incorrect') && (
            <div className="text-sm text-muted-foreground pt-2 text-center">
                Correct answer: <span className="font-bold text-green-600">{currentQuestion.correctAnswer}</span>
            </div>
           )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            {isAnswered && (
              <Button onClick={prepareNextStage} className="gap-2 animate-in fade-in-50 bg-blue-500 hover:bg-blue-600 text-white">
                 Next <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 text-center bg-white/80 backdrop-blur-sm shadow-xl">
            <div className="h-16 w-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
          <CardTitle className="mt-4">Loading Verbs...</CardTitle>
          <CardDescription className="mt-2">Get ready to practice!</CardDescription>
        </Card>
      )}
    </div>
  );
}

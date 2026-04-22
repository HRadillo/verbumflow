// src/app/components/leaderboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/firestore";
import { useAuth } from "@/contexts/auth-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Flame, Target, Calendar, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

type LeaderboardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const podiumColors = [
  "text-yellow-500", // 1st — gold
  "text-gray-400",   // 2nd — silver
  "text-amber-600",  // 3rd — bronze
];

function LeaderboardList({
  entries,
  valueKey,
  icon: Icon,
  label,
  currentUid,
}: {
  entries: LeaderboardEntry[];
  valueKey: keyof LeaderboardEntry;
  icon: React.ElementType;
  label: string;
  currentUid: string | null;
}) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Trophy className="h-12 w-12 mb-4 opacity-40" />
        <p className="text-sm">No scores yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
      {entries.map((entry, index) => (
        <div
          key={entry.uid}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg transition-colors",
            entry.uid === currentUid
              ? "bg-blue-50 border border-blue-200"
              : "bg-gray-50 hover:bg-gray-100"
          )}
        >
          {/* Rank */}
          <div className="flex-shrink-0 w-8 text-center">
            {index < 3 ? (
              <Trophy
                className={cn("h-5 w-5 mx-auto", podiumColors[index])}
              />
            ) : (
              <span className="text-sm font-medium text-muted-foreground">
                {index + 1}
              </span>
            )}
          </div>

          {/* Avatar */}
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={entry.photoURL ?? undefined} />
            <AvatarFallback className="text-xs bg-gray-200">
              <User className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>

          {/* Name */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {entry.displayName}
              {entry.uid === currentUid && (
                <Badge variant="secondary" className="ml-2 text-[10px] py-0">
                  You
                </Badge>
              )}
            </p>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-bold tabular-nums">
              {String(entry[valueKey])}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Leaderboard({ open, onOpenChange }: LeaderboardProps) {
  const { user } = useAuth();
  const [streakBoard, setStreakBoard] = useState<LeaderboardEntry[]>([]);
  const [correctBoard, setCorrectBoard] = useState<LeaderboardEntry[]>([]);
  const [dailyBoard, setDailyBoard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [streak, correct, daily] = await Promise.all([
          getLeaderboard("longestStreak", 20),
          getLeaderboard("totalCorrect", 20),
          getLeaderboard("dailyStreak", 20),
        ]);
        setStreakBoard(streak);
        setCorrectBoard(correct);
        setDailyBoard(daily);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Leaderboard
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-4 border-dashed rounded-full animate-spin border-primary" />
          </div>
        ) : (
          <Tabs defaultValue="streak">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="streak" className="text-xs gap-1">
                <Flame className="h-3 w-3" /> Best Streak
              </TabsTrigger>
              <TabsTrigger value="correct" className="text-xs gap-1">
                <Target className="h-3 w-3" /> Total ✓
              </TabsTrigger>
              <TabsTrigger value="daily" className="text-xs gap-1">
                <Calendar className="h-3 w-3" /> Daily
              </TabsTrigger>
            </TabsList>

            <TabsContent value="streak">
              <LeaderboardList
                entries={streakBoard}
                valueKey="longestStreak"
                icon={Flame}
                label="Best Streak"
                currentUid={user?.uid ?? null}
              />
            </TabsContent>

            <TabsContent value="correct">
              <LeaderboardList
                entries={correctBoard}
                valueKey="totalCorrect"
                icon={Target}
                label="Total Correct"
                currentUid={user?.uid ?? null}
              />
            </TabsContent>

            <TabsContent value="daily">
              <LeaderboardList
                entries={dailyBoard}
                valueKey="dailyStreak"
                icon={Calendar}
                label="Day Streak"
                currentUid={user?.uid ?? null}
              />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}

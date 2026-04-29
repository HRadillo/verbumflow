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
import { Flame, Target, Calendar, Trophy, User, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlayerStatsDialog } from "@/app/components/player-stats-dialog";

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
  currentUid,
  onOpenProfile,
}: {
  entries: LeaderboardEntry[];
  valueKey: keyof LeaderboardEntry;
  icon: React.ElementType;
  currentUid: string | null;
  onOpenProfile: (uid: string, name: string, photoURL: string | null) => void;
}) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Trophy className="h-12 w-12 mb-4 opacity-40" />
        <p
          className="text-sm"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          No scores yet. Be the first!
        </p>
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
              ? "bg-[rgba(31,75,255,0.06)] border border-[#1F4BFF]"
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
              <span
                className="text-sm font-medium text-muted-foreground"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {index + 1}
              </span>
            )}
          </div>

          {/* Avatar */}
          <button onClick={() => onOpenProfile(entry.uid, entry.displayName, entry.photoURL ?? null)} className="rounded-full">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={entry.photoURL ?? undefined} />
            <AvatarFallback className="text-xs bg-gray-200">
              <User className="h-3 w-3" />
            </AvatarFallback>
          </Avatar>
          </button>

          {/* Name */}
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium truncate"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {entry.displayName}
              {entry.uid === currentUid && (
                <Badge className="ml-2 text-[10px] py-0 bg-[#1F4BFF] text-white hover:bg-[#1F4BFF]">
                  You
                </Badge>
              )}
            </p>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span
              className="text-sm font-bold tabular-nums"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
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
  const [classicBoard, setClassicBoard] = useState<LeaderboardEntry[]>([]);
  const [randomBoard, setRandomBoard] = useState<LeaderboardEntry[]>([]);
  const [correctBoard, setCorrectBoard] = useState<LeaderboardEntry[]>([]);
  const [dailyBoard, setDailyBoard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileUid, setProfileUid] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string>("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [classic, random, correct, daily] = await Promise.all([
          getLeaderboard("classicLongestStreak", 20),
          getLeaderboard("randomLongestStreak", 20),
          getLeaderboard("totalCorrect", 20),
          getLeaderboard("dailyStreak", 20),
        ]);
        setClassicBoard(classic);
        setRandomBoard(random);
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
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle
            className="flex items-center gap-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <Trophy className="h-5 w-5 text-[#FF6A4D]" />
            Leaderboard
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-4 border-dashed rounded-full animate-spin border-primary" />
          </div>
        ) : (
          <Tabs defaultValue="classic">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                value="classic"
                className="text-xs gap-1 data-[state=active]:text-[#1F4BFF]"
                title="Best Classic Streak — longest streak in Classic Mode (same verb, all pronouns)"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <Flame className="h-3 w-3" /> Classic
              </TabsTrigger>
              <TabsTrigger
                value="random"
                className="text-xs gap-1 data-[state=active]:text-[#1F4BFF]"
                title="Best Random Streak — longest streak in Random Mode (fully random verb + tense + pronoun)"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <Shuffle className="h-3 w-3" /> Random
              </TabsTrigger>
              <TabsTrigger
                value="correct"
                className="text-xs gap-1 data-[state=active]:text-[#1F4BFF]"
                title="Total Correct — all-time correct answers across both modes"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <Target className="h-3 w-3" /> All-Time
              </TabsTrigger>
              <TabsTrigger
                value="daily"
                className="text-xs gap-1 data-[state=active]:text-[#1F4BFF]"
                title="Daily Streak — consecutive days you've practiced"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <Calendar className="h-3 w-3" /> Daily
              </TabsTrigger>
            </TabsList>

            <TabsContent value="classic">
              <LeaderboardList
                entries={classicBoard}
                valueKey="classicLongestStreak"
                icon={Flame}
                currentUid={user?.uid ?? null}
                onOpenProfile={(uid, name, photoURL) => {
                  setProfileUid(uid); setProfileName(name); setProfilePhoto(photoURL);
                }}
              />
            </TabsContent>

            <TabsContent value="random">
              <LeaderboardList
                entries={randomBoard}
                valueKey="randomLongestStreak"
                icon={Shuffle}
                currentUid={user?.uid ?? null}
                onOpenProfile={(uid, name, photoURL) => {
                  setProfileUid(uid); setProfileName(name); setProfilePhoto(photoURL);
                }}
              />
            </TabsContent>

            <TabsContent value="correct">
              <LeaderboardList
                entries={correctBoard}
                valueKey="totalCorrect"
                icon={Target}
                currentUid={user?.uid ?? null}
                onOpenProfile={(uid, name, photoURL) => {
                  setProfileUid(uid); setProfileName(name); setProfilePhoto(photoURL);
                }}
              />
              <p
                className="text-[10px] text-muted-foreground text-center mt-2 px-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Total correct answers across Classic + Random since account
                creation
              </p>
            </TabsContent>

            <TabsContent value="daily">
              <LeaderboardList
                entries={dailyBoard}
                valueKey="dailyStreak"
                icon={Calendar}
                currentUid={user?.uid ?? null}
                onOpenProfile={(uid, name, photoURL) => {
                  setProfileUid(uid); setProfileName(name); setProfilePhoto(photoURL);
                }}
              />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
    <PlayerStatsDialog
      uid={profileUid}
      open={Boolean(profileUid)}
      onOpenChange={(isOpen) => { if (!isOpen) setProfileUid(null); }}
      fallbackName={profileName}
      fallbackPhotoURL={profilePhoto}
    />
    </>
  );
}

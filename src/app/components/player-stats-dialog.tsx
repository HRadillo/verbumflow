"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserStats, type UserStats } from "@/lib/firestore";

type Props = {
  uid: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fallbackName?: string;
  fallbackPhotoURL?: string | null;
};

export function PlayerStatsDialog({ uid, open, onOpenChange, fallbackName, fallbackPhotoURL }: Props) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !uid) return;
    setLoading(true);
    getUserStats(uid)
      .then((data) => setStats(data))
      .catch((err) => {
        console.error("Failed to load user stats:", err);
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, [open, uid]);

  const displayName = stats?.displayName ?? fallbackName ?? "Player";
  const photoURL = stats?.photoURL ?? fallbackPhotoURL ?? null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Player profile</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading stats…</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={photoURL ?? undefined} />
                <AvatarFallback>{displayName[0] ?? "?"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{displayName}</p>
                {stats?.friendCode && <p className="text-xs text-muted-foreground">Code: {stats.friendCode}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Classic best: <strong>{stats?.classicLongestStreak ?? 0}</strong></div>
              <div>Random best: <strong>{stats?.randomLongestStreak ?? 0}</strong></div>
              <div>Total correct: <strong>{stats?.totalCorrect ?? 0}</strong></div>
              <div>Daily streak: <strong>{stats?.dailyStreak ?? 0}</strong></div>
              <div>Duels won: <strong>{stats?.duelsWon ?? 0}</strong></div>
              <div>Duels lost: <strong>{stats?.duelsLost ?? 0}</strong></div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

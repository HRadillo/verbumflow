// src/app/components/friends-panel.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Swords, UserPlus, Search, Clock, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import {
  getFriends,
  addFriend,
  getUserByUsername,
  getPendingDuels,
  getActiveDuels,
  sendDuelRequest,
  acceptDuel,
  submitDuelScore,
  type FriendEntry,
  type DuelRequest,
} from "@/lib/firestore";
import { ConjugationPractice } from "@/app/components/conjugation-practice";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type SearchResult =
  | { uid: string; displayName: string; photoURL: string | null; username: string }
  | "not-found"
  | null;

type ActiveDuelSession = {
  duelId: string;
  verbSeed: number;
  opponentUsername: string;
};

type DuelResultDisplay = {
  duel: DuelRequest;
  myUid: string;
};

type TabId = "search" | "friends" | "pending";

export function FriendsPanel({ open, onOpenChange }: Props) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("friends");
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult>(null);
  const [searching, setSearching] = useState(false);
  const [friends, setFriends] = useState<FriendEntry[]>([]);
  const [pendingDuels, setPendingDuels] = useState<DuelRequest[]>([]);
  const [activeDuels, setActiveDuels] = useState<DuelRequest[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [addingFriend, setAddingFriend] = useState<string | null>(null);
  const [sendingDuel, setSendingDuel] = useState<string | null>(null);
  const [activeDuelSession, setActiveDuelSession] = useState<ActiveDuelSession | null>(null);
  const [duelResult, setDuelResult] = useState<DuelResultDisplay | null>(null);

  const loadFriendsData = useCallback(async () => {
    if (!user) return;
    setLoadingFriends(true);
    try {
      const [f, p, a] = await Promise.all([
        getFriends(user.uid),
        getPendingDuels(user.uid),
        getActiveDuels(user.uid),
      ]);
      setFriends(f);
      setPendingDuels(p);
      setActiveDuels(a);
    } catch (err) {
      console.error("Failed to load friends data:", err);
    } finally {
      setLoadingFriends(false);
    }
  }, [user]);

  useEffect(() => {
    if (open && user) {
      loadFriendsData();
    }
  }, [open, user, loadFriendsData]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearching(true);
    setSearchResult(null);
    try {
      const result = await getUserByUsername(searchInput.trim());
      setSearchResult(result ?? "not-found");
    } catch {
      setSearchResult("not-found");
    } finally {
      setSearching(false);
    }
  };

  const handleAddFriend = async (friendUid: string) => {
    if (!user) return;
    setAddingFriend(friendUid);
    try {
      await addFriend(user.uid, friendUid);
      await loadFriendsData();
    } catch (err) {
      console.error("Failed to add friend:", err);
    } finally {
      setAddingFriend(null);
    }
  };

  const handleSendDuel = async (friendUid: string) => {
    if (!user) return;
    setSendingDuel(friendUid);
    try {
      await sendDuelRequest(user.uid, friendUid, Math.floor(Math.random() * 2 ** 31));
    } catch (err) {
      console.error("Failed to send duel:", err);
    } finally {
      setSendingDuel(null);
    }
  };

  const handleAcceptAndPlay = async (duel: DuelRequest) => {
    try {
      await acceptDuel(duel.duelId);
      setActiveDuelSession({
        duelId: duel.duelId,
        verbSeed: duel.verbSeed,
        opponentUsername: duel.challengerUsername,
      });
    } catch (err) {
      console.error("Failed to accept duel:", err);
    }
  };

  const handlePlayActiveDuel = (duel: DuelRequest) => {
    if (!user) return;
    const isChallenger = duel.challengerUid === user.uid;
    setActiveDuelSession({
      duelId: duel.duelId,
      verbSeed: duel.verbSeed,
      opponentUsername: isChallenger ? duel.challengedUsername : duel.challengerUsername,
    });
  };

  const handleDuelComplete = async (score: number) => {
    if (!user || !activeDuelSession) return;
    try {
      const result = await submitDuelScore(activeDuelSession.duelId, user.uid, score);
      setDuelResult({ duel: result, myUid: user.uid });
      setActiveDuelSession(null);
      loadFriendsData();
    } catch (err) {
      console.error("Failed to submit duel score:", err);
      setActiveDuelSession(null);
    }
  };

  const isAlreadyFriend = (uid: string) => friends.some((f) => f.uid === uid);

  // ── Duel result overlay ──────────────────────────────────────────
  if (duelResult) {
    const { duel, myUid } = duelResult;
    const isChallenger = duel.challengerUid === myUid;
    const myScore = isChallenger ? duel.challengerScore : duel.challengedScore;
    const opponentScore = isChallenger ? duel.challengedScore : duel.challengerScore;
    const opponentUsername = isChallenger ? duel.challengedUsername : duel.challengerUsername;
    const isComplete = duel.status === "completed";
    const iWon = duel.winnerId === myUid;

    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 overflow-y-auto">
          <div className="flex flex-col items-center justify-center min-h-full p-8 text-center space-y-5"
            style={{ background: "linear-gradient(135deg, #0B1020 0%, #1a2340 100%)" }}>
            <div style={{ fontSize: "3rem", lineHeight: 1 }}>
              {isComplete ? (iWon ? "🏆" : "💪") : "⏳"}
            </div>
            <h2 className="text-2xl font-extrabold text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {isComplete
                ? iWon ? "You won!" : "You lost"
                : "Score submitted!"}
            </h2>
            {isComplete ? (
              <div className="flex gap-8">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-bold text-white">{myScore}</span>
                  <span className="text-xs text-white/50 uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>You</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-bold text-white/60">{opponentScore}</span>
                  <span className="text-xs text-white/50 uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{opponentUsername}</span>
                </div>
              </div>
            ) : (
              <p className="text-white/60 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Waiting for {opponentUsername}… Check back later.
              </p>
            )}
            <button
              onClick={() => setDuelResult(null)}
              className="mt-4 px-6 py-3 rounded-xl text-white font-bold transition-all hover:opacity-90"
              style={{ backgroundColor: "#1F4BFF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Back to Friends
            </button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // ── Active duel game ─────────────────────────────────────────────
  if (activeDuelSession) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md p-4 overflow-y-auto"
          style={{ background: "linear-gradient(135deg, #0B1020 0%, #1a2340 100%)" }}>
          <div className="pt-2 pb-4">
            <p className="text-center text-xs text-white/50 mb-4 uppercase tracking-widest"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Duel vs {activeDuelSession.opponentUsername}
            </p>
            <ConjugationPractice
              onNextQuestion={() => {}}
              duelMode={{
                duelId: activeDuelSession.duelId,
                totalQuestions: 20,
                verbSeed: activeDuelSession.verbSeed,
                onComplete: handleDuelComplete,
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // ── Normal panel ─────────────────────────────────────────────────
  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "friends", label: "Friends", icon: <Users size={15} /> },
    { id: "search", label: "Search", icon: <Search size={15} /> },
    { id: "pending", label: `Duels${pendingDuels.length + activeDuels.length > 0 ? ` (${pendingDuels.length + activeDuels.length})` : ""}`, icon: <Swords size={15} /> },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col overflow-hidden"
        style={{ background: "#0B1020" }}>
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-white/10">
          <SheetTitle className="text-white text-lg font-bold"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Friends &amp; Duels
          </SheetTitle>
        </SheetHeader>

        {/* Tab bar */}
        <div className="flex border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: activeTab === tab.id ? "#1F4BFF" : "rgba(255,255,255,0.4)",
                borderBottom: activeTab === tab.id ? "2px solid #1F4BFF" : "2px solid transparent",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Search tab */}
          {activeTab === "search" && (
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Find a player by username"
                  className="flex-1 h-10 px-3 rounded-lg text-sm outline-none"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                />
                <button
                  type="submit"
                  disabled={searching || !searchInput.trim()}
                  className="h-10 px-4 rounded-lg text-white text-sm font-semibold disabled:opacity-40"
                  style={{ backgroundColor: "#1F4BFF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {searching ? "…" : "Go"}
                </button>
              </form>

              {searchResult === "not-found" && (
                <p className="text-center text-white/40 text-sm py-4"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  No player found.
                </p>
              )}

              {searchResult && searchResult !== "not-found" && (
                <div className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={searchResult.photoURL ?? undefined} />
                    <AvatarFallback className="bg-white/10 text-white text-xs">
                      {searchResult.displayName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {searchResult.displayName}
                    </p>
                    <p className="text-white/40 text-xs"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      @{searchResult.username}
                    </p>
                  </div>
                  {searchResult.uid !== user?.uid && !isAlreadyFriend(searchResult.uid) && (
                    <button
                      onClick={() => handleAddFriend(searchResult.uid)}
                      disabled={addingFriend === searchResult.uid}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-40"
                      style={{ backgroundColor: "#1F4BFF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      <UserPlus size={12} />
                      {addingFriend === searchResult.uid ? "Adding…" : "Add"}
                    </button>
                  )}
                  {isAlreadyFriend(searchResult.uid) && (
                    <span className="text-xs text-white/40"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Friends</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Friends list tab */}
          {activeTab === "friends" && (
            <div className="space-y-2">
              {loadingFriends && (
                <p className="text-center text-white/30 text-sm py-8"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading…</p>
              )}
              {!loadingFriends && friends.length === 0 && (
                <div className="text-center py-10 space-y-2">
                  <p style={{ fontSize: "2rem" }}>👥</p>
                  <p className="text-white/40 text-sm"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    No friends yet. Search for a player to add them.
                  </p>
                </div>
              )}
              {friends.map((friend) => (
                <div key={friend.uid}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={friend.photoURL ?? undefined} />
                    <AvatarFallback className="bg-white/10 text-white text-xs">
                      {friend.displayName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {friend.displayName}
                    </p>
                    <p className="text-white/40 text-xs"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      @{friend.username} · {friend.duelsWon}W {friend.duelsLost}L
                    </p>
                  </div>
                  <button
                    onClick={() => handleSendDuel(friend.uid)}
                    disabled={sendingDuel === friend.uid}
                    className="p-2 rounded-lg text-white/60 hover:text-white transition-colors disabled:opacity-30"
                    title="Challenge to a duel"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  >
                    {sendingDuel === friend.uid
                      ? <Clock size={16} />
                      : <Swords size={16} />}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pending / Active duels tab */}
          {activeTab === "pending" && (
            <div className="space-y-3">
              {loadingFriends && (
                <p className="text-center text-white/30 text-sm py-8"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading…</p>
              )}

              {!loadingFriends && pendingDuels.length === 0 && activeDuels.length === 0 && (
                <div className="text-center py-10 space-y-2">
                  <p style={{ fontSize: "2rem" }}>⚔️</p>
                  <p className="text-white/40 text-sm"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    No pending duels.
                  </p>
                </div>
              )}

              {pendingDuels.length > 0 && (
                <>
                  <p className="text-xs text-white/40 uppercase tracking-widest"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Incoming challenges
                  </p>
                  {pendingDuels.map((duel) => (
                    <div key={duel.duelId}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: "rgba(31,75,255,0.12)", border: "1px solid rgba(31,75,255,0.25)" }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {duel.challengerUsername}
                        </p>
                        <p className="text-white/40 text-xs"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          challenged you · 20 questions
                        </p>
                      </div>
                      <button
                        onClick={() => handleAcceptAndPlay(duel)}
                        className="px-4 py-2 rounded-lg text-white text-xs font-bold"
                        style={{ backgroundColor: "#1F4BFF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Accept &amp; Play
                      </button>
                    </div>
                  ))}
                </>
              )}

              {activeDuels.length > 0 && (
                <>
                  <p className="text-xs text-white/40 uppercase tracking-widest mt-2"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Your turn to play
                  </p>
                  {activeDuels.map((duel) => {
                    const isChallenger = duel.challengerUid === user?.uid;
                    const opponentName = isChallenger ? duel.challengedUsername : duel.challengerUsername;
                    return (
                      <div key={duel.duelId}
                        className="flex items-center gap-3 p-3 rounded-xl"
                        style={{ backgroundColor: "rgba(255,106,77,0.1)", border: "1px solid rgba(255,106,77,0.25)" }}>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            vs {opponentName}
                          </p>
                          <p className="text-white/40 text-xs"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            accepted · waiting for your score
                          </p>
                        </div>
                        <button
                          onClick={() => handlePlayActiveDuel(duel)}
                          className="px-4 py-2 rounded-lg text-white text-xs font-bold"
                          style={{ backgroundColor: "#FF6A4D", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          Play
                        </button>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

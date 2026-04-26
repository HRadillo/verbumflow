// src/app/components/friends-panel.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, UserMinus, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getUserFriendships,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriendship,
  getFriendCodeOwner,
  type Friendship,
} from "@/lib/firestore";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type FriendsPanelProps = {
  open: boolean;
  onClose: () => void;
  currentUid: string;
  currentUserFriendCode: string;
  pendingAddFriendCode: string;
  onPendingCodeConsumed: () => void;
};

type UserData = {
  displayName: string;
  photoURL: string | null;
  friendCode: string;
};

type TabId = "friends" | "requests" | "add";
type AddStatus = "idle" | "loading" | "success" | "error";

export function FriendsPanel({
  open,
  onClose,
  currentUid,
  currentUserFriendCode,
  pendingAddFriendCode,
  onPendingCodeConsumed,
}: FriendsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("friends");
  const [friendships, setFriendships] = useState<(Friendship & { id: string })[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [userCache, setUserCache] = useState<Record<string, UserData>>({});

  // Add Friend tab state
  const [addCode, setAddCode] = useState("");
  const [addStatus, setAddStatus] = useState<AddStatus>("idle");
  const [addError, setAddError] = useState("");
  const addInputRef = useRef<HTMLInputElement>(null);

  const fetchUserData = useCallback(async (uid: string) => {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        const d = snap.data();
        setUserCache((prev) => ({
          ...prev,
          [uid]: {
            displayName: d.displayName ?? "Unknown",
            photoURL: d.photoURL ?? null,
            friendCode: d.friendCode ?? "",
          },
        }));
      }
    } catch {
      // silently ignore fetch errors
    }
  }, []);

  const loadFriendships = useCallback(async () => {
    if (!currentUid) return;
    setDataLoading(true);
    try {
      const data = await getUserFriendships(currentUid);
      setFriendships(data);
      const otherUids = [
        ...new Set(
          data
            .map((f) => f.users.find((u) => u !== currentUid))
            .filter((uid): uid is string => Boolean(uid))
        ),
      ];
      await Promise.all(otherUids.map(fetchUserData));
    } catch (err) {
      console.error("Failed to load friendships:", err);
    } finally {
      setDataLoading(false);
    }
  }, [currentUid, fetchUserData]);

  useEffect(() => {
    if (open && currentUid) {
      loadFriendships();
    }
  }, [open, currentUid, loadFriendships]);

  // Handle pre-filled code from deep link
  useEffect(() => {
    if (open && pendingAddFriendCode) {
      setActiveTab("add");
      setAddCode(pendingAddFriendCode);
      setAddStatus("idle");
      setAddError("");
      onPendingCodeConsumed();
      setTimeout(() => addInputRef.current?.focus(), 350);
    }
  }, [open, pendingAddFriendCode, onPendingCodeConsumed]);

  const getOtherUid = (f: Friendship) =>
    f.users.find((u) => u !== currentUid) ?? "";

  const acceptedFriendships = friendships.filter((f) => f.status === "accepted");
  const receivedRequests = friendships.filter(
    (f) => f.status === "pending" && f.initiator !== currentUid
  );
  const sentRequests = friendships.filter(
    (f) => f.status === "pending" && f.initiator === currentUid
  );

  const handleAccept = async (f: Friendship & { id: string }) => {
    try {
      await acceptFriendRequest(currentUid, getOtherUid(f));
      await loadFriendships();
    } catch (err) {
      console.error("Failed to accept friend request:", err);
    }
  };

  const handleRemove = async (f: Friendship & { id: string }) => {
    try {
      await removeFriendship(currentUid, getOtherUid(f));
      await loadFriendships();
    } catch (err) {
      console.error("Failed to remove friendship:", err);
    }
  };

  const handleAddFriend = async () => {
    const code = addCode.trim().toUpperCase();
    if (code.length !== 5) return;

    setAddStatus("loading");
    setAddError("");

    try {
      if (code === currentUserFriendCode) {
        setAddError("That's your own code!");
        setAddStatus("error");
        return;
      }

      const foundUid = await getFriendCodeOwner(code);
      if (!foundUid) {
        setAddError("Code not found");
        setAddStatus("error");
        return;
      }

      await sendFriendRequest(currentUid, foundUid);
      setAddStatus("success");
      setAddCode("");
      await loadFriendships();
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "already_exists") {
        setAddError("Already friends or request pending");
      } else {
        setAddError("Something went wrong. Try again.");
      }
      setAddStatus("error");
    }
  };

  const tabs: { id: TabId; label: string }[] = [
    {
      id: "friends",
      label: `Friends${acceptedFriendships.length > 0 ? ` (${acceptedFriendships.length})` : ""}`,
    },
    {
      id: "requests",
      label: `Requests${receivedRequests.length > 0 ? ` (${receivedRequests.length})` : ""}`,
    },
    { id: "add", label: "Add Friend" },
  ];

  const tabStyle = (id: TabId) => ({
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: activeTab === id ? "#1F4BFF" : "rgba(255,255,255,0.4)",
    borderBottom: activeTab === id ? "2px solid #1F4BFF" : "2px solid transparent",
  });

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Slide-in panel */}
      <div
        className="fixed top-0 right-0 z-50 h-full w-full max-w-sm flex flex-col border-l border-white/10 transition-transform duration-300"
        style={{
          background: "#0B1020",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
        aria-modal="true"
        role="dialog"
        aria-label="Friends"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b border-white/10 px-5 pb-4"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 16px)" }}
        >
          <h2
            className="text-lg font-bold text-white"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Friends
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close friends panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-3 text-xs font-semibold transition-colors"
              style={tabStyle(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {dataLoading && (
            <p
              className="text-center text-white/30 text-sm py-8"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Loading…
            </p>
          )}

          {/* ── Friends tab ─────────────────────────────────────────── */}
          {!dataLoading && activeTab === "friends" && (
            <>
              <p
                className="text-xs text-white/40 uppercase mb-2"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "2px",
                }}
              >
                {acceptedFriendships.length} friend
                {acceptedFriendships.length !== 1 ? "s" : ""}
              </p>
              {acceptedFriendships.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <p style={{ fontSize: "2rem" }}>👥</p>
                  <p
                    className="text-white/40 text-sm"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    No friends yet — add someone with their code!
                  </p>
                </div>
              ) : (
                acceptedFriendships.map((f) => {
                  const otherUid = getOtherUid(f);
                  const ud = userCache[otherUid];
                  return (
                    <div
                      key={f.id}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={ud?.photoURL ?? undefined} />
                        <AvatarFallback className="bg-white/10 text-white text-xs">
                          {ud?.displayName?.[0] ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-white font-semibold text-sm truncate"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {ud?.displayName ?? "…"}
                        </p>
                        <p
                          className="text-white/40 text-xs"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {ud?.friendCode ?? ""}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(f)}
                        className="p-2 rounded-lg text-white/30 hover:text-[#FF6A4D] transition-colors"
                        title="Remove friend"
                      >
                        <UserMinus size={16} />
                      </button>
                    </div>
                  );
                })
              )}
            </>
          )}

          {/* ── Requests tab ────────────────────────────────────────── */}
          {!dataLoading && activeTab === "requests" && (
            <div className="space-y-5">
              {/* Received */}
              <div>
                <p
                  className="text-xs text-white/40 uppercase mb-2"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "2px",
                  }}
                >
                  Received
                </p>
                {receivedRequests.length === 0 ? (
                  <p
                    className="text-white/30 text-sm"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    No incoming requests.
                  </p>
                ) : (
                  receivedRequests.map((f) => {
                    const otherUid = getOtherUid(f);
                    const ud = userCache[otherUid];
                    return (
                      <div
                        key={f.id}
                        className="flex items-center gap-3 p-3 rounded-xl"
                        style={{
                          backgroundColor: "rgba(31,75,255,0.1)",
                          border: "1px solid rgba(31,75,255,0.2)",
                        }}
                      >
                        <Avatar className="h-9 w-9 flex-shrink-0">
                          <AvatarImage src={ud?.photoURL ?? undefined} />
                          <AvatarFallback className="bg-white/10 text-white text-xs">
                            {ud?.displayName?.[0] ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-white font-semibold text-sm truncate"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          >
                            {ud?.displayName ?? "…"}
                          </p>
                          <p
                            className="text-white/40 text-xs"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            {ud?.friendCode ?? ""}
                          </p>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleAccept(f)}
                            className="px-3 py-1.5 rounded-lg text-white text-xs font-bold"
                            style={{
                              backgroundColor: "#1F4BFF",
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRemove(f)}
                            className="px-3 py-1.5 rounded-lg text-white/60 text-xs font-bold"
                            style={{
                              backgroundColor: "rgba(255,255,255,0.08)",
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Sent */}
              <div>
                <p
                  className="text-xs text-white/40 uppercase mb-2"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "2px",
                  }}
                >
                  Sent
                </p>
                {sentRequests.length === 0 ? (
                  <p
                    className="text-white/30 text-sm"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    No sent requests.
                  </p>
                ) : (
                  sentRequests.map((f) => {
                    const otherUid = getOtherUid(f);
                    const ud = userCache[otherUid];
                    return (
                      <div
                        key={f.id}
                        className="flex items-center gap-3 p-3 rounded-xl"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <Avatar className="h-9 w-9 flex-shrink-0">
                          <AvatarImage src={ud?.photoURL ?? undefined} />
                          <AvatarFallback className="bg-white/10 text-white text-xs">
                            {ud?.displayName?.[0] ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-white font-semibold text-sm truncate"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          >
                            {ud?.displayName ?? "…"}
                          </p>
                          <p
                            className="text-white/40 text-xs"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            Pending…
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(f)}
                          className="px-3 py-1.5 rounded-lg text-white/60 text-xs font-bold"
                          style={{
                            backgroundColor: "rgba(255,255,255,0.08)",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ── Add Friend tab ───────────────────────────────────────── */}
          {activeTab === "add" && (
            <div className="space-y-4 pt-2">
              <p
                className="text-white/50 text-sm"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Enter a 5-character friend code to add someone.
              </p>
              <input
                ref={addInputRef}
                type="text"
                value={addCode}
                onChange={(e) => {
                  const val = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 5);
                  setAddCode(val);
                  if (addStatus !== "idle") {
                    setAddStatus("idle");
                    setAddError("");
                  }
                }}
                placeholder="E.g. X9K2M"
                maxLength={5}
                className="w-full h-12 px-4 rounded-xl text-center text-base outline-none transition-colors"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.15)",
                  letterSpacing: "4px",
                }}
              />
              <button
                onClick={handleAddFriend}
                disabled={addCode.length !== 5 || addStatus === "loading"}
                className="w-full h-12 rounded-xl text-white font-bold text-sm disabled:opacity-40 transition-all hover:opacity-90"
                style={{
                  backgroundColor: "#1F4BFF",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {addStatus === "loading" ? "Sending…" : "Add Friend"}
              </button>
              {addStatus === "error" && addError && (
                <p
                  className="text-xs text-center"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: "#FF6A4D",
                  }}
                >
                  {addError}
                </p>
              )}
              {addStatus === "success" && (
                <p
                  className="text-xs text-center flex items-center justify-center gap-1 text-white/80"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <Check size={12} />
                  Friend request sent!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

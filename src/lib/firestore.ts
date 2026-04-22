// src/lib/firestore.ts
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─── Types ───────────────────────────────────────────────────────
export type UserStats = {
  displayName: string;
  photoURL: string | null;
  currentStreak: number;
  longestStreak: number;
  totalCorrect: number;
  totalAnswered: number;
  lastPracticeDate: string; // YYYY-MM-DD
  dailyStreak: number; // consecutive days practiced
  longestDailyStreak: number;
  updatedAt: Timestamp | null;
};

export type LeaderboardEntry = {
  uid: string;
  displayName: string;
  photoURL: string | null;
  longestStreak: number;
  totalCorrect: number;
  dailyStreak: number;
};

// ─── User Stats ──────────────────────────────────────────────────

const getUserRef = (uid: string) => doc(db, "users", uid);

export async function getUserStats(uid: string): Promise<UserStats | null> {
  const snap = await getDoc(getUserRef(uid));
  if (!snap.exists()) return null;
  return snap.data() as UserStats;
}

export async function initializeUserStats(
  uid: string,
  displayName: string,
  photoURL: string | null
): Promise<UserStats> {
  const existing = await getUserStats(uid);
  if (existing) {
    // Update display name and photo in case they changed
    await updateDoc(getUserRef(uid), { displayName, photoURL });
    return { ...existing, displayName, photoURL };
  }

  const newStats: UserStats = {
    displayName,
    photoURL,
    currentStreak: 0,
    longestStreak: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    lastPracticeDate: "",
    dailyStreak: 0,
    longestDailyStreak: 0,
    updatedAt: null,
  };

  await setDoc(getUserRef(uid), {
    ...newStats,
    updatedAt: serverTimestamp(),
  });

  return newStats;
}

export async function recordAnswer(
  uid: string,
  isCorrect: boolean,
  currentLocalStreak: number
): Promise<Partial<UserStats>> {
  const ref = getUserRef(uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return {};

  const data = snap.data() as UserStats;
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Calculate daily streak
  let dailyStreak = data.dailyStreak;
  if (data.lastPracticeDate !== today) {
    // First answer of the day
    if (data.lastPracticeDate === yesterday) {
      dailyStreak += 1; // Consecutive day
    } else if (data.lastPracticeDate !== today) {
      dailyStreak = 1; // Streak broken, restart
    }
  }

  const newLongestStreak = Math.max(data.longestStreak, currentLocalStreak);
  const longestDailyStreak = Math.max(data.longestDailyStreak, dailyStreak);

  const updates = {
    currentStreak: isCorrect ? currentLocalStreak : 0,
    longestStreak: newLongestStreak,
    totalCorrect: data.totalCorrect + (isCorrect ? 1 : 0),
    totalAnswered: data.totalAnswered + 1,
    lastPracticeDate: today,
    dailyStreak,
    longestDailyStreak: longestDailyStreak,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(ref, updates);
  return updates;
}

// ─── Leaderboard ─────────────────────────────────────────────────

export async function getLeaderboard(
  sortBy: "longestStreak" | "totalCorrect" | "dailyStreak" = "longestStreak",
  maxResults: number = 20
): Promise<LeaderboardEntry[]> {
  const q = query(
    collection(db, "users"),
    orderBy(sortBy, "desc"),
    limit(maxResults)
  );

  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    uid: doc.id,
    displayName: doc.data().displayName,
    photoURL: doc.data().photoURL,
    longestStreak: doc.data().longestStreak,
    totalCorrect: doc.data().totalCorrect,
    dailyStreak: doc.data().dailyStreak,
  }));
}

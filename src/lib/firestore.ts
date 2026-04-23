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
export type GameMode = "classic" | "random";

export type UserStats = {
  displayName: string;
  photoURL: string | null;
  totalCorrect: number;
  totalAnswered: number;
  lastPracticeDate: string; // YYYY-MM-DD
  dailyStreak: number; // consecutive days practiced
  longestDailyStreak: number;
  updatedAt: Timestamp | null;

  // Classic mode stats
  classicCurrentStreak: number;
  classicLongestStreak: number;

  // Random mode stats
  randomCurrentStreak: number;
  randomLongestStreak: number;
};

export type LeaderboardEntry = {
  uid: string;
  displayName: string;
  photoURL: string | null;
  classicLongestStreak: number;
  randomLongestStreak: number;
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
    await updateDoc(getUserRef(uid), { displayName, photoURL });
    return { ...existing, displayName, photoURL };
  }

  const newStats: UserStats = {
    displayName,
    photoURL,
    totalCorrect: 0,
    totalAnswered: 0,
    lastPracticeDate: "",
    dailyStreak: 0,
    longestDailyStreak: 0,
    updatedAt: null,
    classicCurrentStreak: 0,
    classicLongestStreak: 0,
    randomCurrentStreak: 0,
    randomLongestStreak: 0,
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
  currentLocalStreak: number,
  gameMode: GameMode
): Promise<Partial<UserStats> & { isNewPersonalRecord: boolean }> {
  const ref = getUserRef(uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return { isNewPersonalRecord: false };

  const data = snap.data() as UserStats;
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Calculate daily streak
  let dailyStreak = data.dailyStreak ?? 0;
  if (data.lastPracticeDate !== today) {
    if (data.lastPracticeDate === yesterday) {
      dailyStreak += 1;
    } else {
      dailyStreak = 1;
    }
  }

  const longestDailyStreak = Math.max(data.longestDailyStreak ?? 0, dailyStreak);

  const updates: Record<string, unknown> = {
    totalCorrect: (data.totalCorrect ?? 0) + (isCorrect ? 1 : 0),
    totalAnswered: (data.totalAnswered ?? 0) + 1,
    lastPracticeDate: today,
    dailyStreak,
    longestDailyStreak,
    updatedAt: serverTimestamp(),
  };

  let isNewPersonalRecord = false;

  if (gameMode === "classic") {
    const oldLongest = data.classicLongestStreak ?? 0;
    const newLongest = Math.max(oldLongest, currentLocalStreak);
    updates.classicCurrentStreak = isCorrect ? currentLocalStreak : 0;
    updates.classicLongestStreak = newLongest;
    isNewPersonalRecord = isCorrect && currentLocalStreak > oldLongest;
  } else {
    const oldLongest = data.randomLongestStreak ?? 0;
    const newLongest = Math.max(oldLongest, currentLocalStreak);
    updates.randomCurrentStreak = isCorrect ? currentLocalStreak : 0;
    updates.randomLongestStreak = newLongest;
    isNewPersonalRecord = isCorrect && currentLocalStreak > oldLongest;
  }

  await updateDoc(ref, updates);
  return { ...(updates as Partial<UserStats>), isNewPersonalRecord };
}

// ─── Leaderboard ─────────────────────────────────────────────────

export async function getLeaderboard(
  sortBy: "classicLongestStreak" | "randomLongestStreak" | "totalCorrect" | "dailyStreak" = "classicLongestStreak",
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
    photoURL: doc.data().photoURL ?? null,
    classicLongestStreak: doc.data().classicLongestStreak ?? 0,
    randomLongestStreak: doc.data().randomLongestStreak ?? 0,
    totalCorrect: doc.data().totalCorrect ?? 0,
    dailyStreak: doc.data().dailyStreak ?? 0,
  }));
}

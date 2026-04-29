// src/lib/firestore.ts
import {
  type DocumentData,
  type FirestoreError,
  type UpdateData,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  Timestamp,
  where,
  addDoc,
  increment,
  runTransaction,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─── Types ───────────────────────────────────────────────────────
export type GameMode = "classic" | "random";

export type DuelRequest = {
  duelId: string;
  challengerUid: string;
  challengerUsername: string;
  challengedUid: string;
  challengedUsername: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  mode?: GameMode;
  verbSeed: number;
  challengerScore: number | null;
  challengedScore: number | null;
  winnerId: string | null;
  createdAt: Timestamp;
  completedAt: Timestamp | null;
};

export type FriendEntry = {
  uid: string;
  displayName: string;
  photoURL: string | null;
  username: string;
  duelsWon: number;
  duelsLost: number;
};

export type UserStats = {
  displayName: string;
  photoURL: string | null;
  username?: string;
  handle?: string;
  duelsWon?: number;
  duelsLost?: number;
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

  // Friend code system
  friendCode?: string;
  friendCount?: number;
};

export type Friendship = {
  users: [string, string];
  status: "pending" | "accepted" | "rejected";
  initiator: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  }, { merge: true });

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

  const updates: UpdateData<DocumentData> = {
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

// ─── Username ─────────────────────────────────────────────────────

export async function setUsername(uid: string, username: string): Promise<void> {
  const batch = writeBatch(db);
  batch.set(doc(db, "usernames", username.toLowerCase()), { uid });
  batch.update(doc(db, "users", uid), { username });
  await batch.commit();
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  const snap = await getDoc(doc(db, "usernames", username.toLowerCase()));
  return snap.exists();
}

export async function isHandleTaken(handle: string): Promise<boolean> {
  const snap = await getDoc(doc(db, "handles", handle.toLowerCase()));
  return snap.exists();
}

export async function claimHandle(
  uid: string,
  handle: string
): Promise<"ok" | "taken" | "already_has_handle" | "auth_required" | "permission_denied" | "error"> {
  const normalizedHandle = handle.toLowerCase();
  const handleRef = doc(db, "handles", normalizedHandle);
  const usernameRef = doc(db, "usernames", normalizedHandle);
  const userRef = doc(db, "users", uid);

  try {
    await runTransaction(db, async (tx) => {
      const handleSnap = await tx.get(handleRef);
      const usernameSnap = await tx.get(usernameRef);
      const userSnap = await tx.get(userRef);

      const existingUserHandle = userSnap.exists() ? (userSnap.data()?.handle as string | undefined) : undefined;
      if (existingUserHandle && existingUserHandle !== normalizedHandle) {
        throw new Error("already_has_handle");
      }

      if (handleSnap.exists() && handleSnap.data()?.uid !== uid) {
        throw new Error("taken");
      }

      if (usernameSnap.exists() && usernameSnap.data()?.uid !== uid) {
        throw new Error("taken");
      }

      if (!handleSnap.exists()) {
        tx.set(handleRef, { uid, createdAt: serverTimestamp() });
      }

      if (!usernameSnap.exists()) {
        tx.set(usernameRef, { uid });
      }

      tx.set(
        userRef,
        {
          handle: normalizedHandle,
          username: normalizedHandle,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    });

    return "ok";
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "taken") return "taken";
    if (msg === "already_has_handle") return "already_has_handle";
    const firestoreError = e as FirestoreError | null;
    if (firestoreError?.code === "permission-denied") return "permission_denied";
    if (firestoreError?.code === "unauthenticated") return "auth_required";
    console.error("claimHandle error:", e);
    return "error";
  }
}

export async function getHandle(uid: string): Promise<string | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data()?.handle ?? null) : null;
}

export async function getUserByUsername(
  username: string
): Promise<{ uid: string; displayName: string; photoURL: string | null; username: string } | null> {
  const usernameSnap = await getDoc(doc(db, "usernames", username.toLowerCase()));
  if (!usernameSnap.exists()) return null;

  const { uid } = usernameSnap.data() as { uid: string };
  const userSnap = await getDoc(doc(db, "users", uid));
  if (!userSnap.exists()) return null;

  const data = userSnap.data();
  return {
    uid,
    displayName: data.displayName ?? "Unknown",
    photoURL: data.photoURL ?? null,
    username: data.username ?? username,
  };
}

// ─── Friend Codes ─────────────────────────────────────────────────

const FRIEND_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const FRIEND_CODE_LENGTH = 5;

export async function generateAndStoreFriendCode(uid: string): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = Array.from(
      { length: FRIEND_CODE_LENGTH },
      () => FRIEND_CODE_CHARS[Math.floor(Math.random() * FRIEND_CODE_CHARS.length)]
    ).join("");

    const codeRef = doc(db, "friendCodes", code);
    const userRef = doc(db, "users", uid);

    try {
      await runTransaction(db, async (tx) => {
        const codeSnap = await tx.get(codeRef);
        if (codeSnap.exists()) throw new Error("collision");
        tx.set(codeRef, { uid });
        tx.update(userRef, { friendCode: code });
      });
      return code;
    } catch (e: unknown) {
      if (e instanceof Error && e.message === "collision") continue;
      throw e;
    }
  }
  throw new Error("Could not generate unique friend code after 10 attempts");
}

export async function getFriendCodeOwner(code: string): Promise<string | null> {
  const snap = await getDoc(doc(db, "friendCodes", code.toUpperCase().trim()));
  return snap.exists() ? (snap.data().uid as string) : null;
}

// ─── Friendships ──────────────────────────────────────────────────

function friendshipId(uid1: string, uid2: string): string {
  return [uid1, uid2].sort().join("_");
}

export async function sendFriendRequest(fromUid: string, toUid: string): Promise<void> {
  if (fromUid === toUid) throw new Error("Cannot add yourself");
  const id = friendshipId(fromUid, toUid);
  const ref = doc(db, "friendships", id);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);

    if (snap.exists()) {
      const existing = snap.data() as Friendship;

      // If the other user already sent the request, treat this as acceptance.
      if (existing.status === "pending" && existing.initiator === toUid) {
        tx.update(ref, { status: "accepted", updatedAt: serverTimestamp() });
        return;
      }

      throw new Error("already_exists");
    }

    const sorted = [fromUid, toUid].sort() as [string, string];
    tx.set(ref, {
      users: sorted,
      status: "pending",
      initiator: fromUid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
}

export async function acceptFriendRequest(currentUid: string, otherUid: string): Promise<void> {
  const id = friendshipId(currentUid, otherUid);
  const ref = doc(db, "friendships", id);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("not_found");
    const data = snap.data() as Friendship;
    if (data.initiator === currentUid) throw new Error("cannot_accept_own");
    if (data.status === "accepted") return;
    tx.update(ref, { status: "accepted", updatedAt: serverTimestamp() });
  });
}

export async function rejectFriendRequest(currentUid: string, otherUid: string): Promise<void> {
  const id = friendshipId(currentUid, otherUid);
  const ref = doc(db, "friendships", id);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("not_found");
    const data = snap.data() as Friendship;
    if (data.initiator === currentUid) throw new Error("cannot_reject_own");
    tx.update(ref, { status: "rejected", updatedAt: serverTimestamp() });
  });
}

export async function removeFriendship(currentUid: string, otherUid: string): Promise<void> {
  const id = friendshipId(currentUid, otherUid);
  const ref = doc(db, "friendships", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  await deleteDoc(ref);
}

export async function getUserFriendships(uid: string): Promise<(Friendship & { id: string })[]> {
  const q = query(
    collection(db, "friendships"),
    where("users", "array-contains", uid)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Friendship) }));
}

// ─── Friends (legacy subcollection) ──────────────────────────────

export async function addFriend(uid: string, friendUid: string): Promise<void> {
  await setDoc(doc(db, "users", uid, "friends", friendUid), {
    uid: friendUid,
    addedAt: serverTimestamp(),
  });
}

export async function getFriends(uid: string): Promise<FriendEntry[]> {
  const friendsSnap = await getDocs(collection(db, "users", uid, "friends"));
  if (friendsSnap.empty) return [];

  const friendUids = friendsSnap.docs.map((d) => d.data().uid as string);
  const userSnaps = await Promise.all(friendUids.map((fuid) => getDoc(doc(db, "users", fuid))));

  return userSnaps
    .filter((s) => s.exists())
    .map((s) => ({
      uid: s.id,
      displayName: s.data()!.displayName ?? "Unknown",
      photoURL: s.data()!.photoURL ?? null,
      username: s.data()!.username ?? "",
      duelsWon: s.data()!.duelsWon ?? 0,
      duelsLost: s.data()!.duelsLost ?? 0,
    }));
}

// ─── Duels ────────────────────────────────────────────────────────

export async function sendDuelRequest(
  challengerUid: string,
  challengedUid: string,
  verbSeed: number,
  mode: GameMode
): Promise<string> {
  const [challengerSnap, challengedSnap] = await Promise.all([
    getDoc(doc(db, "users", challengerUid)),
    getDoc(doc(db, "users", challengedUid)),
  ]);

  const duelRef = await addDoc(collection(db, "duels"), {
    challengerUid,
    challengerUsername: challengerSnap.data()?.username ?? "unknown",
    challengedUid,
    challengedUsername: challengedSnap.data()?.username ?? "unknown",
    status: "pending",
    mode,
    verbSeed,
    challengerScore: null,
    challengedScore: null,
    winnerId: null,
    createdAt: serverTimestamp(),
    completedAt: null,
  });

  return duelRef.id;
}

export async function acceptDuel(duelId: string): Promise<void> {
  await updateDoc(doc(db, "duels", duelId), { status: "accepted" });
}

export async function rejectDuel(duelId: string): Promise<void> {
  await updateDoc(doc(db, "duels", duelId), { status: "rejected" });
}

export async function submitDuelScore(
  duelId: string,
  uid: string,
  score: number
): Promise<DuelRequest> {
  const duelRef = doc(db, "duels", duelId);

  return runTransaction(db, async (transaction) => {
    const duelSnap = await transaction.get(duelRef);
    if (!duelSnap.exists()) throw new Error("Duel not found");

    const data = duelSnap.data();
    const isChallenger = data.challengerUid === uid;
    const updates: UpdateData<DocumentData> = {
      [isChallenger ? "challengerScore" : "challengedScore"]: score,
    };

    const challengerScore = isChallenger ? score : (data.challengerScore ?? null);
    const challengedScore = !isChallenger ? score : (data.challengedScore ?? null);

    let resultStatus: DuelRequest["status"] = data.status;
    let winnerId: string | null = data.winnerId;

    if (challengerScore !== null && challengedScore !== null) {
      const resolvedWinnerId: string =
        challengerScore >= challengedScore ? data.challengerUid : data.challengedUid;
      winnerId = resolvedWinnerId;
      const loserId =
        resolvedWinnerId === data.challengerUid
          ? data.challengedUid
          : data.challengerUid;

      updates.status = "completed";
      updates.winnerId = resolvedWinnerId;
      updates.completedAt = serverTimestamp();
      resultStatus = "completed";

      transaction.update(doc(db, "users", resolvedWinnerId), { duelsWon: increment(1) });
      transaction.update(doc(db, "users", loserId), { duelsLost: increment(1) });
    }

    transaction.update(duelRef, updates);

    return {
      duelId,
      challengerUid: data.challengerUid,
      challengerUsername: data.challengerUsername,
      challengedUid: data.challengedUid,
      challengedUsername: data.challengedUsername,
      status: resultStatus,
      verbSeed: data.verbSeed,
      challengerScore,
      challengedScore,
      winnerId,
      createdAt: data.createdAt,
      completedAt: data.completedAt,
    } as DuelRequest;
  });
}

export async function getDuelHistory(uid: string): Promise<DuelRequest[]> {
  const [asChallenger, asChallenged] = await Promise.all([
    getDocs(query(collection(db, "duels"), where("challengerUid", "==", uid), limit(50))),
    getDocs(query(collection(db, "duels"), where("challengedUid", "==", uid), limit(50))),
  ]);

  const seen = new Set<string>();
  const results: DuelRequest[] = [];

  for (const snap of [asChallenger, asChallenged]) {
    for (const d of snap.docs) {
      if (!seen.has(d.id) && d.data().status === "completed") {
        seen.add(d.id);
        results.push({ duelId: d.id, ...d.data() } as DuelRequest);
      }
    }
  }

  return results;
}

export async function getPendingDuels(uid: string): Promise<DuelRequest[]> {
  const snap = await getDocs(
    query(collection(db, "duels"), where("challengedUid", "==", uid))
  );
  return snap.docs
    .filter((d) => d.data().status === "pending")
    .map((d) => ({ duelId: d.id, ...d.data() } as DuelRequest));
}

// Returns duels in "accepted" state where this user still needs to submit a score
export async function getActiveDuels(uid: string): Promise<DuelRequest[]> {
  const [asChallenger, asChallenged] = await Promise.all([
    getDocs(query(collection(db, "duels"), where("challengerUid", "==", uid), limit(50))),
    getDocs(query(collection(db, "duels"), where("challengedUid", "==", uid), limit(50))),
  ]);

  const seen = new Set<string>();
  const results: DuelRequest[] = [];

  for (const snap of [asChallenger, asChallenged]) {
    for (const d of snap.docs) {
      if (seen.has(d.id)) continue;
      const data = d.data();
      if (data.status !== "accepted") continue;
      const isChallenger = data.challengerUid === uid;
      const myScore = isChallenger ? data.challengerScore : data.challengedScore;
      if (myScore === null) {
        seen.add(d.id);
        results.push({ duelId: d.id, ...data } as DuelRequest);
      }
    }
  }

  return results;
}

// Returns pending/accepted duels where the user participates and has not finished lifecycle.
export async function getOpenDuels(uid: string): Promise<DuelRequest[]> {
  const [asChallenger, asChallenged] = await Promise.all([
    getDocs(query(collection(db, "duels"), where("challengerUid", "==", uid), limit(50))),
    getDocs(query(collection(db, "duels"), where("challengedUid", "==", uid), limit(50))),
  ]);

  const seen = new Set<string>();
  const results: DuelRequest[] = [];
  for (const snap of [asChallenger, asChallenged]) {
    for (const d of snap.docs) {
      if (seen.has(d.id)) continue;
      const data = d.data();
      if (data.status !== "pending" && data.status !== "accepted") continue;
      if (data.status === "accepted") {
        const isChallenger = data.challengerUid === uid;
        const myScore = isChallenger ? data.challengerScore : data.challengedScore;
        if (myScore !== null) continue;
      }
      seen.add(d.id);
      results.push({ duelId: d.id, ...data } as DuelRequest);
    }
  }
  return results;
}

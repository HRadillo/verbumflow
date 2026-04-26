// src/contexts/auth-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, googleProvider, initAnalytics, db } from "@/lib/firebase";
import {
  initializeUserStats,
  generateAndStoreFriendCode,
  type UserStats,
} from "@/lib/firestore";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  friendCode: string;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isGuest: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  friendCode: "",
  signInWithGoogle: async () => {},
  signOut: async () => {},
  isGuest: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [friendCode, setFriendCode] = useState<string>("");

  useEffect(() => {
    initAnalytics();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        // Async friend code initialization — does not block loading state
        (async () => {
          try {
            const snap = await getDoc(doc(db, "users", firebaseUser.uid));
            if (snap.exists()) {
              const data = snap.data() as UserStats;
              if (!data.friendCode) {
                const code = await generateAndStoreFriendCode(firebaseUser.uid);
                setFriendCode(code);
              } else {
                setFriendCode(data.friendCode);
              }
            } else {
              // New user — create document first, then generate friend code
              await initializeUserStats(
                firebaseUser.uid,
                firebaseUser.displayName ?? "Anonymous",
                firebaseUser.photoURL
              );
              const code = await generateAndStoreFriendCode(firebaseUser.uid);
              setFriendCode(code);
            }
          } catch (e) {
            console.error("Friend code init error:", e);
          }
        })();
      } else {
        setFriendCode("");
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      if (firebaseError.code === "auth/popup-closed-by-user") return;
      console.error("Sign-in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Sign-out error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        friendCode,
        signInWithGoogle,
        signOut,
        isGuest: !user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

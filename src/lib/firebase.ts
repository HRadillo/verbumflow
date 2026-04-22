// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDQVP_YQ1uNGhaZ7tY6km5S9d6n-HIyyas",
  authDomain: "verbumflowapp.firebaseapp.com",
  projectId: "verbumflowapp",
  storageBucket: "verbumflowapp.firebasestorage.app",
  messagingSenderId: "1055798539879",
  appId: "1:1055798539879:web:c595dc236322a5f28f46c2",
  measurementId: "G-8EKVQCESLM",
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Analytics — only in browser (not during SSR/build)
export const initAnalytics = async () => {
  if (typeof window !== "undefined" && (await isSupported())) {
    return getAnalytics(app);
  }
  return null;
};

export default app;

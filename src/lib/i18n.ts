// src/lib/i18n.ts

export type AppLanguage = "en" | "es";

export const LANGUAGE_STORAGE_KEY = "vf_language";

type TranslationKey =
  | "app.tagline"
  | "game.readyTitle"
  | "game.readySubtitle"
  | "game.start"
  | "game.tryAgain"
  | "game.streakBroken"
  | "game.correct"
  | "game.wrong"
  | "game.next"
  | "game.typeAnswer"
  | "game.chooseAnswer"
  | "game.timeExpired"
  | "game.casual"
  | "game.competitive"
  | "game.classic"
  | "game.random"
  | "leaderboard.title"
  | "leaderboard.classic"
  | "leaderboard.random"
  | "leaderboard.allTime"
  | "leaderboard.daily"
  | "onboarding.title"
  | "onboarding.subtitle"
  | "onboarding.continue"
  | "study.title"
  | "study.subtitle"
  | "study.practiceOnly"
  | "user.signIn"
  | "user.signOut"
  | "language.label"
  | "language.english"
  | "language.spanish";

const translations: Record<AppLanguage, Record<TranslationKey, string>> = {
  en: {
    "app.tagline": "LEARN AND COMPETE",
    "game.readyTitle": "Ready to streak?",
    "game.readySubtitle": "Conjugate fast. Stay sharp. Climb the board.",
    "game.start": "Start",
    "game.tryAgain": "Try Again",
    "game.streakBroken": "Streak broken.",
    "game.correct": "Correct",
    "game.wrong": "Wrong",
    "game.next": "Next",
    "game.typeAnswer": "Type your answer",
    "game.chooseAnswer": "Choose the correct answer",
    "game.timeExpired": "Time expired",
    "game.casual": "Casual",
    "game.competitive": "Competitive",
    "game.classic": "Classic",
    "game.random": "Random",
    "leaderboard.title": "Leaderboard",
    "leaderboard.classic": "Classic",
    "leaderboard.random": "Random",
    "leaderboard.allTime": "All-Time",
    "leaderboard.daily": "Daily",
    "onboarding.title": "Welcome to VerbumFlow",
    "onboarding.subtitle": "Practice French verbs through speed, streaks, and focus.",
    "onboarding.continue": "Continue",
    "study.title": "Study Mode",
    "study.subtitle": "Practice without timers, streaks, or pressure.",
    "study.practiceOnly": "Practice only",
    "user.signIn": "Sign in",
    "user.signOut": "Sign out",
    "language.label": "Language",
    "language.english": "English",
    "language.spanish": "Spanish",
  },
  es: {
    "app.tagline": "APRENDE Y COMPITE",
    "game.readyTitle": "¿Listo para tu racha?",
    "game.readySubtitle": "Conjuga rápido. Mantente preciso. Sube en la tabla.",
    "game.start": "Empezar",
    "game.tryAgain": "Intentar de nuevo",
    "game.streakBroken": "Racha perdida.",
    "game.correct": "Correcto",
    "game.wrong": "Incorrecto",
    "game.next": "Siguiente",
    "game.typeAnswer": "Escribe tu respuesta",
    "game.chooseAnswer": "Elige la respuesta correcta",
    "game.timeExpired": "Se acabó el tiempo",
    "game.casual": "Casual",
    "game.competitive": "Competitivo",
    "game.classic": "Clásico",
    "game.random": "Aleatorio",
    "leaderboard.title": "Tabla de posiciones",
    "leaderboard.classic": "Clásico",
    "leaderboard.random": "Aleatorio",
    "leaderboard.allTime": "Histórico",
    "leaderboard.daily": "Diario",
    "onboarding.title": "Bienvenido a VerbumFlow",
    "onboarding.subtitle": "Practica verbos en francés con velocidad, rachas y enfoque.",
    "onboarding.continue": "Continuar",
    "study.title": "Modo de estudio",
    "study.subtitle": "Practica sin temporizador, rachas ni presión.",
    "study.practiceOnly": "Solo práctica",
    "user.signIn": "Iniciar sesión",
    "user.signOut": "Cerrar sesión",
    "language.label": "Idioma",
    "language.english": "Inglés",
    "language.spanish": "Español",
  },
};

export function t(key: TranslationKey, language: AppLanguage): string {
  return translations[language][key];
}

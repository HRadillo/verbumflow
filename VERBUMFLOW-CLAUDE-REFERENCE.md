# VerbumFlow — Developer Reference

> French verb conjugation PWA with competitive streaks and leaderboards.  
> Stack: Next.js 15 + Firebase + Tailwind + shadcn/ui  
> Live: https://verbumflowapp.web.app | Repo: github.com/HRadillo/verbumflow

---

## ⛔ Never Touch
- `src/lib/verbs.ts` — verb data, rules, tips (92KB, read-only)
- `src/components/ui/*` — shadcn components
- Add new npm dependencies without explicit instruction

## ✅ Always Do
- `npm run build` must pass (`output: "export"`)
- All new components: `"use client"`
- All Firestore writes: `if (competitiveMode && user)` guard
- Keep `practiceOnly` prop compatible in `conjugation-practice.tsx`

---

## Brand Colors
| Token | Hex | Use |
|-------|-----|-----|
| Electric Blue | `#1F4BFF` | Primary actions, active states |
| Coral | `#FF6A4D` | Secondary, "flow" wordmark, wrong answers |
| Deep Ink | `#0B1020` | Background, dark text |
| Paper | `#FAFAF7` | Cards, light surfaces |
| Green | `#22C55E` | Correct answer feedback ONLY |

**Background:** `radial-gradient(ellipse at 0% 0%, rgba(31,75,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(255,106,77,0.15) 0%, transparent 50%), #0B1020`

## Fonts
- `'Plus Jakarta Sans'` — ALL UI text (headings, buttons, body, labels)
- `'JetBrains Mono'` — ONLY: tagline "LEARN AND COMPETE" + streak micro-labels

## Icons
- lucide-react only — no emoji in icon bar positions
- Top bar order: House → BookOpen → Share2 → HelpCircle → Trophy → Avatar

---

## Key Files
| File | Responsibility |
|------|---------------|
| `src/app/page.tsx` | Layout, state orchestration, overlay control |
| `src/app/layout.tsx` | AuthProvider, meta tags, PWA config |
| `src/app/components/conjugation-practice.tsx` | All game logic |
| `src/app/components/leaderboard.tsx` | 4-tab leaderboard modal |
| `src/app/components/onboarding.tsx` | First-run + tutorial overlay |
| `src/app/components/user-menu.tsx` | Top bar icons + avatar dropdown |
| `src/app/components/felicitations.tsx` | Record-breaking overlay |
| `src/app/components/study-mode.tsx` | Rules reference + practice mode |
| `src/contexts/auth-context.tsx` | Firebase Auth + useAuth hook |
| `src/lib/firebase.ts` | Firebase init |
| `src/lib/firestore.ts` | All DB reads/writes |

---

## Data Types
```typescript
type GameMode = "classic" | "random";
type GameState = "idle" | "playing" | "lost";

type UserStats = {
  displayName: string; photoURL: string | null;
  totalCorrect: number; totalAnswered: number;
  lastPracticeDate: string; // YYYY-MM-DD
  dailyStreak: number; longestDailyStreak: number;
  updatedAt: Timestamp | null;
  classicCurrentStreak: number; classicLongestStreak: number;
  randomCurrentStreak: number; randomLongestStreak: number;
};
```

---

## Game Logic
```
idle → [Start Streak] → playing → [wrong/timeout] → lost → [Try Again] → idle

Classic:  random verb → MC on 1 pronoun → fill-in all remaining pronouns → new verb
Random:   every question = random verb+tense+pronoun (no repeat in last 5)

Level-Up: questions 1-3 = multiple-choice → overlay → fill-in-the-blank only
Timer:    15s (Competitive only) → blue bar → coral last 3s → timeout shows answer+rule
Casual:   no timer, no Firestore writes, local streak only
```

## Leaderboard Tabs
`classicLongestStreak` | `randomLongestStreak` | `totalCorrect` (All-Time) | `dailyStreak`

## LocalStorage
- `vf_onboarded` — set on sign-in only, never for guests

---

## Firebase Config
```
Project ID: verbumflowapp
Auth: Google Sign-In
Hosting: public → "out" (static export)
Firestore: users/{uid} collection
```

## Deploy
- Auto-deploy on push to `main` via GitHub Actions
- Secret required: `FIREBASE_SERVICE_ACCOUNT_VERBUMFLOWAPP`
- Manual: `npm run build && firebase deploy`

---

## Pending (do not implement until instructed)
- Issue B: Full ES/EN i18n — UI + all rules/tips in `verbs.ts`
- Language toggle button (EN/ES)

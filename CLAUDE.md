# CLAUDE.md — VerbumFlow

## What This Project Is
VerbumFlow is a Progressive Web App (PWA) for practicing French verb conjugations through interactive flashcards. It is public-facing, free to use, and includes a donation option via PayPal. Users can sign in with Google to track progress, compete on a global leaderboard, and maintain daily streaks.

The app is built with Next.js, React, Tailwind CSS, and Firebase (Authentication, Firestore, Hosting).

---

## Target Audience
- French learners at all levels (A1–C1)
- Students preparing for exams like TCF, DELF, DALF
- Anyone who wants to practice conjugations on mobile or desktop

---

## Core Functionality

### Conjugation Practice (already built)
- Two modes: multiple choice and fill-in-the-blank
- After a correct multiple-choice answer, the app drills the same verb/tense in fill-in-the-blank with all remaining pronouns
- Incorrect answers re-queue the question for later review (spaced repetition lite)
- Each verb/tense pair has a **rule** (shown on correct answer) and a **tip** (shown on incorrect answer)
- Background gradient changes randomly on each new question

### Streak System (partially built)
- Current: local streak counter resets on wrong answer
- Planned: persistent streak tied to user account, daily streak tracking, longest streak record

### Leaderboard (planned)
- Global podium showing:
  - Longest streak without errors
  - Fastest time for X correct answers
- Requires Firebase Firestore
- Must be real-time or near-real-time

### User Authentication (planned)
- Google Sign-In via Firebase Authentication
- Guest mode must remain available (practice without signing in)
- User profile stores: display name, streak history, best scores

### PWA (planned)
- Service worker for offline support
- Web app manifest for installability
- App should work fully offline with cached verb data
- Must feel native on iOS Safari and Android Chrome

### Donations (planned)
- PayPal donation button
- Non-intrusive placement (footer or settings/about section)
- No payment processing in the app — PayPal handles everything externally

---

## Tech Stack
- **Framework**: Next.js 15 with Turbopack
- **UI**: React 18 + Tailwind CSS + shadcn/ui components
- **Backend**: Firebase (Auth, Firestore, Hosting)
- **Language**: TypeScript
- **Deploy**: Firebase Hosting via GitHub Actions

---

## Project Structure
```
src/
├── app/
│   ├── components/
│   │   └── conjugation-practice.tsx   ← Main practice component
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                       ← Home page
├── components/ui/                     ← shadcn/ui components
├── hooks/
├── lib/
│   ├── verbs.ts                       ← All verb conjugation data + rules
│   └── utils.ts
docs/
└── references/                        ← French conjugation books/PDFs for accuracy verification
```

---

## Verb Data Structure (Critical)
The verb data lives in `src/lib/verbs.ts` and follows this structure:

```typescript
verbData = {
  "verb_infinitive": {
    "Tense Name": {
      "pronoun": "conjugated_form"
    }
  }
}
```

### Supported Tenses
- Présent
- Imparfait
- Futur simple
- Passé composé
- Plus-que-parfait
- Conditionnel Présent
- Subjonctif Présent
- Impératif Présent

### Pronoun System
- Standard: je, tu, il/elle, nous, vous, ils/elles
- With elision: j' (before vowels/h muet)
- Subjunctive: que je, que tu, qu'il/elle, que nous, que vous, qu'ils/elles
- Imperative: only tu, nous, vous (no subject pronoun displayed)

### Rules and Tips
Each verb/tense pair can have:
- `rule`: grammatical explanation shown after correct answer
- `tip`: hint shown after incorrect answer
- Both are returned by the `getRule(verb, tense)` function

---

## Reference Materials
The `/docs/references` folder may contain PDFs or images from French conjugation textbooks. These serve as the **source of truth** for:
- Correct conjugation forms
- Accent placement (é, è, ê, ë, ç, etc.)
- Irregular verb patterns
- Auxiliary verb selection (être vs avoir for passé composé)

**When adding or modifying verb data, always cross-reference these materials if available.**

---

## Critical Rules

### Accuracy is Non-Negotiable
- French accents must be exact: é ≠ e, ç ≠ c, è ≠ e
- Auxiliary verbs in compound tenses must be correct (être for movement/reflexive verbs, avoir for the rest)
- Participe passé agreement rules must be respected
- Impératif forms must NOT include subject pronouns in the display

### User Experience
- App must be fast and responsive
- Animations should be smooth but not distracting
- Mobile-first design — most users will be on phones
- Offline mode must work for practice (verb data is local)
- Guest mode must always be available without sign-in

### Data Integrity
- Streak data must be tamper-resistant (validate server-side)
- Leaderboard scores must be verified, not self-reported
- User data must be private except for leaderboard display name and score

---

## Deployment
- Firebase Hosting with custom domain: `frances.aurumstudio.com.mx` (planned)
- GitHub Actions deploys automatically on merge to `main`
- No manual deploys

---

## Edge Cases to Handle
- Users switching between guest and signed-in mode
- Offline usage followed by sync when back online
- Verbs with identical conjugations across pronouns (e.g., je parle / il parle)
- Compound tenses where the auxiliary changes the answer length significantly
- Mobile keyboard covering the input field in fill-in-the-blank mode
- iOS Safari PWA limitations (no push notifications, limited service worker)

---

## Philosophy
This app exists to make French conjugation practice accessible, free, and enjoyable. It should feel like a game, not a chore. Every feature must serve the learner. Accuracy of linguistic content is paramount — a wrong conjugation taught is worse than no conjugation at all.

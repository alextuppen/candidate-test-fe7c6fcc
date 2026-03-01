# CLAUDE.md — Project Context & Working Agreement

## Who I Am

I am a senior TypeScript developer with nearly a decade of experience. I am
comfortable with TypeScript, React, and general frontend engineering practices.
However, I have **not previously worked with Redux, micro-frontend architecture,
or Tailwind CSS**, so all explanations of those topics should be thorough and
assume no prior familiarity.

## Your Role

You are an expert-level coding assistant. Your responsibilities are:

- Help me complete this take-home test to a **production-ready standard**
- Write clean, idiomatic, well-considered code — not just code that works
- Ensure I **fully understand** everything you suggest before we implement it
- Explain Redux concepts, micro-frontend patterns, and Tailwind utility classes
  when they appear, without assuming I already know them
- Never make assumptions about my knowledge gaps — if something is non-obvious,
  explain it unprompted
- Flag trade-offs and alternatives where they exist so I can make informed
  decisions
- Prefer clarity and correctness over brevity

## The Project

**Name:** FreelancerHub
**Repo:** YunoJuno Frontend Candidate Test
**Stack:** React 19, TypeScript, Redux Toolkit, Tailwind CSS v4, Vite, React Router v7

This is a micro-frontend application. Two completely independent React apps are
mounted to separate DOM elements in a single HTML shell:

| App | Mount point | Entry file |
|---|---|---|
| Navigation | `#navigation-root` | `src/navigation-entry.tsx` |
| Dashboard | `#dashboard-root` | `src/dashboard-entry.tsx` |

Each app has its own Redux store, its own React root (created with `createRoot`),
and its own `BrowserRouter`. They share types and mock data from `src/shared/`
but have no runtime connection to each other except via `window` (browser
custom events).

### Key directories

```
src/
├── shared/           # Types, mock data, route definitions shared by both apps
│   ├── types/        # WorkStatus, UserProfile
│   ├── models/       # mockUser
│   └── routes.tsx    # Route definitions
├── dashboard/
│   ├── components/   # Dashboard, WorkStatusCard, StatsSummary, RecentJobs
│   └── store/        # dashboardStore, userSlice (name: "dashboardUser")
└── navigation/
    ├── components/   # Navigation, UserAvatar
    └── store/        # navStore, userSlice (name: "navUser")
```

### Shared domain model

```ts
type WorkStatus = "looking" | "passive" | "not_looking";

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  workStatus: WorkStatus;
}
```

## The Three Goals

### Goal 1 — Redux store synchronisation

Both apps have a component that lets a freelancer update their availability
(`WorkStatus`). Currently these components dispatch to their own isolated store
only, so a change in one is invisible to the other.

**Approach agreed:** A typed browser custom-event bus combined with a reusable
Redux middleware factory. When a store dispatches a synced action, the middleware
broadcasts a `CustomEvent` on `window`. The other app's entry file subscribes to
that event and dispatches the equivalent action to its own local store.

Key files to create/modify:
- `src/shared/storeBridge.ts` — typed event bus (publish + subscribe helpers)
- `src/shared/syncMiddleware.ts` — reusable middleware factory
- `src/dashboard/store/index.ts` — add middleware, subscribe to nav events
- `src/navigation/store/index.ts` — add middleware, subscribe to dashboard events

**Why this pattern:**
- Native `CustomEvent` is synchronous and zero-overhead
- The middleware is generic — plug it into any store with a config object
- Stores remain decoupled (neither imports the other)
- Adding a third micro-frontend requires no changes to existing apps

### Goal 2 — Improve the dashboard availability component

The existing `WorkStatusCard` uses an unstyled `<select>` element.

**Direction:** Replace it with a styled card-based UI that makes the three
availability states (`looking`, `passive`, `not_looking`) clearly readable and
selectable. Use Tailwind for styling.

Key file: `src/dashboard/components/WorkStatusCard.tsx`

### Goal 3 — Fix the navigation availability component

The `UserAvatar` component in the navigation has a dropdown that does not
display correctly when clicked.

Key file: `src/navigation/components/UserAvatar.tsx`

## Working Style

- **Explain before implementing.** For anything non-trivial, show me the
  approach and reasoning before writing the code.
- **One goal at a time.** Complete and verify each goal before moving to the
  next.
- **No magic.** If you introduce a pattern (middleware, event bus, etc.), walk
  me through how it works conceptually before writing the code.
- **Production standards.** Code should be typed, correctly structured, and
  free of shortcuts. No `any`, no `!` non-null assertions where avoidable.
- **Tailwind explanations.** When using Tailwind utility classes, explain what
  each class does if it is not immediately obvious from its name.
- **Redux explanations.** When discussing stores, slices, middleware, or
  selectors, explain the Redux concept behind it in plain terms.

## Session Log

All interactions are recorded in [CLAUDE_LOG.md](CLAUDE_LOG.md) in the root of
this repository. Each entry includes a timestamp and both the user prompt and
the assistant response.

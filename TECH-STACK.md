# Tech Stack and Data Architecture: Personal Operating System

This document defines the technology choices, data storage strategy, sync architecture, and project structure for the Personal OS web app.

---

## 1. Tech Stack Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                     │
│                                                         │
│  Next.js App Router (React 18+)                         │
│  ├── Tailwind CSS (styling)                             │
│  ├── Framer Motion (animations)                         │
│  ├── Recharts (charts and graphs)                       │
│  ├── Dexie.js (IndexedDB - offline-first local storage) │
│  └── next-pwa (PWA installability)                      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                  Next.js Server (API)                    │
│                                                         │
│  API Routes / Server Actions                            │
│  ├── Prisma ORM (database access)                       │
│  ├── @google/generative-ai (Gemini API)                 │
│  └── Sync Engine (local ↔ cloud reconciliation)         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                    Cloud Database                        │
│                                                         │
│  PostgreSQL (Supabase free tier or Docker)               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 14+ (App Router) | Framework — pages, routing, API routes, server actions |
| React | 18+ | UI rendering |
| TypeScript | 5+ | Type safety across the entire codebase |
| Tailwind CSS | 3.4+ | Utility-first styling, design tokens from UI-DESIGN.md |
| Framer Motion | 11+ | Animations — score reveals, card transitions, timer ring |
| Recharts | 2+ | Charts — score trends, timelines, pie charts, bar charts |
| Dexie.js | 4+ | IndexedDB wrapper — offline-first local data storage |
| next-pwa | latest | PWA support — installable, offline shell, service worker |

### Backend

| Technology | Purpose |
|---|---|
| Next.js API Routes | Server-side endpoints — sync, AI calls, scoring |
| Next.js Server Actions | Direct server mutations from React components |
| Prisma | ORM — type-safe database queries, schema migrations |
| PostgreSQL | Cloud relational database |
| Supabase | Hosted Postgres with free tier (or Docker for local) |
| @google/generative-ai | Gemini API client — AI Coach, scoring, summaries |

### Tooling

| Tool | Purpose |
|---|---|
| pnpm | Package manager (fast, disk-efficient) |
| ESLint | Code quality |
| Prettier | Code formatting |
| Vercel | Deployment (free tier for personal use) |

---

## 2. Data Storage Architecture

### The Two-Layer Model

The app uses a **two-layer data architecture**:

```
┌──────────────────────────┐     ┌──────────────────────────┐
│    Layer 1: Local DB      │────▶│    Layer 2: Cloud DB      │
│    (Dexie.js/IndexedDB)   │◀────│    (PostgreSQL/Supabase)  │
│                          │     │                          │
│  • Primary during use     │     │  • Backup and persistence │
│  • Always available       │     │  • Cross-device sync      │
│  • Zero latency reads     │     │  • AI processing source   │
│  • Works fully offline    │     │  • Historical archive      │
└──────────────────────────┘     └──────────────────────────┘
```

**Layer 1 — Local (Dexie.js / IndexedDB):**
- This is the primary data store during active use.
- All reads and writes hit this layer first. The UI never waits for a network call.
- Timers, habit logs, schedule edits, journal entries — everything writes locally immediately.
- This is what makes the app feel instant and work offline.
- IndexedDB can store tens of thousands of records with no problem.

**Layer 2 — Cloud (PostgreSQL via Supabase):**
- This is the persistent backup and sync layer.
- Data flows here in the background when the user is online.
- The AI features read from cloud data (assembled into context packets).
- This layer enables future cross-device access and prevents data loss if the browser storage is cleared.

### Why This Design

| Requirement | How It Is Solved |
|---|---|
| App feels instant | All reads/writes are local IndexedDB — zero network latency |
| Works offline | Timer, habits, schedule, journal all work without internet |
| Data safety | Cloud DB backs everything up when online |
| AI features | Server reads cloud DB to build context for Gemini calls |
| Timer reliability | Timer state lives in IndexedDB + memory, never depends on network |
| Future cross-device | Cloud DB is the shared source of truth for syncing |

---

## 3. Database Schema

This schema applies to both layers. The local Dexie.js schema mirrors the cloud Prisma schema structurally. The cloud schema has additional sync metadata fields.

### Core Entities

#### User Settings

Stores app configuration, scoring targets, and preferences. Single row for this personal app.

```
UserSettings
├── id                    (primary key)
├── displayName           (string)
├── deepWorkTarget        (integer, minutes, default: 180)
├── skillBuildingTarget   (integer, minutes, default: 60)
├── goalWorkTarget        (integer, minutes, default: 180)
├── scoreThreshold        (integer, default: 70 — for consistency streak)
├── defaultDayType        (string, default: "work")
├── pomodoroWorkMinutes   (integer, default: 25)
├── pomodoroBreakMinutes  (integer, default: 5)
├── pomodoroLongBreak     (integer, default: 15)
├── pomodoroSessionsBeforeLong (integer, default: 4)
├── theme                 (string: "dark" | "light" | "system")
├── calibrationComplete   (boolean, default: false)
├── calibrationStartDate  (datetime, nullable)
├── createdAt             (datetime)
├── updatedAt             (datetime)
└── syncedAt              (datetime, nullable — cloud only)
```

#### Day Plan

One record per day. Represents the overall plan and summary for a single day.

```
DayPlan
├── id                    (primary key, UUID)
├── date                  (date, unique — YYYY-MM-DD)
├── dayType               (string: "work" | "school" | "weekend" | "recovery" | "travel" | "custom")
├── templateId            (foreign key → DayTemplate, nullable)
├── intention             (string, nullable — from Start My Day ceremony)
├── sleepHours            (float, nullable)
├── sleepQuality          (integer 1-5, nullable)
├── bedtime               (time, nullable)
├── wakeTime              (time, nullable)
├── morningEnergy         (integer 1-5, nullable)
├── overallEnergy         (integer 1-5, nullable — set in End My Day)
├── overallFocus          (integer 1-5, nullable — set in End My Day)
├── startedAt             (datetime, nullable — when Start My Day was completed)
├── endedAt               (datetime, nullable — when End My Day was completed)
├── status                (string: "planning" | "active" | "reviewing" | "closed")
├── createdAt             (datetime)
├── updatedAt             (datetime)
└── syncedAt              (datetime, nullable)
```

#### Day Template

Reusable schedule templates for different day types.

```
DayTemplate
├── id                    (primary key, UUID)
├── name                  (string — e.g., "Standard School Day")
├── dayType               (string)
├── deepWorkTarget        (integer, minutes — override for this template)
├── skillTarget           (integer, minutes)
├── goalTarget            (integer, minutes)
├── blocks                (JSON — array of template block definitions)
├── isDefault             (boolean)
├── createdAt             (datetime)
├── updatedAt             (datetime)
└── syncedAt              (datetime, nullable)
```

#### Time Block (Scheduled)

Planned blocks on the schedule.

```
TimeBlock
├── id                    (primary key, UUID)
├── dayPlanId             (foreign key → DayPlan)
├── title                 (string)
├── categoryId            (foreign key → Category)
├── startTime             (time — HH:MM)
├── endTime               (time — HH:MM)
├── isNonNegotiable       (boolean, default: false)
├── status                (string: "pending" | "in-progress" | "completed" | "skipped" | "moved")
├── goalId                (foreign key → Goal, nullable)
├── skillId               (foreign key → Skill, nullable)
├── sortOrder             (integer)
├── createdAt             (datetime)
├── updatedAt             (datetime)
└── syncedAt              (datetime, nullable)
```

#### Time Session (Tracked)

Actual tracked time — from timers, manual entry, or Pomodoro sessions.

```
TimeSession
├── id                    (primary key, UUID)
├── dayPlanId             (foreign key → DayPlan)
├── timeBlockId           (foreign key → TimeBlock, nullable — links to planned block)
├── title                 (string)
├── categoryId            (foreign key → Category)
├── startedAt             (datetime)
├── endedAt               (datetime, nullable — null if timer is running)
├── durationMinutes       (integer, computed or manual)
├── isManualEntry         (boolean, default: false)
├── energyLevel           (integer 1-5, nullable)
├── focusLevel            (integer 1-5, nullable)
├── notes                 (text, nullable)
├── goalId                (foreign key → Goal, nullable)
├── skillId               (foreign key → Skill, nullable)
├── isDistraction         (boolean, default: false)
├── distractionCategory   (string, nullable)
├── createdAt             (datetime)
├── updatedAt             (datetime)
└── syncedAt              (datetime, nullable)
```

#### Focus Session (Pomodoro)

Tracks individual Pomodoro intervals within a time session.

```
FocusSession
├── id                    (primary key, UUID)
├── timeSessionId         (foreign key → TimeSession)
├── intervalType          (string: "work" | "short-break" | "long-break")
├── durationMinutes       (integer)
├── completedAt           (datetime, nullable)
├── wasCompleted          (boolean — did the user finish the full interval?)
├── createdAt             (datetime)
└── syncedAt              (datetime, nullable)
```

#### Category

Activity categories used across time blocks and sessions.

```
Category
├── id                    (primary key, UUID)
├── name                  (string — e.g., "Deep Work", "Learning")
├── color                 (string — hex color)
├── icon                  (string — Material Symbol name)
├── isDistraction         (boolean, default: false — marks default distraction categories)
├── isDefault             (boolean — shipped with app)
├── sortOrder             (integer)
├── createdAt             (datetime)
└── syncedAt              (datetime, nullable)
```

#### Goal

```
Goal
├── id                    (primary key, UUID)
├── title                 (string)
├── description           (text, nullable)
├── type                  (string: "short-term" | "long-term")
├── status                (string: "active" | "paused" | "completed" | "abandoned")
├── targetDate            (date, nullable)
├── priority              (string: "high" | "medium" | "low")
├── isWeeklyFocus         (boolean, default: false — flagged as a weekly priority)
├── progressPercent       (integer 0-100)
├── createdAt             (datetime)
├── updatedAt             (datetime)
└── syncedAt              (datetime, nullable)
```

#### Goal Milestone

```
GoalMilestone
├── id                    (primary key, UUID)
├── goalId                (foreign key → Goal)
├── title                 (string)
├── isCompleted           (boolean, default: false)
├── completedAt           (datetime, nullable)
├── sortOrder             (integer)
├── createdAt             (datetime)
└── syncedAt              (datetime, nullable)
```

#### Skill

```
Skill
├── id                    (primary key, UUID)
├── name                  (string)
├── description           (text, nullable)
├── targetHours           (integer, nullable)
├── loggedHours           (float, computed from linked sessions)
├── level                 (string: "beginner" | "intermediate" | "advanced" | "expert")
├── nextMilestone         (string, nullable)
├── createdAt             (datetime)
├── updatedAt             (datetime)
└── syncedAt              (datetime, nullable)
```

#### Habit

```
Habit
├── id                    (primary key, UUID)
├── name                  (string)
├── description           (text, nullable)
├── type                  (string: "positive" | "negative")
├── frequency             (string: "daily" | "weekly" | "custom")
├── frequencyDays         (JSON, nullable — e.g., ["mon","tue","wed","fri"] for custom)
├── weight                (float, default: 1.0 — scoring weight)
├── isActive              (boolean, default: true)
├── currentStreak         (integer, default: 0)
├── longestStreak         (integer, default: 0)
├── goalId                (foreign key → Goal, nullable)
├── createdAt             (datetime)
├── updatedAt             (datetime)
└── syncedAt              (datetime, nullable)
```

#### Habit Log

One entry per habit per day.

```
HabitLog
├── id                    (primary key, UUID)
├── habitId               (foreign key → Habit)
├── dayPlanId             (foreign key → DayPlan)
├── date                  (date)
├── status                (string — positive: "done" | "missed" | "skipped")
│                         (string — negative: "relapsed" | "resisted" | "no-urge")
├── createdAt             (datetime)
├── updatedAt             (datetime)
└── syncedAt              (datetime, nullable)
```

#### Urge Event

Detailed tracking for negative habit urges.

```
UrgeEvent
├── id                    (primary key, UUID)
├── habitId               (foreign key → Habit)
├── dayPlanId             (foreign key → DayPlan)
├── occurredAt            (datetime)
├── intensity             (integer 1-5)
├── trigger               (string: "boredom" | "stress" | "tiredness" | "avoidance" | "social-pressure" | "notification" | "no-clear-next-step" | "other")
├── wasResisted           (boolean)
├── alternativeAction     (string, nullable — what user did instead)
├── notes                 (text, nullable)
├── createdAt             (datetime)
└── syncedAt              (datetime, nullable)
```

#### Journal Entry

```
JournalEntry
├── id                    (primary key, UUID)
├── dayPlanId             (foreign key → DayPlan)
├── date                  (date)
├── content               (text — rich text stored as HTML or markdown)
├── wentWell              (text, nullable)
├── wentWrong             (text, nullable)
├── improveTomorrow       (text, nullable)
├── mood                  (integer 1-5, nullable)
├── createdAt             (datetime)
├── updatedAt             (datetime)
└── syncedAt              (datetime, nullable)
```

#### Note (Second Brain)

```
Note
├── id                    (primary key, UUID)
├── title                 (string)
├── content               (text — rich text)
├── tags                  (JSON — array of strings)
├── goalId                (foreign key → Goal, nullable)
├── skillId               (foreign key → Skill, nullable)
├── journalEntryId        (foreign key → JournalEntry, nullable)
├── reviewStatus          (string: "new" | "learning" | "known")
├── nextReviewDate        (date, nullable — spaced repetition)
├── reviewCount           (integer, default: 0)
├── lastReviewedAt        (datetime, nullable)
├── createdAt             (datetime)
├── updatedAt             (datetime)
└── syncedAt              (datetime, nullable)
```

#### Daily Score

```
DailyScore
├── id                    (primary key, UUID)
├── dayPlanId             (foreign key → DayPlan)
├── date                  (date, unique)
├── computedScore         (float 0-100)
├── aiScore               (float 0-100, nullable)
├── aiScoreConfidence     (float 0-1, nullable)
├── aiVerdict             (text, nullable)
├── aiPositives           (JSON, nullable — array of strings)
├── aiNegatives           (JSON, nullable — array of strings)
├── aiTomorrowActions     (JSON, nullable — array of strings)
│
│   // Component Breakdown
├── scheduleAdherence     (float — points earned out of 25)
├── focusScore            (float — out of 20)
├── goalAlignmentScore    (float — out of 20)
├── habitScore            (float — out of 15)
├── skillScore            (float — out of 10)
├── reflectionScore       (float — out of 10)
├── distractionPenalty    (float — subtracted)
├── untrackedPenalty      (float — subtracted)
│
│   // Raw Data for Breakdown
├── plannedMinutes        (integer)
├── completedPlannedMin   (integer)
├── deepWorkMinutes       (integer)
├── goalLinkedMinutes     (integer)
├── skillBuildingMinutes  (integer)
├── distractionMinutes    (integer)
├── untrackedMinutes      (integer)
│
│   // Streak
├── consistencyStreak     (integer — consecutive days above threshold)
├── consistencyMultiplier (float — 1.0, 1.05, 1.10, 1.15, 1.20)
│
├── scoreBand             (string: "strong" | "solid" | "mixed" | "weak" | "off-track")
├── createdAt             (datetime)
├── updatedAt             (datetime)
└── syncedAt              (datetime, nullable)
```

#### AI Chat Message

```
AIChatMessage
├── id                    (primary key, UUID)
├── role                  (string: "user" | "assistant")
├── content               (text)
├── mode                  (string: "planning" | "accountability" | "review" | "coaching" | "general")
├── actionsTaken          (JSON, nullable — array of actions the AI performed)
├── contextSnapshot       (JSON, nullable — what data was sent to the AI)
├── createdAt             (datetime)
└── syncedAt              (datetime, nullable)
```

---

## 4. Sync Architecture

### How Sync Works

```
┌─────────────────┐                      ┌─────────────────┐
│  Dexie.js       │   Background Sync    │  PostgreSQL      │
│  (IndexedDB)    │ ──────────────────▶  │  (Supabase)      │
│                 │                      │                  │
│  Every write    │  Push changed rows   │  Receives and    │
│  sets syncedAt  │  where syncedAt is   │  stores all      │
│  = null         │  null                │  records          │
│                 │ ◀──────────────────  │                  │
│  Merge incoming │   Pull any cloud     │  Returns rows    │
│  changes        │   changes newer      │  updated since   │
│                 │   than last sync     │  last pull        │
└─────────────────┘                      └─────────────────┘
```

### Sync Rules

1. **Every local write sets `syncedAt = null`.** This marks the record as dirty (needs to be pushed to cloud).

2. **Background sync runs on a timer** (every 30 seconds when online) and on specific events (End My Day ceremony, manual sync button).

3. **Push phase:** The sync engine collects all local records where `syncedAt` is null, sends them to the server API route, which upserts them into PostgreSQL. On success, local records get their `syncedAt` updated.

4. **Pull phase:** The sync engine asks the server "give me everything updated since my last pull timestamp." The server returns changed rows. The local DB merges them in.

5. **Conflict resolution:** Last-write-wins based on `updatedAt` timestamp. If both local and cloud have changes to the same record, the one with the later `updatedAt` wins. This is simple and sufficient for a single-user app.

6. **Deleted records:** Soft deletes. Records get a `deletedAt` timestamp instead of being removed. The sync engine propagates soft deletes. Actual cleanup happens periodically.

### What Happens in Each Scenario

| Scenario | Behavior |
|---|---|
| Normal use (online) | Writes go to local DB instantly, sync pushes to cloud every 30s |
| Go offline | Writes continue to local DB with no interruption. Sync pauses. |
| Come back online | Sync resumes, pushes all dirty records, pulls any cloud changes |
| Browser data cleared | On next load, app pulls all data from cloud DB to rebuild local DB |
| AI features while offline | AI Coach shows "needs internet" message. All other features work. |
| Timer running during offline | Timer runs purely client-side. Session saved locally when stopped. Synced later. |

### Sync API Endpoints

```
POST /api/sync/push    — receives dirty local records, upserts to cloud
GET  /api/sync/pull    — returns records changed since a given timestamp
POST /api/sync/full    — full re-sync (used on first load or after browser data clear)
```

---

## 5. Local Storage Detail (Dexie.js)

### Why Dexie.js

- Wraps IndexedDB with a clean Promise-based API.
- Supports compound indexes for efficient queries (e.g., find all sessions for a date).
- Supports live queries — React components can subscribe to DB changes and re-render automatically.
- Works entirely in the browser, no server needed.
- Can store megabytes of data with no issues.

### Dexie Schema Definition

```typescript
import Dexie, { Table } from 'dexie';

class PersonalOSDB extends Dexie {
  userSettings!: Table;
  dayPlans!: Table;
  dayTemplates!: Table;
  timeBlocks!: Table;
  timeSessions!: Table;
  focusSessions!: Table;
  categories!: Table;
  goals!: Table;
  goalMilestones!: Table;
  skills!: Table;
  habits!: Table;
  habitLogs!: Table;
  urgeEvents!: Table;
  journalEntries!: Table;
  notes!: Table;
  dailyScores!: Table;
  aiChatMessages!: Table;

  constructor() {
    super('PersonalOSDB');
    this.version(1).stores({
      userSettings:    'id',
      dayPlans:        'id, date, status, syncedAt',
      dayTemplates:    'id, dayType, syncedAt',
      timeBlocks:      'id, dayPlanId, startTime, syncedAt',
      timeSessions:    'id, dayPlanId, categoryId, startedAt, syncedAt',
      focusSessions:   'id, timeSessionId, syncedAt',
      categories:      'id, name, isDefault, syncedAt',
      goals:           'id, status, priority, syncedAt',
      goalMilestones:  'id, goalId, syncedAt',
      skills:          'id, syncedAt',
      habits:          'id, type, isActive, syncedAt',
      habitLogs:       'id, habitId, date, dayPlanId, syncedAt',
      urgeEvents:      'id, habitId, dayPlanId, syncedAt',
      journalEntries:  'id, dayPlanId, date, syncedAt',
      notes:           'id, nextReviewDate, syncedAt',
      dailyScores:     'id, date, dayPlanId, syncedAt',
      aiChatMessages:  'id, createdAt, syncedAt',
    });
  }
}

export const db = new PersonalOSDB();
```

### How the UI Reads Data

Dexie provides `useLiveQuery` — a React hook that subscribes to IndexedDB and re-renders when data changes.

```typescript
// Example: Dashboard reads today's plan
const todayPlan = useLiveQuery(
  () => db.dayPlans.where('date').equals(todayDate).first()
);

// Example: Habit checklist for today
const todayHabitLogs = useLiveQuery(
  () => db.habitLogs.where('date').equals(todayDate).toArray()
);
```

This means:
- **Zero API calls for reads.** The UI reads directly from local IndexedDB.
- **Instant updates.** When a timer session is saved, the dashboard updates immediately.
- **No loading spinners** for local data.

---

## 6. Cloud Database (Prisma + PostgreSQL)

### Prisma Schema

The Prisma schema mirrors the local schema but lives in the cloud.

The schema file will be at `prisma/schema.prisma` and defines all models. Prisma generates TypeScript types from this schema, so the same types are used for both local and cloud operations.

### Database Hosting Options

**Option A: Supabase (Recommended for MVP)**
- Free tier: 500MB database, 50K monthly active users
- Hosted PostgreSQL, no server management
- Direct connection string for Prisma
- Built-in dashboard for inspecting data

**Option B: Docker (Local Development)**
- Run PostgreSQL in a Docker container locally
- Full control, no external dependency
- Good for development, not for production

**Option C: Vercel Postgres**
- Tight integration with Vercel deployment
- Small free tier

### Connection

```
DATABASE_URL="postgresql://user:password@host:5432/personalos?schema=public"
```

This is stored in `.env` (never committed to git).

---

## 7. AI Data Flow

The AI features need to assemble context from the database before calling Gemini.

### AI Context Assembly

When the AI Coach receives a message, the server-side handler:

1. Queries the cloud DB (or passes local data from the client) to assemble a context packet.
2. Sends the context + user message + system prompt to Gemini.
3. Returns the AI response to the client.

### Context Packet Structure

```typescript
interface AIContextPacket {
  // Current state
  currentTime: string;
  todayPlan: DayPlan;
  todayBlocks: TimeBlock[];
  todaySessions: TimeSession[];
  activeTimer: TimeSession | null;
  todayHabitLogs: HabitLog[];
  todayUrgeEvents: UrgeEvent[];

  // Goals and skills
  activeGoals: Goal[];
  weeklyFocusGoals: Goal[];
  skills: Skill[];

  // Recent context
  recentScores: DailyScore[];       // last 7 days
  recentJournalEntries: JournalEntry[]; // last 3 days
  currentStreak: number;

  // User configuration
  scoringTargets: {
    deepWorkTarget: number;
    skillTarget: number;
    goalTarget: number;
  };

  // Energy and sleep
  lastNightSleep: { hours: number; quality: number } | null;
  currentEnergy: number | null;
}
```

### AI Scoring Packet

For daily score generation, a separate packet is sent:

```typescript
interface AIScoringPacket extends AIContextPacket {
  computedScore: number;
  computedBreakdown: ScoreBreakdown;
  journalEntry: JournalEntry | null;
  scoringPhilosophy: string;  // the rules from MVP.md
}
```

### Gemini API Usage

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Called from API route — server-side only
// API key never reaches the browser
```

---

## 8. Timer Data Flow

The timer is the most latency-sensitive feature. Here's how data flows:

```
User clicks "Start Timer"
       │
       ▼
Client creates TimeSession in Dexie.js
  { startedAt: now, endedAt: null, ... }
       │
       ▼
React state tracks elapsed time (setInterval)
       │
       ▼
User clicks "Stop Timer"
       │
       ▼
Client updates TimeSession in Dexie.js
  { endedAt: now, durationMinutes: computed }
       │
       ▼
useLiveQuery subscribers re-render (dashboard, analytics)
       │
       ▼
Background sync pushes to cloud (next cycle)
```

**Key points:**
- Timer runs entirely in client memory + IndexedDB.
- Network is never in the critical path.
- If the app is closed during a timer, the `startedAt` timestamp is preserved in IndexedDB. On reopen, the app can calculate elapsed time and offer to resume or end the session.
- Pomodoro intervals are tracked as FocusSession children of the parent TimeSession.

---

## 9. Project Structure

```
personal-os/
├── public/
│   ├── icons/              # PWA icons
│   └── manifest.json       # PWA manifest
│
├── prisma/
│   └── schema.prisma       # Cloud database schema
│
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── layout.tsx      # Root layout (sidebar, bottom nav, theme)
│   │   ├── page.tsx        # Dashboard (home)
│   │   ├── schedule/
│   │   │   └── page.tsx    # Day Planner
│   │   ├── timer/
│   │   │   └── page.tsx    # Focus Session / Time Tracker
│   │   ├── habits/
│   │   │   └── page.tsx    # Habits screen
│   │   ├── goals/
│   │   │   └── page.tsx    # Goals screen
│   │   ├── skills/
│   │   │   └── page.tsx    # Skills screen
│   │   ├── journal/
│   │   │   └── page.tsx    # Journal screen
│   │   ├── notes/
│   │   │   └── page.tsx    # Second Brain / Notes
│   │   ├── analytics/
│   │   │   └── page.tsx    # Analytics screen
│   │   ├── ai-coach/
│   │   │   └── page.tsx    # AI Coach Chat
│   │   ├── ceremony/
│   │   │   ├── start/
│   │   │   │   └── page.tsx # Start My Day
│   │   │   └── end/
│   │   │       └── page.tsx # End My Day
│   │   ├── weekly/
│   │   │   └── page.tsx    # Weekly Planning
│   │   └── api/
│   │       ├── ai/
│   │       │   ├── chat/route.ts      # AI Coach chat endpoint
│   │       │   ├── score/route.ts     # AI scoring endpoint
│   │       │   └── summary/route.ts   # AI day/week summary
│   │       └── sync/
│   │           ├── push/route.ts      # Push local → cloud
│   │           ├── pull/route.ts      # Pull cloud → local
│   │           └── full/route.ts      # Full re-sync
│   │
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base components (Button, Card, Input, etc.)
│   │   ├── timer/           # Timer display, Pomodoro ring, controls
│   │   ├── schedule/        # Time blocks, timeline, time grid
│   │   ├── habits/          # Habit checklist, urge cards, streak dots
│   │   ├── score/           # Score display, breakdown, trend chart
│   │   ├── charts/          # Recharts wrappers for analytics
│   │   ├── ai/              # Chat bubbles, quick actions, context sidebar
│   │   ├── ceremony/        # Start/End My Day step components
│   │   └── layout/          # Sidebar, bottom nav, top bar, theme toggle
│   │
│   ├── lib/                 # Core logic
│   │   ├── db.ts            # Dexie.js database instance and schema
│   │   ├── prisma.ts        # Prisma client singleton
│   │   ├── sync.ts          # Sync engine (push, pull, conflict resolution)
│   │   ├── scoring.ts       # Computed score calculation logic
│   │   ├── timer.ts         # Timer state management
│   │   ├── ai-context.ts    # Assembles context packets for Gemini
│   │   └── spaced-review.ts # Spaced repetition scheduling logic
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useTimer.ts      # Timer hook with start/stop/pause
│   │   ├── useLiveData.ts   # Dexie live query wrappers
│   │   ├── useSync.ts       # Sync status and trigger
│   │   ├── useScore.ts      # Live score calculation
│   │   └── useOnlineStatus.ts # Network connectivity detection
│   │
│   ├── types/               # TypeScript types
│   │   └── index.ts         # Shared types for all entities
│   │
│   └── styles/
│       └── globals.css      # Tailwind base + custom styles
│
├── .env                     # Environment variables (not committed)
├── .env.example             # Template for env vars
├── tailwind.config.ts       # Tailwind config with design tokens
├── next.config.js           # Next.js config + PWA setup
├── tsconfig.json            # TypeScript config
├── package.json
└── pnpm-lock.yaml
```

---

## 10. Environment Variables

```bash
# .env (never committed to git)

# Database
DATABASE_URL="postgresql://user:password@host:5432/personalos"

# Gemini AI
GEMINI_API_KEY="your-gemini-api-key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 11. Running the App

### Development

```bash
# Install dependencies
pnpm install

# Set up the database
pnpm prisma generate    # Generate Prisma client types
pnpm prisma db push     # Push schema to database

# Seed default data (categories, templates)
pnpm prisma db seed

# Start development server
pnpm dev                # Runs on http://localhost:3000
```

### Production (Vercel)

```bash
# Build
pnpm build

# Deploy — push to GitHub, Vercel auto-deploys
git push origin main
```

### Production (Docker / Self-Host)

```bash
docker compose up       # Starts Next.js app + PostgreSQL
```

---

## 12. Default Seed Data

On first run, the database seeds with:

### Default Categories

| Name | Color | Icon | Is Distraction |
|---|---|---|---|
| Deep Work | #ec5b13 | code | No |
| Learning | #f59e0b | school | No |
| Exercise | #10b981 | fitness_center | No |
| Admin | #6366f1 | mail | No |
| Social | #8b5cf6 | group | No |
| Leisure | #06b6d4 | sports_esports | No |
| Distraction | #ef4444 | phone_android | Yes |
| Commute | #78716c | directions_car | No |
| Meals | #84cc16 | restaurant | No |
| Rest | #818cf8 | bedtime | No |

### Default Distraction Subcategories

Social Media, Video Content, Random Browsing, Messaging Drift, Gaming Drift, Idle / Wasted Time, Unplanned Entertainment, Context-Switching Overhead

### Default Day Templates

- **Work Day:** Morning routine → Deep work block 1 → Break → Deep work block 2 → Lunch → Admin/meetings → Skill-building → Exercise → Evening review
- **Weekend:** Flexible morning → Personal project → Exercise → Leisure → Light review

---

## 13. Data Retention and Privacy

- All data is stored locally first. The user owns their data.
- Cloud storage exists only for backup and AI processing.
- No data is shared with third parties (except Gemini API for AI features, which is subject to Google's API terms).
- Gemini API calls send only the assembled context packet — not raw database dumps.
- The user can export all data as JSON from settings.
- The user can delete all cloud data from settings (local data remains until browser storage is cleared).

---

Status: initial tech stack and data architecture document

Intent: this file defines how the app is built, how data flows, and how everything connects. It should be updated as implementation decisions evolve.

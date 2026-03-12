# UI and Design System: Personal Operating System

This document defines the visual design, theming, component system, layout architecture, and screen-by-screen UI specifications for the Personal OS web app.

It is mobile-first and responsive. The app should look and feel premium, clean, and motivating — not clinical or cluttered.

---

## 1. Design Philosophy

### Core Principles

- **Mobile-first, desktop-enhanced.** Every screen is designed for mobile viewports first, then expanded for tablet and desktop. Nothing should feel cramped on a phone or empty on a wide monitor.
- **Calm intensity.** The app deals with productivity and accountability, but the visual tone should be warm, focused, and encouraging — not aggressive or anxiety-inducing.
- **Glanceable by default, detailed on demand.** The most important data (score, current block, timer, habits) should be readable in under 2 seconds. Deeper analytics and breakdowns appear when the user taps into a section.
- **Low-friction interaction.** Every daily action (start timer, check habit, log energy) should be reachable in 1–2 taps from wherever the user is.
- **Dark mode as the primary experience.** The app will be used morning and night. Dark mode should feel native and refined, not like an afterthought inversion. Light mode is fully supported as an alternative.
- **Warm, not cold.** The color palette is built around warm oranges and deep browns rather than cold blues and grays. This makes the app feel personal and human.

### Visual Identity

The app should feel like a personal command center — like a high-end cockpit for the day. Think: the clarity of a well-designed fitness tracker meets the depth of a project management tool, wrapped in the warmth of a personal journal.

---

## 2. Color System

### Brand Color

The primary brand color is a vivid, warm orange.

| Token | Value | Usage |
|---|---|---|
| `primary` | `#ec5b13` | Primary actions, active states, brand accents, key indicators, timer ring, CTA buttons |
| `primary-hover` | `#d8510f` | Hover state for primary buttons and interactive elements |
| `primary-light` | `rgba(236, 91, 19, 0.10)` | Backgrounds for active nav items, soft highlight areas, badges |
| `primary-glow` | `rgba(236, 91, 19, 0.20)` | Glow effects around focused inputs, timer rings, active cards |

### Semantic Colors

| Token | Value | Usage |
|---|---|---|
| `success` | `#10b981` | Completed habits, positive trends, streaks, goal progress |
| `warning` | `#f59e0b` | Energy warnings, moderate alerts, in-progress states |
| `danger` | `#ef4444` | Relapsed habits, distraction time, critical alerts, score drops |
| `info` | `#3b82f6` | Informational badges, routine blocks, neutral category highlights |

### Dark Mode Palette (Primary)

| Token | Value | Usage |
|---|---|---|
| `background-dark` | `#1a1412` | Main page background |
| `surface-dark` | `#2a1f1b` | Cards, panels, elevated containers |
| `surface-dark-hover` | `#352a24` | Card hover states |
| `surface-dark-raised` | `#3d302a` | Modals, dropdowns, overlays |
| `border-dark` | `rgba(236, 91, 19, 0.10)` | Subtle card borders, dividers |
| `border-dark-strong` | `rgba(236, 91, 19, 0.20)` | Active card borders, focused inputs |
| `text-primary-dark` | `#f1f0ef` | Primary text on dark backgrounds |
| `text-secondary-dark` | `#94a3b8` | Secondary text, labels, metadata |
| `text-muted-dark` | `#64748b` | Tertiary text, timestamps, placeholders |

### Light Mode Palette

| Token | Value | Usage |
|---|---|---|
| `background-light` | `#f8f6f6` | Main page background |
| `surface-light` | `#ffffff` | Cards, panels, elevated containers |
| `surface-light-hover` | `#f1eeee` | Card hover states |
| `border-light` | `#e5e2e0` | Card borders, dividers |
| `border-light-strong` | `rgba(236, 91, 19, 0.30)` | Active card borders, focused inputs |
| `text-primary-light` | `#1a1412` | Primary text on light backgrounds |
| `text-secondary-light` | `#64748b` | Secondary text, labels |
| `text-muted-light` | `#94a3b8` | Tertiary text, timestamps |

### Category Colors

Each time-tracking category gets a distinct color used in timelines, pie charts, and block labels.

| Category | Color | Token |
|---|---|---|
| Deep Work | `#ec5b13` (primary) | `category-deep` |
| Learning | `#f59e0b` (amber) | `category-learning` |
| Exercise | `#10b981` (emerald) | `category-exercise` |
| Admin | `#6366f1` (indigo) | `category-admin` |
| Social | `#8b5cf6` (violet) | `category-social` |
| Leisure | `#06b6d4` (cyan) | `category-leisure` |
| Distraction | `#ef4444` (red) | `category-distraction` |
| Commute | `#78716c` (stone) | `category-commute` |
| Meals | `#84cc16` (lime) | `category-meals` |
| Rest / Sleep | `#6366f1` (indigo, lighter) | `category-rest` |

---

## 3. Typography

### Font Family

**Primary font:** Public Sans — a clean, geometric sans-serif with excellent readability at small sizes and strong personality at large sizes.

```
font-family: 'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale

| Role | Size | Weight | Usage |
|---|---|---|---|
| Display | 2rem (32px) | 800–900 (Extra Bold / Black) | Page titles like "Daily Planner", "Analytics" |
| Heading 1 | 1.5rem (24px) | 700 (Bold) | Section headers, score display |
| Heading 2 | 1.25rem (20px) | 700 (Bold) | Card titles, module headers |
| Heading 3 | 1rem (16px) | 600 (Semi-Bold) | Sub-section titles |
| Body | 0.875rem (14px) | 400 (Regular) | Default body text, descriptions, chat messages |
| Body Small | 0.75rem (12px) | 500 (Medium) | Secondary info, metadata, chart labels |
| Caption | 0.625rem (10px) | 700 (Bold) | Uppercase labels, tracking-widest, status badges, time stamps |

### Type Rules

- All uppercase labels use `letter-spacing: 0.1em` (tracking-widest) and font-weight 700.
- Numbers in scores, timers, and stats use font-weight 700–900 for maximum impact.
- Timer digits use `font-variant-numeric: tabular-nums` so they don't shift width during countdown.
- Line height for body text is 1.6. For headings it is 1.2.

---

## 4. Iconography

**Icon Set:** Material Symbols Outlined (Google)

```
font-family: 'Material Symbols Outlined';
font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
```

### Icon Rules

- Default state: outlined, weight 400.
- Active/selected state: filled (`FILL` 1) to visually distinguish active nav items and important states.
- Icon size matches text context: 20px for nav items, 24px for card headers, 16px–18px for inline icons.
- Icons always pair with text labels in navigation. Icon-only is acceptable only in compact mobile bottom bars and small action buttons.

### Key Icons by Screen

| Screen / Feature | Icon | Material Symbol Name |
|---|---|---|
| Dashboard | `dashboard` | dashboard |
| Schedule | `calendar_today` | calendar_today |
| Time Tracker | `timer` | timer |
| Focus Session | `filter_center_focus` | filter_center_focus |
| Goals | `ads_click` | ads_click |
| Skills | `military_tech` | military_tech |
| Habits | `checklist` | checklist |
| Journal | `edit_note` | edit_note |
| Second Brain | `neurology` | neurology |
| Analytics | `insights` | insights |
| AI Coach | `psychology` | psychology |
| Settings | `settings` | settings |
| Rescue My Day | `emergency` | emergency |
| Why Am I Stuck | `help_outline` | help_outline |
| Start My Day | `wb_sunny` | wb_sunny |
| End My Day | `nightlight` | nightlight |
| Energy Level | `bolt` | bolt |
| Sleep | `bedtime` | bedtime |
| Streak / Fire | `local_fire_department` | local_fire_department |
| Non-negotiable | `verified` | verified |
| Trend Up | `trending_up` | trending_up |
| Trend Down | `trending_down` | trending_down |

---

## 5. Spacing and Layout

### Spacing Scale

Use a 4px base unit. Common spacing values:

| Token | Value | Usage |
|---|---|---|
| `xs` | 4px | Tight gaps between inline elements |
| `sm` | 8px | Small padding, icon-to-text gaps |
| `md` | 12px | Default internal card padding on mobile |
| `lg` | 16px | Card gaps, section margins on mobile |
| `xl` | 24px | Card padding on desktop, section gaps |
| `2xl` | 32px | Page padding on desktop, major section spacing |
| `3xl` | 48px | Large section separators |

### Border Radius

| Token | Value | Usage |
|---|---|---|
| `sm` | 4px | Small badges, labels |
| `md` | 8px | Buttons, inputs, small cards |
| `lg` | 12px | Standard cards, panels |
| `xl` | 16px | Large cards, featured containers |
| `2xl` | 24px | Timer card, hero elements, chat bubbles |
| `full` | 9999px | Avatars, pills, circular buttons, progress bars |

### Grid System

- **Mobile (< 768px):** Single column. Full-width cards stacked vertically. Page padding 16px.
- **Tablet (768px – 1024px):** 2-column grid for dashboard cards. Sidebar collapses to icons only (80px wide).
- **Desktop (> 1024px):** 12-column grid. Sidebar expands to 256px with labels. Main content area uses 8-col + 4-col splits or full 12-col.
- **Max content width:** 1280px, centered. Prevents content from stretching too wide on ultrawide monitors.

---

## 6. Component Library

### 6.1 Cards

Cards are the primary container for every module, metric, and action group.

**Base Card:**
- Background: `surface-light` / `surface-dark`
- Border: 1px solid `border-light` / `border-dark`
- Border radius: `xl` (16px)
- Padding: 20–24px
- Shadow: `0 1px 2px rgba(0,0,0,0.05)` — very subtle
- Hover: border color shifts to `border-light-strong` / `border-dark-strong`

**Metric Card (small stat card):**
- Same as base card
- Top: uppercase caption label (10px, bold, tracking-widest, muted color)
- Middle: large number (32–40px, bold)
- Bottom: trend indicator or progress bar
- Used for: daily score, streak count, energy level, habit completion rate

**Featured Card (primary background):**
- Background: `primary` gradient
- Text: white
- Border radius: `xl`
- Shadow: `0 8px 24px rgba(236, 91, 19, 0.20)` — warm glow
- Used for: goal highlight, AI insight card, CTA panels

**Ghost Card (upcoming/pending):**
- Border: 2px dashed `border-light` / `border-dark`
- Opacity: 0.6
- Used for: pending schedule blocks, unstarted tasks

### 6.2 Buttons

**Primary Button:**
- Background: `primary`
- Text: white, 14px, bold
- Border radius: `lg` (12px)
- Padding: 12px 24px
- Shadow: `0 4px 12px rgba(236, 91, 19, 0.20)`
- Hover: slight opacity reduction (0.9) or scale(1.02)
- Used for: Start Timer, Add Block, Accept Plan, Send Message

**Secondary Button:**
- Background: `primary-light`
- Text: `primary`
- Border: 1px solid `primary` with 20% opacity
- Same radius and padding as primary
- Used for: Load Template, Export Data, secondary CTAs

**Ghost Button:**
- Background: transparent
- Border: 1px solid `border-light` / `border-dark`
- Text: secondary text color
- Hover: light surface color fill
- Used for: Cancel, Skip, View More

**Danger Button:**
- Background: `danger` with 10% opacity
- Text: `danger`
- Used for: Rescue My Day button

**Icon Button:**
- Circular or square with rounded corners
- Size: 40px or 48px
- Used for: timer play/pause/stop, settings gear, quick actions

### 6.3 Timer Display

The timer is the most visually prominent element in the app during active use.

**Pomodoro Timer (circular):**
- Large circular SVG ring (192px diameter on mobile, 240px on desktop)
- Outer ring: muted surface color
- Progress ring: `primary`, animated with `stroke-dashoffset`
- Center: time digits in monospace-like bold (48–56px), tabular nums
- Below digits: "OF 25:00" in small muted text
- Background: dark surface card (`slate-900` or `surface-dark`) to make the timer pop

**Simple Timer (inline):**
- Time digits displayed inline for non-Pomodoro tracking
- Paired with category label and session notes
- Used in the dashboard active session indicator

**Timer Controls:**
- Play/Pause: large circular primary button (64–80px)
- Reset: outlined circular button to the left
- Skip: outlined circular button to the right

### 6.4 Navigation

#### Desktop Sidebar

- Width: 256px expanded, 80px collapsed (tablet)
- Background: same as page background, separated by a subtle border
- App logo + name at top
- Nav items: icon + label, vertical stack, 48px row height
- Active item: `primary-light` background, `primary` text, filled icon
- Inactive items: muted text, outlined icons, hover shows `primary-light` background
- Bottom section: user avatar, streak counter, settings link
- The sidebar is fixed — it does not scroll with the page

#### Mobile Bottom Navigation

- Fixed at bottom of viewport
- Height: 64px
- 5 primary tabs: Dashboard, Schedule, Timer, Habits, AI Coach
- Active tab: `primary` icon (filled), small label below
- Inactive tabs: muted icons, no label or muted label
- A center-positioned primary action button (FAB) can be used for "Start Timer" or "Quick Log"

#### Mobile Top Bar

- Height: 56px
- Left: back arrow or hamburger menu
- Center: screen title
- Right: contextual action icons (e.g., calendar, settings)
- Sticky at top with backdrop blur

### 6.5 Progress Bars

**Standard Bar:**
- Height: 8px on mobile, 6px on desktop
- Background: muted surface
- Fill: colored by context (primary for general, success for habits, danger for distraction)
- Border radius: full (pill-shaped)

**Energy / Focus Rating Bar:**
- 5 segments, each a rounded pill
- Filled segments use `primary`, unfilled use muted surface
- Gap between segments: 4px
- Tap/click each segment to set the level

### 6.6 Timeline Bar

The full-day timeline is a critical visualization.

**Structure:**
- Horizontal bar representing the full day (wake to sleep)
- Height: 40px
- Each segment is a colored block by category
- Current time marker: vertical line with a pill badge showing the current time
- Future blocks shown with reduced opacity or dashed borders
- Legend below with category colors and durations

**Interactions:**
- Tap a segment to see the session details
- On desktop, hover shows a tooltip with session name, time, and category

### 6.7 Chat Bubbles (AI Coach)

**User Message:**
- Aligned right
- Background: `primary`
- Text: white, 14px
- Border radius: 16px with top-right corner squared (rounded-tr-none)
- Small avatar thumbnail to the right

**AI Message:**
- Aligned left
- Background: `surface-light` / `surface-dark`
- Border: 1px solid `border-dark`
- Border radius: 16px with top-left corner squared (rounded-tl-none)
- AI avatar icon (bolt or psychology icon in primary-tinted circle) to the left
- Can contain rich content: analysis cards, mini-charts, action buttons

**Quick Action Pills:**
- Horizontal scrollable row above the input
- Each pill: rounded-full, bordered, icon + label
- Examples: Rescue My Day, Why Am I Stuck?, Summarize Today, Plan Tomorrow

**Input Bar:**
- Rounded container (24px radius) with subtle border
- Attach button on left, text input in center, mic button and send button on right
- Send button: primary background, circular
- Focus state: subtle primary glow around the entire container

### 6.8 Habit Checklist

**Positive Habit Row:**
- Checkbox (rounded, primary color when checked) + label + streak dots
- Completed items: strikethrough text, reduced opacity, success checkmark icon
- Uncompleted: normal text

**Negative Habit Card:**
- Card with habit name, limit description, and current status badge
- Three action buttons in a grid: Relapsed (danger icon), Resisted (shield icon, primary), No Urge (happy face icon)
- Active selection gets primary border and background tint

### 6.9 Score Display

**Daily Score (large):**
- Number: 48–64px, bold, `primary` color
- "/ 100" suffix: smaller, muted
- Trend arrow with percentage: success or danger color
- Score band label below: "Strong Day", "Mixed Day", etc.

**Score Breakdown Card:**
- Each component shown as a labeled row with a mini progress bar
- Penalty rows shown in danger color
- Total at the bottom with the formula result

### 6.10 Schedule Blocks

**Standard Block:**
- Left colored border (4px) matching the category
- Padding: 12–16px
- Title: bold, 14–16px
- Time range: muted, 12px
- Category badge: small pill in top-right corner
- Status: checkmark icon for completed, clock for in-progress

**Non-Negotiable Block:**
- Same as standard but with a `verified` shield icon next to the title
- Slightly stronger border or primary-tinted background
- Visually distinct to signal importance

**Current Time Marker:**
- Horizontal line spanning the full schedule width
- Primary color
- Small pill badge at center showing current time
- Animates or pulses subtly

---

## 7. Screen Specifications

### 7.1 Dashboard (Active Day Mode)

This is the home screen during the day. It answers: "What should I be doing right now and how is the day going?"

**Mobile Layout (single column, top to bottom):**

1. **Top Bar:** "Active Mode" title, current focus label, Rescue My Day and Why Am I Stuck buttons
2. **Score + Streak + Energy Row:** Three small metric cards side by side (horizontally scrollable if needed)
   - Efficiency Score: large number, trend arrow
   - Consistency Streak: days count, streak dots
   - Energy Level: label (High/Medium/Low), horizontal bar
3. **Active Timer Card:** Dark background card with circular Pomodoro timer, current task name, pause/stop controls
4. **Today's Timeline:** Full-day horizontal bar with colored segments, current time marker, legend
5. **Quick Habit Checklist:** Card with today's habits, checkboxes, streak indicators
6. **AI Insight Card:** Gradient background with AI-generated contextual advice
7. **Spaced Repetition Review Card:** 1–3 notes due for review from Second Brain

**Desktop Layout (12-column grid):**

- Left 8 columns: Score row (3 metric cards), Timeline, AI Insight
- Right 4 columns: Active Timer, Habit Checklist, Second Brain review card

### 7.2 Dashboard (Review Mode / End of Day)

Accessed after ending the day or when viewing historical data.

**Key Sections:**

1. **Daily Score Card:** Large computed score + AI score side by side with breakdown
2. **Where Did My Day Go:** Full timeline + pie chart
3. **Planned vs Actual:** Comparison view of schedule blocks
4. **Habit Summary:** Completion rate, urges tracked
5. **Journal Entry Card:** Today's reflection or prompt to write one
6. **AI Day Summary:** AI-generated review with positive factors, negative factors, tomorrow suggestions

### 7.3 Schedule / Day Planner

**Header:**
- Page title: "Daily Planner"
- Date badge with day of week
- Capacity percentage indicator
- "Load Template" and "Add Block" buttons

**Tabs:** Today | Tomorrow | Upcoming

**Legend:** Planned vs Actual color indicators, non-negotiable toggle

**Schedule Grid:**
- Left column: time labels (hourly)
- Right column: time blocks as cards
- Current time marker cuts across the grid
- Completed blocks: normal styling
- In-progress blocks: primary left-border highlight
- Pending blocks: ghost/dashed style
- Non-negotiable blocks: verified icon badge

**Footer Stats:**
- Productive Time, Deep Work Sessions, Completion Rate, Remaining Tasks — four compact metric cards

### 7.4 Time Tracker / Focus Session

**Focus Session View:**

- Task selection at top
- Mode selector: Pomodoro (25/5) vs Deep Work (50/10) vs Custom — as radio cards
- Large circular timer in center on dark card
- Session category selector: grid of icon + label buttons
- Energy and Focus rating: segmented bar controls
- Session notes: text area
- Linked goal/skill indicator: featured card with progress bar

**Session History:**
- Below the timer, a scrollable list of today's completed sessions
- Each row: category color dot, task name, duration, time range

### 7.5 Habits Screen

**Overview Cards Row:**
- Daily Completion percentage
- Longest Streak with fire icon
- Urges Resisted this month with mini sparkline

**Positive Habits Section:**
- List of habit rows with checkboxes, names, streak counts
- "Add New" button

**Negative Habits / Urge Tracking Section:**
- Each negative habit is a card with:
  - Name and limit description
  - Status badge (High Urge / Safe / etc.)
  - Three action buttons: Relapsed, Resisted, No Urge
- Urge Frequency Trend: mini bar chart by day of week

**Trigger Log:**
- AI-identified trigger patterns shown as insight cards
- Example: "Late night scrolling often leads to missing morning meditation"

### 7.6 Goals Screen

**Goal List:**
- Each goal is a card with: name, type (short/long-term), deadline, progress bar, linked habits/skills count
- Priority goals highlighted with primary accent

**Goal Detail View:**
- Progress chart over time
- Linked activities, habits, and skill sessions
- Milestones list with completion status
- Time invested breakdown

### 7.7 Skills Screen

**Skill List:**
- Each skill: name, hours logged / target, progress bar, level label (Beginner, Intermediate, etc.)
- "Add New Skill Path" button at bottom

**Skill Detail View:**
- Hours progression chart
- Recent sessions linked to this skill
- Milestones and next milestone countdown
- AI recommendations for practice

### 7.8 Journal Screen

**Daily Entry View:**
- Date header
- Prompt suggestions: "What went well?", "What went wrong?", "What to improve tomorrow?"
- Rich text editor for writing
- Mood/energy tag selector
- Link to today's score and review

**Journal History:**
- Calendar or list view of past entries
- Each entry shows date, first line preview, mood tag, linked score

### 7.9 Second Brain / Notes

**Notes List:**
- Search bar at top
- Tags as filter pills
- Each note: title, first line preview, tags, creation date
- Spaced repetition indicator: badge showing "Review Due"

**Note Editor:**
- Rich text editing with basic formatting
- Tag assignment
- Link to goal, skill, or journal entry
- "Review Status" indicator for spaced repetition

**Review Queue:**
- Cards showing notes due for review
- "Got it" button to dismiss, "Review Again" to keep in rotation

### 7.10 Analytics Screen

**Header:** "Performance Analytics" title, date range selector, Export and Generate Report buttons

**Section Layout (desktop: 12-column grid):**

1. **Where Did My Day Go (8 cols):** Pie chart + full-day timeline + legend + most productive slot / distraction peak
2. **Smart Insights (4 cols):** Primary background card with AI-generated insight bullets
3. **Daily Score Trend (7 cols):** Bar chart showing last 30 days of scores, streak indicator
4. **Correlations (5 cols):** Sleep vs Score scatter plot, Energy by Hour bar chart
5. **Habit & Urge Tracking (8 cols):** Habit completion rate bars + resisted urges weekly chart
6. **Skill Progression (4 cols):** Skill cards with hours and progress bars

### 7.11 AI Coach Chat

**Layout:** Full-height chat interface, three-panel on desktop.

**Left Panel (sidebar):** Standard app navigation

**Center Panel (chat):**
- Header: "AI Coach" title with "Active Thinking" status badge
- Scrollable message area with user and AI bubbles
- AI messages can contain rich content: analysis cards with mini-charts, action buttons, structured recommendations
- Quick action pills above input: Rescue My Day, Why Am I Stuck, Summarize Today, Plan Tomorrow
- Input bar: attach button, text input, mic button, send button
- Keyboard shortcut hint: "Cmd+K for commands"

**Right Panel (context sidebar, desktop only):**
- Focus Stats: deep work time today, cognitive load indicator
- Upcoming Schedule: next 2–3 blocks
- Current session info if timer is running

### 7.12 Start My Day Ceremony

**Full-screen guided flow with steps. Each step is a card that fills the viewport on mobile.**

Steps:
1. **Sleep Log:** "How did you sleep?" — hours slider, quality rating (1-5 star or segmented bar)
2. **Energy Check:** "How's your energy?" — segmented bar (1–5)
3. **Today's Plan:** Review schedule blocks, option to load template, mark non-negotiables
4. **Priorities:** Confirm or adjust top 3 priorities for the day
5. **Habits Due:** Quick overview of today's habits
6. **Spaced Repetition Review:** 1–3 notes to review (skippable)
7. **Intention:** Single line text input — "What's your focus today?"
8. **Launch:** "Start Your Day" primary button, which begins tracking

Progress indicator at top showing which step the user is on.

### 7.13 End My Day Ceremony

**Same full-screen guided flow pattern.**

Steps:
1. **Block Review:** List of today's blocks — mark any unresolved as completed/skipped/moved
2. **Unlogged Time:** Flag any gaps — quick manual entry for missed sessions
3. **Habit Check:** Final check of all habits — done, missed, or urge resisted
4. **Energy & Focus:** Rate overall day energy and focus
5. **Journal:** Write reflection with prompts
6. **Score Reveal:** Animated reveal of computed score and AI score side by side, with breakdown
7. **AI Summary:** AI-generated day review with positives, negatives, and tomorrow suggestions
8. **Close Day:** "End Day" button

### 7.14 Weekly Planning Screen

**Layout:**

1. **Last Week Summary:** Score trend, habit completion rate, top achievements, AI summary
2. **Set Weekly Priorities:** Select up to 3 priority goals for the week
3. **Schedule Templates:** Choose a day template for each day of the upcoming week
4. **Target Adjustments:** Edit scoring targets per day type if needed
5. **AI Suggestions:** AI recommends focus areas and adjustments based on recent data
6. **Confirm:** Launch button that pre-populates each day

---

## 8. Responsive Behavior

### Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | < 768px | Single column, bottom nav, full-width cards |
| Tablet | 768px – 1024px | 2 columns, collapsed sidebar (icon-only), top nav optional |
| Desktop | > 1024px | 12-column grid, expanded sidebar, optional right context panel |

### Mobile-Specific Adaptations

- **Bottom navigation bar** replaces sidebar, 5 tabs
- **Floating action button (FAB)** for starting timer — always accessible
- **Swipe gestures:** swipe between dashboard, schedule, and habits on the main view
- **Pull-to-refresh** on dashboard to re-sync data
- **Cards stack vertically** with 16px gap
- **Timer is always accessible** via a persistent mini-bar at the top of the screen when a session is running and the user navigates away from the timer screen. Tapping it returns to the timer.
- **Chat input** pins to the bottom on AI Coach screen
- **Ceremony flows** are full-screen step-by-step, one card per step

### Tablet Adaptations

- Sidebar collapses to 80px (icons only)
- Dashboard uses 2-column grid
- Timer and habit checklist appear side by side

### Desktop Adaptations

- Full sidebar with labels
- 12-column grid layouts
- AI Coach gets a right context sidebar
- Analytics can show 2–3 charts side by side
- Modals for detail views instead of full-screen navigation

---

## 9. Animation and Motion

### Principles

- Motion should feel fast, purposeful, and smooth. Nothing should feel slow or flashy.
- Use motion to indicate state changes, not to decorate.
- All animations should be completable in 200–300ms.

### Key Animations

| Element | Animation | Duration |
|---|---|---|
| Card appearance (on page load) | Fade in + subtle rise (translateY 8px to 0) | 200ms |
| Timer ring progress | Smooth `stroke-dashoffset` transition | Continuous, linear |
| Timer digits change | No animation — instant swap with tabular nums | Instant |
| Score reveal (ceremony) | Count-up from 0 to final number | 800ms, ease-out |
| Habit checkbox | Scale bounce on check (1.0 → 1.15 → 1.0) | 200ms |
| Nav item active state | Background color crossfade | 150ms |
| Chat message appear | Fade in + slight slide from bottom (12px) | 200ms |
| Quick action pills scroll | Momentum-based horizontal scroll | Native |
| Modal/sheet open | Slide up from bottom on mobile, fade + scale on desktop | 250ms |
| Timeline current time marker | Gentle pulse animation on the pill badge | 2s loop, subtle |
| Primary button hover | `scale(1.02)` | 100ms |
| Streak fire icon | Subtle flicker/glow when streak is active | Continuous, very subtle |

### Reduced Motion

If the user has `prefers-reduced-motion: reduce` enabled, disable all animations except essential state changes (checkbox toggle, nav switch). Timer digits and score should still update, just without the animated transition.

---

## 10. Dark Mode and Theme Switching

### Dark Mode (Default)

- Page background: deep warm brown `#1a1412`
- Card surfaces: slightly lighter warm brown `#2a1f1b`
- Borders: `primary` at 10% opacity
- Text: warm off-white `#f1f0ef` for primary, slate-400 for secondary
- The warmth of the color palette carries through — this should never look like a cold gray dark mode

### Light Mode

- Page background: warm off-white `#f8f6f6`
- Card surfaces: white `#ffffff`
- Borders: warm gray `#e5e2e0`
- Text: deep warm brown `#1a1412` for primary, slate for secondary

### Theme Toggle

- Located in settings
- Respects system preference by default (`prefers-color-scheme`)
- User can override to force light or dark
- Transition between themes: instant or 200ms crossfade on the `<html>` element

---

## 11. Accessibility

### Requirements

- All interactive elements must be keyboard navigable.
- Focus indicators: 2px solid `primary` outline with 2px offset on all focusable elements.
- Color contrast: all text meets WCAG 2.1 AA (4.5:1 for body text, 3:1 for large text).
- Chart colors must be distinguishable with color blindness. Use patterns or labels in addition to color.
- All images and icons include accessible labels (alt text, aria-label).
- Timer countdown must be announced to screen readers on key events (start, pause, complete).
- Ceremony flows must be navigable with keyboard (Enter to proceed, Escape to go back).

### Touch Targets

- Minimum 44px × 44px for all interactive elements on mobile.
- Checkboxes: 24px visible box with 44px tap area.
- Buttons: minimum 44px height on mobile.

---

## 12. Loading and Empty States

### Loading States

- Skeleton screens: show card outlines with pulsing placeholder blocks that match the final layout shape.
- Timer page loads instantly from local data (offline-first).
- AI responses show a typing indicator (three animated dots in an AI bubble).

### Empty States

Each screen should have a meaningful empty state for first use:

| Screen | Empty State Message | CTA |
|---|---|---|
| Dashboard | "Your day starts here. Set up your first schedule to get going." | "Create Today's Plan" button |
| Schedule | "No blocks yet. Build your day or load a template." | "Add Block" or "Load Template" |
| Timer | "Ready to focus? Start your first session." | "Start Timer" |
| Habits | "No habits yet. Start building your first routine." | "Add Habit" |
| Goals | "Set a goal to start connecting your days to something bigger." | "Add Goal" |
| Skills | "Pick a skill to start tracking your growth." | "Add Skill" |
| Journal | "Today's page is blank. What's on your mind?" | "Start Writing" |
| Notes | "Capture your first idea or lesson." | "New Note" |
| Analytics | "Not enough data yet. Keep logging for a few days to see patterns." | Link to Dashboard |
| AI Coach | "Hey, I'm your AI coach. Ask me anything about your day, goals, or habits." | Pre-filled quick action pills |

---

## 13. Notification and Feedback Patterns

### Toast Notifications

- Appear at the top-center on mobile, top-right on desktop.
- Slide in from top, auto-dismiss after 3 seconds.
- Types: success (green), info (blue), warning (amber), error (red).
- Used for: habit logged, session saved, score calculated, template loaded.

### Inline Feedback

- Form validation: error text below the input in danger color.
- Successful saves: brief green checkmark animation inline.
- Timer completion: sound (optional) + visual pulse on the timer card + toast.

### AI Thinking Indicator

- When the AI is processing a response, show animated dots "..." in an AI message bubble.
- If the AI is taking an action (e.g., modifying the schedule), show a status message: "Updating your schedule..." with a spinner.

---

## 14. Offline Indicators

Since the app is offline-first, the user should know when they are offline and when syncing.

- **Offline banner:** Slim bar at the top of the screen (below the nav bar) with a cloud-off icon and "You're offline. Data is saved locally." message. Amber/warning color.
- **Sync indicator:** When back online, briefly show "Syncing..." with a spinning cloud icon, then dismiss.
- **AI unavailable state:** If offline, the AI Coach chat shows a soft message: "AI features need an internet connection. Your other tools work normally." The quick action pills are grayed out.

---

## 15. Design Tokens Summary

All values defined in this document should be implemented as CSS custom properties or Tailwind config theme extensions for consistency.

```
// Tailwind config theme extend
colors: {
  primary: '#ec5b13',
  'primary-hover': '#d8510f',
  'background-light': '#f8f6f6',
  'background-dark': '#1a1412',
  'surface-dark': '#2a1f1b',
  'surface-dark-hover': '#352a24',
  'surface-dark-raised': '#3d302a',
  'accent-success': '#10b981',
  'accent-warning': '#f59e0b',
  'accent-danger': '#ef4444',
  'accent-info': '#3b82f6',
  'category-deep': '#ec5b13',
  'category-learning': '#f59e0b',
  'category-exercise': '#10b981',
  'category-admin': '#6366f1',
  'category-social': '#8b5cf6',
  'category-leisure': '#06b6d4',
  'category-distraction': '#ef4444',
  'category-commute': '#78716c',
  'category-meals': '#84cc16',
  'category-rest': '#818cf8',
},
fontFamily: {
  display: ['Public Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
},
borderRadius: {
  DEFAULT: '0.25rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1.5rem',
  full: '9999px',
},
```

---

## 16. Next Design Steps

In future iterations, this document can be expanded with:

- Figma or wireframe links for each screen
- Exact pixel specifications for all components
- Interaction state tables (default, hover, focus, active, disabled) for every component
- Charting library selection and chart component specifications
- Notification sound design
- Haptic feedback rules for mobile
- PWA splash screen and app icon design
- Specific Tailwind class mappings for every component

---

Status: initial UI design specification

Intent: this file is the main design reference for building the frontend of the Personal OS web app. It should be updated as screens are built, tested, and refined.

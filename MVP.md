# MVP: Personal Operating System Web App

## 1. Working Title

Personal Operating System (temporary name)

This document is a living product spec for a web app designed to help the user structure days, stay consistent, reduce procrastination, break bad habits, build useful skills, and make measurable progress toward long-term goals.

As we keep discussing the product, this file should be updated with new workflows, design decisions, feature refinements, technical constraints, and roadmap changes.

## 2. Product Vision

Build a personal life-management web app that acts like a command center for daily execution, self-accountability, and long-term growth.

The app should help the user:

- plan each day clearly
- track how time is actually spent
- stay consistent with habits and routines
- align daily actions with goals and skill-building
- reflect through journaling and notes
- measure productivity and progress over time
- use AI to coach, analyze, and suggest improvements

## 3. Core Problem

The user is currently dealing with:

- poor day structure
- inconsistency
- procrastination
- bad habits that need to be removed or replaced
- weak visibility into where time is going
- difficulty linking daily behavior to long-term goals
- lack of an accountability system

Existing tools often solve only one part of the problem, such as tasks, journaling, habits, or notes, but not all of them together in one system.

## 4. Product Goal

Create one integrated system where planning, execution, tracking, reflection, and improvement all happen in the same place.

The app should answer these questions every day:

- What am I supposed to be doing today?
- What did I actually do today?
- Was today aligned with my goals?
- Am I improving or slipping?
- What habits are helping or hurting me?
- What should I change tomorrow?

## 5. Target User

Primary user: the app is initially being built for the user personally.

Potential future users:

- students trying to build discipline
- self-improvers tracking routines and focus
- creators, founders, or freelancers managing their own time
- people building skills intentionally over time

## 6. Product Principles

- Everything should connect back to goals, growth, and accountability.
- The app should show both plans and reality.
- Data entry should be fast enough to sustain daily use.
- Insights should be actionable, not just decorative.
- AI should support judgment, not replace it.
- Progress should be measurable across days, weeks, and months.
- The system should reveal patterns, not just store information.

## 7. High-Level Modules

The product will revolve around these modules:

1. Daily Schedule
2. Time Tracking
3. Focus Sessions (Pomodoro-Style Timer)
4. Goals Management
5. Skill Building Tracker
6. Habit Tracking
7. Daily Score / Productivity Score
8. Analytics Dashboard
9. Journal
10. Second Brain / Knowledge Capture
11. AI Coach powered by Gemini API (Chat Interface)
12. Energy and Focus Level Tracking
13. Sleep and Recovery Logging
14. Day Templates and Day Types
15. Start My Day / End My Day Ceremonies

## 8. Main User Outcomes

The user should be able to:

- create a plan for the day
- follow a structured routine
- start and stop tracked work sessions
- run focused Pomodoro-style work sessions
- categorize how time is spent
- connect activities to goals and skills
- log habits completed or missed
- track urges resisted for negative habits
- write daily reflections and thoughts
- capture ideas, lessons, and knowledge
- see a daily productivity score
- review trends and charts over time
- get AI-based feedback, summaries, and suggestions
- chat with the AI coach and have it take actions on the user's behalf
- log energy and focus levels throughout the day
- log sleep duration and quality
- use day templates for different day types
- run a guided Start My Day and End My Day ceremony
- plan the upcoming week with AI support
- mark schedule blocks as non-negotiable commitments
- ask the AI to rescue and restructure a derailed day
- see a full timeline view of where the entire day went
- benefit from offline-first data storage with sync when online

## 9. MVP Scope

The MVP should focus on the smallest version that creates a strong daily loop:

Plan -> Do -> Track -> Reflect -> Score -> Improve

### In Scope for MVP

#### 1. Daily Dashboard

- today's schedule
- today's active tasks or blocks
- quick start timer
- Pomodoro focus session launcher
- habit checklist
- current score snapshot
- quick journal prompt
- energy and focus level indicator
- sleep quality from last night
- Start My Day button for the morning ceremony
- End My Day button for the evening ceremony
- non-negotiable blocks highlighted

#### 2. Schedule / Day Planner

- create time blocks for the day
- label each block by category
- mark blocks as completed, skipped, or moved
- mark blocks as non-negotiable commitments
- compare planned time vs actual time
- load from day templates based on day type
- link blocks to goals, skills, or habits

#### 3. Time Tracking

- start/stop timer for activities
- Pomodoro focus session mode with configurable intervals
- manual time entry
- categories such as deep work, learning, exercise, leisure, admin, distraction
- optional notes per session
- energy and focus level rating per session
- daily and weekly summaries
- focus sessions completed count

#### 4. Goals

- create goals
- define goal type: short-term or long-term
- assign target dates
- link tasks, habits, or skills to a goal
- track status and progress

#### 5. Skill Building

- create a skill to improve
- set target hours, milestones, or study frequency
- link tracked sessions to skills
- show progress by hours, streaks, and milestones

#### 6. Habits

- create habits to build or reduce
- choose frequency: daily, weekly, custom
- log done, missed, or failed
- log urge resisted for negative habits
- track streaks and completion rate
- track urge frequency trends for habits being broken

#### 7. Journal

- write a daily journal entry
- optional prompts such as what went well, what went wrong, what to improve tomorrow
- link entries to mood, score, or day summary

#### 8. Daily Score

- calculate a score for each day
- show why the score is high or low
- track trend over time
- consistency multiplier for sustained streaks
- calibration period for the first two weeks

#### 9. Analytics

- daily, weekly, monthly charts
- time by category
- time by goal
- habit completion trends
- score trends
- planned vs actual time
- Where Did My Day Go full-day timeline and pie chart
- energy and focus patterns by hour
- sleep vs score correlation
- urge frequency trends for negative habits

#### 10. AI Assistant with Gemini API

- full chat interface where the user talks with the AI
- AI can both respond conversationally and take actions in the app
- summarize the day
- analyze time usage
- identify weak patterns
- suggest improvements for tomorrow
- help rewrite schedules or routines
- help reflect on journal entries
- Rescue My Day: restructure the remaining day when things go off-track
- Why Am I Stuck quick action button

#### 11. Energy and Focus Tracking

- log energy level on a 1 to 5 scale at the start of sessions or periodically
- log focus quality on a 1 to 5 scale per session
- track patterns over time to identify peak performance hours
- feed energy data into AI recommendations for scheduling

#### 12. Sleep and Recovery Logging

- log hours slept
- log sleep quality on a 1 to 5 scale
- optional bedtime and wake time
- correlate sleep data with daily score and productivity
- AI uses sleep data to adjust expectations and recommendations

#### 13. Day Templates and Day Types

- create reusable schedule templates for different day types
- day types such as school day, work day, weekend, recovery day
- each template has pre-filled blocks, categories, and default targets
- each day type can have its own scoring targets
- load a template to quickly populate the day's schedule

#### 14. Start My Day and End My Day Ceremonies

- Start My Day: guided morning flow to review plan, confirm priorities, check habits due, set energy level, set intention
- End My Day: guided evening flow to mark remaining blocks, log final habits, write journal, trigger score calculation, see AI summary
- both ceremonies are step-by-step guided flows, not just pages

#### 15. Commitment Blocks

- mark any schedule block as non-negotiable
- non-negotiable blocks carry extra weight in schedule adherence scoring
- missing a non-negotiable is a bigger score hit than missing a flexible block
- visually distinguished on the schedule

### Out of Scope for Initial MVP

- social features
- team collaboration
- complex gamification systems
- mobile app
- calendar sync with external services
- voice assistant
- advanced automation engine
- full knowledge graph for the second brain

These can be added later if the core loop proves useful.

### Technical Design Decisions for MVP

#### Offline-First Architecture

The app must work offline and sync when online.

- all data is stored locally first, in the browser or local database
- timers and session tracking must be fully reliable without network
- when connection is available, data syncs to the backend
- conflict resolution should favor the most recent local change
- the AI features require network, but all core tracking, scheduling, habits, journal, and scoring must work offline
- this is critical because the app is used all day and losing data from a network blip is unacceptable

## 10. Core Workflows

### Workflow 1: Planning the Day

1. User opens the app in the morning.
2. User taps Start My Day to begin the morning ceremony.
3. The app shows a guided flow: review today's plan, confirm priorities, check habits due, log last night's sleep, rate current energy level, set an intention for the day.
4. User creates or reviews today's schedule, loading from a day template if desired.
5. User assigns time blocks and categories.
6. User marks critical blocks as non-negotiable commitments.
7. User links some blocks to goals, habits, or skills.
8. User starts the day with a clear plan.

### Workflow 2: Tracking Time During the Day

1. User starts a timer when beginning an activity, or starts a Pomodoro focus session.
2. If using Pomodoro mode, the app runs timed intervals with break prompts.
3. User optionally rates focus and energy level for the session.
4. User stops the timer when done.
5. User adds a note or tags the session if needed.
6. The app records duration, category, focus sessions completed, and linked goal or skill.
7. Analytics update automatically.

### Workflow 3: Habit Logging

1. User checks in on habits throughout the day or at night.
2. User marks each positive habit as done, missed, or failed.
3. For negative habits, user logs done (relapsed), resisted urge, or no urge.
4. The app updates streaks, completion rate, urge frequency trends, and score inputs.

### Workflow 4: Evening Review

1. User taps End My Day to begin the evening ceremony.
2. The app shows a guided flow: mark remaining blocks, log final habits, review planned vs actual.
3. User writes a journal entry with optional prompts.
4. AI summarizes the day and highlights patterns.
5. The app generates the computed daily score and requests the AI score.
6. User sees both scores side by side with breakdowns.
7. User sees the consistency multiplier status and streak.
8. User sees what to improve tomorrow.

### Workflow 5: Weekly Review

1. User opens weekly analytics.
2. User reviews score trend, habits, time allocation, and goal progress.
3. AI identifies patterns such as consistent progress or recurring distractions.
4. User adjusts next week's system.

### Workflow 6: Weekly Planning Session

1. User opens the weekly planning view at the start of the week.
2. User reviews last week's scores, trends, and AI summary.
3. User sets this week's top 3 priority goals.
4. User reviews and adjusts skill-building targets for the week.
5. User selects day templates for each day of the upcoming week.
6. User adjusts scoring targets if needed for different day types.
7. AI suggests focus areas, habit adjustments, and scheduling ideas based on recent patterns.
8. User confirms the weekly plan and the system pre-populates each day's schedule.

### Workflow 7: Focus Session (Pomodoro)

1. User selects a task or activity to focus on.
2. User starts a Pomodoro focus session with chosen interval (25/5, 50/10, or custom).
3. The app runs a countdown timer for the work interval.
4. When the work interval ends, the app prompts a break.
5. User takes the break, then starts the next work interval.
6. After a set number of intervals, the app suggests a longer break.
7. The app records total focus sessions completed, total deep work time, and linked goal or skill.
8. Focus session count feeds into the daily score and analytics.

### Workflow 8: Rescue My Day

1. User realizes the day is off-track, maybe it is mid-afternoon and things have fallen apart.
2. User taps the Rescue My Day button or asks the AI in chat.
3. The AI reviews what was planned, what has been done so far, what was missed, and what time remains.
4. The AI builds a realistic restructured plan for the remaining hours, prioritizing the highest-impact actions.
5. User reviews the proposed rescue plan and accepts, modifies, or rejects it.
6. If accepted, the app updates the remaining schedule with the new plan.
7. This directly fights the "I already ruined today so why bother" procrastination spiral.

### Workflow 9: Sleep and Energy Logging

1. During Start My Day, user logs last night's sleep duration and quality.
2. Throughout the day, user optionally logs energy level per session or at key checkpoints.
3. The app tracks energy patterns over time.
4. Analytics show correlations between sleep, energy, and productivity score.
5. AI uses this data to suggest optimal scheduling and flag burnout risk.

## 11. Feature Details

### A. Schedule Module

Purpose: make the day intentional.

Key capabilities:

- time-blocking
- planned task list
- block categories
- status updates for each block
- planned vs actual comparison
- non-negotiable commitment blocks with higher scoring weight
- day templates that can be loaded per day type
- day types such as school day, work day, weekend, recovery day
- each day type carries its own default scoring targets

Questions this module should answer:

- Did I have a clear plan?
- Did I follow it?
- Where did the plan break?
- Did I protect my non-negotiable blocks?

### B. Time Tracking Module

Purpose: measure reality.

Key capabilities:

- live timer
- Pomodoro focus session mode with configurable intervals (25/5, 50/10, custom)
- focus session counter tracking how many intervals were completed
- manual session entry
- categories and subcategories
- notes and tags
- associations with goals, habits, and skills
- energy level rating (1 to 5) per session
- focus quality rating (1 to 5) per session

Questions this module should answer:

- Where did my time go?
- How much of my time was productive?
- What categories dominate my day?
- How many focus sessions did I complete?
- When is my energy and focus at its peak?

### C. Goals Module

Purpose: connect daily action to long-term direction.

Key capabilities:

- goals list
- progress tracking
- linked activities
- deadlines and milestones

Questions this module should answer:

- Are my days aligned with my goals?
- Which goals are being neglected?

### D. Skill Building Module

Purpose: help the user intentionally grow abilities over time.

Key capabilities:

- skill creation
- target hours or milestones
- linked study or practice sessions
- progress charts

Questions this module should answer:

- Am I spending enough time building useful skills?
- Which skills are advancing fastest?

### E. Habit Module

Purpose: build good habits and remove bad ones.

Key capabilities:

- positive and negative habits
- streak tracking
- completion rates
- frequency settings
- urge tracking for negative habits: log urge resisted, relapsed, or no urge
- urge frequency trends over time to see if cravings are declining
- trigger logging: what caused the urge (boredom, stress, tiredness, etc.)

Questions this module should answer:

- Which habits are getting stronger?
- Which bad habits still appear often?
- Am I resisting urges more frequently over time?
- What triggers my worst habits?
- Are my urge frequencies declining week over week?

### E2. Negative Habit Tracking Deep Dive

For habits the user wants to break, the standard done/missed/failed model is not enough.

The app should track negative habits with a different logging model:

#### Logging Options for Negative Habits

- **Relapsed**: the user gave in to the habit
- **Urge Resisted**: the user felt the pull but did not act on it
- **No Urge**: the user did not feel the urge at all today

This matters because resisting an urge is a win, and it should be tracked as progress even though the habit was not "completed" in the traditional sense.

#### Urge Tracking Data

Each urge event can store:

- time of day
- intensity (1 to 5)
- trigger category: boredom, stress, tiredness, avoidance, social pressure, phone notification, no clear next step
- whether it was resisted or not
- optional note about what the user did instead

#### What the App Should Show for Negative Habits

- urge frequency over time (should decrease as the habit weakens)
- resistance success rate (what percentage of urges were resisted)
- common triggers and times of day
- streak of clean days
- trend line showing declining urge intensity

#### Framing

The app should frame negative habit tracking as "patterns to understand" not "failures to punish."

Language examples:

- "3 fewer urges this week compared to last week"
- "You resisted 80 percent of urges this week"
- "Your most common trigger is boredom between 2 PM and 4 PM"

Not:

- "You failed 4 times this week"
- "You relapsed again"

### F. Journal Module

Purpose: build self-awareness and reflection.

Key capabilities:

- daily entries
- templates or prompts
- optional mood or energy tags
- connection to daily score and review

Questions this module should answer:

- What happened today beneath the numbers?
- What patterns keep repeating?

### G. Second Brain Module

Purpose: capture thoughts, ideas, lessons, principles, and useful knowledge.

MVP version:

- simple notes database
- tags and categories
- link notes to goals, skills, or journal entries
- quick capture flow
- spaced repetition: notes resurface at increasing intervals to reinforce learning

Spaced Repetition System:

- when a note is saved, it enters the review queue
- it re-appears on the daily dashboard after 1 day, 3 days, 7 days, 14 days, and 30 days
- user can mark a note as "got it" to stop resurfacing or "review again" to keep it in rotation
- this turns passive note-taking into active knowledge retention
- the daily dashboard shows a small "review this" card with 1 to 3 notes due for review

Future version:

- stronger linking between notes
- resurfacing relevant notes based on current context and goals
- AI summaries and insight extraction
- semantic search across all notes

### H. AI Coach Module

Purpose: turn raw data into useful guidance.

#### Interface: Chat

The AI Coach is accessed through a persistent chat interface. This is not a separate screen with buttons — it is a conversation. The user types or taps and the AI responds.

Critical design principle: the AI can both chat and take actions.

- Chat means respond conversationally: answer questions, give advice, explain patterns, motivate, challenge.
- Actions mean the AI can directly modify things in the app on the user's behalf: create schedule blocks, adjust targets, log a session, mark a habit, rewrite the remaining schedule, generate a rescue plan.

The AI should always confirm before taking a destructive or unexpected action. For routine actions requested by the user, it should just do them.

Examples of chat:

- "How was my week?" → AI gives a conversational summary with data
- "I'm procrastinating right now" → AI responds as an accountability partner
- "What should I focus on?" → AI checks goals, schedule, and energy to suggest

Examples of actions:

- "Move my study block to 4 PM" → AI moves the block in the schedule
- "Add 30 minutes of reading to my evening" → AI creates the block
- "Rescue my day" → AI generates and applies a restructured plan
- "Log that I just did 45 minutes of deep work on the Python project" → AI creates the time session
- "Mark my morning routine as done" → AI checks off the habit

#### Context the AI Always Has Access To

The AI should always have the full picture of the current state:

- today's planned schedule and current status of each block
- all tracked sessions so far today
- current timer status
- habits due today and their status
- active goals and priority goals for the week
- skill-building targets and progress
- recent daily scores and trends
- journal entries from recent days
- energy and focus levels logged today
- last night's sleep data
- current time of day

This is what makes it feel like a true assistant that knows the system, not a generic chatbot.

Possible AI actions:

- help plan the day
- help build and adjust the daily schedule
- suggest what to do today based on goals, priorities, and constraints
- summarize the day
- detect distractions or weak patterns
- suggest schedule improvements
- identify mismatch between goals and time use
- analyze journal sentiment and themes
- provide weekly review summaries
- coach the user on consistency
- act as an accountability partner in chat
- discuss current activity and whether it is aligned with the day
- help the user recover when the day goes off track
- help break down overwhelming goals into concrete next actions
- Rescue My Day: build a new plan for the remaining hours
- Why Am I Stuck: instant diagnosis based on current context, time, active block, recent sessions, and energy level

Important rule: AI suggestions must be transparent and grounded in actual logged data.

#### Why Am I Stuck Quick Action

A one-tap button available from the dashboard or the chat interface.

When tapped, the AI receives the current context:

- current time
- active block and how long the user has been on it
- recent sessions
- energy level
- the plan for the rest of the day

The AI returns a quick diagnosis and a single concrete next step.

Example response:

> You have been in this block for 40 minutes with no timer started. Your notes say you are avoiding the Python project. Break it into a 15-minute sub-task: just open the file and write the function signature. Start the Pomodoro timer for 25 minutes and commit to only that.

#### Rescue My Day Feature

When the day goes off-track, the user should not just see a bad score forming — they should get a path forward.

The Rescue My Day feature:

1. User triggers it via the dashboard button or by asking the AI in chat.
2. The AI reviews: what was planned, what has been done, what was missed, what time remains, current energy level.
3. The AI builds a realistic restructured plan for the remaining hours.
4. The plan prioritizes: non-negotiable blocks still pending, highest-impact goal work, critical habits, and minimum viable reflection.
5. The AI explains why it chose this plan.
6. User reviews and accepts, modifies, or rejects.
7. If accepted, the schedule updates with the rescue plan.

This directly fights the "I already ruined today so why bother" spiral by making recovery feel actionable and concrete.

### I. Energy and Focus Tracking Module

Purpose: understand when the user is at peak capacity and when they are depleted.

Key capabilities:

- log energy level on a 1 to 5 scale
- log focus quality on a 1 to 5 scale
- can be logged per session, or at periodic checkpoints
- energy and focus data feeds into analytics and AI recommendations

Questions this module should answer:

- When am I at my best during the day?
- Am I scheduling deep work during my peak energy hours?
- Is my energy declining over the week?
- What patterns affect my energy (sleep, exercise, breaks)?

How this connects to other modules:

- the AI coach can use energy data to suggest rescheduling deep work to peak hours
- the schedule module can eventually recommend optimal block placement based on energy history
- the scoring system can use energy context to understand why a day was weaker

### J. Sleep and Recovery Module

Purpose: track rest quality and understand how recovery affects performance.

Key capabilities:

- log hours slept each night
- log sleep quality on a 1 to 5 scale
- optional: log bedtime and wake time
- correlate sleep data with next day's score, energy, and focus
- show trends over time

Questions this module should answer:

- Am I sleeping enough?
- Does better sleep lead to better days?
- What is the minimum sleep I need to perform well?
- Am I in a recovery deficit?

How this connects to other modules:

- the AI can flag: "You slept under 6 hours. Consider lighter targets today."
- analytics can show sleep vs score scatter plot
- the scoring system can factor recovery context into the AI score judgment

### K. Start My Day and End My Day Ceremony Module

Purpose: formalize the daily loop into two structured rituals that reduce friction and ensure nothing is missed.

#### Start My Day Ceremony

This is a guided step-by-step morning flow, not just opening a page.

Steps:

1. Log last night's sleep duration and quality.
2. Rate current energy level.
3. Review today's planned schedule (or load a day template).
4. Confirm or adjust priorities for the day.
5. Review habits due today.
6. Check second brain notes due for spaced repetition review.
7. Set a short intention or focus statement for the day.
8. Start the day. Timer begins tracking from this point.

The entire ceremony should take 3 to 5 minutes.

#### End My Day Ceremony

This is a guided step-by-step evening flow.

Steps:

1. Mark any remaining planned blocks as completed, skipped, or moved.
2. Log any unlogged time sessions.
3. Log remaining habits as done, missed, or urge resisted.
4. Rate overall energy and focus for the day.
5. Write a journal entry with optional prompts: what went well, what went wrong, what to improve.
6. Trigger the score calculation. See computed score and AI score side by side.
7. Read the AI daily summary and recommendations.
8. Optionally, review one second brain note.
9. Close the day.

The evening ceremony is where the full feedback loop closes. It is the most important ritual in the app.

### L. Day Templates and Day Types Module

Purpose: reduce planning friction and make scoring fair across different kinds of days.

#### Day Types

A day type is a label that categorizes what kind of day it is.

Default day types:

- School Day
- Work Day
- Weekend
- Recovery Day
- Travel Day
- Custom

Each day type can have different default scoring targets. A weekend should not be penalized for less deep work if the user set lower expectations.

#### Day Templates

A day template is a reusable schedule that can be loaded to pre-populate a day's plan.

Each template contains:

- pre-filled time blocks with categories
- default non-negotiable blocks
- default habits active for that day type
- default scoring targets for deep work, skill-building, etc.

Workflow:

1. User creates templates like "Standard School Day" or "Saturday Recovery."
2. When planning a day, user selects a template.
3. The template fills in the schedule and targets.
4. User can modify the loaded template for that specific day without changing the template itself.

This means most days can be planned in under a minute.

### AI Assistant Responsibilities

The AI is not only a scoring layer. It is also an assistant and accountability partner.

For MVP, the AI should support four major modes:

#### 1. Planning Mode

The user can chat with the AI to decide how to structure the day.

Examples:

- What should I focus on today?
- Help me build today's schedule.
- I have 5 hours free, what should I prioritize?
- Rearrange my day because I started late.

The AI should use:

- current goals
- priority goals for the week
- scheduled commitments
- habits due today
- skill-building targets
- recent score trends
- recent distractions or weak patterns

#### 2. Live Accountability Mode

The user can chat with the AI during the day.

Examples:

- I am procrastinating right now.
- I do not know what to do next.
- I just spent 30 minutes scrolling.
- Should I keep working or take a break?

The AI should respond like an accountability partner:

- direct
- honest
- grounded in the current day's plan
- focused on the next best action

#### 3. Review Mode

The AI should help the user review the day.

Examples:

- summarize what happened today
- explain why the scores were high or low
- identify where the plan broke
- suggest what to change tomorrow

#### 4. Coaching Mode

The AI should help with bigger patterns over time.

Examples:

- recurring procrastination triggers
- weak routines
- bad habits that keep returning
- skill-building inconsistency
- mismatch between stated goals and actual time usage

### AI Chat Use Cases

The AI chat should support open-ended conversations about:

- planning the day
- restructuring the schedule
- deciding what to do next
- reviewing current activity
- discussing habits and discipline
- understanding why the user is stuck
- checking whether an activity is really productive
- reflecting on patterns across days or weeks

This should feel like an assistant that knows the user's system, not a generic chatbot.

## 12. Daily Score System

The app needs a daily productivity or accountability score.

This score should not be random or vague. It should be based on measurable signals.

### Scoring Philosophy

The score should measure whether the user actually lived in alignment with the day's plan and long-term priorities.

It should reward:

- doing important work
- following the plan reasonably well
- investing in goals and skill growth
- completing key habits
- reflecting honestly at the end of the day

It should penalize:

- excessive distraction time
- abandoning the day's priorities
- repeatedly skipping high-value habits
- having a plan but not following through

Important rule: the score is not meant to measure personal worth. It is a feedback signal about execution quality for that day.

### Example Input Factors

- schedule completion percentage
- deep work time completed
- total focused hours
- habit completion rate
- progress on top-priority goals
- time spent on skill building
- time spent on distractions or low-value activities
- journal completion

### Who Determines the Score

The user should not manually assign the main score like "today was 78 out of 100." The app should produce scores from actual behavior and logged data.

The best model is a dual-score system:

- a computed score generated deterministically by the app
- an AI score generated interpretively by Gemini using the same scoring philosophy

That means the user does not directly type the final score, but the user still controls the rules, targets, and context that both scores rely on.

### What the System Decides Automatically

The app should calculate these parts on its own:

- how much planned time was completed
- how much deep work was done
- how much time was linked to goals
- how many habits were completed
- how much skill-building time happened
- how much confirmed distraction happened
- how much untracked time exists
- the computed score and breakdown

The app does this by reading the user's schedule, time sessions, habit logs, goal links, and journal completion state.

The app should also assemble the full day context that the AI score uses:

- planned schedule
- actual tracked sessions
- linked goals and skills
- habit results
- journal text
- notes about interruptions, context, or edge cases

### What the User Configures

The user should be able to define the scoring context, not directly type the final score.

Examples of user-controlled settings:

- deep work target for the day
- skill-building target for the day
- which goals are top priority this week
- which habits matter most and their weights
- what categories count as deep work
- what categories count as distraction
- whether a given session was intentional leisure or distraction
- day type, such as school day, work day, weekend, recovery day

This gives the system enough structure to score fairly without making the score completely subjective.

### The Two Score Types

#### 1. Computed Score

This is the primary official score.

Characteristics:

- deterministic
- formula-based
- consistent across days
- easy to chart and compare
- best for trend analysis

This score should be the anchor for dashboards, graphs, streaks, and historical comparisons.

#### 2. AI Score

This is a secondary interpretive score.

Characteristics:

- uses the same philosophy and targets as the computed score
- reviews the day's full context more flexibly
- can judge whether logged work was actually high-value or merely busy
- can detect when an activity was technically logged but not really aligned with goals
- can account for nuance, such as difficult circumstances, recovery needs, or shallow work disguised as productivity

This score should not replace the computed score. It should sit beside it as a more context-aware evaluation.

### Why a Dual-Score Model Is Stronger

The computed score is fair because it is consistent.

The AI score is useful because it is flexible.

Example:

- computed score may say 82 because many blocks were completed
- AI score may say 68 because most completed blocks were low-leverage admin work and very little time went to the real priority

The reverse can also happen:

- computed score may say 61 because the day deviated from the plan
- AI score may say 74 because the deviation was justified and still moved an important goal forward

That tension is valuable. It gives both objective structure and contextual judgment.

### Practical Scoring Flow

The scores should be generated in this order:

1. user defines or confirms today's targets, priorities, and planned blocks
2. user logs sessions, habits, and reflection during the day
3. system classifies tracked data into categories such as focus, goals, skills, distraction, and untracked gaps
4. system calculates each computed score component separately
5. system applies penalties and produces the computed score
6. app sends the same day context, scoring philosophy, and formulas to Gemini
7. Gemini returns an AI score, explanation, and reasoning about alignment, quality, and truthfulness of effort
8. system shows both scores side by side with breakdowns and reasons

### Why the User Should Not Set the Score Manually

If the user can simply type their own score, the score loses meaning.

The point of the system is to create honest feedback based on behavior, not mood alone.

The AI score is a much better second layer than manual self-rating because it can use the same philosophy but interpret the day more intelligently.

Optional self-ratings can still exist for reflection, but they should remain separate from both main scores.

Good examples of optional manual inputs:

- self-rated effort
- self-rated mood
- self-rated discipline
- perceived productivity

These can still be useful, but they should not replace either the computed score or the AI score.

### Recommended MVP Approach

For MVP, the best design is:

- system-generated computed score
- AI-generated secondary score
- user-configurable targets and weights
- optional manual self-rating stored separately for reflection only

This gives the app both structure and flexibility.

### Rules for the AI Score

The AI score should follow strict rules.

- it must use the same scoring philosophy as the computed score
- it can reinterpret categories when the data suggests the raw classification is misleading
- it must explain why its score differs from the computed score
- it should cite the main reasons, such as shallow work, true goal alignment, justified deviations, or poor-quality focus
- it should never invent activity that is not present in the logged data
- it should not silently override the computed score; the two scores must remain visible separately

### What the AI Should Evaluate Differently

The AI score is most valuable when evaluating questions the formula handles poorly.

Examples:

- Was the tracked work actually meaningful, or just busywork?
- Did the day truly support the user's stated goals?
- Was a schedule deviation reasonable or avoidant?
- Was a long break healthy recovery or disguised procrastination?
- Did the user spend time on a skill in a shallow or serious way?

This is where AI adds value: not by replacing measurement, but by interpreting quality and alignment.

### AI Scoring Prompt Contract

The actual AI scoring prompt had not been fully defined yet. The spec should define it now.

The AI should receive a structured scoring packet containing:

- computed score
- computed component breakdown
- schedule for the day
- tracked sessions with labels, notes, and durations
- goals and which ones are marked high priority
- skills and skill-building targets
- habit results
- journal entry or reflection text
- distraction sessions
- untracked time summary
- any user-provided context about exceptions, illness, emergencies, or recovery needs

### AI Scoring Prompt Objectives

The AI prompt should instruct Gemini to do all of the following:

1. use the same scoring philosophy as the computed score
2. evaluate the true quality and alignment of the day's activity
3. decide whether some logged activity was genuinely productive, shallow, avoidant, or misclassified
4. produce an AI score from 0 to 100
5. explain why the AI score differs from the computed score
6. identify the main drivers of the day
7. suggest the most important adjustments for tomorrow

### AI Scoring Prompt Constraints

The AI prompt should explicitly tell Gemini:

- do not invent missing facts
- do not ignore the formulas and philosophy provided
- do not punish justified recovery or legitimate constraints unfairly
- do not reward busywork just because time was logged
- do not collapse into generic advice
- be honest when the day was weak
- be fair when the day was difficult but still meaningful

### Suggested AI Scoring Output Format

The AI scoring response should return structured fields such as:

- AI score
- confidence level
- short verdict
- top positive factors
- top negative factors
- reasons for difference from computed score
- classification corrections, if any
- tomorrow recommendations

### Example AI Scoring Prompt Shape

This is a product-level prompt shape, not final implementation wording.

```text
You are evaluating a user's day using the same philosophy as the computed productivity score.

Your job is not just to total minutes. Your job is to judge how aligned, truthful, and meaningful the day was.

You must:
- respect the provided scoring philosophy and targets
- review the day's planned schedule, actual sessions, goals, skills, habits, journal, distraction logs, and untracked time
- determine whether the logged work was genuinely productive and aligned with priorities
- produce an AI score from 0 to 100
- explain the difference between the computed score and the AI score
- identify whether any activities appear misclassified
- suggest the most important actions for tomorrow

You must not invent facts or treat unlogged assumptions as true.

Output:
- ai_score
- confidence
- verdict
- positives
- negatives
- differences_from_computed_score
- suspected_misclassifications
- tomorrow_actions
```

### Relationship Between AI Score and AI Assistant Role

The same AI system should both score and assist, but these are different responsibilities.

- scoring mode is evaluative and structured
- planning mode is collaborative and forward-looking
- accountability mode is conversational and corrective
- coaching mode is reflective and pattern-based

This matters because the app should not use one vague chatbot behavior for everything. Each mode should have a clear job.

### Proposed MVP Score Model

For the MVP, use a 0 to 100 score made from weighted components.

#### Component Weights

- Schedule Adherence: 25 points
- Focus and Deep Work: 20 points
- Goal Alignment: 20 points
- Habit Completion: 15 points
- Skill Building: 10 points
- Reflection and Review: 10 points

Total positive score available before penalties: 100 points

Distraction is handled as a penalty layer, not a positive component.

### Component Definitions

#### 1. Schedule Adherence: 25 points

Measures how closely actual behavior matched the planned day.

Suggested formula:

$$
S_{schedule} = 25 \times \min\left(1, \frac{M_{completed\ planned\ weighted}}{M_{planned\ weighted}}\right)
$$

Rules:

- only count meaningful planned blocks, not every tiny task
- skipped or heavily delayed important blocks reduce this score
- moved blocks can still count if completed within the same day
- non-negotiable commitment blocks carry double weight in this calculation
- missing a non-negotiable block is a significantly bigger hit than missing a flexible block
- this incentivizes the user to protect their most important scheduled time

#### 2. Focus and Deep Work: 20 points

Measures how much concentrated work was done.

Suggested formula:

$$
S_{focus} = 20 \times \min\left(1, \frac{M_{deep\ work}}{M_{deep\ work\ target}}\right)
$$

Rules:

- deep work should come from tracked sessions in high-value categories
- target is personalized, for example 120 to 240 minutes depending on the user
- going above target should cap at full points, not inflate the score unfairly

#### 3. Goal Alignment: 20 points

Measures whether time went to top-priority goals.

Suggested formula:

$$
S_{goals} = 20 \times \min\left(1, \frac{M_{top\ goal}}{M_{goal\ target}}\right)
$$

Rules:

- top goals should be explicitly marked for the current week or day
- only time linked to active goals should count
- random busyness should not earn full credit

#### 4. Habit Completion: 15 points

Measures whether key habits were completed.

Suggested formula:

$$
S_{habits} = 15 \times \frac{H_{completed\ weighted}}{H_{planned\ weighted}}
$$

Rules:

- habits can have different weights, for example morning routine may matter more than reading 10 minutes
- missed positive habits reduce score
- completed negative habits, such as doomscrolling or junk bingeing if tracked, can trigger penalties instead of just missing points

#### 5. Skill Building: 10 points

Measures time invested in intentional learning or practice.

Suggested formula:

$$
S_{skills} = 10 \times \min\left(1, \frac{M_{skill}}{M_{skill\ target}}\right)
$$

Rules:

- only sessions linked to defined skills count
- this keeps skill growth visible even on days dominated by routine work

#### 6. Reflection and Review: 10 points

Measures whether the day was closed properly.

Suggested scoring:

- 4 points for writing a journal entry
- 3 points for reviewing planned vs actual time
- 3 points for completing the end-of-day review prompt

This part is intentionally smaller than execution metrics, but still matters because reflection improves the next day.

### Distraction Penalty Layer

Distraction should subtract from the positive score instead of becoming its own category that can dominate the whole system.

Suggested formula:

$$
S_{daily} = \max\left(0, S_{positive} - P_{distraction} - P_{untracked}\right)
$$

Where:

$$
S_{positive} = S_{schedule} + S_{focus} + S_{goals} + S_{habits} + S_{skills} + S_{reflection}
$$

And the distraction penalty should also use an escalating model:

$$
P_{distraction} = \min\left(20, \sum_{i=1}^{B_{distraction}} d_i\right)
$$

Where:

$$
B_{distraction} = \max\left(0, \left\lfloor \frac{M_{distraction}}{15} \right\rfloor \right)
$$

- $M_{distraction}$ is the total number of confirmed distraction minutes in the day
- $B_{distraction}$ is the number of full 15-minute distraction blocks
- $d_i$ is the penalty weight for the $i$th distraction block

Suggested default for MVP:

- blocks 1 to 2: 2 points each
- blocks 3 to 4: 3 points each
- blocks 5 and above: 4 points each

So:

- 0 to 14 distraction minutes gives 0 penalty
- 15 to 29 distraction minutes gives 2 penalty points
- 30 to 44 distraction minutes gives 4 penalty points
- 45 to 59 distraction minutes gives 7 penalty points
- 60 to 74 distraction minutes gives 10 penalty points
- 75 to 89 distraction minutes gives 14 penalty points
- 90 or more distraction minutes quickly approaches the 20 point cap

Equivalent piecewise form:

$$
P_{distraction} = \min\left(20,
\begin{cases}
2B_{distraction}, & B_{distraction} \leq 2 \\
4 + 3(B_{distraction} - 2), & 3 \leq B_{distraction} \leq 4 \\
10 + 4(B_{distraction} - 4), & B_{distraction} \geq 5
\end{cases}
\right)
$$

And the untracked time penalty should use an escalating model:

$$
P_{untracked} = \sum_{i=1}^{B_{untracked}} w_i
$$

Where:

$$
B_{untracked} = \max\left(0, \left\lfloor \frac{M_{untracked}}{15} \right\rfloor \right)
$$

- $M_{untracked}$ is the total number of empty, unexplained minutes in the day
- $B_{untracked}$ is the number of full 15-minute untracked blocks
- $w_i$ is the penalty weight for the $i$th untracked block

Suggested default for MVP:

- blocks 1 to 2: 2 points each
- blocks 3 to 4: 3 points each
- blocks 5 and above: 4 points each

So:

- 0 to 14 untracked minutes gives 0 penalty
- 15 to 29 untracked minutes gives 2 penalty points
- 30 to 44 untracked minutes gives 4 penalty points
- 45 to 59 untracked minutes gives 7 penalty points
- 60 to 74 untracked minutes gives 10 penalty points
- 75 to 89 untracked minutes gives 14 penalty points

This creates tolerance for one or two missed chunks while becoming stricter once missing time becomes a pattern.

Equivalent piecewise form:

$$
P_{untracked} =
\begin{cases}
2B_{untracked}, & B_{untracked} \leq 2 \\
4 + 3(B_{untracked} - 2), & 3 \leq B_{untracked} \leq 4 \\
10 + 4(B_{untracked} - 4), & B_{untracked} \geq 5
\end{cases}
$$

Example:

- 60 distraction minutes gives a 10 point penalty
- 90 minutes of distraction gets close to the maximum penalty
- large distraction totals are capped at 20 points
- 45 minutes of untracked time gives a 7 point penalty
- 60 minutes of untracked time gives a 10 point penalty

This prevents one bad day from producing absurd negative results while still making distraction visible.

### What Counts as Untracked Time

Untracked time means a meaningful gap in the day where the app has no explanation for what happened.

For MVP, untracked time should mean:

- no active timer session
- no manual session entry
- no matching planned block marked as completed
- no explicit label such as break, commute, meal, or rest

Examples of untracked time:

- a 25 minute gap between tracked sessions with no explanation
- a missing hour in the afternoon where nothing was logged
- stopping a timer and forgetting to log what happened next

Examples that should not count as untracked time:

- a planned lunch block
- an intentional break logged as rest
- commute time logged as commute
- a scheduled appointment logged on the calendar

The system should treat untracked time as missing accountability data, not automatically as distraction.

### Why Untracked Time Should Be Penalized

If large parts of the day are blank, the score becomes easier to game and less trustworthy.

The untracked time penalty exists to encourage:

- consistent logging
- honest review of the day
- better visibility into where time actually went

This penalty is separate from distraction because unknown time is not always distraction, but it is still a problem for measurement.

### Suggested Detection Rule

For MVP, only penalize untracked gaps once they reach 15 minutes or more.

Recommended rule:

- gaps under 15 minutes are ignored as normal transition noise
- each full 15-minute unexplained block adds penalty, with later blocks costing more than earlier ones
- only waking-day hours should be evaluated, not sleep hours
- planned offline blocks should not be penalized if they are explicitly marked

### Combined Penalty Behavior

The final score should account for both kinds of accountability loss:

- distraction penalty for known low-value time
- untracked penalty for unexplained time

This creates a better system because:

- distraction answers, "You know what happened, and it hurt the day"
- untracked time answers, "You do not know what happened, so the data quality dropped"

### UI Explanation Examples

The app should explain this clearly in the score breakdown.

Examples:

- You lost 8 points from distraction and 4 points from 30 minutes of untracked time.
- Your score was reduced because 1 hour 15 minutes of the day was left unexplained.
- Most of your penalty came from missing tracked time, not from confirmed distractions.

### What Counts as Distraction

Distraction should mean time that pulled the user away from the intended plan, top priorities, or meaningful recovery.

For MVP, distraction should be tracked as a category of time sessions with clear rules.

#### Count as Distraction

- unplanned social media scrolling
- unplanned YouTube watching
- random web browsing with no clear purpose
- doomscrolling news or feeds
- switching away from planned work into low-value content
- excessive messaging or chatting that interrupts focus
- entertainment consumption that replaced planned priority work
- repeated app switching or context switching with no task outcome

#### Do Not Count as Distraction

- intentional rest breaks
- meals
- exercise
- sleep
- planned leisure or recreation
- social time that was intentionally planned
- admin tasks that are necessary even if not enjoyable
- recovery time taken on purpose to avoid burnout

This distinction matters because the app should not punish healthy recovery or deliberate leisure.

### Core Definition Rule

For MVP, a time block or session counts as distraction if all of these are true:

1. it was not part of the plan, or it meaningfully deviated from the plan
2. it was not aligned with an active goal, skill, or necessary responsibility
3. it did not qualify as intentional rest, planned leisure, or recovery

If a session fails one of those conditions, it should usually not be labeled as distraction.

### Suggested Distraction Categories

The app should ship with a few simple default distraction categories.

- Social media
- Video content
- Random browsing
- Messaging drift
- Gaming drift
- Idle / wasted time
- Unplanned entertainment
- Context-switching overhead

These can later be customized by the user.

### Planned Leisure vs Distraction

This is an important distinction.

Planned leisure is allowed and should not hurt the score if it was intentional.

Examples of planned leisure:

- watching a movie from 8 PM to 10 PM because it was scheduled
- 30 minutes of social media during a planned break window
- gaming after finishing the day's critical tasks

The same activity becomes distraction when it is impulsive and replaces higher-priority work.

Examples:

- opening TikTok during a deep work block
- turning a 10 minute break into 50 minutes of scrolling
- watching random videos instead of doing the planned study session

The app should track the difference between planned leisure and unplanned distraction, even if the activity type is the same.

### How Distraction Is Tracked

For MVP, distraction should be tracked in three ways:

#### 1. Manual Session Category

The user can start or log a session and mark it as distraction.

Use cases:

- user realizes they spent 25 minutes scrolling
- user manually logs 40 minutes of random browsing

#### 2. Planned vs Actual Mismatch Detection

If the schedule says one thing but the tracked session is unrelated and low-value, the app can suggest labeling that time as distraction.

Example:

- planned block was "Study Python"
- actual session was "YouTube - random videos"
- app suggests classifying part or all of that time as distraction

#### 3. AI-Assisted Review Suggestion

Gemini can suggest possible distraction sessions during end-of-day review based on labels, notes, and mismatches.

Important rule: AI should suggest, not auto-convict. The user should confirm or edit the classification.

### Suggested Logging Fields for a Distraction Session

Each distraction session can store:

- start time
- end time or duration
- distraction category
- source, such as phone or laptop
- whether it was impulsive or intentional
- whether it interrupted a planned block
- optional note about trigger

Useful example triggers:

- boredom
- stress
- tiredness
- avoidance
- no clear next step
- phone notification

This helps the system evolve from just tracking distraction to understanding why it happened.

### Mild vs Severe Distraction

Not all distraction should be treated equally.

For MVP, use two levels:

- Mild distraction: short interruptions or drift, such as 5 to 15 minutes
- Heavy distraction: sustained off-plan behavior, such as 20 or more minutes or repeated episodes

This can later feed into smarter analytics, but the first version can simply aggregate total distraction minutes.

### Recommended Scoring Treatment

For MVP, only unplanned distraction minutes should count toward the distraction penalty.

The simplest rule:

- planned leisure minutes do not count toward distraction penalty
- intentional rest minutes do not count toward distraction penalty
- necessary admin minutes do not count toward distraction penalty
- unplanned low-value minutes do count toward distraction penalty
- unexplained empty time does not count as distraction by default and should go to untracked penalty instead

### Edge Cases

Some time looks unproductive but should not automatically be classified as distraction.

- staring at the screen while mentally stuck may be friction, not distraction
- researching multiple tabs for a legitimate task may look messy but still be productive
- talking to someone during work hours may be necessary, not avoidance
- recovery after overload may be necessary even if it was not planned perfectly

The app should allow easy correction because distraction classification will sometimes be subjective.

### What the App Should Show

The app should not just show total distraction time. It should also show:

- top distraction categories
- when distraction happens most often
- which planned blocks are most frequently interrupted
- common triggers for distraction
- trend of distraction minutes across days and weeks

This makes distraction actionable instead of just moralizing it.

### Suggested Default Thresholds for MVP

These should be editable later, but reasonable defaults are needed first.

- Deep work target: 180 minutes
- Goal-linked work target: 180 minutes
- Skill-building target: 60 minutes
- Distraction threshold: 120 minutes
- Planned habits: based on habits scheduled for that day only

### Score Bands

To make the number easier to interpret, give each score a label.

- 85 to 100: Strong day
- 70 to 84: Solid day
- 50 to 69: Mixed day
- 30 to 49: Weak day
- 0 to 29: Off-track day

These labels should be paired with a breakdown, not shown alone.

### Why the Score Went Up or Down

The app should always explain the score in plain language.

Examples:

- Score increased because you completed 92 percent of planned blocks and hit your deep work target.
- Score dropped because distraction time doubled and your top goal received only 35 minutes.
- Score stayed average because habits were completed, but schedule adherence was weak.

### Anti-Gaming Rules

The score should be hard to fake.

- time cannot count twice across multiple components unless intentionally linked by design
- low-value busywork should not count as deep work
- manually added sessions may need a flag so the system can separate live-tracked vs edited entries
- the app should not reward unrealistic overplanning
- score caps should prevent inflated scores from excessive logging

### Personalization Rules

The score should eventually adapt to the user.

Examples:

- a heavy school day may use different targets from a weekend
- some habits can be marked critical and weighted higher
- focus targets can change by energy level or day type

For MVP, keep personalization simple: editable daily targets and editable habit weights.

### Weekly and Trend Scoring

The app should not only show daily scores. It should also show trend quality.

Useful derived metrics:

- 7-day average score
- consistency score based on variance across days
- streak of days above a chosen threshold, such as 70
- slope of last 14 days to show improving or declining momentum

This matters because one high score is less meaningful than repeated solid scores.

### Consistency Multiplier

To directly reward sustained consistency, the scoring system should include a consistency multiplier that applies to the daily score.

Rules:

- after 3 consecutive days with a score above 70, apply a small bonus to the trend score
- after 7 consecutive days above 70, apply a larger bonus and mark it as a consistency streak
- the multiplier affects the trend score and weekly summary, not the raw daily score
- this means the raw daily score remains honest, but the system visibly rewards sustained effort

Suggested multiplier tiers:

- 3-day streak above 70: trend score gets a 1.05x multiplier
- 7-day streak above 70: trend score gets a 1.10x multiplier
- 14-day streak above 70: trend score gets a 1.15x multiplier
- 30-day streak above 70: trend score gets a 1.20x multiplier

If the streak breaks, the multiplier resets to 1.0x. The user should see the current streak length and multiplier on the dashboard.

Why this matters:

- it directly incentivizes the core behavior the app is designed to build: showing up consistently
- a single great day is nice, but seven solid days in a row is transformative
- the multiplier makes consistency feel rewarding, not just expected

### Calibration Period

The first 1 to 2 weeks of using the app should be explicitly labeled as a calibration phase.

During calibration:

- the score still calculates normally
- the app frames it as: "We are learning your patterns. Do not optimize for the number yet."
- default targets may not match the user's real capacity, so early scores may be misleading
- the user should focus on logging consistently, not hitting high scores
- after calibration, the app suggests adjusted targets based on observed averages
- the AI can recommend: "You averaged 110 minutes of deep work during calibration. Consider setting your target to 120 minutes."

This prevents discouragement from low scores before the system is tuned.

### Example Score Formula Direction

This is the overall MVP formula direction:

$$
S_{daily} = S_{schedule} + S_{focus} + S_{goals} + S_{habits} + S_{skills} + S_{reflection} - P_{distraction} - P_{untracked}
$$

With a final clamp:

$$
S_{daily} = \max(0, \min(100, S_{daily}))
$$

### Score Requirements

- user can see the final score
- user can see score breakdown
- score can be compared day to day
- score trend should be visible on charts
- score should help detect slacking, inconsistency, or improvement
- user should see the exact factors that most affected the score
- user should be able to adjust targets later without changing historical raw data

## 13. Analytics and Insights

The app should provide analytics that are practical and visual.

### Core Charts for MVP

- time spent per category by day or week
- productive vs unproductive time
- score trend over time
- habit completion trends
- schedule adherence trend
- skill-building hours trend
- goal progress trend
- focus sessions completed per day
- energy and focus level patterns by hour of day
- sleep quality vs daily score correlation
- urge frequency trends for negative habits
- consistency streak history

### Where Did My Day Go View

This is a dedicated visualization that answers the single most important question: where did the entire day go?

It should show:

- a full-day timeline from wake to sleep, with every hour accounted for
- tracked sessions shown as colored blocks by category
- planned blocks shown as outlines to compare plan vs reality
- distraction time highlighted
- untracked gaps clearly visible
- a companion pie chart showing percentage breakdown by category

This single view should make it immediately obvious whether the day was well-spent or scattered.

### Insight Examples

- You planned 8 hours of focused work but completed 4.5 hours.
- Your distraction time increased by 30 percent over the last 7 days.
- Your skill-building time is falling even though it is tied to a top goal.
- Your score drops most on days when you skip your morning routine.
- Your deepest focus happens between 9 AM and 11 AM. Consider scheduling your hardest work there.
- You slept under 6 hours 3 of the last 5 nights. Your average score on those days was 52 vs 78 on well-rested days.
- Your urge frequency for doomscrolling dropped 40 percent this week.

## 14. Suggested Information Architecture

The app should support two UX modes depending on context.

### Active Day Mode (Live Mode)

This is the mode for during the day. It should be minimal and action-focused.

The user sees:

- current block and what is next
- active timer or Pomodoro session
- quick habit check-off
- energy level indicator
- non-negotiable blocks status
- quick access to AI chat
- Rescue My Day button
- Why Am I Stuck button

This mode should feel like a cockpit: minimal, focused, always showing the next best action.

### Review Mode

This is the mode for end-of-day review, weekly review, and analysis.

The user sees:

- full analytics and charts
- journal editor
- score breakdown
- Where Did My Day Go timeline
- weekly trends
- goal and skill progress
- second brain and notes

This mode should feel reflective and analytical.

### Main Screens

1. Dashboard (switches between active and review context)
2. Schedule
3. Time Tracker and Focus Sessions
4. Goals
5. Skills
6. Habits
7. Journal
8. Notes / Second Brain
9. Analytics
10. AI Coach Chat
11. Weekly Planning
12. Settings (day types, templates, scoring targets, categories)

## 15. Suggested MVP Data Entities

This is a product-level model, not final database schema.

- User
- Day Plan
- Day Type
- Day Template
- Time Block (with non-negotiable flag)
- Time Session (with energy and focus ratings)
- Focus Session (Pomodoro record)
- Category
- Activity (shared entity linked across sessions, blocks, habits, skills)
- Goal
- Goal Milestone
- Skill
- Habit
- Habit Log (with urge tracking for negative habits)
- Urge Event (time, intensity, trigger, resisted or not)
- Journal Entry
- Note (with spaced repetition metadata)
- Sleep Log
- Energy Log
- Daily Score
- Consistency Streak
- AI Insight
- AI Chat Message

## 16. Functional Requirements

### Must Have

- user can create and edit a daily schedule
- user can mark blocks as non-negotiable commitments
- user can track time manually and with a timer
- user can run Pomodoro focus sessions with configurable intervals
- user can categorize activities
- user can create goals and see progress
- user can create skills and log progress toward them
- user can create positive habits and log them daily
- user can track negative habits with urge logging
- user can write journal entries
- user can log sleep duration and quality
- user can log energy and focus levels
- app calculates daily score with consistency multiplier
- app shows charts and trend analytics
- app integrates Gemini API for AI insights
- AI Coach is a chat interface that can both talk and take actions
- data is stored locally first and syncs when online (offline-first)

### Should Have

- Start My Day and End My Day guided ceremonies
- Rescue My Day AI feature
- Why Am I Stuck quick action
- AI-generated daily and weekly summaries
- day templates and day types with per-type scoring targets
- simple note-taking for second brain with spaced repetition
- alert when actual behavior drifts from the plan
- Where Did My Day Go full-day timeline visualization
- Weekly Planning session with AI support
- sleep vs score correlation in analytics
- energy pattern analysis
- calibration period for the first two weeks

### Could Have Later

- recurring schedule templates
- notifications and reminders
- streak rewards or gamified layers
- natural language day planning with AI
- semantic search across notes and journal entries
- recommendation engine for better routines
- AI-powered note linking and insight extraction for second brain

## 17. Non-Functional Requirements

- fast daily use
- clean and motivating interface
- mobile-responsive design
- low-friction data entry
- reliable analytics calculations
- clear privacy handling for personal data
- AI calls should be optional and explainable
- offline-first: all core features must work without network
- local data storage with background sync when online
- timers must be reliable without network connectivity
- conflict resolution should favor the most recent local change

## 18. Risks and Challenges

- too much friction in logging data may reduce consistency
- score system may feel unfair if weights are poorly tuned
- too many features too early may make the app bloated
- AI may produce generic advice if context is weak
- second brain features can become overcomplicated quickly

To manage this, the MVP should focus on the daily loop and only add complexity when the core system is actually being used.

## 19. Open Questions

Some questions have been resolved. Remaining open questions:

- What Gemini prompts and workflows should exist first?
- What exact Pomodoro interval options should be available?
- How should the AI chat action system be implemented technically?
- How should conflict resolution work in offline-first sync?
- What should the consistency streak threshold be (currently 70, but is that right)?

### Resolved Questions

| Question | Decision |
|---|---|
| What exact productivity score formula should be used? | Defined in Section 12 with weighted components, dual-score model, and consistency multiplier |
| Which categories should exist by default? | Deep Work, Learning, Exercise, Admin, Social, Leisure, Distraction, Commute, Meals, Rest |
| How detailed should time tracking be? | 15-minute minimum granularity, matches penalty blocks |
| Should the app optimize for manual entry, timers, or both equally? | Both equally. Timers for planned blocks, manual for forgotten time. Neither is second-class |
| What does the first dashboard layout look like? | Top: score, streak, energy. Middle: today's timeline, active timer. Bottom: habits checklist, AI insight card |
| How should bad habits be tracked without creating shame or noise? | Frame as patterns to understand. Track urges resisted. Use language like "3 fewer urges this week" not "you failed" |
| Should second brain notes be plain text, rich text, or block-based? | Rich text with tags for MVP. Block-based is too complex initially |

## 20. Initial Roadmap

### Phase 1: Core Foundation

- dashboard shell with Active Day Mode and Review Mode
- schedule planner with day templates and non-negotiable blocks
- time tracking with Pomodoro focus sessions
- habits with positive and negative habit support
- goals
- journal
- offline-first local data storage

### Phase 2: Intelligence Layer

- daily score engine with consistency multiplier
- calibration period logic
- analytics charts including Where Did My Day Go
- Gemini integration with chat interface
- AI summaries and recommendations
- Rescue My Day feature
- Why Am I Stuck quick action

### Phase 3: Daily Loop Polish

- Start My Day and End My Day ceremonies
- energy and focus level tracking
- sleep and recovery logging
- urge tracking for negative habits
- Weekly Planning session

### Phase 4: Expansion

- skill-building depth
- second brain with spaced repetition
- AI actions (chat can modify schedule, log sessions, etc.)
- advanced analytics and correlation insights
- background sync when online

## 21. Definition of MVP Success

The MVP is successful if the user can consistently use it to:

- plan each day
- track what actually happened
- review performance honestly
- identify where time goes
- see measurable progress trends
- feel more accountable and intentional

## 22. Next Additions We Can Define Together

In the next discussions, we can expand this file with:

- exact feature workflows
- user stories
- wireframe descriptions
- database schema ideas
- tech stack decisions
- Gemini prompt architecture
- scoring formula details
- dashboard layout concepts
- onboarding flow
- review and reflection systems

---

Status: initial MVP draft

Intent: this file is the main planning document for the app and should be updated as the product becomes more concrete.
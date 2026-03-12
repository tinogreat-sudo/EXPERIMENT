"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuid } from "uuid";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { getTodayDateString } from "@/lib/utils";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { AIChatMode, AIChatSession, AIChatMessage } from "@/types";

const MAX_HISTORY_MESSAGES = 40;

const QUICK_ACTIONS: { label: string; icon: string; mode: AIChatMode | "rescue" | "stuck"; message: string }[] = [
  { label: "Rescue My Day", icon: "emergency", mode: "rescue" as AIChatMode, message: "My day has gone off-track. Help me rescue it and restructure the rest of my day." },
  { label: "Why Am I Stuck?", icon: "help_outline", mode: "stuck" as AIChatMode, message: "I feel stuck and unmotivated. Help me figure out what to do next." },
  { label: "Summarize Today", icon: "summarize", mode: "review", message: "Give me a summary of my day so far — what went well, what didn't, and what I should focus on next." },
  { label: "Plan Tomorrow", icon: "event_upcoming", mode: "planning", message: "Help me plan tomorrow based on today's patterns, my goals, and what I need to improve." },
];

const MODE_OPTIONS: { value: AIChatMode; label: string }[] = [
  { value: "general", label: "General" },
  { value: "planning", label: "Planning" },
  { value: "accountability", label: "Accountability" },
  { value: "review", label: "Review" },
  { value: "coaching", label: "Coaching" },
];

const WELCOME_CONTENT = "Welcome to your AI Coach. I can help you plan your day, stay accountable, review your progress, and build better patterns. What would you like to work on?";

export default function AICoachPage() {
  const sessions = useLiveQuery(() => db.aiChatSessions.orderBy("updatedAt").reverse().toArray()) ?? [];
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const messages = useLiveQuery(
    () => activeSessionId
      ? db.aiChatMessages.where("sessionId").equals(activeSessionId).sortBy("createdAt")
      : Promise.resolve([] as AIChatMessage[]),
    [activeSessionId]
  ) ?? [];

  const [input, setInput] = useState("");
  const [mode, setMode] = useState<AIChatMode>("general");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-select most recent session
  useEffect(() => {
    if (activeSessionId) return;
    if (sessions.length > 0) {
      setActiveSessionId(sessions[0].id);
      setMode(sessions[0].mode);
    }
  }, [sessions, activeSessionId]);

  // Seed welcome message for empty sessions
  useEffect(() => {
    if (!activeSessionId || messages.length > 0) return;
    (async () => {
      const count = await db.aiChatMessages.where("sessionId").equals(activeSessionId).count();
      if (count === 0) {
        await db.aiChatMessages.add({
          id: uuid(), sessionId: activeSessionId, role: "assistant",
          content: WELCOME_CONTENT, mode: "general",
          actionsTaken: null, contextSnapshot: null,
          createdAt: new Date().toISOString(), syncedAt: null,
        });
      }
    })();
  }, [activeSessionId, messages.length]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, isThinking]);

  // --- Session CRUD ---
  async function createSession(title?: string, sessionMode?: AIChatMode) {
    const now = new Date().toISOString();
    const newSession: AIChatSession = {
      id: uuid(), title: title || `Chat ${sessions.length + 1}`,
      mode: sessionMode || mode, createdAt: now, updatedAt: now, syncedAt: null,
    };
    await db.aiChatSessions.add(newSession);
    setActiveSessionId(newSession.id);
    setMode(newSession.mode);
    setShowSidebar(false);
  }

  async function deleteSession(sessionId: string) {
    await db.aiChatMessages.where("sessionId").equals(sessionId).delete();
    await db.aiChatSessions.delete(sessionId);
    if (activeSessionId === sessionId) {
      const remaining = sessions.filter((s) => s.id !== sessionId);
      setActiveSessionId(remaining.length > 0 ? remaining[0].id : null);
    }
  }

  function switchSession(session: AIChatSession) {
    setActiveSessionId(session.id);
    setMode(session.mode);
    setShowSidebar(false);
  }

  const gatherContext = useCallback(async () => {
    const today = getTodayDateString();
    const todayPlan = await db.dayPlans.where("date").equals(today).first() ?? null;
    const blocks = todayPlan ? await db.timeBlocks.where("dayPlanId").equals(todayPlan.id).toArray() : [];
    const sessionsData = todayPlan ? await db.timeSessions.where("dayPlanId").equals(todayPlan.id).toArray() : [];
    const habitLogs = await db.habitLogs.where("date").equals(today).toArray();
    const urgeEvents = todayPlan ? await db.urgeEvents.where("dayPlanId").equals(todayPlan.id).toArray() : [];
    const habits = await db.habits.filter((h) => h.isActive).toArray();
    const goals = await db.goals.toArray();
    const skills = await db.skills.toArray();
    const recentScores = await db.dailyScores.orderBy("date").reverse().limit(7).toArray();
    const recentJournals = await db.journalEntries.orderBy("date").reverse().limit(3).toArray();
    const settingsArr = await db.userSettings.toArray();
    return {
      todayPlan, blocks, sessions: sessionsData, habitLogs, urgeEvents,
      habits, goals, skills, recentScores, recentJournals, settings: settingsArr[0] ?? null,
    };
  }, []);

  async function sendToAI(userMessage: string, chatMode: AIChatMode | string) {
    let sessionId = activeSessionId;
    if (!sessionId) {
      const now = new Date().toISOString();
      const titleWords = userMessage.split(/\s+/).slice(0, 4).join(" ");
      const newSession: AIChatSession = {
        id: uuid(), title: titleWords || "New Chat",
        mode: chatMode as AIChatMode, createdAt: now, updatedAt: now, syncedAt: null,
      };
      await db.aiChatSessions.add(newSession);
      sessionId = newSession.id;
      setActiveSessionId(sessionId);
    }

    await db.aiChatMessages.add({
      id: uuid(), sessionId, role: "user", content: userMessage,
      mode: chatMode as AIChatMode, actionsTaken: null, contextSnapshot: null,
      createdAt: new Date().toISOString(), syncedAt: null,
    });

    // Auto-title from first real user message
    const msgCount = await db.aiChatMessages.where("sessionId").equals(sessionId).count();
    if (msgCount <= 2) {
      const titleText = userMessage.split(/\s+/).slice(0, 5).join(" ");
      await db.aiChatSessions.update(sessionId, {
        title: titleText.length > 30 ? titleText.slice(0, 30) + "…" : titleText,
        updatedAt: new Date().toISOString(),
      });
    } else {
      await db.aiChatSessions.update(sessionId, { updatedAt: new Date().toISOString() });
    }

    setIsThinking(true);
    try {
      const context = await gatherContext();
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Build history from this session
      const allMsgs = await db.aiChatMessages.where("sessionId").equals(sessionId).sortBy("createdAt");
      const historyMsgs = allMsgs
        .slice(-(MAX_HISTORY_MESSAGES + 1), -1)
        .filter((m) => m.content !== WELCOME_CONTENT)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          mode: chatMode,
          context: {
            ...context,
            userTimezone: tz,
            userLocalTime: new Date().toLocaleString("en-US", {
              timeZone: tz, hour12: true, weekday: "long",
              year: "numeric", month: "short", day: "numeric",
              hour: "2-digit", minute: "2-digit",
            }),
          },
          history: historyMsgs,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "AI request failed");
      }

      const data = await res.json();
      await db.aiChatMessages.add({
        id: uuid(), sessionId, role: "assistant", content: data.response,
        mode: chatMode as AIChatMode, actionsTaken: null, contextSnapshot: null,
        createdAt: new Date().toISOString(), syncedAt: null,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Something went wrong";
      await db.aiChatMessages.add({
        id: uuid(), sessionId, role: "assistant",
        content: `Sorry, I encountered an error: ${errorMsg}. Please try again.`,
        mode: chatMode as AIChatMode, actionsTaken: null, contextSnapshot: null,
        createdAt: new Date().toISOString(), syncedAt: null,
      });
    } finally {
      setIsThinking(false);
    }
  }

  async function handleSend() {
    if (!input.trim() || isThinking) return;
    const userMsg = input.trim();
    setInput("");
    await sendToAI(userMsg, mode);
  }

  async function clearCurrentChat() {
    if (!activeSessionId) return;
    await db.aiChatMessages.where("sessionId").equals(activeSessionId).delete();
  }

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-screen">
      {/* Session Sidebar */}
      <div className={cn(
        "fixed md:relative z-40 h-full w-72 bg-bg-light dark:bg-bg-dark border-r border-border-light dark:border-border-dark flex flex-col transition-transform",
        showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark">
            Chat Sessions
          </h2>
          <button
            onClick={() => createSession()}
            className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer"
            title="New chat"
          >
            <span className="material-symbols-outlined text-lg">add</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark">No chats yet</p>
              <Button variant="primary" size="sm" className="mt-3" onClick={() => createSession()}>
                Start a Chat
              </Button>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors",
                  activeSessionId === session.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-surface-light-hover dark:hover:bg-surface-dark-hover text-text-secondary-light dark:text-text-secondary-dark"
                )}
                onClick={() => switchSession(session)}
              >
                <span className="material-symbols-outlined text-sm shrink-0">chat_bubble</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{session.title}</p>
                  <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                    {session.mode}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                  className="opacity-0 group-hover:opacity-100 size-6 rounded flex items-center justify-center hover:bg-danger/10 text-text-muted-light dark:text-text-muted-dark hover:text-danger transition-all cursor-pointer"
                  title="Delete chat"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {showSidebar && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setShowSidebar(false)} />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="p-4 lg:px-8 border-b border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="md:hidden size-8 rounded-lg flex items-center justify-center hover:bg-surface-light-hover dark:hover:bg-surface-dark-hover cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">menu</span>
              </button>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">psychology</span>
                <span className="truncate max-w-[200px]">
                  {sessions.find((s) => s.id === activeSessionId)?.title || "AI Coach"}
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex gap-1">
                {MODE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setMode(opt.value)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer",
                      mode === opt.value
                        ? "bg-primary/15 text-primary"
                        : "text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light-hover dark:hover:bg-surface-dark-hover"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => createSession()}
                className="size-8 rounded-lg flex items-center justify-center hover:bg-surface-light-hover dark:hover:bg-surface-dark-hover cursor-pointer text-text-muted-light dark:text-text-muted-dark"
                title="New chat"
              >
                <span className="material-symbols-outlined text-lg">edit_square</span>
              </button>
              <button
                onClick={clearCurrentChat}
                className="size-8 rounded-lg flex items-center justify-center hover:bg-danger/10 cursor-pointer text-text-muted-light dark:text-text-muted-dark hover:text-danger"
                title="Clear messages"
              >
                <span className="material-symbols-outlined text-lg">delete_sweep</span>
              </button>
            </div>
          </div>
          <div className="flex sm:hidden gap-1 mt-2 overflow-x-auto no-scrollbar">
            {MODE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setMode(opt.value)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0",
                  mode === opt.value ? "bg-primary/15 text-primary" : "text-text-muted-light dark:text-text-muted-dark"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="px-4 lg:px-8 py-2 flex gap-2 overflow-x-auto no-scrollbar">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              disabled={isThinking}
              className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:border-primary/30 text-xs font-medium cursor-pointer transition-colors disabled:opacity-50"
              onClick={() => sendToAI(action.message, action.mode)}
            >
              <span className="material-symbols-outlined text-primary text-base">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 lg:px-8 py-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
              {msg.role === "assistant" && (
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <span className="material-symbols-outlined text-primary text-sm">psychology</span>
                </div>
              )}
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-md"
                    : "bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-bl-md"
                )}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <span className="material-symbols-outlined text-primary text-sm">person</span>
                </div>
              )}
            </div>
          ))}
          {isThinking && (
            <div className="flex gap-2 justify-start">
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <span className="material-symbols-outlined text-primary text-sm animate-pulse">psychology</span>
              </div>
              <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                  <span className="inline-flex gap-1">
                    <span className="size-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="size-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="size-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                  Thinking...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 lg:px-8 lg:pb-6 border-t border-border-light dark:border-border-dark">
          <div className="flex gap-2">
            <input
              className="flex-1 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Ask your AI coach anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              disabled={isThinking}
            />
            <Button variant="primary" className="rounded-2xl px-4" onClick={handleSend} disabled={isThinking}>
              <span className="material-symbols-outlined">send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

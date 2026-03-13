"use client";

import { useState, useMemo, useCallback } from "react";
import { v4 as uuid } from "uuid";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Button, Card, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useActiveGoals, useSkills } from "@/hooks/useLiveData";
import type { Note } from "@/types";

const REVIEW_STATUS_LABELS: Record<Note["reviewStatus"], string> = {
  new: "New",
  learning: "Learning",
  known: "Known",
};

const REVIEW_STATUS_COLORS: Record<Note["reviewStatus"], string> = {
  new: "bg-primary/10 text-primary",
  learning: "bg-warning/10 text-warning",
  known: "bg-success/10 text-success",
};

/** Compute the next review date using spaced repetition intervals */
function computeNextReviewDate(reviewCount: number): string {
  const intervals = [1, 3, 7, 14, 30]; // days
  const days = intervals[Math.min(reviewCount, intervals.length - 1)];
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function isTodayOrPast(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return dateStr <= new Date().toISOString().split("T")[0];
}

type ViewMode = "all" | "review" | "search";

export default function SecondBrainPage() {
  const rawNotes = useLiveQuery(() => db.notes.orderBy("createdAt").reverse().toArray());
  const notes = useMemo(() => rawNotes ?? [], [rawNotes]);
  const goals = useActiveGoals();
  const skills = useSkills();

  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const dueForReview = useMemo(
    () => notes.filter((n) => n.reviewStatus !== "known" && isTodayOrPast(n.nextReviewDate)),
    [notes]
  );

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const note of notes) {
      for (const tag of note.tags) tagSet.add(tag);
    }
    return Array.from(tagSet).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    let list = notes;

    if (viewMode === "review") {
      list = dueForReview;
    } else if (viewMode === "search" || searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedTag) {
      list = list.filter((n) => n.tags.includes(selectedTag));
    }

    return list;
  }, [notes, viewMode, searchQuery, selectedTag, dueForReview]);

  function openCreate() {
    setEditingNote(null);
    setShowModal(true);
  }

  function openEdit(note: Note) {
    setEditingNote(note);
    setShowModal(true);
    setSelectedNote(null);
  }

  async function markReview(note: Note, action: "got-it" | "review-again") {
    const now = new Date().toISOString();
    if (action === "got-it") {
      await db.notes.update(note.id, {
        reviewStatus: "known",
        reviewCount: note.reviewCount + 1,
        lastReviewedAt: now,
        nextReviewDate: null,
        updatedAt: now,
      });
    } else {
      const newCount = note.reviewCount + 1;
      await db.notes.update(note.id, {
        reviewStatus: newCount >= 4 ? "learning" : "new",
        reviewCount: newCount,
        lastReviewedAt: now,
        nextReviewDate: computeNextReviewDate(newCount),
        updatedAt: now,
      });
    }
    // Advance to next due note
    const remaining = dueForReview.filter((n) => n.id !== note.id);
    setSelectedNote(remaining.length > 0 ? remaining[0] : null);
  }

  async function deleteNote(id: string) {
    if (!confirm("Delete this note?")) return;
    await db.notes.delete(id);
    if (selectedNote?.id === id) setSelectedNote(null);
  }

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">psychology_alt</span>
            Second Brain
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1">
            Capture ideas, lessons, and knowledge. Review regularly to retain them.
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <span className="material-symbols-outlined text-lg">add</span>
          Quick Capture
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card variant="metric" className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">note_stack</span>
          <div>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark uppercase font-bold">Total Notes</p>
            <p className="text-xl font-bold">{notes.length}</p>
          </div>
        </Card>
        <Card variant="metric" className="flex items-center gap-3">
          <span className="material-symbols-outlined text-warning text-2xl">pending_actions</span>
          <div>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark uppercase font-bold">Due for Review</p>
            <p className="text-xl font-bold">{dueForReview.length}</p>
          </div>
        </Card>
        <Card variant="metric" className="flex items-center gap-3">
          <span className="material-symbols-outlined text-success text-2xl">check_circle</span>
          <div>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark uppercase font-bold">Known</p>
            <p className="text-xl font-bold">{notes.filter((n) => n.reviewStatus === "known").length}</p>
          </div>
        </Card>
      </div>

      {/* View Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-1 bg-surface-light dark:bg-surface-dark rounded-lg p-1 border border-border-light dark:border-border-dark">
          {(["all", "review", "search"] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setViewMode(m); if (m !== "search") setSearchQuery(""); }}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer",
                viewMode === m
                  ? "bg-primary/15 text-primary"
                  : "text-text-muted-light dark:text-text-muted-dark"
              )}
            >
              {m === "all" ? "All" : m === "review" ? `Review (${dueForReview.length})` : "Search"}
            </button>
          ))}
        </div>

        {viewMode === "search" && (
          <input
            className="flex-1 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Search notes, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        )}
      </div>

      {/* Tag filter chips */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={cn(
                "px-2 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer",
                selectedTag === tag
                  ? "bg-primary text-white border-primary"
                  : "border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:border-primary/40"
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Review Mode CTA */}
      {viewMode === "review" && dueForReview.length > 0 && !selectedNote && (
        <div className="mb-6">
          <div className="bg-gradient-to-br from-primary/10 to-transparent rounded-2xl border border-primary/20 p-6">
            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">
              Review Queue — {dueForReview.length} note{dueForReview.length !== 1 ? "s" : ""} due
            </p>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
              Spaced repetition helps move knowledge from short-term to long-term memory.
            </p>
            <Button variant="primary" onClick={() => setSelectedNote(dueForReview[0])}>
              <span className="material-symbols-outlined">play_arrow</span>
              Start Review Session
            </Button>
          </div>
        </div>
      )}

      {/* Flashcard-style Review */}
      {viewMode === "review" && selectedNote && (
        <ReviewCard
          note={selectedNote}
          remaining={dueForReview.length}
          onGotIt={() => markReview(selectedNote, "got-it")}
          onReviewAgain={() => markReview(selectedNote, "review-again")}
          onClose={() => setSelectedNote(null)}
        />
      )}

      {/* Notes Grid */}
      {(viewMode !== "review" || !selectedNote) && (
        <>
          {filteredNotes.length === 0 && (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-text-muted-light dark:text-text-muted-dark mb-3 block">
                {viewMode === "review" ? "check_circle" : "note_stack"}
              </span>
              <p className="text-text-muted-light dark:text-text-muted-dark font-medium">
                {viewMode === "review"
                  ? "No notes due for review — you're all caught up!"
                  : "No notes yet. Start capturing ideas!"}
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                goals={goals}
                skills={skills}
                onClick={() => setSelectedNote(note)}
                onEdit={() => openEdit(note)}
                onDelete={() => deleteNote(note.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* Note Detail Modal */}
      {selectedNote && viewMode !== "review" && (
        <NoteDetailModal
          note={selectedNote}
          goals={goals}
          skills={skills}
          onEdit={() => openEdit(selectedNote)}
          onDelete={() => deleteNote(selectedNote.id)}
          onClose={() => setSelectedNote(null)}
          onMarkReview={(action) => markReview(selectedNote, action)}
        />
      )}

      {/* Create / Edit Note Modal */}
      {showModal && (
        <NoteModal
          note={editingNote}
          goals={goals}
          skills={skills}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// ===== Sub-components =====

function NoteCard({
  note,
  goals,
  skills,
  onClick,
  onEdit,
  onDelete,
}: {
  note: Note;
  goals: { id: string; title: string }[];
  skills: { id: string; name: string }[];
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const linkedGoal = goals.find((g) => g.id === note.goalId);
  const linkedSkill = skills.find((s) => s.id === note.skillId);
  const isDue = note.reviewStatus !== "known" && isTodayOrPast(note.nextReviewDate);

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:border-primary/30 relative",
        isDue && "ring-2 ring-warning/30"
      )}
      onClick={onClick}
    >
      {isDue && (
        <div className="absolute top-3 right-3">
          <span className="material-symbols-outlined text-warning text-sm">pending_actions</span>
        </div>
      )}
      <div className="mb-2 pr-6">
        <h3 className="font-bold text-sm line-clamp-2">{note.title}</h3>
      </div>
      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark line-clamp-3 mb-3">
        {note.content}
      </p>

      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark">+{note.tags.length - 3}</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", REVIEW_STATUS_COLORS[note.reviewStatus])}>
          {REVIEW_STATUS_LABELS[note.reviewStatus]}
        </span>
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          {(linkedGoal || linkedSkill) && (
            <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-sm">link</span>
          )}
          <button
            onClick={onEdit}
            className="p-1 rounded hover:bg-primary/10 text-text-muted-light dark:text-text-muted-dark transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-danger/10 text-text-muted-light dark:text-text-muted-dark transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>
    </Card>
  );
}

function ReviewCard({
  note,
  remaining,
  onGotIt,
  onReviewAgain,
  onClose,
}: {
  note: Note;
  remaining: number;
  onGotIt: () => void;
  onReviewAgain: () => void;
  onClose: () => void;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
          {remaining} note{remaining !== 1 ? "s" : ""} remaining in review
        </p>
        <button onClick={onClose} className="text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-primary-dark cursor-pointer">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-8 min-h-48 flex flex-col">
        <h2 className="text-xl font-bold mb-4">{note.title}</h2>
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {note.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">#{tag}</span>
            ))}
          </div>
        )}

        {revealed ? (
          <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed flex-1">
            {note.content}
          </p>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-border-light dark:border-border-dark rounded-xl text-text-muted-light dark:text-text-muted-dark hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined">visibility</span>
            Tap to reveal note
          </button>
        )}
      </div>

      {revealed && (
        <div className="flex gap-3 mt-4">
          <Button variant="ghost" className="flex-1" onClick={onReviewAgain}>
            <span className="material-symbols-outlined">replay</span>
            Review Again
          </Button>
          <Button variant="primary" className="flex-1" onClick={onGotIt}>
            <span className="material-symbols-outlined filled">check_circle</span>
            Got It!
          </Button>
        </div>
      )}
    </div>
  );
}

function NoteDetailModal({
  note,
  goals,
  skills,
  onEdit,
  onDelete,
  onClose,
  onMarkReview,
}: {
  note: Note;
  goals: { id: string; title: string }[];
  skills: { id: string; name: string }[];
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  onMarkReview: (action: "got-it" | "review-again") => void;
}) {
  const linkedGoal = goals.find((g) => g.id === note.goalId);
  const linkedSkill = skills.find((s) => s.id === note.skillId);
  const isDue = note.reviewStatus !== "known" && isTodayOrPast(note.nextReviewDate);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 w-full max-w-lg shadow-xl border border-border-light dark:border-border-dark max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold pr-4">{note.title}</h2>
          <div className="flex gap-1 shrink-0">
            <button onClick={onEdit} className="p-2 rounded-lg hover:bg-primary/10 cursor-pointer">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
            <button onClick={onDelete} className="p-2 rounded-lg hover:bg-danger/10 text-danger cursor-pointer">
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-light-hover dark:hover:bg-surface-dark-hover cursor-pointer">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>

        <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-4 whitespace-pre-wrap">
          {note.content}
        </p>

        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {note.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">#{tag}</span>
            ))}
          </div>
        )}

        {(linkedGoal || linkedSkill) && (
          <div className="flex gap-2 mb-4">
            {linkedGoal && (
              <Badge variant="primary">
                <span className="material-symbols-outlined text-xs">ads_click</span>
                {linkedGoal.title}
              </Badge>
            )}
            {linkedSkill && (
              <Badge variant="default">
                <span className="material-symbols-outlined text-xs">military_tech</span>
                {linkedSkill.name}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-4 text-xs text-text-muted-light dark:text-text-muted-dark">
          <span className={cn("px-2 py-1 rounded-full font-bold", REVIEW_STATUS_COLORS[note.reviewStatus])}>
            {REVIEW_STATUS_LABELS[note.reviewStatus]}
          </span>
          <span>Reviewed {note.reviewCount}×</span>
          {note.nextReviewDate && (
            <span>Next review: {note.nextReviewDate}</span>
          )}
        </div>

        {isDue && (
          <div className="flex gap-2">
            <Button variant="ghost" className="flex-1" onClick={() => onMarkReview("review-again")}>
              <span className="material-symbols-outlined">replay</span>
              Review Again
            </Button>
            <Button variant="primary" className="flex-1" onClick={() => onMarkReview("got-it")}>
              <span className="material-symbols-outlined filled">check_circle</span>
              Got It!
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function NoteModal({
  note,
  goals,
  skills,
  onClose,
}: {
  note: Note | null;
  goals: { id: string; title: string }[];
  skills: { id: string; name: string }[];
  onClose: () => void;
}) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [tagInput, setTagInput] = useState(note?.tags.join(", ") ?? "");
  const [goalId, setGoalId] = useState(note?.goalId ?? "");
  const [skillId, setSkillId] = useState(note?.skillId ?? "");

  const handleTagKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const now = new Date().toISOString();
    const parsedTags = tagInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (note) {
      await db.notes.update(note.id, {
        title: title.trim(),
        content: content.trim(),
        tags: parsedTags,
        goalId: goalId || null,
        skillId: skillId || null,
        updatedAt: now,
      });
    } else {
      const reviewCount = 0;
      await db.notes.add({
        id: uuid(),
        title: title.trim(),
        content: content.trim(),
        tags: parsedTags,
        goalId: goalId || null,
        skillId: skillId || null,
        journalEntryId: null,
        reviewStatus: "new",
        nextReviewDate: computeNextReviewDate(reviewCount),
        reviewCount,
        lastReviewedAt: null,
        createdAt: now,
        updatedAt: now,
        syncedAt: null,
      });
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSave}
        className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 w-full max-w-lg shadow-xl border border-border-light dark:border-border-dark max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-lg font-bold mb-4">{note ? "Edit Note" : "Quick Capture"}</h2>

        <label className="block mb-3">
          <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Title</span>
          <input
            className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What did you learn or capture?"
            required
            autoFocus
          />
        </label>

        <label className="block mb-3">
          <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Content</span>
          <textarea
            className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[120px] resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write the full note, insight, or lesson..."
            required
          />
        </label>

        <label className="block mb-3">
          <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">
            Tags{" "}
            <span className="normal-case text-text-muted-light dark:text-text-muted-dark font-normal">(comma separated)</span>
          </span>
          <input
            className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="e.g. productivity, coding, mindset"
          />
        </label>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {goals.length > 0 && (
            <label>
              <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Link to Goal</span>
              <select
                className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm"
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
              >
                <option value="">None</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
            </label>
          )}
          {skills.length > 0 && (
            <label>
              <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Link to Skill</span>
              <select
                className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm"
                value={skillId}
                onChange={(e) => setSkillId(e.target.value)}
              >
                <option value="">None</option>
                {skills.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </label>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" className="flex-1">
            {note ? "Save Changes" : "Capture Note"}
          </Button>
        </div>
      </form>
    </div>
  );
}

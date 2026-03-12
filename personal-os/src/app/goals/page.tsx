"use client";

import { useState, useMemo } from "react";
import { v4 as uuid } from "uuid";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Button, Card, Badge, ProgressBar } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Goal } from "@/types";

export default function GoalsPage() {
  const goals = useLiveQuery(() => db.goals.toArray()) ?? [];
  const milestones = useLiveQuery(() => db.goalMilestones.toArray()) ?? [];
  const [showModal, setShowModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const weeklyFocus = useMemo(() => goals.filter((g) => g.isWeeklyFocus && g.status === "active"), [goals]);
  const activeGoals = useMemo(() => goals.filter((g) => g.status === "active"), [goals]);

  async function toggleWeeklyFocus(goalId: string, current: boolean) {
    await db.goals.update(goalId, {
      isWeeklyFocus: !current,
      updatedAt: new Date().toISOString(),
    });
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Goals</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
            {weeklyFocus.length > 0
              ? `${weeklyFocus.length} weekly focus goal${weeklyFocus.length > 1 ? "s" : ""}`
              : "Set your weekly focus goals"}
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <span className="material-symbols-outlined text-lg">add</span>
          Add Goal
        </Button>
      </div>

      {/* Goals list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeGoals.length === 0 && (
          <div className="col-span-full text-center py-12">
            <span className="material-symbols-outlined text-5xl text-text-muted-light dark:text-text-muted-dark mb-4">ads_click</span>
            <p className="text-text-muted-light dark:text-text-muted-dark">
              Set a goal to start connecting your days to something bigger.
            </p>
          </div>
        )}

        {activeGoals.map((goal) => {
          const goalMilestones = milestones.filter((m) => m.goalId === goal.id);
          const completedMilestones = goalMilestones.filter((m) => m.isCompleted).length;

          return (
            <Card
              key={goal.id}
              className={cn(
                "cursor-pointer transition-all hover:border-primary/30",
                goal.isWeeklyFocus && "ring-2 ring-primary/20"
              )}
              onClick={() => setSelectedGoal(goal)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold">{goal.title}</h3>
                  {goal.description && (
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">{goal.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {goal.isWeeklyFocus && <Badge variant="primary">Focus</Badge>}
                  <Badge variant={goal.priority === "high" ? "danger" : goal.priority === "medium" ? "warning" : "default"}>
                    {goal.priority}
                  </Badge>
                </div>
              </div>

              <ProgressBar value={goal.progressPercent} className="mb-2" />
              <div className="flex items-center justify-between text-xs text-text-muted-light dark:text-text-muted-dark">
                <span>{goal.progressPercent}% complete</span>
                {goal.targetDate && <span>Due {new Date(goal.targetDate).toLocaleDateString()}</span>}
              </div>

              {goalMilestones.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border-light dark:border-border-dark">
                  <p className="text-[10px] font-bold text-text-muted-light dark:text-text-muted-dark uppercase">
                    {completedMilestones}/{goalMilestones.length} milestones
                  </p>
                </div>
              )}

              {/* Weekly focus toggle */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleWeeklyFocus(goal.id, goal.isWeeklyFocus); }}
                className={cn(
                  "mt-3 w-full py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  goal.isWeeklyFocus
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "bg-surface-light-hover dark:bg-surface-dark-hover text-text-muted-light dark:text-text-muted-dark border border-border-light dark:border-border-dark"
                )}
              >
                {goal.isWeeklyFocus ? "★ Weekly Focus" : "Set as Weekly Focus"}
              </button>
            </Card>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showModal && <GoalModal onClose={() => setShowModal(false)} />}

      {/* Edit Goal Modal */}
      {editingGoal && (
        <GoalEditModal goal={editingGoal} onClose={() => setEditingGoal(null)} />
      )}

      {/* Goal Detail Modal */}
      {selectedGoal && (
        <GoalDetail
          goal={selectedGoal}
          milestones={milestones.filter((m) => m.goalId === selectedGoal.id)}
          onClose={() => setSelectedGoal(null)}
          onEdit={(g) => { setSelectedGoal(null); setEditingGoal(g); }}
          onDelete={async (id) => {
            await db.goalMilestones.where("goalId").equals(id).delete();
            await db.goals.delete(id);
          }}
        />
      )}
    </div>
  );
}

function GoalModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"short-term" | "long-term">("short-term");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [targetDate, setTargetDate] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date().toISOString();
    await db.goals.add({
      id: uuid(),
      title: title || "New Goal",
      description: description || null,
      type,
      status: "active",
      targetDate: targetDate || null,
      priority,
      isWeeklyFocus: false,
      progressPercent: 0,
      createdAt: now,
      updatedAt: now,
      syncedAt: null,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 w-full max-w-md shadow-xl border border-border-light dark:border-border-dark"
      >
        <h2 className="text-lg font-bold mb-4">Add Goal</h2>
        <label className="block mb-3">
          <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Title</span>
          <input className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What do you want to achieve?" />
        </label>
        <label className="block mb-3">
          <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Description</span>
          <textarea className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional details" />
        </label>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <label>
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Type</span>
            <select className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value as typeof type)}>
              <option value="short-term">Short-term</option>
              <option value="long-term">Long-term</option>
            </select>
          </label>
          <label>
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Priority</span>
            <select className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm" value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
        </div>
        <label className="block mb-6">
          <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Target Date</span>
          <input type="date" className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
        </label>
        <div className="flex gap-3">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" className="flex-1">Add Goal</Button>
        </div>
      </form>
    </div>
  );
}

function GoalDetail({
  goal,
  milestones,
  onClose,
  onEdit,
  onDelete,
}: {
  goal: Goal;
  milestones: { id: string; title: string; isCompleted: boolean; sortOrder: number }[];
  onClose: () => void;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
}) {
  const [newMilestone, setNewMilestone] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function addMilestone() {
    if (!newMilestone.trim()) return;
    const now = new Date().toISOString();
    await db.goalMilestones.add({
      id: uuid(),
      goalId: goal.id,
      title: newMilestone.trim(),
      isCompleted: false,
      completedAt: null,
      sortOrder: milestones.length,
      createdAt: now,
      syncedAt: null,
    });
    setNewMilestone("");
  }

  async function toggleMilestone(id: string, isCompleted: boolean) {
    await db.goalMilestones.update(id, {
      isCompleted: !isCompleted,
      completedAt: !isCompleted ? new Date().toISOString() : null,
    });
    // Update goal progress
    const all = await db.goalMilestones.where("goalId").equals(goal.id).toArray();
    const done = all.filter((m) => m.id === id ? !isCompleted : m.isCompleted).length;
    const progress = all.length > 0 ? Math.round((done / all.length) * 100) : 0;
    await db.goals.update(goal.id, { progressPercent: progress, updatedAt: new Date().toISOString() });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 w-full max-w-lg shadow-xl border border-border-light dark:border-border-dark max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">{goal.title}</h2>
            {goal.description && <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{goal.description}</p>}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(goal)}
              className="size-8 rounded-lg flex items-center justify-center hover:bg-primary/10 cursor-pointer text-text-secondary-light dark:text-text-secondary-dark"
              title="Edit goal"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="size-8 rounded-lg flex items-center justify-center hover:bg-danger/10 cursor-pointer text-danger"
              title="Delete goal"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
            <button onClick={onClose} className="size-8 rounded-lg flex items-center justify-center hover:bg-surface-light-hover dark:hover:bg-surface-dark-hover cursor-pointer text-text-muted-light dark:text-text-muted-dark">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {confirmDelete && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-lg">
            <p className="text-sm font-medium text-danger mb-2">Delete this goal and all its milestones?</p>
            <div className="flex gap-2">
              <Button variant="danger" size="sm" onClick={() => { onDelete(goal.id); onClose(); }}>Delete</Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            </div>
          </div>
        )}

        <ProgressBar value={goal.progressPercent} className="mb-6" />

        <h3 className="text-sm font-bold mb-3">Milestones</h3>
        <div className="flex flex-col gap-2 mb-4">
          {milestones.sort((a, b) => a.sortOrder - b.sortOrder).map((ms) => (
            <label key={ms.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-light-hover dark:hover:bg-surface-dark-hover cursor-pointer">
              <input
                type="checkbox"
                checked={ms.isCompleted}
                onChange={() => toggleMilestone(ms.id, ms.isCompleted)}
                className="rounded text-primary focus:ring-primary size-4 cursor-pointer"
              />
              <span className={cn("text-sm", ms.isCompleted && "line-through text-text-muted-light dark:text-text-muted-dark")}>
                {ms.title}
              </span>
            </label>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            placeholder="Add a milestone..."
            onKeyDown={(e) => e.key === "Enter" && addMilestone()}
          />
          <Button variant="primary" size="sm" onClick={addMilestone}>Add</Button>
        </div>
      </div>
    </div>
  );
}

function GoalEditModal({ goal, onClose }: { goal: Goal; onClose: () => void }) {
  const [title, setTitle] = useState(goal.title);
  const [description, setDescription] = useState(goal.description ?? "");
  const [type, setType] = useState(goal.type);
  const [priority, setPriority] = useState(goal.priority);
  const [targetDate, setTargetDate] = useState(goal.targetDate ?? "");
  const [status, setStatus] = useState<"active" | "completed" | "paused" | "abandoned">(goal.status as "active" | "completed" | "paused" | "abandoned");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await db.goals.update(goal.id, {
      title: title || goal.title,
      description: description || null,
      type,
      priority,
      targetDate: targetDate || null,
      status,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 w-full max-w-md shadow-xl border border-border-light dark:border-border-dark"
      >
        <h2 className="text-lg font-bold mb-4">Edit Goal</h2>
        <label className="block mb-3">
          <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Title</span>
          <input className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="block mb-3">
          <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Description</span>
          <textarea className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <label>
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Type</span>
            <select className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value as typeof type)}>
              <option value="short-term">Short-term</option>
              <option value="long-term">Long-term</option>
            </select>
          </label>
          <label>
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Priority</span>
            <select className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm" value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label>
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Status</span>
            <select className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value as "active" | "completed" | "paused" | "abandoned")}>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </label>
        </div>
        <label className="block mb-6">
          <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Target Date</span>
          <input type="date" className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
        </label>
        <div className="flex gap-3">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" className="flex-1">Save</Button>
        </div>
      </form>
    </div>
  );
}

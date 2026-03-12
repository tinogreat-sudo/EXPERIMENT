"use client";

import { useState } from "react";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import { useSkills } from "@/hooks/useLiveData";
import { Card, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Skill } from "@/types";

const LEVELS: Skill["level"][] = ["beginner", "intermediate", "advanced", "expert"];
const LEVEL_COLORS: Record<string, string> = {
  beginner: "bg-info/15 text-info",
  intermediate: "bg-warning/15 text-warning",
  advanced: "bg-primary/15 text-primary",
  expert: "bg-success/15 text-success",
};

export default function SkillsPage() {
  const skills = useSkills();
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    targetHours: "",
    level: "beginner" as Skill["level"],
    nextMilestone: "",
  });

  function openCreate() {
    setEditingSkill(null);
    setForm({ name: "", description: "", targetHours: "", level: "beginner", nextMilestone: "" });
    setShowModal(true);
  }

  function openEdit(skill: Skill) {
    setEditingSkill(skill);
    setForm({
      name: skill.name,
      description: skill.description || "",
      targetHours: skill.targetHours?.toString() || "",
      level: skill.level,
      nextMilestone: skill.nextMilestone || "",
    });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    const now = new Date().toISOString();

    if (editingSkill) {
      await db.skills.update(editingSkill.id, {
        name: form.name.trim(),
        description: form.description.trim() || null,
        targetHours: form.targetHours ? parseFloat(form.targetHours) : null,
        level: form.level,
        nextMilestone: form.nextMilestone.trim() || null,
        updatedAt: now,
      });
    } else {
      const skill: Skill = {
        id: uuid(),
        name: form.name.trim(),
        description: form.description.trim() || null,
        targetHours: form.targetHours ? parseFloat(form.targetHours) : null,
        loggedHours: 0,
        level: form.level,
        nextMilestone: form.nextMilestone.trim() || null,
        createdAt: now,
        updatedAt: now,
        syncedAt: null,
      };
      await db.skills.add(skill);
    }
    setShowModal(false);
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this skill?")) {
      await db.skills.delete(id);
    }
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">military_tech</span>
            Skills
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1">
            Track skills you&apos;re building
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <span className="material-symbols-outlined text-sm">add</span>
          Add Skill
        </Button>
      </div>

      {/* Skills Grid */}
      {skills.length === 0 ? (
        <Card variant="ghost" className="flex flex-col items-center justify-center py-16 text-center">
          <span className="material-symbols-outlined text-5xl text-text-muted-light dark:text-text-muted-dark mb-3">military_tech</span>
          <h3 className="font-bold mb-1">No skills yet</h3>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4">Add a skill to start tracking your learning</p>
          <Button variant="primary" size="sm" onClick={openCreate}>Add Your First Skill</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map((skill) => {
            const pct = skill.targetHours ? Math.min(100, Math.round((skill.loggedHours / skill.targetHours) * 100)) : 0;
            return (
              <Card key={skill.id} className="p-4 hover:border-primary/20 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-base">{skill.name}</h3>
                    {skill.description && (
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">{skill.description}</p>
                    )}
                  </div>
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded", LEVEL_COLORS[skill.level])}>
                    {skill.level}
                  </span>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{skill.loggedHours.toFixed(1)}h logged</span>
                    {skill.targetHours && <span className="text-text-muted-light dark:text-text-muted-dark">/ {skill.targetHours}h target</span>}
                  </div>
                  {skill.targetHours && (
                    <div className="h-2 rounded-full bg-border-light dark:bg-surface-dark-raised overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                </div>

                {/* Next milestone */}
                {skill.nextMilestone && (
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-3 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-warning">flag</span>
                    {skill.nextMilestone}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button onClick={() => openEdit(skill)} className="text-xs text-primary hover:underline cursor-pointer">Edit</button>
                  <button onClick={() => handleDelete(skill.id)} className="text-xs text-danger hover:underline cursor-pointer">Delete</button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md p-6 bg-surface-light dark:bg-surface-dark">
            <h2 className="text-lg font-bold mb-4">{editingSkill ? "Edit Skill" : "Add Skill"}</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark">Name</label>
                <input
                  className="w-full mt-1 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. TypeScript, Piano, Public Speaking"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark">Description</label>
                <input
                  className="w-full mt-1 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark">Target Hours</label>
                  <input
                    type="number"
                    className="w-full mt-1 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={form.targetHours}
                    onChange={(e) => setForm({ ...form, targetHours: e.target.value })}
                    placeholder="e.g. 100"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark">Level</label>
                  <select
                    className="w-full mt-1 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value as Skill["level"] })}
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark">Next Milestone</label>
                <input
                  className="w-full mt-1 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.nextMilestone}
                  onChange={(e) => setForm({ ...form, nextMilestone: e.target.value })}
                  placeholder="e.g. Complete advanced course"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleSave}>
                {editingSkill ? "Save Changes" : "Add Skill"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

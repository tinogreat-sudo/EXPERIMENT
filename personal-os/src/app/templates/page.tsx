"use client";

import { useState, useMemo } from "react";
import { v4 as uuid } from "uuid";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { useCategories } from "@/hooks/useLiveData";
import { Button, Card, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { minutesToHours } from "@/lib/utils";
import type { DayTemplate, DayType } from "@/types";

const DAY_TYPES: { value: DayType; label: string; color: string }[] = [
  { value: "work", label: "Work", color: "bg-primary/10 text-primary" },
  { value: "school", label: "School", color: "bg-info/10 text-info" },
  { value: "weekend", label: "Weekend", color: "bg-success/10 text-success" },
  { value: "recovery", label: "Recovery", color: "bg-warning/10 text-warning" },
  { value: "travel", label: "Travel", color: "bg-secondary/10 text-secondary" },
  { value: "custom", label: "Custom", color: "bg-surface-light dark:bg-surface-dark text-text-muted-light dark:text-text-muted-dark" },
];

function dayTypeStyle(type: DayType): string {
  return DAY_TYPES.find((t) => t.value === type)?.color ?? "";
}

export default function TemplatesPage() {
  const rawTemplates = useLiveQuery(() => db.dayTemplates.orderBy("name").toArray());
  const templates = useMemo(() => rawTemplates ?? [], [rawTemplates]);
  const categories = useCategories();
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DayTemplate | null>(null);

  function openCreate() {
    setEditingTemplate(null);
    setShowModal(true);
  }

  function openEdit(t: DayTemplate) {
    setEditingTemplate(t);
    setShowModal(true);
  }

  async function deleteTemplate(id: string) {
    if (!confirm("Delete this template?")) return;
    await db.dayTemplates.delete(id);
  }

  async function duplicateTemplate(t: DayTemplate) {
    const now = new Date().toISOString();
    await db.dayTemplates.add({
      ...t,
      id: uuid(),
      name: `${t.name} (copy)`,
      isDefault: false,
      createdAt: now,
      updatedAt: now,
      syncedAt: null,
    });
  }

  const grouped = useMemo(() => {
    const map = new Map<DayType, DayTemplate[]>();
    for (const t of templates) {
      const list = map.get(t.dayType) ?? [];
      list.push(t);
      map.set(t.dayType, list);
    }
    return map;
  }, [templates]);

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">view_timeline</span>
            Day Templates
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1">
            Reusable schedule blueprints for different kinds of days.
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <span className="material-symbols-outlined text-lg">add</span>
          New Template
        </Button>
      </div>

      {templates.length === 0 && (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-5xl text-text-muted-light dark:text-text-muted-dark mb-3 block">
            view_timeline
          </span>
          <p className="text-text-muted-light dark:text-text-muted-dark font-medium">
            No templates yet. Create your first one or they will be seeded automatically.
          </p>
        </div>
      )}

      {Array.from(grouped.entries()).map(([dayType, list]) => (
        <div key={dayType} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={cn("px-3 py-1 rounded-full text-xs font-bold", dayTypeStyle(dayType))}>
              {DAY_TYPES.find((t) => t.value === dayType)?.label ?? dayType}
            </span>
            <span className="text-xs text-text-muted-light dark:text-text-muted-dark">{list.length} template{list.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {list.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                categories={categories}
                onEdit={() => openEdit(template)}
                onDuplicate={() => duplicateTemplate(template)}
                onDelete={() => deleteTemplate(template.id)}
              />
            ))}
          </div>
        </div>
      ))}

      {showModal && (
        <TemplateModal
          template={editingTemplate}
          categories={categories}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// ===== Template Card =====

function TemplateCard({
  template,
  categories,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  template: DayTemplate;
  categories: { id: string; name: string; color: string }[];
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  function getCategoryName(id: string) {
    return categories.find((c) => c.id === id)?.name ?? "?";
  }

  function formatTime(t: string) {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
  }

  return (
    <Card className="relative">
      {template.isDefault && (
        <div className="absolute top-3 right-3">
          <Badge variant="default">Default</Badge>
        </div>
      )}
      <div className="flex items-start justify-between mb-3 pr-16">
        <div>
          <h3 className="font-bold">{template.name}</h3>
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">
            {template.blocks.length} blocks ·{" "}
            {minutesToHours(template.deepWorkTarget ?? 0)} deep work ·{" "}
            {minutesToHours(template.skillTarget ?? 0)} skills
          </p>
        </div>
      </div>

      {/* Preview blocks */}
      <div className={cn("space-y-1 overflow-hidden transition-all", expanded ? "" : "max-h-32")}>
        {template.blocks.map((block, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-text-secondary-light dark:text-text-secondary-dark">
            <span className="font-mono text-[10px] text-text-muted-light dark:text-text-muted-dark w-28 shrink-0">
              {formatTime(block.startTime)} – {formatTime(block.endTime)}
            </span>
            <span className={cn("font-medium flex-1", block.isNonNegotiable && "text-primary")}>
              {block.title}
            </span>
            <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark">
              {getCategoryName(block.categoryId)}
            </span>
            {block.isNonNegotiable && (
              <span className="material-symbols-outlined text-primary text-xs">star</span>
            )}
          </div>
        ))}
      </div>

      {template.blocks.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-primary mt-2 cursor-pointer hover:underline"
        >
          {expanded ? "Show less" : `Show all ${template.blocks.length} blocks`}
        </button>
      )}

      <div className="flex gap-2 mt-4 pt-4 border-t border-border-light dark:border-border-dark">
        <Button variant="secondary" size="sm" onClick={onEdit}>
          <span className="material-symbols-outlined text-sm">edit</span>
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={onDuplicate}>
          <span className="material-symbols-outlined text-sm">content_copy</span>
          Duplicate
        </Button>
        {!template.isDefault && (
          <Button variant="danger" size="sm" onClick={onDelete} className="ml-auto">
            <span className="material-symbols-outlined text-sm">delete</span>
          </Button>
        )}
      </div>
    </Card>
  );
}

// ===== Template Modal =====

interface BlockDraft {
  title: string;
  categoryId: string;
  startTime: string;
  endTime: string;
  isNonNegotiable: boolean;
}

function TemplateModal({
  template,
  categories,
  onClose,
}: {
  template: DayTemplate | null;
  categories: { id: string; name: string }[];
  onClose: () => void;
}) {
  const [name, setName] = useState(template?.name ?? "");
  const [dayType, setDayType] = useState<DayType>(template?.dayType ?? "work");
  const [deepWorkTarget, setDeepWorkTarget] = useState(template?.deepWorkTarget ?? 180);
  const [skillTarget, setSkillTarget] = useState(template?.skillTarget ?? 60);
  const [goalTarget, setGoalTarget] = useState(template?.goalTarget ?? 180);
  const [blocks, setBlocks] = useState<BlockDraft[]>(
    template?.blocks.map((b) => ({ ...b })) ?? [
      { title: "Morning Routine", categoryId: categories[3]?.id ?? "", startTime: "07:00", endTime: "08:00", isNonNegotiable: true },
    ]
  );

  function addBlock() {
    const last = blocks[blocks.length - 1];
    setBlocks([
      ...blocks,
      {
        title: "",
        categoryId: categories[0]?.id ?? "",
        startTime: last?.endTime ?? "09:00",
        endTime: last?.endTime ? addMinutesToTime(last.endTime, 60) : "10:00",
        isNonNegotiable: false,
      },
    ]);
  }

  function removeBlock(i: number) {
    setBlocks(blocks.filter((_, idx) => idx !== i));
  }

  function updateBlock(i: number, patch: Partial<BlockDraft>) {
    setBlocks(blocks.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || blocks.length === 0) return;
    const now = new Date().toISOString();

    if (template) {
      await db.dayTemplates.update(template.id, {
        name: name.trim(),
        dayType,
        deepWorkTarget,
        skillTarget,
        goalTarget,
        blocks: blocks.filter((b) => b.title.trim()),
        updatedAt: now,
      });
    } else {
      await db.dayTemplates.add({
        id: uuid(),
        name: name.trim(),
        dayType,
        deepWorkTarget,
        skillTarget,
        goalTarget,
        blocks: blocks.filter((b) => b.title.trim()),
        isDefault: false,
        createdAt: now,
        updatedAt: now,
        syncedAt: null,
      });
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-start justify-center bg-black/50 p-4 sm:pt-8 overflow-auto" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSave}
        className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 w-full max-w-2xl shadow-xl border border-border-light dark:border-border-dark"
      >
        <h2 className="text-lg font-bold mb-4">{template ? "Edit Template" : "New Template"}</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <label>
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Name</span>
            <input
              className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Productive Work Day"
              required
            />
          </label>
          <label>
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Day Type</span>
            <select
              className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm"
              value={dayType}
              onChange={(e) => setDayType(e.target.value as DayType)}
            >
              {DAY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <label>
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Deep Work (min)</span>
            <input
              type="number" min={0} step={15}
              className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm"
              value={deepWorkTarget}
              onChange={(e) => setDeepWorkTarget(parseInt(e.target.value) || 0)}
            />
          </label>
          <label>
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Skills (min)</span>
            <input
              type="number" min={0} step={15}
              className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm"
              value={skillTarget}
              onChange={(e) => setSkillTarget(parseInt(e.target.value) || 0)}
            />
          </label>
          <label>
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Goal Work (min)</span>
            <input
              type="number" min={0} step={15}
              className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm"
              value={goalTarget}
              onChange={(e) => setGoalTarget(parseInt(e.target.value) || 0)}
            />
          </label>
        </div>

        {/* Blocks */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase">Time Blocks</span>
            <button
              type="button"
              onClick={addBlock}
              className="text-xs text-primary font-bold flex items-center gap-1 cursor-pointer hover:opacity-80"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Block
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {blocks.map((block, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="time"
                  className="bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-2 py-1.5 text-xs w-24"
                  value={block.startTime}
                  onChange={(e) => updateBlock(i, { startTime: e.target.value })}
                />
                <input
                  type="time"
                  className="bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-2 py-1.5 text-xs w-24"
                  value={block.endTime}
                  onChange={(e) => updateBlock(i, { endTime: e.target.value })}
                />
                <input
                  className="flex-1 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-2 py-1.5 text-xs min-w-0"
                  value={block.title}
                  onChange={(e) => updateBlock(i, { title: e.target.value })}
                  placeholder="Block title"
                />
                <select
                  className="bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-2 py-1.5 text-xs"
                  value={block.categoryId}
                  onChange={(e) => updateBlock(i, { categoryId: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  title="Non-negotiable"
                  onClick={() => updateBlock(i, { isNonNegotiable: !block.isNonNegotiable })}
                  className={cn(
                    "p-1 rounded cursor-pointer transition-colors",
                    block.isNonNegotiable ? "text-primary" : "text-text-muted-light dark:text-text-muted-dark"
                  )}
                >
                  <span className="material-symbols-outlined text-sm">star</span>
                </button>
                <button
                  type="button"
                  onClick={() => removeBlock(i)}
                  className="p-1 rounded hover:bg-danger/10 text-text-muted-light dark:text-text-muted-dark cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark mt-2">
            <span className="material-symbols-outlined text-xs">star</span> = non-negotiable block (weighted double in scoring)
          </p>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" className="flex-1">
            {template ? "Save Changes" : "Create Template"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${newH.toString().padStart(2, "0")}:${newM.toString().padStart(2, "0")}`;
}

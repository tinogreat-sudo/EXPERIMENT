"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import { useTodayPlan, useTodayBlocks, useCategories, useDayTemplates } from "@/hooks/useLiveData";
import { getTodayDateString, getFormattedDate } from "@/lib/utils";
import { loadTemplateIntoPlan, saveCurrentDayAsTemplate } from "@/lib/dayplan";
import { Button, Card, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { TimeBlock, BlockStatus } from "@/types";

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 9 PM

export default function SchedulePage() {
  const todayPlan = useTodayPlan();
  const blocks = useTodayBlocks();
  const categories = useCategories();
  const [showModal, setShowModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const templates = useDayTemplates();

  // Current time marker position
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [currentMinute, setCurrentMinute] = useState(new Date().getMinutes());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentHour(now.getHours());
      setCurrentMinute(now.getMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const completedCount = useMemo(() => blocks.filter((b) => b.status === "completed").length, [blocks]);
  const totalCount = blocks.length;

  const getBlockForHour = useCallback(
    (hour: number) =>
      blocks.filter((b) => {
        const startH = parseInt(b.startTime.split(":")[0]);
        const endH = parseInt(b.endTime.split(":")[0]);
        return hour >= startH && hour < endH;
      }),
    [blocks]
  );

  const getCategoryColor = useCallback(
    (catId: string) => categories.find((c) => c.id === catId)?.color ?? "#94a3b8",
    [categories]
  );

  const getCategoryIcon = useCallback(
    (catId: string) => categories.find((c) => c.id === catId)?.icon ?? "category",
    [categories]
  );

  async function handleAddBlock(block: Omit<TimeBlock, "id" | "createdAt" | "updatedAt" | "syncedAt">) {
    const now = new Date().toISOString();
    if (editingBlock) {
      await db.timeBlocks.update(editingBlock.id, { ...block, updatedAt: now });
    } else {
      await db.timeBlocks.add({ ...block, id: uuid(), createdAt: now, updatedAt: now, syncedAt: null });
    }
    setShowModal(false);
    setEditingBlock(null);
  }

  async function deleteBlock(blockId: string) {
    await db.timeBlocks.delete(blockId);
  }

  async function updateBlockStatus(blockId: string, status: BlockStatus) {
    await db.timeBlocks.update(blockId, { status, updatedAt: new Date().toISOString() });
  }

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">Daily Planner</h1>
          <div className="flex items-center gap-4">
            <Badge variant="primary">{getFormattedDate()}</Badge>
            <div className="flex items-center gap-1 text-text-secondary-light dark:text-text-secondary-dark text-sm">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span>{totalCount > 0 ? `${Math.round((completedCount / totalCount) * 100)}% Complete` : "No blocks yet"}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setShowTemplateModal(true)}>
            <span className="material-symbols-outlined text-lg">layers</span>
            Load Template
          </Button>
          <Button variant="primary" onClick={() => { setEditingBlock(null); setShowModal(true); }}>
            <span className="material-symbols-outlined text-lg">add</span>
            Add Block
          </Button>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="grid" style={{ gridTemplateColumns: "80px 1fr" }}>
        {/* Time Column + Events */}
        {HOURS.map((hour) => {
          const hourBlocks = getBlockForHour(hour);
          const isCurrentHour = hour === currentHour;
          const amPm = hour >= 12 ? "PM" : "AM";
          const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

          return (
            <div key={hour} className="contents">
              {/* Time label */}
              <div
                className={cn(
                  "h-20 flex items-start justify-end pr-4 py-2 border-r border-border-light dark:border-border-dark",
                  isCurrentHour && "bg-primary/5"
                )}
              >
                <span className={cn(
                  "text-xs font-bold uppercase tracking-tighter",
                  isCurrentHour ? "text-primary" : "text-text-muted-light dark:text-text-muted-dark"
                )}>
                  {String(displayHour).padStart(2, "0")} {amPm}
                </span>
              </div>

              {/* Event cell */}
              <div className={cn(
                "h-20 relative border-b border-border-light dark:border-border-dark",
                isCurrentHour && "bg-primary/5"
              )}>
                {/* Current time marker */}
                {isCurrentHour && (
                  <div
                    className="absolute left-0 right-0 z-10 flex items-center"
                    style={{ top: `${(currentMinute / 60) * 100}%` }}
                  >
                    <div className="size-2 rounded-full bg-primary" />
                    <div className="flex-1 h-[2px] bg-primary" />
                    <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
                      {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                    </span>
                  </div>
                )}

                {/* Blocks */}
                {hourBlocks.map((block) => (
                  <div
                    key={block.id}
                    className={cn(
                      "absolute inset-1 rounded-lg p-2 flex items-start gap-2 cursor-pointer transition-all group",
                      block.status === "completed" && "opacity-60",
                      block.status === "pending" && "border-dashed",
                      block.isNonNegotiable
                        ? "border-l-4 border-primary bg-primary/10"
                        : "border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:border-primary/50"
                    )}
                    onClick={() => {
                      const nextStatus: Record<BlockStatus, BlockStatus> = {
                        pending: "in-progress",
                        "in-progress": "completed",
                        completed: "pending",
                        skipped: "pending",
                        moved: "pending",
                      };
                      updateBlockStatus(block.id, nextStatus[block.status]);
                    }}
                  >
                    <div
                      className="size-6 rounded flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: getCategoryColor(block.categoryId) }}
                    >
                      <span className="material-symbols-outlined text-sm">{getCategoryIcon(block.categoryId)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold truncate">{block.title}</h4>
                        {block.isNonNegotiable && (
                          <span className="material-symbols-outlined text-primary text-sm filled" title="Non-negotiable">verified</span>
                        )}
                      </div>
                      <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark">
                        {block.startTime} – {block.endTime}
                      </p>
                    </div>
                    {block.status === "completed" && (
                      <span className="material-symbols-outlined text-success text-sm filled">check_circle</span>
                    )}
                    {/* Edit/Delete buttons */}
                    <div className="absolute top-1 right-1 hidden group-hover:flex gap-0.5">
                      <button
                        className="size-6 rounded flex items-center justify-center bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-primary/10 cursor-pointer"
                        title="Edit"
                        onClick={(e) => { e.stopPropagation(); setEditingBlock(block); setShowModal(true); }}
                      >
                        <span className="material-symbols-outlined text-xs">edit</span>
                      </button>
                      <button
                        className="size-6 rounded flex items-center justify-center bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-danger/10 text-danger cursor-pointer"
                        title="Delete"
                        onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
                      >
                        <span className="material-symbols-outlined text-xs">delete</span>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Empty slot hint */}
                {hourBlocks.length === 0 && (
                  <button
                    className="absolute inset-1 rounded-lg border-2 border-dashed border-transparent hover:border-primary/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => { setEditingBlock(null); setShowModal(true); }}
                  >
                    <span className="material-symbols-outlined text-primary/30 text-sm">add</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {[
          { label: "Total Blocks", value: totalCount, icon: "grid_view" },
          { label: "Completed", value: completedCount, icon: "task_alt" },
          { label: "Completion Rate", value: totalCount > 0 ? `${Math.round((completedCount / totalCount) * 100)}%` : "—", icon: "percent" },
          { label: "Remaining", value: totalCount - completedCount, icon: "pending" },
        ].map((stat) => (
          <Card key={stat.label} variant="metric" className="flex items-center gap-3 p-4">
            <span className="material-symbols-outlined text-primary">{stat.icon}</span>
            <div>
              <p className="text-[10px] font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <TemplateModal
          templates={templates}
          categories={categories}
          blocks={blocks}
          onLoad={async (templateId) => {
            await loadTemplateIntoPlan(templateId);
            setShowTemplateModal(false);
          }}
          onSave={async (name) => {
            await saveCurrentDayAsTemplate(name);
            setShowTemplateModal(false);
          }}
          onClose={() => setShowTemplateModal(false)}
        />
      )}

      {/* Add Block Modal */}
      {showModal && (
        <BlockModal
          categories={categories}
          dayPlanId={todayPlan?.id ?? null}
          editingBlock={editingBlock}
          onSave={handleAddBlock}
          onClose={() => { setShowModal(false); setEditingBlock(null); }}
        />
      )}
    </div>
  );
}

// --- Block Create/Edit Modal ---
function BlockModal({
  categories,
  dayPlanId,
  editingBlock,
  onSave,
  onClose,
}: {
  categories: { id: string; name: string; color: string; icon: string }[];
  dayPlanId: string | null;
  editingBlock: TimeBlock | null;
  onSave: (block: Omit<TimeBlock, "id" | "createdAt" | "updatedAt" | "syncedAt">) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(editingBlock?.title ?? "");
  const [categoryId, setCategoryId] = useState(editingBlock?.categoryId ?? categories[0]?.id ?? "");
  const [startTime, setStartTime] = useState(editingBlock?.startTime ?? "09:00");
  const [endTime, setEndTime] = useState(editingBlock?.endTime ?? "10:00");
  const [isNonNeg, setIsNonNeg] = useState(editingBlock?.isNonNegotiable ?? false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let planId = dayPlanId;
    if (!planId) {
      const now = new Date().toISOString();
      const today = getTodayDateString();
      planId = uuid();
      await db.dayPlans.add({
        id: planId, date: today, dayType: "work", templateId: null, intention: null,
        sleepHours: null, sleepQuality: null, bedtime: null, wakeTime: null,
        morningEnergy: null, overallEnergy: null, overallFocus: null,
        startedAt: null, endedAt: null, status: "planning",
        createdAt: now, updatedAt: now, syncedAt: null,
      });
    }
    onSave({
      dayPlanId: planId,
      title: title || "Untitled Block",
      categoryId,
      startTime,
      endTime,
      isNonNegotiable: isNonNeg,
      status: "pending",
      goalId: null,
      skillId: null,
      sortOrder: 0,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 w-full max-w-md shadow-xl border border-border-light dark:border-border-dark"
      >
        <h2 className="text-lg font-bold mb-4">{editingBlock ? "Edit Time Block" : "Add Time Block"}</h2>

        <label className="block mb-3">
          <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Title</span>
          <input
            className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What are you working on?"
          />
        </label>

        <label className="block mb-3">
          <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Category</span>
          <select
            className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <label>
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">Start</span>
            <input
              type="time"
              className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </label>
          <label>
            <span className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1 block">End</span>
            <input
              type="time"
              className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </label>
        </div>

        <label className="flex items-center gap-3 mb-6">
          <input
            type="checkbox"
            checked={isNonNeg}
            onChange={(e) => setIsNonNeg(e.target.checked)}
            className="rounded text-primary focus:ring-primary size-5"
          />
          <span className="text-sm font-medium">Non-negotiable</span>
        </label>

        <div className="flex gap-3">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" className="flex-1">{editingBlock ? "Save" : "Add Block"}</Button>
        </div>
      </form>
    </div>
  );
}

// --- Template Modal ---
function TemplateModal({
  templates,
  categories,
  blocks,
  onLoad,
  onSave,
  onClose,
}: {
  templates: { id: string; name: string; dayType: string; blocks: { title: string; categoryId: string; startTime: string; endTime: string }[] }[];
  categories: { id: string; name: string; color: string }[];
  blocks: TimeBlock[];
  onLoad: (templateId: string) => Promise<void>;
  onSave: (name: string) => Promise<void>;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"load" | "save">("load");
  const [saveName, setSaveName] = useState("");
  const [loading, setLoading] = useState(false);

  const getCatColor = (catId: string) => categories.find((c) => c.id === catId)?.color ?? "#94a3b8";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 w-full max-w-lg shadow-xl border border-border-light dark:border-border-dark max-h-[80vh] overflow-y-auto"
      >
        <h2 className="text-lg font-bold mb-4">Day Templates</h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("load")}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all",
              tab === "load" ? "bg-primary text-white" : "bg-surface-light-hover dark:bg-surface-dark-hover border border-border-light dark:border-border-dark"
            )}
          >
            Load Template
          </button>
          <button
            onClick={() => setTab("save")}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all",
              tab === "save" ? "bg-primary text-white" : "bg-surface-light-hover dark:bg-surface-dark-hover border border-border-light dark:border-border-dark"
            )}
          >
            Save Current
          </button>
        </div>

        {tab === "load" ? (
          <div className="flex flex-col gap-3">
            {templates.length === 0 ? (
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark text-center py-6">
                No templates available yet. Save your current schedule as a template.
              </p>
            ) : (
              templates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="p-4 rounded-xl border border-border-light dark:border-border-dark"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-bold">{tmpl.name}</h3>
                      <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                        {tmpl.blocks.length} blocks &middot; {tmpl.dayType}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={loading}
                      onClick={async () => {
                        setLoading(true);
                        await onLoad(tmpl.id);
                        setLoading(false);
                      }}
                    >
                      Load
                    </Button>
                  </div>
                  {/* Block preview strip */}
                  <div className="flex gap-1 mt-2">
                    {tmpl.blocks.slice(0, 8).map((b, i) => (
                      <div
                        key={i}
                        className="h-2 flex-1 rounded-full"
                        style={{ backgroundColor: getCatColor(b.categoryId) }}
                        title={b.title}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div>
            {blocks.length === 0 ? (
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark text-center py-6">
                Add some blocks to your schedule first, then save it as a template.
              </p>
            ) : (
              <>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">
                  Save today&apos;s {blocks.length} blocks as a reusable template.
                </p>
                <input
                  className="w-full bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 mb-4"
                  placeholder="Template name..."
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                />
                <Button
                  variant="primary"
                  className="w-full"
                  disabled={loading || !saveName.trim()}
                  onClick={async () => {
                    setLoading(true);
                    await onSave(saveName.trim());
                    setLoading(false);
                  }}
                >
                  Save Template
                </Button>
              </>
            )}
          </div>
        )}

        <Button variant="ghost" className="w-full mt-4" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarClock, ChevronDown, LocateFixed, SlidersHorizontal } from "lucide-react";
import { TimelineDayGroup } from "../../components/timeline/TimelineDayGroup";
import type { Memory, MemoryType } from "../../lib/memory/types";

type TimelineViewProps = {
  memories: Memory[];
  selectedMemoryId: string | null;
  onSelectMemory: (id: string) => void;
};

const filters: Array<{ label: string; value: "all" | MemoryType }> = [
  { label: "All signal", value: "all" },
  { label: "Notes", value: "note" },
  { label: "Voice", value: "voice" },
  { label: "Images", value: "image" },
  { label: "PDFs", value: "pdf" },
  { label: "Code", value: "code" },
  { label: "Links", value: "link" },
];

function dateKey(value: string) {
  const date = new Date(value);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function TimelineView({
  memories,
  selectedMemoryId,
  onSelectMemory,
}: TimelineViewProps) {
  const [typeFilter, setTypeFilter] = useState<"all" | MemoryType>("all");
  const [tagFilter, setTagFilter] = useState("all");
  const todayRef = useRef<HTMLDivElement>(null);

  const tags = useMemo(
    () => [...new Set(memories.flatMap((memory) => memory.tags))].sort(),
    [memories]
  );

  const filtered = useMemo(
    () =>
      memories.filter(
        (memory) =>
          (typeFilter === "all" || memory.memoryType === typeFilter) &&
          (tagFilter === "all" || memory.tags.includes(tagFilter))
      ),
    [memories, tagFilter, typeFilter]
  );

  const groups = useMemo(() => {
    const grouped = new Map<string, Memory[]>();
    for (const memory of filtered) {
      const key = dateKey(memory.capturedAt);
      grouped.set(key, [...(grouped.get(key) ?? []), memory]);
    }
    return [...grouped.values()].map((items) => ({
      date: new Date(items[0].capturedAt),
      memories: items,
    }));
  }, [filtered]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!["ArrowDown", "ArrowUp"].includes(event.key) || !filtered.length) return;
      const activeElement = document.activeElement;
      if (
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement
      ) {
        return;
      }
      event.preventDefault();
      const index = filtered.findIndex((memory) => memory.id === selectedMemoryId);
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex =
        index < 0
          ? direction > 0
            ? 0
            : filtered.length - 1
          : (index + direction + filtered.length) % filtered.length;
      const next = filtered[nextIndex];
      onSelectMemory(next.id);
      requestAnimationFrame(() => {
        document
          .querySelector(`[data-memory-id="${CSS.escape(next.id)}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [filtered, onSelectMemory, selectedMemoryId]);

  let runningIndex = 0;

  return (
    <div className="timeline-view">
      <header className="timeline-view__header">
        <div>
          <span className="section-kicker">Chronological field</span>
          <h1>Replay the shape<br />of your thinking.</h1>
        </div>
        <div className="timeline-stat">
          <CalendarClock size={19} />
          <span>
            <strong>{memories.length}</strong>
            memories in view
          </span>
        </div>
      </header>

      <div className="timeline-toolbar">
        <div className="filter-pills" aria-label="Filter by memory type">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter.value}
              className={typeFilter === filter.value ? "is-active" : ""}
              onClick={() => setTypeFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="timeline-toolbar__actions">
          <label className="tag-filter">
            <SlidersHorizontal size={13} />
            <select
              aria-label="Filter by tag"
              value={tagFilter}
              onChange={(event) => setTagFilter(event.target.value)}
            >
              <option value="all">Every tag</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
            <ChevronDown size={12} />
          </label>
          <button
            type="button"
            className="jump-today"
            onClick={() =>
              todayRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
          >
            <LocateFixed size={14} />
            Today
          </button>
        </div>
      </div>

      <div className="timeline-canvas" ref={todayRef}>
        {groups.length ? (
          groups.map((group) => {
            const startIndex = runningIndex;
            runningIndex += group.memories.length;
            return (
              <TimelineDayGroup
                key={dateKey(group.date.toISOString())}
                date={group.date}
                memories={group.memories}
                startIndex={startIndex}
                selectedMemoryId={selectedMemoryId}
                onOpen={(memory) => onSelectMemory(memory.id)}
              />
            );
          })
        ) : (
          <div className="timeline-empty">
            <LocateFixed size={26} />
            <h2>No signal in this slice.</h2>
            <p>Change the filters to bring more of the archive into view.</p>
          </div>
        )}
      </div>
      <p className="timeline-hint">Use ↑ and ↓ to travel between memories.</p>
    </div>
  );
}


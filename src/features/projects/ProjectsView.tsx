import { motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  ChevronRight,
  FileText,
  Layers3,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ProjectBriefDialog } from "../../components/export/ProjectBriefDialog";
import { MemoryTypeBadge } from "../../components/memory/MemoryTypeBadge";
import { localSummaryProvider } from "../../lib/ai/localFallback";
import type { Memory } from "../../lib/memory/types";

type ProjectsViewProps = {
  memories: Memory[];
};

function sameLocalDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function ProjectsView({ memories }: ProjectsViewProps) {
  const [title, setTitle] = useState("MnemoScope product direction");
  const [selectedIds, setSelectedIds] = useState<string[]>(
    memories.slice(0, 3).map((memory) => memory.id)
  );
  const [daySummary, setDaySummary] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [working, setWorking] = useState(false);

  const selected = useMemo(
    () => memories.filter((memory) => selectedIds.includes(memory.id)),
    [memories, selectedIds]
  );

  const todayMemories = useMemo(() => {
    const now = new Date();
    const actualToday = memories.filter((memory) =>
      sameLocalDay(new Date(memory.capturedAt), now)
    );
    if (actualToday.length) return actualToday;
    const latest = memories[0] ? new Date(memories[0].capturedAt) : now;
    return memories.filter((memory) =>
      sameLocalDay(new Date(memory.capturedAt), latest)
    );
  }, [memories]);

  const toggle = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((memoryId) => memoryId !== id)
        : [...current, id]
    );
  };

  const generateBrief = async () => {
    if (!selected.length || !title.trim()) return;
    setWorking(true);
    try {
      const next = await localSummaryProvider.generateProjectBrief({
        title: title.trim(),
        memories: selected,
      });
      setMarkdown(next);
      setDialogOpen(true);
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="projects-view">
      <header className="projects-view__header">
        <div>
          <span className="section-kicker">Synthesis desk</span>
          <h1>Turn scattered moments<br />into a clear direction.</h1>
          <p>
            Select the memories that belong together. MnemoScope shapes them
            into a portable brief without moving the source material off-device.
          </p>
        </div>
        <div className="project-count">
          <Layers3 size={18} />
          <strong>{selected.length}</strong>
          <span>selected</span>
        </div>
      </header>

      <section className="day-synthesis">
        <div className="day-synthesis__heading">
          <span className="day-synthesis__icon">
            <CalendarDays size={18} />
          </span>
          <div>
            <span>Daily synthesis</span>
            <strong>What was today really about?</strong>
          </div>
          <button
            type="button"
            onClick={async () =>
              setDaySummary(
                await localSummaryProvider.summarizeDay(todayMemories)
              )
            }
          >
            <Sparkles size={13} />
            Generate locally
          </button>
        </div>
        <p>
          {daySummary ||
            `${todayMemories.length} memories are ready to be read as one continuous day.`}
        </p>
      </section>

      <div className="project-builder">
        <section className="project-memory-picker">
          <div className="project-section-heading">
            <div>
              <span className="form-label">Source memories</span>
              <h2>Choose the useful signal</h2>
            </div>
            <button
              type="button"
              onClick={() =>
                setSelectedIds(
                  selectedIds.length === memories.length
                    ? []
                    : memories.map((memory) => memory.id)
                )
              }
            >
              {selectedIds.length === memories.length ? "Clear all" : "Select all"}
            </button>
          </div>
          <div className="project-memory-list">
            {memories.map((memory, index) => {
              const active = selectedIds.includes(memory.id);
              return (
                <motion.button
                  type="button"
                  key={memory.id}
                  className={active ? "is-selected" : ""}
                  onClick={() => toggle(memory.id)}
                  initial={{ opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.025, 0.18) }}
                >
                  <span className="project-memory-check">
                    {active && <Check size={12} />}
                  </span>
                  <MemoryTypeBadge type={memory.memoryType} compact />
                  <div>
                    <strong>{memory.title}</strong>
                    <small>
                      {new Date(memory.capturedAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                      {" · "}
                      {memory.tags.map((tag) => `#${tag}`).join(" ")}
                    </small>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>

        <aside className="project-output">
          <span className="form-label">Project brief</span>
          <h2>Name the direction</h2>
          <label>
            <span>Project title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="A clear name for this body of work"
            />
          </label>

          <div className="brief-outline">
            <span>Generated structure</span>
            {[
              "Why this matters",
              "Timeline",
              "Key ideas",
              "Useful references",
              "Decisions",
              "Next steps",
            ].map((section) => (
              <div key={section}>
                <ChevronRight size={12} />
                {section}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="generate-brief"
            disabled={!selected.length || !title.trim() || working}
            onClick={() => void generateBrief()}
          >
            <FileText size={15} />
            {working ? "Composing..." : "Generate Markdown brief"}
          </button>
          <small>
            Uses the local fallback provider. No API key or network request is
            required.
          </small>
        </aside>
      </div>

      <ProjectBriefDialog
        open={dialogOpen}
        title={title}
        markdown={markdown}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}


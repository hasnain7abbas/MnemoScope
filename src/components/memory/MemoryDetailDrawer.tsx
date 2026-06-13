import { AnimatePresence, motion } from "framer-motion";
import {
  AudioLines,
  Check,
  Clipboard,
  FileText,
  Link2,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { parseMetadata, type Memory } from "../../lib/memory/types";
import { MemoryTypeBadge } from "./MemoryTypeBadge";

type MemoryDetailDrawerProps = {
  memory: Memory | null;
  relatedMemories: Memory[];
  onClose: () => void;
  onOpenRelated: (id: string) => void;
  onSummarize: (memory: Memory) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function MemoryDetailDrawer({
  memory,
  relatedMemories,
  onClose,
  onOpenRelated,
  onSummarize,
  onDelete,
}: MemoryDetailDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setCopied(false);
    setConfirmDelete(false);
  }, [memory?.id]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && memory) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [memory, onClose]);

  const metadata = memory ? parseMetadata(memory) : {};

  return (
    <AnimatePresence>
      {memory && (
        <>
          <motion.button
            type="button"
            aria-label="Close memory detail"
            className="detail-scrim"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="memory-detail"
            aria-label={`Memory detail: ${memory.title}`}
            initial={{ x: "102%" }}
            animate={{ x: 0 }}
            exit={{ x: "102%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
          >
            <header className="memory-detail__header">
              <div>
                <span>Memory capsule</span>
                <strong>
                  {new Date(memory.capturedAt).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </strong>
              </div>
              <button type="button" aria-label="Close detail" onClick={onClose}>
                <X size={17} />
              </button>
            </header>

            <div className="memory-detail__scroll">
              <div className="memory-detail__title">
                <MemoryTypeBadge type={memory.memoryType} />
                <h2>{memory.title}</h2>
                <time>
                  {new Date(memory.capturedAt).toLocaleString([], {
                    weekday: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>

              {memory.memoryType === "image" && metadata.imageDataUrl && (
                <img
                  className="memory-detail__image"
                  src={metadata.imageDataUrl}
                  alt={memory.title}
                />
              )}

              {memory.memoryType === "voice" && (
                <div className="detail-audio">
                  <AudioLines size={19} />
                  {typeof metadata.audioDataUrl === "string" ? (
                    <audio controls src={metadata.audioDataUrl} />
                  ) : (
                    <span>
                      Transcript preserved
                      {metadata.durationSeconds
                        ? ` · ${metadata.durationSeconds}s`
                        : ""}
                    </span>
                  )}
                </div>
              )}

              <section className="memory-detail__section">
                <span className="form-label">
                  {memory.memoryType === "voice" ? "Transcript" : "Full memory"}
                </span>
                {memory.memoryType === "code" ? (
                  <pre>
                    <code>{memory.content}</code>
                  </pre>
                ) : (
                  <p>{memory.content}</p>
                )}
              </section>

              <section className="memory-detail__section memory-summary">
                <div className="memory-detail__section-heading">
                  <span className="form-label">Summary</span>
                  <Sparkles size={13} />
                </div>
                <p>
                  {memory.summary ||
                    "No summary yet. Create one locally from the strongest sentences in this memory."}
                </p>
                <button
                  type="button"
                  disabled={summarizing}
                  onClick={async () => {
                    setSummarizing(true);
                    try {
                      await onSummarize(memory);
                    } finally {
                      setSummarizing(false);
                    }
                  }}
                >
                  <Sparkles size={13} />
                  {summarizing ? "Reading..." : "Summarize locally"}
                </button>
              </section>

              <section className="memory-detail__section">
                <span className="form-label">Context</span>
                <div className="detail-tags">
                  {memory.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
                {memory.sourcePath && (
                  <div className="detail-source">
                    <FileText size={14} />
                    <div>
                      <span>Source</span>
                      <strong>{memory.sourcePath}</strong>
                    </div>
                  </div>
                )}
              </section>

              {relatedMemories.length > 0 && (
                <section className="memory-detail__section">
                  <span className="form-label">Linked by context</span>
                  <div className="related-memories">
                    {relatedMemories.slice(0, 3).map((related) => (
                      <button
                        type="button"
                        key={related.id}
                        onClick={() => onOpenRelated(related.id)}
                      >
                        <Link2 size={13} />
                        <span>
                          <strong>{related.title}</strong>
                          <small>
                            {related.tags
                              .filter((tag) => memory.tags.includes(tag))
                              .map((tag) => `#${tag}`)
                              .join(" ")}
                          </small>
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <footer className="memory-detail__footer">
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(memory.content);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1600);
                }}
              >
                {copied ? <Check size={14} /> : <Clipboard size={14} />}
                {copied ? "Copied" : "Copy text"}
              </button>
              <button
                type="button"
                className={confirmDelete ? "is-danger" : ""}
                onClick={async () => {
                  if (!confirmDelete) {
                    setConfirmDelete(true);
                    return;
                  }
                  await onDelete(memory.id);
                  onClose();
                }}
              >
                <Trash2 size={14} />
                {confirmDelete ? "Delete permanently" : "Delete"}
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}


import { motion } from "framer-motion";
import { ArrowUpRight, AudioLines, Clock3 } from "lucide-react";
import { parseMetadata, type Memory } from "../../lib/memory/types";
import { MemoryTypeBadge } from "./MemoryTypeBadge";

type MemoryCardProps = {
  memory: Memory;
  selected?: boolean;
  index?: number;
  onOpen: (memory: Memory) => void;
};

export function MemoryCard({
  memory,
  selected = false,
  index = 0,
  onOpen,
}: MemoryCardProps) {
  const metadata = parseMetadata(memory);
  const imageDataUrl = metadata.imageDataUrl;
  const duration = metadata.durationSeconds;

  return (
    <motion.article
      className={`timeline-card is-${memory.memoryType}${
        selected ? " is-selected" : ""
      }`}
      data-memory-id={memory.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.045, 0.28), duration: 0.35 }}
      onClick={() => onOpen(memory)}
    >
      {memory.memoryType === "image" && imageDataUrl && (
        <div
          className="timeline-card__image"
          style={{ backgroundImage: `url("${imageDataUrl}")` }}
          role="img"
          aria-label={memory.title}
        />
      )}

      <div className="timeline-card__topline">
        <MemoryTypeBadge type={memory.memoryType} />
        <time>
          {new Date(memory.capturedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>

      <div className="timeline-card__content">
        <h3>{memory.title}</h3>
        {memory.memoryType === "code" ? (
          <pre>
            <code>{memory.content.slice(0, 260)}</code>
          </pre>
        ) : (
          <p>{memory.summary || memory.content}</p>
        )}
      </div>

      {memory.memoryType === "voice" && (
        <div className="mini-waveform" aria-label="Voice note preview">
          <AudioLines size={14} />
          <span />
          <span />
          <span />
          <span />
          <span />
          <small>{duration ? `${duration}s` : "voice"}</small>
        </div>
      )}

      <footer className="timeline-card__footer">
        <div className="timeline-card__tags">
          {memory.tags.slice(0, 3).map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
        <button type="button" aria-label={`Open ${memory.title}`}>
          <ArrowUpRight size={15} />
        </button>
      </footer>

      <span className="timeline-card__stamp" aria-hidden="true">
        <Clock3 size={10} />
        {new Date(memory.capturedAt).getFullYear()}
      </span>
    </motion.article>
  );
}


import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Command,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { MemoryTypeBadge } from "../../components/memory/MemoryTypeBadge";
import type { Memory, MemoryType } from "../../lib/memory/types";

type SearchViewProps = {
  memories: Memory[];
  onOpen: (id: string) => void;
};

function searchable(memory: Memory) {
  return [
    memory.title,
    memory.content,
    memory.summary,
    memory.sourcePath ?? "",
    memory.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return text;
  const normalized = query.trim().toLowerCase();
  const index = text.toLowerCase().indexOf(normalized);
  if (index < 0) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + normalized.length)}</mark>
      {text.slice(index + normalized.length)}
    </>
  );
}

export function SearchView({ memories, onOpen }: SearchViewProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | MemoryType>("all");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return memories.filter(
      (memory) =>
        (type === "all" || memory.memoryType === type) &&
        (!normalized || searchable(memory).includes(normalized))
    );
  }, [memories, query, type]);

  const types = [...new Set(memories.map((memory) => memory.memoryType))];

  return (
    <div className="search-view">
      <header className="search-view__header">
        <span className="section-kicker">Ask the archive</span>
        <h1>Find the thought<br />behind the words.</h1>
        <p>
          Search notes, transcripts, filenames, extracted documents, summaries,
          and tags without sending anything away.
        </p>
      </header>

      <div className="archive-search">
        <Search size={21} />
        <input
          ref={inputRef}
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try “timeline”, “search”, or a project name..."
          aria-label="Search memories"
        />
        <kbd>
          <Command size={11} /> K
        </kbd>
      </div>

      <div className="search-filters">
        <SlidersHorizontal size={13} />
        <button
          type="button"
          className={type === "all" ? "is-active" : ""}
          onClick={() => setType("all")}
        >
          Everything
        </button>
        {types.map((memoryType) => (
          <button
            type="button"
            key={memoryType}
            className={type === memoryType ? "is-active" : ""}
            onClick={() => setType(memoryType)}
          >
            {memoryType}
          </button>
        ))}
      </div>

      <section className="search-results" aria-live="polite">
        <div className="search-results__heading">
          <span>
            {query
              ? `${results.length} ${results.length === 1 ? "match" : "matches"}`
              : `${results.length} memories ready to search`}
          </span>
          {query && (
            <small>
              <Sparkles size={11} /> local keyword search
            </small>
          )}
        </div>
        <div className="search-result-list">
          {results.map((memory, index) => (
            <motion.button
              type="button"
              className="search-result"
              key={memory.id}
              onClick={() => onOpen(memory.id)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.035, 0.2) }}
            >
              <MemoryTypeBadge type={memory.memoryType} compact />
              <div>
                <span>
                  {new Date(memory.capturedAt).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <h2>
                  <Highlight text={memory.title} query={query} />
                </h2>
                <p>
                  <Highlight
                    text={(memory.summary || memory.content).slice(0, 210)}
                    query={query}
                  />
                </p>
                <div>
                  {memory.tags.map((tag) => (
                    <small key={tag}>#{tag}</small>
                  ))}
                </div>
              </div>
              <ArrowUpRight size={16} />
            </motion.button>
          ))}
        </div>

        {!results.length && (
          <div className="search-empty">
            <Search size={26} />
            <h2>No memory uses those words.</h2>
            <p>Try a shorter phrase, a tag, or a different memory type.</p>
            <button type="button" onClick={() => inputRef.current?.focus()}>
              Refine search
            </button>
          </div>
        )}
      </section>
    </div>
  );
}


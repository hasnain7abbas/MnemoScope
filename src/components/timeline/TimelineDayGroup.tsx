import type { Memory } from "../../lib/memory/types";
import { MemoryCard } from "../memory/MemoryCard";

type TimelineDayGroupProps = {
  date: Date;
  memories: Memory[];
  startIndex: number;
  selectedMemoryId: string | null;
  onOpen: (memory: Memory) => void;
};

function isToday(date: Date) {
  return date.toDateString() === new Date().toDateString();
}

export function TimelineDayGroup({
  date,
  memories,
  startIndex,
  selectedMemoryId,
  onOpen,
}: TimelineDayGroupProps) {
  const today = isToday(date);
  return (
    <section
      className="timeline-day"
      data-today={today ? "true" : undefined}
      aria-labelledby={`day-${date.toISOString().slice(0, 10)}`}
    >
      <header className="timeline-day__date">
        <span>{today ? "Today" : date.toLocaleDateString([], { weekday: "long" })}</span>
        <strong>{date.getDate()}</strong>
        <small>
          {date.toLocaleDateString([], { month: "short" })} {date.getFullYear()}
        </small>
        <i />
        <em>{memories.length} moments</em>
      </header>
      <div className="timeline-day__cards">
        {memories.map((memory, index) => (
          <MemoryCard
            key={memory.id}
            memory={memory}
            index={startIndex + index}
            selected={selectedMemoryId === memory.id}
            onOpen={onOpen}
          />
        ))}
      </div>
    </section>
  );
}


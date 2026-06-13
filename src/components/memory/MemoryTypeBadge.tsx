import {
  AudioLines,
  Braces,
  File,
  FileText,
  Image,
  Link,
  PenLine,
} from "lucide-react";
import type { MemoryType } from "../../lib/memory/types";

const icons = {
  note: PenLine,
  voice: AudioLines,
  image: Image,
  pdf: FileText,
  code: Braces,
  link: Link,
  file: File,
} satisfies Record<MemoryType, typeof PenLine>;

type MemoryTypeBadgeProps = {
  type: MemoryType;
  compact?: boolean;
};

export function MemoryTypeBadge({
  type,
  compact = false,
}: MemoryTypeBadgeProps) {
  const Icon = icons[type];
  return (
    <span className={`memory-type-badge is-${type}${compact ? " is-compact" : ""}`}>
      <Icon size={compact ? 12 : 13} />
      {!compact && type}
    </span>
  );
}


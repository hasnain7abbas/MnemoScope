export type MemoryType =
  | "note"
  | "voice"
  | "image"
  | "pdf"
  | "code"
  | "link"
  | "file";

export type MemoryMetadata = {
  durationSeconds?: number;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  imageDataUrl?: string;
  originalType?: string;
  transcriptSupported?: boolean;
};

export type Memory = {
  id: string;
  title: string;
  memoryType: MemoryType;
  content: string;
  summary: string;
  sourcePath: string | null;
  thumbnailPath: string | null;
  createdAt: string;
  updatedAt: string;
  capturedAt: string;
  metadataJson: string;
  tags: string[];
};

export type NewMemory = Omit<Memory, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export function parseMetadata(memory: Memory): MemoryMetadata {
  try {
    return JSON.parse(memory.metadataJson) as MemoryMetadata;
  } catch {
    return {};
  }
}


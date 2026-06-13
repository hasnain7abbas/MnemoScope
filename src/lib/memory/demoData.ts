import type { Memory } from "./types";

export const demoMemories: Memory[] = [
  {
    id: "demo-note",
    title: "The archive should feel alive",
    memoryType: "note",
    content:
      "A timeline is more honest than a folder. It preserves the path, not just the conclusion. The interface should leave enough quiet around each thought that the user can hear it again.",
    summary:
      "A product principle for treating memory as a living sequence rather than static storage.",
    sourcePath: null,
    thumbnailPath: null,
    createdAt: "2026-06-13T09:42:00+05:00",
    updatedAt: "2026-06-13T09:42:00+05:00",
    capturedAt: "2026-06-13T09:42:00+05:00",
    metadataJson: "{}",
    tags: ["product", "principles"],
  },
  {
    id: "demo-image",
    title: "Desk light study",
    memoryType: "image",
    content:
      "Warm pools of light against a quiet, near-black room. Saved as a visual reference for the memory observatory.",
    summary:
      "A visual reference built around warm focus and a dark, calm environment.",
    sourcePath: null,
    thumbnailPath: null,
    createdAt: "2026-06-13T11:18:00+05:00",
    updatedAt: "2026-06-13T11:18:00+05:00",
    capturedAt: "2026-06-13T11:18:00+05:00",
    metadataJson: "{}",
    tags: ["visual", "reference"],
  },
  {
    id: "demo-code",
    title: "Search ranking sketch",
    memoryType: "code",
    content:
      "const score = exactMatch * 4 + phraseMatch * 2 + recencyBoost;\n\n// Older memories should remain discoverable when their language is precise.",
    summary:
      "A ranking idea that balances exact language, phrase relevance, and recency.",
    sourcePath: null,
    thumbnailPath: null,
    createdAt: "2026-06-13T14:07:00+05:00",
    updatedAt: "2026-06-13T14:07:00+05:00",
    capturedAt: "2026-06-13T14:07:00+05:00",
    metadataJson: "{}",
    tags: ["search", "prototype"],
  },
  {
    id: "demo-voice",
    title: "Walk home: project direction",
    memoryType: "voice",
    content:
      "The useful part is not collecting more. It is finding the shape that was already there. Make the daily replay feel like reviewing rushes from a film.",
    summary:
      "A voice thought connecting daily replay with reviewing film rushes.",
    sourcePath: null,
    thumbnailPath: null,
    createdAt: "2026-06-12T20:36:00+05:00",
    updatedAt: "2026-06-12T20:36:00+05:00",
    capturedAt: "2026-06-12T20:36:00+05:00",
    metadataJson: JSON.stringify({ durationSeconds: 38 }),
    tags: ["voice", "direction"],
  },
  {
    id: "demo-pdf",
    title: "Ambient interfaces notes",
    memoryType: "pdf",
    content:
      "Notes on calm technology, peripheral awareness, and interfaces that communicate without continuously demanding attention.",
    summary: "Research notes about calm, ambient interfaces.",
    sourcePath: null,
    thumbnailPath: null,
    createdAt: "2026-06-12T15:22:00+05:00",
    updatedAt: "2026-06-12T15:22:00+05:00",
    capturedAt: "2026-06-12T15:22:00+05:00",
    metadataJson: "{}",
    tags: ["research", "reading"],
  },
  {
    id: "demo-project",
    title: "Weekend prototype plan",
    memoryType: "note",
    content:
      "Saturday: persistence and capture. Sunday: timeline, search, and export. Protect the feel of the product before expanding the feature list.",
    summary:
      "A focused two-day plan for the first coherent MnemoScope prototype.",
    sourcePath: null,
    thumbnailPath: null,
    createdAt: "2026-06-11T18:04:00+05:00",
    updatedAt: "2026-06-11T18:04:00+05:00",
    capturedAt: "2026-06-11T18:04:00+05:00",
    metadataJson: "{}",
    tags: ["planning", "mnemoscope"],
  },
];


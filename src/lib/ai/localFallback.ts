import type { ProjectBriefInput, SummaryProvider } from "./provider";

const stopWords = new Set([
  "about",
  "after",
  "again",
  "also",
  "been",
  "from",
  "have",
  "into",
  "more",
  "should",
  "that",
  "their",
  "there",
  "these",
  "this",
  "through",
  "with",
  "would",
]);

function sentences(text: string) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function extractiveSummary(text: string, limit = 2) {
  const parts = sentences(text);
  if (parts.length <= limit) return parts.join(" ");

  const frequencies = new Map<string, number>();
  for (const word of text.toLowerCase().match(/[a-z][a-z'-]{3,}/g) ?? []) {
    if (!stopWords.has(word)) {
      frequencies.set(word, (frequencies.get(word) ?? 0) + 1);
    }
  }

  return parts
    .map((sentence, index) => ({
      sentence,
      index,
      score: (sentence.toLowerCase().match(/[a-z][a-z'-]{3,}/g) ?? []).reduce(
        (total, word) => total + (frequencies.get(word) ?? 0),
        0
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .sort((a, b) => a.index - b.index)
    .map(({ sentence }) => sentence)
    .join(" ");
}

export const localSummaryProvider: SummaryProvider = {
  id: "local",
  name: "Local extractive summaries",

  async summarizeMemory(memory) {
    return extractiveSummary(memory.content, 2);
  },

  async summarizeDay(memories) {
    if (!memories.length) return "No memories were captured on this day.";
    const joined = memories
      .map((memory) => `${memory.title}. ${memory.summary || memory.content}`)
      .join(" ");
    return extractiveSummary(joined, 3);
  },

  async suggestTags(memory) {
    const counts = new Map<string, number>();
    for (const word of `${memory.title} ${memory.content}`
      .toLowerCase()
      .match(/[a-z][a-z'-]{4,}/g) ?? []) {
      if (!stopWords.has(word)) counts.set(word, (counts.get(word) ?? 0) + 1);
    }
    return [...counts]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([word]) => word);
  },

  async generateProjectBrief({ title, memories }: ProjectBriefInput) {
    const timeline = memories
      .map(
        (memory) =>
          `- ${new Date(memory.capturedAt).toLocaleString()} — ${memory.title}`
      )
      .join("\n");
    const ideas = memories
      .map((memory) => `- ${memory.summary || extractiveSummary(memory.content, 1)}`)
      .join("\n");

    return `# Project Brief: ${title}

## Why this matters

${await this.summarizeDay(memories)}

## Timeline

${timeline}

## Key Ideas

${ideas}

## Useful References

${memories
  .filter((memory) => memory.sourcePath)
  .map((memory) => `- ${memory.title}: \`${memory.sourcePath}\``)
  .join("\n") || "- No external files selected."}

## Decisions

- Preserve the original context of each selected memory.
- Keep the work local unless the user explicitly exports it.

## Next Steps

- [ ] Review the selected memories.
- [ ] Confirm the strongest direction.
- [ ] Turn the direction into a focused first milestone.
`;
  },
};

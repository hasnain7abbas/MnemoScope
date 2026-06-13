import type { Memory } from "../memory/types";

export type ProjectBriefInput = {
  title: string;
  memories: Memory[];
};

export interface SummaryProvider {
  id: string;
  name: string;
  summarizeMemory(memory: Memory): Promise<string>;
  summarizeDay(memories: Memory[]): Promise<string>;
  suggestTags(memory: Memory): Promise<string[]>;
  generateProjectBrief(input: ProjectBriefInput): Promise<string>;
}


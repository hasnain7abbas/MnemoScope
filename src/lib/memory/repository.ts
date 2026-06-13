import { invoke } from "@tauri-apps/api/core";
import { demoMemories } from "./demoData";
import type { Memory, NewMemory } from "./types";

const STORAGE_KEY = "mnemoscope.memories.v2";

function newestFirst(a: Memory, b: Memory) {
  return new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime();
}

function isTauriRuntime() {
  return "__TAURI_INTERNALS__" in window;
}

function readBrowserMemories(): Memory[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoMemories));
    return demoMemories;
  }

  try {
    return JSON.parse(stored) as Memory[];
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoMemories));
    return demoMemories;
  }
}

function writeBrowserMemories(memories: Memory[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
}

export const memoryRepository = {
  async list(): Promise<Memory[]> {
    if (isTauriRuntime()) {
      return invoke<Memory[]>("list_memories");
    }
    return readBrowserMemories().sort(newestFirst);
  },

  async save(input: NewMemory): Promise<Memory> {
    const now = new Date().toISOString();
    const memory: Memory = {
      ...input,
      id: input.id ?? crypto.randomUUID(),
      createdAt: input.createdAt ?? now,
      updatedAt: now,
    };

    if (isTauriRuntime()) {
      return invoke<Memory>("upsert_memory", { memory });
    }

    const memories = readBrowserMemories();
    const next = [memory, ...memories.filter((item) => item.id !== memory.id)];
    writeBrowserMemories(next);
    return memory;
  },

  async delete(id: string): Promise<void> {
    if (isTauriRuntime()) {
      await invoke("delete_memory", { id });
      return;
    }
    writeBrowserMemories(readBrowserMemories().filter((memory) => memory.id !== id));
  },

  async resetDemoData(): Promise<Memory[]> {
    if (isTauriRuntime()) {
      return invoke<Memory[]>("reset_demo_data");
    }
    writeBrowserMemories(demoMemories);
    return demoMemories;
  },

  async dataLocation(): Promise<string> {
    if (isTauriRuntime()) {
      return invoke<string>("data_location");
    }
    return "Browser local storage";
  },
};

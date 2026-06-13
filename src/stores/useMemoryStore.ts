import { create } from "zustand";
import { memoryRepository } from "../lib/memory/repository";
import type { Memory, NewMemory } from "../lib/memory/types";

type MemoryStore = {
  memories: Memory[];
  selectedMemoryId: string | null;
  loading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  saveMemory: (memory: NewMemory) => Promise<Memory>;
  deleteMemory: (id: string) => Promise<void>;
  resetDemoData: () => Promise<void>;
  selectMemory: (id: string | null) => void;
};

export const useMemoryStore = create<MemoryStore>((set) => ({
  memories: [],
  selectedMemoryId: null,
  loading: true,
  error: null,

  initialize: async () => {
    set({ loading: true, error: null });
    try {
      const memories = await memoryRepository.list();
      set({ memories, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  saveMemory: async (input) => {
    const saved = await memoryRepository.save(input);
    set((state) => ({
      memories: [
        saved,
        ...state.memories.filter((item) => item.id !== saved.id),
      ].sort(
        (a, b) =>
          new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime()
      ),
      selectedMemoryId: saved.id,
    }));
    return saved;
  },

  deleteMemory: async (id) => {
    await memoryRepository.delete(id);
    set((state) => ({
      memories: state.memories.filter((memory) => memory.id !== id),
      selectedMemoryId:
        state.selectedMemoryId === id ? null : state.selectedMemoryId,
    }));
  },

  resetDemoData: async () => {
    const memories = await memoryRepository.resetDemoData();
    set({ memories, selectedMemoryId: null });
  },

  selectMemory: (id) => set({ selectedMemoryId: id }),
}));

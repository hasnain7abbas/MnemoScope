import { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import type { AppView } from "../components/layout/Sidebar";
import { HomeView } from "../features/home/HomeView";
import { CaptureView } from "../features/capture/CaptureView";
import { TimelineView } from "../features/timeline/TimelineView";
import { SearchView } from "../features/search/SearchView";
import { useMemoryStore } from "../stores/useMemoryStore";
import { MemoryDetailDrawer } from "../components/memory/MemoryDetailDrawer";
import { localSummaryProvider } from "../lib/ai/localFallback";

export function App() {
  const [activeView, setActiveView] = useState<AppView>("today");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const memories = useMemoryStore((state) => state.memories);
  const initialize = useMemoryStore((state) => state.initialize);
  const saveMemory = useMemoryStore((state) => state.saveMemory);
  const selectedMemoryId = useMemoryStore((state) => state.selectedMemoryId);
  const selectMemory = useMemoryStore((state) => state.selectMemory);
  const deleteMemory = useMemoryStore((state) => state.deleteMemory);
  const selectedMemory =
    memories.find((memory) => memory.id === selectedMemoryId) ?? null;
  const relatedMemories = selectedMemory
    ? memories.filter(
        (memory) =>
          memory.id !== selectedMemory.id &&
          memory.tags.some((tag) => selectedMemory.tags.includes(tag))
      )
    : [];

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setActiveView("search");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  let content;
  if (activeView === "today") {
    content = (
      <HomeView onNavigate={setActiveView} memories={memories} />
    );
  } else if (activeView === "capture") {
    content = (
      <CaptureView
        onSave={async (memory) => {
          await saveMemory(memory);
          setActiveView("timeline");
        }}
      />
    );
  } else if (activeView === "timeline") {
    content = (
      <TimelineView
        memories={memories}
        selectedMemoryId={selectedMemoryId}
        onSelectMemory={selectMemory}
      />
    );
  } else if (activeView === "search") {
    content = <SearchView memories={memories} onOpen={selectMemory} />;
  } else {
    content = (
      <div className="view-placeholder">
        <span>Memory field / {activeView}</span>
        <h1>{activeView}</h1>
        <p>This observatory is being calibrated.</p>
      </div>
    );
  }

  return (
    <>
      <AppShell
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          if (view !== "timeline" && view !== "search") selectMemory(null);
        }}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen((open) => !open)}
      >
        {content}
      </AppShell>
      <MemoryDetailDrawer
        memory={selectedMemory}
        relatedMemories={relatedMemories}
        onClose={() => selectMemory(null)}
        onOpenRelated={selectMemory}
        onSummarize={async (memory) => {
          const summary = await localSummaryProvider.summarizeMemory(memory);
          await saveMemory({ ...memory, summary });
        }}
        onDelete={deleteMemory}
      />
    </>
  );
}

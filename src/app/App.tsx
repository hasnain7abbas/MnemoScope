import { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import type { AppView } from "../components/layout/Sidebar";
import { HomeView } from "../features/home/HomeView";
import { useMemoryStore } from "../stores/useMemoryStore";

export function App() {
  const [activeView, setActiveView] = useState<AppView>("today");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const memories = useMemoryStore((state) => state.memories);
  const initialize = useMemoryStore((state) => state.initialize);

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

  const content =
    activeView === "today" ? (
      <HomeView onNavigate={setActiveView} memories={memories} />
    ) : (
      <div className="view-placeholder">
        <span>Memory field / {activeView}</span>
        <h1>{activeView}</h1>
        <p>This observatory is being calibrated.</p>
      </div>
    );

  return (
    <AppShell
      activeView={activeView}
      onNavigate={setActiveView}
      sidebarOpen={sidebarOpen}
      onSidebarToggle={() => setSidebarOpen((open) => !open)}
    >
      {content}
    </AppShell>
  );
}

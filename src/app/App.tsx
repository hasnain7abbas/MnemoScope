import { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import type { AppView } from "../components/layout/Sidebar";
import { HomeView } from "../features/home/HomeView";

export function App() {
  const [activeView, setActiveView] = useState<AppView>("today");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <HomeView onNavigate={setActiveView} />
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

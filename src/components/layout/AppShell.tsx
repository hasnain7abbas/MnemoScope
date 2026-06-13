import type { ReactNode } from "react";
import { Sidebar, type AppView } from "./Sidebar";
import { TopCommandBar } from "./TopCommandBar";

type AppShellProps = {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  children: ReactNode;
};

const viewTitles: Record<AppView, string> = {
  today: "Today",
  timeline: "Timeline",
  capture: "Capture",
  search: "Search",
  projects: "Projects",
  settings: "Settings",
};

export function AppShell({
  activeView,
  onNavigate,
  sidebarOpen,
  onSidebarToggle,
  children,
}: AppShellProps) {
  const navigate = (view: AppView) => {
    onNavigate(view);
    if (sidebarOpen) onSidebarToggle();
  };

  return (
    <div className={`app-shell${sidebarOpen ? " has-open-sidebar" : ""}`}>
      <div className="app-shell__sidebar">
        <Sidebar activeView={activeView} onNavigate={navigate} />
      </div>
      <button
        type="button"
        aria-label="Close navigation"
        className="sidebar-scrim"
        onClick={onSidebarToggle}
      />
      <section className="app-shell__main">
        <TopCommandBar
          title={viewTitles[activeView]}
          onCapture={() => onNavigate("capture")}
          onSearch={() => onNavigate("search")}
          onMenu={onSidebarToggle}
        />
        <div className="app-content">{children}</div>
      </section>
    </div>
  );
}


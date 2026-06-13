import {
  Aperture,
  CalendarDays,
  FolderKanban,
  Plus,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { Logo } from "../brand/Logo";

export type AppView =
  | "today"
  | "timeline"
  | "capture"
  | "search"
  | "projects"
  | "settings";

type SidebarProps = {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  memoryCount: number;
};

const navigation = [
  { id: "today", label: "Today", icon: Sparkles },
  { id: "timeline", label: "Timeline", icon: CalendarDays },
  { id: "capture", label: "Capture", icon: Plus },
  { id: "search", label: "Search", icon: Search },
  { id: "projects", label: "Projects", icon: FolderKanban },
] satisfies Array<{ id: AppView; label: string; icon: typeof Aperture }>;

export function Sidebar({
  activeView,
  onNavigate,
  memoryCount,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <Logo />
      </div>

      <nav className="sidebar__nav" aria-label="Primary navigation">
        <span className="sidebar__eyebrow">Observatory</span>
        {navigation.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`nav-item${activeView === id ? " is-active" : ""}`}
            onClick={() => onNavigate(id)}
          >
            <Icon size={17} strokeWidth={1.7} />
            <span>{label}</span>
            {id === "today" && <small>{memoryCount}</small>}
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button
          type="button"
          className={`nav-item${activeView === "settings" ? " is-active" : ""}`}
          onClick={() => onNavigate("settings")}
        >
          <Settings size={17} strokeWidth={1.7} />
          <span>Settings</span>
        </button>
        <div className="vault-status">
          <span className="vault-status__orb">
            <Aperture size={13} />
          </span>
          <div>
            <strong>Local vault</strong>
            <span>Stays on this device</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

import { Command, Menu, Plus, Search } from "lucide-react";

type TopCommandBarProps = {
  title: string;
  onCapture: () => void;
  onSearch: () => void;
  onMenu: () => void;
};

export function TopCommandBar({
  title,
  onCapture,
  onSearch,
  onMenu,
}: TopCommandBarProps) {
  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-button topbar__menu"
        aria-label="Open navigation"
        onClick={onMenu}
      >
        <Menu size={19} />
      </button>
      <div className="topbar__title">
        <span>Memory field</span>
        <strong>{title}</strong>
      </div>
      <button type="button" className="command-trigger" onClick={onSearch}>
        <Search size={16} />
        <span>Search your archive...</span>
        <kbd>
          <Command size={11} /> K
        </kbd>
      </button>
      <button type="button" className="capture-button" onClick={onCapture}>
        <Plus size={17} />
        <span>Capture</span>
      </button>
    </header>
  );
}


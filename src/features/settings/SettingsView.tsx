import {
  ArchiveRestore,
  Check,
  Database,
  Download,
  HardDrive,
  MoonStar,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { memoryRepository } from "../../lib/memory/repository";
import type { Memory } from "../../lib/memory/types";
import {
  usePreferencesStore,
  type ThemePreference,
} from "../../stores/usePreferencesStore";

type SettingsViewProps = {
  memories: Memory[];
  onResetDemoData: () => Promise<void>;
};

const themes: Array<{
  id: ThemePreference;
  label: string;
  description: string;
}> = [
  {
    id: "cinema",
    label: "Cinema",
    description: "Deep charcoal with cyan focus and amber time markers.",
  },
  {
    id: "obsidian",
    label: "Obsidian",
    description: "Near-black surfaces with sharper contrast and less glow.",
  },
];

export function SettingsView({
  memories,
  onResetDemoData,
}: SettingsViewProps) {
  const theme = usePreferencesStore((state) => state.theme);
  const setTheme = usePreferencesStore((state) => state.setTheme);
  const [dataLocation, setDataLocation] = useState("Resolving local vault...");
  const [resetArmed, setResetArmed] = useState(false);

  useEffect(() => {
    void memoryRepository.dataLocation().then(setDataLocation);
  }, []);

  const exportBackup = () => {
    const payload = JSON.stringify(
      {
        format: "mnemoscope-v1",
        exportedAt: new Date().toISOString(),
        memories,
      },
      null,
      2
    );
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `mnemoscope-vault-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="settings-view">
      <header className="settings-view__header">
        <span className="section-kicker">Local controls</span>
        <h1>Keep the archive<br />entirely yours.</h1>
        <p>
          Appearance, storage, and fallback intelligence stay under your
          control.
        </p>
      </header>

      <div className="settings-layout">
        <section className="settings-section">
          <div className="settings-section__heading">
            <span>
              <MoonStar size={17} />
            </span>
            <div>
              <h2>Appearance</h2>
              <p>Choose how the observatory handles darkness and contrast.</p>
            </div>
          </div>
          <div className="theme-options">
            {themes.map((option) => (
              <button
                type="button"
                key={option.id}
                className={theme === option.id ? "is-active" : ""}
                onClick={() => setTheme(option.id)}
              >
                <span className={`theme-swatch is-${option.id}`}>
                  <i />
                  <i />
                  <i />
                </span>
                <div>
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </div>
                <span className="theme-check">
                  {theme === option.id && <Check size={12} />}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section__heading">
            <span>
              <Database size={17} />
            </span>
            <div>
              <h2>Local vault</h2>
              <p>Your memory database and portable backup controls.</p>
            </div>
          </div>
          <div className="settings-row">
            <HardDrive size={15} />
            <div>
              <span>Data location</span>
              <strong>{dataLocation}</strong>
            </div>
          </div>
          <div className="settings-row">
            <ArchiveRestore size={15} />
            <div>
              <span>Archive size</span>
              <strong>{memories.length} memories indexed locally</strong>
            </div>
            <button type="button" onClick={exportBackup}>
              <Download size={13} />
              Export JSON
            </button>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section__heading">
            <span>
              <Sparkles size={17} />
            </span>
            <div>
              <h2>Intelligence</h2>
              <p>Summary and brief generation behavior.</p>
            </div>
          </div>
          <div className="provider-card">
            <span>
              <ShieldCheck size={17} />
            </span>
            <div>
              <strong>Local extractive provider</strong>
              <small>
                Active. Summaries and briefs are generated from your text without
                a network request.
              </small>
            </div>
            <i>Configured</i>
          </div>
          <p className="settings-note">
            External semantic providers are intentionally left behind the
            provider interface for a future opt-in release.
          </p>
        </section>

        <section className="settings-section settings-section--danger">
          <div className="settings-section__heading">
            <span>
              <RotateCcw size={17} />
            </span>
            <div>
              <h2>Demo archive</h2>
              <p>Restore the original six memories and remove local additions.</p>
            </div>
          </div>
          <button
            type="button"
            className={resetArmed ? "is-armed" : ""}
            onClick={async () => {
              if (!resetArmed) {
                setResetArmed(true);
                return;
              }
              await onResetDemoData();
              setResetArmed(false);
            }}
          >
            <RotateCcw size={14} />
            {resetArmed ? "Confirm reset" : "Reset demo data"}
          </button>
        </section>
      </div>

      <footer className="settings-version">
        <span>MnemoScope 0.1.0</span>
        <span>Local-first preview</span>
      </footer>
    </div>
  );
}


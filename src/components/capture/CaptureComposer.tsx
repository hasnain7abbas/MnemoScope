import { useMemo, useState } from "react";
import {
  AudioLines,
  Check,
  FileUp,
  Hash,
  PenLine,
  Save,
  X,
} from "lucide-react";
import type { MemoryType, NewMemory } from "../../lib/memory/types";
import { FileDropZone } from "./FileDropZone";
import { VoiceCapture } from "./VoiceCapture";

type CaptureMode = "note" | "voice" | "import";

type CaptureComposerProps = {
  onSave: (memory: NewMemory) => Promise<void>;
};

export function CaptureComposer({ onSave }: CaptureComposerProps) {
  const [mode, setMode] = useState<CaptureMode>("note");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [audioDataUrl, setAudioDataUrl] = useState<string | null>(null);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [imported, setImported] = useState<NewMemory[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSave = useMemo(() => {
    if (mode === "import") return imported.length > 0;
    return Boolean(title.trim() && content.trim());
  }, [content, imported.length, mode, title]);

  const addTag = () => {
    const tag = tagInput.trim().replace(/^#/, "").toLowerCase();
    if (tag && !tags.includes(tag)) setTags((current) => [...current, tag]);
    setTagInput("");
  };

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      if (mode === "import") {
        for (const memory of imported) await onSave(memory);
      } else {
        const now = new Date().toISOString();
        await onSave({
          title: title.trim(),
          memoryType: mode as MemoryType,
          content: content.trim(),
          summary: "",
          sourcePath: null,
          thumbnailPath: null,
          capturedAt: now,
          metadataJson: JSON.stringify({
            audioDataUrl,
            durationSeconds,
            transcriptSupported: Boolean(content.trim()),
          }),
          tags,
        });
      }
      setTitle("");
      setContent("");
      setTags([]);
      setImported([]);
      setAudioDataUrl(null);
      setDurationSeconds(0);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="capture-composer">
      <div className="capture-tabs" role="tablist" aria-label="Capture type">
        {(
          [
            ["note", "Write", PenLine],
            ["voice", "Voice", AudioLines],
            ["import", "Import", FileUp],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            className={mode === id ? "is-active" : ""}
            onClick={() => setMode(id)}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <div className="capture-composer__canvas">
        {mode === "import" ? (
          <>
            <FileDropZone
              onExtracted={(memories) =>
                setImported((current) => [...current, ...memories])
              }
            />
            {imported.length > 0 && (
              <div className="import-queue">
                <span className="form-label">Ready to archive</span>
                {imported.map((memory, index) => (
                  <article key={`${memory.title}-${index}`}>
                    <span className={`import-type is-${memory.memoryType}`}>
                      {memory.memoryType}
                    </span>
                    <div>
                      <strong>{memory.title}</strong>
                      <small>
                        {memory.content.slice(0, 92)}
                        {memory.content.length > 92 ? "..." : ""}
                      </small>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${memory.title}`}
                      onClick={() =>
                        setImported((current) =>
                          current.filter((_, itemIndex) => itemIndex !== index)
                        )
                      }
                    >
                      <X size={14} />
                    </button>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {mode === "voice" && (
              <VoiceCapture
                onTranscriptChange={setContent}
                onRecordingReady={(dataUrl, seconds) => {
                  setAudioDataUrl(dataUrl);
                  setDurationSeconds(seconds);
                }}
              />
            )}
            <label className="field-group">
              <span className="form-label">Memory title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={
                  mode === "voice"
                    ? "A name for this voice thought"
                    : "What is this thought about?"
                }
              />
            </label>
            <label className="field-group field-group--editor">
              <span className="form-label">
                {mode === "voice" ? "Transcript" : "Your thought"}
              </span>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder={
                  mode === "voice"
                    ? "Your transcript will appear here. Type manually when speech recognition is unavailable."
                    : "Begin anywhere. MnemoScope will preserve the moment around it..."
                }
              />
              <small>{content.length} characters</small>
            </label>
            <div className="tag-editor">
              <span className="form-label">Tags</span>
              <div className="tag-editor__input">
                <Hash size={14} />
                <input
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === ",") {
                      event.preventDefault();
                      addTag();
                    }
                  }}
                  onBlur={addTag}
                  placeholder="Add context, then press Enter"
                />
              </div>
              <div className="tag-editor__tags">
                {tags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() =>
                      setTags((current) => current.filter((item) => item !== tag))
                    }
                  >
                    #{tag} <X size={10} />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="capture-composer__footer">
        <span>
          <Check size={13} />
          Stored only on this device
        </span>
        {error && <p className="form-error">{error}</p>}
        <button
          type="button"
          className="primary-action"
          disabled={!canSave || saving}
          onClick={() => void handleSave()}
        >
          <Save size={15} />
          {saving
            ? "Archiving..."
            : mode === "import"
              ? `Archive ${imported.length || ""} ${imported.length === 1 ? "file" : "files"}`
              : "Save memory"}
        </button>
      </footer>
    </div>
  );
}

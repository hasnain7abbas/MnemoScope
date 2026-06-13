import { useRef, useState } from "react";
import { FileText, Image, LoaderCircle, UploadCloud } from "lucide-react";
import { extractFile } from "../../lib/import/extractFile";
import type { NewMemory } from "../../lib/memory/types";

type FileDropZoneProps = {
  onExtracted: (memories: NewMemory[]) => void;
};

export function FileDropZone({ onExtracted }: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | File[]) => {
    if (!files.length) return;
    setBusy(true);
    setError(null);
    try {
      const extracted = await Promise.all([...files].map(extractFile));
      onExtracted(extracted);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "The file could not be read."
      );
    } finally {
      setBusy(false);
      setDragging(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className={`file-dropzone${dragging ? " is-dragging" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          void handleFiles(event.dataTransfer.files);
        }}
      >
        <span className="file-dropzone__icon">
          {busy ? (
            <LoaderCircle className="spin" size={23} />
          ) : (
            <UploadCloud size={23} />
          )}
        </span>
        <strong>{busy ? "Reading the signal..." : "Drop memories here"}</strong>
        <span>or choose files from your device</span>
        <small>
          <FileText size={12} /> Text, Markdown, code, PDF
          <Image size={12} /> PNG, JPG, WebP
        </small>
      </button>
      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        multiple
        accept=".txt,.md,.js,.ts,.tsx,.py,.rs,.cpp,.java,.css,.html,.json,.pdf,.png,.jpg,.jpeg,.webp"
        onChange={(event) => {
          if (event.target.files) void handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}


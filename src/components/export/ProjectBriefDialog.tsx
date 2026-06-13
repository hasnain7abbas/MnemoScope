import { AnimatePresence, motion } from "framer-motion";
import { Check, Clipboard, Download, FileText, X } from "lucide-react";
import { useState } from "react";

type ProjectBriefDialogProps = {
  open: boolean;
  title: string;
  markdown: string;
  onClose: () => void;
};

function safeFileName(title: string) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "mnemoscope-project-brief"
  );
}

export function ProjectBriefDialog({
  open,
  title,
  markdown,
  onClose,
}: ProjectBriefDialogProps) {
  const [copied, setCopied] = useState(false);

  const download = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${safeFileName(title)}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="dialog-scrim"
            aria-label="Close project brief"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.section
            className="brief-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="brief-dialog-title"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: 0.22 }}
          >
            <header>
              <span className="brief-dialog__icon">
                <FileText size={19} />
              </span>
              <div>
                <span>Markdown ready</span>
                <h2 id="brief-dialog-title">{title}</h2>
              </div>
              <button type="button" aria-label="Close dialog" onClick={onClose}>
                <X size={16} />
              </button>
            </header>
            <pre>
              <code>{markdown}</code>
            </pre>
            <footer>
              <span>Portable to GitHub, Obsidian, Notion, or any text editor.</span>
              <div>
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(markdown);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1600);
                  }}
                >
                  {copied ? <Check size={14} /> : <Clipboard size={14} />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button type="button" className="is-primary" onClick={download}>
                  <Download size={14} />
                  Download .md
                </button>
              </div>
            </footer>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}


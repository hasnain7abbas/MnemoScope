import { AnimatePresence, motion } from "framer-motion";
import { CaptureComposer } from "../../components/capture/CaptureComposer";
import type { NewMemory } from "../../lib/memory/types";

type CaptureViewProps = {
  onSave: (memory: NewMemory) => Promise<void>;
};

export function CaptureView({ onSave }: CaptureViewProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="capture-view"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28 }}
      >
        <header className="capture-view__header">
          <span className="section-kicker">Open channel</span>
          <h1>Capture the moment<br />before it changes.</h1>
          <p>
            Notes, recordings, documents, and images all enter the same private
            timeline.
          </p>
        </header>
        <CaptureComposer onSave={onSave} />
      </motion.div>
    </AnimatePresence>
  );
}


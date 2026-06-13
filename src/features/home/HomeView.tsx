import { motion } from "framer-motion";
import {
  ArrowRight,
  AudioLines,
  Braces,
  FileText,
  Image,
  PenLine,
  Play,
  Sparkles,
} from "lucide-react";
import { GlassPanel } from "../../components/ui/GlassPanel";

type HomeViewProps = {
  onNavigate: (view: "capture" | "timeline") => void;
};

const recentMemories = [
  {
    time: "09:42",
    type: "note",
    icon: PenLine,
    title: "The archive should feel alive",
    preview:
      "A timeline is more honest than a folder. It preserves the path, not just the conclusion.",
    tags: ["product", "principles"],
  },
  {
    time: "11:18",
    type: "image",
    icon: Image,
    title: "Desk light study",
    preview: "Warm pools of light against a quiet, near-black room.",
    tags: ["visual", "reference"],
  },
  {
    time: "14:07",
    type: "code",
    icon: Braces,
    title: "Search ranking sketch",
    preview: "Score recency beside exact phrase matches without burying older signals.",
    tags: ["search", "prototype"],
  },
];

export function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <div className="home-view">
      <motion.section
        className="home-hero"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="home-hero__copy">
          <span className="section-kicker">
            <span />
            Saturday, June 13
          </span>
          <h1>
            Your thoughts,
            <br />
            <em>still in motion.</em>
          </h1>
          <p>
            Six moments entered your archive today. Replay the thread or
            capture what is arriving now.
          </p>
          <div className="home-hero__actions">
            <button
              type="button"
              className="primary-action"
              onClick={() => onNavigate("timeline")}
            >
              <Play size={16} fill="currentColor" />
              Replay today
            </button>
            <button
              type="button"
              className="secondary-action"
              onClick={() => onNavigate("capture")}
            >
              <PenLine size={16} />
              Add a thought
            </button>
          </div>
        </div>

        <div className="scope-visual" aria-hidden="true">
          <div className="scope-visual__orbit scope-visual__orbit--outer" />
          <div className="scope-visual__orbit scope-visual__orbit--inner" />
          <div className="scope-visual__crosshair scope-visual__crosshair--x" />
          <div className="scope-visual__crosshair scope-visual__crosshair--y" />
          <div className="scope-visual__pulse" />
          <span className="scope-visual__time">14:07:32</span>
          <span className="scope-visual__label">Live field</span>
        </div>
      </motion.section>

      <section className="quick-capture-grid" aria-label="Quick capture">
        <button type="button" onClick={() => onNavigate("capture")}>
          <PenLine size={18} />
          <span>Write a note</span>
          <kbd>N</kbd>
        </button>
        <button type="button" onClick={() => onNavigate("capture")}>
          <AudioLines size={18} />
          <span>Record a thought</span>
          <kbd>V</kbd>
        </button>
        <button type="button" onClick={() => onNavigate("capture")}>
          <FileText size={18} />
          <span>Import a file</span>
          <kbd>I</kbd>
        </button>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Recent signal</span>
            <h2>Today’s memory field</h2>
          </div>
          <button type="button" onClick={() => onNavigate("timeline")}>
            View timeline <ArrowRight size={15} />
          </button>
        </div>

        <div className="memory-preview-list">
          {recentMemories.map((memory, index) => {
            const Icon = memory.icon;
            return (
              <motion.article
                key={memory.title}
                className="memory-preview"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.08 }}
              >
                <time>{memory.time}</time>
                <div className="memory-preview__rail">
                  <span />
                </div>
                <GlassPanel className="memory-preview__card">
                  <div className={`memory-preview__icon is-${memory.type}`}>
                    <Icon size={17} />
                  </div>
                  <div className="memory-preview__body">
                    <span>{memory.type}</span>
                    <h3>{memory.title}</h3>
                    <p>{memory.preview}</p>
                    <div className="tag-row">
                      {memory.tags.map((tag) => (
                        <span key={tag}>#{tag}</span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="memory-preview__arrow" size={17} />
                </GlassPanel>
              </motion.article>
            );
          })}
        </div>
      </section>

      <GlassPanel className="daily-prompt" accent="amber">
        <span className="daily-prompt__icon">
          <Sparkles size={18} />
        </span>
        <div>
          <span>Quiet prompt</span>
          <strong>What idea kept returning today?</strong>
        </div>
        <button type="button" onClick={() => onNavigate("capture")}>
          Answer <ArrowRight size={14} />
        </button>
      </GlassPanel>
    </div>
  );
}


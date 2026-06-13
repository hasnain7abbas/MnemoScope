import type { HTMLAttributes, ReactNode } from "react";

type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  accent?: "cyan" | "amber" | "none";
};

export function GlassPanel({
  children,
  className = "",
  accent = "none",
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={`glass-panel glass-panel--${accent} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}


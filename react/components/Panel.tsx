import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
};

export function Panel({ children }: PanelProps) {
  return <section className="dashboard-panel">{children}</section>;
}

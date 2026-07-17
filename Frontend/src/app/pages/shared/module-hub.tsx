import { useNavigate } from "react-router";
import { PageHeader, QuickAction } from "../../components/shared/primitives";

export interface HubLink { icon: string; label: string; hint?: string; to: string; tone?: "primary" | "info" | "success" | "warning" }

// Generic secondary hub — lists the screens under a top-level nav group.
export function ModuleHub({ title, subtitle, links }: { title: string; subtitle?: string; links: HubLink[] }) {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <PageHeader title={title} subtitle={subtitle} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l, i) => (
          <QuickAction key={`${l.to}-${l.label}-${i}`} icon={l.icon} label={l.label} hint={l.hint} tone={l.tone} onClick={() => navigate(l.to)} />
        ))}
      </div>
    </div>
  );
}

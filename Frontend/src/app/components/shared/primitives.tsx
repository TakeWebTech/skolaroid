import type { ReactNode } from "react";
import { cn } from "../ui/utils";
import { Icon } from "./icon";
import type { StatusTone } from "../../lib/types";
import { atLeast, useApp } from "../../store/app-context";
import type { ExperienceLevel } from "../../lib/types";

/* ----------------------------- Status chip ----------------------------- */
const TONE_CLASSES: Record<StatusTone, string> = {
  success: "bg-success-subtle text-success-subtle-foreground",
  warning: "bg-warning-subtle text-warning-subtle-foreground",
  danger: "bg-danger-subtle text-danger-subtle-foreground",
  info: "bg-info-subtle text-info-subtle-foreground",
  primary: "bg-primary-subtle text-primary-subtle-foreground",
  muted: "bg-muted text-muted-foreground",
};

const TONE_DOT: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-info",
  primary: "bg-primary",
  muted: "bg-muted-foreground",
};

// Status always pairs colour with a text label + icon/dot (spec §4).
export function StatusChip({ tone = "muted", label, icon, className }: { tone?: StatusTone; label: string; icon?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[13px] font-medium", TONE_CLASSES[tone], className)}>
      {icon ? <Icon name={icon} className="size-3.5" /> : <span className={cn("size-2 rounded-full", TONE_DOT[tone])} />}
      {label}
    </span>
  );
}

/* ------------------------------ Stat card ------------------------------ */
export function StatCard({ label, value, delta, tone = "primary", icon, definition }: { label: string; value: string; delta?: string; tone?: StatusTone; icon?: string; definition?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] text-muted-foreground">{label}</p>
        {icon && (
          <span className={cn("flex size-8 items-center justify-center rounded-lg", TONE_CLASSES[tone])}>
            <Icon name={icon} className="size-4" />
          </span>
        )}
      </div>
      <p className="mt-2 text-[28px] font-semibold leading-none tracking-tight">{value}</p>
      {delta && <p className="mt-2 text-[13px] text-muted-foreground">{delta}</p>}
      {definition && <p className="mt-1 text-[12px] text-muted-foreground/80">{definition}</p>}
    </div>
  );
}

/* ----------------------------- Page header ----------------------------- */
export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight sm:text-[30px]">{title}</h1>
        {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ---------------------------- Section card ----------------------------- */
export function SectionCard({ title, description, action, children, className, bodyClassName }: { title?: string; description?: string; action?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string }) {
  return (
    <section className={cn("rounded-xl border border-border bg-card", className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          <div>
            {title && <h2 className="text-[17px] font-semibold">{title}</h2>}
            {description && <p className="text-[13px] text-muted-foreground">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

/* ---------------------------- Quick action ----------------------------- */
export function QuickAction({ icon, label, hint, tone = "primary", onClick }: { icon: string; label: string; hint?: string; tone?: StatusTone; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-accent"
    >
      <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-lg", TONE_CLASSES[tone])}>
        <Icon name={icon} className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-medium">{label}</span>
        {hint && <span className="block truncate text-[13px] text-muted-foreground">{hint}</span>}
      </span>
      <Icon name="ChevronRight" className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

/* ----------------------------- Empty state ----------------------------- */
export function EmptyState({ icon = "Inbox", title, description, action }: { icon?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon name={icon} className="size-6" />
      </span>
      <div>
        <p className="font-medium">{title}</p>
        {description && <p className="mt-1 text-[14px] text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/* -------------------------- Experience gate ---------------------------- */
// Renders children only when current experience level meets the requirement.
export function ExperienceOnly({ min, children }: { min: ExperienceLevel; children: ReactNode }) {
  const { experience } = useApp();
  if (!atLeast(experience, min)) return null;
  return <>{children}</>;
}

// Small pill that labels a feature by the experience level it belongs to.
export function LevelBadge({ level }: { level: ExperienceLevel }) {
  const map: Record<ExperienceLevel, StatusTone> = { beginner: "success", standard: "info", advanced: "primary" };
  const labels: Record<ExperienceLevel, string> = { beginner: "Beginner", standard: "Standard", advanced: "Advanced" };
  return <StatusChip tone={map[level]} label={labels[level]} icon="Sparkles" />;
}

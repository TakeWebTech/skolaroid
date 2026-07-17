import { useState, type ReactNode } from "react";
import { cn } from "../ui/utils";
import { Icon } from "./icon";
import { Button } from "../ui/button";
import { toast } from "sonner";

export interface WizardStep {
  key: string;
  title: string;
  description?: string;
  content: ReactNode;
}

// Guided wizard with progress, back, save draft and review (spec §5 Wizards).
export function Wizard({ steps, onFinish, finishLabel = "Publish" }: { steps: WizardStep[]; onFinish?: () => void; finishLabel?: string }) {
  const [current, setCurrent] = useState(0);
  const isLast = current === steps.length - 1;
  const step = steps[current];

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      {/* Step rail (desktop) / progress (mobile) */}
      <aside className="hidden lg:block">
        <ol className="space-y-1">
          {steps.map((s, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <li key={s.key}>
                <button
                  onClick={() => i <= current && setCurrent(i)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[14px]",
                    active ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full text-[12px]", done ? "bg-success text-success-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    {done ? <Icon name="Check" className="size-3.5" /> : i + 1}
                  </span>
                  {s.title}
                </button>
              </li>
            );
          })}
        </ol>
      </aside>

      <div className="min-w-0">
        {/* Mobile progress bar */}
        <div className="mb-4 lg:hidden">
          <div className="mb-2 flex items-center justify-between text-[13px] text-muted-foreground">
            <span>Step {current + 1} of {steps.length}</span>
            <span>{step.title}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((current + 1) / steps.length) * 100}%` }} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-[18px] font-semibold">{step.title}</h2>
          {step.description && <p className="mt-1 text-[14px] text-muted-foreground">{step.description}</p>}
          <div className="mt-5">{step.content}</div>
        </div>

        {/* Sticky actions */}
        <div className="sticky bottom-0 mt-4 flex items-center justify-between gap-2 rounded-xl border border-border bg-card/95 p-3 backdrop-blur">
          <Button variant="ghost" onClick={() => toast.success("Draft saved")}>
            <Icon name="Save" className="size-4" /> Save draft
          </Button>
          <div className="flex items-center gap-2">
            {current > 0 && (
              <Button variant="outline" onClick={() => setCurrent((c) => c - 1)}>
                <Icon name="ArrowLeft" className="size-4" /> Back
              </Button>
            )}
            {isLast ? (
              <Button onClick={() => { onFinish?.(); toast.success(`${finishLabel} complete`); }}>
                <Icon name="Check" className="size-4" /> {finishLabel}
              </Button>
            ) : (
              <Button onClick={() => setCurrent((c) => c + 1)}>
                Next <Icon name="ArrowRight" className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

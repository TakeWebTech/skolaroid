import type { ReactNode } from "react";
import { Icon } from "./icon";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

/* Skeleton list used while long work loads (spec §17 Loading). */
export function LoadingList({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function LoadingCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-7 w-24" />
          <Skeleton className="mt-3 h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

function CenteredState({ icon, iconClass, title, description, action }: { icon: string; iconClass: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-6 py-12 text-center">
      <span className={`flex size-12 items-center justify-center rounded-full ${iconClass}`}>
        <Icon name={icon} className="size-6" />
      </span>
      <div>
        <p className="font-medium">{title}</p>
        {description && <p className="mt-1 max-w-sm text-[14px] text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

// Explains the limitation and a help path (spec §17 Permission denied).
export function PermissionDenied({ resource = "this" }: { resource?: string }) {
  return (
    <CenteredState
      icon="Lock"
      iconClass="bg-warning-subtle text-warning-subtle-foreground"
      title="You do not have permission to view this"
      description={`Your role can't open ${resource}. Ask a School Admin to grant access, or open the Help panel for the request steps.`}
      action={<Button variant="outline"><Icon name="LifeBuoy" className="size-4" /> Get help</Button>}
    />
  );
}

// System error with retry + reference code (spec §17 System error).
export function SystemError({ code = "Skolaroid-500", onRetry }: { code?: string; onRetry?: () => void }) {
  return (
    <CenteredState
      icon="TriangleAlert"
      iconClass="bg-danger-subtle text-danger-subtle-foreground"
      title="Something went wrong"
      description={`We couldn't complete this action. Try again, and share reference ${code} if it keeps happening.`}
      action={<Button onClick={onRetry}><Icon name="RotateCw" className="size-4" /> Try again</Button>}
    />
  );
}

export function NoResults({ onClear }: { onClear?: () => void }) {
  return (
    <CenteredState
      icon="SearchX"
      iconClass="bg-muted text-muted-foreground"
      title="No results match your filters"
      description="Try different words or clear the active filters to see everything."
      action={<Button variant="outline" onClick={onClear}><Icon name="X" className="size-4" /> Clear filters</Button>}
    />
  );
}

import { useApp } from "../../store/app-context";
import type { ExperienceLevel } from "../../lib/types";
import { Icon } from "../shared/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../ui/dropdown-menu";

/* School / branch / year context selector — always visible (spec §3). */
export function ContextSwitcher() {
  const { context } = useApp();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-left text-[13px] hover:bg-accent">
        <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon name="School" className="size-4" />
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block truncate font-medium leading-tight">{context.school}</span>
          <span className="block truncate text-[12px] text-muted-foreground leading-tight">{context.branch} · {context.year}</span>
        </span>
        <Icon name="ChevronsUpDown" className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Current context</DropdownMenuLabel>
        <DropdownMenuItem>
          <Icon name="School" className="size-4" /> {context.school}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[12px] font-normal text-muted-foreground">Branch</DropdownMenuLabel>
        <DropdownMenuItem>{context.branch}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[12px] font-normal text-muted-foreground">Academic year</DropdownMenuLabel>
        <DropdownMenuItem>{context.year}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* Experience-level switcher — stored per user, never changes permissions (spec §2). */
const LEVELS: { id: ExperienceLevel; label: string; hint: string }[] = [
  { id: "beginner", label: "Beginner", hint: "Guided steps, minimal choices" },
  { id: "standard", label: "Standard", hint: "Full daily controls & shortcuts" },
  { id: "advanced", label: "Advanced", hint: "Bulk tools, automation, analytics" },
];

export function ExperienceSwitcher() {
  const { experience, setExperience } = useApp();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-[13px] hover:bg-accent">
        <Icon name="Sparkles" className="size-4 text-primary" />
        <span className="hidden font-medium capitalize lg:inline">{experience}</span>
        <Icon name="ChevronDown" className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Experience level</DropdownMenuLabel>
        <p className="px-2 pb-1 text-[12px] text-muted-foreground">Changes what you see, never your permissions.</p>
        <DropdownMenuRadioGroup value={experience} onValueChange={(v) => setExperience(v as ExperienceLevel)}>
          {LEVELS.map((l) => (
            <DropdownMenuRadioItem key={l.id} value={l.id} className="flex-col items-start gap-0.5 py-2">
              <span className="font-medium">{l.label}</span>
              <span className="text-[12px] text-muted-foreground">{l.hint}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

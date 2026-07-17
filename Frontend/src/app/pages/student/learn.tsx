import { PageHeader, SectionCard, StatusChip } from "../../components/shared/primitives";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Icon } from "../../components/shared/icon";
import { toast } from "sonner";

const COURSES = [
  { s: "Mathematics", unit: "Fractions & Decimals", p: 60, next: "Lesson 4 · Multiplying fractions" },
  { s: "Science", unit: "Photosynthesis", p: 45, next: "Lesson 3 · The role of chlorophyll" },
  { s: "English", unit: "Descriptive Writing", p: 78, next: "Lesson 6 · Using the senses" },
];

export function StudentLearn() {
  return (
    <div className="space-y-6">
      <PageHeader title="Learn" subtitle="Pick up where you left off" />
      <div className="grid gap-4 lg:grid-cols-3">
        {COURSES.map((c) => (
          <SectionCard key={c.s} title={c.s} action={<StatusChip tone={c.p >= 75 ? "success" : "info"} label={`${c.p}%`} />}>
            <p className="text-[14px] font-medium">{c.unit}</p>
            <Progress value={c.p} className="my-3" />
            <p className="text-[13px] text-muted-foreground">Next: {c.next}</p>
            <Button className="mt-4 w-full" onClick={() => toast.success(`Opening ${c.next}`)}><Icon name="PlayCircle" className="size-4" /> Continue</Button>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}

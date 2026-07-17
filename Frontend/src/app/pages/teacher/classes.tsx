import { useNavigate } from "react-router";
import { PageHeader, SectionCard, StatusChip, ExperienceOnly } from "../../components/shared/primitives";
import { Icon } from "../../components/shared/icon";
import { Button } from "../../components/ui/button";
import { TEACHER_TODAY_CLASSES, CLASSES } from "../../lib/mock-data";

export function TeacherClasses() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <PageHeader title="My Classes" subtitle="Open an assigned class quickly" />

      <SectionCard title="Today" description="Next action ready on each card" bodyClassName="p-0">
        <ul className="divide-y divide-border">
          {TEACHER_TODAY_CLASSES.map((c) => (
            <li key={c.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-semibold text-primary">{c.className}</div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{c.subject} · {c.time}</p>
                <p className="text-[13px] text-muted-foreground">{c.students} students · {c.room}</p>
              </div>
              {c.attendanceTaken
                ? <StatusChip tone="success" label="Attendance done" icon="Check" />
                : <Button size="sm" onClick={() => navigate("/teacher/attendance")}>Take attendance</Button>}
              <Button size="sm" variant="ghost" onClick={() => navigate("/teacher/learning")}>Open</Button>
            </li>
          ))}
          {TEACHER_TODAY_CLASSES.length === 0 && <li className="px-5 py-4 text-[14px] text-muted-foreground">No classes created yet.</li>}
        </ul>
      </SectionCard>

      <SectionCard title="All classes">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CLASSES.map((c) => (
            <button key={c} onClick={() => navigate("/teacher/learning")} className="rounded-xl border border-border bg-card p-4 text-left hover:border-primary/40 hover:bg-accent">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 font-semibold text-primary">{c}</span>
                <Icon name="ChevronRight" className="size-4 text-muted-foreground" />
              </div>
              <p className="mt-3 font-medium">Class {c} · Mathematics</p>
              <p className="text-[13px] text-muted-foreground">{28 + (c.charCodeAt(0) % 9)} students</p>
            </button>
          ))}
          {CLASSES.length === 0 && <p className="text-[14px] text-muted-foreground">No classes created yet.</p>}
        </div>
      </SectionCard>

      <ExperienceOnly min="advanced">
        <SectionCard title="Compact workload view" description="Advanced">
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead><tr className="text-left text-[13px] text-muted-foreground"><th className="py-2">Class</th><th>Students</th><th>Avg attendance</th><th>Pending grading</th></tr></thead>
              <tbody>
                {CLASSES.map((c) => (
                  <tr key={c} className="border-t border-border"><td className="py-2 font-medium">{c}</td><td>{28 + (c.charCodeAt(0) % 9)}</td><td>{88 + (c.charCodeAt(1) % 10)}%</td><td>{c.charCodeAt(0) % 12}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </ExperienceOnly>
    </div>
  );
}

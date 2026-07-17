import { useNavigate } from "react-router";
import { PageHeader, QuickAction, SectionCard, StatusChip, StatCard, ExperienceOnly } from "../../components/shared/primitives";
import { Icon } from "../../components/shared/icon";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";

const SETUP = [
  { id: "s1", label: "Academic year & classes", done: true },
  { id: "s2", label: "Subjects & sections", done: true },
  { id: "s3", label: "Staff accounts & roles", done: true },
  { id: "s4", label: "Import students", done: false },
  { id: "s5", label: "Fee plans", done: false },
  { id: "s6", label: "Communication channels", done: false },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const done = SETUP.filter((s) => s.done).length;
  const pct = Math.round((done / SETUP.length) * 100);
  return (
    <div className="space-y-6">
      <PageHeader title="School setup & operations" subtitle="Demo School · Main Branch" />

      <SectionCard title="Setup health" description={`${done} of ${SETUP.length} steps complete`} action={<Button size="sm" onClick={() => navigate("/admin/academics")}>Continue setup</Button>}>
        <Progress value={pct} className="mb-4" />
        <ul className="grid gap-2 sm:grid-cols-2">
          {SETUP.map((s) => (
            <li key={s.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Icon name={s.done ? "CheckCircle2" : "Circle"} className={s.done ? "size-5 text-success" : "size-5 text-muted-foreground"} />
              <span className="flex-1 text-[14px] font-medium">{s.label}</span>
              {!s.done && <Button size="sm" variant="outline">Do this</Button>}
            </li>
          ))}
        </ul>
      </SectionCard>

      <div className="grid gap-3 sm:grid-cols-3">
        <QuickAction icon="Play" label="Continue Setup" hint="2 steps left" onClick={() => navigate("/admin/academics")} />
        <QuickAction icon="UserPlus" label="Add Student" hint="New admission" tone="info" onClick={() => navigate("/admin/people")} />
        <QuickAction icon="Upload" label="Import Data" hint="Bulk CSV" tone="success" onClick={() => navigate("/admin/people")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Total students" value="1,240" delta="+18 this month" tone="primary" icon="Users" />
        <StatCard label="Pending admissions" value="7" delta="Awaiting docs" tone="warning" icon="FileClock" />
        <StatCard label="Staff accounts" value="86" delta="3 invited" tone="info" icon="UserCog" />
        <StatCard label="User issues" value="2" delta="Locked out" tone="danger" icon="TriangleAlert" />
      </div>

      <SectionCard title="Warnings" description="Each warning explains its impact and correction">
        <ul className="space-y-2">
          {[
            { t: "5 students missing guardian phone", why: "SMS fee reminders won't reach them.", fix: "Add numbers" },
            { t: "Fee plan not activated for Class 6", why: "Demands can't be raised for 96 students.", fix: "Activate plan" },
          ].map((w) => (
            <li key={w.t} className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning-subtle/50 p-3">
              <Icon name="TriangleAlert" className="mt-0.5 size-4 text-warning-subtle-foreground" />
              <div className="flex-1"><p className="text-[14px] font-medium">{w.t}</p><p className="text-[13px] text-muted-foreground">{w.why}</p></div>
              <Button size="sm" variant="outline">{w.fix}</Button>
            </li>
          ))}
        </ul>
      </SectionCard>

      <ExperienceOnly min="advanced">
        <SectionCard title="Integration health" description="Advanced">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border p-3"><StatusChip tone="success" label="SMS gateway · OK" icon="Check" /><p className="mt-2 text-[13px] text-muted-foreground">99.9% delivery</p></div>
            <div className="rounded-lg border border-border p-3"><StatusChip tone="success" label="Payment gateway · OK" icon="Check" /><p className="mt-2 text-[13px] text-muted-foreground">Settlements current</p></div>
            <div className="rounded-lg border border-border p-3"><StatusChip tone="warning" label="Email · Degraded" icon="Clock" /><p className="mt-2 text-[13px] text-muted-foreground">Queued 12 min</p></div>
          </div>
        </SectionCard>
      </ExperienceOnly>
    </div>
  );
}

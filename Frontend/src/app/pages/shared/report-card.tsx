import { PageHeader, SectionCard, StatusChip, StatCard } from "../../components/shared/primitives";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/shared/icon";
import { RESULTS } from "../../lib/mock-data";
import { toast } from "sonner";

export function ReportCard({ title = "Results", who = "Aarav Sharma · Class 8A" }: { title?: string; who?: string }) {
  const total = RESULTS.reduce((a, r) => a + r.marks, 0);
  const max = RESULTS.reduce((a, r) => a + r.max, 0);
  const pct = max > 0 ? Math.round((total / max) * 100) : 0;
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        subtitle={`Term 1 Examination · ${who}`}
        actions={<Button onClick={() => toast.success("Report card downloaded (PDF)")}><Icon name="Download" className="size-4" /> Download</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Overall" value={`${pct}%`} delta={`${total} / ${max} marks`} tone="success" icon="Award" />
        <StatCard label="Grade" value="A2" delta="Distinction band" tone="primary" icon="Star" />
        <StatCard label="Attendance" value="94%" delta="This term" tone="info" icon="CalendarCheck" />
      </div>

      <SectionCard title="Subject grades" description="Grades explained: A1 (91–100), A2 (81–90), B1 (71–80)…" bodyClassName="p-0">
        <table className="w-full text-[14px]">
          <thead><tr className="border-b border-border text-left text-[13px] text-muted-foreground"><th className="px-5 py-3">Subject</th><th className="px-5 py-3">Marks</th><th className="px-5 py-3">Grade</th></tr></thead>
          <tbody>
            {RESULTS.map((r) => (
              <tr key={r.subject} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium">{r.subject}</td>
                <td className="px-5 py-3">{r.marks} / {r.max}</td>
                <td className="px-5 py-3"><StatusChip tone={r.marks >= 85 ? "success" : r.marks >= 75 ? "info" : "warning"} label={r.grade} /></td>
              </tr>
            ))}
            {RESULTS.length === 0 && <tr><td className="px-5 py-4 text-muted-foreground" colSpan={3}>No results published yet.</td></tr>}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Teacher's comment">
        <p className="text-muted-foreground">Aarav has shown consistent effort and strong problem-solving in Mathematics. Focus on written expression in English next term. Keep it up!</p>
      </SectionCard>
    </div>
  );
}

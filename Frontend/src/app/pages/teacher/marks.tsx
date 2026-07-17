import { useEffect, useState } from "react";
import { EmptyState, PageHeader, SectionCard, StatusChip } from "../../components/shared/primitives";
import { Icon } from "../../components/shared/icon";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { colorFor, initials } from "../../lib/mock-data";
import { getMarksEntry, saveMarksDraft, submitMarks, type MarksEntry, type MarkInput } from "../../lib/exams-api";
import { toast } from "sonner";

export function EnterMarks() {
  const [entry, setEntry] = useState<MarksEntry | null>(null);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [absent, setAbsent] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => { getMarksEntry().then((data) => { setEntry(data); setMarks(Object.fromEntries(Object.entries(data.records).map(([id, r]) => [id, r.marks?.toString() ?? ""]))); setAbsent(Object.fromEntries(Object.entries(data.records).map(([id, r]) => [id, r.absent]))); }).catch((e) => toast.error(e instanceof Error ? e.message : "Could not load marks entry")).finally(() => setLoading(false)); }, []);
  if (loading) return <p className="rounded-xl border border-border bg-card p-4 text-[14px] text-muted-foreground">Loading marks entry...</p>;
  if (!entry) return <EmptyState icon="FileText" title="No exam available" description="Create an exam first, then enter marks." />;
  const locked = entry.status === "marks_submitted" || entry.status === "published";
  const err = (v: string) => v !== "" && (Number(v) > entry.maxMarks || Number(v) < 0);
  const hasErrors = entry.students.some((s) => err(marks[s.id] ?? ""));
  const payload = (): MarkInput[] => entry.students.map((s) => ({ studentId: s.id, marks: absent[s.id] ? undefined : Number(marks[s.id] || 0), absent: !!absent[s.id] }));
  async function save(submit: boolean) {
    try {
      const next = submit ? await submitMarks(entry.id, payload()) : await saveMarksDraft(entry.id, payload());
      setEntry(next); toast.success(submit ? "Marks submitted and locked" : "Draft saved");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Could not save marks"); }
  }
  return (
    <div className="space-y-5">
      <PageHeader title="Enter Marks" subtitle={`${entry.name} · ${entry.subject} · ${entry.className}`} actions={<div className="flex gap-2"><Button variant="outline" disabled={locked} onClick={() => save(false)}><Icon name="Save" className="size-4" /> Save draft</Button><Button disabled={hasErrors || locked} onClick={() => save(true)}><Icon name="Lock" className="size-4" /> Submit marks</Button></div>} />
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3 text-[13px]"><StatusChip tone="info" label={`Max marks ${entry.maxMarks}`} icon="Target" />{locked ? <StatusChip tone="success" label="Locked" icon="Lock" /> : <StatusChip tone="warning" label="Not submitted" icon="Circle" />}{hasErrors && <StatusChip tone="danger" label="Some marks exceed maximum" icon="TriangleAlert" />}</div>
      <SectionCard bodyClassName="p-0">
        <table className="w-full text-[14px]"><thead><tr className="border-b border-border text-left text-[13px] text-muted-foreground"><th className="px-4 py-3">Student</th><th className="w-28 px-4 py-3">Marks</th><th className="w-24 px-4 py-3">Absent</th></tr></thead><tbody>{entry.students.map((s) => {
          const value = marks[s.id] ?? ""; const isAbsent = absent[s.id];
          return <tr key={s.id} className="border-b border-border last:border-0"><td className="px-4 py-2"><div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-full text-[12px] font-semibold text-white" style={{ backgroundColor: colorFor(s.name) }}>{initials(s.name)}</span><span className="font-medium">{s.name}</span></div></td><td className="px-4 py-2"><Input inputMode="numeric" disabled={isAbsent || locked} value={isAbsent ? "" : value} onChange={(e) => setMarks((m) => ({ ...m, [s.id]: e.target.value }))} className={err(value) ? "border-destructive" : ""} /></td><td className="px-4 py-2"><Button size="sm" variant={isAbsent ? "destructive" : "outline"} disabled={locked} onClick={() => setAbsent((a) => ({ ...a, [s.id]: !a[s.id] }))}>{isAbsent ? "Absent" : "Mark"}</Button></td></tr>;
        })}</tbody></table>
      </SectionCard>
    </div>
  );
}

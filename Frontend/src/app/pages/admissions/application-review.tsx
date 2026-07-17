import { useEffect, useState } from "react";
import { PageHeader, SectionCard, StatusChip, EmptyState } from "../../components/shared/primitives";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Icon } from "../../components/shared/icon";
import { colorFor, initials } from "../../lib/mock-data";
import type { StatusTone } from "../../lib/types";
import { listApplications, offerApplication, rejectApplication, requestDocuments, type AdmissionApplication } from "../../lib/admissions-api";
import { toast } from "sonner";

const TONE: Record<AdmissionApplication["stage"], StatusTone> = { New: "info", "Under review": "primary", Interview: "warning", Offered: "success", Rejected: "danger" };

export function ApplicationReview() {
  const [apps, setApps] = useState<AdmissionApplication[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [notes, setNotes] = useState("");
  function load() { listApplications().then((items) => { setApps(items); setSelectedId((old) => old || items[0]?.id || ""); }).catch((e) => toast.error(e instanceof Error ? e.message : "Could not load applications")); }
  useEffect(load, []);
  const selected = apps.find((a) => a.id === selectedId);
  async function decide(kind: "offer" | "reject" | "docs") {
    if (!selected) return;
    try {
      if (kind === "offer") await offerApplication(selected.id, notes);
      if (kind === "reject") await rejectApplication(selected.id, notes);
      if (kind === "docs") await requestDocuments(selected.id, notes || "Please upload missing documents.");
      toast.success("Application updated"); setNotes(""); load();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Could not update application"); }
  }
  return (
    <div className="space-y-6">
      <PageHeader title="Application review" subtitle="Assess applicants and make audited admission decisions" actions={<StatusChip tone="primary" label={`${apps.filter((a) => a.stage !== "Rejected" && a.stage !== "Offered").length} pending`} icon="Inbox" />} />
      {apps.length === 0 ? <EmptyState icon="Inbox" title="No applications to review" /> : <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]"><SectionCard title="Applicants" bodyClassName="p-0"><ul className="divide-y divide-border">{apps.map((a) => <li key={a.id}><button onClick={() => setSelectedId(a.id)} className={`flex w-full items-center gap-3 px-4 py-3 text-left ${a.id === selectedId ? "bg-accent" : "hover:bg-muted/50"}`}><span className="flex size-9 shrink-0 items-center justify-center rounded-full text-[13px] font-medium text-white" style={{ backgroundColor: colorFor(a.studentName) }}>{initials(a.studentName)}</span><span className="min-w-0 flex-1"><span className="block truncate font-medium">{a.studentName}</span><span className="block text-[13px] text-muted-foreground">{a.grade}</span></span><StatusChip tone={TONE[a.stage]} label={a.stage} /></button></li>)}</ul></SectionCard>{selected && <div className="space-y-4"><SectionCard title={selected.studentName} description={`${selected.grade} · ${selected.guardianName}`} action={<StatusChip tone={TONE[selected.stage]} label={selected.stage} />}><div className="grid gap-4 sm:grid-cols-2"><Field label="Guardian phone" value={selected.guardianPhone} /><Field label="Email" value={selected.guardianEmail ?? "-"} /><Field label="Source" value={selected.source} /><Field label="Submitted" value={new Date(selected.submittedAt).toLocaleString()} /></div>{selected.notes && <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-[13px] text-muted-foreground">{selected.notes}</p>}</SectionCard><SectionCard title="Decision notes"><Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Reason or guardian note..." /><div className="mt-3 flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => decide("docs")}><Icon name="FileWarning" className="size-4" /> Request docs</Button><Button variant="outline" className="text-destructive" onClick={() => decide("reject")}><Icon name="X" className="size-4" /> Reject</Button><Button onClick={() => decide("offer")}><Icon name="Check" className="size-4" /> Offer seat</Button></div></SectionCard></div>}</div>}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) { return <div><p className="text-[13px] text-muted-foreground">{label}</p><p className="font-medium">{value}</p></div>; }

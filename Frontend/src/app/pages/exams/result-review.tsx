import { useEffect, useState } from "react";
import { PageHeader, SectionCard, StatusChip, StatCard, EmptyState } from "../../components/shared/primitives";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/shared/icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import { getResultReview, publishResults, type ResultReview as Review } from "../../lib/exams-api";
import { toast } from "sonner";

export function ResultReview() {
  const [review, setReview] = useState<Review | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  function load() { setLoading(true); getResultReview().then(setReview).catch((e) => toast.error(e instanceof Error ? e.message : "Could not load review")).finally(() => setLoading(false)); }
  useEffect(load, []);
  async function publish() { if (!review) return; try { await publishResults(review.id); toast.success("Results published"); setConfirm(false); load(); } catch (e) { toast.error(e instanceof Error ? e.message : "Could not publish results"); } }
  if (loading) return <p className="rounded-xl border border-border bg-card p-4 text-[14px] text-muted-foreground">Loading result review...</p>;
  if (!review) return <EmptyState icon="FileText" title="No exam to review" description="Create an exam and submit marks first." />;
  const checks = [
    { label: "All marks entered", done: review.completion === 100, detail: `${review.completion}% complete` },
    { label: "Above-max errors", done: review.anomalies === 0, detail: `${review.anomalies} anomalies` },
    { label: "Marks submitted", done: review.status === "marks_submitted" || review.status === "published", detail: review.status.replace("_", " ") },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title="Result review" subtitle={`${review.name} · ${review.className} · verify before publishing safely`} />
      <div className="grid gap-4 sm:grid-cols-3"><StatCard label="Completion" value={`${review.completion}%`} tone="success" icon="CheckCircle2" /><StatCard label="Average" value={`${review.average}`} tone="primary" icon="TrendingUp" /><StatCard label="Anomalies" value={String(review.anomalies)} tone="info" icon="ScanSearch" /></div>
      <SectionCard title="Pre-publish checklist"><ul className="space-y-2">{checks.map((c) => <li key={c.label} className="flex items-center gap-3 rounded-lg border border-border p-3"><Icon name={c.done ? "CheckCircle2" : "Circle"} className={`size-5 ${c.done ? "text-success" : "text-muted-foreground"}`} /><div className="flex-1"><p className="text-[14px] font-medium">{c.label}</p><p className="text-[13px] text-muted-foreground">{c.detail}</p></div></li>)}</ul></SectionCard>
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-[14px] text-muted-foreground">Publishing makes results visible after all marks are complete and submitted.</p><div className="flex gap-2"><Button variant="outline" disabled><Icon name="Eye" className="size-4" /> Preview API pending</Button><Button disabled={review.status === "published"} onClick={() => setConfirm(true)}><Icon name="Send" className="size-4" /> Publish</Button></div></div>
      <Dialog open={confirm} onOpenChange={setConfirm}><DialogContent><DialogHeader><DialogTitle>Publish results?</DialogTitle><DialogDescription>This is recorded in the audit log.</DialogDescription></DialogHeader><StatusChip tone="warning" label={`Audience: ${review.className}`} icon="Users" /><DialogFooter><Button variant="outline" onClick={() => setConfirm(false)}>Cancel</Button><Button onClick={publish}>Confirm & publish</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}

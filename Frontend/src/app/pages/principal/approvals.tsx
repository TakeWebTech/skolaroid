import { useState } from "react";
import { PageHeader, SectionCard, StatusChip, EmptyState } from "../../components/shared/primitives";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/shared/icon";
import { Textarea } from "../../components/ui/textarea";
import { APPROVALS } from "../../lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import { toast } from "sonner";

const RISK_TONE = { high: "danger", medium: "warning", low: "info" } as const;

export function Approvals() {
  const [items, setItems] = useState(APPROVALS);
  const [confirm, setConfirm] = useState<{ id: string; action: "approve" | "reject" } | null>(null);
  const [reason, setReason] = useState("");

  const act = () => {
    if (!confirm) return;
    setItems((list) => list.filter((i) => i.id !== confirm.id));
    toast.success(confirm.action === "approve" ? "Approved and recorded in audit" : "Rejected with reason recorded");
    setConfirm(null); setReason("");
  };

  const target = items.find((i) => i.id === confirm?.id);

  return (
    <div className="space-y-6">
      <PageHeader title="Approvals" subtitle="Each decision is previewed and recorded" />
      {items.length === 0 ? (
        <EmptyState icon="CheckCircle2" title="You're all caught up" description="New items needing your decision will appear here." />
      ) : (
        <SectionCard bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {items.map((a) => (
              <li key={a.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><p className="font-medium">{a.title}</p><StatusChip tone={RISK_TONE[a.risk]} label={`${a.risk} risk`} /></div>
                  <p className="text-[13px] text-muted-foreground">Requested by {a.by} · {a.when}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setConfirm({ id: a.id, action: "reject" })}>Reject</Button>
                  <Button size="sm" onClick={() => setConfirm({ id: a.id, action: "approve" })}><Icon name="Check" className="size-4" /> Approve</Button>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <Dialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirm?.action === "approve" ? "Approve request?" : "Reject request?"}</DialogTitle>
            <DialogDescription>{target?.title}. This action is recorded in the audit log with your name and time.</DialogDescription>
          </DialogHeader>
          {(confirm?.action === "reject" || target?.risk === "high") && (
            <div className="space-y-1.5"><label className="text-[14px] font-medium">Reason {confirm?.action === "reject" ? "(required)" : "(recommended)"}</label><Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Add a short reason for the record" /></div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(null)}>Cancel</Button>
            <Button variant={confirm?.action === "reject" ? "destructive" : "default"} disabled={confirm?.action === "reject" && !reason} onClick={act}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

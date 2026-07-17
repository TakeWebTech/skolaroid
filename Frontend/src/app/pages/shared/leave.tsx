import { PageHeader, SectionCard, StatusChip } from "../../components/shared/primitives";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Icon } from "../../components/shared/icon";
import { toast } from "sonner";

const HISTORY = [
  { id: "l1", range: "12–13 Jun", reason: "Fever", status: "approved" as const },
  { id: "l2", range: "02 May", reason: "Family function", status: "approved" as const },
  { id: "l3", range: "18 Jul", reason: "Medical appointment", status: "pending" as const },
];
const TONE = { approved: "success", pending: "warning", rejected: "danger" } as const;

export function LeavePage({ title = "Leave" }: { title?: string }) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} subtitle="Submit and track leave requests" />
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Apply for leave">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>From</Label><Input type="date" /></div>
              <div className="space-y-1.5"><Label>To</Label><Input type="date" /></div>
            </div>
            <div className="space-y-1.5"><Label>Reason</Label><Textarea rows={3} placeholder="Briefly explain the reason" /></div>
            <div className="space-y-1.5"><Label>Attachment <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-border p-3 text-[13px] text-muted-foreground"><Icon name="Paperclip" className="size-4" /> Upload medical note or document</div>
            </div>
            <p className="rounded-lg bg-info-subtle px-3 py-2 text-[13px] text-info-subtle-foreground"><Icon name="Info" className="mr-1 inline size-4 align-text-bottom" /> These 2 days will be marked as approved leave in attendance once accepted.</p>
            <Button onClick={() => toast.success("Leave request submitted for approval")}><Icon name="Send" className="size-4" /> Submit</Button>
          </div>
        </SectionCard>

        <SectionCard title="History" bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {HISTORY.map((h) => (
              <li key={h.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1"><p className="font-medium">{h.range}</p><p className="text-[13px] text-muted-foreground">{h.reason}</p></div>
                <StatusChip tone={TONE[h.status]} label={h.status[0].toUpperCase() + h.status.slice(1)} />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}

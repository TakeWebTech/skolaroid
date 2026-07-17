import { PageHeader, SectionCard, EmptyState } from "../../components/shared/primitives";
import { LoadingList, LoadingCards, PermissionDenied, SystemError, NoResults } from "../../components/shared/states";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/shared/icon";
import { toast } from "sonner";

export function StatesGallery() {
  return (
    <div className="space-y-6">
      <PageHeader title="System states" subtitle="Loading, empty, error, offline, success and permission — for developer handoff" />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Loading — skeletons"><LoadingCards count={2} /><div className="mt-4"><LoadingList rows={2} /></div></SectionCard>
        <SectionCard title="Empty — reason + first action"><EmptyState icon="Inbox" title="No assignments yet" description="Assignments you create will appear here." action={<Button size="sm"><Icon name="Plus" className="size-4" /> Create assignment</Button>} /></SectionCard>
        <SectionCard title="No results — active filters + clear"><NoResults onClear={() => toast("Filters cleared")} /></SectionCard>
        <SectionCard title="Permission denied — limitation + help"><PermissionDenied resource="the finance ledger" /></SectionCard>
        <SectionCard title="System error — retry + reference code"><SystemError onRetry={() => toast("Retrying…")} /></SectionCard>
        <SectionCard title="Success & offline">
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-lg bg-success-subtle px-4 py-3 text-[14px] text-success-subtle-foreground"><Icon name="CheckCircle2" className="size-4" /> Attendance saved — 32 present, 2 absent. <button className="ml-auto font-medium underline">View class</button></div>
            <div className="flex items-center gap-2 rounded-lg bg-warning-subtle px-4 py-3 text-[14px] text-warning-subtle-foreground"><Icon name="CloudOff" className="size-4" /> Offline — changes saved on this device and will sync when you reconnect.</div>
            <div className="flex items-center gap-2 rounded-lg bg-info-subtle px-4 py-3 text-[14px] text-info-subtle-foreground"><Icon name="Info" className="size-4" /> Partial success — 28 messages sent, 2 failed (no phone number).</div>
            <Button onClick={() => toast.success("This is a success toast")}>Trigger success toast</Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

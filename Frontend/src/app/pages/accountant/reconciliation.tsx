import { useState } from "react";
import { PageHeader, SectionCard, StatusChip, StatCard, EmptyState } from "../../components/shared/primitives";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/shared/icon";
import { UNMATCHED_PAYMENTS, SCHOOL } from "../../lib/mock-data";
import { toast } from "sonner";

const fmt = (n: number) => `${SCHOOL.currency}${n.toLocaleString("en-IN")}`;

export function Reconciliation() {
  const [items, setItems] = useState(UNMATCHED_PAYMENTS);
  const resolve = (id: string) => { setItems((l) => l.filter((i) => i.id !== id)); toast.success("Payment matched and receipt issued"); };

  return (
    <div className="space-y-6">
      <PageHeader title="Reconciliation" subtitle="Resolve unmatched settlements — differences are never auto-hidden" actions={<Button variant="outline" onClick={() => toast.success("Exported reconciliation report")}><Icon name="Download" className="size-4" /> Export</Button>} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Settled today" value="₹1.84L" tone="success" icon="CheckCircle2" />
        <StatCard label="Unmatched" value={String(items.length)} tone="warning" icon="CircleHelp" />
        <StatCard label="Difference" value={fmt(items.reduce((a, i) => a + i.amount, 0))} tone="danger" icon="TriangleAlert" />
      </div>

      {items.length === 0 ? (
        <EmptyState icon="CheckCircle2" title="Everything is reconciled" description="No unmatched settlements remain for today." />
      ) : (
        <SectionCard title="Exceptions" bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {items.map((u) => {
              const matched = u.suggest !== "No match found";
              return (
                <li key={u.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{u.ref}</p>
                    <p className="text-[13px] text-muted-foreground">{u.when} · {fmt(u.amount)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {matched ? <StatusChip tone="info" label={`Suggested: ${u.suggest}`} icon="Sparkles" /> : <StatusChip tone="danger" label="No suggestion" />}
                    <Button size="sm" variant={matched ? "default" : "outline"} onClick={() => resolve(u.id)}>{matched ? "Accept match" : "Match manually"}</Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}

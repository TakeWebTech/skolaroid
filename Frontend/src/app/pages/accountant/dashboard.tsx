import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PageHeader, QuickAction, SectionCard, StatusChip, StatCard } from "../../components/shared/primitives";
import { Button } from "../../components/ui/button";
import { getFinanceSummary, type FinanceSummary } from "../../lib/finance-api";
import { toast } from "sonner";

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function AccountantDashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  useEffect(() => { getFinanceSummary().then(setSummary).catch((e) => toast.error(e instanceof Error ? e.message : "Could not load finance summary")); }, []);
  return (
    <div className="space-y-6">
      <PageHeader title="Collections & exceptions" subtitle="Currency, status and date are always visible" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Collected" value={fmt(summary?.collected ?? 0)} tone="success" />
        <StatCard label="Outstanding dues" value={fmt(summary?.totalDue ?? 0)} tone="warning" />
        <StatCard label="Due records" value={String(summary?.dueCount ?? 0)} tone="info" />
        <StatCard label="Unmatched payments" value="0" tone="success" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <QuickAction icon="HandCoins" label="Collect Payment" hint="Cash / UPI / card" onClick={() => navigate("/accountant/payments")} />
        <QuickAction icon="GitCompareArrows" label="Reconcile" hint="Next finance slice" tone="warning" onClick={() => navigate("/accountant/reconciliation")} />
        <QuickAction icon="ReceiptText" label="View Dues" hint={fmt(summary?.totalDue ?? 0)} tone="info" onClick={() => navigate("/accountant/fees")} />
      </div>
      <SectionCard title="Top dues" bodyClassName="p-0"><ul className="divide-y divide-border">{(summary?.dues ?? []).slice(0, 8).map((d) => <li key={d.id} className="flex items-center gap-3 px-5 py-3"><div className="min-w-0 flex-1"><p className="font-medium">{d.studentName}</p><p className="text-[12px] text-muted-foreground">Class {d.classCode ?? "-"} · due {d.dueDate}</p></div><span className="font-semibold">{fmt(d.amount)}</span><StatusChip tone="warning" label="due" /></li>)}</ul></SectionCard>
      <SectionCard title="Reconciliation"><p className="text-[14px] text-muted-foreground">Bank settlement matching is the next finance sub-slice. Offline receipts are now persisted and audited.</p><Button className="mt-3" variant="outline" onClick={() => navigate("/accountant/reconciliation")}>Open reconciliation</Button></SectionCard>
    </div>
  );
}

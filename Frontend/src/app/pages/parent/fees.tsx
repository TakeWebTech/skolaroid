import { useEffect, useState } from "react";
import { PageHeader, SectionCard, StatusChip, StatCard, EmptyState } from "../../components/shared/primitives";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/shared/icon";
import { checkoutPayment, getParentFees, type ParentFeesResponse } from "../../lib/finance-api";
import { toast } from "sonner";

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function ParentFees() {
  const [data, setData] = useState<ParentFeesResponse | null>(null);
  function load() { getParentFees().then(setData).catch((e) => toast.error(e instanceof Error ? e.message : "Could not load fees")); }
  useEffect(load, []);
  const due = (data?.demands ?? []).filter((d) => d.status === "DUE");
  const paid = (data?.demands ?? []).filter((d) => d.status === "PAID");
  const totalDue = due.reduce((a, f) => a + f.amount, 0);
  async function pay(demandId: string, amount: number) { try { await checkoutPayment(demandId, amount); toast.success("Payment recorded"); load(); } catch (e) { toast.error(e instanceof Error ? e.message : "Could not pay"); } }
  return (
    <div className="space-y-6">
      <PageHeader title="Fees" subtitle={data ? data.student.name : "Loading..."} />
      <div className="grid gap-4 sm:grid-cols-3"><StatCard label="Total due" value={fmt(totalDue)} tone="warning" icon="Wallet" /><StatCard label="Paid records" value={String(paid.length)} tone="success" icon="CheckCircle2" /><StatCard label="Receipts" value={String(data?.payments.length ?? 0)} tone="info" icon="ReceiptText" /></div>
      <SectionCard title="Installments" bodyClassName="p-0">
        {!data ? <p className="p-5 text-[14px] text-muted-foreground">Loading fees...</p> : data.demands.length === 0 ? <div className="p-5"><EmptyState icon="Wallet" title="No fee records" /></div> : <ul className="divide-y divide-border">{data.demands.map((f) => <li key={f.id} className="flex items-center gap-4 px-5 py-4"><div className="min-w-0 flex-1"><p className="font-medium">{f.label}</p><p className="text-[13px] text-muted-foreground">Due {f.dueDate.slice(0, 10)}</p></div><p className="font-semibold">{fmt(f.amount)}</p><StatusChip tone={f.status === "PAID" ? "success" : "warning"} label={f.status.toLowerCase()} />{f.status === "DUE" && <Button size="sm" onClick={() => pay(f.id, f.amount)}>Pay now</Button>}</li>)}</ul>}
      </SectionCard>
      <SectionCard title="Receipts" bodyClassName="p-0"><ul className="divide-y divide-border">{(data?.payments ?? []).map((p) => <li key={p.id} className="flex items-center gap-3 px-5 py-3"><Icon name="ReceiptText" className="size-4 text-muted-foreground" /><span className="flex-1">{p.receiptNo}</span><span className="font-medium">{fmt(p.amount)}</span></li>)}</ul></SectionCard>
    </div>
  );
}

import { useEffect, useState } from "react";
import { PageHeader, SectionCard, StatusChip, EmptyState } from "../../components/shared/primitives";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/shared/icon";
import { cn } from "../../components/ui/utils";
import { collectOfflinePayment, getFinanceSummary, type FeeDue, type PaymentReceipt } from "../../lib/finance-api";
import { colorFor, initials } from "../../lib/mock-data";
import { toast } from "sonner";

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const METHODS = ["CASH", "UPI", "CARD", "CHEQUE"];

export function CollectPayment() {
  const [dues, setDues] = useState<FeeDue[]>([]);
  const [selected, setSelected] = useState<FeeDue | null>(null);
  const [method, setMethod] = useState("CASH");
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  function load() { setLoading(true); getFinanceSummary().then((s) => { setDues(s.dues); setSelected(s.dues[0] ?? null); }).catch((e) => toast.error(e instanceof Error ? e.message : "Could not load dues")).finally(() => setLoading(false)); }
  useEffect(load, []);
  async function collect() {
    if (!selected) return;
    try { const r = await collectOfflinePayment(selected.id, selected.amount, method); setReceipt(r); toast.success("Payment recorded"); load(); } catch (e) { toast.error(e instanceof Error ? e.message : "Could not record payment"); }
  }
  if (receipt) return <div className="space-y-6"><PageHeader title="Collect Payment" /><SectionCard><div className="flex flex-col items-center gap-3 py-8 text-center"><span className="flex size-14 items-center justify-center rounded-full bg-success-subtle text-success-subtle-foreground"><Icon name="Check" className="size-7" /></span><div><p className="text-[18px] font-semibold">Payment collected</p><p className="text-muted-foreground">{fmt(receipt.amount)} from {receipt.studentName} via {receipt.method}</p></div><StatusChip tone="success" label={`Receipt ${receipt.receiptNo}`} icon="ReceiptText" /><Button onClick={() => setReceipt(null)}>New payment</Button></div></SectionCard></div>;
  return (
    <div className="space-y-6">
      <PageHeader title="Collect Payment" subtitle="Accept offline payment and issue an audited receipt" />
      {loading ? <p className="rounded-xl border border-border bg-card p-4 text-[14px] text-muted-foreground">Loading dues...</p> : dues.length === 0 ? <EmptyState icon="CheckCircle2" title="No dues pending" description="All seeded demands are currently paid." /> : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <SectionCard title="Pending dues" bodyClassName="p-0"><ul className="divide-y divide-border">{dues.map((d) => <li key={d.id}><button onClick={() => setSelected(d)} className={cn("flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-muted", selected?.id === d.id && "bg-accent")}><span className="flex size-8 items-center justify-center rounded-full text-[12px] font-semibold text-white" style={{ backgroundColor: colorFor(d.studentName) }}>{initials(d.studentName)}</span><span className="min-w-0 flex-1"><span className="block font-medium">{d.studentName}</span><span className="block text-[12px] text-muted-foreground">{d.label} · Class {d.classCode ?? "-"}</span></span><span className="font-semibold">{fmt(d.amount)}</span></button></li>)}</ul></SectionCard>
          <SectionCard title="Payment"><div className="space-y-4"><div className="rounded-lg bg-muted/50 p-3 text-[14px]"><div className="flex justify-between"><span className="text-muted-foreground">Student</span><span className="font-medium">{selected?.studentName}</span></div><div className="mt-1 flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-semibold">{fmt(selected?.amount ?? 0)}</span></div></div><div className="grid grid-cols-2 gap-2">{METHODS.map((m) => <button key={m} onClick={() => setMethod(m)} className={cn("min-h-[44px] rounded-lg border text-[14px] font-medium", method === m ? "border-primary bg-accent" : "border-border")}>{m}</button>)}</div><Button size="lg" className="w-full" onClick={collect} disabled={!selected}><Icon name="HandCoins" className="size-4" /> Collect {fmt(selected?.amount ?? 0)}</Button></div></SectionCard>
        </div>
      )}
    </div>
  );
}

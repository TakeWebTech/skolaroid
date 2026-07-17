import { useState } from "react";
import { useNavigate } from "react-router";
import { PageHeader, SectionCard, StatusChip } from "../../components/shared/primitives";
import { Wizard, type WizardStep } from "../../components/shared/wizard";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Icon } from "../../components/shared/icon";
import { SCHOOL, CLASSES } from "../../lib/mock-data";
import { toast } from "sonner";

interface FeeHead { id: string; name: string; amount: number; frequency: string }

const DEFAULT_HEADS: FeeHead[] = [
  { id: "h1", name: "Tuition fee", amount: 24000, frequency: "Per term" },
  { id: "h2", name: "Transport", amount: 6000, frequency: "Per term" },
  { id: "h3", name: "Admission (one-time)", amount: 15000, frequency: "One-time" },
];

const INSTALLMENTS = [
  { id: "i1", label: "Term 1", due: "15 Apr", pct: 34 },
  { id: "i2", label: "Term 2", due: "15 Aug", pct: 33 },
  { id: "i3", label: "Term 3", due: "15 Nov", pct: 33 },
];

// Fee structure setup (spec §8 Finance — fee setup wizard).
export function FeeSetup() {
  const navigate = useNavigate();
  const [heads, setHeads] = useState(DEFAULT_HEADS);
  const [assigned, setAssigned] = useState<string[]>(["6A", "6B", "7A"]);

  function updateHead(id: string, patch: Partial<FeeHead>) {
    setHeads((h) => h.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }
  function toggleClass(c: string) {
    setAssigned((a) => (a.includes(c) ? a.filter((x) => x !== c) : [...a, c]));
  }

  const total = heads.reduce((s, h) => s + h.amount, 0);

  const steps: WizardStep[] = [
    {
      key: "plan",
      title: "Plan details",
      description: "Name the fee plan and set the academic year it applies to.",
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Plan name</Label><Input defaultValue="Standard fee plan 2026–27" /></div>
          <div className="space-y-1.5"><Label>Academic year</Label>
            <Select defaultValue={SCHOOL.year}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value={SCHOOL.year}>{SCHOOL.year}</SelectItem><SelectItem value="2027–28">2027–28</SelectItem></SelectContent></Select>
          </div>
        </div>
      ),
    },
    {
      key: "heads",
      title: "Fee heads",
      description: "Add the charges that make up this plan.",
      content: (
        <div className="space-y-3">
          {heads.map((h) => (
            <div key={h.id} className="grid gap-3 rounded-xl border border-border p-3 sm:grid-cols-[1fr_140px_150px_auto] sm:items-end">
              <div className="space-y-1.5"><Label>Head</Label><Input value={h.name} onChange={(e) => updateHead(h.id, { name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Amount ({SCHOOL.currency})</Label><Input type="number" value={h.amount} onChange={(e) => updateHead(h.id, { amount: Number(e.target.value) })} /></div>
              <div className="space-y-1.5"><Label>Frequency</Label>
                <Select value={h.frequency} onValueChange={(v) => updateHead(h.id, { frequency: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Per term">Per term</SelectItem><SelectItem value="Monthly">Monthly</SelectItem><SelectItem value="One-time">One-time</SelectItem></SelectContent></Select>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setHeads((list) => list.filter((x) => x.id !== h.id))} aria-label="Remove head"><Icon name="Trash2" className="size-4" /></Button>
            </div>
          ))}
          <Button variant="outline" onClick={() => setHeads((h) => [...h, { id: `h${Date.now()}`, name: "", amount: 0, frequency: "Per term" }])}>
            <Icon name="Plus" className="size-4" /> Add fee head
          </Button>
          <p className="text-[14px] text-muted-foreground">Annual total: <b className="text-foreground">{SCHOOL.currency}{total.toLocaleString("en-IN")}</b></p>
        </div>
      ),
    },
    {
      key: "installments",
      title: "Installments",
      description: "Split the total into payable installments with due dates.",
      content: (
        <ul className="space-y-2">
          {INSTALLMENTS.map((inst) => (
            <li key={inst.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary-subtle text-primary-subtle-foreground"><Icon name="CalendarClock" className="size-4" /></span>
              <div className="min-w-0 flex-1"><p className="font-medium">{inst.label}</p><p className="text-[13px] text-muted-foreground">Due {inst.due} · {inst.pct}% of total</p></div>
              <span className="font-medium">{SCHOOL.currency}{Math.round((total * inst.pct) / 100).toLocaleString("en-IN")}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: "assign",
      title: "Assign to classes",
      description: "Choose which classes this plan applies to.",
      content: (
        <div className="flex flex-wrap gap-2">
          {CLASSES.map((c) => {
            const on = assigned.includes(c);
            return (
              <button key={c} onClick={() => toggleClass(c)} className={`rounded-full border px-4 py-1.5 text-[14px] font-medium transition-colors ${on ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}>
                {on && <Icon name="Check" className="mr-1 inline size-3.5" />}Class {c}
              </button>
            );
          })}
        </div>
      ),
    },
    {
      key: "review",
      title: "Review",
      description: "Confirm the plan before publishing it for collection.",
      content: (
        <div className="space-y-3 text-[14px]">
          <Row label="Fee heads" value={`${heads.length} charges · ${SCHOOL.currency}${total.toLocaleString("en-IN")} / year`} />
          <Row label="Installments" value={`${INSTALLMENTS.length} terms`} />
          <Row label="Assigned classes" value={assigned.length ? assigned.map((c) => `Class ${c}`).join(", ") : "None selected"} />
          <div className="flex items-start gap-2 rounded-lg bg-warning-subtle p-3 text-warning-subtle-foreground">
            <Icon name="TriangleAlert" className="mt-0.5 size-4 shrink-0" />
            <span>Publishing generates fee demand for all students in the assigned classes. Existing paid installments are not affected.</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Fee setup" subtitle="Build a fee plan: heads, installments and class assignment" actions={<StatusChip tone="primary" label="Draft" icon="FilePenLine" />} />
      <SectionCard>
        <Wizard steps={steps} finishLabel="Publish plan" onFinish={() => { toast.success("Fee plan published"); navigate("/accountant/fees"); }} />
      </SectionCard>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

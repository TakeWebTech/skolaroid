import { PageHeader, SectionCard, StatusChip, ExperienceOnly } from "../../components/shared/primitives";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/shared/icon";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { toast } from "sonner";

const CURATED = [
  { id: "r1", title: "Daily attendance summary", desc: "Present vs enrolled, by class", icon: "CalendarCheck" },
  { id: "r2", title: "Fee collection report", desc: "Collected vs demand this term", icon: "Wallet" },
  { id: "r3", title: "High-absence classes", desc: "Classes below 85% attendance", icon: "TriangleAlert" },
  { id: "r4", title: "Exam performance", desc: "Averages by subject and class", icon: "Award" },
];

const TREND = [
  { m: "Apr", pct: 91 }, { m: "May", pct: 93 }, { m: "Jun", pct: 90 }, { m: "Jul", pct: 94 },
];

export function Reports({ title = "Reports & analytics" }: { title?: string }) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} subtitle="Plain-language summaries, with a table alternative for every chart" />

      <SectionCard title="Attendance trend" description="School-wide monthly average">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={TREND}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="m" tickLine={false} axisLine={false} />
            <YAxis domain={[80, 100]} width={32} tickLine={false} axisLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="pct" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
        <p className="mt-2 text-[13px] text-muted-foreground">Table: Apr 91%, May 93%, Jun 90%, Jul 94%. <b>Suggested action:</b> follow up with 2 classes trending below 85%.</p>
      </SectionCard>

      <SectionCard title="Curated reports" description="Ready-made — no setup needed">
        <div className="grid gap-3 sm:grid-cols-2">
          {CURATED.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-xl border border-border p-4">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon name={r.icon} className="size-5" /></span>
              <div className="min-w-0 flex-1"><p className="font-medium">{r.title}</p><p className="text-[13px] text-muted-foreground">{r.desc}</p></div>
              <Button size="sm" variant="ghost" onClick={() => toast.success(`Opening ${r.title}`)}>Open</Button>
            </div>
          ))}
        </div>
      </SectionCard>

      <ExperienceOnly min="advanced">
        <SectionCard title="Report builder" description="Advanced · only approved, permission-safe fields" action={<StatusChip tone="primary" label="Advanced" icon="Sparkles" />}>
          <div className="grid gap-3 sm:grid-cols-4">
            {["Dataset", "Fields", "Filters", "Grouping"].map((s, i) => (
              <div key={s} className="rounded-lg border border-border p-3"><p className="text-[12px] text-muted-foreground">Step {i + 1}</p><p className="font-medium">{s}</p></div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => toast("Preview generated")}><Icon name="Eye" className="size-4" /> Preview</Button>
            <Button variant="outline" onClick={() => toast.success("Saved view")}><Icon name="Save" className="size-4" /> Save</Button>
            <Button onClick={() => toast.success("Exported CSV")}><Icon name="Download" className="size-4" /> Export</Button>
          </div>
        </SectionCard>
      </ExperienceOnly>
    </div>
  );
}

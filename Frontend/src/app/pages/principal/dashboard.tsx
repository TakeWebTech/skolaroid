import { useNavigate } from "react-router";
import { PageHeader, SectionCard, StatusChip, StatCard, ExperienceOnly } from "../../components/shared/primitives";
import { Icon } from "../../components/shared/icon";
import { Button } from "../../components/ui/button";
import { PRINCIPAL_KPIS, APPROVALS } from "../../lib/mock-data";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const ATT_TREND = [
  { day: "Mon", pct: 92 }, { day: "Tue", pct: 94 }, { day: "Wed", pct: 91 }, { day: "Thu", pct: 95 }, { day: "Fri", pct: 94 },
];
const RISK_TONE = { high: "danger", medium: "warning", low: "info" } as const;

export function PrincipalDashboard() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <PageHeader title="School health" subtitle="Exceptions and approvals that need you" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRINCIPAL_KPIS.map((k) => (
          <StatCard key={k.id} label={k.label} value={k.value} delta={k.delta} tone={k.tone} definition={k.def} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard className="lg:col-span-1" title="Attention queue" description="Top exceptions first" bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {APPROVALS.map((a) => (
              <li key={a.id} className="flex items-start gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1"><p className="text-[14px] font-medium">{a.title}</p><p className="text-[12px] text-muted-foreground">{a.by} · {a.when}</p></div>
                <StatusChip tone={RISK_TONE[a.risk]} label={a.risk} />
              </li>
            ))}
          </ul>
          <div className="p-4"><Button className="w-full" variant="outline" onClick={() => navigate("/principal/approvals")}>Review all approvals</Button></div>
        </SectionCard>

        <SectionCard className="lg:col-span-2" title="Attendance this week" description="Present ÷ enrolled">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ATT_TREND}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis domain={[80, 100]} tickLine={false} axisLine={false} width={32} />
              <Tooltip />
              <Bar dataKey="pct" radius={[6, 6, 0, 0]} fill="var(--primary)" />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-2 text-[13px] text-muted-foreground">Table alternative: Mon 92%, Tue 94%, Wed 91%, Thu 95%, Fri 94%.</p>
        </SectionCard>
      </div>

      <ExperienceOnly min="standard">
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Academics" description="Drill down by class or term">
            <ul className="space-y-2 text-[14px]">
              {[["Class 10 board readiness", "On track", "success"], ["Class 8 avg score", "Down 4% vs Term 1", "warning"], ["Syllabus coverage", "78% overall", "info"]].map(([l, v, t]) => (
                <li key={l} className="flex items-center justify-between rounded-lg border border-border px-3 py-2"><span>{l}</span><StatusChip tone={t as never} label={v} /></li>
              ))}
            </ul>
          </SectionCard>
          <SectionCard title="Finance" description="Collection vs demand">
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard label="Collected (MTD)" value="₹42.6L" tone="success" />
              <StatCard label="Outstanding" value="₹12.4L" tone="warning" />
            </div>
          </SectionCard>
        </div>
      </ExperienceOnly>
    </div>
  );
}

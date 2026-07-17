import { PageHeader, SectionCard, StatusChip } from "../../components/shared/primitives";
import { TIMETABLE } from "../../lib/mock-data";
import { Icon } from "../../components/shared/icon";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function TimetablePage({ title = "Timetable" }: { title?: string }) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} subtitle="Class 8A · Week of 13 July" />

      {/* Agenda (mobile-first default) */}
      <SectionCard title="Today's agenda" description="Wednesday, 15 July" bodyClassName="p-0">
        <ul className="divide-y divide-border">
          {TIMETABLE.map((t) => (
            <li key={t.period} className="flex items-center gap-4 px-5 py-3">
              <div className="w-24 shrink-0"><p className="text-[13px] font-medium">{t.time}</p><p className="text-[12px] text-muted-foreground">Period {t.period}</p></div>
              <div className="min-w-0 flex-1"><p className="font-medium">{t.subject}</p><p className="text-[13px] text-muted-foreground">{t.teacher} · {t.room}</p></div>
              {t.subject === "Mathematics" && <StatusChip tone="primary" label="Now" icon="Clock" />}
            </li>
          ))}
          {TIMETABLE.length === 0 && <li className="px-5 py-4 text-[14px] text-muted-foreground">No timetable created yet.</li>}
        </ul>
      </SectionCard>

      {/* Week grid (desktop) */}
      <SectionCard title="Week view" description="Colour is paired with labels — never colour alone">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead><tr className="text-left text-muted-foreground"><th className="p-2">Period</th>{DAYS.map((d) => <th key={d} className="p-2">{d}</th>)}</tr></thead>
            <tbody>
              {TIMETABLE.map((t) => (
                <tr key={t.period} className="border-t border-border">
                  <td className="p-2 text-muted-foreground">{t.time}</td>
                  {DAYS.map((d) => (
                    <td key={d} className="p-2">
                      <div className="rounded-lg border border-border bg-muted/40 px-2 py-1.5"><p className="font-medium">{t.subject}</p><p className="text-[11px] text-muted-foreground">{t.room}</p></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 flex items-center gap-1 text-[12px] text-muted-foreground"><Icon name="Info" className="size-3.5" /> No conflicts detected for this week.</p>
      </SectionCard>
    </div>
  );
}

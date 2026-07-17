import { PageHeader, SectionCard, StatCard, StatusChip } from "../../components/shared/primitives";

const MONTH = Array.from({ length: 30 }).map((_, i) => {
  const day = i + 1;
  const status = [5, 12, 19].includes(day) ? "absent" : day === 8 ? "late" : day % 7 === 0 || day % 7 === 6 ? "holiday" : "present";
  return { day, status };
});
const CELL: Record<string, string> = {
  present: "bg-success-subtle text-success-subtle-foreground",
  absent: "bg-danger-subtle text-danger-subtle-foreground",
  late: "bg-warning-subtle text-warning-subtle-foreground",
  holiday: "bg-muted text-muted-foreground",
};

export function AttendanceOverview({ title = "Attendance" }: { title?: string }) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} subtitle="Aarav Sharma · July 2026" />
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="This month" value="94%" tone="success" icon="CalendarCheck" />
        <StatCard label="Present" value="24 days" tone="primary" />
        <StatCard label="Absent" value="3 days" tone="danger" />
        <StatCard label="Late" value="1 day" tone="warning" />
      </div>
      <SectionCard title="July 2026" description="Colour is paired with a label in the legend below">
        <div className="grid grid-cols-7 gap-2">
          {MONTH.map((d) => (
            <div key={d.day} className={`flex aspect-square flex-col items-center justify-center rounded-lg text-[13px] ${CELL[d.status]}`}>
              <span className="font-medium">{d.day}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusChip tone="success" label="Present" />
          <StatusChip tone="danger" label="Absent" />
          <StatusChip tone="warning" label="Late" />
          <StatusChip tone="muted" label="Holiday / weekend" />
        </div>
      </SectionCard>
    </div>
  );
}

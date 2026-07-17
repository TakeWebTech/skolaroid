import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PageHeader, QuickAction, SectionCard, StatusChip, StatCard, ExperienceOnly } from "../../components/shared/primitives";
import { Icon } from "../../components/shared/icon";
import { Button } from "../../components/ui/button";
import { TEACHER_TODAY_CLASSES, PENDING_GRADING } from "../../lib/mock-data";
import { useApp } from "../../store/app-context";
import { useT } from "../../lib/i18n";
import { AnnouncementFeedItem, listAnnouncements } from "../../lib/communication-api";
import { toast } from "sonner";

export function TeacherDashboard() {
  const navigate = useNavigate();
  const { experience } = useApp();
  const t = useT();
  const nextClass = TEACHER_TODAY_CLASSES.find((c) => !c.attendanceTaken);
  const [announcements, setAnnouncements] = useState<AnnouncementFeedItem[]>([]);

  useEffect(() => {
    listAnnouncements()
      .then(setAnnouncements)
      .catch((error: Error) => toast.error(error.message));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${t("Good morning")}, Ravi`}
        subtitle="Wednesday, 15 July · 4 classes today"
        actions={
          <ExperienceOnly min="advanced">
            <Button variant="outline"><Icon name="LayoutGrid" className="size-4" /> Customise widgets</Button>
          </ExperienceOnly>
        }
      />

      {/* Three large quick actions — beginner-first (spec §7.1) */}
      <div className="grid gap-3 sm:grid-cols-3">
        <QuickAction icon="CalendarCheck" label={t("Take Attendance")} hint={nextClass ? `${nextClass.className} · ${nextClass.time}` : "All done today"} onClick={() => navigate("/teacher/attendance")} />
        <QuickAction icon="ClipboardPlus" label={t("Assign Homework")} hint="Use a template" tone="info" onClick={() => navigate("/teacher/assessments/new")} />
        <QuickAction icon="PenLine" label={t("Enter Marks")} hint="Unit Test 2" tone="success" onClick={() => navigate("/teacher/assessments/marks")} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's classes */}
        <SectionCard
          className="lg:col-span-2"
          title={t("Today's classes")}
          description="Each card leads to an action"
          action={<Button variant="ghost" size="sm" onClick={() => navigate("/teacher/classes")}>{t("View all")} <Icon name="ChevronRight" className="size-4" /></Button>}
          bodyClassName="p-0"
        >
          <ul className="divide-y divide-border">
            {TEACHER_TODAY_CLASSES.map((c) => (
              <li key={c.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-14 shrink-0 text-center">
                  <p className="font-semibold">{c.time}</p>
                  <p className="text-[12px] text-muted-foreground">{c.room}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">Class {c.className} · {c.subject}</p>
                  <p className="text-[13px] text-muted-foreground">{c.students} students</p>
                </div>
                {c.attendanceTaken ? (
                  <StatusChip tone="success" label={t("Attendance done")} icon="Check" />
                ) : (
                  <Button size="sm" onClick={() => navigate("/teacher/attendance")}>{t("Take attendance")}</Button>
                )}
              </li>
            ))}
            {TEACHER_TODAY_CLASSES.length === 0 && <li className="px-5 py-4 text-[14px] text-muted-foreground">No classes created yet.</li>}
          </ul>
        </SectionCard>

        {/* Announcements */}
        <SectionCard title={t("Announcements")} bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {announcements.map((a) => (
              <li key={a.id} className="px-5 py-3.5">
                <p className="text-[14px] font-medium">{a.title}</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">{a.by} · {new Date(a.sentAt).toLocaleDateString()}</p>
              </li>
            ))}
            {announcements.length === 0 && <li className="px-5 py-4 text-[14px] text-muted-foreground">No announcements yet.</li>}
          </ul>
        </SectionCard>
      </div>

      {/* Standard: pending grading + weekly summary */}
      <ExperienceOnly min="standard">
        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard className="lg:col-span-2" title={t("Pending grading")} description="Return work before it piles up" bodyClassName="p-0">
            <ul className="divide-y divide-border">
              {PENDING_GRADING.map((g) => (
                <li key={g.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{g.title}</p>
                    <p className="text-[13px] text-muted-foreground">Class {g.className} · {g.submitted}/{g.total} submitted · due {g.due}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => navigate("/teacher/assessments/grade")}>{t("Grade")}</Button>
                </li>
              ))}
              {PENDING_GRADING.length === 0 && <li className="px-5 py-4 text-[14px] text-muted-foreground">No grading queue yet.</li>}
            </ul>
          </SectionCard>
          <div className="space-y-4">
            <StatCard label="Attendance taken" value="1 / 4" delta="3 classes remaining" tone="warning" icon="CalendarCheck" />
            <StatCard label="Homework to grade" value="79" delta="Across 3 classes" tone="info" icon="ClipboardList" />
          </div>
        </div>
      </ExperienceOnly>

      {/* Advanced: workload analytics */}
      <ExperienceOnly min="advanced">
        <SectionCard title="Workload analytics" description="This week vs. your average">
          <div className="grid gap-4 sm:grid-cols-4">
            <StatCard label="Teaching hours" value="22h" delta="+2h vs avg" tone="primary" />
            <StatCard label="Grading turnaround" value="1.8d" delta="Target 2d" tone="success" />
            <StatCard label="Avg attendance" value="93%" delta="Across classes" tone="success" />
            <StatCard label="Messages sent" value="14" delta="This week" tone="info" />
          </div>
        </SectionCard>
      </ExperienceOnly>

      {experience === "beginner" && (
        <p className="rounded-lg bg-info-subtle px-4 py-3 text-[13px] text-info-subtle-foreground">
          <Icon name="Info" className="mr-1 inline size-4 align-text-bottom" />
          Tip: start with <b>Take Attendance</b> for your next class. Switch to Standard mode (top-right) when you want shortcuts and grading queues.
        </p>
      )}
    </div>
  );
}

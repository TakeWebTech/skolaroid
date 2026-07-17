import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PageHeader, QuickAction, SectionCard, StatusChip, StatCard, ExperienceOnly } from "../../components/shared/primitives";
import { Icon } from "../../components/shared/icon";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { STUDENT_TASKS, TIMETABLE } from "../../lib/mock-data";
import { useT } from "../../lib/i18n";
import { AnnouncementFeedItem, listAnnouncements } from "../../lib/communication-api";
import { toast } from "sonner";

const TONE = { due: "warning", upcoming: "info", overdue: "danger" } as const;

export function StudentDashboard() {
  const navigate = useNavigate();
  const t = useT();
  const next = TIMETABLE[2];
  const [announcements, setAnnouncements] = useState<AnnouncementFeedItem[]>([]);

  useEffect(() => {
    listAnnouncements()
      .then(setAnnouncements)
      .catch((error: Error) => toast.error(error.message));
  }, []);
  return (
    <div className="space-y-6">
      <PageHeader title="Hi Aarav 👋" subtitle="Here's what to learn next" />

      <div className="grid gap-3 sm:grid-cols-2">
        <QuickAction icon="PlayCircle" label={t("Continue Learning")} hint="Fractions & Decimals · 60% done" onClick={() => navigate("/student/learn")} />
        <QuickAction icon="ClipboardList" label={t("View Tasks")} hint={`${STUDENT_TASKS.length} tasks`} tone="warning" onClick={() => navigate("/student/tasks")} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title={t("Due tasks")} bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {STUDENT_TASKS.map((task) => (
              <li key={task.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="min-w-0 flex-1"><p className="font-medium">{task.title}</p><p className="text-[13px] text-muted-foreground">{task.subject} · {task.due}</p></div>
                <StatusChip tone={TONE[task.status]} label={task.status === "overdue" ? t("Overdue") : task.status === "due" ? t("Due") : t("Upcoming")} />
                <Button size="sm" variant="outline" onClick={() => navigate("/student/tasks")}>{t("Open")}</Button>
              </li>
            ))}
            {STUDENT_TASKS.length === 0 && <li className="px-5 py-4 text-[14px] text-muted-foreground">No tasks assigned yet.</li>}
          </ul>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title={t("Next class")}>
            {next ? (
              <>
                <p className="text-[15px] font-medium">{next.subject}</p>
                <p className="text-[13px] text-muted-foreground">{next.time} · {next.room} · {next.teacher}</p>
              </>
            ) : <p className="text-[14px] text-muted-foreground">No timetable created yet.</p>}
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => navigate("/student/timetable")}>See full timetable</Button>
          </SectionCard>
          <SectionCard title={t("Announcements")} bodyClassName="p-0">
            <ul className="divide-y divide-border">
              {announcements.slice(0, 2).map((a) => (
                <li key={a.id} className="px-5 py-3"><p className="text-[14px] font-medium">{a.title}</p><p className="text-[12px] text-muted-foreground">{new Date(a.sentAt).toLocaleDateString()}</p></li>
              ))}
              {announcements.length === 0 && <li className="px-5 py-4 text-[14px] text-muted-foreground">No announcements yet.</li>}
            </ul>
          </SectionCard>
        </div>
      </div>

      <ExperienceOnly min="standard">
        <SectionCard title="Course progress" description="Keep going — you're doing great">
          <div className="space-y-4">
            {[{ s: "Mathematics", p: 60 }, { s: "Science", p: 45 }, { s: "English", p: 78 }].map((c) => (
              <div key={c.s}>
                <div className="mb-1 flex items-center justify-between text-[14px]"><span>{c.s}</span><span className="text-muted-foreground">{c.p}%</span></div>
                <Progress value={c.p} />
              </div>
            ))}
          </div>
        </SectionCard>
      </ExperienceOnly>

      <ExperienceOnly min="advanced">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Mastery score" value="82%" delta="+4% this month" tone="success" icon="Target" />
          <StatCard label="Study streak" value="12 days" tone="primary" icon="Flame" />
          <StatCard label="On-time submissions" value="94%" tone="info" icon="CheckCircle2" />
        </div>
      </ExperienceOnly>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PageHeader, QuickAction, SectionCard, StatusChip, StatCard, ExperienceOnly } from "../../components/shared/primitives";
import { Icon } from "../../components/shared/icon";
import { Button } from "../../components/ui/button";
import { CHILDREN } from "../../lib/mock-data";
import { useApp } from "../../store/app-context";
import { useT } from "../../lib/i18n";
import { cn } from "../../components/ui/utils";
import { AnnouncementFeedItem, listAnnouncements } from "../../lib/communication-api";
import { toast } from "sonner";

const ALERTS = [
  { id: "al1", title: "Term 2 fees due 15 Aug — ₹30,000", tone: "warning" as const, icon: "Wallet" },
  { id: "al2", title: "Aarav was late twice this week", tone: "info" as const, icon: "Clock" },
];

export function ParentDashboard() {
  const navigate = useNavigate();
  const { activeChild, setActiveChild } = useApp();
  const t = useT();
  const [announcements, setAnnouncements] = useState<AnnouncementFeedItem[]>([]);

  useEffect(() => {
    listAnnouncements()
      .then(setAnnouncements)
      .catch((error: Error) => toast.error(error.message));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title={t("Welcome back")} subtitle={t("Your family's important updates")} />

      {/* Child switcher — mobile-first (spec §7.3) */}
      <div className="flex gap-2 overflow-x-auto">
        {CHILDREN.map((c) => (
          <button key={c.id} onClick={() => setActiveChild(c.id)} className={cn("flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left", activeChild === c.id ? "border-primary bg-accent" : "border-border bg-card")}>
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">{c.name[0]}</span>
            <span><span className="block font-medium">{c.name}</span><span className="block text-[12px] text-muted-foreground">Class {c.className} · Roll {c.roll}</span></span>
          </button>
        ))}
        {CHILDREN.length === 0 && <p className="text-[14px] text-muted-foreground">No children linked yet.</p>}
      </div>

      {/* Urgent child alerts (kept separate from school notices) */}
      <SectionCard title={t("Needs your attention")} bodyClassName="p-0">
        <ul className="divide-y divide-border">
          {ALERTS.map((a) => (
            <li key={a.id} className="flex items-center gap-3 px-5 py-3.5">
              <span className={cn("flex size-9 items-center justify-center rounded-lg", a.tone === "warning" ? "bg-warning-subtle text-warning-subtle-foreground" : "bg-info-subtle text-info-subtle-foreground")}><Icon name={a.icon} className="size-4" /></span>
              <p className="flex-1 text-[14px] font-medium">{a.title}</p>
              <Button size="sm" variant="outline" onClick={() => navigate("/parent/fees")}>{t("View")}</Button>
            </li>
          ))}
        </ul>
      </SectionCard>

      <div className="grid gap-3 sm:grid-cols-3">
        <QuickAction icon="Wallet" label={t("Pay Fees")} hint="₹30,000 due" tone="warning" onClick={() => navigate("/parent/fees")} />
        <QuickAction icon="CalendarPlus" label={t("Apply Leave")} hint="For sick or travel days" tone="info" onClick={() => navigate("/parent/leave")} />
        <QuickAction icon="Phone" label={t("Contact School")} hint="Message class teacher" tone="success" onClick={() => navigate("/parent/messages")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label={t("Attendance")} value="94%" delta="This term" tone="success" icon="CalendarCheck" />
        <StatCard label={t("Fees due")} value="₹30,000" delta="By 15 Aug" tone="warning" icon="Wallet" />
        <StatCard label={t("Open tasks")} value="3" delta="1 due today" tone="info" icon="ClipboardList" />
      </div>

      <SectionCard title={t("School notices")} bodyClassName="p-0">
        <ul className="divide-y divide-border">
          {announcements.map((a) => (
            <li key={a.id} className="px-5 py-3.5"><p className="text-[14px] font-medium">{a.title}</p><p className="text-[12px] text-muted-foreground">{a.by} · {new Date(a.sentAt).toLocaleDateString()}</p></li>
          ))}
          {announcements.length === 0 && <li className="px-5 py-4 text-[14px] text-muted-foreground">No announcements yet.</li>}
        </ul>
      </SectionCard>

      <ExperienceOnly min="advanced">
        <SectionCard title="Family summary" description="Across all children">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Combined dues" value="₹42,000" tone="warning" />
            <StatCard label="Avg attendance" value="93%" tone="success" />
            <StatCard label="Statements" value="View" tone="primary" icon="FileText" />
          </div>
        </SectionCard>
      </ExperienceOnly>
    </div>
  );
}

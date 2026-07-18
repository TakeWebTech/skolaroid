import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../store/app-context";
import type { RoleId, StatusTone } from "../../lib/types";
import { Icon } from "../shared/icon";
import { StatusChip } from "../shared/primitives";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { toast } from "sonner";

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  to: string;
  keywords: string[];
  icon: string;
};

type NotificationItem = {
  id: string;
  title: string;
  when: string;
  tone: StatusTone;
  action: boolean;
  to?: string;
};

const SEARCH_BY_ROLE: Record<RoleId, SearchItem[]> = {
  platform: [
    { id: "platform-support", title: "Support cases", subtitle: "Open school cases and platform messages", to: "/platform/support", keywords: ["support", "case", "principal", "message"], icon: "LifeBuoy" },
    { id: "platform-schools", title: "Schools", subtitle: "Tenant directory and organization IDs", to: "/platform/schools", keywords: ["school", "organization", "organisation", "tenant"], icon: "Building2" },
    { id: "platform-st-xavier", title: "St. Xavier High", subtitle: "ORG-SX-002 · Trial expiring", to: "/platform/schools", keywords: ["xavier", "org-sx-002", "trial"], icon: "Building2" },
    { id: "platform-plans", title: "Plans & entitlements", subtitle: "Plans, feature flags, subscriptions", to: "/platform/plans", keywords: ["plan", "plans", "subscription", "entitlement"], icon: "Package" },
    { id: "platform-plugins", title: "Plugin marketplace", subtitle: "Marketplace, installed plugins and plugin actions", to: "/platform/plugins", keywords: ["plugin", "plugins", "marketplace", "strapi", "erpnext", "integration", "installed"], icon: "Plug" },
    { id: "platform-domains", title: "Domains", subtitle: "Tenant domains, SSL and DNS health", to: "/platform/operations", keywords: ["domain", "website", "ssl", "dns"], icon: "Globe" },
    { id: "platform-audit", title: "Audit log", subtitle: "Platform settings and access audit", to: "/platform/settings", keywords: ["audit", "setting", "settings", "permission", "technical support"], icon: "ScrollText" },
  ],
  principal: [
    { id: "principal-students", title: "Student directory", subtitle: "Find students by name, class, guardian", to: "/principal/students", keywords: ["student", "aarav", "ananya", "class"], icon: "Users" },
    { id: "principal-exams", title: "Exams & results", subtitle: "Review marks and publish results", to: "/exams", keywords: ["exam", "exams", "marks", "result", "results", "publish"], icon: "FileText" },
    { id: "principal-staff", title: "Staff", subtitle: "Teachers, substitutions and staff attendance", to: "/principal/staff", keywords: ["teacher", "staff", "ravi", "substitution"], icon: "UserRoundCog" },
    { id: "principal-approvals", title: "Approvals", subtitle: "Results, concessions, leave and messages", to: "/principal/approvals", keywords: ["approval", "approve", "result", "leave"], icon: "CheckCircle2" },
    { id: "principal-settings", title: "Settings", subtitle: "School configuration", to: "/admin/settings", keywords: ["setting", "settings", "role", "user"], icon: "Settings" },
  ],
  teacher: [
    { id: "teacher-attendance", title: "Class 7B attendance", subtitle: "Mark or submit today's attendance", to: "/teacher/attendance", keywords: ["attendance", "class 7b", "mark"], icon: "CalendarCheck" },
    { id: "teacher-classes", title: "My classes", subtitle: "Timetable, roster and class work", to: "/teacher/classes", keywords: ["class", "classes", "roster"], icon: "Users" },
    { id: "teacher-assessments", title: "Assessments", subtitle: "Assignments, marks and grading", to: "/teacher/assessments", keywords: ["homework", "assignment", "marks", "grade"], icon: "ClipboardList" },
  ],
  student: [
    { id: "student-homework", title: "Homework", subtitle: "Due and upcoming tasks", to: "/student/tasks", keywords: ["homework", "task", "assignment"], icon: "ClipboardList" },
    { id: "student-results", title: "Results", subtitle: "Term report card", to: "/student/results", keywords: ["result", "marks", "grade"], icon: "Award" },
    { id: "student-timetable", title: "Timetable", subtitle: "Today's classes", to: "/student/timetable", keywords: ["class", "timetable", "schedule"], icon: "CalendarDays" },
  ],
  parent: [
    { id: "parent-fees", title: "Fees", subtitle: "Dues, receipts and payment status", to: "/parent/fees", keywords: ["fee", "payment", "receipt"], icon: "Wallet" },
    { id: "parent-attendance", title: "Attendance", subtitle: "Child attendance summary", to: "/parent/attendance", keywords: ["attendance", "absent"], icon: "CalendarCheck" },
    { id: "parent-results", title: "Results", subtitle: "Report card", to: "/parent/results", keywords: ["result", "marks", "grade"], icon: "Award" },
  ],
  admin: [
    { id: "admin-people", title: "People", subtitle: "Students, guardians and staff", to: "/admin/people", keywords: ["student", "teacher", "user", "people"], icon: "Users" },
    { id: "admin-users", title: "Users & roles", subtitle: "School permissions and accounts", to: "/admin/users", keywords: ["role", "permission", "user"], icon: "UserCog" },
    { id: "admin-academics", title: "Academic setup", subtitle: "Classes, sections and subjects", to: "/admin/academics", keywords: ["class", "subject", "academic"], icon: "BookOpen" },
    { id: "admin-exams", title: "Exams", subtitle: "Create exams and track marks entry", to: "/exams", keywords: ["exam", "exams", "marks", "result", "results"], icon: "FileText" },
  ],
  accountant: [
    { id: "accountant-payments", title: "Collect payment", subtitle: "Record fee payment", to: "/accountant/payments", keywords: ["collect", "payment", "fee"], icon: "HandCoins" },
    { id: "accountant-dues", title: "Outstanding dues", subtitle: "Fee follow-up list", to: "/accountant/fees", keywords: ["due", "dues", "outstanding"], icon: "Wallet" },
    { id: "accountant-recon", title: "Reconciliation", subtitle: "Unmatched bank payments", to: "/accountant/reconciliation", keywords: ["reconcile", "bank", "unmatched"], icon: "RefreshCw" },
  ],
};

const NOTIFICATIONS_BY_ROLE: Record<RoleId, NotificationItem[]> = {
  platform: [
    { id: "p1", title: "Principal raised support case: website down", when: "5m ago", tone: "danger", action: true, to: "/platform/support" },
    { id: "p2", title: "St. Xavier trial expires in 13 days", when: "28m ago", tone: "warning", action: true, to: "/platform/schools" },
    { id: "p3", title: "School custom domain SSL renewed", when: "2h ago", tone: "success", action: false, to: "/platform/operations" },
    { id: "p4", title: "Technical Support role changed by platform admin", when: "1d ago", tone: "info", action: false, to: "/platform/settings" },
  ],
  teacher: [
    { id: "t1", title: "Class 7B starts at 09:30 in R-201", when: "Now", tone: "warning", action: true, to: "/teacher/attendance" },
    { id: "t2", title: "31 Class 7B students available in roster", when: "Login check", tone: "info", action: false, to: "/teacher/classes" },
    { id: "t3", title: "Algebra Worksheet 4 has 30 submissions", when: "1h ago", tone: "primary", action: true, to: "/teacher/assessments/grade" },
  ],
  student: [
    { id: "s1", title: "Algebra Worksheet 4 is due today", when: "Login check", tone: "warning", action: true, to: "/student/tasks" },
    { id: "s2", title: "Science reading is due tomorrow", when: "2h ago", tone: "info", action: false, to: "/student/tasks" },
  ],
  parent: [
    { id: "pa1", title: "Term 2 tuition is due 15 Aug", when: "Login check", tone: "warning", action: true, to: "/parent/fees" },
    { id: "pa2", title: "PTM scheduled for 24 July", when: "1d ago", tone: "info", action: false, to: "/parent/messages" },
  ],
  principal: [
    { id: "pr1", title: "Result publication needs approval", when: "35m ago", tone: "danger", action: true, to: "/principal/approvals" },
    { id: "pr2", title: "4 staff on leave today", when: "Login check", tone: "warning", action: true, to: "/principal/staff" },
  ],
  admin: [
    { id: "a1", title: "2 new staff accounts await role assignment", when: "45m ago", tone: "warning", action: true, to: "/admin/users" },
    { id: "a2", title: "Timetable setup changed for Class 8A", when: "2h ago", tone: "info", action: false, to: "/admin/academics" },
  ],
  accountant: [
    { id: "ac1", title: "6 bank payments need reconciliation", when: "Login check", tone: "danger", action: true, to: "/accountant/reconciliation" },
    { id: "ac2", title: "38 receipts issued today", when: "1h ago", tone: "success", action: false, to: "/accountant/reports" },
  ],
};

export function GlobalSearch() {
  const { role } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const results = SEARCH_BY_ROLE[role].filter((item) => {
    const haystack = [item.title, item.subtitle, ...item.keywords].join(" ").toLowerCase();
    return !query.trim() || haystack.includes(query.trim().toLowerCase());
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[13px] text-muted-foreground hover:bg-accent md:w-64">
          <Icon name="Search" className="size-4" />
          <span className="hidden md:inline">Search people, pages, classes…</span>
        </button>
      </SheetTrigger>
      <SheetContent side="top" className="mx-auto max-w-2xl rounded-b-xl">
        <SheetHeader>
          <SheetTitle>Search</SheetTitle>
          <SheetDescription>{role === "platform" ? "Search tenants, cases, plans, domains, settings, and organization IDs." : "Results respect your role and current school."}</SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <Input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={role === "platform" ? "Search support, organization ID, school name, plans..." : "Type a name, class, page, or action..."} />
          <p className="mt-3 text-[12px] font-medium uppercase tracking-wide text-muted-foreground">Recent</p>
          <ul className="mt-2 space-y-1">
            {results.map((result) => (
              <li key={result.id}>
                <button
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-[14px] hover:bg-accent"
                  onClick={() => navigate(result.to)}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon name={result.icon} className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium">{result.title}</span>
                    <span className="block truncate text-[12px] text-muted-foreground">{result.subtitle}</span>
                  </span>
                  <Icon name="CornerDownLeft" className="ml-auto size-4 text-muted-foreground" />
                </button>
              </li>
            ))}
            {results.length === 0 && <li className="rounded-lg border border-dashed border-border p-4 text-[14px] text-muted-foreground">No matching result for this role.</li>}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function NotificationsButton() {
  const { role } = useApp();
  const [read, setRead] = useState<string[]>([]);
  const items = NOTIFICATIONS_BY_ROLE[role].filter((item) => !read.includes(item.id));
  const actionCount = items.filter((n) => n.action).length;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative flex size-9 items-center justify-center rounded-lg border border-border bg-card hover:bg-accent" aria-label="Notifications">
          <Icon name="Bell" className="size-4" />
          {actionCount > 0 && (
            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
              {actionCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>Actionable updates for your role.</SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="all" className="px-4">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="action" className="flex-1">Action required</TabsTrigger>
          </TabsList>
          <TabsContent value="all"><NotificationList items={items} onRead={(id) => setRead((current) => [...current, id])} /></TabsContent>
          <TabsContent value="action"><NotificationList items={items.filter((n) => n.action)} onRead={(id) => setRead((current) => [...current, id])} /></TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function NotificationList({ items, onRead }: { items: NotificationItem[]; onRead: (id: string) => void }) {
  const navigate = useNavigate();

  return (
    <ul className="mt-3 space-y-2">
      {items.length === 0 && <li className="rounded-xl border border-dashed border-border p-4 text-[14px] text-muted-foreground">No unread notifications.</li>}
      {items.map((n) => (
        <li key={n.id} className="rounded-xl border border-border bg-card p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[14px]">{n.title}</p>
              <p className="mt-1 text-[12px] text-muted-foreground">{n.when}</p>
            </div>
            <StatusChip tone={n.tone} label={n.action ? "Action" : "Info"} />
          </div>
          {n.action && (
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={() => n.to && navigate(n.to)}>Open</Button>
              <Button size="sm" variant="ghost" onClick={() => onRead(n.id)}>Mark read</Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export function HelpButton() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex size-9 items-center justify-center rounded-lg border border-border bg-card hover:bg-accent" aria-label="Help">
          <Icon name="CircleHelp" className="size-4" />
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Help & guidance</SheetTitle>
          <SheetDescription>Short steps for the current screen — without leaving your task.</SheetDescription>
        </SheetHeader>
        <div className="space-y-3 p-4 text-[14px]">
          {[
            { q: "Take attendance in under a minute", a: "Open a class, tap Mark All Present, then set only the exceptions and Save." },
            { q: "Fix a mistake after saving", a: "Reopen the record — you'll be asked for a short correction reason so history stays accurate." },
            { q: "Change how much detail you see", a: "Use the Experience switcher (top-right). It never changes your permissions." },
          ].map((h) => (
            <details key={h.q} className="rounded-lg border border-border p-3">
              <summary className="cursor-pointer font-medium">{h.q}</summary>
              <p className="mt-2 text-muted-foreground">{h.a}</p>
            </details>
          ))}
          <Button variant="outline" className="w-full" onClick={() => { toast.success("Support request created with page context"); setOpen(false); }}>
            <Icon name="LifeBuoy" className="size-4" /> Contact support
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

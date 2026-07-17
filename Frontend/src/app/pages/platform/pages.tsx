import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { EmptyState, PageHeader, QuickAction, SectionCard, StatCard, StatusChip } from "../../components/shared/primitives";
import { DataTable, type Column } from "../../components/shared/data-table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../components/ui/input-otp";
import { Icon } from "../../components/shared/icon";
import { TENANTS } from "../../lib/mock-data";
import { changePlatformTenantUserRole, createPlatformPlan, createPlatformTenant, getPlatformTenantProfile, listPlatformPlans, listPlatformTenants, PlatformPlanRow, PlatformTenantProfile, PlatformTenantRow, requestPlatformTenantEditOtp, resetPlatformTenantUserPassword, updatePlatformTenantProfile, verifyPlatformTenantEditOtp, suggestOrganizationId } from "../../lib/platform-api";
import { toast } from "sonner";

const HEALTH = { good: "success", watch: "warning", risk: "danger" } as const;
type Tenant = typeof TENANTS[number];

const SUPPORT_CASES = [
  { id: "CASE-1042", school: "Provisioned school", raisedBy: "Principal", subject: "School website is down", priority: "High", status: "Waiting on platform", updated: "5m ago" },
  { id: "CASE-1038", school: "St. Xavier High", raisedBy: "School Admin", subject: "Unable to publish fee receipts", priority: "Medium", status: "In progress", updated: "42m ago" },
  { id: "CASE-1029", school: "Little Scholars", raisedBy: "Principal", subject: "Trial upgrade and billing question", priority: "Low", status: "Awaiting school", updated: "1d ago" },
];

const PLATFORM_ROLES = [
  { role: "Platform Admin", permissions: "All tenant, billing, support, roles, audit" },
  { role: "Technical Support", permissions: "Read tenant diagnostics, respond to support, inspect domains" },
  { role: "Billing Ops", permissions: "Plans, subscriptions, invoices, payment status" },
  { role: "Implementation Manager", permissions: "Create onboarding checklist, view school setup progress" },
];

export function PlatformDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform overview"
        subtitle="Tenant operations, support pressure, billing risk, and platform health."
        actions={<Button onClick={() => navigate("/platform/schools")}><Icon name="Plus" className="size-4" /> Create school</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active schools" value="128" delta="+4 this month" tone="primary" icon="Building2" />
        <StatCard label="Trials expiring" value="6" delta="Within 14 days" tone="warning" icon="Clock" />
        <StatCard label="Open incidents" value="2" delta="1 high severity" tone="danger" icon="TriangleAlert" />
        <StatCard label="Support cases" value="14" delta="3 awaiting reply" tone="info" icon="LifeBuoy" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <QuickAction icon="Building2" label="Schools" hint="Tenants, org IDs, plans and health" onClick={() => navigate("/platform/schools")} />
        <QuickAction icon="LifeBuoy" label="Support queue" hint="Principal and admin cases" tone="info" onClick={() => navigate("/platform/support")} />
        <QuickAction icon="Activity" label="Operations" hint="Health, incidents and domains" tone="success" onClick={() => navigate("/platform/operations")} />
      </div>

      <SectionCard title="Attention needed" description="Platform-only queue, not school dashboard content.">
        <div className="space-y-3">
          {SUPPORT_CASES.slice(0, 2).map((item) => (
            <button key={item.id} onClick={() => navigate("/platform/support")} className="flex w-full items-center justify-between gap-3 rounded-lg border border-border p-3 text-left hover:bg-accent">
              <div>
                <p className="font-medium">{item.subject}</p>
                <p className="text-[13px] text-muted-foreground">{item.id} · {item.school} · {item.raisedBy}</p>
              </div>
              <StatusChip tone={item.priority === "High" ? "danger" : "warning"} label={item.priority} />
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export function PlatformSchools() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<PlatformTenantRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    listPlatformTenants().then(setRows).catch((error: Error) => toast.error(error.message)).finally(() => setLoading(false));
  }, []);
  const columns: Column<PlatformTenantRow>[] = [
    { key: "name", header: "School", sticky: true, render: (t) => <div><p className="font-medium">{t.name}</p><p className="text-[12px] text-muted-foreground">{orgIdFor(t)} · {t.students.toLocaleString()} students</p></div> },
    { key: "plan", header: "Plan", render: (t) => <StatusChip tone="info" label={t.plan} /> },
    { key: "status", header: "Status", render: (t) => <StatusChip tone={t.status === "active" ? "success" : "danger"} label={t.status} /> },
    { key: "domain", header: "Domain", render: (t) => <span className="text-[13px]">{t.domain ?? "-"}</span> },
    { key: "location", header: "Location", render: (t) => <span className="text-[13px]">{[t.city, t.state].filter(Boolean).join(", ") || "-"}</span> },
    { key: "actions", header: "", render: (t) => <div className="flex justify-end"><Button size="sm" variant="outline" onClick={() => navigate(`/platform/schools/${t.id}`)}><Icon name="UserRoundCog" className="size-4" /> Profile</Button></div> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schools"
        subtitle="Tenant directory, organization IDs, subscriptions and school health."
        actions={<Button onClick={() => navigate("/platform/schools/new")}><Icon name="Plus" className="size-4" /> Create school</Button>}
      />
      <SectionCard title="Tenant directory" description="Search by school name, org ID, plan or health.">
        <DataTable
          rows={loading ? [] : rows}
          columns={columns}
          getKey={(t) => t.id}
          searchable={(t) => `${t.name} ${orgIdFor(t)} ${t.plan} ${t.status}`}
          searchPlaceholder="Search school, org ID, or plan..."
          mobileCard={(t) => (
            <div className="space-y-2">
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-[12px] text-muted-foreground">{orgIdFor(t)} · {t.students.toLocaleString()} students</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusChip tone="info" label={t.plan} />
                <StatusChip tone={t.status === "active" ? "success" : "danger"} label={t.status} />
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate(`/platform/schools/${t.id}`)}><Icon name="UserRoundCog" className="size-4" /> Profile</Button>
            </div>
          )}
        />
      </SectionCard>
    </div>
  );
}

export function PlatformSchoolProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile, setProfile] = useState<PlatformTenantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<PlatformPlanRow[]>([]);
  const [profileView, setProfileView] = useState<"details" | "subscription" | "history" | "users" | "audit">("details");
  const [auditUser, setAuditUser] = useState("__all");
  const [auditAction, setAuditAction] = useState("__all");
  const [auditFrom, setAuditFrom] = useState("");
  const [auditTo, setAuditTo] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editStep, setEditStep] = useState<"otp" | "form">("otp");
  const [securePurpose, setSecurePurpose] = useState<"profile" | "support">("profile");
  const [otp, setOtp] = useState("");
  const [editToken, setEditToken] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [supportKey, setSupportKey] = useState("ABC123");
  const [userSearch, setUserSearch] = useState("");
  const [userView, setUserView] = useState("50");
  const [roleSearch, setRoleSearch] = useState("");
  const [roleView, setRoleView] = useState("50");
  const [editForm, setEditForm] = useState({
    schoolName: "",
    primaryDomain: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    adminName: "",
    adminEmail: "",
    studentCapacity: "",
    implementationOwner: "",
    onboardingNotes: "",
    planCode: "",
    renewsAt: ""
  });

  useEffect(() => {
    if (!id) return;
    getPlatformTenantProfile(id)
      .then(setProfile)
      .catch((error: Error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    listPlatformPlans().then(setPlans).catch(() => undefined);
  }, []);

  function fillEditForm(source: PlatformTenantProfile) {
    setEditForm({
      schoolName: source.name,
      primaryDomain: source.organization.primaryDomain,
      city: source.organization.city,
      state: source.organization.state,
      phone: source.organization.phone,
      email: source.organization.email,
      adminName: source.contact.adminName,
      adminEmail: source.contact.adminEmail,
      studentCapacity: source.organization.studentCapacity?.toString() ?? "",
      implementationOwner: source.contact.implementationOwner,
      onboardingNotes: source.organization.onboardingNotes ?? "",
      planCode: source.subscription?.plan.code ?? "",
      renewsAt: source.subscription?.renewsAt ? source.subscription.renewsAt.slice(0, 10) : ""
    });
  }

  async function beginEdit() {
    if (!id || !profile) return;
    setEditSaving(true);
    try {
      fillEditForm(profile);
      setOtp("");
      setEditToken("");
      setEditStep("otp");
      setSecurePurpose("profile");
      await requestPlatformTenantEditOtp(id, `Edit ${profile.name} profile`);
      setEditOpen(true);
      toast.success("Edit OTP sent. Development OTP is ABC123.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start secure edit");
    } finally {
      setEditSaving(false);
    }
  }

  async function verifyEditOtp() {
    if (!id || otp.length !== 6) return;
    setEditSaving(true);
    try {
      const result = await verifyPlatformTenantEditOtp(id, otp);
      setEditToken(result.editToken);
      if (securePurpose === "support") {
        setEditOpen(false);
        toast.success("OTP verified. Support actions unlocked for this session.");
        return;
      }
      setEditStep("form");
      toast.success("OTP verified. Editing unlocked.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "OTP verification failed");
    } finally {
      setEditSaving(false);
    }
  }

  async function submitProfileEdit() {
    if (!id || !editToken) return;
    setEditSaving(true);
    try {
      const updated = await updatePlatformTenantProfile(id, {
        editToken,
        schoolName: editForm.schoolName,
        primaryDomain: editForm.primaryDomain,
        city: editForm.city,
        state: editForm.state,
        phone: editForm.phone,
        email: editForm.email,
        adminName: editForm.adminName,
        adminEmail: editForm.adminEmail,
        studentCapacity: editForm.studentCapacity ? Number(editForm.studentCapacity) : undefined,
        implementationOwner: editForm.implementationOwner,
        onboardingNotes: editForm.onboardingNotes || undefined,
        planCode: editForm.planCode || undefined,
        renewsAt: editForm.renewsAt || undefined
      });
      setProfile(updated);
      setEditOpen(false);
      toast.success("School profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Profile update failed");
    } finally {
      setEditSaving(false);
    }
  }

  async function beginSupportUnlock() {
    if (!id || !profile) return;
    setEditSaving(true);
    try {
      setOtp("");
      setEditToken("");
      setEditStep("otp");
      setSecurePurpose("support");
      await requestPlatformTenantEditOtp(id, `Support action for ${profile.name}`);
      setEditOpen(true);
      toast.success("Support OTP sent. Development OTP is ABC123.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start secure support session");
    } finally {
      setEditSaving(false);
    }
  }

  async function resetUserPassword(membershipId: string) {
    if (!id || !editToken) {
      toast.error("Verify OTP before running support actions.");
      return;
    }
    setEditSaving(true);
    try {
      const result = await resetPlatformTenantUserPassword(id, membershipId, { editToken, supportKey });
      setSupportKey(result.nextSupportKey);
      setEditToken("");
      setProfile(await getPlatformTenantProfile(id));
      toast.success(`Password reset. Development password: ${result.developmentPassword}. New support key: ${result.nextSupportKey}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Password reset failed");
    } finally {
      setEditSaving(false);
    }
  }

  async function changeUserRole(membershipId: string, roleId: string) {
    if (!id || !editToken) {
      toast.error("Verify OTP before running support actions.");
      return;
    }
    setEditSaving(true);
    try {
      const result = await changePlatformTenantUserRole(id, membershipId, { editToken, supportKey, roleId });
      setSupportKey(result.nextSupportKey);
      setEditToken("");
      setProfile(await getPlatformTenantProfile(id));
      toast.success(`Role changed. New support key: ${result.nextSupportKey}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Role change failed");
    } finally {
      setEditSaving(false);
    }
  }

  if (loading) {
    return <div className="text-[14px] text-muted-foreground">Loading school profile...</div>;
  }

  if (!profile) {
    return <EmptyState icon="Building2" title="School profile not found" description="The school may not be registered in the platform directory." action={<Button onClick={() => navigate("/platform/schools")}>Back to schools</Button>} />;
  }

  const currentPlan = profile.subscription?.plan;
  const renewDate = profile.subscription?.renewsAt ? formatDate(profile.subscription.renewsAt) : "Not scheduled";
  const auditUsers = Array.from(new Map(profile.auditLogs.filter((event) => event.actor).map((event) => [event.actor!.id, event.actor!])).values());
  const auditActions = Array.from(new Set(profile.auditLogs.map((event) => event.action))).sort();
  const filteredAuditLogs = profile.auditLogs.filter((event) => {
    if (auditUser !== "__all" && event.actor?.id !== auditUser) return false;
    if (auditAction !== "__all" && event.action !== auditAction) return false;
    const eventDate = new Date(event.createdAt);
    if (auditFrom && eventDate < new Date(`${auditFrom}T00:00:00`)) return false;
    if (auditTo && eventDate > new Date(`${auditTo}T23:59:59`)) return false;
    return true;
  });
  const userQuery = userSearch.trim().toLowerCase();
  const searchedUsers = userQuery ? profile.usersAndRoles.users.filter((item) => [
    item.displayUserId,
    item.displayName,
    item.email ?? "",
    item.phone ?? "",
    item.roleName,
    item.roleKey,
    item.branchName ?? "all branches"
  ].join(" ").toLowerCase().includes(userQuery)) : profile.usersAndRoles.users;
  const filteredUsers = limitRows(searchedUsers, userView);
  const roleQuery = roleSearch.trim().toLowerCase();
  const searchedRoles = roleQuery ? profile.usersAndRoles.roles.filter((item) => [
    item.displayRoleId,
    item.name,
    item.key,
    item.system ? "system" : "custom",
    item.permissions.join(" ")
  ].join(" ").toLowerCase().includes(roleQuery)) : profile.usersAndRoles.roles;
  const filteredRoles = limitRows(searchedRoles, roleView);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-[14px] text-muted-foreground">
        <button onClick={() => navigate("/platform/schools")} className="inline-flex items-center gap-1 text-primary hover:underline"><Icon name="ArrowLeft" className="size-4" /> Schools</button>
        <Icon name="ChevronRight" className="size-4" />
        <span>{profile.name}</span>
      </div>

      <PageHeader
        title={profile.name}
        subtitle={`${profile.organization.organizationId} · ${profile.organization.primaryDomain}`}
        actions={<><Button variant="outline" onClick={() => navigate("/platform/schools")}><Icon name="ArrowLeft" className="size-4" /> Back</Button><Button onClick={() => void beginEdit()} disabled={editSaving}><Icon name="ShieldCheck" className="size-4" /> Edit profile</Button></>}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Plan" value={currentPlan?.name ?? "No plan"} delta={currentPlan ? `${currentPlan.billingCycle} · ₹${currentPlan.basePrice.toLocaleString()}` : "Assign a subscription plan"} tone={currentPlan ? "primary" : "warning"} icon="Package" />
        <StatCard label="Renew date" value={renewDate} delta={profile.subscription?.status ?? "No active subscription"} tone={profile.subscription ? "success" : "warning"} icon="CalendarClock" />
        <StatCard label="Students" value={profile.counts.students.toLocaleString()} delta={`${profile.organization.studentCapacity ?? 0} capacity`} tone="info" icon="Users" />
        <StatCard label="Branches" value={profile.counts.branches.toLocaleString()} delta={`${profile.counts.users} active user roles`} tone="success" icon="Building2" />
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        <ProfileModeButton active={profileView === "details"} icon="Building2" label="Details" hint="School and contact data" onClick={() => setProfileView("details")} />
        <ProfileModeButton active={profileView === "subscription"} icon="Package" label="Subscription details" hint="Current plan and add-ons" onClick={() => setProfileView("subscription")} />
        <ProfileModeButton active={profileView === "history"} icon="ReceiptText" label="Subscription history" hint="Invoices, payments, downloads" onClick={() => setProfileView("history")} />
        <ProfileModeButton active={profileView === "users"} icon="UserCog" label="Users and roles" hint="Tenant users and role actions" onClick={() => setProfileView("users")} />
        <ProfileModeButton active={profileView === "audit"} icon="ScrollText" label="Audit logs" hint="Users, actions and filters" onClick={() => setProfileView("audit")} />
      </div>

      {profileView === "details" && <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <SectionCard title="School identity" description="Data captured during tenant creation.">
            <div className="grid gap-4 md:grid-cols-2">
              <ProfileField label="School name" value={profile.name} />
              <ProfileField label="Tenant code" value={profile.code} />
              <ProfileField label="Organization ID" value={profile.organization.organizationId} />
              <ProfileField label="Primary domain" value={profile.organization.primaryDomain} />
              <ProfileField label="City" value={profile.organization.city} />
              <ProfileField label="State" value={profile.organization.state} />
              <ProfileField label="School phone" value={profile.organization.phone} />
              <ProfileField label="School email" value={profile.organization.email} />
              <ProfileField label="Student capacity" value={profile.organization.studentCapacity?.toLocaleString() ?? "Not set"} />
              <ProfileField label="Status" value={profile.status} />
            </div>
          </SectionCard>

          <SectionCard title="Contacts and onboarding" description="Primary admin and SMLS implementation ownership.">
            <div className="grid gap-4 md:grid-cols-2">
              <ProfileField label="School admin" value={profile.contact.adminName} />
              <ProfileField label="Admin email" value={profile.contact.adminEmail} />
              <ProfileField label="Implementation owner" value={profile.contact.implementationOwner} />
              <ProfileField label="Created" value={formatDate(profile.createdAt)} />
              <div className="md:col-span-2">
                <ProfileField label="Onboarding notes" value={profile.organization.onboardingNotes ?? "No notes captured"} />
              </div>
            </div>
          </SectionCard>

        </div>

        <div className="space-y-6">
          <SectionCard title="Branches">
            <div className="space-y-3">
              {profile.branches.map((branch) => (
                <div key={branch.id} className="rounded-lg border border-border p-3">
                  <p className="font-medium">{branch.name}</p>
                  <p className="text-[13px] text-muted-foreground">{branch.code} · Created {formatDate(branch.createdAt)}</p>
                </div>
              ))}
            </div>
          </SectionCard>

        </div>
      </div>}

      {profileView === "subscription" && (
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <SectionCard title="Current subscription" description="Current plan, renewal schedule, billing cycle, and plan description.">
            {currentPlan ? (
              <div className="grid gap-4 md:grid-cols-2">
                <ProfileField label="Plan type" value={currentPlan.name} />
                <ProfileField label="Plan code" value={currentPlan.code} />
                <ProfileField label="Billing cycle" value={currentPlan.billingCycle} />
                <ProfileField label="Base price" value={`₹${currentPlan.basePrice.toLocaleString()}`} />
                <ProfileField label="Renew date" value={renewDate} />
                <ProfileField label="Subscription status" value={profile.subscription?.status.toLowerCase() ?? "not active"} />
                <div className="md:col-span-2">
                  <ProfileField label="Description" value={currentPlan.description ?? "No description"} />
                </div>
              </div>
            ) : (
              <EmptyState icon="Package" title="No plan assigned" description="Use Edit profile to assign a plan and renew date." />
            )}
          </SectionCard>
          <SectionCard title="Add-on services" description="Additional paid services taken by this school.">
            {profile.addOns.length === 0 ? (
              <EmptyState icon="Puzzle" title="No add-ons enabled" description="Add-on service records will appear here after the add-on billing module is added." />
            ) : (
              <div className="space-y-3">{profile.addOns.map((addOn) => <ProfileField key={addOn.id} label={addOn.name} value={`${addOn.status} · renews ${addOn.renewsAt ? formatDate(addOn.renewsAt) : "not scheduled"}`} />)}</div>
            )}
          </SectionCard>
        </div>
      )}

      {profileView === "history" && (
        <SectionCard title="Subscription history and invoices" description="Invoice ID, payment date, paid plan, amount, and invoice download.">
          {profile.subscriptionHistory.length === 0 ? (
            <EmptyState icon="ReceiptText" title="No subscription invoices yet" description="Invoices will appear here after platform billing records are created." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full border-collapse text-[14px]">
                <thead>
                  <tr className="border-b border-border text-left text-[13px] text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Invoice ID</th>
                    <th className="px-4 py-3 font-medium">Date paid</th>
                    <th className="px-4 py-3 font-medium">Plan paid for</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.subscriptionHistory.map((item) => (
                    <tr key={item.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-medium">{item.invoiceId ?? "Not generated"}</td>
                      <td className="px-4 py-3">{item.paidAt ? formatDate(item.paidAt) : "Not recorded"}</td>
                      <td className="px-4 py-3">{item.planName}<p className="text-[12px] text-muted-foreground">{item.planCode}</p></td>
                      <td className="px-4 py-3">₹{item.amount.toLocaleString()}</td>
                      <td className="px-4 py-3"><StatusChip tone={item.status === "ACTIVE" ? "success" : "muted"} label={item.status.toLowerCase()} /></td>
                      <td className="px-4 py-3 text-right"><Button size="sm" variant="outline" disabled={!item.downloadUrl} onClick={() => item.downloadUrl && window.open(item.downloadUrl, "_blank")}><Icon name="Download" className="size-4" /> Download</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {profile.payments.length === 0 && <div className="mt-4"><EmptyState icon="WalletCards" title="No payment ledger records" description="Past payment entries will appear here after platform billing payment APIs are implemented." /></div>}
        </SectionCard>
      )}

      {profileView === "users" && (
        <div className="space-y-6">
          <SectionCard title="Tenant users" description="All school users, their IDs, branches and roles. Sensitive actions require OTP and organization support key.">
            <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px_220px]">
              <div className="rounded-lg border border-border p-3">
                <p className="text-[12px] text-muted-foreground">Development support key</p>
                <p className="mt-1 text-[14px] font-medium">Starts as ABC123 and rotates after every support action.</p>
              </div>
              <Field label="Support key"><Input value={supportKey} onChange={(event) => setSupportKey(event.target.value.toUpperCase())} maxLength={6} /></Field>
              <div className="flex items-end">
                <Button className="w-full" variant={editToken ? "outline" : "default"} disabled={editSaving} onClick={() => void beginSupportUnlock()}>
                  <Icon name="ShieldCheck" className="size-4" /> {editToken ? "OTP unlocked" : "Unlock actions"}
                </Button>
              </div>
            </div>
            <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px]">
              <div className="relative">
                <Icon name="Search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" value={userSearch} onChange={(event) => setUserSearch(event.target.value)} placeholder="Search users by ID, name, email, role, or branch..." />
              </div>
              <Select value={userView} onValueChange={setUserView}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">View 50</SelectItem>
                  <SelectItem value="100">View 100</SelectItem>
                  <SelectItem value="1000">View 1000</SelectItem>
                  <SelectItem value="all">View all</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="min-w-[1040px] w-full border-collapse text-[14px]">
                <thead>
                  <tr className="border-b border-border text-left text-[13px] text-muted-foreground">
                    <th className="px-4 py-3 font-medium">User ID</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Branch</th>
                    <th className="px-4 py-3 font-medium text-right">Support actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((item) => (
                    <tr key={item.membershipId} className="border-b border-border last:border-0 align-top">
                      <td className="px-4 py-3 font-mono text-[12px]">{item.displayUserId}</td>
                      <td className="px-4 py-3">{item.displayName}<p className="text-[12px] text-muted-foreground">{item.email ?? item.phone ?? "No contact"}</p></td>
                      <td className="px-4 py-3"><StatusChip tone="info" label={item.roleName} /></td>
                      <td className="px-4 py-3">{item.branchName ?? "All branches"}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" disabled={editSaving || !editToken || supportKey.length !== 6} onClick={() => void resetUserPassword(item.membershipId)}><Icon name="KeyRound" className="size-4" /> Reset</Button>
                          <Select value={item.roleId} onValueChange={(roleId) => void changeUserRole(item.membershipId, roleId)} disabled={editSaving || !editToken || supportKey.length !== 6}>
                            <SelectTrigger className="h-9 w-[150px]"><SelectValue /></SelectTrigger>
                            <SelectContent>{profile.usersAndRoles.roles.map((role) => <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 && <div className="mt-4"><EmptyState icon="Users" title="No users match this search" description="Try a different user ID, name, email, role, or branch." /></div>}
          </SectionCard>
          <SectionCard title="Tenant roles" description="Roles created in this organization and their permissions.">
            <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px]">
              <div className="relative">
                <Icon name="Search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" value={roleSearch} onChange={(event) => setRoleSearch(event.target.value)} placeholder="Search roles by ID, name, key, or permission..." />
              </div>
              <Select value={roleView} onValueChange={setRoleView}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">View 50</SelectItem>
                  <SelectItem value="100">View 100</SelectItem>
                  <SelectItem value="1000">View 1000</SelectItem>
                  <SelectItem value="all">View all</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredRoles.map((role) => (
                <div key={role.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div><p className="font-medium">{role.name}</p><p className="text-[12px] text-muted-foreground">{role.key} · {role.displayRoleId}</p></div>
                    <StatusChip tone={role.system ? "primary" : "muted"} label={role.system ? "system" : "custom"} />
                  </div>
                  <p className="mt-2 text-[12px] text-muted-foreground">{role.permissions.length ? role.permissions.join(", ") : "No permissions assigned"}</p>
                </div>
              ))}
            </div>
            {filteredRoles.length === 0 && <div className="mt-4"><EmptyState icon="UserCog" title="No roles match this search" description="Try a different role ID, role name, key, or permission." /></div>}
          </SectionCard>
        </div>
      )}

      {profileView === "audit" && (
        <SectionCard title="Organization audit logs" description="Filter every recorded action in this school by date, user, and action.">
          <div className="mb-4 grid gap-3 md:grid-cols-4">
            <Field label="User">
              <Select value={auditUser} onValueChange={setAuditUser}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all">All users</SelectItem>
                  {auditUsers.map((user) => <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Action">
              <Select value={auditAction} onValueChange={setAuditAction}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all">All actions</SelectItem>
                  {auditActions.map((action) => <SelectItem key={action} value={action}>{action}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="From"><Input type="date" value={auditFrom} onChange={(event) => setAuditFrom(event.target.value)} /></Field>
            <Field label="To"><Input type="date" value={auditTo} onChange={(event) => setAuditTo(event.target.value)} /></Field>
          </div>
          {filteredAuditLogs.length === 0 ? (
            <EmptyState icon="ScrollText" title="No audit events match filters" description="Clear filters or perform actions in this organization to see logs." action={<Button variant="outline" onClick={() => { setAuditUser("__all"); setAuditAction("__all"); setAuditFrom(""); setAuditTo(""); }}><Icon name="X" className="size-4" /> Clear filters</Button>} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full border-collapse text-[14px]">
                <thead>
                  <tr className="border-b border-border text-left text-[13px] text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">User ID</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                    <th className="px-4 py-3 font-medium">Resource</th>
                    <th className="px-4 py-3 font-medium">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuditLogs.map((event) => (
                    <tr key={event.id} className="border-b border-border last:border-0 align-top">
                      <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(event.createdAt)}</td>
                      <td className="px-4 py-3 font-mono text-[12px]">{event.actor?.id ?? "system"}</td>
                      <td className="px-4 py-3">{event.actor?.name ?? "System"}<p className="text-[12px] text-muted-foreground">{event.actor?.email ?? "No email"}</p></td>
                      <td className="px-4 py-3 font-medium">{event.action}</td>
                      <td className="px-4 py-3">{event.resource}<p className="text-[12px] text-muted-foreground">{event.resourceId ?? "-"}</p></td>
                      <td className="px-4 py-3 max-w-[320px] truncate font-mono text-[12px] text-muted-foreground">{JSON.stringify(event.metadata ?? {})}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editStep === "otp" ? (securePurpose === "support" ? "Verify support action" : "Verify secure edit") : "Edit school profile"}</DialogTitle>
            <DialogDescription>
              {editStep === "otp" ? (securePurpose === "support" ? "A 6-character OTP plus the organization support key is required before password resets or role changes. Development OTP: ABC123." : "A 6-character OTP is required before editing school profile and subscription details. Development OTP: ABC123.") : "Changes are saved to the tenant profile and recorded in platform audit logs."}
            </DialogDescription>
          </DialogHeader>

          {editStep === "otp" ? (
            <div className="space-y-5">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-[13px] text-muted-foreground">OTP sent to the signed-in platform user's email. Production delivery will use the configured platform communication provider.</p>
              </div>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value.toUpperCase())} containerClassName="justify-center">
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, index) => <InputOTPSlot key={index} index={index} className="h-12 w-12 text-[18px] font-semibold uppercase" />)}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          ) : (
            <div className="max-h-[65vh] overflow-y-auto pr-1">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="School name"><Input value={editForm.schoolName} onChange={(event) => setEditForm({ ...editForm, schoolName: event.target.value })} /></Field>
                <Field label="Primary domain"><Input value={editForm.primaryDomain} onChange={(event) => setEditForm({ ...editForm, primaryDomain: event.target.value })} /></Field>
                <Field label="City"><Input value={editForm.city} onChange={(event) => setEditForm({ ...editForm, city: event.target.value })} /></Field>
                <Field label="State"><Input value={editForm.state} onChange={(event) => setEditForm({ ...editForm, state: event.target.value })} /></Field>
                <Field label="School phone"><Input value={editForm.phone} onChange={(event) => setEditForm({ ...editForm, phone: event.target.value })} /></Field>
                <Field label="School email"><Input value={editForm.email} onChange={(event) => setEditForm({ ...editForm, email: event.target.value })} /></Field>
                <Field label="Admin name"><Input value={editForm.adminName} onChange={(event) => setEditForm({ ...editForm, adminName: event.target.value })} /></Field>
                <Field label="Admin email"><Input value={editForm.adminEmail} onChange={(event) => setEditForm({ ...editForm, adminEmail: event.target.value })} /></Field>
                <Field label="Student capacity"><Input value={editForm.studentCapacity} onChange={(event) => setEditForm({ ...editForm, studentCapacity: event.target.value })} inputMode="numeric" /></Field>
                <Field label="Implementation owner"><Input value={editForm.implementationOwner} onChange={(event) => setEditForm({ ...editForm, implementationOwner: event.target.value })} /></Field>
                <Field label="Plan">
                  <Select value={editForm.planCode || "__unchanged"} onValueChange={(value) => setEditForm({ ...editForm, planCode: value === "__unchanged" ? "" : value })}>
                    <SelectTrigger><SelectValue placeholder="Keep current plan" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__unchanged">Keep current plan</SelectItem>
                      {plans.map((plan) => <SelectItem key={plan.id} value={plan.code}>{plan.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Renew date"><Input type="date" value={editForm.renewsAt} onChange={(event) => setEditForm({ ...editForm, renewsAt: event.target.value })} /></Field>
                <div className="md:col-span-2">
                  <Field label="Onboarding notes"><Textarea value={editForm.onboardingNotes} onChange={(event) => setEditForm({ ...editForm, onboardingNotes: event.target.value })} /></Field>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            {editStep === "otp" ? (
              <Button disabled={otp.length !== 6 || editSaving} onClick={() => void verifyEditOtp()}><Icon name="ShieldCheck" className="size-4" /> Verify OTP</Button>
            ) : (
              <Button disabled={!editToken || editSaving} onClick={() => void submitProfileEdit()}><Icon name="Save" className="size-4" /> Save changes</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function PlatformCreateSchool() {
  const navigate = useNavigate();
  const [schoolName, setSchoolName] = useState("");
  const [orgId, setOrgId] = useState("");
  const [domain, setDomain] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [studentCapacity, setStudentCapacity] = useState("");
  const [implementationOwner, setImplementationOwner] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [plans, setPlans] = useState<PlatformPlanRow[]>([]);
  const suggestedOrgId = orgId.trim() || generateOrgId(schoolName, city);
  const canSubmit = schoolName.trim() && suggestedOrgId && domain.trim() && city.trim() && state.trim() && phone.trim() && email.trim() && plan && adminName.trim() && adminEmail.trim() && implementationOwner.trim();

  useEffect(() => {
    listPlatformPlans().then(setPlans).catch((error: Error) => toast.error(error.message));
  }, []);

  useEffect(() => {
    if (orgId.trim() || !schoolName.trim()) return;
    const timer = window.setTimeout(() => {
      suggestOrganizationId(schoolName, city).then((result) => setOrgId(result.organizationId)).catch(() => undefined);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [schoolName, city, orgId]);

  async function handleCreateSchool() {
    if (!canSubmit || saving) return;
    setSaving(true);
    try {
      await createPlatformTenant({
        schoolName,
        organizationId: suggestedOrgId,
        primaryDomain: domain,
        city,
        state,
        phone,
        email,
        adminName,
        adminEmail,
        studentCapacity: studentCapacity ? Number(studentCapacity) : undefined,
        planCode: plan,
        implementationOwner,
        onboardingNotes: notes || undefined
      });
      toast.success("School created");
      navigate("/platform/schools");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "School could not be created");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-[14px] text-muted-foreground">
        <button onClick={() => navigate("/platform/schools")} className="inline-flex items-center gap-1 text-primary hover:underline"><Icon name="ArrowLeft" className="size-4" /> Schools</button>
        <Icon name="ChevronRight" className="size-4" />
        <span>Create school</span>
      </div>
      <PageHeader
        title="Create school"
        subtitle="Capture tenant identity, primary contact, subscription, and onboarding ownership before workspace provisioning."
        actions={<Button variant="outline" onClick={() => navigate("/platform/schools")}><Icon name="ArrowLeft" className="size-4" /> Back</Button>}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <SectionCard title="Organization identity" description="These values define the tenant record and public workspace identity.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="School name"><Input value={schoolName} onChange={(event) => setSchoolName(event.target.value)} placeholder="School name" /></Field>
              <Field label="Organization ID"><Input value={orgId} onChange={(event) => setOrgId(event.target.value.toUpperCase())} placeholder={suggestedOrgId || "Auto suggested"} /></Field>
              <Field label="Primary domain"><Input value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="school.edu.in" /></Field>
              <Field label="Student capacity"><Input value={studentCapacity} onChange={(event) => setStudentCapacity(event.target.value)} placeholder="1200" inputMode="numeric" /></Field>
              <Field label="City"><Input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Bengaluru" /></Field>
              <Field label="State"><Input value={state} onChange={(event) => setState(event.target.value)} placeholder="Karnataka" /></Field>
            </div>
          </SectionCard>

          <SectionCard title="Primary contact" description="Used for onboarding, billing communication, and first admin verification.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="School phone"><Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91 98765 43210" /></Field>
              <Field label="School email"><Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="office@school.edu.in" /></Field>
              <Field label="Admin name"><Input value={adminName} onChange={(event) => setAdminName(event.target.value)} placeholder="Meera Iyer" /></Field>
              <Field label="Admin email"><Input value={adminEmail} onChange={(event) => setAdminEmail(event.target.value)} placeholder="admin@school.edu.in" /></Field>
            </div>
          </SectionCard>

          <SectionCard title="Subscription and onboarding" description="Choose the starting plan and capture implementation context.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Plan">
                <Select value={plan} onValueChange={setPlan} disabled={plans.length === 0}>
                  <SelectTrigger><SelectValue placeholder="Select plan" /></SelectTrigger>
                  <SelectContent>
                    {plans.map((item) => <SelectItem key={item.id} value={item.code}>{item.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {plans.length === 0 && <p className="text-[12px] text-muted-foreground">Create a plan first in Plans → Create plan.</p>}
              </Field>
              <Field label="Implementation owner">
                <Input value={implementationOwner} onChange={(event) => setImplementationOwner(event.target.value)} placeholder="Name or team responsible for onboarding" />
              </Field>
              <div className="md:col-span-2">
                <Field label="Onboarding notes"><Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Board, rollout date, migration notes, contract references..." /></Field>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Provisioning preview">
            <div className="space-y-3">
              <PreviewRow label="Organization ID" value={suggestedOrgId || "Waiting for school name"} />
              <PreviewRow label="Tenant name" value={schoolName || "Not entered"} />
              <PreviewRow label="Domain" value={domain || "Not entered"} />
              <PreviewRow label="Plan" value={plan || "Not selected"} />
              <PreviewRow label="First admin" value={adminEmail || "Not entered"} />
            </div>
          </SectionCard>
          <SectionCard title="Backend status">
            <p className="text-[14px] text-muted-foreground">Provisioning will create the tenant, main branch, tenant profile, optional plan subscription, and audit event.</p>
            <Button className="mt-4 w-full" disabled={!canSubmit || saving} onClick={() => void handleCreateSchool()}><Icon name="Building2" className="size-4" /> Create school</Button>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

export function PlatformPlans() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader title="Plans & entitlements" subtitle="Plan catalog, feature access, and active subscriptions." />
      <div className="grid gap-4 md:grid-cols-3">
        <PlatformAction active={false} icon="Package" label="Plans" hint="Plan catalog and school count" onClick={() => navigate("/platform/plans/catalog")} />
        <PlatformAction active={false} icon="ToggleRight" label="Entitlements" hint="Module access by plan" onClick={() => navigate("/platform/plans/entitlements")} />
        <PlatformAction active={false} icon="CreditCard" label="Subscriptions" hint="Renewals, trials and past due" onClick={() => navigate("/platform/plans/subscriptions")} />
      </div>
    </div>
  );
}

export function PlatformPlanCatalog() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PlatformPlanRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    listPlatformPlans().then(setPlans).catch((error: Error) => toast.error(error.message)).finally(() => setLoading(false));
  }, []);
  return (
    <PlatformDetailPage title="Plans" subtitle="Plan catalog and school counts" actions={<Button onClick={() => navigate("/platform/plans/new")}><Icon name="Plus" className="size-4" /> Create plan</Button>}>
      <SectionCard title="Plan catalog">
        {loading && <p className="text-[14px] text-muted-foreground">Loading plans...</p>}
        {!loading && plans.length === 0 && <EmptyState icon="Package" title="No plans created yet" description="Create your first platform plan." action={<Button onClick={() => navigate("/platform/plans/new")}><Icon name="Plus" className="size-4" /> Create plan</Button>} />}
        {!loading && plans.length > 0 && <div className="grid gap-4 md:grid-cols-3">{plans.map((plan) => <SectionCard key={plan.id} title={plan.name} description={plan.code}><p className="text-[24px] font-semibold">₹{plan.basePrice.toLocaleString()}</p><p className="text-[13px] text-muted-foreground">{plan.billingCycle} · {plan.subscriptions} subscriptions</p><p className="mt-3 text-[14px]">{plan.description ?? "No description"}</p></SectionCard>)}</div>}
      </SectionCard>
    </PlatformDetailPage>
  );
}

export function PlatformCreatePlan() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [billingCycle, setBillingCycle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const canSubmit = name.trim() && code.trim() && billingCycle && price.trim();

  async function handleCreatePlan() {
    if (!canSubmit || saving) return;
    setSaving(true);
    try {
      await createPlatformPlan({ name, code, billingCycle, basePrice: Number(price), description: description || undefined });
      toast.success("Plan created");
      navigate("/platform/plans/catalog");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Plan could not be created");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-[14px] text-muted-foreground">
        <button onClick={() => navigate("/platform/plans/catalog")} className="inline-flex items-center gap-1 text-primary hover:underline"><Icon name="ArrowLeft" className="size-4" /> Plans</button>
        <Icon name="ChevronRight" className="size-4" />
        <span>Create plan</span>
      </div>
      <PageHeader title="Create plan" subtitle="Define plan identity, pricing, billing cycle, and entitlement notes." actions={<Button variant="outline" onClick={() => navigate("/platform/plans/catalog")}><Icon name="ArrowLeft" className="size-4" /> Back</Button>} />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <SectionCard title="Plan details">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Plan name"><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Growth" /></Field>
            <Field label="Plan code"><Input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="GROWTH" /></Field>
            <Field label="Billing cycle">
              <Select value={billingCycle} onValueChange={setBillingCycle}>
                <SelectTrigger><SelectValue placeholder="Select cycle" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="contract">Custom contract</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Base price"><Input value={price} onChange={(event) => setPrice(event.target.value)} placeholder="₹0" /></Field>
            <div className="md:col-span-2">
              <Field label="Description"><Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Modules, support level, limits, and contract notes..." /></Field>
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Backend status">
          <p className="text-[14px] text-muted-foreground">Creating a plan persists the platform plan and writes an audit event.</p>
          <Button className="mt-4 w-full" disabled={!canSubmit || saving} onClick={() => void handleCreatePlan()}><Icon name="Package" className="size-4" /> Create plan</Button>
        </SectionCard>
      </div>
    </div>
  );
}

export function PlatformEntitlements() {
  return <PlatformDetailPage title="Entitlements" subtitle="Module access by plan and school-specific overrides"><EntitlementGrid /></PlatformDetailPage>;
}

export function PlatformSubscriptions() {
  return <PlatformDetailPage title="Subscriptions" subtitle="Renewals, trials and past due"><SubscriptionList /></PlatformDetailPage>;
}

export function PlatformOperations() {
  const [view, setView] = useState<"health" | "incidents" | "domains">("health");

  return (
    <div className="space-y-6">
      <PageHeader title="Operations" subtitle="System health, incidents, tenant domains and operational risk." />
      <div className="grid gap-4 md:grid-cols-3">
        <PlatformAction active={view === "health"} icon="Activity" label="System health" hint="API, jobs and storage" tone="success" onClick={() => setView("health")} />
        <PlatformAction active={view === "incidents"} icon="TriangleAlert" label="Incidents" hint="Active operational issues" tone="danger" onClick={() => setView("incidents")} />
        <PlatformAction active={view === "domains"} icon="Globe" label="Domains" hint="DNS, SSL and tenant sites" tone="info" onClick={() => setView("domains")} />
      </div>
      {view === "health" && (
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="API availability" value="99.98%" delta="p95 142ms" tone="success" icon="Activity" />
            <StatCard label="Job queue" value="3" delta="Healthy backlog" tone="success" icon="ListChecks" />
            <StatCard label="Storage usage" value="82%" delta="Review enterprise tenants" tone="warning" icon="HardDrive" />
          </div>
      )}
      {view === "incidents" && (
          <SectionCard title="Active incidents">
            <div className="space-y-3">
              {["Website outage reported by a provisioned school", "Receipt PDF generation delayed"].map((title, index) => (
                <div key={title} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div><p className="font-medium">{title}</p><p className="text-[13px] text-muted-foreground">INC-20{index + 41} · Owner: Technical Support</p></div>
                  <StatusChip tone={index === 0 ? "danger" : "warning"} label={index === 0 ? "High" : "Medium"} />
                </div>
              ))}
            </div>
          </SectionCard>
      )}
      {view === "domains" && (
          <SectionCard title="Tenant domains">
            <div className="grid gap-3 md:grid-cols-2">
              {["school-domain.edu.in", "academy.example", "campus.example"].map((domain, index) => (
                <div key={domain} className="rounded-lg border border-border p-3">
                  <p className="font-medium">{domain}</p>
                  <p className="text-[13px] text-muted-foreground">DNS verified · SSL {index === 1 ? "expires in 13 days" : "valid"}</p>
                </div>
              ))}
            </div>
          </SectionCard>
      )}
    </div>
  );
}

export function PlatformSupport() {
  const [selected, setSelected] = useState(SUPPORT_CASES[0]);
  return (
    <div className="space-y-6">
      <PageHeader title="Support" subtitle="Dedicated platform support channel for school admins and principals." />
      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <SectionCard title="Open cases" description="Separate from normal school messages.">
          <div className="space-y-3">
            {SUPPORT_CASES.map((item) => (
              <button key={item.id} onClick={() => setSelected(item)} className="flex w-full items-center justify-between gap-3 rounded-lg border border-border p-3 text-left hover:bg-accent">
                <div>
                  <p className="font-medium">{item.subject}</p>
                  <p className="text-[13px] text-muted-foreground">{item.id} · {item.school} · {item.updated}</p>
                </div>
                <StatusChip tone={item.priority === "High" ? "danger" : item.priority === "Medium" ? "warning" : "info"} label={item.priority} />
              </button>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Case messages" description={`${selected.id} · ${selected.raisedBy}`}>
          <div className="space-y-3">
            <div className="rounded-lg bg-muted p-3 text-[14px]">{selected.subject}</div>
            <div className="rounded-lg border border-border p-3 text-[14px]">Platform team acknowledged. Technical Support is checking tenant domain and service health.</div>
            <Textarea placeholder="Reply to school admin or principal..." />
            <Button><Icon name="Send" className="size-4" /> Send reply</Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export function PlatformReports() {
  return (
    <div className="space-y-6">
      <PageHeader title="Platform reports" subtitle="Reports for tenant growth, reliability, support and revenue." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="MRR risk" value="8.4%" delta="Trials and past due" tone="warning" icon="TrendingDown" />
        <StatCard label="Support SLA" value="91%" delta="First response inside SLA" tone="success" icon="Timer" />
        <StatCard label="Tenant growth" value="+4" delta="This month" tone="primary" icon="Building2" />
        <StatCard label="Health risk" value="3" delta="Tenants need review" tone="danger" icon="Activity" />
      </div>
      <SectionCard title="Report queue">
        <div className="grid gap-3 md:grid-cols-3">
          {["Tenant growth", "Support SLA", "Subscription renewals"].map((name) => <QuickAction key={name} icon="BarChart3" label={name} hint="Open platform report" />)}
        </div>
      </SectionCard>
    </div>
  );
}

export function PlatformSettings() {
  const [view, setView] = useState<"general" | "team" | "audit">("general");

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Platform configuration, team roles, permissions and audit." />
      <div className="grid gap-4 md:grid-cols-3">
        <PlatformAction active={view === "general"} icon="Settings" label="General" hint="Region, SLA and trial defaults" onClick={() => setView("general")} />
        <PlatformAction active={view === "team"} icon="UserCog" label="Team & roles" hint="Platform staff permissions" tone="info" onClick={() => setView("team")} />
        <PlatformAction active={view === "audit"} icon="ScrollText" label="Audit" hint="Platform and tenant events" tone="warning" onClick={() => setView("audit")} />
      </div>
      {view === "general" && (
          <SectionCard title="General configuration">
            <div className="grid gap-3 md:grid-cols-2">
              <SettingRow label="Default tenant region" value="India" />
              <SettingRow label="Support SLA clock" value="Business hours" />
              <SettingRow label="Trial duration" value="14 days" />
              <SettingRow label="Domain verification" value="Required before launch" />
            </div>
          </SectionCard>
      )}
      {view === "team" && (
          <SectionCard title="Platform team roles" description="Use role scopes for platform staff like Technical Support.">
            <div className="space-y-3">
              {PLATFORM_ROLES.map((item) => <SettingRow key={item.role} label={item.role} value={item.permissions} />)}
            </div>
          </SectionCard>
      )}
      {view === "audit" && (
          <SectionCard title="Audit log">
            <div className="space-y-3">
              {["Technical Support role updated", "School domain SSL renewed", "School plan changed"].map((event) => (
                <div key={event} className="rounded-lg border border-border p-3">
                  <p className="font-medium">{event}</p>
                  <p className="text-[13px] text-muted-foreground">Logged with actor, timestamp, and tenant context.</p>
                </div>
              ))}
            </div>
          </SectionCard>
      )}
    </div>
  );
}

function PlatformAction({ active, icon, label, hint, tone = "primary", onClick }: { active: boolean; icon: string; label: string; hint: string; tone?: "primary" | "success" | "danger" | "info" | "warning"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl border bg-card p-4 text-left transition-colors hover:bg-accent ${active ? "border-primary ring-2 ring-primary/20" : "border-border"}`}
    >
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${tone === "success" ? "bg-success-subtle text-success-subtle-foreground" : tone === "danger" ? "bg-danger-subtle text-danger-subtle-foreground" : tone === "info" ? "bg-info-subtle text-info-subtle-foreground" : tone === "warning" ? "bg-warning-subtle text-warning-subtle-foreground" : "bg-primary-subtle text-primary-subtle-foreground"}`}>
        <Icon name={icon} className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-medium">{label}</span>
        <span className="block truncate text-[13px] text-muted-foreground">{hint}</span>
      </span>
      <Icon name="ChevronRight" className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

function ProfileModeButton({ active, icon, label, hint, onClick }: { active: boolean; icon: string; label: string; hint: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex min-h-[88px] w-full items-center gap-3 rounded-xl border bg-card p-4 text-left transition-colors hover:bg-accent ${active ? "border-primary ring-2 ring-primary/20" : "border-border"}`}
    >
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${active ? "bg-primary-subtle text-primary-subtle-foreground" : "bg-muted text-muted-foreground"}`}>
        <Icon name={icon} className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-medium">{label}</span>
        <span className="block truncate text-[13px] text-muted-foreground">{hint}</span>
      </span>
    </button>
  );
}

function EntitlementGrid() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <SectionCard title="Plan entitlements" description="Create a plan first, then define which modules and limits that plan includes.">
        <EmptyState icon="ToggleRight" title="No plan entitlements yet" description="After plans exist, each plan will appear here with editable module access, usage limits, and add-ons." />
      </SectionCard>
      <SectionCard title="Custom school entitlements" description="Override a school's plan when a contract includes special access.">
        <EmptyState icon="Building2" title="No custom school overrides" description="School-specific entitlements will appear here after tenant provisioning and plan APIs are implemented." />
      </SectionCard>
      <SectionCard className="xl:col-span-2" title="Entitlement model" description="This is the intended production behavior.">
        <div className="grid gap-3 md:grid-cols-3">
          <PreviewRow label="Plan defaults" value="Modules and limits inherited by every school on a plan." />
          <PreviewRow label="School overrides" value="Contract-specific additions or restrictions for one school." />
          <PreviewRow label="Audit requirement" value="Every entitlement change records actor, reason, before and after values." />
        </div>
      </SectionCard>
    </div>
  );
}

function SubscriptionList() {
  return (
    <SectionCard title="Subscriptions">
      <EmptyState icon="CreditCard" title="No subscriptions yet" description="Subscriptions will appear after schools and plans are provisioned through backend APIs." />
    </SectionCard>
  );
}

function PlatformDetailPage({ title, subtitle, actions, children }: { title: string; subtitle: string; actions?: React.ReactNode; children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-[14px] text-muted-foreground">
        <button onClick={() => navigate("/platform/plans")} className="inline-flex items-center gap-1 text-primary hover:underline"><Icon name="ArrowLeft" className="size-4" /> Plans & entitlements</button>
        <Icon name="ChevronRight" className="size-4" />
        <span>{title}</span>
      </div>
      <PageHeader title={title} subtitle={subtitle} actions={<><Button variant="outline" onClick={() => navigate("/platform/plans")}><Icon name="ArrowLeft" className="size-4" /> Back</Button>{actions}</>} />
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-[14px] font-medium">{value}</p>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-[14px] font-medium">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function limitRows<T>(rows: T[], view: string) {
  if (view === "all") return rows;
  const count = Number(view);
  return Number.isFinite(count) ? rows.slice(0, count) : rows;
}

function generateOrgId(name: string, city: string) {
  const base = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const cityCode = city.trim().slice(0, 3).toUpperCase();
  if (!base) return "";
  return `ORG-${base}${cityCode ? `-${cityCode}` : ""}`;
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-[13px] text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

function orgIdFor(tenant: { id: string; orgId?: string }) {
  return tenant.orgId ?? tenant.id;
}

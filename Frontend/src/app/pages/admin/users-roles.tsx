import { useState } from "react";
import { PageHeader, SectionCard, StatusChip } from "../../components/shared/primitives";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/shared/icon";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { DataTable, type Column } from "../../components/shared/data-table";
import { colorFor, initials } from "../../lib/mock-data";
import type { StatusTone } from "../../lib/types";
import { toast } from "sonner";

/* ------------------------------- Users -------------------------------- */
interface UserRow { id: string; name: string; email: string; role: string; status: "Active" | "Invited" | "Suspended" }

const USERS: UserRow[] = [
  { id: "u1", name: "Ravi Sharma", email: "ravi.sharma@demoschool.edu", role: "Teacher", status: "Active" },
  { id: "u2", name: "Priya Nair", email: "priya.nair@demoschool.edu", role: "Admissions", status: "Active" },
  { id: "u3", name: "Sunita Rao", email: "sunita.rao@demoschool.edu", role: "Accountant", status: "Active" },
  { id: "u4", name: "Amit Verma", email: "amit.verma@demoschool.edu", role: "Principal", status: "Active" },
  { id: "u5", name: "Neha Das", email: "neha.das@demoschool.edu", role: "Teacher", status: "Invited" },
  { id: "u6", name: "Karan Mehta", email: "karan.mehta@demoschool.edu", role: "Front Office", status: "Suspended" },
];

const USER_STATUS_TONE: Record<UserRow["status"], StatusTone> = { Active: "success", Invited: "info", Suspended: "danger" };

/* --------------------------- Permission matrix ------------------------- */
const MODULES = ["Students", "Attendance", "Academics", "Examinations", "Finance", "Communication", "Reports", "Settings"];
const ROLES = ["Teacher", "Accountant", "Admissions", "Principal", "Admin"];
type Perm = "none" | "view" | "edit" | "approve";

const PERM_ORDER: Perm[] = ["none", "view", "edit", "approve"];
const PERM_META: Record<Perm, { label: string; tone: StatusTone; icon: string }> = {
  none: { label: "None", tone: "muted", icon: "Minus" },
  view: { label: "View", tone: "info", icon: "Eye" },
  edit: { label: "Edit", tone: "primary", icon: "Pencil" },
  approve: { label: "Approve", tone: "success", icon: "ShieldCheck" },
};

// Seed a sensible default matrix.
function seed(): Record<string, Record<string, Perm>> {
  const base: Record<string, Record<string, Perm>> = {};
  for (const r of ROLES) {
    base[r] = {};
    for (const m of MODULES) base[r][m] = "none";
  }
  base.Teacher.Students = "view"; base.Teacher.Attendance = "edit"; base.Teacher.Examinations = "edit"; base.Teacher.Communication = "view"; base.Teacher.Reports = "view";
  base.Accountant.Finance = "edit"; base.Accountant.Students = "view"; base.Accountant.Reports = "view";
  base.Admissions.Students = "edit"; base.Admissions.Communication = "edit"; base.Admissions.Reports = "view";
  base.Principal.Students = "view"; base.Principal.Attendance = "view"; base.Principal.Academics = "view"; base.Principal.Examinations = "approve"; base.Principal.Finance = "approve"; base.Principal.Communication = "approve"; base.Principal.Reports = "view";
  for (const m of MODULES) base.Admin[m] = "edit";
  base.Admin.Settings = "approve"; base.Admin.Examinations = "approve"; base.Admin.Finance = "approve";
  return base;
}

// Users list + role permission matrix (spec §13 Platform admin — users & roles).
export function UsersRoles() {
  const [matrix, setMatrix] = useState(seed);
  const [dirty, setDirty] = useState(false);

  function cycle(role: string, mod: string) {
    setMatrix((m) => {
      const next = PERM_ORDER[(PERM_ORDER.indexOf(m[role][mod]) + 1) % PERM_ORDER.length];
      return { ...m, [role]: { ...m[role], [mod]: next } };
    });
    setDirty(true);
  }

  const columns: Column<UserRow>[] = [
    { key: "name", header: "User", sticky: true, render: (u) => (
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full text-[12px] font-medium text-white" style={{ backgroundColor: colorFor(u.name) }}>{initials(u.name)}</span>
        <div><p className="font-medium">{u.name}</p><p className="text-[13px] text-muted-foreground">{u.email}</p></div>
      </div>
    ) },
    { key: "role", header: "Role", render: (u) => <StatusChip tone="primary" label={u.role} /> },
    { key: "status", header: "Status", render: (u) => <StatusChip tone={USER_STATUS_TONE[u.status]} label={u.status} /> },
    { key: "actions", header: "", render: (u) => (
      <div className="flex justify-end gap-1">
        <Button size="sm" variant="ghost" onClick={() => toast(`Editing ${u.name}`)}><Icon name="Pencil" className="size-4" /></Button>
        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => toast(`${u.name} suspended`)}><Icon name="UserX" className="size-4" /></Button>
      </div>
    ), className: "text-right" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & roles"
        subtitle="Manage staff accounts and what each role can do"
        actions={<Button onClick={() => toast.success("Invitation sent")}><Icon name="UserPlus" className="size-4" /> Invite user</Button>}
      />

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <SectionCard>
            <DataTable
              columns={columns}
              rows={USERS}
              getKey={(u) => u.id}
              searchable={(u) => `${u.name} ${u.email} ${u.role}`}
              searchPlaceholder="Search users…"
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="permissions" className="mt-4">
          <SectionCard
            title="Permission matrix"
            description="Tap a cell to cycle None → View → Edit → Approve"
            action={dirty ? <Button size="sm" onClick={() => { setDirty(false); toast.success("Permissions saved"); }}><Icon name="Save" className="size-4" /> Save changes</Button> : <StatusChip tone="success" label="Saved" icon="Check" />}
            bodyClassName="p-0"
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[14px]">
                <thead>
                  <tr className="border-b border-border text-left text-[13px] text-muted-foreground">
                    <th className="sticky left-0 bg-card px-4 py-3 font-medium">Module</th>
                    {ROLES.map((r) => <th key={r} className="px-3 py-3 text-center font-medium">{r}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {MODULES.map((mod) => (
                    <tr key={mod} className="border-b border-border last:border-0">
                      <td className="sticky left-0 bg-card px-4 py-2 font-medium">{mod}</td>
                      {ROLES.map((role) => {
                        const p = matrix[role][mod];
                        const meta = PERM_META[p];
                        return (
                          <td key={role} className="px-3 py-2 text-center">
                            <button onClick={() => cycle(role, mod)} className="inline-flex" aria-label={`${role} ${mod}: ${meta.label}`}>
                              <StatusChip tone={meta.tone} label={meta.label} icon={meta.icon} />
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
          <p className="mt-3 flex items-center gap-2 text-[13px] text-muted-foreground"><Icon name="Info" className="size-4" /> Approve implies edit and view. Changes apply to every user with that role.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

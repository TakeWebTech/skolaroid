import { useEffect, useMemo, useState } from "react";
import { EmptyState, PageHeader, StatusChip } from "../../components/shared/primitives";
import { DataTable, type Column } from "../../components/shared/data-table";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/shared/icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { colorFor, initials } from "../../lib/mock-data";
import { ApiError } from "../../lib/auth-api";
import { createStudent, listStudents, type StudentDirectoryRow, type StudentDirectoryClass } from "../../lib/people-api";
import { toast } from "sonner";

const STATUS_TONE = { active: "success", inactive: "muted", alumni: "info" } as const;

export function StudentDirectory({ title = "Students" }: { title?: string }) {
  const [cls, setCls] = useState("all");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<StudentDirectoryRow[]>([]);
  const [classes, setClasses] = useState<StudentDirectoryClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [studentForm, setStudentForm] = useState({ admissionNo: "", displayName: "", classId: "", rollNo: "" });

  function loadStudents() {
    let cancelled = false;
    setLoading(true);
    setError(null);
    listStudents({ search: query, classId: cls })
      .then((response) => {
        if (cancelled) return;
        setRows(response.students);
        setClasses(response.classes);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError && err.status === 403 ? "You do not have permission to view students." : err instanceof Error ? err.message : "Could not load students.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }

  useEffect(() => {
    return loadStudents();
  }, [cls, query]);

  async function handleCreateStudent() {
    if (!studentForm.admissionNo.trim() || !studentForm.displayName.trim() || !studentForm.classId || saving) return;
    setSaving(true);
    try {
      await createStudent(studentForm);
      setDialogOpen(false);
      setStudentForm({ admissionNo: "", displayName: "", classId: "", rollNo: "" });
      toast.success("Student created");
      loadStudents();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Student could not be created");
    } finally {
      setSaving(false);
    }
  }

  const filteredRows = useMemo(() => rows, [rows]);

  const nameCell = (s: StudentDirectoryRow) => (
    <div className="flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-full text-[12px] font-semibold text-white" style={{ backgroundColor: colorFor(s.name) }}>{initials(s.name)}</span>
      <div><p className="font-medium">{s.name}</p><p className="text-[12px] text-muted-foreground">{s.admissionNo} · Roll {s.rollNo ?? "-"} · {s.classCode ?? "No class"}</p></div>
    </div>
  );

  const columns: Column<StudentDirectoryRow>[] = [
    { key: "name", header: "Student", sticky: true, render: nameCell },
    { key: "class", header: "Class", render: (s) => <span>{s.className ?? "Not enrolled"}<span className="block text-[12px] text-muted-foreground">{s.classCode ?? "No section"}</span></span> },
    { key: "roll", header: "Roll", render: (s) => <span className="text-[13px]">{s.rollNo ?? "-"}</span> },
    { key: "status", header: "Status", render: (s) => <StatusChip tone={STATUS_TONE[s.status]} label={s.status} /> },
    { key: "action", header: "", render: () => <Button size="sm" variant="ghost" disabled>Profile API pending <Icon name="Lock" className="size-4" /></Button> },
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title={title} subtitle="Find and manage student records" />
        <EmptyState icon="ShieldAlert" title="Students unavailable" description={error} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={title} subtitle="Find and manage student records" actions={<Button variant="outline" disabled={classes.length === 0} onClick={() => setDialogOpen(true)}><Icon name="Plus" className="size-4" /> Add student</Button>} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Icon name="Search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or admission number..."
            className="h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 pl-9 text-[14px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <Select value={cls} onValueChange={setCls}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Class" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All classes</SelectItem>{classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      {loading && <p className="rounded-xl border border-border bg-card p-4 text-[14px] text-muted-foreground">Loading students...</p>}
      {!loading && rows.length === 0 && <EmptyState icon="Users" title="No students found" description="Try a different search or class filter." />}
      {!loading && rows.length > 0 && (
      <DataTable
        rows={filteredRows}
        columns={columns}
        getKey={(s) => s.id}
        mobileCard={(s) => (
          <div className="space-y-2">
            {nameCell(s)}
            <div className="flex flex-wrap gap-2">
              <StatusChip tone={STATUS_TONE[s.status]} label={s.status} />
              <StatusChip tone="info" label={s.classCode ?? "No class"} />
            </div>
          </div>
        )}
      />
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5"><Label>Admission number</Label><Input value={studentForm.admissionNo} onChange={(event) => setStudentForm((current) => ({ ...current, admissionNo: event.target.value }))} placeholder="ADM-001" /></div>
            <div className="space-y-1.5"><Label>Student name</Label><Input value={studentForm.displayName} onChange={(event) => setStudentForm((current) => ({ ...current, displayName: event.target.value }))} placeholder="Student full name" /></div>
            <div className="space-y-1.5">
              <Label>Class</Label>
              <Select value={studentForm.classId} onValueChange={(value) => setStudentForm((current) => ({ ...current, classId: value }))}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>{classes.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Roll number</Label><Input value={studentForm.rollNo} onChange={(event) => setStudentForm((current) => ({ ...current, rollNo: event.target.value }))} placeholder="Optional" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button disabled={saving || !studentForm.admissionNo.trim() || !studentForm.displayName.trim() || !studentForm.classId} onClick={() => void handleCreateStudent()}>Create student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader, StatusChip } from "../../components/shared/primitives";
import { Icon } from "../../components/shared/icon";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { cn } from "../../components/ui/utils";
import { colorFor, initials } from "../../lib/mock-data";
import type { AttendanceStatus } from "../../lib/types";
import {
  getOrCreateAttendanceSession,
  listAttendanceClasses,
  saveAttendanceDraft,
  submitAttendance,
  type AttendanceClassSummary,
  type AttendanceSession,
} from "../../lib/attendance-api";

const STATUS_META: Record<AttendanceStatus, { label: string; tone: "success" | "danger" | "warning" | "info" }> = {
  present: { label: "Present", tone: "success" },
  absent: { label: "Absent", tone: "danger" },
  late: { label: "Late", tone: "warning" },
  leave: { label: "Leave", tone: "info" },
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function TakeAttendance() {
  const [classes, setClasses] = useState<AttendanceClassSummary[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [date, setDate] = useState(today());
  const [session, setSession] = useState<AttendanceSession | null>(null);
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({});
  const [query, setQuery] = useState("");
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listAttendanceClasses()
      .then((items) => {
        if (cancelled) return;
        setClasses(items);
        setSelectedClassId((current) => current || items[0]?.id || "");
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load classes");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getOrCreateAttendanceSession(selectedClassId, date)
      .then((next) => {
        if (cancelled) return;
        setSession(next);
        setMarks(next.records);
        setDirty(false);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load attendance session");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedClassId, date]);

  const locked = session?.status === "submitted";

  const set = (id: string, status: AttendanceStatus) => {
    if (locked) return;
    setMarks((m) => ({ ...m, [id]: status }));
    setDirty(true);
  };

  const markAllPresent = () => {
    if (!session || locked) return;
    setMarks(Object.fromEntries(session.students.map((s) => [s.id, "present" as AttendanceStatus])));
    setDirty(true);
  };

  const summary = useMemo(() => {
    const counts = { present: 0, absent: 0, late: 0, leave: 0 };
    Object.values(marks).forEach((s) => counts[s]++);
    return counts;
  }, [marks]);

  const filtered = (session?.students ?? []).filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));

  const records = () => Object.entries(marks).map(([studentId, status]) => ({ studentId, status }));

  async function save() {
    if (!session || locked) return;
    setSaving(true);
    setError(null);
    try {
      const next = await saveAttendanceDraft(session.id, records());
      setSession(next);
      setMarks(next.records);
      setDirty(false);
      toast.success(`Attendance saved for ${next.className}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save attendance");
    } finally {
      setSaving(false);
    }
  }

  async function submit() {
    if (!session || locked) return;
    setSaving(true);
    setError(null);
    try {
      const next = await submitAttendance(session.id, records());
      setSession(next);
      setMarks(next.records);
      setDirty(false);
      toast.success(`Attendance submitted for ${next.className}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit attendance");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5 pb-4">
      <PageHeader
        title="Take Attendance"
        subtitle={session ? `${session.className} · ${session.subject ?? "Attendance"} · ${date}` : "Load a class to mark attendance"}
        actions={
          <div className="flex items-center gap-2">
            <Select value={selectedClassId} onValueChange={setSelectedClassId} disabled={loading || classes.length === 0}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Class" /></SelectTrigger>
              <SelectContent>
                {classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="w-40" />
          </div>
        }
      />

      {error && <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-[14px] text-destructive">{error}</div>}

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3">
        <StatusChip tone="success" label={`${summary.present} present`} icon="Check" />
        <StatusChip tone="danger" label={`${summary.absent} absent`} icon="X" />
        <StatusChip tone="warning" label={`${summary.late} late`} icon="Clock" />
        <StatusChip tone="info" label={`${summary.leave} leave`} icon="Plane" />
        <span className="ml-auto text-[13px] text-muted-foreground">{locked ? "Submitted attendance is locked." : "Tip: everyone starts Present — just tap the exceptions."}</span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button variant="outline" onClick={markAllPresent} disabled={!session || locked || loading}><Icon name="CheckCheck" className="size-4" /> Mark all present</Button>
        <div className="relative flex-1">
          <Icon name="Search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search student..." className="pl-9" />
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-border bg-card p-6 text-[14px] text-muted-foreground">Loading attendance...</div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((s) => (
            <li key={s.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white" style={{ backgroundColor: colorFor(s.name) }}>
                  {initials(s.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium">{s.name}</p>
                  <p className="text-[12px] text-muted-foreground">Roll {s.rollNo}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1.5 sm:flex">
                {(Object.keys(STATUS_META) as AttendanceStatus[]).map((st) => {
                  const active = marks[s.id] === st;
                  const meta = STATUS_META[st];
                  return (
                    <button
                      key={st}
                      onClick={() => set(s.id, st)}
                      aria-pressed={active}
                      disabled={locked}
                      className={cn(
                        "min-h-[44px] rounded-lg border px-3 text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-70",
                        active
                          ? {
                              success: "border-success bg-success text-success-foreground",
                              danger: "border-destructive bg-destructive text-destructive-foreground",
                              warning: "border-warning bg-warning text-warning-foreground",
                              info: "border-info bg-info text-info-foreground",
                            }[meta.tone]
                          : "border-border bg-card hover:bg-muted",
                      )}
                    >
                      {meta.label}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="sticky bottom-20 z-20 flex items-center justify-between gap-3 rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur lg:bottom-4">
        <p className="flex items-center gap-2 text-[13px]">
          {locked ? (
            <StatusChip tone="success" label="Submitted" icon="Lock" />
          ) : dirty ? (
            <StatusChip tone="warning" label="Unsaved changes" icon="Circle" />
          ) : (
            <StatusChip tone="muted" label="Saved draft" />
          )}
        </p>
        <div className="flex gap-2">
          <Button size="lg" variant="outline" onClick={save} disabled={!session || locked || saving || !dirty}>
            <Icon name="Save" className="size-4" /> Save Draft
          </Button>
          <Button size="lg" onClick={submit} disabled={!session || locked || saving}>
            <Icon name="Send" className="size-4" /> Submit
          </Button>
        </div>
      </div>
    </div>
  );
}


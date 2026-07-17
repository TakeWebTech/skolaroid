import { useEffect, useState } from "react";
import { PageHeader, SectionCard, EmptyState } from "../../components/shared/primitives";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Icon } from "../../components/shared/icon";
import { toast } from "sonner";
import { AcademicClassRow, createAcademicClass, getAcademicStructure } from "../../lib/academics-api";

export function AcademicSetup() {
  const [classes, setClasses] = useState<AcademicClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", subject: "", room: "" });

  function load() {
    setLoading(true);
    getAcademicStructure()
      .then((data) => setClasses(data.classes))
      .catch((error: Error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function addClass() {
    if (!form.code.trim() || !form.name.trim() || saving) return;
    setSaving(true);
    try {
      await createAcademicClass(form);
      setForm({ code: "", name: "", subject: "", room: "" });
      toast.success("Class created");
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Class could not be created");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Academic setup" subtitle="Create the classes and sections used across attendance, exams, fees, and learning" />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <SectionCard title="Create class">
          <div className="space-y-4">
            <div className="space-y-1.5"><Label>Class code</Label><Input value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))} placeholder="7B" /></div>
            <div className="space-y-1.5"><Label>Class name</Label><Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Class 7B" /></div>
            <div className="space-y-1.5"><Label>Primary subject</Label><Input value={form.subject} onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))} placeholder="Mathematics" /></div>
            <div className="space-y-1.5"><Label>Room</Label><Input value={form.room} onChange={(event) => setForm((current) => ({ ...current, room: event.target.value }))} placeholder="R-201" /></div>
            <Button className="w-full" disabled={saving || !form.code.trim() || !form.name.trim()} onClick={() => void addClass()}><Icon name="Plus" className="size-4" /> Create class</Button>
          </div>
        </SectionCard>

        <SectionCard title="Classes" description={`${classes.length} created`} bodyClassName="p-0">
          {loading && <p className="px-5 py-4 text-[14px] text-muted-foreground">Loading classes...</p>}
          {!loading && classes.length === 0 && <div className="p-5"><EmptyState icon="GraduationCap" title="No classes yet" description="Create your first class to unlock student enrollment and attendance." /></div>}
          {!loading && classes.length > 0 && (
            <ul className="divide-y divide-border">
              {classes.map((item) => (
                <li key={item.id} className="flex items-center gap-4 px-5 py-3.5">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 font-semibold text-primary">{item.code}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-[13px] text-muted-foreground">{item.subject || "No subject"} · {item.room || "No room"} · {item.students} students</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

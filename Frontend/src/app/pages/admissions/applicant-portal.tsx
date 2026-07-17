import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { PageHeader, SectionCard, StatusChip } from "../../components/shared/primitives";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/shared/icon";
import { createApplication } from "../../lib/admissions-api";
import { toast } from "sonner";

export function ApplicantPortal() {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("");
  const [grade, setGrade] = useState("Grade 7");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [notes, setNotes] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    try { await createApplication({ studentName, grade, guardianName, guardianPhone, guardianEmail, notes }); toast.success("Application submitted"); navigate("/admissions"); } catch (err) { toast.error(err instanceof Error ? err.message : "Could not submit application"); }
  }
  return (
    <div className="space-y-6">
      <PageHeader title="Apply for admission" subtitle="Create a real application record" actions={<StatusChip tone="primary" label="Applications open" icon="CalendarCheck" />} />
      <form onSubmit={submit}><SectionCard title="Application details"><div className="grid gap-4 sm:grid-cols-2"><Field label="Student full name"><Input value={studentName} onChange={(e) => setStudentName(e.target.value)} required /></Field><Field label="Grade"><Input value={grade} onChange={(e) => setGrade(e.target.value)} required /></Field><Field label="Guardian name"><Input value={guardianName} onChange={(e) => setGuardianName(e.target.value)} required /></Field><Field label="Guardian phone"><Input value={guardianPhone} onChange={(e) => setGuardianPhone(e.target.value)} required /></Field><Field label="Guardian email"><Input type="email" value={guardianEmail} onChange={(e) => setGuardianEmail(e.target.value)} /></Field><div className="sm:col-span-2"><Field label="Notes"><Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} /></Field></div></div><div className="mt-5 flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => navigate("/admissions")}>Cancel</Button><Button><Icon name="Send" className="size-4" /> Submit application</Button></div></SectionCard></form>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>; }

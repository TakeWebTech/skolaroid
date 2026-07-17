import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { PageHeader, SectionCard, StatusChip } from "../../components/shared/primitives";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Icon } from "../../components/shared/icon";
import { createExam, listExamClasses, type ExamClassSummary } from "../../lib/exams-api";
import { toast } from "sonner";

export function ExamSetup() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ExamClassSummary[]>([]);
  const [classId, setClassId] = useState("");
  const [name, setName] = useState("Unit Test 2");
  const [term, setTerm] = useState("Term 2");
  const [subject, setSubject] = useState("Mathematics");
  const [maxMarks, setMaxMarks] = useState(25);
  const [startDate, setStartDate] = useState("2026-07-20");
  const [endDate, setEndDate] = useState("2026-07-20");
  useEffect(() => { listExamClasses().then((items) => { setClasses(items); setClassId(items[0]?.id ?? ""); }).catch((e) => toast.error(e instanceof Error ? e.message : "Could not load classes")); }, []);
  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      await createExam({ classId, name, term, subject, maxMarks, startDate, endDate });
      toast.success("Exam created");
      navigate("/exams");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Could not create exam"); }
  }
  return (
    <div className="space-y-6">
      <PageHeader title="Exam setup" subtitle="Create a class and subject exam for marks entry" actions={<StatusChip tone="primary" label="Setup" icon="FilePenLine" />} />
      <form onSubmit={submit}>
        <SectionCard title="Exam details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Exam name"><Input value={name} onChange={(e) => setName(e.target.value)} required /></Field>
            <Field label="Class"><Select value={classId} onValueChange={setClassId}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Term"><Input value={term} onChange={(e) => setTerm(e.target.value)} required /></Field>
            <Field label="Subject"><Input value={subject} onChange={(e) => setSubject(e.target.value)} required /></Field>
            <Field label="Max marks"><Input type="number" min={1} max={500} value={maxMarks} onChange={(e) => setMaxMarks(Number(e.target.value))} required /></Field>
            <Field label="Start date"><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required /></Field>
            <Field label="End date"><Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required /></Field>
          </div>
          <div className="mt-5 flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => navigate("/exams")}>Cancel</Button><Button><Icon name="Check" className="size-4" /> Create exam</Button></div>
        </SectionCard>
      </form>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>; }

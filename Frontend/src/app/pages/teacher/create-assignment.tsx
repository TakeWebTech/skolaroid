import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { PageHeader, SectionCard } from "../../components/shared/primitives";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Icon } from "../../components/shared/icon";
import { listAttendanceClasses, type AttendanceClassSummary } from "../../lib/attendance-api";
import { createAssignment, publishAssignment } from "../../lib/assignments-api";
import { toast } from "sonner";

export function CreateAssignment() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<AttendanceClassSummary[]>([]);
  const [classId, setClassId] = useState("");
  const [title, setTitle] = useState("Algebra Worksheet 5");
  const [subject, setSubject] = useState("Mathematics");
  const [instructions, setInstructions] = useState("Complete questions 1-12. Show all working.");
  const [dueDate, setDueDate] = useState("2026-07-20");
  const [totalMarks, setTotalMarks] = useState(20);
  const [submissionType, setSubmissionType] = useState<"text" | "file" | "offline">("text");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listAttendanceClasses()
      .then((items) => {
        setClasses(items);
        setClassId(items[0]?.id ?? "");
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Could not load classes"));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!classId) {
      toast.error("Select a class");
      return;
    }
    setSubmitting(true);
    try {
      const assignment = await createAssignment({
        classId,
        title,
        subject,
        instructions,
        dueAt: `${dueDate}T18:00:00.000Z`,
        totalMarks,
        submissionType,
      });
      await publishAssignment(assignment.id);
      toast.success("Assignment created and published");
      navigate("/teacher/assessments");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create assignment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Create Assignment" subtitle="Publish homework to a real class roster" />
      <form onSubmit={submit}>
        <SectionCard title="Assignment details" description="Publishing creates one task for each active student enrollment.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title"><Input value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={160} /></Field>
            <Field label="Class">
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>{classes.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Subject"><Input value={subject} onChange={(event) => setSubject(event.target.value)} required maxLength={80} /></Field>
            <Field label="Due date"><Input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} required /></Field>
            <Field label="Total marks"><Input type="number" min={1} max={500} value={totalMarks} onChange={(event) => setTotalMarks(Number(event.target.value))} required /></Field>
            <Field label="Submission type">
              <Select value={submissionType} onValueChange={(value) => setSubmissionType(value as "text" | "file" | "offline")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text response</SelectItem>
                  <SelectItem value="file">File metadata</SelectItem>
                  <SelectItem value="offline">Offline/in class</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Instructions"><Textarea rows={5} value={instructions} onChange={(event) => setInstructions(event.target.value)} required maxLength={4000} /></Field>
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate("/teacher/assessments")}>Cancel</Button>
            <Button type="submit" disabled={submitting}><Icon name="Send" className="size-4" /> {submitting ? "Publishing..." : "Publish"}</Button>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

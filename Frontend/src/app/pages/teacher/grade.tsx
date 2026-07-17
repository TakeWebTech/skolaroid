import { useEffect, useState } from "react";
import { PageHeader, SectionCard, StatusChip, EmptyState } from "../../components/shared/primitives";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Icon } from "../../components/shared/icon";
import { cn } from "../../components/ui/utils";
import { colorFor, initials } from "../../lib/mock-data";
import { gradeSubmission, listGradeQueue, type GradeQueueItem } from "../../lib/assignments-api";
import { toast } from "sonner";

export function GradeSubmissions() {
  const [queue, setQueue] = useState<GradeQueueItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [marks, setMarks] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const current = queue[idx];

  function load() {
    setLoading(true);
    listGradeQueue()
      .then((items) => {
        setQueue(items);
        setIdx(0);
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Could not load submissions"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setMarks(current?.marksAwarded ?? 0);
    setFeedback(current?.feedback ?? "");
  }, [current]);

  async function publishGrade() {
    if (!current) return;
    try {
      await gradeSubmission(current.submissionId, marks, feedback);
      toast.success(`Feedback published to ${current.studentName}`);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not publish grade");
    }
  }

  if (loading) {
    return <div className="space-y-6"><PageHeader title="Grade Submissions" subtitle="Submitted homework queue" /><p className="rounded-xl border border-border bg-card p-4 text-[14px] text-muted-foreground">Loading submissions...</p></div>;
  }

  if (!current) {
    return <div className="space-y-6"><PageHeader title="Grade Submissions" subtitle="Submitted homework queue" /><EmptyState icon="CheckCircle2" title="No submitted work to grade" description="Student submissions will appear here after tasks are submitted." /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Grade Submissions" subtitle={`${current.assignmentTitle} · Class ${current.classCode}`} actions={<StatusChip tone="info" label={`${queue.length} submissions`} />} />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <SectionCard title="Student queue" bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {queue.map((item, i) => (
              <li key={item.submissionId}>
                <button onClick={() => setIdx(i)} className={cn("flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-muted", i === idx && "bg-accent")}>
                  <span className="flex size-8 items-center justify-center rounded-full text-[12px] font-semibold text-white" style={{ backgroundColor: colorFor(item.studentName) }}>{initials(item.studentName)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px]">{item.studentName}</span>
                    <span className="block text-[12px] text-muted-foreground">Roll {item.rollNo ?? "-"}</span>
                  </span>
                  {item.status === "graded" && <Icon name="CheckCircle2" className="size-4 text-success" />}
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title={current.studentName} description="Submission response">
            <div className="rounded-lg border border-border bg-muted/40 p-4 text-[14px]">
              {current.responseText ?? "No response text submitted."}
            </div>
          </SectionCard>
          <SectionCard title="Marks & feedback">
            <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
              <div className="space-y-1.5"><label className="text-[14px] font-medium">Marks / {current.totalMarks}</label><Input type="number" min={0} max={current.totalMarks} value={marks} onChange={(event) => setMarks(Number(event.target.value))} /></div>
              <div className="space-y-1.5"><label className="text-[14px] font-medium">Feedback</label><Textarea rows={3} value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="Clear, useful feedback for the student." /></div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <StatusChip tone={current.status === "graded" ? "success" : "muted"} label={current.status === "graded" ? "Already graded" : "Ready to grade"} icon={current.status === "graded" ? "Check" : "Save"} />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => idx < queue.length - 1 && setIdx(idx + 1)}>Skip</Button>
                <Button onClick={publishGrade}><Icon name="Send" className="size-4" /> Publish</Button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

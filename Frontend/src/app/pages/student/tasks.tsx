import { useEffect, useState } from "react";
import { PageHeader, SectionCard, StatusChip, EmptyState } from "../../components/shared/primitives";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/shared/icon";
import { Textarea } from "../../components/ui/textarea";
import { listMyTasks, submitTask, type StudentTask } from "../../lib/assignments-api";
import { toast } from "sonner";

const TONE = { assigned: "warning", submitted: "info", graded: "success" } as const;

export function StudentTasks() {
  const [tasks, setTasks] = useState<StudentTask[]>([]);
  const [active, setActive] = useState<StudentTask | null>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    listMyTasks()
      .then(setTasks)
      .catch((err) => toast.error(err instanceof Error ? err.message : "Could not load tasks"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function submit() {
    if (!active || !response.trim()) return;
    try {
      await submitTask(active.submissionId, response);
      toast.success("Submission sent");
      setActive(null);
      setResponse("");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit task");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Tasks" subtitle="Homework, reading and projects" />
      <SectionCard title="To do" bodyClassName="p-0">
        {loading && <p className="p-5 text-[14px] text-muted-foreground">Loading tasks...</p>}
        {!loading && tasks.length === 0 && <div className="p-5"><EmptyState icon="ClipboardList" title="No tasks assigned" description="Published homework will appear here." /></div>}
        {!loading && tasks.length > 0 && (
          <ul className="divide-y divide-border">
            {tasks.map((task) => (
              <li key={task.submissionId} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-[13px] text-muted-foreground">{task.subject} · due {new Date(task.dueAt).toLocaleDateString()} · {task.totalMarks} marks</p>
                  {task.feedback && <p className="mt-1 text-[13px] text-muted-foreground">Feedback: {task.feedback}</p>}
                </div>
                <StatusChip tone={TONE[task.status]} label={task.status} />
                {task.status === "graded" && <StatusChip tone="success" label={`${task.marksAwarded}/${task.totalMarks}`} />}
                {task.status !== "graded" && <Button size="sm" onClick={() => { setActive(task); setResponse(""); }}><Icon name="Upload" className="size-4" /> Submit</Button>}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
      {active && (
        <SectionCard title={`Submit ${active.title}`} description={active.instructions}>
          <Textarea rows={5} value={response} onChange={(event) => setResponse(event.target.value)} placeholder="Write your answer or paste file/link notes..." />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setActive(null)}>Cancel</Button>
            <Button onClick={submit} disabled={!response.trim()}><Icon name="Send" className="size-4" /> Send submission</Button>
          </div>
        </SectionCard>
      )}
      <SectionCard title="Completed">
        <EmptyState icon="CheckCircle2" title="Submitted and graded work stays in the list above" description="A separate archive view can be added after task history APIs are expanded." />
      </SectionCard>
    </div>
  );
}

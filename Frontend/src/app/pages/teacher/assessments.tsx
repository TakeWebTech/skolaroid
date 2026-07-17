import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { EmptyState, PageHeader, QuickAction, SectionCard, StatusChip } from "../../components/shared/primitives";
import { Icon } from "../../components/shared/icon";
import { Button } from "../../components/ui/button";
import { listAssignments, publishAssignment, type AssignmentSummary } from "../../lib/assignments-api";
import { toast } from "sonner";

export function TeacherAssessments() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<AssignmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    listAssignments()
      .then(setAssignments)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load assignments."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function publish(id: string) {
    try {
      await publishAssignment(id);
      toast.success("Assignment published");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not publish assignment");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Assessments" subtitle="Homework, quizzes, grading and marks" />
      <div className="grid gap-3 sm:grid-cols-3">
        <QuickAction icon="ClipboardPlus" label="Create Assignment" hint="Guided wizard" onClick={() => navigate("/teacher/assessments/new")} />
        <QuickAction icon="CheckSquare" label="Grade Submissions" hint="Review submitted work" tone="info" onClick={() => navigate("/teacher/assessments/grade")} />
        <QuickAction icon="PenLine" label="Enter Marks" hint="Unit Test 2" tone="success" onClick={() => navigate("/teacher/assessments/marks")} />
      </div>

      <SectionCard title="Active assignments" bodyClassName="p-0">
        {loading && <p className="p-5 text-[14px] text-muted-foreground">Loading assignments...</p>}
        {error && <div className="p-5"><EmptyState icon="ShieldAlert" title="Assignments unavailable" description={error} /></div>}
        {!loading && !error && assignments.length === 0 && <div className="p-5"><EmptyState icon="ClipboardList" title="No assignments yet" description="Create and publish the first class assignment." /></div>}
        {!loading && !error && assignments.length > 0 && (
          <ul className="divide-y divide-border">
            {assignments.map((assignment) => (
              <li key={assignment.id} className="flex flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{assignment.title}</p>
                  <p className="text-[13px] text-muted-foreground">
                    {assignment.className} · {assignment.submittedCount}/{assignment.assignedCount} submitted · due {new Date(assignment.dueAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusChip tone={assignment.status === "published" ? "success" : "warning"} label={assignment.status} />
                {assignment.status === "draft" ? (
                  <Button size="sm" onClick={() => publish(assignment.id)}>Publish</Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => navigate("/teacher/assessments/grade")}>Grade</Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Question bank" description="Create and reuse questions" action={<Button size="sm" variant="outline" disabled><Icon name="Lock" className="size-4" /> API pending</Button>}>
        <div className="flex flex-wrap gap-2">
          {["Integers", "Fractions", "Algebra", "Geometry", "Word Problems", "MCQ", "Hard", "Medium", "Easy"].map((t) => (
            <span key={t} className="rounded-full border border-border bg-muted px-3 py-1 text-[13px]">{t}</span>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

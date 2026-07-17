import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { EmptyState, PageHeader, SectionCard, StatusChip, StatCard } from "../../components/shared/primitives";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/shared/icon";
import { listExams, type ExamSummary } from "../../lib/exams-api";
import { toast } from "sonner";

const TONE = { published: "success", marks_submitted: "primary", marks_entry: "warning", draft: "info" } as const;

export function ExamsList() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { listExams().then(setExams).catch((e) => toast.error(e instanceof Error ? e.message : "Could not load exams")).finally(() => setLoading(false)); }, []);
  const pending = exams.filter((e) => e.status === "marks_entry").length;
  return (
    <div className="space-y-6">
      <PageHeader title="Examinations" subtitle="Setup, marks, results and report cards" actions={<Button onClick={() => navigate("/exams/setup")}><Icon name="Plus" className="size-4" /> New exam</Button>} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active exams" value={String(exams.length)} tone="primary" icon="FileText" />
        <StatCard label="Marks pending" value={String(pending)} tone="warning" icon="PenLine" />
        <StatCard label="Results published" value={String(exams.filter((e) => e.status === "published").length)} tone="success" icon="Send" />
      </div>
      <SectionCard title="All examinations" bodyClassName="p-0">
        {loading && <p className="p-5 text-[14px] text-muted-foreground">Loading exams...</p>}
        {!loading && exams.length === 0 && <div className="p-5"><EmptyState icon="FileText" title="No exams yet" description="Create an exam to open marks entry." /></div>}
        {!loading && exams.length > 0 && <ul className="divide-y divide-border">{exams.map((x) => (
          <li key={x.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1"><p className="font-medium">{x.name}</p><p className="text-[13px] text-muted-foreground">{x.term} · {x.className} · {x.subject} · {x.startDate} to {x.endDate}</p></div>
            <StatusChip tone={TONE[x.status]} label={x.status.replace("_", " ")} />
            <Button size="sm" variant="outline" onClick={() => navigate("/exams/results")}>Result review</Button>
          </li>
        ))}</ul>}
      </SectionCard>
    </div>
  );
}

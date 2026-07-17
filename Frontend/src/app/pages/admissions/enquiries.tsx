import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PageHeader, SectionCard, StatusChip, EmptyState } from "../../components/shared/primitives";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/shared/icon";
import { listApplications, type AdmissionApplication } from "../../lib/admissions-api";
import { toast } from "sonner";

const TONE = { New: "info", "Under review": "primary", Interview: "warning", Offered: "success", Rejected: "danger" } as const;
export function Enquiries() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { listApplications().then(setApps).catch((e) => toast.error(e instanceof Error ? e.message : "Could not load applications")).finally(() => setLoading(false)); }, []);
  return (
    <div className="space-y-6">
      <PageHeader title="Admissions" subtitle="Track prospective families and applications" actions={<><Button variant="outline" onClick={() => navigate("/admissions/review")}><Icon name="ClipboardCheck" className="size-4" /> Review applications</Button><Button onClick={() => navigate("/admissions/apply")}><Icon name="Plus" className="size-4" /> Add application</Button></>} />
      <SectionCard title="Applications" bodyClassName="p-0">
        {loading && <p className="p-5 text-[14px] text-muted-foreground">Loading applications...</p>}
        {!loading && apps.length === 0 && <div className="p-5"><EmptyState icon="Inbox" title="No applications yet" description="Create the first application from the applicant form." /></div>}
        {!loading && apps.length > 0 && <ul className="divide-y divide-border">{apps.map((a) => <li key={a.id} className="flex flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><p className="font-medium">{a.studentName}</p><p className="text-[13px] text-muted-foreground">{a.grade} · {a.guardianName} · {new Date(a.submittedAt).toLocaleDateString()}</p></div><StatusChip tone={TONE[a.stage]} label={a.stage} /><Button size="sm" variant="outline" onClick={() => navigate("/admissions/review")}>Review</Button></li>)}</ul>}
      </SectionCard>
    </div>
  );
}

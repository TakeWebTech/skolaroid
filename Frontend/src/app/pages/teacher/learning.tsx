import { useState } from "react";
import { PageHeader, SectionCard, StatusChip } from "../../components/shared/primitives";
import { Icon } from "../../components/shared/icon";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

const OUTLINE = [
  { id: "u1", title: "Unit 1 · Integers", lessons: 5, published: true },
  { id: "u2", title: "Unit 2 · Fractions & Decimals", lessons: 6, published: true },
  { id: "u3", title: "Unit 3 · Algebraic Expressions", lessons: 4, published: false },
  { id: "u4", title: "Unit 4 · Geometry Basics", lessons: 7, published: false },
];

export function TeacherLearning() {
  const [selected, setSelected] = useState(OUTLINE[2]);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Course & Lesson"
        subtitle="Class 8A · Mathematics"
        actions={<Button onClick={() => toast.success("Lesson published to Class 8A")}><Icon name="Upload" className="size-4" /> Publish</Button>}
      />
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <SectionCard title="Course outline" bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {OUTLINE.map((u) => (
              <li key={u.id}>
                <button onClick={() => setSelected(u)} className={`flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-muted ${selected.id === u.id ? "bg-accent" : ""}`}>
                  <Icon name={u.published ? "BookOpenCheck" : "BookOpen"} className="size-4 text-muted-foreground" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium">{u.title}</span>
                    <span className="block text-[12px] text-muted-foreground">{u.lessons} lessons</span>
                  </span>
                  <StatusChip tone={u.published ? "success" : "muted"} label={u.published ? "Published" : "Draft"} />
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title={selected.title} action={<StatusChip tone={selected.published ? "success" : "warning"} label={selected.published ? "Published" : "Draft"} />}>
            <p className="text-muted-foreground">Lesson content, learning outcomes and resources appear here. Draft and published states are visually distinct so nothing is released by accident.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { icon: "FileText", label: "Lesson notes.pdf", meta: "820 KB" },
                { icon: "Video", label: "Intro video", meta: "6:24" },
                { icon: "Presentation", label: "Slides.pptx", meta: "3.1 MB" },
                { icon: "ListChecks", label: "Practice worksheet", meta: "12 questions" },
              ].map((r) => (
                <div key={r.label} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Icon name={r.icon} className="size-5 text-primary" />
                  <div className="min-w-0"><p className="truncate text-[14px] font-medium">{r.label}</p><p className="text-[12px] text-muted-foreground">{r.meta}</p></div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline"><Icon name="Plus" className="size-4" /> Add material</Button>
              <Button variant="ghost" onClick={() => toast.success("Draft saved")}><Icon name="Save" className="size-4" /> Save draft</Button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

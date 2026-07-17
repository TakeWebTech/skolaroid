import { PageHeader, SectionCard, StatusChip } from "../../components/shared/primitives";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Icon } from "../../components/shared/icon";
import { useApp, atLeast } from "../../store/app-context";
import type { ExperienceLevel, Lang } from "../../lib/types";
import { LANGS } from "../../lib/i18n";
import { toast } from "sonner";

export function Profile() {
  const { experience, setExperience, offline, setOffline, lang, setLang } = useApp();
  return (
    <div className="space-y-6">
      <PageHeader title="Profile & Preferences" subtitle="Language, accessibility, security and experience level" actions={<Button onClick={() => toast.success("Preferences saved")}><Icon name="Save" className="size-4" /> Save preferences</Button>} />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Profile">
          <div className="space-y-4">
            <div className="space-y-1.5"><Label>Full name</Label><Input defaultValue="Ravi Sharma" /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input defaultValue="" placeholder="Your email" /></div>
            <div className="space-y-1.5"><Label>Phone</Label><Input defaultValue="+91 98765 43210" /></div>
          </div>
        </SectionCard>

        <SectionCard title="Language & accessibility">
          <div className="space-y-4">
            <div className="space-y-1.5"><Label>Language</Label>
              <Select value={lang} onValueChange={(v) => { setLang(v as Lang); toast.success("Language updated"); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{LANGS.map((l) => <SelectItem key={l.code} value={l.code}>{l.native}{l.code !== "en" ? ` (${l.label})` : ""}</SelectItem>)}</SelectContent></Select>
            </div>
            <label className="flex items-center justify-between rounded-lg border border-border p-3"><span><span className="block font-medium">Larger text</span><span className="block text-[13px] text-muted-foreground">Increase font size across the app</span></span><Switch /></label>
            <label className="flex items-center justify-between rounded-lg border border-border p-3"><span><span className="block font-medium">Simulate offline</span><span className="block text-[13px] text-muted-foreground">Preview offline banner & sync state</span></span><Switch checked={offline} onCheckedChange={setOffline} /></label>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Experience level" description="Changes what you see — never your permissions">
        <div className="grid gap-3 sm:grid-cols-3">
          {(["beginner", "standard", "advanced"] as ExperienceLevel[]).map((lvl) => {
            const active = experience === lvl;
            return (
              <button key={lvl} onClick={() => setExperience(lvl)} className={`rounded-xl border p-4 text-left ${active ? "border-primary bg-accent" : "border-border"}`}>
                <div className="flex items-center justify-between"><span className="font-medium capitalize">{lvl}</span>{active && <Icon name="CheckCircle2" className="size-5 text-primary" />}</div>
                <p className="mt-1 text-[13px] text-muted-foreground">{lvl === "beginner" ? "Guided steps and minimal choices." : lvl === "standard" ? "Full daily controls and shortcuts." : "Bulk tools, automation and analytics."}</p>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Security & sessions">
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border p-3"><div><p className="font-medium">Two-factor authentication</p><p className="text-[13px] text-muted-foreground">Add a second step at sign-in</p></div><StatusChip tone="success" label="On" icon="ShieldCheck" /></div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3"><div><p className="font-medium">This device · Chrome on Windows</p><p className="text-[13px] text-muted-foreground">Active now · Bengaluru</p></div><StatusChip tone="info" label="Current" /></div>
          {atLeast(experience, "advanced") && (
            <div className="flex items-center justify-between rounded-lg border border-border p-3"><div><p className="font-medium">Android app · Pixel</p><p className="text-[13px] text-muted-foreground">Last active 2h ago</p></div><Button size="sm" variant="outline">Sign out</Button></div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

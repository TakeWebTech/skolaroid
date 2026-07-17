import { useEffect, useMemo, useState } from "react";
import { PageHeader, SectionCard, StatusChip } from "../../components/shared/primitives";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Icon } from "../../components/shared/icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import { toast } from "sonner";
import { AnnouncementAudience, createAnnouncement, listAnnouncementAudiences, sendAnnouncement } from "../../lib/communication-api";

export function Announcement() {
  const [audiences, setAudiences] = useState<AnnouncementAudience[]>([]);
  const [audience, setAudience] = useState("all");
  const [title, setTitle] = useState("Parent-Teacher Meeting on 24 July");
  const [body, setBody] = useState("Dear parents, our PTM is scheduled for Saturday, 24 July from 9 AM to 1 PM. Please book your slot in advance.");
  const [preview, setPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const selectedAudience = useMemo(() => audiences.find((item) => item.id === audience), [audience, audiences]);
  const count = selectedAudience?.count ?? 0;

  useEffect(() => {
    listAnnouncementAudiences()
      .then((data) => {
        setAudiences(data);
        setAudience((current) => data.some((item) => item.id === current) ? current : data[0]?.id ?? "all");
      })
      .catch((error: Error) => toast.error(error.message));
  }, []);

  async function handleSend() {
    if (!title.trim() || !body.trim() || sending) return;
    setSending(true);
    try {
      const created = await createAnnouncement({ title: title.trim(), body: body.trim(), audienceRole: audience });
      await sendAnnouncement(created.id);
      setPreview(false);
      toast.success(`Announcement sent to ${count.toLocaleString()} recipients`);
      setTitle("");
      setBody("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Announcement could not be sent");
    } finally {
      setSending(false);
    }
  }

  async function handleSaveDraft() {
    if (!title.trim() || !body.trim() || saving) return;
    setSaving(true);
    try {
      await createAnnouncement({ title: title.trim(), body: body.trim(), audienceRole: audience });
      toast.success("Draft saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Draft could not be saved");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="New announcement" subtitle="Send the right message to the right audience" />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <SectionCard title="Message">
          <div className="space-y-4">
            <div className="space-y-1.5"><Label>Title</Label><Input value={title} onChange={(event) => setTitle(event.target.value)} /></div>
            <div className="space-y-1.5"><Label>Message</Label><Textarea rows={5} value={body} onChange={(event) => setBody(event.target.value)} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Channel</Label><Select defaultValue="app"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="app">In-app + SMS</SelectItem><SelectItem value="appemail">In-app + Email</SelectItem><SelectItem value="all">All channels</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Schedule</Label><Select defaultValue="now"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="now">Send now</SelectItem><SelectItem value="later">Schedule later</SelectItem></SelectContent></Select></div>
            </div>
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Audience">
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {audiences.map((item) => <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="mt-3 rounded-lg bg-info-subtle px-3 py-2 text-[13px] text-info-subtle-foreground">
              <Icon name="Users" className="mr-1 inline size-4 align-text-bottom" /> This will reach <b>{count.toLocaleString()} recipients</b>.
            </div>
          </SectionCard>
          <div className="flex flex-col gap-2">
            <Button variant="outline" disabled={saving || !title.trim() || !body.trim()} onClick={() => void handleSaveDraft()}><Icon name="Save" className="size-4" /> Save draft</Button>
            <Button variant="outline" disabled={!title.trim() || !body.trim()} onClick={() => setPreview(true)}><Icon name="Eye" className="size-4" /> Preview</Button>
            <Button disabled={!title.trim() || !body.trim()} onClick={() => setPreview(true)}><Icon name="Send" className="size-4" /> Send</Button>
          </div>
        </div>
      </div>

      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send to {count.toLocaleString()} recipients?</DialogTitle>
            <DialogDescription>Review the recipient count before sending. You can't unsend delivered messages.</DialogDescription>
          </DialogHeader>
          <StatusChip tone="warning" label={`${count.toLocaleString()} recipients · In-app + SMS`} icon="Send" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreview(false)}>Back</Button>
            <Button disabled={sending} onClick={() => void handleSend()}>Send now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

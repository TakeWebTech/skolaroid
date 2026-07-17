import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../components/shared/primitives";
import { Icon } from "../../components/shared/icon";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { initials, colorFor } from "../../lib/mock-data";
import { cn } from "../../components/ui/utils";
import { toast } from "sonner";
import { ConversationDetail, MessageThread, getThread, listThreads, sendMessage } from "../../lib/communication-api";

export function Messaging({ title = "Messages" }: { title?: string }) {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [draft, setDraft] = useState("");
  const active = useMemo(() => threads.find((thread) => thread.id === activeId) ?? threads[0], [activeId, threads]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    listThreads()
      .then((data) => {
        if (!alive) return;
        setThreads(data);
        setActiveId((current) => current ?? data[0]?.id ?? null);
      })
      .catch((error: Error) => toast.error(error.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!active?.id) {
      setConversation(null);
      return;
    }
    let alive = true;
    getThread(active.id)
      .then((data) => alive && setConversation(data))
      .catch((error: Error) => toast.error(error.message));
    return () => {
      alive = false;
    };
  }, [active?.id]);

  async function handleSend() {
    const body = draft.trim();
    if (!body || !active?.id || sending) return;
    setSending(true);
    try {
      await sendMessage(active.id, body);
      setDraft("");
      const [threadData, conversationData] = await Promise.all([listThreads(), getThread(active.id)]);
      setThreads(threadData);
      setConversation(conversationData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Message could not be sent");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader title={title} subtitle="Safe, role-respecting communication" actions={<Button><Icon name="PenSquare" className="size-4" /> New message</Button>} />
      <div className="grid gap-0 overflow-hidden rounded-xl border border-border bg-card lg:grid-cols-[300px_1fr]">
        <div className="border-b border-border lg:border-b-0 lg:border-r">
          <div className="border-b border-border p-3">
            <div className="relative"><Icon name="Search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search conversations" className="pl-9" /></div>
          </div>
          <ul className="divide-y divide-border">
            {loading && <li className="px-4 py-6 text-[14px] text-muted-foreground">Loading conversations...</li>}
            {!loading && threads.length === 0 && <li className="px-4 py-6 text-[14px] text-muted-foreground">No conversations available for your current role.</li>}
            {threads.map((t) => (
              <li key={t.id}>
                <button onClick={() => setActiveId(t.id)} className={cn("flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted", active?.id === t.id && "bg-accent")}>
                  <span className="flex size-9 items-center justify-center rounded-full text-[12px] font-semibold text-white" style={{ backgroundColor: colorFor(t.title) }}>{initials(t.title)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between"><span className="truncate text-[14px] font-medium">{t.title}</span><span className="text-[11px] text-muted-foreground">{new Date(t.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></span>
                    <span className="block truncate text-[13px] text-muted-foreground">{t.last}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex min-h-[420px] flex-col">
          {active ? (
            <>
              <div className="flex items-center gap-3 border-b border-border p-3">
                <span className="flex size-9 items-center justify-center rounded-full text-[12px] font-semibold text-white" style={{ backgroundColor: colorFor(active.title) }}>{initials(active.title)}</span>
                <div><p className="font-medium">{active.title}</p><p className="text-[12px] text-muted-foreground">Messages respect your active school context</p></div>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4">
                {conversation?.messages.map((m) => (
                  <div key={m.id} className={cn("flex", m.mine ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[75%] rounded-2xl px-3.5 py-2 text-[14px]", m.mine ? "bg-primary text-primary-foreground" : "bg-card border border-border")}>
                      {!m.mine && <div className="mb-1 text-[11px] font-medium text-muted-foreground">{m.senderName}</div>}
                      {m.body}<span className={cn("ml-2 text-[10px]", m.mine ? "text-primary-foreground/70" : "text-muted-foreground")}>{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                ))}
                {!conversation && <div className="text-[14px] text-muted-foreground">Loading messages...</div>}
              </div>
              <div className="flex items-center gap-2 border-t border-border p-3">
                <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message..." onKeyDown={(e) => { if (e.key === "Enter") void handleSend(); }} />
                <Button size="icon" disabled={sending || !draft.trim()} onClick={() => void handleSend()}><Icon name="Send" className="size-4" /></Button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-6 text-[14px] text-muted-foreground">
              No conversation selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

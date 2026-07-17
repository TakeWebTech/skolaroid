import { authenticatedRequest } from "./auth-api";

export interface MessageThread {
  id: string;
  title: string;
  last: string;
  updatedAt: string;
}

export interface ConversationMessage {
  id: string;
  senderId: string;
  senderName: string;
  body: string;
  createdAt: string;
  mine: boolean;
}

export interface ConversationDetail {
  id: string;
  title: string;
  messages: ConversationMessage[];
}

export interface AnnouncementAudience {
  id: string;
  label: string;
  count: number;
}

export interface AnnouncementRecord {
  id: string;
  title: string;
  body: string;
  audienceRole: string;
  status: string;
  createdAt: string;
  sentAt: string | null;
}

export interface AnnouncementFeedItem {
  id: string;
  title: string;
  body: string;
  audienceRole: string;
  by: string;
  sentAt: string;
}

export function listAnnouncements() {
  return authenticatedRequest<AnnouncementFeedItem[]>("/announcements");
}

export function listThreads() {
  return authenticatedRequest<MessageThread[]>("/messages/threads");
}

export function getThread(id: string) {
  return authenticatedRequest<ConversationDetail>(`/messages/threads/${id}`);
}

export function sendMessage(conversationId: string, body: string) {
  return authenticatedRequest<ConversationMessage>("/messages", {
    method: "POST",
    body: JSON.stringify({ conversationId, body }),
  });
}

export function listAnnouncementAudiences() {
  return authenticatedRequest<AnnouncementAudience[]>("/announcement/audiences");
}

export function createAnnouncement(payload: { title: string; body: string; audienceRole: string }) {
  return authenticatedRequest<AnnouncementRecord>("/announcements", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function sendAnnouncement(id: string) {
  return authenticatedRequest<AnnouncementRecord>(`/announcements/${id}/send`, {
    method: "POST",
  });
}

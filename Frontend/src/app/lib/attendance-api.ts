import { authenticatedRequest } from "./auth-api";
import type { AttendanceStatus } from "./types";

export interface AttendanceClassSummary {
  id: string;
  code: string;
  name: string;
  subject: string | null;
  room: string | null;
}

export interface AttendanceStudent {
  id: string;
  name: string;
  rollNo: string;
}

export interface AttendanceSession {
  id: string;
  classId: string;
  className: string;
  classCode: string;
  subject: string | null;
  date: string;
  status: "draft" | "submitted";
  students: AttendanceStudent[];
  records: Record<string, AttendanceStatus>;
}

export interface AttendanceRecordInput {
  studentId: string;
  status: AttendanceStatus;
}

export function listAttendanceClasses() {
  return authenticatedRequest<AttendanceClassSummary[]>("/attendance/classes");
}

export function getOrCreateAttendanceSession(classId: string, date: string) {
  return authenticatedRequest<AttendanceSession>(`/attendance/classes/${classId}/session`, {
    method: "POST",
    body: JSON.stringify({ date }),
  });
}

export function saveAttendanceDraft(sessionId: string, records: AttendanceRecordInput[]) {
  return authenticatedRequest<AttendanceSession>(`/attendance/sessions/${sessionId}/draft`, {
    method: "PUT",
    body: JSON.stringify({ records }),
  });
}

export function submitAttendance(sessionId: string, records: AttendanceRecordInput[]) {
  return authenticatedRequest<AttendanceSession>(`/attendance/sessions/${sessionId}/submit`, {
    method: "POST",
    body: JSON.stringify({ records }),
  });
}


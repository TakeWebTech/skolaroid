import type { AttendanceMarkStatus } from "./attendance.dto";

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

export interface AttendanceSessionResponse {
  id: string;
  classId: string;
  className: string;
  classCode: string;
  subject: string | null;
  date: string;
  status: "draft" | "submitted";
  students: AttendanceStudent[];
  records: Record<string, AttendanceMarkStatus>;
}


import { authenticatedRequest } from "./auth-api";

export interface AssignmentSummary {
  id: string;
  classId: string;
  classCode: string;
  className: string;
  title: string;
  subject: string;
  instructions: string;
  dueAt: string;
  totalMarks: number;
  submissionType: string;
  status: "draft" | "published" | "archived";
  submittedCount: number;
  assignedCount: number;
}

export interface CreateAssignmentInput {
  classId: string;
  title: string;
  subject: string;
  instructions: string;
  dueAt: string;
  totalMarks: number;
  submissionType: "text" | "file" | "offline";
}

export interface StudentTask {
  submissionId: string;
  assignmentId: string;
  title: string;
  subject: string;
  instructions: string;
  dueAt: string;
  totalMarks: number;
  status: "assigned" | "submitted" | "graded";
  marksAwarded: number | null;
  feedback: string | null;
}

export interface GradeQueueItem {
  submissionId: string;
  assignmentId: string;
  assignmentTitle: string;
  classCode: string;
  studentId: string;
  studentName: string;
  rollNo: string | null;
  responseText: string | null;
  submittedAt: string | null;
  totalMarks: number;
  marksAwarded: number | null;
  feedback: string | null;
  status: "assigned" | "submitted" | "graded";
}

export function listAssignments() {
  return authenticatedRequest<AssignmentSummary[]>("/assignments");
}

export function createAssignment(input: CreateAssignmentInput) {
  return authenticatedRequest<AssignmentSummary>("/assignments", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function publishAssignment(id: string) {
  return authenticatedRequest<AssignmentSummary>(`/assignments/${id}/publish`, {
    method: "POST",
  });
}

export function listMyTasks() {
  return authenticatedRequest<StudentTask[]>("/assignments/tasks/me");
}

export function submitTask(submissionId: string, responseText: string) {
  return authenticatedRequest<StudentTask>(`/assignments/submissions/${submissionId}/submit`, {
    method: "POST",
    body: JSON.stringify({ responseText }),
  });
}

export function listGradeQueue() {
  return authenticatedRequest<GradeQueueItem[]>("/assignments/submissions/grade-queue");
}

export function gradeSubmission(submissionId: string, marksAwarded: number, feedback?: string) {
  return authenticatedRequest<GradeQueueItem>(`/assignments/submissions/${submissionId}/grade`, {
    method: "POST",
    body: JSON.stringify({ marksAwarded, feedback }),
  });
}

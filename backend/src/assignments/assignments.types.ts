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

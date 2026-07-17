import { authenticatedRequest } from "./auth-api";

export interface ExamSummary {
  id: string; name: string; term: string; subject: string; classId: string; className: string; classCode: string;
  maxMarks: number; startDate: string; endDate: string; status: "draft" | "marks_entry" | "marks_submitted" | "published"; marksCount: number;
}
export interface ExamClassSummary { id: string; code: string; name: string; subject: string | null; room: string | null }
export interface MarksEntry {
  id: string; name: string; term: string; subject: string; className: string; maxMarks: number; status: ExamSummary["status"];
  students: { id: string; name: string; rollNo: string }[];
  records: Record<string, { marks: number | null; absent: boolean; locked: boolean }>;
}
export interface ResultReview extends MarksEntry { completion: number; average: number; anomalies: number }
export interface MarkInput { studentId: string; marks?: number; absent: boolean }

export const listExams = () => authenticatedRequest<ExamSummary[]>("/exams");
export const listExamClasses = () => authenticatedRequest<ExamClassSummary[]>("/exams/classes");
export const createExam = (input: { classId: string; name: string; term: string; subject: string; maxMarks: number; startDate: string; endDate: string }) =>
  authenticatedRequest<ExamSummary>("/exams", { method: "POST", body: JSON.stringify(input) });
export const getMarksEntry = (examId?: string) => authenticatedRequest<MarksEntry>(`/exams/marks-entry${examId ? `?examId=${examId}` : ""}`);
export const saveMarksDraft = (examId: string, records: MarkInput[]) => authenticatedRequest<MarksEntry>(`/exams/${examId}/marks-draft`, { method: "PUT", body: JSON.stringify({ records }) });
export const submitMarks = (examId: string, records: MarkInput[]) => authenticatedRequest<MarksEntry>(`/exams/${examId}/marks-submit`, { method: "POST", body: JSON.stringify({ records }) });
export const getResultReview = (examId?: string) => authenticatedRequest<ResultReview>(`/exams/result-review${examId ? `?examId=${examId}` : ""}`);
export const publishResults = (examId: string) => authenticatedRequest<ResultReview>(`/exams/${examId}/publish-results`, { method: "POST" });

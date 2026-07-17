import { authenticatedRequest } from "./auth-api";

export interface AdmissionApplication {
  id: string; studentName: string; grade: string; guardianName: string; guardianPhone: string; guardianEmail: string | null; source: string; stage: "New" | "Under review" | "Interview" | "Offered" | "Rejected"; notes: string | null; submittedAt: string;
}
export interface CreateApplicationInput { studentName: string; grade: string; guardianName: string; guardianPhone: string; guardianEmail?: string; notes?: string }
export const listApplications = () => authenticatedRequest<AdmissionApplication[]>("/admissions/applications");
export const createApplication = (input: CreateApplicationInput) => authenticatedRequest<AdmissionApplication>("/admissions/applications", { method: "POST", body: JSON.stringify(input) });
export const offerApplication = (id: string, notes?: string) => authenticatedRequest<AdmissionApplication>(`/admissions/applications/${id}/offer`, { method: "POST", body: JSON.stringify({ notes }) });
export const rejectApplication = (id: string, notes?: string) => authenticatedRequest<AdmissionApplication>(`/admissions/applications/${id}/reject`, { method: "POST", body: JSON.stringify({ notes }) });
export const requestDocuments = (id: string, notes?: string) => authenticatedRequest<AdmissionApplication>(`/admissions/applications/${id}/document-request`, { method: "POST", body: JSON.stringify({ notes }) });

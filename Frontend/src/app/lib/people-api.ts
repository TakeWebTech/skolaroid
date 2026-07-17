import { authenticatedRequest } from "./auth-api";

export interface StudentDirectoryRow {
  id: string;
  admissionNo: string;
  name: string;
  status: "active" | "inactive" | "alumni";
  classId: string | null;
  className: string | null;
  classCode: string | null;
  rollNo: string | null;
}

export interface StudentDirectoryClass {
  id: string;
  code: string;
  name: string;
}

export interface StudentDirectoryResponse {
  students: StudentDirectoryRow[];
  classes: StudentDirectoryClass[];
}

export function listStudents(filters: { search?: string; classId?: string } = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.classId && filters.classId !== "all") params.set("classId", filters.classId);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return authenticatedRequest<StudentDirectoryResponse>(`/people/students${suffix}`);
}

export function createStudent(payload: { admissionNo: string; displayName: string; classId: string; rollNo?: string }) {
  return authenticatedRequest<StudentDirectoryRow>("/people/students", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

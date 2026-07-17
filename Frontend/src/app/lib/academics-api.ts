import { authenticatedRequest } from "./auth-api";

export interface AcademicClassRow {
  id: string;
  code: string;
  name: string;
  subject: string | null;
  room: string | null;
  students: number;
}

export interface AcademicStructureResponse {
  classes: AcademicClassRow[];
}

export function getAcademicStructure() {
  return authenticatedRequest<AcademicStructureResponse>("/academic-structure");
}

export function createAcademicClass(payload: { code: string; name: string; subject?: string; room?: string }) {
  return authenticatedRequest<AcademicClassRow>("/academic-structure/classes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

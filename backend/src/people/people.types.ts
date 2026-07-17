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

export interface StudentDirectoryResponse {
  students: StudentDirectoryRow[];
  classes: Array<{
    id: string;
    code: string;
    name: string;
  }>;
}

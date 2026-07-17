import type { StudentRow } from "./types";

export const SCHOOL = {
  name: "SMLS",
  branch: "No active branch data",
  year: "2026-27",
  currency: "₹",
};

export const AVATAR_COLORS = [
  "#1d4ed8", "#0369a1", "#15803d", "#b45309", "#7c3aed", "#be123c", "#0f766e", "#c2410c",
];

export function colorFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export const CLASSES: string[] = [];

export const STUDENTS: StudentRow[] = [];

export const TEACHER_TODAY_CLASSES: Array<{
  id: string;
  className: string;
  subject: string;
  time: string;
  room: string;
  students: number;
  attendanceTaken: boolean;
}> = [];

export const PENDING_GRADING: Array<{
  id: string;
  title: string;
  className: string;
  submitted: number;
  total: number;
  due: string;
}> = [];

export const ANNOUNCEMENTS: Array<{
  id: string;
  title: string;
  by: string;
  when: string;
  tone: "info" | "primary" | "muted";
}> = [];

export const STUDENT_TASKS: Array<{
  id: string;
  title: string;
  subject: string;
  due: string;
  status: "due" | "upcoming" | "overdue";
}> = [];

export const TIMETABLE: Array<{
  period: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}> = [];

export const RESULTS: Array<{
  subject: string;
  marks: number;
  max: number;
  grade: string;
}> = [];

export const CHILDREN: Array<{
  id: string;
  name: string;
  className: string;
  roll: string;
}> = [];

export const FEE_INSTALLMENTS: Array<{
  id: string;
  label: string;
  amount: number;
  due: string;
  status: "paid" | "due" | "upcoming";
}> = [];

export const PRINCIPAL_KPIS: Array<{
  id: string;
  label: string;
  value: string;
  delta: string;
  tone: "success" | "primary" | "warning" | "danger";
  def: string;
}> = [];

export const APPROVALS: Array<{
  id: string;
  title: string;
  by: string;
  when: string;
  risk: "high" | "medium" | "low";
}> = [];

export const ACCOUNTANT_KPIS: Array<{
  id: string;
  label: string;
  value: string;
  tone: "success" | "warning" | "danger" | "info";
}> = [];

export const DUES: Array<{
  id: string;
  name: string;
  className: string;
  amount: number;
  overdueDays: number;
  status: "paid" | "due" | "overdue";
}> = [];

export const UNMATCHED_PAYMENTS: Array<{
  id: string;
  ref: string;
  amount: number;
  when: string;
  suggest: string;
}> = [];

export const ENQUIRIES: Array<{
  id: string;
  name: string;
  grade: string;
  source: string;
  owner: string;
  stage: string;
  next: string;
}> = [];

export const ENQUIRY_STAGES: string[] = [];

export const EXAMS: Array<{
  id: string;
  name: string;
  term: string;
  status: string;
  classes: string;
  from: string;
  to: string;
}> = [];

export const TENANTS: Array<{
  id: string;
  name: string;
  plan: string;
  students: number;
  status: string;
  expiry: string;
  health: "good" | "watch" | "risk";
}> = [];

export const NOTIFICATIONS: Array<{
  id: string;
  title: string;
  tone: "warning" | "danger" | "success" | "info";
  action: boolean;
  when: string;
}> = [];

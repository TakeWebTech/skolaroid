// SMLS core domain & app types

export type RoleId =
  | "teacher"
  | "student"
  | "parent"
  | "admin"
  | "principal"
  | "accountant"
  | "platform";

export type ExperienceLevel = "beginner" | "standard" | "advanced";

export type Lang = "en" | "hi" | "ta" | "te";

export type StatusTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "primary"
  | "muted";

export interface NavItem {
  key: string;
  label: string;
  icon: string; // lucide icon name
  to: string;
  permission?: string;
}

export interface RoleDefinition {
  id: RoleId;
  label: string;
  description: string;
  home: string;
  nav: NavItem[];
}

export interface SchoolContext {
  school: string;
  branch: string;
  year: string;
}

export interface Person {
  id: string;
  name: string;
  avatarColor: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "leave";

export interface StudentRow {
  id: string;
  name: string;
  roll: string;
  className: string;
  guardian: string;
  phone: string;
  status: "active" | "inactive";
  attendancePct: number;
  feeStatus: "paid" | "due" | "overdue";
}

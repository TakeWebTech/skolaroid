import { Navigate, Route, Routes } from "react-router";
import { useApp } from "./store/app-context";
import { ROLES } from "./lib/roles";
import { PublicOnly } from "./components/auth/public-only";
import { RequireAuth } from "./components/auth/require-auth";
import { AppShell } from "./components/shell/app-shell";
import { ModuleHub } from "./pages/shared/module-hub";
import { Messaging } from "./pages/shared/messaging";
import { TimetablePage } from "./pages/shared/timetable";
import { AttendanceOverview } from "./pages/shared/attendance-overview";
import { StudentDirectory } from "./pages/shared/student-directory";
import { ReportCard } from "./pages/shared/report-card";
import { LeavePage } from "./pages/shared/leave";
import { Reports } from "./pages/shared/reports";
import { Announcement } from "./pages/shared/announcement";

import { TeacherDashboard } from "./pages/teacher/dashboard";
import { TeacherClasses } from "./pages/teacher/classes";
import { TakeAttendance } from "./pages/teacher/attendance";
import { TeacherLearning } from "./pages/teacher/learning";
import { TeacherAssessments } from "./pages/teacher/assessments";
import { CreateAssignment } from "./pages/teacher/create-assignment";
import { GradeSubmissions } from "./pages/teacher/grade";
import { EnterMarks } from "./pages/teacher/marks";

import { StudentDashboard } from "./pages/student/dashboard";
import { StudentLearn } from "./pages/student/learn";
import { StudentTasks } from "./pages/student/tasks";

import { ParentDashboard } from "./pages/parent/dashboard";
import { ParentFees } from "./pages/parent/fees";

import { AdminDashboard } from "./pages/admin/dashboard";
import { AcademicSetup } from "./pages/admin/academics";
import { UsersRoles } from "./pages/admin/users-roles";
import { PrincipalDashboard } from "./pages/principal/dashboard";
import { Approvals } from "./pages/principal/approvals";
import { AccountantDashboard } from "./pages/accountant/dashboard";
import { CollectPayment } from "./pages/accountant/collect-payment";
import { FeeSetup } from "./pages/accountant/fee-setup";
import { Reconciliation } from "./pages/accountant/reconciliation";
import {
  PlatformDashboard,
  PlatformCreateSchool,
  PlatformCreatePlan,
  PlatformEntitlements,
  PlatformOperations,
  PlatformPlanCatalog,
  PlatformPlans,
  PlatformPlugins,
  PlatformReports,
  PlatformSchoolProfile,
  PlatformSchools,
  PlatformSettings,
  PlatformSubscriptions,
  PlatformSupport,
} from "./pages/platform/pages";

import { Enquiries } from "./pages/admissions/enquiries";
import { ApplicantPortal } from "./pages/admissions/applicant-portal";
import { ApplicationReview } from "./pages/admissions/application-review";
import { ExamsList } from "./pages/exams/exams";
import { ResultReview } from "./pages/exams/result-review";
import { ExamSetup } from "./pages/exams/exam-setup";

import { SignIn } from "./pages/global/signin";
import { Profile } from "./pages/global/profile";
import { StatesGallery } from "./pages/global/states";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicOnly />}>
        <Route path="/signin" element={<SignIn />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route index element={<RoleHomeRedirect />} />

        {/* Teacher */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/classes" element={<TeacherClasses />} />
        <Route path="/teacher/attendance" element={<TakeAttendance />} />
        <Route path="/teacher/learning" element={<TeacherLearning />} />
        <Route path="/teacher/assessments" element={<TeacherAssessments />} />
        <Route path="/teacher/assessments/new" element={<CreateAssignment />} />
        <Route path="/teacher/assessments/grade" element={<GradeSubmissions />} />
        <Route path="/teacher/assessments/marks" element={<EnterMarks />} />
        <Route path="/teacher/messages" element={<Messaging />} />
        <Route path="/teacher/more" element={<ModuleHub title="More" subtitle="Additional teacher tools" links={[
          { icon: "CalendarDays", label: "Timetable", to: "/teacher/timetable", tone: "primary" },
          { icon: "Database", label: "Question bank", hint: "Create & reuse", to: "/teacher/assessments" },
          { icon: "BarChart3", label: "Class insights", to: "/teacher/reports", tone: "info" },
          { icon: "BookMarked", label: "Library", to: "/operations/library" },
          { icon: "Bus", label: "Transport", to: "/operations/transport" },
        ]} />} />
        <Route path="/teacher/timetable" element={<TimetablePage title="My Timetable" />} />
        <Route path="/teacher/reports" element={<Reports title="Class insights" />} />

        {/* Student */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/learn" element={<StudentLearn />} />
        <Route path="/student/tasks" element={<StudentTasks />} />
        <Route path="/student/timetable" element={<TimetablePage title="My Timetable" />} />
        <Route path="/student/results" element={<ReportCard />} />
        <Route path="/student/messages" element={<Messaging />} />

        {/* Parent */}
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/parent/child" element={<ModuleHub title="My child" subtitle="Aarav Sharma · Class 8A" links={[
          { icon: "Award", label: "Results", to: "/parent/results", tone: "success" },
          { icon: "CalendarCheck", label: "Attendance", to: "/parent/attendance", tone: "primary" },
          { icon: "BookOpen", label: "Learning", to: "/parent/learning", tone: "info" },
          { icon: "ClipboardList", label: "Assignments", to: "/student/tasks" },
          { icon: "Bus", label: "Transport", to: "/operations/transport" },
        ]} />} />
        <Route path="/parent/attendance" element={<AttendanceOverview />} />
        <Route path="/parent/learning" element={<StudentLearn />} />
        <Route path="/parent/results" element={<ReportCard title="Report card" />} />
        <Route path="/parent/fees" element={<ParentFees />} />
        <Route path="/parent/leave" element={<LeavePage title="Apply leave" />} />
        <Route path="/parent/messages" element={<Messaging />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/people" element={<StudentDirectory />} />
        <Route path="/admin/academics" element={<AcademicSetup />} />
        <Route path="/admin/operations" element={<ModuleHub title="Operations" subtitle="Daily school operations" links={[
          { icon: "CalendarDays", label: "Timetable", to: "/operations/timetable", tone: "primary" },
          { icon: "Repeat", label: "Substitutions", to: "/operations/timetable" },
          { icon: "BookMarked", label: "Library", to: "/operations/library", tone: "info" },
          { icon: "Bus", label: "Transport", to: "/operations/transport", tone: "success" },
        ]} />} />
        <Route path="/admin/communication" element={<ModuleHub title="Communication" subtitle="Announcements and messaging" links={[
          { icon: "Megaphone", label: "New announcement", to: "/communication/announce", tone: "primary" },
          { icon: "MessageSquare", label: "Messages", to: "/admin/messages", tone: "info" },
        ]} />} />
        <Route path="/admin/messages" element={<Messaging title="School messages" />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/settings" element={<ModuleHub title="Settings" subtitle="Users, roles and integrations" links={[
          { icon: "UserCog", label: "Users & roles", to: "/admin/users", tone: "primary" },
          { icon: "Plug", label: "Integrations", to: "/admin/settings" },
          { icon: "ScrollText", label: "Audit log", to: "/admin/settings", tone: "info" },
        ]} />} />
        <Route path="/admin/users" element={<UsersRoles />} />

        {/* Principal */}
        <Route path="/principal" element={<PrincipalDashboard />} />
        <Route path="/principal/academics" element={<Reports title="Academics" />} />
        <Route path="/principal/students" element={<StudentDirectory />} />
        <Route path="/principal/staff" element={<ModuleHub title="Staff" subtitle="Staffing overview" links={[
          { icon: "Users", label: "Staff directory", to: "/principal/staff", tone: "primary" },
          { icon: "CalendarCheck", label: "Staff attendance", to: "/principal/staff" },
          { icon: "Repeat", label: "Substitutions", to: "/operations/timetable", tone: "info" },
        ]} />} />
        <Route path="/principal/finance" element={<Reports title="Finance" />} />
        <Route path="/principal/reports" element={<Reports />} />
        <Route path="/principal/approvals" element={<Approvals />} />

        {/* Accountant */}
        <Route path="/accountant" element={<AccountantDashboard />} />
        <Route path="/accountant/fees" element={<ModuleHub title="Fees" subtitle="Fee heads, plans and dues" links={[
          { icon: "FilePenLine", label: "Set up fee plan", to: "/accountant/fees/setup", tone: "primary" },
          { icon: "HandCoins", label: "Collect payment", to: "/accountant/payments", tone: "success" },
          { icon: "Wallet", label: "Outstanding dues", to: "/accountant/fees", tone: "warning" },
          { icon: "Percent", label: "Concessions", to: "/accountant/fees" },
        ]} />} />
        <Route path="/accountant/fees/setup" element={<FeeSetup />} />
        <Route path="/accountant/payments" element={<CollectPayment />} />
        <Route path="/accountant/reconciliation" element={<Reconciliation />} />
        <Route path="/accountant/reports" element={<Reports title="Finance reports" />} />
        <Route path="/accountant/settings" element={<ModuleHub title="Settings" subtitle="Finance configuration" links={[
          { icon: "Landmark", label: "Payment gateways", to: "/accountant/settings", tone: "primary" },
          { icon: "FileText", label: "Receipt templates", to: "/accountant/settings" },
        ]} />} />

        {/* Platform */}
        <Route path="/platform" element={<PlatformDashboard />} />
        <Route path="/platform/schools" element={<PlatformSchools />} />
        <Route path="/platform/schools/:id" element={<PlatformSchoolProfile />} />
        <Route path="/platform/schools/new" element={<PlatformCreateSchool />} />
        <Route path="/platform/plans" element={<PlatformPlans />} />
        <Route path="/platform/plans/catalog" element={<PlatformPlanCatalog />} />
        <Route path="/platform/plans/new" element={<PlatformCreatePlan />} />
        <Route path="/platform/plans/entitlements" element={<PlatformEntitlements />} />
        <Route path="/platform/plans/subscriptions" element={<PlatformSubscriptions />} />
        <Route path="/platform/plugins" element={<PlatformPlugins />} />
        <Route path="/platform/operations" element={<PlatformOperations />} />
        <Route path="/platform/support" element={<PlatformSupport />} />
        <Route path="/platform/reports" element={<PlatformReports />} />
        <Route path="/platform/settings" element={<PlatformSettings />} />

        {/* Cross-cutting modules */}
        <Route path="/admissions" element={<Enquiries />} />
        <Route path="/admissions/apply" element={<ApplicantPortal />} />
        <Route path="/admissions/review" element={<ApplicationReview />} />
        <Route path="/exams" element={<ExamsList />} />
        <Route path="/exams/setup" element={<ExamSetup />} />
        <Route path="/exams/results" element={<ResultReview />} />
        <Route path="/operations/timetable" element={<TimetablePage title="Timetable" />} />
        <Route path="/operations/library" element={<ModuleHub title="Library" subtitle="Catalogue and circulation" links={[
          { icon: "Search", label: "Search catalogue", to: "/operations/library", tone: "primary" },
          { icon: "BookUp", label: "Issue", to: "/operations/library", tone: "success" },
          { icon: "BookDown", label: "Return", to: "/operations/library", tone: "info" },
        ]} />} />
        <Route path="/operations/transport" element={<ModuleHub title="Transport" subtitle="Routes, stops and vehicles" links={[
          { icon: "Map", label: "Routes", to: "/operations/transport", tone: "primary" },
          { icon: "MapPin", label: "Stops", to: "/operations/transport" },
          { icon: "Bus", label: "Vehicles", to: "/operations/transport", tone: "info" },
        ]} />} />
        <Route path="/communication/announce" element={<Announcement />} />

        {/* Global */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/states" element={<StatesGallery />} />

          <Route path="*" element={<RoleHomeRedirect />} />
        </Route>
      </Route>
    </Routes>
  );
}

function RoleHomeRedirect() {
  const { role } = useApp();
  return <Navigate to={ROLES[role].home} replace />;
}

import type { LucideIcon } from 'lucide-react';
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  GraduationCap,
  Users,
  CalendarCheck,
  Wallet,
  BookOpen,
  Laptop,
  ClipboardCheck,
  Megaphone,
  UserCog,
  Bus,
  Library,
  Building2,
  Boxes,
  DoorOpen,
  FileText,
  BarChart3,
  Network,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export type ModuleId =
  | 'admissions'
  | 'student-information'
  | 'attendance'
  | 'fees-finance'
  | 'academics'
  | 'lms'
  | 'examinations'
  | 'communication'
  | 'hr-payroll'
  | 'transport'
  | 'library'
  | 'hostel'
  | 'inventory'
  | 'visitor'
  | 'certificates'
  | 'analytics'
  | 'multi-school'
  | 'platform-administration'
  | 'tenant-provisioning'
  | 'plans-entitlements'
  | 'support-operations';

export interface ModuleDef {
  id: ModuleId;
  name: string;
  short: string;
  icon: LucideIcon;
  tagline: string;
  description: string;
  features: string[];
  problems: string[];
  benefits: string[];
  roles: string[];
  integrations: string[];
  faqs: { q: string; a: string }[];
  accent: string;
}

export const modules: ModuleDef[] = [
  {
    id: 'admissions',
    name: 'Admissions & Enquiry Management',
    short: 'Admissions',
    icon: GraduationCap,
    tagline: 'Turn enquiries into enrolled students — without the paperwork chase.',
    description:
      'Capture every enquiry, guide applicants through a structured pipeline, and onboard new students with automated follow-ups and document collection.',
    features: [
      'Online enquiry forms',
      'Lead capture from website and campaigns',
      'Visual admission pipeline',
      'Applicant tracking',
      'Document submission and verification',
      'Admission approval workflows',
      'Student onboarding',
      'Automated follow-ups',
      'Admission reports',
    ],
    problems: [
      'Enquiries slip through the cracks across email, phone and front desk',
      'No visibility into where each applicant is in the admission journey',
      'Manual document collection creates delays and lost paperwork',
    ],
    benefits: [
      'A single pipeline for every applicant from enquiry to enrolment',
      'Automated reminders keep parents moving forward',
      'Faster admissions with fewer manual steps',
    ],
    roles: ['Administrators', 'Admission teams', 'Principals'],
    integrations: ['Payment gateway', 'Email', 'SMS', 'WhatsApp'],
    faqs: [
      {
        q: 'Can applicants upload documents online?',
        a: 'Yes. Parents submit documents through a secure portal and staff verify them in the approval workflow.',
      },
      {
        q: 'Does the pipeline support multiple intake cycles?',
        a: 'Yes. You can run multiple admission sessions and track each separately.',
      },
    ],
    accent: 'hsl(231 76% 56%)',
  },
  {
    id: 'student-information',
    name: 'Student Information System',
    short: 'Student SIS',
    icon: Users,
    tagline: 'Every student’s story — academic, personal and guardian — in one record.',
    description:
      'Maintain complete, centralised student profiles with academic history, guardian details, documents and behaviour records across their entire journey.',
    features: [
      'Complete student profiles',
      'Academic history',
      'Medical details',
      'Documents and certificates',
      'Guardian details',
      'Class and section allocation',
      'Student ID management',
      'Promotion history',
      'Behaviour records',
    ],
    problems: [
      'Student data scattered across registers, files and spreadsheets',
      'Searching for a student record takes too long during parent meetings',
      'Promotion and transfer history is hard to reconstruct',
    ],
    benefits: [
      'One searchable record per student across all years',
      'Authorised staff see the full context at a glance',
      'Safe, permissioned access to sensitive information',
    ],
    roles: ['Administrators', 'Principals', 'Teachers', 'Counsellors'],
    integrations: ['ID card printing', 'Certificates', 'Analytics'],
    faqs: [
      {
        q: 'Can we restrict who sees medical or behaviour records?',
        a: 'Yes. Role-based access control lets you limit sensitive sections to authorised staff only.',
      },
      {
        q: 'Are records preserved after a student leaves?',
        a: 'Yes. Records remain accessible for alumni and historical reporting.',
      },
    ],
    accent: 'hsl(263 70% 60%)',
  },
  {
    id: 'attendance',
    name: 'Attendance Management',
    short: 'Attendance',
    icon: CalendarCheck,
    tagline: 'Accurate attendance for students, teachers and staff — period by period.',
    description:
      'Record attendance period-wise, integrate with biometric or RFID devices, and alert parents instantly about absences or late entries.',
    features: [
      'Student attendance',
      'Teacher and staff attendance',
      'Period-wise attendance',
      'Biometric integration',
      'RFID integration',
      'Leave requests',
      'Late entry tracking',
      'Attendance alerts to parents',
      'Attendance reports',
    ],
    problems: [
      'Paper registers are slow, error-prone and hard to audit',
      'Parents find out about absences too late',
      'Consolidating attendance across classes is manual work',
    ],
    benefits: [
      'Real-time attendance visibility for management',
      'Instant parent alerts build trust and safety',
      'Ready-made reports for compliance and audits',
    ],
    roles: ['Teachers', 'Administrators', 'Parents', 'Principals'],
    integrations: ['Biometric devices', 'RFID', 'SMS', 'Push notifications'],
    faqs: [
      {
        q: 'Which biometric devices are supported?',
        a: 'Skolaroid integrates with common biometric and RFID devices. Contact us to confirm compatibility with your hardware.',
      },
      {
        q: 'Can parents apply for leave through the app?',
        a: 'Yes. Parents submit leave requests that flow to teachers for approval.',
      },
    ],
    accent: 'hsl(189 90% 42%)',
  },
  {
    id: 'fees-finance',
    name: 'Fees & Finance',
    short: 'Fees',
    icon: Wallet,
    tagline: 'Collect fees online, track dues automatically, and see finances clearly.',
    description:
      'Create flexible fee structures, collect payments online, manage instalments and scholarships, and give finance teams real-time collection dashboards.',
    features: [
      'Fee structure creation',
      'Online fee collection',
      'Instalment plans',
      'Discounts and concessions',
      'Scholarships',
      'Fine management',
      'Digital receipts',
      'Outstanding fee tracking',
      'Payment gateway integration',
      'Finance dashboards',
      'Automated reminders',
      'Collection reports',
    ],
    problems: [
      'Fee collection is slow and hard to track',
      'Manual reminders consume staff time',
      'Finance reports are prepared by hand at month-end',
    ],
    benefits: [
      'Parents pay online — fewer queues and less cash handling',
      'Automated reminders reduce outstanding dues',
      'Live dashboards replace month-end report preparation',
    ],
    roles: ['Accountants', 'Administrators', 'School owners', 'Parents'],
    integrations: ['Payment gateway', 'Accounting export', 'SMS', 'Email'],
    faqs: [
      {
        q: 'Which payment gateways can we use?',
        a: 'Skolaroid integrates with popular Indian payment gateways. Gateway transaction fees may apply based on actual usage.',
      },
      {
        q: 'Can we offer instalment plans?',
        a: 'Yes. You can configure instalments, discounts and scholarships per fee structure.',
      },
    ],
    accent: 'hsl(152 65% 45%)',
  },
  {
    id: 'academics',
    name: 'Academics',
    short: 'Academics',
    icon: BookOpen,
    tagline: 'Plan timetables, lessons and homework in one connected academic workspace.',
    description:
      'Manage classes, sections, subjects, timetables, lesson plans, homework and the academic calendar — all linked to the right teachers and students.',
    features: [
      'Class and section management',
      'Subject allocation',
      'Timetable creation',
      'Lesson planning',
      'Curriculum tracking',
      'Homework',
      'Assignments',
      'Study materials',
      'Academic calendar',
      'Teacher allocation',
    ],
    problems: [
      'Timetable clashes and manual reshuffling',
      'Homework and study material shared across scattered channels',
      'No visibility into curriculum progress',
    ],
    benefits: [
      'Clash-free timetables in minutes',
      'Homework and materials reach every student in one place',
      'Principals can track curriculum coverage',
    ],
    roles: ['Teachers', 'Principals', 'Administrators', 'Students', 'Parents'],
    integrations: ['LMS', 'Calendar', 'Push notifications'],
    faqs: [
      {
        q: 'Can teachers upload study materials?',
        a: 'Yes. Teachers share documents and links that students access through their app.',
      },
      {
        q: 'Does timetable generation detect clashes?',
        a: 'Yes. The system highlights teacher and room conflicts as you build the timetable.',
      },
    ],
    accent: 'hsl(231 76% 56%)',
  },
  {
    id: 'lms',
    name: 'Learning Management System',
    short: 'LMS',
    icon: Laptop,
    tagline: 'Bring courses, lessons and assessments into one digital learning space.',
    description:
      'Create online courses with video and document lessons, quizzes and assignments. Track completion and progress for every learner.',
    features: [
      'Online courses',
      'Learning paths',
      'Video lessons',
      'PDF and document lessons',
      'Quizzes',
      'Assignments',
      'Question banks',
      'Course completion tracking',
      'Teacher-created content',
      'Student progress analytics',
      'Certificates',
      'Discussion support',
    ],
    problems: [
      'Learning content is scattered across drives and chat groups',
      'No way to track which students have completed lessons',
      'Assessment and content live in separate tools',
    ],
    benefits: [
      'One learning hub for every class and subject',
      'Clear visibility into student progress',
      'Teachers create and assess content in one place',
    ],
    roles: ['Teachers', 'Students', 'Parents', 'Principals'],
    integrations: ['Video conferencing', 'Cloud storage', 'Academics'],
    faqs: [
      {
        q: 'Can teachers create their own courses?',
        a: 'Yes. Teachers build courses with lessons, quizzes and assignments.',
      },
      {
        q: 'Are certificates available?',
        a: 'Yes. Certificates can be issued on course completion.',
      },
    ],
    accent: 'hsl(263 70% 60%)',
  },
  {
    id: 'examinations',
    name: 'Examinations & Results',
    short: 'Exams',
    icon: ClipboardCheck,
    tagline: 'Plan exams, enter marks and publish report cards — without the chaos.',
    description:
      'Configure exams and grades, manage mark entry, generate report cards, and analyse subject and student performance trends.',
    features: [
      'Examination planning',
      'Mark entry',
      'Grade configuration',
      'Report cards',
      'Result publication',
      'Assessment analytics',
      'Question papers',
      'Hall tickets',
      'Seating plans',
      'Subject performance',
      'Student performance trends',
    ],
    problems: [
      'Mark entry and consolidation is slow and error-prone',
      'Report card generation is a last-minute scramble',
      'Performance trends are hard to analyse',
    ],
    benefits: [
      'Structured mark entry with validation',
      'Professional report cards in a few clicks',
      'Actionable analytics for principals and parents',
    ],
    roles: ['Teachers', 'Examination coordinators', 'Principals', 'Parents', 'Students'],
    integrations: ['Student SIS', 'Analytics', 'Certificates'],
    faqs: [
      {
        q: 'Can we customise report card formats?',
        a: 'Yes. Report card templates can be configured to match your school’s grading system.',
      },
      {
        q: 'Can results be published to parents directly?',
        a: 'Yes. Results appear in the parent app once published.',
      },
    ],
    accent: 'hsl(38 95% 55%)',
  },
  {
    id: 'communication',
    name: 'Communication',
    short: 'Communication',
    icon: Megaphone,
    tagline: 'Reach every parent and staff member — instantly and reliably.',
    description:
      'Send announcements, circulars and emergency alerts via push, SMS, email and in-app messages, with delivery tracking and history.',
    features: [
      'Announcements',
      'Push notifications',
      'SMS',
      'Email',
      'In-app messages',
      'Circulars',
      'Emergency alerts',
      'Parent-teacher communication',
      'Class-specific communication',
      'Delivery tracking',
      'Communication history',
    ],
    problems: [
      'Important messages get lost in WhatsApp groups',
      'No confirmation that parents actually received notices',
      'Emergency alerts are slow to reach everyone',
    ],
    benefits: [
      'One channel for all official school communication',
      'Delivery tracking confirms reach',
      'Emergency alerts reach every parent instantly',
    ],
    roles: ['Administrators', 'Teachers', 'Parents', 'Principals'],
    integrations: ['SMS provider', 'Email', 'WhatsApp', 'Push'],
    faqs: [
      {
        q: 'How are SMS and WhatsApp charged?',
        a: 'SMS, email and WhatsApp usage may be billed based on actual consumption.',
      },
      {
        q: 'Can we target messages to a specific class?',
        a: 'Yes. Messages can be targeted by class, section or custom groups.',
      },
    ],
    accent: 'hsl(189 90% 42%)',
  },
  {
    id: 'hr-payroll',
    name: 'HR & Payroll',
    short: 'HR & Payroll',
    icon: UserCog,
    tagline: 'Manage staff records, leave, attendance and payroll in one place.',
    description:
      'Maintain employee profiles, manage recruitment, leave and attendance, run payroll, and give staff self-service access.',
    features: [
      'Employee profiles',
      'Recruitment',
      'Attendance',
      'Leave management',
      'Payroll',
      'Salary slips',
      'Contracts',
      'Performance reviews',
      'Department management',
      'Staff documents',
      'Employee self-service',
    ],
    problems: [
      'Staff records live in separate files from payroll',
      'Payroll is calculated manually each month',
      'Leave approval is slow and untracked',
    ],
    benefits: [
      'One record per employee across their lifecycle',
      'Automated payroll calculation and payslips',
      'Transparent leave and attendance for staff',
    ],
    roles: ['HR teams', 'Administrators', 'School owners'],
    integrations: ['Attendance', 'Accounting export', 'Email'],
    faqs: [
      {
        q: 'Can salary slips be shared digitally?',
        a: 'Yes. Payslips are available to staff through self-service.',
      },
      {
        q: 'Does payroll support deductions and allowances?',
        a: 'Yes. You can configure allowances, deductions and tax components.',
      },
    ],
    accent: 'hsl(152 65% 45%)',
  },
  {
    id: 'transport',
    name: 'Transport Management',
    short: 'Transport',
    icon: Bus,
    tagline: 'Plan routes, track vehicles live and alert parents on pickup and drop.',
    description:
      'Manage vehicles, routes, stops and drivers, assign students to routes, and track live with GPS pickup and drop alerts.',
    features: [
      'Vehicle profiles',
      'Route management',
      'Stop management',
      'Driver profiles',
      'Student route assignment',
      'GPS integration',
      'Live tracking',
      'Pickup and drop alerts',
      'Transport attendance',
      'Maintenance reminders',
      'Emergency notifications',
    ],
    problems: [
      'Parents call the office to ask where the bus is',
      'Route planning is manual and inefficient',
      'No record of which students boarded',
    ],
    benefits: [
      'Live tracking reduces parent anxiety',
      'Optimised routes save fuel and time',
      'Transport attendance adds a safety layer',
    ],
    roles: ['Transport managers', 'Administrators', 'Parents'],
    integrations: ['GPS devices', 'Push notifications', 'SMS'],
    faqs: [
      {
        q: 'Which GPS devices are supported?',
        a: 'Skolaroid supports common GPS providers. Contact us to confirm your device.',
      },
      {
        q: 'Do parents get pickup and drop alerts?',
        a: 'Yes. Parents receive alerts when the bus approaches pickup and drop points.',
      },
    ],
    accent: 'hsl(231 76% 56%)',
  },
  {
    id: 'library',
    name: 'Library Management',
    short: 'Library',
    icon: Library,
    tagline: 'Catalogue, issue and track books — with fines and reservations handled.',
    description:
      'Manage your book catalogue with barcode support, issue and return books, calculate fines, and track reservations and member history.',
    features: [
      'Book catalogue',
      'Barcode support',
      'Book issue and return',
      'Fine calculation',
      'Inventory',
      'Digital library',
      'Member history',
      'Reservations',
      'Lost-book tracking',
      'Library analytics',
    ],
    problems: [
      'Manual issue registers make tracking difficult',
      'Fines are calculated inconsistently',
      'No visibility into book availability',
    ],
    benefits: [
      'Fast barcode-based issue and return',
      'Automatic and consistent fine calculation',
      'Real-time availability and reservations',
    ],
    roles: ['Librarians', 'Administrators', 'Students', 'Teachers'],
    integrations: ['Barcode scanners', 'Student SIS', 'Fees'],
    faqs: [
      {
        q: 'Is barcode scanning supported?',
        a: 'Yes. The library module supports barcode-based issue and return.',
      },
      {
        q: 'Can students reserve books online?',
        a: 'Yes. Students can reserve available books through their app.',
      },
    ],
    accent: 'hsl(263 70% 60%)',
  },
  {
    id: 'hostel',
    name: 'Hostel Management',
    short: 'Hostel',
    icon: Building2,
    tagline: 'Run hostels, rooms, mess and visitor records without paperwork.',
    description:
      'Set up hostels and rooms, allocate students, track attendance and visitors, manage mess and hostel fees, and handle complaints and leave.',
    features: [
      'Hostel and room setup',
      'Room allocation',
      'Student records',
      'Attendance',
      'Visitors',
      'Mess management',
      'Hostel fees',
      'Complaints',
      'Leave requests',
      'Inventory',
    ],
    problems: [
      'Hostel records are maintained in separate registers',
      'Visitor tracking is inconsistent',
      'Mess and fee records are hard to reconcile',
    ],
    benefits: [
      'One record per hostel resident',
      'Structured visitor and leave tracking',
      'Mess and hostel fees linked to finance',
    ],
    roles: ['Hostel wardens', 'Administrators', 'Parents'],
    integrations: ['Student SIS', 'Fees', 'Attendance'],
    faqs: [
      {
        q: 'Can we manage multiple hostels?',
        a: 'Yes. You can configure multiple hostels with their own rooms and wardens.',
      },
      {
        q: 'Are mess charges included in hostel fees?',
        a: 'Mess charges can be configured and collected through the fees module.',
      },
    ],
    accent: 'hsl(189 90% 42%)',
  },
  {
    id: 'inventory',
    name: 'Inventory & Asset Management',
    short: 'Inventory',
    icon: Boxes,
    tagline: 'Track school assets and stock — from purchase to assignment.',
    description:
      'Maintain school assets and stock records, manage purchase requests and vendors, issue and return items, and schedule maintenance.',
    features: [
      'School assets',
      'Stock records',
      'Purchase requests',
      'Vendor records',
      'Issue and return',
      'Asset assignment',
      'Maintenance scheduling',
      'Depreciation records',
      'Inventory reports',
    ],
    problems: [
      'No central record of school assets',
      'Maintenance is reactive and missed',
      'Stock issues are untracked',
    ],
    benefits: [
      'A complete asset register with assignments',
      'Scheduled maintenance avoids breakdowns',
      'Clear inventory reports for planning',
    ],
    roles: ['Administrators', 'IT administrators'],
    integrations: ['Finance', 'Vendor records'],
    faqs: [
      {
        q: 'Can we track depreciation?',
        a: 'Yes. Depreciation records can be maintained per asset.',
      },
      {
        q: 'Can staff raise purchase requests?',
        a: 'Yes. Purchase requests flow through an approval workflow.',
      },
    ],
    accent: 'hsl(38 95% 55%)',
  },
  {
    id: 'visitor',
    name: 'Visitor & Gate Management',
    short: 'Visitors',
    icon: DoorOpen,
    tagline: 'Digital gate passes and authorised pickups — for a safer campus.',
    description:
      'Register visitors, issue digital gate passes, authorise student pickups, and keep a complete visitor and staff entry history.',
    features: [
      'Visitor registration',
      'Digital gate passes',
      'Student pickup authorisation',
      'Staff entry records',
      'Emergency contacts',
      'Visitor history',
      'Security alerts',
    ],
    problems: [
      'Paper gate passes are hard to audit',
      'Unauthorised pickups are a safety risk',
      'No central visitor history',
    ],
    benefits: [
      'Digital gate passes improve security',
      'Authorised pickups protect students',
      'Searchable visitor history for audits',
    ],
    roles: ['Reception teams', 'Administrators', 'Security staff'],
    integrations: ['Student SIS', 'Push notifications'],
    faqs: [
      {
        q: 'Can parents authorise pickups in advance?',
        a: 'Yes. Parents can authorise guardians through the app for verified pickup.',
      },
      {
        q: 'Are visitor records searchable?',
        a: 'Yes. Visitor history is searchable by date, name and purpose.',
      },
    ],
    accent: 'hsl(152 65% 45%)',
  },
  {
    id: 'certificates',
    name: 'Certificates & Documents',
    short: 'Certificates',
    icon: FileText,
    tagline: 'Generate bonafide, transfer and ID cards — with approval workflows.',
    description:
      'Create bonafide, transfer and character certificates, ID cards and custom documents with approval workflows and secure storage.',
    features: [
      'Bonafide certificates',
      'Transfer certificates',
      'Character certificates',
      'ID cards',
      'Custom certificate templates',
      'Digital document generation',
      'Approval workflows',
      'Secure document storage',
    ],
    problems: [
      'Certificates are typed manually each time',
      'No approval trail for issued documents',
      'ID card generation is outsourced and slow',
    ],
    benefits: [
      'Templates generate certificates in seconds',
      'Approval workflows keep issuance controlled',
      'In-house ID card printing saves time and cost',
    ],
    roles: ['Administrators', 'Principals', 'Reception teams'],
    integrations: ['Student SIS', 'ID card printing'],
    faqs: [
      {
        q: 'Can we create custom certificate templates?',
        a: 'Yes. You can design templates for any document your school issues.',
      },
      {
        q: 'Is there an approval workflow?',
        a: 'Yes. Certificate issuance can require principal or admin approval.',
      },
    ],
    accent: 'hsl(231 76% 56%)',
  },
  {
    id: 'analytics',
    name: 'Reports & Analytics',
    short: 'Analytics',
    icon: BarChart3,
    tagline: 'Turn everyday school data into decisions — for every role.',
    description:
      'Role-based dashboards for attendance, fees, academics and admissions, with a custom report builder and scheduled exports.',
    features: [
      'Management dashboards',
      'Attendance analytics',
      'Fee analytics',
      'Academic analytics',
      'Admission analytics',
      'Teacher performance',
      'Student trends',
      'Custom report builder',
      'Scheduled reports',
      'Export to Excel and PDF',
    ],
    problems: [
      'Reports are prepared manually at month-end',
      'Each role sees the same generic report',
      'Trends are hard to spot across years',
    ],
    benefits: [
      'Live dashboards replace manual report preparation',
      'Each role sees what matters to them',
      'Trends inform planning and interventions',
    ],
    roles: ['School owners', 'Principals', 'Administrators', 'Accountants', 'HR teams'],
    integrations: ['All modules', 'Excel', 'PDF'],
    faqs: [
      {
        q: 'Can reports be scheduled automatically?',
        a: 'Yes. Reports can be scheduled and emailed to recipients on a recurring basis.',
      },
      {
        q: 'Can we build custom reports?',
        a: 'Yes. The custom report builder lets you choose fields and filters.',
      },
    ],
    accent: 'hsl(263 70% 60%)',
  },
  {
    id: 'multi-school',
    name: 'Multi-School Management',
    short: 'Multi-School',
    icon: Network,
    tagline: 'One super-admin panel for every branch and trust in your group.',
    description:
      'Manage multiple schools and branches from a central super-admin panel with organisation-level analytics, branch comparison and central policies.',
    features: [
      'Central super-admin panel',
      'Multiple schools and branches',
      'Organisation-level analytics',
      'Branch comparison',
      'Central policies',
      'Shared curriculum',
      'Central finance overview',
      'Role-based access',
      'Subscription and billing management',
    ],
    problems: [
      'Each branch runs its own software with no roll-up',
      'Comparing branch performance is manual',
      'Central policies are hard to enforce consistently',
    ],
    benefits: [
      'A single view across every branch',
      'Consistent policies and shared curriculum',
      'Central finance and performance comparison',
    ],
    roles: ['School owners', 'Directors', 'Management committees', 'Educational trusts'],
    integrations: ['All modules', 'Analytics', 'Finance'],
    faqs: [
      {
        q: 'Can each branch have its own configuration?',
        a: 'Yes. Each branch keeps its own setup while central policies can be shared.',
      },
      {
        q: 'Is there a central finance overview?',
        a: 'Yes. The super-admin panel aggregates finance across branches.',
      },
    ],
    accent: 'hsl(189 90% 42%)',
  },
  {
    id: 'platform-administration',
    name: 'Platform Administration',
    short: 'Platform Admin',
    icon: ShieldCheck,
    tagline: 'Operate every tenant, role, audit trail and support action from one secure platform console.',
    description:
      'Manage platform staff, school tenants, organization-level profiles, support actions, security OTP checks, audit logs and operational controls without becoming a member of every school tenant.',
    features: [
      'Platform staff roles and permissions',
      'School tenant directory',
      'School profile management',
      'Organization support key workflow',
      'OTP-secured service actions',
      'Tenant user and role visibility',
      'Password reset support flow',
      'Role change support flow',
      'Organization audit logs',
      'Platform audit logs',
    ],
    problems: [
      'Platform teams need to support schools without unsafe tenant membership',
      'Sensitive user and role changes require strong accountability',
      'Support actions are hard to audit when they happen outside the product',
    ],
    benefits: [
      'Clear separation between platform staff and school users',
      'Sensitive service actions require OTP and support key verification',
      'Every support action records actor, organization, target and action',
    ],
    roles: ['Platform admins', 'Technical support', 'Implementation managers', 'Billing operations'],
    integrations: ['Strapi', 'ERPNext', 'Audit logs', 'Email OTP provider', 'MSG91'],
    faqs: [
      {
        q: 'Do platform staff become members of every school?',
        a: 'No. Platform access is controlled separately through platform permissions, not school tenant membership.',
      },
      {
        q: 'Are support password resets audited?',
        a: 'Yes. Support actions record the organization, platform actor, target user and action details.',
      },
    ],
    accent: 'hsl(231 76% 56%)',
  },
  {
    id: 'tenant-provisioning',
    name: 'Tenant Provisioning',
    short: 'Tenant Setup',
    icon: Building2,
    tagline: 'Create schools with organization IDs, domains, contacts, onboarding ownership and branch setup.',
    description:
      'Provision school tenants with organization IDs, primary domains, contact details, main branch setup, onboarding notes and a clean separation between platform operations and school users.',
    features: [
      'Create school workflow',
      'Organization ID suggestion',
      'Primary domain capture',
      'Admin contact capture',
      'Implementation owner capture',
      'Onboarding notes',
      'Main branch creation',
      'Tenant profile creation',
      'Subscription plan assignment',
      'Provisioning audit event',
    ],
    problems: [
      'New schools are often created with incomplete onboarding data',
      'Organization IDs and domains can conflict without validation',
      'Implementation context gets lost after sales handoff',
    ],
    benefits: [
      'Clean tenant records from day one',
      'Better handoff from sales to implementation',
      'Validated IDs and domains reduce operational mistakes',
    ],
    roles: ['Platform admins', 'Implementation managers', 'Sales operations'],
    integrations: ['ERPNext leads', 'ERPNext customers', 'ERPNext quotations', 'Strapi pricing content'],
    faqs: [
      {
        q: 'Can tenant provisioning connect to sales data?',
        a: 'Yes. Demo enquiries, leads and customers should flow through ERPNext while website content remains in Strapi.',
      },
    ],
    accent: 'hsl(152 65% 45%)',
  },
  {
    id: 'plans-entitlements',
    name: 'Plans & Entitlements',
    short: 'Entitlements',
    icon: Boxes,
    tagline: 'Control plan catalogues, feature access, subscriptions and school-specific overrides.',
    description:
      'Define pricing plans, module access, entitlement defaults, subscription history and school-specific overrides so every school receives the right product capabilities.',
    features: [
      'Plan catalogue',
      'Create plan workflow',
      'Plan feature lists',
      'Module entitlement defaults',
      'School-specific entitlement overrides',
      'Subscription status',
      'Renewal date tracking',
      'Add-on service tracking',
      'Invoice history model',
      'Entitlement audit trail',
    ],
    problems: [
      'Feature access becomes inconsistent when plans are tracked manually',
      'Custom school contracts need overrides without changing the base plan',
      'Billing and entitlement changes need a clear audit trail',
    ],
    benefits: [
      'Plans define standard product access',
      'Custom entitlements support enterprise contracts',
      'Subscription and entitlement changes stay auditable',
    ],
    roles: ['Platform admins', 'Billing operations', 'Implementation managers'],
    integrations: ['ERPNext quotations', 'ERPNext invoicing', 'ERPNext customers', 'Strapi pricing presentation'],
    faqs: [
      {
        q: 'What are entitlements?',
        a: 'Entitlements are the modules, limits and add-ons a school is allowed to use through its plan or custom contract.',
      },
    ],
    accent: 'hsl(38 95% 55%)',
  },
  {
    id: 'support-operations',
    name: 'Support Operations',
    short: 'Support Ops',
    icon: Megaphone,
    tagline: 'Dedicated support workflows for school admins, principals and platform teams.',
    description:
      'Keep platform support separate from normal school messaging with dedicated cases, school context, service actions, support keys and full audit visibility.',
    features: [
      'Dedicated support queue',
      'School admin and principal cases',
      'Support case messages',
      'Service support key',
      'Support action audit',
      'Incident and domain context',
      'Tenant profile access',
      'Role-aware support visibility',
    ],
    problems: [
      'Support conversations get mixed with normal school messages',
      'Platform teams need organization context before taking action',
      'Service actions require proof of who did what and why',
    ],
    benefits: [
      'Cleaner support communication',
      'Better context for platform support teams',
      'Audit-ready service history for every organization',
    ],
    roles: ['Technical support', 'Platform admins', 'School admins', 'Principals'],
    integrations: ['ERPNext support', 'Email', 'MSG91', 'Audit logs'],
    faqs: [
      {
        q: 'Is support messaging separate from school messaging?',
        a: 'Yes. Platform support should use a dedicated support channel instead of mixing with teacher, parent or student messages.',
      },
    ],
    accent: 'hsl(263 70% 60%)',
  },
];

export const moduleMap: Record<string, ModuleDef> = Object.fromEntries(
  modules.map((m) => [m.id, m])
);

export interface RoleSolution {
  id: string;
  role: string;
  icon: LucideIcon;
  summary: string;
  points: string[];
}

export const roleSolutions: RoleSolution[] = [
  {
    id: 'owners',
    role: 'School Owners & Directors',
    icon: ShieldCheck,
    summary: 'Organisation-wide visibility and strategic control.',
    points: [
      'Organisation-wide visibility',
      'Revenue and fee insights',
      'School performance',
      'Branch comparison',
      'Compliance tracking',
      'Strategic dashboards',
    ],
  },
  {
    id: 'principals',
    role: 'Principals',
    icon: GraduationCap,
    summary: 'Academic monitoring and daily school oversight.',
    points: [
      'Academic monitoring',
      'Teacher performance',
      'Attendance overview',
      'Daily approvals',
      'School activity dashboard',
      'Examination analysis',
    ],
  },
  {
    id: 'administrators',
    role: 'Administrators',
    icon: UserCog,
    summary: 'Run admissions, records and workflows efficiently.',
    points: [
      'Student records',
      'Admissions',
      'Documents',
      'Timetables',
      'Communication',
      'Workflow automation',
    ],
  },
  {
    id: 'teachers',
    role: 'Teachers',
    icon: BookOpen,
    summary: 'Spend less time on admin, more on teaching.',
    points: [
      'Attendance',
      'Lesson plans',
      'Homework',
      'Assignments',
      'Marks',
      'Student progress',
      'Parent communication',
    ],
  },
  {
    id: 'parents',
    role: 'Parents',
    icon: Users,
    summary: 'Stay informed and engaged with your child’s school.',
    points: [
      'Attendance alerts',
      'Fee payments',
      'Homework',
      'Results',
      'School announcements',
      'Transport updates',
      'Leave requests',
      'Teacher communication',
    ],
  },
  {
    id: 'students',
    role: 'Students',
    icon: GraduationCap,
    summary: 'Everything for your studies, in one app.',
    points: [
      'Courses',
      'Homework',
      'Timetable',
      'Attendance',
      'Results',
      'Learning progress',
      'School announcements',
      'Digital resources',
    ],
  },
  {
    id: 'accountants',
    role: 'Accountants',
    icon: Wallet,
    summary: 'Collect fees and close books faster.',
    points: [
      'Fee collection',
      'Dues',
      'Receipts',
      'Discounts',
      'Payment reconciliation',
      'Financial reports',
    ],
  },
  {
    id: 'hr',
    role: 'HR Teams',
    icon: UserCog,
    summary: 'Manage staff lifecycle and payroll with ease.',
    points: [
      'Staff records',
      'Attendance',
      'Leave',
      'Payroll',
      'Recruitment',
      'Performance reviews',
    ],
  },
];

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export const navConfig: NavItem[] = [
  {
    label: 'Product',
    href: '/product',
    children: [
      { label: 'Product Overview', href: '/product', description: 'The complete connected platform' },
      { label: 'School ERP', href: '/modules', description: 'Administration and operations' },
      { label: 'Learning Management System', href: '/modules/lms', description: 'Courses and learning' },
      { label: 'Mobile Applications', href: '/mobile-apps', description: 'For every stakeholder' },
      { label: 'Analytics and Reports', href: '/modules/analytics', description: 'Insights for every role' },
      { label: 'AI Capabilities', href: '/#ai', description: 'Intelligence built in' },
      { label: 'Integrations', href: '/integrations', description: 'Connect your tools' },
      { label: 'Security', href: '/security', description: 'Architecture and privacy' },
    ],
  },
  {
    label: 'Solutions',
    href: '/solutions',
    children: [
      { label: 'For School Management', href: '/solutions/owners', description: 'Owners and directors' },
      { label: 'For Principals', href: '/solutions/principals', description: 'Academic leadership' },
      { label: 'For Teachers', href: '/solutions/teachers', description: 'Classroom and admin' },
      { label: 'For Students', href: '/solutions/students', description: 'Learning hub' },
      { label: 'For Parents', href: '/solutions/parents', description: 'Stay informed' },
      { label: 'For Accountants', href: '/solutions/accountants', description: 'Fees and finance' },
      { label: 'For HR Teams', href: '/solutions/hr', description: 'Staff and payroll' },
      { label: 'For School Groups', href: '/solutions/school-groups', description: 'Multi-branch' },
      { label: 'For Educational Trusts', href: '/solutions/trusts', description: 'Trust-wide oversight' },
    ],
  },
  {
    label: 'Modules',
    href: '/modules',
    children: modules.map((m) => ({
      label: m.name,
      href: `/modules/${m.id}`,
      description: m.tagline,
    })),
  },
  {
    label: 'Partners',
    href: '/partners',
  },
  {
    label: 'Resources',
    href: '/blog',
    children: [
      { label: 'Blog', href: '/blog', description: 'Articles and insights' },
      { label: 'Case Studies', href: '/case-studies', description: 'Implementation stories' },
      { label: 'Help Centre', href: '/help', description: 'Guides and support' },
      { label: 'Documentation', href: '/help', description: 'Product docs' },
      { label: 'Webinars', href: '/blog', description: 'On-demand sessions' },
      { label: 'School Digitisation Guide', href: '/blog', description: 'Getting started' },
      { label: 'FAQs', href: '/faq', description: 'Frequently asked questions' },
    ],
  },
  {
    label: 'Company',
    href: '/about/skolaroid',
    children: [
      { label: 'About Skolaroid', href: '/about/skolaroid', description: 'Our product vision' },
      { label: 'About TakeWeb India', href: '/about/takeweb', description: 'The company behind Skolaroid' },
      { label: 'Careers', href: '/careers', description: 'Join the team' },
      { label: 'Partners', href: '/partners', description: 'Partner programme' },
      { label: 'Contact', href: '/contact', description: 'Talk to us' },
      { label: 'Security and Compliance', href: '/security', description: 'How we protect data' },
    ],
  },
  {
    label: 'Pricing',
    href: '/pricing',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

export const footerNav = {
  Product: [
    { label: 'Product Overview', href: '/product' },
    { label: 'Modules', href: '/modules' },
    { label: 'Mobile Apps', href: '/mobile-apps' },
    { label: 'Integrations', href: '/integrations' },
    { label: 'AI', href: '/#ai' },
    { label: 'Security', href: '/security' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Updates', href: '/blog' },
  ],
  Solutions: [
    { label: 'School Management', href: '/solutions/owners' },
    { label: 'Teachers', href: '/solutions/teachers' },
    { label: 'Parents', href: '/solutions/parents' },
    { label: 'Students', href: '/solutions/students' },
    { label: 'School Groups', href: '/solutions/school-groups' },
    { label: 'Educational Trusts', href: '/solutions/trusts' },
  ],
  Resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Help Centre', href: '/help' },
    { label: 'Documentation', href: '/help' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Webinars', href: '/blog' },
    { label: 'FAQs', href: '/faq' },
  ],
  Partners: [
    { label: 'Partner Programme', href: '/partners' },
    { label: 'Technology Partners', href: '/partners' },
    { label: 'Implementation Partners', href: '/partners' },
    { label: 'Become a Partner', href: '/partners' },
  ],
  Company: [
    { label: 'About Skolaroid', href: '/about/skolaroid' },
    { label: 'TakeWeb India', href: '/about/takeweb' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
    { label: 'Support', href: '/help' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Terms of Service', href: '/legal/terms' },
    { label: 'Cookie Policy', href: '/legal/cookies' },
    { label: 'Data Processing Policy', href: '/legal/data-processing' },
    { label: 'Refund and Cancellation Policy', href: '/legal/refund' },
    { label: 'Security Policy', href: '/security' },
  ],
};

export const aiCapabilities: { title: string; status: 'available' | 'soon'; icon: LucideIcon }[] = [
  { title: 'Student performance insights', status: 'soon', icon: BarChart3 },
  { title: 'Attendance-risk identification', status: 'soon', icon: CalendarCheck },
  { title: 'Fee-payment forecasting', status: 'soon', icon: Wallet },
  { title: 'Admission trend analysis', status: 'soon', icon: GraduationCap },
  { title: 'Automated report summaries', status: 'soon', icon: FileText },
  { title: 'Teacher workload insights', status: 'soon', icon: BookOpen },
  { title: 'Personalised learning recommendations', status: 'soon', icon: Sparkles },
  { title: 'Smart timetable assistance', status: 'soon', icon: CalendarCheck },
  { title: 'Communication drafting', status: 'soon', icon: Megaphone },
  { title: 'Early intervention indicators', status: 'soon', icon: ShieldCheck },
  { title: 'Operational anomaly detection', status: 'soon', icon: ShieldCheck },
  { title: 'AI-powered search across records', status: 'soon', icon: Sparkles },
];

export interface IntegrationDef {
  name: string;
  category: string;
  status: 'available' | 'planned' | 'custom';
}

export const integrations: IntegrationDef[] = [
  { name: 'Strapi CMS', category: 'Website Content', status: 'available' },
  { name: 'ERPNext CRM', category: 'Sales & CRM', status: 'available' },
  { name: 'ERPNext Accounting', category: 'Finance', status: 'available' },
  { name: 'Frappe HR', category: 'Hiring & HR', status: 'available' },
  { name: 'MSG91', category: 'Communication', status: 'planned' },
  { name: 'Payment Gateways', category: 'Payments', status: 'available' },
  { name: 'SMS Providers', category: 'Communication', status: 'available' },
  { name: 'Email Providers', category: 'Communication', status: 'available' },
  { name: 'WhatsApp Communication', category: 'Communication', status: 'planned' },
  { name: 'Biometric Attendance', category: 'Hardware', status: 'available' },
  { name: 'RFID Systems', category: 'Hardware', status: 'available' },
  { name: 'GPS & Transport Systems', category: 'Hardware', status: 'available' },
  { name: 'Accounting Platforms', category: 'Finance', status: 'planned' },
  { name: 'Google Workspace', category: 'Productivity', status: 'planned' },
  { name: 'Microsoft Services', category: 'Productivity', status: 'planned' },
  { name: 'Video Conferencing', category: 'Learning', status: 'planned' },
  { name: 'Cloud Storage', category: 'Infrastructure', status: 'available' },
  { name: 'Single Sign-On', category: 'Security', status: 'planned' },
  { name: 'APIs & Webhooks', category: 'Developer', status: 'available' },
];

export interface PricingPlan {
  name: string;
  tagline: string;
  audience: string;
  features: string[];
  highlight?: boolean;
  cta: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Foundation',
    tagline: 'For small schools beginning their digital transformation.',
    audience: 'Up to 500 students',
    features: [
      'Core administration modules',
      'Student information system',
      'Attendance',
      'Fees and finance',
      'Parent app',
      'Email support',
      'Standard storage',
    ],
    cta: 'Get a Custom Quote',
  },
  {
    name: 'Growth',
    tagline: 'For established schools requiring advanced administration, learning and communication.',
    audience: '500–2,500 students',
    features: [
      'All Foundation modules',
      'Learning management system',
      'Examinations and results',
      'HR and payroll',
      'Transport management',
      'Library management',
      'Priority support',
      'Increased storage',
    ],
    highlight: true,
    cta: 'Get a Custom Quote',
  },
  {
    name: 'Enterprise',
    tagline: 'For school groups, educational trusts and multi-branch institutions.',
    audience: '2,500+ students · Multiple branches',
    features: [
      'All Growth modules',
      'Multi-school management',
      'Central super-admin panel',
      'Branch comparison analytics',
      'Hostel management',
      'Inventory and assets',
      'Dedicated implementation manager',
      'Custom integrations',
    ],
    cta: 'Get a Custom Quote',
  },
];

export interface FaqItem {
  category: string;
  q: string;
  a: string;
}

export const faqItems: FaqItem[] = [
  { category: 'Product', q: 'What is Skolaroid?', a: 'Skolaroid is a unified school management platform that connects administration, academics, finance, communication and learning in one secure system.' },
  { category: 'Product', q: 'Is Skolaroid cloud-based?', a: 'Yes. Skolaroid is cloud-based and accessible from any modern browser, with mobile apps for parents, teachers, students and administrators.' },
  { category: 'Implementation', q: 'How long does implementation take?', a: 'Implementation timelines depend on school size and data volume. A typical school goes live in a few weeks following our five-step implementation journey.' },
  { category: 'Implementation', q: 'Do you help with data migration?', a: 'Yes. TakeWeb India provides migration support to move existing student, staff and finance records into Skolaroid.' },
  { category: 'Pricing', q: 'Is pricing fixed or customised?', a: 'Skolaroid is offered through customised quotations based on institution size, modules and usage. Request a demo to receive a tailored quote.' },
  { category: 'Pricing', q: 'Are SMS and payment gateway charges included?', a: 'SMS, email, WhatsApp, storage, payment gateway and custom integrations may be billed based on actual usage where applicable.' },
  { category: 'Security', q: 'How is school data protected?', a: 'Skolaroid is designed with role-based access, data encryption, audit logs and institution-level data separation. We follow privacy-focused architecture principles.' },
  { category: 'Integrations', q: 'Can Skolaroid integrate with our existing hardware?', a: 'Skolaroid integrates with common biometric, RFID and GPS devices. Contact us to confirm compatibility with your specific hardware.' },
  { category: 'Mobile apps', q: 'Which mobile apps are available?', a: 'Skolaroid offers dedicated apps for parents, teachers, students and school administrators. Store links will be enabled once apps are officially published.' },
  { category: 'Customisation', q: 'Can modules be configured for our workflow?', a: 'Yes. Skolaroid is configurable for different school workflows, fee structures, grading systems and academic calendars.' },
];

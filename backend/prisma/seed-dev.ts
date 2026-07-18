import "dotenv/config";
import * as argon2 from "argon2";
import { createHash } from "node:crypto";
import {
  AdmissionStage,
  AnnouncementStatus,
  AssignmentStatus,
  AssignmentSubmissionStatus,
  AttendanceSessionStatus,
  AttendanceStatus,
  BillingCycle,
  ExamStatus,
  FeeDemandStatus,
  MembershipStatus,
  PaymentMethod,
  PrismaClient,
  TenantStatus,
  UserStatus
} from "@prisma/client";

const prisma = new PrismaClient();
const DEMO_PASSWORD = "Password123!";
const DEVELOPMENT_SUPPORT_KEY = "ABC123";

const demoRoles = [
  {
    key: "teacher",
    name: "Teacher",
    email: "teacher@demoschool.edu",
    displayName: "Ravi Sharma",
    permissions: ["teacher.dashboard.view", "attendance.mark", "assignments.create", "submissions.grade", "marks.enter", "exams.view", "messages.send", "announcements.view"]
  },
  {
    key: "student",
    name: "Student",
    email: "student@demoschool.edu",
    displayName: "Aarav Sharma",
    permissions: ["student.dashboard.view", "student.learning.view", "tasks.submit", "messages.send", "announcements.view"]
  },
  {
    key: "parent",
    name: "Parent",
    email: "parent@demoschool.edu",
    displayName: "Neha Sharma",
    permissions: ["guardian.dashboard.view", "guardian.fees.view", "fees.pay", "messages.send", "announcements.view"]
  },
  {
    key: "admin",
    name: "School Admin",
    email: "admin@demoschool.edu",
    displayName: "Meera Iyer",
    permissions: ["admin.dashboard.view", "students.view", "students.create", "academics.manage", "settings.view", "exams.view", "exams.create", "admissions.enquiries.manage", "admissions.applications.decide", "messages.send", "announcements.view", "announcements.send"]
  },
  {
    key: "principal",
    name: "Principal",
    email: "principal@demoschool.edu",
    displayName: "Anita Rao",
    permissions: ["principal.dashboard.view", "students.view", "approvals.manage", "reports.principal.view", "exams.view", "results.publish", "messages.send", "announcements.view", "announcements.send"]
  },
  {
    key: "accountant",
    name: "Accountant",
    email: "accountant@demoschool.edu",
    displayName: "Vikram Menon",
    permissions: ["finance.dashboard.view", "fees.view", "payments.collect", "fee-plans.manage", "reconciliation.manage", "announcements.view"]
  },
  {
    key: "platform",
    name: "Platform Admin",
    email: "platform@skolaroid.com",
    displayName: "Skolaroid Platform Admin",
    platform: true,
    permissions: ["platform.tenants.view", "platform.tenants.create", "platform.tenants.manage", "platform.plans.view", "platform.plans.manage", "platform.operations.view", "platform.settings.view", "platform.settings.manage"]
  }
];

async function main() {
  await resetDevelopmentDatabase();

  const schoolTenant = await prisma.tenant.upsert({
    where: { code: "demo-school" },
    update: { name: "Demo Data", status: TenantStatus.ACTIVE },
    create: {
      code: "demo-school",
      name: "Demo Data",
      status: TenantStatus.ACTIVE
    }
  });

  const branch = await prisma.branch.upsert({
    where: { tenantId_code: { tenantId: schoolTenant.id, code: "main" } },
    update: { name: "Main Branch" },
    create: {
      tenantId: schoolTenant.id,
      code: "main",
      name: "Main Branch"
    }
  });

  await prisma.platformTenantProfile.upsert({
    where: { tenantId: schoolTenant.id },
    update: {
      organizationId: "ORG-DEMO-SCHOOL",
      primaryDomain: "demoschool.edu",
      city: "Demo City",
      state: "Demo State",
      phone: "+91 90000 00000",
      email: "office@demoschool.edu",
      adminName: "Meera Iyer",
      adminEmail: "admin@demoschool.edu",
      studentCapacity: 1200,
      implementationOwner: "Skolaroid Demo Onboarding",
      onboardingNotes: "Development demo school for local testing.",
      supportKeyHash: hashSecret(DEVELOPMENT_SUPPORT_KEY),
      supportKeyRotatedAt: new Date()
    },
    create: {
      tenantId: schoolTenant.id,
      organizationId: "ORG-DEMO-SCHOOL",
      primaryDomain: "demoschool.edu",
      city: "Demo City",
      state: "Demo State",
      phone: "+91 90000 00000",
      email: "office@demoschool.edu",
      adminName: "Meera Iyer",
      adminEmail: "admin@demoschool.edu",
      studentCapacity: 1200,
      implementationOwner: "Skolaroid Demo Onboarding",
      onboardingNotes: "Development demo school for local testing.",
      supportKeyHash: hashSecret(DEVELOPMENT_SUPPORT_KEY)
    }
  });

  const demoPlan = await prisma.platformPlan.create({
    data: {
      code: "DEMO-GROWTH",
      name: "Demo Growth",
      billingCycle: BillingCycle.ANNUAL,
      basePrice: 120000,
      description: "Development plan for Demo Data with academics, attendance, fees, exams, messaging, and reports."
    }
  });

  await prisma.platformSubscription.create({
    data: {
      tenantId: schoolTenant.id,
      planId: demoPlan.id,
      status: "ACTIVE",
      renewsAt: new Date("2027-04-01")
    }
  });

  const passwordHash = await argon2.hash(DEMO_PASSWORD, {
    type: argon2.argon2id,
    memoryCost: 19_456,
    timeCost: 2,
    parallelism: 1
  });

  const demoUsersByRole: Record<string, string> = {};

  for (const demoRole of demoRoles) {
    const role = demoRole.platform
      ? await prisma.platformRole.upsert({
        where: { key: demoRole.key },
        update: { name: demoRole.name, system: true },
        create: {
          key: demoRole.key,
          name: demoRole.name,
          system: true
        }
      })
      : await prisma.role.upsert({
        where: { tenantId_key: { tenantId: schoolTenant.id, key: demoRole.key } },
        update: { name: demoRole.name, system: true },
        create: {
          tenantId: schoolTenant.id,
          key: demoRole.key,
          name: demoRole.name,
          system: true
        }
      });

    for (const permissionKey of demoRole.permissions) {
      const permission = await prisma.permission.upsert({
        where: { key: permissionKey },
        update: {},
        create: { key: permissionKey }
      });

      if (demoRole.platform) {
        await prisma.platformRolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
          update: {},
          create: { roleId: role.id, permissionId: permission.id }
        });
      } else {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
          update: {},
          create: { roleId: role.id, permissionId: permission.id }
        });
      }
    }

    const user = await prisma.user.upsert({
      where: { email: demoRole.email },
      update: {
        passwordHash,
        displayName: demoRole.displayName,
        status: UserStatus.ACTIVE
      },
      create: {
        email: demoRole.email,
        passwordHash,
        displayName: demoRole.displayName,
        status: UserStatus.ACTIVE
      }
    });
    if (demoRole.platform) {
      demoUsersByRole.platform = user.id;
      await prisma.platformUserProfile.upsert({
        where: { userId: user.id },
        update: { roleId: role.id, status: MembershipStatus.ACTIVE },
        create: {
          userId: user.id,
          roleId: role.id,
          status: MembershipStatus.ACTIVE
        }
      });
    } else {
      demoUsersByRole[demoRole.key] = user.id;
      await prisma.userTenantMembership.upsert({
        where: {
          userId_tenantId_branchId_roleId: {
            userId: user.id,
            tenantId: schoolTenant.id,
            branchId: branch.id,
            roleId: role.id
          }
        },
        update: { status: MembershipStatus.ACTIVE },
        create: {
          userId: user.id,
          tenantId: schoolTenant.id,
          branchId: branch.id,
          roleId: role.id,
          status: MembershipStatus.ACTIVE
        }
      });
    }
  }

  await seedDemoData(schoolTenant.id, branch.id, demoUsersByRole);

  console.log("Development identities seeded:");
  for (const demoRole of demoRoles) {
    console.log(`- ${demoRole.email} / ${DEMO_PASSWORD} (${demoRole.name})`);
  }
  console.log("Demo Data tenant seeded with classes, students, attendance, assignments, exams, fees, admissions, messages, announcements, and audit records.");
}

function hashSecret(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

async function resetDevelopmentDatabase() {
  await prisma.pluginAuditLog.deleteMany();
  await prisma.pluginSyncJob.deleteMany();
  await prisma.pluginSetting.deleteMany();
  await prisma.pluginInstallation.deleteMany();
  await prisma.pluginDefinition.deleteMany();
  await prisma.auditEvent.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.feeDemand.deleteMany();
  await prisma.examMark.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.attendanceSession.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.academicClass.deleteMany();
  await prisma.admissionApplication.deleteMany();
  await prisma.platformSubscription.deleteMany();
  await prisma.platformTenantProfile.deleteMany();
  await prisma.platformPlan.deleteMany();
  await prisma.session.deleteMany();
  await prisma.platformUserProfile.deleteMany();
  await prisma.userTenantMembership.deleteMany();
  await prisma.platformRolePermission.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.platformRole.deleteMany();
  await prisma.role.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.user.deleteMany();
  await prisma.permission.deleteMany();
}

async function seedDemoData(tenantId: string, branchId: string, usersByRole: Record<string, string>) {
  const classes = await Promise.all([
    prisma.academicClass.create({ data: { tenantId, branchId, code: "7B-MATH", name: "Class 7B", subject: "Mathematics", room: "R-201" } }),
    prisma.academicClass.create({ data: { tenantId, branchId, code: "8A-MATH", name: "Class 8A", subject: "Mathematics", room: "R-204" } }),
    prisma.academicClass.create({ data: { tenantId, branchId, code: "9A-SCI", name: "Class 9A", subject: "Science", room: "R-210" } })
  ]);

  const studentRows = [
    ["ADM-001", "Aarav Sharma", classes[0].id, "01"],
    ["ADM-002", "Ananya Nair", classes[0].id, "02"],
    ["ADM-003", "Vihaan Mehta", classes[0].id, "03"],
    ["ADM-004", "Isha Kapoor", classes[0].id, "04"],
    ["ADM-005", "Kabir Rao", classes[1].id, "01"],
    ["ADM-006", "Myra Singh", classes[1].id, "02"],
    ["ADM-007", "Rohan Das", classes[1].id, "03"],
    ["ADM-008", "Saanvi Iyer", classes[2].id, "01"],
    ["ADM-009", "Arjun Menon", classes[2].id, "02"],
    ["ADM-010", "Diya Verma", classes[2].id, "03"]
  ] as const;

  const students = [];
  for (const [admissionNo, displayName, classId, rollNo] of studentRows) {
    const student = await prisma.studentProfile.create({
      data: { tenantId, branchId, admissionNo, displayName, status: "ACTIVE" }
    });
    await prisma.enrollment.create({
      data: { tenantId, branchId, classId, studentId: student.id, rollNo, status: "ACTIVE" }
    });
    students.push({ ...student, classId, rollNo });
  }

  const attendanceSession = await prisma.attendanceSession.create({
    data: {
      tenantId,
      branchId,
      classId: classes[0].id,
      attendanceDate: new Date("2026-07-16"),
      status: AttendanceSessionStatus.SUBMITTED,
      submittedAt: new Date("2026-07-16T09:50:00+05:30"),
      submittedById: usersByRole.teacher
    }
  });
  for (const student of students.filter((item) => item.classId === classes[0].id)) {
    await prisma.attendanceRecord.create({
      data: {
        tenantId,
        branchId,
        sessionId: attendanceSession.id,
        studentId: student.id,
        status: student.admissionNo === "ADM-002" ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT,
        note: student.admissionNo === "ADM-002" ? "Parent informed" : null,
        markedById: usersByRole.teacher
      }
    });
  }

  const assignment = await prisma.assignment.create({
    data: {
      tenantId,
      branchId,
      classId: classes[0].id,
      createdById: usersByRole.teacher,
      title: "Algebra Worksheet 4",
      subject: "Mathematics",
      instructions: "Complete linear equations and upload working notes.",
      dueAt: new Date("2026-07-20T18:00:00+05:30"),
      totalMarks: 20,
      submissionType: "TEXT",
      status: AssignmentStatus.PUBLISHED,
      publishedAt: new Date("2026-07-15T12:00:00+05:30")
    }
  });
  for (const student of students.filter((item) => item.classId === classes[0].id)) {
    await prisma.assignmentSubmission.create({
      data: {
        tenantId,
        branchId,
        assignmentId: assignment.id,
        studentId: student.id,
        status: student.admissionNo === "ADM-001" ? AssignmentSubmissionStatus.GRADED : AssignmentSubmissionStatus.ASSIGNED,
        responseText: student.admissionNo === "ADM-001" ? "Solved all questions with steps." : null,
        submittedAt: student.admissionNo === "ADM-001" ? new Date("2026-07-16T17:30:00+05:30") : null,
        marksAwarded: student.admissionNo === "ADM-001" ? 18 : null,
        feedback: student.admissionNo === "ADM-001" ? "Good work. Check question 6 sign convention." : null,
        gradedAt: student.admissionNo === "ADM-001" ? new Date("2026-07-17T09:15:00+05:30") : null,
        gradedById: student.admissionNo === "ADM-001" ? usersByRole.teacher : null
      }
    });
  }

  const exam = await prisma.exam.create({
    data: {
      tenantId,
      branchId,
      classId: classes[0].id,
      createdById: usersByRole.admin,
      name: "Unit Test 2",
      term: "Term 1",
      subject: "Mathematics",
      maxMarks: 50,
      startDate: new Date("2026-07-24"),
      endDate: new Date("2026-07-24"),
      status: ExamStatus.MARKS_ENTRY
    }
  });
  for (const student of students.filter((item) => item.classId === classes[0].id)) {
    await prisma.examMark.create({
      data: {
        tenantId,
        branchId,
        examId: exam.id,
        studentId: student.id,
        marks: student.admissionNo === "ADM-002" ? null : 42,
        absent: student.admissionNo === "ADM-002"
      }
    });
  }

  const firstFeeDemand = await prisma.feeDemand.create({
    data: {
      tenantId,
      branchId,
      studentId: students[0].id,
      label: "Term 1 Tuition Fee",
      amount: 45000,
      dueDate: new Date("2026-07-31"),
      status: FeeDemandStatus.PAID
    }
  });
  await prisma.payment.create({
    data: {
      tenantId,
      branchId,
      demandId: firstFeeDemand.id,
      studentId: students[0].id,
      collectedBy: usersByRole.accountant,
      amount: 45000,
      method: PaymentMethod.UPI,
      receiptNo: "RCPT-DEMO-0001"
    }
  });
  await prisma.feeDemand.create({
    data: {
      tenantId,
      branchId,
      studentId: students[1].id,
      label: "Term 1 Tuition Fee",
      amount: 45000,
      dueDate: new Date("2026-07-31"),
      status: FeeDemandStatus.DUE
    }
  });

  await prisma.admissionApplication.createMany({
    data: [
      { tenantId, branchId, studentName: "Riya Malhotra", grade: "6", guardianName: "Nitin Malhotra", guardianPhone: "+91 91111 22222", guardianEmail: "nitin@example.com", source: "Website", stage: AdmissionStage.UNDER_REVIEW, reviewedById: usersByRole.admin, notes: "Documents requested." },
      { tenantId, branchId, studentName: "Aditya Bose", grade: "8", guardianName: "Maya Bose", guardianPhone: "+91 92222 33333", guardianEmail: "maya@example.com", source: "Walk-in", stage: AdmissionStage.OFFERED, reviewedById: usersByRole.principal, notes: "Seat offered for 2026-27." }
    ]
  });

  const conversation = await prisma.conversation.create({
    data: { tenantId, branchId, title: "Aarav Sharma progress" }
  });
  await prisma.message.createMany({
    data: [
      { tenantId, branchId, conversationId: conversation.id, senderId: usersByRole.teacher, body: "Aarav has submitted the algebra worksheet and performed well." },
      { tenantId, branchId, conversationId: conversation.id, senderId: usersByRole.parent, body: "Thank you. Please share if he needs extra practice before Unit Test 2." }
    ]
  });

  await prisma.announcement.createMany({
    data: [
      { tenantId, branchId, createdById: usersByRole.principal, title: "Parent-Teacher Meeting on 24 July", body: "PTM slots are open for Class 7B and Class 8A.", audienceRole: "parent", status: AnnouncementStatus.SENT, sentAt: new Date("2026-07-16T10:00:00+05:30") },
      { tenantId, branchId, createdById: usersByRole.admin, title: "Unit Test schedule published", body: "Term 1 Unit Test 2 schedule is now available.", audienceRole: "student", status: AnnouncementStatus.SENT, sentAt: new Date("2026-07-16T11:00:00+05:30") }
    ]
  });

  await prisma.auditEvent.createMany({
    data: [
      { tenantId, branchId, actorId: usersByRole.admin, action: "demo.seed.students", resource: "tenant", resourceId: tenantId, metadata: { school: "Demo Data", count: students.length } },
      { tenantId, branchId, actorId: usersByRole.teacher, action: "attendance.submit", resource: "attendance_session", resourceId: attendanceSession.id, metadata: { classCode: "7B-MATH", absent: 1 } },
      { tenantId, branchId, actorId: usersByRole.principal, action: "announcement.send", resource: "announcement", resourceId: null, metadata: { audienceRole: "parent" } }
    ]
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  });

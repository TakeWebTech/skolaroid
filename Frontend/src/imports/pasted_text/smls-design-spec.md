Skolaroid

School Management and Learning System

UI/UX Design System and Complete Screen Specification

Version 1.0 | Beginner-friendly, role-based and scalable

Simple on day one. Powerful when needed.


Skolaroid UI/UX Design System and Complete Screen Specification v1.0

Document Control

Field

Value

Document

Skolaroid UI/UX Design System and Complete Screen Specification

Version

1.0

Status

Product design baseline

Date

2026-07-15

Audience

Founders, product, UI/UX, frontend, QA, implementation and training teams

Related documents

Product Master, PRD, System Architecture and Database Design

Purpose

This document defines navigation, dashboards, screen behaviour, responsive design and complete role-based application flows. It ensures that schools with low technology expertise can operate Skolaroid confidently while regular and advanced users retain efficient and powerful controls.

A teacher who can use WhatsApp and a basic smartphone should be able to take attendance, assign homework, enter marks and communicate without technical training.

1. Core UX Principles

Principle

Required behaviour

Plain language

Use school words, not software or database terms.

One clear next action

Each screen makes the most likely action visually obvious.

Progressive disclosure

Essential controls first; advanced options on demand.

Role relevance

Users only see tasks and information relevant to their work.

Recognition over memory

Visible choices, recent items and labelled actions.

Safe defaults

Default to today, active year, assigned class and sensible settings.

Mistake prevention

Validate early, preview impact and support correction.

Consistency

Same labels, icons, statuses and interaction patterns everywhere.

Low training

Common workflows explain themselves through the interface.

Mobile daily work

Attendance, messages, homework and approvals work well on phones.

Accessibility

Readable, keyboard-friendly and screen-reader compatible.

Fast feedback

Immediate state, progress and clear success/error messages.

1.1 Practical rules

Users understand a page purpose and primary action within three seconds.

Frequent actions are reachable within two actions from the dashboard.

Important actions always have text labels, not icons alone.

Current school, branch, academic year, class or child is always visible.

No screen should display every possible field or setting by default.

2. Beginner, Standard and Advanced Experience

Level

Users

Behaviour

Examples

Beginner

New or low-confidence users

Guided steps, larger actions, minimal choices, explanations and confirmation

One-tap attendance, assignment templates, guided marks entry

Standard

Regular users

Complete daily controls, shortcuts, recent items and filters

Batch actions, duplicate prior work, quick filters

Advanced

Power users and administrators

Bulk tools, automation, analytics, configuration and diagnostics

Bulk import, custom reports, rules, advanced timetable

The experience level is stored per user and can be changed at any time.

Experience level never changes permissions.

Beginner users can open More Options temporarily.

Advanced features stay grouped and collapsed for other users.

The system can remember convenience preferences but never silently change critical behaviour.

2.1 Beginner requirements

Step-by-step wizards

One primary and no more than two secondary actions

Examples beside unfamiliar fields

Preview before send/publish

Clear success message with next step

Short contextual help

2.2 Standard requirements

Inline edits where safe

Recent classes and tasks

Reusable templates

Saved common filters

Advanced sections collapsed

2.3 Advanced requirements

Bulk selection and editing

Saved views and exports

Automation rules

Audit and diagnostics

Configurable dashboards

Dense but readable tables

3. Navigation and Information Architecture

Role

Top navigation

Teacher

Home, My Classes, Attendance, Learning, Assessments, Messages, More

Student

Home, Learn, Tasks, Timetable, Results, Messages

Parent

Home, Child, Attendance, Learning, Fees, Messages

School Admin

Home, People, Academics, Operations, Communication, Reports, Settings

Principal

Home, Academics, Students, Staff, Finance, Reports, Approvals

Accountant

Home, Fees, Payments, Reconciliation, Reports, Settings

Platform Admin

Home, Schools, Plans, Operations, Support, Reports, Settings

Area

Desktop

Tablet

Mobile

Primary navigation

Labelled left sidebar

Collapsible sidebar

Bottom navigation plus More

Secondary navigation

Tabs/local sidebar

Tabs/dropdown

Scrollable tabs or sheet

Global actions

Search, notifications, help, profile

Top bar

Compact header

Context switcher

School/branch/year/class/child selector

Compact

Bottom sheet

Create action

Prominent page button

Prominent button

Sticky/floating action

Maximum seven top-level groups per role

No important icon-only navigation

Back preserves filters and position

Favorites and Recents for frequent pages

Global search respects permission and tenant scope

4. Visual Design System

Clean, calm and trustworthy

Friendly but not childish

Whitespace over decoration

Limited animation

Colour communicates status but always with text/icon

Element

Size

Rule

Page title

28-32 px desktop; 22-26 mobile

Short and descriptive

Section title

20-24 px

Separate meaningful work areas

Card title

16-18 px

Prefer one line

Body

15-16 px

Never below 14 px for core text

Form label

14-15 px

Always visible

Supporting text

13-14 px

Use sparingly

Table text

14-15 px

Comfortable row height

Semantic colour

Meaning

Rule

Primary

Main action/brand

One dominant action per area

Success

Completed, paid, present, passed

Pair with label/icon

Warning

Needs attention or due soon

Not for normal info

Danger

Failure, overdue or destructive

Reserve for real risk

Information

Neutral guidance

Use for context

Muted

Secondary content

Maintain readable contrast

Minimum mobile touch target 44x44 px

Destructive actions separated from common actions

Fields spaced to avoid accidental taps

Important icons always include labels

5. Components and Interaction Patterns

Component

Required behaviour

Buttons

Action labels such as Save Attendance; one primary action per task

Cards

One concept per card; avoid nested card clutter

Tables

Search, filters, pagination, responsive list alternative

Forms

Visible labels, inline help, preserved data after errors

Status chips

Text plus consistent semantic colour

Empty states

Explain why empty and provide next action

Alerts

Problem, impact and recovery action

Wizards

Progress, back, save draft and review

Drawer

Supporting task without losing context

Modal

Short focused confirmation only

Help panel

Contextual guidance without leaving task

Command search

Optional accelerator for standard/advanced users

5.1 Forms

Group 5-7 related fields

Ask only what is needed now

Save Draft for long forms

Inline validation and top summary

Preserve input after error

Mark optional fields clearly

Show units/currency

5.2 Tables

Role-relevant default columns

Maximum ten default columns

Sticky identity column

Bulk actions only after selection

Active filters visible

Mobile card/list alternative

Advanced users can save views

6. Onboarding and Help

Welcome by role

Explain top three tasks

Select language and experience level

Short dashboard tour

Practice task with sample data

Allow skip and reopen

Visible Help on major screens

Short steps and screenshots

Error-specific recovery guidance

School-specific help content

Training mode where safe

Support request includes page context without sensitive data

Avoid

Use

Submit attendance transaction

Save Attendance

Entity not found

This student could not be found

Unauthorized

You do not have permission to view this

Execute bulk operation

Update Selected Students

Invalid input

Enter a valid phone number

Are you sure?

Remove this student from Class 8A? Their history will remain saved.

7. Role Dashboards

7.1 Teacher Dashboard

Aspect

Specification

Users

Teachers

Goal

Complete today's teaching work quickly

Page structure

Greeting, Today's Classes, urgent tasks, quick actions, announcements, student alerts

Primary actions

Take Attendance, Open Lesson, Assign Homework, Enter Marks, Message Class

Beginner

Three large quick actions and today's timetable

Standard

Pending grading, class shortcuts and weekly summary

Advanced

Configurable widgets, workload analytics and bulk tools

Mobile

Single-column cards; bottom navigation; attendance action near class time

Rules

No finance/admin clutter; every card leads to an action

7.2 Student Dashboard

Aspect

Specification

Users

Students

Goal

Show what to learn next

Page structure

Timetable, due tasks, Continue Learning, announcements, feedback, progress

Primary actions

Continue Learning, View Tasks

Beginner

Large next-step actions

Standard

Course progress, calendar and filters

Advanced

Mastery analytics and study planning where permitted

Mobile

Bottom navigation; offline state; full-width cards

Rules

Positive age-appropriate language; no public shaming

7.3 Parent Dashboard

Aspect

Specification

Users

Parents/guardians

Goal

Show urgent child and family actions

Page structure

Child switcher, alerts, attendance, fees, tasks, results, notices

Primary actions

Pay Fees, Apply Leave, Contact School

Beginner

Important updates only

Standard

History, filters and communication shortcuts

Advanced

Multi-child consolidated reports and statements

Mobile

Mobile-first child switcher and large actions

Rules

Separate school notices from urgent child alerts

7.4 Principal Dashboard

Aspect

Specification

Users

Principal/owner

Goal

Show school health, exceptions and approvals

Page structure

KPIs, attention queue, attendance, academics, finance, staff, approvals

Primary actions

Review Alerts, Approve, Drill Down

Beginner

Top exceptions only

Standard

Branch/class/term drill-down

Advanced

Custom dashboards, thresholds and scheduled reports

Mobile

Priority cards; detailed charts separate

Rules

Each metric needs definition and action

7.5 School Admin Dashboard

Aspect

Specification

Users

Administrators

Goal

Guide setup and operations

Page structure

Setup health, pending admissions, user issues, imports, quick create

Primary actions

Continue Setup, Add Student, Import Data

Beginner

Checklist-driven

Standard

Operational queues and activity

Advanced

Bulk tools, integration health and audit

Mobile

Task-focused cards

Rules

Warnings explain impact and correction

7.6 Accountant Dashboard

Aspect

Specification

Users

Accountants

Goal

Manage collections and exceptions

Page structure

Collections, dues, unmatched payments, receipts, approvals

Primary actions

Collect Payment, Reconcile, View Dues

Beginner

Simple collection flow

Standard

Ledgers, filters and daily reconciliation

Advanced

Bulk allocation, settlement analytics and exports

Mobile

Clear monetary lists and protected actions

Rules

Always show currency, status and date

7.7 Platform Admin Dashboard

Aspect

Specification

Users

Skolaroid staff

Goal

Manage tenants and platform safely

Page structure

Tenant KPIs, trials, renewals, incidents, support, health

Primary actions

Create School, Open Support Case, Review Incident

Beginner

Operational checklist

Standard

Tenant search and plan controls

Advanced

Usage, entitlements and diagnostics

Mobile

Summary mobile; sensitive work desktop

Rules

Support tenant context and expiry always visible

8. Global Screens

8.1 Sign In

Aspect

Specification

Users

All users

Goal

Authenticate simply and safely

Page structure

School brand, identity field, password/SSO, language, help

Primary actions

Sign In

Beginner

Single clear form

Standard

Remember recent organisation and explain MFA

Advanced

Sessions and security options

Mobile

Large full-width controls

Rules

Do not reveal account existence

8.2 Search

Aspect

Specification

Users

Permitted users

Goal

Find people, pages, classes and actions

Page structure

Search, grouped results, filters, recent

Primary actions

Open Result

Beginner

Simple grouped results

Standard

Type filters

Advanced

Command actions and saved searches

Mobile

Full-screen sheet

Rules

Permission-safe results

8.3 Notifications

Aspect

Specification

Users

All users

Goal

Show actionable updates

Page structure

All and Action Required tabs, grouped timeline

Primary actions

Open, Mark Read

Beginner

High-value notices only

Standard

Filters and preferences

Advanced

Delivery details where permitted

Mobile

Swipe/deep link

Rules

Deduplicate repeated events

8.4 Profile and Preferences

Aspect

Specification

Users

All users

Goal

Manage language, accessibility, security and experience

Page structure

Profile, language, mode, notifications, sessions

Primary actions

Save Preferences

Beginner

Guided categories

Standard

Normal settings

Advanced

Device/session and advanced preferences

Mobile

Stacked sections

Rules

Mode never changes permission

9. Teacher Screens

9.1 My Classes

Aspect

Specification

Users

Teachers

Goal

Open assigned classes quickly

Page structure

Today and All Classes cards with next action

Primary actions

Open Class, Take Attendance

Beginner

Large cards

Standard

Filters and recent activity

Advanced

Compact workload view

Mobile

Vertical cards

Rules

Do not repeatedly ask year/class context

9.2 Take Attendance

Aspect

Specification

Users

Teachers

Goal

Complete normal attendance under one minute

Page structure

Class/date header, Mark All Present, student rows, status, summary, sticky Save

Primary actions

Mark All Present, Set Absent/Late, Save

Beginner

Tap only exceptions

Standard

Search, reasons and notes

Advanced

Keyboard, bulk status and correction history

Mobile

Large status controls; sticky Save

Rules

Unsaved indicator; prevent duplicates; correction reason after lock

9.3 Course and Lesson

Aspect

Specification

Users

Teachers

Goal

Prepare and deliver content

Page structure

Course outline, lesson content, resources, progress

Primary actions

Open Lesson, Add Material, Publish

Beginner

Next lesson and simple add

Standard

Outline edit and release settings

Advanced

Outcomes, prerequisites and analytics

Mobile

Outline drawer

Rules

Draft/published visually distinct

9.4 Create Assignment

Aspect

Specification

Users

Teachers

Goal

Create homework confidently

Page structure

Wizard: Basics, Instructions, Submission, Grading, Audience, Review

Primary actions

Save Draft, Preview, Publish

Beginner

Templates and recommended defaults

Standard

Single-page option and reusable settings

Advanced

Rubrics, groups and differentiated rules

Mobile

Sticky Next/Publish

Rules

Final confirmation shows audience and due date

9.5 Grade Submission

Aspect

Specification

Users

Teachers

Goal

Review and return work efficiently

Page structure

Student queue, submission, rubric/marks, feedback

Primary actions

Save, Publish, Next

Beginner

One at a time

Standard

Filters and quick comments

Advanced

Batch feedback and moderation

Mobile

Sequential panels

Rules

Autosave draft; explicit publish

9.6 Question Bank

Aspect

Specification

Users

Teachers/coordinators

Goal

Create and reuse questions

Page structure

Search/filter, list, preview, create

Primary actions

Create Question, Add to Quiz

Beginner

Guided create

Standard

Tags, difficulty, duplicate

Advanced

Bulk import, versions and analytics

Mobile

Card list/filter drawer

Rules

Historical question versions immutable

9.7 Enter Marks

Aspect

Specification

Users

Teachers

Goal

Enter validated marks

Page structure

Exam context, grid, max marks, absent, errors, lock

Primary actions

Save Draft, Submit Marks

Beginner

Student-by-student option

Standard

Keyboard grid

Advanced

Spreadsheet paste, bulk and audit

Mobile

Card entry or tablet grid

Rules

Prevent above-max values; show locked state

10. Student, Guardian and Administration Screens

10.1 Student Directory

Aspect

Specification

Users

Authorized staff

Goal

Find students

Page structure

Search, filters, table/cards, actions

Primary actions

Open Student, Add Student

Beginner

Search and class filter

Standard

Saved filters and preview

Advanced

Bulk edit, custom columns and import

Mobile

Student cards

Rules

Hide sensitive fields by default

10.2 Student Profile

Aspect

Specification

Users

Staff/student/guardian with tailored access

Goal

Provide one trusted student record

Page structure

Header and tabs: Overview, Academics, Attendance, Learning, Fees, Documents, Wellbeing, Timeline

Primary actions

Edit permitted section, Contact Guardian

Beginner

Overview and simple tabs

Standard

Complete role-specific tabs

Advanced

History, custom fields and audit

Mobile

Scrollable tabs and sticky action

Rules

Sensitive sections require separate permission

10.3 Add/Admit Student

Aspect

Specification

Users

Admissions/admin

Goal

Create accurate student and guardian record

Page structure

Wizard: Student, Guardians, Placement, Documents, Fees, Review

Primary actions

Save Draft, Continue, Admit

Beginner

Short guided steps

Standard

Optional sections and templates

Advanced

Bulk import and approvals

Mobile

Full-screen wizard

Rules

Reuse application data; duplicate detection

10.4 Academic Setup

Aspect

Specification

Users

Admins

Goal

Configure year, classes, sections and subjects

Page structure

Checklist, hierarchy, edit panel, validation

Primary actions

Continue Setup, Add Item, Copy Prior Year

Beginner

Guided setup

Standard

Direct hierarchy editing

Advanced

Bulk import and advanced mapping

Mobile

Step-based mobile

Rules

Preview impact before applying

10.5 Users and Roles

Aspect

Specification

Users

Admins

Goal

Assign safe access

Page structure

User list, role template, scope, status and audit

Primary actions

Invite User, Assign Role

Beginner

Familiar role names

Standard

Branch/class scope

Advanced

Custom role and permission matrix

Mobile

Simple invitations mobile

Rules

Explain access before assigning

11. Admissions Screens

11.1 Enquiry Pipeline

Aspect

Specification

Users

Admissions

Goal

Track prospective families

Page structure

List/Kanban, owner, source, next action, status

Primary actions

Add Enquiry, Contact, Convert

Beginner

Follow-up ordered list

Standard

Kanban and reminders

Advanced

Automation and analytics

Mobile

List first

Rules

Use school language, not heavy CRM terminology

11.2 Applicant Portal

Aspect

Specification

Users

Parents/applicants

Goal

Complete application on any device

Page structure

Progress, autosave, document upload, payment, review

Primary actions

Save, Continue, Submit

Beginner

One group per step

Standard

Resume and status

Advanced

Saved family profile where useful

Mobile

Camera upload and low-bandwidth

Rules

Autosave and clear privacy notice

11.3 Application Review

Aspect

Specification

Users

Reviewers

Goal

Make controlled admission decision

Page structure

Summary, documents, checklist, notes, evaluation, decision

Primary actions

Request Info, Approve, Waitlist, Reject

Beginner

Guided checklist

Standard

Side-by-side review

Advanced

Scoring templates and bulk scheduling

Mobile

Summary-first

Rules

Decision reason and approval recorded

12. Exams and Results

12.1 Exam Setup

Aspect

Specification

Users

Coordinators

Goal

Create complete exam configuration

Page structure

Wizard: Basics, Subjects, Components, Schedule, Grading, Review

Primary actions

Save, Validate, Publish

Beginner

Defaults copied from prior exam

Standard

Editable components

Advanced

Bulk import and conflict diagnostics

Mobile

Review mobile; setup desktop

Rules

Block publication on unresolved conflicts

12.2 Result Review

Aspect

Specification

Users

Teachers/coordinators/principal

Goal

Verify and publish safely

Page structure

Completion, missing marks, errors, approvals, preview

Primary actions

Fix Issues, Approve, Publish

Beginner

Checklist status

Standard

Class/subject drill-down

Advanced

Moderation and anomaly review

Mobile

Approval cards

Rules

Explicit audience and confirmation

12.3 Report Card

Aspect

Specification

Users

Students/parents/staff

Goal

Present results clearly

Page structure

Summary, subject grades, comments, attendance, download

Primary actions

Download, View Details

Beginner

Simple summary

Standard

Term comparison

Advanced

Version history for authorized users

Mobile

Readable vertical report

Rules

Explain grading; avoid public rank by default

13. Fees and Finance

13.1 Fee Setup

Aspect

Specification

Users

Accountants/admins

Goal

Create fee plans correctly

Page structure

Wizard: Heads, Amounts, Classes, Installments, Concessions, Preview

Primary actions

Save Draft, Preview, Activate

Beginner

Templates/examples

Standard

Copy prior plan and editable table

Advanced

Rules, bulk adjustments and mapping

Mobile

Review mobile; build desktop

Rules

Preview affected students and total demand

13.2 Collect Payment

Aspect

Specification

Users

Accountants

Goal

Accept payment and issue receipt

Page structure

Student search, outstanding dues, amount, method, allocation, confirmation

Primary actions

Collect, Print/Send Receipt

Beginner

Auto-allocate oldest dues

Standard

Partial/manual allocation

Advanced

Split payment, adjustment and ledger

Mobile

Large keypad and receipt share

Rules

Idempotent submission and clear status

13.3 Parent Payment

Aspect

Specification

Users

Parents

Goal

Understand and pay dues

Page structure

Child switcher, total due, installment cards, receipts

Primary actions

Pay Now

Beginner

Simple total and breakdown

Standard

Installment selection

Advanced

Multi-child combined payment where supported

Mobile

Mobile-first gateway flow

Rules

Clear processing and recovery state

13.4 Reconciliation

Aspect

Specification

Users

Accountants

Goal

Resolve unmatched settlements

Page structure

Summary, exceptions, suggested match, detail

Primary actions

Match, Resolve, Export

Beginner

Guided exception list

Standard

Filters/manual match

Advanced

Bulk rules and provider diagnostics

Mobile

Summary mobile; full desktop

Rules

Never auto-hide differences

14. Communication and Operations

14.1 Announcement

Aspect

Specification

Users

Authorized staff

Goal

Send correct message to correct audience

Page structure

Message, audience, channel, schedule, preview

Primary actions

Save Draft, Preview, Send

Beginner

Templates and guided audience

Standard

Attachments, schedule, acknowledgement

Advanced

Segments, multilingual and analytics

Mobile

Mobile composer

Rules

Show recipient count before send

14.2 Messaging

Aspect

Specification

Users

Permitted roles

Goal

Support safe communication

Page structure

Conversation list, thread, participant context, attachments

Primary actions

Reply, New Message

Beginner

Simple inbox

Standard

Search and class groups

Advanced

Moderation and retention

Mobile

Chat layout

Rules

Respect role policy and quiet hours

14.3 Timetable

Aspect

Specification

Users

All roles

Goal

View/manage schedules

Page structure

Week grid or agenda, filters and conflict status

Primary actions

View Today, Substitute, Edit

Beginner

Today's agenda

Standard

Week view

Advanced

Constraints, drag/drop and diagnostics

Mobile

Agenda default

Rules

Do not rely only on colour

14.4 Leave

Aspect

Specification

Users

Students/parents/staff/approvers

Goal

Submit and approve leave

Page structure

Dates, reason, attachment, status timeline

Primary actions

Submit, Approve, Reject

Beginner

Short form

Standard

History and cancel

Advanced

Policy diagnostics and delegation

Mobile

Mobile-first

Rules

Show attendance/staffing effect

14.5 Library

Aspect

Specification

Users

Librarians/users

Goal

Find and circulate resources

Page structure

Catalogue, availability, member and issue/return

Primary actions

Search, Issue, Return

Beginner

Simple search and scan

Standard

Reservations/fines

Advanced

Inventory and analytics

Mobile

Barcode scanning

Rules

Separate title and physical copy availability

14.6 Transport

Aspect

Specification

Users

Transport staff/parents

Goal

Manage routes and show child transport

Page structure

Routes, stops, vehicles, assignments, status

Primary actions

Assign, Notify, View Route

Beginner

Parent sees only route/stop/status

Standard

Staff assignments

Advanced

Optimization and diagnostics

Mobile

Map with list fallback

Rules

Location purpose-limited and protected

15. Reports and Analytics

Begin with plain-language summary

Every chart has labels and table alternative

Show date range and filters

Metrics include definition and suggested action

Beginners get curated reports

Standard users filter/schedule

Advanced users create saved views and exports

15.1 Report Builder

Aspect

Specification

Users

Advanced authorized users

Goal

Build reusable reports safely

Page structure

Dataset, fields, filters, grouping, preview, save, schedule

Primary actions

Preview, Save, Export

Beginner

Use ready-made reports instead

Standard

Modify filters and columns

Advanced

Custom report and schedule

Mobile

View mobile; build desktop

Rules

Only approved, permission-safe fields

16. Responsive Behaviour

Pattern

Desktop

Tablet

Mobile

Dashboard

Multi-column

Two-column

Single prioritized column

Navigation

Expanded sidebar

Collapsed sidebar

Bottom navigation

Tables

Full table

Reduced columns

Cards/list

Forms

One/two columns

One/two

Single column

Wizard

Step rail

Top steps

Progress bar; one step

Actions

Top right

Top/bottom

Sticky bottom

Filters

Inline/sidebar

Drawer

Bottom sheet

Charts

Chart and summary

Responsive

Summary first

No hover-only actions

Correct mobile keyboards

Camera capture supported

Offline/sync state visible

Avoid wide editable grids on phones

Primary action respects safe area

17. States, Accessibility and Localisation

State

Required design

Loading

Skeleton and progress for long work

Empty

Reason and first action

No results

Active filters and Clear

Permission denied

Explain limitation and help path

Validation error

Inline error; preserve data

System error

Retry and reference code

Offline

Available features and sync status

Success

Exact result and next action

Partial success

Completed and failed items

Target WCAG 2.2 AA

Keyboard and visible focus

Semantic labels/headings

Text alternatives for charts

No colour-only meaning

Font scaling

Localisable text

Future RTL support

English and prioritized Indian languages

18. Safety and Error Prevention

Preview before messages/results/fees

Show affected people or records

Undo for low-risk actions

Reason for marks corrections/refunds

Warn on unusual branch/year context

Autosave drafts but never auto-publish

Audit link after high-risk action

19. Usability Testing and Metrics

Measure

Target

First-time attendance completion

90%+ without trainer

Attendance task time

Under 60 seconds

Basic assignment creation

Under 3 minutes first time

Parent payment completion

95%+ after gateway load

Navigation

Common tasks within two actions

Error recovery

User corrects without support

System Usability Scale

80+ after pilot refinement

Test low-confidence teachers

Experienced teachers

Admins/principals

Accountants

Parents on budget Android phones

Students across age groups

Accessibility participants where feasible

Take attendance without training

Assign homework

Pay fee

Record cash payment

Find high absence classes

Admit student

Enter marks

Download report card

Switch experience mode

Recover from error/offline state

20. Design Handoff Standards

Shared Figma design system

Desktop/tablet/mobile variants

All component states

Prototype critical workflows

Permission and data annotations

Realistic school data

Link screens to requirements

Shared frontend component package

Library

Contents

Foundations

Colour, typography, spacing, radius, elevation, icons, motion

Actions

Buttons, links, menus, action bars

Inputs

Text, select, date, upload, search, validation

Data display

Cards, tables, lists, status, avatars, timelines

Navigation

Sidebar, tabs, breadcrumbs, bottom navigation, context selector

Feedback

Alerts, toast, progress, skeleton, empty/error

Overlays

Modal, drawer, bottom sheet, popover

Domain

Student card, class card, attendance row, fee item, marks grid

21. Complete Screen Inventory

Area

Screens

Global

Sign in, password reset, MFA, school selection, search, notifications, profile, preferences, help, support

Teacher

Dashboard, classes, class detail, timetable, attendance, course, lesson editor, assignment, submissions, grading, questions, quiz, marks, messages, insights

Student

Dashboard, timetable, courses, lesson, tasks, submit, quizzes, results, attendance, announcements, messages, profile

Parent

Dashboard, child, attendance, timetable, assignments, results, fees, payment, receipts, leave, transport, announcements, meetings, messages

Admin

Dashboard, setup, branches, years, classes, sections, subjects, users, roles, students, profile, imports, templates, integrations, audit

Admissions

Enquiries, application builder, applicant portal, review, interviews, offer, conversion, reports

Exams

Exam list/setup, components, schedule, marks, moderation, publication, report cards, promotion

Finance

Dashboard, fee heads/plans, demands, collections, receipt, reconciliation, concessions, refunds, ledger, reports

Operations

Timetable, substitution, library, transport, hostel, visitors, gate passes, assets, maintenance

Wellbeing

Health alerts, incidents, referrals, restricted cases, emergency contacts

Principal

Dashboard, approvals, academics, attendance, staff, finance, discipline, reports

Platform

Dashboard, tenants, plans, entitlements, subscriptions, domains, usage, support, incidents, health, audit, settings

22. Design and Implementation Sequence

Phase

Deliverables

1

Foundations, components, navigation and responsive shell

2

Authentication, onboarding, preferences and help

3

Teacher, student and parent dashboards

4

Academic setup, users, students and enrollment

5

Attendance and timetable

6

Learning, assignments, quizzes and grading

7

Exams, marks, results and report cards

8

Fees, payment and reconciliation

9

Admissions, communication and operations

10

Advanced analytics, automation and platform admin

22.1 First design sprint

Foundation tokens

Sidebar/mobile navigation/context selector

Buttons/forms/tables/cards/status

Experience level behaviour

Teacher Dashboard

Attendance prototype

Create Assignment prototype

Parent dashboard/payment

Low-technology usability test

Revise before expansion

23. Anti-Patterns

ERP sidebar with dozens of items

Database terms and IDs

Unlabelled important icons

One dashboard for every role

Repeated context selection

All fields shown by default

Tables as only mobile pattern

Autosave that publishes

Decorative analytics

Advanced controls forced on beginners

Generic errors

Dark patterns or public ranking shame

24. UI/UX Definition of Done

Primary user and goal defined

Beginner/Standard/Advanced behaviour defined

Desktop/tablet/mobile specified

Loading/empty/error/success/permission states

Accessibility checked

Tested with representative users

Uses design system

Plain-language microcopy

Permissions and sensitivity documented

Success metric defined

25. Final UX Position

Skolaroid must feel easy to a first-time teacher without feeling limited to an expert administrator.

The interface will achieve this through progressive disclosure, role-specific navigation, safe defaults and guided workflows. Beginners see only the decisions required to finish their work. Standard users gain shortcuts and flexibility. Advanced users gain bulk tools, automation, analytics and configuration without making the everyday interface difficult for everyone else.

Success will be measured by whether schools complete real work accurately, quickly and confidently with less training, fewer mistakes and fewer support requests—not by visual decoration alone.

Skolaroid UI/UX Design System and Complete Screen Specification v1.0
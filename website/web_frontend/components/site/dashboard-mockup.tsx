'use client';

import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Wallet,
  BookOpen,
  ClipboardCheck,
  Megaphone,
  Bus,
  BarChart3,
  Bell,
  TrendingUp,
  TrendingDown,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandLogo } from './brand-logo';

export type DashboardVariant =
  | 'overview'
  | 'attendance'
  | 'admissions'
  | 'fees'
  | 'exams'
  | 'lms'
  | 'communication'
  | 'transport'
  | 'analytics'
  | 'multi-school';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Users, label: 'Students' },
  { icon: CalendarCheck, label: 'Attendance' },
  { icon: Wallet, label: 'Fees' },
  { icon: BookOpen, label: 'Academics' },
  { icon: ClipboardCheck, label: 'Exams' },
  { icon: Megaphone, label: 'Communication' },
  { icon: Bus, label: 'Transport' },
  { icon: BarChart3, label: 'Analytics' },
];

function Sparkline({ data, color = 'hsl(var(--primary))' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120;
  const h = 36;
  const pts = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((d - min) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-full" preserveAspectRatio="none">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={`0,${h} ${pts} ${w},${h}`}
        fill={color}
        opacity="0.08"
      />
    </svg>
  );
}

function BarChart({ data, color = 'hsl(var(--primary))' }: { data: number[]; color?: string }) {
  const max = Math.max(...data) || 1;
  return (
    <div className="flex h-24 items-end gap-1.5">
      {data.map((d, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all duration-700"
          style={{ height: `${(d / max) * 100}%`, background: color, opacity: 0.4 + (d / max) * 0.6 }}
        />
      ))}
    </div>
  );
}

export function DashboardMockup({ variant = 'overview' }: { variant?: DashboardVariant }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
      {/* Top bar */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        </div>
        <div className="ml-3 hidden flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground sm:flex">
          <Search className="h-3 w-3" />
          skolaroid.app/dashboard
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-secondary" />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-44 shrink-0 border-r border-border bg-muted/30 p-3 sm:block">
          <div className="mb-4 flex items-center gap-2">
            <BrandLogo markClassName="h-7 w-7 rounded-lg" textClassName="text-sm" />
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors',
                  item.active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Good morning, Principal</p>
              <h4 className="text-base font-bold font-display">
                {variant === 'multi-school' ? 'Group Overview' : 'School Overview'}
              </h4>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600">
              Live
            </span>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {kpisFor(variant).map((kpi) => (
              <div key={kpi.label} className="rounded-xl border border-border bg-background p-3">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
                <p className="mt-1 text-lg font-bold font-display">{kpi.value}</p>
                <div className={cn('mt-1 flex items-center gap-1 text-[10px] font-medium', kpi.up ? 'text-emerald-600' : 'text-red-500')}>
                  {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {kpi.change}
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-background p-4 lg:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold">Attendance trend</p>
                <span className="text-[10px] text-muted-foreground">Last 7 days</span>
              </div>
              <Sparkline data={[88, 92, 90, 94, 91, 96, 93]} />
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="mb-2 text-xs font-semibold">Fee collection</p>
              <BarChart data={[40, 65, 52, 78, 60, 85, 72]} color="hsl(var(--chart-4))" />
            </div>
          </div>

          {/* Activity list */}
          <div className="mt-4 rounded-xl border border-border bg-background p-4">
            <p className="mb-3 text-xs font-semibold">Recent activity</p>
            <div className="space-y-2.5">
              {activityFor(variant).map((a, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: a.color }} />
                  <span className="font-medium text-foreground">{a.title}</span>
                  <span className="ml-auto text-muted-foreground">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function kpisFor(variant: DashboardVariant) {
  switch (variant) {
    case 'attendance':
      return [
        { label: 'Present today', value: '1,842', change: '96.2%', up: true },
        { label: 'Absent', value: '73', change: '3.8%', up: false },
        { label: 'Late entries', value: '12', change: '-4%', up: true },
        { label: 'On leave', value: '21', change: 'Stable', up: true },
      ];
    case 'admissions':
      return [
        { label: 'New enquiries', value: '128', change: '+18%', up: true },
        { label: 'In pipeline', value: '64', change: '+9%', up: true },
        { label: 'Offers made', value: '37', change: '+12%', up: true },
        { label: 'Enrolled', value: '22', change: '+6%', up: true },
      ];
    case 'fees':
      return [
        { label: 'Collected (₹)', value: '42.6L', change: '+14%', up: true },
        { label: 'Outstanding', value: '6.8L', change: '-8%', up: true },
        { label: 'Online payments', value: '78%', change: '+22%', up: true },
        { label: 'Reminders sent', value: '312', change: 'Auto', up: true },
      ];
    case 'exams':
      return [
        { label: 'Exams active', value: '4', change: 'Ongoing', up: true },
        { label: 'Marks entered', value: '92%', change: '+5%', up: true },
        { label: 'Report cards', value: '1,915', change: 'Ready', up: true },
        { label: 'Avg score', value: '78.4%', change: '+2.1%', up: true },
      ];
    case 'lms':
      return [
        { label: 'Active courses', value: '186', change: '+12', up: true },
        { label: 'Completion', value: '74%', change: '+6%', up: true },
        { label: 'Quizzes taken', value: '2,341', change: '+18%', up: true },
        { label: 'Certificates', value: '489', change: '+34', up: true },
      ];
    case 'communication':
      return [
        { label: 'Messages sent', value: '8,420', change: '+24%', up: true },
        { label: 'Delivery rate', value: '98.6%', change: '+0.4%', up: true },
        { label: 'Read receipts', value: '91%', change: '+3%', up: true },
        { label: 'Emergency alerts', value: '2', change: 'Sent', up: true },
      ];
    case 'transport':
      return [
        { label: 'Vehicles running', value: '24', change: 'On route', up: true },
        { label: 'Students boarded', value: '1,124', change: '96%', up: true },
        { label: 'Routes active', value: '18', change: 'All clear', up: true },
        { label: 'Alerts today', value: '3', change: 'Resolved', up: true },
      ];
    case 'analytics':
      return [
        { label: 'Insights', value: '24', change: '+8', up: true },
        { label: 'At-risk students', value: '17', change: 'Flagged', up: false },
        { label: 'Fee forecast', value: '92%', change: 'On track', up: true },
        { label: 'Anomalies', value: '2', change: 'Review', up: false },
      ];
    case 'multi-school':
      return [
        { label: 'Branches', value: '6', change: 'Active', up: true },
        { label: 'Total students', value: '12,480', change: '+340', up: true },
        { label: 'Fee collected (₹)', value: '2.4Cr', change: '+11%', up: true },
        { label: 'Avg attendance', value: '94.1%', change: '+1.2%', up: true },
      ];
    default:
      return [
        { label: 'Students', value: '1,915', change: '+24', up: true },
        { label: 'Attendance', value: '96.2%', change: '+1.4%', up: true },
        { label: 'Fee collected', value: '78%', change: '+6%', up: true },
        { label: 'Pending tasks', value: '12', change: '-3', up: true },
      ];
  }
}

function activityFor(variant: DashboardVariant) {
  const base = [
    { title: 'Admission enquiry — Riverside Public School', time: '2m ago', color: 'hsl(var(--primary))' },
    { title: 'Fee payment received — ₹12,400', time: '6m ago', color: 'hsl(var(--chart-4))' },
    { title: 'Attendance marked for Class 10-B', time: '14m ago', color: 'hsl(var(--accent))' },
    { title: 'Transport alert — Bus 14 on route', time: '22m ago', color: 'hsl(var(--chart-5))' },
  ];
  return base;
}

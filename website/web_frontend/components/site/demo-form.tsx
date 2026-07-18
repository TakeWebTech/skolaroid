'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { modules } from '@/lib/site-data';
import { cn } from '@/lib/utils';

const step1Schema = z.object({
  school_name: z.string().min(2, 'School name is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  school_type: z.string().min(1, 'Select a school type'),
  student_count: z.string().min(1, 'Select student count'),
  branch_count: z.string().min(1, 'Select branch count'),
});
const step2Schema = z.object({
  challenges: z.string().optional(),
  current_software: z.string().optional(),
  modules_of_interest: z.array(z.string()).default([]),
  timeline: z.string().optional(),
});
const step3Schema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  job_title: z.string().min(2, 'Job title is required'),
  phone: z.string().min(6, 'Valid phone is required'),
  work_email: z.string().email('Valid work email is required'),
});
const step4Schema = z.object({
  preferred_date: z.string().optional(),
  preferred_time: z.string().optional(),
  meeting_type: z.string().optional(),
  additional_requirements: z.string().optional(),
  consent: z.boolean().refine((v) => v === true, 'You must agree to be contacted'),
});

const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema).merge(step4Schema);
type FormData = z.infer<typeof fullSchema>;

const stepsMeta = [
  { n: 1, label: 'Institution' },
  { n: 2, label: 'Requirements' },
  { n: 3, label: 'Contact' },
  { n: 4, label: 'Schedule' },
];

const schoolTypes = ['School', 'Pre-School', 'College', 'Coaching Institute', 'School Group', 'Educational Trust', 'University'];
const studentCounts = ['1–200', '200–500', '500–1,000', '1,000–2,500', '2,500–5,000', '5,000+'];
const branchCounts = ['1', '2–5', '6–10', '10+'];
const timelines = ['Immediately', '1–3 months', '3–6 months', 'Just exploring'];
const meetingTypes = ['Online', 'On-site', 'Phone call'];

export function DemoForm({ sourcePage = '/demo' }: { sourcePage?: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(step === 1 ? step1Schema : step === 2 ? step2Schema : step === 3 ? step3Schema : step4Schema) as never,
    mode: 'onTouched',
    defaultValues: {
      country: 'India',
      modules_of_interest: [],
      consent: false,
    },
  });

  const progress = (step / 4) * 100;

  const onNext = async () => {
    const valid = await form.trigger();
    if (!valid) return;
    setStep((s) => Math.min(s + 1, 4));
  };
  const onBack = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async () => {
    const valid = await form.trigger();
    if (!valid) return;
    setSubmitting(true);
    try {
      const values = form.getValues();
      const payload = {
        ...values,
        modules_of_interest: values.modules_of_interest ?? [],
        source_page: sourcePage,
        referrer: typeof window !== 'undefined' ? document.referrer : null,
        campaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') : null,
        consent: true,
      };

      const response = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Demo request API failed');

      toast.success('Demo request received', {
        description: 'Our team will reach out within one business day.',
      });
      router.push('/demo/thank-you');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong', {
        description: 'Please try again or email hello@takeweb.in.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleModule = (id: string) => {
    const current = form.watch('modules_of_interest') ?? [];
    const next = current.includes(id) ? current.filter((m) => m !== id) : [...current, id];
    form.setValue('modules_of_interest', next);
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {stepsMeta.map((s) => (
            <div key={s.n} className="flex flex-1 items-center">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors',
                    step > s.n
                      ? 'bg-emerald-500 text-white'
                      : step === s.n
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {step > s.n ? <Check className="h-4 w-4" /> : s.n}
                </span>
                <span className={cn('hidden text-xs font-medium sm:block', step >= s.n ? 'text-foreground' : 'text-muted-foreground')}>
                  {s.label}
                </span>
              </div>
              {s.n < 4 && <div className="mx-2 h-px flex-1 bg-border" />}
            </div>
          ))}
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-display">Tell us about your institution</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="School or organisation name" error={form.formState.errors.school_name?.message}>
                <Input {...form.register('school_name')} placeholder="Riverdale Public School" />
              </Field>
              <Field label="School type" error={form.formState.errors.school_type?.message}>
                <Select onValueChange={(v) => form.setValue('school_type', v)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {schoolTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="City" error={form.formState.errors.city?.message}>
                <Input {...form.register('city')} placeholder="Pune" />
              </Field>
              <Field label="State" error={form.formState.errors.state?.message}>
                <Input {...form.register('state')} placeholder="Maharashtra" />
              </Field>
              <Field label="Country" error={form.formState.errors.country?.message}>
                <Input {...form.register('country')} placeholder="India" />
              </Field>
              <Field label="Number of students" error={form.formState.errors.student_count?.message}>
                <Select onValueChange={(v) => form.setValue('student_count', v)}>
                  <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                  <SelectContent>
                    {studentCounts.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Number of branches" error={form.formState.errors.branch_count?.message}>
                <Select onValueChange={(v) => form.setValue('branch_count', v)}>
                  <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                  <SelectContent>
                    {branchCounts.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-display">What are you looking for?</h3>
            <Field label="Current challenges (optional)">
              <Textarea {...form.register('challenges')} rows={3} placeholder="What problems are you trying to solve?" />
            </Field>
            <Field label="Existing software (optional)">
              <Input {...form.register('current_software')} placeholder="Spreadsheets, another ERP, none..." />
            </Field>
            <Field label="Modules of interest">
              <div className="grid gap-2 sm:grid-cols-2">
                {modules.map((m) => {
                  const selected = (form.watch('modules_of_interest') ?? []).includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleModule(m.id)}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-all',
                        selected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/40'
                      )}
                    >
                      <span className={cn('flex h-4 w-4 items-center justify-center rounded border', selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border')}>
                        {selected && <Check className="h-3 w-3" />}
                      </span>
                      {m.short}
                    </button>
                  );
                })}
              </div>
            </Field>
            <Field label="Desired implementation timeline (optional)">
              <Select onValueChange={(v) => form.setValue('timeline', v)}>
                <SelectTrigger><SelectValue placeholder="Select timeline" /></SelectTrigger>
                <SelectContent>
                  {timelines.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-display">How can we reach you?</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={form.formState.errors.full_name?.message}>
                <Input {...form.register('full_name')} placeholder="Anita Sharma" />
              </Field>
              <Field label="Job title" error={form.formState.errors.job_title?.message}>
                <Input {...form.register('job_title')} placeholder="Principal" />
              </Field>
              <Field label="Work email" error={form.formState.errors.work_email?.message}>
                <Input type="email" {...form.register('work_email')} placeholder="anita@school.edu" />
              </Field>
              <Field label="Phone number" error={form.formState.errors.phone?.message}>
                <Input {...form.register('phone')} placeholder="+91 98765 43210" />
              </Field>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-display">Schedule your demo</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Preferred demo date (optional)">
                <Input type="date" {...form.register('preferred_date')} />
              </Field>
              <Field label="Preferred demo time (optional)">
                <Select onValueChange={(v) => form.setValue('preferred_time', v)}>
                  <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                  <SelectContent>
                    {['Morning', 'Afternoon', 'Evening'].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Meeting type (optional)">
                <Select onValueChange={(v) => form.setValue('meeting_type', v)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {meetingTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Additional requirements (optional)">
              <Textarea {...form.register('additional_requirements')} rows={3} placeholder="Anything else we should know?" />
            </Field>
            <Field label="" error={form.formState.errors.consent?.message as string}>
              <label className="flex items-start gap-3 text-sm text-muted-foreground">
                <Checkbox
                  checked={form.watch('consent')}
                  onCheckedChange={(v) => form.setValue('consent', v === true)}
                />
                <span>
                  I agree to be contacted by TakeWeb India about my demo request and Skolaroid. My information will be handled in line with the Privacy Policy.
                </span>
              </label>
            </Field>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Button type="button" variant="ghost" onClick={onBack} disabled={step === 1 || submitting}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {step < 4 ? (
            <Button type="button" onClick={onNext}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={onSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Request Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

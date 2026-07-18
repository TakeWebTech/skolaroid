'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowRight, Loader2 } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(6, 'Valid phone is required'),
  organisation: z.string().min(2, 'Organisation is required'),
  enquiry_type: z.string().min(1, 'Select an enquiry type'),
  message: z.string().min(5, 'Please add a short message'),
});
type Data = z.infer<typeof schema>;

const enquiryTypes = ['Sales enquiry', 'Product support', 'Partnership enquiry', 'General enquiry'];

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<Data>({ resolver: zodResolver(schema), mode: 'onTouched' });

  const onSubmit = async () => {
    const valid = await form.trigger();
    if (!valid) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.getValues()),
      });
      if (!response.ok) throw new Error('Contact API failed');
      toast.success('Message sent', {
        description: 'We’ll respond within one business day.',
      });
      form.reset();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={form.formState.errors.name?.message}>
          <Input {...form.register('name')} placeholder="Anita Sharma" />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input type="email" {...form.register('email')} placeholder="anita@school.edu" />
        </Field>
        <Field label="Phone" error={form.formState.errors.phone?.message}>
          <Input {...form.register('phone')} placeholder="+91 98765 43210" />
        </Field>
        <Field label="Organisation" error={form.formState.errors.organisation?.message}>
          <Input {...form.register('organisation')} placeholder="Riverdale Public School" />
        </Field>
      </div>
      <Field label="Enquiry type" error={form.formState.errors.enquiry_type?.message}>
        <Select onValueChange={(v) => form.setValue('enquiry_type', v)}>
          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            {enquiryTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Message" error={form.formState.errors.message?.message}>
        <Textarea {...form.register('message')} rows={4} placeholder="How can we help?" />
      </Field>
      <Button onClick={onSubmit} disabled={submitting} className="w-full">
        {submitting ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
        ) : (
          <>Send Message <ArrowRight className="ml-2 h-4 w-4" /></>
        )}
      </Button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

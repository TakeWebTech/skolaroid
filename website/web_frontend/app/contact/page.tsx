import type { Metadata } from 'next';
import { PageHero } from '@/components/site/page-hero';
import { ContactForm } from '@/components/site/contact-form';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Talk to the TakeWeb India team about Skolaroid — sales, support, partnerships and general enquiries.',
  alternates: { canonical: 'https://skolaroid.com/contact' },
};

const channels = [
  { icon: Mail, label: 'Email', value: 'hello@takeweb.in', href: 'mailto:hello@takeweb.in' },
  { icon: Phone, label: 'Phone', value: '+91 00 0000 0000', href: 'tel:+910000000000' },
  { icon: MapPin, label: 'Office', value: 'India' },
  { icon: Clock, label: 'Business hours', value: 'Mon–Fri, 9:00–18:00 IST' },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to our team"
        description="Whether you’re exploring Skolaroid, need support, or want to partner with us — we’d love to hear from you."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold font-display">Get in touch</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                These contact details are placeholders. Real email, phone and office location will be added before launch.
              </p>
              <div className="mt-6 space-y-4">
                {channels.map((c) => (
                  <div key={c.label} className="flex items-start gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</p>
                      {c.href ? (
                        <a href={c.href} className="text-sm font-medium hover:text-primary">{c.value}</a>
                      ) : (
                        <p className="text-sm font-medium">{c.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 h-40 rounded-2xl border border-dashed border-border bg-muted/30 flex items-center justify-center text-xs text-muted-foreground">
                Map placeholder
              </div>
            </div>
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

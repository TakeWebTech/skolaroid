import type { Metadata } from 'next';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { getBlogPosts } from '@/lib/cms-content';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights on school management, digital transformation and education technology.',
  alternates: { canonical: 'https://skolaroid.com/blog' },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Insights for modern schools"
        description="Articles on school management, digital transformation, education technology and more."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2">
                {categories.map((c, i) => (
                  <span key={c} className={`rounded-full border px-3 py-1.5 text-xs font-medium ${i === 0 ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground'}`}>
                    {c}
                  </span>
                ))}
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((p, i) => (
                  <Reveal key={p.slug} delay={(i % 3) * 80}>
                    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-glow">
                      <div className="h-40 bg-gradient-to-br from-primary/15 to-secondary/15" />
                      <div className="flex flex-1 flex-col p-5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{p.category}</span>
                        <h3 className="mt-2 text-base font-semibold font-display">{p.title}</h3>
                        <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {p.date}</span>
                          <span className="flex items-center gap-1 font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">Read <ArrowRight className="h-3 w-3" /></span>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <h2 className="text-xl font-semibold font-display">No blog posts published yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">Create and publish Blog Post entries in Strapi to populate this page.</p>
            </div>
          )}

          <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-6 text-center">
            <h3 className="text-lg font-semibold font-display">Subscribe to our newsletter</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get updates on education technology and Skolaroid.</p>
            <form className="mx-auto mt-4 flex max-w-md gap-2">
              <input className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm" placeholder="you@school.edu" />
              <button type="button" className="h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';
import { Search, BookOpen } from 'lucide-react';
import { getHelpArticles } from '@/lib/cms-content';

export const metadata: Metadata = {
  title: 'Help Centre',
  description: 'Guides and support for administrators, teachers, parents and students using Skolaroid.',
  alternates: { canonical: 'https://skolaroid.com/help' },
};

export default async function HelpPage() {
  const articles = await getHelpArticles();
  const categories = Array.from(new Set(articles.map((article) => article.category)));

  return (
    <>
      <PageHero
        eyebrow="Help Centre"
        title="How can we help?"
        description="Search guides or browse by category."
      >
        <form className="mx-auto mt-2 flex max-w-md gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input className="h-11 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm" placeholder="Search guides..." />
          </div>
          <button type="button" className="h-11 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">Search</button>
        </form>
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {articles.length > 0 ? (
            <div className="space-y-10">
              {categories.map((category) => (
                <div key={category}>
                  <h2 className="text-xl font-semibold font-display">{category}</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.filter((article) => article.category === category).map((article, i) => (
                      <Reveal key={article.slug} delay={(i % 3) * 80}>
                        <article className="h-full rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-glow">
                          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <BookOpen className="h-5 w-5" />
                          </span>
                          <h3 className="mt-4 text-base font-semibold font-display">{article.title}</h3>
                          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{article.body}</p>
                        </article>
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <h2 className="text-xl font-semibold font-display">No help articles published yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">Create Help Category and Help Article entries in Strapi to populate this page.</p>
            </div>
          )}

          <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-6 text-center">
            <h3 className="text-lg font-semibold font-display">Need more help?</h3>
            <p className="mt-1 text-sm text-muted-foreground">Our support team is here for you.</p>
            <a href="/contact" className="mt-4 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Contact Support</a>
          </div>
        </div>
      </section>
    </>
  );
}

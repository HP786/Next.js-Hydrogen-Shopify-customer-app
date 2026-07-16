import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getArticle } from '@/lib/blog';

const dateFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export async function generateMetadata({ params }) {
  const { blogHandle, articleHandle } = await params;
  const article = await getArticle(blogHandle, articleHandle);
  return {
    title: article?.seo?.title || article?.title || 'Article',
    description: article?.seo?.description || undefined,
  };
}

export default async function ArticlePage({ params }) {
  const { blogHandle, articleHandle } = await params;
  const article = await getArticle(blogHandle, articleHandle);

  if (!article) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <article>
        <header className="text-center">
          <h1 className="font-serif text-4xl text-on-surface md:text-6xl">{article.title}</h1>
          <p className="mt-6 font-sans text-sm text-on-surface-variant">
            {dateFormatter.format(new Date(article.publishedAt))}
            {article.author?.name ? ` · ${article.author.name}` : ''}
          </p>
        </header>

        {article.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.image.url} alt={article.image.altText ?? article.title} className="mt-10 w-full" loading="eager" />
        )}

        <div
          className="mt-16 font-sans text-base leading-relaxed text-on-surface-variant md:text-lg [&>h3]:mt-12 [&>h3]:font-serif [&>h3]:text-2xl [&>h3]:text-on-surface [&>p]:mt-6"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        <div className="mt-20 border-t border-surface-container-high pt-8">
          <Link href={`/blogs/${blogHandle}`} className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-on-surface hover:text-primary">
            &larr; Back to {blogHandle}
          </Link>
        </div>
      </article>
    </main>
  );
}

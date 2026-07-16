import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getBlogArticles } from '@/lib/blog';

const dateFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export async function generateMetadata({ params }) {
  const { blogHandle } = await params;
  const blog = await getBlogArticles(blogHandle);
  return { title: blog?.title ?? 'Blog' };
}

export default async function BlogPage({ params }) {
  const { blogHandle } = await params;
  const blog = await getBlogArticles(blogHandle);

  if (!blog) {
    notFound();
  }

  const articles = blog.articles.nodes;

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-16 md:px-16 md:py-20">
      <h1 className="font-serif text-4xl text-on-surface md:text-6xl">{blog.title}</h1>
      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/blogs/${article.blog.handle}/${article.handle}`}
            className="group block border border-outline-variant p-8 hover:border-primary"
          >
            {article.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={article.image.url} alt={article.image.altText ?? article.title} className="mb-4 aspect-[3/2] w-full object-cover" />
            )}
            <h2 className="font-serif text-xl text-on-surface">{article.title}</h2>
            <p className="mt-2 font-sans text-sm text-on-surface-variant">{dateFormatter.format(new Date(article.publishedAt))}</p>
            {article.excerpt && <p className="mt-4 font-sans text-sm text-on-surface-variant">{article.excerpt}</p>}
          </Link>
        ))}
      </div>
    </main>
  );
}

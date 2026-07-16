import Link from 'next/link';

import { getBlogsList } from '@/lib/blog';

export const metadata = {
  title: 'Blogs',
};

export default async function BlogsPage() {
  const blogs = await getBlogsList();

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-16 md:px-16 md:py-20">
      <h1 className="font-serif text-4xl text-on-surface md:text-6xl">Blogs</h1>
      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        {blogs.map((blog) => (
          <Link key={blog.id} href={`/blogs/${blog.handle}`} className="block border border-outline-variant p-8 hover:border-primary">
            <h2 className="font-serif text-xl text-on-surface">{blog.title}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}

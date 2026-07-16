'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto max-w-xl px-6 py-24 text-center">
          <h1 className="text-2xl font-bold text-on-surface">Something went wrong</h1>
          <p className="mt-4 text-on-surface-variant">{error?.digest ? `Error: ${error.digest}` : 'An unexpected error occurred.'}</p>
          <button onClick={() => reset()} className="mt-8 font-semibold text-primary underline">
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}

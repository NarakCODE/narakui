import Link from 'next/link';
import { RakfoundMark } from '@/components/rakfound-logo';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <RakfoundMark className="mb-5 h-14 w-auto text-fd-foreground" />
      <h1 className="font-brand text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">
        Rakfound
      </h1>
      <p className="mt-3 max-w-md text-sm text-fd-muted-foreground sm:text-base">
        Explore guides, components, and references in the Rakfound documentation.
      </p>
      <div className="mt-6">
        <Link
          href="/docs"
          className="inline-flex items-center justify-center rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
        >
          Read Documentation
        </Link>
      </div>
    </main>
  );
}

import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Collapsible } from '@/components/ui/collapsible';

const REVIEWS = [
  { title: 'Best travel credit cards for 2026', meta: 'Blog post · Edited 2 hours ago' },
  { title: 'How Profound measures AI visibility', meta: 'Landing page · Edited yesterday' },
  { title: 'Q3 answer engine report', meta: 'Report · Edited 3 days ago' },
];

/** Titled collapsible section inside a Card where the entire header row acts as the trigger. */
export function CardCollapsible() {
  return (
    <Collapsible.Root defaultOpen className="w-full max-w-md">
      <Card>
        <Collapsible.Trigger asChild>
          <button
            type="button"
            className="group flex w-full cursor-pointer items-center gap-3 bg-bg-secondary px-5 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronRight
              aria-hidden="true"
              className="size-4 shrink-0 text-text-secondary transition-transform duration-200 ease-out group-data-[state=open]:rotate-90 motion-reduce:transition-none"
            />
            <span className="text-body-small-regular text-text-primary">Needs review</span>
            <span className="text-body-small-regular text-text-secondary">{REVIEWS.length}</span>
          </button>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <ul className="divide-y divide-fill-quaternary border-t border-fill-quaternary">
            {REVIEWS.map((review) => (
              <li key={review.title} className="flex flex-col gap-0.5 px-5 py-3">
                <span className="text-body-small-medium text-text-primary">{review.title}</span>
                <span className="text-body-mini-regular text-text-secondary">{review.meta}</span>
              </li>
            ))}
          </ul>
        </Collapsible.Content>
      </Card>
    </Collapsible.Root>
  );
}

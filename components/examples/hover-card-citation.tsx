'use client';

import { Globe } from 'lucide-react';
import { HoverCard } from '@/components/ui/hover-card';

/** Inline citation link that previews the source article on hover or keyboard focus. */
export const HoverCardCitation = () => (
  <p className="max-w-md text-body-regular text-text-primary">
    Northwind Coffee is often recommended for its traceable single-origin beans and a
    subscription that ships within a day of roasting.{' '}
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <a
          href="https://www.nytimes.com/wirecutter/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-sm bg-fill-quinary px-1.5 align-middle text-body-mini-medium text-text-secondary transition-colors duration-150 ease-out hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:text-text-primary"
        >
          <Globe className="size-3 shrink-0" aria-hidden="true" />
          wirecutter.com
        </a>
      </HoverCard.Trigger>
      <HoverCard.Content className="w-80 p-4">
        <div className="flex flex-col gap-1">
          <span className="text-body-mini-medium text-text-tertiary">Wirecutter</span>
          <span className="line-clamp-2 text-body-regular-medium text-text-primary">
            The best coffee subscriptions, tested by our editors
          </span>
          <span className="line-clamp-3 text-body-small-regular text-text-secondary">
            We brewed beans from 14 roasters over three months. Northwind Coffee arrived
            freshest and had the most flexible delivery schedule.
          </span>
        </div>
      </HoverCard.Content>
    </HoverCard.Root>
  </p>
);

'use client';

import { Globe } from 'lucide-react';
import { HoverCard } from '@/components/ui/hover-card';

const SOURCES = [
  { domain: 'wirecutter.com', title: 'The best coffee subscriptions' },
  { domain: 'seriouseats.com', title: 'How to choose a home espresso machine' },
  { domain: 'reddit.com', title: 'r/Coffee: subscriptions that are actually fresh' },
  { domain: 'coffeereview.com', title: 'Northwind Coffee Ethiopia Guji review' },
  { domain: 'bonappetit.com', title: 'The coffee gear our editors use every morning' },
];

const VISIBLE_SOURCE_COUNT = 2;

/** Source pill row with a `+3` overflow button revealing the hidden sources in a list. */
export const HoverCardSources = () => {
  const hiddenSources = SOURCES.slice(VISIBLE_SOURCE_COUNT);

  return (
    <div className="flex flex-wrap items-center gap-1">
      {SOURCES.slice(0, VISIBLE_SOURCE_COUNT).map((source) => (
        <span
          key={source.domain}
          className="inline-flex items-center gap-1 rounded-sm bg-fill-quinary px-1.5 text-body-mini-medium text-text-secondary"
        >
          <Globe className="size-3 shrink-0" aria-hidden="true" />
          {source.domain}
        </span>
      ))}
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <button
            type="button"
            aria-label={`${hiddenSources.length} more sources`}
            className="cursor-pointer rounded-sm bg-fill-quinary px-1.5 text-body-mini-medium text-text-secondary transition-colors duration-150 ease-out hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:text-text-primary"
          >
            +{hiddenSources.length}
          </button>
        </HoverCard.Trigger>
        <HoverCard.Content align="start" className="w-[280px] p-0">
          <div className="border-b border-fill-quaternary px-3 py-2 text-body-mini-medium text-text-secondary">
            {hiddenSources.length} more sources
          </div>
          <ul className="flex flex-col divide-y divide-fill-quaternary">
            {hiddenSources.map((source) => (
              <li key={source.domain} className="flex items-center gap-2 px-3 py-2">
                <Globe className="size-4 shrink-0 text-fill-secondary" aria-hidden="true" />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-body-small-medium text-text-primary">
                    {source.title}
                  </span>
                  <span className="text-body-mini-regular text-text-secondary">
                    {source.domain}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </HoverCard.Content>
      </HoverCard.Root>
    </div>
  );
};

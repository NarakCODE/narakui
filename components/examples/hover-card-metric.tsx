'use client';

import { HoverCard } from '@/components/ui/hover-card';

/** Metric tile that reveals methodology and breakdown stats above the trigger. */
export const HoverCardMetric = () => (
  <HoverCard.Root>
    <HoverCard.Trigger asChild>
      <button
        type="button"
        className="flex cursor-pointer flex-col items-start gap-1 rounded-[12px] border border-fill-quaternary bg-bg-primary px-4 py-3 text-left transition-[background-color,transform] duration-150 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:active:scale-100 data-[state=open]:bg-bg-secondary"
      >
        <span className="text-body-small-regular text-text-secondary">
          Visibility score
        </span>
        <span className="text-title-small-semibold text-text-primary tabular-nums">
          42.8%
        </span>
      </button>
    </HoverCard.Trigger>
    <HoverCard.Content side="top" className="p-4">
      <div className="flex flex-col gap-3">
        <p className="text-body-small-regular text-text-secondary">
          Share of answers that mention Northwind Coffee across ChatGPT, Perplexity, and
          Gemini in the last 30 days.
        </p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-body-small-regular">
            <span className="text-text-secondary">Answers analyzed</span>
            <span className="text-text-primary tabular-nums">12,480</span>
          </div>
          <div className="flex items-center justify-between text-body-small-regular">
            <span className="text-text-secondary">Change from last period</span>
            <span className="text-text-green tabular-nums">+3.1 pts</span>
          </div>
        </div>
      </div>
    </HoverCard.Content>
  </HoverCard.Root>
);

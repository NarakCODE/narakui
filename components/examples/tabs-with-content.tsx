'use client';

import { Tabs } from '@/components/ui/tabs';

export function TabsWithContent() {
  return (
    <Tabs.Root defaultValue="overview" className="w-full max-w-md">
      <Tabs.List
        aria-label="Dashboard"
        className="border-b border-fill-quaternary"
      >
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="engines">Engines</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview" className="grid grid-cols-2 gap-4 pt-4">
        <div className="flex flex-col gap-1 rounded-xl bg-bg-primary p-4 shadow-low">
          <span className="text-body-small-medium text-text-secondary">
            Visibility
          </span>
          <span className="text-title-mini-semibold text-text-primary tabular-nums">
            42.6%
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl bg-bg-primary p-4 shadow-low">
          <span className="text-body-small-medium text-text-secondary">
            Citations
          </span>
          <span className="text-title-mini-semibold text-text-primary tabular-nums">
            1,284
          </span>
        </div>
      </Tabs.Content>
      <Tabs.Content
        value="engines"
        className="flex flex-col gap-2 pt-4 text-body-small-regular"
      >
        <div className="flex justify-between">
          <span className="text-text-secondary">ChatGPT</span>
          <span className="text-text-primary tabular-nums">48%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Perplexity</span>
          <span className="text-text-primary tabular-nums">31%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Google AI Overviews</span>
          <span className="text-text-primary tabular-nums">21%</span>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}

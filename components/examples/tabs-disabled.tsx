'use client';

import { Tabs } from '@/components/ui/tabs';

export function TabsDisabled() {
  return (
    <Tabs.Root defaultValue="visibility" className="w-full max-w-md">
      <Tabs.List aria-label="Report" className="border-b border-fill-quaternary">
        <Tabs.Trigger value="visibility">Visibility</Tabs.Trigger>
        <Tabs.Trigger value="sentiment" disabled>
          Sentiment
        </Tabs.Trigger>
        <Tabs.Trigger value="citations">Citations</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content
        value="visibility"
        className="pt-4 text-body-small-regular text-text-secondary"
      >
        Sentiment is available on the Growth plan.
      </Tabs.Content>
      <Tabs.Content
        value="citations"
        className="pt-4 text-body-small-regular text-text-secondary"
      >
        Which of your pages answer engines cite as sources.
      </Tabs.Content>
    </Tabs.Root>
  );
}

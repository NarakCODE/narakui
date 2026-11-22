'use client';

import { ChartLine, Link2, MessageSquare } from 'lucide-react';
import { Tabs } from '@/components/ui/tabs';

export function TabsWithIcons() {
  return (
    <Tabs.Root defaultValue="visibility" className="w-full max-w-md">
      <Tabs.List aria-label="Report" className="border-b border-fill-quaternary">
        <Tabs.Trigger value="visibility" className="flex items-center gap-2">
          <ChartLine aria-hidden="true" className="size-4 shrink-0" />
          Visibility
        </Tabs.Trigger>
        <Tabs.Trigger value="citations" className="flex items-center gap-2">
          <Link2 aria-hidden="true" className="size-4 shrink-0" />
          Citations
        </Tabs.Trigger>
        <Tabs.Trigger value="prompts" className="flex items-center gap-2">
          <MessageSquare aria-hidden="true" className="size-4 shrink-0" />
          Prompts
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content
        value="visibility"
        className="pt-4 text-body-small-regular text-text-secondary"
      >
        How often answer engines mention your brand.
      </Tabs.Content>
      <Tabs.Content
        value="citations"
        className="pt-4 text-body-small-regular text-text-secondary"
      >
        Which of your pages answer engines cite as sources.
      </Tabs.Content>
      <Tabs.Content
        value="prompts"
        className="pt-4 text-body-small-regular text-text-secondary"
      >
        The questions you track across answer engines.
      </Tabs.Content>
    </Tabs.Root>
  );
}

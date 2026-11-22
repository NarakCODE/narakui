'use client';

import { Tabs } from '@/components/ui/tabs';

export function TabsBasic() {
  return (
    <Tabs.Root defaultValue="checks" className="w-full max-w-md">
      <Tabs.List aria-label="Review" className="border-b border-fill-quaternary">
        <Tabs.Trigger value="checks">Checks</Tabs.Trigger>
        <Tabs.Trigger value="approvals">Approvals</Tabs.Trigger>
        <Tabs.Trigger value="changes">Changes</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content
        value="checks"
        className="pt-4 text-body-small-regular text-text-secondary"
      >
        4 of 5 checks passed. The claim about pricing needs a source.
      </Tabs.Content>
      <Tabs.Content
        value="approvals"
        className="pt-4 text-body-small-regular text-text-secondary"
      >
        Waiting on approval from Maya and Priya.
      </Tabs.Content>
      <Tabs.Content
        value="changes"
        className="pt-4 text-body-small-regular text-text-secondary"
      >
        12 edits since the last review, mostly in the comparison table.
      </Tabs.Content>
    </Tabs.Root>
  );
}

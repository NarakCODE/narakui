'use client';

import { SegmentedTabs } from '@/components/ui/segmented-tabs';

export function SegmentedTabsBasic() {
  return (
    <SegmentedTabs.Root defaultValue="matrix" className="w-full max-w-sm">
      <SegmentedTabs.List>
        <SegmentedTabs.Trigger value="matrix">Matrix</SegmentedTabs.Trigger>
        <SegmentedTabs.Trigger value="table">Table</SegmentedTabs.Trigger>
      </SegmentedTabs.List>
      <SegmentedTabs.Content value="matrix" className="mt-3 px-2">
        <p className="text-body-small-regular text-text-secondary">
          Topics plotted by visibility and sentiment, so the gaps stand out.
        </p>
      </SegmentedTabs.Content>
      <SegmentedTabs.Content value="table" className="mt-3 px-2">
        <p className="text-body-small-regular text-text-secondary">
          Every topic in one sortable list, with its visibility and sentiment
          scores.
        </p>
      </SegmentedTabs.Content>
    </SegmentedTabs.Root>
  );
}

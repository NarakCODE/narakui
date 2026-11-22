'use client';

import { useState } from 'react';
import { SegmentedTabs } from '@/components/ui/segmented-tabs';

const METRICS = [
  { value: 'visibility', label: 'Visibility', reading: '42.6%' },
  { value: 'share-of-voice', label: 'Share of voice', reading: '18.3%' },
  { value: 'position', label: 'Average position', reading: '2.4' },
];

export function SegmentedTabsControlled() {
  const [metric, setMetric] = useState('visibility');
  const selected = METRICS.find((option) => option.value === metric);

  return (
    <div className="flex flex-col items-start gap-3">
      <SegmentedTabs.Root value={metric} onValueChange={setMetric}>
        <SegmentedTabs.List>
          {METRICS.map((option) => (
            <SegmentedTabs.Trigger key={option.value} value={option.value}>
              {option.label}
            </SegmentedTabs.Trigger>
          ))}
        </SegmentedTabs.List>
      </SegmentedTabs.Root>
      <p className="px-2 text-title-small-semibold text-text-primary tabular-nums">
        {selected?.reading}
      </p>
    </div>
  );
}

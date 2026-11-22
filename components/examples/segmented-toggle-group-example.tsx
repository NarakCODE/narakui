'use client';

import { useState } from 'react';
import { SegmentedToggleGroup } from '@/components/ui/segmented-tabs';

export function SegmentedToggleGroupExample() {
  const [view, setView] = useState('matrix');

  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-3">
      <SegmentedToggleGroup.Root
        aria-label="Ranking view"
        onValueChange={setView}
        value={view}
      >
        <SegmentedToggleGroup.Item value="matrix">
          Matrix
        </SegmentedToggleGroup.Item>
        <SegmentedToggleGroup.Item value="table">Table</SegmentedToggleGroup.Item>
      </SegmentedToggleGroup.Root>
      <p className="px-2 text-body-small-regular text-text-secondary">
        {view === 'matrix'
          ? 'Showing topics as a matrix.'
          : 'Showing topics as a table.'}
      </p>
    </div>
  );
}

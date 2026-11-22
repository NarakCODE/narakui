'use client';

import { useState } from 'react';
import { ToggleGroup } from '@/components/ui/toggle-group';

const RANGE_LABELS: Record<string, string> = {
  '7d': '7 days',
  '30d': '30 days',
  '90d': '90 days',
};

export function ToggleGroupControlled() {
  const [value, setValue] = useState('30d');

  return (
    <div className="flex flex-col items-center gap-4">
      <ToggleGroup.Root
        value={value}
        onValueChange={(next) => {
          if (next) setValue(next);
        }}
        aria-label="Date range"
        type="single"
      >
        {Object.entries(RANGE_LABELS).map(([range, label]) => (
          <ToggleGroup.Item key={range} value={range}>
            {label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>

      <p className="text-body-small-regular text-text-secondary">
        Showing the last{' '}
        <span className="text-body-small-medium text-text-primary">
          {RANGE_LABELS[value]}
        </span>
      </p>
    </div>
  );
}

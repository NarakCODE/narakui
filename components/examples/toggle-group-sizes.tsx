'use client';

import { ToggleGroup } from '@/components/ui/toggle-group';

export function ToggleGroupSizes() {
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-body-small-regular text-text-secondary">
          Small
        </span>
        <ToggleGroup.Root
          defaultValue="day"
          aria-label="Interval"
          type="single"
          size="small"
        >
          <ToggleGroup.Item value="day">Day</ToggleGroup.Item>
          <ToggleGroup.Item value="week">Week</ToggleGroup.Item>
          <ToggleGroup.Item value="month">Month</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-body-small-regular text-text-secondary">
          Regular
        </span>
        <ToggleGroup.Root
          defaultValue="day"
          aria-label="Interval"
          type="single"
        >
          <ToggleGroup.Item value="day">Day</ToggleGroup.Item>
          <ToggleGroup.Item value="week">Week</ToggleGroup.Item>
          <ToggleGroup.Item value="month">Month</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
    </div>
  );
}

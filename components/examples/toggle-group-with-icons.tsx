'use client';

import { ToggleGroup } from '@/components/ui/toggle-group';

export function ToggleGroupWithIcons() {
  return (
    <ToggleGroup.Root defaultValue="grid" aria-label="Layout" type="single">
      <ToggleGroup.Item
        value="grid"
        aria-label="Grid view"
        iconStart="layout-grid"
      />
      <ToggleGroup.Item value="list" aria-label="List view" iconStart="list" />
      <ToggleGroup.Item
        value="chart"
        aria-label="Chart view"
        iconStart="chart-line"
      />
    </ToggleGroup.Root>
  );
}

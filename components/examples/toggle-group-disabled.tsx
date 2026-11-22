'use client';

import { ToggleGroup } from '@/components/ui/toggle-group';

export function ToggleGroupDisabled() {
  return (
    <ToggleGroup.Root
      defaultValue="visibility"
      aria-label="Metric"
      type="single"
    >
      <ToggleGroup.Item value="visibility">Visibility</ToggleGroup.Item>
      <ToggleGroup.Item value="sentiment" disabled>
        Sentiment
      </ToggleGroup.Item>
      <ToggleGroup.Item value="citations">Citations</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}

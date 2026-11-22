'use client';

import { ToggleGroup } from '@/components/ui/toggle-group';

export function ToggleGroupBasic() {
  return (
    <ToggleGroup.Root
      defaultValue="visibility"
      aria-label="Metric"
      type="single"
    >
      <ToggleGroup.Item value="visibility">Visibility</ToggleGroup.Item>
      <ToggleGroup.Item value="citations">Citations</ToggleGroup.Item>
      <ToggleGroup.Item value="sentiment">Sentiment</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}

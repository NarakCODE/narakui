'use client';

import { ToggleGroup } from '@/components/ui/toggle-group';

export function ToggleGroupMultiple() {
  return (
    <ToggleGroup.Root
      defaultValue={['chatgpt', 'perplexity']}
      aria-label="Answer engines"
      type="multiple"
    >
      <ToggleGroup.Item value="chatgpt">ChatGPT</ToggleGroup.Item>
      <ToggleGroup.Item value="perplexity">Perplexity</ToggleGroup.Item>
      <ToggleGroup.Item value="gemini">Gemini</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}

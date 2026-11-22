'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

/** Radio group with a single disabled item. */
export function RadioGroupDisabled() {
  return (
    <RadioGroup aria-label="Answer engine" defaultValue="chatgpt">
      <RadioGroupItem value="chatgpt">ChatGPT</RadioGroupItem>
      <RadioGroupItem value="perplexity">Perplexity</RadioGroupItem>
      <RadioGroupItem value="gemini" disabled>
        Gemini (not on your plan)
      </RadioGroupItem>
    </RadioGroup>
  );
}

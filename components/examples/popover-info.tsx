'use client';

import { Button } from '@/components/ui/button';
import { Popover } from '@/components/ui/popover';

export function PopoverInfo() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button mode="ghost" iconStart="info">
          How is visibility calculated?
        </Button>
      </Popover.Trigger>
      <Popover.Content align="center" className="w-72 p-3">
        <h4 className="text-body-small-medium text-text-primary">Visibility score</h4>
        <p className="mt-1 text-body-small-regular text-text-secondary">
          The share of tracked prompts where an answer engine mentions your brand, averaged across
          ChatGPT, Perplexity, Gemini, and Google AI Overviews over the selected date range.
        </p>
      </Popover.Content>
    </Popover.Root>
  );
}

'use client';

import { Tooltip } from '@/components/ui/tooltip';

export function TooltipUnderline() {
  return (
    <p className="text-body-small-regular text-text-secondary">
      Your{' '}
      <Tooltip
        content="How often your brand appears in AI answers"
        underline
        focusableTrigger
      >
        visibility score
      </Tooltip>{' '}
      went up this week.
    </p>
  );
}

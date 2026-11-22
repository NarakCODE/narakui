'use client';

import { TruncatedText } from '@/components/ui/truncated-text';

/** Provides a plain-text tooltip and custom placement for rich inline children. */
export function TruncatedTextCustomTooltip() {
  return (
    <div className="flex w-full max-w-72 items-center gap-2 rounded-xl bg-bg-primary p-3 shadow-low">
      <TruncatedText
        className="flex-1 text-body-small-regular text-text-secondary"
        tooltip="Maya Chen added 3 citations from nytimes.com to the brand report"
        tooltipSide="bottom"
      >
        <span className="text-body-small-medium text-text-primary">Maya Chen</span> added 3
        citations from nytimes.com to the brand report
      </TruncatedText>
      <span className="shrink-0 text-body-small-regular text-text-secondary">2h</span>
    </div>
  );
}

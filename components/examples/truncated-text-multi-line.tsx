'use client';

import { TruncatedText } from '@/components/ui/truncated-text';

/** Clamps copy to two lines with a hover tooltip revealing the full text. */
export function TruncatedTextMultiLine() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-2 rounded-xl bg-bg-primary p-4 shadow-low">
      <span className="text-body-small-medium text-text-secondary">Visibility</span>
      <TruncatedText lines={2} className="text-body-regular text-text-primary">
        Acme&apos;s share of voice in ChatGPT rose 12% after its pricing page was cited in 40 new
        answers about CRM tools.
      </TruncatedText>
    </div>
  );
}

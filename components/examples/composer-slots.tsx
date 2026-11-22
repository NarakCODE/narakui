'use client';

import { Button } from '@/components/ui/button';
import { Composer } from '@/components/ui/composer';

/** Demonstrates `topSlot`, `footerStart`, `footerEnd`, `validationMessage`, and `disclaimer` slots. */
export const ComposerSlots = () => {
  return (
    <div className="w-full max-w-xl">
      <Composer
        scrollControl={null}
        footerStart={
          <Button size="small" aria-label="Add files" className="rounded-full" iconStart="plus" />
        }
        footerEnd={
          <Button
            size="small"
            aria-label="Voice input"
            className="rounded-full"
            iconStart="microphone"
          />
        }
        topSlot={
          <div className="mb-3 rounded-[16px] bg-bg-primary px-4 py-3 shadow-medium">
            <p className="text-body-small-medium text-text-primary">
              Which brand should this agent use?
            </p>
            <p className="mt-1 text-body-mini-regular text-text-secondary">
              The first turn is scoped to this brand.
            </p>
          </div>
        }
        validationMessage="Add more detail before sending."
        disclaimer="AI can make mistakes. Check important info."
      >
        <p className="min-h-5.5 text-body-regular text-text-tertiary">Ask a question…</p>
      </Composer>
    </div>
  );
};

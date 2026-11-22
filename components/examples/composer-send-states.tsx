'use client';

import { ComposerSendButton } from '@/components/ui/composer';

/** Standalone `ComposerSendButton` comparing idle, typing, and streaming states. */
export const ComposerSendStates = () => {
  return (
    <div className="flex items-center gap-8">
      <ComposerSendButton disabled state="idle" ariaLabel="Send message" />
      <ComposerSendButton state="typing" ariaLabel="Send message" />
      <ComposerSendButton state="streaming" ariaLabel="Stop response" />
    </div>
  );
};

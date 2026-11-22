'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

/** Chromeless in-place editable textarea compared against a standard control surface textarea. */
export function TextareaChromeless() {
  const [chromelessValue, setChromelessValue] = useState(
    'A chromeless field carries no surface of its own, so the card around it is the affordance. Use it for editing text in place, where a visible input box would read as a form.',
  );
  const [controlValue, setControlValue] = useState(
    'A control field renders its own background, border, padding, and shadow.',
  );

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <div className="rounded-lg bg-bg-primary p-4 shadow-low">
        <Textarea
          contentClassName="text-body-regular text-text-primary"
          placeholder="Edit this text in place"
          value={chromelessValue}
          onChange={(event) => setChromelessValue(event.target.value)}
          variant="chromeless"
        />
      </div>
      <Textarea
        hint="A control field, for comparison"
        id="textarea-9"
        placeholder="Placeholder"
        value={controlValue}
        onChange={(event) => setControlValue(event.target.value)}
      />
    </div>
  );
}

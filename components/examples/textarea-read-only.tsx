'use client';

import { Textarea } from '@/components/ui/textarea';

/** Read-only textareas that remain focusable and copyable without allowing edits. */
export function TextareaReadOnly() {
  return (
    <div className="grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
      <Textarea
        label="System prompt"
        readOnly
        id="textarea-7"
        hint="Managed by your workspace."
        defaultValue="Answer as a helpful shopping assistant. Cite your sources."
      />
      <Textarea
        label="Note"
        readOnly
        id="textarea-8"
        size="small"
        hint="Added by Maya."
        defaultValue="Rerun this report after the pricing page launches."
      />
    </div>
  );
}

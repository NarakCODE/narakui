'use client';

import { Textarea } from '@/components/ui/textarea';

/** Disabled textareas preventing focus and editing. */
export function TextareaDisabled() {
  return (
    <div className="grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
      <Textarea
        label="Brand description"
        disabled
        id="textarea-5"
        hint="Only admins can edit this."
        defaultValue="Profound helps brands understand how AI answer engines talk about them."
      />
      <Textarea
        label="Note"
        disabled
        id="textarea-6"
        size="small"
        hint="Notes are locked after a report is shared."
        defaultValue="Shared with the leadership team on Monday."
      />
    </div>
  );
}

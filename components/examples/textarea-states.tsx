'use client';

import { Textarea } from '@/components/ui/textarea';

/** Regular and small textareas in error state with accessible error messages. */
export function TextareaStates() {
  return (
    <div className="grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
      <Textarea
        label="Brand description"
        placeholder="Describe what your brand does"
        id="textarea-3"
        error
        errorMessage="Add a brand description."
      />
      <Textarea
        label="Note"
        placeholder="Add a note for your team"
        id="textarea-4"
        size="small"
        error
        errorMessage="Keep notes under 500 characters."
      />
    </div>
  );
}

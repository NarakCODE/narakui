'use client';

import { Textarea } from '@/components/ui/textarea';

/** Regular and small textarea typography scales. */
export function TextareaSizes() {
  return (
    <div className="grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
      <Textarea
        label="Prompt"
        placeholder="What are the best CRM tools for small teams?"
        id="textarea-1"
        hint="Ask it the way a customer would."
      />
      <Textarea
        label="Note"
        placeholder="Add a note for your team"
        id="textarea-2"
        size="small"
        hint="Visible to everyone in this workspace."
      />
    </div>
  );
}

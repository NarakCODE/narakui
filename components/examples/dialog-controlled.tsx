'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

/** Controlled structured Dialog opened and closed from external component state. */
export const DialogControlled = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button mode="destructive" iconStart="trash" onClick={() => setOpen(true)}>
        Delete prompt
      </Button>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content
          variant="structured"
          contentPadding="regions"
          hasAccessibleTitle
          hasAccessibleDescription
        >
          <Dialog.Header>
            <Dialog.Title>Delete this prompt?</Dialog.Title>
            <Dialog.Description>
              “Best business credit cards for startups” stops running on every answer engine. Its
              past results stay in your reports.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Button mode="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button mode="destructive" onClick={() => setOpen(false)}>
              Delete prompt
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

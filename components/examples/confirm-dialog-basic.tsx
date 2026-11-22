'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

/** Controlled confirmation dialog naming its primary action in `confirmText`. */
export const ConfirmDialogBasic = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button mode="primary" onClick={() => setOpen(true)}>
        Publish report
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Publish this report?"
        description="Everyone in Northwind Coffee can see the weekly visibility report once it is published. You can unpublish it later."
        confirmText="Publish"
        onConfirm={() => setOpen(false)}
      />
    </>
  );
};

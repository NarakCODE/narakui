'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

/** Destructive confirmation staying open with a spinner until the async work completes. */
export const ConfirmDialogDestructive = () => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleConfirm = () => {
    setIsDeleting(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsDeleting(false);
      setOpen(false);
    }, 1500);
  };

  return (
    <>
      <Button iconStart="trash" onClick={() => setOpen(true)}>
        Delete prompt
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={(nextOpen) => !isDeleting && setOpen(nextOpen)}
        title="Delete this prompt?"
        description="“Best espresso machines for home baristas” and its 90 days of answer history will be permanently deleted."
        confirmText="Delete prompt"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleConfirm}
      />
    </>
  );
};

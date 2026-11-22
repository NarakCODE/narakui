'use client';

import { useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

/** Confirmation requiring explicit user acknowledgement via body checkboxes and `confirmDisabled`. */
export const ConfirmDialogAcknowledge = () => {
  const [open, setOpen] = useState(false);
  const [stopsUpdating, setStopsUpdating] = useState(false);
  const [historyDeleted, setHistoryDeleted] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setStopsUpdating(false);
      setHistoryDeleted(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Disconnect Search Console</Button>
      <ConfirmDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Disconnect Google Search Console?"
        titleIcon={<TriangleAlert aria-hidden="true" className="size-4 text-fill-red" />}
        description="Profound stops importing clicks and impressions for northwindcoffee.com. Confirm you understand below."
        confirmText="Disconnect"
        variant="destructive"
        confirmDisabled={!(stopsUpdating && historyDeleted)}
        onConfirm={() => handleOpenChange(false)}
      >
        <div className="flex flex-col gap-1">
          <Checkbox
            checked={stopsUpdating}
            onCheckedChange={(checked) => setStopsUpdating(checked === true)}
          >
            I understand page reports stop updating
          </Checkbox>
          <Checkbox
            checked={historyDeleted}
            onCheckedChange={(checked) => setHistoryDeleted(checked === true)}
          >
            I understand history is deleted in 30 days
          </Checkbox>
        </div>
      </ConfirmDialog>
    </>
  );
};

'use client';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

/** Legacy default Dialog variant with an automatic top-right close button and custom padding. */
export const DialogDefaultVariant = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>View sync details</Button>
      </Dialog.Trigger>
      <Dialog.Content hasAccessibleTitle className="w-130 min-w-0">
        <div className="flex flex-col gap-2 p-6 pr-12">
          <Dialog.Title className="text-body-regular-medium text-text-primary">
            Last sync
          </Dialog.Title>
          <p className="text-body-small-regular text-text-secondary">
            Google Search Console finished syncing 2 hours ago. 1,284 pages were imported for
            ramp.com.
          </p>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

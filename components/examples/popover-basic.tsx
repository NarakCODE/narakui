'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover } from '@/components/ui/popover';

export function PopoverBasic() {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button iconStart="share">Share report</Button>
      </Popover.Trigger>
      <Popover.Content align="center" className="p-3">
        <h4 className="text-body-small-medium text-text-primary">Share report</h4>
        <p className="mt-1 text-body-small-regular text-text-secondary">
          Anyone in your organization with the link can view this visibility report.
        </p>
        <div className="mt-3 flex justify-end gap-2">
          <Button size="small" mode="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="small" mode="primary" iconStart="copy" onClick={() => setOpen(false)}>
            Copy link
          </Button>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover } from '@/components/ui/popover';

export function PopoverForm() {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button iconStart="plus">Add competitor</Button>
      </Popover.Trigger>
      <Popover.Content align="start" alignOffset={0} className="w-80 p-3">
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            setOpen(false);
          }}
        >
          <h4 className="text-body-small-medium text-text-primary">Add competitor</h4>
          <Input label="Name" placeholder="Globex" size="small" />
          <Input label="Domain" placeholder="globex.com" size="small" />
          <div className="flex justify-end gap-2">
            <Button size="small" mode="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="small" mode="primary" type="submit">
              Add
            </Button>
          </div>
        </form>
      </Popover.Content>
    </Popover.Root>
  );
}

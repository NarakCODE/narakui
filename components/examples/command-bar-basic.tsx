'use client';

import { useState } from 'react';
import { Activity, Download, Files, Plus, Sparkles, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command } from '@/components/ui/command-bar';
import { Dialog } from '@/components/ui/dialog';
import { Kbd } from '@/components/ui/kbd';

/** Command bar presented inside a modal dialog with larger spacing and keyboard hints. */
export const CommandBarBasic = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <Button iconStart="search" onClick={() => setOpen(true)}>
        Open command bar
      </Button>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content
          aria-label="Command bar"
          showCloseButton={false}
          className="top-37.5 w-150 min-w-0 translate-y-0 overflow-hidden"
        >
          <Command.Root inDialog loop>
            <Command.Input
              autoFocus
              aria-label="Search pages and actions"
              placeholder="Search pages and actions"
            />
            <Command.List>
              <Command.Empty>No results found.</Command.Empty>
              <Command.Group heading="Go to">
                <Command.Item onSelect={close}>
                  <Sparkles aria-hidden="true" />
                  Answer engine insights
                </Command.Item>
                <Command.Item onSelect={close}>
                  <Activity aria-hidden="true" />
                  Agent analytics
                </Command.Item>
                <Command.Item onSelect={close}>
                  <Files aria-hidden="true" />
                  Reports
                </Command.Item>
              </Command.Group>
              <Command.Separator />
              <Command.Group heading="Actions">
                <Command.Item onSelect={close}>
                  <Plus aria-hidden="true" />
                  Track a new prompt
                </Command.Item>
                <Command.Item onSelect={close}>
                  <UserPlus aria-hidden="true" />
                  Invite a teammate
                </Command.Item>
                <Command.Item onSelect={close}>
                  <Download aria-hidden="true" />
                  Export citations as CSV
                </Command.Item>
              </Command.Group>
            </Command.List>
            <div className="flex items-center gap-3 border-t border-fill-quaternary px-4 py-2 text-body-mini-regular text-text-secondary">
              <span className="flex items-center gap-1">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <Kbd>↵</Kbd>
                open
              </span>
              <span className="flex items-center gap-1">
                <Kbd>esc</Kbd>
                close
              </span>
            </div>
          </Command.Root>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

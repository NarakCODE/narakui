'use client';

import { FileSpreadsheet } from 'lucide-react';
import { ContextMenu } from '@/components/ui/context-menu';

/** Right-click card trigger with action items, external link item, and destructive Delete item. */
export const ContextMenuBasic = () => (
  <ContextMenu.Root>
    <ContextMenu.Trigger asChild>
      <div className="flex w-72 items-center gap-3 rounded-[12px] border border-fill-quaternary bg-bg-primary p-4 shadow-low">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-bg-tertiary">
          <FileSpreadsheet aria-hidden="true" className="size-4 text-fill-secondary" />
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-body-regular-medium text-text-primary">
            Weekly visibility report
          </span>
          <span className="text-body-small-regular text-text-secondary">
            Right-click to see actions
          </span>
        </div>
      </div>
    </ContextMenu.Trigger>
    <ContextMenu.Content size={200}>
      <ContextMenu.Item start="arrow-up-right">Open</ContextMenu.Item>
      <ContextMenu.Item
        start="external-link"
        href="/docs/components/context-menu"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in new tab
      </ContextMenu.Item>
      <ContextMenu.Separator />
      <ContextMenu.Item start="pencil">Rename</ContextMenu.Item>
      <ContextMenu.Item start="duplicate">Duplicate</ContextMenu.Item>
      <ContextMenu.Item start="share">Share</ContextMenu.Item>
      <ContextMenu.Separator />
      <ContextMenu.Item start="trash" destructive>
        Delete
      </ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu.Root>
);

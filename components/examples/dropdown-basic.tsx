'use client';

import { Button } from '@/components/ui/button';
import { Dropdown } from '@/components/ui/dropdown-menu';

/** Action menu triggered by an icon-only ghost ellipsis button. */
export const DropdownBasic = () => {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button mode="ghost" iconStart="ellipsis" aria-label="Report actions" />
      </Dropdown.Trigger>
      <Dropdown.Content align="end">
        <Dropdown.Item start="edit">Rename</Dropdown.Item>
        <Dropdown.Item start="duplicate">Duplicate</Dropdown.Item>
        <Dropdown.Item start="share">Share</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item start="trash" className="text-text-red">
          Delete
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
};

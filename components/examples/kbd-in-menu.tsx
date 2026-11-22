'use client';

import { Dropdown } from '@/components/ui/dropdown-menu';

/** Uses Dropdown.Shortcut inside a Dropdown menu to show row shortcuts. */
export function KbdInMenu() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger buttonWithChevron>Report actions</Dropdown.Trigger>
      <Dropdown.Content className="w-56">
        <Dropdown.Item start="link" end={<Dropdown.Shortcut keys={['mod', 'C']} />}>
          Copy link
        </Dropdown.Item>
        <Dropdown.Item start="duplicate" end={<Dropdown.Shortcut keys={['mod', 'D']} />}>
          Duplicate
        </Dropdown.Item>
        <Dropdown.Item start="edit" end={<Dropdown.Shortcut keys={['alt', 'R']} />}>
          Rename
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item start="trash" end={<Dropdown.Shortcut keys={['mod', '⌫']} />}>
          Delete
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

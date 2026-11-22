'use client';

import { Dropdown } from '@/components/ui/dropdown-menu';
import { SplitButton } from '@/components/ui/split-button';

export function SplitButtonGhost() {
  return (
    <SplitButton.Root mode="ghost" className="shadow-none">
      <SplitButton.Action iconStart="plus">New slide</SplitButton.Action>
      <SplitButton.Trigger aria-label="Choose a layout" />
      <Dropdown.Content align="start" size={200}>
        <Dropdown.Item>Title slide</Dropdown.Item>
        <Dropdown.Item>Title and content</Dropdown.Item>
        <Dropdown.Item>Two columns</Dropdown.Item>
        <Dropdown.Item>Blank</Dropdown.Item>
      </Dropdown.Content>
    </SplitButton.Root>
  );
}

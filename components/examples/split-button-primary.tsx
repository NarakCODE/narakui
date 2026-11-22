'use client';

import { Bot, Upload } from 'lucide-react';
import { Dropdown } from '@/components/ui/dropdown-menu';
import { SplitButton } from '@/components/ui/split-button';

export function SplitButtonPrimary() {
  return (
    <SplitButton.Root mode="primary">
      <SplitButton.Action iconStart="plus">Create</SplitButton.Action>
      <SplitButton.Trigger aria-label="More ways to create" />
      <Dropdown.Content align="end" size={240}>
        <Dropdown.Item
          start={<Bot aria-hidden="true" className="size-4 shrink-0 text-text-secondary" />}
        >
          Start from a template
        </Dropdown.Item>
        <Dropdown.Item
          start={<Upload aria-hidden="true" className="size-4 shrink-0 text-text-secondary" />}
        >
          Import from a file
        </Dropdown.Item>
        <Dropdown.Item start="duplicate">
          Duplicate an existing agent
        </Dropdown.Item>
      </Dropdown.Content>
    </SplitButton.Root>
  );
}

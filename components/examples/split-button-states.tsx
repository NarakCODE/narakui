'use client';

import { Dropdown } from '@/components/ui/dropdown-menu';
import { SplitButton } from '@/components/ui/split-button';

export function SplitButtonStates() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <SplitButton.Root mode="primary" disabled>
        <SplitButton.Action iconStart="plus">Create</SplitButton.Action>
        <SplitButton.Trigger aria-label="More ways to create" />
        <Dropdown.Content align="end">
          <Dropdown.Item>Start from a template</Dropdown.Item>
        </Dropdown.Content>
      </SplitButton.Root>
      <SplitButton.Root>
        <SplitButton.Action iconStart="refresh" loading={{ isLoading: true }}>
          Run checks
        </SplitButton.Action>
        <SplitButton.Trigger aria-label="Choose checks" disabled />
        <Dropdown.Content align="end">
          <Dropdown.Item>Brand voice</Dropdown.Item>
        </Dropdown.Content>
      </SplitButton.Root>
    </div>
  );
}

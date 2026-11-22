'use client';

import { BarChart3 } from 'lucide-react';
import { Dropdown } from '@/components/ui/dropdown-menu';
import { SplitButton } from '@/components/ui/split-button';

export function SplitButtonLink() {
  return (
    <SplitButton.Root mode="primary">
      <SplitButton.Action href="#new-report" iconStart="plus">
        New report
      </SplitButton.Action>
      <SplitButton.Trigger aria-label="More report types" />
      <Dropdown.Content align="end" size={220}>
        <Dropdown.Item
          href="#visibility-report"
          start={
            <BarChart3
              aria-hidden="true"
              className="size-4 shrink-0 text-text-secondary"
            />
          }
        >
          Visibility report
        </Dropdown.Item>
        <Dropdown.Item href="#citation-report" start="link">
          Citation report
        </Dropdown.Item>
      </Dropdown.Content>
    </SplitButton.Root>
  );
}

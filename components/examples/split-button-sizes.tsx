'use client';

import { Upload } from 'lucide-react';
import { Dropdown } from '@/components/ui/dropdown-menu';
import { SplitButton } from '@/components/ui/split-button';

function SkillMenu() {
  return (
    <Dropdown.Content align="end" size={220}>
      <Dropdown.Item start="plus">New skill</Dropdown.Item>
    </Dropdown.Content>
  );
}

export function SplitButtonSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <SplitButton.Root mode="primary" size="small">
        <SplitButton.Action iconStart={<Upload aria-hidden="true" />}>
          Upload skill
        </SplitButton.Action>
        <SplitButton.Trigger aria-label="More ways to add a skill" />
        <SkillMenu />
      </SplitButton.Root>
      <SplitButton.Root mode="primary">
        <SplitButton.Action iconStart={<Upload aria-hidden="true" />}>
          Upload skill
        </SplitButton.Action>
        <SplitButton.Trigger aria-label="More ways to add a skill" />
        <SkillMenu />
      </SplitButton.Root>
      <SplitButton.Root mode="primary" size="large">
        <SplitButton.Action iconStart={<Upload aria-hidden="true" />}>
          Upload skill
        </SplitButton.Action>
        <SplitButton.Trigger aria-label="More ways to add a skill" />
        <SkillMenu />
      </SplitButton.Root>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Dropdown } from '@/components/ui/dropdown-menu';
import { SplitButton } from '@/components/ui/split-button';

const CHECK_PACKS = ['Brand voice', 'Legal claims', 'Accessibility'];

export function SplitButtonSecondary() {
  const [packs, setPacks] = useState(CHECK_PACKS);

  return (
    <SplitButton.Root>
      <SplitButton.Action iconStart="refresh" disabled={packs.length === 0}>
        Run checks
      </SplitButton.Action>
      <SplitButton.Trigger aria-label="Choose checks" />
      <Dropdown.Content align="end">
        <Dropdown.Label>Checks to run</Dropdown.Label>
        {CHECK_PACKS.map((pack) => (
          <Dropdown.CheckboxItem
            key={pack}
            checked={packs.includes(pack)}
            showOnlyButton={false}
            onSelect={(event) => event.preventDefault()}
            onCheckedChange={(checked) =>
              setPacks((current) =>
                checked === true
                  ? [...current, pack]
                  : current.filter((item) => item !== pack),
              )
            }
          >
            {pack}
          </Dropdown.CheckboxItem>
        ))}
      </Dropdown.Content>
    </SplitButton.Root>
  );
}

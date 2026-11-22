'use client';

import { useState } from 'react';
import { Dropdown } from '@/components/ui/dropdown-menu';

const DATE_RANGES = ['Last 7 days', 'Last 30 days', 'Last 90 days'];

/** Compact `buttonWithChevron` trigger with a leading calendar icon. */
export const DropdownWithButtonTrigger = () => {
  const [range, setRange] = useState('Last 30 days');

  return (
    <Dropdown.Root>
      <Dropdown.Trigger buttonWithChevron iconStart="calendar">
        {range}
      </Dropdown.Trigger>
      <Dropdown.Content>
        {DATE_RANGES.map((option) => (
          <Dropdown.Item key={option} onSelect={() => setRange(option)}>
            {option}
          </Dropdown.Item>
        ))}
        <Dropdown.Separator />
        <Dropdown.Item
          start="calendar-days"
          onSelect={() => setRange('Custom range')}
        >
          Custom range
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
};

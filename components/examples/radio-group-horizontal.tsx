'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

/** Horizontal radio group for inline date-range selection. */
export function RadioGroupHorizontal() {
  return (
    <RadioGroup aria-label="Date range" defaultValue="30d" orientation="horizontal">
      <RadioGroupItem value="7d">Last 7 days</RadioGroupItem>
      <RadioGroupItem value="30d">Last 30 days</RadioGroupItem>
      <RadioGroupItem value="90d">Last 90 days</RadioGroupItem>
    </RadioGroup>
  );
}

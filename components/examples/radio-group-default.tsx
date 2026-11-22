'use client';

import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

/** Controlled vertical radio group for selecting report frequency. */
export function RadioGroupDefault() {
  const [frequency, setFrequency] = useState('weekly');

  return (
    <RadioGroup
      aria-label="Report frequency"
      value={frequency}
      onValueChange={setFrequency}
    >
      <RadioGroupItem value="daily">Daily</RadioGroupItem>
      <RadioGroupItem value="weekly">Weekly</RadioGroupItem>
      <RadioGroupItem value="monthly">Monthly</RadioGroupItem>
    </RadioGroup>
  );
}

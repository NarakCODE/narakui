'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

/** Read-only radio items preserving selected appearance while ignoring pointer and keyboard input. */
export function RadioGroupReadOnly() {
  return (
    <RadioGroup aria-label="Data region" defaultValue="us">
      <RadioGroupItem value="us" readOnly>
        United States
      </RadioGroupItem>
      <RadioGroupItem value="eu" readOnly>
        European Union
      </RadioGroupItem>
    </RadioGroup>
  );
}

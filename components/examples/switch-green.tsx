'use client';

import { Switch } from '@/components/ui/switch';

/** Switches using the green checked track fill. */
export function SwitchGreen() {
  return (
    <div className="flex flex-col items-start gap-2">
      <Switch color="green" labelClassName="pr-2" defaultChecked title="Agent active" />
      <Switch color="green" slim defaultChecked title="Agent active" />
    </div>
  );
}

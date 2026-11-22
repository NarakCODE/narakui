'use client';

import { Switch } from '@/components/ui/switch';

/** Slim small switches combined for compact chart controls. */
export function SwitchSlimSmall() {
  return (
    <div className="flex flex-col items-start gap-2">
      <Switch slim size="sm" title="Show competitors" />
      <Switch slim size="sm" defaultChecked title="Show data labels" />
      <Switch slim size="sm" disabled title="Show forecast" />
      <Switch slim size="sm" disabled defaultChecked title="Show legend" />
    </div>
  );
}

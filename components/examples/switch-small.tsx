'use client';

import { Switch } from '@/components/ui/switch';

/** Small switches shrunk for dense toolbars. */
export function SwitchSmall() {
  return (
    <div className="flex flex-col items-start gap-2">
      <Switch size="sm" labelClassName="pr-2" title="Show competitors" />
      <Switch size="sm" labelClassName="pr-2" defaultChecked title="Show data labels" />
      <Switch size="sm" labelClassName="pr-2" disabled title="Show forecast" />
      <Switch size="sm" labelClassName="pr-2" disabled defaultChecked title="Show legend" />
    </div>
  );
}

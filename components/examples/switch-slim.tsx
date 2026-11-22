'use client';

import { Switch } from '@/components/ui/switch';

/** Slim switches dropping the raised control surface for menus, popovers, and settings lists. */
export function SwitchSlim() {
  return (
    <div className="flex flex-col items-start gap-2">
      <Switch slim title="Weekly email digest" />
      <Switch slim defaultChecked title="Slack alerts" />
      <Switch slim disabled title="Public report link" />
      <Switch slim disabled defaultChecked title="Track ChatGPT" />
    </div>
  );
}

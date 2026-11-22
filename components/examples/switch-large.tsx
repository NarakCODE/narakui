'use client';

import { Switch } from '@/components/ui/switch';

/** Large switches with enlarged track and thumb for roomier layouts. */
export function SwitchLarge() {
  return (
    <div className="flex flex-col items-start gap-2">
      <Switch size="lg" labelClassName="pr-2" title="Weekly email digest" />
      <Switch size="lg" labelClassName="pr-2" defaultChecked title="Slack alerts" />
      <Switch size="lg" labelClassName="pr-2" disabled title="Public report link" />
    </div>
  );
}

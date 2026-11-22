'use client';

import { Switch } from '@/components/ui/switch';

/** Default switches rendered on a raised control surface. */
export function SwitchDefault() {
  return (
    <div className="flex flex-col items-start gap-2">
      <Switch labelClassName="pr-2" title="Weekly email digest" />
      <Switch labelClassName="pr-2" defaultChecked title="Slack alerts" />
      <Switch labelClassName="pr-2" disabled title="Public report link" />
      <Switch labelClassName="pr-2" disabled defaultChecked title="Track ChatGPT" />
    </div>
  );
}

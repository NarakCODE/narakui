'use client';

import { Switch } from '@/components/ui/switch';

/** Loading switches displaying a spinner inside the thumb with `aria-busy`. */
export function SwitchLoading() {
  return (
    <div className="flex flex-col items-start gap-2">
      <Switch isLoading labelClassName="pr-2" title="Slack alerts" />
      <Switch isLoading labelClassName="pr-2" defaultChecked title="Weekly email digest" />
    </div>
  );
}

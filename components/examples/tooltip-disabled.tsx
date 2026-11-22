'use client';

import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';

export function TooltipDisabled() {
  return (
    <div className="flex gap-4">
      <Tooltip content="Exports the last 30 days" disabled>
        <Button>Tooltip off</Button>
      </Tooltip>
      <Tooltip content="Exports the last 30 days">
        <Button>Tooltip on</Button>
      </Tooltip>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';

export function TooltipWithArrow() {
  return (
    <div className="flex gap-4">
      <Tooltip content="Share with your team" showArrow>
        <Button>With arrow</Button>
      </Tooltip>
      <Tooltip content="Share with your team">
        <Button>Without arrow</Button>
      </Tooltip>
    </div>
  );
}

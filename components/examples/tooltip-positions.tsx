'use client';

import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';

export function TooltipPositions() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Tooltip content="Shown above" side="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip content="Shown to the right" side="right">
        <Button>Right</Button>
      </Tooltip>
      <Tooltip content="Shown below" side="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip content="Shown to the left" side="left">
        <Button>Left</Button>
      </Tooltip>
    </div>
  );
}

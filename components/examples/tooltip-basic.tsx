'use client';

import { Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';

export function TooltipBasic() {
  return (
    <div className="flex gap-4">
      <Tooltip content="Copy link">
        <Button iconStart={<Link2 className="size-4" />} aria-label="Copy link" />
      </Tooltip>
      <Tooltip content="Runs all 128 prompts again">
        <Button iconStart="refresh">Rerun report</Button>
      </Tooltip>
    </div>
  );
}

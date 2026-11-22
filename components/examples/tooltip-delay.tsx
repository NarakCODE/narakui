'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipProvider } from '@/components/ui/tooltip';

export function TooltipWithDelay() {
  return (
    <TooltipProvider delayDuration={900}>
      <div className="flex gap-2">
        <Tooltip content="Rename">
          <Button iconStart="edit" aria-label="Rename" />
        </Tooltip>
        <Tooltip content="Download report">
          <Button iconStart="download" aria-label="Download report" />
        </Tooltip>
        <Tooltip content="Delete">
          <Button iconStart="trash" aria-label="Delete" />
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

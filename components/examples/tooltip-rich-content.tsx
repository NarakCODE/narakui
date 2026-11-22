'use client';

import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipLayout } from '@/components/ui/tooltip';

export function TooltipRichContent() {
  return (
    <div className="flex gap-4">
      <Tooltip
        contentProps={{ className: 'min-w-56' }}
        content={
          <>
            <TooltipLayout.Header>Visibility · Last 7 days</TooltipLayout.Header>
            <TooltipLayout.Body>
              <TooltipLayout.Row type="key-value">
                <TooltipLayout.ItemColoredBox color="var(--color-fill-blue)">
                  ChatGPT
                </TooltipLayout.ItemColoredBox>
                <span>48%</span>
              </TooltipLayout.Row>
              <TooltipLayout.Row type="key-value">
                <TooltipLayout.ItemColoredBox color="var(--color-fill-green)">
                  Perplexity
                </TooltipLayout.ItemColoredBox>
                <span>31%</span>
              </TooltipLayout.Row>
            </TooltipLayout.Body>
          </>
        }
      >
        <Button>Rich content</Button>
      </Tooltip>
      <Tooltip
        content={
          <span className="flex items-center gap-2">
            <Clock className="size-4 shrink-0" />
            Data refreshes every hour
          </span>
        }
      >
        <Button>With icon</Button>
      </Tooltip>
    </div>
  );
}

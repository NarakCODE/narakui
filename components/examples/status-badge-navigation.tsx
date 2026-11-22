'use client';

import { Bot, Presentation, ShoppingBag, Sparkles } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';

/** Displays StatusBadge inline next to sidebar navigation labels. */
export function StatusBadgeNavigation() {
  return (
    <div className="flex w-56 flex-col gap-1 rounded-xl bg-bg-primary p-2 shadow-low">
      <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-body-small-medium text-text-primary">
        <Sparkles aria-hidden="true" className="size-4 shrink-0 text-text-secondary" />
        Answer Engine Insights
      </div>
      <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-body-small-medium text-text-primary">
        <Bot aria-hidden="true" className="size-4 shrink-0 text-text-secondary" />
        Agents
        <StatusBadge text="New" />
      </div>
      <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-body-small-medium text-text-primary">
        <Presentation aria-hidden="true" className="size-4 shrink-0 text-text-secondary" />
        Slides
        <StatusBadge text="Beta" type="purple" />
      </div>
      <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-body-small-medium text-text-primary">
        <ShoppingBag aria-hidden="true" className="size-4 shrink-0 text-text-secondary" />
        Shopping
        <StatusBadge text="Soon" type="gray" />
      </div>
    </div>
  );
}

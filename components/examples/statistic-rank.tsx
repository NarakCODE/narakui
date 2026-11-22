'use client';

import type { ReactNode } from 'react';
import { Statistic } from '@/components/ui/statistic';

function MetricTile({
  label,
  caption,
  children,
}: {
  label: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-36 flex-col gap-1">
      <span className="text-body-small-medium text-text-secondary">{label}</span>
      <span className="text-title-small-medium text-text-primary">{children}</span>
      <span className="text-body-mini-regular text-text-secondary">{caption}</span>
    </div>
  );
}

/** Displays rank movements with directional up/down arrows instead of plus/minus signs. */
export function StatisticRank() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <MetricTile label="ChatGPT rank" caption="Moved up three places">
        <Statistic value={3} changeMode="rank" />
      </MetricTile>
      <MetricTile label="Perplexity rank" caption="Moved down two places">
        <Statistic value={-2} changeMode="rank" />
      </MetricTile>
    </div>
  );
}

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

/** Basic formatted metrics comparing plain values and percentage trend changes. */
export function StatisticBasic() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
      <MetricTile label="Prompts tracked" caption="Across 4 answer engines">
        <Statistic value={1284} showTrend={false} />
      </MetricTile>
      <MetricTile label="Visibility" caption="Share of answers that mention you">
        <Statistic value={0.426} type="percentage" showTrend={false} />
      </MetricTile>
      <MetricTile label="Visibility change" caption="Compared with last month">
        <Statistic value={-0.032} type="percentage" />
      </MetricTile>
    </div>
  );
}

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

/** Demonstrates positive, negative, and zero-change trend indicators. */
export function StatisticTrends() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
      <MetricTile label="Citations" caption="Up from last week">
        <Statistic value={1234} />
      </MetricTile>
      <MetricTile label="Mentions" caption="Down from last week">
        <Statistic value={-567} />
      </MetricTile>
      <MetricTile label="Sentiment" caption="No change">
        <Statistic value={0} />
      </MetricTile>
    </div>
  );
}

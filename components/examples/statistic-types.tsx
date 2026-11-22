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

/** Compares abbreviated number formatting with percentage formatting. */
export function StatisticTypes() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <MetricTile label="number" caption="1,234,567 is abbreviated">
        <Statistic value={1_234_567} showTrend={false} />
      </MetricTile>
      <MetricTile label="percentage" caption="0.1234 is shown as a percentage">
        <Statistic value={0.1234} type="percentage" showTrend={false} />
      </MetricTile>
    </div>
  );
}

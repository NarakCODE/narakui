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

/** Shows default and custom placeholder text when value is null or undefined. */
export function StatisticEmpty() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <MetricTile label="Default" caption="No value yet">
        <Statistic value={null} />
      </MetricTile>
      <MetricTile label="emptyText" caption="Custom placeholder">
        <Statistic value={undefined} emptyText="No data" />
      </MetricTile>
    </div>
  );
}

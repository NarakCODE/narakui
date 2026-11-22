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

/** Adds currency prefixes, signed prefixes, and unit suffixes to plain statistics. */
export function StatisticPrefixSuffix() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
      <MetricTile label="Ad spend" caption="Currency prefix">
        <Statistic value={1234} prefix="$" showTrend={false} />
      </MetricTile>
      <MetricTile label="Net revenue change" caption="Sign passed in the prefix">
        <Statistic value={1234} prefix="-$" showTrend={false} />
      </MetricTile>
      <MetricTile label="Accuracy" caption="Percent suffix">
        <Statistic value={98.5} suffix="%" showTrend={false} />
      </MetricTile>
    </div>
  );
}

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

/** Demonstrates decimal precision and fixed trailing-zero formatting. */
export function StatisticDecimals() {
  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
      <MetricTile label="decimals={0}" caption="Whole number">
        <Statistic value={12.345} decimals={0} showTrend={false} />
      </MetricTile>
      <MetricTile label="Default" caption="One decimal place">
        <Statistic value={12.345} showTrend={false} />
      </MetricTile>
      <MetricTile label="decimals={2}" caption="Two decimal places">
        <Statistic value={12.345} decimals={2} showTrend={false} />
      </MetricTile>
      <MetricTile label="fixedDecimals" caption="Keeps trailing zeros">
        <Statistic value={12.5} decimals={2} fixedDecimals showTrend={false} />
      </MetricTile>
    </div>
  );
}

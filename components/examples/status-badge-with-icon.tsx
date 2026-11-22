'use client';

import { StatusBadge } from '@/components/ui/status-badge';

/** Demonstrates leading icon badges tinted to match each semantic type. */
export function StatusBadgeWithIcon() {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center text-body-small-medium text-text-primary">
        Aim suggestions
        <StatusBadge text="AI" type="purple" iconStart="sparkles" />
      </div>
      <div className="flex items-center text-body-small-medium text-text-primary">
        Agent Analytics
        <StatusBadge text="Live" type="green" iconStart="signal" />
      </div>
      <div className="flex items-center text-body-small-medium text-text-primary">
        Enterprise reports
        <StatusBadge text="Upgrade" type="amber" iconStart="lock" />
      </div>
    </div>
  );
}

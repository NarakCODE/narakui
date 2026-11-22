'use client';

import { StatusBadge } from '@/components/ui/status-badge';

/** Showcases semantic StatusBadge colors with ml-0 inside a flex gap container. */
export function StatusBadgeTypes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <StatusBadge text="New" className="ml-0" />
      <StatusBadge text="Live" type="green" className="ml-0" />
      <StatusBadge text="Beta" type="purple" className="ml-0" />
      <StatusBadge text="Limited" type="amber" className="ml-0" />
      <StatusBadge text="Deprecated" type="red" className="ml-0" />
      <StatusBadge text="Soon" type="gray" className="ml-0" />
    </div>
  );
}

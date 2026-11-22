'use client';

import { useState } from 'react';
import { SingleSelectFilter } from '@/components/ui/single-select-filter';

type MemberStatus = 'active' | 'pending';

const STATUS_ITEMS = [
  { id: 'active', name: 'Active' },
  { id: 'pending', name: 'Pending' },
] as const;

export function SingleSelectFilterBasicExample() {
  const [status, setStatus] = useState<MemberStatus>('active');

  return (
    <SingleSelectFilter
      label="Status"
      items={STATUS_ITEMS}
      value={status}
      onChange={setStatus}
    />
  );
}

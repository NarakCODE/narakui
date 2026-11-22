'use client';

import { useState } from 'react';
import { SingleSelectFilter } from '@/components/ui/single-select-filter';

type FunnelStage =
  | 'all'
  | 'upper_funnel'
  | 'mid_funnel'
  | 'lower_funnel'
  | 'post_purchase';

type SortOrder = 'newest' | 'oldest' | 'name';

const STAGE_ITEMS = [
  { id: 'all', name: 'All stages' },
  { id: 'upper_funnel', name: 'Upper funnel' },
  { id: 'mid_funnel', name: 'Mid funnel' },
  { id: 'lower_funnel', name: 'Lower funnel' },
  { id: 'post_purchase', name: 'Post-purchase' },
] as const;

const SORT_ITEMS = [
  { id: 'newest', name: 'Newest first' },
  { id: 'oldest', name: 'Oldest first' },
  { id: 'name', name: 'Name' },
] as const;

export function SingleSelectFilterDefaultValueExample() {
  const [stage, setStage] = useState<FunnelStage>('mid_funnel');
  const [sort, setSort] = useState<SortOrder>('newest');

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <SingleSelectFilter
        label="Stage"
        iconStart="filter"
        items={STAGE_ITEMS}
        value={stage}
        defaultValue="all"
        onChange={setStage}
      />
      <SingleSelectFilter
        label="Sort"
        iconStart="sort"
        items={SORT_ITEMS}
        value={sort}
        defaultValue="newest"
        onChange={setSort}
      />
    </div>
  );
}

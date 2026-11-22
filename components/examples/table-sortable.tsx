'use client';

import { useState } from 'react';
import { ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Badge, type BadgeType } from '@/components/ui/badge';
import { createTable } from '@/components/ui/table';
import { cn } from '@/lib/utils';

type ReportRow = {
  id: string;
  name: string;
  owner: string;
  status: 'Ready' | 'Draft' | 'Needs review';
  updated: string;
};

const REPORT_ROWS: ReportRow[] = [
  { id: 'visibility', name: 'Visibility report', owner: 'Jason', status: 'Ready', updated: 'Today' },
  { id: 'competitor', name: 'Competitor brief', owner: 'Maya', status: 'Draft', updated: 'Yesterday' },
  { id: 'citation', name: 'Citation review', owner: 'Priya', status: 'Needs review', updated: 'Monday' },
];

const STATUS_BADGE_TYPES: Record<ReportRow['status'], BadgeType> = {
  Ready: 'green',
  Draft: 'gray',
  'Needs review': 'amber',
};

const SORTABLE_COLUMNS = { name: 'Name', owner: 'Owner', updated: 'Updated' } as const;
type SortKey = keyof typeof SORTABLE_COLUMNS;

const Table = createTable<ReportRow>();

const renderStatus = (row: ReportRow) => (
  <Badge title={row.status} type={STATUS_BADGE_TYPES[row.status]} size="small" />
);

export function TableSortableExample() {
  const [sort, setSort] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc',
  });

  const rows = [...REPORT_ROWS].sort((left, right) => {
    const comparison = left[sort.key].localeCompare(right[sort.key]);
    return sort.direction === 'asc' ? comparison : -comparison;
  });

  const changeSort = (key: SortKey) =>
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));

  return (
    <Table data={rows} rowKey="id" aria-label="Reports" wrapperClassName="w-full">
      {(Object.keys(SORTABLE_COLUMNS) as SortKey[]).map((key) => (
        <Table.Column
          key={key}
          id={key}
          className="min-w-28"
          sortDirection={sort.key === key ? sort.direction : undefined}
          renderHeader={() => (
            <th className="px-4 py-3 text-left">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-sm text-body-small-medium text-text-secondary transition-colors duration-150 ease-out hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                onClick={() => changeSort(key)}
              >
                {SORTABLE_COLUMNS[key]}
                {sort.key === key ? (
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      'size-4 shrink-0 text-text-primary transition-transform duration-150 ease-out motion-reduce:transition-none',
                      { 'rotate-180': sort.direction === 'asc' },
                    )}
                  />
                ) : (
                  <ChevronsUpDown
                    aria-hidden="true"
                    className="size-4 shrink-0 text-text-secondary"
                  />
                )}
              </button>
            </th>
          )}
          getValue={(row) => row[key]}
        />
      ))}
      <Table.Column id="status" label="Status" className="min-w-36" getValue={renderStatus} />
    </Table>
  );
}

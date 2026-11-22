'use client';

import { useState } from 'react';
import { Badge, type BadgeType } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createTable } from '@/components/ui/table';

type ReportRow = {
  id: string;
  name: string;
  status: 'Ready' | 'Draft' | 'Needs review';
};

const REPORT_ROWS: ReportRow[] = [
  { id: 'visibility', name: 'Visibility report', status: 'Ready' },
  { id: 'competitor', name: 'Competitor brief', status: 'Draft' },
  { id: 'citation', name: 'Citation review', status: 'Needs review' },
];

const STATUS_BADGE_TYPES: Record<ReportRow['status'], BadgeType> = {
  Ready: 'green',
  Draft: 'gray',
  'Needs review': 'amber',
};

const Table = createTable<ReportRow>();

const renderStatus = (row: ReportRow) => (
  <Badge title={row.status} type={STATUS_BADGE_TYPES[row.status]} size="small" />
);

export function TableActionsExample() {
  const [openedId, setOpenedId] = useState<string | null>(null);

  return (
    <Table data={REPORT_ROWS} rowKey="id" aria-label="Reports" wrapperClassName="w-full">
      <Table.Column id="name" label="Name" className="min-w-48" getValue={(row) => row.name} />
      <Table.Column id="status" label="Status" className="min-w-36" getValue={renderStatus} />
      <Table.Column
        id="actions"
        label="Actions"
        align="right"
        className="min-w-28"
        cellClassName="py-2"
        getValue={(row) => (
          <div className="flex justify-end">
            <Button
              mode="ghost"
              size="small"
              aria-label={`Open ${row.name}`}
              onClick={() => setOpenedId(row.id)}
            >
              {openedId === row.id ? 'Opened' : 'Open'}
            </Button>
          </div>
        )}
      />
    </Table>
  );
}

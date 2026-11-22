'use client';

import { Badge, type BadgeType } from '@/components/ui/badge';
import { createTable } from '@/components/ui/table';

type ReportRow = {
  id: string;
  name: string;
  owner: string;
  status: 'Ready' | 'Draft' | 'Needs review';
  updated: string;
  details: string;
};

const REPORT_ROWS: ReportRow[] = [
  {
    id: 'visibility',
    name: 'Visibility report',
    owner: 'Jason',
    status: 'Ready',
    updated: 'Today',
    details: 'Tracks visibility, citations, and answer engine share across the selected category.',
  },
  {
    id: 'competitor',
    name: 'Competitor brief',
    owner: 'Maya',
    status: 'Draft',
    updated: 'Yesterday',
    details: 'Groups competitor sources and content opportunities for the next review cycle.',
  },
  {
    id: 'citation',
    name: 'Citation review',
    owner: 'Priya',
    status: 'Needs review',
    updated: 'Monday',
    details: 'Highlights cited pages that need a stronger claim, source, or supporting section.',
  },
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

export function TableBasicExample() {
  return (
    <Table data={REPORT_ROWS} rowKey="id" aria-label="Reports" wrapperClassName="w-full">
      <Table.Column id="name" label="Name" className="min-w-48" getValue={(row) => row.name} />
      <Table.Column id="owner" label="Owner" className="min-w-28" getValue={(row) => row.owner} />
      <Table.Column id="status" label="Status" className="min-w-36" getValue={renderStatus} />
      <Table.Column id="updated" label="Updated" className="min-w-28" getValue={(row) => row.updated} />
    </Table>
  );
}

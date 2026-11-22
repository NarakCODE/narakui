import { EmptyState } from '@/components/ui/empty-state';

export const BasicEmptyStateExample = () => (
  <EmptyState
    icon={{ name: 'documents', className: 'size-6 text-fill-secondary' }}
    title="No reports yet"
    description="Reports appear here once you schedule your first one."
  />
);

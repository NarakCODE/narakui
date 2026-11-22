import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export const EmptyStateWithActionExample = () => (
  <EmptyState
    action={<Button iconStart="plus">New report</Button>}
    description="Reports appear here once you schedule your first one."
    icon={{ name: 'documents', className: 'size-6 text-fill-secondary' }}
    title="No reports yet"
  />
);

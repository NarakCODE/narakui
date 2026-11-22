import { EmptyState } from '@/components/ui/empty-state';

export const EmptyStateWithoutTitleExample = () => (
  <EmptyState
    description="Citations from answer engines appear here after the next prompt run."
    icon={{ name: 'link', className: 'size-6 text-fill-secondary' }}
  />
);

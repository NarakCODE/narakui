import { ErrorState } from '@/components/ui/empty-state';

export const ErrorStateWithoutRetryExample = () => (
  <ErrorState
    description="Refresh the page to try again."
    title="Visibility trends are unavailable"
  />
);

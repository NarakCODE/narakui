'use client';

import { ErrorState } from '@/components/ui/empty-state';

export const BasicErrorStateExample = () => (
  <ErrorState
    description="Something went wrong loading your tracked prompts."
    onRetry={() => undefined}
  />
);

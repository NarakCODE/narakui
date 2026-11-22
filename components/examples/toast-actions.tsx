'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export function ToastWithActions() {
  const toast = useToast();

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Button
        onClick={() =>
          toast.default({
            heading: 'Report deleted',
            description: 'Competitor brief was moved to the trash.',
            actionLabel: 'Undo',
            onAction: () => toast.success({ heading: 'Report restored' }),
          })
        }
      >
        Stacked action
      </Button>

      <Button
        onClick={() =>
          toast.default({
            heading: 'Report deleted',
            description: 'Competitor brief was moved to the trash.',
            actionLabel: 'Undo',
            actionPlacement: 'inline',
            onAction: () => toast.success({ heading: 'Report restored' }),
          })
        }
      >
        Inline action
      </Button>
    </div>
  );
}

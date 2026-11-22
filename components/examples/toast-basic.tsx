'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export function ToastBasic() {
  const toast = useToast();

  return (
    <Button
      onClick={() =>
        toast.success({
          heading: 'Report saved',
          description: 'Your visibility report is ready to share.',
        })
      }
    >
      Save report
    </Button>
  );
}

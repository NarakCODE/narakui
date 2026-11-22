'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export function ToastDismiss() {
  const toast = useToast();
  const [toastId, setToastId] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Button
        onClick={() => {
          setToastId(
            toast.default({
              heading: 'Weekly report scheduled',
              description: 'It will be sent every Monday at 9:00 AM.',
              duration: 0,
              onDismiss: () => setToastId(null),
            }),
          );
        }}
      >
        Show persistent toast
      </Button>
      <Button
        disabled={toastId === null}
        onClick={() => {
          if (toastId) toast.dismiss(toastId);
          setToastId(null);
        }}
      >
        Dismiss from code
      </Button>
    </div>
  );
}

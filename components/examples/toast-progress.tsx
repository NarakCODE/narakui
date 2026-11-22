'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export function ToastWithProgress() {
  const toast = useToast();
  const [toastId, setToastId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const start = () => {
    setProgress(0);
    setToastId(
      toast.progress({
        heading: 'Uploading',
        description: 'brand-guidelines.pdf',
      }),
    );
  };

  const advance = () => {
    if (!toastId) return;
    const next = progress + 25;
    if (next >= 100) {
      toast.dismiss(toastId);
      setToastId(null);
      toast.success({ heading: 'Upload complete' });
      return;
    }
    setProgress(next);
    toast.updateProgress(toastId, next);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Button disabled={toastId !== null} onClick={start}>
        Start upload
      </Button>
      <Button disabled={toastId === null} onClick={advance}>
        Add 25%
      </Button>
      <Button
        onClick={() =>
          toast.loading({
            heading: 'Generating report',
            description: 'This can take a minute.',
          })
        }
      >
        Loading toast
      </Button>
    </div>
  );
}

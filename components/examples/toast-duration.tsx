'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export function ToastWithDuration() {
  const toast = useToast();

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Button
        onClick={() =>
          toast.default({
            heading: 'Link copied',
            duration: 1000,
          })
        }
      >
        1 second
      </Button>
      <Button
        onClick={() =>
          toast.default({
            heading: 'Filters applied',
            description: 'Showing ChatGPT and Perplexity.',
          })
        }
      >
        3.5 seconds (default)
      </Button>
      <Button
        onClick={() =>
          toast.warning({
            heading: 'Report is out of date',
            description: 'Rerun it to include this week’s answers.',
            duration: 10000,
          })
        }
      >
        10 seconds
      </Button>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export function ToastTypes() {
  const toast = useToast();

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Button
        onClick={() =>
          toast.success({
            heading: 'Prompts added',
            description: '24 prompts will run in the next cycle.',
          })
        }
      >
        Success
      </Button>
      <Button
        onClick={() =>
          toast.warning({
            heading: 'Prompt limit almost reached',
            description: 'You have used 480 of 500 prompts.',
          })
        }
      >
        Warning
      </Button>
      <Button
        onClick={() =>
          toast.default({
            heading: 'Link copied',
            description: 'Anyone in your workspace can open it.',
          })
        }
      >
        Default
      </Button>
    </div>
  );
}

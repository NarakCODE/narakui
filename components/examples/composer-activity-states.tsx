'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Composer } from '@/components/ui/composer';

/** Comparison grid showing idle, working, one-shot success pulse, and disabled Composer cards. */
export const ComposerActivityStates = () => {
  const [pulseKey, setPulseKey] = useState(1);

  return (
    <div className="grid w-full gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-body-mini-medium text-text-secondary">Idle</span>
        <Composer scrollControl={null}>
          <p className="min-h-5.5 text-body-regular text-text-tertiary">Ask a question…</p>
        </Composer>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-body-mini-medium text-text-secondary">Working</span>
        <Composer activityState="working" scrollControl={null}>
          <p className="min-h-5.5 text-body-regular text-text-primary">Write a research agent…</p>
        </Composer>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-body-mini-medium text-text-secondary">Success</span>
          <Button
            size="micro"
            mode="ghost"
            onClick={() => setPulseKey((k) => k + 1)}
          >
            Replay halo
          </Button>
        </div>
        <Composer activityState="success" pulseKey={pulseKey} scrollControl={null}>
          <p className="min-h-5.5 text-body-regular text-text-primary">Write a research agent…</p>
        </Composer>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-body-mini-medium text-text-secondary">Disabled</span>
        <Composer activityState="disabled" sendDisabled scrollControl={null}>
          <p className="min-h-5.5 text-body-regular text-text-primary">Write a research agent…</p>
        </Composer>
      </div>
    </div>
  );
};

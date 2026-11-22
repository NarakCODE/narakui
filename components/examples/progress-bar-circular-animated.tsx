'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CircularProgress } from '@/components/ui/progress-bar';

/** Interactive CircularProgress draw-on-mount animation with a Replay button. */
export function CircularProgressAnimated() {
  const [replay, setReplay] = useState(0);

  return (
    <div className="flex flex-col items-center gap-6">
      <div key={replay} className="flex items-end justify-center gap-8">
        {[25, 65, 100].map((progress) => (
          <div key={progress} className="flex flex-col items-center gap-2">
            <CircularProgress
              progress={progress}
              size="lg"
              animated
              label={`${progress}% complete`}
            />
            <p className="text-body-mini-regular text-text-secondary tabular-nums">{progress}%</p>
          </div>
        ))}
      </div>
      <Button size="small" onClick={() => setReplay((count) => count + 1)}>
        Replay
      </Button>
    </div>
  );
}

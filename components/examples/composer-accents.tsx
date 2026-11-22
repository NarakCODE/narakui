'use client';

import { Composer } from '@/components/ui/composer';

/** Custom `activityAccent` tinting the working spectrum perimeter ring. */
export const ComposerAccents = () => {
  return (
    <div className="w-full max-w-xl">
      <Composer
        activityState="working"
        activityAccent="var(--color-fill-red)"
        scrollControl={null}
      >
        <p className="min-h-5.5 text-body-regular text-text-primary">
          Write a research agent that tracks competitor mentions.
        </p>
      </Composer>
    </div>
  );
};

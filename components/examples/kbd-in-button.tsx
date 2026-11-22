'use client';

import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';

/** Pairs Kbd hints with secondary, primary, and disabled buttons. */
export function KbdInButton() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>
        Skip
        <Kbd aria-hidden className="ml-1" keys={['enter']} />
      </Button>
      <Button mode="primary">
        Save changes
        <Kbd aria-hidden className="ml-1" keys={['mod', 'S']} variant="dark" />
      </Button>
      <Button mode="primary" disabled>
        Add memory
        <Kbd aria-hidden className="ml-1" keys={['mod', 'enter']} variant="dark" disabled />
      </Button>
    </div>
  );
}

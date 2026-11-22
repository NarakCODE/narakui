'use client';

import { Kbd } from '@/components/ui/kbd';

/** Demonstrates platform-aware modifier tokens and raw children inside Kbd. */
export function KbdKeys() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Kbd keys={['mod', 'K']} />
      <Kbd keys={['shift', 'enter']} />
      <Kbd keys={['alt', 'R']} />
      <Kbd keys={['mod', 'shift', 'P']} />
      <Kbd>Esc</Kbd>
      <Kbd>/</Kbd>
    </div>
  );
}

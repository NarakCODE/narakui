'use client';

import { Kbd } from '@/components/ui/kbd';

/** Compares light, dark, and disabled Kbd treatments. */
export function KbdVariants() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Kbd keys={['mod', 'enter']} />
      <Kbd keys={['mod', 'enter']} variant="dark" />
      <Kbd keys={['mod', 'enter']} disabled />
    </div>
  );
}

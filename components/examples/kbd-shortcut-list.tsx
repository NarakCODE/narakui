'use client';

import { Kbd } from '@/components/ui/kbd';

const SHORTCUTS = [
  { description: 'Search', keys: ['mod', 'K'] },
  { description: 'New chat', keys: ['mod', 'shift', 'O'] },
  { description: 'Bold', keys: ['mod', 'B'] },
  { description: 'Send message', keys: ['enter'] },
  { description: 'New line', keys: ['shift', 'enter'] },
];

/** Displays a two-column keyboard shortcut reference list. */
export function KbdShortcutList() {
  return (
    <div className="grid w-full max-w-64 grid-cols-[1fr_max-content] items-center gap-x-3 gap-y-3 rounded-xl bg-bg-primary p-4 shadow-low">
      {SHORTCUTS.map(({ description, keys }) => (
        <div key={description} className="contents">
          <span className="text-body-small-regular text-text-primary">{description}</span>
          <Kbd keys={keys} />
        </div>
      ))}
    </div>
  );
}

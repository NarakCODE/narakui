'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

/** View switcher pairing subtle (off) and tertiary (selected) Button modes. */
export function ButtonToggleState() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const options = [
    { value: 'grid', label: 'Grid view', icon: 'layout-grid' },
    { value: 'list', label: 'List view', icon: 'list' },
  ] as const;

  return (
    <div aria-label="View mode" className="flex items-center justify-center gap-0.5" role="group">
      {options.map((option) => (
        <Button
          aria-label={option.label}
          aria-pressed={view === option.value}
          iconStart={option.icon}
          key={option.value}
          mode={view === option.value ? 'tertiary' : 'subtle'}
          onClick={() => setView(option.value)}
        />
      ))}
    </div>
  );
}

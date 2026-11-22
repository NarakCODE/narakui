'use client';

import * as React from 'react';
import { Bell, CreditCard, KeyRound, Settings, Users } from 'lucide-react';
import { ActiveBar } from '@/components/ui/active-bar';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'members', label: 'Team members', icon: Users },
  { id: 'billing', label: 'Billing & plans', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'api-keys', label: 'API keys', icon: KeyRound },
];

const ITEM_HEIGHT = 36;
const ITEM_GAP = 4;
const PADDING_Y = 6;

export function ActiveBarDemo() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const top = PADDING_Y + activeIndex * (ITEM_HEIGHT + ITEM_GAP);

  return (
    <nav
      aria-label="Workspace settings"
      className="relative flex w-full max-w-xs flex-col gap-1 rounded-xl border border-border bg-card p-1.5 shadow-low"
      style={{ '--item-height': `${ITEM_HEIGHT}px` } as React.CSSProperties}
    >
      <ActiveBar top={top} leftOffset={6} rightOffset={6} />

      {NAV_ITEMS.map((item, index) => {
        const Icon = item.icon;
        const isActive = index === activeIndex;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'relative z-10 flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-body-small-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

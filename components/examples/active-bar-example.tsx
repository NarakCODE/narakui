'use client';

import { useState } from 'react';
import { Bell, CreditCard, User, Users, type LucideIcon } from 'lucide-react';
import { ActiveBar } from '@/components/ui/active-bar';

const ITEMS: { label: string; icon: LucideIcon }[] = [
  { label: 'Profile', icon: User },
  { label: 'Members', icon: Users },
  { label: 'Billing', icon: CreditCard },
  { label: 'Notifications', icon: Bell },
];

const ITEM_HEIGHT = 32;

/** Interactive demo showing ActiveBar sliding between vertical settings items. */
export function ActiveBarExample() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <nav
      aria-label="Settings"
      className="relative flex w-full max-w-60 flex-col [--item-height:32px]"
    >
      {ITEMS.map(({ label, icon: Icon }, index) => (
        <button
          key={label}
          type="button"
          aria-current={index === activeIndex ? 'page' : undefined}
          className="relative z-10 flex h-(--item-height) cursor-pointer items-center gap-2 rounded-md px-2 text-left text-body-small-regular text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:text-text-primary"
          onClick={() => setActiveIndex(index)}
        >
          <Icon className="size-4 shrink-0" aria-hidden="true" />
          {label}
        </button>
      ))}
      <ActiveBar top={activeIndex * ITEM_HEIGHT} />
    </nav>
  );
}

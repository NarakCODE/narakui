import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

export interface ActiveBarProps {
  /** Vertical offset in pixels of the active item. */
  top: number;
  /** Inset from the left edge in pixels. */
  leftOffset?: number;
  /** Inset from the right edge in pixels. */
  rightOffset?: number;
  /** Additional classes, for example a z-index or custom transition. */
  className?: string;
}

/** Sliding background highlight positioned behind the active vertical navigation item. */
export function ActiveBar({
  top,
  leftOffset = 0,
  rightOffset = 0,
  className,
}: ActiveBarProps) {
  return (
    <span
      aria-hidden="true"
      style={
        {
          '--top': `${top}px`,
          '--left-offset': `${leftOffset}px`,
          '--right-offset': `${rightOffset}px`,
        } as CSSProperties
      }
      className={cn(
        'pointer-events-none absolute top-0 right-(--right-offset) left-(--left-offset) h-(--item-height) translate-y-(--top) rounded-md bg-fill-quinary transition-[translate] duration-200 ease-in-out motion-reduce:transition-none',
        className,
      )}
    />
  );
}

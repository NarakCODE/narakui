'use client';

import type { ComponentProps, Ref } from 'react';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';

export interface ScrollAreaProps
  extends ComponentProps<typeof ScrollAreaPrimitive.Root> {
  /** Scrollbars to render. A direction without a scrollbar does not scroll. */
  orientation?: ScrollAreaOrientation;
  /** Accessible name for the viewport. Also makes it a focusable region for keyboard scrolling. */
  viewportLabel?: string;
  /** Ref to the scrolling viewport, for reading or setting the scroll position. */
  viewportRef?: Ref<HTMLDivElement>;
  /** Additional classes for the viewport. */
  viewportClassName?: string;
  /** Additional classes for the scrollbars. */
  scrollbarClassName?: string;
}

/** Scroll container with a thin custom scrollbar that matches NarakUI surfaces. */
function ScrollArea({
  className,
  children,
  viewportRef,
  viewportClassName,
  scrollbarClassName,
  orientation = 'vertical',
  type = 'hover',
  viewportLabel,
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      type={type}
      className={cn('relative', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        ref={viewportRef}
        className={cn(
          'size-full rounded-[inherit] outline-none transition-colors focus-visible:shadow-focus focus-visible:outline-1',
          viewportClassName,
        )}
        {...(viewportLabel
          ? { tabIndex: 0, role: 'region', 'aria-label': viewportLabel }
          : null)}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {orientation !== 'horizontal' ? (
        <ScrollBar orientation="vertical" className={scrollbarClassName} />
      ) : null}
      {orientation !== 'vertical' ? (
        <ScrollBar orientation="horizontal" className={scrollbarClassName} />
      ) : null}
      <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
    </ScrollAreaPrimitive.Root>
  );
}

export type ScrollBarProps = ComponentProps<
  typeof ScrollAreaPrimitive.ScrollAreaScrollbar
>;

/** Custom scrollbar track and thumb rendered inside `ScrollArea`. */
function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: ScrollBarProps) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        'flex touch-none p-px transition-colors select-none',
        orientation === 'vertical' &&
          'h-full w-2.5 border-l border-l-transparent',
        orientation === 'horizontal' &&
          'h-2.5 flex-col border-t border-t-transparent',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-bg-quaternary"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };

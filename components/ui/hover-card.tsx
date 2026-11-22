'use client';

import type { ComponentProps } from 'react';
import { HoverCard as HoverCardPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export type HoverCardAnimation = 'card' | 'tooltip';

export interface HoverCardRootProps
  extends ComponentProps<typeof HoverCardPrimitive.Root> {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the card opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Milliseconds the pointer rests on the trigger before the card opens. */
  openDelay?: number;
  /** Milliseconds after the pointer leaves before the card closes. */
  closeDelay?: number;
}

/** Root container managing HoverCard open state and pointer hover delays. */
function HoverCardRoot({
  defaultOpen = false,
  openDelay = 120,
  closeDelay = 120,
  ...props
}: HoverCardRootProps) {
  return (
    <HoverCardPrimitive.Root
      data-slot="hover-card"
      defaultOpen={defaultOpen}
      openDelay={openDelay}
      closeDelay={closeDelay}
      {...props}
    />
  );
}

export type HoverCardTriggerProps = ComponentProps<typeof HoverCardPrimitive.Trigger>;

/** Interactive trigger that opens the hover card on pointer hover or keyboard focus. */
function HoverCardTrigger({ asChild = false, ...props }: HoverCardTriggerProps) {
  return (
    <HoverCardPrimitive.Trigger
      data-slot="hover-card-trigger"
      asChild={asChild}
      {...props}
    />
  );
}

const ANIMATION_CLASSES: Record<HoverCardAnimation, string> = {
  card: 'data-[state=open]:animate-in data-[state=open]:duration-180 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98] data-[state=closed]:animate-out data-[state=closed]:duration-130 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] data-[state=closed]:fill-mode-forwards data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 motion-reduce:data-[state=open]:zoom-in-100 motion-reduce:data-[state=closed]:zoom-out-100 motion-reduce:data-[state=open]:[--tw-enter-translate-x:0px] motion-reduce:data-[state=open]:[--tw-enter-translate-y:0px]',
  tooltip:
    'data-[state=open]:animate-in data-[state=open]:duration-150 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98] data-[state=closed]:animate-out data-[state=closed]:duration-100 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] data-[state=closed]:fill-mode-forwards motion-reduce:data-[state=open]:zoom-in-100 motion-reduce:data-[state=closed]:zoom-out-100',
};

export interface HoverCardContentProps
  extends ComponentProps<typeof HoverCardPrimitive.Content> {
  /** `card` fades, zooms, and slides in. `tooltip` only fades, at the tooltip's timing. */
  animation?: HoverCardAnimation;
}

/** Floating preview surface anchored to `HoverCard.Trigger`. 256px wide with no default padding. */
function HoverCardContent({
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
  alignOffset = 0,
  collisionPadding = 12,
  animation = 'card',
  className,
  ...props
}: HoverCardContentProps) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        data-animation={animation}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className={cn(
          'scrollbar-custom z-50 max-h-(--radix-hover-card-content-available-height) w-64 origin-(--radix-hover-card-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-bg-primary text-text-primary shadow-medium ease-out outline-none',
          ANIMATION_CLASSES[animation],
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}

export const HoverCard = Object.assign(HoverCardRoot, {
  Root: HoverCardRoot,
  Trigger: HoverCardTrigger,
  Content: HoverCardContent,
});

export { HoverCardContent, HoverCardRoot, HoverCardTrigger };

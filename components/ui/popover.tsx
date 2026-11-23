'use client';

import type { ComponentProps } from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PopoverRootProps
  extends ComponentProps<typeof PopoverPrimitive.Root> {
  /** Controlled open state. */
  open?: boolean;
  /** Callback when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Whether the popover should be modal. */
  modal?: boolean;
}

/** Root container managing Popover open state. */
function PopoverRoot({
  defaultOpen = false,
  modal = false,
  ...props
}: PopoverRootProps) {
  return (
    <PopoverPrimitive.Root
      data-slot="popover"
      defaultOpen={defaultOpen}
      modal={modal}
      {...props}
    />
  );
}

export type PopoverTriggerProps =
  | ({
      /** Renders a styled NarakUI button with a trailing chevron that tracks `aria-expanded`. */
      buttonWithChevron?: false;
    } & ComponentProps<typeof PopoverPrimitive.Trigger>)
  | ({
      /** Renders a styled NarakUI button with a trailing chevron that tracks `aria-expanded`. */
      buttonWithChevron: true;
    } & ButtonProps);

/** Element that toggles the popover when clicked. */
function PopoverTrigger(props: PopoverTriggerProps) {
  if (props.buttonWithChevron) {
    const {
      buttonWithChevron: _buttonWithChevron,
      size = 'small',
      mode,
      className,
      disabled,
      children,
      ...buttonProps
    } = props;

    return (
      <PopoverPrimitive.Trigger
        data-slot="popover-trigger"
        asChild
        disabled={disabled}
      >
        <Button
          {...buttonProps}
          mode={mode}
          size={size}
          disabled={disabled}
          iconEnd="chevron-down"
          allowScaleOnClick={false}
          className={cn(
            'group',
            mode === 'primary'
              ? 'aria-expanded:bg-fill-primary'
              : 'aria-expanded:bg-bg-tertiary',
            className,
          )}
        >
          {children}
        </Button>
      </PopoverPrimitive.Trigger>
    );
  }

  const { buttonWithChevron: _buttonWithChevron, ...triggerProps } = props;
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      {...triggerProps}
    />
  );
}

export interface PopoverContentProps
  extends ComponentProps<typeof PopoverPrimitive.Content> {
  /** Render the content through a Radix Portal. */
  withRadixPortal?: boolean;
}

/** Floating surface anchored to `Popover.Trigger` (256px wide with no horizontal padding). */
function PopoverContent({
  className,
  side = 'bottom',
  sideOffset = 10,
  align = 'end',
  alignOffset = -5,
  avoidCollisions = true,
  collisionPadding = 12,
  arrowPadding = 0,
  sticky = 'partial',
  hideWhenDetached = false,
  withRadixPortal = true,
  ...props
}: PopoverContentProps) {
  const contentClassName = cn(
    'z-50 max-h-[80vh] w-64 origin-(--radix-popover-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-bg-primary p-0 py-0.5 text-text-primary shadow-high ease-out outline-none',
    'data-[state=open]:animate-in data-[state=open]:duration-180 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98]',
    'data-[state=closed]:animate-out data-[state=closed]:duration-130 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] data-[state=closed]:fill-mode-forwards',
    'data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1',
    'motion-reduce:data-[state=open]:zoom-in-100 motion-reduce:data-[state=closed]:zoom-out-100 motion-reduce:data-[state=open]:[--tw-enter-translate-x:0px] motion-reduce:data-[state=open]:[--tw-enter-translate-y:0px]',
    className,
  );

  if (!withRadixPortal) {
    return (
      <PopoverPrimitive.Content
        data-slot="popover-content"
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        avoidCollisions={avoidCollisions}
        collisionPadding={collisionPadding}
        arrowPadding={arrowPadding}
        sticky={sticky}
        hideWhenDetached={hideWhenDetached}
        className={contentClassName}
        {...props}
      />
    );
  }

  return (
    <PopoverPrimitive.Portal data-slot="popover-portal">
      <PopoverPrimitive.Content
        data-slot="popover-content"
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        avoidCollisions={avoidCollisions}
        collisionPadding={collisionPadding}
        arrowPadding={arrowPadding}
        sticky={sticky}
        hideWhenDetached={hideWhenDetached}
        className={contentClassName}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

/** Optional element to anchor the popover against instead of `Popover.Trigger`. */
function PopoverAnchor(props: ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

/** Button that closes an open popover. */
function PopoverClose(props: ComponentProps<typeof PopoverPrimitive.Close>) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />;
}

/** Header stack for grouping a popover title and description. */
function PopoverHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="popover-header"
      className={cn('flex flex-col gap-1 text-body-small-regular', className)}
      {...props}
    />
  );
}

/** Heading slot inside a popover. */
function PopoverTitle({ className, ...props }: ComponentProps<'h2'>) {
  return (
    <h2
      data-slot="popover-title"
      className={cn('text-body-small-medium text-text-primary', className)}
      {...props}
    />
  );
}

/** Supporting description slot inside a popover. */
function PopoverDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="popover-description"
      className={cn('text-body-small-regular text-text-secondary', className)}
      {...props}
    />
  );
}

export const Popover = Object.assign(PopoverRoot, {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Anchor: PopoverAnchor,
  Close: PopoverClose,
  Header: PopoverHeader,
  Title: PopoverTitle,
  Description: PopoverDescription,
});

export {
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
};

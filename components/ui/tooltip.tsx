'use client';

import {
  isValidElement,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

const TOOLTIP_MOTION_CLASSES =
  'z-50 origin-(--radix-tooltip-content-transform-origin) ease-out data-[state=delayed-open]:animate-in data-[state=delayed-open]:duration-150 data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-[0.98] data-[state=closed]:animate-out data-[state=closed]:duration-100 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] data-[state=closed]:fill-mode-forwards data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 motion-reduce:data-[state=delayed-open]:zoom-in-100 motion-reduce:data-[state=closed]:zoom-out-100 motion-reduce:data-[state=delayed-open]:[--tw-enter-translate-x:0px] motion-reduce:data-[state=delayed-open]:[--tw-enter-translate-y:0px]';

export interface TooltipProviderProps
  extends ComponentProps<typeof TooltipPrimitive.Provider> {
  /** Milliseconds before a tooltip opens on hover. */
  delayDuration?: number;
  /** Milliseconds after a tooltip closes during which the next tooltip opens without a delay. */
  skipDelayDuration?: number;
}

/** Shares hover delay and skip-delay timing across descendant tooltips. */
function TooltipProvider({
  delayDuration = 300,
  skipDelayDuration = 500,
  ...props
}: TooltipProviderProps) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      {...props}
    />
  );
}

export interface TooltipLayoutWrapperProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface TooltipLayoutRowProps {
  children?: ReactNode;
  size?: 'regular' | 'big';
  type?: 'regular' | 'key-value' | 'key-date';
  className?: string;
  style?: CSSProperties;
}

export interface TooltipLayoutFooterProps {
  children?: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  style?: CSSProperties;
}

export interface TooltipLayoutItemColoredBoxProps {
  color: string;
  children?: ReactNode;
}

export interface TooltipLayoutDividerProps {
  className?: string;
  dashLength?: number;
  dashGap?: number;
  thickness?: number;
}

const TOOLTIP_ROW_BASE =
  'flex flex-row justify-between gap-6 [&_img]:size-4 [&_img]:rounded-xs [&_svg]:size-4 [&_svg]:rounded-xs';

const TOOLTIP_ROW_SIZE: Record<'regular' | 'big', string> = {
  regular: cn(TOOLTIP_ROW_BASE, 'text-body-small-regular'),
  big: cn(TOOLTIP_ROW_BASE, 'text-title-small-semibold'),
};

const TOOLTIP_ROW_TYPE: Record<'regular' | 'key-value' | 'key-date', string> = {
  regular: '',
  'key-value': '[&_span:last-child]:font-medium!',
  'key-date': 'gap-2 [&>*:last-child]:text-text-tooltip/50',
};

const TOOLTIP_FOOTER_BASE =
  'mt-3 flex gap-3 text-body-mini-regular text-text-tooltip/50';

const TOOLTIP_FOOTER_ORIENTATION: Record<'horizontal' | 'vertical', string> = {
  horizontal: cn(TOOLTIP_FOOTER_BASE, 'flex-row justify-between'),
  vertical: cn(TOOLTIP_FOOTER_BASE, 'flex-col'),
};

/** Structured layout primitives for rich and data-driven tooltips. */
const TooltipLayout = {
  Wrapper: ({ children, className, style }: TooltipLayoutWrapperProps) => (
    <div
      data-slot="tooltip-layout-wrapper"
      style={style}
      className={cn(
        'relative flex max-w-80 flex-col gap-3 rounded-md bg-bg-tooltip px-2 py-1.5 text-body-small-medium wrap-break-word text-text-tooltip shadow-medium backdrop-blur-xs',
        className,
      )}
    >
      {children}
    </div>
  ),
  Header: ({ children, className, style }: TooltipLayoutWrapperProps) => (
    <div
      data-slot="tooltip-layout-header"
      style={style}
      className={cn(
        'flex items-center justify-between gap-4 text-body-small-medium text-text-tooltip/70 [&_img]:size-4 [&_img]:rounded-xs [&_svg]:size-4 [&_svg]:rounded-xs',
        className,
      )}
    >
      {children}
    </div>
  ),
  Body: ({ children, className, style }: TooltipLayoutWrapperProps) => (
    <div
      data-slot="tooltip-layout-body"
      style={style}
      className={cn('flex max-h-60 flex-col gap-2 overflow-y-auto', className)}
    >
      {children}
    </div>
  ),
  Row: ({
    children,
    size = 'regular',
    type = 'regular',
    className,
    style,
  }: TooltipLayoutRowProps) => (
    <div
      data-slot="tooltip-layout-row"
      style={style}
      className={cn(TOOLTIP_ROW_SIZE[size], TOOLTIP_ROW_TYPE[type], className)}
    >
      {children}
    </div>
  ),
  Footer: ({
    children,
    orientation = 'horizontal',
    className,
    style,
  }: TooltipLayoutFooterProps) => (
    <div
      data-slot="tooltip-layout-footer"
      style={style}
      className={cn(TOOLTIP_FOOTER_ORIENTATION[orientation], className)}
    >
      {children}
    </div>
  ),
  RowAnimationDelay: (index: number): CSSProperties => ({
    animationDelay: `${0.02 * index + 0.03}s`,
  }),
  ItemColoredBox: ({ color, children }: TooltipLayoutItemColoredBoxProps) => (
    <div
      data-slot="tooltip-layout-colored-box"
      className="flex flex-row items-center gap-2"
    >
      <div
        aria-hidden="true"
        className="size-2 shrink-0 rounded-[2px]"
        style={{ backgroundColor: color }}
      />
      {children}
    </div>
  ),
  Divider: ({
    className,
    dashLength = 4,
    dashGap = 4,
    thickness = 1,
  }: TooltipLayoutDividerProps) => (
    <div
      data-slot="tooltip-layout-divider"
      className={cn('w-full text-bg-quaternary/30', className)}
      style={
        {
          height: thickness,
          backgroundImage:
            'repeating-linear-gradient(to right, currentColor 0 var(--dash-length), transparent var(--dash-length) calc(var(--dash-length) + var(--dash-gap)))',
          '--dash-length': `${dashLength}px`,
          '--dash-gap': `${dashGap}px`,
        } as CSSProperties
      }
    />
  ),
};

export interface TooltipDeclarativeProps {
  /** The content to display in the tooltip. */
  content: ReactNode;
  /** The element that triggers the tooltip. */
  children: ReactNode;
  /** Props for the Radix tooltip content. `className` applies to the tooltip surface. */
  contentProps?: ComponentProps<typeof TooltipPrimitive.Content>;
  /** Props for the Radix tooltip root, such as `open` and `onOpenChange`. */
  rootProps?: Omit<ComponentProps<typeof TooltipPrimitive.Root>, 'children'>;
  /** Preferred side of the trigger to render against. */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Whether the tooltip is disabled. */
  disabled?: boolean;
  /** Whether to show an arrow pointing to the trigger element. */
  showArrow?: boolean;
  /** Whether to show a dotted underline beneath the trigger text. */
  underline?: boolean;
  /** Makes the trigger keyboard-focusable and adds a focus outline, for plain-text triggers. */
  focusableTrigger?: boolean;
}

export type TooltipCompoundProps = ComponentProps<typeof TooltipPrimitive.Root> & {
  content?: undefined;
};

export type TooltipProps = TooltipDeclarativeProps | TooltipCompoundProps;

/**
 * Floating label triggered on hover or keyboard focus.
 * Supports both the declarative `content` prop API and compound `TooltipTrigger` / `TooltipContent` usage.
 */
function Tooltip(props: TooltipProps) {
  if ('content' in props && props.content !== undefined) {
    const {
      content,
      children,
      contentProps,
      rootProps,
      side = 'top',
      disabled = false,
      showArrow = false,
      underline = false,
      focusableTrigger = false,
    } = props;

    const { className: surfaceClassName, ...restContentProps } = contentProps ?? {};
    const controlledOpen = disabled ? false : rootProps?.open;

    let triggerChild: ReactNode = children;
    if (underline) {
      triggerChild = (
        <span
          tabIndex={focusableTrigger ? 0 : undefined}
          className={cn(
            'relative -mb-0.5 inline-block max-w-full min-w-0 cursor-help pb-0.5 transition-opacity duration-200 ease-out hover:opacity-75 after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-[calc(round(down,100%-2px,4px)+2px)] after:-translate-x-1/2 after:bg-[repeating-linear-gradient(to_right,var(--color-text-quaternary)_0_2px,transparent_2px_4px)] after:bg-size-[4px_1px]',
            focusableTrigger &&
              'rounded-xs outline-none focus-visible:ring-2 focus-visible:ring-ring',
          )}
        >
          {children}
        </span>
      );
    } else if (focusableTrigger || !isValidElement(children)) {
      triggerChild = (
        <span
          tabIndex={focusableTrigger ? 0 : undefined}
          className={cn(
            focusableTrigger &&
              'rounded-xs outline-none focus-visible:ring-2 focus-visible:ring-ring',
          )}
        >
          {children}
        </span>
      );
    }

    return (
      <TooltipPrimitive.Root
        data-slot="tooltip"
        {...rootProps}
        open={controlledOpen}
      >
        <TooltipPrimitive.Trigger data-slot="tooltip-trigger" asChild>
          {triggerChild}
        </TooltipPrimitive.Trigger>
        {!disabled ? (
          <TooltipPrimitive.Portal data-slot="tooltip-portal">
            <TooltipPrimitive.Content
              data-slot="tooltip-content"
              avoidCollisions
              collisionPadding={6}
              sideOffset={4}
              side={side}
              {...restContentProps}
              className={TOOLTIP_MOTION_CLASSES}
            >
              <TooltipLayout.Wrapper className={surfaceClassName}>
                {content}
              </TooltipLayout.Wrapper>
              {showArrow ? (
                <TooltipPrimitive.Arrow className="fill-bg-tooltip" />
              ) : null}
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        ) : null}
      </TooltipPrimitive.Root>
    );
  }

  const { content: _content, ...rootProps } = props;
  return <TooltipPrimitive.Root data-slot="tooltip" {...rootProps} />;
}

/** Compound trigger primitive for manual `Tooltip` composition. */
function TooltipTrigger(
  props: ComponentProps<typeof TooltipPrimitive.Trigger>,
) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

export interface TooltipContentProps
  extends ComponentProps<typeof TooltipPrimitive.Content> {
  /** Whether to show an arrow pointing to the trigger element. */
  showArrow?: boolean;
}

/** Compound content primitive for manual `Tooltip` composition. */
function TooltipContent({
  className,
  sideOffset = 4,
  collisionPadding = 6,
  showArrow = false,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal data-slot="tooltip-portal">
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          TOOLTIP_MOTION_CLASSES,
          'inline-flex w-fit max-w-80 items-center gap-1.5 rounded-md bg-bg-tooltip px-2 py-1.5 text-body-small-medium text-text-tooltip shadow-medium backdrop-blur-xs has-data-[slot=kbd]:pr-1.5 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-xs',
          className,
        )}
        {...props}
      >
        {children}
        {showArrow ? (
          <TooltipPrimitive.Arrow className="fill-bg-tooltip" />
        ) : null}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export {
  Tooltip,
  TooltipContent,
  TooltipLayout,
  TooltipProvider,
  TooltipTrigger,
};

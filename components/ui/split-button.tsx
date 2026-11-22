'use client';

import { createContext, useContext, type ReactNode } from 'react';
import {
  Button,
  type ButtonIconValue,
  type ButtonMode,
  type ButtonProps,
} from '@/components/ui/button';
import { Dropdown } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type SplitButtonSize = 'micro' | 'small' | 'regular' | 'large';

interface SplitButtonContextValue {
  mode: ButtonMode;
  size: SplitButtonSize;
  disabled: boolean;
}

const SplitButtonContext = createContext<SplitButtonContextValue>({
  mode: 'secondary',
  size: 'regular',
  disabled: false,
});

const TRIGGER_EXPANDED_CLASSES: Record<ButtonMode, string> = {
  primary: 'aria-expanded:bg-control-primary-hover',
  secondary: 'aria-expanded:bg-control-selected',
  tertiary: 'aria-expanded:bg-bg-quaternary',
  ghost: 'aria-expanded:bg-control-selected',
  subtle: 'aria-expanded:bg-bg-quaternary aria-expanded:text-text-primary',
  destructive: 'aria-expanded:bg-fill-red-hover',
  dashed: 'aria-expanded:bg-control-selected',
};

const MODES_WITH_SHADOW = new Set<ButtonMode>([
  'primary',
  'secondary',
  'destructive',
]);

const MODES_WITH_GHOST_TINT = new Set<ButtonMode>(['ghost', 'subtle']);

export interface SplitButtonRootProps {
  /** Button style shared by both halves. */
  mode?: ButtonMode;
  /** Button size shared by both halves. */
  size?: SplitButtonSize;
  /** Disables both halves. */
  disabled?: boolean;
  /** Whether the menu is open, when controlled. */
  open?: boolean;
  /** Whether the menu starts open, when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Whether the open menu blocks interaction with the rest of the page. Always true inside a dialog or drawer. */
  modal?: boolean;
  /** Additional classes for the wrapper around both halves. */
  className?: string;
  /** SplitButton.Action, SplitButton.Trigger, and Dropdown.Content. */
  children: ReactNode;
}

/** Joins a primary action button with a companion dropdown menu trigger. */
function SplitButtonRoot({
  mode = 'secondary',
  size = 'regular',
  disabled = false,
  open,
  defaultOpen,
  onOpenChange,
  modal = false,
  className,
  children,
}: SplitButtonRootProps) {
  const radiusClass =
    size === 'micro' || size === 'small' ? 'rounded-sm' : 'rounded-md';

  return (
    <SplitButtonContext.Provider value={{ mode, size, disabled }}>
      <Dropdown.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        modal={modal}
      >
        <div
          data-slot="split-button"
          data-mode={mode}
          data-size={size}
          className={cn(
            'inline-flex items-stretch',
            radiusClass,
            MODES_WITH_SHADOW.has(mode) && 'shadow-low',
            MODES_WITH_GHOST_TINT.has(mode) &&
              'hover:[&:has(>:hover:not(:disabled,[aria-disabled=true]))>:is(button,a):not(:hover,:disabled,[aria-disabled=true],[aria-expanded=true])]:bg-control-hover/50',
            className,
          )}
        >
          {children}
        </div>
      </Dropdown.Root>
    </SplitButtonContext.Provider>
  );
}

export type SplitButtonActionProps = Omit<ButtonProps, 'size'> & {
  /** Overrides the root's size for this half. */
  size?: SplitButtonSize;
};

/** Leading primary action half of a `SplitButton`. Supports `href` to render as a link. */
function SplitButtonAction({
  mode,
  size,
  disabled,
  allowScaleOnClick = false,
  className,
  ...props
}: SplitButtonActionProps) {
  const context = useContext(SplitButtonContext);
  const resolvedMode = mode ?? context.mode;
  const resolvedSize = size ?? context.size;
  const resolvedDisabled = disabled ?? context.disabled;

  return (
    <Button
      data-slot="split-button-action"
      mode={resolvedMode}
      size={resolvedSize}
      disabled={resolvedDisabled}
      allowScaleOnClick={allowScaleOnClick}
      className={cn('rounded-r-none shadow-none! focus-visible:z-10', className)}
      {...props}
    />
  );
}

export interface SplitButtonTriggerProps
  extends Omit<ButtonProps, 'aria-label' | 'children' | 'size'> {
  /** Accessible name of the icon-only menu trigger, such as `"More ways to create"`. */
  'aria-label': string;
  /** Icon of the trigger. */
  iconStart?: ButtonIconValue;
  /** Overrides the root's size for this half. */
  size?: SplitButtonSize;
}

/** Trailing icon-only menu trigger half of a `SplitButton`. */
function SplitButtonTrigger({
  iconStart = 'chevron-down',
  mode,
  size,
  disabled,
  allowScaleOnClick = false,
  className,
  ...props
}: SplitButtonTriggerProps) {
  const context = useContext(SplitButtonContext);
  const resolvedMode = mode ?? context.mode;
  const resolvedSize = size ?? context.size;
  const resolvedDisabled = disabled ?? context.disabled;
  const showDivider = !MODES_WITH_GHOST_TINT.has(resolvedMode);

  return (
    <Dropdown.Trigger asChild>
      <Button
        data-slot="split-button-trigger"
        mode={resolvedMode}
        size={resolvedSize}
        iconStart={iconStart}
        disabled={resolvedDisabled}
        allowScaleOnClick={allowScaleOnClick}
        className={cn(
          'rounded-l-none shadow-none! focus-visible:z-10 [&_svg]:transition-transform [&_svg]:duration-150 [&_svg]:ease-out aria-expanded:[&_svg]:rotate-180 motion-reduce:[&_svg]:transition-none',
          TRIGGER_EXPANDED_CLASSES[resolvedMode],
          showDivider &&
            'before:pointer-events-none before:absolute before:inset-y-0 before:start-0 before:w-px before:bg-current/20',
          className,
        )}
        {...props}
      />
    </Dropdown.Trigger>
  );
}

const SplitButton = Object.assign(SplitButtonRoot, {
  Root: SplitButtonRoot,
  Action: SplitButtonAction,
  Trigger: SplitButtonTrigger,
});

export {
  SplitButton,
  SplitButtonRoot,
  SplitButtonAction,
  SplitButtonTrigger,
};

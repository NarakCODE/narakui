'use client';

import type { ComponentProps, CSSProperties, MouseEvent, ReactNode } from 'react';
import { Check, Minus } from 'lucide-react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export type CheckedState = boolean | 'indeterminate';

/** Returns shared visual box classes for both interactive Checkbox and static CheckboxIndicator. */
function getCheckboxBoxClasses({
  color,
  disabled,
}: {
  color?: string;
  disabled: boolean;
}) {
  return cn(
    'inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none',
    disabled
      ? 'border-border-gray bg-bg-tertiary text-text-quaternary data-[state=checked]:border-border-gray data-[state=checked]:bg-bg-quaternary data-[state=checked]:text-text-tertiary data-[state=indeterminate]:border-border-gray data-[state=indeterminate]:bg-bg-quaternary data-[state=indeterminate]:text-text-tertiary'
      : color
        ? 'border-fill-tertiary bg-control-bg data-[state=checked]:border-(--checkbox-color) data-[state=checked]:bg-(--checkbox-color) data-[state=checked]:text-text-white data-[state=indeterminate]:border-(--checkbox-color) data-[state=indeterminate]:bg-(--checkbox-color) data-[state=indeterminate]:text-text-white'
        : 'border-fill-tertiary bg-control-bg data-[state=checked]:border-control-primary data-[state=checked]:bg-control-primary data-[state=checked]:text-text-inverse data-[state=indeterminate]:border-control-primary data-[state=indeterminate]:bg-control-primary data-[state=indeterminate]:text-text-inverse',
  );
}

/** Renders the active check or indeterminate minus icon inside the indicator box. */
function renderIndicatorGlyph({
  selectedIcon,
  indeterminateIcon,
}: {
  selectedIcon?: ReactNode;
  indeterminateIcon?: ReactNode;
}) {
  return (
    <>
      <span className="hidden items-center justify-center group-data-[state=checked]/box:inline-flex [&>svg]:animate-in [&>svg]:fade-in-0 [&>svg]:zoom-in-50 [&>svg]:duration-150 [&>svg]:ease-out [&>svg]:motion-reduce:zoom-in-100">
        {selectedIcon ?? (
          <Check
            aria-hidden="true"
            className="size-3 stroke-[2.5] animate-in fade-in-0 zoom-in-50 duration-150 ease-out motion-reduce:zoom-in-100"
          />
        )}
      </span>
      <span className="hidden items-center justify-center group-data-[state=indeterminate]/box:inline-flex [&>svg]:animate-in [&>svg]:fade-in-0 [&>svg]:zoom-in-50 [&>svg]:duration-150 [&>svg]:ease-out [&>svg]:motion-reduce:zoom-in-100">
        {indeterminateIcon ?? (
          <Minus
            aria-hidden="true"
            className="size-3 stroke-[2.5] animate-in fade-in-0 zoom-in-50 duration-150 ease-out motion-reduce:zoom-in-100"
          />
        )}
      </span>
    </>
  );
}

export interface CheckboxIndicatorProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** Shows the check mark. */
  checked?: boolean;
  /** Shows the minus mark. Wins over `checked`. */
  indeterminate?: boolean;
  /** Applies the same disabled treatment as Checkbox. */
  disabled?: boolean;
  /** Custom icon for the selected state. */
  selectedIcon?: ReactNode;
  /** Custom icon for the indeterminate state. */
  indeterminateIcon?: ReactNode;
  /** Custom CSS color when checked or indeterminate. */
  color?: string;
}

/** Visual-only checkbox box for embedding inside buttons, tree rows, or custom interactive controls. */
function CheckboxIndicator({
  checked = false,
  indeterminate = false,
  disabled = false,
  selectedIcon,
  indeterminateIcon,
  color,
  className,
  style,
  ...props
}: CheckboxIndicatorProps) {
  const state = indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked';

  return (
    <span
      data-slot="checkbox-indicator"
      aria-hidden="true"
      data-state={state}
      data-disabled={disabled ? '' : undefined}
      style={color ? ({ '--checkbox-color': color, ...style } as CSSProperties) : style}
      className={cn('group/box', getCheckboxBoxClasses({ color, disabled }), className)}
      {...props}
    >
      {state !== 'unchecked'
        ? renderIndicatorGlyph({ selectedIcon, indeterminateIcon })
        : null}
    </span>
  );
}

export interface CheckboxProps
  extends Omit<
    ComponentProps<typeof CheckboxPrimitive.Root>,
    'checked' | 'defaultChecked' | 'onCheckedChange' | 'children'
  > {
  /** Additional CSS classes to apply to the label wrapper. */
  className?: string;
  /** The content to be displayed as the checkbox label. */
  children?: ReactNode;
  /** Custom color for the checkbox when checked (CSS color value). */
  color?: string;
  /** Custom class name for the children wrapper element. */
  childrenWrapperClassName?: string;
  /** Custom class name for the checkbox control. */
  checkboxClassName?: string;
  /** Removes all hover feedback. */
  disableHover?: boolean;
  /** Removes container padding; hover then darkens the empty box border instead of filling a background. */
  disablePadding?: boolean;
  /** Prevent interaction with the checkbox while preserving appearance. */
  readOnly?: boolean;
  /** Shows the minus and reports a mixed state, whatever `checked` is. Clicking calls `onCheckedChange(true)`. */
  indeterminate?: boolean;
  /** Custom icon for the indeterminate state. */
  indeterminateIcon?: ReactNode;
  /** Custom icon for the selected state. */
  selectedIcon?: ReactNode;
  /** Set checkbox to a disabled, unclickable state. */
  disabled?: boolean;
  /** The controlled checked state of the checkbox. */
  checked?: CheckedState;
  /** The default checked state when used as an uncontrolled component. */
  defaultChecked?: CheckedState;
  /** Event handler called when the checked state changes. */
  onCheckedChange?: (checked: CheckedState) => void;
}

/** Accessible checkbox control with built-in label row, indeterminate support, and custom check colors. */
function Checkbox({
  className,
  children,
  color,
  childrenWrapperClassName,
  checkboxClassName,
  disableHover = false,
  disablePadding = false,
  readOnly = false,
  indeterminate = false,
  indeterminateIcon,
  selectedIcon,
  disabled = false,
  checked,
  defaultChecked,
  onCheckedChange,
  onClick,
  value = 'on',
  ...props
}: CheckboxProps) {
  const effectiveChecked: CheckedState | undefined = indeterminate ? 'indeterminate' : checked;
  const isInteractive = !disabled && !readOnly;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (readOnly) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const handleCheckedChange = (next: CheckedState) => {
    if (readOnly) return;
    onCheckedChange?.(next);
  };

  return (
    <label
      data-slot="checkbox-wrapper"
      data-disabled={disabled ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
      className={cn(
        'group/checkbox inline-flex w-fit items-start gap-2 text-body-small-regular text-text-primary select-none transition-colors duration-150 ease-out motion-reduce:transition-none',
        disablePadding ? 'p-0' : 'rounded-md px-2 py-1.5',
        !disablePadding && isInteractive && !disableHover && 'hover:bg-control-hover',
        disabled ? 'cursor-not-allowed' : readOnly ? 'cursor-default' : 'cursor-pointer',
        className,
      )}
    >
      <CheckboxPrimitive.Root
        data-slot="checkbox"
        checked={effectiveChecked}
        defaultChecked={indeterminate ? undefined : defaultChecked}
        disabled={disabled}
        aria-readonly={readOnly || undefined}
        value={value}
        onClick={handleClick}
        onCheckedChange={handleCheckedChange}
        style={color ? ({ '--checkbox-color': color } as CSSProperties) : undefined}
        className={cn(
          'group/box mt-px outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-bg-base',
          getCheckboxBoxClasses({ color, disabled }),
          disablePadding &&
            isInteractive &&
            !disableHover &&
            'group-hover/checkbox:data-[state=unchecked]:border-fill-secondary',
          disabled ? 'cursor-not-allowed' : readOnly ? 'cursor-default' : 'cursor-pointer',
          checkboxClassName,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="inline-flex items-center justify-center text-current"
        >
          {renderIndicatorGlyph({ selectedIcon, indeterminateIcon })}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {children !== undefined && children !== null && children !== false ? (
        <span
          data-slot="checkbox-label"
          className={cn(
            'min-w-0 flex-1',
            disabled && 'text-text-tertiary',
            childrenWrapperClassName,
          )}
        >
          {children}
        </span>
      ) : null}
    </label>
  );
}

export { Checkbox, CheckboxIndicator };

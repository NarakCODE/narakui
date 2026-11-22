'use client';

import { useId, type ComponentProps } from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export type SwitchSize = 'default' | 'sm' | 'lg';
export type SwitchColor = 'default' | 'green';

export interface SwitchProps
  extends Omit<ComponentProps<typeof SwitchPrimitive.Root>, 'color'> {
  /** Label text displayed next to the switch. */
  title?: string;
  /** Removes the raised control surface shadow and hover background for menus and lists. */
  slim?: boolean;
  /** Track and thumb size scale. */
  size?: SwitchSize;
  /** Fill color of the checked track. */
  color?: SwitchColor;
  /** Disables the switch, shows a spinner inside the thumb, and sets `aria-busy`. */
  isLoading?: boolean;
  /** Additional CSS classes applied to the label text. */
  labelClassName?: string;
  /** Additional CSS classes applied to both the outer label and switch track. */
  className?: string;
}

const TRACK_SIZE_CLASSES: Record<SwitchSize, string> = {
  sm: 'h-3.5 w-5.5 items-center p-0 px-0.5 [&:not(:disabled):active_[data-slot="switch-thumb"]]:scale-x-[1.15]',
  default: 'h-4 w-6 items-center p-0.5 [&:not(:disabled):active_[data-slot="switch-thumb"]]:scale-x-[1.15]',
  lg: 'h-5 w-8 items-center p-[3px] [&:not(:disabled):active_[data-slot="switch-thumb"]]:scale-x-[1.15]',
};

const THUMB_SIZE_CLASSES: Record<SwitchSize, string> = {
  sm: 'size-2.5 data-[state=checked]:translate-x-[calc(1.125rem-100%)] data-[state=unchecked]:translate-x-0',
  default:
    'h-3 w-3 data-[state=checked]:translate-x-[calc(1.25rem-100%)] data-[state=unchecked]:translate-x-0',
  lg: 'size-3.5 data-[state=checked]:translate-x-[calc(1.625rem-100%)] data-[state=unchecked]:translate-x-0',
};

/** Toggle switch with raised control surface, slim mode, sizes, green fill, and loading spinner state. */
function Switch({
  title,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  required,
  name,
  value = 'on',
  slim = false,
  size = 'default',
  color = 'default',
  isLoading = false,
  labelClassName,
  className,
  id,
  ...props
}: SwitchProps) {
  const generatedId = useId();
  const resolvedId = id ?? generatedId;
  const isDisabled = disabled || isLoading;

  const trackControl = (
    <SwitchPrimitive.Root
      id={resolvedId}
      title={title}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      disabled={isDisabled}
      required={required}
      name={name}
      value={value}
      aria-busy={isLoading || undefined}
      data-slot="switch-root"
      data-size={size}
      data-color={color}
      className={cn(
        'group relative flex shrink-0 cursor-pointer rounded-full border-none outline-none transition-colors duration-150 ease-out focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-fill-quaternary not-disabled:data-[state=unchecked]:hover:bg-fill-tertiary motion-reduce:transition-none',
        color === 'green'
          ? 'data-[state=checked]:bg-fill-green'
          : 'data-[state=checked]:bg-fill-primary',
        TRACK_SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none flex items-center justify-center rounded-full bg-bg-primary transition-transform duration-160 ease-out data-[state=checked]:origin-right data-[state=unchecked]:origin-left motion-reduce:transition-none',
          THUMB_SIZE_CLASSES[size],
        )}
      >
        {isLoading ? (
          <span
            aria-hidden="true"
            className="flex size-full items-center justify-center p-[1px] text-text-secondary"
          >
            <Spinner className="size-full motion-safe:animate-[spin_0.4s_linear_infinite] motion-reduce:animate-pulse" />
          </span>
        ) : null}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );

  if (!title) {
    return trackControl;
  }

  return (
    <label
      htmlFor={resolvedId}
      data-slot="switch-wrapper"
      data-disabled={isDisabled ? '' : undefined}
      className={cn(
        'flex select-none items-center rounded-sm pl-2 transition-colors duration-150 ease-out motion-reduce:transition-none',
        isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
        !slim &&
          'shadow-low has-[[data-slot="switch-root"]:focus-visible]:shadow-low-focus',
        !slim && !isDisabled && 'hover:bg-control-hover',
        className,
      )}
    >
      {trackControl}
      <span
        title={title}
        className={cn(
          'min-w-0 flex-1 select-none truncate px-2 py-1 text-body-small-medium',
          slim && 'pr-0',
          isDisabled
            ? 'cursor-not-allowed text-text-tertiary opacity-50'
            : 'cursor-pointer text-text-primary',
          labelClassName,
        )}
      >
        {title}
      </span>
    </label>
  );
}

export { Switch };

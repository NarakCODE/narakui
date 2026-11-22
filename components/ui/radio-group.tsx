'use client';

import {
  createContext,
  useContext,
  useId,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

interface RadioGroupContextValue {
  disabled: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue>({
  disabled: false,
});

export type RadioGroupProps = ComponentProps<typeof RadioGroupPrimitive.Root>;

/** Group container managing mutually exclusive selection across `RadioGroupItem` children. */
function RadioGroup({
  className,
  orientation = 'vertical',
  disabled = false,
  ...props
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ disabled }}>
      <RadioGroupPrimitive.Root
        data-slot="radio-group"
        orientation={orientation}
        disabled={disabled}
        className={cn(
          'grid gap-2',
          orientation === 'horizontal'
            ? 'auto-cols-max grid-flow-col'
            : 'grid-flow-row',
          className,
        )}
        {...props}
      />
    </RadioGroupContext.Provider>
  );
}

export interface RadioGroupItemProps
  extends ComponentProps<typeof RadioGroupPrimitive.Item> {
  /** Label rendered next to the radio control. */
  children?: ReactNode;
  /** Prevents interaction while keeping the current visual appearance. */
  readOnly?: boolean;
  /** Replaces the default dot shown in the selected state. */
  selectedIcon?: ReactNode;
  /** Removes all hover feedback. */
  disableHover?: boolean;
  /** Removes row padding; hover then darkens the empty radio border instead of filling a background. */
  disablePadding?: boolean;
  /** Additional classes for the row wrapper (or standalone radio when no children). */
  className?: string;
  /** Additional classes for the radio circle control. */
  radioClassName?: string;
  /** Additional classes for the element wrapping the label children. */
  childrenWrapperClassName?: string;
}

/** Individual radio option supporting labeled rows, read-only display, custom indicators, and padding-free hover. */
function RadioGroupItem({
  className,
  radioClassName,
  childrenWrapperClassName,
  children,
  disabled = false,
  readOnly = false,
  selectedIcon,
  disableHover = false,
  disablePadding = false,
  id,
  tabIndex,
  ...props
}: RadioGroupItemProps) {
  const group = useContext(RadioGroupContext);
  const generatedId = useId();
  const resolvedId = id ?? generatedId;
  const isDisabled = disabled || group.disabled;
  const hasChildren =
    children !== undefined && children !== null && children !== false && children !== '';

  const radioControl = (
    <RadioGroupPrimitive.Item
      id={resolvedId}
      data-slot="radio-group-item"
      disabled={isDisabled}
      aria-readonly={readOnly || undefined}
      tabIndex={readOnly ? -1 : tabIndex}
      className={cn(
        'flex min-h-[13px] min-w-[13px] size-[13px] shrink-0 appearance-none items-center justify-center rounded-full border-[1.5px] border-fill-tertiary bg-control-bg outline-none transition-[background-color,border-color] duration-150 ease-out data-[state=checked]:border-fill-primary data-[state=checked]:bg-fill-primary motion-reduce:transition-none',
        hasChildren ? 'pointer-events-none' : 'cursor-pointer focus-visible:shadow-focus',
        !hasChildren && isDisabled && 'cursor-not-allowed',
        hasChildren && 'group-[.items-start]/radio:mt-[3px]',
        disablePadding &&
          !isDisabled &&
          !readOnly &&
          !disableHover &&
          'group-hover/radio:data-[state=unchecked]:border-fill-secondary',
        isDisabled && 'opacity-20',
        readOnly && 'pointer-events-none',
        !hasChildren && className,
        radioClassName,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center text-fill-inverse [&>*]:animate-in [&>*]:fade-in-0 [&>*]:zoom-in-50 [&>*]:duration-150 [&>*]:ease-out [&>*]:motion-reduce:zoom-in-100"
      >
        {selectedIcon ?? (
          <span className="size-1.5 rounded-full bg-fill-inverse animate-in fade-in-0 zoom-in-50 duration-150 ease-out motion-reduce:zoom-in-100" />
        )}
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );

  if (!hasChildren) {
    return radioControl;
  }

  return (
    <label
      htmlFor={readOnly ? undefined : resolvedId}
      data-slot="radio-group-row"
      data-disabled={isDisabled ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
      className={cn(
        'group/radio flex h-6 w-max select-none items-center gap-2 rounded-sm text-body-small-medium text-text-primary transition-colors duration-150 ease-out motion-reduce:transition-none',
        !disablePadding && 'px-1.5',
        isDisabled
          ? 'cursor-not-allowed font-medium text-text-quaternary'
          : 'cursor-pointer',
        !isDisabled &&
          !readOnly &&
          !disableHover &&
          !disablePadding &&
          'hover:bg-control-hover',
        readOnly
          ? 'pointer-events-none'
          : 'has-[[data-state]:focus-visible]:shadow-focus',
        className,
      )}
    >
      {radioControl}
      <div
        className={cn(
          'flex grow items-center gap-2 overflow-hidden',
          childrenWrapperClassName,
        )}
      >
        {children}
      </div>
    </label>
  );
}

export { RadioGroup, RadioGroupItem };

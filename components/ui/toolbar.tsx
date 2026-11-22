'use client';

import {
  cloneElement,
  isValidElement,
  type ComponentProps,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type Ref,
} from 'react';
import { Toolbar as ToolbarPrimitive } from 'radix-ui';
import type { InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && typeof ref === 'object') {
        (ref as { current: T | null }).current = node;
      }
    }
  };
}

export type ToolbarRootProps = ComponentProps<typeof ToolbarPrimitive.Root>;

/** Row of related controls reachable as one Tab stop and navigable with arrow keys. */
function ToolbarRoot({
  className,
  orientation = 'horizontal',
  loop = true,
  ...props
}: ToolbarRootProps) {
  return (
    <ToolbarPrimitive.Root
      data-slot="toolbar"
      orientation={orientation}
      loop={loop}
      className={cn('flex items-center gap-0.5', className)}
      {...props}
    />
  );
}

export interface ToolbarItemProps
  extends Omit<ComponentProps<typeof ToolbarPrimitive.Button>, 'asChild'> {
  /** A single button-like element, usually a Button. Receives the toolbar's roving focus handling. */
  children: ReactElement;
  /** Disables the child and removes it from the arrow-key sequence. */
  disabled?: boolean;
}

/** Wraps an interactive toolbar control so arrow keys move focus through it. */
function ToolbarItem({
  children,
  disabled = false,
  ...props
}: ToolbarItemProps) {
  return (
    <ToolbarPrimitive.Button
      asChild
      disabled={disabled}
      data-slot="toolbar-item"
      {...props}
    >
      {children}
    </ToolbarPrimitive.Button>
  );
}

interface ToolbarFieldAdapterProps {
  children: ReactElement<InputProps>;
  ref?: Ref<HTMLInputElement>;
  tabIndex?: number;
  disabled?: boolean;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onMouseDown?: (event: MouseEvent<HTMLInputElement>) => void;
  'data-orientation'?: string;
  'data-radix-collection-item'?: string;
}

/**
 * Bridges Radix RovingFocusGroup onto an `<Input>` while allowing ArrowLeft,
 * ArrowRight, Home, and End to move the text caret before leaving the field.
 */
function ToolbarFieldAdapter({
  children,
  ref,
  tabIndex,
  disabled,
  onKeyDown: radixOnKeyDown,
  onFocus: radixOnFocus,
  onMouseDown: radixOnMouseDown,
  ...rovingAttrs
}: ToolbarFieldAdapterProps) {
  if (!isValidElement<InputProps>(children)) {
    return null;
  }

  const childProps = children.props;
  const childRef = (children as unknown as { ref?: Ref<HTMLInputElement> }).ref;

  return cloneElement(children, {
    ...rovingAttrs,
    ...childProps,
    ref: mergeRefs(ref, childRef),
    tabIndex: childProps.tabIndex ?? tabIndex,
    disabled: disabled || childProps.disabled,
    onFocus: (event: FocusEvent<HTMLInputElement>) => {
      childProps.onFocus?.(event);
      radixOnFocus?.(event);
    },
    onMouseDown: (event: MouseEvent<HTMLInputElement>) => {
      childProps.onMouseDown?.(event);
      radixOnMouseDown?.(event);
    },
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      childProps.onKeyDown?.(event);
      if (event.defaultPrevented) return;

      const input = event.currentTarget;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const isCollapsed = start !== null && end !== null && start === end;

      if (event.key === 'Home' || event.key === 'End') {
        return;
      }

      if (event.key === 'ArrowLeft') {
        if (!isCollapsed || start !== 0) return;
      }

      if (event.key === 'ArrowRight') {
        if (!isCollapsed || end !== input.value.length) return;
      }

      radixOnKeyDown?.(event);
    },
  } as InputProps);
}

export interface ToolbarFieldProps {
  /** A single `Input`. Its own focus, blur and key handlers still run. */
  children: ReactElement<InputProps>;
  /** Removes the field from the arrow-key sequence. */
  disabled?: boolean;
}

/** Adds an `Input` to the toolbar's arrow-key sequence with caret-aware boundary exit. */
function ToolbarField({ children, disabled = false }: ToolbarFieldProps) {
  return (
    <ToolbarPrimitive.Button asChild disabled={disabled} data-slot="toolbar-field">
      <ToolbarFieldAdapter disabled={disabled}>{children}</ToolbarFieldAdapter>
    </ToolbarPrimitive.Button>
  );
}

export type ToolbarSeparatorProps = ComponentProps<
  typeof ToolbarPrimitive.Separator
>;

/** Vertical divider separating groups of controls inside `Toolbar.Root`. */
function ToolbarSeparator({ className, ...props }: ToolbarSeparatorProps) {
  return (
    <ToolbarPrimitive.Separator
      data-slot="toolbar-separator"
      className={cn('mx-1 h-4 w-px shrink-0 bg-fill-quaternary', className)}
      {...props}
    />
  );
}

const Toolbar = Object.assign(ToolbarRoot, {
  Root: ToolbarRoot,
  Item: ToolbarItem,
  Field: ToolbarField,
  Separator: ToolbarSeparator,
});

export {
  Toolbar,
  ToolbarRoot,
  ToolbarItem,
  ToolbarField,
  ToolbarSeparator,
};

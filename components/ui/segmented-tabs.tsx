'use client';

import {
  createContext,
  useContext,
  type ComponentProps,
  type ReactNode,
} from 'react';
import Link, { type LinkProps } from 'next/link';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

const SEGMENTED_PILL_CLASSES =
  'inline-flex h-7 cursor-pointer items-center justify-center rounded-md px-2 text-body-small-medium text-text-tertiary whitespace-nowrap select-none outline-none transition-[background-color,color,transform] duration-150 ease-out motion-reduce:transition-none hover:text-text-secondary active:not-disabled:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0';

export type SegmentedTabsRootProps = ComponentProps<typeof TabsPrimitive.Root>;

/** Pill-styled tabs root built on Radix Tabs primitives. */
function SegmentedTabsRoot({ className, ...props }: SegmentedTabsRootProps) {
  return (
    <TabsPrimitive.Root
      data-slot="segmented-tabs"
      className={cn(className)}
      {...props}
    />
  );
}

export type SegmentedTabsListProps = ComponentProps<typeof TabsPrimitive.List>;

/** Row of pill-styled segmented tab triggers. */
function SegmentedTabsList({ className, ...props }: SegmentedTabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="segmented-tabs-list"
      className={cn('inline-flex items-center gap-1.5', className)}
      {...props}
    />
  );
}

export type SegmentedTabsTriggerProps = ComponentProps<
  typeof TabsPrimitive.Trigger
>;

/** Individual pill tab trigger filling with a control surface when active. */
function SegmentedTabsTrigger({
  className,
  ...props
}: SegmentedTabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="segmented-tabs-trigger"
      className={cn(
        SEGMENTED_PILL_CLASSES,
        'data-[state=active]:bg-control-selected data-[state=active]:text-text-primary',
        className,
      )}
      {...props}
    />
  );
}

export type SegmentedTabsContentProps = ComponentProps<
  typeof TabsPrimitive.Content
>;

/** Content panel associated with a matching `SegmentedTabs.Trigger`. */
function SegmentedTabsContent({
  className,
  ...props
}: SegmentedTabsContentProps) {
  return (
    <TabsPrimitive.Content
      data-slot="segmented-tabs-content"
      className={cn(
        'outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      {...props}
    />
  );
}

const SegmentedTabs = Object.assign(SegmentedTabsRoot, {
  Root: SegmentedTabsRoot,
  List: SegmentedTabsList,
  Trigger: SegmentedTabsTrigger,
  Content: SegmentedTabsContent,
});

interface SegmentedToggleGroupContextValue {
  value: string;
  onValueChange?: (value: string) => void;
}

const SegmentedToggleGroupContext =
  createContext<SegmentedToggleGroupContextValue | null>(null);

export interface SegmentedToggleGroupRootProps extends ComponentProps<'div'> {
  /** Value of the selected item. */
  value: string;
  /** Called with the item value when the user selects a different button item. */
  onValueChange?: (value: string) => void;
  /** Accessible name for the group. */
  'aria-label'?: string;
}

/** Pill-styled view switcher rendering a `role="group"` of toggle buttons or links. */
function SegmentedToggleGroupRoot({
  value,
  onValueChange,
  className,
  children,
  ...props
}: SegmentedToggleGroupRootProps) {
  return (
    <SegmentedToggleGroupContext.Provider value={{ value, onValueChange }}>
      <div
        role="group"
        data-slot="segmented-toggle-group"
        className={cn('inline-flex items-center gap-1.5', className)}
        {...props}
      >
        {children}
      </div>
    </SegmentedToggleGroupContext.Provider>
  );
}

export interface SegmentedToggleGroupItemProps
  extends Omit<ComponentProps<'button'>, 'value' | 'children'> {
  /** Value that selects this item. */
  value: string;
  /** Item label. */
  children: ReactNode;
  /** Renders the item as a link to this URL. */
  href?: string;
  /** Route prefetch for link items, passed to Next.js Link. */
  prefetch?: LinkProps['prefetch'];
}

/** Toggle button or navigation link inside `SegmentedToggleGroup.Root`. */
function SegmentedToggleGroupItem({
  value,
  children,
  href,
  prefetch,
  className,
  onClick,
  disabled,
  ...props
}: SegmentedToggleGroupItemProps) {
  const context = useContext(SegmentedToggleGroupContext);
  const isSelected = context?.value === value;

  const classes = cn(
    SEGMENTED_PILL_CLASSES,
    'aria-pressed:bg-control-selected aria-pressed:text-text-primary data-[active=true]:bg-control-selected data-[active=true]:text-text-primary',
    className,
  );

  if (href !== undefined) {
    return (
      <Link
        href={href}
        prefetch={prefetch}
        data-slot="segmented-toggle-group-item"
        data-active={isSelected ? 'true' : undefined}
        aria-current={isSelected ? 'page' : undefined}
        className={cn(classes, 'no-underline')}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      data-slot="segmented-toggle-group-item"
      data-active={isSelected ? 'true' : undefined}
      aria-pressed={isSelected}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !isSelected) {
          context?.onValueChange?.(value);
        }
      }}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}

const SegmentedToggleGroup = Object.assign(SegmentedToggleGroupRoot, {
  Root: SegmentedToggleGroupRoot,
  Item: SegmentedToggleGroupItem,
});

export {
  SegmentedTabs,
  SegmentedTabsRoot,
  SegmentedTabsList,
  SegmentedTabsTrigger,
  SegmentedTabsContent,
  SegmentedToggleGroup,
  SegmentedToggleGroupRoot,
  SegmentedToggleGroupItem,
};

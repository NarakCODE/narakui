'use client';

import type { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export type TabsRootProps = ComponentProps<typeof TabsPrimitive.Root>;

/** Layered sections of content switched between using tab controls. */
function TabsRoot({
  className,
  orientation = 'horizontal',
  ...props
}: TabsRootProps) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        'group/tabs flex flex-col data-[orientation=vertical]:flex-row data-[orientation=vertical]:gap-4',
        className,
      )}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  'group/tabs-list flex items-center group-data-[orientation=vertical]/tabs:flex-col group-data-[orientation=vertical]/tabs:items-stretch',
  {
    variants: {
      variant: {
        line: 'gap-4 group-data-[orientation=vertical]/tabs:gap-1',
        default:
          'inline-flex w-fit rounded-lg bg-bg-tertiary p-1 text-text-secondary dark:bg-bg-secondary',
      },
    },
    defaultVariants: {
      variant: 'line',
    },
  },
);

export interface TabsListProps
  extends ComponentProps<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

/** Horizontal or vertical list of tab triggers. */
function TabsList({
  className,
  variant = 'line',
  loop = true,
  ...props
}: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      loop={loop}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

export type TabsTriggerProps = ComponentProps<typeof TabsPrimitive.Trigger>;

/** Interactive tab trigger with an active underline indicator. */
function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'relative inline-flex h-12 cursor-pointer items-center justify-center whitespace-nowrap text-body-small-medium text-text-secondary select-none outline-none transition-[color,transform] duration-150 ease-out motion-reduce:transition-none not-disabled:hover:text-text-primary active:not-disabled:scale-[0.97] focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=active]:text-text-primary [&_svg]:pointer-events-none [&_svg]:shrink-0',
        'group-data-[variant=line]/tabs-list:before:pointer-events-none group-data-[variant=line]/tabs-list:before:absolute group-data-[variant=line]/tabs-list:before:-bottom-px group-data-[variant=line]/tabs-list:before:left-0 group-data-[variant=line]/tabs-list:before:h-0.5 group-data-[variant=line]/tabs-list:before:w-full group-data-[variant=line]/tabs-list:before:bg-transparent group-data-[variant=line]/tabs-list:before:transition-colors group-data-[variant=line]/tabs-list:before:duration-150 group-data-[variant=line]/tabs-list:before:ease-out group-data-[variant=line]/tabs-list:data-[state=active]:before:bg-fill-primary motion-reduce:group-data-[variant=line]/tabs-list:before:transition-none',
        'group-data-[orientation=vertical]/tabs:h-9 group-data-[orientation=vertical]/tabs:justify-start group-data-[orientation=vertical]/tabs:px-3 group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:before:inset-y-0 group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:before:bottom-auto group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:before:left-0 group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:before:h-full group-data-[orientation=vertical]/tabs:group-data-[variant=line]/tabs-list:before:w-0.5',
        'group-data-[variant=default]/tabs-list:h-7 group-data-[variant=default]/tabs-list:rounded-sm group-data-[variant=default]/tabs-list:px-2.5 group-data-[variant=default]/tabs-list:data-[state=active]:bg-control-bg group-data-[variant=default]/tabs-list:data-[state=active]:shadow-low dark:group-data-[variant=default]/tabs-list:data-[state=active]:bg-bg-quaternary',
        className,
      )}
      {...props}
    />
  );
}

export type TabsContentProps = ComponentProps<typeof TabsPrimitive.Content>;

/** Content panel associated with a matching `Tabs.Trigger` value. */
function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        'outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      {...props}
    />
  );
}

const Tabs = Object.assign(TabsRoot, {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export { Tabs, TabsRoot, TabsList, TabsTrigger, TabsContent, tabsListVariants };

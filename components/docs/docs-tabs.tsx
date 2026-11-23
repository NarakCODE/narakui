'use client';

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import { cn } from '@/lib/utils';

/** Base UI Tabs primitive cloned from chanhdai.com with sliding indicator, styled in Rakfound tokens. */
function DocsTabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="docs-tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  );
}

function DocsTabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="docs-tabs-list"
      className={cn(
        'relative z-0 flex h-8 w-fit items-center justify-center rounded-lg bg-bg-secondary p-0.5 text-text-secondary ring-1 ring-inset ring-border',
        className,
      )}
      {...props}
    />
  );
}

function DocsTabsIndicator({ className, ...props }: TabsPrimitive.Indicator.Props) {
  return (
    <TabsPrimitive.Indicator
      data-slot="docs-tabs-indicator"
      className={cn(
        'absolute bottom-0 left-0 -z-1 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-(--active-tab-bottom) rounded-md bg-bg-primary shadow-low transition-[width,translate] duration-200 ease-out motion-reduce:transition-none dark:bg-bg-quaternary',
        className,
      )}
      {...props}
    />
  );
}

function DocsTabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="docs-tabs-trigger"
      className={cn(
        'flex flex-1 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md px-3.5 py-1 font-sans text-body-small-medium whitespace-nowrap transition-[color,background-color] duration-150 ease-out outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-active:text-text-primary [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        className,
      )}
      {...props}
    />
  );
}

function DocsTabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="docs-tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  );
}

export {
  DocsTabs,
  DocsTabsContent,
  DocsTabsIndicator,
  DocsTabsList,
  DocsTabsTrigger,
};

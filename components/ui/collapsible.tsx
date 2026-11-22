import type { ComponentProps } from 'react';
import { Collapsible as CollapsiblePrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export type CollapsibleRootProps = ComponentProps<typeof CollapsiblePrimitive.Root>;

/** Root state container for an expandable/collapsible content region. */
function CollapsibleRoot({ className, ...props }: CollapsibleRootProps) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      className={cn(className)}
      {...props}
    />
  );
}

export interface CollapsibleTriggerProps
  extends ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger> {
  /** Shows the hover background on the default trigger. Ignored with `asChild`. */
  showHoverBackground?: boolean;
  /** Additional classes for the inner span of the default trigger. Ignored with `asChild`. */
  spanClassName?: string;
}

/** Disclosure trigger rendering either a ghost button by default or merging into a child via `asChild`. */
function CollapsibleTrigger({
  asChild = false,
  showHoverBackground = true,
  spanClassName,
  className,
  children,
  ...props
}: CollapsibleTriggerProps) {
  if (asChild) {
    return (
      <CollapsiblePrimitive.CollapsibleTrigger
        data-slot="collapsible-trigger"
        asChild
        className={className}
        {...props}
      >
        {children}
      </CollapsiblePrimitive.CollapsibleTrigger>
    );
  }

  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      className={cn(
        'group inline-flex cursor-pointer items-center rounded-md text-left text-body-small-medium text-text-primary outline-none transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        showHoverBackground && 'px-2 py-1.5 hover:bg-control-hover active:bg-control-selected',
        className,
      )}
      {...props}
    >
      <span className={cn('inline-flex items-center gap-1.5', spanClassName)}>{children}</span>
    </CollapsiblePrimitive.CollapsibleTrigger>
  );
}

export type CollapsibleContentProps = ComponentProps<
  typeof CollapsiblePrimitive.CollapsibleContent
>;

/** Animated expandable content panel using an interruptible CSS grid row and opacity transition. */
function CollapsibleContent({
  forceMount = true,
  className,
  children,
  ...props
}: CollapsibleContentProps) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      forceMount={forceMount}
      className={cn(
        'grid transition-[grid-template-rows,opacity,visibility] ease-out data-[state=open]:grid-rows-[1fr] data-[state=open]:opacity-100 data-[state=open]:visible data-[state=open]:duration-200! data-[state=closed]:grid-rows-[0fr] data-[state=closed]:opacity-0 data-[state=closed]:invisible data-[state=closed]:duration-150! data-[state=closed]:pointer-events-none motion-reduce:transition-[opacity,visibility] motion-reduce:duration-150! motion-reduce:ease-[ease]',
        className,
      )}
      {...props}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </CollapsiblePrimitive.CollapsibleContent>
  );
}

const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
};

export { Collapsible, CollapsibleContent, CollapsibleRoot, CollapsibleTrigger };

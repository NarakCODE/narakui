'use client';

import type { ComponentProps } from 'react';
import { Separator as SeparatorPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export type SeparatorProps = ComponentProps<typeof SeparatorPrimitive.Root>;

/** Visual and semantic divider between content sections, inline metadata, or list rows. */
function Separator({
  className,
  orientation = 'horizontal',
  decorative = false,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-fill-quaternary dark:bg-border-gray',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  );
}

export { Separator };

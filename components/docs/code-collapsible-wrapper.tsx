'use client';

import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface CodeCollapsibleWrapperProps {
  /** Initial expanded state. @default false */
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}

/** Collapsible wrapper for long source code blocks cloned from chanhdai.com. */
export function CodeCollapsibleWrapper({
  defaultOpen = false,
  className,
  children,
}: CodeCollapsibleWrapperProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      data-slot="code-collapsible-wrapper"
      data-state={open ? 'open' : 'closed'}
      className={cn('group/collapsible not-prose relative my-5', className)}
    >
      <div
        className={cn(
          'overflow-hidden *:data-[docs-code-figure]:my-0',
          !open && 'max-h-80',
        )}
      >
        {children}
      </div>

      {!open ? (
        <div className="absolute inset-x-0 bottom-0 flex h-32 items-end justify-center rounded-b-xl pb-4">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-b-xl bg-linear-to-t from-bg-primary via-bg-primary/80 to-transparent backdrop-blur-[1px]"
          />
          <Button
            type="button"
            mode="secondary"
            size="small"
            className="relative z-10"
            onClick={() => setOpen(true)}
          >
            Expand
          </Button>
        </div>
      ) : (
        <div className="mt-2 flex justify-center">
          <Button
            type="button"
            mode="ghost"
            size="small"
            onClick={() => setOpen(false)}
          >
            Collapse
          </Button>
        </div>
      )}
    </div>
  );
}

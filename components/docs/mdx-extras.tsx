import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Vertical timeline step list cloned from chanhdai.com's MDX `<Steps>` component. */
export function Steps({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="docs-steps"
      className={cn(
        'relative my-4 [counter-reset:docs-step] md:ml-3 md:pl-7',
        'before:pointer-events-none before:absolute before:top-0 before:left-0 before:hidden before:h-full before:w-px before:-translate-x-1/2 before:bg-border before:md:block',
        className,
      )}
      {...props}
    />
  );
}

/** Numbered step heading paired with `<Steps>`. */
export function Step({ className, ...props }: ComponentProps<'h3'>) {
  return (
    <h3
      data-slot="docs-step"
      className={cn(
        'relative mt-6 mb-3 text-body-regular-semibold text-text-primary [counter-increment:docs-step] first:mt-0',
        'md:before:absolute md:before:top-1/2 md:before:-left-7 md:before:flex md:before:size-6 md:before:-translate-x-1/2 md:before:-translate-y-1/2 md:before:items-center md:before:justify-center md:before:rounded-full md:before:border md:before:border-border md:before:bg-bg-secondary md:before:font-mono md:before:text-body-micro-medium md:before:text-text-secondary md:before:content-[counter(docs-step)]',
        className,
      )}
      {...props}
    />
  );
}

export interface DocsCalloutProps extends Omit<ComponentProps<'div'>, 'title'> {
  title?: ReactNode;
  icon?: ReactNode;
  type?: 'info' | 'warn' | 'warning' | 'error' | 'idea' | 'success';
}

/** Subtle recessed callout cloned from chanhdai.com, styled with Rakfound tokens. */
export function Callout({
  title,
  icon,
  type = 'info',
  className,
  children,
  ...props
}: DocsCalloutProps) {
  return (
    <div
      role="note"
      data-slot="docs-callout"
      data-type={type}
      className={cn(
        'not-prose my-5 flex gap-3 rounded-xl bg-bg-secondary p-4 text-text-primary ring-1 ring-inset ring-border',
        type === 'error' && 'bg-bg-red ring-red-border',
        (type === 'warn' || type === 'warning') && 'bg-bg-orange ring-orange-border',
        type === 'success' && 'bg-bg-green ring-green-border',
        className,
      )}
      {...props}
    >
      {icon ? (
        <div className="flex h-[18px] shrink-0 items-center justify-center text-text-secondary [&>svg]:size-4">
          {icon}
        </div>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title ? (
          <div className="text-body-small-medium text-text-primary">{title}</div>
        ) : null}
        <div className="text-body-small-regular text-text-secondary [&_strong]:font-medium [&_strong]:text-text-primary">
          {children}
        </div>
      </div>
    </div>
  );
}

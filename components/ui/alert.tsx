import type { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export type AlertVariant = 'default' | 'warning' | 'destructive' | 'success';

const alertVariants = cva(
  'group/alert flex items-start gap-2.5 rounded-md p-3 text-paragraph-small text-text-primary',
  {
    variants: {
      variant: {
        default: 'bg-bg-secondary',
        warning: 'bg-bg-orange',
        success: 'bg-bg-green',
        destructive: 'bg-bg-red',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const alertIconVariants = cva('flex shrink-0 items-center [&_svg]:size-[1lh] [&_svg]:shrink-0', {
  variants: {
    variant: {
      default: '[&_svg]:text-fill-secondary',
      warning: '[&_svg]:text-text-orange',
      success: '[&_svg]:text-text-green',
      destructive: '[&_svg]:text-text-red',
    },
  },
});

const INHERITED_ICON_TINT =
  'group-data-[variant=default]/alert:[&_svg]:text-fill-secondary group-data-[variant=warning]/alert:[&_svg]:text-text-orange group-data-[variant=success]/alert:[&_svg]:text-text-green group-data-[variant=destructive]/alert:[&_svg]:text-text-red';

export type AlertProps = ComponentProps<'div'> & VariantProps<typeof alertVariants>;

/** Inline status or alert callout supporting semantic surface tints and live-region defaults. */
function Alert({ className, variant, role, ...props }: AlertProps) {
  const resolvedVariant: AlertVariant = variant ?? 'default';
  const resolvedRole =
    role ?? (resolvedVariant === 'warning' || resolvedVariant === 'destructive' ? 'alert' : 'status');

  return (
    <div
      data-slot="alert"
      data-variant={resolvedVariant}
      role={resolvedRole}
      className={cn(alertVariants({ variant: resolvedVariant }), className)}
      {...props}
    />
  );
}

export type AlertIconProps = ComponentProps<'div'> & {
  /** Overrides the icon tint inherited from the enclosing Alert. */
  variant?: AlertVariant;
};

/** Decorative leading icon slot sized to 1lh and tinted by Alert variant or explicit override. */
function AlertIcon({ className, variant, ...props }: AlertIconProps) {
  return (
    <div
      data-slot="alert-icon"
      aria-hidden="true"
      className={cn(
        alertIconVariants({ variant }),
        // Only apply group-based inheritance when no explicit variant override is provided.
        variant === undefined && INHERITED_ICON_TINT,
        className,
      )}
      {...props}
    />
  );
}

export type AlertContentProps = ComponentProps<'div'>;

/** Vertical stack wrapper for AlertTitle and AlertDescription. */
function AlertContent({ className, ...props }: AlertContentProps) {
  return (
    <div
      data-slot="alert-content"
      className={cn('flex min-w-0 flex-1 flex-col gap-1', className)}
      {...props}
    />
  );
}

export type AlertTitleProps = ComponentProps<'p'>;

/** Compact bold heading rendered inside AlertContent. */
function AlertTitle({ className, ...props }: AlertTitleProps) {
  return (
    <p
      data-slot="alert-title"
      className={cn('text-body-small-semibold leading-none', className)}
      {...props}
    />
  );
}

export type AlertDescriptionProps = ComponentProps<'div'>;

/** Supporting body slot that fills available width cleanly with or without AlertContent. */
function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'w-full min-w-0 flex-1 text-pretty [&_a]:underline [&_a]:underline-offset-3',
        className,
      )}
      {...props}
    />
  );
}

export {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  alertVariants,
};

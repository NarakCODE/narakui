import * as React from 'react';
import {
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type BannerColor = 'green' | 'red' | 'orange' | 'blue' | 'grey' | 'white';
export type BannerIconName = 'info' | 'warning' | 'error' | 'success';

const SURFACE_CLASSES: Record<BannerColor, string> = {
  green: 'bg-bg-green border-green-border',
  blue: 'bg-bg-blue border-blue-border',
  orange: 'bg-bg-orange border-orange-border',
  red: 'bg-bg-red border-red-border',
  grey: 'bg-bg-secondary border-border-gray',
  white: 'bg-bg-primary border-border-gray',
};

const ICON_ACCENT_CLASSES: Record<BannerColor, string> = {
  green: 'text-text-green',
  blue: 'text-text-blue',
  orange: 'text-text-orange',
  red: 'text-text-red',
  grey: 'text-text-secondary',
  white: 'text-text-secondary',
};

const TITLE_ACCENT_CLASSES: Record<BannerColor, string> = {
  green: 'text-text-green',
  blue: 'text-text-blue',
  orange: 'text-text-orange',
  red: 'text-text-red',
  grey: 'text-text-primary',
  white: 'text-text-primary',
};

function renderBuiltInIcon(icon: BannerIconName) {
  switch (icon) {
    case 'success':
      return <CircleCheck aria-hidden="true" />;
    case 'info':
      return <Info aria-hidden="true" />;
    case 'warning':
      return <TriangleAlert aria-hidden="true" />;
    case 'error':
      return <CircleAlert aria-hidden="true" />;
  }
}

function isBuiltInIconName(icon: React.ReactNode): icon is BannerIconName {
  return (
    icon === 'info' ||
    icon === 'warning' ||
    icon === 'error' ||
    icon === 'success'
  );
}

export interface BannerProps extends Omit<React.ComponentProps<'div'>, 'title' | 'color'> {
  /** The main message. */
  title: React.ReactNode;
  /** Supporting copy under the title. */
  description?: React.ReactNode;
  /** Surface and accent color. @default 'green' */
  color?: BannerColor;
  /** A built-in glyph by name, or an icon element. No icon renders when omitted. */
  icon?: BannerIconName | React.ReactNode;
  /** Accent color for the icon alone. Defaults to `color`. */
  iconColor?: BannerColor;
  /** Colors the title and the action area's text with the banner's accent. */
  coloredTitle?: boolean;
  /** The main action, rendered last. */
  primaryAction?: React.ReactNode;
  /** An extra action, rendered before `primaryAction`. */
  secondaryAction?: React.ReactNode;
  /** Aligns the actions with the top or the middle of the banner. @default 'center' */
  actionsAlignment?: 'start' | 'center';
  /** Shows a dismiss button and runs when clicked. The banner does not hide itself. */
  onDismiss?: () => void;
  /** Controls visibility with a smooth height and opacity collapse when false. @default true */
  open?: boolean;
  /** Live-region role. Use `alert` for urgent errors, or `presentation` inside another live region. @default 'status' */
  role?: React.AriaRole;
  /** Lays out the icon, text, and actions in a row or a column. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Additional CSS classes for the banner. */
  className?: string;
  /** Additional CSS classes for the title and description wrapper. */
  contentClassName?: string;
  /** Additional CSS classes for the description. */
  descriptionClassName?: string;
}

/**
 * An inline message that tells people about the state of a page or section, with optional actions.
 */
export function Banner({
  title,
  description,
  color = 'green',
  icon,
  iconColor,
  coloredTitle = false,
  primaryAction,
  secondaryAction,
  actionsAlignment = 'center',
  onDismiss,
  open = true,
  role = 'status',
  orientation = 'horizontal',
  className,
  contentClassName,
  descriptionClassName,
  ...props
}: BannerProps) {
  const hasDescription = description !== undefined && description !== null && description !== false;
  const hasActions = Boolean(secondaryAction || primaryAction || onDismiss);
  const resolvedIconColor = iconColor ?? color;

  const iconNode =
    icon !== undefined && icon !== null && icon !== false
      ? isBuiltInIconName(icon)
        ? renderBuiltInIcon(icon)
        : icon
      : null;

  return (
    <div
      data-slot="banner-wrapper"
      data-state={open ? 'open' : 'closed'}
      aria-hidden={!open || undefined}
      className={cn(
        'grid w-full transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-opacity',
        open
          ? 'grid-rows-[1fr] opacity-100'
          : 'pointer-events-none grid-rows-[0fr] opacity-0',
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div
          role={role}
          data-slot="banner"
          data-color={color}
          data-orientation={orientation}
          data-state={open ? 'open' : 'closed'}
          className={cn(
            'relative flex w-full gap-2.5 rounded-lg border px-3 py-2.5 text-left starting:opacity-0 starting:-translate-y-1 transition-[opacity,translate] duration-200 ease-out motion-reduce:starting:translate-y-0 motion-reduce:transition-opacity',
            SURFACE_CLASSES[color],
            orientation === 'vertical'
              ? 'flex-col items-start'
              : hasDescription
                ? 'flex-row items-start'
                : 'flex-row items-center',
            className,
          )}
          {...props}
        >
          {iconNode ? (
            <span
              data-slot="banner-icon"
              className={cn(
                'flex h-[18px] shrink-0 items-center justify-center [&>svg]:size-4 [&>svg]:shrink-0',
                ICON_ACCENT_CLASSES[resolvedIconColor],
              )}
            >
              {iconNode}
            </span>
          ) : null}

          <div
            data-slot="banner-content"
            className={cn(
              'flex min-w-0 flex-1 flex-col gap-0.5',
              contentClassName,
            )}
          >
            <div
              data-slot="banner-title"
              className={cn(
                'text-body-small-medium',
                coloredTitle ? TITLE_ACCENT_CLASSES[color] : 'text-text-primary',
              )}
            >
              {title}
            </div>
            {hasDescription ? (
              <div
                data-slot="banner-description"
                className={cn(
                  'text-body-small-regular text-text-secondary',
                  descriptionClassName,
                )}
              >
                {description}
              </div>
            ) : null}
          </div>

          {hasActions ? (
            <div
              data-slot="banner-actions"
              className={cn(
                'flex shrink-0 items-center gap-1.5 text-body-small-medium',
                orientation === 'horizontal' && 'ml-auto',
                orientation === 'horizontal' &&
                  (actionsAlignment === 'start' ? 'self-start' : 'self-center'),
                coloredTitle ? TITLE_ACCENT_CLASSES[color] : 'text-text-primary',
              )}
            >
              {secondaryAction}
              {primaryAction}
              {onDismiss ? (
                <button
                  type="button"
                  aria-label="Dismiss banner"
                  onClick={onDismiss}
                  data-slot="banner-dismiss"
                  className="inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-text-secondary transition-[transform,background-color,color] duration-150 ease-out hover:bg-black/5 hover:text-text-primary active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none dark:hover:bg-white/10"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

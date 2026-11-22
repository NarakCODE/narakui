import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type NotificationBadgePlacement =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

export type NotificationBadgeColor =
  | 'red'
  | 'blue'
  | 'green'
  | 'amber'
  | 'purple'
  | 'pink'
  | 'gray';

export type NotificationBadgeSize = 'sm' | 'md' | 'lg';

export interface NotificationBadgeProps extends Omit<ComponentProps<'div'>, 'content'> {
  /** The element the badge is pinned to. */
  children: ReactNode;
  /** Short text or number inside the badge. The badge is a dot when omitted. */
  content?: ReactNode;
  /** Whether the badge is visible. */
  show?: boolean;
  /** Corner of the anchor the badge is pinned to. */
  placement?: NotificationBadgePlacement;
  /** Badge color. */
  color?: NotificationBadgeColor;
  /** Size of the dot or badge. */
  size?: NotificationBadgeSize;
  /** Additional CSS classes for the wrapper around the anchor. */
  className?: string;
  /** Additional CSS classes for the badge, for example to nudge its position. */
  badgeClassName?: string;
}

const PLACEMENT_CLASSES: Record<NotificationBadgePlacement, string> = {
  'top-right': 'top-0 right-0 translate-x-[10%] -translate-y-[10%]',
  'top-left': 'top-0 left-0 -translate-x-[10%] -translate-y-[10%]',
  'bottom-left': 'bottom-0 left-0 -translate-x-[10%] translate-y-[10%]',
  'bottom-right': 'right-0 bottom-0 translate-x-[10%] translate-y-[10%]',
};

const COLOR_CLASSES: Record<NotificationBadgeColor, string> = {
  red: 'bg-red-base text-text-inverse',
  blue: 'bg-blue-base text-text-inverse',
  green: 'bg-green-base text-text-inverse',
  amber: 'bg-amber-base text-text-inverse',
  purple: 'bg-purple-base text-text-inverse',
  pink: 'bg-pink-base text-text-inverse',
  gray: 'bg-fill-secondary text-text-inverse',
};

const DOT_SIZE_CLASSES: Record<NotificationBadgeSize, string> = {
  sm: 'size-1.5',
  md: 'size-2',
  lg: 'size-2.5',
};

const CONTENT_SIZE_CLASSES: Record<NotificationBadgeSize, string> = {
  sm: 'h-3 min-w-3 px-[3px]',
  md: 'h-3.5 min-w-3.5 px-1',
  lg: 'h-4 min-w-4 px-1',
};

const CONTENT_TEXT_CLASSES: Record<NotificationBadgeSize, string> = {
  sm: 'text-[6px]',
  md: 'text-[7px]',
  lg: 'text-[8px]',
};

/** Visual dot or counter badge pinned to the corner of an anchor element. */
function NotificationBadge({
  children,
  content,
  show = true,
  placement = 'top-right',
  color = 'red',
  size = 'md',
  className,
  badgeClassName,
  ...props
}: NotificationBadgeProps) {
  const hasContent = content !== undefined && content !== null && content !== '';

  return (
    <div
      data-slot="notification-badge"
      className={cn('relative inline-flex', className)}
      {...props}
    >
      {children}
      <span
        aria-hidden="true"
        data-slot="notification-badge-indicator"
        data-placement={placement}
        data-color={color}
        data-size={size}
        data-visible={show ? 'true' : 'false'}
        className={cn(
          'pointer-events-none absolute z-10 box-border flex items-center justify-center rounded-full ring-2 ring-bg-primary select-none transition-[opacity,transform] duration-150 ease-out motion-reduce:scale-100 motion-reduce:transition-opacity',
          PLACEMENT_CLASSES[placement],
          COLOR_CLASSES[color],
          hasContent ? CONTENT_SIZE_CLASSES[size] : DOT_SIZE_CLASSES[size],
          show ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
          badgeClassName,
        )}
      >
        {hasContent ? (
          <span
            className={cn(
              'leading-none font-semibold tabular-nums',
              CONTENT_TEXT_CLASSES[size],
            )}
          >
            {content}
          </span>
        ) : null}
      </span>
    </div>
  );
}

export { NotificationBadge };

'use client';

import { isValidElement, type ComponentProps, type ReactNode } from 'react';
import {
  Check,
  CircleAlert,
  CircleCheck,
  CircleX,
  Clock,
  Info,
  Lock,
  Radio,
  Shield,
  Sparkles,
  TriangleAlert,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Badge, type BadgeType } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_BADGE_ICONS = {
  'check-circle': CircleCheck,
  warning: TriangleAlert,
  'close-circle': CircleX,
  info: Info,
  sparkles: Sparkles,
  clock: Clock,
  lock: Lock,
  'alert-circle': CircleAlert,
  check: Check,
  zap: Zap,
  shield: Shield,
  signal: Radio,
} as const satisfies Record<string, LucideIcon>;

export type StatusBadgeIconName = keyof typeof STATUS_BADGE_ICONS;

export interface StatusBadgeIconDescriptor {
  /** Named icon registered for StatusBadge. */
  name: StatusBadgeIconName | (string & {});
  /** Additional CSS classes for the icon SVG. */
  className?: string;
}

export type StatusBadgeIconValue =
  | StatusBadgeIconName
  | (string & {})
  | StatusBadgeIconDescriptor
  | ReactNode;

export interface StatusBadgeProps extends Omit<ComponentProps<'span'>, 'children' | 'title'> {
  /** The label. */
  text?: string | null;
  /** Badge color. */
  type?: BadgeType;
  /** Icon before the text: an icon name, an icon descriptor, or an element. */
  iconStart?: StatusBadgeIconValue;
  /** Additional CSS classes for the badge. Use `ml-0` to remove the left margin. */
  className?: string;
  /** Additional CSS classes for the text. */
  titleClassName?: string;
}

function isIconDescriptor(value: unknown): value is StatusBadgeIconDescriptor {
  return (
    typeof value === 'object' &&
    value !== null &&
    !isValidElement(value) &&
    'name' in value &&
    typeof (value as { name?: unknown }).name === 'string'
  );
}

function resolveStatusBadgeIcon(iconStart: StatusBadgeIconValue): ReactNode {
  if (iconStart === undefined || iconStart === null || iconStart === '') {
    return null;
  }

  if (typeof iconStart === 'string') {
    if (iconStart in STATUS_BADGE_ICONS) {
      const IconComponent = STATUS_BADGE_ICONS[iconStart as StatusBadgeIconName];
      return <IconComponent className="size-2.5 shrink-0" />;
    }
    return null;
  }

  if (isIconDescriptor(iconStart)) {
    if (iconStart.name in STATUS_BADGE_ICONS) {
      const IconComponent = STATUS_BADGE_ICONS[iconStart.name as StatusBadgeIconName];
      return <IconComponent className={cn('size-2.5 shrink-0', iconStart.className)} />;
    }
    return null;
  }

  return iconStart;
}

/** Small badge for marking a navigation item or heading as new, in beta, or coming soon. */
function StatusBadge({
  text,
  type = 'blue',
  iconStart,
  className,
  titleClassName,
  ...props
}: StatusBadgeProps) {
  const hasText = typeof text === 'string' && text.length > 0;
  const resolvedIcon = iconStart !== undefined ? resolveStatusBadgeIcon(iconStart) : null;

  if (!hasText && !resolvedIcon) {
    return null;
  }

  return (
    <Badge
      data-slot="status-badge"
      title={hasText ? text : ''}
      type={type}
      size="small"
      iconStart={resolvedIcon ?? undefined}
      className={cn(
        'ml-1.5 px-[5px] py-0 [&_svg]:size-2.5',
        resolvedIcon && hasText ? 'gap-0.75' : !hasText ? 'gap-0' : undefined,
        className,
      )}
      titleClassName={cn('max-w-32 truncate', !hasText && 'hidden', titleClassName)}
      {...props}
    />
  );
}

export { StatusBadge };

'use client';

import type { ComponentProps, ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import {
  Check,
  CircleAlert,
  CircleCheck,
  CircleX,
  Clock,
  Info,
  Lock,
  Shield,
  Sparkles,
  TriangleAlert,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type BadgeType =
  | 'default'
  | 'red'
  | 'blue'
  | 'green'
  | 'amber'
  | 'yellow'
  | 'purple'
  | 'orange'
  | 'gray'
  | 'cyan';

export type BadgeSize = 'micro' | 'small' | 'default' | 'large';
export type BadgeVariant = 'default' | 'agent-builder';
export type BadgeFontWeight = 'medium' | 'regular';

const BADGE_ICONS = {
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
} as const satisfies Record<string, LucideIcon>;

export type BadgeIconName = keyof typeof BADGE_ICONS;
export type IconValue = BadgeIconName | (string & {}) | ReactNode;

const badgeVariants = cva(
  'inline-flex w-fit max-w-full shrink-0 items-center justify-center whitespace-nowrap select-none',
  {
    variants: {
      variant: {
        default: 'rounded-full border',
        'agent-builder': 'rounded-sm border border-transparent',
      },
      size: {
        micro: 'gap-1 px-1.5 py-0.5 [&_svg]:size-2.5',
        small: 'gap-1 px-1.5 py-0.5 [&_svg]:size-3',
        default: 'gap-1.5 px-2 py-0.5 [&_svg]:size-3.5',
        large: 'gap-1.5 px-2.5 py-1 [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const SIZE_TEXT_CLASSES: Record<BadgeSize, Record<BadgeFontWeight, string>> = {
  micro: {
    medium: 'text-body-micro-medium',
    regular: 'text-body-micro-regular',
  },
  small: {
    medium: 'text-body-mini-medium',
    regular: 'text-body-mini-regular',
  },
  default: {
    medium: 'text-body-small-medium',
    regular: 'text-body-small-regular',
  },
  large: {
    medium: 'text-body-regular-medium',
    regular: 'text-body-regular',
  },
};

const DEFAULT_TYPE_CLASSES: Record<BadgeType, string> = {
  default: 'border-border-gray bg-transparent text-text-primary',
  red: 'border-red-border bg-red-muted-fill text-red-emphasis',
  blue: 'border-blue-border bg-blue-muted-fill text-blue-emphasis',
  green: 'border-green-border bg-green-muted-fill text-green-emphasis',
  amber: 'border-amber-border bg-amber-muted-fill text-amber-emphasis',
  yellow: 'border-amber-border bg-bg-amber text-amber-emphasis',
  purple: 'border-purple-border bg-purple-muted-fill text-purple-emphasis',
  orange: 'border-orange-border bg-orange-muted-fill text-orange-emphasis',
  gray: 'border-border-gray bg-bg-tertiary text-text-secondary',
  cyan: 'border-cyan-border bg-cyan-muted-fill text-cyan-emphasis',
};

const AGENT_BUILDER_TYPE_CLASSES: Record<BadgeType, string> = {
  default: 'bg-bg-tertiary text-text-primary',
  red: 'bg-red-muted-fill text-red-emphasis',
  blue: 'bg-blue-muted-fill text-blue-emphasis',
  green: 'bg-green-muted-fill text-green-emphasis',
  amber: 'bg-amber-muted-fill text-amber-emphasis',
  // Agent Builder intentionally omits a yellow style so yellow renders unstyled.
  yellow: '',
  purple: 'bg-purple-muted-fill text-purple-emphasis',
  orange: 'bg-orange-muted-fill text-orange-emphasis',
  gray: 'bg-bg-tertiary text-text-secondary',
  cyan: 'bg-cyan-muted-fill text-cyan-emphasis',
};

const ICON_TINT_CLASSES: Record<BadgeType, string> = {
  default: 'text-text-secondary',
  red: 'text-red-base',
  blue: 'text-blue-base',
  green: 'text-green-base',
  amber: 'text-amber-base',
  yellow: 'text-text-yellow',
  purple: 'text-purple-base',
  orange: 'text-orange-base',
  gray: 'text-text-tertiary',
  cyan: 'text-cyan-base',
};

/** Resolves a named badge icon or passes through non-string React nodes. */
function renderBadgeIcon(iconStart: IconValue): ReactNode {
  if (typeof iconStart === 'string') {
    if (iconStart in BADGE_ICONS) {
      const IconComponent = BADGE_ICONS[iconStart as BadgeIconName];
      return <IconComponent />;
    }
    return null;
  }
  return iconStart;
}

export interface BadgeProps extends Omit<ComponentProps<'span'>, 'title' | 'children'> {
  /** Badge label. */
  title: ReactNode;
  /** Color treatment. */
  type?: BadgeType;
  /** Padding and type scale. */
  size?: BadgeSize;
  /** Rounded bordered badge or the borderless Agent Builder badge. */
  variant?: BadgeVariant;
  /** Label weight. */
  fontWeight?: BadgeFontWeight;
  /** Icon shown before the label, tinted to match the type. */
  iconStart?: IconValue;
  /** Tooltip content shown on hover. */
  tooltip?: string;
  /** Additional classes for the badge. */
  className?: string;
  /** Additional classes for the label. */
  titleClassName?: string;
}

/** Compact status label supporting semantic color treatments, sizes, leading icons, and tooltips. */
function Badge({
  title,
  type = 'default',
  size = 'default',
  variant = 'default',
  fontWeight = 'medium',
  iconStart,
  tooltip,
  className,
  titleClassName,
  tabIndex,
  ...props
}: BadgeProps) {
  const typeClasses =
    variant === 'agent-builder' ? AGENT_BUILDER_TYPE_CLASSES[type] : DEFAULT_TYPE_CLASSES[type];
  const iconTint = variant === 'agent-builder' && type === 'yellow' ? '' : ICON_TINT_CLASSES[type];
  const iconNode = iconStart !== undefined ? renderBadgeIcon(iconStart) : null;

  const badge = (
    <span
      data-slot="badge"
      data-variant={variant}
      data-type={type}
      data-size={size}
      tabIndex={tooltip ? (tabIndex ?? 0) : tabIndex}
      className={cn(
        badgeVariants({ variant, size }),
        SIZE_TEXT_CLASSES[size][fontWeight],
        typeClasses,
        tooltip && 'focus-visible:outline-2 focus-visible:outline-ring',
        className,
      )}
      {...props}
    >
      {iconNode ? (
        <span aria-hidden="true" className={cn('inline-flex shrink-0 items-center', iconTint)}>
          {iconNode}
        </span>
      ) : null}
      <span className={cn('min-w-0 truncate', titleClassName)}>{title}</span>
    </span>
  );

  if (!tooltip) {
    return badge;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{badge}</TooltipTrigger>
      <TooltipContent sideOffset={6}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export { Badge, badgeVariants };

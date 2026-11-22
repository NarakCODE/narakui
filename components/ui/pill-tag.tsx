import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type PillColor = 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'gray';

const PILL_COLOR_CLASSES: Record<PillColor, string> = {
  green: 'text-text-green',
  blue: 'text-text-blue',
  purple: 'text-text-purple',
  orange: 'text-text-orange',
  red: 'text-text-red',
  gray: 'text-text-secondary',
};

export interface PillProps extends Omit<ComponentProps<'div'>, 'children' | 'color'> {
  /** The text content to display in the pill. */
  value: string;
  /** Additional CSS classes to apply to the pill container. */
  className?: string;
  /** Text color of the pill. Inherits the surrounding text color when unset. */
  color?: PillColor;
  /** Whether to include horizontal padding in the pill. */
  withPadding?: boolean;
}

/** Single-line text label with a fixed height and optional semantic text color. */
function Pill({
  value,
  className,
  color,
  withPadding = true,
  ...props
}: PillProps) {
  return (
    <div
      data-slot="pill"
      data-color={color}
      className={cn(
        'flex h-6 items-center justify-center',
        color ? PILL_COLOR_CLASSES[color] : undefined,
        withPadding && 'px-1.5',
        className,
      )}
      {...props}
    >
      <p className="text-body-small-medium">{value}</p>
    </div>
  );
}

export interface TagProps extends ComponentProps<'div'> {
  /** The content to display inside the tag. */
  children: ReactNode;
  /** Additional CSS classes to apply to the tag, including its colors. */
  className?: string;
}

/** Rounded inline container for categorizing, labeling, or highlighting content. */
function Tag({ children, className, ...props }: TagProps) {
  return (
    <div
      data-slot="tag"
      className={cn('inline-flex items-center rounded-full px-2 py-0.5', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Pill, Tag };

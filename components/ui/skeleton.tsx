import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type TypographyClass =
  | 'text-title-regular'
  | 'text-title-small-regular'
  | 'text-title-small-medium'
  | 'text-title-small-semibold'
  | 'text-title-mini-regular'
  | 'text-title-mini-medium'
  | 'text-title-mini-semibold'
  | 'text-body-regular'
  | 'text-body-regular-medium'
  | 'text-body-regular-semibold'
  | 'text-body-regular-spaced'
  | 'text-body-small-regular'
  | 'text-body-small-medium'
  | 'text-body-small-semibold'
  | 'text-body-small-spaced'
  | 'text-body-mini-regular'
  | 'text-body-mini-medium'
  | 'text-body-micro-regular'
  | 'text-body-micro-medium'
  | 'text-paragraph-regular'
  | 'text-paragraph-small'
  | 'text-paragraph-small-relaxed';

export interface SkeletonProps extends ComponentProps<'div'> {
  /** Width of the skeleton block. */
  width?: string;
  /** Height of the skeleton block. */
  height?: string;
  /** Whether to show the pulse animation. */
  animate?: boolean;
}

/** Loading placeholder block sized via CSS custom properties or utility classes. */
function Skeleton({
  width = '100%',
  height = '24px',
  animate = true,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        'h-(--height) w-(--width) cursor-progress rounded-[4px] bg-fill-tertiary dark:bg-fill-quaternary',
        animate && 'animate-pulse motion-reduce:animate-none',
        className,
      )}
      style={
        {
          '--height': height,
          '--width': width,
          ...style,
        } as CSSProperties
      }
      {...props}
    />
  );
}

export interface SkeletonTextProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Typography class of the text line it replaces. Omit to inherit from the parent. */
  variant?: TypographyClass;
  /** Approximate length of the text, as a CSS width. */
  width?: string;
  /** Whether to show the pulse animation. */
  animate?: boolean;
}

/** Single-line text skeleton matching the line height (`1lh`) and cap height (`0.75em`) of surrounding typography. */
function SkeletonText({
  variant,
  width = '100%',
  animate = true,
  className,
  ...props
}: SkeletonTextProps) {
  return (
    <div
      data-slot="skeleton-text"
      aria-hidden="true"
      className={cn('flex h-lh w-full items-center', variant, className)}
      {...props}
    >
      <Skeleton width={width} height="0.75em" animate={animate} />
    </div>
  );
}

export interface SkeletonGroupProps extends ComponentProps<'div'> {
  /** Screen-reader loading announcement for the grouped placeholders. */
  label: string;
  /** Skeleton elements contained in this loading region. */
  children: ReactNode;
}

/** Announces loading state to assistive technology while grouping visual skeleton placeholders. */
function SkeletonGroup({ label, children, className, ...props }: SkeletonGroupProps) {
  return (
    <>
      <span role="status" className="sr-only">
        {label}
      </span>
      <div data-slot="skeleton-group" aria-busy="true" className={className} {...props}>
        {children}
      </div>
    </>
  );
}

export { Skeleton, SkeletonGroup, SkeletonText };

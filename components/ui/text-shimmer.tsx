import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

const TEXT_SHIMMER_STYLES = `
@keyframes rk-text-shimmer {
  0% { background-position: 100% center; }
  100% { background-position: 0% center; }
}
`;

export interface TextShimmerProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** The text label to animate. */
  children: string;
  /** Length of one highlight sweep, in seconds. */
  duration?: number;
  /** Width of the highlight, in pixels per character of the label. */
  spread?: number;
}

/** Sweeps a primary-colored highlight across a tertiary-colored label while work is in progress. */
function TextShimmer({
  children,
  duration = 1,
  spread = 2,
  className,
  style,
  ...props
}: TextShimmerProps) {
  const dynamicSpread = children.length * spread;
  const isStatic = duration <= 0 || children.length === 0;

  return (
    <>
      {!isStatic ? (
        <style href="narakui-text-shimmer" precedence="default">
          {TEXT_SHIMMER_STYLES}
        </style>
      ) : null}
      <span
        data-slot="text-shimmer"
        className={cn(
          'relative inline-block w-fit bg-clip-text py-1 [contain:paint]',
          isStatic
            ? 'bg-none text-text-secondary'
            : [
                'bg-size-[250%_100%,auto] text-transparent',
                '[--base-color:var(--color-text-tertiary)] [--base-gradient-color:var(--color-text-primary)]',
                '[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]',
                '[background-image:var(--bg),linear-gradient(var(--base-color),var(--base-color))] [background-position:100%_center] [background-repeat:no-repeat,padding-box]',
                'motion-safe:animate-[rk-text-shimmer_var(--duration,1s)_linear_infinite]',
                'motion-reduce:animate-none motion-reduce:bg-none motion-reduce:text-text-secondary',
              ],
          className,
        )}
        style={
          {
            '--spread': `${dynamicSpread}px`,
            '--duration': `${duration}s`,
            ...style,
          } as CSSProperties
        }
        {...props}
      >
        {children}
      </span>
    </>
  );
}

export { TextShimmer };

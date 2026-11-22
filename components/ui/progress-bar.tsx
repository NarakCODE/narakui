import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

export type LinearProgressSize = 'sm' | 'md' | 'lg';
export type CircularProgressSize = 'sm' | 'md' | 'lg' | number;

const LINEAR_SIZE_CLASSES: Record<LinearProgressSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const CIRCULAR_SIZE_CONFIG = {
  sm: { size: 14, strokeWidth: 2, strokeLinecap: 'butt' as const },
  md: { size: 20, strokeWidth: 2.2, strokeLinecap: 'round' as const },
  lg: { size: 60, strokeWidth: 6, strokeLinecap: 'round' as const },
};

const LINEAR_INDETERMINATE_STYLES = `
@keyframes rk-linear-progress-indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}
@keyframes rk-linear-progress-indeterminate-fade {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.6; }
}
`;

const CIRCULAR_DRAW_STYLES = `
@keyframes rk-circular-progress-draw {
  0% { stroke-dashoffset: var(--circular-progress-circumference); }
}
`;

function clampProgress(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

type LinearProgressBaseProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** Height of the bar. */
  size?: LinearProgressSize;
  /** Fill color utility class for the bar indicator. */
  fill?: string;
  /** Accessible name for the progress bar. */
  label?: string;
};

export type LinearProgressProps = LinearProgressBaseProps &
  (
    | {
        /** Shows an animated sliding bar instead of a determinate value. */
        indeterminate: true;
        /** Cannot be combined with `indeterminate`. */
        value?: never;
      }
    | {
        /** Progress value from 0 to 100. */
        value: number;
        /** Shows an animated sliding bar instead of a determinate value. */
        indeterminate?: false;
      }
  );

/** Linear progress bar supporting determinate values (0–100) and an indeterminate sliding state. */
function LinearProgress({
  value,
  indeterminate = false,
  size = 'md',
  fill = 'bg-fill-primary',
  label = 'Progress',
  className,
  ...props
}: LinearProgressProps) {
  const clampedValue = indeterminate ? undefined : clampProgress(value ?? 0);

  return (
    <div data-slot="linear-progress" className={cn('w-full', className)} {...props}>
      {indeterminate ? (
        <style href="rakfound-linear-progress" precedence="default">
          {LINEAR_INDETERMINATE_STYLES}
        </style>
      ) : null}
      <div
        data-slot="linear-progress-track"
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-fill-quaternary',
          LINEAR_SIZE_CLASSES[size],
        )}
      >
        {indeterminate ? (
          <div
            data-slot="linear-progress-indicator"
            className={cn(
              'h-full w-1/3 rounded-full motion-safe:animate-[rk-linear-progress-indeterminate_1.4s_var(--ease-in-out)_infinite] motion-reduce:w-full motion-reduce:animate-[rk-linear-progress-indeterminate-fade_2s_var(--ease-in-out)_infinite]',
              fill,
            )}
          />
        ) : (
          <div
            data-slot="linear-progress-indicator"
            className={cn(
              'h-full w-full origin-left rounded-full transition-transform duration-150 ease-out motion-reduce:transition-none',
              fill,
            )}
            style={{ transform: `scaleX(${(clampedValue ?? 0) / 100})` }}
          />
        )}
      </div>
    </div>
  );
}

export interface CircularProgressProps
  extends Omit<ComponentProps<'svg'>, 'children' | 'width' | 'height' | 'strokeWidth' | 'strokeLinecap'> {
  /** Progress value from 0 to 100. */
  progress?: number;
  /** Named size variant (14, 20, or 60px) or an explicit pixel size. */
  size?: CircularProgressSize;
  /** Accessible name. When set, exposes the SVG as `role="progressbar"`. */
  label?: string;
  /** Width of the stroke. Defaults to the size variant's stroke, or 1/10 of a numeric size. */
  strokeWidth?: number;
  /** Shape of the arc ends. Defaults to `butt` for `sm` and `round` otherwise. */
  strokeLinecap?: 'butt' | 'round';
  /** CSS color for the background track circle. */
  trackColor?: string;
  /** CSS color for the progress arc. */
  progressColor?: string;
  /** Class applied to the background track circle. */
  bgClassName?: string;
  /** Class applied to the progress arc circle. */
  fgClassName?: string;
  /** Draws the arc from empty to its value when it first mounts. */
  animated?: boolean;
}

/** Circular SVG progress ring for compact spaces and percentage completion. */
function CircularProgress({
  progress = 0,
  size = 'md',
  label,
  strokeWidth,
  strokeLinecap,
  trackColor = 'var(--color-fill-tertiary)',
  progressColor = 'var(--color-fill-primary)',
  bgClassName,
  fgClassName,
  animated = false,
  className,
  ...props
}: CircularProgressProps) {
  const clampedProgress = clampProgress(progress);

  const isNamedSize = typeof size === 'string';
  const pixelSize = isNamedSize ? CIRCULAR_SIZE_CONFIG[size].size : size;
  const resolvedStrokeWidth =
    strokeWidth ?? (isNamedSize ? CIRCULAR_SIZE_CONFIG[size].strokeWidth : pixelSize / 10);
  const resolvedLinecap =
    strokeLinecap ?? (isNamedSize ? CIRCULAR_SIZE_CONFIG[size].strokeLinecap : 'round');

  const center = pixelSize / 2;
  const radius = Math.max(0, (pixelSize - resolvedStrokeWidth) / 2);
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - clampedProgress / 100);

  const a11yProps = label
    ? {
        role: 'progressbar' as const,
        'aria-label': label,
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': clampedProgress,
      }
    : {
        'aria-hidden': true as const,
      };

  return (
    <>
      {animated ? (
        <style href="rakfound-circular-progress" precedence="default">
          {CIRCULAR_DRAW_STYLES}
        </style>
      ) : null}
      <svg
        data-slot="circular-progress"
        width={pixelSize}
        height={pixelSize}
        viewBox={`0 0 ${pixelSize} ${pixelSize}`}
        className={cn('shrink-0 -rotate-90', className)}
        {...a11yProps}
        {...props}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={resolvedStrokeWidth}
          className={bgClassName}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={resolvedStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap={resolvedLinecap}
          style={
            animated
              ? ({
                  '--circular-progress-circumference': `${circumference}px`,
                } as CSSProperties)
              : undefined
          }
          className={cn(
            'transition-[stroke-dashoffset] duration-300 ease-in-out motion-reduce:transition-none',
            animated && 'motion-safe:animate-[rk-circular-progress-draw_280ms_var(--ease-out)]',
            fgClassName,
          )}
        />
      </svg>
    </>
  );
}

export { CircularProgress, LinearProgress };

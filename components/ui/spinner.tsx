import { useId, type ComponentProps, type CSSProperties, type Ref } from 'react';
import { Loader2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';

const GRAY_SPINNER_STYLES = `
@keyframes rk-spinner-spin-bar {
  0% { opacity: 0.3; transform: rotate(0deg); }
  50% { opacity: 1; }
  100% { opacity: 0.3; transform: rotate(360deg); }
}
`;

export interface BaseSpinnerProps
  extends Omit<ComponentProps<'svg'>, 'children' | 'width' | 'height'> {
  /** Size of the spinner in pixels. */
  size?: number;
  /** Accessible name. When set, renders with `role="status"`. Otherwise hidden from assistive technology. */
  label?: string;
}

function getSpinnerA11yProps(
  label?: string,
  ariaLabel?: string,
  ariaHidden?: boolean | 'true' | 'false',
) {
  const resolvedLabel = label ?? ariaLabel;
  if (resolvedLabel && ariaHidden !== true && ariaHidden !== 'true') {
    return {
      role: 'status' as const,
      'aria-label': resolvedLabel,
    };
  }
  return {
    'aria-hidden': true as const,
  };
}

/** Blue arc spinner for primary loading states. */
function BlueSpinner({
  size = 16,
  className,
  label,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  style,
  ...props
}: BaseSpinnerProps) {
  const a11yProps = getSpinnerA11yProps(label, ariaLabel, ariaHidden);

  return (
    <svg
      data-slot="blue-spinner"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn('mx-auto shrink-0', className)}
      style={{ width: size, height: size, ...style }}
      {...a11yProps}
      {...props}
    >
      <path
        fill="var(--color-workflow-fill-blue, #4894EE)"
        d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
        className="origin-center motion-safe:animate-[spin_0.75s_linear_infinite] motion-reduce:animate-pulse"
      />
    </svg>
  );
}

/** Eight-bar ring spinner rendered in the current text color. */
function GraySpinner({
  size = 16,
  className,
  label,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  style,
  ...props
}: BaseSpinnerProps) {
  const a11yProps = getSpinnerA11yProps(label, ariaLabel, ariaHidden);

  return (
    <>
      <style href="narakui-gray-spinner" precedence="default">
        {GRAY_SPINNER_STYLES}
      </style>
      <svg
        data-slot="gray-spinner"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('m-auto shrink-0', className)}
        style={{ width: size, height: size, ...style }}
        {...a11yProps}
        {...props}
      >
        <g className="motion-reduce:animate-pulse">
          <path
            className="origin-center motion-safe:animate-[rk-spinner-spin-bar_1.5s_linear_infinite]"
            d="M12 2v4"
          />
          <path
            className="origin-center motion-safe:animate-[rk-spinner-spin-bar_1.5s_linear_infinite]"
            d="m16.2 7.8 2.9-2.9"
          />
          <path
            className="origin-center motion-safe:animate-[rk-spinner-spin-bar_1.5s_linear_infinite]"
            d="M18 12h4"
          />
          <path
            className="origin-center motion-safe:animate-[rk-spinner-spin-bar_1.5s_linear_infinite]"
            d="m16.2 16.2 2.9 2.9"
          />
          <path
            className="origin-center motion-safe:animate-[rk-spinner-spin-bar_1.5s_linear_infinite]"
            d="M12 18v4"
          />
          <path
            className="origin-center motion-safe:animate-[rk-spinner-spin-bar_1.5s_linear_infinite]"
            d="m4.9 19.1 2.9-2.9"
          />
          <path
            className="origin-center motion-safe:animate-[rk-spinner-spin-bar_1.5s_linear_infinite]"
            d="M2 12h4"
          />
          <path
            className="origin-center motion-safe:animate-[rk-spinner-spin-bar_1.5s_linear_infinite]"
            d="m4.9 4.9 2.9 2.9"
          />
        </g>
      </svg>
    </>
  );
}

export interface GraySpinner2Props extends BaseSpinnerProps {
  /** Inline styles forwarded to the SVG (e.g., to sync animation timing). */
  style?: CSSProperties;
  /** Ref forwarded to the underlying SVG element. */
  ref?: Ref<SVGSVGElement>;
}

/** Compact gradient-head ring spinner used across loading affordances. */
function GraySpinner2({
  size = 16,
  className,
  label,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  style,
  ref,
  ...props
}: GraySpinner2Props) {
  const gradientId = useId();
  const a11yProps = getSpinnerA11yProps(label, ariaLabel, ariaHidden);

  return (
    <svg
      ref={ref}
      data-slot="gray-spinner-2"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 motion-safe:animate-[spin_0.4s_linear_infinite]', className)}
      style={style}
      {...a11yProps}
      {...props}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-fill-primary)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--color-fill-primary)" stopOpacity="1" />
        </linearGradient>
      </defs>
      <g className="motion-reduce:animate-pulse motion-reduce:[animation-delay:inherit]">
        <circle
          cx="8"
          cy="8"
          r="6.25"
          stroke="var(--color-fill-quaternary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 8 1.75 A 6.25 6.25 0 0 1 14.25 8"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

export interface CenteredSpinnerProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Size of the inner `GraySpinner2` in pixels. */
  size?: number;
  /** Accessible name applied to the wrapper with `role="status"`. */
  label?: string;
}

/** Centers a `GraySpinner2` in a full-width region with a 160px minimum height. */
function CenteredSpinner({
  size = 16,
  className,
  label,
  'aria-label': ariaLabel,
  ...props
}: CenteredSpinnerProps) {
  const resolvedLabel = label ?? ariaLabel;
  const wrapperA11yProps = resolvedLabel
    ? {
        role: 'status' as const,
        'aria-label': resolvedLabel,
      }
    : undefined;

  return (
    <div
      data-slot="centered-spinner"
      className={cn('flex h-full min-h-40 w-full items-center justify-center', className)}
      {...wrapperA11yProps}
      {...props}
    >
      <GraySpinner2 size={size} aria-hidden="true" />
    </div>
  );
}

export interface SpinnerProps extends ComponentProps<'svg'> {
  /** Accessible name. Defaults to `"Loading"` unless `aria-hidden` is set. */
  label?: string;
}

/** Inline icon spinner preserved for button, combobox, and composer loading slots. */
function Spinner({
  className,
  label,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  ...props
}: SpinnerProps) {
  const isHidden = ariaHidden === true || ariaHidden === 'true';
  const resolvedLabel = label ?? ariaLabel ?? 'Loading';

  return (
    <Loader2Icon
      data-slot="spinner"
      role={isHidden ? undefined : 'status'}
      aria-label={isHidden ? undefined : resolvedLabel}
      aria-hidden={isHidden ? true : undefined}
      className={cn('size-4 motion-safe:animate-spin motion-reduce:animate-pulse', className)}
      {...props}
    />
  );
}

export { BlueSpinner, CenteredSpinner, GraySpinner, GraySpinner2, Spinner };

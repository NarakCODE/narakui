'use client';

import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatisticType = 'number' | 'percentage';
export type StatisticChangeMode = 'value' | 'rank';

export interface StatisticProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** The numerical value to display. `null` or `undefined` shows `emptyText`. */
  value: number | null | undefined;
  /** `number` abbreviates large values with k, M or b. `percentage` multiplies the value by 100 and adds %. */
  type?: StatisticType;
  /** Colors the value by its sign and adds a plus or minus sign, or an arrow in rank mode. Values that round to zero show a dash. When off, the value renders as an absolute number. */
  showTrend?: boolean;
  /** `value` shows a plus or minus sign. `rank` shows an up or down arrow and keeps the prefix. */
  changeMode?: StatisticChangeMode;
  /** Maximum number of decimal places to display. */
  decimals?: number;
  /** Always shows exactly `decimals` fraction digits, keeping trailing zeros. */
  fixedDecimals?: boolean;
  /** Shows the full number without k, M or b abbreviation. */
  disableFormatting?: boolean;
  /** Text to display when `value` is `null` or `undefined`. */
  emptyText?: string;
  /** Text to prepend before the value. Replaced by the plus or minus sign when `showTrend` is on and `changeMode` is `value`. */
  prefix?: string;
  /** Text to append after the value. */
  suffix?: string;
  /** Whether to animate value changes. */
  animated?: boolean;
  /** Duration of the digit animation in milliseconds. */
  transformDuration?: number;
  /** Swaps green and red semantics for metrics where lower is better. */
  invertColor?: boolean;
  /** Additional CSS classes for the wrapper and the value. Replaces the default `font-medium tabular-nums` value styling. */
  className?: string;
}

interface FormattedValue {
  text: string;
  roundedMagnitude: number;
  unitSuffix: string;
}

function formatMagnitude(
  absValue: number,
  type: StatisticType,
  decimals: number,
  fixedDecimals: boolean,
  disableFormatting: boolean,
): FormattedValue {
  const safeDecimals = Math.max(0, Math.min(20, Math.floor(decimals)));

  let scaled = absValue;
  let unitSuffix = '';

  if (type === 'percentage') {
    scaled = absValue * 100;
    unitSuffix = '%';
  } else if (!disableFormatting) {
    if (absValue >= 1_000_000_000) {
      scaled = absValue / 1_000_000_000;
      unitSuffix = 'b';
    } else if (absValue >= 1_000_000) {
      scaled = absValue / 1_000_000;
      unitSuffix = 'M';
    } else if (absValue >= 1_000) {
      scaled = absValue / 1_000;
      unitSuffix = 'k';
    }
  }

  const factor = 10 ** safeDecimals;
  const roundedMagnitude = Math.round(scaled * factor) / factor;

  const formattedNumber = roundedMagnitude.toLocaleString('en-US', {
    minimumFractionDigits: fixedDecimals ? safeDecimals : 0,
    maximumFractionDigits: safeDecimals,
  });

  return {
    text: formattedNumber,
    roundedMagnitude,
    unitSuffix,
  };
}

function useAnimatedNumber(
  target: number | null | undefined,
  animated: boolean,
  duration: number,
  valueRef: React.RefObject<HTMLSpanElement | null>,
  formatDisplayText: (n: number) => string,
): number | null | undefined {
  const isValid = typeof target === 'number' && Number.isFinite(target);
  const [displayed, setDisplayed] = useState<number | null | undefined>(target);
  const currentValueRef = useRef<number | null | undefined>(target);
  const formatRef = useRef(formatDisplayText);
  formatRef.current = formatDisplayText;

  useEffect(() => {
    if (!isValid) {
      currentValueRef.current = target;
      setDisplayed(target);
      return;
    }

    const from = currentValueRef.current;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (
      !animated ||
      prefersReducedMotion ||
      duration <= 0 ||
      typeof from !== 'number' ||
      !Number.isFinite(from) ||
      from === target
    ) {
      currentValueRef.current = target;
      setDisplayed(target);
      return;
    }

    let rafId = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Cubic ease-out for crisp numeric settling.
      const eased = 1 - (1 - progress) ** 3;
      const next = from + (target - from) * eased;
      currentValueRef.current = next;

      if (progress < 1) {
        if (valueRef.current) {
          valueRef.current.textContent = formatRef.current(next);
        }
        rafId = requestAnimationFrame(tick);
      } else {
        currentValueRef.current = target;
        if (valueRef.current) {
          valueRef.current.textContent = formatRef.current(target);
        }
        setDisplayed(target);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, isValid, animated, duration, valueRef]);

  return isValid ? displayed : target;
}

/** Displays formatted numerical metrics, abbreviations, percentage changes, and rank trends. */
function Statistic({
  value,
  type = 'number',
  showTrend = true,
  changeMode = 'value',
  decimals = 1,
  fixedDecimals = false,
  disableFormatting = false,
  emptyText = 'n/a',
  prefix,
  suffix,
  animated = true,
  transformDuration = 250,
  invertColor = false,
  className,
  ...props
}: StatisticProps) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const isValidNumber =
    value !== null &&
    value !== undefined &&
    typeof value === 'number' &&
    Number.isFinite(value);

  const targetFormatted = isValidNumber
    ? formatMagnitude(
        Math.abs(value),
        type,
        decimals,
        fixedDecimals,
        disableFormatting,
      )
    : null;

  const isZeroTrend = Boolean(showTrend && targetFormatted?.roundedMagnitude === 0);
  const isPositive = Boolean(showTrend && !isZeroTrend && isValidNumber && value > 0);
  const isNegative = Boolean(showTrend && !isZeroTrend && isValidNumber && value < 0);

  const resolvedPrefix =
    showTrend && changeMode === 'value'
      ? isPositive
        ? '+'
        : isNegative
          ? '-'
          : (prefix ?? '')
      : (prefix ?? '');

  const animatedValue = useAnimatedNumber(
    value,
    animated,
    transformDuration,
    valueRef,
    (n: number) => {
      const formatted = formatMagnitude(
        Math.abs(n),
        type,
        decimals,
        fixedDecimals,
        disableFormatting,
      );
      return `${resolvedPrefix}${formatted.text}${formatted.unitSuffix}${suffix ?? ''}`;
    },
  );

  if (!isValidNumber || !targetFormatted) {
    return (
      <div
        data-slot="statistic"
        data-empty="true"
        className={cn('inline-flex items-baseline', className)}
        {...props}
      >
        <span className={cn(className ? undefined : 'font-medium', 'text-text-secondary')}>
          {emptyText}
        </span>
      </div>
    );
  }

  const renderValue =
    typeof animatedValue === 'number' && Number.isFinite(animatedValue) ? animatedValue : value;

  const currentFormatted = formatMagnitude(
    Math.abs(renderValue),
    type,
    decimals,
    fixedDecimals,
    disableFormatting,
  );

  let toneClass: string | undefined;
  if (isZeroTrend) {
    toneClass = 'text-text-secondary';
  } else if (isPositive) {
    toneClass = invertColor ? 'text-text-red' : 'text-text-green';
  } else if (isNegative) {
    toneClass = invertColor ? 'text-text-green' : 'text-text-red';
  }

  const trend = isZeroTrend
    ? 'neutral'
    : isPositive
      ? 'positive'
      : isNegative
        ? 'negative'
        : 'none';

  const valueBaseClasses = className ? cn('tabular-nums', className) : 'font-medium tabular-nums';

  if (isZeroTrend) {
    return (
      <div
        data-slot="statistic"
        data-trend={trend}
        className={cn('inline-flex items-baseline gap-0.5', className)}
        {...props}
      >
        <span className={cn(valueBaseClasses, 'overflow-clip', toneClass)}>
          <span className="flex items-center" aria-label="No change">
            –
          </span>
        </span>
      </div>
    );
  }

  const showRankArrow = showTrend && changeMode === 'rank' && (isPositive || isNegative);
  const resolvedSuffix = `${currentFormatted.unitSuffix}${suffix ?? ''}`;

  return (
    <div
      data-slot="statistic"
      data-trend={trend}
      className={cn('inline-flex items-baseline gap-0.5', className)}
      {...props}
    >
      {showRankArrow ? (
        <span aria-hidden="true" className={cn('self-center', toneClass)}>
          {isPositive ? (
            <ArrowUp className="size-[1em] shrink-0" />
          ) : (
            <ArrowDown className="size-[1em] shrink-0" />
          )}
        </span>
      ) : null}
      <span ref={valueRef} className={cn(valueBaseClasses, 'overflow-clip', toneClass)}>
        {resolvedPrefix}
        {currentFormatted.text}
        {resolvedSuffix}
      </span>
    </div>
  );
}

export { Statistic };

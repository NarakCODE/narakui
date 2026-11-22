'use client';

import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type MultiStepFormMode = 'fill' | 'uniform' | 'single';
export type MultiStepFormPresentation = 'form' | 'interactive';
export type MultiStepFormContentSizing = 'tallest' | 'active';
export type MultiStepFormShortcut = 'enter' | 'mod-enter';

export interface MultiStepFormContextValue {
  /** Zero-based index of the currently visible page. */
  step: number;
  /** Total number of derived pages (at least 1). */
  stepCount: number;
  /** Whether the user is on the first page. */
  isFirstStep: boolean;
  /** Whether the user is on the last page. */
  isLastStep: boolean;
  /** True while an async `canAdvance` or `onSubmit` promise is settling. */
  isBusy: boolean;
  /** Runs `canAdvance` and advances to the next page, or submits on the last page. */
  next: () => Promise<void>;
  /** Moves to the previous page without running `canAdvance`. */
  back: () => void;
  /** Jumps directly to a zero-based page index (clamped to valid bounds). */
  goTo: (targetStep: number) => void;
  /** Runs `canAdvance` for the current page and invokes `onSubmit`. */
  submit: () => Promise<void>;
  /** Keys of fields currently visible on the active page; empty until first measurement. */
  visibleFieldKeys: string[];
  /** Vertical gap in pixels between items on a page. */
  gap: number;
  /** Pagination strategy. */
  mode: MultiStepFormMode;
}

interface MultiStepFormInternalContextValue extends MultiStepFormContextValue {
  presentation: MultiStepFormPresentation;
  height: number | string;
  primaryDisabled: boolean;
  pages: number[][];
  hasMeasured: boolean;
  direction: 1 | -1;
  reportLayout: (pages: number[][], allFieldKeys: string[], measured: boolean) => void;
}

const MultiStepFormContext = createContext<MultiStepFormInternalContextValue | null>(null);

/** Accesses multi-step form state, pagination metadata, and navigation actions from custom chrome. */
function useMultiStepForm(): MultiStepFormContextValue {
  const ctx = useContext(MultiStepFormContext);
  if (!ctx) {
    throw new Error('useMultiStepForm must be used inside <MultiStepForm.Root>.');
  }
  return {
    step: ctx.step,
    stepCount: ctx.stepCount,
    isFirstStep: ctx.isFirstStep,
    isLastStep: ctx.isLastStep,
    isBusy: ctx.isBusy,
    next: ctx.next,
    back: ctx.back,
    goTo: ctx.goTo,
    submit: ctx.submit,
    visibleFieldKeys: ctx.visibleFieldKeys,
    gap: ctx.gap,
    mode: ctx.mode,
  };
}

function toCssLength(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

function arePagesEqual(a: number[][], b: number[][]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].length !== b[i].length) return false;
    for (let j = 0; j < a[i].length; j += 1) {
      if (a[i][j] !== b[i][j]) return false;
    }
  }
  return true;
}

function areStringArraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/** Partitions measured item heights into pages according to the chosen sizing mode. */
function computePages(
  heights: number[],
  availableHeight: number,
  gap: number,
  mode: MultiStepFormMode,
): number[][] {
  const count = heights.length;
  if (count === 0) return [];

  if (mode === 'single') {
    return heights.map((_, index) => [index]);
  }

  if (availableHeight <= 0) {
    return [heights.map((_, index) => index)];
  }

  if (mode === 'uniform') {
    const maxItemHeight = Math.max(...heights, 1);
    const maxPerPage = Math.max(
      1,
      Math.floor((availableHeight + gap) / (maxItemHeight + gap)),
    );
    const pageCount = Math.ceil(count / maxPerPage);
    const baseSize = Math.floor(count / pageCount);
    const remainder = count % pageCount;

    const pages: number[][] = [];
    let cursor = 0;
    for (let p = 0; p < pageCount; p += 1) {
      const size = baseSize + (p < remainder ? 1 : 0);
      const page: number[] = [];
      for (let k = 0; k < size; k += 1) {
        page.push(cursor);
        cursor += 1;
      }
      pages.push(page);
    }
    return pages;
  }

  // Default: 'fill' — greedily pack as many items as fit per page.
  const pages: number[][] = [];
  let currentPage: number[] = [];
  let currentHeight = 0;

  for (let i = 0; i < count; i += 1) {
    const itemHeight = heights[i];
    if (currentPage.length === 0) {
      currentPage = [i];
      currentHeight = itemHeight;
    } else if (currentHeight + gap + itemHeight <= availableHeight) {
      currentPage.push(i);
      currentHeight += gap + itemHeight;
    } else {
      pages.push(currentPage);
      currentPage = [i];
      currentHeight = itemHeight;
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}

export interface MultiStepFormRootProps
  extends Omit<ComponentProps<'div'>, 'onSubmit'> {
  /** Outer frame height in pixels or CSS length. Only `mode="single"` accepts `"auto"`. */
  height?: number | string;
  /** Minimum outer height (useful with `height="auto"`). */
  minHeight?: number | string;
  /** Maximum outer height (useful with `height="auto"`). */
  maxHeight?: number | string;
  /** Vertical gap in pixels between items on a page. */
  gap?: number;
  /** How fields are distributed across pages. */
  mode?: MultiStepFormMode;
  /** Controlled zero-based active page index. */
  step?: number;
  /** Initial zero-based active page index when uncontrolled. */
  defaultStep?: number;
  /** Called whenever the active page changes. */
  onStepChange?: (step: number) => void;
  /** Invoked when submitting from the final page. Returning a promise keeps the form busy until settled. */
  onSubmit?: () => void | Promise<void>;
  /** Gate evaluated before advancing from a page. Return `false` (or a promise resolving to `false`) to block. */
  canAdvance?: (step: number, fieldKeys: string[]) => boolean | Promise<boolean>;
  /** Frame style: bordered card (`form`) or borderless composer slot (`interactive`). */
  presentation?: MultiStepFormPresentation;
  /** Enables keyboard shortcut (`enter` or `mod-enter`) for running the primary action. */
  primaryShortcut?: (
    fieldKeys: string[],
    isLastStep: boolean,
  ) => MultiStepFormShortcut | undefined;
  /** Disables the keyboard primary shortcut and primary action. */
  primaryDisabled?: boolean;
}

/** Root container that owns fixed height, auto-measured page state, and advance validation gates. */
function MultiStepFormRoot({
  height = 'min(28rem, 70vh)',
  minHeight,
  maxHeight,
  gap = 8,
  mode = 'fill',
  step: controlledStep,
  defaultStep = 0,
  onStepChange,
  onSubmit,
  canAdvance,
  presentation = 'form',
  primaryShortcut,
  primaryDisabled = false,
  className,
  style,
  onKeyDown,
  children,
  ...props
}: MultiStepFormRootProps) {
  const isControlled = controlledStep !== undefined;
  const [uncontrolledStep, setUncontrolledStep] = useState(defaultStep);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isBusy, setIsBusy] = useState(false);
  const [layoutState, setLayoutState] = useState<{
    pages: number[][];
    allFieldKeys: string[];
    hasMeasured: boolean;
  }>({
    pages: [],
    allFieldKeys: [],
    hasMeasured: false,
  });

  const stepCount = Math.max(1, layoutState.pages.length);
  const rawStep = isControlled ? controlledStep : uncontrolledStep;
  const step = Math.min(Math.max(0, rawStep), stepCount - 1);
  const isFirstStep = step === 0;
  const isLastStep = step >= stepCount - 1;

  const setStepValue = useCallback(
    (nextStep: number) => {
      const clamped = Math.min(Math.max(0, nextStep), Math.max(0, stepCount - 1));
      setDirection(clamped >= step ? 1 : -1);
      if (!isControlled) {
        setUncontrolledStep(clamped);
      }
      if (clamped !== step) {
        onStepChange?.(clamped);
      }
    },
    [isControlled, onStepChange, step, stepCount],
  );

  // Clamp uncontrolled step if container height changes and shrinks page count.
  useEffect(() => {
    if (!isControlled && uncontrolledStep > stepCount - 1) {
      setUncontrolledStep(Math.max(0, stepCount - 1));
    }
  }, [isControlled, stepCount, uncontrolledStep]);

  const reportLayout = useCallback(
    (nextPages: number[][], nextFieldKeys: string[], measured: boolean) => {
      setLayoutState((prev) => {
        if (
          prev.hasMeasured === measured &&
          arePagesEqual(prev.pages, nextPages) &&
          areStringArraysEqual(prev.allFieldKeys, nextFieldKeys)
        ) {
          return prev;
        }
        return {
          pages: nextPages,
          allFieldKeys: nextFieldKeys,
          hasMeasured: measured,
        };
      });
    },
    [],
  );

  const visibleFieldKeys = useMemo(() => {
    if (!layoutState.hasMeasured) return [];
    const activeIndices = layoutState.pages[step] ?? [];
    return activeIndices
      .map((index) => layoutState.allFieldKeys[index])
      .filter((key): key is string => key !== undefined);
  }, [layoutState, step]);

  const runGate = useCallback(async () => {
    if (!canAdvance) return true;
    const result = canAdvance(step, visibleFieldKeys);
    if (result instanceof Promise) {
      setIsBusy(true);
      try {
        return await result;
      } finally {
        setIsBusy(false);
      }
    }
    return result;
  }, [canAdvance, step, visibleFieldKeys]);

  const runSubmit = useCallback(async () => {
    if (!onSubmit) return;
    const result = onSubmit();
    if (result instanceof Promise) {
      setIsBusy(true);
      try {
        await result;
      } finally {
        setIsBusy(false);
      }
    }
  }, [onSubmit]);

  const submit = useCallback(async () => {
    if (isBusy) return;
    const allowed = await runGate();
    if (!allowed) return;
    await runSubmit();
  }, [isBusy, runGate, runSubmit]);

  const next = useCallback(async () => {
    if (isBusy) return;
    const allowed = await runGate();
    if (!allowed) return;
    if (isLastStep) {
      await runSubmit();
    } else {
      setStepValue(step + 1);
    }
  }, [isBusy, isLastStep, runGate, runSubmit, setStepValue, step]);

  const back = useCallback(() => {
    if (isBusy || isFirstStep) return;
    setStepValue(step - 1);
  }, [isBusy, isFirstStep, setStepValue, step]);

  const goTo = useCallback(
    (targetStep: number) => {
      if (isBusy) return;
      setStepValue(targetStep);
    },
    [isBusy, setStepValue],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || primaryDisabled || isBusy || !primaryShortcut) {
      return;
    }

    const shortcut = primaryShortcut(visibleFieldKeys, isLastStep);
    if (!shortcut) return;

    const target = event.target as HTMLElement | null;
    const isTextarea = target?.tagName === 'TEXTAREA';

    if (
      shortcut === 'mod-enter' &&
      event.key === 'Enter' &&
      (event.metaKey || event.ctrlKey)
    ) {
      event.preventDefault();
      void next();
    } else if (
      shortcut === 'enter' &&
      event.key === 'Enter' &&
      !event.shiftKey &&
      !isTextarea
    ) {
      event.preventDefault();
      void next();
    }
  };

  const resolvedHeight =
    height === 'auto' && mode !== 'single' ? 'min(28rem, 70vh)' : height;

  const frameStyle: CSSProperties = {
    height: toCssLength(resolvedHeight),
    minHeight: toCssLength(minHeight),
    maxHeight: toCssLength(maxHeight),
    ...style,
  };

  const contextValue = useMemo<MultiStepFormInternalContextValue>(
    () => ({
      step,
      stepCount,
      isFirstStep,
      isLastStep,
      isBusy,
      next,
      back,
      goTo,
      submit,
      visibleFieldKeys,
      gap,
      mode,
      presentation,
      height: resolvedHeight,
      primaryDisabled,
      pages: layoutState.pages,
      hasMeasured: layoutState.hasMeasured,
      direction,
      reportLayout,
    }),
    [
      back,
      direction,
      gap,
      goTo,
      isBusy,
      isFirstStep,
      isLastStep,
      layoutState.hasMeasured,
      layoutState.pages,
      mode,
      next,
      presentation,
      primaryDisabled,
      reportLayout,
      resolvedHeight,
      step,
      stepCount,
      submit,
      visibleFieldKeys,
    ],
  );

  return (
    <MultiStepFormContext.Provider value={contextValue}>
      <div
        data-slot="multi-step-form"
        data-mode={mode}
        data-presentation={presentation}
        onKeyDown={handleKeyDown}
        style={frameStyle}
        className={cn(
          'flex min-h-0 flex-col overflow-hidden text-text-primary',
          presentation === 'form'
            ? 'rounded-lg border border-fill-quaternary bg-bg-base'
            : 'rounded-[inherit] bg-bg-primary',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </MultiStepFormContext.Provider>
  );
}

/** Fixed header region subtracted from usable paged content height. */
function MultiStepFormHeader({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      data-slot="multi-step-form-header"
      className={cn('shrink-0 px-3 pt-3 pb-2', className)}
      {...props}
    />
  );
}

/** Fixed footer region subtracted from usable paged content height. */
function MultiStepFormFooter({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      data-slot="multi-step-form-footer"
      className={cn(
        'flex shrink-0 items-center justify-between gap-2 px-3 pt-2 pb-3',
        className,
      )}
      {...props}
    />
  );
}

export interface MultiStepFormItemProps extends ComponentProps<'div'> {
  /** Stable identifier reported in `canAdvance(step, fieldKeys)` and `visibleFieldKeys`. */
  fieldKey?: string;
}

/** Indivisible field wrapper grouping a label, control, and feedback so page splits never bisect them. */
function MultiStepFormItem({
  fieldKey,
  className,
  ...props
}: MultiStepFormItemProps) {
  return (
    <div
      data-slot="multi-step-form-item"
      data-field-key={fieldKey}
      className={cn('flex min-w-0 flex-col gap-2 rounded-md p-2', className)}
      {...props}
    />
  );
}

export interface MultiStepFormContentProps extends ComponentProps<'div'> {
  /** Height strategy when `height="auto"` on `mode="single"`: reserve tallest item or follow active item. */
  sizing?: MultiStepFormContentSizing;
}

/** Scrollable paged content area that measures every direct child and distributes them across steps. */
function MultiStepFormContent({
  sizing,
  className,
  style,
  children,
  ...props
}: MultiStepFormContentProps) {
  const ctx = useContext(MultiStepFormContext);
  if (!ctx) {
    throw new Error('MultiStepForm.Content must be used inside <MultiStepForm.Root>.');
  }

  const bodyRef = useRef<HTMLDivElement | null>(null);
  const regionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [measuredAutoHeight, setMeasuredAutoHeight] = useState<number | undefined>(
    undefined,
  );

  const items = Children.toArray(children);
  const fieldKeys = items.map((child, index) => {
    if (isValidElement(child)) {
      const childProps = child.props as { fieldKey?: unknown };
      if (typeof childProps.fieldKey === 'string' && childProps.fieldKey.length > 0) {
        return childProps.fieldKey;
      }
      if (child.key !== null && child.key !== undefined) {
        return String(child.key);
      }
    }
    return String(index);
  });

  const fieldKeysSignature = fieldKeys.join('\u0000');
  const resolvedSizing: MultiStepFormContentSizing =
    sizing ?? (ctx.presentation === 'interactive' ? 'active' : 'tallest');

  const measure = useCallback(() => {
    const bodyEl = bodyRef.current;
    if (!bodyEl) return;

    const heights = items.map((_, index) => {
      const regionEl = regionRefs.current[index];
      if (!regionEl) return 0;
      return Math.ceil(regionEl.getBoundingClientRect().height);
    });

    const availableHeight = bodyEl.clientHeight;
    const nextPages = computePages(heights, availableHeight, ctx.gap, ctx.mode);
    ctx.reportLayout(nextPages, fieldKeys, true);

    if (ctx.height === 'auto' && ctx.mode === 'single') {
      if (resolvedSizing === 'tallest') {
        const tallest = Math.max(...heights, 0);
        setMeasuredAutoHeight(tallest > 0 ? tallest : undefined);
      } else {
        const activeHeight = heights[ctx.step] ?? 0;
        setMeasuredAutoHeight(activeHeight > 0 ? activeHeight : undefined);
      }
    } else {
      setMeasuredAutoHeight(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.gap, ctx.height, ctx.mode, ctx.reportLayout, ctx.step, fieldKeysSignature, resolvedSizing]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const bodyEl = bodyRef.current;
    if (!bodyEl || typeof ResizeObserver === 'undefined') return;

    let frameId: number | null = null;
    const scheduleMeasure = () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        frameId = null;
        measure();
      });
    };

    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(bodyEl);
    regionRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [measure, items.length]);

  const activeIndices = useMemo(() => {
    if (!ctx.hasMeasured) {
      return new Set(items.map((_, index) => index));
    }
    return new Set(ctx.pages[ctx.step] ?? []);
  }, [ctx.hasMeasured, ctx.pages, ctx.step, items]);

  const trackStyle: CSSProperties = {
    rowGap: `${ctx.gap}px`,
    ...(ctx.height === 'auto' && ctx.mode === 'single' && measuredAutoHeight !== undefined
      ? resolvedSizing === 'tallest'
        ? { minHeight: `${measuredAutoHeight}px` }
        : { height: `${measuredAutoHeight}px` }
      : {}),
  };

  return (
    <div
      ref={bodyRef}
      data-slot="interactive-slot-body"
      style={style}
      className={cn(
        'scrollbar-custom flex min-h-0 flex-1 flex-col overflow-y-auto px-1',
        className,
      )}
      {...props}
    >
      <div
        data-slot="interactive-slot-track"
        style={trackStyle}
        className={cn(
          'relative flex shrink-0 flex-col [contain:layout_style]',
          ctx.height === 'auto' &&
            ctx.mode === 'single' &&
            resolvedSizing === 'active' &&
            'overflow-hidden transition-[height] duration-200 ease-out motion-reduce:transition-none',
        )}
      >
        {items.map((child, index) => {
          const reactKey =
            isValidElement(child) && child.key !== null
              ? String(child.key)
              : `item-${index}`;
          const isActive = activeIndices.has(index);
          const isInteractive = ctx.presentation === 'interactive';

          return (
            <div
              key={reactKey}
              ref={(node) => {
                regionRefs.current[index] = node;
              }}
              data-slot="interactive-slot-step-region"
              data-active={isActive ? 'true' : undefined}
              aria-hidden={!isActive || undefined}
              inert={!isActive ? true : undefined}
              className={cn(
                'relative shrink-0 transition-[opacity,filter] duration-200 ease-out motion-reduce:transition-none',
                isActive
                  ? 'opacity-100 blur-none'
                  : isInteractive
                    ? 'pointer-events-none absolute inset-x-0 bottom-0 opacity-0 blur-[1px]'
                    : 'pointer-events-none invisible absolute inset-x-0 top-0 opacity-0',
              )}
            >
              <div
                data-slot="interactive-slot-step-content"
                className={cn(
                  isInteractive &&
                    'transition-transform duration-200 ease-out motion-reduce:transition-none',
                  isInteractive &&
                    (isActive
                      ? 'translate-x-0'
                      : ctx.direction >= 0
                        ? 'translate-x-3'
                        : '-translate-x-3'),
                )}
              >
                {child as ReactElement}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface MultiStepFormBackProps extends Omit<ComponentProps<typeof Button>, 'mode' | 'size'> {
  /** Keeps the Back button visible (disabled) on the first page. */
  showOnFirstStep?: boolean;
}

/** Back navigation control. Hidden automatically on single-page forms and page one unless `showOnFirstStep` is set. */
function MultiStepFormBack({
  showOnFirstStep = false,
  disabled,
  className,
  children = 'Back',
  onClick,
  ...props
}: MultiStepFormBackProps) {
  const { stepCount, isFirstStep, isBusy, back } = useMultiStepForm();

  if (stepCount <= 1) return null;
  if (isFirstStep && !showOnFirstStep) return null;

  return (
    <Button
      type="button"
      mode="ghost"
      size="small"
      disabled={isFirstStep || isBusy || disabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          back();
        }
      }}
      className={cn('rounded-full px-3 text-text-secondary', className)}
      {...props}
    >
      {children}
    </Button>
  );
}

export interface MultiStepFormNextProps extends Omit<ComponentProps<typeof Button>, 'mode' | 'size'> {
  /** Label rendered on the final page instead of `children`. */
  submitLabel?: ReactNode;
  /** Trailing adornment rendered inside the button, such as a `<Kbd>`. */
  hint?: ReactNode;
}

/** Primary step button: displays `Next` on earlier pages and `submitLabel` on the final page. */
function MultiStepFormNext({
  submitLabel = 'Submit',
  hint,
  disabled = false,
  className,
  children = 'Next',
  onClick,
  ...props
}: MultiStepFormNextProps) {
  const ctx = useContext(MultiStepFormContext);
  if (!ctx) {
    throw new Error('MultiStepForm.Next must be used inside <MultiStepForm.Root>.');
  }

  const isDisabled = disabled || ctx.primaryDisabled || ctx.isBusy;

  return (
    <Button
      type="button"
      mode="primary"
      size="small"
      data-slot-primary-action="true"
      disabled={isDisabled}
      loading={{ isLoading: ctx.isBusy }}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          void ctx.next();
        }
      }}
      className={cn(
        'rounded-full bg-fill-primary px-3 text-text-inverse shadow-low hover:bg-fill-primary-hover',
        className,
      )}
      {...props}
    >
      <span className="inline-flex items-center gap-1">
        <span>{ctx.isLastStep ? submitLabel : children}</span>
        {hint}
      </span>
    </Button>
  );
}

/** Default footer action bar pairing `Back` and `Next`/`Submit`. Pass children to replace the default controls. */
function MultiStepFormActions({
  className,
  children,
  ...props
}: ComponentProps<'div'>) {
  const { stepCount, isFirstStep } = useMultiStepForm();

  if (children !== undefined) {
    return (
      <div
        data-slot="multi-step-form-actions"
        className={cn('flex w-full items-center justify-between gap-2', className)}
        {...props}
      >
        {children}
      </div>
    );
  }

  const showBack = stepCount > 1 && !isFirstStep;

  return (
    <div
      data-slot="multi-step-form-actions"
      className={cn('flex w-full items-center justify-between gap-2', className)}
      {...props}
    >
      {showBack ? <MultiStepFormBack /> : <span />}
      <MultiStepFormNext />
    </div>
  );
}

export interface MultiStepFormCounterProps extends ComponentProps<'span'> {
  /** Custom formatter receiving the 1-based step and total step count. */
  format?: (step: number, stepCount: number) => string;
  /** Renders the counter even when the form fits on a single page. */
  showWhenSingleStep?: boolean;
}

/** Compact step readout (`2 of 5`) that hides automatically on single-page forms. */
function MultiStepFormCounter({
  format,
  showWhenSingleStep = false,
  className,
  ...props
}: MultiStepFormCounterProps) {
  const { step, stepCount } = useMultiStepForm();

  if (stepCount <= 1 && !showWhenSingleStep) {
    return null;
  }

  const label = format
    ? format(step + 1, stepCount)
    : `${step + 1} of ${stepCount}`;

  return (
    <span
      data-slot="multi-step-form-counter"
      className={cn(
        'shrink-0 text-body-mini-regular text-text-tertiary tabular-nums',
        className,
      )}
      {...props}
    >
      {label}
    </span>
  );
}

/** Hairline progress bar indicating step completion. Hides automatically on single-page forms. */
function MultiStepFormProgress({
  className,
  ...props
}: ComponentProps<'div'>) {
  const { step, stepCount } = useMultiStepForm();

  if (stepCount <= 1) {
    return null;
  }

  const percentage = Math.min(100, Math.max(0, ((step + 1) / stepCount) * 100));

  return (
    <div
      data-slot="multi-step-form-progress"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={stepCount}
      aria-valuenow={step + 1}
      className={cn(
        'h-0.5 w-full overflow-hidden rounded-full bg-fill-quinary',
        className,
      )}
      {...props}
    >
      <div
        style={{ transform: `scaleX(${percentage / 100})` }}
        className="h-full w-full origin-left rounded-full bg-fill-primary transition-transform duration-150 ease-out motion-reduce:transition-none"
      />
    </div>
  );
}

const MultiStepForm = {
  Root: MultiStepFormRoot,
  Header: MultiStepFormHeader,
  Footer: MultiStepFormFooter,
  Content: MultiStepFormContent,
  Item: MultiStepFormItem,
  Actions: MultiStepFormActions,
  Back: MultiStepFormBack,
  Next: MultiStepFormNext,
  Counter: MultiStepFormCounter,
  Progress: MultiStepFormProgress,
};

export {
  MultiStepForm,
  MultiStepFormRoot,
  MultiStepFormHeader,
  MultiStepFormFooter,
  MultiStepFormContent,
  MultiStepFormItem,
  MultiStepFormActions,
  MultiStepFormBack,
  MultiStepFormNext,
  MultiStepFormCounter,
  MultiStepFormProgress,
  useMultiStepForm,
};

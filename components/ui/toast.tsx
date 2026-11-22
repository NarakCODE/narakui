'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { CheckCircle2, TriangleAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export const DEFAULT_TOAST_DURATION = 3500;

export type ToastType = 'success' | 'warning' | 'default' | 'progress' | 'loading';
export type ToastActionPlacement = 'stacked' | 'inline';
export type ToastDescriptionLineClamp = 2 | 5 | 'none';

export interface ToastOptions {
  /** Custom identifier for the toast (auto-generated if omitted). */
  id?: string;
  /** The main title of the toast. Without it, the description becomes the title, or a default title for the type is used. */
  heading?: string;
  /** The description text of the toast notification. */
  description?: string;
  /** Duration in milliseconds before the toast auto-dismisses (0 = persistent). Ignored for progress and loading toasts. */
  duration?: number;
  /** The type of toast notification. The toast methods set it for you. */
  type?: ToastType;
  /** Label for the action button. Shown only together with `onAction`. */
  actionLabel?: string;
  /** Callback fired when the action button is clicked. The toast closes after it runs. */
  onAction?: () => void;
  /** Where the action button sits when there is a description: under it, or beside the text. */
  actionPlacement?: ToastActionPlacement;
  /** Callback fired when the person closes the toast with the close button or a swipe. */
  onDismiss?: () => void;
  /** Progress value (0–100) for progress toasts. The bar shows only with a description. */
  progress?: number;
  /** Custom icon to display in the toast. Pass `null` to hide the icon of the type. */
  icon?: ReactNode;
  /** How many lines of description copy to show. */
  descriptionLineClamp?: ToastDescriptionLineClamp;
  /** Masks the toast's text in session replay. */
  'data-dd-privacy'?: 'mask';
}

export interface ToastRecord extends ToastOptions {
  id: string;
  type: ToastType;
  heading: string;
  createdAt: number;
  expiresAt?: number;
  closing?: boolean;
}

const DEFAULT_HEADINGS: Record<ToastType, string> = {
  default: 'Notification',
  loading: 'Loading',
  progress: 'In progress',
  success: 'Success',
  warning: 'Warning',
};

let idCounter = 0;
let toastsState: ToastRecord[] = [];
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ToastRecord[] {
  return toastsState;
}

const EMPTY_SNAPSHOT: ToastRecord[] = [];
function getServerSnapshot(): ToastRecord[] {
  return EMPTY_SNAPSHOT;
}

function generateToastId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  idCounter += 1;
  return `toast-${Date.now().toString(36)}-${idCounter.toString(36)}`;
}

function resolveHeading(options: ToastOptions, type: ToastType): string {
  const trimmedHeading = options.heading?.trim();
  if (trimmedHeading) return trimmedHeading;
  if (type === 'progress') return DEFAULT_HEADINGS.progress;
  const trimmedDescription = options.description?.trim();
  return trimmedDescription || DEFAULT_HEADINGS[type];
}

function addToastRecord(options: ToastOptions): string {
  const type: ToastType = options.type ?? 'default';
  const id = options.id ?? generateToastId();
  const createdAt = Date.now();
  const isPersistentType = type === 'progress' || type === 'loading';
  const duration = isPersistentType
    ? undefined
    : (options.duration ?? DEFAULT_TOAST_DURATION);
  const expiresAt = duration && duration > 0 ? createdAt + duration : undefined;
  const heading = resolveHeading(options, type);
  const promotedDescription =
    type !== 'progress' && !options.heading?.trim() && Boolean(options.description?.trim());
  const description = promotedDescription ? undefined : options.description;

  const nextRecord: ToastRecord = {
    ...options,
    id,
    type,
    heading,
    description,
    duration,
    progress: type === 'progress' ? (options.progress ?? 0) : options.progress,
    createdAt,
    expiresAt,
    closing: false,
  };

  const existingIndex = toastsState.findIndex((item) => item.id === id);
  if (existingIndex >= 0) {
    toastsState = toastsState.map((item, idx) =>
      idx === existingIndex ? nextRecord : item,
    );
  } else {
    toastsState = [...toastsState, nextRecord];
  }
  emitChange();
  return id;
}

function removeToastRecord(id: string) {
  const next = toastsState.filter((item) => item.id !== id);
  if (next.length !== toastsState.length) {
    toastsState = next;
    emitChange();
  }
}

function markToastClosing(id: string) {
  let changed = false;
  toastsState = toastsState.map((item) => {
    if (item.id === id && !item.closing) {
      changed = true;
      return { ...item, closing: true };
    }
    return item;
  });
  if (changed) {
    emitChange();
    window.setTimeout(() => removeToastRecord(id), 400);
  }
}

function updateProgressRecord(id: string, progress: number, message?: string) {
  const clamped = Math.max(0, Math.min(100, progress));
  let changed = false;
  toastsState = toastsState.map((item) => {
    if (item.id !== id) return item;
    const nextDescription = message ?? item.description;
    if (item.progress === clamped && item.description === nextDescription) {
      return item;
    }
    changed = true;
    return { ...item, progress: clamped, description: nextDescription };
  });
  if (changed) {
    emitChange();
  }
}

export interface ToastApi {
  (options: ToastOptions): string;
  default: (options: ToastOptions) => string;
  success: (options: ToastOptions) => string;
  warning: (options: ToastOptions) => string;
  loading: (options: ToastOptions) => string;
  progress: (options: ToastOptions) => string;
  dismiss: (toastId: string) => void;
  updateProgress: (toastId: string, progress: number, message?: string) => void;
}

/** Imperative toast controller usable from anywhere without hooks or context. */
export const toast: ToastApi = Object.assign(
  (options: ToastOptions) => addToastRecord({ ...options }),
  {
    default: (options: ToastOptions) => addToastRecord({ ...options, type: 'default' }),
    success: (options: ToastOptions) => addToastRecord({ ...options, type: 'success' }),
    warning: (options: ToastOptions) => addToastRecord({ ...options, type: 'warning' }),
    loading: (options: ToastOptions) => addToastRecord({ ...options, type: 'loading' }),
    progress: (options: ToastOptions) =>
      addToastRecord({ ...options, type: 'progress', progress: options.progress ?? 0 }),
    dismiss: (toastId: string) => {
      if (typeof window === 'undefined') {
        removeToastRecord(toastId);
        return;
      }
      markToastClosing(toastId);
    },
    updateProgress: (toastId: string, progress: number, message?: string) =>
      updateProgressRecord(toastId, progress, message),
  },
);

/** Alias of `toast` for callers expecting `showToast`. */
export const showToast = toast;

/** Returns the Rakfound toast API (`toast.success`, `toast.warning`, `toast.progress`, etc.). */
export function useToast(): ToastApi {
  return toast;
}

// Singleton host registry so mounting multiple `<ToastRenderer />` instances never duplicates notifications.
let nextRendererId = 1;
const mountedRenderers: number[] = [];
const rendererListeners = new Set<() => void>();

function notifyRenderers() {
  for (const listener of rendererListeners) {
    listener();
  }
}

function useIsPrimaryToastRenderer(): boolean {
  const idRef = useRef<number | null>(null);
  if (idRef.current === null) {
    idRef.current = nextRendererId++;
  }
  const myId = idRef.current;

  const [isPrimary, setIsPrimary] = useState(false);

  useEffect(() => {
    mountedRenderers.push(myId);
    const update = () => setIsPrimary(mountedRenderers[0] === myId);
    rendererListeners.add(update);
    notifyRenderers();

    return () => {
      rendererListeners.delete(update);
      const idx = mountedRenderers.indexOf(myId);
      if (idx >= 0) mountedRenderers.splice(idx, 1);
      notifyRenderers();
    };
  }, [myId]);

  return isPrimary;
}

function ToastTypeIcon({
  type,
  customIcon,
}: {
  type: ToastType;
  customIcon?: ReactNode;
}) {
  if (customIcon === null) return null;
  if (customIcon !== undefined) {
    return (
      <div className="flex h-5 shrink-0 items-center justify-center [&>svg]:size-4">
        {customIcon}
      </div>
    );
  }
  if (type === 'success') {
    return (
      <div className="flex h-5 shrink-0 items-center justify-center">
        <CheckCircle2 aria-hidden="true" className="size-4 text-fill-green" />
      </div>
    );
  }
  if (type === 'warning') {
    return (
      <div className="flex h-5 shrink-0 items-center justify-center">
        <TriangleAlert aria-hidden="true" className="size-4 text-fill-orange" />
      </div>
    );
  }
  if (type === 'loading') {
    return (
      <div className="flex h-5 shrink-0 items-center justify-center">
        <Spinner className="size-4 text-fill-secondary" />
      </div>
    );
  }
  return null;
}

function ToastBody({
  toastItem,
  onRunAction,
}: {
  toastItem: ToastRecord;
  onRunAction?: () => void;
}) {
  const {
    type,
    heading,
    description,
    actionLabel,
    actionPlacement = 'stacked',
    progress = 0,
    descriptionLineClamp = 2,
  } = toastItem;

  if (type === 'progress') {
    const pct = Math.round(progress);
    return (
      <>
        {heading ? (
          <div className="w-full truncate text-body-regular-medium text-text-primary">
            {heading}
          </div>
        ) : null}
        {description ? (
          <div className="flex w-full flex-col gap-2">
            <div className="flex w-full items-center justify-between gap-2">
              <span className="min-w-0 flex-1 truncate text-body-small-regular text-text-secondary">
                {description}
              </span>
              <span className="shrink-0 text-body-regular-medium text-text-primary tabular-nums">
                {pct}%
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-fill-quaternary"
            >
              <div
                className="h-full w-full origin-left rounded-full bg-fill-blue transition-transform duration-150 ease-out motion-reduce:transition-none"
                style={{ transform: `scaleX(${pct / 100})` }}
              />
            </div>
          </div>
        ) : null}
      </>
    );
  }

  const hasAction = Boolean(actionLabel && onRunAction);
  const descriptionNode = description ? (
    <span
      className={cn(
        'w-full text-body-small-regular text-text-secondary',
        descriptionLineClamp === 2 && 'line-clamp-2',
        descriptionLineClamp === 5 && 'line-clamp-5',
      )}
    >
      {description}
    </span>
  ) : null;

  if (hasAction && !description) {
    return (
      <div className="flex w-full items-center gap-3">
        <div className="min-w-0 flex-1 truncate text-body-regular-medium text-text-primary">
          {heading}
        </div>
        <Button
          mode="secondary"
          size="micro"
          className="shrink-0"
          onClick={onRunAction}
        >
          {actionLabel}
        </Button>
      </div>
    );
  }

  if (hasAction && actionPlacement === 'inline') {
    return (
      <div className="flex w-full items-center gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="w-full wrap-break-word text-body-regular-medium text-text-primary">
            {heading}
          </div>
          {descriptionNode}
        </div>
        <Button
          mode="ghost"
          size="micro"
          className="shrink-0"
          onClick={onRunAction}
        >
          {actionLabel}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="w-full wrap-break-word text-body-regular-medium text-text-primary">
        {heading}
      </div>
      {descriptionNode}
      {hasAction ? (
        <Button
          mode="secondary"
          size="micro"
          className="mt-2"
          onClick={onRunAction}
        >
          {actionLabel}
        </Button>
      ) : null}
    </>
  );
}

interface ToastCardProps {
  toastItem: ToastRecord;
  index: number;
  totalToasts: number;
  isExpanded: boolean;
  isHovered: boolean;
  isFront: boolean;
  frontToastHeight: number;
  toastsHeightBefore: number;
  onMouseEnter: () => void;
  onMouseLeave: (event: MouseEvent<HTMLLIElement>) => void;
  onHeightUpdate: (id: string, height: number) => void;
}

const SWIPE_DISMISS_DISTANCE = 56;
const SWIPE_DISMISS_VELOCITY = 0.11;

function ToastCard({
  toastItem,
  index,
  totalToasts,
  isExpanded,
  isHovered,
  isFront,
  frontToastHeight,
  toastsHeightBefore,
  onMouseEnter,
  onMouseLeave,
  onHeightUpdate,
}: ToastCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [localExiting, setLocalExiting] = useState(false);
  const [naturalHeight, setNaturalHeight] = useState(0);
  const [swipeX, setSwipeX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const itemRef = useRef<HTMLLIElement>(null);
  const dismissedRef = useRef(false);
  const dragStartRef = useRef<{ x: number; time: number } | null>(null);
  const swipeXRef = useRef(0);
  const isSwipingRef = useRef(false);
  const poseRef = useRef<{ translateY: string; scale: number }>({
    translateY: '0px',
    scale: 1,
  });

  const remainingMsRef = useRef<number>(
    toastItem.duration ?? DEFAULT_TOAST_DURATION,
  );
  const timerStartedAtRef = useRef<number | null>(null);
  const autoCloseTimerRef = useRef<number | null>(null);
  const removeTimerRef = useRef<number | null>(null);

  const isExiting = localExiting || Boolean(toastItem.closing);

  const contentSignature = `${toastItem.heading}\n${toastItem.description ?? ''}\n${toastItem.descriptionLineClamp ?? 2}\n${toastItem.actionLabel ?? ''}`;

  useLayoutEffect(() => {
    const node = itemRef.current;
    if (!node) return;
    const height = node.getBoundingClientRect().height;
    setNaturalHeight(height);
    onHeightUpdate(toastItem.id, height);
  }, [toastItem.id, onHeightUpdate, contentSignature]);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => setIsMounted(true));
    const enterTimer = window.setTimeout(() => setIsEntering(false), 420);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(enterTimer);
    };
  }, []);

  useEffect(() => {
    remainingMsRef.current = toastItem.duration ?? DEFAULT_TOAST_DURATION;
  }, [toastItem.duration, toastItem.type, toastItem.heading, toastItem.description]);

  const startRemove = useCallback(() => {
    if (autoCloseTimerRef.current !== null) {
      window.clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    setLocalExiting(true);
    if (removeTimerRef.current === null) {
      removeTimerRef.current = window.setTimeout(() => {
        removeToastRecord(toastItem.id);
      }, 400);
    }
  }, [toastItem.id]);

  useEffect(() => {
    return () => {
      if (autoCloseTimerRef.current !== null) {
        window.clearTimeout(autoCloseTimerRef.current);
      }
      if (removeTimerRef.current !== null) {
        window.clearTimeout(removeTimerRef.current);
      }
    };
  }, []);

  const pauseTimer = useCallback(() => {
    if (autoCloseTimerRef.current !== null) {
      window.clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    if (timerStartedAtRef.current !== null) {
      const elapsed = Date.now() - timerStartedAtRef.current;
      remainingMsRef.current = Math.max(0, remainingMsRef.current - elapsed);
      timerStartedAtRef.current = null;
    }
  }, []);

  const resumeTimer = useCallback(() => {
    if (
      !toastItem.expiresAt ||
      toastItem.type === 'progress' ||
      toastItem.type === 'loading' ||
      isExiting
    ) {
      return;
    }
    if (remainingMsRef.current <= 0) {
      startRemove();
      return;
    }
    if (autoCloseTimerRef.current !== null) {
      window.clearTimeout(autoCloseTimerRef.current);
    }
    timerStartedAtRef.current = Date.now();
    autoCloseTimerRef.current = window.setTimeout(
      startRemove,
      remainingMsRef.current,
    );
  }, [toastItem.expiresAt, toastItem.type, isExiting, startRemove]);

  // Pause timers on hover, stack expansion, swipe, or hidden tab.
  useEffect(() => {
    const syncTimer = () => {
      if (isExpanded || isHovered || isSwiping || document.hidden) {
        pauseTimer();
      } else {
        resumeTimer();
      }
    };

    syncTimer();
    document.addEventListener('visibilitychange', syncTimer);
    return () => {
      document.removeEventListener('visibilitychange', syncTimer);
      pauseTimer();
    };
  }, [isExpanded, isHovered, isSwiping, pauseTimer, resumeTimer]);

  const handleUserDismiss = useCallback(() => {
    try {
      if (!dismissedRef.current) {
        dismissedRef.current = true;
        toastItem.onDismiss?.();
      }
    } finally {
      startRemove();
    }
  }, [toastItem, startRemove]);

  const handleAction = useCallback(() => {
    try {
      toastItem.onAction?.();
    } finally {
      startRemove();
    }
  }, [toastItem, startRemove]);

  const handlePointerDown = (event: PointerEvent<HTMLLIElement>) => {
    if (event.button !== 0 || toastItem.type === 'progress') return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, a, input, [role="button"]')) return;
    dragStartRef.current = { x: event.clientX, time: Date.now() };
    swipeXRef.current = 0;
    isSwipingRef.current = false;
  };

  const handlePointerMove = (event: PointerEvent<HTMLLIElement>) => {
    if (!dragStartRef.current) return;
    const deltaX = Math.max(0, event.clientX - dragStartRef.current.x);
    if (!isSwipingRef.current && deltaX > 4) {
      isSwipingRef.current = true;
      swipeXRef.current = deltaX;
      setIsSwiping(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (isSwipingRef.current) {
      swipeXRef.current = deltaX;
      if (itemRef.current) {
        const { translateY, scale } = poseRef.current;
        itemRef.current.style.transform = `translate3d(${deltaX}px, ${translateY}, 0) scale(${scale})`;
      }
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLLIElement>) => {
    const start = dragStartRef.current;
    dragStartRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!start || !isSwipingRef.current) {
      isSwipingRef.current = false;
      setIsSwiping(false);
      return;
    }

    const deltaX = Math.max(0, event.clientX - start.x);
    const elapsed = Math.max(1, Date.now() - start.time);
    const velocity = deltaX / elapsed;

    isSwipingRef.current = false;
    setIsSwiping(false);
    if (deltaX >= SWIPE_DISMISS_DISTANCE || velocity > SWIPE_DISMISS_VELOCITY) {
      const exitX = Math.max(deltaX + 80, 140);
      swipeXRef.current = exitX;
      setSwipeX(exitX);
      handleUserDismiss();
    } else {
      swipeXRef.current = 0;
      setSwipeX(0);
    }
  };

  const hasIcon =
    (toastItem.icon !== null && toastItem.icon !== undefined) ||
    toastItem.type === 'success' ||
    toastItem.type === 'warning' ||
    toastItem.type === 'loading';

  const isSingleLine =
    (Boolean(toastItem.heading) && !toastItem.description) ||
    (!toastItem.heading && Boolean(toastItem.description));

  const isProgress = toastItem.type === 'progress';
  const isSingle = totalToasts <= 1;
  const isBackMost = index === totalToasts - 1;
  const hasGapFiller = isExpanded && !isSingle && !isBackMost;

  const isBlurred = !isMounted || isExiting;
  const shouldPromoteLayer = !isMounted || isEntering || isSwiping || isExiting;

  const computedStyle = useMemo<CSSProperties>(() => {
    const baseOffset =
      isExpanded && !isSingle ? toastsHeightBefore + 16 * index : 14 * index;
    const expandedLift = isExpanded && !isSingle ? 14 : 0;
    const showAll = isExpanded && !isSingle;
    const constrainHeight =
      totalToasts > 1 && !isFront && !isExpanded && frontToastHeight > 0;
    const heightOverflow =
      constrainHeight && naturalHeight > frontToastHeight
        ? naturalHeight - frontToastHeight
        : 0;

    let translateX = isSwiping ? swipeXRef.current : swipeX;
    let translateY: string = `${-(baseOffset + expandedLift - heightOverflow)}px`;
    let scale = isExpanded && !isSingle ? 1 : 1 - 0.05 * index;
    let opacity = showAll || index < 3 ? 1 : 0;

    if (!isMounted) {
      translateY = '100%';
      opacity = 0;
    } else if (isExiting) {
      opacity = 0;
      scale = 0.92;
      if (swipeX > 0) {
        translateX = swipeX;
      }
    }

    poseRef.current = { translateY, scale };

    const style: CSSProperties = {
      transform: `translate3d(${translateX}px, ${translateY}, 0) scale(${scale})`,
      opacity,
      zIndex: totalToasts - index,
      pointerEvents: opacity === 0 ? 'none' : 'auto',
    };

    if (heightOverflow > 0) {
      style.clipPath = `inset(0 0 ${heightOverflow}px 0 round var(--radius-xl))`;
    }
    return style;
  }, [
    index,
    totalToasts,
    isExpanded,
    isSingle,
    isFront,
    isMounted,
    isExiting,
    isSwiping,
    naturalHeight,
    frontToastHeight,
    toastsHeightBefore,
    swipeX,
  ]);

  const liveRole = toastItem.type === 'warning' ? 'alert' : 'status';

  return (
    <li
      ref={itemRef}
      role={liveRole}
      aria-live={toastItem.type === 'warning' ? 'assertive' : 'polite'}
      tabIndex={0}
      data-slot="toast"
      data-type={toastItem.type}
      data-expanded={isExpanded ? '' : undefined}
      data-front={isFront ? '' : undefined}
      data-index={index}
      data-dd-privacy={toastItem['data-dd-privacy']}
      style={computedStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && !isProgress) {
          event.preventDefault();
          handleUserDismiss();
        }
      }}
      className={cn(
        'group absolute right-0 bottom-0 isolate flex w-full items-center rounded-xl bg-bg-base p-4 text-text-primary shadow-high outline-none select-none touch-none',
        shouldPromoteLayer && 'will-change-transform',
        isBlurred && 'blur-[6px]',
        !isSwiping &&
          'transition-[transform,opacity,filter] duration-400 ease motion-reduce:blur-none motion-reduce:transition-opacity',
        !hasIcon && 'pl-5',
        hasGapFiller &&
          'after:absolute after:bottom-full after:left-0 after:h-4 after:w-full after:content-[""]',
      )}
    >
      <div
        className={cn(
          'flex w-full gap-3',
          isSingleLine ? 'items-center' : 'items-start',
        )}
      >
        {hasIcon ? (
          <ToastTypeIcon type={toastItem.type} customIcon={toastItem.icon} />
        ) : null}
        <div className="flex min-w-0 grow flex-col items-start justify-center gap-0.5">
          <ToastBody
            toastItem={toastItem}
            onRunAction={toastItem.onAction ? handleAction : undefined}
          />
        </div>
        {!isProgress ? (
          <button
            type="button"
            aria-label="Close toast"
            onClick={handleUserDismiss}
            className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-xs text-text-tertiary opacity-70 transition-[background-color,color,opacity] duration-150 ease-out hover:bg-bg-secondary hover:text-text-primary hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none group-hover:opacity-100"
          >
            <X aria-hidden="true" className="size-3.5" />
          </button>
        ) : null}
      </div>
    </li>
  );
}

/**
 * Renders active Rakfound toasts in a stacked bottom-right viewport.
 * Render once near the root of the app; multiple mounted instances safely deduplicate.
 */
export function ToastRenderer() {
  const isPrimary = useIsPrimaryToastRenderer();
  const toasts = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [heights, setHeights] = useState<Record<string, number>>({});

  const listRef = useRef<HTMLOListElement>(null);
  const expandTimerRef = useRef<number | null>(null);
  const collapseTimerRef = useRef<number | null>(null);

  const orderedToasts = useMemo(() => [...toasts].reverse(), [toasts]);
  const frontToastHeight = heights[orderedToasts[0]?.id ?? ''] ?? 0;
  const hasStack = orderedToasts.length > 1;

  const clearHoverTimers = useCallback(() => {
    if (expandTimerRef.current !== null) {
      window.clearTimeout(expandTimerRef.current);
      expandTimerRef.current = null;
    }
    if (collapseTimerRef.current !== null) {
      window.clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    clearHoverTimers();
    if (!isExpanded && hasStack) {
      expandTimerRef.current = window.setTimeout(() => {
        setIsExpanded(true);
        expandTimerRef.current = null;
      }, 200);
    }
  }, [isExpanded, hasStack, clearHoverTimers]);

  const handleMouseLeave = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (
        event.relatedTarget instanceof Node &&
        listRef.current?.contains(event.relatedTarget)
      ) {
        return;
      }
      setIsHovered(false);
      clearHoverTimers();
      collapseTimerRef.current = window.setTimeout(() => {
        setIsExpanded(false);
        collapseTimerRef.current = null;
      }, 350);
    },
    [clearHoverTimers],
  );

  const handleHeightUpdate = useCallback((id: string, height: number) => {
    setHeights((prev) =>
      Math.abs((prev[id] ?? 0) - height) < 1 ? prev : { ...prev, [id]: height },
    );
  }, []);

  useEffect(() => {
    if (orderedToasts.length === 0) {
      clearHoverTimers();
      setIsHovered(false);
      if (isExpanded) setIsExpanded(false);
    }
  }, [orderedToasts.length, clearHoverTimers, isExpanded]);

  useEffect(() => clearHoverTimers, [clearHoverTimers]);

  if (!isPrimary) return null;

  let cumulativeHeight = 0;

  return (
    <section
      data-slot="toast-viewport"
      aria-label="Notifications"
      className="pointer-events-none fixed right-6 bottom-6 z-50 w-96 max-w-[calc(100vw-2rem)] outline-none"
    >
      <ol
        ref={listRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative m-0 flex list-none flex-col justify-end p-0 outline-none"
      >
        {orderedToasts.map((toastItem, index) => {
          const heightBefore = cumulativeHeight;
          cumulativeHeight += heights[toastItem.id] ?? 0;
          return (
            <ToastCard
              key={toastItem.id}
              toastItem={toastItem}
              index={index}
              totalToasts={orderedToasts.length}
              isExpanded={isExpanded}
              isHovered={isHovered}
              isFront={index === 0}
              frontToastHeight={frontToastHeight}
              toastsHeightBefore={heightBefore}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onHeightUpdate={handleHeightUpdate}
            />
          );
        })}
      </ol>
    </section>
  );
}

/** Alias of `ToastRenderer` for callers expecting `<Toaster />`. */
export const Toaster = ToastRenderer;

/** Optional provider wrapper kept for parity with Palermo's toast exports. */
export function ToastProvider({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type Ref,
} from 'react';
import { X } from 'lucide-react';
import { Slot } from 'radix-ui';
import { cn } from '@/lib/utils';

/** Shared class string for square controls placed beside a `TabStrip` so they match the pills. */
export const TAB_STRIP_CONTROL_CLASS =
  'group size-7 min-h-0 shrink-0 rounded-md px-1 hover:bg-control-hover';

interface TabStripContextValue {
  activeTabId: string | null;
  focusedTabId: string | null;
  setFocusedTabId: (id: string) => void;
  hasIndicator: boolean;
}

const TabStripContext = createContext<TabStripContextValue>({
  activeTabId: null,
  focusedTabId: null,
  setFocusedTabId: () => {},
  hasIndicator: false,
});

interface TabStripItemContextValue {
  tabId: string;
  isActive: boolean;
}

const TabStripItemContext = createContext<TabStripItemContextValue>({
  tabId: '',
  isActive: false,
});

export interface TabStripProps extends ComponentProps<'div'> {
  /** Id of the selected tab. Scrolls into view when changed and becomes the strip's Tab stop. */
  activeTabId?: string | null;
}

/** Scrolling row of pill tabs with roving focus, edge fade, and sliding active indicator. */
function TabStrip({
  activeTabId = null,
  className,
  children,
  onKeyDown,
  style,
  ...props
}: TabStripProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [focusedTabId, setFocusedTabId] = useState<string | null>(activeTabId);
  const [scrollMask, setScrollMask] = useState<string | undefined>(undefined);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
    baseWidth: number;
    visible: boolean;
    animated: boolean;
  }>({ left: 0, width: 0, baseWidth: 1, visible: false, animated: false });
  const hasMeasuredOnce = useRef(false);

  // Sync roving Tab stop back to activeTabId whenever selection changes.
  useEffect(() => {
    setFocusedTabId(activeTabId);
  }, [activeTabId]);

  const updateScrollMask = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const canLeft = el.scrollLeft > 2;
    const canRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
    if (canLeft && canRight) {
      setScrollMask(
        'linear-gradient(to right, transparent 0px, black 20px, black calc(100% - 20px), transparent 100%)',
      );
    } else if (canLeft) {
      setScrollMask(
        'linear-gradient(to right, transparent 0px, black 20px, black 100%)',
      );
    } else if (canRight) {
      setScrollMask(
        'linear-gradient(to right, black 0px, black calc(100% - 20px), transparent 100%)',
      );
    } else {
      setScrollMask(undefined);
    }
  }, []);

  const updateIndicator = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const activeItem = activeTabId
      ? list.querySelector<HTMLElement>(
          `[data-tab-strip-item="true"][data-tab-id="${CSS.escape(activeTabId)}"]`,
        )
      : null;

    if (!activeItem) {
      setIndicator((prev) =>
        prev.visible ? { ...prev, visible: false } : prev,
      );
      return;
    }

    const left = activeItem.offsetLeft;
    const width = activeItem.offsetWidth;
    const baseWidth = Math.max(1, list.clientWidth);
    const animated = hasMeasuredOnce.current;
    hasMeasuredOnce.current = true;
    setIndicator({ left, width, baseWidth, visible: true, animated });
  }, [activeTabId]);

  useLayoutEffect(() => {
    updateIndicator();
    updateScrollMask();

    const list = listRef.current;
    if (!list) return;

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            updateIndicator();
            updateScrollMask();
          })
        : null;

    if (resizeObserver) {
      resizeObserver.observe(list);
      list
        .querySelectorAll<HTMLElement>('[data-tab-strip-item="true"]')
        .forEach((node) => resizeObserver.observe(node));
    }

    const mutationObserver =
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver(() => {
            updateIndicator();
            updateScrollMask();
          })
        : null;

    mutationObserver?.observe(list, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-active', 'class'],
    });

    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [updateIndicator, updateScrollMask, children]);

  // Scroll newly selected tab into view.
  useEffect(() => {
    const list = listRef.current;
    if (!list || !activeTabId) return;
    const activeItem = list.querySelector<HTMLElement>(
      `[data-tab-strip-item="true"][data-tab-id="${CSS.escape(activeTabId)}"]`,
    );
    if (!activeItem) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    activeItem.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      inline: 'nearest',
      block: 'nearest',
    });
  }, [activeTabId]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const list = listRef.current;
    if (!list) return;

    const triggers = Array.from(
      list.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])'),
    );
    if (triggers.length === 0) return;

    const currentIndex = triggers.findIndex(
      (trigger) =>
        trigger === document.activeElement ||
        trigger.contains(document.activeElement),
    );
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % triggers.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = triggers.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      const targetTrigger = triggers[nextIndex];
      const itemEl = targetTrigger.closest<HTMLElement>(
        '[data-tab-strip-item="true"]',
      );
      const nextId = itemEl?.dataset.tabId;
      if (nextId) {
        setFocusedTabId(nextId);
      }
      targetTrigger.focus();
    }
  };

  const mergedStyle: CSSProperties = scrollMask
    ? {
        maskImage: scrollMask,
        WebkitMaskImage: scrollMask,
        ...style,
      }
    : { ...style };

  return (
    <TabStripContext.Provider
      value={{
        activeTabId,
        focusedTabId,
        setFocusedTabId,
        hasIndicator: indicator.visible,
      }}
    >
      <div
        ref={listRef}
        role="tablist"
        aria-orientation="horizontal"
        data-slot="tab-strip"
        data-tab-strip="true"
        onScroll={updateScrollMask}
        onKeyDown={handleKeyDown}
        style={mergedStyle}
        className={cn(
          'relative isolate -ml-2 flex h-full min-w-0 scroll-px-6 items-center gap-1 overflow-x-auto px-2 whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          className,
        )}
        {...props}
      >
        {indicator.visible ? (
          <div
            aria-hidden="true"
            data-slot="tab-strip-indicator"
            style={{
              transform: `translate3d(${indicator.left}px, 0, 0) scaleX(${indicator.width / indicator.baseWidth})`,
              borderRadius:
                indicator.width > 0
                  ? `calc(var(--radius-lg) / ${indicator.width / indicator.baseWidth}) / var(--radius-lg)`
                  : undefined,
              transitionDuration: indicator.animated ? undefined : '0ms',
            }}
            className="pointer-events-none absolute top-1/2 left-0 z-0 h-7 w-full -translate-y-1/2 origin-left rounded-lg bg-control-selected shadow-low transition-transform duration-200 ease-out motion-reduce:transition-none"
          />
        ) : null}
        {children}
      </div>
    </TabStripContext.Provider>
  );
}

export interface TabStripItemProps extends ComponentProps<'div'> {
  /** Id of the tab, matched against `activeTabId`. */
  tabId: string;
  /** Whether this is the selected tab. */
  isActive?: boolean;
}

/** Slot wrapper for an individual tab inside `TabStrip`. */
function TabStripItem({
  tabId,
  isActive = false,
  className,
  children,
  ...props
}: TabStripItemProps) {
  return (
    <TabStripItemContext.Provider value={{ tabId, isActive }}>
      <div
        role="presentation"
        data-slot="tab-strip-item"
        data-tab-strip-item="true"
        data-tab-id={tabId}
        data-active={isActive ? 'true' : undefined}
        className={cn('relative z-1 flex h-7 shrink-0 items-center', className)}
        {...props}
      >
        {children}
      </div>
    </TabStripItemContext.Provider>
  );
}

export interface TabStripTabProps extends ComponentProps<'div'> {
  /** Applies the selected pill style. */
  isActive?: boolean;
  /** Forwarded to the pill, so it can be a context menu or drag target. */
  ref?: Ref<HTMLDivElement>;
}

/** Visual pill container holding `TabStripTrigger` and optional sibling `TabStripClose`. */
function TabStripTab({
  isActive = false,
  className,
  ref,
  ...props
}: TabStripTabProps) {
  const { hasIndicator } = useContext(TabStripContext);

  return (
    <div
      ref={ref}
      data-slot="tab-strip-tab"
      data-tab-strip-tab="true"
      data-active={isActive ? 'true' : undefined}
      className={cn(
        'group/tab-pill relative flex h-7 w-max max-w-60 shrink-0 cursor-pointer items-center rounded-lg transition-[color,background-color] duration-150 ease-out motion-reduce:transition-none',
        'has-[[data-tab-strip-close-overlay]]:hover:[--tab-strip-label-mask:linear-gradient(to_right,black_calc(100%-24px),transparent)] has-[[data-tab-strip-close-overlay]]:focus-within:[--tab-strip-label-mask:linear-gradient(to_right,black_calc(100%-24px),transparent)]',
        isActive
          ? hasIndicator
            ? 'text-text-primary'
            : 'bg-control-selected text-text-primary shadow-low'
          : 'text-text-secondary hover:bg-control-hover hover:text-text-primary',
        className,
      )}
      {...props}
    />
  );
}

export interface TabStripTriggerProps extends ComponentProps<'button'> {
  /** Sets `aria-selected`. */
  isActive?: boolean;
  /** Renders the child element, such as a link, as the trigger instead of a button. */
  asChild?: boolean;
}

/** Interactive trigger that selects a tab inside `TabStripTab`. */
function TabStripTrigger({
  isActive = false,
  asChild = false,
  className,
  onFocus,
  tabIndex,
  ...props
}: TabStripTriggerProps) {
  const { activeTabId, focusedTabId, setFocusedTabId } =
    useContext(TabStripContext);
  const { tabId } = useContext(TabStripItemContext);

  const isRovingTarget =
    focusedTabId !== null
      ? focusedTabId === tabId
      : activeTabId !== null
        ? activeTabId === tabId
        : isActive;

  const resolvedTabIndex = tabIndex ?? (isRovingTarget ? 0 : -1);

  const classes = cn(
    'relative flex h-full min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg px-2.5 outline-none transition-transform duration-150 ease-out motion-reduce:transition-none active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring [&_svg]:pointer-events-none [&_svg]:shrink-0',
    className,
  );

  const handleFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
    if (tabId) {
      setFocusedTabId(tabId);
    }
    onFocus?.(event);
  };

  if (asChild) {
    return (
      <Slot.Root
        role="tab"
        aria-selected={isActive}
        data-slot="tab-strip-trigger"
        tabIndex={resolvedTabIndex}
        onFocus={handleFocus}
        className={classes}
        {...props}
      />
    );
  }

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-slot="tab-strip-trigger"
      tabIndex={resolvedTabIndex}
      onFocus={handleFocus}
      className={classes}
      {...props}
    />
  );
}

export interface TabStripLabelProps extends ComponentProps<'span'> {
  /** Tab title. Truncates to one line, with the full title in a native tooltip. */
  children: string;
}

/** Single-line truncating label with a native tooltip for the full tab title. */
function TabStripLabel({ children, className, ...props }: TabStripLabelProps) {
  return (
    <span className="flex min-w-0 flex-1">
      <span
        data-slot="tab-strip-label"
        title={children}
        className={cn(
          'block min-w-0 flex-1 overflow-hidden text-left text-body-small-medium text-ellipsis whitespace-nowrap [mask-image:var(--tab-strip-label-mask,none)]',
          className,
        )}
        {...props}
      >
        {children}
      </span>
    </span>
  );
}

export interface TabStripCloseProps {
  /** Accessible name and tooltip, such as `"Close Visibility report"`. */
  label: string;
  /** Called on click, without selecting the tab. */
  onClose: () => void;
  /** Floats the button over the end of the label on hover and focus instead of reserving space. */
  overlay?: boolean;
  /** Additional classes for the close button. */
  className?: string;
}

/** Sibling close button inside `TabStripTab` so interactive controls never nest. */
function TabStripClose({
  label,
  onClose,
  overlay = false,
  className,
}: TabStripCloseProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClose();
  };

  return (
    <span
      data-tab-strip-close-overlay={overlay ? '' : undefined}
      className={cn(
        'flex shrink-0 items-center',
        overlay
          ? 'pointer-events-none absolute inset-y-0 right-0 pr-1'
          : 'relative pr-1.5',
      )}
    >
      <button
        type="button"
        aria-label={label}
        title={label}
        tabIndex={-1}
        data-slot="tab-strip-close"
        data-tab-strip-close="true"
        onClick={handleClick}
        className={cn(
          'inline-flex size-5 min-h-0 cursor-pointer items-center justify-center rounded-sm bg-transparent text-fill-secondary outline-none transition-[opacity,color,background-color,transform] duration-150 ease-out motion-reduce:transition-none hover:bg-control-hover hover:text-fill-primary active:scale-[0.97] focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring',
          overlay
            ? 'pointer-events-none opacity-0 group-focus-within/tab-pill:pointer-events-auto group-focus-within/tab-pill:opacity-100 group-hover/tab-pill:pointer-events-auto group-hover/tab-pill:opacity-100'
            : 'opacity-0 group-data-[active=true]/tab-pill:opacity-100 group-focus-within/tab-pill:opacity-100 group-hover/tab-pill:opacity-100',
          className,
        )}
      >
        <X aria-hidden="true" className="size-3.5 shrink-0" />
      </button>
    </span>
  );
}

export {
  TabStrip,
  TabStripItem,
  TabStripTab,
  TabStripTrigger,
  TabStripLabel,
  TabStripClose,
};

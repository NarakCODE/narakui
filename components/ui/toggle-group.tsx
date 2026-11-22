'use client';

import {
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  BarChart3,
  Bold,
  Calendar,
  ChartLine,
  ChartPie,
  Check,
  Columns3,
  Eye,
  Filter,
  Globe,
  Italic,
  LayoutGrid,
  Link2,
  List,
  Minus,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Table2,
  Underline,
  type LucideIcon,
} from 'lucide-react';
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

const TOGGLE_GROUP_ICONS = {
  'layout-grid': LayoutGrid,
  list: List,
  'chart-line': ChartLine,
  'chart-pie': ChartPie,
  'chart-bar': BarChart3,
  table: Table2,
  columns: Columns3,
  calendar: Calendar,
  filter: Filter,
  search: Search,
  sliders: SlidersHorizontal,
  eye: Eye,
  globe: Globe,
  link: Link2,
  sparkles: Sparkles,
  check: Check,
  plus: Plus,
  minus: Minus,
  bold: Bold,
  italic: Italic,
  underline: Underline,
  'align-left': AlignLeft,
  'align-center': AlignCenter,
  'align-right': AlignRight,
} as const satisfies Record<string, LucideIcon>;

export type ToggleGroupIconName = keyof typeof TOGGLE_GROUP_ICONS;

export interface ToggleGroupIconDescriptor {
  /** Named icon registered for ToggleGroup item slots. */
  name: ToggleGroupIconName | (string & {});
  /** Additional classes applied to the SVG icon. */
  className?: string;
}

export type ToggleGroupIconValue =
  | ToggleGroupIconName
  | (string & {})
  | ToggleGroupIconDescriptor
  | ReactNode;

export type ToggleGroupSize = 'regular' | 'small';
type LegacyToggleGroupSize = ToggleGroupSize | 'default' | 'sm' | 'lg';

function normalizeSize(size?: LegacyToggleGroupSize): ToggleGroupSize {
  if (size === 'small' || size === 'sm') return 'small';
  return 'regular';
}

function isIconDescriptor(
  value: ToggleGroupIconValue,
): value is ToggleGroupIconDescriptor {
  return (
    typeof value === 'object' &&
    value !== null &&
    !isValidElement(value) &&
    'name' in value &&
    typeof (value as { name?: unknown }).name === 'string'
  );
}

function renderToggleIcon(value: ToggleGroupIconValue): ReactNode {
  if (value === undefined || value === null || typeof value === 'boolean') {
    return null;
  }

  if (typeof value === 'string') {
    if (value in TOGGLE_GROUP_ICONS) {
      const IconComponent = TOGGLE_GROUP_ICONS[value as ToggleGroupIconName];
      return <IconComponent aria-hidden="true" className="size-full shrink-0" />;
    }
    return null;
  }

  if (isIconDescriptor(value)) {
    if (value.name in TOGGLE_GROUP_ICONS) {
      const IconComponent =
        TOGGLE_GROUP_ICONS[value.name as ToggleGroupIconName];
      return (
        <IconComponent
          aria-hidden="true"
          className={cn('size-full shrink-0', value.className)}
        />
      );
    }
    return null;
  }

  return value;
}

interface ToggleGroupContextValue {
  size: ToggleGroupSize;
  orientation: 'horizontal' | 'vertical';
  type: 'single' | 'multiple';
}

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
  size: 'regular',
  orientation: 'horizontal',
  type: 'single',
});

export type ToggleGroupRootProps = ComponentProps<
  typeof ToggleGroupPrimitive.Root
> & {
  /** Control height and item typography. Matches the Button scale. */
  size?: LegacyToggleGroupSize;
  /** Additional CSS classes for the sliding active indicator. */
  indicatorClassName?: string;
  /** Legacy shadcn variant prop preserved for compatibility. */
  variant?: 'default' | 'outline';
  /** Legacy shadcn spacing prop preserved for compatibility. */
  spacing?: number;
};

/** Set of two-state toggle buttons with a sliding active indicator in single-selection mode. */
function ToggleGroupRoot({
  className,
  size = 'regular',
  orientation = 'horizontal',
  indicatorClassName,
  variant: _variant,
  spacing: _spacing,
  children,
  ...props
}: ToggleGroupRootProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const normalizedSize = normalizeSize(size);
  const isSingle = props.type === 'single';
  const hasMeasuredOnce = useRef(false);

  const [indicator, setIndicator] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    baseWidth: number;
    baseHeight: number;
    visible: boolean;
    animated: boolean;
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    baseWidth: 1,
    baseHeight: 1,
    visible: false,
    animated: false,
  });

  const updateIndicator = useCallback(() => {
    const root = rootRef.current;
    if (!root || !isSingle) {
      setIndicator((prev) =>
        prev.visible ? { ...prev, visible: false } : prev,
      );
      return;
    }

    const activeEl = root.querySelector<HTMLElement>(
      '[data-slot="toggle-group-item"][data-state="on"]',
    );

    if (!activeEl) {
      setIndicator((prev) =>
        prev.visible ? { ...prev, visible: false } : prev,
      );
      return;
    }

    const animated = hasMeasuredOnce.current;
    hasMeasuredOnce.current = true;
    setIndicator({
      x: activeEl.offsetLeft,
      y: activeEl.offsetTop,
      width: activeEl.offsetWidth,
      height: activeEl.offsetHeight,
      baseWidth: Math.max(1, root.clientWidth),
      baseHeight: Math.max(1, root.clientHeight),
      visible: true,
      animated,
    });
  }, [isSingle]);

  useLayoutEffect(() => {
    updateIndicator();

    const root = rootRef.current;
    if (!root || !isSingle) return;

    const mutationObserver =
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver(updateIndicator)
        : null;
    mutationObserver?.observe(root, {
      attributes: true,
      attributeFilter: ['data-state'],
      subtree: true,
      childList: true,
    });

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(updateIndicator)
        : null;
    if (resizeObserver) {
      resizeObserver.observe(root);
      root
        .querySelectorAll<HTMLElement>('[data-slot="toggle-group-item"]')
        .forEach((node) => resizeObserver.observe(node));
    }

    return () => {
      mutationObserver?.disconnect();
      resizeObserver?.disconnect();
    };
  }, [updateIndicator, isSingle, children, normalizedSize, orientation]);

  const sx = indicator.baseWidth > 0 ? indicator.width / indicator.baseWidth : 1;
  const sy = indicator.baseHeight > 0 ? indicator.height / indicator.baseHeight : 1;
  const indicatorStyle: CSSProperties = {
    transform: `translate3d(${indicator.x}px, ${indicator.y}px, 0) scale(${sx}, ${sy})`,
    borderRadius:
      sx > 0 && sy > 0
        ? `calc(var(--radius-md) / ${sx}) / calc(var(--radius-md) / ${sy})`
        : undefined,
    opacity: indicator.visible ? 1 : 0,
    transitionDuration: indicator.animated ? undefined : '0ms',
  };

  return (
    <ToggleGroupContext.Provider
      value={{
        size: normalizedSize,
        orientation: orientation ?? 'horizontal',
        type: props.type,
      }}
    >
      <ToggleGroupPrimitive.Root
        ref={rootRef}
        data-slot="toggle-group"
        data-size={normalizedSize}
        data-orientation={orientation}
        orientation={orientation}
        className={cn(
          'relative inline-flex w-max items-stretch rounded-md bg-bg-tertiary shadow-low dark:bg-bg-secondary',
          orientation === 'vertical'
            ? 'flex-col'
            : normalizedSize === 'small'
              ? 'h-7 flex-row'
              : 'h-8 flex-row',
          className,
        )}
        {...props}
      >
        {isSingle ? (
          <div
            aria-hidden="true"
            data-slot="toggle-group-indicator"
            style={indicatorStyle}
            className={cn(
              'pointer-events-none absolute top-0 left-0 z-10 h-full w-full origin-top-left rounded-md bg-control-bg shadow-low transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none dark:bg-bg-quaternary',
              indicatorClassName,
            )}
          />
        ) : null}
        {children}
      </ToggleGroupPrimitive.Root>
    </ToggleGroupContext.Provider>
  );
}

export interface ToggleGroupItemProps
  extends Omit<ComponentProps<typeof ToggleGroupPrimitive.Item>, 'children'> {
  /** Label displayed by the toggle item. */
  children?: ReactNode;
  /** Icon displayed before the label. */
  iconStart?: ToggleGroupIconValue;
  /** Icon displayed after the label. */
  iconEnd?: ToggleGroupIconValue;
  /** Additional CSS classes for the label slot. */
  labelClassName?: string;
  /** Additional CSS classes for the start icon slot. */
  iconStartClassName?: string;
  /** Additional CSS classes for the end icon slot. */
  iconEndClassName?: string;
  /** Legacy shadcn variant prop preserved for compatibility. */
  variant?: 'default' | 'outline';
  /** Legacy shadcn size prop preserved for compatibility. */
  size?: LegacyToggleGroupSize;
}

/** Individual option button inside `ToggleGroup.Root`. */
function ToggleGroupItem({
  className,
  children,
  iconStart,
  iconEnd,
  labelClassName,
  iconStartClassName,
  iconEndClassName,
  variant: _variant,
  size: _size,
  ...props
}: ToggleGroupItemProps) {
  const { size, orientation } = useContext(ToggleGroupContext);

  const hasLabel =
    children !== undefined &&
    children !== null &&
    children !== false &&
    children !== '';
  const isIconOnly = !hasLabel && (iconStart !== undefined || iconEnd !== undefined);
  const iconSizeClass = size === 'small' ? 'size-3.5' : 'size-4';

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-size={size}
      className={cn(
        'relative z-10 inline-flex cursor-pointer items-center justify-center gap-1 rounded-md whitespace-nowrap text-text-secondary select-none outline-none transition-[color,transform] duration-150 ease-out motion-reduce:transition-none hover:text-text-primary active:not-disabled:scale-[0.97] focus-visible:z-30 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=on]:z-20 data-[state=on]:text-text-primary [&_svg]:pointer-events-none [&_svg]:shrink-0',
        size === 'small' ? 'text-body-mini-medium' : 'text-body-small-medium',
        orientation === 'vertical'
          ? size === 'small'
            ? 'h-7'
            : 'h-8'
          : 'h-full',
        isIconOnly
          ? 'aspect-square p-0'
          : size === 'small'
            ? 'px-1.5'
            : 'px-2',
        className,
      )}
      {...props}
    >
      {iconStart !== undefined ? (
        <span
          data-slot="toggle-group-icon-start"
          className={cn(
            'flex shrink-0 items-center justify-center [&>*]:size-full',
            iconSizeClass,
            iconStartClassName,
          )}
        >
          {renderToggleIcon(iconStart)}
        </span>
      ) : null}
      {hasLabel ? (
        <span
          data-slot="toggle-group-label"
          className={cn('inline-flex min-w-0 items-center px-0.5', labelClassName)}
        >
          {children}
        </span>
      ) : null}
      {iconEnd !== undefined ? (
        <span
          data-slot="toggle-group-icon-end"
          className={cn(
            'flex shrink-0 items-center justify-center [&>*]:size-full',
            iconSizeClass,
            iconEndClassName,
          )}
        >
          {renderToggleIcon(iconEnd)}
        </span>
      ) : null}
    </ToggleGroupPrimitive.Item>
  );
}

const ToggleGroup = Object.assign(ToggleGroupRoot, {
  Root: ToggleGroupRoot,
  Item: ToggleGroupItem,
});

export { ToggleGroup, ToggleGroupRoot, ToggleGroupItem };

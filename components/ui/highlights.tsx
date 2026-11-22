'use client';

import {
  Children,
  createContext,
  isValidElement,
  useContext,
  type ComponentProps,
  type ReactNode,
} from 'react';
import {
  ChartLine,
  ChartPie,
  Check,
  Clock,
  Eye,
  Files,
  Globe,
  Info,
  Link2,
  Megaphone,
  Search,
  Sparkles,
  Star,
  Tag,
  TriangleAlert,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const HIGHLIGHTS_ICONS = {
  eye: Eye,
  'chart-pie': ChartPie,
  'chart-line': ChartLine,
  link: Link2,
  search: Search,
  sparkles: Sparkles,
  megaphone: Megaphone,
  clock: Clock,
  globe: Globe,
  documents: Files,
  star: Star,
  tag: Tag,
  users: Users,
  info: Info,
  warning: TriangleAlert,
  check: Check,
} as const satisfies Record<string, LucideIcon>;

export type HighlightsIconName = keyof typeof HIGHLIGHTS_ICONS;

export interface HighlightsIconDescriptor {
  /** Named icon registered for Highlights slots. */
  name: HighlightsIconName | (string & {});
  /** Optional filled variant. */
  variant?: 'default' | 'filled';
  /** Additional classes applied to the SVG icon. */
  className?: string;
  /** Accessible label; when provided, sets `role="img"` instead of `aria-hidden`. */
  label?: string;
}

export type HighlightsIconValue =
  | HighlightsIconName
  | (string & {})
  | HighlightsIconDescriptor
  | ReactNode;

interface HighlightsGridContextValue {
  isLoading?: boolean;
}

const HighlightsGridContext = createContext<HighlightsGridContextValue>({});

/** Type guard distinguishing icon descriptor objects from React nodes. */
function isHighlightsIconDescriptor(
  value: HighlightsIconValue,
): value is HighlightsIconDescriptor {
  return (
    typeof value === 'object' &&
    value !== null &&
    !isValidElement(value) &&
    'name' in value &&
    typeof (value as { name?: unknown }).name === 'string'
  );
}

/** Resolves a named icon string, `{ name, variant?, className?, label? }` descriptor, or custom node. */
function renderHighlightsIcon(icon: HighlightsIconValue | undefined): ReactNode {
  if (icon === undefined || icon === null || typeof icon === 'boolean') {
    return null;
  }

  if (typeof icon === 'string') {
    if (icon in HIGHLIGHTS_ICONS) {
      const IconComponent = HIGHLIGHTS_ICONS[icon as HighlightsIconName];
      return <IconComponent aria-hidden="true" className="size-4 shrink-0" />;
    }
    return null;
  }

  if (isHighlightsIconDescriptor(icon)) {
    if (icon.name in HIGHLIGHTS_ICONS) {
      const IconComponent = HIGHLIGHTS_ICONS[icon.name as HighlightsIconName];
      return (
        <IconComponent
          aria-hidden={icon.label ? undefined : true}
          role={icon.label ? 'img' : undefined}
          aria-label={icon.label}
          className={cn(
            'size-4 shrink-0',
            icon.variant === 'filled' && 'fill-current',
            icon.className,
          )}
        />
      );
    }
    return null;
  }

  return icon;
}

export interface HighlightsProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Title of the highlights metric cell. */
  title: string;
  /** Primary metric value. Numbers are formatted with `toLocaleString`. */
  bigValue?: string | number;
  /** Trailing icon in the header row: icon name, descriptor, or node. */
  endIcon?: HighlightsIconValue;
  /** Optional statistic rendered beside/below the primary value. */
  statisticProps?: ReactNode;
  /** Shows loading skeletons for the value and optional statistic. */
  isLoading?: boolean;
  /** Content for an info tooltip next to the title. No tooltip icon renders without it. */
  tooltipContent?: ReactNode;
  /** Width of the primary value skeleton when loading. */
  bigValueSkeletonWidth?: string;
  /** Height of the primary value skeleton when loading. */
  bigValueSkeletonHeight?: string;
  /** Width of the statistic skeleton when loading. */
  statisticSkeletonWidth?: string;
  /** Height of the statistic skeleton when loading. */
  statisticSkeletonHeight?: string;
}

/** Individual metric cell displaying a title, optional info tooltip, trailing icon, large value, and statistic. */
function Highlights({
  title,
  bigValue,
  endIcon,
  statisticProps,
  isLoading = false,
  tooltipContent,
  bigValueSkeletonWidth = '60px',
  bigValueSkeletonHeight = '24px',
  statisticSkeletonWidth = '32px',
  statisticSkeletonHeight = '16px',
  className,
  ...props
}: HighlightsProps) {
  const gridContext = useContext(HighlightsGridContext);
  const resolvedIsLoading =
    gridContext.isLoading !== undefined ? gridContext.isLoading : isLoading;
  const formattedValue =
    typeof bigValue === 'number' ? bigValue.toLocaleString() : bigValue;
  const hasStatistic =
    statisticProps !== undefined && statisticProps !== null && statisticProps !== false;
  const resolvedEndIcon = renderHighlightsIcon(endIcon);

  return (
    <div
      data-slot="highlights"
      data-loading={resolvedIsLoading || undefined}
      className={cn(
        'flex min-w-0 flex-col justify-between gap-2.5 bg-bg-primary p-4',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-body-small-medium text-text-secondary">
            {title}
          </span>
          {tooltipContent ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={`More info about ${title}`}
                  className="flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center rounded-sm text-text-tertiary transition-colors duration-150 ease-out hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Info aria-hidden="true" className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>
                {tooltipContent}
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>
        {resolvedEndIcon ? (
          <span className="flex h-[18px] shrink-0 items-center justify-center text-text-tertiary [&>svg]:size-4">
            {resolvedEndIcon}
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-wrap items-baseline gap-2">
        {resolvedIsLoading ? (
          <>
            <Skeleton
              style={{ width: bigValueSkeletonWidth, height: bigValueSkeletonHeight }}
              className="rounded-sm bg-bg-tertiary"
            />
            {hasStatistic ? (
              <Skeleton
                style={{ width: statisticSkeletonWidth, height: statisticSkeletonHeight }}
                className="rounded-sm bg-bg-tertiary"
              />
            ) : null}
          </>
        ) : (
          <>
            {formattedValue !== undefined ? (
              <span className="truncate text-title-small-semibold text-text-primary tabular-nums">
                {formattedValue}
              </span>
            ) : null}
            {hasStatistic ? statisticProps : null}
          </>
        )}
      </div>
    </div>
  );
}

const GRID_COLUMNS_CLASSES: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

export interface HighlightsGridProps extends ComponentProps<'div'> {
  /** `Highlights` cells displayed in the grid. */
  children: ReactNode;
  /** Number of columns in the grid layout, from 1 to 6. */
  columns?: number;
  /** When set, overrides `isLoading` on every child `Highlights`. */
  isLoading?: boolean;
}

/** Card surface and divider grid hosting `Highlights` metric cells. */
function HighlightsGrid({
  children,
  columns = 4,
  isLoading,
  className,
  ...props
}: HighlightsGridProps) {
  const clampedColumns = Math.min(6, Math.max(1, Math.round(columns)));
  const items = Children.toArray(children);
  const totalItems = items.length;
  const totalRows = Math.ceil(totalItems / clampedColumns);

  return (
    <HighlightsGridContext.Provider value={{ isLoading }}>
      <div
        data-slot="highlights-grid"
        data-columns={clampedColumns}
        className={cn(
          'grid overflow-hidden rounded-xl bg-bg-primary shadow-medium',
          GRID_COLUMNS_CLASSES[clampedColumns],
          className,
        )}
        {...props}
      >
        {items.map((child, index) => {
          const colIndex = index % clampedColumns;
          const rowIndex = Math.floor(index / clampedColumns);
          const hasRightDivider = colIndex < clampedColumns - 1 && index < totalItems - 1;
          const hasBottomDivider = rowIndex < totalRows - 1;

          return (
            <div
              key={isValidElement(child) && child.key !== null ? child.key : index}
              data-slot="highlights-grid-cell"
              className={cn(
                'flex min-w-0 flex-col [&>[data-slot=highlights]]:flex-1',
                hasRightDivider && 'border-r border-border-gray',
                hasBottomDivider && 'border-b border-border-gray',
              )}
            >
              {child}
            </div>
          );
        })}
      </div>
    </HighlightsGridContext.Provider>
  );
}

export { Highlights, HighlightsGrid };

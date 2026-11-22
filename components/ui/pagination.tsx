'use client';

import type { ComponentProps, ReactNode } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationBaseProps {
  /** The current page number (1-based). */
  page: number;
  /** Called with the new page when an arrow is clicked. */
  onPageChange: (page: number) => void;
  /** Disables both arrows while data is fetching. @default false */
  isLoading?: boolean;
  /** Show only navigation arrows without item count. @default false */
  showOnlyArrows?: boolean;
  /** Show the current page and page count between the arrows. Counted mode only. @default false */
  showPageIndicatorBetweenArrows?: boolean;
  /** Content shown before the item count. */
  leftContent?: ReactNode;
  /** Set to `'end'` to align the item count to the right. */
  alignText?: 'start' | 'end' | (string & {});
  /** Accessible name for the navigation landmark. Change it when a view has more than one. @default 'Pagination' */
  'aria-label'?: string;
  /** Additional CSS classes to apply to the pagination container. */
  className?: string;
}

export interface CountedPaginationProps extends PaginationBaseProps {
  /** `counted` takes a total and shows the item range. @default 'counted' */
  mode?: 'counted';
  /** Number of items per page. Required in counted mode. */
  limit: number;
  /** Number of items to skip, usually `(page - 1) * limit`. Required in counted mode. */
  offset: number;
  /** Total number of items across all pages. Required in counted mode. */
  totalItems: number;
  hasNextPage?: never;
}

export interface CursorPaginationProps extends PaginationBaseProps {
  /** `cursor` only knows whether a next page exists. */
  mode: 'cursor';
  /** Whether a next page exists. Required in cursor mode. */
  hasNextPage: boolean;
  limit?: never;
  offset?: never;
  totalItems?: never;
}

export type PalermoPaginationProps = CountedPaginationProps | CursorPaginationProps;
type LegacyPaginationProps = ComponentProps<'nav'> & { page?: undefined };

export type PaginationProps = PalermoPaginationProps | LegacyPaginationProps;

function isPalermoPaginationProps(
  props: PaginationProps,
): props is PalermoPaginationProps {
  return 'page' in props && typeof props.page === 'number';
}

/**
 * Navigation bar for splitting content across multiple pages.
 * Supports counted item-range pagination, cursor-based pagination, and legacy composable pagination markup.
 */
function Pagination(props: PaginationProps) {
  if (!isPalermoPaginationProps(props)) {
    const { className, ...navProps } = props;
    return (
      <nav
        role="navigation"
        aria-label="pagination"
        data-slot="pagination"
        className={cn('mx-auto flex w-full justify-center', className)}
        {...navProps}
      />
    );
  }

  const {
    page,
    onPageChange,
    isLoading = false,
    showOnlyArrows = false,
    showPageIndicatorBetweenArrows = false,
    leftContent,
    alignText,
    'aria-label': ariaLabel = 'Pagination',
    className,
  } = props;

  const isCursorMode = props.mode === 'cursor';
  const totalItems = isCursorMode ? undefined : props.totalItems;
  const limit = isCursorMode ? undefined : props.limit;
  const offset = isCursorMode ? undefined : props.offset;

  const hasItems = isCursorMode ? true : (totalItems ?? 0) > 0;
  const totalPages =
    !isCursorMode && totalItems !== undefined && limit !== undefined && limit > 0
      ? Math.max(1, Math.ceil(totalItems / limit))
      : 1;

  const rangeStart =
    !isCursorMode && hasItems && offset !== undefined ? offset + 1 : 0;
  const rangeEnd =
    !isCursorMode &&
    hasItems &&
    offset !== undefined &&
    limit !== undefined &&
    totalItems !== undefined
      ? Math.min(offset + limit, totalItems)
      : 0;

  const canGoPrev = !isLoading && hasItems && page > 1;
  const canGoNext = isCursorMode
    ? !isLoading && Boolean(props.hasNextPage)
    : !isLoading && hasItems && page < totalPages;

  const showCount = !showOnlyArrows && (isCursorMode || hasItems);
  const showIndicator =
    !isCursorMode && showPageIndicatorBetweenArrows && hasItems;
  const hasLeadingRegion = Boolean(leftContent) || showCount;

  return (
    <div
      data-slot="pagination"
      data-mode={isCursorMode ? 'cursor' : 'counted'}
      className={cn(
        'flex w-full select-none items-center gap-3',
        hasLeadingRegion ? 'justify-between' : 'justify-end',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center gap-4',
          alignText === 'end' ? 'flex-1 justify-end' : 'justify-start',
          !isCursorMode && !showOnlyArrows && 'min-w-[14rem]',
        )}
      >
        {leftContent}
        {showCount ? (
          isCursorMode ? (
            <p className="m-0 text-body-mini-regular text-text-secondary tabular-nums">
              Page {page}
            </p>
          ) : (
            <p className="m-0 text-body-mini-regular text-text-secondary">
              Showing{' '}
              <span className="text-text-primary tabular-nums">
                {rangeStart} – {rangeEnd}
              </span>{' '}
              of <span className="tabular-nums">{totalItems}</span> items
            </p>
          )
        ) : null}
      </div>

      <nav aria-label={ariaLabel} className="flex items-center gap-1">
        <Button
          mode="secondary"
          size="small"
          aria-label="Previous page"
          disabled={!canGoPrev}
          iconStart="chevron-left"
          onClick={() => {
            if (canGoPrev) onPageChange(page - 1);
          }}
        />

        {showIndicator ? (
          <span className="mx-4 text-body-mini-medium text-text-primary tabular-nums">
            <span aria-current="page">{page}</span>
            <span className="text-text-tertiary"> / {totalPages}</span>
          </span>
        ) : null}

        <Button
          mode="secondary"
          size="small"
          aria-label="Next page"
          disabled={!canGoNext}
          iconStart="chevron-right"
          onClick={() => {
            if (canGoNext) onPageChange(page + 1);
          }}
        />
      </nav>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Backward-compatible composable pagination primitives                        */
/* -------------------------------------------------------------------------- */

function PaginationContent({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex items-center gap-1', className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ComponentProps<typeof Button>, 'size'> &
  ComponentProps<'a'>;

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      asChild
      mode={isActive ? 'secondary' : 'ghost'}
      size={size}
      className={cn(className)}
    >
      <a
        aria-current={isActive ? 'page' : undefined}
        data-slot="pagination-link"
        data-active={isActive}
        {...props}
      />
    </Button>
  );
}

function PaginationPrevious({
  className,
  text = 'Previous',
  ...props
}: ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="regular"
      className={cn('pl-2!', className)}
      {...props}
    >
      <ChevronLeftIcon data-icon="inline-start" />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  text = 'Next',
  ...props
}: ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="regular"
      className={cn('pr-2!', className)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <ChevronRightIcon data-icon="inline-end" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};

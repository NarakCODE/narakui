'use client';

import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  type ComponentProps,
  type Key,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type TableDensity = 'default' | 'comfortable';
export type TableHeaderWeight = 'medium' | 'regular' | 'mini';
export type TableAlign = 'left' | 'center' | 'right';
export type TableSortDirection = 'asc' | 'desc';

export interface TableColumnProps<T = Record<string, unknown>> {
  /** Unique column identifier. Without `getValue` or `renderCell`, the cell shows `row[id]`. */
  id: string;
  /** Header content. */
  label?: ReactNode;
  /** Returns the cell content inside the default cell. */
  getValue?: (row: T, index: number, id: string) => ReactNode;
  /** Renders the whole `<td>` for full control. */
  renderCell?: (row: T, index: number, id: string) => ReactNode;
  /** Renders the whole `<th>` for full control. */
  renderHeader?: (column: TableColumnProps<T>) => ReactNode;
  /** Cell content while `isLoading`. Defaults to a full-width skeleton. */
  loadingCell?: ReactNode;
  /** Active sort direction. Sets `aria-sort` on the header cell. Set it only on the sorted column. */
  sortDirection?: TableSortDirection;
  /** Text alignment of the header cell and of cells rendered from `getValue`. @default 'left' */
  align?: TableAlign;
  /** Additional classes for the header cell and the body cells. */
  className?: string;
  /** Additional classes for the body cells. */
  cellClassName?: string;
  /** Additional classes for the header cell. */
  headerClassName?: string;
  /** Number of columns the header cell spans. */
  headerColSpan?: number;
}

export interface TableExpandableRowProps<T = Record<string, unknown>> {
  /** Content shown in one full-width row below an expanded row. */
  render?: (row: T, index: number) => ReactNode;
  /** Returns one or more `<tr>` elements shown below an expanded row. Use instead of `render`. */
  renderRows?: (row: T, index: number) => ReactNode;
}

export interface TableFooterBarProps {
  /** Footer content, such as pagination. */
  children?: ReactNode;
  /** Additional classes for the footer. */
  className?: string;
}

export interface DataTableProps<T = Record<string, unknown>> {
  /** Rows to render. */
  data: T[];
  /** Property or function that returns a stable row key. @default index */
  rowKey?: keyof T | ((row: T, index: number) => Key);
  /** Accessible name for the table. */
  'aria-label'?: string;
  /** Id of the element that names the table. */
  'aria-labelledby'?: string;
  /** Keys of the rows that are expanded. @default [] */
  expandedRows?: Key[];
  /** Called when a row is expanded or collapsed. */
  onToggleExpand?: (rowKey: Key, isExpanded: boolean) => void;
  /** Returns false for rows that should not expand. */
  isRowExpandable?: (row: T) => boolean;
  /** Called when a row is clicked. Replaces the expand toggle. */
  onRowClick?: (row: T) => void;
  /** Shows `loadingState`, or skeleton rows when `loadingState` is not set. @default false */
  isLoading?: boolean;
  /** Content shown while loading. */
  loadingState?: ReactNode;
  /** Number of skeleton rows while loading, and of rows the empty state fills. @default 5 */
  placeholderRows?: number;
  /** Content shown when data is empty. Defaults to "No data found." */
  emptyState?: ReactNode;
  /** Centers `emptyState` in the space below the header instead of in the first row. @default false */
  centeredEmptyState?: boolean;
  /** `comfortable` fixes a 40px header row and 56px body rows. @default 'default' */
  density?: TableDensity;
  /** Typography of the header cells. Defaults to `'mini'` when `density` is `'comfortable'`. @default 'medium' */
  headerWeight?: TableHeaderWeight;
  /** Hides the header row. @default false */
  hideHead?: boolean;
  /** Uses a fixed table layout, so column widths do not follow content. @default false */
  fixed?: boolean;
  /** Keeps the header pinned while the body scrolls. @default false */
  fixedHeader?: boolean;
  /** Keeps `Table.Footer` pinned to the bottom while the body scrolls. @default false */
  fixedFooter?: boolean;
  /** Removes the card border and background around the table. @default false */
  disableCardStyles?: boolean;
  /** Renders the body rows yourself instead of from the columns. */
  renderRows?: (data: T[]) => ReactNode[];
  /** Additional classes for the table element. */
  className?: string;
  /** Additional classes for the wrapper. */
  wrapperClassName?: string;
  /** Additional classes for the `thead` element. */
  headClassName?: string;
  /** Additional classes for every body row. */
  rowClassName?: string;
  /** Declarative `Table.Column`, `Table.ExpandableRow`, and `Table.Footer` children. */
  children?: ReactNode;
}

const COLUMN_SYMBOL = Symbol('Table.Column');
const EXPANDABLE_ROW_SYMBOL = Symbol('Table.ExpandableRow');
const FOOTER_SYMBOL = Symbol('Table.Footer');

interface MarkedComponent<P> {
  (props: P): ReactNode;
  __tableSlot?: symbol;
}

function TableColumnMarker<T>(_props: TableColumnProps<T>): ReactNode {
  return null;
}
(TableColumnMarker as MarkedComponent<TableColumnProps<unknown>>).__tableSlot =
  COLUMN_SYMBOL;

function TableExpandableRowMarker<T>(_props: TableExpandableRowProps<T>): ReactNode {
  return null;
}
(
  TableExpandableRowMarker as MarkedComponent<TableExpandableRowProps<unknown>>
).__tableSlot = EXPANDABLE_ROW_SYMBOL;

function TableFooterSlotMarker(_props: TableFooterBarProps): ReactNode {
  return null;
}
(TableFooterSlotMarker as MarkedComponent<TableFooterBarProps>).__tableSlot =
  FOOTER_SYMBOL;

const ALIGN_CLASSES: Record<TableAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const HEADER_TYPOGRAPHY_CLASSES: Record<TableHeaderWeight, string> = {
  medium: 'text-body-small-medium',
  regular: 'text-body-small-regular',
  mini: 'text-body-mini-medium',
};

function isInteractiveTarget(target: EventTarget | null, rowElement: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const interactive = target.closest(
    'a, button, input, select, textarea, summary, [role="button"], [role="link"], [role="checkbox"], [role="menuitem"]',
  );
  return Boolean(interactive && interactive !== rowElement);
}

function resolveRowKey<T>(
  row: T,
  index: number,
  rowKey?: keyof T | ((row: T, index: number) => Key),
): Key {
  if (typeof rowKey === 'function') {
    return rowKey(row, index);
  }
  if (rowKey !== undefined && row && typeof row === 'object') {
    const candidate = (row as Record<PropertyKey, unknown>)[rowKey];
    if (typeof candidate === 'string' || typeof candidate === 'number') {
      return candidate;
    }
  }
  return index;
}

function parseTableChildren<T>(children: ReactNode): {
  columns: TableColumnProps<T>[];
  expandableRow: TableExpandableRowProps<T> | null;
  footer: TableFooterBarProps | null;
} {
  const columns: TableColumnProps<T>[] = [];
  let expandableRow: TableExpandableRowProps<T> | null = null;
  let footer: TableFooterBarProps | null = null;

  const visit = (nodes: ReactNode) => {
    Children.forEach(nodes, (child) => {
      if (!isValidElement(child)) return;

      if (child.type === Fragment) {
        visit((child.props as { children?: ReactNode }).children);
        return;
      }

      const slot = (child.type as MarkedComponent<unknown>).__tableSlot;
      if (slot === COLUMN_SYMBOL) {
        columns.push(child.props as TableColumnProps<T>);
      } else if (slot === EXPANDABLE_ROW_SYMBOL) {
        expandableRow = child.props as TableExpandableRowProps<T>;
      } else if (slot === FOOTER_SYMBOL) {
        footer = child.props as TableFooterBarProps;
      }
    });
  };

  visit(children);
  return { columns, expandableRow, footer };
}

function DataTableRenderer<T>({
  data,
  rowKey,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  expandedRows = [],
  onToggleExpand,
  isRowExpandable,
  onRowClick,
  isLoading = false,
  loadingState,
  placeholderRows = 5,
  emptyState,
  centeredEmptyState = false,
  density = 'default',
  headerWeight,
  hideHead = false,
  fixed = false,
  fixedHeader = false,
  fixedFooter = false,
  disableCardStyles = false,
  renderRows,
  className,
  wrapperClassName,
  headClassName,
  rowClassName,
  children,
}: DataTableProps<T>) {
  const { columns, expandableRow, footer } = parseTableChildren<T>(children);
  const resolvedHeaderWeight: TableHeaderWeight =
    headerWeight ?? (density === 'comfortable' ? 'mini' : 'medium');
  const headerRowHeightClass = density === 'comfortable' ? 'h-10' : 'h-12';
  const bodyRowHeightClass = density === 'comfortable' ? 'h-14' : 'h-12';
  const cellVerticalPadding = density === 'comfortable' ? 'py-3.5' : 'py-3';
  const colSpanCount = Math.max(columns.length, 1);

  const renderHeaderCell = (column: TableColumnProps<T>) => {
    const ariaSort: 'ascending' | 'descending' | undefined =
      column.sortDirection === 'asc'
        ? 'ascending'
        : column.sortDirection === 'desc'
          ? 'descending'
          : undefined;

    if (column.renderHeader) {
      const rendered = column.renderHeader(column);
      if (isValidElement(rendered)) {
        const existingProps = rendered.props as Record<string, unknown>;
        return cloneElement(rendered as ReactElement<Record<string, unknown>>, {
          key: column.id,
          ...(ariaSort && existingProps['aria-sort'] === undefined
            ? { 'aria-sort': ariaSort }
            : {}),
          ...(existingProps.scope === undefined ? { scope: 'col' } : {}),
          ...(column.headerColSpan !== undefined &&
          existingProps.colSpan === undefined
            ? { colSpan: column.headerColSpan }
            : {}),
        });
      }
      return <Fragment key={column.id}>{rendered}</Fragment>;
    }

    const align = column.align ?? 'left';

    return (
      <th
        key={column.id}
        scope="col"
        colSpan={column.headerColSpan}
        aria-sort={ariaSort}
        className={cn(
          'px-4 py-3 align-middle text-text-secondary tabular-nums',
          ALIGN_CLASSES[align],
          HEADER_TYPOGRAPHY_CLASSES[resolvedHeaderWeight],
          column.className,
          column.headerClassName,
        )}
      >
        {column.label}
      </th>
    );
  };

  const renderBodyContent = () => {
    if (isLoading) {
      if (loadingState !== undefined) {
        return (
          <tr className="border-b border-border-gray last:border-0">
            <td colSpan={colSpanCount} className="p-4">
              {loadingState}
            </td>
          </tr>
        );
      }

      return Array.from({ length: placeholderRows }, (_, rowIndex) => (
        <tr
          key={`loading-${rowIndex}`}
          className={cn(
            'border-b border-border-gray last:border-0',
            bodyRowHeightClass,
            rowClassName,
          )}
        >
          {columns.map((column) => (
            <td
              key={column.id}
              className={cn(
                'px-4 align-middle',
                cellVerticalPadding,
                column.className,
                column.cellClassName,
              )}
            >
              {column.loadingCell ?? <Skeleton className="h-4 w-full" />}
            </td>
          ))}
        </tr>
      ));
    }

    if (data.length === 0) {
      const content = emptyState ?? (
        <span className="text-body-small-regular text-text-secondary">
          No data found.
        </span>
      );

      if (centeredEmptyState) {
        const minHeightPx = placeholderRows * (density === 'comfortable' ? 56 : 48);
        return (
          <tr className="border-0">
            <td colSpan={colSpanCount} className="p-0">
              <div
                style={{ minHeight: minHeightPx }}
                className="flex w-full items-center justify-center px-4 py-6 text-center"
              >
                {content}
              </div>
            </td>
          </tr>
        );
      }

      return (
        <tr className={cn('border-0', bodyRowHeightClass)}>
          <td
            colSpan={colSpanCount}
            className="px-4 py-6 text-center align-middle"
          >
            {content}
          </td>
        </tr>
      );
    }

    if (renderRows) {
      return renderRows(data);
    }

    return data.map((row, rowIndex) => {
      const key = resolveRowKey(row, rowIndex, rowKey);
      const canExpand =
        Boolean(expandableRow) &&
        Boolean(onToggleExpand) &&
        !onRowClick &&
        (isRowExpandable ? isRowExpandable(row) : true);
      const isExpanded = canExpand && expandedRows.includes(key);
      const isInteractive = Boolean(onRowClick) || canExpand;

      const handleActivate = () => {
        if (onRowClick) {
          onRowClick(row);
        } else if (canExpand && onToggleExpand) {
          onToggleExpand(key, !isExpanded);
        }
      };

      const handleRowClick = (event: MouseEvent<HTMLTableRowElement>) => {
        if (!isInteractive) return;
        if (isInteractiveTarget(event.target, event.currentTarget)) return;
        handleActivate();
      };

      const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
        if (!isInteractive) return;
        if (isInteractiveTarget(event.target, event.currentTarget)) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleActivate();
        }
      };

      const expandedContent = isExpanded && expandableRow ? (
        expandableRow.renderRows ? (
          expandableRow.renderRows(row, rowIndex)
        ) : expandableRow.render ? (
          <tr
            data-slot="table-expanded-row"
            className="border-b border-border-gray bg-bg-secondary/50 last:border-0"
          >
            <td colSpan={colSpanCount} className="p-0">
              {expandableRow.render(row, rowIndex)}
            </td>
          </tr>
        ) : null
      ) : null;

      return (
        <Fragment key={key}>
          <tr
            data-slot="table-row"
            data-expanded={isExpanded ? 'true' : undefined}
            tabIndex={isInteractive ? 0 : undefined}
            aria-expanded={canExpand ? isExpanded : undefined}
            onClick={isInteractive ? handleRowClick : undefined}
            onKeyDown={isInteractive ? handleRowKeyDown : undefined}
            className={cn(
              'border-b border-border-gray last:border-0',
              bodyRowHeightClass,
              isInteractive &&
                'cursor-pointer transition-[background-color] duration-150 ease-out hover:bg-control-hover/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-base motion-reduce:transition-none',
              rowClassName,
            )}
          >
            {columns.map((column) => {
              if (column.renderCell) {
                return (
                  <Fragment key={column.id}>
                    {column.renderCell(row, rowIndex, column.id)}
                  </Fragment>
                );
              }

              const align = column.align ?? 'left';
              const value = column.getValue
                ? column.getValue(row, rowIndex, column.id)
                : ((row as Record<string, unknown>)[column.id] as ReactNode);

              return (
                <td
                  key={column.id}
                  data-slot="table-cell"
                  className={cn(
                    'truncate px-4 align-middle text-body-small-regular text-text-primary tabular-nums',
                    ALIGN_CLASSES[align],
                    cellVerticalPadding,
                    column.className,
                    column.cellClassName,
                  )}
                >
                  {value}
                </td>
              );
            })}
          </tr>
          {expandedContent}
        </Fragment>
      );
    });
  };

  return (
    <div
      data-slot="table-wrapper"
      className={cn(
        'relative flex flex-col overflow-hidden',
        !disableCardStyles && 'rounded-xl bg-bg-primary shadow-medium',
        wrapperClassName,
      )}
    >
      <div
        data-slot="table-container"
        className="w-full overflow-auto"
      >
        <table
          data-slot="table"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className={cn(
            'w-full border-collapse border-border-gray',
            fixed && 'table-fixed',
            className,
          )}
        >
          {!hideHead && columns.length > 0 ? (
            <thead
              data-slot="table-header"
              className={cn(
                'border-b border-border-gray',
                fixedHeader && 'sticky top-0 z-10 bg-bg-primary',
                headClassName,
              )}
            >
              <tr
                className={cn(
                  'select-none border-b border-border-gray tabular-nums last:border-0',
                  headerRowHeightClass,
                )}
              >
                {columns.map(renderHeaderCell)}
              </tr>
            </thead>
          ) : null}
          <tbody data-slot="table-body" className="overflow-hidden">
            {renderBodyContent()}
          </tbody>
        </table>
      </div>
      {footer ? (
        <div
          data-slot="table-footer-bar"
          className={cn(
            'border-t border-border-gray px-4 py-3',
            fixedFooter && 'sticky bottom-0 z-10 bg-bg-primary',
            footer.className,
          )}
        >
          {footer.children}
        </div>
      ) : null}
    </div>
  );
}

export interface TypedTableComponent<T> {
  (props: DataTableProps<T>): ReactNode;
  Column: (props: TableColumnProps<T>) => ReactNode;
  ExpandableRow: (props: TableExpandableRowProps<T>) => ReactNode;
  Footer: (props: TableFooterBarProps) => ReactNode;
}

/**
 * Creates a type-safe data Table bound to one row type `T`.
 * Call once at module scope, not during render.
 */
function createTable<T>(): TypedTableComponent<T> {
  const BoundTable = ((props: DataTableProps<T>) => (
    <DataTableRenderer<T> {...props} />
  )) as TypedTableComponent<T>;

  BoundTable.Column = TableColumnMarker as (
    props: TableColumnProps<T>,
  ) => ReactNode;
  BoundTable.ExpandableRow = TableExpandableRowMarker as (
    props: TableExpandableRowProps<T>,
  ) => ReactNode;
  BoundTable.Footer = TableFooterSlotMarker;

  return BoundTable;
}

/* -------------------------------------------------------------------------- */
/* Backward-compatible composable HTML table primitives                        */
/* -------------------------------------------------------------------------- */

type LegacyTableProps = ComponentProps<'table'> & { data?: undefined };

/**
 * Supports both Palermo's declarative `<Table data={...}>` API and legacy composable
 * `<Table><TableHeader>...</TableHeader></Table>` HTML primitives.
 */
function TableComponent<T = Record<string, unknown>>(
  props: DataTableProps<T> | LegacyTableProps,
) {
  if ('data' in props && props.data !== undefined) {
    return <DataTableRenderer<T> {...(props as DataTableProps<T>)} />;
  }

  const { className, ...tableProps } = props as LegacyTableProps;
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn('w-full caption-bottom text-body-small-regular', className)}
        {...tableProps}
      />
    </div>
  );
}

const Table = Object.assign(TableComponent, {
  Column: TableColumnMarker,
  ExpandableRow: TableExpandableRowMarker,
  Footer: TableFooterSlotMarker,
});

function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('[&_tr]:border-b [&_tr]:border-border-gray', className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'border-t border-border-gray bg-bg-secondary font-medium [&>tr]:last:border-b-0',
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'border-b border-border-gray transition-colors hover:bg-control-hover/60 data-[state=selected]:bg-control-selected',
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-12 px-4 text-left align-middle whitespace-nowrap text-body-small-medium text-text-secondary [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'px-4 py-3 align-middle whitespace-nowrap text-body-small-regular text-text-primary [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('mt-4 text-body-small-regular text-text-secondary', className)}
      {...props}
    />
  );
}

export {
  createTable,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};

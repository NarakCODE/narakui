'use client';

import {
  isValidElement,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  ArrowUpDown,
  Building2,
  ChevronDown,
  CircleDashed,
  Filter,
  Globe,
  Layers,
  List,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  Button,
  type ButtonMode,
  type ButtonSize,
} from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const MULTI_FILTER_ICONS = {
  filter: Filter,
  sort: ArrowUpDown,
  layers: Layers,
  'circle-dashed': CircleDashed,
  tag: Tag,
  buildings: Building2,
  sliders: SlidersHorizontal,
  globe: Globe,
  sparkles: Sparkles,
  search: Search,
  list: List,
} as const satisfies Record<string, LucideIcon>;

export type MultiSelectFilterIconName = keyof typeof MULTI_FILTER_ICONS;

export interface MultiSelectFilterIconDescriptor {
  name: MultiSelectFilterIconName | (string & {});
  className?: string;
}

export type MultiSelectFilterIconValue =
  | MultiSelectFilterIconName
  | (string & {})
  | MultiSelectFilterIconDescriptor
  | ReactNode;

export type MultiSelectFilterSize = 'micro' | 'small' | 'regular' | 'large';
export type MultiSelectFilterAlign = 'start' | 'center' | 'end';

export interface MultiSelectFilterItem {
  readonly id: string;
  readonly name: string;
  readonly triggerName?: string;
  readonly icon?: ReactNode;
}

export interface MultiSelectFilterGroup<
  T extends MultiSelectFilterItem = MultiSelectFilterItem,
> {
  readonly id: string;
  readonly heading?: ReactNode;
  readonly items: readonly T[];
  readonly renderItem?: (item: T) => ReactNode;
}

export interface MultiSelectSelectionIconsProps<
  T extends { readonly id: string; readonly icon?: ReactNode } = {
    readonly id: string;
    readonly icon?: ReactNode;
  },
> {
  /** Currently selected item ids. */
  selectedIds: readonly string[];
  /** Full item list providing icons for each id. */
  items: readonly T[];
  /** Maximum number of overlapping icons to display. @default 3 */
  limit?: number;
  /** Additional classes for the icon stack container. */
  className?: string;
}

/** Stacked icon preview for selected items inside a `MultiSelectFilter` trigger chip. */
function MultiSelectSelectionIcons<
  T extends { readonly id: string; readonly icon?: ReactNode },
>({
  selectedIds,
  items,
  limit = 3,
  className,
}: MultiSelectSelectionIconsProps<T>) {
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const visibleItems = useMemo(() => {
    const result: T[] = [];
    for (const item of items) {
      if (result.length >= limit) break;
      if (item.icon && selectedSet.has(item.id)) {
        result.push(item);
      }
    }
    return result;
  }, [items, limit, selectedSet]);

  return (
    <div
      data-slot="multi-select-selection-icons"
      className={cn('flex items-center', className)}
    >
      {visibleItems.map((item, index) => (
        <div
          key={item.id}
          style={{ zIndex: visibleItems.length - index }}
          className={cn(
            'overflow-hidden rounded-full border border-fill-inverse starting:opacity-0 starting:scale-90 transition-[opacity,transform] duration-150 ease-out motion-reduce:starting:scale-100 motion-reduce:transition-opacity',
            index === 0 ? 'ml-0' : '-ml-1.5',
          )}
        >
          {item.icon as ReactElement}
        </div>
      ))}
    </div>
  );
}

export interface MultiSelectFilterProps<
  T extends MultiSelectFilterItem = MultiSelectFilterItem,
> {
  /* Data and selection */
  /** Name of the filter, shown on the chip. */
  label: string;
  /** Options, each `{ id, name, triggerName? }`. Use either `items` or `groups`. */
  items?: readonly T[];
  /** Headed sections, each `{ id, heading?, items, renderItem? }`, shown in order. */
  groups?: readonly MultiSelectFilterGroup<T>[];
  /** Controlled selection. */
  selectedIds: readonly string[];
  /** Treats an empty selection as the cleared state, so selecting every item still filters. @default false */
  allowEmpty?: boolean;
  /** Keeps all selected as the cleared state but lets the last item be unchecked. @default false */
  allowEmptySelection?: boolean;
  /** Every selectable id, when `items` shows only part of them. */
  allSelectableIds?: readonly string[];
  /** Controls whether the chip shows as active, for selections over paginated items. */
  selectionActive?: boolean;
  /** Disables a row so it cannot be toggled. */
  getItemDisabled?: (item: T) => boolean;
  /** Tooltip on a disabled row that explains why. */
  renderItemDisabledTooltip?: (item: T) => ReactNode;

  /* Callbacks */
  /** Called with the next selection. The handlers below fall back to it. */
  onChange?: (ids: string[]) => void;
  /** Called when a row is checked or unchecked. */
  onToggle?: (id: string) => void;
  /** Called when a row's only button is clicked. */
  onSelectOnly?: (id: string) => void;
  /** Called by Select all and by the X when empty is not the cleared state. */
  onSelectAll?: () => void;
  /** Called by Clear all. */
  onClearAll?: () => void;
  /** Called when the query changes. */
  onSearchChange?: (search: string) => void;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /* Trigger */
  /** Icon on the cleared chip. */
  iconStart?: MultiSelectFilterIconValue;
  /** Chip size. Use `small` in compact tables and menus. @default 'regular' */
  size?: MultiSelectFilterSize;
  /** Button style of the cleared chip. @default 'dashed' */
  inactiveTriggerMode?: ButtonMode;
  /** Shows a chevron on the cleared chip. @default false */
  showInactiveTriggerChevron?: boolean;
  /** Icons of the picked items, shown before the chip's label. */
  renderSelectionIcons?: (selectedItems: T[]) => ReactNode;
  /** Also shows the selection icons when every item is selected. @default false */
  showSelectionIconsWhenAllSelected?: boolean;
  /** Shows only the selection icons in the chip; the label stays for screen readers. @default false */
  hideTriggerLabelText?: boolean;
  /** Chip label when every item is selected. Defaults to `label`. */
  allSelectedTriggerLabel?: ReactNode;
  /** Chip label when nothing is selected. Defaults to `label`. */
  emptyTriggerLabel?: ReactNode;
  /** Replaces the first-pick and `+N` preview in the active chip, for example with a skeleton. */
  triggerLabel?: ReactNode;
  /** Replaces the hover list of picks. Pass `null` to hide it. */
  triggerTooltip?: ReactNode;
  /** Separates the first pick from `+N` with a comma, for labels such as `18-25`. @default false */
  hasNumericLabels?: boolean;
  /** Disables the chip. @default false */
  disabled?: boolean;
  /** Classes for the center button of the chip. */
  triggerClassName?: string;
  /** Classes for the clickable part of the chip. */
  triggerContainerClassName?: string;

  /* Menu */
  /** Icon or avatar before each row's label. */
  renderItemStart?: (item: T) => MultiSelectFilterIconValue;
  /** Replaces each row's label. */
  renderItemLabel?: (item: T) => ReactNode;
  /** Content at the end of each row. */
  renderItemEnd?: (item: T) => MultiSelectFilterIconValue;
  /** Shows the search input. @default true */
  showSearch?: boolean;
  /** Placeholder of the search input. @default 'Search' */
  searchPlaceholder?: string;
  /** Controlled query. */
  searchText?: string;
  /** Skips the built-in name filter, for server-side search. @default false */
  disableClientFiltering?: boolean;
  /** Shows a spinner in the search input. @default false */
  searchInputLoading?: boolean;
  /** Shown when search matches no row. @default 'No results found.' */
  noResultsLabel?: ReactNode;
  /** Shows the only button on row hover. @default true */
  showOnlyButton?: boolean;
  /** Selected count in the footer. @default count => `${count} items` */
  itemsCountLabel?: (count: number) => ReactNode;
  /** Hides the footer count when nothing is selected. @default true */
  hideEmptyCount?: boolean;
  /** Hides the footer's Select all and Clear all button. @default false */
  hideSelectAllButton?: boolean;
  /** Hides only Clear all. @default false */
  hideClearAllButton?: boolean;
  /** Hides the footer. @default false */
  hideFooter?: boolean;
  /** Content between the search input and the list. */
  topRow?: ReactNode;
  /** Content between the list and the footer. */
  bottomRow?: ReactNode;
  /** Content at the end of the scrolling list, such as a load-more sentinel. */
  listFooter?: ReactNode;
  /** Content below the footer. */
  footerExtra?: ReactNode;
  /** Shown in place of the list when there are no items. */
  emptyState?: ReactNode;
  /** Alignment of the menu relative to the chip. Use `end` at the trailing edge of a toolbar. @default 'start' */
  align?: MultiSelectFilterAlign;
  /** Opens the menu on mount. @default false */
  defaultOpen?: boolean;
  /** Renders the menu in a portal. Set to `false` inside a dialog. @default true */
  withRadixPortal?: boolean;
  /** Classes for the outer wrapper. */
  className?: string;
}

const CHIP_RADIUS_CLASSES: Record<MultiSelectFilterSize, string> = {
  micro: 'rounded-sm',
  small: 'rounded-sm',
  regular: 'rounded-md',
  large: 'rounded-md',
};

const SEGMENT_SIZE_CLASSES: Record<MultiSelectFilterSize, string> = {
  micro: 'h-6 text-body-micro-medium',
  small: 'h-7 text-body-mini-medium',
  regular: 'h-8 text-body-small-medium',
  large: 'h-9 text-body-regular-medium',
};

const SEGMENT_PADDING_CLASSES: Record<MultiSelectFilterSize, string> = {
  micro: 'px-1.5',
  small: 'px-2',
  regular: 'px-2',
  large: 'px-2.5',
};

function isIconDescriptor(
  value: MultiSelectFilterIconValue,
): value is MultiSelectFilterIconDescriptor {
  return (
    typeof value === 'object' &&
    value !== null &&
    !isValidElement(value) &&
    'name' in value &&
    typeof (value as { name?: unknown }).name === 'string'
  );
}

function renderFilterIcon(
  icon: MultiSelectFilterIconValue | undefined,
  defaultClassName = 'size-3.5 shrink-0',
): ReactNode {
  if (icon === undefined || icon === null || typeof icon === 'boolean') {
    return null;
  }

  if (typeof icon === 'string') {
    if (icon in MULTI_FILTER_ICONS) {
      const IconComponent =
        MULTI_FILTER_ICONS[icon as MultiSelectFilterIconName];
      return <IconComponent aria-hidden="true" className={defaultClassName} />;
    }
    return null;
  }

  if (isIconDescriptor(icon)) {
    if (icon.name in MULTI_FILTER_ICONS) {
      const IconComponent =
        MULTI_FILTER_ICONS[icon.name as MultiSelectFilterIconName];
      return (
        <IconComponent
          aria-hidden="true"
          className={cn(defaultClassName, icon.className)}
        />
      );
    }
    return null;
  }

  return icon;
}

/**
 * Toolbar filter chip for narrowing a list or report to one or more values.
 * Supports flat or grouped options, search, hover "Only" shortcuts, stacked selection icons,
 * and both all-selected-as-cleared and empty-as-cleared semantics.
 */
function MultiSelectFilter<
  T extends MultiSelectFilterItem = MultiSelectFilterItem,
>({
  label,
  items,
  groups,
  selectedIds,
  allowEmpty = false,
  allowEmptySelection = false,
  allSelectableIds,
  selectionActive,
  getItemDisabled,
  renderItemDisabledTooltip,
  onChange,
  onToggle,
  onSelectOnly,
  onSelectAll,
  onClearAll,
  onSearchChange,
  onOpenChange,
  iconStart,
  size = 'regular',
  inactiveTriggerMode = 'dashed',
  showInactiveTriggerChevron = false,
  renderSelectionIcons,
  showSelectionIconsWhenAllSelected = false,
  hideTriggerLabelText = false,
  allSelectedTriggerLabel,
  emptyTriggerLabel,
  triggerLabel,
  triggerTooltip,
  hasNumericLabels = false,
  disabled = false,
  triggerClassName,
  triggerContainerClassName,
  renderItemStart,
  renderItemLabel,
  renderItemEnd,
  showSearch = true,
  searchPlaceholder = 'Search',
  searchText,
  disableClientFiltering = false,
  searchInputLoading = false,
  noResultsLabel = 'No results found.',
  showOnlyButton = true,
  itemsCountLabel = (count) => `${count} items`,
  hideEmptyCount = true,
  hideSelectAllButton = false,
  hideClearAllButton = false,
  hideFooter = false,
  topRow,
  bottomRow,
  listFooter,
  footerExtra,
  emptyState,
  align = 'start',
  defaultOpen = false,
  withRadixPortal = true,
  className,
}: MultiSelectFilterProps<T>) {
  const [open, setOpen] = useState(defaultOpen);
  const [internalSearch, setInternalSearch] = useState('');
  const [pendingEmpty, setPendingEmpty] = useState(false);
  const [openOrderSnapshot, setOpenOrderSnapshot] = useState<Set<string>>(
    () => new Set(selectedIds),
  );

  const query = searchText !== undefined ? searchText : internalSearch;

  const allItems = useMemo<T[]>(() => {
    if (groups) {
      return groups.flatMap((group) => [...group.items]);
    }
    return items ? [...items] : [];
  }, [groups, items]);

  const selectableIds = useMemo<string[]>(() => {
    if (allSelectableIds) {
      return [...allSelectableIds];
    }
    return allItems
      .filter((item) => !getItemDisabled?.(item))
      .map((item) => item.id);
  }, [allSelectableIds, allItems, getItemDisabled]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const effectiveSelectedSet = useMemo(
    () => (pendingEmpty ? new Set<string>() : selectedSet),
    [pendingEmpty, selectedSet],
  );

  const isAllSelected =
    selectableIds.length > 0 &&
    selectableIds.every((id) => selectedSet.has(id));
  const isNoneSelected = selectedIds.length === 0;

  const isActive =
    selectionActive !== undefined
      ? selectionActive
      : allowEmpty
        ? selectedIds.length > 0
        : !isAllSelected && selectedIds.length > 0;

  const selectedItems = useMemo(
    () => allItems.filter((item) => selectedSet.has(item.id)),
    [allItems, selectedSet],
  );

  const sortedFlatItems = useMemo(() => {
    if (groups || !items) return [];
    const picked: T[] = [];
    const rest: T[] = [];
    for (const item of items) {
      if (openOrderSnapshot.has(item.id)) {
        picked.push(item);
      } else {
        rest.push(item);
      }
    }
    return [...picked, ...rest];
  }, [groups, items, openOrderSnapshot]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setOpenOrderSnapshot(new Set(selectedIds));
      setPendingEmpty(false);
    } else {
      setPendingEmpty(false);
      if (searchText === undefined) {
        setInternalSearch('');
      }
    }
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const handleSearchChange = (next: string) => {
    if (searchText === undefined) {
      setInternalSearch(next);
    }
    onSearchChange?.(next);
  };

  const handleToggleItem = (item: T) => {
    if (getItemDisabled?.(item)) return;

    if (onToggle) {
      setPendingEmpty(false);
      onToggle(item.id);
      return;
    }

    if (pendingEmpty) {
      setPendingEmpty(false);
      onChange?.([item.id]);
      return;
    }

    const exists = selectedSet.has(item.id);
    const nextIds = exists
      ? selectedIds.filter((id) => id !== item.id)
      : [...selectedIds, item.id];

    if (nextIds.length === 0 && !allowEmpty && !allowEmptySelection) {
      onChange?.([...selectableIds]);
    } else {
      onChange?.(nextIds);
    }
  };

  const handleSelectOnly = (item: T) => {
    if (getItemDisabled?.(item)) return;
    setPendingEmpty(false);
    if (onSelectOnly) {
      onSelectOnly(item.id);
    } else {
      onChange?.([item.id]);
    }
  };

  const handleSelectAll = () => {
    setPendingEmpty(false);
    if (onSelectAll) {
      onSelectAll();
    } else {
      onChange?.([...selectableIds]);
    }
  };

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
      return;
    }

    if (allowEmpty || allowEmptySelection) {
      setPendingEmpty(false);
      onChange?.([]);
    } else {
      // With all selected as the cleared state, Clear all stages empty checkboxes
      // without triggering an empty filter; the next pick selects only that row.
      setPendingEmpty(true);
    }
  };

  const handleResetChip = () => {
    setPendingEmpty(false);
    if (allowEmpty) {
      if (onClearAll) {
        onClearAll();
      } else {
        onChange?.([]);
      }
    } else if (onSelectAll) {
      onSelectAll();
    } else {
      onChange?.([...selectableIds]);
    }
  };

  const effectiveCount = pendingEmpty ? 0 : selectedIds.length;
  const effectiveAllSelected = !pendingEmpty && isAllSelected;

  const firstSelected = selectedItems[0];
  const firstLabel =
    firstSelected?.triggerName ?? firstSelected?.name ?? selectedIds[0] ?? '';
  const extraCount = Math.max(selectedIds.length - 1, 0);

  const selectionIconsNode = renderSelectionIcons?.(selectedItems);

  const inactiveLabel = isAllSelected
    ? (allSelectedTriggerLabel ?? label)
    : isNoneSelected
      ? (emptyTriggerLabel ?? label)
      : label;

  const showIconsOnInactive =
    showSelectionIconsWhenAllSelected &&
    isAllSelected &&
    Boolean(selectionIconsNode);

  const defaultHoverTooltip =
    selectedItems.length > 0 ? (
      <div className="flex flex-col gap-0.5">
        {selectedItems.map((item) => (
          <span key={item.id} className="truncate">
            {item.name}
          </span>
        ))}
      </div>
    ) : null;

  const resolvedTooltip =
    triggerTooltip === undefined ? defaultHoverTooltip : triggerTooltip;

  const radiusClass = CHIP_RADIUS_CLASSES[size];

  const renderCheckboxRow = (item: T) => {
    const isRowDisabled = Boolean(getItemDisabled?.(item));
    const disabledTooltip = isRowDisabled
      ? renderItemDisabledTooltip?.(item)
      : undefined;
    const isChecked = effectiveSelectedSet.has(item.id);
    const labelContent = renderItemLabel ? renderItemLabel(item) : item.name;

    const row = (
      <Combobox.ItemCheckbox
        key={item.id}
        value={`${item.name} ${item.id}`}
        checked={isChecked}
        disabled={isRowDisabled && !disabledTooltip}
        checkboxDisabledReason={
          typeof disabledTooltip === 'string' ? disabledTooltip : undefined
        }
        showOnlyButton={showOnlyButton && !isRowDisabled}
        onOnlyClick={() => handleSelectOnly(item)}
        start={
          renderItemStart
            ? renderFilterIcon(renderItemStart(item), 'size-4 shrink-0')
            : undefined
        }
        end={
          renderItemEnd
            ? renderFilterIcon(renderItemEnd(item), 'size-3.5 shrink-0')
            : undefined
        }
        onSelect={() => handleToggleItem(item)}
      >
        {labelContent}
      </Combobox.ItemCheckbox>
    );

    if (
      isRowDisabled &&
      disabledTooltip !== undefined &&
      disabledTooltip !== null &&
      typeof disabledTooltip !== 'string'
    ) {
      return (
        <Tooltip key={item.id}>
          <TooltipTrigger asChild>
            <div>{row}</div>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={6}>
            {disabledTooltip}
          </TooltipContent>
        </Tooltip>
      );
    }

    return row;
  };

  const activeChipButton = (
    <Combobox.Trigger asChild>
      <button
        type="button"
        disabled={disabled}
        className={cn(
          'group/trigger inline-flex items-center rounded-l-[inherit] text-nowrap text-text-primary outline-none transition-[background-color,color] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none motion-reduce:transition-none aria-expanded:bg-control-selected',
          SEGMENT_SIZE_CLASSES[size],
          triggerContainerClassName,
        )}
      >
        <span
          className={cn(
            'inline-flex h-full items-center rounded-l-[inherit] text-text-secondary transition-colors duration-150 ease-out group-hover/trigger:bg-control-hover motion-reduce:transition-none',
            SEGMENT_PADDING_CLASSES[size],
          )}
        >
          {label}
        </span>
        <span
          aria-hidden="true"
          className="h-full w-px shrink-0 bg-border-gray"
        />
        <span
          className={cn(
            'inline-flex h-full items-center gap-1.5 transition-colors duration-150 ease-out group-hover/trigger:bg-control-hover motion-reduce:transition-none',
            SEGMENT_PADDING_CLASSES[size],
            triggerClassName,
          )}
        >
          {selectionIconsNode ? (
            <span aria-hidden="true" className="flex shrink-0 items-center">
              {selectionIconsNode}
            </span>
          ) : null}

          {triggerLabel !== undefined ? (
            triggerLabel
          ) : hideTriggerLabelText ? (
            <span className="sr-only">
              {firstLabel}
              {extraCount > 0 ? ` +${extraCount}` : ''}
            </span>
          ) : (
            <span
              key={firstSelected?.id ?? selectedIds[0]}
              data-slot="multi-select-filter-pill"
              className="flex min-w-0 origin-left items-baseline starting:opacity-0 starting:scale-95 transition-[opacity,transform] duration-150 ease-out motion-reduce:starting:scale-100 motion-reduce:transition-opacity"
            >
              <span className="max-w-40 truncate">{firstLabel}</span>
              {extraCount > 0 ? (
                <span className="shrink-0 whitespace-pre text-text-secondary tabular-nums">
                  {hasNumericLabels ? `, +${extraCount}` : ` +${extraCount}`}
                </span>
              ) : null}
            </span>
          )}
        </span>
      </button>
    </Combobox.Trigger>
  );

  const showFooterAction =
    !hideSelectAllButton &&
    (effectiveAllSelected ? !hideClearAllButton : selectableIds.length > 0);
  const showFooterCount = effectiveCount > 0 || !hideEmptyCount;

  return (
    <div
      data-slot="multi-select-filter"
      data-active={isActive ? 'true' : 'false'}
      className={cn('inline-flex items-center', className)}
    >
      <Combobox.Root open={open} onOpenChange={handleOpenChange}>
        {!isActive ? (
          <Combobox.Trigger asChild>
            <Button
              mode={inactiveTriggerMode}
              size={size as ButtonSize}
              disabled={disabled}
              allowScaleOnClick={false}
              iconStart={
                showIconsOnInactive ? undefined : renderFilterIcon(iconStart)
              }
              iconEnd={
                showInactiveTriggerChevron ? (
                  <ChevronDown
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-text-tertiary transition-transform duration-150 ease-out group-data-[state=open]/button:rotate-180 motion-reduce:transition-none"
                  />
                ) : undefined
              }
              className={cn('text-nowrap', triggerContainerClassName)}
            >
              <span
                className={cn(
                  'inline-flex min-w-0 items-center gap-1.5',
                  triggerClassName,
                )}
              >
                {showIconsOnInactive ? (
                  <span aria-hidden="true" className="flex shrink-0 items-center">
                    {selectionIconsNode}
                  </span>
                ) : null}
                <span className={cn(hideTriggerLabelText && 'sr-only')}>
                  {inactiveLabel}
                </span>
              </span>
            </Button>
          </Combobox.Trigger>
        ) : (
          <div
            className={cn(
              'inline-flex origin-left items-center bg-control-bg shadow-low starting:opacity-0 starting:scale-95 transition-[opacity,transform] duration-150 ease-out motion-reduce:starting:scale-100 motion-reduce:transition-opacity',
              radiusClass,
              disabled && 'opacity-50 shadow-none',
            )}
          >
            {resolvedTooltip !== null && resolvedTooltip !== undefined && !open ? (
              <Tooltip>
                <TooltipTrigger asChild>{activeChipButton}</TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={6}>
                  {resolvedTooltip}
                </TooltipContent>
              </Tooltip>
            ) : (
              activeChipButton
            )}

            <span
              aria-hidden="true"
              className="h-full w-px shrink-0 bg-border-gray"
            />
            <button
              type="button"
              disabled={disabled}
              aria-label={`Clear ${label} filter`}
              onClick={(event) => {
                event.stopPropagation();
                handleResetChip();
              }}
              className={cn(
                'inline-flex items-center justify-center rounded-r-[inherit] px-1.5 text-text-secondary outline-none transition-[background-color,color] duration-150 ease-out hover:bg-control-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none motion-reduce:transition-none',
                SEGMENT_SIZE_CLASSES[size],
              )}
            >
              <X aria-hidden="true" className="size-3.5 shrink-0" />
            </button>
          </div>
        )}

        <Combobox.Content
          align={align}
          sideOffset={6}
          size={240}
          withRadixPortal={withRadixPortal}
        >
          <Combobox.Command shouldFilter={!disableClientFiltering}>
            {showSearch ? (
              <Combobox.Input
                placeholder={searchPlaceholder}
                value={query}
                onValueChange={handleSearchChange}
                loading={searchInputLoading}
                onClear={() => handleSearchChange('')}
                clearLabel="Clear search"
              />
            ) : null}

            {topRow}

            {allItems.length === 0 && emptyState !== undefined ? (
              <div data-slot="multi-select-empty-state" className="p-3">
                {emptyState}
              </div>
            ) : (
              <Combobox.List>
                <Combobox.Empty>{noResultsLabel}</Combobox.Empty>
                {groups
                  ? groups.map((group, groupIndex) => (
                      <div key={group.id}>
                        {groupIndex > 0 ? (
                          <Combobox.Separator className="my-1" />
                        ) : null}
                        <Combobox.Group heading={group.heading}>
                          {group.items.map((item) =>
                            group.renderItem ? (
                              <div key={item.id}>{group.renderItem(item)}</div>
                            ) : (
                              renderCheckboxRow(item)
                            ),
                          )}
                        </Combobox.Group>
                      </div>
                    ))
                  : sortedFlatItems.map(renderCheckboxRow)}
                {listFooter}
              </Combobox.List>
            )}

            {bottomRow}

            {!hideFooter && (showFooterCount || showFooterAction) ? (
              <>
                <Combobox.Separator alwaysRender />
                <div
                  data-slot="multi-select-footer"
                  className="flex min-h-9 items-center justify-between gap-2 px-2.5 py-1.5"
                >
                  <span className="text-body-mini-regular text-text-secondary tabular-nums">
                    {showFooterCount ? itemsCountLabel(effectiveCount) : null}
                  </span>

                  {showFooterAction ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (effectiveAllSelected) {
                          handleClearAll();
                        } else {
                          handleSelectAll();
                        }
                      }}
                      className="rounded-sm px-1.5 py-0.5 text-body-mini-medium text-text-secondary transition-colors duration-150 ease-out hover:bg-control-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                    >
                      {effectiveAllSelected ? 'Clear all' : 'Select all'}
                    </button>
                  ) : null}
                </div>
              </>
            ) : null}

            {footerExtra}
          </Combobox.Command>
        </Combobox.Content>
      </Combobox.Root>
    </div>
  );
}

export { MultiSelectFilter, MultiSelectSelectionIcons };

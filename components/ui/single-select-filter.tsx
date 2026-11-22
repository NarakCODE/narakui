'use client';

import { isValidElement, useState, type ReactNode } from 'react';
import {
  ArrowUpDown,
  Building2,
  Check,
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
import { Button, type ButtonSize } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { cn } from '@/lib/utils';

const FILTER_ICONS = {
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

export type SingleSelectFilterIconName = keyof typeof FILTER_ICONS;

export interface SingleSelectFilterIconDescriptor {
  name: SingleSelectFilterIconName | (string & {});
  className?: string;
}

export type SingleSelectFilterIconValue =
  | SingleSelectFilterIconName
  | (string & {})
  | SingleSelectFilterIconDescriptor
  | ReactNode;

export type SingleSelectFilterSize = 'micro' | 'small' | 'regular' | 'large';
export type SingleSelectFilterAlign = 'start' | 'center' | 'end';

export interface SingleSelectFilterItem<Id extends string = string> {
  readonly id: Id;
  readonly name: string;
}

export interface SingleSelectFilterProps<
  Items extends readonly [
    SingleSelectFilterItem,
    ...SingleSelectFilterItem[],
  ],
> {
  /** Name of the filter, shown on the chip. */
  label: string;
  /** Options, each `{ id, name }`. Needs at least one. */
  items: Items;
  /** Id of the chosen option. A value matching no item shows the first item. */
  value: Items[number]['id'];
  /** Called with the id of the picked option. */
  onChange: (id: Items[number]['id']) => void;
  /** Option that means no filter. At this value the chip is dashed; otherwise it shows an X that returns here. */
  defaultValue?: Items[number]['id'];
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Icon on the dashed chip at `defaultValue`. */
  iconStart?: SingleSelectFilterIconValue;
  /** Icon or avatar before each row's label. */
  renderItemStart?: (item: Items[number]) => SingleSelectFilterIconValue;
  /** Replaces each row's label in the menu. */
  renderItemLabel?: (item: Items[number]) => ReactNode;
  /** Chip size. Use `small` in compact toolbars and tables. @default 'regular' */
  size?: SingleSelectFilterSize;
  /** Alignment of the menu relative to the chip. @default 'start' */
  align?: SingleSelectFilterAlign;
  /** Disables the chip. @default false */
  disabled?: boolean;
  /** Renders the menu in a portal. Set to `false` inside a dialog. @default true */
  withRadixPortal?: boolean;
  /** Classes for the outer wrapper. */
  className?: string;
}

const CHIP_RADIUS_CLASSES: Record<SingleSelectFilterSize, string> = {
  micro: 'rounded-sm',
  small: 'rounded-sm',
  regular: 'rounded-md',
  large: 'rounded-md',
};

const SEGMENT_SIZE_CLASSES: Record<SingleSelectFilterSize, string> = {
  micro: 'h-6 text-body-micro-medium',
  small: 'h-7 text-body-mini-medium',
  regular: 'h-8 text-body-small-medium',
  large: 'h-9 text-body-regular-medium',
};

const SEGMENT_PADDING_CLASSES: Record<SingleSelectFilterSize, string> = {
  micro: 'px-1.5',
  small: 'px-2',
  regular: 'px-2',
  large: 'px-2.5',
};

function isIconDescriptor(
  value: SingleSelectFilterIconValue,
): value is SingleSelectFilterIconDescriptor {
  return (
    typeof value === 'object' &&
    value !== null &&
    !isValidElement(value) &&
    'name' in value &&
    typeof (value as { name?: unknown }).name === 'string'
  );
}

function renderFilterIcon(
  icon: SingleSelectFilterIconValue | undefined,
  defaultClassName = 'size-3.5 shrink-0',
): ReactNode {
  if (icon === undefined || icon === null || typeof icon === 'boolean') {
    return null;
  }

  if (typeof icon === 'string') {
    if (icon in FILTER_ICONS) {
      const IconComponent = FILTER_ICONS[icon as SingleSelectFilterIconName];
      return <IconComponent aria-hidden="true" className={defaultClassName} />;
    }
    return null;
  }

  if (isIconDescriptor(icon)) {
    if (icon.name in FILTER_ICONS) {
      const IconComponent =
        FILTER_ICONS[icon.name as SingleSelectFilterIconName];
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
 * Toolbar filter chip where exactly one option is always chosen.
 * Supports an optional `defaultValue` that renders the chip as a dashed trigger until narrowed.
 */
function SingleSelectFilter<
  Items extends readonly [
    SingleSelectFilterItem,
    ...SingleSelectFilterItem[],
  ],
>({
  label,
  items,
  value,
  onChange,
  defaultValue,
  onOpenChange,
  iconStart,
  renderItemStart,
  renderItemLabel,
  size = 'regular',
  align = 'start',
  disabled = false,
  withRadixPortal = true,
  className,
}: SingleSelectFilterProps<Items>) {
  const [open, setOpen] = useState(false);

  const selectedItem =
    items.find((item) => item.id === value) ?? items[0];
  const isAtDefault =
    defaultValue !== undefined && selectedItem.id === defaultValue;
  const showClearButton = defaultValue !== undefined && !isAtDefault;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const radiusClass = CHIP_RADIUS_CLASSES[size];

  return (
    <div
      data-slot="single-select-filter"
      data-active={!isAtDefault ? 'true' : 'false'}
      className={cn('inline-flex items-center', className)}
    >
      <Combobox.Root open={open} onOpenChange={handleOpenChange}>
        {isAtDefault ? (
          <Combobox.Trigger asChild>
            <Button
              mode="dashed"
              size={size as ButtonSize}
              disabled={disabled}
              allowScaleOnClick={false}
              iconStart={renderFilterIcon(iconStart)}
              className="text-nowrap"
            >
              {label}
            </Button>
          </Combobox.Trigger>
        ) : (
          <div
            className={cn(
              'inline-flex items-center bg-control-bg shadow-low',
              radiusClass,
              disabled && 'opacity-50 shadow-none',
            )}
          >
            <Combobox.Trigger asChild>
              <button
                type="button"
                disabled={disabled}
                className={cn(
                  'group/trigger inline-flex items-center text-nowrap text-text-primary outline-none transition-[background-color,color] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none motion-reduce:transition-none aria-expanded:bg-control-selected',
                  SEGMENT_SIZE_CLASSES[size],
                  showClearButton ? 'rounded-l-[inherit]' : 'rounded-[inherit]',
                )}
              >
                <span
                  className={cn(
                    'inline-flex h-full items-center text-text-secondary transition-colors duration-150 ease-out group-hover/trigger:bg-control-hover motion-reduce:transition-none',
                    showClearButton ? 'rounded-l-[inherit]' : 'rounded-l-[inherit]',
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
                    'inline-flex h-full items-center transition-colors duration-150 ease-out group-hover/trigger:bg-control-hover motion-reduce:transition-none',
                    !showClearButton && 'rounded-r-[inherit]',
                    SEGMENT_PADDING_CLASSES[size],
                  )}
                >
                  <span className="max-w-40 truncate">{selectedItem.name}</span>
                </span>
              </button>
            </Combobox.Trigger>

            {showClearButton ? (
              <>
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
                    if (defaultValue !== undefined) {
                      onChange(defaultValue);
                    }
                  }}
                  className={cn(
                    'inline-flex items-center justify-center rounded-r-[inherit] px-1.5 text-text-secondary outline-none transition-[background-color,color] duration-150 ease-out hover:bg-control-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none motion-reduce:transition-none',
                    SEGMENT_SIZE_CLASSES[size],
                  )}
                >
                  <X aria-hidden="true" className="size-3.5 shrink-0" />
                </button>
              </>
            ) : null}
          </div>
        )}

        <Combobox.Content
          align={align}
          sideOffset={6}
          size={180}
          withRadixPortal={withRadixPortal}
        >
          <Combobox.Command shouldFilter={false}>
            <Combobox.List>
              {items.map((item) => {
                const isSelected = item.id === selectedItem.id;
                return (
                  <Combobox.Item
                    key={item.id}
                    value={item.id}
                    start={
                      renderItemStart
                        ? renderFilterIcon(renderItemStart(item), 'size-4 shrink-0')
                        : undefined
                    }
                    end={
                      isSelected ? (
                        <Check
                          aria-hidden="true"
                          className="size-3.5 shrink-0 text-text-primary"
                        />
                      ) : undefined
                    }
                    onSelect={() => {
                      onChange(item.id);
                      handleOpenChange(false);
                    }}
                  >
                    {renderItemLabel ? renderItemLabel(item) : item.name}
                  </Combobox.Item>
                );
              })}
            </Combobox.List>
          </Combobox.Command>
        </Combobox.Content>
      </Combobox.Root>
    </div>
  );
}

export { SingleSelectFilter };

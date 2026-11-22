'use client';

import {
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Bot,
  ChartPie,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  Copy,
  Download,
  Ellipsis,
  ExternalLink,
  Eye,
  Files,
  FileText,
  Filter,
  Folder,
  Globe,
  Info,
  Layers,
  LayoutGrid,
  Library,
  Link as LinkIcon,
  List,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Star,
  Tag,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  TriangleAlert,
  UserPlus,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  Combobox,
  type ComboboxIconDescriptor,
  type ComboboxIconName,
  type ComboboxIconValue,
} from '@/components/ui/combobox';
import { cn } from '@/lib/utils';

export type FilterBuilderSize = 'micro' | 'small' | 'regular' | 'large';

export type FilterBuilderAlign = 'start' | 'center' | 'end';

export interface FilterBuilderSegmentClassNames {
  field?: string;
  operator?: string;
  value?: string;
}

export type FilterConditionValue = string | number | string[] | null;

export interface FilterCondition {
  fieldId: string | null;
  operatorId: string | null;
  value: FilterConditionValue;
}

export interface FilterBuilderOption {
  value: string;
  label: ReactNode;
  searchValue?: string;
  iconStart?: ComboboxIconValue;
  disabled?: boolean;
}

export interface FilterBuilderOperator {
  id: string;
  label: ReactNode;
  searchValue?: string;
  iconStart?: ComboboxIconValue;
  disabled?: boolean;
}

export interface FilterBuilderSelectValueConfig {
  type: 'select';
  options: readonly FilterBuilderOption[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: ReactNode;
  compatibilityKey?: string;
}

export interface FilterBuilderNumberValueConfig {
  type: 'number';
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  compatibilityKey?: string;
}

export interface FilterBuilderTextValueConfig {
  type: 'text';
  placeholder?: string;
  allowEmpty?: boolean;
  compatibilityKey?: string;
}

export interface FilterBuilderMultiValueConfig {
  type: 'multi';
  options?: readonly FilterBuilderOption[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (search: string) => void;
  allowCustom?: boolean;
  emptyMessage?: ReactNode;
  compatibilityKey?: string;
}

export type FilterBuilderValueConfig =
  | FilterBuilderSelectValueConfig
  | FilterBuilderNumberValueConfig
  | FilterBuilderTextValueConfig
  | FilterBuilderMultiValueConfig;

export interface FilterBuilderField {
  id: string;
  label: ReactNode;
  searchValue?: string;
  iconStart?: ComboboxIconValue;
  disabled?: boolean;
  operators: readonly FilterBuilderOperator[];
  defaultOperatorId?: string;
  value: FilterBuilderValueConfig;
}

export interface FilterBuilderProps {
  /** Available fields with their operators and value configurations. */
  fields: readonly FilterBuilderField[];
  /** Controlled condition state (`fieldId`, `operatorId`, `value`). */
  condition: FilterCondition;
  /** Called whenever the field, operator, or value changes. */
  onConditionChange: (condition: FilterCondition) => void;
  /** Placeholder shown in the field segment when no field is selected. */
  fieldPlaceholder?: string;
  /** Placeholder shown in the operator segment when no operator is selected. */
  operatorPlaceholder?: string;
  /** Fallback placeholder shown in the value segment when no value is set. */
  valuePlaceholder?: string;
  /** Shows a search input inside the field selector menu. */
  showFieldSearch?: boolean;
  /** Placeholder for the field selector search input. */
  fieldSearchPlaceholder?: string;
  /** Shared control height, padding, and typography scale across all three segments. */
  size?: FilterBuilderSize;
  /** Disables all three segments and prevents interaction. */
  disabled?: boolean;
  /** Renders combobox popovers in a Radix portal when true. */
  withRadixPortal?: boolean;
  /** Alignment of combobox popovers relative to their segment triggers. */
  align?: FilterBuilderAlign;
  /** Accessible label for the filter condition group. */
  ariaLabel?: string;
  /** Additional classes for the outer filter builder container. */
  className?: string;
  /** Optional class names applied individually to the field, operator, and value segments. */
  segmentClassNames?: FilterBuilderSegmentClassNames;
}

const SEGMENT_ICONS = {
  'layout-grid': LayoutGrid,
  list: List,
  plus: Plus,
  'arrow-up-right': ArrowUpRight,
  filter: Filter,
  'chevron-down': ChevronDown,
  download: Download,
  star: Star,
  ellipsis: Ellipsis,
  check: Check,
  x: X,
  search: Search,
  trash: Trash2,
  edit: Pencil,
  copy: Copy,
  'external-link': ExternalLink,
  refresh: RefreshCw,
  settings: Settings,
  info: Info,
  warning: TriangleAlert,
  'check-circle': CircleCheck,
  'close-circle': CircleX,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  tag: Tag,
  'user-plus': UserPlus,
  eye: Eye,
  'chart-pie': ChartPie,
  leaderboard: BarChart3,
  references: BookOpen,
  documents: Files,
  globe: Globe,
  'thumbs-up': ThumbsUp,
  'thumbs-down': ThumbsDown,
  link: LinkIcon,
  folder: Folder,
  'file-text': FileText,
  sparkles: Sparkles,
  bot: Bot,
  layers: Layers,
  library: Library,
} as const satisfies Record<ComboboxIconName, LucideIcon>;

const SEGMENT_SIZE_CLASSES: Record<FilterBuilderSize, string> = {
  micro: 'min-h-6 px-2 text-body-micro-medium gap-1 [&_svg]:size-3',
  small: 'min-h-7 px-2.5 text-body-mini-medium gap-1.5 [&_svg]:size-3.5',
  regular: 'min-h-8 px-3 text-body-small-medium gap-1.5 [&_svg]:size-4',
  large: 'min-h-9 px-3.5 text-body-regular-medium gap-2 [&_svg]:size-4',
};

const INTERACTIVE_SEGMENT_CLASSES =
  'inline-flex min-w-0 max-w-full cursor-pointer items-center whitespace-nowrap select-none bg-transparent text-left outline-none transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none hover:bg-control-hover data-[state=open]:bg-control-selected aria-expanded:bg-control-selected focus-visible:relative focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-default disabled:text-text-tertiary [&_svg]:shrink-0';

function isComboboxIconDescriptor(value: ComboboxIconValue): value is ComboboxIconDescriptor {
  return (
    typeof value === 'object' &&
    value !== null &&
    !isValidElement(value) &&
    'name' in value &&
    typeof (value as { name?: unknown }).name === 'string'
  );
}

function renderSegmentIcon(
  icon: ComboboxIconValue | undefined,
  defaultClassName = 'shrink-0 text-text-secondary',
): ReactNode {
  if (icon === undefined || icon === null || typeof icon === 'boolean') {
    return null;
  }

  if (typeof icon === 'string') {
    if (icon in SEGMENT_ICONS) {
      const IconComponent = SEGMENT_ICONS[icon as ComboboxIconName];
      return <IconComponent aria-hidden="true" className={defaultClassName} />;
    }
    return null;
  }

  if (isComboboxIconDescriptor(icon)) {
    if (icon.name in SEGMENT_ICONS) {
      const IconComponent = SEGMENT_ICONS[icon.name as ComboboxIconName];
      return <IconComponent aria-hidden="true" className={cn(defaultClassName, icon.className)} />;
    }
    return null;
  }

  return icon;
}

function extractTextFromNode(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractTextFromNode).join(' ').trim();
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractTextFromNode(node.props.children);
  }
  return '';
}

function getCommandItemValue(id: string, label: ReactNode, searchValue?: string): string {
  const text = (searchValue ?? extractTextFromNode(label)).trim();
  return text ? `${text} ${id}` : id;
}

function isValidNumberValue(value: number, config: FilterBuilderNumberValueConfig): boolean {
  if (!Number.isFinite(value)) return false;
  if (config.min !== undefined && value < config.min) return false;
  if (config.max !== undefined && value > config.max) return false;
  if (config.step !== undefined && config.step > 0) {
    const base = config.min ?? 0;
    const quotient = (value - base) / config.step;
    if (Math.abs(quotient - Math.round(quotient)) >= 1e-7) {
      return false;
    }
  }
  return true;
}

function isValueValidForConfig(
  value: FilterConditionValue,
  config: FilterBuilderValueConfig,
): boolean {
  if (value === null) return false;

  switch (config.type) {
    case 'select':
      return (
        typeof value === 'string' &&
        config.options.some((opt) => !opt.disabled && opt.value === value)
      );
    case 'number':
      return typeof value === 'number' && isValidNumberValue(value, config);
    case 'text':
      return typeof value === 'string' && (config.allowEmpty ? true : value.length > 0);
    case 'multi': {
      if (!Array.isArray(value)) return false;
      if (!value.every((entry) => typeof entry === 'string' && entry.length > 0)) return false;
      if (config.options && !config.allowCustom) {
        return value.every((entry) =>
          config.options!.some((opt) => !opt.disabled && opt.value === entry),
        );
      }
      if (config.options && config.allowCustom) {
        return value.every(
          (entry) => !config.options!.some((opt) => opt.disabled && opt.value === entry),
        );
      }
      return true;
    }
  }
}

interface SelectValueSegmentProps {
  fieldId: string;
  config: FilterBuilderSelectValueConfig;
  value: FilterConditionValue;
  fallbackPlaceholder: string;
  size: FilterBuilderSize;
  disabled: boolean;
  withRadixPortal: boolean;
  align: FilterBuilderAlign;
  radiusClassName: string;
  className?: string;
  onChange: (value: string) => void;
}

function SelectValueSegment({
  fieldId,
  config,
  value,
  fallbackPlaceholder,
  size,
  disabled,
  withRadixPortal,
  align,
  radiusClassName,
  className,
  onChange,
}: SelectValueSegmentProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setOpen(false);
    setSearch('');
  }, [fieldId]);

  const stringValue = typeof value === 'string' ? value : null;
  const selectedOption =
    stringValue !== null ? config.options.find((opt) => opt.value === stringValue) : undefined;
  const hasValue = selectedOption !== undefined || (stringValue !== null && stringValue.length > 0);
  const placeholder = config.placeholder ?? fallbackPlaceholder;

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) return;
    setOpen(nextOpen);
    if (!nextOpen) {
      setSearch('');
    }
  };

  return (
    <Combobox.Root open={disabled ? false : open} onOpenChange={handleOpenChange}>
      <Combobox.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          data-slot="filter-builder-value"
          className={cn(
            INTERACTIVE_SEGMENT_CLASSES,
            SEGMENT_SIZE_CLASSES[size],
            radiusClassName,
            hasValue ? 'text-text-primary' : 'text-text-tertiary',
            className,
          )}
        >
          {renderSegmentIcon(selectedOption?.iconStart)}
          <span className="truncate">
            {selectedOption ? selectedOption.label : hasValue ? stringValue : placeholder}
          </span>
        </button>
      </Combobox.Trigger>
      <Combobox.Content
        withRadixPortal={withRadixPortal}
        align={align}
        sideOffset={6}
        size={220}
      >
        <Combobox.Command>
          {config.searchable ? (
            <Combobox.Input
              value={search}
              onValueChange={setSearch}
              onClear={() => setSearch('')}
              clearLabel="Clear search"
              placeholder={config.searchPlaceholder ?? 'Search...'}
            />
          ) : null}
          <Combobox.List>
            <Combobox.Empty>{config.emptyMessage ?? 'No options found'}</Combobox.Empty>
            {config.options.map((option) => {
              const isSelected = stringValue === option.value;
              return (
                <Combobox.Item
                  key={option.value}
                  value={getCommandItemValue(option.value, option.label, option.searchValue)}
                  disabled={option.disabled}
                  start={option.iconStart}
                  end={
                    isSelected ? (
                      <Check aria-hidden="true" className="size-3.5 shrink-0 text-text-primary" />
                    ) : undefined
                  }
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                    setSearch('');
                  }}
                >
                  {option.label}
                </Combobox.Item>
              );
            })}
          </Combobox.List>
        </Combobox.Command>
      </Combobox.Content>
    </Combobox.Root>
  );
}

interface NumberValueSegmentProps {
  fieldId: string;
  fieldLabel: ReactNode;
  config: FilterBuilderNumberValueConfig;
  value: FilterConditionValue;
  fallbackPlaceholder: string;
  size: FilterBuilderSize;
  disabled: boolean;
  radiusClassName: string;
  className?: string;
  onChange: (value: number | null) => void;
}

function NumberValueSegment({
  fieldId,
  fieldLabel,
  config,
  value,
  fallbackPlaceholder,
  size,
  disabled,
  radiusClassName,
  className,
  onChange,
}: NumberValueSegmentProps) {
  const syncedValue = typeof value === 'number' && Number.isFinite(value) ? String(value) : '';
  const [draft, setDraft] = useState(syncedValue);
  const [isInvalid, setIsInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setDraft(syncedValue);
    setIsInvalid(false);
  }, [syncedValue, fieldId]);

  const commit = (trigger: 'enter' | 'blur') => {
    if (inputRef.current?.validity.badInput) {
      if (trigger === 'enter') {
        setIsInvalid(true);
      } else {
        setDraft(syncedValue);
        setIsInvalid(false);
      }
      return;
    }

    const trimmed = draft.trim();
    if (trimmed === '') {
      setDraft('');
      setIsInvalid(false);
      if (value !== null) {
        onChange(null);
      }
      return;
    }

    const parsed = Number(trimmed);
    if (isValidNumberValue(parsed, config)) {
      setDraft(String(parsed));
      setIsInvalid(false);
      if (value !== parsed) {
        onChange(parsed);
      }
      return;
    }

    if (trigger === 'enter') {
      setIsInvalid(true);
    } else {
      setDraft(syncedValue);
      setIsInvalid(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commit('enter');
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setDraft(syncedValue);
      setIsInvalid(false);
      event.currentTarget.blur();
    }
  };

  const labelText = extractTextFromNode(fieldLabel);

  return (
    <input
      ref={inputRef}
      type="number"
      inputMode="decimal"
      data-slot="filter-builder-value"
      aria-label={labelText ? `${labelText} value` : 'Filter value'}
      aria-invalid={isInvalid || undefined}
      disabled={disabled}
      min={config.min}
      max={config.max}
      step={config.step}
      placeholder={config.placeholder ?? fallbackPlaceholder}
      value={draft}
      onChange={(event) => {
        const nextDraft = event.target.value;
        setDraft(nextDraft);
        if (isInvalid) {
          const trimmed = nextDraft.trim();
          if (trimmed === '' && !event.target.validity.badInput) {
            setIsInvalid(false);
          } else {
            const parsed = Number(trimmed);
            if (!event.target.validity.badInput && isValidNumberValue(parsed, config)) {
              setIsInvalid(false);
            }
          }
        }
      }}
      onKeyDown={handleKeyDown}
      onBlur={() => commit('blur')}
      className={cn(
        'w-24 min-w-16 bg-transparent text-text-primary placeholder:text-text-tertiary outline-none transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none hover:bg-control-hover focus:bg-control-bg focus-visible:relative focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:text-text-tertiary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
        SEGMENT_SIZE_CLASSES[size],
        radiusClassName,
        isInvalid && 'relative z-10 text-text-red ring-1 ring-inset ring-red-base focus-visible:ring-red-base',
        className,
      )}
    />
  );
}

interface TextValueSegmentProps {
  fieldLabel: ReactNode;
  config: FilterBuilderTextValueConfig;
  value: FilterConditionValue;
  fallbackPlaceholder: string;
  size: FilterBuilderSize;
  disabled: boolean;
  radiusClassName: string;
  className?: string;
  onChange: (value: string | null) => void;
}

function TextValueSegment({
  fieldLabel,
  config,
  value,
  fallbackPlaceholder,
  size,
  disabled,
  radiusClassName,
  className,
  onChange,
}: TextValueSegmentProps) {
  const stringValue = typeof value === 'string' ? value : '';
  const labelText = extractTextFromNode(fieldLabel);

  return (
    <input
      type="text"
      data-slot="filter-builder-value"
      aria-label={labelText ? `${labelText} value` : 'Filter value'}
      disabled={disabled}
      placeholder={config.placeholder ?? fallbackPlaceholder}
      value={stringValue}
      onChange={(event) => {
        const next = event.target.value;
        onChange(next === '' && !config.allowEmpty ? null : next);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && config.allowEmpty && value === null && stringValue === '') {
          onChange('');
        }
      }}
      className={cn(
        'w-36 min-w-24 bg-transparent text-text-primary placeholder:text-text-tertiary outline-none transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none hover:bg-control-hover focus:bg-control-bg focus-visible:relative focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:text-text-tertiary',
        SEGMENT_SIZE_CLASSES[size],
        radiusClassName,
        className,
      )}
    />
  );
}

interface MultiValueSegmentProps {
  fieldId: string;
  fieldLabel: ReactNode;
  config: FilterBuilderMultiValueConfig;
  value: FilterConditionValue;
  fallbackPlaceholder: string;
  size: FilterBuilderSize;
  disabled: boolean;
  withRadixPortal: boolean;
  align: FilterBuilderAlign;
  radiusClassName: string;
  className?: string;
  onChange: (value: string[]) => void;
}

function MultiValueSegment({
  fieldId,
  fieldLabel,
  config,
  value,
  fallbackPlaceholder,
  size,
  disabled,
  withRadixPortal,
  align,
  radiusClassName,
  className,
  onChange,
}: MultiValueSegmentProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [customDraft, setCustomDraft] = useState('');
  const inlineInputRef = useRef<HTMLInputElement | null>(null);
  const commandRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setOpen(false);
    setSearch('');
    setCustomDraft('');
  }, [fieldId]);

  const selectedValues = useMemo(
    () => (Array.isArray(value) ? value : []),
    [value],
  );

  const optionByValue = useMemo(() => {
    const map = new Map<string, FilterBuilderOption>();
    if (config.options) {
      for (const opt of config.options) {
        map.set(opt.value, opt);
      }
    }
    return map;
  }, [config.options]);

  const placeholder = config.placeholder ?? fallbackPlaceholder;
  const hasOptions = config.options !== undefined;
  const allowCustom = Boolean(config.allowCustom);
  const showSearchInput = Boolean(config.searchable) || Boolean(config.onSearchChange) || allowCustom;
  const labelText = extractTextFromNode(fieldLabel);

  const removeValue = (target: string) => {
    onChange(selectedValues.filter((item) => item !== target));
  };

  const toggleValue = (target: string) => {
    if (selectedValues.includes(target)) {
      removeValue(target);
    } else {
      onChange([...selectedValues, target]);
    }
  };

  const addCustomValues = (raw: string): boolean => {
    const parts = raw
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part.length > 0);
    if (parts.length === 0) return false;

    const next = [...selectedValues];
    let changed = false;
    for (const part of parts) {
      if (!next.includes(part)) {
        next.push(part);
        changed = true;
      }
    }
    if (changed) {
      onChange(next);
    }
    return true;
  };

  const renderPills = () =>
    selectedValues.map((entry) => {
      const option = optionByValue.get(entry);
      const pillLabel = option ? option.label : entry;
      const accessibleText = extractTextFromNode(pillLabel) || entry;

      return (
        <span
          key={entry}
          data-slot="filter-builder-pill"
          className="inline-flex max-w-full origin-left items-center gap-1 rounded-sm bg-bg-tertiary px-1.5 py-0.5 text-body-mini-medium text-text-primary starting:opacity-0 starting:scale-95 transition-[opacity,transform] duration-150 ease-out motion-reduce:starting:scale-100 motion-reduce:transition-opacity"
        >
          <span className="truncate">{pillLabel}</span>
          {!disabled ? (
            <button
              type="button"
              aria-label={`Remove ${accessibleText}`}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                removeValue(entry);
              }}
              className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-xs text-text-tertiary transition-colors duration-150 ease-out hover:bg-control-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <X aria-hidden="true" className="size-3!" />
            </button>
          ) : null}
        </span>
      );
    });

  // Inline custom tag entry when `allowCustom` is true and no `options` list is provided.
  if (!hasOptions && allowCustom) {
    return (
      <div
        data-slot="filter-builder-value"
        onClick={() => {
          if (!disabled) {
            inlineInputRef.current?.focus();
          }
        }}
        className={cn(
          'inline-flex min-w-32 max-w-full flex-wrap items-center py-0.5 transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none hover:bg-control-hover focus-within:relative focus-within:z-10 focus-within:bg-control-bg focus-within:ring-2 focus-within:ring-ring',
          SEGMENT_SIZE_CLASSES[size],
          radiusClassName,
          className,
        )}
      >
        {renderPills()}
        <input
          ref={inlineInputRef}
          type="text"
          disabled={disabled}
          aria-label={labelText ? `${labelText} values` : 'Filter values'}
          placeholder={selectedValues.length === 0 ? placeholder : ''}
          value={customDraft}
          onChange={(event) => {
            const next = event.target.value;
            if (next.includes(',')) {
              const segments = next.split(',');
              const trailing = segments.pop() ?? '';
              addCustomValues(segments.join(','));
              setCustomDraft(trailing);
            } else {
              setCustomDraft(next);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault();
              if (addCustomValues(customDraft)) {
                setCustomDraft('');
              }
            } else if (
              event.key === 'Backspace' &&
              customDraft === '' &&
              selectedValues.length > 0
            ) {
              event.preventDefault();
              onChange(selectedValues.slice(0, -1));
            }
          }}
          className="min-w-16 flex-1 bg-transparent text-text-primary placeholder:text-text-tertiary outline-none disabled:pointer-events-none disabled:text-text-tertiary"
        />
      </div>
    );
  }

  // Fallback read-only multi display when neither `options` nor `allowCustom` is provided.
  if (!hasOptions) {
    return (
      <div
        data-slot="filter-builder-value"
        className={cn(
          'inline-flex min-w-0 max-w-full flex-wrap items-center py-0.5',
          SEGMENT_SIZE_CLASSES[size],
          radiusClassName,
          selectedValues.length === 0 && 'text-text-tertiary',
          className,
        )}
      >
        {selectedValues.length > 0 ? renderPills() : <span className="truncate">{placeholder}</span>}
      </div>
    );
  }

  const trimmedSearch = search.trim();
  const canCreateCustom =
    allowCustom &&
    trimmedSearch.length > 0 &&
    !config.options!.some((opt) => opt.value === trimmedSearch) &&
    !selectedValues.includes(trimmedSearch);

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) return;
    setOpen(nextOpen);
    if (!nextOpen) {
      setSearch('');
      config.onSearchChange?.('');
    }
  };

  const handleSearchChange = (nextSearch: string) => {
    setSearch(nextSearch);
    config.onSearchChange?.(nextSearch);
  };

  return (
    <Combobox.Root open={disabled ? false : open} onOpenChange={handleOpenChange}>
      <Combobox.Trigger asChild>
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          data-slot="filter-builder-value"
          onKeyDown={(event) => {
            if (disabled) return;
            if (event.target !== event.currentTarget) return;
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setOpen((prev) => !prev);
            }
          }}
          className={cn(
            INTERACTIVE_SEGMENT_CLASSES,
            'flex-wrap py-0.5 whitespace-normal',
            SEGMENT_SIZE_CLASSES[size],
            radiusClassName,
            selectedValues.length === 0 ? 'text-text-tertiary' : 'text-text-primary',
            disabled && 'pointer-events-none cursor-default text-text-tertiary',
            className,
          )}
        >
          {selectedValues.length > 0 ? (
            renderPills()
          ) : (
            <span className="truncate">{placeholder}</span>
          )}
        </div>
      </Combobox.Trigger>
      <Combobox.Content
        withRadixPortal={withRadixPortal}
        align={align}
        sideOffset={6}
        size={240}
      >
        <Combobox.Command
          ref={commandRef}
          shouldFilter={config.onSearchChange ? false : true}
        >
          {showSearchInput ? (
            <Combobox.Input
              value={search}
              onValueChange={handleSearchChange}
              onClear={() => handleSearchChange('')}
              clearLabel="Clear search"
              placeholder={config.searchPlaceholder ?? 'Search...'}
              onKeyDown={(event) => {
                if (!allowCustom) return;
                if (event.key === ',') {
                  event.preventDefault();
                  if (addCustomValues(search)) {
                    handleSearchChange('');
                  }
                } else if (event.key === 'Enter' && trimmedSearch.length > 0) {
                  const activeItem = commandRef.current?.querySelector(
                    '[cmdk-item][data-selected="true"]',
                  );
                  if (!activeItem) {
                    event.preventDefault();
                    if (addCustomValues(trimmedSearch)) {
                      handleSearchChange('');
                    }
                  }
                }
              }}
            />
          ) : null}
          <Combobox.List>
            {!canCreateCustom ? (
              <Combobox.Empty>{config.emptyMessage ?? 'No options found'}</Combobox.Empty>
            ) : null}
            {config.options!.map((option) => {
              const checked = selectedValues.includes(option.value);
              return (
                <Combobox.ItemCheckbox
                  key={option.value}
                  value={getCommandItemValue(option.value, option.label, option.searchValue)}
                  checked={checked}
                  disabled={option.disabled}
                  showOnlyButton={false}
                  start={option.iconStart}
                  onSelect={() => toggleValue(option.value)}
                >
                  {option.label}
                </Combobox.ItemCheckbox>
              );
            })}
            {canCreateCustom ? (
              <Combobox.Item
                key={`__custom__:${trimmedSearch}`}
                value={trimmedSearch}
                start="plus"
                onSelect={() => {
                  addCustomValues(trimmedSearch);
                  handleSearchChange('');
                }}
              >
                Add &ldquo;{trimmedSearch}&rdquo;
              </Combobox.Item>
            ) : null}
          </Combobox.List>
        </Combobox.Command>
      </Combobox.Content>
    </Combobox.Root>
  );
}

/**
 * Joined three-segment filter condition builder (`Field`, `Operator`, `Value`) supporting
 * select, number, text, and multi-value inputs with compatible field switching.
 */
function FilterBuilder({
  fields,
  condition,
  onConditionChange,
  fieldPlaceholder = 'Select field',
  operatorPlaceholder = 'Select operator',
  valuePlaceholder = 'Select value',
  showFieldSearch = false,
  fieldSearchPlaceholder = 'Search fields',
  size = 'regular',
  disabled = false,
  withRadixPortal = true,
  align = 'start',
  ariaLabel = 'Filter condition',
  className,
  segmentClassNames,
}: FilterBuilderProps) {
  const [fieldOpen, setFieldOpen] = useState(false);
  const [fieldSearch, setFieldSearch] = useState('');
  const [operatorOpen, setOperatorOpen] = useState(false);

  const selectedField = useMemo(
    () => (condition.fieldId ? fields.find((f) => f.id === condition.fieldId) : undefined),
    [fields, condition.fieldId],
  );

  const selectedOperator = useMemo(
    () =>
      selectedField && condition.operatorId
        ? selectedField.operators.find((op) => op.id === condition.operatorId)
        : undefined,
    [selectedField, condition.operatorId],
  );

  const isCompactRadius = size === 'micro' || size === 'small';
  const leftRadiusClass = isCompactRadius ? 'rounded-l-sm' : 'rounded-l-md';
  const rightRadiusClass = isCompactRadius ? 'rounded-r-sm' : 'rounded-r-md';

  const handleSelectField = (nextField: FilterBuilderField) => {
    setFieldOpen(false);
    setFieldSearch('');

    if (nextField.id === condition.fieldId) {
      return;
    }

    const canKeepOperator =
      condition.operatorId !== null &&
      nextField.operators.some((op) => !op.disabled && op.id === condition.operatorId);

    const hasValidDefaultOperator =
      nextField.defaultOperatorId !== undefined &&
      nextField.operators.some((op) => !op.disabled && op.id === nextField.defaultOperatorId);

    const nextOperatorId = canKeepOperator
      ? condition.operatorId
      : hasValidDefaultOperator
        ? nextField.defaultOperatorId!
        : null;

    const hasMatchingCompatibilityKey =
      Boolean(selectedField?.value.compatibilityKey) &&
      selectedField?.value.compatibilityKey === nextField.value.compatibilityKey;

    const nextValue =
      hasMatchingCompatibilityKey && isValueValidForConfig(condition.value, nextField.value)
        ? condition.value
        : null;

    onConditionChange({
      fieldId: nextField.id,
      operatorId: nextOperatorId,
      value: nextValue,
    });
  };

  const handleSelectOperator = (operator: FilterBuilderOperator) => {
    setOperatorOpen(false);
    if (operator.id === condition.operatorId) {
      return;
    }
    onConditionChange({
      ...condition,
      operatorId: operator.id,
    });
  };

  const operatorDisabled = disabled || !selectedField;

  const renderValueSegment = () => {
    if (!selectedField) {
      return (
        <button
          type="button"
          disabled
          data-slot="filter-builder-value"
          className={cn(
            INTERACTIVE_SEGMENT_CLASSES,
            SEGMENT_SIZE_CLASSES[size],
            rightRadiusClass,
            'text-text-tertiary',
            segmentClassNames?.value,
          )}
        >
          <span className="truncate">{valuePlaceholder}</span>
        </button>
      );
    }

    const valueConfig = selectedField.value;

    switch (valueConfig.type) {
      case 'select':
        return (
          <SelectValueSegment
            fieldId={selectedField.id}
            config={valueConfig}
            value={condition.value}
            fallbackPlaceholder={valuePlaceholder}
            size={size}
            disabled={disabled}
            withRadixPortal={withRadixPortal}
            align={align}
            radiusClassName={rightRadiusClass}
            className={segmentClassNames?.value}
            onChange={(nextValue) =>
              onConditionChange({
                ...condition,
                value: nextValue,
              })
            }
          />
        );
      case 'number':
        return (
          <NumberValueSegment
            fieldId={selectedField.id}
            fieldLabel={selectedField.label}
            config={valueConfig}
            value={condition.value}
            fallbackPlaceholder={valuePlaceholder}
            size={size}
            disabled={disabled}
            radiusClassName={rightRadiusClass}
            className={segmentClassNames?.value}
            onChange={(nextValue) =>
              onConditionChange({
                ...condition,
                value: nextValue,
              })
            }
          />
        );
      case 'text':
        return (
          <TextValueSegment
            fieldLabel={selectedField.label}
            config={valueConfig}
            value={condition.value}
            fallbackPlaceholder={valuePlaceholder}
            size={size}
            disabled={disabled}
            radiusClassName={rightRadiusClass}
            className={segmentClassNames?.value}
            onChange={(nextValue) =>
              onConditionChange({
                ...condition,
                value: nextValue,
              })
            }
          />
        );
      case 'multi':
        return (
          <MultiValueSegment
            fieldId={selectedField.id}
            fieldLabel={selectedField.label}
            config={valueConfig}
            value={condition.value}
            fallbackPlaceholder={valuePlaceholder}
            size={size}
            disabled={disabled}
            withRadixPortal={withRadixPortal}
            align={align}
            radiusClassName={rightRadiusClass}
            className={segmentClassNames?.value}
            onChange={(nextValue) =>
              onConditionChange({
                ...condition,
                value: nextValue,
              })
            }
          />
        );
    }
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-slot="filter-builder"
      data-size={size}
      className={cn(
        'inline-flex max-w-full flex-wrap items-stretch divide-x divide-border-gray rounded-md bg-control-bg text-text-primary shadow-low',
        size === 'micro' || size === 'small' ? 'rounded-sm' : 'rounded-md',
        disabled && 'bg-bg-secondary text-text-tertiary shadow-none pointer-events-none',
        className,
      )}
    >
      {/* Segment 1: Field */}
      <Combobox.Root
        open={disabled ? false : fieldOpen}
        onOpenChange={(nextOpen) => {
          if (disabled) return;
          setFieldOpen(nextOpen);
          if (!nextOpen) {
            setFieldSearch('');
          }
        }}
      >
        <Combobox.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            data-slot="filter-builder-field"
            className={cn(
              INTERACTIVE_SEGMENT_CLASSES,
              SEGMENT_SIZE_CLASSES[size],
              leftRadiusClass,
              selectedField ? 'text-text-primary' : 'text-text-tertiary',
              segmentClassNames?.field,
            )}
          >
            {renderSegmentIcon(selectedField?.iconStart)}
            <span className="truncate">
              {selectedField ? selectedField.label : fieldPlaceholder}
            </span>
          </button>
        </Combobox.Trigger>
        <Combobox.Content
          withRadixPortal={withRadixPortal}
          align={align}
          sideOffset={6}
          size={220}
        >
          <Combobox.Command>
            {showFieldSearch ? (
              <Combobox.Input
                value={fieldSearch}
                onValueChange={setFieldSearch}
                onClear={() => setFieldSearch('')}
                clearLabel="Clear search"
                placeholder={fieldSearchPlaceholder}
              />
            ) : null}
            <Combobox.List>
              <Combobox.Empty>No fields found</Combobox.Empty>
              {fields.map((field) => {
                const isSelected = field.id === condition.fieldId;
                return (
                  <Combobox.Item
                    key={field.id}
                    value={getCommandItemValue(field.id, field.label, field.searchValue)}
                    disabled={field.disabled}
                    start={field.iconStart}
                    end={
                      isSelected ? (
                        <Check aria-hidden="true" className="size-3.5 shrink-0 text-text-primary" />
                      ) : undefined
                    }
                    onSelect={() => handleSelectField(field)}
                  >
                    {field.label}
                  </Combobox.Item>
                );
              })}
            </Combobox.List>
          </Combobox.Command>
        </Combobox.Content>
      </Combobox.Root>

      {/* Segment 2: Operator */}
      <Combobox.Root
        open={operatorDisabled ? false : operatorOpen}
        onOpenChange={(nextOpen) => {
          if (operatorDisabled) return;
          setOperatorOpen(nextOpen);
        }}
      >
        <Combobox.Trigger asChild>
          <button
            type="button"
            disabled={operatorDisabled}
            data-slot="filter-builder-operator"
            className={cn(
              INTERACTIVE_SEGMENT_CLASSES,
              SEGMENT_SIZE_CLASSES[size],
              'rounded-none',
              selectedOperator && !operatorDisabled
                ? 'text-text-secondary'
                : 'text-text-tertiary',
              segmentClassNames?.operator,
            )}
          >
            {renderSegmentIcon(selectedOperator?.iconStart)}
            <span className="truncate">
              {selectedOperator ? selectedOperator.label : operatorPlaceholder}
            </span>
          </button>
        </Combobox.Trigger>
        <Combobox.Content
          withRadixPortal={withRadixPortal}
          align={align}
          sideOffset={6}
          size={180}
        >
          <Combobox.Command>
            <Combobox.List>
              {(selectedField?.operators ?? []).map((operator) => {
                const isSelected = operator.id === condition.operatorId;
                return (
                  <Combobox.Item
                    key={operator.id}
                    value={getCommandItemValue(operator.id, operator.label, operator.searchValue)}
                    disabled={operator.disabled}
                    start={operator.iconStart}
                    end={
                      isSelected ? (
                        <Check aria-hidden="true" className="size-3.5 shrink-0 text-text-primary" />
                      ) : undefined
                    }
                    onSelect={() => handleSelectOperator(operator)}
                  >
                    {operator.label}
                  </Combobox.Item>
                );
              })}
            </Combobox.List>
          </Combobox.Command>
        </Combobox.Content>
      </Combobox.Root>

      {/* Segment 3: Value */}
      {renderValueSegment()}
    </div>
  );
}

export { FilterBuilder };

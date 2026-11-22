'use client';

import {
  isValidElement,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import {
  AlertCircle,
  AtSign,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Copy,
  DollarSign,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Folder,
  Globe,
  Hash,
  Info,
  Key,
  Link as LinkIcon,
  Lock,
  Mail,
  MapPin,
  Percent,
  Phone,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  TriangleAlert,
  User,
  X,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type InputSize = 'mini' | 'small' | 'regular' | 'micro' | 'large';
export type InputVariant = 'control' | 'chromeless';

const INPUT_ICONS = {
  search: Search,
  eye: Eye,
  'eye-slash': EyeOff,
  'eye-off': EyeOff,
  link: LinkIcon,
  info: Info,
  globe: Globe,
  mail: Mail,
  lock: Lock,
  user: User,
  'at-sign': AtSign,
  hash: Hash,
  calendar: Calendar,
  clock: Clock,
  check: Check,
  x: X,
  'alert-circle': AlertCircle,
  warning: TriangleAlert,
  sparkles: Sparkles,
  filter: Filter,
  sliders: SlidersHorizontal,
  key: Key,
  tag: Tag,
  folder: Folder,
  'file-text': FileText,
  'dollar-sign': DollarSign,
  percent: Percent,
  phone: Phone,
  'map-pin': MapPin,
  'external-link': ExternalLink,
  copy: Copy,
  'chevron-down': ChevronDown,
  plus: Plus,
} as const satisfies Record<string, LucideIcon>;

export type InputIconName = keyof typeof INPUT_ICONS;

export interface InputIconDescriptor {
  /** Registered icon name. */
  name: InputIconName | (string & {});
  /** Optional filled treatment. */
  variant?: 'default' | 'filled';
  /** Additional classes applied to the icon glyph. */
  className?: string;
}

export type InputIconValue = InputIconName | InputIconDescriptor | ReactNode;

function isIconDescriptor(value: InputIconValue): value is InputIconDescriptor {
  return (
    typeof value === 'object' &&
    value !== null &&
    !isValidElement(value) &&
    'name' in value &&
    typeof (value as { name?: unknown }).name === 'string'
  );
}

/** Resolves an icon name, descriptor object, or custom React node into a rendered glyph. */
function renderInputIcon(value: InputIconValue | undefined): ReactNode {
  if (value === undefined || value === null || typeof value === 'boolean') {
    return null;
  }

  if (typeof value === 'string') {
    if (value in INPUT_ICONS) {
      const IconComponent = INPUT_ICONS[value as InputIconName];
      return <IconComponent aria-hidden="true" className="size-4 shrink-0" />;
    }
    return null;
  }

  if (isIconDescriptor(value)) {
    if (value.name in INPUT_ICONS) {
      const IconComponent = INPUT_ICONS[value.name as InputIconName];
      return (
        <IconComponent
          aria-hidden="true"
          className={cn(
            'size-4 shrink-0',
            value.variant === 'filled' && 'fill-current',
            value.className,
          )}
        />
      );
    }
    return null;
  }

  return value;
}

const INPUT_SIZE_CLASSES: Record<InputSize, string> = {
  mini: 'min-h-6 px-1.5 py-0.5 text-body-mini-regular',
  micro: 'min-h-6 px-1.5 py-0.5 text-body-mini-regular',
  small: 'min-h-7 px-1.5 py-0.5 text-body-small-regular',
  regular: 'min-h-9.5 px-1.5 py-1 text-body-small-regular',
  large: 'min-h-10 px-2 py-1 text-body-regular',
};

export interface InputProps
  extends Omit<ComponentProps<'input'>, 'size' | 'autoComplete'> {
  /** Label text for the input field. */
  label?: ReactNode;
  /** Content shown at the end of the label row. */
  endLabel?: ReactNode;
  /** Size of the input, or numeric HTML `size` attribute. */
  size?: InputSize | number;
  /** Visual surface treatment. `chromeless` drops background, border, padding, shadow, and hover tint. */
  variant?: InputVariant;
  /** Renders the native input as the surface itself with no wrapper. */
  standalone?: boolean;
  /** Whether to display the input in an error state. */
  error?: boolean;
  /** Error message shown below the input while `error` is true. */
  errorMessage?: string;
  /** Icon name, descriptor, or node at the start of the input. */
  iconStart?: InputIconValue;
  /** Icon name, descriptor, or node at the end of the input. */
  iconEnd?: InputIconValue;
  /** Callback fired when the end icon is clicked; renders the end icon as a focusable button. */
  onEndIconClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  /** Accessible name for the end icon button; required when `onEndIconClick` is set. */
  endIconLabel?: string;
  /** Node rendered before the native input inside the field surface. */
  preInputNode?: ReactNode;
  /** Content anchored to the field surface, such as a suggestions popover. */
  fieldOverlay?: ReactNode;
  /** Helper text displayed below the input. */
  hint?: ReactNode;
  /** Browser autocomplete mode. */
  autoComplete?: 'off' | 'on' | (string & {});
  /** Additional CSS classes applied to the outer container (or standalone input). */
  className?: string;
  /** Additional CSS classes applied to the native input element. */
  inputClassName?: string;
  /** Additional CSS classes applied to the field surface wrapper. */
  inputWrapperClassName?: string;
  /** Alias for outer container classes preserved for backward compatibility. */
  wrapperClassName?: string;
  /** Marks the input as a native clipboard source for surrounding shortcut scopes. */
  nativeClipboardSource?: boolean;
  /** Extra props spread onto the native input element. */
  inputRest?: ComponentPropsWithoutRef<'input'>;
}

/** Text field with optional label, icons, hint, error state, chromeless mode, and anchored overlay slot. */
function Input({
  label,
  endLabel,
  placeholder,
  type = 'text',
  size = 'regular',
  variant = 'control',
  standalone = false,
  disabled = false,
  readOnly = false,
  required = false,
  error = false,
  errorMessage,
  iconStart,
  iconEnd,
  onEndIconClick,
  endIconLabel,
  preInputNode,
  fieldOverlay,
  hint,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  autoFocus = false,
  autoComplete = 'off',
  className,
  inputClassName,
  inputWrapperClassName,
  wrapperClassName,
  id,
  name,
  nativeClipboardSource,
  inputRest,
  ...restProps
}: InputProps) {
  const generatedId = useId();
  const isInputGroupControl =
    (restProps as Record<string, unknown>)['data-slot'] === 'input-group-control';
  const resolvedId = inputRest?.id ?? id ?? generatedId;
  const isPresetSize = typeof size === 'string' && size in INPUT_SIZE_CLASSES;
  const resolvedSize: InputSize = isPresetSize ? (size as InputSize) : 'regular';
  const sizeClass = INPUT_SIZE_CLASSES[resolvedSize];

  const hasErrorText = Boolean(error && errorMessage);
  const hasHintText = Boolean(hint && !hasErrorText);
  const errorId = `${resolvedId}-error`;
  const hintId = `${resolvedId}-hint`;

  const describedBy =
    [
      inputRest?.['aria-describedby'] ?? restProps['aria-describedby'],
      hasErrorText ? errorId : undefined,
      hasHintText ? hintId : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  const surfaceClasses =
    variant === 'chromeless'
      ? cn(
          'relative w-full border-0 bg-transparent p-0 outline-none',
          resolvedSize === 'mini' || resolvedSize === 'micro'
            ? 'text-body-mini-regular'
            : resolvedSize === 'large'
              ? 'text-body-regular'
              : 'text-body-small-regular',
          disabled && 'cursor-not-allowed text-text-quaternary',
          readOnly && !disabled && 'cursor-default',
        )
      : cn(
          'relative w-full rounded-md border-[1.5px] border-transparent outline-none transition-[background-color,border-color] duration-150 ease-out motion-reduce:transition-none',
          sizeClass,
          disabled
            ? 'cursor-not-allowed bg-bg-tertiary text-text-quaternary dark:bg-bg-secondary'
            : readOnly
              ? 'cursor-default bg-bg-primary text-text-primary shadow-low focus-visible:shadow-low-focus has-focus-visible:shadow-low-focus dark:bg-bg-secondary'
              : 'bg-bg-primary text-text-primary shadow-low focus-visible:shadow-low-focus has-focus-visible:shadow-low-focus not-has-focus-visible:hover:bg-control-hover dark:bg-bg-secondary not-has-focus-visible:dark:hover:bg-control-bg',
          error && !disabled && 'border-fill-red',
        );

  const sharedInputProps: ComponentProps<'input'> = {
    type,
    placeholder,
    disabled,
    readOnly,
    required,
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    autoFocus,
    autoComplete,
    autoCorrect: 'off',
    spellCheck: false,
    name,
    size: typeof size === 'number' ? size : undefined,
    'aria-invalid': error ? true : restProps['aria-invalid'],
    'aria-errormessage': hasErrorText ? errorId : restProps['aria-errormessage'],
    'aria-describedby': describedBy,
    ...(nativeClipboardSource ? { 'data-native-clipboard-source': 'true' } : {}),
    ...restProps,
    ...inputRest,
    id: resolvedId,
  };

  if (isInputGroupControl) {
    return (
      <input
        data-size={resolvedSize}
        className={cn(
          'min-w-0 flex-1 bg-transparent px-0.5 text-body-small-regular text-text-primary outline-none placeholder:select-none placeholder:font-normal placeholder:text-text-tertiary disabled:cursor-not-allowed disabled:text-text-quaternary disabled:placeholder:text-text-quaternary',
          className,
          inputClassName,
        )}
        {...sharedInputProps}
      />
    );
  }

  const labelRow =
    label || endLabel ? (
      <div className="flex items-center justify-between gap-2">
        {label ? (
          <label
            className="w-max select-none text-body-small-medium text-text-primary"
            htmlFor={resolvedId}
          >
            <span>{label}</span>
          </label>
        ) : (
          <span />
        )}
        {endLabel ? (
          <div className="flex shrink-0 items-center text-body-mini-regular text-text-secondary">
            {endLabel}
          </div>
        ) : null}
      </div>
    ) : null;

  const feedbackRow = hasErrorText ? (
    <span id={errorId} className="select-none text-body-small-medium text-text-red">
      {errorMessage}
    </span>
  ) : hasHintText ? (
    <div id={hintId} className="select-none text-body-mini-regular text-text-tertiary">
      {hint}
    </div>
  ) : null;

  if (standalone) {
    const standaloneInput = (
      <input
        data-slot="input"
        data-size={resolvedSize}
        data-variant={variant}
        className={cn(
          surfaceClasses,
          'placeholder:select-none placeholder:font-normal',
          disabled
            ? 'placeholder:text-text-quaternary'
            : 'placeholder:text-text-tertiary',
          !labelRow && !feedbackRow && className,
          inputClassName,
        )}
        {...sharedInputProps}
      />
    );

    if (!labelRow && !feedbackRow) {
      return standaloneInput;
    }

    return (
      <div
        data-slot="input-wrapper"
        className={cn('flex flex-col gap-2', className, wrapperClassName)}
      >
        {labelRow}
        {standaloneInput}
        {feedbackRow}
      </div>
    );
  }

  const startIconNode = renderInputIcon(iconStart);
  const endIconNode = renderInputIcon(iconEnd);

  return (
    <div
      data-slot="input-wrapper"
      className={cn('flex flex-col gap-2', className, wrapperClassName)}
    >
      {labelRow}
      <div
        data-slot="input-surface"
        data-size={resolvedSize}
        data-variant={variant}
        className={cn(
          surfaceClasses,
          'flex h-full items-center gap-1',
          inputWrapperClassName,
        )}
      >
        {startIconNode ? (
          <span
            className="flex size-4 shrink-0 select-none items-center justify-center text-text-secondary [&>*]:size-full"
            aria-hidden="true"
          >
            {startIconNode}
          </span>
        ) : null}
        {preInputNode}
        <input
          data-slot="input"
          data-size={resolvedSize}
          className={cn(
            'min-w-0 flex-1 bg-transparent px-0.5 outline-none placeholder:select-none placeholder:font-normal',
            disabled
              ? 'cursor-not-allowed text-text-quaternary placeholder:text-text-quaternary'
              : 'text-text-primary placeholder:text-text-tertiary',
            readOnly && !disabled && 'cursor-default',
            inputClassName,
          )}
          {...sharedInputProps}
        />
        {endIconNode ? (
          onEndIconClick ? (
            <button
              type="button"
              onClick={onEndIconClick}
              disabled={disabled}
              aria-label={endIconLabel ?? 'Input action'}
              className="flex size-4 shrink-0 cursor-pointer select-none items-center justify-center rounded-[4px] text-text-secondary outline-none transition-[transform,color] duration-150 ease-out hover:text-text-primary focus-visible:shadow-focus active:scale-[0.95] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none [&>*]:size-full"
            >
              {endIconNode}
            </button>
          ) : (
            <span
              className="flex size-4 shrink-0 select-none items-center justify-center text-text-secondary [&>*]:size-full"
              aria-hidden="true"
            >
              {endIconNode}
            </span>
          )
        ) : null}
        {fieldOverlay}
      </div>
      {feedbackRow}
    </div>
  );
}

export interface SuggestionInputProps
  extends Omit<InputProps, 'standalone' | 'fieldOverlay'> {
  /** Candidate suggestion strings filtered against the current value. */
  suggestions: string[];
  /** Called when a user selects a suggestion by click or keyboard. */
  onSuggestionSelect?: (suggestion: string) => void;
  /** Maximum number of visible suggestions. */
  maxSuggestions?: number;
  /** Optional custom renderer for each suggestion row. */
  renderSuggestion?: (suggestion: string, isHighlighted: boolean) => ReactNode;
  /** Keeps the suggestions dropdown visible (showing skeleton rows while loading). */
  forceShowDropdown?: boolean;
}

/** Input wrapped with a filtered, keyboard-navigable suggestions dropdown anchored to the field surface. */
function SuggestionInput({
  suggestions,
  onSuggestionSelect,
  maxSuggestions = 6,
  renderSuggestion,
  forceShowDropdown = false,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  inputRest,
  disabled = false,
  readOnly = false,
  ...props
}: SuggestionInputProps) {
  const listboxId = useId();
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(
    typeof defaultValue === 'string' ? defaultValue : '',
  );
  const [isFocused, setIsFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentValue = isControlled ? String(value) : internalValue;

  const filteredSuggestions = useMemo(() => {
    const query = currentValue.trim().toLowerCase();
    const matches = query
      ? suggestions.filter((item) => item.toLowerCase().includes(query))
      : suggestions;
    return matches.slice(0, maxSuggestions);
  }, [suggestions, currentValue, maxSuggestions]);

  const showLoadingSkeleton = forceShowDropdown && filteredSuggestions.length === 0;
  const isOpen =
    !disabled &&
    !readOnly &&
    (forceShowDropdown ||
      (isFocused && !dismissed && filteredSuggestions.length > 0));

  const commitSuggestion = (suggestion: string) => {
    if (!isControlled) {
      setInternalValue(suggestion);
    }
    onSuggestionSelect?.(suggestion);
    setDismissed(true);
    setHighlightedIndex(-1);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(event.target.value);
    }
    setDismissed(false);
    setHighlightedIndex(0);
    onChange?.(event);
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsFocused(true);
    setDismissed(false);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    closeTimerRef.current = setTimeout(() => {
      setIsFocused(false);
      setHighlightedIndex(-1);
    }, 100);
    onBlur?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (isOpen && filteredSuggestions.length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0,
        );
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1,
        );
      } else if (event.key === 'Enter' && highlightedIndex >= 0) {
        const picked = filteredSuggestions[highlightedIndex];
        if (picked !== undefined) {
          event.preventDefault();
          commitSuggestion(picked);
        }
      } else if (event.key === 'Escape') {
        event.preventDefault();
        setDismissed(true);
        setHighlightedIndex(-1);
      }
    }
    onKeyDown?.(event);
  };

  const activeOptionId =
    isOpen && highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length
      ? `${listboxId}-option-${highlightedIndex}`
      : undefined;

  const overlay = isOpen ? (
    <div
      id={listboxId}
      role="listbox"
      data-slot="suggestion-input-dropdown"
      className="absolute top-[calc(100%+6px)] right-0 left-0 z-50 overflow-hidden rounded-lg bg-bg-primary p-1 shadow-medium"
    >
      {showLoadingSkeleton ? (
        <div className="flex flex-col gap-1 p-1" aria-busy="true">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-7 w-full animate-pulse rounded-sm bg-bg-tertiary motion-reduce:animate-none"
            />
          ))}
        </div>
      ) : (
        <div className="flex max-h-60 flex-col gap-0.5 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => {
            const isHighlighted = index === highlightedIndex;
            return (
              <button
                key={suggestion}
                id={`${listboxId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={isHighlighted}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => commitSuggestion(suggestion)}
                className={cn(
                  'flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-body-small-regular text-text-primary transition-colors duration-100 ease-out motion-reduce:transition-none',
                  isHighlighted ? 'bg-control-hover' : 'hover:bg-control-hover',
                )}
              >
                {renderSuggestion ? (
                  renderSuggestion(suggestion, isHighlighted)
                ) : (
                  <span className="truncate">{suggestion}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  ) : null;

  return (
    <Input
      {...props}
      disabled={disabled}
      readOnly={readOnly}
      value={currentValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      fieldOverlay={overlay}
      inputRest={{
        role: 'combobox',
        'aria-autocomplete': 'list',
        'aria-expanded': isOpen,
        'aria-controls': isOpen ? listboxId : undefined,
        'aria-activedescendant': activeOptionId,
        ...inputRest,
      }}
    />
  );
}

export { Input, SuggestionInput };

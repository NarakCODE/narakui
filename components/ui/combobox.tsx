'use client';

import {
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react';
import Link, { type LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { Command as CommandPrimitive } from 'cmdk';
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
import { Popover as PopoverPrimitive } from 'radix-ui';
import {
  Button,
  type ButtonIconValue,
  type ButtonMode,
} from '@/components/ui/button';
import { CheckboxIndicator } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const COMBOBOX_ICONS = {
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
} as const satisfies Record<string, LucideIcon>;

export type ComboboxIconName = keyof typeof COMBOBOX_ICONS;

export interface ComboboxIconDescriptor {
  /** Named icon registered for Combobox slots. */
  name: ComboboxIconName | (string & {});
  /** Additional classes applied to the SVG icon. */
  className?: string;
}

export type ComboboxIconValue =
  | ComboboxIconName
  | (string & {})
  | ComboboxIconDescriptor
  | ReactNode;

interface ComboboxContextValue {
  registerTriggerNode: (node: HTMLElement | null) => void;
}

const ComboboxContext = createContext<ComboboxContextValue>({
  registerTriggerNode: () => {},
});

/** Assigns a React ref whether it is a callback function or mutable ref object. */
function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref && typeof ref === 'object') {
    (ref as { current: T | null }).current = value;
  }
}

/** Type guard distinguishing icon descriptor objects from React elements and nodes. */
function isComboboxIconDescriptor(value: ComboboxIconValue): value is ComboboxIconDescriptor {
  return (
    typeof value === 'object' &&
    value !== null &&
    !isValidElement(value) &&
    'name' in value &&
    typeof (value as { name?: unknown }).name === 'string'
  );
}

/** Resolves a string icon name, descriptor `{ name, className }`, or custom node. */
function renderComboboxIcon(
  icon: ComboboxIconValue | undefined,
  defaultClassName = 'size-4 shrink-0 text-text-secondary',
): ReactNode {
  if (icon === undefined || icon === null || typeof icon === 'boolean') {
    return null;
  }

  if (typeof icon === 'string') {
    if (icon in COMBOBOX_ICONS) {
      const IconComponent = COMBOBOX_ICONS[icon as ComboboxIconName];
      return <IconComponent aria-hidden="true" className={defaultClassName} />;
    }
    return null;
  }

  if (isComboboxIconDescriptor(icon)) {
    if (icon.name in COMBOBOX_ICONS) {
      const IconComponent = COMBOBOX_ICONS[icon.name as ComboboxIconName];
      return <IconComponent aria-hidden="true" className={cn(defaultClassName, icon.className)} />;
    }
    return null;
  }

  return icon;
}

/** Detects horizontal text truncation on item labels so full text can be revealed in a tooltip. */
function useIsTruncated(disabled: boolean) {
  const [labelEl, setLabelEl] = useState<HTMLSpanElement | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (disabled || !labelEl) {
      setIsTruncated(false);
      return;
    }

    const update = () => {
      setIsTruncated(labelEl.scrollWidth > labelEl.clientWidth);
    };

    update();
    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(update);
    observer.observe(labelEl);
    return () => observer.disconnect();
  }, [labelEl, disabled]);

  return { labelRef: setLabelEl, isTruncated };
}

export interface ComboboxRootProps extends ComponentProps<typeof PopoverPrimitive.Root> {
  /** Controlled open state of the popover. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Traps focus and blocks the page behind the list. Always true inside a drawer or modal dialog. */
  modal?: boolean;
  /** Trigger and content children. */
  children?: ReactNode;
}

/** Popover root managing Combobox open state and automatic modal elevation inside dialogs/drawers. */
function ComboboxRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  modal = false,
  children,
}: ComboboxRootProps) {
  const [isInsideDialog, setIsInsideDialog] = useState(false);

  const registerTriggerNode = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    const inModalContainer = Boolean(
      node.closest(
        '[role="dialog"], [data-slot="dialog-content"], [data-slot="drawer-content"], [data-slot="sheet-content"]',
      ),
    );
    setIsInsideDialog((prev) => (prev === inModalContainer ? prev : inModalContainer));
  }, []);

  return (
    <ComboboxContext.Provider value={{ registerTriggerNode }}>
      <PopoverPrimitive.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        modal={isInsideDialog ? true : modal}
      >
        {children}
      </PopoverPrimitive.Root>
    </ComboboxContext.Provider>
  );
}

export type ComboboxTriggerSize = 'micro' | 'small' | 'regular' | 'large';

export interface ComboboxTriggerProps
  extends Omit<ComponentProps<typeof PopoverPrimitive.Trigger>, 'asChild'> {
  /** Merges trigger behavior into its child element, such as a Button. */
  asChild?: boolean;
  /** Renders a Button with a chevron that flips while the list is open. */
  buttonWithChevron?: boolean;
  /** Renders a field-style Button with a truncated label on the left and a chevron on the right. */
  fullSizeAndButtonWithChevronToTheRight?: boolean;
  /** Button variants only. Icon name, descriptor, or node before the label. */
  iconStart?: ComboboxIconValue;
  /** Button variants only. Replaces the chevron. */
  customIconEnd?: ComboboxIconValue;
  /** Button variants only. Hides the chevron. */
  hideChevron?: boolean;
  /** Button variants only. `buttonWithChevron` defaults to `small`; full-size defaults to `regular`. */
  size?: ComboboxTriggerSize;
  /** Button variants only. Button style, such as `ghost` or `dashed`. */
  mode?: ButtonMode;
  /** Button variants only. Full-size variant shows a spinner in place of the chevron and disables interaction. */
  loading?: { isLoading: boolean };
  /** Whether the trigger is disabled. */
  disabled?: boolean;
  /** Full-size variant only. Classes for the label wrapper. */
  childrenClassName?: string;
  /** Button variants only. Classes for the Button's inner content. */
  contentClassName?: string;
}

/** Combobox trigger supporting compact chevron buttons, full-width form triggers, and `asChild`. */
function ComboboxTrigger({
  asChild = false,
  buttonWithChevron = false,
  fullSizeAndButtonWithChevronToTheRight = false,
  iconStart,
  customIconEnd,
  hideChevron = false,
  size,
  mode = 'secondary',
  loading,
  disabled = false,
  childrenClassName,
  contentClassName,
  className,
  children,
  ref,
  ...props
}: ComboboxTriggerProps) {
  const { registerTriggerNode } = useContext(ComboboxContext);

  const composedRef = useCallback(
    (node: HTMLButtonElement | null) => {
      registerTriggerNode(node);
      assignRef(ref, node);
    },
    [registerTriggerNode, ref],
  );

  const chevron = (
    <ChevronDown
      aria-hidden="true"
      className="size-3.5 shrink-0 text-text-tertiary transition-transform duration-150 ease-out group-data-[state=open]:rotate-180 motion-reduce:transition-none"
    />
  );

  if (fullSizeAndButtonWithChevronToTheRight) {
    const isBusy = Boolean(loading?.isLoading);
    const trailingNode = isBusy ? (
      <Spinner aria-hidden="true" className="size-3.5 shrink-0 text-text-tertiary" />
    ) : hideChevron ? null : customIconEnd !== undefined ? (
      renderComboboxIcon(customIconEnd, 'size-3.5 shrink-0 text-text-tertiary')
    ) : (
      chevron
    );

    return (
      <PopoverPrimitive.Trigger asChild>
        <Button
          ref={composedRef}
          data-slot="combobox-trigger"
          mode={mode}
          size={size ?? 'regular'}
          disabled={disabled || isBusy}
          aria-busy={isBusy || undefined}
          className={cn('group justify-between', className)}
          contentClassName={cn('w-full justify-between gap-2', contentClassName)}
          {...props}
        >
          <span
            className={cn(
              'inline-flex min-w-0 flex-1 items-center gap-2 text-left',
              childrenClassName,
            )}
          >
            {renderComboboxIcon(iconStart)}
            <span className="truncate">{children}</span>
          </span>
          {trailingNode}
        </Button>
      </PopoverPrimitive.Trigger>
    );
  }

  if (buttonWithChevron) {
    const endIcon = hideChevron
      ? undefined
      : customIconEnd !== undefined
        ? renderComboboxIcon(customIconEnd, 'size-3.5 shrink-0 text-text-tertiary')
        : chevron;

    return (
      <PopoverPrimitive.Trigger asChild>
        <Button
          ref={composedRef}
          data-slot="combobox-trigger"
          mode={mode}
          size={size ?? 'small'}
          iconStart={iconStart as ButtonIconValue}
          iconEnd={endIcon}
          loading={loading}
          disabled={disabled}
          className={cn('group', className)}
          contentClassName={contentClassName}
          {...props}
        >
          {children}
        </Button>
      </PopoverPrimitive.Trigger>
    );
  }

  return (
    <PopoverPrimitive.Trigger
      ref={composedRef}
      data-slot="combobox-trigger"
      asChild={asChild}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </PopoverPrimitive.Trigger>
  );
}

export interface ComboboxContentProps
  extends ComponentProps<typeof PopoverPrimitive.Content> {
  /** Minimum width of the popover in pixels. */
  size?: number;
  /** Uses the trigger's width as the minimum width instead of `size`. */
  fullWidth?: boolean;
  /** Renders the popover in a portal. Set to false to render it in place. */
  withRadixPortal?: boolean;
  /** Props for the portal, such as `container`. */
  portalProps?: ComponentProps<typeof PopoverPrimitive.Portal>;
  /** Fades and scales the popover out on close. */
  animateClose?: boolean;
}

/** Floating popover container housing `Combobox.Command`. */
function ComboboxContent({
  size = 249,
  fullWidth = false,
  align = 'center',
  side = 'bottom',
  sideOffset = 10,
  alignOffset = 0,
  withRadixPortal = true,
  portalProps,
  animateClose = true,
  onOpenAutoFocus,
  className,
  style,
  children,
  ...props
}: ComboboxContentProps) {
  const handleOpenAutoFocus: ComboboxContentProps['onOpenAutoFocus'] = (event) => {
    onOpenAutoFocus?.(event);
    if (event.defaultPrevented) return;

    const content = event.currentTarget as HTMLElement | null;
    if (!content) return;

    // Without a search input, move focus to [cmdk-root] so arrow keys work immediately.
    if (!content.querySelector('input')) {
      const commandRoot = content.querySelector<HTMLElement>('[cmdk-root]');
      if (commandRoot) {
        event.preventDefault();
        commandRoot.focus({ preventScroll: true });
      }
    }
  };

  const contentNode = (
    <PopoverPrimitive.Content
      data-slot="combobox-content"
      align={align}
      side={side}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      onOpenAutoFocus={handleOpenAutoFocus}
      style={fullWidth ? style : { minWidth: size, ...style }}
      className={cn(
        'z-50 origin-(--radix-popover-content-transform-origin) overflow-hidden rounded-lg bg-bg-primary text-text-primary shadow-medium ease-out outline-none data-[state=open]:animate-in data-[state=open]:duration-180 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98] motion-reduce:data-[state=open]:zoom-in-100',
        animateClose &&
          'data-[state=closed]:animate-out data-[state=closed]:duration-130 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] data-[state=closed]:fill-mode-forwards motion-reduce:data-[state=closed]:zoom-out-100',
        fullWidth && 'min-w-(--radix-popover-trigger-width)',
        className,
      )}
      {...props}
    >
      {children}
    </PopoverPrimitive.Content>
  );

  if (!withRadixPortal) {
    return contentNode;
  }

  return <PopoverPrimitive.Portal {...portalProps}>{contentNode}</PopoverPrimitive.Portal>;
}

export type ComboboxCommandProps = ComponentProps<typeof CommandPrimitive>;

/** Searchable command list root backed by `cmdk`. */
function ComboboxCommand({
  shouldFilter = true,
  loop = true,
  className,
  ...props
}: ComboboxCommandProps) {
  return (
    <CommandPrimitive
      data-slot="combobox-command"
      tabIndex={-1}
      shouldFilter={shouldFilter}
      loop={loop}
      className={cn(
        'flex w-full flex-col overflow-hidden bg-bg-primary text-text-primary outline-none',
        className,
      )}
      {...props}
    />
  );
}

export interface ComboboxInputProps extends ComponentProps<typeof CommandPrimitive.Input> {
  /** Shows a spinner in place of the search icon. */
  loading?: boolean;
  /** Shows a clear button while `value` is not empty. Requires `clearLabel`. */
  onClear?: () => void;
  /** Accessible label for the clear button. Required with `onClear`. */
  clearLabel?: string;
  /** Classes for the row holding the search icon and input. */
  classNameWrapper?: string;
}

/** Search input row inside `Combobox.Command` with optional loading spinner and clear button. */
function ComboboxInput({
  loading = false,
  onClear,
  clearLabel,
  classNameWrapper,
  className,
  value,
  ref,
  ...props
}: ComboboxInputProps) {
  const internalRef = useRef<HTMLInputElement | null>(null);

  const composedRef = useCallback(
    (node: HTMLInputElement | null) => {
      internalRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  const showClear = Boolean(onClear) && typeof value === 'string' && value.length > 0;

  return (
    <div
      data-slot="combobox-input-wrapper"
      className={cn('flex items-center gap-2 border-b border-border-gray px-2.5 py-2', classNameWrapper)}
    >
      {loading ? (
        <Spinner aria-hidden="true" className="size-3.5 shrink-0 text-text-tertiary" />
      ) : (
        <Search aria-hidden="true" className="size-3.5 shrink-0 text-text-tertiary" />
      )}
      <CommandPrimitive.Input
        ref={composedRef}
        data-slot="combobox-input"
        value={value}
        className={cn(
          'min-w-0 flex-1 bg-transparent text-body-small-regular text-text-primary placeholder:text-text-tertiary outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
      {showClear ? (
        <button
          type="button"
          onClick={() => {
            onClear?.();
            internalRef.current?.focus();
          }}
          aria-label={clearLabel ?? 'Clear'}
          className="inline-flex size-5 shrink-0 items-center justify-center rounded-sm text-text-tertiary transition-colors duration-150 ease-out hover:bg-control-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X aria-hidden="true" className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}

export interface ComboboxListProps extends ComponentProps<typeof CommandPrimitive.List> {
  /** Maximum height before the list scrolls. Numbers are pixels; strings are any CSS length. */
  height?: number | string;
}

/** Scrollable container for combobox groups, items, empty state, and loading state. */
function ComboboxList({ height = 300, className, style, ...props }: ComboboxListProps) {
  const maxHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <CommandPrimitive.List
      data-slot="combobox-list"
      style={{ maxHeight, ...style }}
      className={cn(
        'scrollbar-custom overflow-x-hidden overflow-y-auto overscroll-contain p-1',
        className,
      )}
      {...props}
    />
  );
}

export type ComboboxEmptyProps = ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>;

/** Shown automatically when search matches no row. */
function ComboboxEmpty({ className, ...props }: ComboboxEmptyProps) {
  return (
    <CommandPrimitive.Empty
      data-slot="combobox-empty"
      className={cn('py-6 text-center text-body-small-regular text-text-tertiary', className)}
      {...props}
    />
  );
}

export type ComboboxLoadingProps = ComponentPropsWithoutRef<typeof CommandPrimitive.Loading>;

/** Loading row shown while async results are being fetched. */
function ComboboxLoading({ className, label, children, ...props }: ComboboxLoadingProps) {
  return (
    <CommandPrimitive.Loading
      data-slot="combobox-loading"
      label={label}
      className={cn(
        'flex items-center justify-center gap-2 py-4 text-body-small-regular text-text-tertiary',
        className,
      )}
      {...props}
    >
      <Spinner aria-hidden="true" className="size-3.5 text-text-tertiary" />
      <span>{children ?? label ?? 'Loading...'}</span>
    </CommandPrimitive.Loading>
  );
}

export type ComboboxGroupProps = ComponentProps<typeof CommandPrimitive.Group>;

/** Groups combobox rows under an optional heading. */
function ComboboxGroup({ forceMount = false, className, ...props }: ComboboxGroupProps) {
  return (
    <CommandPrimitive.Group
      data-slot="combobox-group"
      forceMount={forceMount}
      className={cn(
        'overflow-hidden [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-body-mini-medium [&_[cmdk-group-heading]]:text-text-tertiary',
        className,
      )}
      {...props}
    />
  );
}

export type ComboboxSeparatorProps = ComponentProps<typeof CommandPrimitive.Separator>;

/** Hairline divider between combobox groups or between the list and footer actions. */
function ComboboxSeparator({ alwaysRender = false, className, ...props }: ComboboxSeparatorProps) {
  return (
    <CommandPrimitive.Separator
      data-slot="combobox-separator"
      alwaysRender={alwaysRender}
      className={cn('h-px w-full shrink-0 bg-border-gray', className)}
      {...props}
    />
  );
}

export interface ComboboxLabelProps extends ComponentPropsWithoutRef<'span'> {
  /** Heading text size. */
  size?: 'small' | 'medium';
}

/** Standalone heading for use outside a `Combobox.Group`. */
function ComboboxLabel({ size = 'small', className, ...props }: ComboboxLabelProps) {
  return (
    <span
      data-slot="combobox-label"
      className={cn(
        'block px-2 py-1.5 text-text-tertiary',
        size === 'medium' ? 'text-body-small-medium' : 'text-body-mini-medium',
        className,
      )}
      {...props}
    />
  );
}

const ROW_BASE_CLASSES =
  'group/item relative flex min-h-8 cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-body-small-regular text-text-primary select-none outline-none transition-colors duration-100 ease-out';

export interface ComboboxItemProps extends ComponentProps<typeof CommandPrimitive.Item> {
  /** Icon name, descriptor, or node before the label. */
  start?: ComboboxIconValue;
  /** Icon name, descriptor, or node at the end of the row. */
  end?: ComboboxIconValue;
  /** Renders the row as a link. Both Enter and click navigate. */
  href?: string;
  /** With `href`. Forwarded to Next.js Link. */
  prefetch?: boolean;
  /** With `href`. Called as the row starts navigating in this tab. */
  onNavigate?: () => void;
  /** Turns off the tooltip that shows a truncated label in full. */
  disableTooltip?: boolean;
  /** Side of the truncated-label tooltip. */
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  /** Classes for the label wrapper. */
  childrenClassName?: string;
}

/** Single-select or navigation row inside `Combobox.List`. */
function ComboboxItem({
  start,
  end,
  href,
  prefetch = true,
  onNavigate,
  disableTooltip = false,
  tooltipSide = 'right',
  childrenClassName,
  disabled = false,
  onSelect,
  className,
  children,
  ...props
}: ComboboxItemProps) {
  const router = useRouter();
  const skipNextSelectRef = useRef(false);
  const { labelRef, isTruncated } = useIsTruncated(disableTooltip);

  const labelSpan = (
    <span ref={labelRef} className={cn('min-w-0 flex-1 truncate', childrenClassName)}>
      {children}
    </span>
  );

  const labelNode =
    !disableTooltip && isTruncated ? (
      <Tooltip>
        <TooltipTrigger asChild>{labelSpan}</TooltipTrigger>
        <TooltipContent side={tooltipSide}>{children}</TooltipContent>
      </Tooltip>
    ) : (
      labelSpan
    );

  const innerNodes = (
    <>
      {renderComboboxIcon(start)}
      {labelNode}
      {renderComboboxIcon(end)}
    </>
  );

  const handleSelect = (val: string) => {
    if (skipNextSelectRef.current) {
      skipNextSelectRef.current = false;
      return;
    }

    onSelect?.(val);
    if (href) {
      onNavigate?.();
      router.push(href);
    }
  };

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      skipNextSelectRef.current = true;
      return;
    }
    // Same-tab clicks fall through to CommandPrimitive.Item.onSelect so Enter and click share one path.
    event.preventDefault();
  };

  return (
    <CommandPrimitive.Item
      data-slot="combobox-item"
      disabled={disabled}
      onSelect={handleSelect}
      className={cn(
        ROW_BASE_CLASSES,
        'data-[selected=true]:bg-control-hover data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40',
        className,
      )}
      {...props}
    >
      {href ? (
        <Link
          href={href}
          prefetch={prefetch}
          tabIndex={-1}
          onClick={handleLinkClick}
          className="flex min-w-0 flex-1 items-center gap-2 text-inherit no-underline outline-none"
        >
          {innerNodes}
        </Link>
      ) : (
        innerNodes
      )}
    </CommandPrimitive.Item>
  );
}

export interface ComboboxItemCheckboxProps
  extends Omit<ComponentProps<typeof CommandPrimitive.Item>, 'onSelect'> {
  /** Whether the row is checked. */
  checked: boolean;
  /** Called when the row is toggled. */
  onSelect?: (value: string) => void;
  /** Shows an "Only" button on hover. */
  showOnlyButton?: boolean;
  /** Called when the "Only" button is clicked. */
  onOnlyClick?: () => void;
  /** Locks the checkbox and explains why in a tooltip while keeping the row interactive. */
  checkboxDisabledReason?: string;
  /** Icon name, descriptor, or node between the checkbox and the label. */
  start?: ComboboxIconValue;
  /** Icon name, descriptor, or node after the label. */
  end?: ComboboxIconValue;
  /** Renders the label without truncation, for labels that own their own layout. */
  disableTooltip?: boolean;
}

/** Multi-select row with a visual checkbox indicator and optional hover-revealed "Only" action. */
function ComboboxItemCheckbox({
  checked,
  onSelect,
  showOnlyButton = true,
  onOnlyClick,
  checkboxDisabledReason,
  start,
  end,
  disableTooltip = false,
  disabled = false,
  className,
  children,
  ...props
}: ComboboxItemCheckboxProps) {
  const { labelRef, isTruncated } = useIsTruncated(disableTooltip);

  const indicator = (
    <CheckboxIndicator
      checked={checked}
      disabled={Boolean(disabled) || Boolean(checkboxDisabledReason)}
    />
  );

  const checkboxNode = checkboxDisabledReason ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex shrink-0">{indicator}</span>
      </TooltipTrigger>
      <TooltipContent side="left">{checkboxDisabledReason}</TooltipContent>
    </Tooltip>
  ) : (
    indicator
  );

  const labelNode = disableTooltip ? (
    <span className="min-w-0 flex-1">{children}</span>
  ) : isTruncated ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <span ref={labelRef} className="min-w-0 flex-1 truncate">
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent side="right">{children}</TooltipContent>
    </Tooltip>
  ) : (
    <span ref={labelRef} className="min-w-0 flex-1 truncate">
      {children}
    </span>
  );

  const handleSelect = (val: string) => {
    if (!checkboxDisabledReason) {
      onSelect?.(val);
    }
  };

  return (
    <CommandPrimitive.Item
      data-slot="combobox-item-checkbox"
      disabled={disabled}
      onSelect={handleSelect}
      className={cn(
        ROW_BASE_CLASSES,
        'data-[selected=true]:bg-control-hover data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40',
        className,
      )}
      {...props}
    >
      {checkboxNode}
      {renderComboboxIcon(start)}
      {labelNode}
      {showOnlyButton && onOnlyClick && !disabled ? (
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onOnlyClick();
          }}
          className="shrink-0 rounded px-1.5 py-0.5 text-body-mini-medium text-text-secondary opacity-0 transition-opacity duration-100 ease-out hover:bg-bg-tertiary hover:text-text-primary focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover/item:opacity-100 group-data-[selected=true]/item:opacity-100"
        >
          Only
        </button>
      ) : null}
      {renderComboboxIcon(end)}
    </CommandPrimitive.Item>
  );
}

export interface ComboboxStandaloneButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** Icon name, descriptor, or node before the label. */
  start?: ComboboxIconValue;
  /** Icon name, descriptor, or node at the end of the row. */
  end?: ComboboxIconValue;
}

/** Button styled like a combobox row for footer actions below `Combobox.List`. */
function ComboboxStandaloneButton({
  start,
  end,
  type = 'button',
  className,
  children,
  ...props
}: ComboboxStandaloneButtonProps) {
  return (
    <button
      type={type}
      data-slot="combobox-standalone-button"
      className={cn(
        ROW_BASE_CLASSES,
        'w-full text-left hover:bg-control-hover focus-visible:bg-control-hover focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40',
        className,
      )}
      {...props}
    >
      {renderComboboxIcon(start)}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {renderComboboxIcon(end)}
    </button>
  );
}

export interface ComboboxStandaloneLinkProps extends LinkProps {
  /** Additional classes for the row link. */
  className?: string;
  /** Row label content. */
  children?: ReactNode;
  /** Icon name, descriptor, or node before the label. */
  start?: ComboboxIconValue;
  /** Icon name, descriptor, or node at the end of the row. */
  end?: ComboboxIconValue;
}

/** Link styled like a combobox row for navigation actions below `Combobox.List`. */
function ComboboxStandaloneLink({
  start,
  end,
  className,
  children,
  ...props
}: ComboboxStandaloneLinkProps) {
  return (
    <Link
      data-slot="combobox-standalone-link"
      className={cn(
        ROW_BASE_CLASSES,
        'w-full text-inherit no-underline hover:bg-control-hover focus-visible:bg-control-hover focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      {...props}
    >
      {renderComboboxIcon(start)}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {renderComboboxIcon(end)}
    </Link>
  );
}

export const Combobox = {
  Root: ComboboxRoot,
  Trigger: ComboboxTrigger,
  Content: ComboboxContent,
  Command: ComboboxCommand,
  Input: ComboboxInput,
  List: ComboboxList,
  Empty: ComboboxEmpty,
  Loading: ComboboxLoading,
  Group: ComboboxGroup,
  Separator: ComboboxSeparator,
  Label: ComboboxLabel,
  Item: ComboboxItem,
  ItemCheckbox: ComboboxItemCheckbox,
  StandaloneButton: ComboboxStandaloneButton,
  StandaloneLink: ComboboxStandaloneLink,
};

export {
  ComboboxCommand,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemCheckbox,
  ComboboxLabel,
  ComboboxList,
  ComboboxLoading,
  ComboboxRoot,
  ComboboxSeparator,
  ComboboxStandaloneButton,
  ComboboxStandaloneLink,
  ComboboxTrigger,
};

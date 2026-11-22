'use client';

import {
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ComponentProps,
  type ReactNode,
  type Ref,
} from 'react';
import {
  Archive,
  ArrowUpDown,
  ArrowUpRight,
  Bookmark,
  Calendar,
  CalendarDays,
  ChartLine,
  ChartPie,
  Check,
  ChevronDown,
  ChevronRight,
  Columns3,
  Copy,
  CopyPlus,
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
  LayoutGrid,
  Link as LinkIcon,
  List,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
  Trash2,
  TriangleAlert,
  UserPlus,
  X,
  type LucideIcon,
} from 'lucide-react';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';
import {
  Button,
  type ButtonIconValue,
  type ButtonMode,
} from '@/components/ui/button';
import { CheckboxIndicator } from '@/components/ui/checkbox';
import { Kbd } from '@/components/ui/kbd';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const DROPDOWN_ICONS = {
  'layout-grid': LayoutGrid,
  list: List,
  plus: Plus,
  'arrow-up-right': ArrowUpRight,
  'arrow-up-down': ArrowUpDown,
  filter: Filter,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  download: Download,
  star: Star,
  ellipsis: Ellipsis,
  check: Check,
  x: X,
  search: Search,
  trash: Trash2,
  edit: Pencil,
  pencil: Pencil,
  copy: Copy,
  duplicate: CopyPlus,
  share: Share2,
  'external-link': ExternalLink,
  refresh: RefreshCw,
  settings: Settings,
  sliders: SlidersHorizontal,
  columns: Columns3,
  info: Info,
  warning: TriangleAlert,
  tag: Tag,
  'user-plus': UserPlus,
  eye: Eye,
  'chart-pie': ChartPie,
  'chart-line': ChartLine,
  bookmark: Bookmark,
  calendar: Calendar,
  'calendar-days': CalendarDays,
  documents: Files,
  'file-text': FileText,
  folder: Folder,
  archive: Archive,
  globe: Globe,
  link: LinkIcon,
  sparkles: Sparkles,
} as const satisfies Record<string, LucideIcon>;

export type DropdownIconName = keyof typeof DROPDOWN_ICONS;

export interface DropdownIconDescriptor {
  /** Named icon registered for Dropdown slots. */
  name: DropdownIconName | (string & {});
  /** Additional classes applied to the SVG icon. */
  className?: string;
}

export type DropdownIconValue =
  | DropdownIconName
  | (string & {})
  | DropdownIconDescriptor
  | ReactNode;

interface DropdownRootContextValue {
  registerTriggerNode: (node: HTMLElement | null) => void;
}

const DropdownRootContext = createContext<DropdownRootContextValue>({
  registerTriggerNode: () => {},
});

interface DropdownContentContextValue {
  submenusGrowUpward: boolean;
}

const DropdownContentContext = createContext<DropdownContentContextValue>({
  submenusGrowUpward: false,
});

/** Assigns a React ref whether it is a callback function or mutable ref object. */
function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref && typeof ref === 'object') {
    (ref as { current: T | null }).current = value;
  }
}

/** Type guard distinguishing icon descriptor objects from React nodes. */
function isDropdownIconDescriptor(value: DropdownIconValue): value is DropdownIconDescriptor {
  return (
    typeof value === 'object' &&
    value !== null &&
    !isValidElement(value) &&
    'name' in value &&
    typeof (value as { name?: unknown }).name === 'string'
  );
}

/** Resolves a named icon string, descriptor `{ name, className }`, or custom node. */
function renderDropdownIcon(
  icon: DropdownIconValue | undefined,
  defaultClassName = 'size-4 shrink-0 text-text-secondary',
): ReactNode {
  if (icon === undefined || icon === null || typeof icon === 'boolean') {
    return null;
  }

  if (typeof icon === 'string') {
    if (icon in DROPDOWN_ICONS) {
      const IconComponent = DROPDOWN_ICONS[icon as DropdownIconName];
      return <IconComponent aria-hidden="true" className={defaultClassName} />;
    }
    return null;
  }

  if (isDropdownIconDescriptor(icon)) {
    if (icon.name in DROPDOWN_ICONS) {
      const IconComponent = DROPDOWN_ICONS[icon.name as DropdownIconName];
      return <IconComponent aria-hidden="true" className={cn(defaultClassName, icon.className)} />;
    }
    return null;
  }

  return icon;
}

/** Measures horizontal text truncation so truncated labels can reveal full text in a tooltip. */
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

export interface DropdownRootProps
  extends ComponentProps<typeof DropdownMenuPrimitive.Root> {
  /** Controlled open state of the dropdown. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Traps focus and blocks the page behind the menu. Always true inside a drawer or modal dialog. */
  modal?: boolean;
}

/** Dropdown root managing open state and automatic modal elevation inside drawers and dialogs. */
function DropdownRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  modal = false,
  children,
  ...props
}: DropdownRootProps) {
  const [isInsideModalContainer, setIsInsideModalContainer] = useState(false);

  const registerTriggerNode = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    const insideModal = Boolean(
      node.closest(
        '[role="dialog"], [data-slot="dialog-content"], [data-slot="drawer-content"], [data-slot="sheet-content"]',
      ),
    );
    setIsInsideModalContainer((prev) => (prev === insideModal ? prev : insideModal));
  }, []);

  return (
    <DropdownRootContext.Provider value={{ registerTriggerNode }}>
      <DropdownMenuPrimitive.Root
        data-slot="dropdown-menu"
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        modal={isInsideModalContainer ? true : modal}
        {...props}
      >
        {children}
      </DropdownMenuPrimitive.Root>
    </DropdownRootContext.Provider>
  );
}

export type DropdownTriggerSize = 'micro' | 'small' | 'regular' | 'large';

export interface DropdownTriggerProps
  extends Omit<ComponentProps<typeof DropdownMenuPrimitive.Trigger>, 'asChild'> {
  /** Merges the trigger behavior into its child element. */
  asChild?: boolean;
  /** Renders the trigger as a Button with a chevron that flips while the menu is open. */
  buttonWithChevron?: boolean;
  /** Renders a Button with a truncated label on the left and the chevron on the right. */
  fullSizeAndButtonWithChevronToTheRight?: boolean;
  /** Icon before the label in the two Button variants. */
  iconStart?: DropdownIconValue;
  /** Button size in the two Button variants. `buttonWithChevron` defaults to `small`. */
  size?: DropdownTriggerSize;
  /** Button visual mode in the two Button variants. */
  mode?: ButtonMode;
}

/** Trigger opening the dropdown menu; supports `asChild`, compact chevron buttons, and full-width field triggers. */
function DropdownTrigger({
  asChild = false,
  buttonWithChevron = false,
  fullSizeAndButtonWithChevronToTheRight = false,
  iconStart,
  size,
  mode = 'secondary',
  disabled = false,
  className,
  children,
  ref,
  ...props
}: DropdownTriggerProps) {
  const { registerTriggerNode } = useContext(DropdownRootContext);

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
    return (
      <DropdownMenuPrimitive.Trigger asChild>
        <Button
          ref={composedRef}
          data-slot="dropdown-menu-trigger"
          mode={mode}
          size={size ?? 'regular'}
          disabled={disabled}
          className={cn('group justify-between', className)}
          contentClassName="w-full justify-between gap-2"
          {...props}
        >
          <span className="inline-flex min-w-0 flex-1 items-center gap-2 text-left">
            {renderDropdownIcon(iconStart)}
            <span className="truncate">{children}</span>
          </span>
          {chevron}
        </Button>
      </DropdownMenuPrimitive.Trigger>
    );
  }

  if (buttonWithChevron) {
    return (
      <DropdownMenuPrimitive.Trigger asChild>
        <Button
          ref={composedRef}
          data-slot="dropdown-menu-trigger"
          mode={mode}
          size={size ?? 'small'}
          iconStart={iconStart as ButtonIconValue}
          iconEnd={chevron}
          disabled={disabled}
          className={cn('group', className)}
          {...props}
        >
          {children}
        </Button>
      </DropdownMenuPrimitive.Trigger>
    );
  }

  return (
    <DropdownMenuPrimitive.Trigger
      ref={composedRef}
      data-slot="dropdown-menu-trigger"
      asChild={asChild}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Trigger>
  );
}

export type DropdownPortalProps = ComponentProps<typeof DropdownMenuPrimitive.Portal>;

/** Portal container for dropdown content. */
function DropdownPortal(props: DropdownPortalProps) {
  return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

const MENU_SURFACE_CLASSES =
  'z-50 max-h-(--radix-dropdown-menu-content-available-height) origin-(--radix-dropdown-menu-content-transform-origin) rounded-lg bg-bg-primary text-text-primary shadow-medium ease-out outline-none data-[state=open]:animate-in data-[state=open]:duration-180 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98] data-[state=closed]:animate-out data-[state=closed]:duration-130 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] data-[state=closed]:fill-mode-forwards motion-reduce:data-[state=open]:zoom-in-100 motion-reduce:data-[state=closed]:zoom-out-100';

export interface DropdownContentProps
  extends ComponentProps<typeof DropdownMenuPrimitive.Content> {
  /** Minimum width of the menu in pixels. */
  size?: number;
  /** Uses the trigger's width as the minimum width instead of `size`. */
  fullWidth?: boolean;
  /** Whether to render content in a portal. */
  withPortal?: boolean;
  /** Container element for the portal. */
  portalContainer?: HTMLElement | null;
  /** Content pinned to the bottom of the menu, with the rows above it scrolling. */
  pinnedBottom?: ReactNode;
  /** Return focus to the trigger when the menu closes, except after an outside click. */
  restoreTriggerFocus?: boolean;
  /** Opens every nested submenu upward so its last row lines up with the row that opened it. */
  submenusGrowUpward?: boolean;
}

/** Floating dropdown menu panel. */
function DropdownContent({
  side = 'bottom',
  align = 'center',
  sideOffset = 10,
  alignOffset = 0,
  size = 249,
  fullWidth = false,
  withPortal = true,
  portalContainer,
  pinnedBottom,
  restoreTriggerFocus = false,
  submenusGrowUpward = false,
  onCloseAutoFocus,
  className,
  style,
  children,
  ...props
}: DropdownContentProps) {
  const handleCloseAutoFocus: DropdownContentProps['onCloseAutoFocus'] = (event) => {
    if (!restoreTriggerFocus) {
      event.preventDefault();
    }
    onCloseAutoFocus?.(event);
  };

  const contentNode = (
    <DropdownMenuPrimitive.Content
      data-slot="dropdown-menu-content"
      side={side}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      onCloseAutoFocus={handleCloseAutoFocus}
      style={fullWidth ? style : { minWidth: size, ...style }}
      className={cn(
        MENU_SURFACE_CLASSES,
        fullWidth && 'min-w-(--radix-dropdown-menu-trigger-width)',
        pinnedBottom
          ? 'flex flex-col overflow-hidden p-0'
          : 'scrollbar-custom overflow-x-hidden overflow-y-auto p-1',
        className,
      )}
      {...props}
    >
      {pinnedBottom ? (
        <>
          <div className="scrollbar-custom min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-1">
            {children}
          </div>
          <div className="shrink-0 border-t border-border-gray p-1">{pinnedBottom}</div>
        </>
      ) : (
        children
      )}
    </DropdownMenuPrimitive.Content>
  );

  return (
    <DropdownContentContext.Provider value={{ submenusGrowUpward }}>
      {!withPortal ? (
        contentNode
      ) : (
        <DropdownPortal container={portalContainer}>{contentNode}</DropdownPortal>
      )}
    </DropdownContentContext.Provider>
  );
}

export type DropdownGroupProps = ComponentProps<typeof DropdownMenuPrimitive.Group>;

/** Groups related dropdown rows. */
function DropdownGroup(props: DropdownGroupProps) {
  return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

export interface DropdownItemProps
  extends Omit<ComponentProps<typeof DropdownMenuPrimitive.Item>, 'asChild'> {
  /** Icon name, descriptor, or node shown before the label. */
  start?: DropdownIconValue;
  /** Icon name, descriptor, or node shown at the end of the row. */
  end?: DropdownIconValue;
  /** Renders the item as a link. */
  href?: string;
  /** Target attribute for link items. */
  target?: string;
  /** Rel attribute for link items. */
  rel?: string;
  /** Tooltip on a disabled item explaining why it is disabled. */
  disabledReason?: string;
  /** Turns off the tooltip that shows a truncated label in full. */
  disableTooltip?: boolean;
  /** Side of the truncated-label tooltip. */
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  /** Destructive visual styling or legacy variant prop. */
  destructive?: boolean;
  /** Legacy inset prop preserved for compatibility. */
  inset?: boolean;
  /** Legacy variant prop preserved for compatibility. */
  variant?: 'default' | 'destructive';
}

/** Action or link row inside a dropdown menu. */
function DropdownItem({
  start,
  end,
  href,
  target,
  rel,
  disabled = false,
  disabledReason,
  disableTooltip = false,
  tooltipSide = 'right',
  destructive = false,
  inset = false,
  variant = 'default',
  onSelect,
  className,
  children,
  ...props
}: DropdownItemProps) {
  const isDestructive = destructive || variant === 'destructive';
  const hasDisabledTooltip = Boolean(disabled && disabledReason);
  const { labelRef, isTruncated } = useIsTruncated(disableTooltip || hasDisabledTooltip);

  const iconColorClass = isDestructive
    ? 'size-4 shrink-0 text-text-red'
    : 'size-4 shrink-0 text-text-secondary group-data-[highlighted]/item:text-text-primary group-[.text-text-red]/item:text-text-red';

  const isPlainLabel = typeof children === 'string' || typeof children === 'number';

  const labelNode = isPlainLabel ? (
    <span ref={labelRef} className="min-w-0 flex-1 truncate">
      {children}
    </span>
  ) : (
    <span ref={labelRef} className="flex min-w-0 flex-1 items-center justify-between gap-2">
      {children}
    </span>
  );

  const innerContent = (
    <>
      {renderDropdownIcon(start, iconColorClass)}
      {labelNode}
      {renderDropdownIcon(end, iconColorClass)}
    </>
  );

  const itemClasses = cn(
    'group/item relative flex min-h-8 cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-body-small-regular text-text-primary select-none outline-none transition-colors duration-100 ease-out data-[highlighted]:bg-control-hover [&_svg]:pointer-events-none [&_svg]:shrink-0',
    inset && 'pl-8',
    isDestructive && 'text-text-red data-[highlighted]:bg-bg-red-hover',
    hasDisabledTooltip && 'cursor-not-allowed opacity-50 data-[highlighted]:bg-transparent',
    disabled && !hasDisabledTooltip && 'pointer-events-none opacity-40',
    className,
  );

  const handleSelect: DropdownItemProps['onSelect'] = (event) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onSelect?.(event);
  };

  const itemNode =
    href && !disabled ? (
      <DropdownMenuPrimitive.Item
        data-slot="dropdown-menu-item"
        data-inset={inset || undefined}
        data-variant={isDestructive ? 'destructive' : 'default'}
        asChild
        onSelect={handleSelect}
        className={cn(itemClasses, 'text-inherit no-underline')}
        {...props}
      >
        <a href={href} target={target} rel={rel}>
          {innerContent}
        </a>
      </DropdownMenuPrimitive.Item>
    ) : (
      <DropdownMenuPrimitive.Item
        data-slot="dropdown-menu-item"
        data-inset={inset || undefined}
        data-variant={isDestructive ? 'destructive' : 'default'}
        disabled={hasDisabledTooltip ? false : disabled}
        aria-disabled={disabled || undefined}
        data-disabled={disabled ? '' : undefined}
        onSelect={handleSelect}
        className={itemClasses}
        {...props}
      >
        {innerContent}
      </DropdownMenuPrimitive.Item>
    );

  if (hasDisabledTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{itemNode}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {disabledReason}
        </TooltipContent>
      </Tooltip>
    );
  }

  if (!disableTooltip && isTruncated) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{itemNode}</TooltipTrigger>
        <TooltipContent side={tooltipSide} sideOffset={8}>
          {children}
        </TooltipContent>
      </Tooltip>
    );
  }

  return itemNode;
}

export interface DropdownCheckboxItemProps
  extends ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> {
  /** Shows an `"only"` button on hover. */
  showOnlyButton?: boolean;
  /** Called when the `"only"` button is clicked. */
  onOnlyClick?: () => void;
  /** Classes for the label wrapper. Replaces the default `truncate`. */
  childrenClassName?: string;
  /** Legacy inset prop preserved for compatibility. */
  inset?: boolean;
}

/** Multi-select row inside a dropdown menu with a visual checkbox and optional hover-revealed "Only" button. */
function DropdownCheckboxItem({
  checked = false,
  onCheckedChange,
  showOnlyButton = true,
  onOnlyClick,
  childrenClassName,
  inset = false,
  disabled = false,
  className,
  children,
  ...props
}: DropdownCheckboxItemProps) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset || undefined}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        'group/item relative flex min-h-8 cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-body-small-regular text-text-primary select-none outline-none transition-colors duration-100 ease-out data-[highlighted]:bg-control-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
        inset && 'pl-8',
        className,
      )}
      {...props}
    >
      <CheckboxIndicator
        checked={checked === true}
        indeterminate={checked === 'indeterminate'}
        disabled={Boolean(disabled)}
      />
      <span className={cn('min-w-0 flex-1', childrenClassName ?? 'truncate')}>
        {children}
      </span>
      {showOnlyButton && onOnlyClick && !disabled ? (
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onOnlyClick();
          }}
          className="shrink-0 rounded px-1.5 py-0.5 text-body-mini-medium text-text-secondary opacity-0 transition-opacity duration-100 ease-out hover:bg-bg-tertiary hover:text-text-primary focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover/item:opacity-100 group-data-[highlighted]/item:opacity-100"
        >
          Only
        </button>
      ) : null}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

export type DropdownRadioGroupProps = ComponentProps<
  typeof DropdownMenuPrimitive.RadioGroup
>;

/** Single-select group of alternative `Dropdown.RadioItem` rows. */
function DropdownRadioGroup(props: DropdownRadioGroupProps) {
  return (
    <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />
  );
}

export interface DropdownRadioItemProps
  extends ComponentProps<typeof DropdownMenuPrimitive.RadioItem> {
  /** Icon name, descriptor, or node shown before the label. */
  start?: DropdownIconValue;
  /** Turns off the tooltip that shows a truncated label in full. */
  disableTooltip?: boolean;
  /** Side of the truncated-label tooltip. */
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  /** Classes for the label wrapper. */
  childrenClassName?: string;
  /** Legacy inset prop preserved for compatibility. */
  inset?: boolean;
}

/** Single-select option inside `Dropdown.RadioGroup` showing a check mark when selected. */
function DropdownRadioItem({
  start,
  disableTooltip = false,
  tooltipSide = 'right',
  childrenClassName,
  inset = false,
  className,
  children,
  ...props
}: DropdownRadioItemProps) {
  const { labelRef, isTruncated } = useIsTruncated(disableTooltip);

  const itemNode = (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset || undefined}
      className={cn(
        'group/item relative flex min-h-8 cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-body-small-regular text-text-primary select-none outline-none transition-colors duration-100 ease-out data-[highlighted]:bg-control-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
        inset && 'pl-8',
        className,
      )}
      {...props}
    >
      {renderDropdownIcon(
        start,
        'size-4 shrink-0 text-text-secondary group-data-[highlighted]/item:text-text-primary',
      )}
      <span
        ref={labelRef}
        className={cn('min-w-0 flex-1', childrenClassName ?? 'truncate')}
      >
        {children}
      </span>
      <DropdownMenuPrimitive.ItemIndicator className="ml-auto inline-flex shrink-0 items-center">
        <Check aria-hidden="true" className="size-4 text-text-secondary" />
      </DropdownMenuPrimitive.ItemIndicator>
    </DropdownMenuPrimitive.RadioItem>
  );

  if (!disableTooltip && isTruncated) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{itemNode}</TooltipTrigger>
        <TooltipContent side={tooltipSide} sideOffset={8}>
          {children}
        </TooltipContent>
      </Tooltip>
    );
  }

  return itemNode;
}

export interface DropdownLabelProps
  extends ComponentProps<typeof DropdownMenuPrimitive.Label> {
  /** Height and text size of the group heading. */
  size?: 'small' | 'medium';
  /** Legacy inset prop preserved for compatibility. */
  inset?: boolean;
}

/** Heading for a group of dropdown rows. */
function DropdownLabel({
  size = 'medium',
  inset = false,
  className,
  ...props
}: DropdownLabelProps) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset || undefined}
      className={cn(
        'px-2 text-text-tertiary select-none',
        size === 'small' ? 'py-1 text-body-mini-medium' : 'py-1.5 text-body-small-medium',
        inset && 'pl-8',
        className,
      )}
      {...props}
    />
  );
}

export type DropdownSeparatorProps = ComponentProps<
  typeof DropdownMenuPrimitive.Separator
>;

/** Horizontal divider line between dropdown rows. */
function DropdownSeparator({ className, ...props }: DropdownSeparatorProps) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn('-mx-1 my-1 h-px bg-border-gray', className)}
      {...props}
    />
  );
}

export type DropdownShortcutProps = ComponentProps<typeof Kbd>;

/** Keyboard shortcut badge pinned to the end of a dropdown row. */
function DropdownShortcut({ className, ...props }: DropdownShortcutProps) {
  return (
    <Kbd
      data-slot="dropdown-menu-shortcut"
      className={cn('ml-auto shrink-0', className)}
      {...props}
    />
  );
}

export type DropdownSubProps = ComponentProps<typeof DropdownMenuPrimitive.Sub>;

/** Container for a nested submenu. */
function DropdownSub(props: DropdownSubProps) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

export interface DropdownSubTriggerProps
  extends ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> {
  /** Icon shown before the label. */
  startIcon?: DropdownIconValue;
  /** Hides the trailing chevron. */
  hideChevron?: boolean;
  /** Legacy inset prop preserved for compatibility. */
  inset?: boolean;
}

/** Row item that opens a nested `Dropdown.SubContent`. */
function DropdownSubTrigger({
  startIcon,
  hideChevron = false,
  inset = false,
  className,
  children,
  ...props
}: DropdownSubTriggerProps) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset || undefined}
      className={cn(
        'group/item relative flex min-h-8 cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-body-small-regular text-text-primary select-none outline-none transition-colors duration-100 ease-out data-[highlighted]:bg-control-hover data-[state=open]:bg-control-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
        inset && 'pl-8',
        className,
      )}
      {...props}
    >
      {renderDropdownIcon(
        startIcon,
        'size-4 shrink-0 text-text-secondary group-data-[highlighted]/item:text-text-primary group-data-[state=open]/item:text-text-primary',
      )}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {!hideChevron ? (
        <ChevronRight
          aria-hidden="true"
          className="ml-auto size-3.5 shrink-0 text-text-tertiary"
        />
      ) : null}
    </DropdownMenuPrimitive.SubTrigger>
  );
}

export interface DropdownSubContentProps
  extends ComponentProps<typeof DropdownMenuPrimitive.SubContent> {
  /** Minimum width of the submenu in pixels. */
  size?: number;
  /** Content pinned to the bottom of the submenu, with the rows above it scrolling. */
  pinnedBottom?: ReactNode;
}

/** Floating submenu panel anchored to `Dropdown.SubTrigger`. */
function DropdownSubContent({
  size = 249,
  sideOffset = 0,
  alignOffset = -4,
  pinnedBottom,
  className,
  style,
  children,
  ...props
}: DropdownSubContentProps) {
  const { submenusGrowUpward } = useContext(DropdownContentContext);

  return (
    <DropdownPortal>
      <DropdownMenuPrimitive.SubContent
        data-slot="dropdown-menu-sub-content"
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        style={{ minWidth: size, ...style }}
        className={cn(
          MENU_SURFACE_CLASSES,
          submenusGrowUpward && 'origin-bottom -translate-y-full',
          pinnedBottom
            ? 'flex flex-col overflow-hidden p-0'
            : 'scrollbar-custom overflow-x-hidden overflow-y-auto p-1',
          className,
        )}
        {...props}
      >
        {pinnedBottom ? (
          <>
            <div className="scrollbar-custom max-h-64 overflow-x-hidden overflow-y-auto p-1">
              {children}
            </div>
            <div className="shrink-0 border-t border-border-gray p-1">{pinnedBottom}</div>
          </>
        ) : (
          children
        )}
      </DropdownMenuPrimitive.SubContent>
    </DropdownPortal>
  );
}

const compoundParts = {
  Root: DropdownRoot,
  Trigger: DropdownTrigger,
  Portal: DropdownPortal,
  Content: DropdownContent,
  Group: DropdownGroup,
  Label: DropdownLabel,
  Item: DropdownItem,
  CheckboxItem: DropdownCheckboxItem,
  RadioGroup: DropdownRadioGroup,
  RadioItem: DropdownRadioItem,
  Separator: DropdownSeparator,
  Shortcut: DropdownShortcut,
  Sub: DropdownSub,
  SubTrigger: DropdownSubTrigger,
  SubContent: DropdownSubContent,
};

export const Dropdown = Object.assign(DropdownRoot, compoundParts);
export const DropdownMenu = Object.assign(DropdownRoot, compoundParts);

export {
  DropdownCheckboxItem as DropdownMenuCheckboxItem,
  DropdownContent as DropdownMenuContent,
  DropdownGroup as DropdownMenuGroup,
  DropdownItem as DropdownMenuItem,
  DropdownLabel as DropdownMenuLabel,
  DropdownPortal as DropdownMenuPortal,
  DropdownRadioGroup as DropdownMenuRadioGroup,
  DropdownRadioItem as DropdownMenuRadioItem,
  DropdownSeparator as DropdownMenuSeparator,
  DropdownShortcut as DropdownMenuShortcut,
  DropdownSub as DropdownMenuSub,
  DropdownSubContent as DropdownMenuSubContent,
  DropdownSubTrigger as DropdownMenuSubTrigger,
  DropdownTrigger as DropdownMenuTrigger,
};

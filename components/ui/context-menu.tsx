'use client';

import {
  isValidElement,
  type ComponentProps,
  type ReactNode,
} from 'react';
import {
  Archive,
  ArrowUpRight,
  Check,
  ChevronRight,
  Copy,
  CopyPlus,
  Download,
  ExternalLink,
  Eye,
  Files,
  FileText,
  Folder,
  Globe,
  Info,
  Link as LinkIcon,
  Pencil,
  Plus,
  Search,
  Settings,
  Share2,
  Star,
  Tag,
  Trash2,
  TriangleAlert,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import { ContextMenu as ContextMenuPrimitive } from 'radix-ui';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const CONTEXT_MENU_ICONS = {
  'arrow-up-right': ArrowUpRight,
  'external-link': ExternalLink,
  pencil: Pencil,
  edit: Pencil,
  duplicate: CopyPlus,
  copy: Copy,
  share: Share2,
  trash: Trash2,
  folder: Folder,
  archive: Archive,
  check: Check,
  plus: Plus,
  download: Download,
  settings: Settings,
  star: Star,
  info: Info,
  warning: TriangleAlert,
  search: Search,
  link: LinkIcon,
  eye: Eye,
  globe: Globe,
  tag: Tag,
  'user-plus': UserPlus,
  documents: Files,
  'file-text': FileText,
} as const satisfies Record<string, LucideIcon>;

export type ContextMenuIconName = keyof typeof CONTEXT_MENU_ICONS;

export interface ContextMenuIconDescriptor {
  /** Named icon registered for ContextMenu slots. */
  name: ContextMenuIconName | (string & {});
  /** Additional classes applied to the SVG icon. */
  className?: string;
}

export type ContextMenuIconValue =
  | ContextMenuIconName
  | (string & {})
  | ContextMenuIconDescriptor
  | ReactNode;

/** Type guard distinguishing icon descriptor objects from React nodes. */
function isContextMenuIconDescriptor(
  value: ContextMenuIconValue,
): value is ContextMenuIconDescriptor {
  return (
    typeof value === 'object' &&
    value !== null &&
    !isValidElement(value) &&
    'name' in value &&
    typeof (value as { name?: unknown }).name === 'string'
  );
}

/** Resolves a named icon string, descriptor `{ name, className }`, or custom node. */
function renderContextMenuIcon(
  icon: ContextMenuIconValue | undefined,
  defaultClassName = 'size-4 shrink-0 text-text-secondary',
): ReactNode {
  if (icon === undefined || icon === null || typeof icon === 'boolean') {
    return null;
  }

  if (typeof icon === 'string') {
    if (icon in CONTEXT_MENU_ICONS) {
      const IconComponent = CONTEXT_MENU_ICONS[icon as ContextMenuIconName];
      return <IconComponent aria-hidden="true" className={defaultClassName} />;
    }
    return null;
  }

  if (isContextMenuIconDescriptor(icon)) {
    if (icon.name in CONTEXT_MENU_ICONS) {
      const IconComponent = CONTEXT_MENU_ICONS[icon.name as ContextMenuIconName];
      return <IconComponent aria-hidden="true" className={cn(defaultClassName, icon.className)} />;
    }
    return null;
  }

  return icon;
}

export type ContextMenuRootProps = ComponentProps<typeof ContextMenuPrimitive.Root>;

/** Root container managing context menu open state and reading direction. */
function ContextMenuRoot({ modal = true, ...props }: ContextMenuRootProps) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" modal={modal} {...props} />;
}

export type ContextMenuTriggerProps = ComponentProps<typeof ContextMenuPrimitive.Trigger>;

/** Right-click or touch long-press target that opens the context menu at the pointer. */
function ContextMenuTrigger({
  asChild = false,
  disabled = false,
  className,
  ...props
}: ContextMenuTriggerProps) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      asChild={asChild}
      disabled={disabled}
      className={cn('select-none', className)}
      {...props}
    />
  );
}

export type ContextMenuGroupProps = ComponentProps<typeof ContextMenuPrimitive.Group>;

/** Groups related context menu items without adding visible chrome. */
function ContextMenuGroup(props: ContextMenuGroupProps) {
  return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />;
}

export type ContextMenuPortalProps = ComponentProps<typeof ContextMenuPrimitive.Portal>;

/** Radix portal wrapper; `ContextMenu.Content` and `ContextMenu.SubContent` already render in one. */
function ContextMenuPortal(props: ContextMenuPortalProps) {
  return <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />;
}

export type ContextMenuSubProps = ComponentProps<typeof ContextMenuPrimitive.Sub>;

/** Submenu root managing nested submenu state. */
function ContextMenuSub(props: ContextMenuSubProps) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
}

export type ContextMenuRadioGroupProps = ComponentProps<typeof ContextMenuPrimitive.RadioGroup>;

/** Radio item group inside a context menu. */
function ContextMenuRadioGroup(props: ContextMenuRadioGroupProps) {
  return <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />;
}

const MENU_SURFACE_CLASSES =
  'z-50 max-h-(--radix-context-menu-content-available-height) origin-(--radix-context-menu-content-transform-origin) rounded-lg bg-bg-primary text-text-primary shadow-medium ease-out outline-none data-[state=open]:animate-in data-[state=open]:duration-180 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98] data-[state=closed]:animate-out data-[state=closed]:duration-130 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] data-[state=closed]:fill-mode-forwards motion-reduce:data-[state=open]:zoom-in-100 motion-reduce:data-[state=closed]:zoom-out-100';

export interface ContextMenuContentProps
  extends ComponentProps<typeof ContextMenuPrimitive.Content> {
  /** Minimum width in pixels. */
  size?: number;
}

/** Floating menu surface rendered at the pointer inside a portal. */
function ContextMenuContent({
  size = 249,
  alignOffset = 0,
  collisionPadding = 0,
  className,
  style,
  ...props
}: ContextMenuContentProps) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        style={{ minWidth: size, ...style }}
        className={cn(
          MENU_SURFACE_CLASSES,
          'scrollbar-custom overflow-x-hidden overflow-y-auto p-1',
          className,
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}

export interface ContextMenuItemProps
  extends Omit<ComponentProps<typeof ContextMenuPrimitive.Item>, 'asChild'> {
  /** Icon name, descriptor, or element before the label. */
  start?: ContextMenuIconValue;
  /** Icon name, descriptor, or element after the label, aligned to the end. */
  end?: ContextMenuIconValue;
  /** Shows the item in red for actions that remove data. */
  destructive?: boolean;
  /** Renders the item as an anchor link. */
  href?: string;
  /** Link target, such as `_blank`. */
  target?: string;
  /** Link relationship, such as `noopener noreferrer`. */
  rel?: string;
  /** Tooltip explaining why a disabled item is unavailable while keeping the item hoverable. */
  disabledReason?: string;
}

/** Action or link item inside a context menu. */
function ContextMenuItem({
  start,
  end,
  destructive = false,
  href,
  target,
  rel,
  disabled = false,
  disabledReason,
  onSelect,
  className,
  children,
  ...props
}: ContextMenuItemProps) {
  const hasDisabledTooltip = Boolean(disabled && disabledReason);
  const iconColorClass = destructive
    ? 'size-4 shrink-0 text-text-red'
    : 'size-4 shrink-0 text-text-secondary group-data-[highlighted]/item:text-text-primary';

  const innerContent = (
    <>
      {renderContextMenuIcon(start, iconColorClass)}
      <span className="flex min-w-0 flex-1 items-center justify-between gap-2">{children}</span>
      {renderContextMenuIcon(end, iconColorClass)}
    </>
  );

  const itemClasses = cn(
    'group/item relative flex min-h-8 cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-body-small-regular select-none outline-none transition-colors duration-100 ease-out',
    destructive
      ? 'text-text-red data-[highlighted]:bg-bg-red-hover'
      : 'text-text-primary data-[highlighted]:bg-control-hover',
    hasDisabledTooltip && 'cursor-not-allowed opacity-50 data-[highlighted]:bg-transparent',
    disabled && !hasDisabledTooltip && 'pointer-events-none opacity-40',
    className,
  );

  const handleSelect: ContextMenuItemProps['onSelect'] = (event) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onSelect?.(event);
  };

  const itemNode =
    href && !disabled ? (
      <ContextMenuPrimitive.Item
        data-slot="context-menu-item"
        data-destructive={destructive || undefined}
        asChild
        onSelect={handleSelect}
        className={cn(itemClasses, 'text-inherit no-underline')}
        {...props}
      >
        <a href={href} target={target} rel={rel}>
          {innerContent}
        </a>
      </ContextMenuPrimitive.Item>
    ) : (
      <ContextMenuPrimitive.Item
        data-slot="context-menu-item"
        data-destructive={destructive || undefined}
        disabled={hasDisabledTooltip ? false : disabled}
        aria-disabled={disabled || undefined}
        data-disabled={disabled ? '' : undefined}
        onSelect={handleSelect}
        className={itemClasses}
        {...props}
      >
        {innerContent}
      </ContextMenuPrimitive.Item>
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

  return itemNode;
}

export interface ContextMenuSubTriggerProps
  extends ComponentProps<typeof ContextMenuPrimitive.SubTrigger> {
  /** Icon name, descriptor, or element before the label. A chevron is always shown at the end. */
  startIcon?: ContextMenuIconValue;
}

/** Row item that opens a nested `ContextMenu.SubContent` on hover or ArrowRight. */
function ContextMenuSubTrigger({
  startIcon,
  disabled = false,
  className,
  children,
  ...props
}: ContextMenuSubTriggerProps) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      disabled={disabled}
      className={cn(
        'group/item relative flex min-h-8 cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-body-small-regular text-text-primary select-none outline-none transition-colors duration-100 ease-out data-[highlighted]:bg-control-hover data-[state=open]:bg-control-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
        className,
      )}
      {...props}
    >
      {renderContextMenuIcon(
        startIcon,
        'size-4 shrink-0 text-text-secondary group-data-[highlighted]/item:text-text-primary group-data-[state=open]/item:text-text-primary',
      )}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <ChevronRight aria-hidden="true" className="ml-auto size-3.5 shrink-0 text-text-tertiary" />
    </ContextMenuPrimitive.SubTrigger>
  );
}

export interface ContextMenuSubContentProps
  extends ComponentProps<typeof ContextMenuPrimitive.SubContent> {
  /** Minimum width in pixels. */
  size?: number;
  /** Content fixed below the submenu's scrolling items, such as a create action. */
  pinnedBottom?: ReactNode;
}

/** Floating submenu surface rendered beside its `ContextMenu.SubTrigger`. */
function ContextMenuSubContent({
  size = 249,
  sideOffset = 8,
  alignOffset = -4,
  pinnedBottom,
  className,
  style,
  children,
  ...props
}: ContextMenuSubContentProps) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.SubContent
        data-slot="context-menu-sub-content"
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        style={{ minWidth: size, ...style }}
        className={cn(
          MENU_SURFACE_CLASSES,
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
            <div className="border-t border-border-gray p-1">{pinnedBottom}</div>
          </>
        ) : (
          children
        )}
      </ContextMenuPrimitive.SubContent>
    </ContextMenuPrimitive.Portal>
  );
}

export interface ContextMenuLabelProps
  extends ComponentProps<typeof ContextMenuPrimitive.Label> {
  /** Height and text size of the section label. */
  size?: 'small' | 'medium';
}

/** Non-interactive section heading inside a context menu. */
function ContextMenuLabel({ size = 'medium', className, ...props }: ContextMenuLabelProps) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      className={cn(
        'px-2 text-text-tertiary select-none',
        size === 'small' ? 'py-1 text-body-mini-medium' : 'py-1.5 text-body-small-medium',
        className,
      )}
      {...props}
    />
  );
}

export type ContextMenuSeparatorProps = ComponentProps<typeof ContextMenuPrimitive.Separator>;

/** Horizontal divider line between groups of items. */
function ContextMenuSeparator({ className, ...props }: ContextMenuSeparatorProps) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn('-mx-1 my-1 h-px bg-border-gray', className)}
      {...props}
    />
  );
}

export type ContextMenuShortcutProps = ComponentProps<'span'>;

/** Keyboard shortcut hint placed inside an item after its label. */
function ContextMenuShortcut({ className, ...props }: ContextMenuShortcutProps) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        'ml-auto pl-4 text-body-mini-regular tracking-widest text-text-tertiary',
        className,
      )}
      {...props}
    />
  );
}

export type ContextMenuCheckboxItemProps = ComponentProps<
  typeof ContextMenuPrimitive.CheckboxItem
>;

/** Checkbox menu item preserved for compatibility. */
function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: ContextMenuCheckboxItemProps) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      checked={checked}
      className={cn(
        'relative flex min-h-8 cursor-pointer items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-body-small-regular text-text-primary select-none outline-none data-[highlighted]:bg-control-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <Check aria-hidden="true" className="size-3.5 text-text-secondary" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

export type ContextMenuRadioItemProps = ComponentProps<typeof ContextMenuPrimitive.RadioItem>;

/** Radio menu item preserved for compatibility. */
function ContextMenuRadioItem({ className, children, ...props }: ContextMenuRadioItemProps) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(
        'relative flex min-h-8 cursor-pointer items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-body-small-regular text-text-primary select-none outline-none data-[highlighted]:bg-control-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <Check aria-hidden="true" className="size-3.5 text-text-secondary" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

export const ContextMenu = {
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  CheckboxItem: ContextMenuCheckboxItem,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
  Label: ContextMenuLabel,
  Separator: ContextMenuSeparator,
  Shortcut: ContextMenuShortcut,
  Group: ContextMenuGroup,
  Portal: ContextMenuPortal,
  Sub: ContextMenuSub,
  SubContent: ContextMenuSubContent,
  SubTrigger: ContextMenuSubTrigger,
};

export {
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuRoot,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};

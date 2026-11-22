'use client';

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type MouseEventHandler,
  type ReactNode,
  type Ref,
} from 'react';
import {
  Bot,
  Check,
  ChevronRight,
  Code,
  FileText,
  Folder,
  Globe,
  Home,
  Layers,
  Library,
  Search,
  Settings,
  Sparkles,
  Star,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const BREADCRUMB_ICONS = {
  library: Library,
  folder: Folder,
  'file-text': FileText,
  home: Home,
  settings: Settings,
  users: Users,
  bot: Bot,
  globe: Globe,
  sparkles: Sparkles,
  layers: Layers,
  star: Star,
  check: Check,
  search: Search,
  code: Code,
} as const satisfies Record<string, LucideIcon>;

export type BreadcrumbIconName = keyof typeof BREADCRUMB_ICONS;

export interface BreadcrumbIconDescriptor {
  /** Named Lucide icon registered for breadcrumbs. */
  name: BreadcrumbIconName | (string & {});
  /** Additional classes applied to the rendered SVG icon. */
  className?: string;
}

export type BreadcrumbIconValue =
  | BreadcrumbIconName
  | (string & {})
  | BreadcrumbIconDescriptor
  | ReactNode;

/** Assigns a React ref whether it is a callback function or mutable ref object. */
function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref && typeof ref === 'object') {
    (ref as { current: T | null }).current = value;
  }
}

/** Type guard distinguishing BreadcrumbIconDescriptor objects from React nodes. */
function isIconDescriptor(value: BreadcrumbIconValue): value is BreadcrumbIconDescriptor {
  return (
    typeof value === 'object' &&
    value !== null &&
    !isValidElement(value) &&
    'name' in value &&
    typeof value.name === 'string'
  );
}

/** Resolves a string icon name, icon descriptor, or custom node; returns null for unknown names. */
function renderStartIcon(startIcon: BreadcrumbIconValue): ReactNode {
  if (typeof startIcon === 'string') {
    if (startIcon in BREADCRUMB_ICONS) {
      const IconComponent = BREADCRUMB_ICONS[startIcon as BreadcrumbIconName];
      return <IconComponent aria-hidden="true" className="size-3.5 shrink-0 text-text-tertiary" />;
    }
    return null;
  }

  if (isIconDescriptor(startIcon)) {
    if (startIcon.name in BREADCRUMB_ICONS) {
      const IconComponent = BREADCRUMB_ICONS[startIcon.name as BreadcrumbIconName];
      return (
        <IconComponent
          aria-hidden="true"
          className={cn('size-3.5 shrink-0 text-text-tertiary', startIcon.className)}
        />
      );
    }
    return null;
  }

  return (
    <span aria-hidden="true" className="inline-flex shrink-0 items-center [&_svg]:size-3.5">
      {startIcon}
    </span>
  );
}

export interface BreadcrumbProps extends ComponentProps<'nav'> {
  /** Crumbs. Each direct child becomes one list item, preceded by a chevron after the first. */
  children: ReactNode;
  /** Additional classes for every chevron separator. */
  separatorClassName?: string;
}

/** Hierarchical breadcrumb navigation landmark that renders separators between direct children. */
function Breadcrumb({
  children,
  className,
  separatorClassName,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: BreadcrumbProps) {
  const items = Children.toArray(children);

  return (
    <nav
      data-slot="breadcrumb"
      aria-label={ariaLabelledBy ? undefined : (ariaLabel ?? 'Breadcrumb')}
      aria-labelledby={ariaLabelledBy}
      className={cn('flex min-w-0 flex-1 items-center', className)}
      {...props}
    >
      <ol data-slot="breadcrumb-list" className="flex min-w-0 flex-1 items-center gap-0.5">
        {items.map((child, index) => (
          <li
            key={isValidElement(child) && child.key !== null ? child.key : index}
            data-slot="breadcrumb-list-item"
            className="flex min-w-0 shrink items-center gap-0.5"
          >
            {index > 0 ? (
              <ChevronRight
                aria-hidden="true"
                className={cn('size-3.5 shrink-0 text-text-quaternary', separatorClassName)}
              />
            ) : null}
            {child}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export interface BreadcrumbItemProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Full label. Truncates with a tooltip when the trail runs out of room. */
  label: string;
  /** Destination of the crumb. Omit it for the current page, which renders as plain text. */
  href?: string;
  /** Icon name, icon descriptor, or node shown before the label. */
  startIcon?: BreadcrumbIconValue;
  /** Sets aria-current="page" on a crumb that still has an href. */
  isActive?: boolean;
  /** Disables the link. */
  isDisabled?: boolean;
  /** Click handler for the link, for example to intercept navigation. */
  onLinkClick?: MouseEventHandler<HTMLAnchorElement>;
  /** Registers the crumb as a drop target. */
  setNodeRef?: (element: HTMLElement | null) => void;
  /** Highlights the crumb while a dragged item hovers over it. */
  isOver?: boolean;
  /** Turns off pointer events while a drag is in progress. */
  isDragging?: boolean;
}

/** Individual breadcrumb link or current-page item with overflow truncation and tooltip fallback. */
function BreadcrumbItem({
  label,
  href,
  startIcon,
  isActive = false,
  isDisabled = false,
  onLinkClick,
  ref,
  setNodeRef,
  isOver = false,
  isDragging = false,
  className,
  ...props
}: BreadcrumbItemProps) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      assignRef(ref, node);
      setNodeRef?.(node);
    },
    [ref, setNodeRef],
  );

  useEffect(() => {
    const el = labelRef.current;
    if (!el) return;

    const updateTruncation = () => {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    };

    updateTruncation();
    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(updateTruncation);
    observer.observe(el);
    return () => observer.disconnect();
  }, [label]);

  const iconNode = startIcon !== undefined ? renderStartIcon(startIcon) : null;

  const content = (
    <>
      {iconNode}
      <span ref={labelRef} className="min-w-0 truncate">
        {label}
      </span>
    </>
  );

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    onLinkClick?.(event);
  };

  const innerElement = href ? (
    <a
      data-slot="breadcrumb-link"
      href={isDisabled ? undefined : href}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : undefined}
      onClick={handleLinkClick}
      className={cn(
        'inline-flex h-7 min-w-0 max-w-full items-center gap-1.5 rounded-sm px-2 text-body-small-regular transition-colors duration-150 ease-out outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isActive
          ? 'font-medium text-text-primary hover:bg-control-hover'
          : 'text-text-secondary hover:bg-control-hover hover:text-text-primary',
        isDisabled && 'pointer-events-none opacity-50',
      )}
    >
      {content}
    </a>
  ) : (
    <span
      data-slot="breadcrumb-page"
      aria-current="page"
      tabIndex={isTruncated ? 0 : undefined}
      className="inline-flex h-7 min-w-0 max-w-full items-center gap-1.5 rounded-sm px-2 text-body-small-medium text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {content}
    </span>
  );

  return (
    <div
      ref={mergedRef}
      data-slot="breadcrumb-item"
      data-over={isOver || undefined}
      data-dragging={isDragging || undefined}
      className={cn(
        'flex min-w-0 shrink items-center',
        isOver && 'rounded-sm bg-blue-muted-fill ring-1 ring-blue-base/50',
        isDragging && 'pointer-events-none',
        className,
      )}
      {...props}
    >
      {isTruncated ? (
        <Tooltip>
          <TooltipTrigger asChild>{innerElement}</TooltipTrigger>
          <TooltipContent sideOffset={6}>{label}</TooltipContent>
        </Tooltip>
      ) : (
        innerElement
      )}
    </div>
  );
}

export type BreadcrumbSlotProps = ComponentProps<'div'>;

/** Custom breadcrumb slot sized to shrink and truncate alongside BreadcrumbItem siblings. */
function BreadcrumbSlot({ children, className, ...props }: BreadcrumbSlotProps) {
  return (
    <div
      data-slot="breadcrumb-slot"
      className={cn('flex h-7 min-w-0 max-w-full shrink items-center', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export type BreadcrumbAccessoryProps = ComponentProps<'div'>;

/** Non-shrinking wrapper for buttons or menus rendered beside a crumb without a separator. */
function BreadcrumbAccessory({ children, className, ...props }: BreadcrumbAccessoryProps) {
  return (
    <div
      data-slot="breadcrumb-accessory"
      className={cn('flex shrink-0 items-center gap-0.5', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Breadcrumb, BreadcrumbAccessory, BreadcrumbItem, BreadcrumbSlot };

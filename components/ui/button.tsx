'use client';

import {
  isValidElement,
  type ComponentProps,
  type ReactNode,
} from 'react';
import Link, { type LinkProps } from 'next/link';
import { cva } from 'class-variance-authority';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BarChart3,
  Bookmark,
  BookOpen,
  Calendar,
  CalendarDays,
  ChartLine,
  ChartPie,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  Copy,
  CopyPlus,
  Download,
  Ellipsis,
  ExternalLink,
  Eye,
  Files,
  Filter,
  Globe,
  Info,
  LayoutGrid,
  List,
  Mic,
  Paperclip,
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
  ThumbsDown,
  ThumbsUp,
  Trash2,
  TriangleAlert,
  UserPlus,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Slot } from 'radix-ui';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export type ButtonMode =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'ghost'
  | 'subtle'
  | 'destructive'
  | 'dashed';

export type LegacyButtonVariant =
  | 'default'
  | 'pos-action'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'destructive'
  | 'link';

export type ButtonSecondarySurface = 'control' | 'page';

export type ButtonSize =
  | 'micro'
  | 'small'
  | 'regular'
  | 'large'
  | 'default'
  | 'xs'
  | 'sm'
  | 'lg'
  | 'icon'
  | 'icon-xs'
  | 'icon-sm'
  | 'icon-lg';

export interface ButtonLoading {
  /** Disables the control and shows the loading spinner. */
  isLoading?: boolean;
  /** Additional classes applied to the loading spinner. */
  className?: string;
}

const BUTTON_ICONS = {
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
  'arrow-up': ArrowUp,
  microphone: Mic,
  paperclip: Paperclip,
  sparkles: Sparkles,
  bookmark: Bookmark,
  'chart-line': ChartLine,
  calendar: Calendar,
  'calendar-days': CalendarDays,
  duplicate: CopyPlus,
  share: Share2,
  sliders: SlidersHorizontal,
} as const satisfies Record<string, LucideIcon>;

export type ButtonIconName = keyof typeof BUTTON_ICONS;

export interface ButtonIconDescriptor {
  /** Named icon registered for Button slots. */
  name: ButtonIconName | (string & {});
  /** Optional filled variant (for example, favorited stars). */
  variant?: 'default' | 'filled';
  /** Additional classes applied to the SVG icon. */
  className?: string;
}

export type ButtonIconValue =
  | ButtonIconName
  | (string & {})
  | ButtonIconDescriptor
  | ReactNode;

type ResolvedMode = ButtonMode | 'pos-action' | 'link';
type NormalizedSize = 'micro' | 'small' | 'regular' | 'large';

const BASE_BUTTON_CLASSES =
  'group/button relative inline-flex shrink-0 items-center justify-center whitespace-nowrap select-none outline-none transition-[background-color,color,border-color,opacity,transform] duration-150 ease-out motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none aria-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0';

const MODE_CLASSES: Record<ResolvedMode, string> = {
  primary:
    'bg-primary bg-button-primary text-primary-foreground shadow-button-primary hover:opacity-90 active:opacity-85',
  secondary:
    'bg-control-bg text-text-primary shadow-low hover:bg-control-hover hover:shadow-low-hover active:bg-control-selected',
  tertiary: 'bg-bg-tertiary text-text-primary active:bg-bg-quaternary',
  ghost: 'bg-transparent text-text-primary hover:bg-control-hover active:bg-control-selected',
  subtle:
    'bg-transparent text-text-secondary hover:bg-bg-tertiary hover:text-text-primary active:bg-bg-quaternary active:text-text-primary',
  destructive: 'bg-fill-red text-text-white shadow-low hover:bg-fill-red-hover active:opacity-90',
  dashed:
    'border border-dashed border-fill-tertiary bg-transparent text-text-secondary hover:border-fill-secondary hover:bg-control-hover hover:text-text-primary active:bg-control-selected',
  'pos-action':
    'bg-pos-action bg-button-pos-action text-primary-foreground shadow-button-pos-action hover:opacity-90',
  link: 'text-primary underline-offset-4 hover:underline',
};

const DISABLED_CLASSES = 'bg-bg-secondary text-text-tertiary shadow-none';
const DISABLED_TRANSPARENT_CLASSES = 'bg-transparent text-text-tertiary shadow-none';

const SIZE_CLASSES: Record<NormalizedSize, string> = {
  micro: 'h-6 rounded-sm px-1.5 text-body-micro-medium [&_svg]:size-3',
  small: 'h-7 rounded-sm px-2 text-body-mini-medium [&_svg]:size-3.5',
  regular: 'h-8 rounded-md px-2.5 text-body-small-medium [&_svg]:size-4',
  large: 'h-9 rounded-md px-3 text-body-regular-medium [&_svg]:size-4',
};

const ICON_ONLY_SIZE_CLASSES: Record<NormalizedSize, string> = {
  micro: 'size-6 rounded-sm px-0 [&_svg]:size-3',
  small: 'size-7 rounded-sm px-0 [&_svg]:size-3.5',
  regular: 'size-8 rounded-md px-0 [&_svg]:size-4',
  large: 'size-9 rounded-md px-0 [&_svg]:size-4',
};

const CONTENT_GAP_CLASSES: Record<NormalizedSize, string> = {
  micro: 'gap-1',
  small: 'gap-1.5',
  regular: 'gap-1.5',
  large: 'gap-2',
};

const SPINNER_SIZE_CLASSES: Record<NormalizedSize, string> = {
  micro: 'size-3',
  small: 'size-3.5',
  regular: 'size-4',
  large: 'size-4',
};

const SIZE_ALIASES: Record<ButtonSize, { normalized: NormalizedSize; forceIconOnly: boolean }> = {
  micro: { normalized: 'micro', forceIconOnly: false },
  xs: { normalized: 'micro', forceIconOnly: false },
  small: { normalized: 'small', forceIconOnly: false },
  sm: { normalized: 'small', forceIconOnly: false },
  regular: { normalized: 'regular', forceIconOnly: false },
  default: { normalized: 'regular', forceIconOnly: false },
  large: { normalized: 'large', forceIconOnly: false },
  lg: { normalized: 'large', forceIconOnly: false },
  'icon-xs': { normalized: 'micro', forceIconOnly: true },
  'icon-sm': { normalized: 'small', forceIconOnly: true },
  icon: { normalized: 'regular', forceIconOnly: true },
  'icon-lg': { normalized: 'large', forceIconOnly: true },
};

/** Legacy CVA helper preserved for compatibility with utility consumers. */
const buttonVariants = cva(BASE_BUTTON_CLASSES, {
  variants: {
    variant: {
      default: MODE_CLASSES.primary,
      'pos-action': MODE_CLASSES['pos-action'],
      outline: MODE_CLASSES.secondary,
      secondary: MODE_CLASSES.secondary,
      ghost: MODE_CLASSES.ghost,
      destructive: MODE_CLASSES.destructive,
      link: MODE_CLASSES.link,
    },
    size: {
      micro: `${SIZE_CLASSES.micro} ${CONTENT_GAP_CLASSES.micro}`,
      small: `${SIZE_CLASSES.small} ${CONTENT_GAP_CLASSES.small}`,
      regular: `${SIZE_CLASSES.regular} ${CONTENT_GAP_CLASSES.regular}`,
      large: `${SIZE_CLASSES.large} ${CONTENT_GAP_CLASSES.large}`,
      default: `${SIZE_CLASSES.regular} ${CONTENT_GAP_CLASSES.regular}`,
      xs: `${SIZE_CLASSES.micro} ${CONTENT_GAP_CLASSES.micro}`,
      sm: `${SIZE_CLASSES.small} ${CONTENT_GAP_CLASSES.small}`,
      lg: `${SIZE_CLASSES.large} ${CONTENT_GAP_CLASSES.large}`,
      icon: ICON_ONLY_SIZE_CLASSES.regular,
      'icon-xs': ICON_ONLY_SIZE_CLASSES.micro,
      'icon-sm': ICON_ONLY_SIZE_CLASSES.small,
      'icon-lg': ICON_ONLY_SIZE_CLASSES.large,
    },
  },
  defaultVariants: {
    variant: 'secondary',
    size: 'regular',
  },
});

/** Type guard distinguishing icon descriptor objects from React elements and nodes. */
function isIconDescriptor(value: ButtonIconValue): value is ButtonIconDescriptor {
  return (
    typeof value === 'object' &&
    value !== null &&
    !isValidElement(value) &&
    'name' in value &&
    typeof value.name === 'string'
  );
}

/** Maps a named icon string, descriptor, or custom node into an aria-hidden graphic. */
function renderButtonIcon(value: ButtonIconValue): ReactNode {
  if (typeof value === 'string') {
    if (value in BUTTON_ICONS) {
      const IconComponent = BUTTON_ICONS[value as ButtonIconName];
      return <IconComponent aria-hidden="true" />;
    }
    return null;
  }

  if (isIconDescriptor(value)) {
    if (value.name in BUTTON_ICONS) {
      const IconComponent = BUTTON_ICONS[value.name as ButtonIconName];
      return (
        <IconComponent
          aria-hidden="true"
          className={cn(value.variant === 'filled' && 'fill-current', value.className)}
        />
      );
    }
    return null;
  }

  return value;
}

/** Resolves the effective button mode from modern `mode` or legacy `variant`. */
function resolveMode(mode?: ButtonMode, variant?: LegacyButtonVariant): ResolvedMode {
  if (mode) return mode;
  if (!variant) return 'secondary';
  switch (variant) {
    case 'default':
      return 'primary';
    case 'outline':
    case 'secondary':
      return 'secondary';
    case 'ghost':
      return 'ghost';
    case 'destructive':
      return 'destructive';
    case 'pos-action':
      return 'pos-action';
    case 'link':
      return 'link';
  }
}

export interface ButtonProps extends ComponentProps<'button'> {
  /** Visual style of the button. */
  mode?: ButtonMode;
  /** Legacy shadcn variant alias mapped to `mode` when `mode` is omitted. */
  variant?: LegacyButtonVariant;
  /** Gives a secondary button the page background when placed on a tinted surface. */
  secondarySurface?: ButtonSecondarySurface;
  /** Size of the button on desktop. */
  size?: ButtonSize;
  /** Icon name, descriptor `{ name, variant }`, or custom artwork shown at the start. */
  iconStart?: ButtonIconValue;
  /** Icon name, descriptor `{ name, variant }`, or custom artwork shown at the end. */
  iconEnd?: ButtonIconValue;
  /** Loading configuration; disables the control and displays a spinner. */
  loading?: ButtonLoading;
  /** Custom class name for the button content wrapper. */
  contentClassName?: string;
  /** Shrinks the button while pressed; defaults to true except on `aria-haspopup` triggers. */
  allowScaleOnClick?: boolean;
  /** Displays the button in an error state. */
  error?: boolean;
  /** Renders a Next.js Link instead of a `<button>`, or a non-interactive span when disabled. */
  href?: string;
  /** Next.js Link prefetch behavior. Only applies with `href`. */
  prefetch?: LinkProps['prefetch'];
  /** Renders as the child element via Radix Slot when true and `href` is omitted. */
  asChild?: boolean;
}

/** Interactive button supporting modes, semantic sizes, start/end icons, loading states, and Next.js links. */
function Button({
  mode,
  variant,
  secondarySurface = 'control',
  size = 'regular',
  iconStart,
  iconEnd,
  loading,
  contentClassName,
  allowScaleOnClick,
  error = false,
  className,
  children,
  disabled = false,
  type = 'button',
  href,
  prefetch,
  asChild = false,
  ...props
}: ButtonProps) {
  const resolvedMode = resolveMode(mode, variant);
  const { normalized: normalizedSize, forceIconOnly } = SIZE_ALIASES[size];
  const isLoading = Boolean(loading?.isLoading);
  const isDisabled = Boolean(disabled) || isLoading;

  const hasChildren =
    children !== undefined && children !== null && children !== false && children !== '';
  const hasStartIcon = iconStart !== undefined;
  const hasEndIcon = iconEnd !== undefined;
  const isIconOnly = forceIconOnly || (!hasChildren && (hasStartIcon || hasEndIcon));

  const spinnerNode = (
    <Spinner
      aria-hidden="true"
      className={cn(SPINNER_SIZE_CLASSES[normalizedSize], loading?.className)}
    />
  );

  // Use centered overlay only when loading with no icon slots, preserving exact button width.
  const useCenteredOverlay = isLoading && !hasStartIcon && !hasEndIcon;
  const startNode =
    isLoading && hasStartIcon
      ? spinnerNode
      : hasStartIcon
        ? renderButtonIcon(iconStart)
        : null;
  const endNode =
    isLoading && !hasStartIcon && hasEndIcon
      ? spinnerNode
      : hasEndIcon
        ? renderButtonIcon(iconEnd)
        : null;

  let modeClasses = MODE_CLASSES[resolvedMode];
  if (resolvedMode === 'secondary' && secondarySurface === 'page' && !isDisabled) {
    modeClasses =
      'bg-bg-base text-text-primary shadow-low hover:bg-control-hover hover:shadow-low-hover active:bg-control-selected';
  }

  if (isDisabled) {
    if (resolvedMode === 'ghost' || resolvedMode === 'subtle') {
      modeClasses = isLoading ? 'bg-bg-tertiary text-text-tertiary shadow-none' : DISABLED_TRANSPARENT_CLASSES;
    } else if (resolvedMode === 'dashed') {
      modeClasses = cn(DISABLED_CLASSES, 'border border-dashed border-border-gray');
    } else {
      modeClasses = DISABLED_CLASSES;
    }
  }

  let scaleClasses = '';
  if (!isDisabled) {
    if (allowScaleOnClick === true) {
      scaleClasses = 'active:scale-[0.97]';
    } else if (allowScaleOnClick === undefined) {
      scaleClasses = 'active:not-aria-[haspopup]:scale-[0.97]';
    }
  }

  const classes = cn(
    BASE_BUTTON_CLASSES,
    isIconOnly ? ICON_ONLY_SIZE_CLASSES[normalizedSize] : SIZE_CLASSES[normalizedSize],
    asChild && !isIconOnly && CONTENT_GAP_CLASSES[normalizedSize],
    modeClasses,
    scaleClasses,
    error && 'ring-1 ring-red-base',
    className,
  );

  const innerContent = (
    <>
      {useCenteredOverlay ? (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {spinnerNode}
        </span>
      ) : null}
      <span
        data-slot="button-content"
        className={cn(
          'inline-flex min-w-0 items-center justify-center',
          !isIconOnly && CONTENT_GAP_CLASSES[normalizedSize],
          useCenteredOverlay && 'opacity-0',
          contentClassName,
        )}
      >
        {startNode}
        {hasChildren ? children : null}
        {endNode}
      </span>
    </>
  );

  if (href !== undefined) {
    if (isDisabled) {
      return (
        <span
          role="link"
          aria-disabled="true"
          aria-busy={isLoading || undefined}
          aria-invalid={error || undefined}
          data-slot="button"
          data-mode={resolvedMode}
          data-size={normalizedSize}
          className={classes}
        >
          {innerContent}
        </span>
      );
    }

    return (
      <Link
        href={href}
        prefetch={prefetch}
        aria-invalid={error || undefined}
        data-slot="button"
        data-mode={resolvedMode}
        data-size={normalizedSize}
        className={classes}
      >
        {innerContent}
      </Link>
    );
  }

  if (asChild) {
    return (
      <Slot.Root
        data-slot="button"
        data-mode={resolvedMode}
        data-size={normalizedSize}
        aria-invalid={error || undefined}
        aria-busy={isLoading || undefined}
        className={classes}
        {...props}
      >
        {children}
      </Slot.Root>
    );
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      aria-invalid={error || undefined}
      data-slot="button"
      data-mode={resolvedMode}
      data-size={normalizedSize}
      className={classes}
      {...props}
    >
      {innerContent}
    </button>
  );
}

export { Button, buttonVariants };

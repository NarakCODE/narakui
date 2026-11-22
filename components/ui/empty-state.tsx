'use client';

import {
  isValidElement,
  type AriaRole,
  type ComponentProps,
  type ReactNode,
} from 'react';
import {
  Archive,
  BarChart3,
  Bell,
  Bookmark,
  BookOpen,
  Calendar,
  CalendarDays,
  ChartLine,
  ChartPie,
  CircleCheck,
  CircleX,
  Clock,
  Database,
  Download,
  ExternalLink,
  Eye,
  Files,
  FileText,
  Filter,
  Folder,
  Globe,
  Inbox,
  Info,
  LayoutGrid,
  Link as LinkIcon,
  List,
  Lock,
  Mail,
  MessageSquare,
  MessagesSquare,
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
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type EmptyStateSize = 'page' | 'section' | 'inline';

const EMPTY_STATE_ICONS = {
  documents: Files,
  link: LinkIcon,
  warning: TriangleAlert,
  info: Info,
  search: Search,
  plus: Plus,
  refresh: RefreshCw,
  folder: Folder,
  'file-text': FileText,
  archive: Archive,
  inbox: Inbox,
  sparkles: Sparkles,
  globe: Globe,
  'chart-line': ChartLine,
  'chart-pie': ChartPie,
  leaderboard: BarChart3,
  references: BookOpen,
  eye: Eye,
  tag: Tag,
  bookmark: Bookmark,
  calendar: Calendar,
  'calendar-days': CalendarDays,
  filter: Filter,
  sliders: SlidersHorizontal,
  settings: Settings,
  'check-circle': CircleCheck,
  'close-circle': CircleX,
  trash: Trash2,
  'user-plus': UserPlus,
  share: Share2,
  download: Download,
  'external-link': ExternalLink,
  star: Star,
  list: List,
  'layout-grid': LayoutGrid,
  lock: Lock,
  mail: Mail,
  'message-square': MessageSquare,
  'chat-bubbles': MessagesSquare,
  bell: Bell,
  clock: Clock,
  database: Database,
} as const satisfies Record<string, LucideIcon>;

export type EmptyStateIconName = keyof typeof EMPTY_STATE_ICONS;

export interface EmptyStateIconDescriptor {
  /** Named icon registered for EmptyState and ErrorState. */
  name: EmptyStateIconName | (string & {});
  /** Optional filled variant. */
  variant?: 'default' | 'filled';
  /** Additional classes applied to the SVG icon. */
  className?: string;
}

export type EmptyStateIconValue =
  | EmptyStateIconName
  | (string & {})
  | EmptyStateIconDescriptor
  | ReactNode;

export type IconValue = EmptyStateIconValue;

const SIZE_CLASSES: Record<EmptyStateSize, string> = {
  page: 'min-h-100 gap-4',
  section: 'min-h-37.5 gap-4',
  inline: 'gap-2 py-4',
};

const ANIMATE_STEP_BASE_CLASSES =
  'starting:opacity-0 starting:translate-y-1.5 transition-[opacity,translate] duration-250 ease-out motion-reduce:starting:translate-y-0 motion-reduce:transition-opacity motion-reduce:delay-0';

const ANIMATE_STAGGER_CLASSES = [
  `${ANIMATE_STEP_BASE_CLASSES} delay-[0ms]`,
  `${ANIMATE_STEP_BASE_CLASSES} delay-[40ms]`,
  `${ANIMATE_STEP_BASE_CLASSES} delay-[80ms]`,
  `${ANIMATE_STEP_BASE_CLASSES} delay-[120ms]`,
] as const;

/** Checks whether a ReactNode prop carries renderable content. */
function hasRenderableNode(value: ReactNode): boolean {
  return value !== undefined && value !== null && value !== false && value !== '';
}

/** Type guard distinguishing icon descriptor objects from React elements and nodes. */
function isEmptyStateIconDescriptor(
  value: EmptyStateIconValue,
): value is EmptyStateIconDescriptor {
  return (
    typeof value === 'object' &&
    value !== null &&
    !isValidElement(value) &&
    'name' in value &&
    typeof (value as { name?: unknown }).name === 'string'
  );
}

/** Maps a named icon string, descriptor, or custom node into a rendered graphic. */
function renderEmptyStateIcon(
  value: EmptyStateIconValue | undefined,
  extraClassName?: string,
): ReactNode {
  if (
    value === undefined ||
    value === null ||
    typeof value === 'boolean' ||
    value === ''
  ) {
    return null;
  }

  if (typeof value === 'string') {
    if (value in EMPTY_STATE_ICONS) {
      const IconComponent = EMPTY_STATE_ICONS[value as EmptyStateIconName];
      return (
        <IconComponent
          aria-hidden="true"
          width={16}
          height={16}
          data-slot="empty-state-icon"
          className={cn('shrink-0 size-6 text-fill-secondary', extraClassName)}
        />
      );
    }
    return null;
  }

  if (isEmptyStateIconDescriptor(value)) {
    if (value.name in EMPTY_STATE_ICONS) {
      const IconComponent = EMPTY_STATE_ICONS[value.name as EmptyStateIconName];
      return (
        <IconComponent
          aria-hidden="true"
          width={16}
          height={16}
          data-slot="empty-state-icon"
          className={cn(
            'shrink-0 size-6 text-fill-secondary',
            value.variant === 'filled' && 'fill-current',
            value.className,
            extraClassName,
          )}
        />
      );
    }
    return null;
  }

  if (extraClassName) {
    return (
      <div className={cn('inline-flex items-center justify-center', extraClassName)}>
        {value}
      </div>
    );
  }

  return value;
}

export interface EmptyStateProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Icon name, descriptor, or node above the title. */
  icon?: EmptyStateIconValue;
  /** Optional headline for the state. */
  title?: ReactNode;
  /** One sentence on what would appear here, or what to do about it. */
  description?: ReactNode;
  /** Primary action, such as creating the missing thing. */
  action?: ReactNode;
  /** Vertical room the state takes. @default 'section' */
  size?: EmptyStateSize;
  /** Opt-in staggered mount entrance for first-run empty states. @default false */
  animate?: boolean;
  /** Additional classes for the container. */
  className?: string;
}

/**
 * Centered placeholder for a page, section, or inline region that has nothing to show yet.
 */
function EmptyState({
  icon,
  title,
  description,
  action,
  size = 'section',
  animate = false,
  className,
  ...props
}: EmptyStateProps) {
  const iconNode = renderEmptyStateIcon(
    icon,
    animate ? ANIMATE_STAGGER_CLASSES[0] : undefined,
  );
  const hasTitle = hasRenderableNode(title);
  const hasDescription = hasRenderableNode(description);
  const hasAction = hasRenderableNode(action);

  return (
    <div
      data-slot="empty-state"
      data-size={size}
      data-animate={animate ? 'true' : undefined}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {iconNode}

      {hasTitle || hasDescription ? (
        <div
          data-slot="empty-state-content"
          className="max-w-77.5 space-y-2"
        >
          {hasTitle ? (
            <p
              data-slot="empty-state-title"
              className={cn(
                'text-body-small-medium text-text-secondary',
                animate && ANIMATE_STAGGER_CLASSES[1],
              )}
            >
              {title}
            </p>
          ) : null}
          {hasDescription ? (
            <p
              data-slot="empty-state-description"
              className={cn(
                'text-balance text-paragraph-small text-text-tertiary',
                animate && ANIMATE_STAGGER_CLASSES[2],
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
      ) : null}

      {hasAction ? (
        animate ? (
          <div className={ANIMATE_STAGGER_CLASSES[3]}>{action}</div>
        ) : (
          action
        )
      ) : null}
    </div>
  );
}

export interface ErrorStateProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Retries the failed work. Omit to render the message without a button. */
  onRetry?: () => void;
  /** Label for the retry button. @default 'Try again' */
  retryLabel?: ReactNode;
  /** Headline for the failure. @default "We couldn't load this" */
  title?: ReactNode;
  /** Icon above the title. @default 'warning' */
  icon?: EmptyStateIconValue;
  /** One sentence on what failed. */
  description?: ReactNode;
  /** Vertical room the state takes. @default 'section' */
  size?: EmptyStateSize;
  /** ARIA live-region role. @default 'alert' */
  role?: AriaRole;
  /** Opt-in staggered mount entrance for first-run error states. @default false */
  animate?: boolean;
  /** Additional classes for the container. */
  className?: string;
}

/**
 * Centered failure state sharing the same layout as `EmptyState`, with an alert role and optional retry action.
 */
function ErrorState({
  onRetry,
  retryLabel = 'Try again',
  title = "We couldn't load this",
  icon = 'warning',
  description,
  size = 'section',
  role = 'alert',
  animate = false,
  className,
  ...props
}: ErrorStateProps) {
  const iconNode = renderEmptyStateIcon(
    icon,
    animate ? ANIMATE_STAGGER_CLASSES[0] : undefined,
  );
  const resolvedTitle = hasRenderableNode(title)
    ? title
    : "We couldn't load this";
  const resolvedRetryLabel = hasRenderableNode(retryLabel)
    ? retryLabel
    : 'Try again';
  const hasDescription = hasRenderableNode(description);

  return (
    <div
      role={role}
      data-slot="error-state"
      data-size={size}
      data-animate={animate ? 'true' : undefined}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {iconNode}

      <div
        data-slot="empty-state-content"
        className="max-w-77.5 space-y-2"
      >
        <p
          data-slot="empty-state-title"
          className={cn(
            'text-body-small-medium text-text-secondary',
            animate && ANIMATE_STAGGER_CLASSES[1],
          )}
        >
          {resolvedTitle}
        </p>
        {hasDescription ? (
          <p
            data-slot="empty-state-description"
            className={cn(
              'text-balance text-paragraph-small text-text-tertiary',
              animate && ANIMATE_STAGGER_CLASSES[2],
            )}
          >
            {description}
          </p>
        ) : null}
      </div>

      {onRetry ? (
        <Button
          mode="secondary"
          size="small"
          onClick={onRetry}
          className={cn(animate && ANIMATE_STAGGER_CLASSES[3])}
        >
          {resolvedRetryLabel}
        </Button>
      ) : null}
    </div>
  );
}

export { EmptyState, ErrorState };

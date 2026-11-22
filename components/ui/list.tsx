'use client';

import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { Slot } from 'radix-ui';
import { Card, type CardBackground, type CardPadding } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/** Truncates single-line text and shows its full contents in a tooltip when clipped. */
function TruncatedText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (!element) {
      setIsTruncated(false);
      return;
    }

    const update = () => {
      setIsTruncated(element.scrollWidth > element.clientWidth);
    };

    update();
    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, children]);

  const textNode = (
    <div
      ref={setElement}
      className={cn(
        'min-w-0 overflow-hidden text-ellipsis whitespace-nowrap',
        className,
      )}
    >
      {children}
    </div>
  );

  if (!isTruncated) {
    return textNode;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{textNode}</TooltipTrigger>
      <TooltipContent side="top" sideOffset={6}>
        {children}
      </TooltipContent>
    </Tooltip>
  );
}

export interface ListRootProps extends ComponentProps<'div'> {
  /** Lets ArrowDown and ArrowUp move focus between enabled rows. Stops at the first and last row. @default false */
  keyboardNavigation?: boolean;
  /** Card surface color. @default 'primary' */
  background?: CardBackground;
  /** Card padding. Header, Body and Footer already have their own spacing. @default 'none' */
  padding?: CardPadding;
  /** Runs before arrow key navigation. Call `preventDefault()` to stop it. */
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
}

/** Card container for structured list headers, bodies, sections, rows, and footers. */
function ListRoot({
  keyboardNavigation = false,
  background = 'primary',
  padding = 'none',
  onKeyDown,
  className,
  ...props
}: ListRootProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !keyboardNavigation) return;
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

    const container = rootRef.current;
    if (!container) return;

    const actions = Array.from(
      container.querySelectorAll<HTMLElement>(
        '[data-list-primary-action="true"]:not([disabled]):not([aria-disabled="true"])',
      ),
    );
    if (actions.length === 0) return;

    const activeElement = document.activeElement as HTMLElement | null;
    const currentIndex = actions.findIndex(
      (action) =>
        action === activeElement ||
        (activeElement !== null &&
          action.closest('[data-slot="list-item-root"]')?.contains(activeElement)),
    );

    if (currentIndex === -1) return;

    const nextIndex =
      event.key === 'ArrowDown'
        ? Math.min(currentIndex + 1, actions.length - 1)
        : Math.max(currentIndex - 1, 0);

    event.preventDefault();
    if (nextIndex !== currentIndex) {
      actions[nextIndex]?.focus();
    }
  };

  return (
    <Card
      ref={rootRef}
      data-slot="list-root"
      data-list-root="true"
      background={background}
      padding={padding}
      onKeyDown={handleKeyDown}
      className={cn('bg-bg-primary shadow-medium', className)}
      {...props}
    />
  );
}

export interface ListHeaderProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Heading text, rendered in an `h2` and truncated when too long. */
  title?: ReactNode;
  /** Id of the heading, for `aria-labelledby` on the surrounding section. */
  titleId?: string;
  /** Controls at the end of the header. */
  actions?: ReactNode;
  /** Replaces the heading, for example with a collapsible trigger. */
  children?: ReactNode;
}

/** Header bar for a List card with a truncated heading and optional trailing controls. */
function ListHeader({
  title,
  titleId,
  actions,
  children,
  className,
  ...props
}: ListHeaderProps) {
  return (
    <div
      data-slot="list-header"
      className={cn('flex h-11 min-w-0 items-center justify-between', className)}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <h2
          id={titleId}
          className="min-w-0 px-4 text-body-small-medium text-text-primary"
        >
          <TruncatedText>{title}</TruncatedText>
        </h2>
      )}
      {actions}
    </div>
  );
}

export type ListDividerProps = ComponentProps<'div'>;

/** Hairline horizontal divider hidden from screen readers. */
function ListDivider({ className, ...props }: ListDividerProps) {
  return (
    <div
      aria-hidden="true"
      data-slot="list-divider"
      className={cn('h-px bg-border-gray', className)}
      {...props}
    />
  );
}

export type ListBodyProps = ComponentProps<'div'>;

/** Body container holding list items, sections, or loading/empty states. */
function ListBody({ className, ...props }: ListBodyProps) {
  return (
    <div
      data-slot="list-body"
      className={cn('p-1', className)}
      {...props}
    />
  );
}

export interface ListSectionProps extends ComponentProps<'section'> {
  /** Id of the section's `List.Subheader`. */
  'aria-labelledby'?: string;
}

/** Semantic grouping section within a List body. */
function ListSection({ className, ...props }: ListSectionProps) {
  return (
    <section
      data-slot="list-section"
      className={className}
      {...props}
    />
  );
}

export type ListSubheaderProps = ComponentProps<'h3'>;

/** Section heading rendered inside a `List.Section`. */
function ListSubheader({ className, ...props }: ListSubheaderProps) {
  return (
    <h3
      data-slot="list-subheader"
      className={cn(
        'px-2.5 pt-2 pb-1 text-body-mini-medium text-text-secondary',
        className,
      )}
      {...props}
    />
  );
}

export type ListItemsProps = ComponentProps<'ul'>;

/** Unordered list container for `ListItem.Root` rows. */
function ListItems({ className, ...props }: ListItemsProps) {
  return (
    <ul
      data-slot="list-items"
      className={cn('m-0 min-w-0 list-none p-0', className)}
      {...props}
    />
  );
}

export type ListFooterProps = ComponentProps<'div'>;

/** Footer region for bottom actions such as a "See all" link. */
function ListFooter({ className, ...props }: ListFooterProps) {
  return (
    <div
      data-slot="list-footer"
      className={cn('p-1', className)}
      {...props}
    />
  );
}

export interface ListItemRootProps extends ComponentProps<'li'> {
  /** Renders onto the child element instead of an `li`. Wrap it in an `li` if the child isn't one. @default false */
  asChild?: boolean;
}

/** Row container wrapping one `ListItem.PrimaryAction` and optional sibling `ListItem.Actions`. */
function ListItemRoot({
  asChild = false,
  className,
  ...props
}: ListItemRootProps) {
  const Comp = asChild ? Slot.Root : 'li';

  return (
    <Comp
      data-slot="list-item-root"
      className={cn(
        'group/list-item flex min-w-0 items-start rounded-md transition-colors duration-150 ease-out motion-reduce:transition-none has-[:enabled:hover]:bg-control-hover has-[a:hover]:bg-control-hover has-focus-visible:bg-control-hover has-[[data-list-primary-action]:focus-visible]:outline-2 has-[[data-list-primary-action]:focus-visible]:-outline-offset-2 has-[[data-list-primary-action]:focus-visible]:outline-blue-base',
        className,
      )}
      {...props}
    />
  );
}

export interface ListItemPrimaryActionProps extends ComponentProps<'button'> {
  /** Renders onto the child, usually a link with its own `href`, instead of a button. @default false */
  asChild?: boolean;
  /** Called when the row is clicked. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Dims the row and skips it during arrow key navigation. @default false */
  disabled?: boolean;
  /** Button type when `asChild` is false. @default 'button' */
  type?: 'button' | 'submit' | 'reset';
}

/** Primary interactive button or link spanning the row's main content area. */
function ListItemPrimaryAction({
  asChild = false,
  disabled = false,
  type = 'button',
  onClick,
  className,
  ...props
}: ListItemPrimaryActionProps) {
  const sharedClasses = cn(
    'flex min-w-0 flex-1 cursor-pointer items-start rounded-md px-2 py-2 text-left focus:outline-none disabled:cursor-default disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
    className,
  );

  if (asChild) {
    return (
      <Slot.Root
        data-slot="list-item-primary-action"
        data-list-primary-action="true"
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : props.tabIndex}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault();
            return;
          }
          onClick?.(event as unknown as MouseEvent<HTMLButtonElement>);
        }}
        className={sharedClasses}
        {...props}
      />
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      data-slot="list-item-primary-action"
      data-list-primary-action="true"
      onClick={onClick}
      className={sharedClasses}
      {...props}
    />
  );
}

export interface ListItemContentProps {
  /** Row title. */
  title: ReactNode;
  /** Secondary line under the title. */
  description?: ReactNode;
  /** Icon or avatar before the title. */
  leading?: ReactNode;
  /** Aligns the leading slot with the title or centers it on the row. @default 'start' */
  leadingAlign?: 'start' | 'center';
  /** Short label after the title, such as a Badge. */
  status?: ReactNode;
  /** Metadata at the end of the row, such as a timestamp or `ListItem.Reveal`. */
  trailing?: ReactNode;
  /** Truncates a long title with a tooltip, or wraps it onto more lines. @default 'truncate' */
  titleBehavior?: 'truncate' | 'wrap';
}

/** Structured layout for a row's leading graphic, title, description, status badge, and trailing slot. */
function ListItemContent({
  title,
  description,
  leading,
  leadingAlign = 'start',
  status,
  trailing,
  titleBehavior = 'truncate',
}: ListItemContentProps) {
  return (
    <div
      data-slot="list-item-content"
      className="flex w-full min-w-0 items-start gap-2"
    >
      {leading !== undefined && leading !== null ? (
        <span
          className={cn(
            'flex size-6 shrink-0 items-center justify-center text-text-secondary',
            leadingAlign === 'center' && 'self-center',
          )}
        >
          {leading}
        </span>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5">
        {titleBehavior === 'wrap' ? (
          <div className="min-h-5 wrap-anywhere text-body-small-spaced text-text-primary">
            {title}
          </div>
        ) : (
          <TruncatedText className="min-h-5 text-body-small-spaced text-text-primary">
            {title}
          </TruncatedText>
        )}

        {description !== undefined && description !== null ? (
          <div className="min-h-4 text-body-mini-regular text-text-secondary">
            {description}
          </div>
        ) : null}
      </div>

      {status !== undefined && status !== null ? (
        <span className="flex min-h-6 shrink-0 items-center">{status}</span>
      ) : null}

      {trailing !== undefined && trailing !== null ? (
        <span className="flex min-h-6 shrink-0 items-center self-center text-body-small-regular text-text-secondary">
          {trailing}
        </span>
      ) : null}
    </div>
  );
}

export interface ListItemActionsProps extends ComponentProps<'div'> {
  /** Aligns the controls with the title or centers them on the row. @default 'start' */
  align?: 'start' | 'center';
}

/** Container for secondary row controls placed beside `ListItem.PrimaryAction`. */
function ListItemActions({
  align = 'start',
  className,
  ...props
}: ListItemActionsProps) {
  return (
    <div
      data-slot="list-item-actions"
      className={cn(
        'my-2 mr-1 flex min-h-6 shrink-0 items-center gap-2',
        align === 'center' && 'self-center',
        className,
      )}
      {...props}
    />
  );
}

export interface ListItemRevealProps {
  /** Content shown until the row is hovered or focused. */
  resting: ReactNode;
  /** Content shown while the row is hovered with a mouse or focused with the keyboard. */
  active: ReactNode;
}

/** Swaps resting trailing metadata for an active hint on hover or keyboard focus without layout shift. */
function ListItemReveal({ resting, active }: ListItemRevealProps) {
  return (
    <span
      data-slot="list-item-reveal"
      className="grid items-center justify-items-end"
    >
      <span className="col-start-1 row-start-1 [:where(.group\/list-item):has(:focus-visible)_&]:invisible [@media(hover:hover)_and_(pointer:fine)]:group-hover/list-item:invisible">
        {resting}
      </span>
      <span className="invisible col-start-1 row-start-1 [:where(.group\/list-item):has(:focus-visible)_&]:visible [@media(hover:hover)_and_(pointer:fine)]:group-hover/list-item:visible">
        {active}
      </span>
    </span>
  );
}

export type ListItemActionHintProps = ComponentProps<'span'>;

/** Non-interactive pill hint describing a row's primary action, hidden from screen readers. */
function ListItemActionHint({
  className,
  ...props
}: ListItemActionHintProps) {
  return (
    <span
      aria-hidden="true"
      data-slot="list-item-action-hint"
      className={cn(
        'pointer-events-none flex min-h-6 items-center whitespace-nowrap rounded-md bg-control-bg px-2 text-body-mini-medium text-text-primary shadow-low',
        className,
      )}
      {...props}
    />
  );
}

export const List = {
  Root: ListRoot,
  Header: ListHeader,
  Divider: ListDivider,
  Body: ListBody,
  Section: ListSection,
  Subheader: ListSubheader,
  Items: ListItems,
  Footer: ListFooter,
};

export const ListItem = {
  Root: ListItemRoot,
  PrimaryAction: ListItemPrimaryAction,
  Content: ListItemContent,
  Actions: ListItemActions,
  Reveal: ListItemReveal,
  ActionHint: ListItemActionHint,
};

export {
  ListBody,
  ListDivider,
  ListFooter,
  ListHeader,
  ListItemActionHint,
  ListItemActions,
  ListItemContent,
  ListItemPrimaryAction,
  ListItemReveal,
  ListItemRoot,
  ListItems,
  ListRoot,
  ListSection,
  ListSubheader,
};

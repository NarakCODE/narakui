'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ComponentPropsWithoutRef,
} from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type DialogVariant = 'default' | 'structured';
export type DialogSize = 'md' | 'lg' | 'xl';
export type DialogContentPadding = 'content' | 'regions';
export type DialogContentGap = 'default' | 'none';
export type DialogOverlayZIndex = 'dialog' | 'drawer';

interface DialogContentContextValue {
  variant: DialogVariant;
  contentPadding: DialogContentPadding;
}

const DialogContentContext = createContext<DialogContentContextValue>({
  variant: 'default',
  contentPadding: 'content',
});

const STRUCTURED_SIZE_CLASSES: Record<DialogSize, string> = {
  md: 'w-[440px]',
  lg: 'w-[640px] min-h-[40vh]',
  xl: 'w-[800px] min-h-[60vh]',
};

export type DialogRootProps = ComponentProps<typeof DialogPrimitive.Root>;

/** Manages dialog open state and modal focus trapping. */
function DialogRoot({ modal = true, ...props }: DialogRootProps) {
  return <DialogPrimitive.Root data-slot="dialog" modal={modal} {...props} />;
}

export type DialogTriggerProps = ComponentProps<typeof DialogPrimitive.Trigger>;

/** Opens the dialog when activated. Use `asChild` with a `Button`. */
function DialogTrigger(props: DialogTriggerProps) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

export type DialogPortalProps = ComponentProps<typeof DialogPrimitive.Portal>;

/** Radix portal container for dialog overlay and content. */
function DialogPortal(props: DialogPortalProps) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

export type DialogCloseProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Close>;

/** Radix close primitive. Use `asChild` to make a footer button close the dialog. */
function DialogClose(props: DialogCloseProps) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

export type DialogCloseButtonProps = Omit<ComponentProps<typeof Button>, 'iconStart'>;

/** Ghost icon button that closes the dialog. `aria-label` defaults to `"Close dialog"`. */
function DialogCloseButton({
  'aria-label': ariaLabel = 'Close dialog',
  mode = 'ghost',
  size = 'small',
  className,
  ...props
}: DialogCloseButtonProps) {
  return (
    <DialogPrimitive.Close data-slot="dialog-close-button" asChild>
      <Button
        mode={mode}
        size={size}
        iconStart="x"
        aria-label={ariaLabel}
        className={cn('-mt-0.5 -mr-1.5 shrink-0', className)}
        {...props}
      />
    </DialogPrimitive.Close>
  );
}

export interface DialogOverlayProps
  extends ComponentProps<typeof DialogPrimitive.Overlay> {
  /** Stacking layer relative to other modal surfaces. */
  zIndex?: DialogOverlayZIndex;
  /** Blurs the content behind the dialog. */
  withBackdropBlur?: boolean;
  /** Uses a darker scrim. */
  darkerBackground?: boolean;
  /** Animates the backdrop fade on open and close. Defaults to `true`. */
  animated?: boolean;
}

/** Backdrop rendered behind `Dialog.Content`. */
function DialogOverlay({
  zIndex = 'dialog',
  withBackdropBlur = true,
  darkerBackground = false,
  animated = true,
  className,
  ...props
}: DialogOverlayProps) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'fixed inset-0 ease-out',
        animated &&
          'data-[state=open]:animate-in data-[state=open]:duration-250 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:duration-180 data-[state=closed]:fade-out-0 data-[state=closed]:fill-mode-forwards has-[+[data-slot=dialog-content]_[data-slot=command-bar]]:animate-none! has-[+[data-slot=dialog-content]_[data-slot=command-bar]]:duration-0!',
        zIndex === 'drawer' ? 'z-[60]' : 'z-50',
        darkerBackground ? 'bg-black/45' : 'bg-black/25',
        withBackdropBlur && 'backdrop-blur-[2px]',
        className,
      )}
      {...props}
    />
  );
}

export interface DialogContentProps
  extends ComponentProps<typeof DialogPrimitive.Content> {
  /** `structured` lays out Header, Body, and Footer. `default` is the legacy shell. */
  variant?: DialogVariant;
  /** Structured only. `md` is 440px, `lg` is 640px (`40vh` min-h), `xl` is 800px (`60vh` min-h). */
  size?: DialogSize;
  /** Structured only. `regions` moves padding onto Header, Body, and Footer so dividers run full width. */
  contentPadding?: DialogContentPadding;
  /** Structured only. Gap between Header, Body, and Footer. */
  contentGap?: DialogContentGap;
  /** Renders the top-right close icon. Defaults to `true` for `default` and `false` for `structured`. */
  showCloseButton?: boolean;
  /** Set when children include `Dialog.Title` so no hidden screen-reader title is added. */
  hasAccessibleTitle?: boolean;
  /** Set when children include `Dialog.Description` so no hidden description is needed. */
  hasAccessibleDescription?: boolean;
  /** Render in the current DOM context instead of a portal. */
  disablePortal?: boolean;
  /** Do not render the dialog's own overlay. */
  hideOverlay?: boolean;
  /** Stacking layer. Use `drawer` to show the dialog above a drawer. */
  overlayZIndex?: DialogOverlayZIndex;
  /** Use a darker overlay background. */
  overlayDarkerBackground?: boolean;
  /** Additional CSS classes for the overlay. */
  overlayClassName?: string;
  /** Animates the dialog entrance and exit. Automatically disabled when hosting `CommandBar`. Defaults to `true`. */
  animated?: boolean;
}

/** Modal panel supporting structured regions (`Header`, `Body`, `Footer`) and legacy default shell. */
function DialogContent({
  variant = 'default',
  size = 'md',
  contentPadding = 'content',
  contentGap = 'default',
  showCloseButton,
  hasAccessibleTitle = false,
  hasAccessibleDescription = false,
  disablePortal = false,
  hideOverlay = false,
  overlayZIndex = 'dialog',
  overlayDarkerBackground = false,
  overlayClassName,
  animated = true,
  onOpenAutoFocus,
  className,
  children,
  ...props
}: DialogContentProps) {
  const isStructured = variant === 'structured';
  const resolvedShowCloseButton = showCloseButton ?? !isStructured;
  const zIndexClass = overlayZIndex === 'drawer' ? 'z-[60]' : 'z-50';
  const fallbackTitle = props['aria-label'] ?? 'Dialog';

  const handleOpenAutoFocus: DialogContentProps['onOpenAutoFocus'] = (event) => {
    const target = event.currentTarget as HTMLElement | null;
    if (!target?.querySelector('[autofocus], input[data-slot="command-bar-input"]')) {
      event.preventDefault();
    }
    onOpenAutoFocus?.(event);
  };

  const overlayNode = !hideOverlay ? (
    <DialogOverlay
      zIndex={overlayZIndex}
      darkerBackground={overlayDarkerBackground}
      animated={animated}
      className={overlayClassName}
    />
  ) : null;

  const contentNode = (
    <DialogPrimitive.Content
      data-slot="dialog-content"
      data-variant={variant}
      data-padding={isStructured ? contentPadding : undefined}
      aria-describedby={
        hasAccessibleDescription ? props['aria-describedby'] : undefined
      }
      onOpenAutoFocus={handleOpenAutoFocus}
      className={cn(
        'fixed top-1/2 left-1/2 flex max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 origin-center flex-col overflow-hidden rounded-[16px] bg-bg-primary text-text-primary shadow-high ease-out outline-none',
        animated &&
          'data-[state=open]:animate-in data-[state=open]:duration-250 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98] data-[state=closed]:animate-out data-[state=closed]:duration-180 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] data-[state=closed]:fill-mode-forwards motion-reduce:data-[state=open]:zoom-in-100 motion-reduce:data-[state=closed]:zoom-out-100 has-[[data-slot=command-bar]]:animate-none! has-[[data-slot=command-bar]]:duration-0!',
        zIndexClass,
        isStructured
          ? [
              STRUCTURED_SIZE_CLASSES[size],
              contentPadding === 'content' ? 'p-5' : 'p-0',
              contentPadding === 'content' && contentGap === 'default'
                ? 'gap-4'
                : 'gap-0',
            ]
          : 'min-w-[520px]',
        className,
      )}
      {...props}
    >
      {!hasAccessibleTitle ? (
        <DialogPrimitive.Title className="sr-only">
          {fallbackTitle}
        </DialogPrimitive.Title>
      ) : null}
      {children}
      {resolvedShowCloseButton ? (
        <DialogCloseButton className="absolute top-4 right-4 z-10" />
      ) : null}
    </DialogPrimitive.Content>
  );

  return (
    <DialogContentContext.Provider value={{ variant, contentPadding }}>
      {disablePortal ? (
        <>
          {overlayNode}
          {contentNode}
        </>
      ) : (
        <DialogPortal>
          {overlayNode}
          {contentNode}
        </DialogPortal>
      )}
    </DialogContentContext.Provider>
  );
}

export interface DialogHeaderProps extends ComponentProps<'div'> {
  /** Draws a border between the header and the body. */
  divider?: boolean;
}

/** Title row, close button, and description region of a structured Dialog. */
function DialogHeader({ divider = false, className, ...props }: DialogHeaderProps) {
  const { variant, contentPadding } = useContext(DialogContentContext);
  const isRegions = variant === 'structured' && contentPadding === 'regions';

  return (
    <div
      data-slot="dialog-header"
      className={cn(
        'flex shrink-0 flex-col gap-1',
        isRegions && 'px-5 pt-5 pb-4',
        divider && 'border-b border-border-gray',
        className,
      )}
      {...props}
    />
  );
}

export interface DialogBodyProps extends ComponentProps<'div'> {
  /** Fades the top and bottom edges while there is more content to scroll. Structured only. */
  scrollShadow?: boolean;
  /** Classes for the scrolling viewport when `scrollShadow` is set. */
  viewportClassName?: string;
  /** Adds vertical padding so focus rings are not clipped under `contentPadding="regions"`. */
  focusRingInset?: boolean;
}

/** Scrollable main region of a structured Dialog. */
function DialogBody({
  scrollShadow = false,
  viewportClassName,
  focusRingInset = true,
  className,
  children,
  ...props
}: DialogBodyProps) {
  const { variant, contentPadding } = useContext(DialogContentContext);
  const isRegions = variant === 'structured' && contentPadding === 'regions';
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 2);
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 2);
  }, []);

  useEffect(() => {
    if (!scrollShadow) return;
    const el = viewportRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    if (typeof ResizeObserver === 'undefined') {
      return () => el.removeEventListener('scroll', updateScrollState);
    }

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      observer.disconnect();
    };
  }, [scrollShadow, updateScrollState]);

  const regionPaddingClasses = cn(
    isRegions && 'px-5',
    isRegions && focusRingInset && 'py-4',
  );

  if (!scrollShadow) {
    return (
      <div
        data-slot="dialog-body"
        className={cn(
          'scrollbar-custom min-h-0 flex-1 overflow-y-auto',
          regionPaddingClasses,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      data-slot="dialog-body"
      className={cn('relative flex min-h-0 flex-1 flex-col overflow-hidden', className)}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 z-10 h-4 bg-gradient-to-b from-bg-primary to-transparent transition-opacity duration-150 ease-out',
          canScrollUp ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div
        ref={viewportRef}
        className={cn(
          'scrollbar-custom min-h-0 flex-1 overflow-y-auto',
          regionPaddingClasses,
          viewportClassName,
        )}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 z-10 h-4 bg-gradient-to-t from-bg-primary to-transparent transition-opacity duration-150 ease-out',
          canScrollDown ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  );
}

export interface DialogFooterProps extends ComponentProps<'div'> {
  /** Draws a border between the footer and the body. */
  divider?: boolean;
  /** Legacy prop rendering an automatic Close button when true. */
  showCloseButton?: boolean;
}

/** Right-aligned action row at the bottom of a structured Dialog. */
function DialogFooter({
  divider = false,
  showCloseButton = false,
  className,
  children,
  ...props
}: DialogFooterProps) {
  const { variant, contentPadding } = useContext(DialogContentContext);
  const isRegions = variant === 'structured' && contentPadding === 'regions';

  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'mt-auto flex shrink-0 items-center justify-end gap-2',
        isRegions && 'px-5 py-3.5',
        divider && 'border-t border-border-gray',
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton ? (
        <DialogPrimitive.Close asChild>
          <Button mode="secondary">Close</Button>
        </DialogPrimitive.Close>
      ) : null}
    </div>
  );
}

export type DialogTitleProps = ComponentProps<typeof DialogPrimitive.Title>;

/** Accessible dialog title element. */
function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-title-mini-semibold text-text-primary', className)}
      {...props}
    />
  );
}

export type DialogDescriptionProps = ComponentProps<typeof DialogPrimitive.Description>;

/** Accessible dialog description element. */
function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-body-small-regular text-text-secondary', className)}
      {...props}
    />
  );
}

export const Dialog = Object.assign(DialogRoot, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Close: DialogClose,
  CloseButton: DialogCloseButton,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
});

export {
  DialogBody,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
};

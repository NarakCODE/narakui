'use client';

import {
  useSyncExternalStore,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { ChevronLeft } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { Drawer as DrawerPrimitive } from 'vaul';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerRenderContext {
  /** Closes this specific drawer instance. */
  closeDrawer: () => void;
  /** Unique identifier of this drawer instance. */
  id: string;
}

export interface DrawerHeaderOptions {
  /** Title shown on the left of the header. */
  title?: ReactNode;
  /** Shows the close button on the right of the header. */
  showCloseButton?: boolean;
  /** Content placed after the title. */
  headerEnd?: ReactNode;
  /** Renders the title as a back button with a left chevron. */
  isBackButton?: boolean;
  /** Called by the back button. Closes the drawer when omitted. */
  onBack?: () => void;
  /** Shows the previous/next pager. Needs `currentIndex` and `totalItems`. */
  showNavigation?: boolean;
  /** 0-based index of the item shown in the pager. */
  currentIndex?: number;
  /** Number of items in the pager. */
  totalItems?: number;
  /** Text shown before the pager count. */
  labelPrefix?: string;
  /** Called by the pager's previous button. */
  onPrevious?: () => void;
  /** Called by the pager's next button. */
  onNext?: () => void;
  /** Replaces the whole header, including its container. */
  customRenderer?: (context: DrawerRenderContext) => ReactNode;
}

export interface DrawerFooterOptions {
  /** Footer rendered below the scroll area. Nothing renders without `customRenderer`. */
  customRenderer?: (context: DrawerRenderContext) => ReactNode;
}

export interface DrawerOptions {
  /** Unique identifier for the drawer. Pass it to `closeDrawer` and `updateDrawer`. */
  id: string;
  /** Content rendered inside the drawer's padded scroll area. */
  content?: ReactNode;
  /** Side of the screen where the drawer appears. */
  placement?: DrawerPlacement;
  /** Maximum width of the drawer in pixels. */
  width?: number;
  /** Header configuration. */
  header?: DrawerHeaderOptions;
  /** Removes the header bar, close button included, for content that renders its own header. */
  hideHeader?: boolean;
  /** Footer rendered below the scroll area. */
  footer?: DrawerFooterOptions;
  /** Renders the backdrop and makes the drawer modal. */
  withOverlay?: boolean;
  /** Whether to close the drawer when the Escape key is pressed. */
  closeOnEsc?: boolean;
  /** Whether to close the drawer when clicking outside. */
  closeOnOutsideClick?: boolean;
  /** Called before closing. Return `false` to keep the drawer open. */
  beforeClose?: () => boolean;
  /** Called when the drawer closes. May return a promise, which `closeDrawer` passes back. */
  onClose?: () => void | Promise<void>;
  /** Called when focus moves back after the drawer closes. */
  onCloseAutoFocus?: (event: Event) => void;
  /** Additional CSS classes for the drawer panel. */
  className?: string;
  /** Additional CSS classes for the padded content box. */
  contentClassName?: string;
  /** Additional CSS classes for the scroll area around the content. */
  scrollAreaClassName?: string;
}

export interface DrawerInstance extends DrawerOptions {
  /** Internal open flag used to play slide-out exit animations before removal. */
  isOpen: boolean;
}

export interface DrawerStoreState {
  /** Stack of mounted drawer instances in bottom-to-top order. */
  drawers: DrawerInstance[];
  /** Opens a new drawer or replaces an already-open drawer with the same `id`. */
  openDrawer: (options: DrawerOptions) => void;
  /** Closes the drawer matching `id` (or the topmost open drawer when `id` is omitted). */
  closeDrawer: (id?: string) => void | Promise<void>;
  /** Updates properties on an existing open drawer. */
  updateDrawer: (id: string, updates: Partial<Omit<DrawerOptions, 'id'>>) => void;
  /** Closes every open drawer in the stack. */
  closeAllDrawers: () => void;
}

type StoreListener = () => void;

const EXIT_ANIMATION_MS = 340;
const removalTimers = new Map<string, ReturnType<typeof setTimeout>>();
const listeners = new Set<StoreListener>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

let storeState: DrawerStoreState = {
  drawers: [],
  openDrawer: (options: DrawerOptions) => {
    const existingTimer = removalTimers.get(options.id);
    if (existingTimer) {
      clearTimeout(existingTimer);
      removalTimers.delete(options.id);
    }

    const nextInstance: DrawerInstance = {
      placement: 'right',
      width: 1100,
      hideHeader: false,
      withOverlay: true,
      closeOnEsc: true,
      closeOnOutsideClick: true,
      ...options,
      isOpen: true,
    };

    const existingIndex = storeState.drawers.findIndex((item) => item.id === options.id);
    const nextDrawers =
      existingIndex >= 0
        ? storeState.drawers.map((item, idx) => (idx === existingIndex ? nextInstance : item))
        : [...storeState.drawers, nextInstance];

    storeState = { ...storeState, drawers: nextDrawers };
    emitChange();
  },
  closeDrawer: (id?: string) => {
    const target =
      id !== undefined
        ? storeState.drawers.find((item) => item.id === id && item.isOpen)
        : [...storeState.drawers].reverse().find((item) => item.isOpen);

    if (!target) return undefined;
    if (target.beforeClose && target.beforeClose() === false) {
      return undefined;
    }

    const targetId = target.id;
    storeState = {
      ...storeState,
      drawers: storeState.drawers.map((item) =>
        item.id === targetId ? { ...item, isOpen: false } : item,
      ),
    };
    emitChange();

    const existingTimer = removalTimers.get(targetId);
    if (existingTimer) clearTimeout(existingTimer);

    const timer = setTimeout(() => {
      removalTimers.delete(targetId);
      storeState = {
        ...storeState,
        drawers: storeState.drawers.filter((item) => item.id !== targetId || item.isOpen),
      };
      emitChange();
    }, EXIT_ANIMATION_MS);
    removalTimers.set(targetId, timer);

    return target.onClose?.();
  },
  updateDrawer: (id: string, updates: Partial<Omit<DrawerOptions, 'id'>>) => {
    storeState = {
      ...storeState,
      drawers: storeState.drawers.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          ...updates,
          header: updates.header
            ? { ...item.header, ...updates.header }
            : item.header,
          footer: updates.footer
            ? { ...item.footer, ...updates.footer }
            : item.footer,
        };
      }),
    };
    emitChange();
  },
  closeAllDrawers: () => {
    const openIds = storeState.drawers.filter((item) => item.isOpen).map((item) => item.id);
    openIds.forEach((drawerId) => {
      storeState.closeDrawer(drawerId);
    });
  },
};

function subscribe(listener: StoreListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getState(): DrawerStoreState {
  return storeState;
}

function setState(
  updater:
    | Partial<DrawerStoreState>
    | ((current: DrawerStoreState) => Partial<DrawerStoreState>),
) {
  const partial = typeof updater === 'function' ? updater(storeState) : updater;
  storeState = { ...storeState, ...partial };
  emitChange();
}

export interface UseDrawerStore {
  (): DrawerStoreState;
  <T>(selector: (state: DrawerStoreState) => T): T;
  getState: () => DrawerStoreState;
  setState: typeof setState;
  subscribe: typeof subscribe;
}

/** Global Zustand-compatible drawer store hook and imperative API (`useDrawerStore.getState()`). */
export const useDrawerStore: UseDrawerStore = Object.assign(
  function useDrawerStoreHook<T = DrawerStoreState>(
    selector?: (state: DrawerStoreState) => T,
  ): T {
    const state = useSyncExternalStore(subscribe, getState, getState);
    return selector ? selector(state) : (state as unknown as T);
  },
  {
    getState,
    setState,
    subscribe,
  },
);

const PLACEMENT_CLASSES: Record<DrawerPlacement, string> = {
  right:
    'inset-y-3 right-3 w-[calc(100%-1.5rem)] data-[state=open]:[--tw-enter-translate-x:calc(100%_+_2rem)] data-[state=closed]:[--tw-exit-translate-x:calc(100%_+_2rem)]',
  left:
    'inset-y-3 left-3 w-[calc(100%-1.5rem)] data-[state=open]:[--tw-enter-translate-x:calc(-100%_-_2rem)] data-[state=closed]:[--tw-exit-translate-x:calc(-100%_-_2rem)]',
  top:
    'inset-x-3 top-3 max-h-[calc(85dvh-1.5rem)] data-[state=open]:[--tw-enter-translate-y:calc(-100%_-_2rem)] data-[state=closed]:[--tw-exit-translate-y:calc(-100%_-_2rem)]',
  bottom:
    'inset-x-3 bottom-3 max-h-[calc(85dvh-1.5rem)] data-[state=open]:[--tw-enter-translate-y:calc(100%_+_2rem)] data-[state=closed]:[--tw-exit-translate-y:calc(100%_+_2rem)]',
};

/** Renders a single active drawer instance from `useDrawerStore`. */
function DrawerSheetInstance({ drawer }: { drawer: DrawerInstance }) {
  const {
    id,
    isOpen,
    content,
    placement = 'right',
    width = 1100,
    header,
    hideHeader = false,
    footer,
    withOverlay = true,
    closeOnEsc = true,
    closeOnOutsideClick = true,
    onCloseAutoFocus,
    className,
    contentClassName,
    scrollAreaClassName,
  } = drawer;

  const handleRequestClose = () => {
    useDrawerStore.getState().closeDrawer(id);
  };

  const renderContext: DrawerRenderContext = {
    id,
    closeDrawer: handleRequestClose,
  };

  const isHorizontal = placement === 'left' || placement === 'right';
  const panelStyle: CSSProperties | undefined = isHorizontal
    ? { maxWidth: `${width}px` }
    : undefined;

  const showCloseBtn = header?.showCloseButton !== false;
  const showNav =
    Boolean(header?.showNavigation) &&
    typeof header?.currentIndex === 'number' &&
    typeof header?.totalItems === 'number';

  return (
    <DialogPrimitive.Root
      open={isOpen}
      modal={withOverlay}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleRequestClose();
      }}
    >
      <DialogPrimitive.Portal>
        {withOverlay ? (
          <DialogPrimitive.Overlay
            data-slot="drawer-overlay"
            className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[2px] ease-drawer data-[state=open]:animate-in data-[state=open]:duration-400 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:duration-280 data-[state=closed]:fade-out-0 data-[state=closed]:fill-mode-forwards motion-reduce:data-[state=open]:duration-200 motion-reduce:data-[state=closed]:duration-150"
          />
        ) : null}

        <DialogPrimitive.Content
          data-slot="drawer-content"
          data-placement={placement}
          aria-describedby={undefined}
          style={panelStyle}
          onCloseAutoFocus={onCloseAutoFocus}
          onEscapeKeyDown={(event) => {
            if (!closeOnEsc) {
              event.preventDefault();
            }
          }}
          onPointerDownOutside={(event) => {
            if (!closeOnOutsideClick) {
              event.preventDefault();
            }
          }}
          onInteractOutside={(event) => {
            if (!closeOnOutsideClick) {
              event.preventDefault();
            }
          }}
          className={cn(
            'fixed z-50 flex flex-col overflow-hidden rounded-[16px] bg-bg-primary text-text-primary shadow-high ease-drawer outline-none data-[state=open]:animate-in data-[state=open]:duration-400 data-[state=closed]:animate-out data-[state=closed]:duration-280 data-[state=closed]:fill-mode-forwards motion-reduce:data-[state=open]:duration-200 motion-reduce:data-[state=open]:fade-in-0 motion-reduce:data-[state=closed]:duration-150 motion-reduce:data-[state=closed]:fade-out-0',
            PLACEMENT_CLASSES[placement],
            'motion-reduce:data-[state=open]:[--tw-enter-translate-x:0px] motion-reduce:data-[state=open]:[--tw-enter-translate-y:0px] motion-reduce:data-[state=closed]:[--tw-exit-translate-x:0px] motion-reduce:data-[state=closed]:[--tw-exit-translate-y:0px]',
            className,
          )}
        >
          {hideHeader ? (
            <DialogPrimitive.Title className="sr-only">
              {typeof header?.title === 'string' ? header.title : 'Drawer'}
            </DialogPrimitive.Title>
          ) : header?.customRenderer ? (
            <>
              <DialogPrimitive.Title className="sr-only">
                {typeof header?.title === 'string' ? header.title : 'Drawer'}
              </DialogPrimitive.Title>
              {header.customRenderer(renderContext)}
            </>
          ) : (
            <div
              data-slot="drawer-header"
              className="flex shrink-0 items-center justify-between gap-3 border-b border-fill-quaternary px-5 py-4"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                {header?.isBackButton ? (
                  <button
                    type="button"
                    onClick={() =>
                      header.onBack ? header.onBack() : handleRequestClose()
                    }
                    className="group inline-flex min-w-0 cursor-pointer items-center gap-1.5 rounded-md py-0.5 pr-2 pl-1 text-left text-title-mini-semibold text-text-primary transition-[background-color,transform] duration-150 ease-out hover:bg-control-hover active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <ChevronLeft
                      aria-hidden="true"
                      className="size-4 shrink-0 text-text-secondary transition-transform duration-150 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-x-0.5 motion-reduce:transition-none"
                    />
                    <DialogPrimitive.Title className="truncate text-title-mini-semibold text-text-primary">
                      {header?.title ?? 'Drawer'}
                    </DialogPrimitive.Title>
                  </button>
                ) : (
                  <DialogPrimitive.Title className="truncate text-title-mini-semibold text-text-primary">
                    {header?.title ?? 'Drawer'}
                  </DialogPrimitive.Title>
                )}
                {header?.headerEnd ? (
                  <div className="flex shrink-0 items-center">{header.headerEnd}</div>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                {showNav ? (
                  <div className="flex items-center gap-1">
                    <span className="px-1.5 text-body-mini-regular text-text-secondary tabular-nums">
                      {header?.labelPrefix ? `${header.labelPrefix} ` : ''}
                      {(header?.currentIndex ?? 0) + 1} / {header?.totalItems}
                    </span>
                    <Button
                      mode="ghost"
                      size="small"
                      iconStart="chevron-left"
                      aria-label="Previous item"
                      disabled={(header?.currentIndex ?? 0) <= 0}
                      onClick={header?.onPrevious}
                    />
                    <Button
                      mode="ghost"
                      size="small"
                      iconStart="chevron-right"
                      aria-label="Next item"
                      disabled={
                        (header?.currentIndex ?? 0) >= (header?.totalItems ?? 1) - 1
                      }
                      onClick={header?.onNext}
                    />
                  </div>
                ) : null}

                {showCloseBtn ? (
                  <Button
                    mode="ghost"
                    size="small"
                    iconStart="x"
                    aria-label="Close drawer"
                    onClick={handleRequestClose}
                  />
                ) : null}
              </div>
            </div>
          )}

          <div
            data-slot="drawer-scroll-area"
            className={cn(
              'scrollbar-custom min-h-0 flex-1 overflow-y-auto',
              scrollAreaClassName,
            )}
          >
            <div
              data-slot="drawer-body"
              className={cn('flex flex-col p-5', contentClassName)}
            >
              {content}
            </div>
          </div>

          {footer?.customRenderer ? (
            <div data-slot="drawer-footer" className="shrink-0">
              {footer.customRenderer(renderContext)}
            </div>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/** Root provider rendering all active drawers managed by `useDrawerStore`. Mount once near the app root. */
function DrawerProvider() {
  const drawers = useDrawerStore((state) => state.drawers);

  if (drawers.length === 0) return null;

  return (
    <>
      {drawers.map((drawer) => (
        <DrawerSheetInstance key={drawer.id} drawer={drawer} />
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Legacy declarative Vaul primitives preserved for compatibility             */
/* -------------------------------------------------------------------------- */

function Drawer({ ...props }: ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({ ...props }: ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({ ...props }: ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({ ...props }: ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/25 backdrop-blur-[2px] ease-drawer data-[state=open]:animate-in data-[state=open]:duration-400 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:duration-280 data-[state=closed]:fade-out-0 data-[state=closed]:fill-mode-forwards motion-reduce:data-[state=open]:duration-200 motion-reduce:data-[state=closed]:duration-150',
        className,
      )}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          'group/drawer-content fixed z-50 flex h-auto flex-col overflow-hidden rounded-[16px] bg-bg-primary text-body-small-regular text-text-primary shadow-high data-[vaul-drawer-direction=bottom]:inset-x-3 data-[vaul-drawer-direction=bottom]:bottom-3 data-[vaul-drawer-direction=left]:inset-y-3 data-[vaul-drawer-direction=left]:left-3 data-[vaul-drawer-direction=right]:inset-y-3 data-[vaul-drawer-direction=right]:right-3 data-[vaul-drawer-direction=top]:inset-x-3 data-[vaul-drawer-direction=top]:top-3',
          className,
        )}
        {...props}
      >
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn('flex flex-col gap-1 p-5', className)}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn('mt-auto flex flex-col gap-2 p-5', className)}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn('text-title-mini-semibold text-text-primary', className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn('text-body-small-regular text-text-secondary', className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerProvider,
  DrawerTitle,
  DrawerTrigger,
};

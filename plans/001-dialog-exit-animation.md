# 001 — Fix Dialog exit animation unmounting and timing

- **Status**: DONE
- **Commit**: 021a99b
- **Severity**: HIGH
- **Category**: Interruptibility & Easing/Duration
- **Estimated scope**: 1 file (`components/ui/dialog.tsx`), ~35 lines

## Problem

When `Dialog` closes (`open` transitions to `false`), `DialogOverlay` and `DialogContent` disappear in `0ms` without playing their `data-[state=closed]:animate-out` exit animations.

In `components/ui/dialog.tsx:184-235`, `DialogContent` wraps `<DialogOverlay />` and `<DialogPrimitive.Content />` inside `<DialogContentContext.Provider>` and passes that single `innerTree` element into `<DialogPortal>`:

```tsx
/* components/ui/dialog.tsx:184-235 — current */
  const innerTree = (
    <DialogContentContext.Provider value={{ variant, contentPadding }}>
      {!hideOverlay ? (
        <DialogOverlay
          zIndex={overlayZIndex}
          darkerBackground={overlayDarkerBackground}
          className={overlayClassName}
        />
      ) : null}
      <DialogPrimitive.Content
        data-slot="dialog-content"
        data-variant={variant}
        data-padding={isStructured ? contentPadding : undefined}
        aria-describedby={
          hasAccessibleDescription ? props['aria-describedby'] : undefined
        }
        onOpenAutoFocus={handleOpenAutoFocus}
        className={cn(
          'fixed top-1/2 left-1/2 flex max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[16px] bg-bg-primary text-text-primary shadow-high outline-none duration-150 ease-out motion-reduce:animate-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98]',
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
    </DialogContentContext.Provider>
  );

  if (disablePortal) {
    return innerTree;
  }

  return <DialogPortal>{innerTree}</DialogPortal>;
```

Why this breaks the exit animation:
1. `@radix-ui/react-dialog`'s `DialogPortal` iterates its direct `children` with `React.Children.map(children, (child) => <Presence present={forceMount || context.open}><PortalPrimitive asChild>{child}</PortalPrimitive></Presence>)`.
2. `<Presence>` clones a DOM `ref` onto each direct child of `DialogPortal` so it can read `getComputedStyle(node).animationName` when `present` becomes `false` and suspend unmounting until `animationend`.
3. Because `DialogPortal`'s direct child is `<DialogContentContext.Provider>` (which is not a DOM element and does not forward `ref`), `Presence`'s `stylesRef.current` is `null` (`currentAnimationName === 'none'`). On close, `DialogPortal` immediately unmounts the entire portal on frame 0 before `DialogOverlay` or `DialogPrimitive.Content` can animate out.
4. Additionally, `components/ui/dialog.tsx:113` and `components/ui/dialog.tsx:202` use symmetric `duration-150` (`150ms`, below the `200–500ms` modal entrance budget) and `motion-reduce:animate-none` (which removes the opacity crossfade instead of only removing the scale movement).

## Target

1. Move `<DialogContentContext.Provider>` **outside** `<DialogPortal>` and pass `{overlayNode}` and `{contentNode}` as direct children of `<DialogPortal>` (never wrapped in an intermediate `<Fragment>` or `<Provider>` inside `<DialogPortal>`).
2. Use asymmetric modal timing (`data-[state=open]:duration-250 data-[state=closed]:duration-180`) with `ease-out` (`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`) on both `DialogOverlay` and `DialogPrimitive.Content`.
3. Under `prefers-reduced-motion: reduce`, keep the opacity fade (`fade-in-0` / `fade-out-0`) on both `DialogOverlay` and `DialogPrimitive.Content` while dropping the scale zoom on `DialogPrimitive.Content` (`motion-reduce:data-[state=open]:zoom-in-100 motion-reduce:data-[state=closed]:zoom-out-100`).

```tsx
/* components/ui/dialog.tsx:102-122 — target */
function DialogOverlay({
  zIndex = 'dialog',
  withBackdropBlur = true,
  darkerBackground = false,
  className,
  ...props
}: DialogOverlayProps) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'fixed inset-0 ease-out data-[state=open]:animate-in data-[state=open]:duration-250 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:duration-180 data-[state=closed]:fade-out-0',
        zIndex === 'drawer' ? 'z-[60]' : 'z-50',
        darkerBackground ? 'bg-black/45' : 'bg-black/25',
        withBackdropBlur && 'backdrop-blur-[2px]',
        className,
      )}
      {...props}
    />
  );
}
```

```tsx
/* components/ui/dialog.tsx:184-245 — target */
  const overlayNode = !hideOverlay ? (
    <DialogOverlay
      zIndex={overlayZIndex}
      darkerBackground={overlayDarkerBackground}
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
        'fixed top-1/2 left-1/2 flex max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 origin-center flex-col overflow-hidden rounded-[16px] bg-bg-primary text-text-primary shadow-high ease-out outline-none data-[state=open]:animate-in data-[state=open]:duration-250 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98] data-[state=closed]:animate-out data-[state=closed]:duration-180 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] motion-reduce:data-[state=open]:zoom-in-100 motion-reduce:data-[state=closed]:zoom-out-100',
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
```

## Repo conventions to follow

- Easing tokens live in `app/design-system.css:240` (`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`), mapped in Tailwind v4 to `ease-out`.
- `cn` must be imported from `@/lib/utils` (`DESIGN.md` › Typography).
- Exemplar for direct children inside `DialogPrimitive.Portal`: `components/ui/confirm-dialog.tsx:100-182` places `DialogPrimitive.Overlay` and `DialogPrimitive.Content` as direct children of `DialogPrimitive.Portal` so Radix `Presence` receives both DOM refs.

## Steps

1. In `components/ui/dialog.tsx:102-122`, update `DialogOverlay` class names to replace `'fixed inset-0 duration-150 ease-out motion-reduce:animate-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0'` with `'fixed inset-0 ease-out data-[state=open]:animate-in data-[state=open]:duration-250 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:duration-180 data-[state=closed]:fade-out-0'`.
2. In `components/ui/dialog.tsx:184-235`, split `innerTree` into `overlayNode` and `contentNode`, wrap `<DialogContentContext.Provider>` around the outer return, and pass `{overlayNode}` and `{contentNode}` directly inside `<DialogPortal>` when `disablePortal` is `false`.
3. In `components/ui/dialog.tsx:201-203`, update `DialogPrimitive.Content` animation classes to use `origin-center ease-out data-[state=open]:animate-in data-[state=open]:duration-250 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98] data-[state=closed]:animate-out data-[state=closed]:duration-180 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] motion-reduce:data-[state=open]:zoom-in-100 motion-reduce:data-[state=closed]:zoom-out-100`.

## Boundaries

- Do NOT touch any file other than `components/ui/dialog.tsx`.
- Do NOT wrap `{overlayNode}` and `{contentNode}` in a `<React.Fragment>` inside `<DialogPortal>` (`React.Children.map` does not unwrap fragments, which would re-break Radix `Presence` ref attachment).
- Do NOT add new dependencies.
- If a step doesn't match the code you find (drift since commit `021a99b`), STOP and report instead of improvising.

## Verification

- **Mechanical**:
  - `npm run types:check` (must exit 0)
  - `npm run lint:design` (must exit 0)
  - `npm run build` (must exit 0)
- **Feel check**:
  - Open any `Dialog` example, click the close button, Cancel button, backdrop, or press `Escape`, and confirm both the backdrop and panel smoothly fade/scale out over `180ms` instead of vanishing instantly.
  - In Chrome DevTools Animations panel, set playback to `25%` speed and confirm `DialogOverlay` (`exit` keyframe, `180ms`) and `DialogContent` (`exit` keyframe, `180ms`, `scale(1) → scale(0.98)` + `opacity: 1 → 0`) play in sync before the portal unmounts from the DOM.
  - Toggle `prefers-reduced-motion: reduce` in DevTools Rendering panel and confirm open/close still crossfades opacity without scaling.
- **Done when**: `Dialog` animates both in (`250ms`) and out (`180ms`) on close before unmounting, and all mechanical checks pass.

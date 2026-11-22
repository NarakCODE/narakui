# Rakfound Design System Rules

## Surfaces

- **Use Rakfound surface and shadow tokens from `app/design-system.css` (`bg-bg-primary`, `bg-bg-secondary`, `bg-bg-tertiary`, `border-border-gray` / `border-border`, `shadow-low`, `shadow-medium`, `shadow-high`) instead of stock shadcn utility pairings.**
  Why: Ensures light and warm dark mode surfaces (`#ffffff` / `#171615`), ring-inset shadows (`--color-shadow-ring-2`), and borders stay visually consistent across all components.
  <!-- 2026-11-22: "ensure the @[components/ui/button.tsx] follow the design system?" / "Okay You are a frontend engineer, I want you to restructure shadcn component to the design system that I attach to." -->

- **Inside `ComponentPreview` (`components/component-preview.tsx`), `<Tab value="Preview">` must use `className="overflow-hidden p-0"` and `previewStage` must omit `border` and `rounded-*` whenever the `Code` tab is present.**
  Why: Fumadocs `<Tab>` (`TabsContent`) applies `p-4 bg-fd-background` and an outer border by default, which creates a `16px` dark gap and double border around a bordered inner preview stage.
  <!-- 2026-11-22: "I see the gap black around the component block" -->

## Color

- **Buttons and interactive controls must use Rakfound control and gradient tokens (`bg-primary bg-button-primary shadow-button-primary`, `bg-pos-action bg-button-pos-action shadow-button-pos-action`, `shadow-button-secondary`, `bg-control-bg`, `hover:bg-control-hover`, `aria-expanded:bg-control-selected`, `text-text-primary`, `text-text-secondary`).**
  Why: Stock shadcn classes (`hover:bg-primary/80`, `bg-background hover:bg-muted`, `dark:bg-input/30`) miss the tactile top-highlight gradients (`--background-image-button-primary`), inset ring shadows (`--shadow-button-primary`), and warm dark control surfaces (`#252423` / `#31302e`).
  <!-- 2026-11-22: "ensure the @[components/ui/button.tsx] follow the design system?" -->

- **Semantic status surfaces (`Banner`, alerts, badges) must map `green`, `blue`, `orange`, `red`, `grey`, and `white` to `bg-bg-{green,blue,orange,red}`, `border-{green,blue,orange,red}-border`, `bg-bg-secondary` / `bg-bg-primary` with `border-border-gray`, and `text-text-{green,blue,orange,red}`.**
  Why: Keeps surface fills, borders, and decoupled icon/title accents (`iconColor`, `coloredTitle`) balanced in both light and warm dark themes.
  <!-- 2026-11-22: "/emil-design-eng build custom banner component." -->

## Typography

- **Always use self-hosted `Geist Rounded` (`next/font/local` → `--font-geist-rounded` → `--font-sans`, `--font-heading`, `--font-brand`) paired with `Geist_Mono` (`--font-geist-mono` → `--font-mono`), and remove any `Inter` font or duplicate `:root` / `.dark` / `@theme` blocks injected by `shadcn` CLI commands from `app/layout.tsx` and `app/global.css`.**
  Why: `app/design-system.css` is the single source of truth for Rakfound theme tokens and typography; `shadcn init` or `shadcn add` otherwise overwrites `--font-sans` with `Inter` and clobbers semantic colors.
  <!-- 2026-11-22: "Use Geist Rounded as the main interface font in this project... For Next.js, use next/font/local instead." -->

- **Always import `cn` from `@/lib/utils` (or `@/lib/cn`), never from `"cn"` directly.**
  Why: Default `"cn"` treats Rakfound's custom `@utility` typography classes (`text-body-*`, `text-title-*`, `text-paragraph-*`) as `text-color` utilities and strips them when merged with `text-text-*` color tokens (and strips `bg-primary` when merged with `bg-button-primary`). `lib/utils.ts` configures `createCn` from `cn/config` with all custom `font-size`, `bg-image`, and `shadow` groups.
  <!-- 2026-11-22: "I spot the issue of banner icon and title label not align center correctly." -->

- **When pairing an icon (`size-4` / `16px`) with a `text-body-small-*` label (`13px` font / `18px` line-height), wrap the icon in `flex h-[18px] shrink-0 items-center justify-center [&>svg]:size-4` instead of using pixel margin hacks (`mt-[1px]`).**
  Why: Matching the icon container height (`18px`) to the text's `18px` line-height locks their horizontal centerlines in both single-line (`items-center`) and multi-line (`items-start`) layouts without subpixel drift.
  <!-- 2026-11-22: "I spot the issue of banner icon and title label not align center correctly." -->

## Spacing & layout

- **Match concentric corner radii (`R_outer = R_inner + padding`) on control bars: use `rounded-lg` (`10px`, `var(--radius)`) on outer containers with uniform `p-1` (`4px` x and y padding) and `rounded-sm` (`6px`, `var(--radius-sm)`) on inner `size-7` (`28px`) controls so the controls have equal `4px` clearance on all four sides and set the `36px` bar height naturally without hardcoding `h-10`.**
  Why: Asymmetric `px-2 py-1` makes horizontal inset (`8px`) twice as wide as vertical inset (`4px`); uniform `p-1` (`4px`) keeps outer curves and inner buttons concentric (`10px = 6px + 4px`) on both axes.
  <!-- 2026-11-22: "the audio bar component padding x and y seem not consistency. the x padding seem bigger." -->

- **Name component example files `components/examples/<component>-example.tsx` (exporting `<Component>Example`), and render components directly inside `<ComponentPreview file="...">` without adding an extra card border/shadow wrapper or passing a `title` prop to `ComponentPreview`.**
  Why: `ComponentPreview` already provides the bordered `bg-bg-primary` preview stage; adding another card inside it duplicates borders and padding.
  <!-- 2026-11-22: Silent edit in components/examples/active-bar-example.tsx and content/docs/components/active-bar.mdx -->

## Motion

- **For sliding highlight indicators (`ActiveBar`), use `rounded-md bg-fill-quinary` and drive position via CSS custom properties (`--top`, `--left-offset`, `--right-offset`, `--item-height`) with `translate-y-(--top)` and `transition-[translate] duration-200 ease-in-out motion-reduce:transition-none`.**
  Why: `--fill-quinary` (`#f0f0f0` light / `#2b2a28` dark) and `rounded-md` (`8px`) match `32px` (`h-8`) navigation items, and CSS custom properties let Tailwind utilities control offset and translation cleanly while respecting `prefers-reduced-motion`.
  <!-- 2026-11-22: Silent edit in components/ui/active-bar.tsx -->

- **Interactive control buttons must use explicit property transitions (`transition-[transform,background-color,color] duration-150 ease-out motion-reduce:transition-none`) and tactile press feedback (`active:scale-[0.97]`), never `transition-all`.**
  Why: Uses `--ease-out` (`cubic-bezier(0.23, 1, 0.32, 1)`) under 160ms for responsive press feedback without animating unintended layout properties.
  <!-- 2026-11-22: "/emil-design-eng audio player component follow this design system" / "/emil-design-eng build custom banner component." -->

- **Inside any Radix `Portal` (`Dialog`, `ConfirmDialog`, `Drawer`, `Popover`, `DropdownMenu`, `ContextMenu`, `Combobox`, `HoverCard`, `Tooltip`), pass the animated `Overlay` and `Content` primitives as direct JSX children of `<Portal>` — never wrap them in an intermediate `<Context.Provider>`, `<React.Fragment>`, or custom wrapper component inside `<Portal>`.**
  Why: Radix `Portal` maps over its direct children and wraps each in `<Presence>`, which clones a DOM `ref` onto its direct child to read `getComputedStyle(node).animationName` on close (`present = false`). An intermediate `<Provider>` or `<Fragment>` drops the `ref` (`stylesRef.current === null`), causing Radix to unmount the portal in `0ms` on frame 0 and skip `data-[state=closed]:animate-out`.
  <!-- 2026-11-22: "The dialog have motion in but does not have motion out when close" / "Execute 001" -->

- **All trigger-activated overlays must use `ease-out` (`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`) with asymmetric enter/exit durations (exit faster than enter) and `0.98` scale (`zoom-in-[0.98]` / `zoom-out-[0.98]`): modals and drawers (`Dialog`, `ConfirmDialog`, `Drawer`) use `data-[state=open]:duration-250 data-[state=closed]:duration-180` synced across `Overlay` and `Content` (`origin-center` on modals); trigger-anchored popovers and menus (`Popover`, `DropdownMenu`, `ContextMenu`, `Combobox`, `HoverCard`) use `origin-(--radix-*-content-transform-origin)` with `data-[state=open]:duration-180 data-[state=closed]:duration-130`; tooltips (`Tooltip`) use `origin-(--radix-tooltip-content-transform-origin)` with `data-[state=delayed-open]:duration-150 data-[state=closed]:duration-100`.**
  Why: `--ease-out` front-loads ~80% of travel into the first 35% of the duration (and frame 0 pays portal + `backdrop-filter` mount cost), so `250ms` on modals (`180ms` on menus/popovers) gives the entrance enough frames to register while a shorter exit (`180ms` / `130ms`) snaps dismissal out of the user's way.
  <!-- 2026-11-22: "/choreograph should i make the motion a bit slower?" / "/learn-taste review the dialog animate, and we gonna apply to all components that triggering" -->

- **On triggered overlays using `animate-in` / `animate-out`, never use `motion-reduce:animate-none`; keep the `fade-in-0` / `fade-out-0` opacity crossfade and neutralize only the transform movement under reduced motion (`motion-reduce:data-[state=open]:zoom-in-100 motion-reduce:data-[state=closed]:zoom-out-100`).**
  Why: `motion-reduce:animate-none` strips opacity transitions and causes overlays to teleport; neutralizing only the scale/translate movement honors `prefers-reduced-motion: reduce` while keeping state changes legible.
  <!-- 2026-11-22: "Execute 001" / "/learn-taste review the dialog animate, and we gonna apply to all components that triggering" -->

## Interaction

- **Never invent or guess a Rakfound component's API, variants, or architecture from placeholder `.mdx` descriptions before the user provides its Palermo / Rakfound design system source.**
  Why: Placeholder `.mdx` stubs only hold temporary one-line descriptions; each component must match the exact props, subcomponents, and behaviors from the provided design system specification.
  <!-- 2026-11-22: "I will give you the source." -->

## Copy

- **Never include `## Install` / `## Installation` sections or CLI/package installation commands (`pnpm dlx shadcn...`, `npm i...`) in `content/docs/components/*.mdx`.**
  Why: Components are documented and demoed internally first and are not public for CLI installation yet.
  <!-- 2026-11-22: "ensure this components will not public to share the command install yet okay? just docs them and demo firsst" -->

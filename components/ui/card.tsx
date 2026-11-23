'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ComponentProps,
  type CSSProperties,
  type PointerEvent,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { GlassLayer, type GlassOptics } from '@/components/liquid-glass/glass-layer';
import { cn } from '@/lib/utils';

export type CardVariant = 'default' | 'liquid-glass';
export type CardBackground = 'primary' | 'secondary' | 'tertiary' | 'quaternary';
export type CardPadding = 'none' | 'sm' | 'md';
export type CardMaterial = 'frosted' | 'clear' | 'tinted' | 'solid';
export type { GlassOptics as CardOptics };

const BACKGROUND_TINT_DEFAULTS: Record<CardBackground, number> = {
  primary: 0.74,
  secondary: 0.8,
  tertiary: 0.86,
  quaternary: 0.92,
};

const CLEAR_TINT_DEFAULTS: Record<CardBackground, number> = {
  primary: 0.26,
  secondary: 0.34,
  tertiary: 0.42,
  quaternary: 0.5,
};

const REFRACT_OPTICS_BASE: GlassOptics = {
  bendMode: 'radial',
  borderColor: '#ffffff',
  borderAlpha: 0.58,
  borderWidth: 1.25,
  frostMix: 1,
  frostEdge: 1,
  saturation: 1.35,
  refraction: 1,
  bendDepth: 1.35,
  bendCurve: 9.75,
  dispersion: 0.08,
  magnify: 0,
  light: 0.32,
  rim: 0.55,
  fresnel: 0.4,
  inner: 0.35,
  reflection: 0.45,
  caustic: 0.35,
  shadow: 0,
};

const cardVariants = cva(
  'group/card relative isolate rounded-xl text-text-primary',
  {
    variants: {
      variant: {
        default: 'shadow-medium',
        'liquid-glass': 'card-glass',
      },
      background: {
        primary: '',
        secondary: '',
        tertiary: '',
        quaternary: '',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
      },
      interactive: {
        false: '',
        true: 'cursor-pointer transition-[transform,background-color] duration-150 ease-out active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-base motion-reduce:transition-[background-color,opacity] motion-reduce:active:scale-100',
      },
    },
    compoundVariants: [
      { variant: 'default', background: 'primary', className: 'bg-bg-primary' },
      { variant: 'default', background: 'secondary', className: 'bg-bg-secondary' },
      { variant: 'default', background: 'tertiary', className: 'bg-bg-tertiary' },
      { variant: 'default', background: 'quaternary', className: 'bg-bg-quaternary' },
    ],
    defaultVariants: {
      variant: 'default',
      background: 'primary',
      padding: 'none',
      interactive: false,
    },
  },
);

export interface CardProps
  extends ComponentProps<'div'>,
    VariantProps<typeof cardVariants> {
  /** Surface variant: matte NarakUI surface (`default`) or WebGL2/CSS liquid glass (`liquid-glass`). @default 'default' */
  variant?: CardVariant;
  /** Liquid glass material surface treatment. Defaults to `'frosted'` for `liquid-glass` and `'solid'` for `default`. */
  material?: CardMaterial;
  /** Backdrop frost blur in pixels (`>= 0`). Defaults to `6` (`frosted`) / `4` (`clear`) with WebGL refraction, or `14` / `6` / `10` in CSS mode. */
  blur?: number;
  /** Backdrop tint opacity (`0` to `1`). Overrides the background tier opacity when set. */
  tint?: number;
  /** Enables subtle physical press feedback and hover rim response. @default false */
  interactive?: boolean;
  /** Enables cursor-tracking specular rim gleam on fine pointers. Defaults to `interactive`. */
  cursorLight?: boolean;
  /** Enables real-time WebGL2 optical rim refraction powered by `GlassLayer`. Defaults to `true` when `variant="liquid-glass"`. */
  refract?: boolean;
  /** Repaints `refract` backdrop every frame when animated content moves behind the card. @default false */
  live?: boolean;
  /** CSS selector of the ancestor whose content is refracted when `refract` is enabled (default: the page). */
  backdrop?: string;
  /** Fine-tuned WebGL2 optical refraction parameters when `refract` is enabled. */
  optics?: GlassOptics;
}

/** Surface container supporting NarakUI matte tiers (`default`) and WebGL2/CSS liquid glass (`liquid-glass`). */
function Card({
  ref,
  className,
  style,
  variant,
  background = 'primary',
  padding = 'none',
  material,
  interactive = false,
  cursorLight,
  blur,
  tint,
  refract,
  live = false,
  backdrop,
  optics,
  children,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  ...props
}: CardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const spotRef = useRef<HTMLSpanElement | null>(null);
  const pointerStateRef = useRef({
    active: false,
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    rafId: null as number | null,
    lastTime: 0,
  });

  const resolvedBackground: CardBackground = background ?? 'primary';
  const resolvedPadding: CardPadding = padding ?? 'none';
  const isLiquidGlass =
    variant === 'liquid-glass' ||
    Boolean(refract) ||
    (variant !== 'default' && material !== undefined && material !== 'solid');
  const resolvedVariant: CardVariant = isLiquidGlass ? 'liquid-glass' : 'default';
  const resolvedMaterial: CardMaterial =
    material ?? (isLiquidGlass ? 'frosted' : 'solid');
  const resolvedInteractive = Boolean(interactive);
  const resolvedCursorLight = cursorLight ?? resolvedInteractive;
  const useWebGlRefract =
    isLiquidGlass &&
    (refract ?? variant === 'liquid-glass') &&
    resolvedMaterial !== 'solid';
  const useCssCursorSpot =
    isLiquidGlass &&
    resolvedCursorLight &&
    !useWebGlRefract &&
    resolvedMaterial !== 'solid';

  const assignRef = useCallback(
    (node: HTMLDivElement | null) => {
      cardRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  useEffect(() => {
    const state = pointerStateRef.current;
    if (!useCssCursorSpot) {
      if (state.rafId !== null) {
        cancelAnimationFrame(state.rafId);
        state.rafId = null;
      }
      state.active = false;
      state.lastTime = 0;
      if (spotRef.current) {
        spotRef.current.style.opacity = '0';
      }
      return;
    }

    return () => {
      if (state.rafId !== null) {
        cancelAnimationFrame(state.rafId);
        state.rafId = null;
      }
    };
  }, [useCssCursorSpot]);

  const canTrackFinePointer = () => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  };

  const scheduleSpotFrame = () => {
    const state = pointerStateRef.current;
    if (state.rafId !== null) return;

    const tick = (now: number) => {
      const spot = spotRef.current;
      if (!spot) {
        state.rafId = null;
        state.lastTime = 0;
        return;
      }

      const dt = state.lastTime ? Math.min((now - state.lastTime) / 1000, 1 / 30) : 1 / 60;
      state.lastTime = now;
      const follow = 1 - Math.exp(-dt * 24);

      state.currentX += (state.targetX - state.currentX) * follow;
      state.currentY += (state.targetY - state.currentY) * follow;

      spot.style.transform = `translate3d(${state.currentX.toFixed(1)}px, ${state.currentY.toFixed(1)}px, 0)`;

      const dx = Math.abs(state.targetX - state.currentX);
      const dy = Math.abs(state.targetY - state.currentY);
      if (dx > 0.25 || dy > 0.25) {
        state.rafId = requestAnimationFrame(tick);
      } else {
        state.currentX = state.targetX;
        state.currentY = state.targetY;
        spot.style.transform = `translate3d(${state.currentX.toFixed(1)}px, ${state.currentY.toFixed(1)}px, 0)`;
        state.rafId = null;
        state.lastTime = 0;
      }
    };

    state.rafId = requestAnimationFrame(tick);
  };

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    onPointerEnter?.(event);
    if (!useCssCursorSpot || event.pointerType === 'touch' || !canTrackFinePointer()) return;

    const card = cardRef.current;
    const spot = spotRef.current;
    if (!card || !spot) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const state = pointerStateRef.current;

    if (!state.active) {
      state.currentX = x;
      state.currentY = y;
      spot.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }

    state.targetX = x;
    state.targetY = y;
    state.active = true;
    spot.style.opacity = '1';
    scheduleSpotFrame();
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    if (!useCssCursorSpot || event.pointerType === 'touch' || !canTrackFinePointer()) return;

    const card = cardRef.current;
    const spot = spotRef.current;
    if (!card || !spot) return;

    const rect = card.getBoundingClientRect();
    const state = pointerStateRef.current;
    state.targetX = event.clientX - rect.left;
    state.targetY = event.clientY - rect.top;

    if (!state.active) {
      state.currentX = state.targetX;
      state.currentY = state.targetY;
      spot.style.transform = `translate3d(${state.currentX.toFixed(1)}px, ${state.currentY.toFixed(1)}px, 0)`;
      state.active = true;
      spot.style.opacity = '1';
    }

    scheduleSpotFrame();
  };

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event);
    if (!useCssCursorSpot) return;

    const state = pointerStateRef.current;
    state.active = false;
    if (spotRef.current) {
      spotRef.current.style.opacity = '0';
    }
  };

  const mergedOptics = useMemo<GlassOptics>(
    () => ({
      ...REFRACT_OPTICS_BASE,
      cursorLight: resolvedCursorLight,
      ...optics,
      dark: {
        borderAlpha: optics?.borderAlpha ?? 0.24,
        ...optics?.dark,
      },
    }),
    [optics, resolvedCursorLight],
  );

  const customGlassStyle: CSSProperties | undefined = useMemo(() => {
    if (!isLiquidGlass || useWebGlRefract || (blur === undefined && tint === undefined)) {
      return undefined;
    }
    const next: Record<string, string> = {};
    if (blur !== undefined && resolvedMaterial !== 'solid') {
      next['--card-glass-blur'] = `${Math.max(0, blur)}px`;
    }
    if (tint !== undefined && resolvedMaterial !== 'solid') {
      next['--card-glass-tint'] = `${Math.round(Math.min(1, Math.max(0, tint)) * 100)}%`;
    }
    return next as CSSProperties;
  }, [blur, tint, isLiquidGlass, resolvedMaterial, useWebGlRefract]);

  const resolvedGlassTint =
    tint !== undefined
      ? Math.min(1, Math.max(0, tint))
      : resolvedMaterial === 'clear'
        ? CLEAR_TINT_DEFAULTS[resolvedBackground]
        : BACKGROUND_TINT_DEFAULTS[resolvedBackground];

  const resolvedGlassBlur =
    blur !== undefined ? Math.max(0, blur) : resolvedMaterial === 'clear' ? 4 : 6;

  return (
    <div
      ref={assignRef}
      data-slot="card"
      data-variant={resolvedVariant}
      data-background={resolvedBackground}
      data-padding={resolvedPadding}
      data-material={resolvedMaterial}
      data-interactive={resolvedInteractive || undefined}
      data-refract={useWebGlRefract || undefined}
      data-glass-host={useWebGlRefract ? '' : undefined}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        cardVariants({
          variant: resolvedVariant,
          background: resolvedBackground,
          padding: resolvedPadding,
          interactive: resolvedInteractive,
        }),
        !useWebGlRefract && 'overflow-hidden',
        className,
      )}
      style={customGlassStyle || style ? { ...customGlassStyle, ...style } : undefined}
      {...props}
    >
      {useWebGlRefract ? (
        <>
          <GlassLayer
            material={resolvedMaterial === 'tinted' ? 'tinted' : 'clear'}
            tint={resolvedGlassTint}
            blur={resolvedGlassBlur}
            backdrop={backdrop}
            live={live}
            swell={false}
            optics={mergedOptics}
          />
          <span
            aria-hidden="true"
            data-card-chrome="true"
            className="pointer-events-none absolute inset-0 -z-[2] rounded-[inherit] [box-shadow:var(--card-glass-drop)]"
          />
        </>
      ) : null}

      {useCssCursorSpot ? (
        <span
          aria-hidden="true"
          data-card-chrome="true"
          className="card-glass-rim-mask pointer-events-none absolute inset-0 z-[21] overflow-hidden rounded-[inherit] p-px"
        >
          <span
            ref={spotRef}
            className="pointer-events-none absolute top-0 left-0 -mt-22 -ml-22 size-44 rounded-full opacity-0 transition-opacity duration-200 ease-out motion-reduce:hidden"
            style={{ backgroundImage: 'var(--card-glass-spot)' }}
          />
        </span>
      ) : null}

      {children}
    </div>
  );
}

/** Header region of a Card with optional trailing action alignment. */
function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'group/card-header @container/card-header grid auto-rows-min items-start gap-1 group-data-[padding=none]/card:px-6 group-data-[padding=none]/card:pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  );
}

/** Primary heading slot for a Card. */
function CardTitle({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('text-body-regular-semibold text-text-primary', className)}
      {...props}
    />
  );
}

/** Secondary description slot for a Card. */
function CardDescription({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-body-small-regular text-text-secondary', className)}
      {...props}
    />
  );
}

/** Action slot aligned to the top-right corner of CardHeader. */
function CardAction({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

/** Main body wrapper for structured Card sections. */
function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        'flex flex-col gap-3 group-data-[padding=none]/card:px-6 group-data-[padding=none]/card:py-4 group-data-[padding=none]/card:[&:nth-child(1_of_:not([data-card-chrome],style,canvas))]:pt-6 group-data-[padding=none]/card:[&:nth-last-child(1_of_:not([data-card-chrome],style,canvas))]:pb-6',
        className,
      )}
      {...props}
    />
  );
}

/** Bottom footer bar for Card actions or metadata. */
function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'flex items-center group-data-[padding=none]/card:px-6 group-data-[padding=none]/card:pb-6 [.border-t]:pt-6',
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cardVariants,
};

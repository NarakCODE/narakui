'use client';

import { useState, type CSSProperties } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SegmentedTabs } from '@/components/ui/segmented-tabs';

type RefractMode = 'clear' | 'frosted' | 'live';

const MARQUEE_ROW_TOP = [
  '#0a84ff',
  '#ff6b3d',
  '#30d158',
  '#ff375f',
  '#ffd60a',
  '#bf5af2',
  '#0a84ff',
  '#ff6b3d',
  '#30d158',
  '#ff375f',
  '#ffd60a',
  '#bf5af2',
] as const;

const MARQUEE_ROW_BOTTOM = [
  '#ff375f',
  '#ffd60a',
  '#bf5af2',
  '#0a84ff',
  '#ff6b3d',
  '#30d158',
  '#ff375f',
  '#ffd60a',
  '#bf5af2',
  '#0a84ff',
  '#ff6b3d',
  '#30d158',
] as const;

function MarqueeTrack({
  colors,
  duration,
  reverse = false,
}: {
  colors: readonly string[];
  duration: string;
  reverse?: boolean;
}) {
  const trackStyle = {
    '--glass-marquee-duration': duration,
    ...(reverse ? { animationDirection: 'reverse' } : {}),
  } as CSSProperties;

  return (
    <div data-glass-marquee="true" className="flex w-max" style={trackStyle}>
      {[0, 1].map((copy) => (
        <div key={copy} className="flex gap-3 pr-3">
          {colors.map((color, index) => (
            <span
              key={`${copy}-${index}`}
              className="h-12 w-24 shrink-0 rounded-full"
              style={{ background: color }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** WebGL2 optical rim refraction powered by `variant="liquid-glass"` on NarakUI Card. */
export function CardOpticalRefractionExample() {
  const [mode, setMode] = useState<RefractMode>('live');

  const material = mode === 'frosted' ? 'frosted' : 'clear';
  const blur = mode === 'clear' ? 0 : 5;
  const tint = mode === 'frosted' ? 0.68 : mode === 'clear' ? 0.24 : 0.65;

  return (
    <div className="relative -m-8 flex min-h-[360px] w-[calc(100%+4rem)] items-center justify-center overflow-hidden px-6 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-3 overflow-hidden"
      >
        <MarqueeTrack colors={MARQUEE_ROW_TOP} duration="40s" />
        <MarqueeTrack colors={MARQUEE_ROW_BOTTOM} duration="48s" reverse />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 h-full w-[150px] select-none"
          style={{
            background: 'linear-gradient(to left, transparent, var(--bg-primary))',
            maskImage: 'linear-gradient(to right, rgb(0, 0, 0) 50%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, rgb(0, 0, 0) 50%, transparent)',
            backdropFilter: 'blur(4px)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 h-full w-[150px] select-none"
          style={{
            background: 'linear-gradient(to right, transparent, var(--bg-primary))',
            maskImage: 'linear-gradient(to left, rgb(0, 0, 0) 50%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to left, rgb(0, 0, 0) 50%, transparent)',
            backdropFilter: 'blur(4px)',
          }}
        />
      </div>

      <SegmentedTabs.Root
        value={mode}
        onValueChange={(value) => setMode(value as RefractMode)}
        className="absolute top-4 left-1/2 z-20 -translate-x-1/2"
      >
        <SegmentedTabs.List className="rounded-lg bg-bg-primary/80 p-1 shadow-medium backdrop-blur-md">
          <SegmentedTabs.Trigger value="clear">Clear lens</SegmentedTabs.Trigger>
          <SegmentedTabs.Trigger value="frosted">Frosted edge</SegmentedTabs.Trigger>
          <SegmentedTabs.Trigger value="live">Live backdrop</SegmentedTabs.Trigger>
        </SegmentedTabs.List>
      </SegmentedTabs.Root>

      <Card
        variant="liquid-glass"
        live
        cursorLight
        material={material}
        blur={blur}
        tint={tint}
        className="relative z-10 w-full max-w-sm rounded-[28px]"
      >
        <CardHeader>
          <CardTitle>Liquid glass card</CardTitle>
          <CardDescription>
            WebGL2 radial perimeter bending with chromatic dispersion and cursor rim light.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-body-mini-regular text-text-secondary">
            Inspect the curved corners to see the backdrop pull subtly toward the center.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LIGHT_SURFACE_VARS = {
  '--control-bg': '#ffffff',
  '--control-hover': '#f5f5f5',
  '--control-selected': '#f1f1f1',
  '--text-primary': '#18181a',
  '--text-secondary': '#787878',
  '--text-green': 'oklch(62.695% 0.18045 148.232)',
  '--border-gray': '#eeeeee',
  '--color-shadow-ring-1': 'rgba(0, 0, 0, 0.02)',
  '--color-shadow-ring-2': 'rgba(0, 0, 0, 0.08)',
  '--color-shadow-stroke': '#ebebeb',
  '--color-shadow-1': 'rgba(0, 0, 0, 0.02)',
  '--color-shadow-2': 'rgba(0, 0, 0, 0.05)',
} as CSSProperties;

const DARK_SURFACE_VARS = {
  '--control-bg': '#252423',
  '--control-hover': '#31302e',
  '--control-selected': '#383735',
  '--text-primary': '#ecebe9',
  '--text-secondary': '#aaa8a5',
  '--text-tertiary': '#898784',
  '--text-green': 'oklch(0.792 0.209 151.711)',
  '--border-gray': '#2e2d2b',
  '--color-shadow-ring-1': 'rgba(0, 0, 0, 0)',
  '--color-shadow-ring-2': 'rgba(214, 213, 212, 0.12)',
  '--color-shadow-stroke': '#2c2b29',
  '--color-shadow-1': 'rgba(0, 0, 0, 0)',
  '--color-shadow-2': 'rgba(0, 0, 0, 0.1)',
} as CSSProperties;

interface BrandShowcaseCardProps {
  surface: 'light' | 'dark';
  label?: string;
  labelClassName?: string;
  className?: string;
  action: ReactNode;
  children: ReactNode;
}

/** Shared card wrapper ensuring uniform height, single crisp border, surface tokens, and action slot placement. */
function BrandShowcaseCard({
  surface,
  label,
  labelClassName,
  className,
  action,
  children,
}: BrandShowcaseCardProps) {
  const isLight = surface === 'light';

  return (
    <div
      style={isLight ? LIGHT_SURFACE_VARS : DARK_SURFACE_VARS}
      className={cn(
        'relative flex h-48 items-center justify-center rounded-xl border p-6',
        isLight
          ? 'border-[#eeeeee] bg-(--brand-white) text-[#18181a]'
          : 'border-[#2e2d2b] bg-[#171615] text-[#ecebe9]',
        className,
      )}
    >
      {label ? (
        <span
          className={cn(
            'absolute top-3.5 left-4 text-body-mini-medium',
            isLight ? 'text-[#787878]' : 'text-[#aaa8a5]',
            labelClassName,
          )}
        >
          {label}
        </span>
      ) : null}

      {children}

      <div className="absolute right-3 bottom-3">{action}</div>
    </div>
  );
}

interface BrandAssetCardProps {
  label: string;
  src: string;
  alt: string;
  filename: string;
  surface: 'light' | 'dark';
  assetClassName: string;
}

function BrandAssetCard({
  label,
  src,
  alt,
  filename,
  surface,
  assetClassName,
}: BrandAssetCardProps) {
  return (
    <BrandShowcaseCard
      surface={surface}
      label={label}
      action={
        <Button asChild size="small" mode="secondary">
          <a href={src} download={filename}>
            <Download aria-hidden="true" />
            <span>Download</span>
          </a>
        </Button>
      }
    >
      <img src={src} alt={alt} className={cn('select-none', assetClassName)} />
    </BrandShowcaseCard>
  );
}

interface BrandColorSpec {
  id: string;
  name: string;
  hex: string;
  rgb: string;
  buttonSurface: 'light' | 'dark';
  surfaceClassName: string;
  labelClassName: string;
  valueClassName: string;
}

const BRAND_COLORS: BrandColorSpec[] = [
  {
    id: 'light',
    name: 'NarakUI Light',
    hex: '#FFFFFF',
    rgb: 'RGB 255, 255, 255',
    buttonSurface: 'light',
    surfaceClassName: 'border-[#eeeeee] bg-(--brand-white)',
    labelClassName: 'text-[#787878]',
    valueClassName: 'text-[#18181a]',
  },
  {
    id: 'dark',
    name: 'NarakUI Dark',
    hex: '#000000',
    rgb: 'RGB 0, 0, 0',
    buttonSurface: 'dark',
    surfaceClassName: 'border-[#2e2d2b] bg-(--brand-black)',
    labelClassName: 'text-white/60',
    valueClassName: 'text-white',
  },
  {
    id: 'blue',
    name: 'NarakUI Blue',
    hex: '#376CFF',
    rgb: 'RGB 55, 108, 255',
    buttonSurface: 'light',
    surfaceClassName: 'border-black/10 bg-brand-cobalt',
    labelClassName: 'text-white/75',
    valueClassName: 'text-white',
  },
];

/** Primary download CTA for the full NarakUI brand assets zip archive. */
export function BrandAssetsDownload() {
  return (
    <div className="not-prose my-4">
      <Button asChild mode="primary">
        <a
          href="/brand/NarakUI-Brand-Assets.zip"
          download="NarakUI-Brand-Assets.zip"
        >
          <Download aria-hidden="true" />
          <span>Download Brand Assets</span>
        </a>
      </Button>
    </div>
  );
}

/** Light and dark showcase cards for the standalone NarakUI isotype mark. */
export function BrandIsotypeCards() {
  return (
    <div className="not-prose my-4 flex flex-col gap-4">
      <BrandAssetCard
        label="Light background"
        src="/brand/narakui-mark-dark.svg"
        alt="NarakUI symbol on light background"
        filename="narakui-mark-dark.svg"
        surface="light"
        assetClassName="size-16"
      />
      <BrandAssetCard
        label="Dark background"
        src="/brand/narakui-mark-light.svg"
        alt="NarakUI symbol on dark background"
        filename="narakui-mark-light.svg"
        surface="dark"
        assetClassName="size-16"
      />
    </div>
  );
}

/** Light and dark showcase cards for the full NarakUI wordmark lockup. */
export function BrandWordmarkCards() {
  return (
    <div className="not-prose my-4 flex flex-col gap-4">
      <BrandAssetCard
        label="Light background"
        src="/brand/narakui-logo-dark.svg"
        alt="NarakUI wordmark on light background"
        filename="narakui-logo-dark.svg"
        surface="light"
        assetClassName="h-9 w-auto"
      />
      <BrandAssetCard
        label="Dark background"
        src="/brand/narakui-logo-light.svg"
        alt="NarakUI wordmark on dark background"
        filename="narakui-logo-light.svg"
        surface="dark"
        assetClassName="h-9 w-auto"
      />
    </div>
  );
}

/** Interactive brand color swatch cards with click-to-copy hex values. */
export function BrandColorCards() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopyColor = (id: string, hex: string) => {
    navigator.clipboard?.writeText(hex).catch(() => undefined);
    setCopiedId(id);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopiedId(null), 1600);
  };

  return (
    <div className="not-prose my-4 flex flex-col gap-4">
      {BRAND_COLORS.map((color) => {
        const isCopied = copiedId === color.id;

        return (
          <BrandShowcaseCard
            key={color.id}
            surface={color.buttonSurface}
            className={color.surfaceClassName}
            action={
              <Button
                size="small"
                mode="secondary"
                iconStart={
                  isCopied ? (
                    <Check aria-hidden="true" className="text-text-green" />
                  ) : (
                    <Copy aria-hidden="true" />
                  )
                }
                onClick={() => handleCopyColor(color.id, color.hex)}
                aria-label={`Copy ${color.name} hex ${color.hex}`}
              >
                {isCopied ? 'Copied' : 'Copy'}
              </Button>
            }
          >
            <div className="flex flex-col gap-1 text-left">
              <span
                className={cn(
                  'text-title-mini font-semibold',
                  color.valueClassName,
                )}
              >
                {color.name}
              </span>
              <span
                className={cn('font-mono text-body-small', color.labelClassName)}
              >
                {color.rgb}
              </span>
              <span
                className={cn('font-mono text-body-small', color.labelClassName)}
              >
                {color.hex}
              </span>
            </div>
          </BrandShowcaseCard>
        );
      })}
    </div>
  );
}

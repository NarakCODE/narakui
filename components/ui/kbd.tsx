'use client';

import { useEffect, useState, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type KbdVariant = 'light' | 'dark';

export interface KbdProps extends ComponentProps<'kbd'> {
  /** Key tokens in order, such as `['mod', 'K']`. Takes precedence over `children`. */
  keys?: string[];
  /** Content to show when `keys` is not set. */
  children?: ReactNode;
  /** Keycap style: `light` for surfaces and secondary buttons, `dark` for primary buttons. */
  variant?: KbdVariant;
  /** Dims the keycap and sets `aria-disabled`. */
  disabled?: boolean;
}

const MAC_PLATFORM_PATTERN = /(Mac|iPhone|iPod|iPad)/i;

function isMacPlatform(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
    navigator.platform ??
    navigator.userAgent;
  return MAC_PLATFORM_PATTERN.test(platform);
}

function formatKeyToken(token: string, isMac: boolean): string {
  switch (token.toLowerCase()) {
    case 'mod':
    case 'meta':
    case 'cmd':
      return isMac ? '⌘' : 'Ctrl';
    case 'alt':
    case 'option':
      return isMac ? '⌥' : 'Alt';
    case 'shift':
      return '⇧';
    case 'enter':
      return '↵';
    default:
      return token;
  }
}

/** Keycap that displays a keyboard shortcut with platform-aware modifier symbols. */
function Kbd({
  keys,
  children,
  variant = 'light',
  disabled = false,
  className,
  ...props
}: KbdProps) {
  // Always render Ctrl / Alt during SSR and switch to Mac symbols after hydration.
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(isMacPlatform());
  }, []);

  const surfaceClasses = disabled
    ? 'cursor-not-allowed bg-bg-secondary text-text-quaternary shadow-none'
    : variant === 'dark'
      ? 'bg-fill-primary-hover text-text-inverse shadow-none'
      : 'bg-bg-base text-text-tertiary shadow-low';

  return (
    <kbd
      data-slot="kbd"
      data-variant={variant}
      aria-disabled={disabled || undefined}
      className={cn(
        'inline-flex w-min items-center gap-1 rounded-[4px] px-1 font-sans text-body-small-medium whitespace-nowrap select-none',
        surfaceClasses,
        'in-data-[slot=tooltip-content]:bg-white/15 in-data-[slot=tooltip-content]:text-text-tooltip in-data-[slot=tooltip-content]:shadow-none',
        className,
      )}
      {...props}
    >
      {keys && keys.length > 0
        ? keys.map((token, index) => (
            <span key={`${token}-${index}`}>{formatKeyToken(token, isMac)}</span>
          ))
        : children}
    </kbd>
  );
}

/** Inline group that arranges multiple `Kbd` elements together. */
function KbdGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="kbd-group"
      className={cn('inline-flex items-center gap-1', className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };

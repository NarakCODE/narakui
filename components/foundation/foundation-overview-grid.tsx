'use client';

import { FastLink } from '@/components/fast-link';
import { NarakUIMark } from '@/components/narak-logo';
import { cn } from '@/lib/utils';

const COLOR_DOTS = [
  {
    label: 'Surface',
    className: 'foundation-swatch-0 bg-bg-tertiary border border-border-gray',
    delayMs: 65,
  },
  {
    label: 'Muted',
    className: 'foundation-swatch-1 bg-fill-tertiary border border-border-gray',
    delayMs: 95,
  },
  {
    label: 'Secondary',
    className:
      'foundation-swatch-2 bg-text-secondary border border-black/10 dark:border-white/10',
    delayMs: 120,
  },
  {
    label: 'Primary',
    className:
      'foundation-swatch-3 bg-fill-primary border border-black/10 dark:border-white/10',
    delayMs: 140,
  },
] as const;

const PREVIEW_ICONS = [
  { name: 'bolt', delayMs: 85 },
  { name: 'msgs', delayMs: 115 },
  { name: 'circle-chart-line', delayMs: 140 },
  { name: 'layers', delayMs: 160 },
  { name: 'sparkle', delayMs: 175 },
  { name: 'flame', delayMs: 190 },
] as const;

const BLUEPRINT_FADE_MASK =
  '[mask-image:radial-gradient(ellipse_at_center,black_48%,transparent_88%)]';

interface MatrixCellProps {
  title: string;
  description: string;
  href: string;
  children: React.ReactNode;
}

function MatrixCell({ title, description, href, children }: MatrixCellProps) {
  return (
    <FastLink
      href={href}
      className={cn(
        'group/card relative flex flex-col bg-bg-primary p-6 no-underline outline-none',
        'transition-colors duration-150 ease-[var(--ease-out)]',
        '[@media(hover:hover)_and_(pointer:fine)]:hover:bg-bg-secondary',
        'focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
      )}
    >
      <div className="flex flex-1 flex-col justify-between transition-transform duration-150 ease-[var(--ease-out)] group-active/card:scale-[0.985] motion-reduce:transition-none motion-reduce:transform-none">
        <div className="relative flex h-44 w-full items-center justify-center">
          {children}
        </div>

        <div className="flex flex-col gap-0.5 pt-2">
          <span className="text-body-small-medium text-text-primary">{title}</span>
          <span className="text-body-small-regular text-text-secondary">
            {description}
          </span>
        </div>
      </div>
    </FastLink>
  );
}

/** Two-column foundation overview matrix with frame-by-frame mount animations. */
export function FoundationOverviewGrid() {
  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border-gray bg-border-gray sm:grid-cols-2">
      {/* Brand */}
      <MatrixCell
        title="Brand"
        description="Learn how to work with our brand identity."
        href="/docs/foundation/brand"
      >
        <div className="relative flex size-36 items-center justify-center">
          <div
            aria-hidden="true"
            className={cn(
              'foundation-wipe-y pointer-events-none absolute -inset-4 bg-[linear-gradient(to_right,var(--border-gray)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-gray)_1px,transparent_1px)] bg-[length:36px_36px] bg-center opacity-70',
              BLUEPRINT_FADE_MASK,
            )}
          />
          <NarakUIMark
            style={{ animationDelay: '55ms' }}
            className="foundation-mark-enter relative size-20 text-text-primary"
          />
        </div>
      </MatrixCell>

      {/* Color */}
      <MatrixCell
        title="Color"
        description="A high-contrast, accessible color system."
        href="/docs/foundation/colors"
      >
        <div className="relative flex h-28 w-52 items-center justify-center">
          <div
            aria-hidden="true"
            style={{ animationDelay: '35ms' }}
            className={cn(
              'foundation-wipe-x pointer-events-none absolute -inset-3 bg-[linear-gradient(to_right,var(--border-gray)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-gray)_1px,transparent_1px)] bg-[length:44px_44px] bg-center opacity-70',
              BLUEPRINT_FADE_MASK,
            )}
          />
          <div className="relative flex items-center justify-center">
            {COLOR_DOTS.map((dot, index) => (
              <div
                key={dot.label}
                style={{ animationDelay: `${dot.delayMs}ms` }}
                className={cn(
                  'size-11 rounded-full',
                  index > 0 && '-ml-3',
                  dot.className,
                )}
              />
            ))}
          </div>
        </div>
      </MatrixCell>

      {/* Typography */}
      <MatrixCell
        title="Typography"
        description="Specifically chosen for clarity and character."
        href="/docs/foundation/typography"
      >
        <div className="relative flex w-52 flex-col">
          <div
            aria-hidden="true"
            style={{ animationDelay: '55ms' }}
            className={cn(
              'foundation-wipe-y pointer-events-none absolute -inset-x-6 -inset-y-4 border-x border-border-gray/70 opacity-75',
              BLUEPRINT_FADE_MASK,
            )}
          />
          <div
            style={{ animationDelay: '55ms' }}
            className="foundation-wipe-x relative border-t border-b border-border-gray/70 px-3 py-2.5"
          >
            <div
              style={{ animationDelay: '95ms' }}
              className="foundation-row-enter flex items-baseline gap-2.5"
            >
              <span className="font-sans text-[26px] font-medium leading-none tracking-[-0.03em] text-text-primary">
                Ag
              </span>
              <span className="text-body-mini-medium text-text-primary">
                Regular
              </span>
              <span className="text-body-mini-regular text-text-tertiary">
                · 28/32
              </span>
            </div>
          </div>
          <div
            style={{ animationDelay: '85ms' }}
            className="foundation-wipe-x relative border-b border-border-gray/70 px-3 py-2.5"
          >
            <div
              style={{ animationDelay: '135ms' }}
              className="foundation-row-enter flex items-baseline gap-2.5"
            >
              <span className="font-sans text-[24px] font-medium leading-none tracking-[-0.025em] text-text-primary">
                Ag
              </span>
              <span className="text-body-mini-medium text-text-primary">
                Small
              </span>
              <span className="text-body-mini-regular text-text-tertiary">
                · 24/28
              </span>
            </div>
          </div>
        </div>
      </MatrixCell>

      {/* Icons */}
      <MatrixCell
        title="Icons"
        description="Minimal, precise, and instantly recognizable."
        href="/docs/foundation/icons"
      >
        <div className="relative flex items-center justify-center">
          <div
            aria-hidden="true"
            style={{ animationDelay: '75ms' }}
            className={cn(
              'foundation-wipe-y pointer-events-none absolute -inset-5 bg-[linear-gradient(to_right,var(--border-gray)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-gray)_1px,transparent_1px)] bg-[length:44px_44px] bg-center opacity-70',
              BLUEPRINT_FADE_MASK,
            )}
          />
          <div
            style={{ animationDelay: '75ms' }}
            className="foundation-wipe-y relative grid grid-cols-3 gap-px overflow-hidden border border-border-gray/80 bg-border-gray/80"
          >
            {PREVIEW_ICONS.map(({ name, delayMs }) => (
              <div
                key={name}
                className="flex size-11 items-center justify-center bg-bg-primary"
              >
                <img
                  src={`/nucleo/${name}.svg?v=system-2`}
                  alt=""
                  width={20}
                  height={20}
                  style={{ animationDelay: `${delayMs}ms` }}
                  className="foundation-icon-pop size-5 select-none"
                />
              </div>
            ))}
          </div>
        </div>
      </MatrixCell>
    </div>
  );
}

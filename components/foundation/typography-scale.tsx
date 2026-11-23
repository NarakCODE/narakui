'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TypeSpecimen {
  token: string;
  spec: string;
  sample: string;
}

const DEFAULT_HEADLINE = 'Build calm, high-craft interfaces with NarakUI.';
const DEFAULT_PARAGRAPH =
  'NarakUI pairs Geist Rounded for headings and UI copy with Geist Mono for code, tokens, and numeric metadata. Consistent line heights and optical spacing keep dense tables, forms, and long-form answers effortless to scan.';

export const TYPOGRAPHY_GROUPS: Record<'title' | 'body' | 'paragraph', TypeSpecimen[]> = {
  title: [
    { token: 'text-title', spec: '1.75rem (28px) / 2rem (32px), semibold, -0.025em tracking. Page titles.', sample: DEFAULT_HEADLINE },
    { token: 'text-title-small', spec: '1.5rem (24px) / 2rem (32px), -0.02em tracking. Compose with font-normal, font-medium, or font-semibold.', sample: DEFAULT_HEADLINE },
    { token: 'text-title-small-medium', spec: '1.5rem (24px) / 2rem (32px), medium, -0.02em tracking.', sample: DEFAULT_HEADLINE },
    { token: 'text-title-small-semibold', spec: '1.5rem (24px) / 2rem (32px), semibold, -0.02em tracking. Section headings.', sample: DEFAULT_HEADLINE },
    { token: 'text-title-mini', spec: '1.125rem (18px) / 1.5rem (24px), -0.015em tracking. Compose with font-normal, font-medium, or font-semibold.', sample: DEFAULT_HEADLINE },
    { token: 'text-title-mini-medium', spec: '1.125rem (18px) / 1.5rem (24px), medium, -0.015em tracking.', sample: DEFAULT_HEADLINE },
    { token: 'text-title-mini-semibold', spec: '1.125rem (18px) / 1.5rem (24px), semibold, -0.015em tracking. Card and dialog titles.', sample: DEFAULT_HEADLINE },
  ],
  body: [
    { token: 'text-body-regular', spec: '0.875rem (14px) / 1.25rem (20px). Compose with font-medium or font-semibold.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-regular-medium', spec: '0.875rem (14px) / 1.25rem (20px), medium.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-regular-semibold', spec: '0.875rem (14px) / 1.25rem (20px), semibold.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-regular-spaced', spec: '0.875rem (14px) / 1.5rem (24px), regular. Taller line height for multi-line text.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-small', spec: '0.8125rem (13px) / 1.125rem (18px). Default size for product UI.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-small-medium', spec: '0.8125rem (13px) / 1.125rem (18px), medium.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-small-semibold', spec: '0.8125rem (13px) / 1.125rem (18px), semibold.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-small-spaced', spec: '0.8125rem (13px) / 1.25rem (20px), regular. Taller line height for multi-line text.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-mini', spec: '0.75rem (12px) / 1rem (16px), +0.005em tracking. Captions and metadata.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-mini-medium', spec: '0.75rem (12px) / 1rem (16px), medium, +0.005em tracking.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-micro', spec: '0.625rem (10px) / 0.875rem (14px), +0.01em tracking. Badges and tiny labels.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-micro-medium', spec: '0.625rem (10px) / 0.875rem (14px), medium, +0.01em tracking.', sample: DEFAULT_HEADLINE },
  ],
  paragraph: [
    { token: 'text-paragraph-regular', spec: '0.875rem (14px) / 1.25rem (20px), regular.', sample: DEFAULT_PARAGRAPH },
    { token: 'text-paragraph-small', spec: '0.8125rem (13px) / 1.125rem (18px), regular.', sample: DEFAULT_PARAGRAPH },
    { token: 'text-paragraph-small-relaxed', spec: '0.8125rem (13px) with 1.7 line height, regular. Dense prose that needs more air.', sample: DEFAULT_PARAGRAPH },
  ],
};

/** Renders live typography specimens for a semantic scale group with click-to-copy utility classes. */
export function TypographyGroup({ group }: { group: keyof typeof TYPOGRAPHY_GROUPS }) {
  const specimens = TYPOGRAPHY_GROUPS[group];
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = (token: string) => {
    navigator.clipboard?.writeText(token).catch(() => undefined);
    setCopiedToken(token);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopiedToken(null), 1600);
  };

  return (
    <div className="not-prose my-4 grid grid-cols-1 divide-y divide-border-gray overflow-hidden rounded-xl border border-border-gray bg-bg-primary dark:bg-bg-secondary">
      {specimens.map((item) => {
        const isCopied = copiedToken === item.token;

        return (
          <div key={item.token} className="flex flex-col items-start gap-5 p-6 text-left md:p-8">
            <div className="flex items-center gap-1.5 text-body-small-regular text-text-secondary">
              <code className="font-mono">{item.token}</code>
              <button
                type="button"
                aria-label={`Copy ${item.token}`}
                onClick={() => handleCopy(item.token)}
                className="inline-flex size-6 cursor-pointer items-center justify-center rounded-sm text-text-tertiary transition-colors duration-150 hover:bg-control-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {isCopied ? (
                  <Check aria-hidden="true" className="size-3.5 text-text-green" />
                ) : (
                  <Copy aria-hidden="true" className="size-3.5" />
                )}
              </button>
            </div>

            <p className={cn('w-full text-text-primary', item.token)}>{item.sample}</p>

            <p className="text-body-mini-regular text-text-secondary">{item.spec}</p>
          </div>
        );
      })}
    </div>
  );
}

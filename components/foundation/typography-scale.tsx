'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TypeSpecimen {
  token: string;
  spec: string;
  sample: string;
}

const DEFAULT_HEADLINE = 'Build calm, high-craft interfaces with Rakfound.';
const DEFAULT_PARAGRAPH =
  'Rakfound pairs Geist Rounded for headings and UI copy with Geist Mono for code, tokens, and numeric metadata. Consistent line heights and optical spacing keep dense tables, forms, and long-form answers effortless to scan.';

export const TYPOGRAPHY_GROUPS: Record<'title' | 'body' | 'paragraph', TypeSpecimen[]> = {
  title: [
    { token: 'text-title-regular', spec: '28px / 32px, semibold. Page titles.', sample: DEFAULT_HEADLINE },
    { token: 'text-title-small-regular', spec: '24px / 32px, regular.', sample: DEFAULT_HEADLINE },
    { token: 'text-title-small-medium', spec: '24px / 32px, medium.', sample: DEFAULT_HEADLINE },
    { token: 'text-title-small-semibold', spec: '24px / 32px, semibold. Section headings.', sample: DEFAULT_HEADLINE },
    { token: 'text-title-mini-regular', spec: '18px / 24px, regular.', sample: DEFAULT_HEADLINE },
    { token: 'text-title-mini-medium', spec: '18px / 24px, medium.', sample: DEFAULT_HEADLINE },
    { token: 'text-title-mini-semibold', spec: '18px / 24px, semibold. Card and dialog titles.', sample: DEFAULT_HEADLINE },
  ],
  body: [
    { token: 'text-body-regular', spec: '14px / 20px, regular.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-regular-medium', spec: '14px / 20px, medium.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-regular-semibold', spec: '14px / 20px, semibold.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-regular-spaced', spec: '14px / 24px, regular. Taller line height for multi-line text.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-small-regular', spec: '13px / 18px, regular. The default size for product UI.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-small-medium', spec: '13px / 18px, medium.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-small-semibold', spec: '13px / 18px, semibold.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-small-spaced', spec: '13px / 20px, regular. Taller line height for multi-line text.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-mini-regular', spec: '12px / 16px, regular. Captions and metadata.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-mini-medium', spec: '12px / 16px, medium.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-micro-regular', spec: '10px / 14px, regular.', sample: DEFAULT_HEADLINE },
    { token: 'text-body-micro-medium', spec: '10px / 14px, medium. Badges and tiny labels.', sample: DEFAULT_HEADLINE },
  ],
  paragraph: [
    { token: 'text-paragraph-regular', spec: '14px / 20px, regular.', sample: DEFAULT_PARAGRAPH },
    { token: 'text-paragraph-small', spec: '13px / 18px, regular.', sample: DEFAULT_PARAGRAPH },
    { token: 'text-paragraph-small-relaxed', spec: '13px with a 1.7 line height, regular. Dense prose that needs more air.', sample: DEFAULT_PARAGRAPH },
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
    <div className="not-prose my-4 flex flex-col divide-y divide-border-gray overflow-hidden rounded-xl border border-border-gray bg-bg-primary shadow-low">
      {specimens.map((item) => {
        const isCopied = copiedToken === item.token;

        return (
          <div key={item.token} className="flex flex-col gap-2.5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleCopy(item.token)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border-gray bg-bg-secondary px-2 py-0.5 font-mono text-body-mini-medium text-text-primary transition-colors duration-150 hover:bg-control-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>{item.token}</span>
                {isCopied ? (
                  <Check aria-hidden="true" className="size-3 text-text-green" />
                ) : (
                  <Copy aria-hidden="true" className="size-3 text-text-tertiary" />
                )}
              </button>
              <span className="text-body-mini-regular text-text-secondary">{item.spec}</span>
            </div>
            <p className={cn('text-text-primary', item.token)}>{item.sample}</p>
          </div>
        );
      })}
    </div>
  );
}

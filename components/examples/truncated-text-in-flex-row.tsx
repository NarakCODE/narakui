'use client';

import { FileText } from 'lucide-react';
import { TruncatedText } from '@/components/ui/truncated-text';

const ARTIFACTS = [
  {
    title: 'Q3 visibility report for Acme across ChatGPT, Perplexity and Gemini',
    kind: 'Report',
  },
  { title: 'Competitor citations', kind: 'Sheet' },
  {
    title: 'Launch brief for the spring product line and answer engine strategy',
    kind: 'Document',
  },
];

/** Truncates the middle column inside a flex row while preserving leading icon and trailing metadata. */
export function TruncatedTextInFlexRow() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-1 rounded-xl bg-bg-primary p-2 shadow-low">
      {ARTIFACTS.map(({ title, kind }) => (
        <div key={title} className="flex items-center gap-2 rounded-md px-2 py-1.5">
          <FileText aria-hidden="true" className="size-4 shrink-0 text-text-secondary" />
          <TruncatedText className="min-w-0 flex-1 text-body-small-medium text-text-primary">
            {title}
          </TruncatedText>
          <span className="shrink-0 text-body-small-regular text-text-secondary">{kind}</span>
        </div>
      ))}
    </div>
  );
}

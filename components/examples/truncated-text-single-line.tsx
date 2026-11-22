'use client';

import { TruncatedText } from '@/components/ui/truncated-text';

const PROMPTS = [
  'Best CRM for startups',
  'Which project management tools integrate with Slack and Google Drive for remote teams?',
  'Top running shoes for flat feet',
  'How do enterprise security teams compare SSO providers for compliance with SOC 2 and HIPAA?',
];

/** Single-line truncation that shows a tooltip only for overflowing prompts. */
export function TruncatedTextSingleLine() {
  return (
    <div className="flex w-full max-w-72 flex-col gap-1 rounded-xl bg-bg-primary p-2 shadow-low">
      {PROMPTS.map((prompt) => (
        <div key={prompt} className="rounded-md px-2 py-1.5">
          <TruncatedText className="text-body-small-regular text-text-primary">
            {prompt}
          </TruncatedText>
        </div>
      ))}
    </div>
  );
}

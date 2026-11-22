'use client';

import { useState } from 'react';
import { SuggestionInput } from '@/components/ui/input';

const SUGGESTIONS = [
  'ChatGPT',
  'Perplexity',
  'Gemini',
  'Copilot',
  'Claude',
  'Google AI Overviews',
  'Grok',
  'Meta AI',
];

/** Input wrapped with a filtered, keyboard-navigable suggestions dropdown. */
export function InputWithSuggestions() {
  const [value, setValue] = useState('');

  return (
    <div className="w-full max-w-sm space-y-4">
      <SuggestionInput
        label="Answer engine"
        placeholder="Search answer engines"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        iconStart="search"
        suggestions={SUGGESTIONS}
        onSuggestionSelect={(suggestion) => {
          setValue(suggestion);
        }}
        hint="Start typing to see suggestions"
      />
    </div>
  );
}

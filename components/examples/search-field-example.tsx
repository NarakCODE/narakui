'use client';

import { useState } from 'react';
import {
  SearchField,
  type SearchFieldValueChangeReason,
} from '@/components/ui/search-field';

export function SearchFieldExample() {
  const [query, setQuery] = useState('Geist Rounded');
  const [lastReason, setLastReason] = useState<
    SearchFieldValueChangeReason | 'initial'
  >('initial');

  return (
    <div className="w-full max-w-sm space-y-4">
      <SearchField
        label="Search documentation"
        placeholder="Search components, tokens, or guides..."
        value={query}
        onValueChange={(nextValue, details) => {
          setQuery(nextValue);
          setLastReason(details.reason);
        }}
        hint={
          query
            ? `Showing matches for "${query}" (${lastReason})`
            : `Empty (${lastReason})`
        }
      />
      <SearchField
        label="Filter tokens"
        placeholder="Filter design tokens..."
        size="small"
      />
    </div>
  );
}

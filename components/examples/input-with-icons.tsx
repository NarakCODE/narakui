'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';

/** Inputs with leading icons, trailing icons, and an interactive password toggle button. */
export function InputWithIcons() {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="w-full max-w-sm space-y-4">
      <Input label="Search" placeholder="Search prompts" iconStart="search" />
      <Input
        label="API key"
        placeholder="Paste your API key"
        type={showKey ? 'text' : 'password'}
        iconEnd={showKey ? 'eye-slash' : 'eye'}
        onEndIconClick={() => setShowKey((prev) => !prev)}
        endIconLabel={showKey ? 'Hide API key' : 'Show API key'}
      />
      <Input
        label="Source URL"
        placeholder="https://acme.com/blog"
        iconStart="link"
        iconEnd="info"
      />
    </div>
  );
}

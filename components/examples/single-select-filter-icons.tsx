'use client';

import { useState } from 'react';
import { Bot, Compass, Globe, Sparkles } from 'lucide-react';
import { SingleSelectFilter } from '@/components/ui/single-select-filter';

const MODELS = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: (
      <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-sm bg-green-muted-fill text-green-emphasis">
        <Bot className="size-3" aria-hidden="true" />
      </span>
    ),
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    icon: (
      <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-sm bg-cyan-muted-fill text-cyan-emphasis">
        <Compass className="size-3" aria-hidden="true" />
      </span>
    ),
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: (
      <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-sm bg-blue-muted-fill text-blue-emphasis">
        <Sparkles className="size-3" aria-hidden="true" />
      </span>
    ),
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: (
      <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-sm bg-orange-muted-fill text-orange-emphasis">
        <Globe className="size-3" aria-hidden="true" />
      </span>
    ),
  },
] as const;

type ModelId = (typeof MODELS)[number]['id'];

export function SingleSelectFilterIconsExample() {
  const [model, setModel] = useState<ModelId>('perplexity');

  return (
    <SingleSelectFilter
      label="Answer engine"
      items={MODELS}
      value={model}
      onChange={setModel}
      renderItemStart={(item) => item.icon}
      size="small"
    />
  );
}

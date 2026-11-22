'use client';

import { useState, type ReactElement } from 'react';
import {
  MultiSelectFilter,
  MultiSelectSelectionIcons,
} from '@/components/ui/multi-select-filter';

function PlatformIcon({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={16}
      height={16}
      loading="lazy"
      decoding="async"
      className="size-4 shrink-0 rounded-full object-cover ring-1 ring-inset ring-black/8 dark:ring-white/12"
    />
  );
}

const PLATFORMS: { id: string; name: string; icon: ReactElement }[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: (
      <PlatformIcon src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e7/f6/e3/e7f6e3fb-8e24-ba31-03ff-aba23d60841f/AppIcon-0-0-1x_U007epad-0-0-0-1-0-P3-85-220.png/1024x1024bb.jpg" />
    ),
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    icon: (
      <PlatformIcon src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/43/79/4e/43794ee1-9f87-0e0e-04ed-65a83d651633/AppIcon-0-0-1x_U007epad-0-0-0-1-0-0-85-220-0.png/1024x1024bb.jpg" />
    ),
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: (
      <PlatformIcon src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/a9/c6/a3/a9c6a3d3-da87-9c4a-5264-9ca6e9a57e63/AppIcon-0-0-1x_U007epad-0-0-0-1-0-0-sRGB-0-0-85-220.png/1024x1024bb.jpg" />
    ),
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: (
      <PlatformIcon src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/2e/3a/d1/2e3ad179-9b94-5349-c0ac-a7cb14d60082/AppIcon-0-0-1x_U007epad-0-1-85-220.png/1024x1024bb.jpg" />
    ),
  },
  {
    id: 'copilot',
    name: 'Copilot',
    icon: (
      <PlatformIcon src="https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/52/e5/b0/52e5b06a-e386-c80e-153d-942cfbf1ff23/AppIcon_Production-0-0-1x_U007epad-0-4-85-220.png/1024x1024bb.jpg" />
    ),
  },
  {
    id: 'grok',
    name: 'Grok',
    icon: (
      <PlatformIcon src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e5/a4/66/e5a466ce-0fcf-a0ed-9534-e7ac186fbe59/AppIcon-0-0-1x_U007epad-0-0-0-1-0-0-P3-0-85-220.png/1024x1024bb.jpg" />
    ),
  },
];

export function MultiSelectFilterBasicExample() {
  const [selectedIds, setSelectedIds] = useState(['chatgpt', 'perplexity']);

  return (
    <MultiSelectFilter
      label="Platforms"
      iconStart="layers"
      items={PLATFORMS}
      selectedIds={selectedIds}
      onChange={setSelectedIds}
      renderItemStart={(item) => item.icon}
      renderSelectionIcons={(selectedItems) => (
        <MultiSelectSelectionIcons
          selectedIds={selectedItems.map((item) => item.id)}
          items={PLATFORMS}
        />
      )}
      searchPlaceholder="Search platforms"
      noResultsLabel="No platforms found."
      itemsCountLabel={(count) =>
        count === 1 ? '1 platform' : `${count} platforms`
      }
    />
  );
}

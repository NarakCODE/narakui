'use client';

import { useState } from 'react';
import {
  TabStrip,
  TabStripItem,
  TabStripLabel,
  TabStripTab,
  TabStripTrigger,
} from '@/components/ui/tab-strip';

const CONTEXT_FILES = [
  { id: 'brand', name: 'Brand voice' },
  { id: 'products', name: 'Product facts' },
  { id: 'competitors', name: 'Competitors' },
];

export function TabStripSelectOnly() {
  const [activeId, setActiveId] = useState('brand');

  return (
    <div className="flex h-11 items-center px-2">
      <TabStrip activeTabId={activeId} aria-label="Context files">
        {CONTEXT_FILES.map((file) => (
          <TabStripItem
            key={file.id}
            tabId={file.id}
            isActive={file.id === activeId}
          >
            <TabStripTab isActive={file.id === activeId}>
              <TabStripTrigger
                isActive={file.id === activeId}
                onClick={() => setActiveId(file.id)}
              >
                <TabStripLabel>{file.name}</TabStripLabel>
              </TabStripTrigger>
            </TabStripTab>
          </TabStripItem>
        ))}
      </TabStrip>
    </div>
  );
}

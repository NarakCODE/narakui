'use client';

import { useState } from 'react';
import {
  TabStrip,
  TabStripItem,
  TabStripLabel,
  TabStripTab,
  TabStripTrigger,
} from '@/components/ui/tab-strip';

const PROMPT_TABS = [
  'Best CRM for startups',
  'Top project management tools',
  'Most reliable cloud storage',
  'Best email marketing platform',
  'Leading analytics software',
  'Top password managers',
].map((name, index) => ({ id: `prompt-${index}`, name }));

export function TabStripOverflow() {
  const [activeId, setActiveId] = useState('prompt-4');

  return (
    <div className="flex h-11 w-full max-w-md items-center rounded-xl bg-bg-base px-2 shadow-low">
      <TabStrip activeTabId={activeId} aria-label="Prompts">
        {PROMPT_TABS.map((tab) => (
          <TabStripItem
            key={tab.id}
            tabId={tab.id}
            isActive={tab.id === activeId}
          >
            <TabStripTab isActive={tab.id === activeId}>
              <TabStripTrigger
                isActive={tab.id === activeId}
                onClick={() => setActiveId(tab.id)}
              >
                <TabStripLabel>{tab.name}</TabStripLabel>
              </TabStripTrigger>
            </TabStripTab>
          </TabStripItem>
        ))}
      </TabStrip>
    </div>
  );
}

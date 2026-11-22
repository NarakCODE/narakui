'use client';

import { useState } from 'react';
import {
  TabStrip,
  TabStripClose,
  TabStripItem,
  TabStripLabel,
  TabStripTab,
  TabStripTrigger,
} from '@/components/ui/tab-strip';

const WORKSPACE_TABS = [
  { id: 'acme', name: 'Acme Corporation' },
  { id: 'northwind', name: 'Northwind Traders' },
  { id: 'globex', name: 'Globex' },
];

export function TabStripOverlayClose() {
  const [tabs, setTabs] = useState(WORKSPACE_TABS);
  const [activeId, setActiveId] = useState<string | null>('acme');

  const closeTab = (id: string) => {
    const remaining = tabs.filter((tab) => tab.id !== id);
    setTabs(remaining);
    if (id === activeId) {
      setActiveId(remaining[0]?.id ?? null);
    }
  };

  return (
    <div className="flex h-11 items-center px-2">
      <TabStrip activeTabId={activeId} aria-label="Workspaces">
        {tabs.map((tab) => (
          <TabStripItem
            key={tab.id}
            tabId={tab.id}
            isActive={tab.id === activeId}
          >
            <TabStripTab isActive={tab.id === activeId} className="max-w-40">
              <TabStripTrigger
                isActive={tab.id === activeId}
                onClick={() => setActiveId(tab.id)}
              >
                <TabStripLabel>{tab.name}</TabStripLabel>
              </TabStripTrigger>
              <TabStripClose
                label={`Close ${tab.name}`}
                onClose={() => closeTab(tab.id)}
                overlay
              />
            </TabStripTab>
          </TabStripItem>
        ))}
      </TabStrip>
    </div>
  );
}

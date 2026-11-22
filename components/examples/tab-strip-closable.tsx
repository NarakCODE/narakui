'use client';

import { useState } from 'react';
import { BarChart3, FileText, Link2, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  TAB_STRIP_CONTROL_CLASS,
  TabStrip,
  TabStripClose,
  TabStripItem,
  TabStripLabel,
  TabStripTab,
  TabStripTrigger,
} from '@/components/ui/tab-strip';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type ArtifactIcon = 'chart-bar' | 'document' | 'link';
type ArtifactTab = { id: string; name: string; icon: ArtifactIcon };

const ICONS: Record<ArtifactIcon, LucideIcon> = {
  'chart-bar': BarChart3,
  document: FileText,
  link: Link2,
};

const ARTIFACT_TABS: ArtifactTab[] = [
  { id: 'report', name: 'Visibility report', icon: 'chart-bar' },
  { id: 'brief', name: 'Content brief', icon: 'document' },
  { id: 'sources', name: 'Cited sources', icon: 'link' },
];

const NEW_TAB_NAMES = [
  'Competitor summary',
  'Prompt ideas',
  'Launch checklist',
  'Answer engine notes',
];

export function TabStripClosable() {
  const [tabs, setTabs] = useState(ARTIFACT_TABS);
  const [activeId, setActiveId] = useState<string | null>('report');
  const [created, setCreated] = useState(0);

  const closeTab = (id: string) => {
    const index = tabs.findIndex((tab) => tab.id === id);
    const remaining = tabs.filter((tab) => tab.id !== id);
    setTabs(remaining);
    if (id === activeId) {
      setActiveId(remaining[Math.min(index, remaining.length - 1)]?.id ?? null);
    }
  };

  const addTab = () => {
    const tab: ArtifactTab = {
      id: `new-${created}`,
      name: NEW_TAB_NAMES[created % NEW_TAB_NAMES.length],
      icon: 'document',
    };
    setTabs((current) => [...current, tab]);
    setActiveId(tab.id);
    setCreated((count) => count + 1);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-11 w-full max-w-xl items-center gap-2 rounded-xl bg-bg-base px-2 shadow-low">
        <div className="flex min-w-0 items-center self-stretch">
          <TabStrip activeTabId={activeId} aria-label="Artifacts">
            {tabs.map((tab) => {
              const IconComponent = ICONS[tab.icon];
              return (
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
                      <IconComponent
                        aria-hidden="true"
                        className="size-3.5 shrink-0"
                      />
                      <TabStripLabel>{tab.name}</TabStripLabel>
                    </TabStripTrigger>
                    <TabStripClose
                      label={`Close ${tab.name}`}
                      onClose={() => closeTab(tab.id)}
                    />
                  </TabStripTab>
                </TabStripItem>
              );
            })}
          </TabStrip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="New tab"
                allowScaleOnClick={false}
                className={TAB_STRIP_CONTROL_CLASS}
                iconStart={{
                  name: 'plus',
                  className: 'text-fill-secondary group-hover:text-fill-primary',
                }}
                mode="ghost"
                onClick={addTab}
              />
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>New tab</TooltipContent>
          </Tooltip>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="Close side panel"
              allowScaleOnClick={false}
              className={cn(TAB_STRIP_CONTROL_CLASS, 'ml-auto')}
              iconStart={{
                name: 'x',
                className: 'text-fill-secondary group-hover:text-fill-primary',
              }}
              mode="ghost"
            />
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>Close side panel</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

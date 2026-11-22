'use client';

import { useState } from 'react';
import { Combobox } from '@/components/ui/combobox';

const METRIC_GROUPS = [
  {
    heading: 'Visibility',
    metrics: [
      { id: 'visibility-score', name: 'Visibility score', icon: 'eye' },
      { id: 'share-of-voice', name: 'Share of voice', icon: 'chart-pie' },
      { id: 'average-position', name: 'Average position', icon: 'leaderboard' },
    ],
  },
  {
    heading: 'Citations',
    metrics: [
      { id: 'citation-share', name: 'Citation share', icon: 'references' },
      { id: 'cited-pages', name: 'Cited pages', icon: 'documents' },
      { id: 'top-domains', name: 'Top domains', icon: 'globe' },
    ],
  },
  {
    heading: 'Sentiment',
    metrics: [
      { id: 'sentiment-score', name: 'Sentiment score', icon: 'thumbs-up' },
      { id: 'negative-mentions', name: 'Negative mentions', icon: 'thumbs-down' },
    ],
  },
] as const;

type Metric = (typeof METRIC_GROUPS)[number]['metrics'][number];

/** Grouped Combobox indexing both item names and group headings as search keywords. */
export const ComboboxGroups = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Metric['id']>('visibility-score');
  const selected = METRIC_GROUPS.flatMap<Metric>((group) => group.metrics).find(
    (metric) => metric.id === value,
  );

  return (
    <Combobox.Root open={open} onOpenChange={setOpen}>
      <Combobox.Trigger buttonWithChevron iconStart={selected?.icon} size="regular">
        {selected?.name}
      </Combobox.Trigger>
      <Combobox.Content align="start">
        <Combobox.Command>
          <Combobox.Input placeholder="Search metrics" autoFocus />
          <Combobox.List>
            <Combobox.Empty>No metrics found</Combobox.Empty>
            {METRIC_GROUPS.map((group, index) => (
              <div key={group.heading}>
                {index > 0 && <Combobox.Separator className="my-1" />}
                <Combobox.Group heading={group.heading}>
                  {group.metrics.map((metric) => (
                    <Combobox.Item
                      key={metric.id}
                      value={metric.id}
                      keywords={[metric.name, group.heading]}
                      start={metric.icon}
                      end={
                        metric.id === value
                          ? { name: 'check', className: 'text-text-secondary' }
                          : undefined
                      }
                      onSelect={() => {
                        setValue(metric.id);
                        setOpen(false);
                      }}
                    >
                      {metric.name}
                    </Combobox.Item>
                  ))}
                </Combobox.Group>
              </div>
            ))}
          </Combobox.List>
        </Combobox.Command>
      </Combobox.Content>
    </Combobox.Root>
  );
};

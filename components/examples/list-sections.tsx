'use client';

import { useId } from 'react';
import { BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { List, ListItem } from '@/components/ui/list';

const REPORT_SECTIONS = [
  {
    id: 'today',
    label: 'Today',
    reports: [
      {
        id: 'visibility',
        title: 'Weekly visibility report',
        engines: 'ChatGPT, Perplexity, Gemini',
        status: 'Ready',
      },
      {
        id: 'sentiment',
        title: 'Brand sentiment snapshot',
        engines: 'ChatGPT, Claude',
        status: 'Running',
      },
    ],
  },
  {
    id: 'earlier',
    label: 'Earlier this week',
    reports: [
      {
        id: 'share',
        title: 'Share of voice by prompt',
        engines: 'All answer engines',
        status: 'Ready',
      },
    ],
  },
] as const;

export function ListSectionsExample() {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="w-full max-w-md">
      <List.Root keyboardNavigation>
        <List.Header titleId={titleId} title="Reports" />
        <List.Divider />
        <List.Body>
          {REPORT_SECTIONS.map((section, index) => (
            <List.Section key={section.id} aria-labelledby={`${titleId}-${section.id}`}>
              {index > 0 ? <List.Divider className="-mx-1 my-2" /> : null}
              <List.Subheader id={`${titleId}-${section.id}`}>{section.label}</List.Subheader>
              <List.Items>
                {section.reports.map((report) => (
                  <ListItem.Root key={report.id}>
                    <ListItem.PrimaryAction disabled={report.status === 'Running'}>
                      <ListItem.Content
                        leading={<BarChart3 className="size-4" aria-hidden="true" />}
                        title={report.title}
                        description={report.engines}
                        status={
                          <Badge
                            title={report.status}
                            type={report.status === 'Ready' ? 'green' : 'gray'}
                            size="small"
                          />
                        }
                      />
                    </ListItem.PrimaryAction>
                  </ListItem.Root>
                ))}
              </List.Items>
            </List.Section>
          ))}
        </List.Body>
      </List.Root>
    </section>
  );
}

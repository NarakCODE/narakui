'use client';

import { useState } from 'react';
import { MultiSelectFilter } from '@/components/ui/multi-select-filter';

const STATUSES = [
  { id: 'draft', name: 'Draft' },
  { id: 'scheduled', name: 'Scheduled' },
  { id: 'published', name: 'Published' },
  { id: 'archived', name: 'Archived' },
];

const TOPICS = [
  { id: 'pricing', name: 'Pricing' },
  { id: 'integrations', name: 'Integrations' },
  { id: 'security', name: 'Security and compliance' },
  { id: 'support', name: 'Customer support' },
  { id: 'onboarding', name: 'Onboarding' },
];

export function MultiSelectFilterAllowEmptyExample() {
  const [statuses, setStatuses] = useState<string[]>([]);
  const [topics, setTopics] = useState(TOPICS.map((topic) => topic.id));

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <MultiSelectFilter
        label="Status"
        iconStart="circle-dashed"
        items={STATUSES}
        selectedIds={statuses}
        onChange={setStatuses}
        allowEmpty
        showSearch={false}
        showOnlyButton={false}
        itemsCountLabel={(count) =>
          count === 1 ? '1 status' : `${count} statuses`
        }
      />
      <MultiSelectFilter
        label="Topic"
        iconStart="tag"
        items={TOPICS}
        selectedIds={topics}
        onChange={setTopics}
        searchPlaceholder="Search topics"
        noResultsLabel="No topics found."
        itemsCountLabel={(count) =>
          count === 1 ? '1 topic' : `${count} topics`
        }
      />
    </div>
  );
}

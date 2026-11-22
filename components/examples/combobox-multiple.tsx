'use client';

import { useState } from 'react';
import { Combobox } from '@/components/ui/combobox';

const INITIAL_TOPICS = [
  'Pricing',
  'Integrations',
  'Security and compliance',
  'Customer support',
  'Onboarding',
  'Reporting',
  'API access',
];

/** Multi-select Combobox with hover-revealed Only isolation, clearable search, and inline topic creation. */
export const ComboboxMultiple = () => {
  const [topics, setTopics] = useState(INITIAL_TOPICS);
  const [selected, setSelected] = useState(['Pricing', 'Integrations']);
  const [search, setSearch] = useState('');
  const query = search.trim();
  const canCreate =
    query !== '' && !topics.some((topic) => topic.toLowerCase() === query.toLowerCase());

  const toggle = (topic: string) =>
    setSelected((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic],
    );

  const createTopic = () => {
    setTopics([...topics, query]);
    setSelected([...selected, query]);
    setSearch('');
  };

  let triggerLabel = `${selected.length} topics`;
  if (selected.length === 0) triggerLabel = 'Topics';
  if (selected.length === 1) triggerLabel = selected[0] ?? 'Topics';

  return (
    <Combobox.Root onOpenChange={(open) => !open && setSearch('')}>
      <Combobox.Trigger buttonWithChevron iconStart="tag" size="regular">
        {triggerLabel}
      </Combobox.Trigger>
      <Combobox.Content align="start">
        <Combobox.Command>
          <Combobox.Input
            placeholder="Search or create a topic"
            value={search}
            onValueChange={setSearch}
            onClear={() => setSearch('')}
            clearLabel="Clear search"
            autoFocus
          />
          <Combobox.List height={240}>
            <Combobox.Empty>No topics found</Combobox.Empty>
            <Combobox.Group>
              {topics.map((topic) => (
                <Combobox.ItemCheckbox
                  key={topic}
                  value={topic}
                  checked={selected.includes(topic)}
                  onSelect={() => toggle(topic)}
                  onOnlyClick={() => setSelected([topic])}
                >
                  {topic}
                </Combobox.ItemCheckbox>
              ))}
            </Combobox.Group>
          </Combobox.List>
          {canCreate && (
            <>
              <Combobox.Separator alwaysRender />
              <div className="p-1">
                <Combobox.StandaloneButton
                  start="plus"
                  className="w-full"
                  onClick={createTopic}
                >
                  Create &ldquo;{query}&rdquo;
                </Combobox.StandaloneButton>
              </div>
            </>
          )}
        </Combobox.Command>
      </Combobox.Content>
    </Combobox.Root>
  );
};

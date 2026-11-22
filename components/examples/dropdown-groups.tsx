'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dropdown } from '@/components/ui/dropdown-menu';

const COLUMNS = [
  { id: 'visibility', label: 'Visibility score' },
  { id: 'share', label: 'Share of voice' },
  { id: 'citations', label: 'Citation count' },
  { id: 'sentiment', label: 'Sentiment' },
] as const;

/** Display options menu combining `Label`, `RadioGroup`, `CheckboxItem` with `"Only"` shortcut, and a nested `Sub` menu. */
export const DropdownGroups = () => {
  const [sortBy, setSortBy] = useState('visibility');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'visibility',
    'share',
    'citations',
  ]);

  const toggleColumn = (id: string, checked: boolean) => {
    setVisibleColumns((current) =>
      checked ? [...current, id] : current.filter((item) => item !== id),
    );
  };

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button iconStart="sliders">Display</Button>
      </Dropdown.Trigger>
      <Dropdown.Content align="start">
        <Dropdown.Label>Sort by</Dropdown.Label>
        <Dropdown.RadioGroup value={sortBy} onValueChange={setSortBy}>
          <Dropdown.RadioItem value="visibility">Visibility score</Dropdown.RadioItem>
          <Dropdown.RadioItem value="citations">Most cited</Dropdown.RadioItem>
          <Dropdown.RadioItem value="recent">Recently updated</Dropdown.RadioItem>
        </Dropdown.RadioGroup>

        <Dropdown.Separator />

        <Dropdown.Label>Columns</Dropdown.Label>
        <Dropdown.Group>
          {COLUMNS.map((column) => (
            <Dropdown.CheckboxItem
              key={column.id}
              checked={visibleColumns.includes(column.id)}
              onSelect={(event) => event.preventDefault()}
              onCheckedChange={(checked) => toggleColumn(column.id, checked)}
              onOnlyClick={() => setVisibleColumns([column.id])}
            >
              {column.label}
            </Dropdown.CheckboxItem>
          ))}
        </Dropdown.Group>

        <Dropdown.Separator />

        <Dropdown.Sub>
          <Dropdown.SubTrigger startIcon="download">Export view</Dropdown.SubTrigger>
          <Dropdown.SubContent>
            <Dropdown.Item start="documents">Download CSV</Dropdown.Item>
            <Dropdown.Item start="file-text">Download PDF summary</Dropdown.Item>
            <Dropdown.Item start="link">Copy shareable link</Dropdown.Item>
          </Dropdown.SubContent>
        </Dropdown.Sub>
      </Dropdown.Content>
    </Dropdown.Root>
  );
};

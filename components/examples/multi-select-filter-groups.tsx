'use client';

import { useState } from 'react';
import { MultiSelectFilter } from '@/components/ui/multi-select-filter';

const BRAND_GROUPS = [
  {
    id: 'owned',
    heading: 'Your brands',
    items: [
      { id: 'northwind', name: 'Northwind Coffee' },
      { id: 'northwind-eu', name: 'Northwind Coffee EU' },
    ],
  },
  {
    id: 'tracked',
    heading: 'Tracked competitors',
    items: [
      { id: 'lumen', name: 'Lumen Roasters' },
      { id: 'harbor', name: 'Harbor Bean Co.' },
      { id: 'summit', name: 'Summit Brew' },
    ],
  },
  {
    id: 'discovered',
    heading: 'Discovered competitors',
    items: [
      { id: 'copperline', name: 'Copperline Coffee' },
      { id: 'fieldstone', name: 'Fieldstone Roastery' },
    ],
  },
];

export function MultiSelectFilterGroupsExample() {
  const [selectedIds, setSelectedIds] = useState([
    'northwind',
    'lumen',
    'harbor',
  ]);

  return (
    <MultiSelectFilter
      label="Brands"
      iconStart="buildings"
      groups={BRAND_GROUPS}
      selectedIds={selectedIds}
      onChange={setSelectedIds}
      searchPlaceholder="Search brands"
      noResultsLabel="No brands found."
      itemsCountLabel={(count) => (count === 1 ? '1 brand' : `${count} brands`)}
    />
  );
}

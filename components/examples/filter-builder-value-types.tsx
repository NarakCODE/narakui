'use client';

import { useState } from 'react';
import {
  FilterBuilder,
  type FilterBuilderField,
  type FilterCondition,
} from '@/components/ui/filter-builder';

const SELECT_FIELDS: FilterBuilderField[] = [
  {
    id: 'status',
    label: 'Status',
    iconStart: 'check-circle',
    defaultOperatorId: 'is',
    operators: [
      { id: 'is', label: 'is' },
      { id: 'is-not', label: 'is not' },
    ],
    value: {
      type: 'select',
      searchable: true,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'paused', label: 'Paused' },
        { value: 'archived', label: 'Archived' },
      ],
    },
  },
];

const NUMBER_FIELDS: FilterBuilderField[] = [
  {
    id: 'citations',
    label: 'Citations',
    iconStart: 'link',
    defaultOperatorId: 'gte',
    operators: [
      { id: 'eq', label: '=' },
      { id: 'gte', label: '≥' },
      { id: 'lte', label: '≤' },
    ],
    value: {
      type: 'number',
      min: 0,
      max: 500,
      step: 5,
      placeholder: '0',
    },
  },
];

const TEXT_FIELDS: FilterBuilderField[] = [
  {
    id: 'query',
    label: 'Prompt query',
    iconStart: 'search',
    defaultOperatorId: 'contains',
    operators: [
      { id: 'contains', label: 'contains' },
      { id: 'starts-with', label: 'starts with' },
    ],
    value: {
      type: 'text',
      placeholder: 'Enter keyword...',
    },
  },
];

const MULTI_OPTIONS_FIELDS: FilterBuilderField[] = [
  {
    id: 'tags',
    label: 'Tags',
    iconStart: 'tag',
    defaultOperatorId: 'includes-any',
    operators: [
      { id: 'includes-any', label: 'includes any of' },
      { id: 'includes-all', label: 'includes all of' },
    ],
    value: {
      type: 'multi',
      searchable: true,
      options: [
        { value: 'brand', label: 'Brand' },
        { value: 'competitor', label: 'Competitor' },
        { value: 'pricing', label: 'Pricing' },
        { value: 'enterprise', label: 'Enterprise' },
      ],
    },
  },
];

const MULTI_CUSTOM_FIELDS: FilterBuilderField[] = [
  {
    id: 'domains',
    label: 'Domains',
    iconStart: 'globe',
    defaultOperatorId: 'includes-any',
    operators: [
      { id: 'includes-any', label: 'includes any of' },
      { id: 'excludes', label: 'excludes' },
    ],
    value: {
      type: 'multi',
      allowCustom: true,
      placeholder: 'Add domain...',
    },
  },
];

export const FilterBuilderValueTypesExample = () => {
  const [selectCondition, setSelectCondition] = useState<FilterCondition>({
    fieldId: 'status',
    operatorId: 'is',
    value: 'active',
  });
  const [numberCondition, setNumberCondition] = useState<FilterCondition>({
    fieldId: 'citations',
    operatorId: 'gte',
    value: 25,
  });
  const [textCondition, setTextCondition] = useState<FilterCondition>({
    fieldId: 'query',
    operatorId: 'contains',
    value: 'best crm',
  });
  const [multiOptionsCondition, setMultiOptionsCondition] =
    useState<FilterCondition>({
      fieldId: 'tags',
      operatorId: 'includes-any',
      value: ['brand', 'pricing'],
    });
  const [multiCustomCondition, setMultiCustomCondition] =
    useState<FilterCondition>({
      fieldId: 'domains',
      operatorId: 'includes-any',
      value: ['narakcode.dev', 'ui.narakcode.dev'],
    });

  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <div className="flex flex-col items-start gap-1.5">
        <span className="text-body-mini-medium text-text-tertiary">Select</span>
        <FilterBuilder
          fields={SELECT_FIELDS}
          condition={selectCondition}
          onConditionChange={setSelectCondition}
        />
      </div>

      <div className="flex flex-col items-start gap-1.5">
        <span className="text-body-mini-medium text-text-tertiary">Number</span>
        <FilterBuilder
          fields={NUMBER_FIELDS}
          condition={numberCondition}
          onConditionChange={setNumberCondition}
        />
      </div>

      <div className="flex flex-col items-start gap-1.5">
        <span className="text-body-mini-medium text-text-tertiary">Text</span>
        <FilterBuilder
          fields={TEXT_FIELDS}
          condition={textCondition}
          onConditionChange={setTextCondition}
        />
      </div>

      <div className="flex flex-col items-start gap-1.5">
        <span className="text-body-mini-medium text-text-tertiary">
          Multi (options)
        </span>
        <FilterBuilder
          fields={MULTI_OPTIONS_FIELDS}
          condition={multiOptionsCondition}
          onConditionChange={setMultiOptionsCondition}
        />
      </div>

      <div className="flex flex-col items-start gap-1.5">
        <span className="text-body-mini-medium text-text-tertiary">
          Multi (custom)
        </span>
        <FilterBuilder
          fields={MULTI_CUSTOM_FIELDS}
          condition={multiCustomCondition}
          onConditionChange={setMultiCustomCondition}
        />
      </div>
    </div>
  );
};

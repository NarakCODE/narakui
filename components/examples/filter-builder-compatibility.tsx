'use client';

import { useState } from 'react';
import {
  FilterBuilder,
  type FilterBuilderField,
  type FilterBuilderOperator,
  type FilterBuilderOption,
  type FilterCondition,
} from '@/components/ui/filter-builder';

const OPERATORS: FilterBuilderOperator[] = [
  { id: 'is', label: 'is' },
  { id: 'is-not', label: 'is not' },
];

const TEAM_MEMBERS: FilterBuilderOption[] = [
  { value: 'alex', label: 'Alex' },
  { value: 'maya', label: 'Maya' },
  { value: 'sam', label: 'Sam' },
];

const FIELDS: FilterBuilderField[] = [
  {
    id: 'assignee',
    label: 'Assignee',
    iconStart: 'user-plus',
    defaultOperatorId: 'is',
    operators: OPERATORS,
    value: {
      type: 'select',
      compatibilityKey: 'user',
      options: TEAM_MEMBERS,
    },
  },
  {
    id: 'reviewer',
    label: 'Reviewer',
    iconStart: 'eye',
    defaultOperatorId: 'is',
    operators: OPERATORS,
    value: {
      type: 'select',
      compatibilityKey: 'user',
      options: TEAM_MEMBERS,
    },
  },
  {
    id: 'region',
    label: 'Region',
    iconStart: 'globe',
    defaultOperatorId: 'is',
    operators: OPERATORS,
    value: {
      type: 'select',
      compatibilityKey: 'region',
      options: [
        { value: 'us', label: 'United States' },
        { value: 'eu', label: 'Europe' },
        { value: 'apac', label: 'Asia Pacific' },
      ],
    },
  },
];

export const FilterBuilderCompatibilityExample = () => {
  const [condition, setCondition] = useState<FilterCondition>({
    fieldId: 'assignee',
    operatorId: 'is',
    value: 'alex',
  });

  return (
    <div className="flex flex-col items-start gap-3">
      <FilterBuilder
        fields={FIELDS}
        condition={condition}
        onConditionChange={setCondition}
      />
      <p className="text-body-mini-regular text-text-tertiary">
        Switch between Assignee and Reviewer to keep the selected person. Switch
        to Region to keep the operator and clear the value.
      </p>
      <pre className="rounded-md border border-border-gray bg-bg-secondary px-3 py-2 font-mono text-body-mini-regular text-text-secondary">
        {JSON.stringify(condition)}
      </pre>
    </div>
  );
};

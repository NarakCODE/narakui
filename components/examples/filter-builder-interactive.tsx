'use client';

import { useState } from 'react';
import {
  FilterBuilder,
  type FilterBuilderField,
  type FilterCondition,
} from '@/components/ui/filter-builder';

function EngineIcon({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={16}
      height={16}
      loading="lazy"
      decoding="async"
      className="size-4 shrink-0 rounded-[4px] object-cover ring-1 ring-inset ring-black/8 dark:ring-white/12"
    />
  );
}

const FIELDS: FilterBuilderField[] = [
  {
    id: 'answer-engine',
    label: 'Answer engine',
    iconStart: 'sparkles',
    defaultOperatorId: 'is',
    operators: [
      { id: 'is', label: 'is' },
      { id: 'is-not', label: 'is not' },
      { id: 'is-any-of', label: 'is any of' },
    ],
    value: {
      type: 'select',
      searchable: true,
      options: [
        {
          value: 'chatgpt',
          label: 'ChatGPT',
          iconStart: (
            <EngineIcon src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e7/f6/e3/e7f6e3fb-8e24-ba31-03ff-aba23d60841f/AppIcon-0-0-1x_U007epad-0-0-0-1-0-P3-85-220.png/1024x1024bb.jpg" />
          ),
        },
        {
          value: 'perplexity',
          label: 'Perplexity',
          iconStart: (
            <EngineIcon src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/43/79/4e/43794ee1-9f87-0e0e-04ed-65a83d651633/AppIcon-0-0-1x_U007epad-0-0-0-1-0-0-85-220-0.png/1024x1024bb.jpg" />
          ),
        },
        {
          value: 'claude',
          label: 'Claude',
          iconStart: (
            <EngineIcon src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/2e/3a/d1/2e3ad179-9b94-5349-c0ac-a7cb14d60082/AppIcon-0-0-1x_U007epad-0-1-85-220.png/1024x1024bb.jpg" />
          ),
        },
        {
          value: 'gemini',
          label: 'Gemini',
          iconStart: (
            <EngineIcon src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/a9/c6/a3/a9c6a3d3-da87-9c4a-5264-9ca6e9a57e63/AppIcon-0-0-1x_U007epad-0-0-0-1-0-0-sRGB-0-0-85-220.png/1024x1024bb.jpg" />
          ),
        },
      ],
    },
  },
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
      step: 1,
      placeholder: '0',
    },
  },
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

export const FilterBuilderInteractiveExample = () => {
  const [condition, setCondition] = useState<FilterCondition>({
    fieldId: 'answer-engine',
    operatorId: 'is',
    value: 'chatgpt',
  });

  return (
    <div className="flex flex-col items-start gap-3">
      <FilterBuilder
        fields={FIELDS}
        condition={condition}
        onConditionChange={setCondition}
        showFieldSearch
      />
      <pre className="rounded-md border border-border-gray bg-bg-secondary px-3 py-2 font-mono text-body-mini-regular text-text-secondary">
        {JSON.stringify(condition)}
      </pre>
    </div>
  );
};

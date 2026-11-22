'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MultiStepForm } from '@/components/ui/multi-step-form';
import { Textarea } from '@/components/ui/textarea';

const HEIGHTS = [240, 360, 520] as const;

/** Same six fields across three frame heights showing how height drives the page split. */
export function MultiStepFormHeights() {
  const [height, setHeight] = useState<number>(360);

  return (
    <div className="flex w-full max-w-[420px] flex-col gap-3">
      <div className="flex items-center gap-2">
        {HEIGHTS.map((option) => (
          <Button
            key={option}
            size="micro"
            mode={height === option ? 'primary' : 'ghost'}
            onClick={() => setHeight(option)}
          >
            {option}px
          </Button>
        ))}
      </div>

      <MultiStepForm.Root height={height}>
        <MultiStepForm.Header>
          <div className="flex items-center justify-between gap-4">
            <p className="text-body-mini-regular text-text-secondary">
              Fixed at {height}px
            </p>
            <MultiStepForm.Counter />
          </div>
        </MultiStepForm.Header>

        <MultiStepForm.Content>
          <MultiStepForm.Item fieldKey="brand">
            <Input label="Brand" placeholder="Nike" />
          </MultiStepForm.Item>
          <MultiStepForm.Item fieldKey="keyword">
            <Input label="Target keyword" placeholder="running shoes" />
          </MultiStepForm.Item>
          <MultiStepForm.Item fieldKey="brief">
            <Textarea
              label="Brief"
              placeholder="What should this cover?"
              fieldSizing={false}
              inputRest={{ rows: 4 }}
            />
          </MultiStepForm.Item>
          <MultiStepForm.Item fieldKey="competitor">
            <Input label="Competitor" placeholder="adidas.com" />
          </MultiStepForm.Item>
          <MultiStepForm.Item fieldKey="tone">
            <Textarea
              label="Tone notes"
              placeholder="Plain, concrete, no hype."
              fieldSizing={false}
              inputRest={{ rows: 3 }}
            />
          </MultiStepForm.Item>
          <MultiStepForm.Item fieldKey="owner">
            <Input label="Owner" placeholder="you@example.com" />
          </MultiStepForm.Item>
        </MultiStepForm.Content>

        <MultiStepForm.Footer>
          <MultiStepForm.Actions />
        </MultiStepForm.Footer>
      </MultiStepForm.Root>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { MultiStepForm } from '@/components/ui/multi-step-form';
import { Textarea } from '@/components/ui/textarea';

/** Six fields of unequal height automatically split into pages without declaring steps. */
export function MultiStepFormDefault() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="w-full max-w-[420px]">
      <MultiStepForm.Root onSubmit={() => setSubmitted(true)}>
        <MultiStepForm.Header>
          <div className="flex items-center justify-between gap-4">
            <p className="text-body-mini-regular text-text-secondary">
              {submitted ? 'Submitted' : 'Inputs'}
            </p>
            <MultiStepForm.Counter />
          </div>
          <MultiStepForm.Progress className="mt-2" />
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

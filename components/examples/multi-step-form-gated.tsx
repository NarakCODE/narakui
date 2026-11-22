'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { MultiStepForm } from '@/components/ui/multi-step-form';
import { Textarea } from '@/components/ui/textarea';

/** Gating page advancement via `canAdvance` validated against `fieldKeys` on the visible page. */
export function MultiStepFormGated() {
  const [brand, setBrand] = useState('');
  const [showError, setShowError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="w-full max-w-[420px]">
      <MultiStepForm.Root
        height={300}
        canAdvance={(_step, fieldKeys) => {
          if (fieldKeys.includes('brand') && brand.trim().length === 0) {
            setShowError(true);
            return false;
          }
          setShowError(false);
          return true;
        }}
        onSubmit={async () => {
          await new Promise((resolve) => setTimeout(resolve, 400));
          setSubmitted(true);
        }}
      >
        <MultiStepForm.Header>
          <div className="flex items-center justify-between gap-4">
            <p className="text-body-mini-regular text-text-secondary">
              {submitted ? 'Form submitted' : 'Required on page one'}
            </p>
            <MultiStepForm.Counter />
          </div>
        </MultiStepForm.Header>

        <MultiStepForm.Content>
          <MultiStepForm.Item fieldKey="brand">
            <Input
              label="Brand"
              placeholder="Acme"
              required
              value={brand}
              onChange={(event) => {
                setBrand(event.target.value);
                if (event.target.value.trim().length > 0) {
                  setShowError(false);
                }
              }}
              error={showError}
              errorMessage="Enter a brand name to continue."
            />
          </MultiStepForm.Item>
          <MultiStepForm.Item fieldKey="brief">
            <Textarea
              label="Brief"
              placeholder="What should this cover?"
              fieldSizing={false}
              inputRest={{ rows: 4 }}
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

'use client';

import { Input } from '@/components/ui/input';
import { MultiStepForm } from '@/components/ui/multi-step-form';

const FIELDS = [
  { key: 'brand', label: 'Brand', placeholder: 'Nike' },
  { key: 'keyword', label: 'Keyword', placeholder: 'running shoes' },
  { key: 'competitor', label: 'Competitor', placeholder: 'adidas.com' },
  { key: 'market', label: 'Market', placeholder: 'United States' },
  { key: 'owner', label: 'Owner', placeholder: 'maya@example.com' },
  { key: 'budget', label: 'Budget', placeholder: '$25,000' },
  { key: 'deadline', label: 'Deadline', placeholder: 'Q3 2026' },
];

/** Side-by-side comparison of `mode="fill"` (3, 3, 1) and `mode="uniform"` (3, 2, 2). */
export function MultiStepFormModes() {
  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row">
      {(['fill', 'uniform'] as const).map((mode) => (
        <div key={mode} className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="text-body-mini-medium text-text-secondary">
            mode=&quot;{mode}&quot;
          </p>
          <MultiStepForm.Root height={380} mode={mode}>
            <MultiStepForm.Header>
              <div className="flex items-center justify-between gap-4">
                <p className="text-body-mini-regular text-text-secondary">Inputs</p>
                <MultiStepForm.Counter />
              </div>
            </MultiStepForm.Header>

            <MultiStepForm.Content>
              {FIELDS.map((field) => (
                <MultiStepForm.Item key={field.key} fieldKey={field.key}>
                  <Input label={field.label} placeholder={field.placeholder} />
                </MultiStepForm.Item>
              ))}
            </MultiStepForm.Content>

            <MultiStepForm.Footer>
              <MultiStepForm.Actions />
            </MultiStepForm.Footer>
          </MultiStepForm.Root>
        </div>
      ))}
    </div>
  );
}

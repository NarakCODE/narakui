'use client';

import { Input } from '@/components/ui/input';
import { MultiStepForm } from '@/components/ui/multi-step-form';

/** A form whose fields fit in one page automatically hides counter, progress, and Back chrome. */
export function MultiStepFormSinglePage() {
  return (
    <div className="w-full max-w-[420px]">
      <MultiStepForm.Root height={320}>
        <MultiStepForm.Header>
          <div className="flex items-center justify-between gap-4">
            <p className="text-body-mini-regular text-text-secondary">
              Fits in one page
            </p>
            <MultiStepForm.Counter />
          </div>
        </MultiStepForm.Header>

        <MultiStepForm.Content>
          <MultiStepForm.Item fieldKey="brand">
            <Input label="Brand" placeholder="Nike" />
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

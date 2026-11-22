'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MultiStepForm, useMultiStepForm } from '@/components/ui/multi-step-form';
import { Textarea } from '@/components/ui/textarea';

function CustomFooter() {
  const { step, stepCount, isFirstStep, isLastStep, isBusy, back, next } =
    useMultiStepForm();

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <span className="text-body-mini-regular text-text-tertiary tabular-nums">
        Page {step + 1} of {stepCount}
      </span>
      <div className="flex items-center gap-2">
        <Button
          mode="ghost"
          size="small"
          disabled={isFirstStep || isBusy}
          onClick={back}
        >
          Previous
        </Button>
        <Button
          mode="primary"
          size="small"
          disabled={isBusy}
          loading={{ isLoading: isBusy }}
          onClick={() => void next()}
        >
          {isLastStep ? 'Run agent' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}

/** Replacing the default footer entirely with `useMultiStepForm()`. */
export function MultiStepFormCustomChrome() {
  return (
    <div className="w-full max-w-[420px]">
      <MultiStepForm.Root
        height={360}
        onSubmit={async () => {
          await new Promise((resolve) => setTimeout(resolve, 400));
        }}
      >
        <MultiStepForm.Header>
          <p className="text-body-mini-regular text-text-secondary">Custom footer</p>
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
          <CustomFooter />
        </MultiStepForm.Footer>
      </MultiStepForm.Root>
    </div>
  );
}

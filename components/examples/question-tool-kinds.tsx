'use client';

import { Composer } from '@/components/ui/composer';
import { QuestionTool } from '@/components/ui/question-tool';

/** Single choice, multi choice, free text, and two-column grid prompts inside a Composer takeover slot. */
export function QuestionToolKinds() {
  return (
    <div className="grid w-full min-w-0 max-w-4xl items-start gap-8 md:grid-cols-2">
      <div className="flex w-full min-w-0 flex-col gap-2">
        <p className="text-body-mini-medium text-text-secondary">Single choice</p>
        <Composer
          scrollControl={null}
          activeSlot={
            <QuestionTool
              variant="composer"
              toolCallId="preview-single"
              questions={[
                {
                  kind: 'single',
                  title: 'Which brand should this agent use?',
                  options: [
                    {
                      id: 'ramp',
                      label: 'Ramp',
                      description: 'Primary monitored brand',
                    },
                    { id: 'brex', label: 'Brex' },
                    { id: 'mercury', label: 'Mercury' },
                  ],
                },
              ]}
              onSubmitAnswer={() => undefined}
            />
          }
        >
          <p className="min-h-5.5 text-body-regular text-text-tertiary">
            Ask a question…
          </p>
        </Composer>
      </div>

      <div className="flex w-full min-w-0 flex-col gap-2">
        <p className="text-body-mini-medium text-text-secondary">Multi choice</p>
        <Composer
          scrollControl={null}
          activeSlot={
            <QuestionTool
              variant="composer"
              toolCallId="preview-multi"
              questions={[
                {
                  kind: 'multi',
                  title: 'Which platforms should we monitor?',
                  options: [
                    { id: 'chatgpt', label: 'ChatGPT' },
                    { id: 'perplexity', label: 'Perplexity' },
                    { id: 'gemini', label: 'Gemini' },
                  ],
                },
              ]}
              onSubmitAnswer={() => undefined}
            />
          }
        >
          <p className="min-h-5.5 text-body-regular text-text-tertiary">
            Ask a question…
          </p>
        </Composer>
      </div>

      <div className="flex w-full min-w-0 flex-col gap-2 md:col-span-2">
        <p className="text-body-mini-medium text-text-secondary">Free text</p>
        <Composer
          scrollControl={null}
          activeSlot={
            <QuestionTool
              variant="composer"
              toolCallId="preview-text"
              questions={[
                {
                  kind: 'text',
                  title: 'What should the agent optimize for?',
                  placeholder: 'e.g. Enterprise comparison pages',
                },
              ]}
              onSubmitAnswer={() => undefined}
            />
          }
        >
          <p className="min-h-5.5 text-body-regular text-text-tertiary">
            Ask a question…
          </p>
        </Composer>
      </div>

      <div className="flex w-full min-w-0 flex-col gap-2 md:col-span-2">
        <p className="text-body-mini-medium text-text-secondary">Two columns</p>
        <Composer
          scrollControl={null}
          activeSlot={
            <QuestionTool
              variant="composer"
              toolCallId="preview-grid"
              questions={[
                {
                  kind: 'multi',
                  title: 'What type of work do you do?',
                  layout: 'grid',
                  options: [
                    { id: 'aeo', label: 'AEO/SEO Marketing' },
                    { id: 'content', label: 'Content Marketing' },
                    { id: 'demand', label: 'Demand Generation' },
                    { id: 'growth', label: 'Growth Marketing' },
                    { id: 'pr', label: 'PR/Communications' },
                    { id: 'pmm', label: 'Product Marketing' },
                  ],
                },
              ]}
              onSubmitAnswer={() => undefined}
            />
          }
        >
          <p className="min-h-5.5 text-body-regular text-text-tertiary">
            Ask a question…
          </p>
        </Composer>
      </div>
    </div>
  );
}

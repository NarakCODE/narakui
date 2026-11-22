'use client';

import { Composer } from '@/components/ui/composer';
import { QuestionTool, type QuestionConfig } from '@/components/ui/question-tool';

const MULTI_STEP_QUESTIONS: QuestionConfig[] = [
  {
    kind: 'single',
    title: 'Which brand should this agent use?',
    options: [
      { id: 'ramp', label: 'Ramp', description: 'Primary monitored brand' },
      { id: 'brex', label: 'Brex' },
      { id: 'mercury', label: 'Mercury' },
    ],
  },
  {
    kind: 'multi',
    title: 'Which platforms should we monitor?',
    options: [
      { id: 'chatgpt', label: 'ChatGPT' },
      { id: 'perplexity', label: 'Perplexity' },
      { id: 'gemini', label: 'Gemini' },
    ],
  },
  {
    kind: 'text',
    title: 'What should the agent optimize for?',
    placeholder: 'e.g. Enterprise comparison pages',
  },
];

/** Multi-step composer prompt, compact promptSlot, inline transcript card, and completed card summary. */
export function QuestionToolStates() {
  return (
    <div className="grid w-full min-w-0 max-w-4xl items-start gap-8 md:grid-cols-2">
      <div className="flex w-full min-w-0 flex-col gap-2">
        <p className="text-body-mini-medium text-text-secondary">Multi-step</p>
        <Composer
          scrollControl={null}
          activeSlot={
            <QuestionTool
              variant="composer"
              toolCallId="preview-multi-step"
              questions={MULTI_STEP_QUESTIONS}
              onSubmitAnswers={() => undefined}
            />
          }
        >
          <p className="min-h-5.5 text-body-regular text-text-tertiary">
            Ask a question…
          </p>
        </Composer>
      </div>

      <div className="flex w-full min-w-0 flex-col gap-2">
        <p className="text-body-mini-medium text-text-secondary">Compact</p>
        <Composer
          layout="compact"
          scrollControl={null}
          promptSlot={
            <QuestionTool
              variant="composer"
              compact
              toolCallId="preview-compact"
              questions={MULTI_STEP_QUESTIONS}
              onSubmitAnswers={() => undefined}
            />
          }
        >
          <p className="min-h-5.5 text-body-regular text-text-tertiary">
            Ask a question…
          </p>
        </Composer>
      </div>

      <div className="flex w-full min-w-0 flex-col gap-2">
        <p className="text-body-mini-medium text-text-secondary">Card</p>
        <QuestionTool
          variant="card"
          toolCallId="preview-card"
          questions={[MULTI_STEP_QUESTIONS[0]]}
          onSubmitAnswer={() => undefined}
        />
      </div>

      <div className="flex w-full min-w-0 flex-col gap-2">
        <p className="text-body-mini-medium text-text-secondary">Completed card</p>
        <QuestionTool
          variant="card"
          answer={{ kind: 'single', selectedIds: ['ramp'] }}
          questions={[
            {
              kind: 'single',
              title: 'Which brand should this agent use?',
              options: [
                { id: 'ramp', label: 'Ramp' },
                { id: 'brex', label: 'Brex' },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}

'use client';

import { Composer } from '@/components/ui/composer';
import { QuestionTool } from '@/components/ui/question-tool';

/** Composer card taken over by an interactive `QuestionTool` via `activeSlot`. */
export const ComposerQuestionTool = () => {
  return (
    <div className="w-full max-w-xl">
      <Composer
        scrollControl={null}
        activeSlot={
          <QuestionTool
            variant="composer"
            toolCallId="preview-question"
            questions={[
              {
                kind: 'single',
                title: 'Which brand should this agent use?',
                options: [
                  { id: 'ramp', label: 'Ramp', description: 'Primary monitored brand' },
                  { id: 'brex', label: 'Brex' },
                  { id: 'mercury', label: 'Mercury' },
                ],
              },
            ]}
            onSubmitAnswer={() => undefined}
          />
        }
      >
        <p className="min-h-5.5 text-body-regular text-text-tertiary">Ask a question…</p>
      </Composer>
    </div>
  );
};

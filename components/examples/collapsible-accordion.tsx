'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Collapsible } from '@/components/ui/collapsible';

const QUESTIONS = [
  {
    title: 'What counts as a citation?',
    answer:
      'A citation is a link an answer engine shows next to its response. We record the domain, URL and position.',
  },
  {
    title: 'How often do prompts run?',
    answer:
      'Every tracked prompt runs daily on each answer engine in your plan, from the regions you selected.',
  },
  {
    title: 'Which answer engines are tracked?',
    answer: 'ChatGPT, Perplexity, Google AI Overviews, Gemini, Claude and Microsoft Copilot.',
  },
];

/** Single-open accordion built from controlled Collapsible.Root instances inside a Card. */
export function AccordionExample() {
  const [openTitle, setOpenTitle] = useState<string | null>(QUESTIONS[0]?.title ?? null);

  return (
    <Card className="w-full max-w-md">
      {QUESTIONS.map((question) => (
        <Collapsible.Root
          key={question.title}
          className="border-b border-fill-quaternary last:border-b-0"
          open={openTitle === question.title}
          onOpenChange={(open) => setOpenTitle(open ? question.title : null)}
        >
          <Collapsible.Trigger
            className="w-full"
            spanClassName="flex w-full items-center gap-2 px-4 py-3 text-left"
            showHoverBackground={false}
          >
            <span className="min-w-0 flex-1 text-body-small-medium text-text-primary">
              {question.title}
            </span>
            <ChevronDown
              aria-hidden="true"
              className="size-4 shrink-0 text-text-secondary transition-transform duration-200 ease-out group-data-[state=open]:rotate-180 motion-reduce:transition-none"
            />
          </Collapsible.Trigger>
          <Collapsible.Content>
            <p className="px-4 pb-4 text-body-small-regular text-text-secondary">
              {question.answer}
            </p>
          </Collapsible.Content>
        </Collapsible.Root>
      ))}
    </Card>
  );
}

'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

const ANSWER_ENGINES = ['ChatGPT', 'Perplexity', 'Google AI Overviews', 'Gemini', 'Claude'];

/** Parent-child select-all checkbox list demonstrating mixed indeterminate state. */
export function CheckboxExample() {
  const [selected, setSelected] = useState<ReadonlySet<string>>(
    () => new Set(['ChatGPT', 'Perplexity']),
  );
  const allSelected = selected.size === ANSWER_ENGINES.length;

  const toggle = (engine: string, checked: boolean) => {
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(engine);
      else next.delete(engine);
      return next;
    });
  };

  return (
    <div className="flex w-full max-w-64 flex-col gap-1">
      <Checkbox
        checked={allSelected}
        indeterminate={selected.size > 0 && !allSelected}
        onCheckedChange={(checked) => setSelected(new Set(checked === true ? ANSWER_ENGINES : []))}
      >
        All answer engines
      </Checkbox>
      <div className="flex flex-col gap-1 pl-5">
        {ANSWER_ENGINES.map((engine) => (
          <Checkbox
            key={engine}
            checked={selected.has(engine)}
            onCheckedChange={(checked) => toggle(engine, checked === true)}
          >
            {engine}
          </Checkbox>
        ))}
      </div>
    </div>
  );
}

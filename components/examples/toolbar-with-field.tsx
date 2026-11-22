'use client';

import { useState } from 'react';
import { Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toolbar } from '@/components/ui/toolbar';

const MIN_SIZE = 8;
const MAX_SIZE = 96;

export function ToolbarWithField() {
  const [size, setSize] = useState(16);
  const [typed, setTyped] = useState<string | null>(null);
  const clamp = (value: number) => Math.min(MAX_SIZE, Math.max(MIN_SIZE, value));
  const commit = () => {
    const value = Number(typed);
    if (typed !== null && Number.isFinite(value) && value > 0) {
      setSize(clamp(Math.round(value)));
    }
    setTyped(null);
  };

  return (
    <Toolbar.Root
      aria-label="Text size"
      className="rounded-lg bg-bg-primary p-1 shadow-medium"
    >
      <Toolbar.Item disabled={size <= MIN_SIZE}>
        <Button
          aria-label="Decrease text size"
          iconStart={<Minus aria-hidden="true" />}
          mode="ghost"
          size="small"
          onClick={() => setSize((current) => clamp(current - 1))}
        />
      </Toolbar.Item>
      <Toolbar.Field>
        <Input
          aria-label="Text size"
          autoComplete="off"
          inputMode="numeric"
          size="micro"
          className="h-7 w-12 rounded-sm border-transparent bg-transparent px-1 text-center tabular-nums shadow-none"
          value={typed ?? String(size)}
          onChange={(event) => setTyped(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commit();
          }}
        />
      </Toolbar.Field>
      <Toolbar.Item disabled={size >= MAX_SIZE}>
        <Button
          aria-label="Increase text size"
          iconStart="plus"
          mode="ghost"
          size="small"
          onClick={() => setSize((current) => clamp(current + 1))}
        />
      </Toolbar.Item>
    </Toolbar.Root>
  );
}

'use client';

import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { CheckIcon, CircleXIcon, CopyIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CopyState = 'idle' | 'done' | 'error';

export interface DocsCopyButtonProps extends Omit<ComponentProps<'button'>, 'onCopy'> {
  /** Text (or lazy getter) copied to clipboard on click. */
  text: string | (() => string);
  /** Optional reset delay in milliseconds. @default 1500 */
  resetAfterMs?: number;
}

/** Compact tactile clipboard button with smooth icon state feedback. */
export function DocsCopyButton({
  text,
  resetAfterMs = 1500,
  className,
  onClick,
  ...props
}: DocsCopyButtonProps) {
  const [state, setState] = useState<CopyState>('idle');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    const value = typeof text === 'function' ? text() : text;
    try {
      await navigator.clipboard.writeText(value);
      setState('done');
    } catch {
      setState('error');
    }

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setState('idle');
      timerRef.current = null;
    }, resetAfterMs);
  };

  return (
    <button
      type="button"
      data-slot="copy-button"
      data-copy-state={state}
      aria-label={state === 'done' ? 'Copied' : state === 'error' ? 'Copy failed' : 'Copy'}
      onClick={(event) => {
        void handleCopy();
        onClick?.(event);
      }}
      className={cn(
        'inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-text-secondary transition-[color,background-color,transform,opacity] duration-150 ease-out hover:bg-control-hover hover:text-text-primary active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-[color,background-color,opacity] motion-reduce:active:scale-100 [&_svg]:size-3.5 [&_svg]:shrink-0',
        className,
      )}
      {...props}
    >
      <span className="relative flex size-4 items-center justify-center">
        <CopyIcon
          aria-hidden="true"
          className={cn(
            'absolute transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none',
            state === 'idle' ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
          )}
        />
        <CheckIcon
          aria-hidden="true"
          className={cn(
            'absolute text-text-primary transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none',
            state === 'done' ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
          )}
        />
        <CircleXIcon
          aria-hidden="true"
          className={cn(
            'absolute text-destructive transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none',
            state === 'error' ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
          )}
        />
      </span>
    </button>
  );
}
